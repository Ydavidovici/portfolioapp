// src/features/clientdashboard/services/clientService.ts

import axios from '../../../api/apiClient';
import { Message, Document } from '../types';

const clientService = {
    // Fetch client dashboard data
    fetchDashboardData: () => axios.get('/api/client/dashboard'),

    // Messages
    getMessages: () => axios.get<Message[]>('/api/client/messages'),
    createMessage: (newMessage: Omit<Message, 'id' | 'created_at'>) => axios.post<Message>('/api/client/messages', newMessage),
    updateMessage: (updatedMessage: Message) => axios.put<Message>(`/api/client/messages/${updatedMessage.id}`, updatedMessage),
    deleteMessage: (id: string) => axios.delete(`/api/client/messages/${id}`),

    // Documents
    getDocuments: () => axios.get<Document[]>('/api/client/documents'),
    createDocument: (newDocument: Omit<Document, 'id' | 'created_at'>) => axios.post<Document>('/api/client/documents', newDocument),
    updateDocument: (updatedDocument: Document) => axios.put<Document>(`/api/client/documents/${updatedDocument.id}`, updatedDocument),
    deleteDocument: (id: string) => axios.delete(`/api/client/documents/${id}`),

    // ... Add more methods as needed
};

export default clientService;
