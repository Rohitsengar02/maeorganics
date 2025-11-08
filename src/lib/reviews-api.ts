const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

// Helper function to get auth headers
const getAuthHeaders = async (): Promise<Record<string, string>> => {
  try {
    // Import Firebase auth dynamically to avoid SSR issues
    const { auth } = await import('@/lib/firebase');
    const { getIdToken } = await import('firebase/auth');

    const user = auth.currentUser;
    if (user) {
      const token = await getIdToken(user);
      return {
        'Authorization': `Bearer ${token}`,
        // Don't set Content-Type for GET requests
      };
    }
  } catch (error) {
    console.error('Error getting auth token:', error);
  }

  // Return empty headers when not authenticated
  return {};
};

// Helper function to get auth headers with content type (for POST/PUT requests)
const getAuthHeadersWithContentType = async (): Promise<Record<string, string>> => {
  try {
    // Import Firebase auth dynamically to avoid SSR issues
    const { auth } = await import('@/lib/firebase');
    const { getIdToken } = await import('firebase/auth');

    const user = auth.currentUser;
    if (user) {
      const token = await getIdToken(user);
      return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      };
    }
  } catch (error) {
    console.error('Error getting auth token:', error);
  }

  return {
    'Content-Type': 'application/json',
  };
};

// Utility function to get reviews for a product
export const getProductReviews = async (productId: string, params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const url = `${API_BASE_URL}/api/reviews/product/${productId}${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch reviews');
    }

    return data;
  } catch (error) {
    console.error('Get product reviews error:', error);
    throw error;
  }
};

// Utility function to get single review
export const getReview = async (reviewId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/reviews/${reviewId}`);

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch review');
    }

    return data;
  } catch (error) {
    console.error('Get review error:', error);
    throw error;
  }
};

// Utility function to create review
export const createReview = async (reviewData: any) => {
  try {
    console.log('🔄 Creating review...');

    const headers = await getAuthHeadersWithContentType();

    const response = await fetch(`${API_BASE_URL}/api/reviews`, {
      method: 'POST',
      headers,
      body: JSON.stringify(reviewData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP ${response.status}: ${data.message || 'Unknown error'}`);
    }

    console.log('✅ Review created successfully');
    return data;
  } catch (error) {
    console.error('❌ Create review error:', error);
    throw error;
  }
};

// Utility function to update review
export const updateReview = async (reviewId: string, reviewData: any) => {
  try {
    const headers = await getAuthHeadersWithContentType();

    const response = await fetch(`${API_BASE_URL}/api/reviews/${reviewId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(reviewData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to update review');
    }

    return data;
  } catch (error) {
    console.error('Update review error:', error);
    throw error;
  }
};

// Utility function to delete review
export const deleteReview = async (reviewId: string) => {
  try {
    const headers = await getAuthHeaders();

    const response = await fetch(`${API_BASE_URL}/api/reviews/${reviewId}`, {
      method: 'DELETE',
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete review');
    }

    return data;
  } catch (error) {
    console.error('Delete review error:', error);
    throw error;
  }
};

// Utility function to mark review as helpful
export const markReviewHelpful = async (reviewId: string) => {
  try {
    const headers = await getAuthHeadersWithContentType();

    const response = await fetch(`${API_BASE_URL}/api/reviews/${reviewId}/helpful`, {
      method: 'POST',
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to mark review as helpful');
    }

    return data;
  } catch (error) {
    console.error('Mark review helpful error:', error);
    throw error;
  }
};

// Utility function to report review
export const reportReview = async (reviewId: string, reason?: string) => {
  try {
    const headers = await getAuthHeadersWithContentType();

    const response = await fetch(`${API_BASE_URL}/api/reviews/${reviewId}/report`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ reason }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to report review');
    }

    return data;
  } catch (error) {
    console.error('Report review error:', error);
    throw error;
  }
};

// Utility function to get all reviews (admin only)
export const getAllReviews = async (params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const url = `${API_BASE_URL}/api/reviews${queryString ? `?${queryString}` : ''}`;

    const headers = await getAuthHeaders();

    const response = await fetch(url, { headers });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch reviews');
    }

    return data;
  } catch (error) {
    console.error('Get all reviews error:', error);
    throw error;
  }
};

// Utility function to update review status (admin only)
export const updateReviewStatus = async (reviewId: string, status: string, adminComment?: string) => {
  try {
    const headers = await getAuthHeadersWithContentType();

    const response = await fetch(`${API_BASE_URL}/api/reviews/${reviewId}/status`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ status, adminComment }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to update review status');
    }

    return data;
  } catch (error) {
    console.error('Update review status error:', error);
    throw error;
  }
};
