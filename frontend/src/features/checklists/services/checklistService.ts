// src/features/checklists/services/checklistService.ts
import apiClient from '../../api/apiClient';
import { Checklist } from '../types';

const endpoint = '/checklists';

const checklistService = {
  getAll: () => apiClient.get<Checklist[]>(endpoint),
  getById: (id: number) => apiClient.get<Checklist>(`${endpoint}/${id}`),
  create: (data: Partial<Checklist>) => apiClient.post<Checklist>(endpoint, data),
  update: (id: number, data: Partial<Checklist>) => apiClient.put<Checklist>(`${endpoint}/${id}`, data),
  delete: (id: number) => apiClient.delete(`${endpoint}/${id}`),
};

export default checklistService;
