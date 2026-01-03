# 🚀 Deployment Guide - Digital Memory Preservation

## Table of Contents
1. [Local Development](#local-development)
2. [Frontend Deployment](#frontend-deployment)
3. [Backend Deployment](#backend-deployment)
4. [Database Setup](#database-setup)
5. [AI Models Setup](#ai-models-setup)
6. [Production Checklist](#production-checklist)

---

## 🏠 Local Development

### 1. Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

Access at: `http://localhost:5173`

### 2. Backend (Django)

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Access at: `http://localhost:8000`

---

## 🌐 Frontend Deployment

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Deploy**
```bash
cd frontend
vercel --prod
```

3. **Environment Variables**
Set in Vercel dashboard:
- `VITE_API_URL`: Your backend API URL

### Option 2: Netlify

1. **Install Netlify CLI**
```bash
npm install -g netlify-cli
```

2. **Build**
```bash
npm run build
```

3. **Deploy**
```bash
netlify deploy --prod --dir=dist
```

### Option 3: GitHub Pages

1. **Update vite.config.ts**
```typescript
export default defineConfig({
  base: '/Digital-Memory-Preservation/',
  // ... rest of config
})
```

2. **Build and Deploy**
```bash
npm run build
npm run deploy
```

---

## 🔧 Backend Deployment

### Option 1: Railway (Recommended)

1. **Install Railway CLI**
```bash
npm install -g @railway/cli
```

2. **Login and Initialize**
```bash
railway login
railway init
```

3. **Add PostgreSQL**
```bash
railway add postgresql
```

4. **Deploy**
```bash
railway up
```

5. **Set Environment Variables**
```bash
railway variables set SECRET_KEY=your-secret-key
railway variables set DEBUG=False
railway variables set ALLOWED_HOSTS=your-domain.railway.app
```

### Option 2: Heroku

1. **Create Heroku App**
```bash
heroku create digital-memory-api
```

2. **Add PostgreSQL**
```bash
heroku addons:create heroku-postgresql:hobby-dev
```

3. **Set Environment Variables**
```bash
heroku config:set SECRET_KEY=your-secret-key
heroku config:set DEBUG=False
```

4. **Deploy**
```bash
git push heroku main
```

5. **Run Migrations**
```bash
heroku run python manage.py migrate
heroku run python manage.py createsuperuser
```

### Option 3: DigitalOcean App Platform

1. **Create App**
- Connect GitHub repository
- Select Python as runtime
- Set build command: `pip install -r requirements.txt`
- Set run command: `gunicorn config.wsgi:application`

2. **Add Database**
- Add PostgreSQL database component
- Environment variables auto-configured

3. **Deploy**
- Push to main branch to trigger deployment

---

## 🗄️ Database Setup

### PostgreSQL (Required)

**Local Setup:**
```bash
# Install PostgreSQL
# Create database
createdb digital_memory

# Create user
psql -c "CREATE USER digital_user WITH PASSWORD 'secure_password';"
psql -c "GRANT ALL PRIVILEGES ON DATABASE digital_memory TO digital_user;"
```

**Production:**
- Use managed PostgreSQL (Railway, Heroku, DigitalOcean)
- Enable SSL connections
- Set up automated backups

### Neo4j (Optional - for Knowledge Graph)

**Local Setup:**
```bash
# Download Neo4j Desktop or use Docker
docker run -d \
  --name neo4j \
  -p 7474:7474 -p 7687:7687 \
  -e NEO4J_AUTH=neo4j/password \
  neo4j:latest
```

**Production:**
- Use Neo4j Aura (managed cloud service)
- Or deploy Neo4j on your server

### Redis (Optional - for Caching)

**Local Setup:**
```bash
# Install Redis
# On macOS:
brew install redis
redis-server

# On Ubuntu:
sudo apt-get install redis-server
sudo systemctl start redis
```

**Production:**
- Use Redis Cloud
- Or Railway Redis addon
- Or Heroku Redis addon

---

## 🤖 AI Models Setup

### First-Time Setup

The AI models will auto-download on first use. To pre-download:

```bash
cd ai_engine
python -c "
from transformers import pipeline
from sentence_transformers import SentenceTransformer

# Download models
pipeline('zero-shot-classification', model='facebook/bart-large-mnli')
pipeline('text-classification', model='j-hartmann/emotion-english-distilroberta-base')
pipeline('summarization', model='facebook/bart-large-cnn')
SentenceTransformer('all-MiniLM-L6-v2')
"
```

### Model Storage

**Local:**
- Models stored in `~/.cache/huggingface/`
- Approximately 5GB total

**Production:**
- Pre-download models during build
- Use persistent storage volume
- Consider model caching service

---

## ✅ Production Checklist

### Security
- [ ] Change `SECRET_KEY` to strong random value
- [ ] Set `DEBUG=False`
- [ ] Configure `ALLOWED_HOSTS`
- [ ] Enable HTTPS/SSL
- [ ] Set up CORS properly
- [ ] Enable CSRF protection
- [ ] Use environment variables for secrets
- [ ] Set up rate limiting
- [ ] Enable database SSL

### Performance
- [ ] Enable Redis caching
- [ ] Set up CDN for static files
- [ ] Configure database connection pooling
- [ ] Enable gzip compression
- [ ] Optimize images and assets
- [ ] Set up Celery for async tasks
- [ ] Configure proper logging

### Monitoring
- [ ] Set up error tracking (Sentry)
- [ ] Configure application monitoring
- [ ] Set up database monitoring
- [ ] Enable access logs
- [ ] Configure alerts

### Backup
- [ ] Automated database backups
- [ ] Media files backup
- [ ] Configuration backup
- [ ] Disaster recovery plan

---

## 🐳 Docker Deployment

### Docker Compose Setup

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  frontend:
    build: ./frontend
    ports:
      - "3000:80"
    depends_on:
      - backend

  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/digital_memory
      - REDIS_URL=redis://redis:6379/0
    depends_on:
      - db
      - redis

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=digital_memory
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  neo4j:
    image: neo4j:5
    ports:
      - "7474:7474"
      - "7687:7687"
    environment:
      - NEO4J_AUTH=neo4j/password
    volumes:
      - neo4j_data:/data

volumes:
  postgres_data:
  neo4j_data:
```

### Deploy with Docker

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

---

## 🌍 Domain & DNS Setup

1. **Purchase Domain**
   - Recommended: Namecheap, Google Domains, Cloudflare

2. **Configure DNS**
   ```
   A     @              -> Your server IP
   CNAME www            -> your-domain.com
   CNAME api            -> backend-url.railway.app
   ```

3. **SSL Certificate**
   - Use Let's Encrypt (free)
   - Or Cloudflare SSL

---

## 📊 Scaling Considerations

### Horizontal Scaling
- Use load balancer (Nginx, Cloudflare)
- Deploy multiple backend instances
- Use managed database with read replicas

### Vertical Scaling
- Increase server resources
- Optimize database queries
- Use caching aggressively

### CDN
- CloudFlare for global distribution
- AWS CloudFront
- Vercel Edge Network

---

## 🆘 Troubleshooting

### Common Issues

**Frontend not connecting to backend:**
- Check CORS settings
- Verify API URL in `.env`
- Check network tab in browser

**Database connection errors:**
- Verify database credentials
- Check if database service is running
- Ensure SSL settings match

**AI models not loading:**
- Check internet connection
- Verify sufficient disk space
- Check model cache directory permissions

**Memory issues:**
- Increase server RAM
- Optimize model loading
- Use model quantization

---

## 📞 Support

For deployment help:
- Email: support@digitalmemory.ai
- Discord: [Join our community](https://discord.gg/digitalmemory)
- Documentation: https://docs.digitalmemory.ai

---

**Happy Deploying! 🚀**
