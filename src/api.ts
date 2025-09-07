import { Platform } from 'react-native';


// export const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:4000';
export const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.103:4000';
export async function apiFetch(path: string, token?: string, init?: RequestInit) {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers || {})
    }
  } as any);
  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try { const j = await res.json(); if (j.error) msg = j.error; } catch {}
    throw new Error(msg);
  }
  return res.json();
}
