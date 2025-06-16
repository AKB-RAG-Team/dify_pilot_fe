import axios, { AxiosInstance } from 'axios';
import { API_CONFIG, ApiService } from '@/config/api.config';

const instances: Record<ApiService, AxiosInstance> = {} as Record<ApiService, AxiosInstance>;

// Khởi tạo các instance cho từng service
Object.entries(API_CONFIG).forEach(([service, config]) => {
  instances[service as ApiService] = axios.create({
    baseURL: config.baseURL,
    timeout: config.timeout,
  });
});

export const getApiInstance = (service: ApiService) => instances[service];

// Export default instance cho connection service (để tương thích với code cũ)
export default instances.connection; 