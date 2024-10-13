// src/features/calendarEntries/services/calendarEntriesService.ts
import apiClient from '../../api/apiClient';
import { CalendarEntry } from '../types';

const endpoint = '/calendar-entries';

const calendarEntriesService = {
  getAll: () => apiClient.get<CalendarEntry[]>(endpoint),
  getById: (id: number) => apiClient.get<CalendarEntry>(`${endpoint}/${id}`),
  create: (data: Partial<CalendarEntry>) => apiClient.post<CalendarEntry>(endpoint, data),
  update: (id: number, data: Partial<CalendarEntry>) => apiClient.put<CalendarEntry>(`${endpoint}/${id}`, data),
  delete: (id: number) => apiClient.delete(`${endpoint}/${id}`),
};

export default calendarEntriesService;
