import "server-only";

// Rate limit en memoria (SEC-001, primer nivel).
//
// LIMITACION CONOCIDA: el estado vive en el proceso. En Vercel cada instancia
// tiene el suyo y se pierde al reciclarse, asi que esto frena el abuso ingenuo
// y los reenvios accidentales, no un ataque distribuido. Si las metricas
// muestran abuso real, el siguiente paso es un contador compartido (Upstash o
// la propia base) antes de recurrir a CAPTCHA.

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

/** Evita que el Map crezca sin limite en un proceso de vida larga. */
function sweep(now: number): void {
  if (buckets.size < 1000) return;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

export interface RateLimitResult {
  allowed: boolean;
  /** segundos que faltan para poder reintentar */
  retryAfter: number;
}

export function checkRateLimit(key: string, limit = 5, windowMs = 60_000): RateLimitResult {
  const now = Date.now();
  sweep(now);

  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfter: 0 };
  }

  bucket.count += 1;
  if (bucket.count > limit) {
    return { allowed: false, retryAfter: Math.ceil((bucket.resetAt - now) / 1000) };
  }
  return { allowed: true, retryAfter: 0 };
}

/** Solo para pruebas: vacia el estado entre casos. */
export function resetRateLimit(): void {
  buckets.clear();
}
