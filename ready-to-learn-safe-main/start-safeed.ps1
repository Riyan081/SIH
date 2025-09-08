# SafeEd Startup Script
# This script starts both the backend API server and frontend development server

Write-Host "🚀 Starting SafeEd - Disaster Preparedness Education System" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed. Please install Node.js from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Check if npm is installed
try {
    $npmVersion = npm --version
    Write-Host "✅ npm version: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm is not installed. Please install Node.js which includes npm." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🔧 Setting up applications..." -ForegroundColor Yellow

# Get the current directory
$rootDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendDir = Join-Path $rootDir "backend"
$frontendDir = $rootDir

Write-Host "📁 Root directory: $rootDir" -ForegroundColor Cyan
Write-Host "📁 Backend directory: $backendDir" -ForegroundColor Cyan
Write-Host "📁 Frontend directory: $frontendDir" -ForegroundColor Cyan

# Check if directories exist
if (-not (Test-Path $backendDir)) {
    Write-Host "❌ Backend directory not found: $backendDir" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $frontendDir\package.json)) {
    Write-Host "❌ Frontend package.json not found in: $frontendDir" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow

# Install backend dependencies
Write-Host "Installing backend dependencies..." -ForegroundColor Cyan
Set-Location $backendDir
if (-not (Test-Path "node_modules")) {
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install backend dependencies" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "✅ Backend dependencies already installed" -ForegroundColor Green
}

# Install frontend dependencies
Write-Host "Installing frontend dependencies..." -ForegroundColor Cyan
Set-Location $frontendDir
if (-not (Test-Path "node_modules")) {
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install frontend dependencies" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "✅ Frontend dependencies already installed" -ForegroundColor Green
}

Write-Host ""
Write-Host "🌐 Starting applications..." -ForegroundColor Yellow

# Function to start backend
$backendJob = Start-Job -ScriptBlock {
    param($backendPath)
    Set-Location $backendPath
    npm run dev
} -ArgumentList $backendDir

# Function to start frontend  
$frontendJob = Start-Job -ScriptBlock {
    param($frontendPath)
    Set-Location $frontendPath
    npm run dev
} -ArgumentList $frontendDir

Write-Host "⏳ Starting backend server..." -ForegroundColor Cyan
Start-Sleep -Seconds 3

Write-Host "⏳ Starting frontend server..." -ForegroundColor Cyan
Start-Sleep -Seconds 3

Write-Host ""
Write-Host "🎉 Applications are starting up!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host "🔗 Backend API:  http://localhost:5000" -ForegroundColor Yellow
Write-Host "🔗 Frontend App: http://localhost:5173" -ForegroundColor Yellow
Write-Host "📚 API Docs:     http://localhost:5000/api" -ForegroundColor Yellow
Write-Host "🏥 Health Check: http://localhost:5000/health" -ForegroundColor Yellow
Write-Host "================================================" -ForegroundColor Green
Write-Host ""
Write-Host "💡 Tips:" -ForegroundColor Cyan
Write-Host "   • Press Ctrl+C to stop both servers" -ForegroundColor White
Write-Host "   • Make sure MongoDB is running on your system" -ForegroundColor White
Write-Host "   • Check the backend/.env file for configuration" -ForegroundColor White
Write-Host ""
Write-Host "📊 Monitoring jobs..." -ForegroundColor Yellow

# Monitor both jobs
try {
    while ($true) {
        $backendState = Get-Job -Id $backendJob.Id
        $frontendState = Get-Job -Id $frontendJob.Id
        
        if ($backendState.State -eq "Failed") {
            Write-Host "❌ Backend server failed!" -ForegroundColor Red
            Receive-Job -Id $backendJob.Id
            break
        }
        
        if ($frontendState.State -eq "Failed") {
            Write-Host "❌ Frontend server failed!" -ForegroundColor Red
            Receive-Job -Id $frontendJob.Id
            break
        }
        
        Start-Sleep -Seconds 2
    }
} catch {
    Write-Host "🛑 Stopping applications..." -ForegroundColor Yellow
} finally {
    # Cleanup jobs
    Stop-Job -Id $backendJob.Id -ErrorAction SilentlyContinue
    Stop-Job -Id $frontendJob.Id -ErrorAction SilentlyContinue
    Remove-Job -Id $backendJob.Id -ErrorAction SilentlyContinue
    Remove-Job -Id $frontendJob.Id -ErrorAction SilentlyContinue
    Write-Host "✅ Applications stopped." -ForegroundColor Green
}
