// src/features/auth/types/types.ts

// Existing Types
export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  // Add other user-related fields as necessary
}

export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Password Reset Payload
export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
}

// Email Verification Payload (if needed)
export interface VerifyEmailPayload {
  token: string;
}
