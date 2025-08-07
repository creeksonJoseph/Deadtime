import axios from "axios";

const API_URL = "https://deadtime.onrender.com/api/auth";

export async function signup(userData) {
  const res = await axios.post(`${API_URL}/signup`, userData);
  localStorage.setItem("token", res.data.token);
  return res.data;
}

export async function loginUser(credentials) {
  const res = await fetch("https://deadtime.onrender.com/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Invalid email or password");
  }
  return res.json();
}

// Example: fetch protected route
export async function getProtectedData() {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${API_URL}/protected`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}
