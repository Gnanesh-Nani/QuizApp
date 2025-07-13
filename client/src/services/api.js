import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Quiz API
export const quizAPI = {
  // Get all quizzes
  getQuizzes: async () => {
    const response = await apiClient.get('/quiz');
    return response.data;
  },

  // Get specific quiz
  getQuiz: async (id) => {
    const response = await apiClient.get(`/quiz/${id}`);
    return response.data;
  },

  // Submit quiz attempt
  submitQuiz: async (quizId, answers, timeSpent) => {
    const response = await apiClient.post(`/quiz/${quizId}/submit`, {
      answers,
      timeSpent
    });
    return response.data;
  }
};

// Attempts API
export const attemptsAPI = {
  // Get user's attempts
  getUserAttempts: async () => {
    const response = await apiClient.get('/attempts');
    return response.data;
  },

  // Get user's statistics
  getUserStats: async () => {
    const response = await apiClient.get('/attempts/stats');
    return response.data;
  },

  // Get specific attempt details
  getAttemptDetails: async (attemptId) => {
    const response = await apiClient.get(`/attempts/${attemptId}`);
    return response.data;
  }
};

// Auth API
export const authAPI = {
  // Login
  login: async (email, password) => {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      email,
      password
    });
    return response.data;
  },

  // Register
  register: async (username, email, password) => {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, {
      username,
      email,
      password
    });
    return response.data;
  },

  // Get current user
  getMe: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  }
}; 