const Quiz = require('../models/Quiz');
const QuizAttempt = require('../models/QuizAttempt');

// @desc    Get all active quizzes
// @route   GET /api/quiz
// @access  Private
const getQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ isActive: true })
      .select('title description questions timeLimit')
      .lean();

    // Remove correct answers from questions for security
    const sanitizedQuizzes = quizzes.map(quiz => ({
      ...quiz,
      questions: quiz.questions.map(q => ({
        question: q.question,
        options: q.options
      }))
    }));

    res.json(sanitizedQuizzes);
  } catch (error) {
    console.error('Get quizzes error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get quiz by ID (without correct answers)
// @route   GET /api/quiz/:id
// @access  Private
const getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id)
      .select('title description questions timeLimit isActive')
      .lean();

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    if (!quiz.isActive) {
      return res.status(400).json({ message: 'Quiz is not active' });
    }

    // Remove correct answers from questions
    const sanitizedQuiz = {
      ...quiz,
      questions: quiz.questions.map(q => ({
        question: q.question,
        options: q.options
      }))
    };

    res.json(sanitizedQuiz);
  } catch (error) {
    console.error('Get quiz error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Submit quiz attempt
// @route   POST /api/quiz/:id/submit
// @access  Private
const submitQuiz = async (req, res) => {
  try {
    const { answers, timeSpent } = req.body;
    const quizId = req.params.id;
    const userId = req.user._id;

    // Get the quiz with correct answers
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    if (!quiz.isActive) {
      return res.status(400).json({ message: 'Quiz is not active' });
    }

    // Calculate results
    let correctAnswers = 0;
    const processedAnswers = answers.map((answer, index) => {
      const question = quiz.questions[index];
      const isUnanswered = answer.selectedAnswer === -1;
      const isCorrect = !isUnanswered && answer.selectedAnswer === question.correctAnswer;
      
      if (isCorrect) {
        correctAnswers++;
      }

      return {
        questionIndex: index,
        question: question.question,
        options: question.options,
        correctAnswer: question.correctAnswer,
        selectedAnswer: isUnanswered ? null : answer.selectedAnswer,
        isCorrect,
        isUnanswered,
        timeSpent: answer.timeSpent || 0
      };
    });

    const totalTimeSpent = timeSpent || processedAnswers.reduce((sum, ans) => sum + ans.timeSpent, 0);
    const score = (correctAnswers / quiz.questions.length) * 100;

    // Create quiz attempt
    const quizAttempt = new QuizAttempt({
      user: userId,
      quiz: quizId,
      answers: processedAnswers,
      score,
      totalQuestions: quiz.questions.length,
      correctAnswers,
      totalTimeSpent,
      startedAt: new Date(Date.now() - totalTimeSpent * 1000),
      completedAt: new Date()
    });

    await quizAttempt.save();

    res.status(201).json({
      message: 'Quiz submitted successfully',
      result: {
        score,
        correctAnswers,
        totalQuestions: quiz.questions.length,
        totalTimeSpent,
        answers: processedAnswers
      }
    });
  } catch (error) {
    console.error('Submit quiz error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getQuizzes,
  getQuizById,
  submitQuiz
}; 