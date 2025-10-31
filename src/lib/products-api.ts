const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === 'production'
    ? 'https://maeorganics-backend.vercel.app'
    : 'http://localhost:5000');

// Utility function to get all products
export const getProducts = async (params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const url = `${API_BASE_URL}/api/products${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch products');
    }

    return data;
  } catch (error) {
    console.error('Get products error:', error);
    throw error;
  }
};

// Utility function to get single product
export const getProduct = async (id: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/products/${id}`);

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch product');
    }

    return data;
  } catch (error) {
    console.error('Get product error:', error);
    throw error;
  }
};

// Utility function to create product
export const createProduct = async (productData: any) => {
  try {
    console.log('🔄 Creating product...');

    const response = await fetch(`${API_BASE_URL}/api/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP ${response.status}: ${data.message || 'Unknown error'}`);
    }

    console.log('✅ Product created successfully');
    return data;
  } catch (error) {
    console.error('❌ Create product error:', error);
    throw error;
  }
};

// Utility function to update product
export const updateProduct = async (id: string, productData: any) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to update product');
    }

    return data;
  } catch (error) {
    console.error('Update product error:', error);
    throw error;
  }
};

// Utility function to delete product
export const deleteProduct = async (id: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
      method: 'DELETE',
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete product');
    }

    return data;
  } catch (error) {
    console.error('Delete product error:', error);
    throw error;
  }
};

// Utility function to get products by category
export const getProductsByCategory = async (categoryId: string, params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const url = `${API_BASE_URL}/api/products/category/${categoryId}${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch products by category');
    }

    return data;
  } catch (error) {
    console.error('Get products by category error:', error);
    throw error;
  }
};

// Utility function to search products
export const searchProducts = async (query: string, limit = 20) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/products/search?q=${encodeURIComponent(query)}&limit=${limit}`);

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to search products');
    }

    return data;
  } catch (error) {
    console.error('Search products error:', error);
    throw error;
  }
};
