import { getAuthHeaders, getAuthHeadersWithContentType } from './api-helpers';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === 'production'
    ? 'https://maeorganics-backend.vercel.app'
    : 'http://localhost:5000');

export interface Address {
  _id: string;
  fullName: string;
  phone: string;
  pincode: string;
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  city: string;
  state: string;
  country: string;
  isDefault: boolean;
  addressType: 'home' | 'work' | 'other';
}

export const getAddresses = async (): Promise<{ success: boolean; data: Address[] }> => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/api/addresses`, { headers });
  if (!response.ok) {
    throw new Error('Failed to fetch addresses');
  }
  return response.json();
};

export const addAddress = async (
  addressData: Omit<Address, '_id'>
): Promise<{ success: boolean; data: Address }> => {
  const headers = await getAuthHeadersWithContentType();
  const response = await fetch(`${API_BASE_URL}/api/addresses`, {
    method: 'POST',
    headers,
    body: JSON.stringify(addressData),
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error((errorData as any).message || 'Failed to add address');
  }
  
  return response.json();
};

export const updateAddress = async (id: string, addressData: Partial<Omit<Address, '_id' | 'userId'>>): Promise<{ success: boolean; data: Address }> => {
  const headers = await getAuthHeadersWithContentType();
  const response = await fetch(`${API_BASE_URL}/api/addresses/${id}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(addressData),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to update address');
  }
  
  return response.json();
};

export const deleteAddress = async (id: string): Promise<{ success: boolean }> => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/api/addresses/${id}`, {
    method: 'DELETE',
    headers,
  });
  
  if (!response.ok) {
    throw new Error('Failed to delete address');
  }
  
  return response.json();
};

export const setDefaultAddress = async (id: string): Promise<{ success: boolean; data: Address }> => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/api/addresses/${id}/set-default`, {
    method: 'PATCH',
    headers,
  });
  
  if (!response.ok) {
    throw new Error('Failed to set default address');
  }
  
  return response.json();
};
