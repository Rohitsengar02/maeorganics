const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === 'production'
    ? 'https://maeorganics-backend.vercel.app'
    : 'http://localhost:5000');

// Utility function to sync Firebase user data to MongoDB
export const syncUserToMongoDB = async (userData: {
  uid: string;
  email: string;
  fullName?: string;
  imageUrl?: string;
  cloudinaryImageUrl?: string;
  phoneNumber?: string;
  emailVerified?: boolean;
}, token: string) => {
  try {
    console.log('🔄 Starting MongoDB sync...');
    console.log('API URL:', `${API_BASE_URL}/api/users/sync`);
    console.log('User Data:', userData);
    console.log('Token exists:', !!token);

    const response = await fetch(`${API_BASE_URL}/api/users/sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });

    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);

    const data = await response.json();
    console.log('Response data:', data);

    if (!response.ok) {
      throw new Error(data.message || `HTTP ${response.status}: ${data.message || 'Unknown error'}`);
    }

    console.log('✅ MongoDB sync successful');
    return data;
  } catch (error) {
    console.error('❌ Sync to MongoDB error:', error);
    throw error;
  }
};

// Utility function to get user data from MongoDB
export const getUserFromMongoDB = async (uid: string, token: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/firebase/${uid}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch user data');
    }

    return data;
  } catch (error) {
    console.error('Get user from MongoDB error:', error);
    throw error;
  }
};

// Utility function to update user profile in MongoDB
export const updateUserProfileInMongoDB = async (profileData: {
  fullName?: string;
  phoneNumber?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
}, token: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to update profile');
    }

    return data;
  } catch (error) {
    console.error('Update profile in MongoDB error:', error);
    throw error;
  }
};
