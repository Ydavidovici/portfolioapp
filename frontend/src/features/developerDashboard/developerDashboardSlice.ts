// src/features/developerDashboard/developerDashboardSlice.ts

import { createSlice, createAsyncThunk, PayloadAction, createEntityAdapter } from '@reduxjs/toolkit';
import {
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    fetchBoards,
    createBoard,
    updateBoard,
    deleteBoard,
    fetchMessages,
    createMessage,
    updateMessage,
    deleteMessage,
} from './services/developerService';
import {
    Project,
    Task,
    Board,
    Message,
    DeveloperDashboardState,
} from './types';

// Create entity adapters for each resource
const projectsAdapter = createEntityAdapter<Project>();
const tasksAdapter = createEntityAdapter<Task>();
const boardsAdapter = createEntityAdapter<Board>();
const messagesAdapter = createEntityAdapter<Message>();

const initialState: DeveloperDashboardState = {
    projects: projectsAdapter.getInitialState(),
    tasks: tasksAdapter.getInitialState(),
    boards: boardsAdapter.getInitialState(),
    messages: messagesAdapter.getInitialState(),
    loading: false,
    error: null,
};

// Async Thunks

// Projects
export const getProjects = createAsyncThunk('developerDashboard/getProjects', async () => {
    const data = await fetchProjects();
    return data;
});

export const addProject = createAsyncThunk(
    'developerDashboard/addProject',
    async (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'client' | 'tasks' | 'feedback'>) => {
        const data = await createProject(project);
        return data;
    }
);

export const editProject = createAsyncThunk(
    'developerDashboard/editProject',
    async (project: Project) => {
        const data = await updateProject(project);
        return data;
    }
);

export const removeProject = createAsyncThunk(
    'developerDashboard/removeProject',
    async (id: string) => {
        await deleteProject(id);
        return id;
    }
);

// Tasks
export const getTasks = createAsyncThunk('developerDashboard/getTasks', async () => {
    const data = await fetchTasks();
    return data;
});

export const addTask = createAsyncThunk(
    'developerDashboard/addTask',
    async (task: Omit<Task, 'id' | 'completed' | 'createdAt' | 'updatedAt'>) => {
        const data = await createTask(task);
        return data;
    }
);

export const editTask = createAsyncThunk(
    'developerDashboard/editTask',
    async (task: Task) => {
        const data = await updateTask(task);
        return data;
    }
);

export const removeTask = createAsyncThunk(
    'developerDashboard/removeTask',
    async (id: string) => {
        await deleteTask(id);
        return id;
    }
);

// Boards
export const getBoards = createAsyncThunk('developerDashboard/getBoards', async () => {
    const data = await fetchBoards();
    return data;
});

export const addBoard = createAsyncThunk(
    'developerDashboard/addBoard',
    async (board: Omit<Board, 'id' | 'createdAt' | 'updatedAt'>) => {
        const data = await createBoard(board);
        return data;
    }
);

export const editBoard = createAsyncThunk(
    'developerDashboard/editBoard',
    async (board: Board) => {
        const data = await updateBoard(board);
        return data;
    }
);

export const removeBoard = createAsyncThunk(
    'developerDashboard/removeBoard',
    async (id: string) => {
        await deleteBoard(id);
        return id;
    }
);

// Messages
export const getMessages = createAsyncThunk('developerDashboard/getMessages', async () => {
    const data = await fetchMessages();
    return data;
});

export const addMessage = createAsyncThunk(
    'developerDashboard/addMessage',
    async (message: Omit<Message, 'id' | 'createdAt'>) => {
        const data = await createMessage(message);
        return data;
    }
);

export const editMessage = createAsyncThunk(
    'developerDashboard/editMessage',
    async (message: Message) => {
        const data = await updateMessage(message);
        return data;
    }
);

export const removeMessage = createAsyncThunk(
    'developerDashboard/removeMessage',
    async (id: string) => {
        await deleteMessage(id);
        return id;
    }
);

// Slice
const developerDashboardSlice = createSlice({
    name: 'developerDashboard',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // ** Projects **
        builder
            .addCase(getProjects.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getProjects.fulfilled, (state, action: PayloadAction<Project[]>) => {
                state.loading = false;
                projectsAdapter.setAll(state.projects, action.payload);
            })
            .addCase(getProjects.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch projects';
            })
            .addCase(addProject.fulfilled, (state, action: PayloadAction<Project>) => {
                projectsAdapter.addOne(state.projects, action.payload);
            })
            .addCase(addProject.rejected, (state, action) => {
                state.error = action.error.message || 'Failed to add project';
            })
            .addCase(editProject.fulfilled, (state, action: PayloadAction<Project>) => {
                projectsAdapter.upsertOne(state.projects, action.payload);
            })
            .addCase(editProject.rejected, (state, action) => {
                state.error = action.error.message || 'Failed to update project';
            })
            .addCase(removeProject.fulfilled, (state, action: PayloadAction<string>) => {
                projectsAdapter.removeOne(state.projects, action.payload);
            })
            .addCase(removeProject.rejected, (state, action) => {
                state.error = action.error.message || 'Failed to delete project';
            });

        // ** Tasks **
        builder
            .addCase(getTasks.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getTasks.fulfilled, (state, action: PayloadAction<Task[]>) => {
                state.loading = false;
                tasksAdapter.setAll(state.tasks, action.payload);
            })
            .addCase(getTasks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch tasks';
            })
            .addCase(addTask.fulfilled, (state, action: PayloadAction<Task>) => {
                tasksAdapter.addOne(state.tasks, action.payload);
            })
            .addCase(addTask.rejected, (state, action) => {
                state.error = action.error.message || 'Failed to add task';
            })
            .addCase(editTask.fulfilled, (state, action: PayloadAction<Task>) => {
                tasksAdapter.upsertOne(state.tasks, action.payload);
            })
            .addCase(editTask.rejected, (state, action) => {
                state.error = action.error.message || 'Failed to update task';
            })
            .addCase(removeTask.fulfilled, (state, action: PayloadAction<string>) => {
                tasksAdapter.removeOne(state.tasks, action.payload);
            })
            .addCase(removeTask.rejected, (state, action) => {
                state.error = action.error.message || 'Failed to delete task';
            });

        // ** Boards **
        builder
            .addCase(getBoards.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getBoards.fulfilled, (state, action: PayloadAction<Board[]>) => {
                state.loading = false;
                boardsAdapter.setAll(state.boards, action.payload);
            })
            .addCase(getBoards.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch boards';
            })
            .addCase(addBoard.fulfilled, (state, action: PayloadAction<Board>) => {
                boardsAdapter.addOne(state.boards, action.payload);
            })
            .addCase(addBoard.rejected, (state, action) => {
                state.error = action.error.message || 'Failed to add board';
            })
            .addCase(editBoard.fulfilled, (state, action: PayloadAction<Board>) => {
                boardsAdapter.upsertOne(state.boards, action.payload);
            })
            .addCase(editBoard.rejected, (state, action) => {
                state.error = action.error.message || 'Failed to update board';
            })
            .addCase(removeBoard.fulfilled, (state, action: PayloadAction<string>) => {
                boardsAdapter.removeOne(state.boards, action.payload);
            })
            .addCase(removeBoard.rejected, (state, action) => {
                state.error = action.error.message || 'Failed to delete board';
            });

        // ** Messages **
        builder
            .addCase(getMessages.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getMessages.fulfilled, (state, action: PayloadAction<Message[]>) => {
                state.loading = false;
                messagesAdapter.setAll(state.messages, action.payload);
            })
            .addCase(getMessages.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch messages';
            })
            .addCase(addMessage.fulfilled, (state, action: PayloadAction<Message>) => {
                messagesAdapter.addOne(state.messages, action.payload);
            })
            .addCase(addMessage.rejected, (state, action) => {
                state.error = action.error.message || 'Failed to add message';
            })
            .addCase(editMessage.fulfilled, (state, action: PayloadAction<Message>) => {
                messagesAdapter.upsertOne(state.messages, action.payload);
            })
            .addCase(editMessage.rejected, (state, action) => {
                state.error = action.error.message || 'Failed to update message';
            })
            .addCase(removeMessage.fulfilled, (state, action: PayloadAction<string>) => {
                messagesAdapter.removeOne(state.messages, action.payload);
            })
            .addCase(removeMessage.rejected, (state, action) => {
                state.error = action.error.message || 'Failed to delete message';
            });
    });

export default developerDashboardSlice.reducer;
