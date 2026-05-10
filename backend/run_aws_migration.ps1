# PowerShell script to run Alembic migrations on AWS RDS
# Usage: .\run_aws_migration.ps1

Write-Host "🔄 Running database migrations on AWS RDS..." -ForegroundColor Cyan

# Prompt for RDS details
$RDS_ENDPOINT = Read-Host "Enter your RDS endpoint (e.g., cryptora-db.xxxxx.ap-south-1.rds.amazonaws.com)"
$RDS_PASSWORD = Read-Host "Enter your RDS master password" -AsSecureString
$RDS_PASSWORD_PLAIN = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($RDS_PASSWORD))

# Set DATABASE_URL environment variable
$env:DATABASE_URL = "postgresql://postgres:$RDS_PASSWORD_PLAIN@$RDS_ENDPOINT:5432/cryptora"

Write-Host "📊 Connecting to: $RDS_ENDPOINT" -ForegroundColor Yellow

# Check if alembic is installed
try {
    $alembicVersion = alembic --version
    Write-Host "✅ Alembic found: $alembicVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Alembic not found. Installing..." -ForegroundColor Red
    pip install alembic
}

# Run migrations
Write-Host "🚀 Running migrations..." -ForegroundColor Cyan
alembic upgrade head

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Migrations completed successfully!" -ForegroundColor Green
    Write-Host "🎉 Your database is now ready!" -ForegroundColor Green
} else {
    Write-Host "❌ Migration failed. Check the error above." -ForegroundColor Red
    Write-Host "Common issues:" -ForegroundColor Yellow
    Write-Host "  1. RDS security group doesn't allow your IP" -ForegroundColor Yellow
    Write-Host "  2. Wrong password or endpoint" -ForegroundColor Yellow
    Write-Host "  3. Database 'cryptora' doesn't exist (create it first)" -ForegroundColor Yellow
}

# Clear sensitive data
$env:DATABASE_URL = ""
$RDS_PASSWORD_PLAIN = ""
