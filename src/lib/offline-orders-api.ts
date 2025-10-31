import { getAuthHeaders, getAuthHeadersWithContentType } from './api-helpers';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === 'production'
    ? 'https://maeorganics.vercel.app'
    : 'http://localhost:5000');

export interface OfflineOrderItem {
  productId: string;
  name: string;
  imageUrl?: string;
  price: number;
  quantity: number;
}

export interface OfflineAddress {
  fullName: string;
  phone: string;
  pincode: string;
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  city: string;
  state: string;
  country: string;
}

export interface OfflineCustomer {
  fullName: string;
  email?: string;
  phone?: string;
}

export interface OfflinePayment {
  method: 'cash' | 'upi' | 'card' | 'other';
  status: 'paid' | 'pending';
  notes?: string;
}

export interface OfflineAmounts {
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  currency?: string;
}

export interface OfflineOrderPayload {
  items: OfflineOrderItem[];
  customer: OfflineCustomer;
  shippingAddress: OfflineAddress;
  deliveryAddress: OfflineAddress;
  payment: OfflinePayment;
  amounts: OfflineAmounts;
  status?: 'created' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  notes?: string;
}

export const createOfflineOrder = async (payload: OfflineOrderPayload) => {
  const headers = await getAuthHeadersWithContentType();
  const res = await fetch(`${API_BASE_URL}/api/offline-orders`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as any).message || 'Failed to create offline order');
  }
  return res.json();
};

export const getOfflineOrders = async () => {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_BASE_URL}/api/offline-orders`, { headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as any).message || 'Failed to fetch offline orders');
  }
  return res.json();
};

export const getOfflineOrderById = async (id: string) => {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_BASE_URL}/api/offline-orders/${id}`, { headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as any).message || 'Failed to fetch offline order');
  }
  return res.json();
};

export const updateOfflineOrder = async (id: string, updates: Record<string, any>) => {
  const headers = await getAuthHeadersWithContentType();
  const res = await fetch(`${API_BASE_URL}/api/offline-orders/${id}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(updates),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as any).message || 'Failed to update offline order');
  }
  return res.json();
};
