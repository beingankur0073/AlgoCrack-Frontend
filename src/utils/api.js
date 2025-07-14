import axios from 'axios';

// Switch URLs based on Vite's mode
const baseURL = import.meta.env.MODE === 'devlopment' 
  ? 'http://localhost:8000/api/v1'
  : 'https://algocrack-backend.onrender.com/api/v1';

console.log(`API Base: ${baseURL}`); // Verify in console

const instance = axios.create({
  baseURL,
  withCredentials: true
});

export default instance;