import { User, LoginRequest, SignupRequest, ChangePasswordRequest } from '@/types/auth';
import { Store, Rating, UserRating, StoreWithUserRating } from '@/types/store';

const API_BASE = 'http://localhost:5000'; // Change if your backend runs elsewhere

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ------------------- AUTH API -------------------
export const authApi = {
  async login(credentials: LoginRequest): Promise<User> {
    const res = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    if (!res.ok) throw new Error('Invalid email or password');
    const data = await res.json();
    localStorage.setItem('token', data.token);
    return data.user;
  },

  async signup(userData: SignupRequest): Promise<User> {
    const res = await fetch(`${API_BASE}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    if (!res.ok) throw new Error('Signup failed');
    const data = await res.json();
    localStorage.setItem('token', data.token);
    return data.user || data;
  },

  async logout(): Promise<void> {
    localStorage.removeItem('token');
  },

  async getCurrentUser(): Promise<User | null> {
    // TODO: Implement a /me endpoint in your backend if needed
    return null;
  },

  async changePassword(data: ChangePasswordRequest): Promise<void> {
    const res = await fetch(`${API_BASE}/users/${data.userId}/password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ password: data.newPassword }),
    });
    if (!res.ok) throw new Error('Password update failed');
  },
};

// ------------------- STORE API -------------------
export const storeApi = {
  async getStores(): Promise<Store[]> {
    const res = await fetch(`${API_BASE}/stores`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch stores');
    return res.json();
  },

  async getStoresWithUserRatings(userId: string): Promise<StoreWithUserRating[]> {
    const res = await fetch(`${API_BASE}/stores/user/${userId}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch stores with ratings');
    return res.json();
  },

  async addStore(
  store: Omit<Store, 'id' | 'createdAt' | 'averageRating' | 'totalRatings'>
): Promise<Store> {
  const { ownerId, ...rest } = store;

  const payload = {
    ...rest,
    owner_id: ownerId, // ✅ backend expects snake_case
  };

  const res = await fetch(`${API_BASE}/stores`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to add store');
  return res.json();
},
};

// ------------------- RATING API -------------------
export const ratingApi = {
  async submitRating(userId: string, storeId: string, rating: number): Promise<Rating> {
    const res = await fetch(`${API_BASE}/ratings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ user_id: userId, store_id: storeId, rating }),
    });
    if (!res.ok) throw new Error('Failed to submit rating');
    return res.json();
  },

  async getStoreRatings(storeId: string): Promise<UserRating[]> {
    const res = await fetch(`${API_BASE}/ratings/${storeId}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch ratings');
    return res.json();
  },
};

// ------------------- ADMIN API -------------------
export const adminApi = {
  async getUsers(): Promise<User[]> {
    const res = await fetch(`${API_BASE}/users`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch users');
    return res.json();
  },

  async addUser(userData: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    const res = await fetch(`${API_BASE}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(userData),
    });
    if (!res.ok) throw new Error('Failed to add user');
    return res.json();
  },

  async getDashboardStats(): Promise<{
    totalUsers: number;
    totalStores: number;
    totalRatings: number;
  }> {
    const res = await fetch(`${API_BASE}/admin/dashboard`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch dashboard stats');
    return res.json();
  },
};
