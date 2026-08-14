# Cryptora Frontend - Installation Script

Write-Host "🚀 Installing Cryptora Frontend..." -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js detected: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed!" -ForegroundColor Red
    Write-Host "   Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Check if npm is installed
try {
    $npmVersion = npm --version
    Write-Host "✅ npm detected: v$npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm is not installed!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📦 Installing dependencies..." -ForegroundColor Cyan
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Installation successful!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🎯 Next steps:" -ForegroundColor Cyan
    Write-Host "   1. Make sure backend is running: cd ..\backend && python run.py" -ForegroundColor White
    Write-Host "   2. Start frontend: npm run dev" -ForegroundColor White
    Write-Host "   3. Open browser: http://localhost:5173" -ForegroundColor White
    Write-Host ""
    Write-Host "📚 For more info, see README.md and SETUP.md" -ForegroundColor Yellow
} else {
    Write-Host ""
    Write-Host "❌ Installation failed!" -ForegroundColor Red
    Write-Host "   Please check the error messages above and try again." -ForegroundColor Yellow
}
