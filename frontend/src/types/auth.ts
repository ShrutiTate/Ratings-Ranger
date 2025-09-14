export interface User {
  id: string;
  name: string;
  email: string;
  address: string;
  role: 'normal' | 'store_owner' | 'admin';
  storeId?: string; // For store owners
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  address: string;
  password: string;
}

export interface ChangePasswordRequest {
  userId: string;
  newPassword: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}