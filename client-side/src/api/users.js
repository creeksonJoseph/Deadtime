const API_URL = "https://deadtime.onrender.com/api/users";

export async function getUserProfile(userId, token) {
  const res = await fetch(`${API_URL}/${userId}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error("Failed to fetch user profile");
  return res.json();
}

export async function updateUserProfile(userId, updates, token) {
  const res = await fetch(`${API_URL}/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error("Failed to update user profile");
  return res.json();
}

export async function getLeaderboard(token) {
  const res = await fetch(`${API_URL}/leaderboard`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error("Failed to fetch leaderboard");
  return res.json();
}
