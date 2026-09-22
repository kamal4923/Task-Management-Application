# TaskMaster PowerShell Setup & Launcher Script
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "🚀 TaskMaster - Full-Stack Application Setup" -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Cyan

Set-Location -Path $PSScriptRoot

Write-Host "`n1. Opening Project in VS Code..." -ForegroundColor Yellow
code .

Write-Host "`n2. Installing Dependencies if needed..." -ForegroundColor Yellow
npm run install-all

Write-Host "`n3. Launching Full-Stack Application (Server + Client)..." -ForegroundColor Green
Write-Host "Server: http://localhost:5000" -ForegroundColor Cyan
Write-Host "Client: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop the servers at any time.`n" -ForegroundColor Gray

npm run dev
