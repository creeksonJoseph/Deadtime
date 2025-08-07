const API_URL = "https://deadtime.onrender.com/api/revive";

export async function reviveProject(projectId, notes, newProjectLink, token) {
  const res = await fetch(`${API_URL}/${projectId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({
      notes,
      newProjectLink,
    }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to revive project");
  }
  return res.json();
}
