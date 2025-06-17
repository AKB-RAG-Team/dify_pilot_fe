export interface FileUploadResponse {
  success: boolean;
  data: {
    id: string;
    uuid: string;
    filename: string;
    originalName: string;
    url: string;
    mimeType: string;
    size: number;
    status: "uploaded" | "processing" | "processed" | "failed";
    createdAt: string;
  };
}

export interface FileListResponse {
  success: boolean;
  data: FileItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface FileItem {
  id: string;
  uuid: string;
  filename: string;
  originalName: string;
  url: string;
  size: number;
  mimeType: string;
  status: "uploaded" | "processing" | "processed" | "failed";
  difyKnowledgeBaseId?: string;
  difyDocumentId?: string;
  processingError?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FileDetailsResponse {
  success: boolean;
  data: FileItem;
}

export interface ProcessFileRequest {
  knowledgeBaseId?: string;
}

export interface ProcessFileResponse {
  success: boolean;
  data: {
    id: string;
    status: string;
    message: string;
  };
}

export interface FileChunksResponse {
  success: boolean;
  data: {
    chunks: FileChunk[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

export interface FileChunk {
  id: string;
  position: number;
  content: string;
  wordCount: number;
  difyChunkId?: string;
}
