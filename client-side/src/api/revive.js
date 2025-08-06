const API_URL = "https://deadtime.onrender.com/api/revive";

export async function reviveProject(projectId, token) {
  const res = await fetch(`${API_URL}/${projectId}`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error("Failed to revive project");
  return res.json();
}
