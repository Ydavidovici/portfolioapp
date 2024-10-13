import apiClient from '../../api/apiClient';
import { Checklistitems } from '../types';

const endpoint = '/checklistItems';

const checklistItemsService = {
  getAll: () => apiClient.get<Checklistitems[]>(endpoint),
  getById: (id: number) => apiClient.get<Checklistitems>(`${endpoint}/${id}`),
  create: (data: Partial<Checklistitems>) => apiClient.post<Checklistitems>(endpoint, data),
  update: (id: number, data: Partial<Checklistitems>) => apiClient.put<Checklistitems>(`${endpoint}/${id}`, data),
  delete: (id: number) => apiClient.delete(`${endpoint}/${id}`),
};

export default checklistItemsService;
