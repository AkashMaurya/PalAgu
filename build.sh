#!/usr/bin/env bash
# exit on error
set -o errexit

echo "Starting build process..."

# Upgrade pip and setuptools
echo "Upgrading pip, setuptools, and wheel..."
pip install --upgrade pip setuptools wheel

# Install dependencies one by one to catch errors
echo "Installing core dependencies..."
pip install Django==4.2.9 asgiref==3.8.1 sqlparse==0.5.0 tzdata==2024.1

echo "Installing configuration and database..."
pip install python-decouple==3.8 psycopg2-binary==2.9.9 dj-database-url==2.1.0

echo "Installing production server..."
pip install gunicorn==21.2.0 whitenoise==6.6.0

echo "Installing Excel support..."
pip install openpyxl==3.1.5 et-xmlfile==2.0.0

echo "Installing remaining dependencies..."
pip install -r requirements.txt

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --no-input --clear

# Run migrations
echo "Running database migrations..."
python manage.py migrate --no-input

echo "Build completed successfully!"

