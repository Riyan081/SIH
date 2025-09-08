# Simple development startup script for SafeEd
# Opens two PowerShell terminals - one for backend, one for frontend

Write-Host "🚀 Starting SafeEd Development Environment..." -ForegroundColor Green

# Get script directory
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# Start backend in new PowerShell window
$backendCmd = "cd '$scriptDir\backend'; Write-Host '🔧 Backend Server Starting...' -ForegroundColor Green; npm run dev"
Start-Process powershell -ArgumentList '-NoExit', '-Command', $backendCmd

# Wait a moment
Start-Sleep -Seconds 2

# Start frontend in new PowerShell window
$frontendCmd = "cd '$scriptDir'; Write-Host '⚛️ Frontend Server Starting...' -ForegroundColor Blue; npm run dev"
Start-Process powershell -ArgumentList '-NoExit', '-Command', $frontendCmd

Write-Host ""
Write-Host "✅ Development servers are starting..." -ForegroundColor Green
Write-Host "🔗 Backend:  http://localhost:5000" -ForegroundColor Yellow
Write-Host "🔗 Frontend: http://localhost:5173" -ForegroundColor Yellow
Write-Host ""
Write-Host "💡 Two new PowerShell windows should have opened." -ForegroundColor Cyan
Write-Host "   Close those windows to stop the servers." -ForegroundColor Cyan
