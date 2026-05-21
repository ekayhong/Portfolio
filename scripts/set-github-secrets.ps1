Param(
    [string]$Repo = $(gh repo view --json nameWithOwner -q .nameWithOwner),
    [switch]$Force
)

$ExistingSecrets = @{}
try {
    $names = gh secret list --repo $Repo --json name -q '.[].name' 2>$null
    foreach ($name in $names) {
        $ExistingSecrets[$name] = $true
    }
} catch {
    Write-Host "Warning: unable to query existing secrets for $Repo. Continuing without pre-check."
}

function Set-Secret($name, $value) {
    if ([string]::IsNullOrEmpty($value)) {
        Write-Host "Skipping $name (empty)"
        return
    }
    if (-not $Force -and $ExistingSecrets.ContainsKey($name)) {
        Write-Host "Skipping $name (already exists; use -Force to overwrite)"
        return
    }
    Write-Host "Setting $name"
    $value | gh secret set $name --repo $Repo
}

function Read-OrEnv($name) {
    $val = (Get-Item -Path env:$name -ErrorAction SilentlyContinue).Value
    if ([string]::IsNullOrEmpty($val)) {
        $val = Read-Host "Enter value for $name (leave empty to skip)"
    }
    return $val
}

Set-Secret MONGODB_URI (Read-OrEnv MONGODB_URI)
Set-Secret MONGODB_DATABASE (Read-OrEnv MONGODB_DATABASE)
Set-Secret MONGODB_COLLECTION (Read-OrEnv MONGODB_COLLECTION)

Set-Secret SMTP_HOST (Read-OrEnv SMTP_HOST)
Set-Secret SMTP_PORT (Read-OrEnv SMTP_PORT)
Set-Secret SMTP_SECURE (Read-OrEnv SMTP_SECURE)
Set-Secret SMTP_USER (Read-OrEnv SMTP_USER)
Set-Secret SMTP_PASS (Read-OrEnv SMTP_PASS)
Set-Secret MAIL_FROM (Read-OrEnv MAIL_FROM)
Set-Secret MAIL_TO (Read-OrEnv MAIL_TO)

Set-Secret ADMIN_API_KEY (Read-OrEnv ADMIN_API_KEY)

Set-Secret NEXT_PUBLIC_CV_PDF_URL (Read-OrEnv NEXT_PUBLIC_CV_PDF_URL)
Set-Secret NEXT_PUBLIC_CV_DOCX_URL (Read-OrEnv NEXT_PUBLIC_CV_DOCX_URL)
Set-Secret NEXT_PUBLIC_TURNSTILE_SITE_KEY (Read-OrEnv NEXT_PUBLIC_TURNSTILE_SITE_KEY)
Set-Secret TURNSTILE_SECRET_KEY (Read-OrEnv TURNSTILE_SECRET_KEY)

Set-Secret AZURE_CLIENT_ID (Read-OrEnv AZURE_CLIENT_ID)
Set-Secret AZURE_TENANT_ID (Read-OrEnv AZURE_TENANT_ID)
Set-Secret AZURE_SUBSCRIPTION_ID (Read-OrEnv AZURE_SUBSCRIPTION_ID)

Set-Secret COSMOS_ADMIN_PASSWORD (Read-OrEnv COSMOS_ADMIN_PASSWORD)

Write-Host "Done. Verify secrets in GitHub repo settings."
