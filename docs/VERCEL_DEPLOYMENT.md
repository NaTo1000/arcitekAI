# Deploy ArciTEK.AI to Vercel

**infinite♾2025** | Complete Vercel Deployment Guide

## Overview

This guide walks you through deploying the ArciTEK.AI frontend to Vercel and the backend to Railway, creating a production-ready application.

## Prerequisites

- GitHub account (repository already created: NaTo1000/arcitekAI)
- Vercel account (free tier available)
- Railway account (free tier available)
- OpenAI API key

---

## Part 1: Deploy Backend to Railway

### Step 1: Create Railway Account
1. Go to https://railway.app
2. Sign up with GitHub
3. Authorize Railway to access your repositories

### Step 2: Create New Project
1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose **NaTo1000/arcitekAI**
4. Railway will detect the repository

### Step 3: Configure Backend Service
1. Click **"Add Service"** → **"GitHub Repo"**
2. Select the **arcitekAI** repository
3. Configure settings:
   ```
   Name: arcitekAI-backend
   Root Directory: backend
   Start Command: python app.py
   ```

### Step 4: Add Environment Variables
1. Go to **Variables** tab
2. Add the following variables:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   FLASK_ENV=production
   FLASK_DEBUG=False
   ```
3. Click **"Add Variable"** for each

### Step 5: Deploy Backend
1. Railway will automatically deploy
2. Wait for build to complete (2-3 minutes)
3. Once deployed, you'll see a URL like:
   ```
   https://arcitekai-backend-production.up.railway.app
   ```
4. **Copy this URL** - you'll need it for the frontend

### Step 6: Test Backend
Open the URL in your browser and add `/api/health`:
```
https://your-backend-url.railway.app/api/health
```

You should see:
```json
{
  "status": "online",
  "service": "ArciTEK.AI Backend",
  "version": "1.0.0",
  "branding": "infinite♾2025"
}
```

---

## Part 2: Update Frontend API URLs

### Step 1: Update Component Files

Before deploying the frontend, update the API URLs in the following files:

#### 1. `src/components/MusicStudio.jsx`
Find line ~21:
```javascript
const response = await fetch('http://localhost:5000/api/generate-music', {
```

Replace with:
```javascript
const response = await fetch('https://your-backend-url.railway.app/api/generate-music', {
```

#### 2. `src/components/ImageLab.jsx`
Find line ~19:
```javascript
const response = await fetch('http://localhost:5000/api/generate-image', {
```

Replace with:
```javascript
const response = await fetch('https://your-backend-url.railway.app/api/generate-image', {
```

#### 3. `src/components/StoryWriter.jsx`
Find lines ~33 and ~72:
```javascript
const response = await fetch('http://localhost:5000/api/generate-story', {
```
```javascript
const response = await fetch('http://localhost:5000/api/narrate-story', {
```

Replace both with your Railway backend URL:
```javascript
const response = await fetch('https://your-backend-url.railway.app/api/generate-story', {
```
```javascript
const response = await fetch('https://your-backend-url.railway.app/api/narrate-story', {
```

### Step 2: Commit Changes
```bash
git add .
git commit -m "Update API URLs for production deployment"
git push origin master
```

---

## Part 3: Deploy Frontend to Vercel

### Step 1: Create Vercel Account
1. Go to https://vercel.com
2. Sign up with GitHub
3. Authorize Vercel to access your repositories

### Step 2: Import Project
1. Click **"Add New..."** → **"Project"**
2. Import **NaTo1000/arcitekAI** repository
3. Vercel will detect it's a Vite project

### Step 3: Configure Build Settings
```
Framework Preset: Vite
Root Directory: ./
Build Command: pnpm run build
Output Directory: dist
Install Command: pnpm install
```

### Step 4: Deploy
1. Click **"Deploy"**
2. Wait for build to complete (2-3 minutes)
3. Your site will be live at:
   ```
   https://arcitekAI.vercel.app
   ```

### Step 5: Test Deployment
1. Visit your Vercel URL
2. Test all three features:
   - Music Generation
   - Image Generation
   - Story Writer with Voice Narration

---

## Part 4: Custom Domain (infinite2025.com)

### Step 1: Add Domain in Vercel
1. Go to your project in Vercel
2. Click **Settings** → **Domains**
3. Add **infinite2025.com**
4. Add **www.infinite2025.com**

### Step 2: Configure Cloudflare DNS
1. Log in to Cloudflare
2. Select **infinite2025.com** domain
3. Go to **DNS** → **Records**
4. Add the following records:

```
Type    Name    Content                     Proxy
CNAME   @       cname.vercel-dns.com        Proxied
CNAME   www     cname.vercel-dns.com        Proxied
```

### Step 3: SSL/TLS Settings
1. In Cloudflare, go to **SSL/TLS**
2. Set encryption mode to **Full (strict)**
3. Enable **Always Use HTTPS**
4. Enable **Automatic HTTPS Rewrites**

### Step 4: Verify Domain
1. Wait 5-10 minutes for DNS propagation
2. Visit https://infinite2025.com
3. Your app should be live!

---

## Part 5: Environment Variables (Optional)

If you want to use environment variables for the API URL:

### Step 1: Create `.env.production`
```env
VITE_API_URL=https://your-backend-url.railway.app
```

### Step 2: Update Components
Replace hardcoded URLs with:
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const response = await fetch(`${API_URL}/api/generate-music`, {
```

### Step 3: Add to Vercel
1. Go to **Settings** → **Environment Variables**
2. Add:
   ```
   VITE_API_URL=https://your-backend-url.railway.app
   ```
3. Redeploy

---

## Troubleshooting

### Backend Issues

**Problem**: Backend not responding
```bash
# Check Railway logs
railway logs
```

**Problem**: API key not working
- Verify OPENAI_API_KEY in Railway variables
- Check for typos or extra spaces

### Frontend Issues

**Problem**: CORS errors
- Ensure backend CORS is configured correctly
- Check backend/app.py has `CORS(app)`

**Problem**: API calls failing
- Verify backend URL is correct
- Check browser console for errors
- Test backend health endpoint

### Domain Issues

**Problem**: Domain not resolving
- Wait 10-15 minutes for DNS propagation
- Clear browser cache
- Try incognito mode

**Problem**: SSL errors
- Check Cloudflare SSL/TLS settings
- Ensure "Full (strict)" mode is enabled

---

## Monitoring & Maintenance

### Railway Backend
- **Logs**: View in Railway dashboard
- **Metrics**: CPU, memory, network usage
- **Restart**: Click "Restart" in Railway

### Vercel Frontend
- **Analytics**: Built-in Vercel Analytics
- **Logs**: View deployment logs
- **Redeploy**: Push to GitHub or click "Redeploy"

### Updates
```bash
# Make changes locally
git add .
git commit -m "Update feature"
git push origin master

# Both Vercel and Railway will auto-deploy
```

---

## Cost Estimate

### Free Tier (Recommended for Testing)
- **Railway**: $5 free credit/month
- **Vercel**: Unlimited deployments
- **OpenAI**: Pay-per-use
- **Cloudflare**: Free tier sufficient

### Estimated Monthly Costs
- **Backend (Railway)**: $5-10/month
- **Frontend (Vercel)**: Free
- **OpenAI API**: $10-50/month (depends on usage)
- **Domain**: $10-15/year
- **Total**: ~$15-60/month

---

## Production Checklist

- [ ] Backend deployed to Railway
- [ ] Environment variables set
- [ ] Backend health check passing
- [ ] Frontend API URLs updated
- [ ] Frontend deployed to Vercel
- [ ] All features tested
- [ ] Custom domain configured
- [ ] SSL certificate active
- [ ] Monitoring enabled
- [ ] Backup strategy in place

---

## Support

- **Railway Docs**: https://docs.railway.app
- **Vercel Docs**: https://vercel.com/docs
- **Cloudflare Docs**: https://developers.cloudflare.com

---

**infinite♾2025** - Production Deployment Complete!

