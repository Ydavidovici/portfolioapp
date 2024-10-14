// src/features/clientDashboard/types/index.ts

export interface Message {
    id: string;
    senderName: string;
    content: string;
    createdAt: string;
}

export interface Document {
    id: string;
    title: string;
    url: string;
    uploadedAt: string;
}

export interface ClientDashboardState {
    messages: Message[];
    documents: Document[];
    loading: boolean;
    error: string | null;
}
