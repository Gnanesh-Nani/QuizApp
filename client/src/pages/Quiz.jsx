import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { quizAPI } from '../services/api';
import styles from '../styles/Quiz.module.css';

const Quiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(null); // FIX: start as null
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [warningCount, setWarningCount] = useState(0);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [unansweredCount, setUnansweredCount] = useState(0);
  const [showRefreshWarning, setShowRefreshWarning] = useState(false);

  useEffect(() => {
    fetchQuiz();
  }, [id]);

  // Fullscreen and visibility change handlers
  useEffect(() => {
    if (!quiz) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setShowWarning(true);
        setWarningCount(prev => prev + 1);
      }
    };

    const handleResize = () => {
      const currentWidth = window.innerWidth;
      const currentHeight = window.innerHeight;
      
      // Check if window was minimized (size becomes very small)
      if (currentWidth < 100 || currentHeight < 100) {
        setShowWarning(true);
        setWarningCount(prev => prev + 1);
      } else {
        // Hide warning when window is restored to normal size
        setShowWarning(false);
      }
    };

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    const handleBeforeUnload = (e) => {
      // Show warning when user tries to refresh or leave the page
      e.preventDefault();
      e.returnValue = '';
      setShowRefreshWarning(true);
      return '';
    };

    const requestFullscreen = async () => {
      try {
        if (!document.fullscreenElement) {
          await document.documentElement.requestFullscreen();
        }
      } catch (error) {
        console.log('Fullscreen request failed:', error);
      }
    };

    // Request fullscreen when quiz starts
    requestFullscreen();

    // Add event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('resize', handleResize);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      
      // Exit fullscreen when component unmounts
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
    };
  }, [quiz]);

  useEffect(() => {
    if (quiz) {
      setTimeLeft(quiz.timeLimit * 60); // Convert to seconds
      setQuestionStartTime(Date.now());
    }
  }, [quiz]);

  useEffect(() => {
    if (timeLeft === null) return; // FIX: don't run until timeLeft is set
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && quiz) {
      handleSubmit();
    }
  }, [timeLeft, quiz]);

  const fetchQuiz = async () => {
    try {
      const quizData = await quizAPI.getQuiz(id);
      setQuiz(quizData);
      setAnswers(new Array(quizData.questions.length).fill(null));
    } catch (error) {
      console.error('Error fetching quiz:', error);
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (answerIndex) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setQuestionStartTime(Date.now());
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setQuestionStartTime(Date.now());
    }
  };

  const handleWarningDismiss = () => {
    setShowWarning(false);
  };

  const handleSubmit = async () => {
    if (submitting) return;
    
    // Check for unanswered questions
    const count = answers.filter(answer => answer === null).length;
    
    if (count > 0) {
      setUnansweredCount(count);
      setShowSubmitConfirm(true);
      return;
    }
    
    await submitQuiz();
  };

  const submitQuiz = async () => {
    setSubmitting(true);
    
    try {
      // Calculate time spent on current question
      const currentQuestionTime = Math.floor((Date.now() - questionStartTime) / 1000);
      
      // Prepare answers with time tracking
      const answersWithTime = answers.map((answer, index) => ({
        selectedAnswer: answer !== null ? answer : -1, // Use -1 to indicate unanswered
        timeSpent: index === currentQuestion ? currentQuestionTime : 0 // We'll need to track this better in a real app
      }));

      const totalTimeSpent = quiz.timeLimit * 60 - timeLeft;
      
      const result = await quizAPI.submitQuiz(id, answersWithTime, totalTimeSpent);
      
      // Navigate to results page
      navigate('/quiz-result', { 
        state: { 
          quizResult: result.result,
          quizTitle: quiz.title 
        } 
      });
    } catch (error) {
      console.error('Error submitting quiz:', error);
      alert('Error submitting quiz. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmSubmit = () => {
    setShowSubmitConfirm(false);
    submitQuiz();
  };

  const handleCancelSubmit = () => {
    setShowSubmitConfirm(false);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingText}>Loading quiz...</div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorText}>Quiz not found</div>
      </div>
    );
  }

  const currentQ = quiz.questions[currentQuestion];

  return (
    <div className={styles.quizContainer}>
      {/* Warning Message */}
      {showWarning && (
        <div className={styles.warningOverlay}>
          <div className={styles.warningMessage}>
            <h3>⚠️ Warning!</h3>
            <p>Please stay on this page during the quiz. Tab switching and minimizing are not allowed.</p>
            <p>Fullscreen: {isFullscreen ? 'Active' : 'Inactive'}</p>
            <p>Warning #{warningCount}</p>
            <button 
              onClick={handleWarningDismiss}
              className={styles.warningButton}
            >
              OK, I Understand
            </button>
          </div>
        </div>
      )}

      {/* Submit Confirmation Modal */}
      {showSubmitConfirm && (
        <div className={styles.warningOverlay}>
          <div className={styles.warningMessage}>
            <h3>⚠️ Unanswered Questions</h3>
            <p>You have {unansweredCount} unanswered question{unansweredCount > 1 ? 's' : ''}.</p>
            <p>Are you sure you want to submit the quiz? Unanswered questions will be marked as incorrect.</p>
            <div className={styles.confirmButtons}>
              <button 
                onClick={handleCancelSubmit}
                className={styles.cancelButton}
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirmSubmit}
                className={styles.confirmButton}
              >
                Submit Quiz
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Refresh Warning Modal */}
      {showRefreshWarning && (
        <div className={styles.warningOverlay}>
          <div className={styles.warningMessage}>
            <h3>⚠️ Page Refresh Warning</h3>
            <p>Refreshing the page will restart the quiz and you will lose all your current progress.</p>
            <p>Are you sure you want to continue?</p>
            <div className={styles.confirmButtons}>
              <button 
                onClick={() => setShowRefreshWarning(false)}
                className={styles.cancelButton}
              >
                Stay on Quiz
              </button>
              <button 
                onClick={() => window.location.reload()}
                className={styles.confirmButton}
              >
                Refresh Anyway
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.quizInfo}>
            <h1 className={styles.quizTitle}>{quiz.title}</h1>
            <p className={styles.questionCounter}>
              Question {currentQuestion + 1} of {quiz.questions.length}
              {answers.filter(answer => answer === null).length > 0 && (
                <span className={styles.unansweredWarning}>
                  • {answers.filter(answer => answer === null).length} unanswered
                </span>
              )}
            </p>
          </div>
          <div className={styles.timerSection}>
            <div className={`${styles.timer} ${timeLeft < 60 ? styles.warning : ''}`}>
              {formatTime(timeLeft)}
            </div>
            <div className={styles.timerLabel}>Time Remaining</div>
          </div>
        </div>
      </div>



      {/* Quiz Content */}
      <div className={styles.mainContent}>
        <div className={styles.quizCard}>
          {/* Question */}
          <div className={styles.questionSection}>
            <h2 className={styles.questionText}>
              {currentQ.question}
            </h2>
            
            {/* Options */}
            <div className={styles.optionsContainer}>
              {currentQ.options.map((option, index) => (
                <label
                  key={index}
                  className={`${styles.optionLabel} ${
                    answers[currentQuestion] === index ? styles.selected : ''
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${currentQuestion}`}
                    value={index}
                    checked={answers[currentQuestion] === index}
                    onChange={() => handleAnswerSelect(index)}
                    className={styles.optionInput}
                  />
                  <div className={styles.radioButton}>
                    {answers[currentQuestion] === index && (
                      <div className={styles.radioButtonInner}></div>
                    )}
                  </div>
                  <span className={styles.optionText}>{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className={styles.navigationSection}>
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className={`${styles.navButton} ${styles.previousButton}`}
            >
              Previous
            </button>

            <div className="flex space-x-3">
              {currentQuestion < quiz.questions.length - 1 ? (
                <button
                  onClick={handleNext}
                  disabled={answers[currentQuestion] === null}
                  className={`${styles.navButton} ${styles.nextButton}`}
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className={`${styles.navButton} ${styles.submitButton}`}
                >
                  {submitting ? 'Submitting...' : 'Submit Quiz'}
                </button>
              )}
            </div>
          </div>

          {/* Question Navigation */}
          <div className={styles.questionNavSection}>
            <h3 className={styles.questionNavTitle}>Question Navigation</h3>
            <div className={styles.questionNavGrid}>
              {quiz.questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestion(index)}
                  className={`${styles.questionNavButton} ${
                    index === currentQuestion
                      ? styles.current
                      : answers[index] !== null
                      ? styles.answered
                      : styles.unanswered
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz; 