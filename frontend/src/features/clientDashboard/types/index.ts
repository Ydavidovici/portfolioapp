// src/features/clientdashboard/types/index.ts

export interface Message {
    id: string;
    subject: string;
    body: string;
    created_at: string;
    // Add other fields as necessary
}

export interface Document {
    id: string;
    title: string;
    description: string;
    file_url: string;
    created_at: string;
    // Add other fields as necessary
}

