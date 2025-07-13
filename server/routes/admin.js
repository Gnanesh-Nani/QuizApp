const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const { 
  getAllUsers, 
  getUserStats, 
  createQuiz, 
  updateQuiz, 
  deleteQuiz, 
  getAllQuizzes,
  getQuizById 
} = require('../controllers/adminController');

// All admin routes require authentication and admin privileges
router.use(auth);
router.use(adminAuth);

// User management routes
router.get('/users', getAllUsers);
router.get('/users/:id/stats', getUserStats);

// Quiz management routes
router.get('/quizzes', getAllQuizzes);
router.get('/quizzes/:id', getQuizById);
router.post('/quizzes', createQuiz);
router.put('/quizzes/:id', updateQuiz);
router.delete('/quizzes/:id', deleteQuiz);

module.exports = router; 