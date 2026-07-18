import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

export const getExpenses = () => axios.get(`${API_BASE_URL}/expenses`);

export const addExpense = (expense) => axios.post(`${API_BASE_URL}/expenses`, expense);

export const deleteExpense = (id) => axios.delete(`${API_BASE_URL}/expenses/${id}`);

export const getMonthlyAnalytics = () => axios.get(`${API_BASE_URL}/analytics/monthly`);

export const getWeeklyAnalytics = (year, monthIndex) =>
  axios.get(`${API_BASE_URL}/analytics/weekly/${year}/${monthIndex}`);
