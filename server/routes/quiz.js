const express = require('express');
const router = express.Router();
const { getQuizzes, getQuizById, submitQuiz } = require('../controllers/quizController');
const auth = require('../middleware/auth');

// All quiz routes require authentication
router.use(auth);

// Get all quizzes
router.get('/', getQuizzes);

// Get specific quiz
router.get('/:id', getQuizById);

// Submit quiz attempt
router.post('/:id/submit', submitQuiz);

module.exports = router; 