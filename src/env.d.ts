/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CONNECTION_API_URL: string
  readonly VITE_DIFY_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
} 