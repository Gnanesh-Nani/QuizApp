# Quick Setup Guide

## Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud)
- npm or yarn

## Quick Start

### 1. Install Dependencies

**Backend:**
```bash
cd server
npm install
```

**Frontend:**
```bash
cd client
npm install
```

### 2. Set up Environment

Create `.env` file in the `server` directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/quiz-app
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

### 3. Start MongoDB

Make sure MongoDB is running on your system.

### 4. Seed Database

```bash
cd server
npm run seed
```

### 5. Start Servers

**Backend (Terminal 1):**
```bash
cd server
npm run dev
```

**Frontend (Terminal 2):**
```bash
cd client
npm run dev
```

### 6. Access Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## Features Available

✅ **Authentication**
- Register new account
- Login with email/password
- JWT token storage

✅ **Quiz System**
- Take quizzes with timer
- Multiple choice questions
- Question navigation
- Automatic submission

✅ **Dashboard**
- View available quizzes
- See statistics and progress
- Score progression charts
- Recent attempts

✅ **Sample Data**
- 3 pre-loaded quizzes
- JavaScript, React, and Node.js topics

## Troubleshooting

1. **MongoDB Connection Error**: Make sure MongoDB is running
2. **Port Already in Use**: Change PORT in .env file
3. **Frontend Not Loading**: Check if backend is running on port 5000

## API Endpoints

- `POST /api/auth/register` - Register
- `POST /api/auth/login` - Login
- `GET /api/quiz` - Get quizzes
- `POST /api/quiz/:id/submit` - Submit quiz
- `GET /api/attempts/stats` - Get statistics 