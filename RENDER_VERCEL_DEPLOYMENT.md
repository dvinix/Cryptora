# Vercel + Render Deployment Guide for Cryptora

Complete step-by-step guide to deploy Cryptora with frontend on Vercel and backend on Render.

## Why This Stack?

**Vercel (Frontend):**
- ✅ 100% free for hobby projects
- ✅ Unlimited bandwidth (100GB/month)
- ✅ Automatic HTTPS & CDN
- ✅ Zero configuration for Vite/React

**Render (Backend):**
- ✅ Free tier available (750 hours/month)
- ✅ Auto-deploy from GitHub
- ✅ Built-in PostgreSQL
- ✅ Simple setup with `render.yaml`

---

## Prerequisites

- GitHub account with code pushed
- Render account (sign up at https://render.com)
- Vercel account (sign up at https://vercel.com)

---

## Part 1: Deploy Backend on Render

### Method A: Using render.yaml (Recommended - Fastest)

Your project already has `render.yaml` configured!

#### Step 1: Push to GitHub

```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

#### Step 2: Create Render Blueprint

1. Go to https://dashboard.render.com
2. Click **"New +"** → **"Blueprint"**
3. Connect your GitHub account (if not already)
4. Select your **Cryptora repository**
5. Click **"Connect"**

Render will automatically detect `render.yaml` and show:
- ✅ Web Service: `cryptora-backend`
- ✅ PostgreSQL Database: `cryptora-db`

#### Step 3: Configure Environment Variables

Before clicking "Apply", you need to set `DATABASE_URL`:

1. The database will be created first
2. After database creation, Render will show the **Internal Database URL**
3. Copy it (format: `postgresql://user:password@host/database`)

#### Step 4: Apply Blueprint

1. Click **"Apply"**
2. Wait for services to be created (2-3 minutes)
3. Database will be created first, then backend service

#### Step 5: Set DATABASE_URL

1. Go to your **cryptora-backend** service
2. Click **"Environment"** tab
3. Find `DATABASE_URL` variable
4. Click **"Edit"**
5. Paste the Internal Database URL from your PostgreSQL service
6. Click **"Save Changes"**

The service will automatically redeploy.

#### Step 6: Run Database Migrations

1. Go to your **cryptora-backend** service
2. Click **"Shell"** tab (top right)
3. Run:
```bash
cd backend
alembic upgrade head
```

#### Step 7: Get Backend URL

1. Your service URL will be shown at the top
2. Format: `https://cryptora-backend.onrender.com`
3. Copy this URL for frontend configuration

---

### Method B: Manual Setup (Alternative)

If you prefer manual setup or `render.yaml` doesn't work:

#### Step 1: Create PostgreSQL Database

1. Go to https://dashboard.render.com
2. Click **"New +"** → **"PostgreSQL"**
3. Configure:
   - **Name:** `cryptora-db`
   - **Database:** `cryptora_db`
   - **User:** `cryptora_user`
   - **Region:** Choose closest to your users
   - **Plan:** Free
4. Click **"Create Database"**
5. Copy the **Internal Database URL**

#### Step 2: Create Web Service

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure:

**Basic Settings:**
- **Name:** `cryptora-backend`
- **Region:** Same as database
- **Branch:** `main`
- **Root Directory:** `backend`
- **Runtime:** `Python 3`

**Build & Deploy:**
- **Build Command:**
  ```bash
  pip install -r requirements.txt
  ```
- **Start Command:**
  ```bash
  uvicorn app.main:app --host 0.0.0.0 --port $PORT
  ```

**Plan:**
- Select **Free**

#### Step 3: Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable"** for each:

```env
DATABASE_URL=postgresql://cryptora_user:password@host/cryptora_db
ALLOWED_ORIGINS=["https://your-app.vercel.app"]
API_V1_PREFIX=/api/v1
PROJECT_NAME=Cryptora
VERSION=1.0.0
MAX_CONTENT_SIZE=1000000
MAX_ALIAS_LENGTH=100
MIN_ALIAS_LENGTH=1
RATE_LIMIT_ENABLED=true
RATE_LIMIT_PER_MINUTE=60
```

**Important:** Update `DATABASE_URL` with your actual database URL and `ALLOWED_ORIGINS` after deploying frontend.

#### Step 4: Deploy

1. Click **"Create Web Service"**
2. Wait for deployment (5-10 minutes for first deploy)
3. Check logs for any errors

#### Step 5: Run Migrations

1. Go to your service
2. Click **"Shell"** tab
3. Run:
```bash
cd backend
alembic upgrade head
```

---

## Part 2: Deploy Frontend on Vercel

### Method A: Using Vercel Dashboard (Easiest)

#### Step 1: Import Project

1. Go to https://vercel.com/new
2. Click **"Import Git Repository"**
3. Select your **Cryptora repository**
4. Click **"Import"**

#### Step 2: Configure Project

**Framework Preset:** Vite (auto-detected)

**Root Directory:** 
- Click **"Edit"**
- Select `frontend`

**Build Settings:**
- **Build Command:** `npm run build` (auto-detected)
- **Output Directory:** `dist` (auto-detected)
- **Install Command:** `npm install` (auto-detected)

#### Step 3: Add Environment Variable

1. Click **"Environment Variables"**
2. Add:
   - **Key:** `VITE_API_URL`
   - **Value:** `https://cryptora-backend.onrender.com` (your Render URL)
   - **Environment:** Production, Preview, Development (select all)

#### Step 4: Deploy

1. Click **"Deploy"**
2. Wait for build (2-3 minutes)
3. Your app will be live at `https://your-app.vercel.app`

#### Step 5: Copy Frontend URL

Copy your Vercel URL for CORS configuration.

---

### Method B: Using Vercel CLI

#### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

#### Step 2: Login

```bash
vercel login
```

#### Step 3: Deploy

```bash
cd frontend
vercel
```

Follow the prompts:
- **Set up and deploy?** Y
- **Which scope?** Your account
- **Link to existing project?** N
- **Project name?** cryptora (or your choice)
- **In which directory is your code located?** ./

#### Step 4: Set Environment Variable

```bash
vercel env add VITE_API_URL production
```
Enter: `https://cryptora-backend.onrender.com`

```bash
vercel env add VITE_API_URL preview
```
Enter: `https://cryptora-backend.onrender.com`

```bash
vercel env add VITE_API_URL development
```
Enter: `http://localhost:8000`

#### Step 5: Deploy to Production

```bash
vercel --prod
```

---

## Part 3: Connect Frontend & Backend

### Step 1: Update CORS on Render

1. Go to Render dashboard
2. Open **cryptora-backend** service
3. Go to **"Environment"** tab
4. Find `ALLOWED_ORIGINS`
5. Update to:
```json
["https://your-app.vercel.app"]
```
6. Click **"Save Changes"**

The service will automatically redeploy (takes 2-3 minutes).

### Step 2: Test the Connection

1. Visit your Vercel URL
2. Try to register a new user
3. Create a note
4. Verify encryption works

---

## Troubleshooting

### Issue: Render Service Won't Start

**Check logs:**
1. Go to Render dashboard
2. Open your service
3. Click **"Logs"** tab

**Common causes:**
- Missing `requirements.txt` in `backend/` folder
- Wrong start command
- Database connection error

**Fix:**
```bash
# Verify start command
uvicorn app.main:app --host 0.0.0.0 --port $PORT

# Check DATABASE_URL is set
# Go to Environment tab and verify
```

### Issue: Database Connection Failed

**Check:**
- `DATABASE_URL` is set correctly
- Using **Internal Database URL** (not External)
- Database is in same region as web service

**Fix:**
1. Go to PostgreSQL service
2. Copy **Internal Database URL**
3. Update `DATABASE_URL` in web service
4. Save and redeploy

### Issue: Migrations Not Running

**Run manually:**
1. Go to service → **Shell** tab
2. Run:
```bash
cd backend
alembic upgrade head
```

**If alembic not found:**
```bash
pip install alembic
alembic upgrade head
```

### Issue: CORS Errors in Browser

**Symptoms:**
- Frontend can't connect to backend
- Console shows CORS error

**Fix:**
1. Verify `ALLOWED_ORIGINS` in Render includes exact Vercel URL
2. Must include `https://`
3. No trailing slash
4. Example: `["https://cryptora.vercel.app"]`

### Issue: Vercel Build Fails

**Check build logs:**
1. Go to Vercel dashboard
2. Click on failed deployment
3. View build logs

**Common causes:**
- Wrong root directory (should be `frontend`)
- Missing dependencies
- TypeScript errors

**Fix:**
```bash
# Test build locally first
cd frontend
npm install
npm run build
```

### Issue: Environment Variable Not Working

**Check:**
1. Variable name is `VITE_API_URL` (must start with `VITE_`)
2. Set for all environments (Production, Preview, Development)
3. Redeploy after adding variable

**Fix:**
```bash
# Via CLI
vercel env add VITE_API_URL production
vercel --prod
```

### Issue: Render Free Tier Cold Starts

**Symptoms:**
- First request after 15 minutes is slow (30-60 seconds)
- Service "spins down" when inactive

**Solutions:**

**Option 1: Keep-Alive Service (Free)**
Use a service like UptimeRobot to ping your backend every 14 minutes:
1. Sign up at https://uptimerobot.com
2. Add monitor with your Render URL
3. Set interval to 14 minutes

**Option 2: Upgrade to Paid Plan**
- Render Starter: $7/month (no cold starts)

**Option 3: Switch to Railway**
- Railway has no cold starts on free tier

---

## Monitoring & Maintenance

### View Render Logs

1. Go to Render dashboard
2. Open your service
3. Click **"Logs"** tab
4. Enable **"Live tail"** for real-time logs

### View Vercel Logs

1. Go to Vercel dashboard
2. Click on your project
3. Go to **"Deployments"**
4. Click on a deployment
5. View **"Build Logs"** or **"Function Logs"**

### Update Backend

```bash
git add .
git commit -m "Update backend"
git push origin main
```

Render will auto-deploy (takes 2-3 minutes).

### Update Frontend

```bash
git add .
git commit -m "Update frontend"
git push origin main
```

Vercel will auto-deploy (takes 1-2 minutes).

### Run New Migrations

After pushing migration files:
1. Go to Render → Service → **Shell**
2. Run:
```bash
cd backend
alembic upgrade head
```

---

## Production Checklist

- [ ] Backend deployed on Render
- [ ] PostgreSQL database created
- [ ] DATABASE_URL set correctly (Internal URL)
- [ ] All environment variables configured
- [ ] Database migrations run successfully
- [ ] Backend URL copied
- [ ] Frontend deployed on Vercel
- [ ] VITE_API_URL set correctly
- [ ] CORS configured with Vercel URL
- [ ] Test user registration
- [ ] Test note creation/encryption
- [ ] Test note editing/deletion
- [ ] Check API docs at `https://your-backend.onrender.com/docs`
- [ ] Monitor logs for errors
- [ ] Set up UptimeRobot (optional, for cold starts)

---

## Cost Breakdown

### Free Tier

**Render:**
- Web Service: Free (750 hours/month)
- PostgreSQL: Free (1GB storage, 90 days retention)
- **Limitation:** Spins down after 15 min inactivity

**Vercel:**
- Hosting: Free
- Bandwidth: 100GB/month
- Builds: Unlimited

**Total: $0/month**

### Paid Tier (No Cold Starts)

**Render:**
- Starter Plan: $7/month (always-on)
- PostgreSQL: $7/month (10GB storage)

**Vercel:**
- Free (hobby projects)

**Total: $14/month**

---

## Custom Domains (Optional)

### Backend (Render)

1. Go to service → **Settings**
2. Scroll to **"Custom Domain"**
3. Click **"Add Custom Domain"**
4. Enter: `api.yourdomain.com`
5. Add CNAME record to your DNS:
```
CNAME api.yourdomain.com -> cryptora-backend.onrender.com
```

### Frontend (Vercel)

1. Go to project → **Settings** → **Domains**
2. Click **"Add"**
3. Enter: `yourdomain.com`
4. Follow DNS configuration instructions
5. Vercel provides automatic HTTPS

**Don't forget to update CORS after adding custom domain!**

---

## Useful Commands

### Render

```bash
# View logs (requires Render CLI)
render logs cryptora-backend

# SSH into service
render shell cryptora-backend

# Run migrations
render shell cryptora-backend
cd backend && alembic upgrade head
```

### Vercel

```bash
# Deploy
vercel

# Deploy to production
vercel --prod

# View logs
vercel logs

# List deployments
vercel ls

# Add environment variable
vercel env add VITE_API_URL production

# Remove deployment
vercel rm <deployment-url>

# Open dashboard
vercel open
```

---

## Performance Tips

### Optimize Render Cold Starts

1. **Use UptimeRobot** to ping every 14 minutes
2. **Optimize dependencies** - remove unused packages
3. **Use smaller Docker image** (if using Docker)
4. **Upgrade to paid plan** ($7/month)

### Optimize Vercel Build Time

1. **Enable caching:**
   - Vercel automatically caches `node_modules`
2. **Reduce bundle size:**
   ```bash
   npm run build -- --analyze
   ```
3. **Use environment-specific builds**

---

## Support & Resources

- **Render Docs:** https://render.com/docs
- **Render Status:** https://status.render.com
- **Vercel Docs:** https://vercel.com/docs
- **Vercel Support:** https://vercel.com/support
- **FastAPI Docs:** https://fastapi.tiangolo.com
- **Vite Docs:** https://vitejs.dev

---

## Quick Reference

### Backend URL Format
```
https://cryptora-backend.onrender.com
```

### Frontend URL Format
```
https://cryptora.vercel.app
```

### Database URL Format (Internal)
```
postgresql://user:password@dpg-xxxxx-a/database_name
```

### Environment Variables

**Render (Backend):**
```env
DATABASE_URL=postgresql://...
ALLOWED_ORIGINS=["https://your-app.vercel.app"]
API_V1_PREFIX=/api/v1
PROJECT_NAME=Cryptora
VERSION=1.0.0
MAX_CONTENT_SIZE=1000000
MAX_ALIAS_LENGTH=100
MIN_ALIAS_LENGTH=1
RATE_LIMIT_ENABLED=true
RATE_LIMIT_PER_MINUTE=60
```

**Vercel (Frontend):**
```env
VITE_API_URL=https://cryptora-backend.onrender.com
```

---

## Next Steps

1. ✅ Deploy backend to Render
2. ✅ Deploy frontend to Vercel
3. ✅ Test the application
4. 🔄 Set up UptimeRobot (optional)
5. 🔄 Add custom domains (optional)
6. 🔄 Monitor usage and logs

---

**Deployment complete!** 🎉

Your Cryptora app is now live:
- Frontend: `https://your-app.vercel.app`
- Backend: `https://cryptora-backend.onrender.com`
- API Docs: `https://cryptora-backend.onrender.com/docs`

**Note:** First request may be slow due to Render cold start. Consider UptimeRobot or upgrade to paid plan for better performance.
