/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE?: string; // leave unset for frontend-only
  readonly VITE_DEMO_MODE?: string; // "true" to simulate backend
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
