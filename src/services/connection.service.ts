import { getApiInstance } from '@/lib/axios';
import { Connection, CreateConnectionDTO, UpdateConnectionDTO } from '@/types/connection';

const API_URL = '/api/connections';
const apiConnection = getApiInstance('connection');

export const connectionService = {
  getAll: async (customerId?: string): Promise<Connection[]> => {
    const params = customerId ? { customer_id: customerId } : {};
    const response = await apiConnection.get(API_URL, { params });
    return response.data.data;
  },

  getById: async (id: number): Promise<Connection> => {
    const response = await apiConnection.get(`${API_URL}/${id}`);
    return response.data.data;
  },

  create: async (data: CreateConnectionDTO): Promise<Connection> => {
    const response = await apiConnection.post(API_URL, data);
    return response.data.data;
  },

  update: async (id: number, data: UpdateConnectionDTO): Promise<Connection> => {
    const response = await apiConnection.put(`${API_URL}/${id}`, data);
    return response.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiConnection.delete(`${API_URL}/${id}`);
  },
}; 