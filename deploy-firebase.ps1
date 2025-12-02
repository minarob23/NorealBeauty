# Firebase Frontend Deployment Script
# Deploys the frontend to Firebase Hosting

Write-Host "🚀 NoReal Beauty - Firebase Frontend Deployment" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host ""

# Check if Firebase CLI is installed
$firebaseExists = Get-Command firebase -ErrorAction SilentlyContinue
if (-not $firebaseExists) {
    Write-Host "❌ Firebase CLI is not installed." -ForegroundColor Red
    Write-Host "📦 Install it with: npm install -g firebase-tools" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Firebase CLI is installed" -ForegroundColor Green
Write-Host ""

# Check login status
Write-Host "🔐 Checking Firebase login status..." -ForegroundColor Cyan
firebase login:ci

if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Not logged in to Firebase" -ForegroundColor Yellow
    Write-Host "Running: firebase login" -ForegroundColor Cyan
    firebase login
}

Write-Host "✅ Logged in to Firebase" -ForegroundColor Green
Write-Host ""

# Check if .env.production exists
if (-not (Test-Path ".env.production")) {
    Write-Host "⚠️  .env.production not found" -ForegroundColor Yellow
    Write-Host ""
    $backendUrl = Read-Host "Enter your AWS backend URL (e.g., https://your-app.elasticbeanstalk.com)"
    
    $envContent = @"
# Production Environment Configuration
VITE_API_URL=$backendUrl
NODE_ENV=production
"@
    
    $envContent | Out-File -FilePath ".env.production" -Encoding utf8
    Write-Host "✅ Created .env.production" -ForegroundColor Green
    Write-Host ""
}

# Show current configuration
Write-Host "📋 Current Configuration:" -ForegroundColor Cyan
Get-Content ".env.production"
Write-Host ""

$proceed = Read-Host "Proceed with this configuration? (y/n)"
if ($proceed -ne 'y' -and $proceed -ne 'Y') {
    Write-Host "❌ Deployment cancelled" -ForegroundColor Yellow
    Write-Host "Update .env.production and run again" -ForegroundColor Yellow
    exit 0
}

# Build the frontend
Write-Host ""
Write-Host "🔨 Building frontend..." -ForegroundColor Cyan
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build completed" -ForegroundColor Green
Write-Host ""

# Check build output
if (-not (Test-Path "dist\public\index.html")) {
    Write-Host "❌ Build output not found at dist\public" -ForegroundColor Red
    Write-Host "Expected: dist\public\index.html" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build output verified" -ForegroundColor Green
Write-Host ""

# Deploy to Firebase
Write-Host "🚀 Deploying to Firebase Hosting..." -ForegroundColor Cyan
firebase deploy --only hosting

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Deployment successful!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🌐 Your app is live!" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "💡 Useful commands:" -ForegroundColor Yellow
    Write-Host "   firebase hosting:channel:list  - List hosting channels"
    Write-Host "   firebase hosting:clone         - Clone to preview channel"
    Write-Host ""
    
    # Get project info
    firebase projects:list
} else {
    Write-Host ""
    Write-Host "❌ Deployment failed" -ForegroundColor Red
    Write-Host "💡 Check firebase-debug.log for details" -ForegroundColor Yellow
    exit 1
}
