# ArciTEK.AI Deployment Guide

**infinite♾2025** | Next-Level AI Creation Studio

## Quick Start

### Local Development

#### Frontend
```bash
cd arcitekAI
pnpm install
pnpm run dev
```
Access at: http://localhost:5173

#### Backend
```bash
cd arcitekAI/backend
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Add your OPENAI_API_KEY to .env

python app.py
```
Access at: http://localhost:5000

## Production Deployment

### Option 1: Deploy to Vercel (Frontend) + Railway (Backend)

#### Frontend (Vercel)
1. Push code to GitHub (already done!)
2. Go to https://vercel.com
3. Import repository: `NaTo1000/arcitekAI`
4. Configure:
   - Framework: Vite
   - Root Directory: `./`
   - Build Command: `pnpm run build`
   - Output Directory: `dist`
5. Deploy

#### Backend (Railway)
1. Go to https://railway.app
2. Create new project from GitHub repo
3. Configure:
   - Root Directory: `backend`
   - Start Command: `python app.py`
4. Add environment variable:
   - `OPENAI_API_KEY`: your_key_here
5. Deploy

#### Update Frontend API URL
After backend deployment, update the API URL in frontend:
```javascript
// In MusicStudio.jsx, ImageLab.jsx, StoryWriter.jsx
// Change: http://localhost:5000
// To: https://your-railway-app.railway.app
```

### Option 2: Deploy to Cloudflare (Full Stack)

#### Using Cloudflare Pages + Workers

1. **Frontend on Cloudflare Pages**
   ```bash
   pnpm run build
   # Upload dist/ folder to Cloudflare Pages
   ```

2. **Backend as Cloudflare Worker**
   - Convert Flask app to Cloudflare Worker
   - Use Cloudflare AI for image generation
   - Deploy to workers.dev

3. **Custom Domain: infinite2025.com**
   - Add domain in Cloudflare dashboard
   - Point DNS to Cloudflare Pages
   - Enable SSL/TLS

### Option 3: Self-Hosted (VPS/Dedicated Server)

#### Requirements
- Ubuntu 22.04 or similar
- Node.js 22+
- Python 3.11+
- Nginx (reverse proxy)
- SSL certificate (Let's Encrypt)

#### Setup Script
```bash
# Install dependencies
sudo apt update
sudo apt install -y nodejs npm python3.11 python3-pip nginx certbot

# Clone repository
git clone https://github.com/NaTo1000/arcitekAI.git
cd arcitekAI

# Setup backend
cd backend
python3.11 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
# Add .env with OPENAI_API_KEY

# Setup frontend
cd ..
npm install -g pnpm
pnpm install
pnpm run build

# Configure Nginx
sudo nano /etc/nginx/sites-available/arcitekAI
```

#### Nginx Configuration
```nginx
server {
    listen 80;
    server_name infinite2025.com www.infinite2025.com;

    # Frontend
    location / {
        root /path/to/arcitekAI/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

#### Process Management (PM2)
```bash
# Install PM2
npm install -g pm2

# Start backend
cd backend
pm2 start app.py --name arcitekAI-backend --interpreter python3.11

# Save PM2 configuration
pm2 save
pm2 startup
```

## Environment Variables

### Backend (.env)
```env
OPENAI_API_KEY=sk-...your_key_here
FLASK_ENV=production
FLASK_DEBUG=False
```

### Frontend (Optional)
```env
VITE_API_URL=https://api.infinite2025.com
```

## Domain Configuration (infinite2025.com)

### Cloudflare DNS Settings
```
Type    Name    Content                 Proxy
A       @       your_server_ip          Proxied
CNAME   www     infinite2025.com        Proxied
CNAME   api     backend.railway.app     Proxied
```

### SSL/TLS
- Enable "Full (strict)" SSL/TLS encryption mode
- Enable "Always Use HTTPS"
- Enable "Automatic HTTPS Rewrites"

## Performance Optimization

### Frontend
- Enable Cloudflare CDN
- Compress images
- Enable HTTP/2
- Use lazy loading

### Backend
- Use production WSGI server (Gunicorn)
```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```
- Enable Redis caching
- Use CDN for static assets

## Security

### API Keys
- Never commit `.env` files
- Use environment variables
- Rotate keys regularly

### CORS
- Update CORS settings in production
- Whitelist specific domains only

### Rate Limiting
```python
from flask_limiter import Limiter

limiter = Limiter(
    app,
    key_func=lambda: request.remote_addr,
    default_limits=["100 per hour"]
)
```

## Monitoring

### Health Check
```bash
curl https://api.infinite2025.com/api/health
```

### Logs
```bash
# Backend logs
pm2 logs arcitekAI-backend

# Nginx logs
sudo tail -f /var/log/nginx/access.log
```

## Scaling

### Horizontal Scaling
- Deploy multiple backend instances
- Use load balancer (Nginx/HAProxy)
- Shared Redis cache

### Vertical Scaling
- Increase server resources
- Optimize database queries
- Use CDN for assets

## Backup

### Code
- GitHub repository (already set up)
- Regular commits and tags

### Data
```bash
# Backup outputs
tar -czf outputs_backup_$(date +%Y%m%d).tar.gz backend/outputs/
```

## Troubleshooting

### Frontend won't build
```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
pnpm run build
```

### Backend errors
```bash
# Check logs
tail -f /tmp/backend.log

# Verify dependencies
pip install -r requirements.txt --upgrade

# Test API
curl http://localhost:5000/api/health
```

### CORS issues
- Update CORS settings in `backend/app.py`
- Check browser console for errors

## Support

For issues and questions:
- GitHub: https://github.com/NaTo1000/arcitekAI/issues
- Documentation: https://github.com/NaTo1000/arcitekAI

---

**infinite♾2025** - Built with cutting-edge AI technology

