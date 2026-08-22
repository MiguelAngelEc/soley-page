// Limites y normalizacion de los formularios que arman mensajes de WhatsApp (AUD-006).
// La validacion del cliente no es un control de seguridad de servidor: si en el
// futuro existe backend, hay que repetirla ahi.

export const LIMITS = {
  name: 80,
  company: 120,
  email: 254,
  phone: 20,
  ruc: 13,
  product: 120,
  quantity: 60,
  message: 1000,
} as const;

// Longitud maxima de la URL final de wa.me. Por encima de esto WhatsApp y
// algunos navegadores moviles truncan o fallan en silencio.
export const MAX_URL_LENGTH = 4000;

// Categoria Unicode "Control": rangos C0/C1, tab y saltos de linea incluidos.
// Los separadores se convierten en espacio y el resto se elimina, para no unir
// ni partir palabras al normalizar.
const CONTROL_CHARS = /\p{Cc}/gu;
const LINE_SEPARATORS = /[\t\n\r]/g;

/** Normaliza un campo de una sola linea: sin controles, sin saltos, sin espacios sobrantes. */
export function cleanField(value: string, max: number): string {
  return value
    .replace(LINE_SEPARATORS, " ")
    .replace(CONTROL_CHARS, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

/** Normaliza un campo multilinea: conserva saltos pero limita los consecutivos. */
export function cleanMultiline(value: string, max: number): string {
  return value
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map((line) => line.replace(/\t/g, " ").replace(CONTROL_CHARS, "").replace(/ +/g, " ").trim())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, max);
}

/**
 * Arma la URL de wa.me y avisa si excede el limite admitido.
 * `encodeURIComponent` es obligatorio: nunca concatenar entrada sin codificar.
 */
export function buildWhatsAppUrl(phone: string, message: string): { url: string; tooLong: boolean } {
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  return { url, tooLong: url.length > MAX_URL_LENGTH };
}

/** Abre WhatsApp aislando `window.opener` (AUD-009). */
export function openWhatsApp(url: string): void {
  window.open(url, "_blank", "noopener,noreferrer");
}
