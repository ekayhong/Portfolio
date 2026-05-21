 # Portfolio + Reservation

 Site personnel (CV + réservation d'entretien) avec backend serverless.

 ## Fonctionnalités

 - Présentation du profil
 - CV téléchargeable
 - Affichage des disponibilités
 - Réservation d'entretien (envoi d'e-mails SMTP)

 ## Architecture et principes

 Le projet suit les principes de la Clean Architecture / Hexagonal (Ports & Adapters) :

 - `src/core/domain` : entités et contrats (interfaces)
 - `src/core/application` : use-cases (logique métier)
 - `src/core/infrastructure` : adaptateurs (base de données, SMTP, configuration)
 - `src/core/infrastructure/di` : assemblage des dépendances (container DI)
 - `src/app` et `src/components` : couche Next.js / UI

 Les use-cases sont découplés des implémentations concrètes via des ports (`SlotRepository`, `Mailer`), ce qui facilite le remplacement d'implémentations.

 ## Stack technique

 - Framework front / app : Next.js (app router)
 - Langage : TypeScript
 - Runtime : Node.js
 - Base de données : Azure Cosmos DB (MongoDB API) — accès via le driver `mongodb`
 - Envoi d'e-mails : `nodemailer` (SmtpMailer)
 - Validation runtime : `zod` pour les schémas d'entrée des use-cases
 - Architecture : Clean Architecture / Ports & Adapters
 - DI : container maison dans `src/core/infrastructure/di/container.ts`
 - Hébergement : Azure Static Web Apps (frontend) + Azure Cosmos DB

 ## Setup local

 1. Copier `.env.example` vers `.env.local`
 2. Remplir les variables (voir `src/core/infrastructure/config/env.ts`)
 3. Installer :

```bash
npm install
```

4. Lancer en dev :

```bash
npm run dev

## Variables d'environnement importantes

Quelques variables à connaître et à configurer avant le déploiement :

- `NEXT_PUBLIC_TURNSTILE_SITE_KEY` : clé publique Cloudflare Turnstile (exposée au client) pour afficher le widget anti‑bot.
- `TURNSTILE_SECRET_KEY` : clé privée Turnstile (secret côté serveur) pour vérifier les tokens envoyés par le client. Ne pas committer.
- **Utilité** : protège les formulaires publics (contact, réservation) contre les soumissions automatisées et le spam en demandant une preuve côté client. Turnstile est léger et respecte la vie privée comparé à certains CAPTCHA, et nécessite une validation côté serveur via `TURNSTILE_SECRET_KEY`.
- `NEXT_PUBLIC_CV_PDF_URL` / `NEXT_PUBLIC_CV_DOCX_URL` : URL ou chemin relatif vers les fichiers CV (par ex. `/cv/Eric-Kay-Hong-CV.pdf` si les fichiers sont dans `public/cv/`).
- `ADMIN_API_KEY` : clé secrète utilisée pour protéger les endpoints d'administration (ex. `PUT /api/admin/slots`). Génère une valeur forte et stocke‑la dans GitHub Secrets / Azure Key Vault.

Astuce : pour dev local, copier `.env.example` → `.env.local` et renseigner ces valeurs. Pour la CI/CD, ajoute les valeurs sensibles dans les GitHub Secrets (voir `docs/DEPLOY.md`).

```

 ## Endpoints importants

 - `GET /api/slots` : liste des créneaux disponibles
 - `POST /api/bookings` : création d'une réservation
 - `PUT /api/admin/slots` : mise à jour des créneaux (header `x-admin-api-key`)

 ## Notes déploiement / Azure

 - Hébergement front : Azure Static Web Apps
 - Données : Azure Cosmos DB (MongoDB API)
 - Assurez-vous de renseigner les variables d'environnement dans la configuration de la ressource Static Web Apps
 - Le workflow `/.github/workflows/deploy.yml` déploie l'application (vérifier qu'il exécute les vérifications souhaitées avant déploiement)

## Cosmos DB : réutilisation du cluster existant

### Pourquoi cette solution a été retenue

- **Coût minimal** : le cluster Cosmos DB for MongoDB (vCore) gratuit est limité (en pratique 1 cluster Free par subscription).
- **Simplicité opérationnelle** : éviter de multiplier les clusters pour un site CV à faible trafic.
- **Approche architecture pragmatique** : isolation logique par base/collection/utilisateur applicatif, tout en réutilisant une ressource déjà opérée.

### Fonctionnement actuel (Bicep)

- Le mode par défaut est la **réutilisation d'un cluster existant**, même s'il est dans un autre Resource Group.
- Paramètres concernés dans `infra/bicep/main.bicep` et `infra/bicep/parameters.json` :
	- `useExistingCosmos = true`
	- `existingCosmosResourceGroupName`
	- `existingCosmosClusterName`
- Dans ce mode, le module `infra/bicep/modules/cosmos.bicep` n'est pas appelé pour créer un nouveau cluster.

### Tableau comparatif : cluster existant vs nouveau cluster

| Critère | Réutiliser cluster existant | Créer un cluster dans le RG du projet |
|---|---|---|
| Coût | Le plus bas (aucune nouvelle instance) | Peut augmenter (Free tier possiblement déjà utilisé) |
| Isolation infrastructure | Logique (DB/collection/utilisateur) | Physique (ressource dédiée projet) |
| Complexité opérationnelle | Faible | Plus élevée |
| Paramètre clé | `useExistingCosmos=true` | `useExistingCosmos=false` |
| Paramètres requis | `existingCosmosResourceGroupName`, `existingCosmosClusterName` | `cosmosAdminPassword`, `cosmosAdminUsername` |
| Cas recommandé ici | Oui (site CV, trafic faible) | Seulement si besoin d'isolation forte |

### Si vous voulez créer un cluster Cosmos dans le RG du projet

Modifier les paramètres de déploiement :

- Passer `useExistingCosmos` à `false`
- Fournir `cosmosAdminPassword` (secret)
- Garder `cosmosAdminUsername` (ou le personnaliser)
- Les champs `existingCosmosResourceGroupName` et `existingCosmosClusterName` deviennent inutiles dans ce mode

Exemple de commande (création d'un nouveau cluster) :

```bash
az deployment sub create \
	--location francecentral \
	--template-file infra/bicep/main.bicep \
	--parameters @infra/bicep/parameters.prod.json \
	--parameters useExistingCosmos=false cosmosAdminPassword="<MOT_DE_PASSE_FORT>"
```

Recommandation sécurité : ne jamais committer le mot de passe admin Cosmos dans Git. Injecter ce secret via GitHub Secrets / Azure Key Vault / variables pipeline.

 ## Remarques et choix effectués

 - L'accès à Cosmos DB se fait via l'API Mongo (utilisation du driver `mongodb`) — l'implémentation `CosmosSlotRepository` est fournie.
 - Le container DI assemble les use-cases et adaptateurs depuis `src/core/infrastructure/di/container.ts`.

 Si tu veux, je peux : supprimer les fichiers redondants restants (déjà effectué), ajouter une validation stricte des variables d'environnement, ou documenter les variables `.env` requises.

## Cron / tâches planifiées

Le projet exécute une tâche planifiée pour générer les créneaux (`generate-slots`) via GitHub Actions. Voici l'utilité, le fonctionnement et les points de sécurité à connaître :

- **Utilité** : automatiser la génération mensuelle (ou périodique) des créneaux disponibles sans intervention manuelle. Permet de pré-remplir ou recalculer les disponibilités via l'endpoint dédié.
- **Où s'exécute** : la planification est effectuée par GitHub Actions, fichier `.github/workflows/cron-slots.yml`. Ce n'est pas un scheduler Azure — c'est un job qui tourne sur les runners GitHub.
- **Quand** : l'expression `cron: "0 6 15 * *"` dans le workflow signifie "à 06:00 UTC le 15 de chaque mois". GitHub Actions utilise l'heure UTC et l'exécution peut avoir quelques minutes de marge.
- **Comment** : le job fait un `curl` vers l'URL publique de l'app :`${{ secrets.APP_URL }}/api/cron/generate-slots` en ajoutant l'en-tête `x-admin-api-key: ${{ secrets.ADMIN_API_KEY }}`. Le endpoint doit être accessible publiquement et vérifier la clé.
- **Sécurité** :
	- `secrets.APP_URL` et `secrets.ADMIN_API_KEY` doivent être configurés dans les Secrets du repo GitHub.
	- L'endpoint doit valider `x-admin-api-key` et être idempotent (ne pas créer de doublons).
	- Si vous préférez éviter une route publique, envisagez d'ajouter une vérification IP ou un mécanisme d'authentification plus robuste.
- **Déclenchement manuel** : `workflow_dispatch` est activé dans le workflow — tu peux lancer la job manuellement depuis l'onglet Actions du repo ou via l'API GitHub.
- **Alternatives** : si tu veux externaliser le scheduler chez Azure (par exemple pour centraliser dans l'infra Azure), tu peux utiliser :
	- Azure Functions Timer Trigger (exécution côté Azure), ou
	- Azure Logic Apps / Azure Automation.

**Check-list avant production** :
- Vérifier que `src/app/api/cron/generate-slots/route.ts` existe et est protégé.
- S'assurer que la clé `ADMIN_API_KEY` est suffisamment aléatoire et stockée en secret.
- Rendre la route idempotente et ajouter logs pour tracer les exécutions (succès/échec).

Si tu veux, je peux convertir ce workflow en un Timer Trigger Azure ou ajouter un exemple de vérification d'idempotence pour l'endpoint.

## IA et productivité

Le projet bénéficie d'outils d'assistance pour accélérer le développement et la maintenance :

- **GitHub Copilot** : complétions et suggestions de code pour gagner du temps tout en gardant une relecture humaine.
- **Amazon Q** : utilisé comme assistant de recherche / question-réponse pour retrouver rapidement des informations et documentations.

Ces outils sont employés pour la productivité ; le code livré est revu et validé manuellement.
