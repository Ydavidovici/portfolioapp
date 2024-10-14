// src/features/clientDashboard/services/clientService.ts

import axios from 'axios';
import { Message, Document } from '../types';

const API_URL = '/client-dashboard';

// Fetch Messages
export const fetchMessages = async (): Promise<Message[]> => {
    const response = await axios.get<Message[]>(`${API_URL}/messages`);
    return response.data;
};

// Fetch Documents
export const fetchDocuments = async (): Promise<Document[]> => {
    const response = await axios.get<Document[]>(`${API_URL}/documents`);
    return response.data;
};
