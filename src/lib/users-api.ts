import { getAuthHeaders } from './api-helpers';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === 'production'
    ? 'https://maeorganics-backend.vercel.app'
    : 'http://localhost:5000');

export const getAllUsers = async (): Promise<{ success: boolean; data: any[] }> => {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_BASE_URL}/api/users`, { headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as any).message || 'Failed to fetch users');
  }
  return res.json();
};

export const getUserById = async (id: string): Promise<{ success: boolean; data: any }> => {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_BASE_URL}/api/users/${id}`, { headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as any).message || 'Failed to fetch user');
  }
  return res.json();
};

export const getUserByFirebaseUID = async (uid: string): Promise<{ success: boolean; data: any }> => {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_BASE_URL}/api/users/firebase/${uid}`, { headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as any).message || 'Failed to fetch user by uid');
  }
  return res.json();
};
