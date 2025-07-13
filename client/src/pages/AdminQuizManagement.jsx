import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { adminAPI } from '../services/adminAPI';
import styles from '../styles/AdminQuizManagement.module.css';

const AdminQuizManagement = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }
    fetchQuizzes();
  }, [user, navigate]);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const data = await adminAPI.getAllQuizzes();
      setQuizzes(data);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      setError(error.response?.data?.message || 'Error fetching quizzes');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQuiz = () => {
    setEditingQuiz(null);
    setShowCreateForm(true);
  };

  const handleEditQuiz = (quiz) => {
    setEditingQuiz(quiz);
    setShowCreateForm(true);
  };

  const handleDeleteQuiz = async (quizId) => {
    try {
      await adminAPI.deleteQuiz(quizId);
      setQuizzes(quizzes.filter(q => q._id !== quizId));
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting quiz:', error);
      alert(error.response?.data?.message || 'Error deleting quiz');
    }
  };

  const handleToggleActive = async (quiz) => {
    try {
      const updatedQuiz = await adminAPI.updateQuiz(quiz._id, {
        ...quiz,
        isActive: !quiz.isActive
      });
      setQuizzes(quizzes.map(q => q._id === quiz._id ? updatedQuiz.quiz : q));
    } catch (error) {
      console.error('Error updating quiz:', error);
      alert(error.response?.data?.message || 'Error updating quiz');
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingText}>Loading quizzes...</div>
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
    <div className={styles.container}>
      {/* Header */}
      <nav className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerInfo}>
            <h1 className={styles.pageTitle}>Quiz Management</h1>
            <p className={styles.pageSubtitle}>Create, edit, and manage quizzes</p>
          </div>
          <div className={styles.headerActions}>
            <button 
              onClick={() => navigate('/admin')} 
              className={styles.backButton}
            >
              ← Back to Dashboard
            </button>
            <button 
              onClick={handleCreateQuiz} 
              className={styles.createButton}
            >
              + Create New Quiz
            </button>
          </div>
        </div>
      </nav>

      <div className={styles.mainContent}>
        {/* Quiz List */}
        <div className={styles.quizSection}>
          <h2 className={styles.sectionTitle}>All Quizzes ({quizzes.length})</h2>
          
          {quizzes.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>📝</div>
              <h3>No quizzes yet</h3>
              <p>Create your first quiz to get started</p>
              <button onClick={handleCreateQuiz} className={styles.createButton}>
                Create First Quiz
              </button>
            </div>
          ) : (
            <div className={styles.quizGrid}>
              {quizzes.map((quiz) => (
                <div key={quiz._id} className={styles.quizCard}>
                  <div className={styles.quizHeader}>
                    <div className={styles.quizStatus}>
                      <span className={`${styles.statusBadge} ${quiz.isActive ? styles.active : styles.inactive}`}>
                        {quiz.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className={styles.quizActions}>
                      <button 
                        onClick={() => handleEditQuiz(quiz)}
                        className={styles.editButton}
                        title="Edit Quiz"
                      >
                        ✏️
                      </button>
                      <button 
                        onClick={() => setDeleteConfirm(quiz)}
                        className={styles.deleteButton}
                        title="Delete Quiz"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                  
                  <div className={styles.quizContent}>
                    <h3 className={styles.quizTitle}>{quiz.title}</h3>
                    <p className={styles.quizDescription}>{quiz.description}</p>
                    
                    <div className={styles.quizDetails}>
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Time Limit:</span>
                        <span className={styles.detailValue}>{quiz.timeLimit} minutes</span>
                      </div>
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Questions:</span>
                        <span className={styles.detailValue}>{quiz.questions.length}</span>
                      </div>
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Created:</span>
                        <span className={styles.detailValue}>
                          {new Date(quiz.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className={styles.quizFooter}>
                    <button 
                      onClick={() => handleToggleActive(quiz)}
                      className={`${styles.toggleButton} ${quiz.isActive ? styles.deactivate : styles.activate}`}
                    >
                      {quiz.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button 
                      onClick={() => navigate(`/admin/quiz/${quiz._id}/preview`)}
                      className={styles.previewButton}
                    >
                      Preview
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Quiz Modal */}
      {showCreateForm && (
        <CreateEditQuizModal
          quiz={editingQuiz}
          onClose={() => {
            setShowCreateForm(false);
            setEditingQuiz(null);
          }}
          onSave={() => {
            setShowCreateForm(false);
            setEditingQuiz(null);
            fetchQuizzes();
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Delete Quiz</h3>
            <p>Are you sure you want to delete "{deleteConfirm.title}"?</p>
            <p className={styles.warningText}>
              This action cannot be undone. All quiz data will be permanently removed.
            </p>
            <div className={styles.modalActions}>
              <button 
                onClick={() => setDeleteConfirm(null)}
                className={styles.cancelButton}
              >
                Cancel
              </button>
              <button 
                onClick={() => handleDeleteQuiz(deleteConfirm._id)}
                className={styles.confirmDeleteButton}
              >
                Delete Quiz
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Create/Edit Quiz Modal Component
const CreateEditQuizModal = ({ quiz, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: quiz?.title || '',
    description: quiz?.description || '',
    timeLimit: quiz?.timeLimit || 30,
    isActive: quiz?.isActive || false,
    questions: quiz?.questions || []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || formData.questions.length === 0) {
      setError('Please fill in all required fields and add at least one question.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (quiz) {
        await adminAPI.updateQuiz(quiz._id, formData);
      } else {
        await adminAPI.createQuiz(formData);
      }

      onSave(formData);
    } catch (error) {
      console.error('Error saving quiz:', error);
      setError(error.response?.data?.message || 'Error saving quiz');
    } finally {
      setLoading(false);
    }
  };

  const addQuestion = () => {
    setFormData(prev => ({
      ...prev,
      questions: [...prev.questions, {
        question: '',
        options: ['', ''],
        correctAnswer: 0
      }]
    }));
  };

  const updateQuestion = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => 
        i === index ? { ...q, [field]: value } : q
      )
    }));
  };

  const updateOption = (questionIndex, optionIndex, value) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => 
        i === questionIndex 
          ? { 
              ...q, 
              options: q.options.map((opt, j) => j === optionIndex ? value : opt)
            }
          : q
      )
    }));
  };

  const addOption = (questionIndex) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => 
        i === questionIndex 
          ? { ...q, options: [...q.options, ''] }
          : q
      )
    }));
  };

  const removeOption = (questionIndex, optionIndex) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => 
        i === questionIndex 
          ? { 
              ...q, 
              options: q.options.filter((_, j) => j !== optionIndex),
              correctAnswer: q.correctAnswer >= optionIndex ? Math.max(0, q.correctAnswer - 1) : q.correctAnswer
            }
          : q
      )
    }));
  };

  const removeQuestion = (index) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.quizModal}>
        <div className={styles.modalHeader}>
          <h2>{quiz ? 'Edit Quiz' : 'Create New Quiz'}</h2>
          <button onClick={onClose} className={styles.closeButton}>×</button>
        </div>

        <form onSubmit={handleSubmit} className={styles.quizForm}>
          {error && <div className={styles.errorMessage}>{error}</div>}

          <div className={styles.formSection}>
            <h3>Quiz Details</h3>
            <div className={styles.formGroup}>
              <label>Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter quiz title"
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter quiz description"
                rows="3"
                required
              />
            </div>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Time Limit (minutes) *</label>
                <input
                  type="number"
                  value={formData.timeLimit}
                  onChange={(e) => setFormData(prev => ({ ...prev, timeLimit: parseInt(e.target.value) }))}
                  min="1"
                  max="180"
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  />
                  Active Quiz
                </label>
              </div>
            </div>
          </div>

          <div className={styles.formSection}>
            <div className={styles.sectionHeader}>
              <h3>Questions ({formData.questions.length})</h3>
              <button type="button" onClick={addQuestion} className={styles.addButton}>
                + Add Question
              </button>
            </div>

            {formData.questions.map((question, qIndex) => (
              <div key={qIndex} className={styles.questionCard}>
                <div className={styles.questionHeader}>
                  <h4>Question {qIndex + 1}</h4>
                  <button 
                    type="button" 
                    onClick={() => removeQuestion(qIndex)}
                    className={styles.removeButton}
                  >
                    Remove
                  </button>
                </div>

                <div className={styles.formGroup}>
                  <label>Question Text *</label>
                  <textarea
                    value={question.question}
                    onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
                    placeholder="Enter your question"
                    rows="2"
                    required
                  />
                </div>

                <div className={styles.optionsSection}>
                  <label>Options *</label>
                  {question.options.map((option, oIndex) => (
                    <div key={oIndex} className={styles.optionRow}>
                      <input
                        type="radio"
                        name={`correct-${qIndex}`}
                        checked={question.correctAnswer === oIndex}
                        onChange={() => updateQuestion(qIndex, 'correctAnswer', oIndex)}
                        required
                      />
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                        placeholder={`Option ${oIndex + 1}`}
                        required
                      />
                      {question.options.length > 2 && (
                        <button 
                          type="button"
                          onClick={() => removeOption(qIndex, oIndex)}
                          className={styles.removeOptionButton}
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                  <button 
                    type="button"
                    onClick={() => addOption(qIndex)}
                    className={styles.addOptionButton}
                  >
                    + Add Option
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.modalActions}>
            <button type="button" onClick={onClose} className={styles.cancelButton}>
              Cancel
            </button>
            <button type="submit" disabled={loading} className={styles.saveButton}>
              {loading ? 'Saving...' : (quiz ? 'Update Quiz' : 'Create Quiz')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminQuizManagement; 