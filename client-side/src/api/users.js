const API_URL = "https://deadtime.onrender.com/api/users";

export async function getUserProfile(userId, token) {
  const res = await fetch(`${API_URL}/${userId}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error("Failed to fetch user profile");
  return res.json();
}

export async function getLeaderboard(token) {
  const res = await fetch(`${API_URL}/leaderboard`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error("Failed to fetch leaderboard");
  return res.json();
}
