import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://jronix-backend.vercel.app/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
