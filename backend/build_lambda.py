import os
import sys
import shutil
import zipfile
import subprocess
from pathlib import Path

def build_lambda_package():
    backend_dir = Path(__file__).resolve().parent
    package_dir = backend_dir / "lambda-package"
    zip_path = backend_dir / "lambda_deployment.zip"
    requirements_path = backend_dir / "requirements.txt"
    app_dir = backend_dir / "app"
    handler_file = backend_dir / "lambda_handler.py"

    print("=" * 60)
    print("Packaging Cryptora for AWS Lambda (Python 3.11 x86_64)")
    print("=" * 60)

    # 1. Clean previous build artifacts
    if package_dir.exists():
        print(f"Cleaning existing {package_dir.name}...")
        shutil.rmtree(package_dir, ignore_errors=True)
    if zip_path.exists():
        print(f"Removing old {zip_path.name}...")
        zip_path.unlink()

    package_dir.mkdir(parents=True, exist_ok=True)

    # 2. Install Linux x86_64 compatible packages into lambda-package
    print("\nInstalling Linux-compatible dependencies for AWS Lambda...")
    cmd = [
        sys.executable,
        "-m", "pip", "install",
        "-r", str(requirements_path),
        "-t", str(package_dir),
        "--no-cache-dir",
        "--platform", "manylinux2014_x86_64",
        "--python-version", "3.11",
        "--implementation", "cp",
        "--only-binary=:all:"
    ]
    subprocess.check_call(cmd)

    # 3. Copy application code
    print("\nCopying application code...")
    shutil.copytree(app_dir, package_dir / "app", dirs_exist_ok=True)
    shutil.copy2(handler_file, package_dir / "lambda_handler.py")

    # 4. Create ZIP archive
    print(f"\nCreating ZIP archive: {zip_path.name}...")
    with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(package_dir):
            for file in files:
                file_path = Path(root) / file
                arcname = file_path.relative_to(package_dir)
                zipf.write(file_path, arcname)

    # 5. Clean up temporary directory
    print(f"Cleaning up {package_dir.name}...")
    shutil.rmtree(package_dir, ignore_errors=True)

    size_mb = zip_path.stat().st_size / (1024 * 1024)
    print("\n" + "=" * 60)
    print("SUCCESS: Lambda deployment package is ready!")
    print(f"ZIP File: {zip_path}")
    print(f"Size:     {size_mb:.2f} MB")
    print("=" * 60)

if __name__ == "__main__":
    build_lambda_package()
