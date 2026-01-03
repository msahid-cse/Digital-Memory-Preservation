# 🚀 Quick Start Guide

## ⚡ Get Started in 3 Minutes

### Step 1: Start Backend (Already Running! ✅)
Your backend is already running on `http://localhost:3001`

### Step 2: Start Frontend
```bash
# Open a new terminal
cd frontend
npm run dev
```

### Step 3: Open Browser
Navigate to: `http://localhost:5173`

---

## 🎯 First-Time User Flow

### 1. Create Account (30 seconds)
- Click "Sign Up" tab
- Enter:
  - Full Name: `John Doe`
  - Email: `john@example.com`
  - Password: `password123` (min 6 characters)
- Click "Sign Up"
- ✅ You're logged in!

### 2. Create Your First Family (1 minute)
- Click "Dashboard" in navigation
- Click "👨‍👩‍👧‍👦 Families" tab
- Click "+ Create Family"
- Enter:
  - Family Name: `The Smiths`
  - Description: `Our family memories`
- Click "Create Family"
- ✅ Family created!

### 3. Add a Family Member (30 seconds)
- In your family card, click "+ Add Member"
- Enter member's email (they must register first)
- Click "Add"
- ✅ Member added!

### 4. Add Your First Memory (1 minute)
- Click "Add Memory" in navigation
- Fill in:
  - Title: `My First Day at College`
  - Date: `2010-09-15`
  - Category: `Education`
  - Description: `I was nervous but excited...`
  - Emotional Tags: Select `Excitement`, `Nervousness`
  - Core Values: Select `Growth`, `Courage`
  - Visibility: Choose `Personal` or `Family`
- Click "Save Memory"
- ✅ Memory saved!

### 5. View Your Feeds (30 seconds)
- Click "Feed" in navigation
- Try all three tabs:
  - 👤 **Personal**: Your memories only
  - 👨‍👩‍👧‍👦 **Family**: Memories from family members
  - 🌍 **Universal**: Public memories from everyone

---

## 🎨 Explore Features

### Dashboard
- View memory statistics
- See core values chart
- Manage families
- View memory details

### Visualizations
- Life Timeline: See memories chronologically
- Knowledge Graph: Explore connections
- Emotional Journey: Track emotions over time

---

## 🔑 Test Accounts

Create multiple accounts to test family features:

**Account 1:**
- Email: `alice@example.com`
- Password: `password123`

**Account 2:**
- Email: `bob@example.com`
- Password: `password123`

Then add Bob to Alice's family using his email!

---

## 📱 Quick Tips

✅ **Logout**: Click "Logout" button in navbar
✅ **Switch Views**: Use navbar to navigate
✅ **Edit Profile**: Click your name in navbar
✅ **Filter Feeds**: Use family dropdown in Family Feed
✅ **View Details**: Click memory cards in Dashboard

---

## 🚀 Deploy to Production

### Quick Deploy (5 minutes)

1. **Backend**:
```bash
cd backend
vercel
```

2. **Frontend**:
Update `.env` with backend URL, then:
```bash
cd frontend
vercel
```

3. **Done!** 🎉

---

## ❓ Need Help?

- **Database Issues**: Check `backend/.env` for DATABASE_URL
- **API Errors**: Check backend terminal for errors
- **Login Issues**: Clear browser localStorage
- **CORS Errors**: Verify FRONTEND_URL in backend `.env`

---

## 📚 Full Documentation

- `README.md` - Complete deployment guide
- `IMPLEMENTATION_SUMMARY.md` - Detailed feature list
- `backend/src/routes/` - API endpoint code

---

**Happy Memory Preserving! 🎉**
