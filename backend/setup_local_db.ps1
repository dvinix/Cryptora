# PowerShell script to setup local database for Cryptora

Write-Host "🚀 Cryptora Local Database Setup" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# Check if PostgreSQL is installed
Write-Host "Checking PostgreSQL installation..." -ForegroundColor Yellow
$pgVersion = psql --version 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ PostgreSQL is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install PostgreSQL from: https://www.postgresql.org/download/" -ForegroundColor Yellow
    exit 1
}
Write-Host "✅ PostgreSQL found: $pgVersion" -ForegroundColor Green
Write-Host ""

# Get database credentials
Write-Host "Enter PostgreSQL credentials:" -ForegroundColor Yellow
$dbUser = Read-Host "Username (default: postgres)"
if ([string]::IsNullOrWhiteSpace($dbUser)) { $dbUser = "postgres" }

$dbPassword = Read-Host "Password" -AsSecureString
$dbPasswordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
    [Runtime.InteropServices.Marshal]::SecureStringToBSTR($dbPassword)
)

$dbName = Read-Host "Database name (default: cryptora)"
if ([string]::IsNullOrWhiteSpace($dbName)) { $dbName = "cryptora" }

Write-Host ""

# Set environment variable for psql
$env:PGPASSWORD = $dbPasswordPlain

# Check if database exists
Write-Host "Checking if database exists..." -ForegroundColor Yellow
$dbExists = psql -U $dbUser -lqt 2>$null | Select-String -Pattern "\s$dbName\s"

if ($dbExists) {
    Write-Host "⚠️  Database '$dbName' already exists" -ForegroundColor Yellow
    $recreate = Read-Host "Do you want to recreate it? (y/N)"
    if ($recreate -eq "y" -or $recreate -eq "Y") {
        Write-Host "Dropping existing database..." -ForegroundColor Yellow
        psql -U $dbUser -c "DROP DATABASE $dbName;" 2>$null
        Write-Host "Creating database..." -ForegroundColor Yellow
        psql -U $dbUser -c "CREATE DATABASE $dbName;"
        Write-Host "✅ Database recreated" -ForegroundColor Green
    }
} else {
    Write-Host "Creating database..." -ForegroundColor Yellow
    psql -U $dbUser -c "CREATE DATABASE $dbName;"
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Database created successfully" -ForegroundColor Green
    } else {
        Write-Host "❌ Failed to create database" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""

# Update .env file
Write-Host "Updating .env file..." -ForegroundColor Yellow
$envPath = Join-Path $PSScriptRoot ".env"
$databaseUrl = "DATABASE_URL=postgresql://${dbUser}:${dbPasswordPlain}@localhost:5432/${dbName}"

if (Test-Path $envPath) {
    $envContent = Get-Content $envPath -Raw
    if ($envContent -match "DATABASE_URL=.*") {
        $envContent = $envContent -replace "DATABASE_URL=.*", $databaseUrl
    } else {
        $envContent = $databaseUrl + "`n" + $envContent
    }
    Set-Content -Path $envPath -Value $envContent
    Write-Host "✅ .env file updated" -ForegroundColor Green
} else {
    Write-Host "⚠️  .env file not found" -ForegroundColor Yellow
}

Write-Host ""

# Run migrations
Write-Host "Running database migrations..." -ForegroundColor Yellow
$venvActivate = Join-Path $PSScriptRoot "venv\Scripts\Activate.ps1"

if (Test-Path $venvActivate) {
    & $venvActivate
    alembic upgrade head
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Migrations completed successfully" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Migration failed - you may need to run 'alembic upgrade head' manually" -ForegroundColor Yellow
    }
} else {
    Write-Host "⚠️  Virtual environment not found" -ForegroundColor Yellow
    Write-Host "Please activate your virtual environment and run: alembic upgrade head" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🎉 Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Start the backend: uvicorn app.main:app --reload" -ForegroundColor White
Write-Host "2. Visit: http://localhost:8000/docs" -ForegroundColor White
Write-Host ""

# Clear password from environment
$env:PGPASSWORD = $null
