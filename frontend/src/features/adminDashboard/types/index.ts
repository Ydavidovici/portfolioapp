// src/features/adminDashboard/types/index.ts

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface Role {
  id: number;
  name: string;
}

export interface AdminState {
  users: User[];
  roles: Role[];
  loading: boolean;
  error: string | null;
}
