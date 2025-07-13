# MERN Quiz App

A full-stack quiz application built with the MERN stack (MongoDB, Express.js, React, Node.js) featuring user authentication, quiz taking, and detailed analytics.

## Features

### 🔐 Authentication
- User registration and login with username, email, and password
- JWT-based authentication with token storage in localStorage
- Protected routes for authenticated users only

### 📝 Quiz System
- Multiple-choice questions with options
- Timer-based quiz taking with automatic submission
- Question navigation with progress tracking
- Support for multiple quiz attempts

### 📊 Student Dashboard
- Comprehensive statistics overview
- Score progression charts using Recharts
- Recent quiz attempts with detailed results
- Average scores and time tracking
- Quiz performance analytics

### 🎯 Key Features
- Real-time timer during quiz taking
- Question-by-question navigation
- Visual progress indicators
- Responsive design with Tailwind CSS
- Clean and modern UI

## Tech Stack

### Frontend
- **React 19** with functional components and hooks
- **React Router** for navigation
- **Context API** for state management
- **Axios** for API communication
- **Recharts** for data visualization
- **Tailwind CSS** for styling

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **CORS** for cross-origin requests

## Project Structure

```
QUIZAPP/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── contexts/       # React contexts
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   └── utils/          # Utility functions
│   └── package.json
├── server/                 # Node.js backend
│   ├── config/            # Database configuration
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Custom middleware
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── seedData.js       # Sample data seeder
│   └── package.json
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd QUIZAPP
   ```

2. **Install backend dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Set up environment variables**
   
   Create a `.env` file in the server directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/quiz-app
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   NODE_ENV=development
   ```

5. **Start MongoDB**
   
   Make sure MongoDB is running on your system or update the MONGODB_URI to point to your MongoDB instance.

6. **Seed the database with sample data**
   ```bash
   cd server
   npm run seed
   ```

7. **Start the backend server**
   ```bash
   cd server
   npm run dev
   ```

8. **Start the frontend development server**
   ```bash
   cd client
   npm run dev
   ```

9. **Open your browser**
   
   Navigate to `http://localhost:5173` to access the application.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Quizzes
- `GET /api/quiz` - Get all active quizzes (protected)
- `GET /api/quiz/:id` - Get specific quiz (protected)
- `POST /api/quiz/:id/submit` - Submit quiz attempt (protected)

### Attempts
- `GET /api/attempts` - Get user's quiz attempts (protected)
- `GET /api/attempts/stats` - Get user's statistics (protected)
- `GET /api/attempts/:id` - Get specific attempt details (protected)

## Usage

1. **Register/Login**: Create an account or sign in with existing credentials
2. **Dashboard**: View available quizzes and your statistics
3. **Take Quiz**: Click "Start Quiz" to begin a quiz
4. **Quiz Interface**: 
   - Answer questions by selecting options
   - Navigate between questions using Previous/Next buttons
   - Use the question navigation grid to jump to specific questions
   - Monitor time remaining
5. **Results**: View your score and performance after completing a quiz
6. **Analytics**: Check your progress and statistics on the dashboard

## Sample Data

The application comes with three sample quizzes:
- JavaScript Fundamentals (5 questions, 15 minutes)
- React Basics (5 questions, 20 minutes)
- Node.js and Express (5 questions, 25 minutes)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please open an issue in the repository. 