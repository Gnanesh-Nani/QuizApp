# MERN Quiz App

A full-stack quiz application built with the MERN stack (MongoDB, Express.js, React, Node.js) featuring user authentication, quiz taking, admin management, and detailed analytics.

---

## Features

- **Authentication:** Register/login, JWT-based, protected routes
- **Quiz System:** Multiple-choice, timer, navigation, auto-submit, analytics
- **Admin Panel:** Create/edit quizzes, manage questions, view analytics
- **Student Dashboard:** Stats, charts, recent attempts, progress
- **Responsive UI:** Modern dark theme, custom CSS modules
- **Sample Data:** JavaScript, React, Node.js, and AdTech quizzes

---

## Tech Stack

**Frontend:**  
- React (Vite)  
- React Router  
- Context API  
- Axios  
- Recharts  
- CSS Modules

**Backend:**  
- Node.js, Express.js  
- MongoDB, Mongoose  
- JWT, bcryptjs  
- CORS

---

## Project Structure

```
QUIZAPP/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components (e.g., DebugUser)
│   │   ├── contexts/       # AuthContext for state management
│   │   ├── pages/          # Pages: Dashboard, Quiz, Results, Admin, etc.
│   │   ├── services/       # API and adminAPI
│   │   ├── styles/         # CSS modules for theming
│   │   ├── assets/         # Static assets (e.g., react.svg)
│   │   └── utils/          # (empty, for future utilities)
│   ├── public/             # Static files (e.g., vite.svg)
│   ├── vite.config.js
│   ├── eslint.config.js
│   └── package.json
├── server/                 # Node.js backend
│   ├── config/             # db.js (MongoDB connection)
│   ├── controllers/        # quiz, attempts, auth, admin controllers
│   ├── middleware/         # auth, adminAuth
│   ├── models/             # User, Quiz, QuizAttempt
│   ├── routes/             # auth, quiz, attempts, admin
│   ├── scripts/            # createAdmin.js, checkAdmin.js
│   ├── seedData.js         # Seeds quizzes (including AdTech)
│   ├── server.js           # Entry point
│   ├── env.example         # Example environment config
│   └── package.json
├── SETUP.md                # Quick setup guide
├── README.md               # Project documentation
└── .gitignore
```

---

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd QUIZAPP
   ```

2. **Install dependencies**
   ```bash
   cd server && npm install
   cd ../client && npm install
   ```

3. **Set up environment variables**
   - Copy `server/env.example` to `server/.env` and fill in your values.

4. **Seed the database**
   ```bash
   cd server
   npm run seed
   ```

5. **Create admin user (optional)**
   ```bash
   cd server
   node scripts/createAdmin.js
   ```

6. **Start the app**
   - From the root directory:
     ```bash
     npm install concurrently --save-dev
     npm start
     ```
   - Or, in separate terminals:
     ```bash
     cd server && npm run dev
     cd client && npm run dev
     ```

7. **Access the app**
   - Frontend: [http://localhost:5173](http://localhost:5173)
   - Backend: [http://localhost:5000](http://localhost:5000)

---

## API Endpoints

- `POST /api/auth/register` - Register
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `GET /api/quiz` - Get all quizzes
- `GET /api/quiz/:id` - Get quiz by ID
- `POST /api/quiz/:id/submit` - Submit quiz attempt
- `GET /api/attempts` - Get user attempts
- `GET /api/attempts/stats` - Get user stats
- `GET /api/attempts/:id` - Get attempt details
- `GET /api/admin/...` - Admin endpoints

---

## Usage

- **Register/Login** as a user or admin
- **Dashboard:** View quizzes, stats, and progress
- **Take Quiz:** Timed, multiple-choice, auto-submit
- **Admin:** Create/edit quizzes, manage questions
- **Results:** See scores, correct/incorrect answers, analytics

---

## Sample Data

- JavaScript Fundamentals
- React Basics
- Node.js and Express
- AdTech Essentials (20 questions)

---

## Contributing

1. Fork the repo
2. Create a feature branch
3. Make changes and test
4. Submit a pull request

---

## License

MIT

---

## Support

Open an issue in the repository for help or questions. 