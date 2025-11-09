import { getAuthHeaders, getAuthHeadersWithContentType } from './api-helpers';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

export interface ComboProduct {
  product: string | {
    _id: string;
    name: string;
    images: string[];
    price: number;
    stock: number;
  };
  quantity: number;
}

export interface Combo {
  _id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription?: string;
  products: ComboProduct[];
  bannerImage: string;
  images?: string[];
  originalPrice: number;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  finalPrice: number;
  savings: number;
  coupon?: string | any;
  isActive: boolean;
  isFeatured: boolean;
  startDate?: string;
  endDate?: string;
  stock: number;
  soldCount: number;
  tags?: string[];
  category: 'seasonal' | 'bestseller' | 'limited' | 'special' | 'clearance' | 'other';
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string[];
  };
  createdAt: string;
  updatedAt: string;
}

// Get all combos
export const getCombos = async (filters?: {
  isActive?: boolean;
  isFeatured?: boolean;
  category?: string;
  page?: number;
  limit?: number;
  sort?: string;
}) => {
  try {
    const queryParams = new URLSearchParams();
    
    if (filters?.isActive !== undefined) queryParams.append('isActive', filters.isActive.toString());
    if (filters?.isFeatured !== undefined) queryParams.append('isFeatured', filters.isFeatured.toString());
    if (filters?.category) queryParams.append('category', filters.category);
    if (filters?.page) queryParams.append('page', filters.page.toString());
    if (filters?.limit) queryParams.append('limit', filters.limit.toString());
    if (filters?.sort) queryParams.append('sort', filters.sort);

    const response = await fetch(`${API_BASE_URL}/api/combos?${queryParams.toString()}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch combos');
    }

    return data;
  } catch (error) {
    console.error('Get combos error:', error);
    throw error;
  }
};

// Get single combo by ID or slug
export const getCombo = async (id: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/combos/${id}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch combo');
    }

    return data;
  } catch (error) {
    console.error('Get combo error:', error);
    throw error;
  }
};

// Create new combo (Admin)
export const createCombo = async (comboData: any) => {
  try {
    console.log('[COMBO API] Creating combo with data:', comboData);
    const headers = await getAuthHeadersWithContentType();
    console.log('[COMBO API] Headers:', headers);

    const response = await fetch(`${API_BASE_URL}/api/combos`, {
      method: 'POST',
      headers,
      body: JSON.stringify(comboData),
    });

    console.log('[COMBO API] Response status:', response.status);
    const data = await response.json();
    console.log('[COMBO API] Response data:', JSON.stringify(data, null, 2));

    if (!response.ok) {
      console.error('[COMBO API] Server error details:');
      console.error('  - Message:', data.message);
      console.error('  - Error:', data.error);
      console.error('  - Details:', data.details);
      console.error('  - Full response:', JSON.stringify(data, null, 2));
      throw new Error(data.message || data.error || 'Failed to create combo');
    }

    return data;
  } catch (error) {
    console.error('[COMBO API] Create combo error:', error);
    throw error;
  }
};

// Update combo (Admin)
export const updateCombo = async (id: string, comboData: any) => {
  try {
    const headers = await getAuthHeadersWithContentType();

    const response = await fetch(`${API_BASE_URL}/api/combos/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(comboData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to update combo');
    }

    return data;
  } catch (error) {
    console.error('Update combo error:', error);
    throw error;
  }
};

// Delete combo (Admin)
export const deleteCombo = async (id: string) => {
  try {
    const headers = await getAuthHeaders();

    const response = await fetch(`${API_BASE_URL}/api/combos/${id}`, {
      method: 'DELETE',
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete combo');
    }

    return data;
  } catch (error) {
    console.error('Delete combo error:', error);
    throw error;
  }
};

// Toggle combo active status (Admin)
export const toggleComboActive = async (id: string) => {
  try {
    const headers = await getAuthHeadersWithContentType();

    const response = await fetch(`${API_BASE_URL}/api/combos/${id}/toggle-active`, {
      method: 'PATCH',
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to toggle combo status');
    }

    return data;
  } catch (error) {
    console.error('Toggle combo active error:', error);
    throw error;
  }
};

// Get combo statistics (Admin)
export const getComboStats = async () => {
  try {
    const headers = await getAuthHeaders();

    const response = await fetch(`${API_BASE_URL}/api/combos/admin/stats`, {
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch statistics');
    }

    return data;
  } catch (error) {
    console.error('Get combo stats error:', error);
    throw error;
  }
};
