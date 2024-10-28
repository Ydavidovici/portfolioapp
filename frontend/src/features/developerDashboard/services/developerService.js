// src/features/developerDashboard/services/developerService.js

import axios from '../../../api/apiClient';

const developerService = {
  // Boards
  fetchBoards: () => axios.get('/boards'),
  createBoard: (newBoard) => axios.post('/boards', newBoard),
  updateBoard: (updatedBoard) =>
    axios.put(`/boards/${updatedBoard.id}`, updatedBoard),
  deleteBoard: (id) => axios.delete(`/boards/${id}`),

  // Calendar Entries
  fetchCalendarEntries: () => axios.get('/calendar-entries'),
  createCalendarEntry: (newEntry) => axios.post('/calendar-entries', newEntry),
  updateCalendarEntry: (updatedEntry) =>
    axios.put(`/calendar-entries/${updatedEntry.id}`, updatedEntry),
  deleteCalendarEntry: (id) => axios.delete(`/calendar-entries/${id}`),

  // Checklists
  fetchChecklists: () => axios.get('/checklists'),
  createChecklist: (newChecklist) => axios.post('/checklists', newChecklist),
  updateChecklist: (updatedChecklist) =>
    axios.put(`/checklists/${updatedChecklist.id}`, updatedChecklist),
  deleteChecklist: (id) => axios.delete(`/checklists/${id}`),

  // Checklist Items
  fetchChecklistItems: () => axios.get('/checklist-items'),
  createChecklistItem: (newItem) => axios.post('/checklist-items', newItem),
  updateChecklistItem: (updatedItem) =>
    axios.put(`/checklist-items/${updatedItem.id}`, updatedItem),
  deleteChecklistItem: (id) => axios.delete(`/checklist-items/${id}`),

  // Documents
  fetchDocuments: () => axios.get('/documents'),
  createDocument: (newDocument) => axios.post('/documents', newDocument),
  updateDocument: (updatedDocument) =>
    axios.put(`/documents/${updatedDocument.id}`, updatedDocument),
  deleteDocument: (id) => axios.delete(`/documents/${id}`),

  // Feedback
  fetchFeedbacks: () => axios.get('/feedback'),
  createFeedback: (newFeedback) => axios.post('/feedback', newFeedback),
  updateFeedback: (updatedFeedback) =>
    axios.put(`/feedback/${updatedFeedback.id}`, updatedFeedback),
  deleteFeedback: (id) => axios.delete(`/feedback/${id}`),

  // Invoices
  fetchInvoices: () => axios.get('/invoices'),
  createInvoice: (newInvoice) => axios.post('/invoices', newInvoice),
  updateInvoice: (updatedInvoice) =>
    axios.put(`/invoices/${updatedInvoice.id}`, updatedInvoice),
  deleteInvoice: (id) => axios.delete(`/invoices/${id}`),

  // Messages
  fetchMessages: () => axios.get('/messages'),
  createMessage: (newMessage) => axios.post('/messages', newMessage),
  updateMessage: (updatedMessage) =>
    axios.put(`/messages/${updatedMessage.id}`, updatedMessage),
  deleteMessage: (id) => axios.delete(`/messages/${id}`),

  // Notes
  fetchNotes: () => axios.get('/notes'),
  createNote: (newNote) => axios.post('/notes', newNote),
  updateNote: (updatedNote) =>
    axios.put(`/notes/${updatedNote.id}`, updatedNote),
  deleteNote: (id) => axios.delete(`/notes/${id}`),

  // Payments
  fetchPayments: () => axios.get('/payments'),
  createPayment: (newPayment) => axios.post('/payments', newPayment),
  updatePayment: (updatedPayment) =>
    axios.put(`/payments/${updatedPayment.id}`, updatedPayment),
  deletePayment: (id) => axios.delete(`/payments/${id}`),

  // QuickBooks Tokens
  fetchQuickBooksTokens: () => axios.get('/quickbooks-tokens'),
  createQuickBooksToken: (newToken) =>
    axios.post('/quickbooks-tokens', newToken),
  updateQuickBooksToken: (updatedToken) =>
    axios.put(`/quickbooks-tokens/${updatedToken.id}`, updatedToken),
  deleteQuickBooksToken: (id) => axios.delete(`/quickbooks-tokens/${id}`),

  // Reminders
  fetchReminders: () => axios.get('/reminders'),
  createReminder: (newReminder) => axios.post('/reminders', newReminder),
  updateReminder: (updatedReminder) =>
    axios.put(`/reminders/${updatedReminder.id}`, updatedReminder),
  deleteReminder: (id) => axios.delete(`/reminders/${id}`),

  // Tasks
  fetchTasks: () => axios.get('/tasks'),
  createTask: (newTask) => axios.post('/tasks', newTask),
  updateTask: (updatedTask) =>
    axios.put(`/tasks/${updatedTask.id}`, updatedTask),
  deleteTask: (id) => axios.delete(`/tasks/${id}`),

  // Task Lists
  fetchTaskLists: () => axios.get('/task-lists'),
  createTaskList: (newTaskList) => axios.post('/task-lists', newTaskList),
  updateTaskList: (updatedTaskList) =>
    axios.put(`/task-lists/${updatedTaskList.id}`, updatedTaskList),
  deleteTaskList: (id) => axios.delete(`/task-lists/${id}`),
};

export default developerService;
