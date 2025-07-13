const QuizAttempt = require('../models/QuizAttempt');
const Quiz = require('../models/Quiz');

// @desc    Get user's quiz attempts
// @route   GET /api/attempts
// @access  Private
const getUserAttempts = async (req, res) => {
  try {
    const attempts = await QuizAttempt.find({ user: req.user._id })
      .populate('quiz', 'title description')
      .sort({ createdAt: -1 })
      .lean();

    res.json(attempts);
  } catch (error) {
    console.error('Get attempts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user's quiz statistics
// @route   GET /api/attempts/stats
// @access  Private
const getUserStats = async (req, res) => {
  try {
    const attempts = await QuizAttempt.find({ user: req.user._id })
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

    // Calculate statistics
    const totalAttempts = attempts.length;
    const averageScore = attempts.reduce((sum, attempt) => sum + attempt.score, 0) / totalAttempts;
    const averageTime = attempts.reduce((sum, attempt) => sum + attempt.totalTimeSpent, 0) / totalAttempts;

    // Get recent attempts (last 5)
    const recentAttempts = attempts.slice(0, 5);

    // Create score progression data for chart (oldest first for chronological order)
    const chronologicalAttempts = attempts.slice().sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    const scoreProgression = chronologicalAttempts.map((attempt, index) => ({
      attemptNumber: index + 1,
      score: attempt.score,
      date: attempt.createdAt,
      quizTitle: attempt.quiz.title
    }));

    // Group attempts by quiz
    const quizStats = {};
    attempts.forEach(attempt => {
      const quizId = attempt.quiz._id.toString();
      if (!quizStats[quizId]) {
        quizStats[quizId] = {
          quizTitle: attempt.quiz.title,
          attempts: [],
          bestScore: 0,
          averageScore: 0
        };
      }
      quizStats[quizId].attempts.push(attempt);
      if (attempt.score > quizStats[quizId].bestScore) {
        quizStats[quizId].bestScore = attempt.score;
      }
    });

    // Calculate average score per quiz
    Object.keys(quizStats).forEach(quizId => {
      const quiz = quizStats[quizId];
      quiz.averageScore = quiz.attempts.reduce((sum, attempt) => sum + attempt.score, 0) / quiz.attempts.length;
    });

    res.json({
      totalAttempts,
      averageScore: Math.round(averageScore * 100) / 100,
      averageTime: Math.round(averageTime),
      recentAttempts,
      scoreProgression,
      quizStats: Object.values(quizStats)
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get specific attempt details
// @route   GET /api/attempts/:id
// @access  Private
const getAttemptDetails = async (req, res) => {
  try {
    const attempt = await QuizAttempt.findById(req.params.id)
      .populate('quiz', 'title questions')
      .lean();

    if (!attempt) {
      return res.status(404).json({ message: 'Attempt not found' });
    }

    // Check if the attempt belongs to the user
    if (attempt.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Add correct answers to the response for review
    const attemptWithAnswers = {
      ...attempt,
      quiz: {
        ...attempt.quiz,
        questions: attempt.quiz.questions.map((question, index) => ({
          ...question,
          userAnswer: attempt.answers[index]?.selectedAnswer,
          isCorrect: attempt.answers[index]?.isCorrect,
          timeSpent: attempt.answers[index]?.timeSpent
        }))
      }
    };

    res.json(attemptWithAnswers);
  } catch (error) {
    console.error('Get attempt details error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getUserAttempts,
  getUserStats,
  getAttemptDetails
}; 