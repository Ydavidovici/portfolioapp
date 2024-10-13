// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import projectsReducer from '../features/projects/projectsSlice';
import rolesReducer from '../features/roles/rolesSlice';
import tasksReducer from '../features/tasks/tasksSlice';
import usersReducer from '../features/adminDashboard/userSlice';
import boardsReducer from '../features/boards/boardsSlice';
import paymentsReducer from '../features/payments/paymentsSlice';
import documentsReducer from '../features/documents/documentsSlice';
import checklistsReducer from '../features/checklists/checklistsSlice';
import feedbackReducer from '../features/feedback/feedbackSlice';
import notesReducer from '../features/notes/notesSlice';
import quickbooksTokensReducer from '../features/quickbooksTokens/quickbooksTokensSlice';
import remindersReducer from '../features/reminders/remindersSlice';
import taskListsReducer from '../features/taskLists/taskListsSlice';
import checklistItemsReducer from '../features/checklistItems/checklistItemsSlice'; // Add this line
import calendarEntriesReducer from '../features/calendarEntries/calendarEntriesSlice';


const store = configureStore({
  reducer: {
    auth: authReducer,
    projects: projectsReducer,
    roles: rolesReducer,
    tasks: tasksReducer,
    users: usersReducer,
    boards: boardsReducer,
    payments: paymentsReducer,
    documents: documentsReducer,
    checklists: checklistsReducer,
    feedback: feedbackReducer,
    notes: notesReducer,
    quickbooksTokens: quickbooksTokensReducer,
    reminders: remindersReducer,
    taskLists: taskListsReducer,
    checklistItems: checklistItemsReducer,
    calendarEntries: calendarEntriesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
