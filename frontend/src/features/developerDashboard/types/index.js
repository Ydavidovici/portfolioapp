// src/features/developerDashboard/types/index.ts

export interface Client {
    id: string;
    name: string;
    email: string;
}

export interface Task {
    id: string;
    title: string;
    completed: boolean;
    dueDate?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Feedback {
    id: string;
    comment: string;
    rating: number;
    createdAt: string;
    updatedAt: string;
}

export interface Project {
    id: string;
    name: string;
    description?: string;
    status: 'active' | 'completed' | 'on-hold';
    client: Client;
    tasks: Task[];
    feedback: Feedback[];
    createdAt: string;
    updatedAt: string;
}

export interface Message {
    id: string;
    senderName: string;
    content: string;
    createdAt: string;
}

export interface Board {
    id: string;
    name: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CalendarEntry {
    id: string;
    title: string;
    date: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Checklist {
    id: string;
    title: string;
    items: ChecklistItem[];
    createdAt: string;
    updatedAt: string;
}

export interface ChecklistItem {
    id: string;
    checklistId: string;
    content: string;
    completed: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Document {
    id: string;
    title: string;
    url: string;
    uploadedAt: string;
}

export interface Invoice {
    id: string;
    number: string;
    amount: number;
    status: 'paid' | 'unpaid' | 'overdue';
    createdAt: string;
    updatedAt: string;
}

export interface Note {
    id: string;
    content: string;
    createdAt: string;
    updatedAt: string;
}

export interface Payment {
    id: string;
    method: string;
    amount: number;
    date: string;
    createdAt: string;
    updatedAt: string;
}

export interface QuickBooksToken {
    id: string;
    token: string;
    expiresAt: string;
    createdAt: string;
    updatedAt: string;
}

export interface Reminder {
    id: string;
    message: string;
    remindAt: string;
    createdAt: string;
    updatedAt: string;
}

export interface TaskList {
    id: string;
    name: string;
    tasks: Task[];
    createdAt: string;
    updatedAt: string;
}

export interface DeveloperDashboardState {
    projects: Project[];
    tasks: Task[];
    boards: Board[];
    calendarEntries: CalendarEntry[];
    checklists: Checklist[];
    checklistItems: ChecklistItem[];
    documents: Document[];
    invoices: Invoice[];
    feedback: Feedback[];
    notes: Note[];
    payments: Payment[];
    quickBooksTokens: QuickBooksToken[];
    reminders: Reminder[];
    taskLists: TaskList[];
    messages: Message[];
    loading: boolean;
    error: string | null;
}
