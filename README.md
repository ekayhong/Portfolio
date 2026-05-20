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
