const User = require('../models/User');
const Quiz = require('../models/Quiz');
const QuizAttempt = require('../models/QuizAttempt');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Admin
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({})
      .select('-password')
      .sort({ createdAt: -1 })
      .lean();

    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user statistics
// @route   GET /api/admin/users/:id/stats
// @access  Admin
const getUserStats = async (req, res) => {
  try {
    const userId = req.params.id;
    
    const attempts = await QuizAttempt.find({ user: userId })
      .populate('quiz', 'title')
      .sort({ createdAt: -1 })
      .lean();

    if (attempts.length === 0) {
      return res.json({
        totalAttempts: 0,
        averageScore: 0,
        averageTime: 0,
        recentAttempts: [],
        scoreProgression: []
      });
    }

    const totalAttempts = attempts.length;
    const averageScore = attempts.reduce((sum, attempt) => sum + attempt.score, 0) / totalAttempts;
    const averageTime = attempts.reduce((sum, attempt) => sum + attempt.totalTimeSpent, 0) / totalAttempts;

    const recentAttempts = attempts.slice(0, 5);
    const chronologicalAttempts = attempts.slice().sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    const scoreProgression = chronologicalAttempts.map((attempt, index) => ({
      attemptNumber: index + 1,
      score: attempt.score,
      date: attempt.createdAt,
      quizTitle: attempt.quiz.title
    }));

    res.json({
      totalAttempts,
      averageScore: Math.round(averageScore * 100) / 100,
      averageTime: Math.round(averageTime),
      recentAttempts,
      scoreProgression
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all quizzes (admin view with correct answers)
// @route   GET /api/admin/quizzes
// @access  Admin
const getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({})
      .sort({ createdAt: -1 })
      .lean();

    res.json(quizzes);
  } catch (error) {
    console.error('Get quizzes error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get quiz by ID (admin view with correct answers)
// @route   GET /api/admin/quizzes/:id
// @access  Admin
const getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).lean();

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    res.json(quiz);
  } catch (error) {
    console.error('Get quiz error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create new quiz
// @route   POST /api/admin/quizzes
// @access  Admin
const createQuiz = async (req, res) => {
  try {
    const { title, description, timeLimit, questions, isActive = false } = req.body;

    // Validate required fields
    if (!title || !description || !timeLimit || !questions || questions.length === 0) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Validate questions
    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      if (!question.question || !question.options || question.options.length < 2 || 
          question.correctAnswer === undefined || question.correctAnswer < 0 || 
          question.correctAnswer >= question.options.length) {
        return res.status(400).json({ 
          message: `Invalid question ${i + 1}. Each question must have a question text, at least 2 options, and a valid correct answer index.` 
        });
      }
    }

    const quiz = new Quiz({
      title,
      description,
      timeLimit,
      questions,
      isActive
    });

    await quiz.save();

    res.status(201).json({
      message: 'Quiz created successfully',
      quiz
    });
  } catch (error) {
    console.error('Create quiz error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update quiz
// @route   PUT /api/admin/quizzes/:id
// @access  Admin
const updateQuiz = async (req, res) => {
  try {
    const { title, description, timeLimit, questions, isActive } = req.body;
    const quizId = req.params.id;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Validate questions if provided
    if (questions) {
      for (let i = 0; i < questions.length; i++) {
        const question = questions[i];
        if (!question.question || !question.options || question.options.length < 2 || 
            question.correctAnswer === undefined || question.correctAnswer < 0 || 
            question.correctAnswer >= question.options.length) {
          return res.status(400).json({ 
            message: `Invalid question ${i + 1}. Each question must have a question text, at least 2 options, and a valid correct answer index.` 
          });
        }
      }
    }

    // Update fields
    if (title !== undefined) quiz.title = title;
    if (description !== undefined) quiz.description = description;
    if (timeLimit !== undefined) quiz.timeLimit = timeLimit;
    if (questions !== undefined) quiz.questions = questions;
    if (isActive !== undefined) quiz.isActive = isActive;

    await quiz.save();

    res.json({
      message: 'Quiz updated successfully',
      quiz
    });
  } catch (error) {
    console.error('Update quiz error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete quiz
// @route   DELETE /api/admin/quizzes/:id
// @access  Admin
const deleteQuiz = async (req, res) => {
  try {
    const quizId = req.params.id;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Check if there are any attempts for this quiz
    const attemptsCount = await QuizAttempt.countDocuments({ quiz: quizId });
    
    if (attemptsCount > 0) {
      return res.status(400).json({ 
        message: `Cannot delete quiz. There are ${attemptsCount} attempts associated with this quiz.` 
      });
    }

    await Quiz.findByIdAndDelete(quizId);

    res.json({ message: 'Quiz deleted successfully' });
  } catch (error) {
    console.error('Delete quiz error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllUsers,
  getUserStats,
  getAllQuizzes,
  getQuizById,
  createQuiz,
  updateQuiz,
  deleteQuiz
}; 