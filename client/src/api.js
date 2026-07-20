import axios from "axios";
import{getToken} from "./utils/tokenStorage";

const API_BASE_URL = "http://localhost:5000/api";
const api = axios.create({baseURL: API_BASE_URL});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const registerRequest = (name, email, password) =>
  api.post("/auth/register", { name, email, password });
 
export const loginRequest = (email, password) =>
  api.post("/auth/login", { email, password });
 
export const googleLoginRequest = (credential) =>
  api.post("/auth/google", { credential });
 
export const getMe = () => api.get("/auth/me");
 

export const getExpenses = () => api.get("/expenses");
 
export const addExpense = (expense) => api.post("/expenses", expense);
 
export const deleteExpense = (id) => api.delete(`/expenses/${id}`);
 

export const getMonthlyAnalytics = () => api.get("/analytics/monthly");
 
export const getWeeklyAnalytics = (year, monthIndex) =>
  api.get(`/analytics/weekly/${year}/${monthIndex}`);