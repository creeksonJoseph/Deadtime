const API_URL = "https://deadtime.onrender.com/api/revive";

export async function getAllRevivalLogs(token) {
  const res = await fetch(`${API_URL}/logs`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch revival logs");
  return res.json();
}

export async function getRevivalLogById(id, token) {
  const res = await fetch(`${API_URL}/logs/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch revival log details");
  return res.json();
}