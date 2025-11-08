import { getAuthHeadersWithContentType, getAuthHeaders } from '@/lib/api-helpers';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

export const getCoupons = async () => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/api/coupons`, { headers });
  if (!response.ok) {
    throw new Error('Failed to fetch coupons');
  }
  return response.json();
};

export const getCoupon = async (id: string) => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/api/coupons/${id}`, { headers });
  if (!response.ok) {
    throw new Error('Failed to fetch coupon');
  }
  return response.json();
};

export const createCoupon = async (couponData: any) => {
  const headers = await getAuthHeadersWithContentType();
  const response = await fetch(`${API_BASE_URL}/api/coupons`, {
    method: 'POST',
    headers,
    body: JSON.stringify(couponData),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to create coupon');
  }
  return response.json();
};

export const updateCoupon = async (id: string, couponData: any) => {
  const headers = await getAuthHeadersWithContentType();
  const response = await fetch(`${API_BASE_URL}/api/coupons/${id}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(couponData),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to update coupon');
  }
  return response.json();
};

export const deleteCoupon = async (id: string) => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/api/coupons/${id}`, {
    method: 'DELETE',
    headers,
  });
  if (!response.ok) {
    throw new Error('Failed to delete coupon');
  }
  return response.json();
};
