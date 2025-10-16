# Deploy ArciTEK.AI Backend to Railway

**infinite♾2025** | Railway Backend Deployment Guide

## Quick Deploy

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template)

---

## Manual Deployment

### Step 1: Prerequisites
- GitHub account with NaTo1000/arcitekAI repository
- Railway account (sign up at https://railway.app)
- OpenAI API key

### Step 2: Create New Project
1. Go to https://railway.app/new
2. Click **"Deploy from GitHub repo"**
3. Select **NaTo1000/arcitekAI**
4. Railway will analyze the repository

### Step 3: Configure Service
```
Service Name: arcitekAI-backend
Root Directory: backend
Start Command: python app.py
Build Command: pip install -r requirements.txt
```

### Step 4: Environment Variables
Add these in the **Variables** tab:
```env
OPENAI_API_KEY=sk-your-key-here
FLASK_ENV=production
FLASK_DEBUG=False
PORT=5000
```

### Step 5: Deploy
1. Click **"Deploy"**
2. Wait for build (2-3 minutes)
3. Your backend will be live at: `https://[your-app].up.railway.app`

---

## Configuration Files

### railway.json
Create this file in the `backend/` directory:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "pip install -r requirements.txt"
  },
  "deploy": {
    "startCommand": "python app.py",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### Procfile
Create this file in the `backend/` directory:

```
web: gunicorn -w 4 -b 0.0.0.0:$PORT app:app
```

Then add gunicorn to requirements.txt:
```bash
echo "gunicorn==21.2.0" >> backend/requirements.txt
```

---

## Production Optimization

### Use Gunicorn
Update start command to:
```bash
gunicorn -w 4 -b 0.0.0.0:$PORT app:app --timeout 120
```

### Add Health Check
Railway automatically monitors `/api/health` endpoint

### Enable Logging
```python
# In backend/app.py
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
```

---

## Monitoring

### View Logs
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# View logs
railway logs
```

### Metrics
- CPU usage
- Memory usage
- Network traffic
- Request count

---

## Scaling

### Vertical Scaling
Upgrade plan for more resources:
- **Hobby**: $5/month
- **Pro**: $20/month

### Horizontal Scaling
Deploy multiple instances (Pro plan required)

---

## Troubleshooting

### Build Fails
```bash
# Check Python version
python --version  # Should be 3.11+

# Verify requirements.txt
cat requirements.txt
```

### App Crashes
```bash
# Check logs
railway logs

# Common issues:
# - Missing OPENAI_API_KEY
# - Port binding issues
# - Import errors
```

### Slow Response
- Increase timeout in gunicorn
- Upgrade Railway plan
- Optimize API calls

---

## Cost Management

### Free Tier
- $5 credit/month
- ~500 hours runtime
- Perfect for testing

### Paid Plans
- **Hobby**: $5/month + usage
- **Pro**: $20/month + usage
- **Enterprise**: Custom pricing

### Optimize Costs
- Use efficient API calls
- Cache responses
- Implement rate limiting

---

**infinite♾2025** - Railway Deployment Complete!

