# Render Deployment Troubleshooting Guide

## ✅ Latest Fixes Applied

The following fixes have been pushed to GitHub to resolve the metadata-generation-failed error:

### 1. **Enhanced `packages.txt`**
Added system build dependencies:
- `build-essential` - C/C++ compilers
- `libcairo2` - Cairo graphics library
- `libpangoft2-1.0-0` - Pango font rendering
- `libjpeg-dev` - JPEG image support
- `zlib1g-dev` - Compression library

### 2. **Improved `build.sh`**
- Upgrades pip, setuptools, and wheel first
- Installs dependencies in stages to catch errors early
- Better error messages

### 3. **Organized `requirements.txt`**
- Grouped dependencies by purpose
- Added comments for clarity
- Stable version numbers

### 4. **Created `requirements-minimal.txt`**
Backup file without WeasyPrint if PDF export is not needed

---

## 🔧 If Build Still Fails

### Option 1: Use Minimal Requirements (Recommended)

If WeasyPrint continues to cause issues, use the minimal requirements file:

**In Render Dashboard:**
1. Go to your web service
2. Click **"Environment"** tab
3. Add environment variable:
   - **Key**: `PIP_REQUIREMENTS_FILE`
   - **Value**: `requirements-minimal.txt`
4. Click **"Manual Deploy"** → **"Deploy latest commit"**

**OR** update `build.sh` line 21:
```bash
# Change from:
pip install -r requirements.txt

# To:
pip install -r requirements-minimal.txt
```

### Option 2: Remove PDF Export Feature

If you don't need PDF export, remove WeasyPrint entirely:

1. **Edit `requirements.txt`** - Remove the line:
   ```
   weasyprint==60.2
   ```

2. **Edit `core/views.py`** - Comment out or remove the PDF export view (around line 745-838)

3. **Commit and push**:
   ```bash
   git add .
   git commit -m "Remove PDF export feature"
   git push origin main
   ```

---

## 🐛 Common Render Errors & Solutions

### Error: "metadata-generation-failed"

**Cause**: Missing build dependencies or incompatible package versions

**Solution**:
1. Check `packages.txt` includes all system dependencies
2. Use `requirements-minimal.txt` instead
3. Ensure `build-essential` is in `packages.txt`

### Error: "No module named 'weasyprint'"

**Cause**: WeasyPrint failed to install

**Solution**:
- Use `requirements-minimal.txt` (removes WeasyPrint)
- Or ensure all packages in `packages.txt` are correct

### Error: "collectstatic failed"

**Cause**: Static files configuration issue

**Solution**:
1. Check `STATIC_ROOT` in `config/settings.py`
2. Ensure `whitenoise` is in MIDDLEWARE
3. Verify `STORAGES` configuration

### Error: "relation does not exist"

**Cause**: Database migrations not run

**Solution**:
1. Check build logs - migrations should run automatically
2. Manually run in Render Shell:
   ```bash
   python manage.py migrate
   ```

### Error: "DisallowedHost"

**Cause**: ALLOWED_HOSTS not configured

**Solution**:
1. Check environment variable `ALLOWED_HOSTS` includes `.onrender.com`
2. Or set to `*` for testing (not recommended for production)

### Error: "SECRET_KEY not set"

**Cause**: Missing SECRET_KEY environment variable

**Solution**:
1. Generate a key:
   ```python
   from django.core.management.utils import get_random_secret_key
   print(get_random_secret_key())
   ```
2. Add to Render environment variables

---

## 📋 Render Configuration Checklist

### Environment Variables (Required)

- [ ] `PYTHON_VERSION` = `3.11.0`
- [ ] `SECRET_KEY` = `[your-generated-key]`
- [ ] `DEBUG` = `False`
- [ ] `ALLOWED_HOSTS` = `.onrender.com`
- [ ] `DATABASE_URL` = `[postgres-internal-url]`

### Build Settings

- [ ] **Build Command**: `./build.sh`
- [ ] **Start Command**: `gunicorn config.wsgi:application`
- [ ] **Branch**: `main`
- [ ] **Runtime**: `Python 3`

### Files Present

- [ ] `build.sh` (executable)
- [ ] `requirements.txt` or `requirements-minimal.txt`
- [ ] `packages.txt`
- [ ] `runtime.txt`
- [ ] `.gitignore`
- [ ] `.env.example`

---

## 🔍 Debugging Steps

### 1. Check Build Logs

In Render Dashboard:
1. Go to your web service
2. Click **"Logs"** tab
3. Look for the first error message
4. Search for that error in this guide

### 2. Test Locally

Before deploying, test the build process locally:

```bash
# Create a test environment
python -m venv test_env
source test_env/bin/activate  # On Windows: test_env\Scripts\activate

# Install dependencies
pip install --upgrade pip setuptools wheel
pip install -r requirements.txt

# Test Django commands
python manage.py check
python manage.py collectstatic --no-input
python manage.py migrate --check
```

### 3. Use Render Shell

After deployment, access the shell:
1. Render Dashboard → Your service → **"Shell"** tab
2. Run diagnostic commands:
   ```bash
   python --version
   pip list
   python manage.py check
   python manage.py showmigrations
   ```

---

## 🚀 Quick Fix Commands

### Force Redeploy
```bash
git commit --allow-empty -m "Trigger rebuild"
git push origin main
```

### Clear Build Cache (in Render)
1. Go to web service settings
2. Click **"Manual Deploy"**
3. Select **"Clear build cache & deploy"**

### Switch to Minimal Requirements
```bash
# Update build.sh
sed -i 's/requirements.txt/requirements-minimal.txt/g' build.sh
git add build.sh
git commit -m "Use minimal requirements"
git push origin main
```

---

## 📞 Still Having Issues?

### Check These Resources:

1. **Render Docs**: https://render.com/docs/deploy-django
2. **Django Deployment**: https://docs.djangoproject.com/en/4.2/howto/deployment/
3. **Render Community**: https://community.render.com/

### Get Help:

1. **Copy the full error message** from Render logs
2. **Check which package** is failing to install
3. **Search for**: "[package-name] render deployment error"

### Contact Support:

- **Render Support**: support@render.com
- **Include**: Build logs, error messages, and what you've tried

---

## ✅ Success Indicators

Your deployment is successful when you see:

```
✓ Build completed successfully!
✓ Collecting static files... done
✓ Running database migrations... done
✓ Your service is live 🎉
```

And you can access:
- Main site: `https://your-app.onrender.com/`
- Admin panel: `https://your-app.onrender.com/admin/`

---

**Last Updated**: After fixing metadata-generation-failed error
**Status**: Ready for deployment with enhanced error handling

