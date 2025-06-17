import { getApiInstance } from "@/lib/axios";
import {
  FileUploadResponse,
  FileListResponse,
  FileDetailsResponse,
  ProcessFileRequest,
  ProcessFileResponse,
  FileChunksResponse,
} from "@/types/file";

const API_URL = "/api/v1/files";
const apiFileService = getApiInstance("fileService");

export const fileService = {
  // Upload file
  upload: async (
    file: File,
    knowledgeBaseId?: string
  ): Promise<FileUploadResponse> => {
    const formData = new FormData();
    formData.append("file", file);
    if (knowledgeBaseId) {
      formData.append("knowledge_base_id", knowledgeBaseId);
    }

    const response = await apiFileService.post(`${API_URL}/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // List files
  getAll: async (params?: {
    status?: string;
    page?: number;
    limit?: number;
    knowledge_base_id?: string;
  }): Promise<FileListResponse> => {
    const response = await apiFileService.get(API_URL, { params });
    return response.data;
  },

  // Get file details
  getById: async (id: string): Promise<FileDetailsResponse> => {
    const response = await apiFileService.get(`${API_URL}/${id}`);
    return response.data;
  },

  // Process file with Dify
  process: async (
    id: string,
    data: ProcessFileRequest
  ): Promise<ProcessFileResponse> => {
    const response = await apiFileService.put(`${API_URL}/${id}/process`, data);
    return response.data;
  },

  // Get processing status
  getStatus: async (
    id: string
  ): Promise<{
    success: boolean;
    data: { id: string; status: string; processingError?: string };
  }> => {
    const response = await apiFileService.get(`${API_URL}/${id}/status`);
    return response.data;
  },

  // Get file chunks
  getChunks: async (
    id: string,
    params?: {
      page?: number;
      limit?: number;
    }
  ): Promise<FileChunksResponse> => {
    const response = await apiFileService.get(`${API_URL}/${id}/chunks`, {
      params,
    });
    return response.data;
  },

  // Download file
  download: async (id: string): Promise<Blob> => {
    const response = await apiFileService.get(`${API_URL}/${id}/download`, {
      responseType: "blob",
    });
    return response.data;
  },

  // Delete file
  delete: async (
    id: string
  ): Promise<{ success: boolean; message: string }> => {
    const response = await apiFileService.delete(`${API_URL}/${id}`);
    return response.data;
  },
};
