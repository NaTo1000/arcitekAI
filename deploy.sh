#!/bin/bash
# ArciTEK.AI Quick Deployment Script
# infinite♾2025

set -e

echo "============================================================"
echo "  ArciTEK.AI Deployment Script"
echo "  infinite♾2025"
echo "============================================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${CYAN}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check if running as root
if [ "$EUID" -eq 0 ]; then 
    print_error "Please do not run this script as root"
    exit 1
fi

# Deployment type selection
echo "Select deployment type:"
echo "1) Development (Local)"
echo "2) Production (VPS/Server)"
echo "3) Docker (Containerized)"
read -p "Enter choice [1-3]: " deploy_type

case $deploy_type in
    1)
        echo ""
        print_status "Starting Development Deployment..."
        
        # Check Node.js
        if ! command -v node &> /dev/null; then
            print_error "Node.js is not installed. Please install Node.js 22+ first."
            exit 1
        fi
        
        # Check Python
        if ! command -v python3 &> /dev/null; then
            print_error "Python 3 is not installed. Please install Python 3.11+ first."
            exit 1
        fi
        
        # Install frontend dependencies
        print_status "Installing frontend dependencies..."
        if ! command -v pnpm &> /dev/null; then
            npm install -g pnpm
        fi
        pnpm install
        print_success "Frontend dependencies installed"
        
        # Setup backend
        print_status "Setting up backend..."
        cd backend
        
        if [ ! -d "venv" ]; then
            python3 -m venv venv
        fi
        
        source venv/bin/activate
        pip install -r requirements.txt
        print_success "Backend dependencies installed"
        
        # Check for .env file
        if [ ! -f ".env" ]; then
            print_warning ".env file not found"
            read -p "Enter your OpenAI API key: " api_key
            echo "OPENAI_API_KEY=$api_key" > .env
            echo "FLASK_ENV=development" >> .env
            echo "FLASK_DEBUG=True" >> .env
            print_success ".env file created"
        fi
        
        cd ..
        
        print_success "Development setup complete!"
        echo ""
        echo "To start the application:"
        echo "  Terminal 1: cd backend && source venv/bin/activate && python app.py"
        echo "  Terminal 2: pnpm run dev"
        echo ""
        ;;
        
    2)
        echo ""
        print_status "Starting Production Deployment..."
        
        # Update system
        print_status "Updating system packages..."
        sudo apt update
        
        # Install Node.js if not present
        if ! command -v node &> /dev/null; then
            print_status "Installing Node.js..."
            curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
            sudo apt install -y nodejs
        fi
        
        # Install Python if not present
        if ! command -v python3.11 &> /dev/null; then
            print_status "Installing Python 3.11..."
            sudo apt install -y python3.11 python3.11-venv python3-pip
        fi
        
        # Install Nginx
        if ! command -v nginx &> /dev/null; then
            print_status "Installing Nginx..."
            sudo apt install -y nginx
        fi
        
        # Install PM2
        if ! command -v pm2 &> /dev/null; then
            print_status "Installing PM2..."
            sudo npm install -g pm2
        fi
        
        # Install pnpm
        if ! command -v pnpm &> /dev/null; then
            sudo npm install -g pnpm
        fi
        
        # Build frontend
        print_status "Building frontend..."
        pnpm install
        pnpm run build
        print_success "Frontend built successfully"
        
        # Setup backend
        print_status "Setting up backend..."
        cd backend
        
        if [ ! -d "venv" ]; then
            python3.11 -m venv venv
        fi
        
        source venv/bin/activate
        pip install -r requirements.txt
        pip install gunicorn
        
        # Check for .env file
        if [ ! -f ".env" ]; then
            print_warning ".env file not found"
            read -p "Enter your OpenAI API key: " api_key
            echo "OPENAI_API_KEY=$api_key" > .env
            echo "FLASK_ENV=production" >> .env
            echo "FLASK_DEBUG=False" >> .env
            print_success ".env file created"
        fi
        
        cd ..
        
        # Create PM2 ecosystem file
        print_status "Creating PM2 configuration..."
        cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'arcitekAI-backend',
    cwd: './backend',
    script: 'venv/bin/gunicorn',
    args: '-w 4 -b 0.0.0.0:5000 app:app',
    env: {
      FLASK_ENV: 'production'
    }
  }]
}
EOF
        
        # Start backend with PM2
        print_status "Starting backend with PM2..."
        pm2 start ecosystem.config.js
        pm2 save
        pm2 startup
        
        # Configure Nginx
        print_status "Configuring Nginx..."
        read -p "Enter your domain name (e.g., infinite2025.com): " domain
        
        sudo tee /etc/nginx/sites-available/arcitekAI > /dev/null << EOF
server {
    listen 80;
    server_name $domain www.$domain;

    # Frontend
    location / {
        root $(pwd)/dist;
        try_files \$uri \$uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # Output files
    location /api/outputs {
        proxy_pass http://localhost:5000;
        proxy_set_header Host \$host;
    }
}
EOF
        
        sudo ln -sf /etc/nginx/sites-available/arcitekAI /etc/nginx/sites-enabled/
        sudo nginx -t
        sudo systemctl restart nginx
        
        print_success "Nginx configured and restarted"
        
        # SSL Certificate
        print_status "Setting up SSL certificate..."
        read -p "Install SSL certificate with Let's Encrypt? (y/n): " install_ssl
        
        if [ "$install_ssl" = "y" ]; then
            sudo apt install -y certbot python3-certbot-nginx
            sudo certbot --nginx -d $domain -d www.$domain
            print_success "SSL certificate installed"
        fi
        
        print_success "Production deployment complete!"
        echo ""
        echo "Your application is now running at:"
        echo "  http://$domain (or https:// if SSL is enabled)"
        echo ""
        echo "Useful commands:"
        echo "  pm2 status          - Check backend status"
        echo "  pm2 logs            - View backend logs"
        echo "  pm2 restart all     - Restart backend"
        echo "  sudo systemctl status nginx - Check Nginx status"
        echo ""
        ;;
        
    3)
        echo ""
        print_status "Starting Docker Deployment..."
        
        # Check if Docker is installed
        if ! command -v docker &> /dev/null; then
            print_error "Docker is not installed. Please install Docker first."
            exit 1
        fi
        
        # Create Dockerfile for backend
        print_status "Creating Docker configuration..."
        
        cat > backend/Dockerfile << 'EOF'
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5000

CMD ["python", "app.py"]
EOF
        
        # Create Dockerfile for frontend
        cat > Dockerfile << 'EOF'
FROM node:22-alpine as build

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install

COPY . .
RUN pnpm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
EOF
        
        # Create nginx config for Docker
        cat > nginx.conf << 'EOF'
server {
    listen 80;
    server_name localhost;

    location / {
        root /usr/share/nginx/html;
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://backend:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
EOF
        
        # Create docker-compose.yml
        cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  backend:
    build: ./backend
    container_name: arcitekAI-backend
    ports:
      - "5000:5000"
    environment:
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - FLASK_ENV=production
    volumes:
      - ./backend/outputs:/app/outputs
    restart: unless-stopped

  frontend:
    build: .
    container_name: arcitekAI-frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: unless-stopped
EOF
        
        # Create .env for Docker
        if [ ! -f ".env" ]; then
            read -p "Enter your OpenAI API key: " api_key
            echo "OPENAI_API_KEY=$api_key" > .env
        fi
        
        print_success "Docker configuration created"
        
        # Build and run
        print_status "Building Docker images..."
        docker-compose build
        
        print_status "Starting containers..."
        docker-compose up -d
        
        print_success "Docker deployment complete!"
        echo ""
        echo "Your application is now running at:"
        echo "  http://localhost"
        echo ""
        echo "Useful commands:"
        echo "  docker-compose ps           - Check container status"
        echo "  docker-compose logs -f      - View logs"
        echo "  docker-compose restart      - Restart containers"
        echo "  docker-compose down         - Stop containers"
        echo ""
        ;;
        
    *)
        print_error "Invalid choice"
        exit 1
        ;;
esac

echo "============================================================"
echo "  Deployment Complete - infinite♾2025"
echo "============================================================"

