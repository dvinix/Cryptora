#!/bin/bash
set -e

echo "Building Lambda package for ARM64 architecture..."

# Install dependencies for ARM64
echo "Installing Python dependencies..."
pip install -r /var/task/requirements.txt -t /var/task/lambda-package/ --no-cache-dir --platform manylinux2014_aarch64 --only-binary=:all:

# Copy application code
echo "Copying application code..."
cp -r /var/task/app /var/task/lambda-package/
cp /var/task/lambda_handler.py /var/task/lambda-package/
cp /var/task/alembic.ini /var/task/lambda-package/
cp -r /var/task/alembic /var/task/lambda-package/

# Create ZIP using Python
echo "Creating ZIP archive..."
python3 << 'PYTHON_SCRIPT'
import zipfile
import os
from pathlib import Path

zip_path = '/var/task/lambda_deployment.zip'
source_dir = '/var/task/lambda-package'

with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
    for root, dirs, files in os.walk(source_dir):
        for file in files:
            file_path = os.path.join(root, file)
            arcname = os.path.relpath(file_path, source_dir)
            zipf.write(file_path, arcname)

print(f"ZIP created: {zip_path}")
print(f"Size: {os.path.getsize(zip_path) / 1024 / 1024:.2f} MB")
PYTHON_SCRIPT

echo "Build complete! Package created at /var/task/lambda_deployment.zip"
