import { NextResponse } from "next/server";
import { parseLead } from "@/lib/leads/schema";
import { buildNotification } from "@/lib/leads/message";
import { sendText } from "@/lib/server/openwa";
import {
  saveReceived,
  markNotified,
  markNotificationFailed,
  isStoreConfigured,
  newLeadId,
} from "@/lib/server/leadStore";
import { checkRateLimit } from "@/lib/server/rateLimit";

// Endpoint publico de captacion (WA-002).
//
// Orden deliberado: primero se rechaza lo barato (metodo, tamano, ritmo),
// luego se valida, y solo entonces se guarda. La notificacion por WhatsApp va
// despues de guardar, para que una caida de OpenWA no borre la solicitud.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Tope del cuerpo: un lead valido no llega ni de lejos a esto. */
const MAX_BODY_BYTES = 16 * 1024;

/** Tiempo minimo de llenado. Por debajo, casi seguro es un bot. */
const MIN_FILL_MS = 2000;

function clientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip")?.trim() || "desconocida";
}

/**
 * Respuesta de exito. `notification` distingue si el aviso salio o quedo
 * pendiente: la UI puede decir "solicitud recibida" en ambos casos, pero no
 * debe afirmar que se envio por WhatsApp cuando sea "delayed".
 */
function ok(leadId: string, notification: "sent" | "delayed", requestId: string) {
  return NextResponse.json(
    { ok: true, leadId, notification, canContinueOnWhatsApp: true },
    { status: 200, headers: { "x-request-id": requestId } },
  );
}

function fail(status: number, body: Record<string, unknown>, requestId: string, extra?: HeadersInit) {
  return NextResponse.json(
    { ok: false, requestId, ...body },
    { status, headers: { "x-request-id": requestId, ...(extra ?? {}) } },
  );
}

export async function POST(req: Request) {
  const requestId = crypto.randomUUID();

  if (!req.headers.get("content-type")?.includes("application/json")) {
    return fail(415, { error: "unsupported_media_type" }, requestId);
  }

  const declared = Number(req.headers.get("content-length"));
  if (Number.isFinite(declared) && declared > MAX_BODY_BYTES) {
    return fail(413, { error: "payload_too_large" }, requestId);
  }

  const raw = await req.text();
  if (raw.length > MAX_BODY_BYTES) {
    return fail(413, { error: "payload_too_large" }, requestId);
  }

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return fail(400, { error: "invalid_json" }, requestId);
  }

  const envelope = (typeof body === "object" && body !== null ? body : {}) as Record<string, unknown>;

  // Honeypot: campo oculto que una persona nunca rellena. Respondemos 200 para
  // no ensenarle al bot que fue detectado, pero no guardamos nada.
  if (typeof envelope.website === "string" && envelope.website.trim() !== "") {
    return ok(newLeadId(), "sent", requestId);
  }

  // Tiempo de llenado. Señal debil (el cliente la envia), por eso solo se usa
  // junto al resto y nunca como unica defensa.
  const startedAt = Number(envelope.startedAt);
  if (Number.isFinite(startedAt) && Date.now() - startedAt < MIN_FILL_MS) {
    return fail(400, { error: "too_fast" }, requestId);
  }

  const rate = checkRateLimit(clientIp(req));
  if (!rate.allowed) {
    return fail(
      429,
      { error: "rate_limited", retryAfter: rate.retryAfter },
      requestId,
      { "retry-after": String(rate.retryAfter) },
    );
  }

  const parsed = parseLead(envelope);
  if (!parsed.ok) {
    return fail(400, { error: "validation_failed", fields: parsed.errors }, requestId);
  }
  const lead = parsed.lead;

  if (!isStoreConfigured()) {
    // Sin base no se puede cumplir "guardar antes de notificar". Preferimos
    // fallar visiblemente a fingir que la solicitud quedo registrada.
    console.error(JSON.stringify({ requestId, event: "lead_store_missing" }));
    return fail(503, { error: "store_unavailable" }, requestId);
  }

  let saved;
  try {
    saved = await saveReceived(lead);
  } catch (error) {
    console.error(
      JSON.stringify({
        requestId,
        event: "lead_save_failed",
        reason: error instanceof Error ? error.name : "unknown",
      }),
    );
    return fail(503, { error: "store_unavailable" }, requestId);
  }

  // Reenvio del mismo formulario: devolvemos el lead original sin volver a
  // avisar por WhatsApp.
  if (saved.duplicate) {
    console.info(JSON.stringify({ requestId, event: "lead_duplicate", leadId: saved.id }));
    return ok(saved.id, saved.status === "NOTIFIED" ? "sent" : "delayed", requestId);
  }

  console.info(
    JSON.stringify({
      requestId,
      event: "lead_saved",
      leadId: saved.id,
      source: lead.source,
      clientType: lead.clientType,
    }),
  );

  const result = await sendText(buildNotification(lead, saved.id));

  if (result.ok) {
    await markNotified(saved.id, result.messageId);
    console.info(
      JSON.stringify({ requestId, event: "openwa_notified", leadId: saved.id, messageId: result.messageId }),
    );
    return ok(saved.id, "sent", requestId);
  }

  await markNotificationFailed(saved.id, result.failure);
  console.error(
    JSON.stringify({ requestId, event: "openwa_failed", leadId: saved.id, failure: result.failure }),
  );
  // El lead esta guardado: para el visitante la solicitud si fue recibida.
  return ok(saved.id, "delayed", requestId);
}
