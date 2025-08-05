import axios from "axios";

const API_URL = "https://deadtime.onrender.com/api/auth";

export async function signup(userData) {
  const res = await axios.post(`${API_URL}/signup`, userData);
  localStorage.setItem("token", res.data.token);
  return res.data;
}

export async function loginUser(userData) {
  const res = await axios.post(`${API_URL}/login`, userData);
  localStorage.setItem("token", res.data.token);
  return res.data;
}

// Example: fetch protected route
export async function getProtectedData() {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${API_URL}/protected`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}
