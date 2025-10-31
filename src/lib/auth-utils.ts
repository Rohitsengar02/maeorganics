// Helper to safely parse JWT token
export const parseJwt = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) {
      console.error('Invalid JWT token format');
      return null;
    }
    
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error parsing JWT:', error);
    return null;
  }
};

export const getCurrentUserId = (): string => {
  if (typeof window === 'undefined') {
    console.error('getCurrentUserId called on server side');
    throw new Error('This function can only be used in the browser');
  }

  // Check for token in localStorage
  let token = localStorage.getItem('token');
  console.log('Token from localStorage:', token ? 'Found' : 'Not found');
  
  // If not in localStorage, check sessionStorage (common in some auth flows)
  if (!token) {
    token = sessionStorage.getItem('token');
    console.log('Token from sessionStorage:', token ? 'Found' : 'Not found');
  }

  if (!token) {
    console.error('No authentication token found in localStorage or sessionStorage');
    throw new Error('Please sign in to continue');
  }

  try {
    const payload = parseJwt(token);
    if (!payload) {
      throw new Error('Invalid token format');
    }
    
    console.log('Decoded token payload:', payload);
    
    // Check different possible user ID fields
    const userId = payload.id || payload.userId || payload.sub;
    
    if (!userId) {
      console.error('User ID not found in token payload');
      throw new Error('User information not found in session');
    }
    
    return userId.toString();
  } catch (error) {
    console.error('Error getting user ID:', error);
    // Clear invalid token
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    throw new Error('Session expired. Please sign in again.');
  }
};
