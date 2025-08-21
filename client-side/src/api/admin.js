const API_URL = "https://deadtime.onrender.com/api";

// Use admin endpoint to get all users with their projects
export async function getAllUsers(token) {
  const headers = { Authorization: `Bearer ${token}` };
  const res = await fetch(`${API_URL}/users`, {
    headers,
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to fetch users: ${res.status} ${errorText}`);
  }
  const data = await res.json();
  return data;
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