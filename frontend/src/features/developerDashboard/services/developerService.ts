// src/features/developerDashboard/services/developerService.ts

import axios from '../../../api/apiClient';
import {
    Board,
    CalendarEntry,
    Checklist,
    ChecklistItem,
    Document,
    Feedback,
    Invoice,
    Message,
    Note,
    Payment,
    QuickBooksToken,
    Reminder,
    Task,
    TaskList,
} from '../types';

const developerService = {
    // Boards
    fetchBoards: () => axios.get<Board[]>('/boards'),
    createBoard: (newBoard: Omit<Board, 'id'>) => axios.post<Board>('/boards', newBoard),
    updateBoard: (updatedBoard: Board) => axios.put<Board>(`/boards/${updatedBoard.id}`, updatedBoard),
    deleteBoard: (id: string) => axios.delete(`/boards/${id}`),

    // CalendarEntries
    fetchCalendarEntries: () => axios.get<CalendarEntry[]>('/calendar-entries'),
    createCalendarEntry: (newEntry: Omit<CalendarEntry, 'id'>) => axios.post<CalendarEntry>('/calendar-entries', newEntry),
    updateCalendarEntry: (updatedEntry: CalendarEntry) => axios.put<CalendarEntry>(`/calendar-entries/${updatedEntry.id}`, updatedEntry),
    deleteCalendarEntry: (id: string) => axios.delete(`/calendar-entries/${id}`),

    // Checklists
    fetchChecklists: () => axios.get<Checklist[]>('/checklists'),
    createChecklist: (newChecklist: Omit<Checklist, 'id'>) => axios.post<Checklist>('/checklists', newChecklist),
    updateChecklist: (updatedChecklist: Checklist) => axios.put<Checklist>(`/checklists/${updatedChecklist.id}`, updatedChecklist),
    deleteChecklist: (id: string) => axios.delete(`/checklists/${id}`),

    // ChecklistItems
    fetchChecklistItems: () => axios.get<ChecklistItem[]>('/checklist-items'),
    createChecklistItem: (newItem: Omit<ChecklistItem, 'id'>) => axios.post<ChecklistItem>('/checklist-items', newItem),
    updateChecklistItem: (updatedItem: ChecklistItem) => axios.put<ChecklistItem>(`/checklist-items/${updatedItem.id}`, updatedItem),
    deleteChecklistItem: (id: string) => axios.delete(`/checklist-items/${id}`),

    // Documents
    fetchDocuments: () => axios.get<Document[]>('/documents'),
    createDocument: (newDocument: Omit<Document, 'id'>) => axios.post<Document>('/documents', newDocument),
    updateDocument: (updatedDocument: Document) => axios.put<Document>(`/documents/${updatedDocument.id}`, updatedDocument),
    deleteDocument: (id: string) => axios.delete(`/documents/${id}`),

    // Feedback
    fetchFeedbacks: () => axios.get<Feedback[]>('/feedback'),
    createFeedback: (newFeedback: Omit<Feedback, 'id'>) => axios.post<Feedback>('/feedback', newFeedback),
    updateFeedback: (updatedFeedback: Feedback) => axios.put<Feedback>(`/feedback/${updatedFeedback.id}`, updatedFeedback),
    deleteFeedback: (id: string) => axios.delete(`/feedback/${id}`),

    // Invoices
    fetchInvoices: () => axios.get<Invoice[]>('/invoices'),
    createInvoice: (newInvoice: Omit<Invoice, 'id'>) => axios.post<Invoice>('/invoices', newInvoice),
    updateInvoice: (updatedInvoice: Invoice) => axios.put<Invoice>(`/invoices/${updatedInvoice.id}`, updatedInvoice),
    deleteInvoice: (id: string) => axios.delete(`/invoices/${id}`),

    // Messages
    fetchMessages: () => axios.get<Message[]>('/messages'),
    createMessage: (newMessage: Omit<Message, 'id'>) => axios.post<Message>('/messages', newMessage),
    updateMessage: (updatedMessage: Message) => axios.put<Message>(`/messages/${updatedMessage.id}`, updatedMessage),
    deleteMessage: (id: string) => axios.delete(`/messages/${id}`),

    // Notes
    fetchNotes: () => axios.get<Note[]>('/notes'),
    createNote: (newNote: Omit<Note, 'id'>) => axios.post<Note>('/notes', newNote),
    updateNote: (updatedNote: Note) => axios.put<Note>(`/notes/${updatedNote.id}`, updatedNote),
    deleteNote: (id: string) => axios.delete(`/notes/${id}`),

    // Payments
    fetchPayments: () => axios.get<Payment[]>('/payments'),
    createPayment: (newPayment: Omit<Payment, 'id'>) => axios.post<Payment>('/payments', newPayment),
    updatePayment: (updatedPayment: Payment) => axios.put<Payment>(`/payments/${updatedPayment.id}`, updatedPayment),
    deletePayment: (id: string) => axios.delete(`/payments/${id}`),

    // QuickBooksTokens
    fetchQuickBooksTokens: () => axios.get<QuickBooksToken[]>('/quickbooks-tokens'),
    createQuickBooksToken: (newToken: Omit<QuickBooksToken, 'id'>) => axios.post<QuickBooksToken>('/quickbooks-tokens', newToken),
    updateQuickBooksToken: (updatedToken: QuickBooksToken) => axios.put<QuickBooksToken>(`/quickbooks-tokens/${updatedToken.id}`, updatedToken),
    deleteQuickBooksToken: (id: string) => axios.delete(`/quickbooks-tokens/${id}`),

    // Reminders
    fetchReminders: () => axios.get<Reminder[]>('/reminders'),
    createReminder: (newReminder: Omit<Reminder, 'id'>) => axios.post<Reminder>('/reminders', newReminder),
    updateReminder: (updatedReminder: Reminder) => axios.put<Reminder>(`/reminders/${updatedReminder.id}`, updatedReminder),
    deleteReminder: (id: string) => axios.delete(`/reminders/${id}`),

    // Tasks
    fetchTasks: () => axios.get<Task[]>('/tasks'),
    createTask: (newTask: Omit<Task, 'id'>) => axios.post<Task>('/tasks', newTask),
    updateTask: (updatedTask: Task) => axios.put<Task>(`/tasks/${updatedTask.id}`, updatedTask),
    deleteTask: (id: string) => axios.delete(`/tasks/${id}`),

    // TaskLists
    fetchTaskLists: () => axios.get<TaskList[]>('/task-lists'),
    createTaskList: (newTaskList: Omit<TaskList, 'id'>) => axios.post<TaskList>('/task-lists', newTaskList),
    updateTaskList: (updatedTaskList: TaskList) => axios.put<TaskList>(`/task-lists/${updatedTaskList.id}`, updatedTaskList),
    deleteTaskList: (id: string) => axios.delete(`/task-lists/${id}`),
};

export default developerService;
