# Quick Deployment Guide - Render.com

## ✅ Code Successfully Pushed to GitHub!

Your PAL Tracking System code is now available at:
**https://github.com/AkashMaurya/PalAgu.git**

## 🚀 Next Steps to Deploy on Render.com

### Step 1: Create PostgreSQL Database

1. Go to https://dashboard.render.com/
2. Click **"New +"** → **"PostgreSQL"**
3. Settings:
   - Name: `pal-tracking-db`
   - Database: `pal_tracking`
   - Region: Choose closest to you
   - Plan: **Free**
4. Click **"Create Database"**
5. **COPY** the **Internal Database URL** (you'll need this!)

### Step 2: Create Web Service

1. Click **"New +"** → **"Web Service"**
2. Connect GitHub: Select **"AkashMaurya/PalAgu"**
3. Settings:
   - **Name**: `pal-tracking-system`
   - **Region**: Same as database
   - **Branch**: `main`
   - **Runtime**: `Python 3`
   - **Build Command**: `./build.sh`
   - **Start Command**: `gunicorn config.wsgi:application`

4. **Environment Variables** (Click "Advanced"):

   ```
   PYTHON_VERSION = 3.11.0
   SECRET_KEY = [Generate using: python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"]
   DEBUG = False
   ALLOWED_HOSTS = .onrender.com
   DATABASE_URL = [Paste Internal Database URL from Step 1]
   ```

5. **Plan**: Free
6. Click **"Create Web Service"**

### Step 3: Wait for Deployment

- Render will automatically build and deploy
- Monitor logs in dashboard
- Wait for "Your service is live 🎉"

### Step 4: Create Admin Account

1. In Render dashboard → Your service → **"Shell"** tab
2. Run:
   ```bash
   python manage.py createsuperuser
   ```
3. Enter username, email, password

### Step 5: Setup Initial Data

1. Access admin panel: `https://your-app.onrender.com/admin/`
2. Login with superuser credentials
3. Create:
   - **Programs**: Medicine, Nursing
   - **Years**: MD Year 1-6, NS Year 1-4
   - **Courses**: For each program

## 🎉 Done!

Your app will be live at: `https://pal-tracking-system.onrender.com`

## 📚 Full Documentation

See **RENDER_DEPLOYMENT.md** for complete deployment guide with troubleshooting.

## 🔑 Generate SECRET_KEY

Run this in Python:
```python
from django.core.management.utils import get_random_secret_key
print(get_random_secret_key())
```

Or use: https://djecrety.ir/

## ⚠️ Important Notes

- Free tier spins down after 15 minutes of inactivity
- First request after spin down takes ~30 seconds
- For production, upgrade to paid plan

## 🔄 Update Your App

After making changes:
```bash
git add .
git commit -m "Your changes"
git push origin main
```

Render will automatically redeploy!

---

**Need Help?** Check RENDER_DEPLOYMENT.md for detailed troubleshooting.

