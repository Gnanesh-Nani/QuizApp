const express = require('express');
const router = express.Router();
const { getUserAttempts, getUserStats, getAttemptDetails } = require('../controllers/attemptsController');
const auth = require('../middleware/auth');

// All attempts routes require authentication
router.use(auth);

// Get user's attempts
router.get('/', getUserAttempts);

// Get user's statistics
router.get('/stats', getUserStats);

// Get specific attempt details
router.get('/:id', getAttemptDetails);

module.exports = router; 