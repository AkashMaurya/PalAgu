#!/bin/bash

# PAL Program Tracking System - Production Deployment Script

echo "========================================="
echo "PAL Program Tracking System Deployment"
echo "========================================="
echo ""

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "Installing dependencies..."
pip install -q -r requirements.txt

# Database setup
echo "Setting up database..."
python manage.py migrate --no-input

# Populate initial data if database is empty
echo "Checking initial data..."
python manage.py populate_data

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --no-input --clear

# Security check
echo "Running security checks..."
python manage.py check --deploy

echo ""
echo "========================================="
echo "Deployment Complete!"
echo "========================================="
echo ""
echo "To start the server:"
echo "  Development: python manage.py runserver 0.0.0.0:8000"
echo "  Production:  gunicorn config.wsgi:application --bind 0.0.0.0:8000"
echo ""
echo "Default credentials:"
echo "  Email: admin@agu.edu"
echo "  Password: admin123"
echo ""
echo "IMPORTANT: Change the admin password after first login!"
echo ""
