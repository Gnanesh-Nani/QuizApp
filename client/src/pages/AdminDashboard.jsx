import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { adminAPI } from '../services/adminAPI';
import styles from '../styles/AdminDashboard.module.css';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is admin
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }

    fetchStats();
  }, [user, navigate]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [users, quizzes] = await Promise.all([
        adminAPI.getAllUsers(),
        adminAPI.getAllQuizzes()
      ]);

      setStats({
        totalUsers: users.length,
        totalQuizzes: quizzes.length,
        activeQuizzes: quizzes.filter(q => q.isActive).length,
        inactiveQuizzes: quizzes.filter(q => !q.isActive).length
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      setError(error.response?.data?.message || 'Error fetching dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingText}>Loading admin dashboard...</div>
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
    <div className={styles.adminContainer}>
      {/* Header */}
      <nav className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerInfo}>
            <h1 className={styles.appTitle}>Quiz App - Admin Dashboard</h1>
            <p className={styles.welcomeText}>Welcome, {user?.username}!</p>
          </div>
          <div className={styles.headerActions}>
            <button onClick={handleLogout} className={styles.logoutButton}>
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className={styles.mainContent}>
        {/* Quick Stats */}
        <div className={styles.statsSection}>
          <h2 className={styles.sectionTitle}>Quick Overview</h2>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>👥</div>
              <div className={styles.statInfo}>
                <div className={styles.statValue}>{stats?.totalUsers || 0}</div>
                <div className={styles.statLabel}>Total Users</div>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>📝</div>
              <div className={styles.statInfo}>
                <div className={styles.statValue}>{stats?.totalQuizzes || 0}</div>
                <div className={styles.statLabel}>Total Quizzes</div>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>✅</div>
              <div className={styles.statInfo}>
                <div className={styles.statValue}>{stats?.activeQuizzes || 0}</div>
                <div className={styles.statLabel}>Active Quizzes</div>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>⏸️</div>
              <div className={styles.statInfo}>
                <div className={styles.statValue}>{stats?.inactiveQuizzes || 0}</div>
                <div className={styles.statLabel}>Inactive Quizzes</div>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Actions */}
        <div className={styles.actionsSection}>
          <h2 className={styles.sectionTitle}>Admin Actions</h2>
          <div className={styles.actionsGrid}>
            <div className={styles.actionCard} onClick={() => navigate('/admin/quizzes')}>
              <div className={styles.actionIcon}>📝</div>
              <h3 className={styles.actionTitle}>Manage Quizzes</h3>
              <p className={styles.actionDescription}>
                Create, edit, and delete quizzes. Manage quiz settings and questions.
              </p>
            </div>
            <div className={`${styles.actionCard} ${styles.comingSoon}`}>
              <div className={styles.actionIcon}>👥</div>
              <h3 className={styles.actionTitle}>View Users</h3>
              <p className={styles.actionDescription}>
                View all users and their performance statistics.
              </p>
              <div className={styles.comingSoonBadge}>Coming Soon</div>
            </div>
            <div className={`${styles.actionCard} ${styles.comingSoon}`}>
              <div className={styles.actionIcon}>📊</div>
              <h3 className={styles.actionTitle}>Analytics</h3>
              <p className={styles.actionDescription}>
                View detailed analytics and performance reports.
              </p>
              <div className={styles.comingSoonBadge}>Coming Soon</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 