# sync-to-cas.ps1 — copy BE + FE vào content-automation-short rồi push
# Chạy: PowerShell -ExecutionPolicy Bypass -File sync-to-cas.ps1

$ErrorActionPreference = "Stop"

$DEST = "C:\Users\ADMIN\content-automation-short"
$BE_SRC = "C:\Users\ADMIN\fb-fanpage-api"
$FE_SRC = "C:\Users\ADMIN\content-video"

# Các thư mục/file cần loại trừ khi copy BE
$BE_EXCLUDE = @(
    '__pycache__', '.venv', 'venv', 'env',
    'dist', 'build', '.pytest_cache', '.mypy_cache',
    'node_modules', '*.pyc', '*.pyo', 'app.db', 'downloads'
)

# Các thư mục/file cần loại trừ khi copy FE
$FE_EXCLUDE = @(
    'node_modules', 'dist', 'release',
    'dist-backend', 'temp-cas', '.git'
)

Write-Host "=== Sync BE ===" -ForegroundColor Cyan

# Xóa backend cũ (giữ lại .git nếu có)
if (Test-Path "$DEST\backend") {
    Get-ChildItem "$DEST\backend" -Exclude '.git' | Remove-Item -Recurse -Force
}
New-Item -ItemType Directory -Force -Path "$DEST\backend" | Out-Null

# Copy BE
$robocopyExcludes = $BE_EXCLUDE -join " "
$exFolders = ($BE_EXCLUDE | Where-Object { $_ -notlike '*.*' }) -join " "
$exFiles   = ($BE_EXCLUDE | Where-Object { $_ -like '*.*' }) -join " "

robocopy $BE_SRC "$DEST\backend" /E /XD __pycache__ .venv venv env dist build .pytest_cache .mypy_cache node_modules downloads /XF *.pyc *.pyo app.db /NFL /NDL /NJH /NJS | Out-Null
Write-Host "BE copied OK" -ForegroundColor Green

Write-Host "=== Sync FE ===" -ForegroundColor Cyan

# Xóa frontend cũ
if (Test-Path "$DEST\frontend") {
    Get-ChildItem "$DEST\frontend" -Exclude '.git' | Remove-Item -Recurse -Force
}
New-Item -ItemType Directory -Force -Path "$DEST\frontend" | Out-Null

# Copy FE
robocopy $FE_SRC "$DEST\frontend" /E /XD node_modules dist release dist-backend temp-cas .git /NFL /NDL /NJH /NJS | Out-Null
Write-Host "FE copied OK" -ForegroundColor Green

Write-Host "=== Git commit & push ===" -ForegroundColor Cyan

Set-Location $DEST

git add -A
git commit -m "sync: update backend (fb-fanpage-api) and frontend (content-video)"
git push origin main

Write-Host "=== Done! ===" -ForegroundColor Green
