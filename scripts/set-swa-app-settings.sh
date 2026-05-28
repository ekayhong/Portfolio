#!/usr/bin/env bash
set -euo pipefail

NAME="${SWA_NAME:-}"
RESOURCE_GROUP="${AZURE_RESOURCE_GROUP:-}"
ENVIRONMENT_NAME="${SWA_ENVIRONMENT_NAME:-}"

if [ -z "$NAME" ]; then
  read -rp "Enter the Static Web App name: " NAME
fi

read_or_env() {
  local name="$1"
  local value="${!name:-}"
  if [ -z "$value" ]; then
    read -rp "Enter value for $name (leave empty to skip): " value
  fi
  printf '%s' "$value"
}

settings=()
for name in \
  MONGODB_URI \
  MONGODB_DATABASE \
  MONGODB_COLLECTION \
  SMTP_HOST \
  SMTP_PORT \
  SMTP_SECURE \
  SMTP_USER \
  SMTP_PASS \
  MAIL_FROM \
  MAIL_TO \
  ADMIN_API_KEY \
  TURNSTILE_SECRET_KEY \
  NEXT_PUBLIC_CV_PDF_URL \
  NEXT_PUBLIC_CV_DOCX_URL \
  NEXT_PUBLIC_TURNSTILE_SITE_KEY
do
  value="$(read_or_env "$name")"
  if [ -n "$value" ]; then
    settings+=("$name=$value")
  fi
done

if [ ${#settings[@]} -eq 0 ]; then
  echo "No settings to update."
  exit 0
fi

args=(staticwebapp appsettings set --name "$NAME")
if [ -n "$RESOURCE_GROUP" ]; then
  args+=(--resource-group "$RESOURCE_GROUP")
fi
if [ -n "$ENVIRONMENT_NAME" ]; then
  args+=(--environment-name "$ENVIRONMENT_NAME")
fi
args+=(--setting-names "${settings[@]}")

echo "Updating app settings for $NAME"
az "${args[@]}"
