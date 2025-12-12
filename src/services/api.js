import axios from "axios";

// Detecta automaticamente se está em produção ou desenvolvimento
const baseURL = import.meta.env.PROD 
  ? "/api"  // Em produção, usa o caminho relativo
  : "http://localhost:3001/api";  // Em desenvolvimento, usa localhost

export const api = axios.create({
  baseURL,
});

// Interceptor para adicionar token em todas as requisições
api.interceptors.request.use(
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
