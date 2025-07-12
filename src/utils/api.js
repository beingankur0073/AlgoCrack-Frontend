import axios from 'axios';

// Check if --custom-env LOCAL_API=true was passed
const isLocal = import.meta.env.VITE_LOCAL_API === 'true';

// Set baseURL directly in this file
const baseURL = isLocal 
  ? 'http://localhost:8000/api/v1'
  : 'https://algocrack-backend.onrender.com/api/v1';

// Debug log
console.log(`API Base: ${baseURL}`, isLocal ? '(LOCAL)' : '(RENDER)');

const instance = axios.create({
  baseURL,
  withCredentials: true
});

export default instance;