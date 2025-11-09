const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface Contact extends ContactFormData {
  _id: string;
  status: 'new' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  adminNotes?: string;
  respondedAt?: string;
  respondedBy?: {
    _id: string;
    displayName: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Submit contact form (Public)
export const submitContactForm = async (formData: ContactFormData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to submit contact form');
    }

    return data;
  } catch (error) {
    console.error('Submit contact form error:', error);
    throw error;
  }
};

// Get all contacts (Admin)
export const getAllContacts = async (filters?: {
  status?: string;
  priority?: string;
  page?: number;
  limit?: number;
}) => {
  try {
    const { auth } = await import('@/lib/firebase');
    const { getIdToken } = await import('firebase/auth');

    const user = auth.currentUser;
    if (!user) {
      throw new Error('Authentication required');
    }

    const token = await getIdToken(user);
    const queryParams = new URLSearchParams();
    
    if (filters?.status) queryParams.append('status', filters.status);
    if (filters?.priority) queryParams.append('priority', filters.priority);
    if (filters?.page) queryParams.append('page', filters.page.toString());
    if (filters?.limit) queryParams.append('limit', filters.limit.toString());

    const response = await fetch(
      `${API_BASE_URL}/api/contact?${queryParams.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch contacts');
    }

    return data;
  } catch (error) {
    console.error('Get contacts error:', error);
    throw error;
  }
};

// Get contact by ID (Admin)
export const getContactById = async (id: string) => {
  try {
    const { auth } = await import('@/lib/firebase');
    const { getIdToken } = await import('firebase/auth');

    const user = auth.currentUser;
    if (!user) {
      throw new Error('Authentication required');
    }

    const token = await getIdToken(user);

    const response = await fetch(`${API_BASE_URL}/api/contact/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch contact');
    }

    return data;
  } catch (error) {
    console.error('Get contact error:', error);
    throw error;
  }
};

// Update contact (Admin)
export const updateContact = async (
  id: string,
  updates: {
    status?: string;
    priority?: string;
    adminNotes?: string;
  }
) => {
  try {
    const { auth } = await import('@/lib/firebase');
    const { getIdToken } = await import('firebase/auth');

    const user = auth.currentUser;
    if (!user) {
      throw new Error('Authentication required');
    }

    const token = await getIdToken(user);

    const response = await fetch(`${API_BASE_URL}/api/contact/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to update contact');
    }

    return data;
  } catch (error) {
    console.error('Update contact error:', error);
    throw error;
  }
};

// Delete contact (Admin)
export const deleteContact = async (id: string) => {
  try {
    const { auth } = await import('@/lib/firebase');
    const { getIdToken } = await import('firebase/auth');

    const user = auth.currentUser;
    if (!user) {
      throw new Error('Authentication required');
    }

    const token = await getIdToken(user);

    const response = await fetch(`${API_BASE_URL}/api/contact/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete contact');
    }

    return data;
  } catch (error) {
    console.error('Delete contact error:', error);
    throw error;
  }
};

// Get contact statistics (Admin)
export const getContactStats = async () => {
  try {
    const { auth } = await import('@/lib/firebase');
    const { getIdToken } = await import('firebase/auth');

    const user = auth.currentUser;
    if (!user) {
      throw new Error('Authentication required');
    }

    const token = await getIdToken(user);

    const response = await fetch(`${API_BASE_URL}/api/contact/stats`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch statistics');
    }

    return data;
  } catch (error) {
    console.error('Get contact stats error:', error);
    throw error;
  }
};
