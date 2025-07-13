import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import styles from '../styles/QuizResult.module.css';

const QuizResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (location.state?.quizResult) {
      setQuizData(location.state);
      setLoading(false);
    } else {
      // If no result data, redirect to dashboard
      navigate('/dashboard');
    }
  }, [location.state, navigate]);

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingText}>Loading results...</div>
      </div>
    );
  }

  if (!quizData) {
    return null;
  }

  const { quizResult, quizTitle } = quizData;
  const { score, correctAnswers, totalQuestions, totalTimeSpent, answers } = quizResult;

  // Ensure we have valid data
  if (correctAnswers === undefined || correctAnswers === null || totalQuestions === undefined || totalQuestions === null) {
    console.error('Invalid quiz result data:', quizResult);
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorText}>Error: Invalid quiz result data</div>
      </div>
    );
  }

  // Prepare data for pie chart
  const pieData = [
    { name: 'Correct', value: correctAnswers, color: '#10B981' },
    { name: 'Incorrect', value: totalQuestions - correctAnswers, color: '#EF4444' }
  ];



  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={styles.resultContainer}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerInfo}>
            <h1>Quiz Results</h1>
            <p>{quizTitle}</p>
          </div>
          <button
            onClick={handleGoToDashboard}
            className={styles.dashboardButton}
          >
            Go to Dashboard
          </button>
        </div>
      </div>

      <div className={styles.mainContent}>
        {/* Score Summary */}
        <div className={styles.scoreCard}>
          <h2 className={styles.scoreTitle}>Your Score</h2>
          <div className={styles.scoreValue}>{score.toFixed(1)}%</div>
          <div className={styles.scoreSubtitle}>
            {correctAnswers} out of {totalQuestions} questions correct
          </div>

          {/* Stats Grid */}
          <div className={styles.statsGrid}>
            <div className={styles.statItem}>
              <div className={`${styles.statValue} ${styles.correct}`}>{correctAnswers}</div>
              <div className={styles.statLabel}>Correct Answers</div>
            </div>
            <div className={styles.statItem}>
              <div className={`${styles.statValue} ${styles.incorrect}`}>{totalQuestions - correctAnswers}</div>
              <div className={styles.statLabel}>Incorrect Answers</div>
            </div>
          </div>
        </div>

        {/* Pie Chart */}
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Performance Overview</h3>
          <div className={styles.chartContainer}>
            {pieData.some(item => item.value > 0) ? (
              <div className={styles.chartWrapper}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name) => [value, name]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className={styles.noDataMessage}>
                <p>No data available for chart</p>
              </div>
            )}
            {/* Fallback text display */}
            <div className={styles.chartFallback}>
              <p>
                Correct: {correctAnswers} | Incorrect: {totalQuestions - correctAnswers}
              </p>
            </div>
          </div>
        </div>

        {/* Question Review */}
        <div className={styles.reviewCard}>
          <h3 className={styles.reviewTitle}>Question Review</h3>
          <div className={styles.questionList}>
            {answers.map((answer, index) => (
                              <div
                  key={index}
                  className={`${styles.questionItem} ${
                    answer.isUnanswered ? styles.unanswered :
                    answer.isCorrect ? styles.correct : styles.incorrect
                  }`}
                >
                <div className={styles.questionHeader}>
                  <h4 className={styles.questionNumber}>
                    Question {index + 1}
                  </h4>
                  <span
                    className={`${styles.statusBadge} ${
                      answer.isUnanswered ? styles.unanswered : 
                      answer.isCorrect ? styles.correct : styles.incorrect
                    }`}
                  >
                    {answer.isUnanswered ? 'Unanswered' : 
                     answer.isCorrect ? 'Correct' : 'Incorrect'}
                  </span>
                </div>
                
                <div className={styles.questionText}>
                  {answer.question}
                </div>
                
                <div className={styles.optionsList}>
                  {answer.options.map((option, optionIndex) => (
                    <div
                      key={optionIndex}
                      className={`${styles.optionItem} ${
                        optionIndex === answer.selectedAnswer
                          ? answer.isCorrect
                            ? styles.selected + ' ' + styles.correct
                            : styles.selected
                          : optionIndex === answer.correctAnswer
                          ? styles.correct
                          : ''
                      }`}
                    >
                      <div className={styles.optionContent}>
                        <span className={styles.optionLetter}>{String.fromCharCode(65 + optionIndex)}.</span>
                        <span className={`${styles.optionText} ${optionIndex === answer.correctAnswer ? styles.correct : ''}`}>
                          {option}
                        </span>
                        {optionIndex === answer.correctAnswer && (
                          <span className={`${styles.optionIndicator} ${styles.correct}`}>✓ Correct Answer</span>
                        )}
                        {optionIndex === answer.selectedAnswer && !answer.isCorrect && !answer.isUnanswered && (
                          <span className={`${styles.optionIndicator} ${styles.incorrect}`}>✗ Your Answer</span>
                        )}
                        {answer.isUnanswered && (
                          <span className={`${styles.optionIndicator} ${styles.unanswered}`}>⏭️ Not Answered</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizResult; 