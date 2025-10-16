# Deploy ArciTEK.AI with Docker

**infinite♾2025** | Docker Containerized Deployment

## Quick Start

```bash
# Clone repository
git clone https://github.com/NaTo1000/arcitekAI.git
cd arcitekAI

# Create .env file
echo "OPENAI_API_KEY=your_key_here" > .env

# Run deployment script
chmod +x deploy.sh
./deploy.sh
# Select option 3 (Docker)
```

---

## Manual Docker Deployment

### Prerequisites
- Docker 20.10+
- Docker Compose 2.0+
- OpenAI API key

### Step 1: Create Docker Files

#### Backend Dockerfile
Create `backend/Dockerfile`:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY . .

# Create output directories
RUN mkdir -p outputs/music outputs/images outputs/stories

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD python -c "import requests; requests.get('http://localhost:5000/api/health')"

# Run application
CMD ["python", "app.py"]
```

#### Frontend Dockerfile
Create `Dockerfile` in root:

```dockerfile
# Build stage
FROM node:22-alpine as build

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source
COPY . .

# Build application
RUN pnpm run build

# Production stage
FROM nginx:alpine

# Copy built files
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s \
    CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
```

#### Nginx Configuration
Create `nginx.conf`:

```nginx
server {
    listen 80;
    server_name localhost;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Frontend
    location / {
        root /usr/share/nginx/html;
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # Backend API proxy
    location /api {
        proxy_pass http://backend:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Timeouts for AI generation
        proxy_connect_timeout 300s;
        proxy_send_timeout 300s;
        proxy_read_timeout 300s;
    }
}
```

### Step 2: Create Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: arcitekAI-backend
    ports:
      - "5000:5000"
    environment:
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - FLASK_ENV=production
      - FLASK_DEBUG=False
    volumes:
      - ./backend/outputs:/app/outputs
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "python", "-c", "import requests; requests.get('http://localhost:5000/api/health')"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    networks:
      - arcitekAI-network

  frontend:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: arcitekAI-frontend
    ports:
      - "80:80"
      - "443:443"
    depends_on:
      backend:
        condition: service_healthy
    restart: unless-stopped
    networks:
      - arcitekAI-network

networks:
  arcitekAI-network:
    driver: bridge

volumes:
  outputs:
    driver: local
```

### Step 3: Environment Variables

Create `.env` file:

```env
OPENAI_API_KEY=sk-your-openai-api-key-here
```

### Step 4: Build and Run

```bash
# Build images
docker-compose build

# Start containers
docker-compose up -d

# View logs
docker-compose logs -f

# Check status
docker-compose ps
```

---

## Production Deployment

### With SSL/TLS (Let's Encrypt)

#### docker-compose.prod.yml
```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    container_name: arcitekAI-backend
    environment:
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - FLASK_ENV=production
    volumes:
      - ./backend/outputs:/app/outputs
    restart: unless-stopped
    networks:
      - arcitekAI-network

  frontend:
    build: .
    container_name: arcitekAI-frontend
    depends_on:
      - backend
    restart: unless-stopped
    networks:
      - arcitekAI-network

  nginx:
    image: nginx:alpine
    container_name: arcitekAI-nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx-prod.conf:/etc/nginx/conf.d/default.conf
      - ./certbot/conf:/etc/letsencrypt
      - ./certbot/www:/var/www/certbot
    depends_on:
      - frontend
    restart: unless-stopped
    networks:
      - arcitekAI-network

  certbot:
    image: certbot/certbot
    container_name: arcitekAI-certbot
    volumes:
      - ./certbot/conf:/etc/letsencrypt
      - ./certbot/www:/var/www/certbot
    entrypoint: "/bin/sh -c 'trap exit TERM; while :; do certbot renew; sleep 12h & wait $${!}; done;'"

networks:
  arcitekAI-network:
    driver: bridge
```

#### SSL Setup Script
```bash
#!/bin/bash
# ssl-setup.sh

DOMAIN="infinite2025.com"
EMAIL="admin@infinite2025.com"

# Create certbot directories
mkdir -p certbot/conf certbot/www

# Get certificate
docker-compose -f docker-compose.prod.yml run --rm certbot \
  certonly --webroot --webroot-path=/var/www/certbot \
  --email $EMAIL \
  --agree-tos \
  --no-eff-email \
  -d $DOMAIN \
  -d www.$DOMAIN

# Restart nginx
docker-compose -f docker-compose.prod.yml restart nginx
```

---

## Management Commands

### Start/Stop
```bash
# Start
docker-compose up -d

# Stop
docker-compose down

# Restart
docker-compose restart

# Stop and remove volumes
docker-compose down -v
```

### Logs
```bash
# All logs
docker-compose logs -f

# Backend only
docker-compose logs -f backend

# Frontend only
docker-compose logs -f frontend

# Last 100 lines
docker-compose logs --tail=100
```

### Updates
```bash
# Pull latest code
git pull origin master

# Rebuild and restart
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Backup
```bash
# Backup outputs
docker run --rm -v arcitekAI_outputs:/data -v $(pwd):/backup \
  alpine tar czf /backup/outputs-backup-$(date +%Y%m%d).tar.gz /data

# Restore outputs
docker run --rm -v arcitekAI_outputs:/data -v $(pwd):/backup \
  alpine tar xzf /backup/outputs-backup-YYYYMMDD.tar.gz -C /
```

---

## Monitoring

### Resource Usage
```bash
# Container stats
docker stats

# Disk usage
docker system df

# Network info
docker network inspect arcitekAI-network
```

### Health Checks
```bash
# Backend health
curl http://localhost:5000/api/health

# Frontend health
curl http://localhost/

# Container health
docker inspect --format='{{.State.Health.Status}}' arcitekAI-backend
```

---

## Troubleshooting

### Container Won't Start
```bash
# Check logs
docker-compose logs backend

# Inspect container
docker inspect arcitekAI-backend

# Check environment variables
docker-compose config
```

### Port Already in Use
```bash
# Find process using port
sudo lsof -i :80
sudo lsof -i :5000

# Kill process
sudo kill -9 <PID>

# Or change ports in docker-compose.yml
```

### Out of Disk Space
```bash
# Clean up
docker system prune -a

# Remove unused volumes
docker volume prune

# Check space
df -h
```

---

## Performance Optimization

### Resource Limits
```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 4G
        reservations:
          cpus: '1'
          memory: 2G
```

### Caching
```dockerfile
# Use BuildKit cache
RUN --mount=type=cache,target=/root/.cache/pip \
    pip install -r requirements.txt
```

---

## Security

### Best Practices
- Never commit `.env` files
- Use secrets management
- Regular security updates
- Limit container privileges
- Use non-root users

### Secrets Management
```yaml
services:
  backend:
    secrets:
      - openai_api_key

secrets:
  openai_api_key:
    file: ./secrets/openai_key.txt
```

---

**infinite♾2025** - Docker Deployment Complete!

