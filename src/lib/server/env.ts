import "server-only";

// Variables de entorno del servidor.
//
// Ninguna lleva prefijo NEXT_PUBLIC_, asi que Next nunca las incrusta en el
// bundle del navegador. `server-only` hace que importar este archivo desde un
// componente cliente rompa la compilacion en vez de filtrarse en silencio.

export interface OpenWaConfig {
  baseUrl: string;
  apiKey: string;
  sessionId: string;
  salesChatId: string;
  timeoutMs: number;
}

export class MissingEnvError extends Error {
  constructor(public readonly names: string[]) {
    // Solo el nombre de la variable. Nunca su valor.
    super(`Faltan variables de entorno: ${names.join(", ")}`);
    this.name = "MissingEnvError";
  }
}

function read(name: string, missing: string[]): string {
  const value = process.env[name]?.trim();
  if (!value) {
    missing.push(name);
    return "";
  }
  return value;
}

/**
 * Devuelve la configuracion de OpenWA, o null si el canal aun no esta
 * configurado. Null no es un error: permite desplegar el endpoint antes de
 * tener la instancia levantada, guardando leads y marcandolos como pendientes
 * de notificar.
 */
export function getOpenWaConfig(): OpenWaConfig | null {
  const missing: string[] = [];
  const baseUrl = read("OPENWA_BASE_URL", missing);
  const apiKey = read("OPENWA_API_KEY", missing);
  const sessionId = read("OPENWA_SESSION_ID", missing);
  const salesChatId = read("OPENWA_SALES_CHAT_ID", missing);

  if (missing.length > 0) return null;

  const timeoutRaw = Number(process.env.OPENWA_TIMEOUT_MS);
  const timeoutMs = Number.isFinite(timeoutRaw) && timeoutRaw > 0 ? timeoutRaw : 5000;

  return { baseUrl: baseUrl.replace(/\/+$/, ""), apiKey, sessionId, salesChatId, timeoutMs };
}

/** Cadena de conexion a Postgres, o null si todavia no hay base configurada. */
export function getDatabaseUrl(): string | null {
  return process.env.DATABASE_URL?.trim() || null;
}

/** Dias de retencion de leads; 180 por defecto. */
export function getRetentionDays(): number {
  const raw = Number(process.env.LEAD_RETENTION_DAYS);
  return Number.isFinite(raw) && raw > 0 ? raw : 180;
}

/**
 * Version del texto de consentimiento que acepto el visitante (SEC-003).
 * Cambiarla cuando cambie la politica de privacidad, para saber que acepto
 * cada persona.
 */
export const CONSENT_VERSION = process.env.CONSENT_VERSION?.trim() || "2026-09-03";
