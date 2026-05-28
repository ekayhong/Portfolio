Param(
    [string]$Name = $(if ($env:SWA_NAME) { $env:SWA_NAME } else { Read-Host "Enter the Static Web App name" }),
    [string]$ResourceGroup = $(Get-Item -Path env:AZURE_RESOURCE_GROUP -ErrorAction SilentlyContinue).Value,
    [switch]$Production
)

function Read-OrEnv($name) {
    $val = (Get-Item -Path env:$name -ErrorAction SilentlyContinue).Value
    if ([string]::IsNullOrEmpty($val)) {
        $val = Read-Host "Enter value for $name (leave empty to skip)"
    }
    return $val
}

$settings = @{}

foreach ($name in @(
    "MONGODB_URI",
    "MONGODB_DATABASE",
    "MONGODB_COLLECTION",
    "SMTP_HOST",
    "SMTP_PORT",
    "SMTP_SECURE",
    "SMTP_USER",
    "SMTP_PASS",
    "MAIL_FROM",
    "MAIL_TO",
    "ADMIN_API_KEY",
    "TURNSTILE_SECRET_KEY",
    "NEXT_PUBLIC_CV_PDF_URL",
    "NEXT_PUBLIC_CV_DOCX_URL",
    "NEXT_PUBLIC_TURNSTILE_SITE_KEY"
)) {
    $value = Read-OrEnv $name
    if (-not [string]::IsNullOrEmpty($value)) {
        $settings[$name] = $value
    }
}

if ($settings.Count -eq 0) {
    Write-Host "No settings to update."
    exit 0
}

$args = @("staticwebapp", "appsettings", "set", "--name", $Name)
if (-not [string]::IsNullOrEmpty($ResourceGroup)) {
    $args += @("--resource-group", $ResourceGroup)
}

if ($Production) {
    $args += @("--environment-name", "production")
}

$args += "--setting-names"
foreach ($entry in $settings.GetEnumerator()) {
    $args += "$($entry.Key)=$($entry.Value)"
}

Write-Host "Updating app settings for $Name"
az @args
