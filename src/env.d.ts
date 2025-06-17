/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CONNECTION_API_URL: string;
  readonly VITE_DIFY_API_URL: string;
  readonly VITE_FILE_SERIVE_API__URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
