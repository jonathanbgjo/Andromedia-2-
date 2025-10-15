interface ImportMetaEnv {
  readonly VITE_API_BASE?: string;
  // add more VITE_ vars here as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
