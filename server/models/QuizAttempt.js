const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  questionIndex: {
    type: Number,
    required: true
  },
  selectedAnswer: {
    type: Number,
    required: true
  },
  isCorrect: {
    type: Boolean,
    required: true
  },
  timeSpent: {
    type: Number, // in seconds
    required: true
  }
});

const quizAttemptSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  answers: [answerSchema],
  score: {
    type: Number,
    required: true,
    min: 0
  },
  totalQuestions: {
    type: Number,
    required: true
  },
  correctAnswers: {
    type: Number,
    required: true,
    min: 0
  },
  totalTimeSpent: {
    type: Number, // in seconds
    required: true
  },
  startedAt: {
    type: Date,
    required: true
  },
  completedAt: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

// Calculate score percentage
quizAttemptSchema.virtual('scorePercentage').get(function() {
  return this.totalQuestions > 0 ? (this.correctAnswers / this.totalQuestions) * 100 : 0;
});

module.exports = mongoose.model('QuizAttempt', quizAttemptSchema); 