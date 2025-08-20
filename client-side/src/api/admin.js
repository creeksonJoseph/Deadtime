const API_URL = "https://deadtime.onrender.com/api";

// Use leaderboard endpoint to get all users with stats
export async function getAllUsers(token) {
  const res = await fetch(`${API_URL}/users/leaderboard`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
}

// Note: Delete user endpoint may not exist - will show error gracefully
export async function deleteUser(userId, token) {
  const res = await fetch(`${API_URL}/users/${userId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to delete user");
  return res.json();
}