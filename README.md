# Digital Memory Preservation - Deployment Guide

## 🚀 Full-Stack Application with PostgreSQL, Authentication & AI

### Project Structure
```
Digital-Memory-Preservation/
├── backend/          # Node.js + Express + TypeScript API
├── frontend/         # React + Vite + TypeScript
└── README.md
```

## 📋 Prerequisites
- Node.js 18+ and npm
- PostgreSQL database (Neon.tech account)
- Vercel account for deployment

## 🛠️ Local Development Setup

### 1. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:
```env
DATABASE_URL=postgresql://neondb_owner:npg_XtE69vzNsSgH@ep-soft-queen-a4377ljh-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

Start backend:
```bash
npm run dev
```

Backend will run on `http://localhost:3001` and automatically create all database tables.

### 2. Frontend Setup

```bash
cd frontend
npm install
```

Update `.env`:
```env
VITE_API_URL=http://localhost:3001/api
VITE_APP_NAME=Digital Memory Preservation
VITE_APP_VERSION=1.0.0
```

Start frontend:
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

## 🗄️ Database Schema

The application automatically creates these tables:
- **users** - User accounts with authentication
- **families** - Family groups
- **family_members** - Family membership with roles
- **memories** - User memories with AI analysis
- **memory_media** - Attached media files
- **life_events** - Extracted life events
- **relationships** - Memory connections for knowledge graph
- **insights** - AI-generated insights

## ✨ Features Implemented

### Authentication System
- ✅ User registration with email & password
- ✅ Login with JWT tokens
- ✅ Protected routes
- ✅ Profile management

### Family System
- ✅ Create families
- ✅ Add members by email
- ✅ Role-based access (admin/member)
- ✅ Family-specific memories

### Memory Management
- ✅ Create memories with rich metadata
- ✅ Emotional tags and core values
- ✅ Three visibility levels: Personal, Family, Universal
- ✅ AI analysis placeholder (ready for integration)
- ✅ Date and category organization

### Feed System
- ✅ Personal Feed - Your own memories
- ✅ Family Feed - Memories from your families
- ✅ Universal Feed - Public memories from all users
- ✅ Family filtering

### Visualization (Frontend Ready)
- Life Timeline
- Knowledge Graph
- Emotional Journey

## 🌐 Deployment to Vercel

### Deploy Backend

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Navigate to backend and deploy:
```bash
cd backend
npm run build
vercel
```

3. Set environment variables in Vercel dashboard:
```
DATABASE_URL=<your-neon-db-url>
JWT_SECRET=<your-secret-key>
NODE_ENV=production
FRONTEND_URL=<your-frontend-vercel-url>
```

4. Note your backend URL (e.g., `https://your-backend.vercel.app`)

### Deploy Frontend

1. Update frontend `.env` for production:
```env
VITE_API_URL=https://your-backend.vercel.app/api
```

2. Deploy frontend:
```bash
cd frontend
vercel
```

3. Your app is live! 🎉

## 📱 Usage Guide

### 1. Sign Up / Login
- Create an account with email and password
- Login to access the dashboard

### 2. Create a Family
- Go to Dashboard
- Create a new family
- Add members by their email addresses

### 3. Add Memories
- Click "Add Memory" in navigation
- Fill in title, date, description
- Select emotional tags and core values
- Choose visibility (Personal/Family/Universal)
- If Family, select which family to share with

### 4. View Feeds
- **Personal Feed**: See only your memories
- **Family Feed**: See memories from family members
- **Universal Feed**: Explore public memories

### 5. Visualizations
- View your life timeline
- Explore knowledge graph of connected memories
- Track emotional journey over time

## 🔒 Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT token authentication
- ✅ Role-based access control
- ✅ Input validation
- ✅ SQL injection protection
- ✅ CORS configuration

## 🤖 AI Integration (Ready)

The backend has placeholder AI analysis. To integrate real AI:

1. Add Google Gemini API key to backend `.env`:
```env
GEMINI_API_KEY=your-api-key
```

2. Update `backend/src/routes/memories.ts` `analyzeMemoryWithAI` function
3. Implement actual API calls to Gemini

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Families
- `POST /api/families` - Create family
- `GET /api/families` - Get user's families
- `GET /api/families/:id` - Get family details
- `POST /api/families/:id/members` - Add member
- `DELETE /api/families/:id/members/:userId` - Remove member

### Memories
- `POST /api/memories` - Create memory
- `GET /api/memories?feed=personal|family|universal` - Get memories
- `GET /api/memories/:id` - Get single memory
- `PUT /api/memories/:id` - Update memory
- `DELETE /api/memories/:id` - Delete memory
- `GET /api/memories/ai/insights` - Get AI insights

## 🐛 Troubleshooting

### Database Connection Issues
- Verify DATABASE_URL is correct
- Check Neon.tech database is active
- Ensure SSL mode is enabled

### CORS Errors
- Update FRONTEND_URL in backend .env
- Check Vercel environment variables

### Authentication Not Working
- Clear browser localStorage
- Verify JWT_SECRET is set
- Check token expiration (7 days default)

## 📝 Next Steps

1. **AI Integration**: Connect Google Gemini API for real memory analysis
2. **Media Upload**: Implement image/video upload with cloud storage
3. **Advanced Visualizations**: Enhance D3.js visualizations with real data
4. **Email Notifications**: Add email for family invitations
5. **Export Features**: Allow users to export their memories
6. **Search**: Implement full-text search across memories

## 🤝 Contributing

This is a full-stack application with:
- **Backend**: Express.js + TypeScript + PostgreSQL
- **Frontend**: React + Vite + TypeScript
- **Database**: Neon PostgreSQL
- **Deployment**: Vercel

## 📄 License

MIT License - Feel free to use for your projects!

---

**Built with ❤️ for preserving life stories**
