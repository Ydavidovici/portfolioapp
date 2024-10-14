// src/features/developerDashboard/services/developerService.ts

import axios from 'axios';
import {
    Project,
    Task,
    Board,
    CalendarEntry,
    Checklist,
    ChecklistItem,
    Document,
    Invoice,
    Feedback,
    Note,
    Payment,
    QuickBooksToken,
    Reminder,
    TaskList,
    Message,
} from '../types';

/**
 * Base API URL for the Developer Dashboard.
 * Adjust the base URL as per your backend configuration.
 */
const API_URL = '/api/developer-dashboard';

/**
 * Generic function to handle GET requests.
 */
const get = async <T>(endpoint: string): Promise<T> => {
    try {
        const response = await axios.get<T>(`${API_URL}${endpoint}`);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'An error occurred');
    }
};

/**
 * Generic function to handle POST requests.
 */
const post = async <T, R>(endpoint: string, data: T): Promise<R> => {
    try {
        const response = await axios.post<R>(`${API_URL}${endpoint}`, data);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'An error occurred');
    }
};

/**
 * Generic function to handle PUT requests.
 */
const put = async <T, R>(endpoint: string, data: T): Promise<R> => {
    try {
        const response = await axios.put<R>(`${API_URL}${endpoint}`, data);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'An error occurred');
    }
};

/**
 * Generic function to handle DELETE requests.
 */
const remove = async (endpoint: string): Promise<void> => {
    try {
        await axios.delete(`${API_URL}${endpoint}`);
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'An error occurred');
    }
};

/**
 * Projects
 */
export const fetchProjects = async (): Promise<Project[]> => {
    return get<Project[]>('/projects');
};

export const createProject = async (
    project: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'client' | 'tasks' | 'feedback'>
): Promise<Project> => {
    return post<Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'client' | 'tasks' | 'feedback'>, Project>('/projects', project);
};

export const updateProject = async (project: Project): Promise<Project> => {
    return put<Project, Project>(`/projects/${project.id}`, project);
};

export const deleteProject = async (id: string): Promise<void> => {
    return remove(`/projects/${id}`);
};

/**
 * Tasks
 */
export const fetchTasks = async (): Promise<Task[]> => {
    return get<Task[]>('/tasks');
};

export const createTask = async (
    task: Omit<Task, 'id' | 'completed' | 'createdAt' | 'updatedAt'>
): Promise<Task> => {
    return post<Omit<Task, 'id' | 'completed' | 'createdAt' | 'updatedAt'>, Task>('/tasks', task);
};

export const updateTask = async (task: Task): Promise<Task> => {
    return put<Task, Task>(`/tasks/${task.id}`, task);
};

export const deleteTask = async (id: string): Promise<void> => {
    return remove(`/tasks/${id}`);
};

/**
 * Boards
 */
export const fetchBoards = async (): Promise<Board[]> => {
    return get<Board[]>('/boards');
};

export const createBoard = async (
    board: Omit<Board, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Board> => {
    return post<Omit<Board, 'id' | 'createdAt' | 'updatedAt'>, Board>('/boards', board);
};

export const updateBoard = async (board: Board): Promise<Board> => {
    return put<Board, Board>(`/boards/${board.id}`, board);
};

export const deleteBoard = async (id: string): Promise<void> => {
    return remove(`/boards/${id}`);
};

/**
 * Calendar Entries
 */
export const fetchCalendarEntries = async (): Promise<CalendarEntry[]> => {
    return get<CalendarEntry[]>('/calendar-entries');
};

export const createCalendarEntry = async (
    entry: Omit<CalendarEntry, 'id' | 'createdAt' | 'updatedAt'>
): Promise<CalendarEntry> => {
    return post<Omit<CalendarEntry, 'id' | 'createdAt' | 'updatedAt'>, CalendarEntry>('/calendar-entries', entry);
};

export const updateCalendarEntry = async (entry: CalendarEntry): Promise<CalendarEntry> => {
    return put<CalendarEntry, CalendarEntry>(`/calendar-entries/${entry.id}`, entry);
};

export const deleteCalendarEntry = async (id: string): Promise<void> => {
    return remove(`/calendar-entries/${id}`);
};

/**
 * Checklists
 */
export const fetchChecklists = async (): Promise<Checklist[]> => {
    return get<Checklist[]>('/checklists');
};

export const createChecklist = async (
    checklist: Omit<Checklist, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Checklist> => {
    return post<Omit<Checklist, 'id' | 'createdAt' | 'updatedAt'>, Checklist>('/checklists', checklist);
};

export const updateChecklist = async (checklist: Checklist): Promise<Checklist> => {
    return put<Checklist, Checklist>(`/checklists/${checklist.id}`, checklist);
};

export const deleteChecklist = async (id: string): Promise<void> => {
    return remove(`/checklists/${id}`);
};

/**
 * Checklist Items
 */
export const fetchChecklistItems = async (checklistId: string): Promise<ChecklistItem[]> => {
    return get<ChecklistItem[]>(`/checklists/${checklistId}/items`);
};

export const createChecklistItem = async (
    checklistId: string,
    item: Omit<ChecklistItem, 'id' | 'completed' | 'createdAt' | 'updatedAt'>
): Promise<ChecklistItem> => {
    return post<Omit<ChecklistItem, 'id' | 'completed' | 'createdAt' | 'updatedAt'>, ChecklistItem>(`/checklists/${checklistId}/items`, item);
};

export const updateChecklistItem = async (checklistId: string, item: ChecklistItem): Promise<ChecklistItem> => {
    return put<ChecklistItem, ChecklistItem>(`/checklists/${checklistId}/items/${item.id}`, item);
};

export const deleteChecklistItem = async (checklistId: string, itemId: string): Promise<void> => {
    return remove(`/checklists/${checklistId}/items/${itemId}`);
};

/**
 * Documents
 */
export const fetchDocuments = async (): Promise<Document[]> => {
    return get<Document[]>('/documents');
};

export const createDocument = async (
    document: Omit<Document, 'id' | 'uploadedAt'>
): Promise<Document> => {
    return post<Omit<Document, 'id' | 'uploadedAt'>, Document>('/documents', document);
};

export const updateDocument = async (document: Document): Promise<Document> => {
    return put<Document, Document>(`/documents/${document.id}`, document);
};

export const deleteDocument = async (id: string): Promise<void> => {
    return remove(`/documents/${id}`);
};

/**
 * Invoices
 */
export const fetchInvoices = async (): Promise<Invoice[]> => {
    return get<Invoice[]>('/invoices');
};

export const createInvoice = async (
    invoice: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Invoice> => {
    return post<Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>, Invoice>('/invoices', invoice);
};

export const updateInvoice = async (invoice: Invoice): Promise<Invoice> => {
    return put<Invoice, Invoice>(`/invoices/${invoice.id}`, invoice);
};

export const deleteInvoice = async (id: string): Promise<void> => {
    return remove(`/invoices/${id}`);
};

/**
 * Feedback
 */
export const fetchFeedback = async (): Promise<Feedback[]> => {
    return get<Feedback[]>('/feedback');
};

export const createFeedback = async (
    feedback: Omit<Feedback, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Feedback> => {
    return post<Omit<Feedback, 'id' | 'createdAt' | 'updatedAt'>, Feedback>('/feedback', feedback);
};

export const updateFeedback = async (feedback: Feedback): Promise<Feedback> => {
    return put<Feedback, Feedback>(`/feedback/${feedback.id}`, feedback);
};

export const deleteFeedback = async (id: string): Promise<void> => {
    return remove(`/feedback/${id}`);
};

/**
 * Notes
 */
export const fetchNotes = async (): Promise<Note[]> => {
    return get<Note[]>('/notes');
};

export const createNote = async (
    note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Note> => {
    return post<Omit<Note, 'id' | 'createdAt' | 'updatedAt'>, Note>('/notes', note);
};

export const updateNote = async (note: Note): Promise<Note> => {
    return put<Note, Note>(`/notes/${note.id}`, note);
};

export const deleteNote = async (id: string): Promise<void> => {
    return remove(`/notes/${id}`);
};

/**
 * Payments
 */
export const fetchPayments = async (): Promise<Payment[]> => {
    return get<Payment[]>('/payments');
};

export const createPayment = async (
    payment: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Payment> => {
    return post<Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>, Payment>('/payments', payment);
};

export const updatePayment = async (payment: Payment): Promise<Payment> => {
    return put<Payment, Payment>(`/payments/${payment.id}`, payment);
};

export const deletePayment = async (id: string): Promise<void> => {
    return remove(`/payments/${id}`);
};

/**
 * QuickBooks Tokens
 */
export const fetchQuickBooksTokens = async (): Promise<QuickBooksToken[]> => {
    return get<QuickBooksToken[]>('/quickbooks-tokens');
};

export const createQuickBooksToken = async (
    token: Omit<QuickBooksToken, 'id' | 'expiresAt' | 'createdAt' | 'updatedAt'>
): Promise<QuickBooksToken> => {
    return post<Omit<QuickBooksToken, 'id' | 'expiresAt' | 'createdAt' | 'updatedAt'>, QuickBooksToken>('/quickbooks-tokens', token);
};

export const updateQuickBooksToken = async (token: QuickBooksToken): Promise<QuickBooksToken> => {
    return put<QuickBooksToken, QuickBooksToken>(`/quickbooks-tokens/${token.id}`, token);
};

export const deleteQuickBooksToken = async (id: string): Promise<void> => {
    return remove(`/quickbooks-tokens/${id}`);
};

/**
 * Reminders
 */
export const fetchReminders = async (): Promise<Reminder[]> => {
    return get<Reminder[]>('/reminders');
};

export const createReminder = async (
    reminder: Omit<Reminder, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Reminder> => {
    return post<Omit<Reminder, 'id' | 'createdAt' | 'updatedAt'>, Reminder>('/reminders', reminder);
};

export const updateReminder = async (reminder: Reminder): Promise<Reminder> => {
    return put<Reminder, Reminder>(`/reminders/${reminder.id}`, reminder);
};

export const deleteReminder = async (id: string): Promise<void> => {
    return remove(`/reminders/${id}`);
};

/**
 * Task Lists
 */
export const fetchTaskLists = async (): Promise<TaskList[]> => {
    return get<TaskList[]>('/task-lists');
};

export const createTaskList = async (
    taskList: Omit<TaskList, 'id' | 'createdAt' | 'updatedAt'>
): Promise<TaskList> => {
    return post<Omit<TaskList, 'id' | 'createdAt' | 'updatedAt'>, TaskList>('/task-lists', taskList);
};

export const updateTaskList = async (taskList: TaskList): Promise<TaskList> => {
    return put<TaskList, TaskList>(`/task-lists/${taskList.id}`, taskList);
};

export const deleteTaskList = async (id: string): Promise<void> => {
    return remove(`/task-lists/${id}`);
};

/**
 * Messages
 */
export const fetchMessages = async (): Promise<Message[]> => {
    return get<Message[]>('/messages');
};

export const createMessage = async (
    message: Omit<Message, 'id' | 'createdAt'>
): Promise<Message> => {
    return post<Omit<Message, 'id' | 'createdAt'>, Message>('/messages', message);
};

export const updateMessage = async (message: Message): Promise<Message> => {
    return put<Message, Message>(`/messages/${message.id}`, message);
};

export const deleteMessage = async (id: string): Promise<void> => {
    return remove(`/messages/${id}`);
};
