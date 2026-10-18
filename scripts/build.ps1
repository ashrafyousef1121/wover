$ErrorActionPreference = 'Stop'
Set-Location (Join-Path $PSScriptRoot '..')
npm run build
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
