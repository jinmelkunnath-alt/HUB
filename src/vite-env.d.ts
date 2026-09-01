/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME?: string
  // Future phases may add: VITE_FIREBASE_*, VITE_API_URL, VITE_WORKER_*, etc.
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
