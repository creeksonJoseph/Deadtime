const API_URL = "https://deadtime.onrender.com/api/ghostnotes";

export async function getNotesForProject(projectId, token) {
  const res = await fetch(`${API_URL}/project/${projectId}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error("Failed to fetch notes");
  return res.json();
}

export async function createGhostNote({ projectId, note, isAnonymous }, token) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ projectId, note, isAnonymous }),
  });
  if (!res.ok) throw new Error("Failed to post note");
  return res.json();
}

export async function deleteGhostNote(id, token) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error("Failed to delete note");
  return res.json();
}

export async function fetchProjectNotesWithAuth(projectId, token) {
  const res = await fetch(
    `https://deadtime.onrender.com/api/ghostnotes/project/${projectId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  if (res.status === 403) {
    return [];
  }
  if (!res.ok) throw new Error("Failed to fetch notes");
  return res.json();
}
