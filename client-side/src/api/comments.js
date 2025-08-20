const API_URL = "https://deadtime.onrender.com/api/ghostnotes";

export async function getCommentsForProject(projectId, token) {
  const res = await fetch(`${API_URL}/project/${projectId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch comments");
  return res.json();
}