#!/usr/bin/env bash
# exit on error
set -o errexit

echo "========================================="
echo "Starting PAL Tracking System Build"
echo "========================================="

# Upgrade pip and setuptools
echo ""
echo "Step 1: Upgrading pip, setuptools, and wheel..."
pip install --upgrade pip setuptools wheel

# Install all dependencies
echo ""
echo "Step 2: Installing Python dependencies..."
pip install -r requirements.txt

# Collect static files
echo ""
echo "Step 3: Collecting static files..."
python manage.py collectstatic --no-input --clear

# Run migrations
echo ""
echo "Step 4: Running database migrations..."
python manage.py migrate --no-input

echo ""
echo "========================================="
echo "✅ Build completed successfully!"
echo "========================================="

