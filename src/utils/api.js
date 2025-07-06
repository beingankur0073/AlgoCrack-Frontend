import axios from "axios";

const instance = axios.create({
  // for local 
  // baseURL: "http://localhost:8000/api/v1", 
  baseURL: "https://algocrack-backend.onrender.com/api/v1",
  withCredentials: true, 
});

export default instance;
