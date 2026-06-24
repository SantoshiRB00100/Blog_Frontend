import axios from "axios";

const api = axios.create({
  baseURL: "https://blog-backend-8aq5.onrender.com/api",
});

export default api;