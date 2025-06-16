export const API_CONFIG = {
  connection: {
    baseURL: import.meta.env.VITE_CONNECTION_API_URL || 'http://192.168.1.175:3000',
    timeout: 5000,
  },
  dify: {
    baseURL: import.meta.env.VITE_DIFY_API_URL || 'http://192.168.1.27',
    timeout: 10000,
  },
  // Thêm các service khác ở đây
} as const;

export type ApiService = keyof typeof API_CONFIG; 