# AWS Deployment Script for NoReal Beauty Backend (PowerShell)
# This script helps deploy the backend to AWS Elastic Beanstalk

Write-Host "🚀 NoReal Beauty - AWS Backend Deployment Script" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Check if EB CLI is installed
$ebExists = Get-Command eb -ErrorAction SilentlyContinue
if (-not $ebExists) {
    Write-Host "❌ EB CLI is not installed." -ForegroundColor Red
    Write-Host "📦 Install it with: pip install awsebcli --upgrade --user" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ EB CLI is installed" -ForegroundColor Green
Write-Host ""

# Check if this is first time setup
if (-not (Test-Path ".elasticbeanstalk\config.yml")) {
    Write-Host "🔧 First time setup detected" -ForegroundColor Yellow
    Write-Host "Running: eb init" -ForegroundColor Cyan
    Write-Host ""
    eb init
    
    Write-Host ""
    Write-Host "✅ Elastic Beanstalk initialized" -ForegroundColor Green
    Write-Host ""
    Write-Host "📝 Next, create an environment" -ForegroundColor Cyan
    $create = Read-Host "Create environment now? (y/n)"
    
    if ($create -eq 'y' -or $create -eq 'Y') {
        eb create norealbeauty-api-env --single
    } else {
        Write-Host "⚠️  Remember to create environment later with:" -ForegroundColor Yellow
        Write-Host "   eb create norealbeauty-api-env --single"
        exit 0
    }
}

# Collect environment variables
Write-Host "🔑 Setting up environment variables..." -ForegroundColor Cyan
Write-Host ""

if (-not $env:DATABASE_URL) {
    $env:DATABASE_URL = Read-Host "Enter DATABASE_URL (Neon PostgreSQL connection string)"
}

if (-not $env:SESSION_SECRET) {
    $env:SESSION_SECRET = Read-Host "Enter SESSION_SECRET (min 32 characters)"
}

if (-not $env:RESEND_API_KEY) {
    $env:RESEND_API_KEY = Read-Host "Enter RESEND_API_KEY (optional, press Enter to skip)"
}

if (-not $env:FROM_EMAIL) {
    $env:FROM_EMAIL = Read-Host "Enter FROM_EMAIL (optional, default: noreply@norealbeauty.com)"
    if ([string]::IsNullOrWhiteSpace($env:FROM_EMAIL)) {
        $env:FROM_EMAIL = "noreply@norealbeauty.com"
    }
}

# Set environment variables on EB
Write-Host ""
Write-Host "📤 Setting environment variables on AWS..." -ForegroundColor Cyan

$envVars = @(
    "DATABASE_URL=`"$env:DATABASE_URL`""
    "SESSION_SECRET=`"$env:SESSION_SECRET`""
    "NODE_ENV=`"production`""
)

if (![string]::IsNullOrWhiteSpace($env:RESEND_API_KEY)) {
    $envVars += "RESEND_API_KEY=`"$env:RESEND_API_KEY`""
}

$envVars += "FROM_EMAIL=`"$env:FROM_EMAIL`""

if (![string]::IsNullOrWhiteSpace($env:GOOGLE_CLIENT_ID)) {
    $envVars += "GOOGLE_CLIENT_ID=`"$env:GOOGLE_CLIENT_ID`""
}

if (![string]::IsNullOrWhiteSpace($env:GOOGLE_CLIENT_SECRET)) {
    $envVars += "GOOGLE_CLIENT_SECRET=`"$env:GOOGLE_CLIENT_SECRET`""
}

$envVarsString = $envVars -join " "
Invoke-Expression "eb setenv $envVarsString"

Write-Host "✅ Environment variables set" -ForegroundColor Green
Write-Host ""

# Build the application
Write-Host "🔨 Building application..." -ForegroundColor Cyan
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build completed" -ForegroundColor Green
Write-Host ""

# Deploy to EB
Write-Host "🚀 Deploying to AWS Elastic Beanstalk..." -ForegroundColor Cyan
eb deploy

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Deployment successful!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📊 Getting deployment info..." -ForegroundColor Cyan
    eb status
    Write-Host ""
    Write-Host "💡 Useful commands:" -ForegroundColor Yellow
    Write-Host "   eb status  - Check deployment status"
    Write-Host "   eb logs    - View application logs"
    Write-Host "   eb open    - Open app in browser"
} else {
    Write-Host ""
    Write-Host "❌ Deployment failed" -ForegroundColor Red
    Write-Host "📋 Check logs with: eb logs" -ForegroundColor Yellow
    exit 1
}
