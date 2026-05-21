#!/usr/bin/env bash
# Usage: export values or run interactively. Requires GitHub CLI `gh` authenticated.
set -euo pipefail

REPO="${1:-$(gh repo view --json nameWithOwner -q .nameWithOwner)}"
FORCE="${FORCE:-false}"
echo "Setting secrets for repo: $REPO"

EXISTING_SECRETS="$(gh secret list --repo "$REPO" --json name -q '.[].name' 2>/dev/null || true)"

set_secret(){
  name="$1"; value="$2"
  if [ -z "$value" ]; then
    echo "Skipping $name (empty)"
    return
  fi
  if [ "$FORCE" != "true" ] && printf '%s
' "$EXISTING_SECRETS" | grep -Fxq "$name"; then
    echo "Skipping $name (already exists; set FORCE=true to overwrite)"
    return
  fi
  echo "Setting $name"
  echo -n "$value" | gh secret set "$name" --repo "$REPO"
}

# Read from env or prompt
read_or_env(){
  name="$1"; var="${!name}";
  if [ -z "$var" ]; then
    read -rp "Enter value for $name (leave empty to skip): " var
  fi
  echo "$var"
}

set_secret MONGODB_URI "$(read_or_env MONGODB_URI)"
set_secret MONGODB_DATABASE "$(read_or_env MONGODB_DATABASE)"
set_secret MONGODB_COLLECTION "$(read_or_env MONGODB_COLLECTION)"

set_secret SMTP_HOST "$(read_or_env SMTP_HOST)"
set_secret SMTP_PORT "$(read_or_env SMTP_PORT)"
set_secret SMTP_SECURE "$(read_or_env SMTP_SECURE)"
set_secret SMTP_USER "$(read_or_env SMTP_USER)"
set_secret SMTP_PASS "$(read_or_env SMTP_PASS)"
set_secret MAIL_FROM "$(read_or_env MAIL_FROM)"
set_secret MAIL_TO "$(read_or_env MAIL_TO)"

set_secret ADMIN_API_KEY "$(read_or_env ADMIN_API_KEY)"

set_secret NEXT_PUBLIC_CV_PDF_URL "$(read_or_env NEXT_PUBLIC_CV_PDF_URL)"
set_secret NEXT_PUBLIC_CV_DOCX_URL "$(read_or_env NEXT_PUBLIC_CV_DOCX_URL)"
set_secret NEXT_PUBLIC_TURNSTILE_SITE_KEY "$(read_or_env NEXT_PUBLIC_TURNSTILE_SITE_KEY)"
set_secret TURNSTILE_SECRET_KEY "$(read_or_env TURNSTILE_SECRET_KEY)"

# Azure / OIDC related
set_secret AZURE_CLIENT_ID "$(read_or_env AZURE_CLIENT_ID)"
set_secret AZURE_TENANT_ID "$(read_or_env AZURE_TENANT_ID)"
set_secret AZURE_SUBSCRIPTION_ID "$(read_or_env AZURE_SUBSCRIPTION_ID)"

# Optional infra secret
set_secret COSMOS_ADMIN_PASSWORD "$(read_or_env COSMOS_ADMIN_PASSWORD)"

echo "Done. Verify secrets in GitHub repo settings."
