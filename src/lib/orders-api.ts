import { getAuthHeaders, getAuthHeadersWithContentType } from './api-helpers';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === 'production'
    ? 'https://maeorganics-backend.vercel.app'
    : 'http://localhost:5000');

export interface OrderItem {
  productId: string;
  name: string;
  imageUrl: string;
  price: number;
  quantity: number;
}

export interface AddressSnapshot {
  fullName: string;
  phone: string;
  pincode: string;
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  city: string;
  state: string;
  country: string;
  addressType: 'home' | 'work' | 'other';
}

export interface PaymentInfo {
  method: 'upi' | 'phonepe' | 'paytm' | 'cod';
  status?: 'pending' | 'paid' | 'cod';
  provider?: string;
  transactionId?: string;
  upiId?: string;
}

export interface Amounts {
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  currency?: string;
}

export interface CouponMini {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
}

export interface OrderPayload {
  items: OrderItem[];
  address: AddressSnapshot;
  payment: PaymentInfo;
  amounts: Amounts;
  coupon?: CouponMini | null;
  notes?: string;
}

export const createOrder = async (payload: OrderPayload): Promise<{ success: boolean; data: any }> => {
  const headers = await getAuthHeadersWithContentType();
  const res = await fetch(`${API_BASE_URL}/api/orders`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as any).message || 'Failed to create order');
  }
  return res.json();
};

export const getOrderById = async (id: string): Promise<{ success: boolean; data: any }> => {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_BASE_URL}/api/orders/${id}`, { headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as any).message || 'Failed to fetch order');
  }
  return res.json();
};

export const getMyOrders = async (): Promise<{ success: boolean; data: any[] }> => {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_BASE_URL}/api/orders`, { headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as any).message || 'Failed to fetch orders');
  }
  return res.json();
};

export const updateOrder = async (id: string, updates: { status?: string }): Promise<{ success: boolean; data: any }> => {
  const headers = await getAuthHeadersWithContentType();
  const res = await fetch(`${API_BASE_URL}/api/orders/${id}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(updates),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as any).message || 'Failed to update order');
  }
  return res.json();
};

// Admin: fetch all orders
export const adminGetAllOrders = async (): Promise<{ success: boolean; data: any[] }> => {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_BASE_URL}/api/orders/admin/all`, { headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as any).message || 'Failed to fetch all orders');
  }
  return res.json();
};

// Admin: update order status
export const adminUpdateOrderStatus = async (id: string, status: string): Promise<{ success: boolean; data: any }> => {
  const headers = await getAuthHeadersWithContentType();
  const res = await fetch(`${API_BASE_URL}/api/orders/admin/${id}/status`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({ status }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as any).message || 'Failed to update order status');
  }
  return res.json();
};
