// src/features/auth/types/index.ts

export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  // Add other user-related fields
}
