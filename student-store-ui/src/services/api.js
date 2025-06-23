// src/services/api.js
export const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5001"

export async function fetchJSON(path, opts = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...opts,
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || res.statusText)
  }
  return res.json()
}
