import "server-only";
import { neon } from "@neondatabase/serverless";
import type { Lead } from "@/lib/leads/schema";
import { getDatabaseUrl, CONSENT_VERSION } from "./env";

// Persistencia del lead (WA-003).
//
// El lead se guarda ANTES de intentar la notificacion. Esa es la garantia
// central del flujo: si OpenWA esta caido, la solicitud sigue existiendo y
// queda marcada para atencion manual, en vez de perderse.

export type LeadStatus = "RECEIVED" | "NOTIFIED" | "NOTIFICATION_FAILED";

export interface SavedLead {
  id: string;
  status: LeadStatus;
  /** true si ya existia un lead con el mismo submissionToken */
  duplicate: boolean;
}

/** Identificador legible y ordenable, sin datos personales dentro. */
export function newLeadId(): string {
  const time = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 8);
  return `lead_${time}${rand}`;
}

function sql() {
  const url = getDatabaseUrl();
  if (!url) return null;
  return neon(url);
}

/** true cuando hay base configurada; permite degradar sin romper. */
export function isStoreConfigured(): boolean {
  return getDatabaseUrl() !== null;
}

/**
 * Guarda el lead como RECEIVED. Si el submissionToken ya existe devuelve el
 * lead anterior sin insertar: dos clics rapidos no crean dos solicitudes ni
 * dos avisos de WhatsApp.
 */
export async function saveReceived(lead: Lead): Promise<SavedLead> {
  const db = sql();
  if (!db) throw new Error("DATABASE_URL no configurada");

  const id = newLeadId();

  const rows = await db`
    insert into leads (
      id, submission_token, status, source, client_type, query_type,
      name, phone, email, company, ruc, industry,
      product_ids, quantity, message,
      whatsapp_opt_in, privacy_accepted_at, consent_version
    ) values (
      ${id}, ${lead.submissionToken}, 'RECEIVED', ${lead.source}, ${lead.clientType}, ${lead.queryType},
      ${lead.name}, ${lead.phone}, ${lead.email ?? null}, ${lead.company ?? null}, ${lead.ruc ?? null}, ${lead.industry ?? null},
      ${lead.productIds}, ${lead.quantity ?? null}, ${lead.message ?? null},
      ${lead.whatsappOptIn}, now(), ${CONSENT_VERSION}
    )
    on conflict (submission_token) do nothing
    returning id, status
  `;

  if (rows.length > 0) {
    return { id: rows[0].id as string, status: rows[0].status as LeadStatus, duplicate: false };
  }

  // Ya existia: devolvemos el original para que la respuesta sea idempotente.
  const existing = await db`
    select id, status from leads where submission_token = ${lead.submissionToken}
  `;
  return {
    id: existing[0].id as string,
    status: existing[0].status as LeadStatus,
    duplicate: true,
  };
}

/** Marca el lead como notificado y guarda el id que devolvio OpenWA. */
export async function markNotified(id: string, openwaMessageId: string | null): Promise<void> {
  const db = sql();
  if (!db) return;
  await db`
    update leads
       set status = 'NOTIFIED', openwa_message_id = ${openwaMessageId},
           notification_error = null, updated_at = now()
     where id = ${id}
  `;
}

/**
 * Marca el fallo con un codigo ya saneado. Nunca se guarda el mensaje de error
 * original, que podria arrastrar la URL de OpenWA o parte de la credencial.
 */
export async function markNotificationFailed(id: string, failure: string): Promise<void> {
  const db = sql();
  if (!db) return;
  await db`
    update leads
       set status = 'NOTIFICATION_FAILED', notification_error = ${failure}, updated_at = now()
     where id = ${id}
  `;
}
