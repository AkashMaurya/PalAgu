# PAL Tracking System - Render.com Deployment Guide

This guide will walk you through deploying the PAL (Peer-Assisted Learning) Tracking System to Render.com.

## 📋 Prerequisites

- GitHub account
- Render.com account (free tier available)
- Git installed on your local machine

## 🚀 Deployment Steps

### Step 1: Push Code to GitHub

1. **Initialize Git repository** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit - PAL Tracking System"
   ```

2. **Add GitHub remote**:
   ```bash
   git remote add origin https://github.com/AkashMaurya/PalAgu.git
   ```

3. **Push to GitHub**:
   ```bash
   git branch -M main
   git push -u origin main
   ```

### Step 2: Create PostgreSQL Database on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"PostgreSQL"**
3. Configure the database:
   - **Name**: `pal-tracking-db` (or any name you prefer)
   - **Database**: `pal_tracking`
   - **User**: (auto-generated)
   - **Region**: Choose closest to your users
   - **PostgreSQL Version**: 15 (or latest)
   - **Plan**: Free (or paid for production)
4. Click **"Create Database"**
5. **IMPORTANT**: Copy the **Internal Database URL** - you'll need this later

### Step 3: Create Web Service on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository:
   - Click **"Connect account"** if not already connected
   - Select **"AkashMaurya/PalAgu"** repository
4. Configure the web service:

   **Basic Settings:**
   - **Name**: `pal-tracking-system` (or any name)
   - **Region**: Same as your database
   - **Branch**: `main`
   - **Root Directory**: (leave empty)
   - **Runtime**: `Python 3`
   - **Build Command**: `./build.sh`
   - **Start Command**: `gunicorn config.wsgi:application`

   **Advanced Settings (Environment Variables):**
   Click **"Advanced"** and add these environment variables:

   | Key | Value |
   |-----|-------|
   | `PYTHON_VERSION` | `3.11.0` |
   | `SECRET_KEY` | Generate a secure key (see below) |
   | `DEBUG` | `False` |
   | `ALLOWED_HOSTS` | `.onrender.com` |
   | `DATABASE_URL` | Paste the Internal Database URL from Step 2 |

   **Plan:**
   - Select **Free** (or paid for production)

5. Click **"Create Web Service"**

### Step 4: Generate SECRET_KEY

To generate a secure SECRET_KEY, run this in Python:

```python
from django.core.management.utils import get_random_secret_key
print(get_random_secret_key())
```

Or use this online: https://djecrety.ir/

Copy the generated key and paste it in the `SECRET_KEY` environment variable on Render.

### Step 5: Wait for Deployment

1. Render will automatically:
   - Clone your repository
   - Install dependencies from `requirements.txt`
   - Run `build.sh` script (collect static files, run migrations)
   - Start the application with Gunicorn

2. Monitor the deployment logs in the Render dashboard
3. Once deployed, you'll see **"Your service is live 🎉"**

### Step 6: Access Your Application

1. Click on the URL provided by Render (e.g., `https://pal-tracking-system.onrender.com`)
2. Your PAL Tracking System should be live!

### Step 7: Create Superuser (Admin Account)

1. In Render dashboard, go to your web service
2. Click **"Shell"** tab
3. Run this command:
   ```bash
   python manage.py createsuperuser
   ```
4. Follow the prompts to create an admin account
5. Access admin panel at: `https://your-app.onrender.com/admin/`

## 🔧 Configuration Files Explained

### `requirements.txt`
Contains all Python dependencies including:
- `gunicorn` - Production WSGI server
- `whitenoise` - Serves static files efficiently
- `psycopg2-binary` - PostgreSQL adapter
- `dj-database-url` - Database URL parser
- `python-decouple` - Environment variable management

### `build.sh`
Render runs this script during deployment:
1. Upgrades pip
2. Installs dependencies
3. Collects static files
4. Runs database migrations

### `config/settings.py`
Updated to support:
- Environment variables via `python-decouple`
- PostgreSQL via `dj-database-url`
- Static files via `whitenoise`
- Production security settings

### `.env.example`
Template for local development environment variables

### `.gitignore`
Prevents sensitive files from being committed to Git

## 🔐 Security Checklist

- ✅ `DEBUG = False` in production
- ✅ Strong `SECRET_KEY` (never commit to Git)
- ✅ `ALLOWED_HOSTS` configured
- ✅ Database credentials in environment variables
- ✅ HTTPS enabled (automatic on Render)
- ✅ Security headers configured
- ✅ Static files served via WhiteNoise

## 📊 Post-Deployment Tasks

### 1. Load Initial Data (Optional)

If you have initial data (programs, years, courses):

```bash
# In Render Shell
python manage.py loaddata initial_data.json
```

### 2. Create Initial Programs and Years

Access the admin panel and create:
- Programs (Medicine, Nursing)
- Years (MD Year 1-6, NS Year 1-4)
- Courses for each program

### 3. Configure Application Settings

In the admin panel, configure:
- Minimum GPA for tutors
- Session duration options
- Other system configurations

## 🔄 Updating Your Application

When you make changes to your code:

1. **Commit changes**:
   ```bash
   git add .
   git commit -m "Description of changes"
   ```

2. **Push to GitHub**:
   ```bash
   git push origin main
   ```

3. **Automatic deployment**:
   - Render automatically detects the push
   - Rebuilds and redeploys your application
   - Monitor progress in Render dashboard

## 🐛 Troubleshooting

### Build Fails

**Check build logs** in Render dashboard for errors:
- Missing dependencies → Update `requirements.txt`
- Python version mismatch → Set `PYTHON_VERSION` env var
- Build script errors → Check `build.sh` permissions

### Database Connection Errors

- Verify `DATABASE_URL` is correct
- Ensure database is in the same region
- Check database is running (not suspended)

### Static Files Not Loading

- Verify `STATIC_ROOT` is set correctly
- Check `whitenoise` is in `MIDDLEWARE`
- Run `python manage.py collectstatic` in Shell

### Application Crashes

- Check logs in Render dashboard
- Verify all environment variables are set
- Ensure `gunicorn` is installed
- Check `ALLOWED_HOSTS` includes `.onrender.com`

## 📱 Free Tier Limitations

Render's free tier has some limitations:
- **Spin down after 15 minutes** of inactivity
- **Spin up takes ~30 seconds** on first request
- **750 hours/month** of runtime
- **Limited resources** (512 MB RAM)

For production use, consider upgrading to a paid plan.

## 🔗 Useful Links

- [Render Documentation](https://render.com/docs)
- [Django Deployment Checklist](https://docs.djangoproject.com/en/4.2/howto/deployment/checklist/)
- [Gunicorn Documentation](https://docs.gunicorn.org/)
- [WhiteNoise Documentation](http://whitenoise.evans.io/)

## 📞 Support

If you encounter issues:
1. Check Render logs
2. Review Django error messages
3. Consult Render documentation
4. Contact Render support

## ✅ Deployment Checklist

Before going live:

- [ ] Code pushed to GitHub
- [ ] PostgreSQL database created on Render
- [ ] Web service created and configured
- [ ] Environment variables set correctly
- [ ] SECRET_KEY generated and set
- [ ] Build completed successfully
- [ ] Application accessible via URL
- [ ] Superuser created
- [ ] Admin panel accessible
- [ ] Initial data loaded
- [ ] Programs, Years, and Courses created
- [ ] Test user registration
- [ ] Test tutor registration
- [ ] Test feedback submission
- [ ] Test analytics dashboard
- [ ] Test Excel export

---

**Congratulations! Your PAL Tracking System is now live on Render.com! 🎉**

