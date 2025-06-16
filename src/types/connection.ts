export interface Connection {
  id: number;
  name: string;
  customer_id: string;
  knowledge_ids: string[];
  created_at: string;
  updated_at: string;
}

export interface CreateConnectionDTO {
  name: string;
  customer_id: string;
  knowledge_ids?: string[];
}

export interface UpdateConnectionDTO {
  name?: string;
  customer_id: string;
  knowledge_ids?: string[];
} 