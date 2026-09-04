// Formato de la notificacion interna a Soley (WA-005).
//
// Vive separado del contrato porque es lo unico que conoce el canal: si algun
// dia OpenWA se reemplaza, esto se reescribe y el resto del flujo no cambia.

import type { Lead } from "./schema";
import { products } from "@/data/products";

/** Tope de OpenWA para send-text. Nos mantenemos muy por debajo. */
export const OPENWA_TEXT_LIMIT = 4096;
const SAFE_LIMIT = 3000;

const SOURCE_LABELS: Record<Lead["source"], string> = {
  hero: "portada",
  product_card: "catálogo",
  modal: "modal de producto",
  contact: "formulario de contacto",
  float: "botón flotante",
};

const QUERY_LABELS: Record<Lead["queryType"], string> = {
  "cotizar-hogar": "Cotizar para hogar",
  "cotizar-mayoreo": "Cotizar al por mayor",
  "info-producto": "Información de producto",
  "visita-comercial": "Agendar visita comercial",
  disponibilidad: "Consultar disponibilidad",
  "otra-consulta": "Otra consulta",
};

const INDUSTRY_LABELS: Record<NonNullable<Lead["industry"]>, string> = {
  hotel: "Hotel / Hostal",
  restaurante: "Restaurante / Cafetería",
  clinica: "Clínica / Hospital",
  lavanderia: "Lavandería",
  oficina: "Oficina / Empresa",
  gimnasio: "Gimnasio / Spa",
  educacion: "Educación",
  comercio: "Comercio",
  otro: "Otro",
};

/**
 * Neutraliza un valor para que no pueda simular una linea de la plantilla.
 * Sin esto, un nombre como "Ana\nTeléfono: 0999999999" inventaria un campo.
 * Los saltos ya se eliminan en el contrato; esto cubre el resto y sirve de
 * segunda barrera si el valor llega por otra via.
 */
function safe(value: string): string {
  return value.replace(/[\r\n]+/g, " ").replace(/\s+/g, " ").trim();
}

function productNames(ids: string[]): string {
  if (ids.length === 0) return "—";
  return ids
    .map((id) => products.find((p) => p.id === id)?.name ?? id)
    .join(", ");
}

/**
 * Arma el aviso que recibe ventas. Corto, escaneable y con el leadId primero
 * para poder correlacionarlo con la base de datos y los logs.
 *
 * No incluye el RUC a proposito: el equipo no lo necesita para responder y
 * mantenerlo fuera del chat reduce la exposicion del dato.
 */
export function buildNotification(lead: Lead, leadId: string): string {
  const lines: string[] = [
    `NUEVO LEAD WEB · ${safe(leadId)}`,
    `Origen: ${SOURCE_LABELS[lead.source]}`,
    `Consulta: ${QUERY_LABELS[lead.queryType]}`,
    `Cliente: ${lead.clientType === "mayoreo" ? "al por mayor" : "hogar"}`,
    `Nombre: ${safe(lead.name)}`,
    `Teléfono: ${safe(lead.phone)}`,
  ];

  if (lead.email) lines.push(`Email: ${safe(lead.email)}`);
  if (lead.company) lines.push(`Empresa: ${safe(lead.company)}`);
  if (lead.industry) lines.push(`Sector: ${INDUSTRY_LABELS[lead.industry]}`);

  lines.push(`Productos: ${safe(productNames(lead.productIds))}`);
  if (lead.quantity) lines.push(`Cantidad: ${safe(lead.quantity)}`);

  lines.push(`Consentimiento WhatsApp: ${lead.whatsappOptIn ? "sí" : "no"}`);

  // El mensaje libre va al final e indentado: aunque contuviera saltos, sus
  // lineas quedan visiblemente dentro del bloque y no arriba entre los campos.
  if (lead.message) {
    const body = safe(lead.message.replace(/\n/g, " · "));
    lines.push("", "Mensaje:", `  ${body}`);
  }

  const text = lines.join("\n");
  if (text.length <= SAFE_LIMIT) return text;
  return `${text.slice(0, SAFE_LIMIT - 1)}…`;
}
