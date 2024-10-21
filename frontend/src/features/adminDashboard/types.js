// src/features/adminDashboard/types/store.ts

import {Board} from "../developerDashboard/types";

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

export interface AdminDashboardState {
  users: User[];
  roles: Role[];
  boards: Board[],
  calendarEntries: calendarEntries[],
  checklists: [],
  checklistItems: [],
  documents: [],
  feedbacks: [],
  invoices: [],
  messages: [],
  notes: [],
  payments: [],
  quickBooksTokens: [],
  reminders: [],
  tasks: [],
  taskLists: [],
  loading: boolean;
  error: string | null;
}
