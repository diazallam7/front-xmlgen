/// <reference types="vite/client" />

// Declaraciones para import.meta.env usadas en Vite
interface ImportMetaEnv {
  readonly VITE_API_BASE?: string;
  readonly VITE_XMLGEN_URL?: string;
  // agrega otras variables VITE_... si las necesitas
  readonly [key: string]: string | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
