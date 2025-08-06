const API_URL = "https://deadtime.onrender.com/api/ghostcards";

export async function getGhostCards(token) {
  const res = await fetch(API_URL, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error("Failed to fetch ghost cards");
  return res.json();
}

export async function getGhostCardById(id, token) {
  const res = await fetch(`/api/ghostcards/${id}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error("Failed to fetch project");
  return res.json();
}

export async function createGhostCard(data, token) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create ghost card");
  return res.json();
}

export async function updateGhostCard(id, data, token) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update ghost card");
  return res.json();
}

export async function deleteGhostCard(id, token) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error("Failed to delete ghost card");
  return res.json();
}
