import "server-only";
import { getOpenWaConfig, type OpenWaConfig } from "./env";

// Adaptador de OpenWA (WA-002).
//
// Es la unica pieza que conoce el canal. Si algun dia se migra a la API oficial
// de WhatsApp, se reescribe este archivo y el resto del flujo de leads no
// cambia. Por eso devuelve resultados propios y no filtra nada de OpenWA hacia
// arriba: ni URL, ni API key, ni cuerpo de la respuesta.

/** Motivo del fallo, ya saneado para guardar en base de datos y en logs. */
export type OpenWaFailure =
  | "not_configured"
  | "timeout"
  | "unauthorized"
  | "rate_limited"
  | "session_unavailable"
  | "network_error"
  | "upstream_error";

export type SendResult =
  | { ok: true; messageId: string | null }
  | { ok: false; failure: OpenWaFailure };

/** Errores que tiene sentido reintentar mas tarde, a mano o con un trabajo. */
export function isRetryable(failure: OpenWaFailure): boolean {
  return failure === "timeout" || failure === "network_error" || failure === "session_unavailable" || failure === "upstream_error";
}

function classifyStatus(status: number): OpenWaFailure {
  if (status === 401 || status === 403) return "unauthorized";
  if (status === 429) return "rate_limited";
  // OpenWA responde 404 o 409 cuando la sesion no existe o no esta lista.
  if (status === 404 || status === 409 || status === 503) return "session_unavailable";
  return "upstream_error";
}

/** Extrae el messageId sin asumir la forma exacta de la respuesta. */
function readMessageId(payload: unknown): string | null {
  if (typeof payload !== "object" || payload === null) return null;
  const obj = payload as Record<string, unknown>;
  const direct = obj.messageId ?? obj.id;
  if (typeof direct === "string") return direct;
  const data = obj.data;
  if (typeof data === "object" && data !== null) {
    const nested = (data as Record<string, unknown>).messageId ?? (data as Record<string, unknown>).id;
    if (typeof nested === "string") return nested;
  }
  return null;
}

/**
 * Envia el aviso al chat interno de Soley.
 *
 * `config` se puede inyectar en pruebas; en produccion se lee del entorno.
 * Nunca lanza: los fallos vuelven como resultado para que quien llama decida
 * que hacer con el lead, que ya esta guardado.
 */
export async function sendText(
  text: string,
  config: OpenWaConfig | null = getOpenWaConfig(),
): Promise<SendResult> {
  if (!config) return { ok: false, failure: "not_configured" };

  const url = `${config.baseUrl}/api/sessions/${encodeURIComponent(config.sessionId)}/messages/send-text`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), config.timeoutMs);

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": config.apiKey,
      },
      body: JSON.stringify({ chatId: config.salesChatId, text }),
      signal: controller.signal,
      cache: "no-store",
    });

    if (!res.ok) return { ok: false, failure: classifyStatus(res.status) };

    const payload = await res.json().catch(() => null);
    return { ok: true, messageId: readMessageId(payload) };
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      return { ok: false, failure: "timeout" };
    }
    return { ok: false, failure: "network_error" };
  } finally {
    clearTimeout(timer);
  }
}
