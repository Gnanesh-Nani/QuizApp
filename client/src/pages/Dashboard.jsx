import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { quizAPI, attemptsAPI } from '../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import styles from '../styles/Dashboard.module.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [quizzes, setQuizzes] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      console.log('Fetching data...');
      const [quizzesData, statsData] = await Promise.all([
        quizAPI.getQuizzes(),
        attemptsAPI.getUserStats()
      ]);
      console.log('Quizzes data:', quizzesData);
      console.log('Stats data:', statsData);
      setQuizzes(quizzesData);
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingText}>Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorText}>Error: {error}</div>
      </div>
    );
  }

  return (
    <div className={styles.dashboardContainer}>
      {/* Header */}
      <nav className={styles.header}>
        <div className={styles.headerContent}>
          <div className="flex items-center">
            <h1 className={styles.appTitle}>Quiz App</h1>
          </div>
          <div className={styles.userSection}>
            <span className={styles.welcomeText}>Welcome, {user?.username}!</span>
            <button
              onClick={logout}
              className={styles.logoutButton}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className={styles.mainContent}>

        {/* Stats Overview */}
        {stats && (
          <div className="mb-8">
            <h2 className={styles.sectionHeader}>Your Statistics</h2>
            <div className={styles.statsGrid}>
              <div className={`${styles.statCard} ${styles.hoverCard}`}>
                <div className={styles.statContent}>
                  <div className={`${styles.statIcon} ${styles.blue}`}>
                    📊
                  </div>
                  <div className={styles.statInfo}>
                    <p className={styles.statLabel}>Total Attempts</p>
                    <p className={styles.statValue}>{stats.totalAttempts}</p>
                  </div>
                </div>
                <div className={styles.hoverContent}>
                  <h4>Total Quiz Attempts</h4>
                  <p>You have completed {stats.totalAttempts} quiz{stats.totalAttempts !== 1 ? 'es' : ''} so far.</p>
                  {stats.quizStats && (
                    <div className={styles.quizBreakdown}>
                      <p><strong>Breakdown by quiz:</strong></p>
                      {stats.quizStats.map((quiz, index) => (
                        <div key={index} className={styles.quizStat}>
                          <span>{quiz.quizTitle}:</span>
                          <span>{quiz.attempts.length} attempt{quiz.attempts.length !== 1 ? 's' : ''}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className={`${styles.statCard} ${styles.hoverCard}`}>
                <div className={styles.statContent}>
                  <div className={`${styles.statIcon} ${styles.green}`}>
                    📈
                  </div>
                  <div className={styles.statInfo}>
                    <p className={styles.statLabel}>Average Score</p>
                    <p className={styles.statValue}>{stats.averageScore.toFixed(1)}%</p>
                  </div>
                </div>
                <div className={styles.hoverContent}>
                  <h4>Overall Performance</h4>
                  <p>Your average score across all attempts is <strong>{stats.averageScore.toFixed(1)}%</strong>.</p>
                  {stats.averageScore >= 90 && <p className={styles.excellent}>🎉 Excellent performance!</p>}
                  {stats.averageScore >= 80 && stats.averageScore < 90 && <p className={styles.good}>👍 Great job!</p>}
                  {stats.averageScore >= 70 && stats.averageScore < 80 && <p className={styles.average}>📚 Good, keep improving!</p>}
                  {stats.averageScore < 70 && <p className={styles.needsImprovement}>💪 Keep practicing to improve!</p>}
                  {stats.quizStats && (
                    <div className={styles.quizBreakdown}>
                      <p><strong>Per quiz average:</strong></p>
                      {stats.quizStats.map((quiz, index) => (
                        <div key={index} className={styles.quizStat}>
                          <span>{quiz.quizTitle}:</span>
                          <span>{quiz.averageScore.toFixed(1)}%</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className={`${styles.statCard} ${styles.hoverCard}`}>
                <div className={styles.statContent}>
                  <div className={`${styles.statIcon} ${styles.yellow}`}>
                    ⏱️
                  </div>
                  <div className={styles.statInfo}>
                    <p className={styles.statLabel}>Avg Time</p>
                    <p className={styles.statValue}>{formatTime(stats.averageTime)}</p>
                  </div>
                </div>
                <div className={styles.hoverContent}>
                  <h4>Time Management</h4>
                  <p>You spend an average of <strong>{formatTime(stats.averageTime)}</strong> per quiz.</p>
                  {stats.recentAttempts.length > 0 && (
                    <div className={styles.timeBreakdown}>
                      <p><strong>Recent completion times:</strong></p>
                      {stats.recentAttempts.slice(0, 3).map((attempt, index) => (
                        <div key={index} className={styles.timeStat}>
                          <span>{attempt.quiz.title}:</span>
                          <span>{formatTime(attempt.totalTimeSpent)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className={`${styles.statCard} ${styles.hoverCard}`}>
                <div className={styles.statContent}>
                  <div className={`${styles.statIcon} ${styles.purple}`}>
                    🏆
                  </div>
                  <div className={styles.statInfo}>
                    <p className={styles.statLabel}>Best Score (last 5 attempts)</p>
                    <p className={styles.statValue}>
                      {stats.recentAttempts.length > 0 
                        ? Math.max(...stats.recentAttempts.map(a => a.score)).toFixed(1) + '%'
                        : 'N/A'
                      }
                    </p>
                  </div>
                </div>
                <div className={styles.hoverContent}>
                  <h4>Best Performance</h4>
                  <p>Your highest score from recent attempts is <strong>
                    {stats.recentAttempts.length > 0 
                      ? Math.max(...stats.recentAttempts.map(a => a.score)).toFixed(1) + '%'
                      : 'N/A'
                    }
                  </strong>.</p>
                  {stats.quizStats && (
                    <div className={styles.quizBreakdown}>
                      <p><strong>Best scores per quiz:</strong></p>
                      {stats.quizStats.map((quiz, index) => (
                        <div key={index} className={styles.quizStat}>
                          <span>{quiz.quizTitle}:</span>
                          <span>{quiz.bestScore.toFixed(1)}%</span>
                        </div>
                      ))}
                    </div>
                  )}
                  <p className={styles.note}>* Based on last 5 attempts</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Score Progression Chart */}
        {stats && stats.scoreProgression.length > 0 && (
          <div className="mb-8">
            <h2 className={styles.sectionHeader}>Score Progression</h2>
            <div className={styles.chartContainer}>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={stats.scoreProgression}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="attemptNumber" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="score" stroke="#3B82F6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Available Quizzes */}
        <div className="mb-8">
          <h2 className={styles.sectionHeader}>Available Quizzes</h2>
          {quizzes.length === 0 ? (
            <div className={styles.emptyState}>
              <p className={styles.emptyText}>No quizzes available at the moment.</p>
            </div>
          ) : (
            <div className={styles.quizGrid}>
              {quizzes.map((quiz) => (
                <div key={quiz._id} className={styles.quizCard}>
                  <h3 className={styles.quizTitle}>{quiz.title}</h3>
                  <p className={styles.quizDescription}>{quiz.description}</p>
                  <div className={styles.quizMeta}>
                    <span>⏱️ {quiz.timeLimit} minutes</span>
                    <span>📝 {quiz.questions.length} questions</span>
                  </div>
                  <Link
                    to={`/quiz/${quiz._id}`}
                    className={styles.startQuizButton}
                  >
                    Start Quiz
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Attempts */}
        {stats && stats.recentAttempts.length > 0 && (
          <div>
            <h2 className={styles.sectionHeader}>Recent Attempts</h2>
            <div className={styles.attemptsContainer}>
              <ul className={styles.attemptsList}>
                {stats.recentAttempts.map((attempt) => (
                  <li key={attempt._id} className={styles.attemptItem}>
                    <div className={styles.attemptContent}>
                      <div className={styles.attemptLeft}>
                        <div className={`${styles.scoreBadge} ${
                          attempt.score >= 80 ? styles.excellent : 
                          attempt.score >= 60 ? styles.good : styles.poor
                        }`}>
                          {attempt.score.toFixed(1)}%
                        </div>
                        <div className={styles.attemptInfo}>
                          <div className={styles.attemptTitle}>{attempt.quiz.title}</div>
                          <div className={styles.attemptDate}>
                            {new Date(attempt.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className={styles.attemptTime}>
                        {formatTime(attempt.totalTimeSpent)}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 