import { getApiInstance } from '@/lib/axios';
import { Dataset } from '@/types/dify';

const API_URL = '/api/dify';
const apiDify = getApiInstance('dify');

export const difyService = {
    getAllDataset: async (customerId?: string): Promise<Dataset[]> => {
        const params = customerId ? { customer_id: customerId } : {};
        const response = await apiDify.get(API_URL, { params });
        return response.data.data;
    }
  }; 