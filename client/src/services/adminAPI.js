import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance with auth token
const createAuthInstance = () => {
  const token = localStorage.getItem('token');
  return axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
};

export const adminAPI = {
  // User Management
  getAllUsers: async () => {
    const instance = createAuthInstance();
    const response = await instance.get('/admin/users');
    return response.data;
  },

  getUserStats: async (userId) => {
    const instance = createAuthInstance();
    const response = await instance.get(`/admin/users/${userId}/stats`);
    return response.data;
  },

  // Quiz Management
  getAllQuizzes: async () => {
    const instance = createAuthInstance();
    const response = await instance.get('/admin/quizzes');
    return response.data;
  },

  getQuizById: async (quizId) => {
    const instance = createAuthInstance();
    const response = await instance.get(`/admin/quizzes/${quizId}`);
    return response.data;
  },

  createQuiz: async (quizData) => {
    const instance = createAuthInstance();
    const response = await instance.post('/admin/quizzes', quizData);
    return response.data;
  },

  updateQuiz: async (quizId, quizData) => {
    const instance = createAuthInstance();
    const response = await instance.put(`/admin/quizzes/${quizId}`, quizData);
    return response.data;
  },

  deleteQuiz: async (quizId) => {
    const instance = createAuthInstance();
    const response = await instance.delete(`/admin/quizzes/${quizId}`);
    return response.data;
  }
}; 