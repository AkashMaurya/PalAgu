# Deployment Guide - PAL Program Tracking System

## Quick Start (Development)

1. Navigate to project directory:
```bash
cd /workspace/pal-tracking-system
```

2. Activate virtual environment:
```bash
source venv/bin/activate
```

3. Start the server:
```bash
python manage.py runserver 0.0.0.0:8000
```

4. Access the application:
- URL: http://localhost:8000
- Admin Login: admin@agu.edu / admin123

## Production Deployment Guide

### Step 1: Prepare the Environment

1. Install Python 3.8+ on your production server

2. Clone/upload the project to your server

3. Create and activate virtual environment:
```bash
python3 -m venv venv
source venv/bin/activate
```

4. Install dependencies:
```bash
pip install -r requirements.txt
pip install gunicorn  # For production server
```

### Step 2: Configure Settings

1. Create `.env` file in project root:
```env
SECRET_KEY=your-super-secret-key-generate-new-one
DEBUG=False
ALLOWED_HOSTS=your-domain.com,www.your-domain.com
DATABASE_URL=sqlite:///db.sqlite3
```

2. Update `config/settings.py` to use environment variables:
```python
from decouple import config

SECRET_KEY = config('SECRET_KEY')
DEBUG = config('DEBUG', default=False, cast=bool)
ALLOWED_HOSTS = config('ALLOWED_HOSTS', default='').split(',')
```

### Step 3: Database Setup

1. Run migrations:
```bash
python manage.py migrate
```

2. Populate initial data:
```bash
python manage.py populate_data
```

3. Create additional superuser (optional):
```bash
python manage.py createsuperuser
```

### Step 4: Static Files

1. Collect static files:
```bash
python manage.py collectstatic --noinput
```

### Step 5: Run with Gunicorn

1. Test Gunicorn:
```bash
gunicorn config.wsgi:application --bind 0.0.0.0:8000
```

2. Create systemd service file `/etc/systemd/system/pal.service`:
```ini
[Unit]
Description=PAL Program Tracking System
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=/path/to/pal-tracking-system
Environment="PATH=/path/to/pal-tracking-system/venv/bin"
ExecStart=/path/to/pal-tracking-system/venv/bin/gunicorn \
    --workers 3 \
    --bind unix:/path/to/pal-tracking-system/pal.sock \
    config.wsgi:application

[Install]
WantedBy=multi-user.target
```

3. Start and enable service:
```bash
sudo systemctl start pal
sudo systemctl enable pal
```

### Step 6: Nginx Configuration

1. Create Nginx config `/etc/nginx/sites-available/pal`:
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location = /favicon.ico { access_log off; log_not_found off; }

    location /static/ {
        alias /path/to/pal-tracking-system/staticfiles/;
    }

    location /media/ {
        alias /path/to/pal-tracking-system/media/;
    }

    location / {
        include proxy_params;
        proxy_pass http://unix:/path/to/pal-tracking-system/pal.sock;
    }
}
```

2. Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/pal /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 7: SSL/HTTPS Setup (Recommended)

1. Install Certbot:
```bash
sudo apt install certbot python3-certbot-nginx
```

2. Get SSL certificate:
```bash
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

### Step 8: Security Checklist

- [x] Changed SECRET_KEY
- [x] Set DEBUG = False
- [x] Configured ALLOWED_HOSTS
- [x] Setup HTTPS/SSL
- [x] Changed default admin password
- [x] Restricted file upload sizes
- [x] Configured firewall rules
- [x] Setup database backups
- [x] Setup application logging
- [x] Configure CORS if needed

## Maintenance

### Database Backup

```bash
python manage.py dumpdata > backup_$(date +%Y%m%d).json
```

### Database Restore

```bash
python manage.py loaddata backup_20251104.json
```

### View Logs

```bash
sudo journalctl -u pal -f
```

### Update Application

```bash
cd /path/to/pal-tracking-system
git pull  # or upload new files
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py collectstatic --noinput
sudo systemctl restart pal
```

## Troubleshooting

### Server won't start

```bash
# Check syntax
python manage.py check

# Check migrations
python manage.py showmigrations

# Check permissions
ls -la db.sqlite3
```

### Static files not loading

```bash
python manage.py collectstatic --clear --noinput
sudo systemctl restart pal
```

### Database errors

```bash
# Reset database (WARNING: deletes all data)
rm db.sqlite3
python manage.py migrate
python manage.py populate_data
```

## Performance Optimization

### Enable Caching

Add to `settings.py`:
```python
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.filebased.FileBasedCache',
        'LOCATION': '/var/tmp/django_cache',
    }
}
```

### Enable Gzip Compression

Nginx config:
```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
```

## Monitoring

### Setup Logging

Add to `settings.py`:
```python
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'file': {
            'level': 'ERROR',
            'class': 'logging.FileHandler',
            'filename': '/var/log/pal/django.log',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file'],
            'level': 'ERROR',
            'propagate': True,
        },
    },
}
```

## Support

For issues or questions, refer to:
- Django Documentation: https://docs.djangoproject.com/
- HTMX Documentation: https://htmx.org/
- Alpine.js Documentation: https://alpinejs.dev/
- Tailwind CSS Documentation: https://tailwindcss.com/

---

**Last Updated:** November 2025
**Version:** 1.0.0
