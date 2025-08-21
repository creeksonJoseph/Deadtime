const API_URL = "https://deadtime.onrender.com/api";

// Use admin endpoint to get all users with their projects
export async function getAllUsers(token) {
  console.log('📡 getAllUsers called with token:', !!token);
  console.log('🔑 Token value:', token?.substring(0, 20) + '...');
  const headers = { Authorization: `Bearer ${token}` };
  console.log('📝 Headers:', headers);
  const res = await fetch(`${API_URL}/users`, {
    headers,
  });
  console.log('📊 getAllUsers response:', { status: res.status, ok: res.ok });
  if (!res.ok) {
    const errorText = await res.text();
    console.error('❌ getAllUsers error response:', errorText);
    throw new Error(`Failed to fetch users: ${res.status} ${errorText}`);
  }
  const data = await res.json();
  console.log('✅ getAllUsers success:', { count: data?.length, sample: data?.slice(0, 2) });
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