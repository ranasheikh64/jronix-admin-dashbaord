import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api', // Temporarily changed to local
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
