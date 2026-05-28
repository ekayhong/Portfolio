# Déploiement & configuration CI/CD

Ce guide décrit les étapes pour configurer les secrets GitHub et exécuter les workflows CI/CD fournis.

Prérequis
- `gh` (GitHub CLI) installé et connecté
- `az` (Azure CLI) installé et connecté (pour opérations avancées)
- Droits suffisants sur l'abonnement Azure pour créer App Registration et assigner des rôles

1) Protéger les secrets (GitHub Secrets)

- Utilise les scripts fournis pour pousser les secrets dans ton repo (interactive):

  Bash:

  ```bash
  gh auth login
  ./scripts/set-github-secrets.sh
  ```

  PowerShell:

  ```powershell
  gh auth login
  .\scripts\set-github-secrets.ps1
  ```

- Comportement par défaut: les scripts **n'écrasent pas** les secrets déjà présents. Ils les ignorent et te le signalent.
- Pour forcer une mise à jour d'un secret existant:
  - Bash: `FORCE=true ./scripts/set-github-secrets.sh`
  - PowerShell: `.
scripts\set-github-secrets.ps1 -Force`

- Secrets importants à définir:
  - `MONGODB_URI`, `MONGODB_DATABASE`, `MONGODB_COLLECTION`
  - `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `MAIL_FROM`, `MAIL_TO`
  - `ADMIN_API_KEY`
  - `NEXT_PUBLIC_CV_PDF_URL`, `NEXT_PUBLIC_CV_DOCX_URL` (si externes)
  - `AZURE_STATIC_WEB_APPS_API_TOKEN` (token de déploiement Static Web Apps)
  - Optionnel: `COSMOS_ADMIN_PASSWORD` (si la création d'un cluster Cosmos est requise)

- Important pour l'environnement de production Azure Static Web Apps:
  - Les variables server-side doivent aussi être définies comme app settings de la Static Web App.
  - Utilise `az staticwebapp appsettings set` ou les scripts `scripts/set-swa-app-settings.ps1` / `scripts/set-swa-app-settings.sh`.
  - Les settings critiques sont `MONGODB_URI`, `MONGODB_DATABASE`, `MONGODB_COLLECTION`, `SMTP_*`, `MAIL_*`, `ADMIN_API_KEY`, `TURNSTILE_SECRET_KEY`.

2) Activer et tester les workflows

- Infra (Bicep): utilise le workflow `Deploy Infra (Bicep)` accessible dans `.github/workflows/deploy-infra.yml`. Il utilise OIDC (azure/login) pour s'authentifier.

- Application: utilise le workflow `.github/workflows/deploy.yml` pour déployer la Static Web App.

- Pour tester: créer une branche `ci/test`, pousser un commit, ouvrir une PR vers `main` et vérifier les logs des workflows.

4) Conseils sécurité & mise en production

- Ne commite jamais de secrets dans le repo. `.gitignore` contient déjà `infra/bicep/parameters.prod.json` et `.env*`.
- Si un secret a été committé par erreur: le révoquer/rotate immédiatement et nettoyer l'historique git (BFG/git filter-repo).
- Pour production durable, migrer les secrets sensibles (MONGODB_URI) vers Azure Key Vault et utiliser Managed Identity + Key Vault references.

5) Support & dépannage rapide

- Si une étape OIDC échoue: vérifier que la `federated credential` a bien le `Subject` exact correspondant à la workflow (owner/repo/ref).
- Pour afficher les logs d'authentification côté AZ: activer le diagnostic ou exécuter `az account get-access-token` après `azure/login` dans un job de debug.

---
Pour toute aide, colle ici le log d'erreur Github Actions et je t'aide à corriger.
