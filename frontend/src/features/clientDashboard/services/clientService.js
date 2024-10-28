// src/features/clientDashboard/services/clientService.js

import axios from '../../../api/apiClient';

const clientService = {
  // Fetch client dashboard data
  fetchDashboardData: () => axios.get('/api/client/dashboard'),

  // Messages
  getMessages: () => axios.get('/api/client/messages'),
  createMessage: (newMessage) => axios.post('/api/client/messages', newMessage),
  updateMessage: (updatedMessage) =>
    axios.put(`/api/client/messages/${updatedMessage.id}`, updatedMessage),
  deleteMessage: (id) => axios.delete(`/api/client/messages/${id}`),

  // Documents
  getDocuments: () => axios.get('/api/client/documents'),
  createDocument: (newDocument) =>
    axios.post('/api/client/documents', newDocument),
  updateDocument: (updatedDocument) =>
    axios.put(`/api/client/documents/${updatedDocument.id}`, updatedDocument),
  deleteDocument: (id) => axios.delete(`/api/client/documents/${id}`),

  // ... Add more methods as needed
};

export default clientService;
