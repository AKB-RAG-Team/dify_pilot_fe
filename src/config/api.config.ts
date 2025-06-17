export const API_CONFIG = {
  connection: {
    baseURL:
      import.meta.env.VITE_CONNECTION_API_URL || "http://192.168.1.175:3000",
    timeout: 5000,
  },
  dify: {
    baseURL:
      import.meta.env.VITE_CONNECTION_API_URL || "http://192.168.1.175:3000",
    timeout: 5000,
  },
  fileService: {
    baseURL:
      import.meta.env.VITE_FILE_SERVICE_API_URL || "http://192.168.1.175:3001",
    timeout: 30000,
  },
} as const;

export type ApiService = keyof typeof API_CONFIG;
