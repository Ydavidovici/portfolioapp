// src/features/developerDashboard/developerDashboardSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
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
} from './types';
import developerService from './services/developerService';

interface DeveloperDashboardState {
    // Boards
    boards: Board[];
    // CalendarEntries
    calendarEntries: CalendarEntry[];
    // Checklists
    checklists: Checklist[];
    // ChecklistItems
    checklistItems: ChecklistItem[];
    // Documents
    documents: Document[];
    // Feedback
    feedbacks: Feedback[];
    // Invoices
    invoices: Invoice[];
    // Messages
    messages: Message[];
    // Notes
    notes: Note[];
    // Payments
    payments: Payment[];
    // QuickBooksTokens
    quickBooksTokens: QuickBooksToken[];
    // Reminders
    reminders: Reminder[];
    // Tasks
    tasks: Task[];
    // TaskLists
    taskLists: TaskList[];
    // Loading and Error
    loading: boolean;
    error: string | null;
}

const initialState: DeveloperDashboardState = {
    boards: [],
    calendarEntries: [],
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
    loading: false,
    error: null,
};

// Async Thunks

// Boards
export const getBoards = createAsyncThunk('developerDashboard/getBoards', async () => {
    const response = await developerService.fetchBoards();
    return response.data;
});

export const addBoard = createAsyncThunk('developerDashboard/addBoard', async (newBoard: Omit<Board, 'id'>) => {
    const response = await developerService.createBoard(newBoard);
    return response.data;
});

export const editBoard = createAsyncThunk('developerDashboard/editBoard', async (updatedBoard: Board) => {
    const response = await developerService.updateBoard(updatedBoard);
    return response.data;
});

export const removeBoard = createAsyncThunk('developerDashboard/removeBoard', async (id: string) => {
    await developerService.deleteBoard(id);
    return id;
});

// CalendarEntries
export const getCalendarEntries = createAsyncThunk('developerDashboard/getCalendarEntries', async () => {
    const response = await developerService.fetchCalendarEntries();
    return response.data;
});

export const addCalendarEntry = createAsyncThunk('developerDashboard/addCalendarEntry', async (newEntry: Omit<CalendarEntry, 'id'>) => {
    const response = await developerService.createCalendarEntry(newEntry);
    return response.data;
});

export const editCalendarEntry = createAsyncThunk('developerDashboard/editCalendarEntry', async (updatedEntry: CalendarEntry) => {
    const response = await developerService.updateCalendarEntry(updatedEntry);
    return response.data;
});

export const removeCalendarEntry = createAsyncThunk('developerDashboard/removeCalendarEntry', async (id: string) => {
    await developerService.deleteCalendarEntry(id);
    return id;
});

// Checklists
export const getChecklists = createAsyncThunk('developerDashboard/getChecklists', async () => {
    const response = await developerService.fetchChecklists();
    return response.data;
});

export const addChecklist = createAsyncThunk('developerDashboard/addChecklist', async (newChecklist: Omit<Checklist, 'id'>) => {
    const response = await developerService.createChecklist(newChecklist);
    return response.data;
});

export const editChecklist = createAsyncThunk('developerDashboard/editChecklist', async (updatedChecklist: Checklist) => {
    const response = await developerService.updateChecklist(updatedChecklist);
    return response.data;
});

export const removeChecklist = createAsyncThunk('developerDashboard/removeChecklist', async (id: string) => {
    await developerService.deleteChecklist(id);
    return id;
});

// ChecklistItems
export const getChecklistItems = createAsyncThunk('developerDashboard/getChecklistItems', async () => {
    const response = await developerService.fetchChecklistItems();
    return response.data;
});

export const addChecklistItem = createAsyncThunk('developerDashboard/addChecklistItem', async (newItem: Omit<ChecklistItem, 'id'>) => {
    const response = await developerService.createChecklistItem(newItem);
    return response.data;
});

export const editChecklistItem = createAsyncThunk('developerDashboard/editChecklistItem', async (updatedItem: ChecklistItem) => {
    const response = await developerService.updateChecklistItem(updatedItem);
    return response.data;
});

export const removeChecklistItem = createAsyncThunk('developerDashboard/removeChecklistItem', async (id: string) => {
    await developerService.deleteChecklistItem(id);
    return id;
});

// Documents
export const getDocuments = createAsyncThunk('developerDashboard/getDocuments', async () => {
    const response = await developerService.fetchDocuments();
    return response.data;
});

export const addDocument = createAsyncThunk('developerDashboard/addDocument', async (newDocument: Omit<Document, 'id'>) => {
    const response = await developerService.createDocument(newDocument);
    return response.data;
});

export const editDocument = createAsyncThunk('developerDashboard/editDocument', async (updatedDocument: Document) => {
    const response = await developerService.updateDocument(updatedDocument);
    return response.data;
});

export const removeDocument = createAsyncThunk('developerDashboard/removeDocument', async (id: string) => {
    await developerService.deleteDocument(id);
    return id;
});

// Feedback
export const getFeedbacks = createAsyncThunk('developerDashboard/getFeedbacks', async () => {
    const response = await developerService.fetchFeedbacks();
    return response.data;
});

export const addFeedback = createAsyncThunk('developerDashboard/addFeedback', async (newFeedback: Omit<Feedback, 'id'>) => {
    const response = await developerService.createFeedback(newFeedback);
    return response.data;
});

export const editFeedback = createAsyncThunk('developerDashboard/editFeedback', async (updatedFeedback: Feedback) => {
    const response = await developerService.updateFeedback(updatedFeedback);
    return response.data;
});

export const removeFeedback = createAsyncThunk('developerDashboard/removeFeedback', async (id: string) => {
    await developerService.deleteFeedback(id);
    return id;
});

// Invoices
export const getInvoices = createAsyncThunk('developerDashboard/getInvoices', async () => {
    const response = await developerService.fetchInvoices();
    return response.data;
});

export const addInvoice = createAsyncThunk('developerDashboard/addInvoice', async (newInvoice: Omit<Invoice, 'id'>) => {
    const response = await developerService.createInvoice(newInvoice);
    return response.data;
});

export const editInvoice = createAsyncThunk('developerDashboard/editInvoice', async (updatedInvoice: Invoice) => {
    const response = await developerService.updateInvoice(updatedInvoice);
    return response.data;
});

export const removeInvoice = createAsyncThunk('developerDashboard/removeInvoice', async (id: string) => {
    await developerService.deleteInvoice(id);
    return id;
});

// Messages
export const getMessages = createAsyncThunk('developerDashboard/getMessages', async () => {
    const response = await developerService.fetchMessages();
    return response.data;
});

export const addMessage = createAsyncThunk('developerDashboard/addMessage', async (newMessage: Omit<Message, 'id'>) => {
    const response = await developerService.createMessage(newMessage);
    return response.data;
});

export const editMessage = createAsyncThunk('developerDashboard/editMessage', async (updatedMessage: Message) => {
    const response = await developerService.updateMessage(updatedMessage);
    return response.data;
});

export const removeMessage = createAsyncThunk('developerDashboard/removeMessage', async (id: string) => {
    await developerService.deleteMessage(id);
    return id;
});

// Notes
export const getNotes = createAsyncThunk('developerDashboard/getNotes', async () => {
    const response = await developerService.fetchNotes();
    return response.data;
});

export const addNote = createAsyncThunk('developerDashboard/addNote', async (newNote: Omit<Note, 'id'>) => {
    const response = await developerService.createNote(newNote);
    return response.data;
});

export const editNote = createAsyncThunk('developerDashboard/editNote', async (updatedNote: Note) => {
    const response = await developerService.updateNote(updatedNote);
    return response.data;
});

export const removeNote = createAsyncThunk('developerDashboard/removeNote', async (id: string) => {
    await developerService.deleteNote(id);
    return id;
});

// Payments
export const getPayments = createAsyncThunk('developerDashboard/getPayments', async () => {
    const response = await developerService.fetchPayments();
    return response.data;
});

export const addPayment = createAsyncThunk('developerDashboard/addPayment', async (newPayment: Omit<Payment, 'id'>) => {
    const response = await developerService.createPayment(newPayment);
    return response.data;
});

export const editPayment = createAsyncThunk('developerDashboard/editPayment', async (updatedPayment: Payment) => {
    const response = await developerService.updatePayment(updatedPayment);
    return response.data;
});

export const removePayment = createAsyncThunk('developerDashboard/removePayment', async (id: string) => {
    await developerService.deletePayment(id);
    return id;
});

// QuickBooksTokens
export const getQuickBooksTokens = createAsyncThunk('developerDashboard/getQuickBooksTokens', async () => {
    const response = await developerService.fetchQuickBooksTokens();
    return response.data;
});

export const addQuickBooksToken = createAsyncThunk('developerDashboard/addQuickBooksToken', async (newToken: Omit<QuickBooksToken, 'id'>) => {
    const response = await developerService.createQuickBooksToken(newToken);
    return response.data;
});

export const editQuickBooksToken = createAsyncThunk('developerDashboard/editQuickBooksToken', async (updatedToken: QuickBooksToken) => {
    const response = await developerService.updateQuickBooksToken(updatedToken);
    return response.data;
});

export const removeQuickBooksToken = createAsyncThunk('developerDashboard/removeQuickBooksToken', async (id: string) => {
    await developerService.deleteQuickBooksToken(id);
    return id;
});

// Reminders
export const getReminders = createAsyncThunk('developerDashboard/getReminders', async () => {
    const response = await developerService.fetchReminders();
    return response.data;
});

export const addReminder = createAsyncThunk('developerDashboard/addReminder', async (newReminder: Omit<Reminder, 'id'>) => {
    const response = await developerService.createReminder(newReminder);
    return response.data;
});

export const editReminder = createAsyncThunk('developerDashboard/editReminder', async (updatedReminder: Reminder) => {
    const response = await developerService.updateReminder(updatedReminder);
    return response.data;
});

export const removeReminder = createAsyncThunk('developerDashboard/removeReminder', async (id: string) => {
    await developerService.deleteReminder(id);
    return id;
});

// Tasks
export const getTasks = createAsyncThunk('developerDashboard/getTasks', async () => {
    const response = await developerService.fetchTasks();
    return response.data;
});

export const addTask = createAsyncThunk('developerDashboard/addTask', async (newTask: Omit<Task, 'id'>) => {
    const response = await developerService.createTask(newTask);
    return response.data;
});

export const editTask = createAsyncThunk('developerDashboard/editTask', async (updatedTask: Task) => {
    const response = await developerService.updateTask(updatedTask);
    return response.data;
});

export const removeTask = createAsyncThunk('developerDashboard/removeTask', async (id: string) => {
    await developerService.deleteTask(id);
    return id;
});

// TaskLists
export const getTaskLists = createAsyncThunk('developerDashboard/getTaskLists', async () => {
    const response = await developerService.fetchTaskLists();
    return response.data;
});

export const addTaskList = createAsyncThunk('developerDashboard/addTaskList', async (newTaskList: Omit<TaskList, 'id'>) => {
    const response = await developerService.createTaskList(newTaskList);
    return response.data;
});

export const editTaskList = createAsyncThunk('developerDashboard/editTaskList', async (updatedTaskList: TaskList) => {
    const response = await developerService.updateTaskList(updatedTaskList);
    return response.data;
});

export const removeTaskList = createAsyncThunk('developerDashboard/removeTaskList', async (id: string) => {
    await developerService.deleteTaskList(id);
    return id;
});

// Slice

const developerDashboardSlice = createSlice({
    name: 'developerDashboard',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // Boards
        builder.addCase(getBoards.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(getBoards.fulfilled, (state, action: PayloadAction<Board[]>) => {
            state.loading = false;
            state.boards = action.payload;
        });
        builder.addCase(getBoards.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch boards';
        });

        // ... Similar cases for all async thunks

        // Repeat the pattern for each resource's async thunks
        // For brevity, only one example is shown here.

        // You need to add similar pending, fulfilled, and rejected cases for each async thunk.
        // Example for addBoard:
        builder.addCase(addBoard.fulfilled, (state, action: PayloadAction<Board>) => {
            state.boards.push(action.payload);
        });
        builder.addCase(addBoard.rejected, (state, action) => {
            state.error = action.error.message || 'Failed to add board';
        });

        // Continue similarly for editBoard, removeBoard, and all other resources

        // For demonstration, let's handle a few more:

        // CalendarEntries
        builder.addCase(getCalendarEntries.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(getCalendarEntries.fulfilled, (state, action: PayloadAction<CalendarEntry[]>) => {
            state.loading = false;
            state.calendarEntries = action.payload;
        });
        builder.addCase(getCalendarEntries.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch calendar entries';
        });

        builder.addCase(addCalendarEntry.fulfilled, (state, action: PayloadAction<CalendarEntry>) => {
            state.calendarEntries.push(action.payload);
        });
        builder.addCase(addCalendarEntry.rejected, (state, action) => {
            state.error = action.error.message || 'Failed to add calendar entry';
        });

        // Similarly, handle editCalendarEntry, removeCalendarEntry, and so on for each resource.
    },
});

export default developerDashboardSlice.reducer;
