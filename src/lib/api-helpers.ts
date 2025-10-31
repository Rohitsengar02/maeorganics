import { auth } from './firebase';
import { getIdToken } from 'firebase/auth';

export const getAuthHeaders = async (): Promise<HeadersInit> => {
  const headers: HeadersInit = {};
  const user = auth.currentUser;
  if (user) {
    const token = await getIdToken(user);
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const getAuthHeadersWithContentType = async (): Promise<HeadersInit> => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  const user = auth.currentUser;
  if (user) {
    const token = await getIdToken(user);
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};
