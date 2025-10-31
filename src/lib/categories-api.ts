const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === 'production'
    ? 'https://maeorganics-backend.vercel.app'
    : 'http://localhost:5000');

// Utility function to upload image to Cloudinary
export const uploadToCloudinary = async (file: File, folder: string = 'maeorganics/categories') => {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dntayojln';
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'maeorganicsindia';

  console.log('🔄 Starting Cloudinary upload...');
  console.log('Cloud Name:', cloudName);
  console.log('Upload Preset:', uploadPreset);
  console.log('File:', file.name, file.size, file.type);

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);
  formData.append('folder', folder);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    console.log('Response status:', response.status);

    const data = await response.json();
    console.log('Response data:', data);

    if (!response.ok) {
      throw new Error(data.error?.message || `Upload failed with status ${response.status}`);
    }

    console.log('✅ Cloudinary upload successful');
    return {
      url: data.secure_url,
      publicId: data.public_id,
      width: data.width,
      height: data.height
    };
  } catch (error) {
    console.error('❌ Cloudinary upload error:', error);
    throw error;
  }
};

// Utility function to get all categories
export const getCategories = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/categories`);

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch categories');
    }

    return data;
  } catch (error) {
    console.error('Get categories error:', error);
    throw error;
  }
};

// Utility function to get single category
export const getCategory = async (id: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/categories/${id}`);

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch category');
    }

    return data;
  } catch (error) {
    console.error('Get category error:', error);
    throw error;
  }
};

// Utility function to create category
export const createCategory = async (categoryData: any) => {
  try {
    console.log('🔄 Creating category...');

    const response = await fetch(`${API_BASE_URL}/api/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(categoryData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP ${response.status}: ${data.message || 'Unknown error'}`);
    }

    console.log('✅ Category created successfully');
    return data;
  } catch (error) {
    console.error('❌ Create category error:', error);
    throw error;
  }
};

// Utility function to update category
export const updateCategory = async (id: string, categoryData: any) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/categories/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(categoryData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to update category');
    }

    return data;
  } catch (error) {
    console.error('Update category error:', error);
    throw error;
  }
};

// Utility function to delete category
export const deleteCategory = async (id: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/categories/${id}`, {
      method: 'DELETE',
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete category');
    }

    return data;
  } catch (error) {
    console.error('Delete category error:', error);
    throw error;
  }
};

// Utility function to get category tree
export const getCategoryTree = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/categories/tree`);

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch category tree');
    }

    return data;
  } catch (error) {
    console.error('Get category tree error:', error);
    throw error;
  }
};
