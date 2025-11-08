const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

// Helper function to get auth headers
const getAuthHeaders = async (): Promise<Record<string, string>> => {
  try {
    const { auth } = await import('@/lib/firebase');
    const { getIdToken } = await import('firebase/auth');

    const user = auth.currentUser;
    if (user) {
      const token = await getIdToken(user);
      return {
        'Authorization': `Bearer ${token}`,
      };
    }
  } catch (error) {
    console.error('Error getting auth token:', error);
  }

  return {};
};

// Helper function to get auth headers with content type
const getAuthHeadersWithContentType = async (): Promise<Record<string, string>> => {
  try {
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

// Get home page settings
export const getHomePageSettings = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/homepage-settings`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch home page settings');
    }

    return data;
  } catch (error) {
    console.error('Get home page settings error:', error);
    throw error;
  }
};

// Update home page settings
export const updateHomePageSettings = async (settings: any) => {
  try {
    const headers = await getAuthHeadersWithContentType();

    const response = await fetch(`${API_BASE_URL}/api/homepage-settings`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(settings),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to update home page settings');
    }

    return data;
  } catch (error) {
    console.error('Update home page settings error:', error);
    throw error;
  }
};

// Add hero slide
export const addHeroSlide = async (slideData: any) => {
  try {
    const headers = await getAuthHeadersWithContentType();

    const response = await fetch(`${API_BASE_URL}/api/homepage-settings/hero-slide`, {
      method: 'POST',
      headers,
      body: JSON.stringify(slideData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to add hero slide');
    }

    return data;
  } catch (error) {
    console.error('Add hero slide error:', error);
    throw error;
  }
};

// Update hero slide
export const updateHeroSlide = async (slideId: string, slideData: any) => {
  try {
    const headers = await getAuthHeadersWithContentType();

    const response = await fetch(`${API_BASE_URL}/api/homepage-settings/hero-slide/${slideId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(slideData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to update hero slide');
    }

    return data;
  } catch (error) {
    console.error('Update hero slide error:', error);
    throw error;
  }
};

// Delete hero slide
export const deleteHeroSlide = async (slideId: string) => {
  try {
    const headers = await getAuthHeaders();

    const response = await fetch(`${API_BASE_URL}/api/homepage-settings/hero-slide/${slideId}`, {
      method: 'DELETE',
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete hero slide');
    }

    return data;
  } catch (error) {
    console.error('Delete hero slide error:', error);
    throw error;
  }
};

// Add navigation link
export const addNavLink = async (label: string, href: string) => {
  try {
    const headers = await getAuthHeadersWithContentType();

    const response = await fetch(`${API_BASE_URL}/api/homepage-settings/nav-link`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ label, href }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to add navigation link');
    }

    return data;
  } catch (error) {
    console.error('Add nav link error:', error);
    throw error;
  }
};

// Delete navigation link
export const deleteNavLink = async (index: number) => {
  try {
    const headers = await getAuthHeaders();

    const response = await fetch(`${API_BASE_URL}/api/homepage-settings/nav-link/${index}`, {
      method: 'DELETE',
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete navigation link');
    }

    return data;
  } catch (error) {
    console.error('Delete nav link error:', error);
    throw error;
  }
};
