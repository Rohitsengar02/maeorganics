import { getAuthHeadersWithContentType, getAuthHeaders } from '@/lib/api-helpers';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

export const getCart = async () => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/api/cart`, { headers });
  if (!response.ok) {
    throw new Error('Failed to fetch cart');
  }
  return response.json();
};

export const addItemToCart = async (productId: string, quantity: number) => {
  const headers = await getAuthHeadersWithContentType();
  const response = await fetch(`${API_BASE_URL}/api/cart`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ productId, quantity }),
  });
  if (!response.ok) {
    throw new Error('Failed to add item to cart');
  }
  return response.json();
};

export const removeItemFromCart = async (productId: string) => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/api/cart/${productId}`, {
    method: 'DELETE',
    headers,
  });
  if (!response.ok) {
    throw new Error('Failed to remove item from cart');
  }
  return response.json();
};
