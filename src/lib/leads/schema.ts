// Contrato unico del lead (WA-001).
//
// Lo comparten el formulario de contacto, el modal de WhatsApp y el Route
// Handler. El navegador nunca decide que valores son validos: los campos
// categoricos se comprueban contra estas listas y los ids de producto contra
// el catalogo real, porque un nombre libre enviado desde el cliente no es una
// fuente de verdad.

import { products } from "@/data/products";

export const LEAD_LIMITS = {
  name: 80,
  company: 120,
  email: 254,
  phone: 20,
  ruc: 13,
  quantity: 60,
  message: 1000,
  /** tope de productos seleccionables en una sola solicitud */
  productIds: 12,
} as const;

/** Origen del lead. Mismos nombres que los eventos de analitica (DATA-001). */
export const LEAD_SOURCES = ["hero", "product_card", "modal", "contact", "float"] as const;
export type LeadSource = (typeof LEAD_SOURCES)[number];

export const CLIENT_TYPES = ["hogar", "mayoreo"] as const;
export type ClientType = (typeof CLIENT_TYPES)[number];

export const QUERY_TYPES = [
  "cotizar-hogar",
  "cotizar-mayoreo",
  "info-producto",
  "visita-comercial",
  "disponibilidad",
  "otra-consulta",
] as const;
export type QueryType = (typeof QUERY_TYPES)[number];

export const INDUSTRIES = [
  "hotel",
  "restaurante",
  "clinica",
  "lavanderia",
  "oficina",
  "gimnasio",
  "educacion",
  "comercio",
  "otro",
] as const;
export type Industry = (typeof INDUSTRIES)[number];

/** Ids de producto validos, derivados del catalogo real. */
export const PRODUCT_IDS: readonly string[] = products.map((p) => p.id);

export interface Lead {
  source: LeadSource;
  clientType: ClientType;
  queryType: QueryType;
  name: string;
  /** normalizado a E.164 */
  phone: string;
  email?: string;
  company?: string;
  ruc?: string;
  industry?: Industry;
  productIds: string[];
  quantity?: string;
  message?: string;
  /** obligatorio: sin esto no se puede tratar el dato */
  privacyAccepted: true;
  /** opcional y nunca premarcado: permiso para mensajes futuros */
  whatsappOptIn: boolean;
  /** uuid generado al abrir el formulario; deduplica reenvios */
  submissionToken: string;
}

export type FieldErrors = Record<string, string>;

export type ParseResult =
  | { ok: true; lead: Lead }
  | { ok: false; errors: FieldErrors };

// --- normalizacion -------------------------------------------------------

const CONTROL_CHARS = /\p{Cc}/gu;
const LINE_SEPARATORS = /[\t\n\r]/g;

/** Campo de una sola linea: sin controles, sin saltos, sin espacios sobrantes. */
export function cleanLine(value: string, max: number): string {
  return value
    .replace(LINE_SEPARATORS, " ")
    .replace(CONTROL_CHARS, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

/** Campo multilinea: conserva saltos pero limita los consecutivos. */
export function cleanText(value: string, max: number): string {
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
 * Normaliza a E.164. Acepta el formato local de Ecuador (09..., 0X...) y
 * numeros internacionales ya prefijados; rechaza lo demas en vez de adivinar.
 */
export function normalizePhone(raw: string): { ok: true; phone: string } | { ok: false; reason: string } {
  const trimmed = raw.trim();
  const hasPlus = trimmed.startsWith("+");
  let digits = trimmed.replace(/\D/g, "");

  // 00 como prefijo internacional equivale a "+"
  let international = hasPlus;
  if (!international && digits.startsWith("00")) {
    digits = digits.slice(2);
    international = true;
  }

  if (!digits) return { ok: false, reason: "Escribe tu número de teléfono." };

  if (international) {
    if (digits.length < 8 || digits.length > 15) {
      return { ok: false, reason: "El número internacional no tiene una longitud válida." };
    }
    return { ok: true, phone: `+${digits}` };
  }

  // Formato local de Ecuador: celular 09XXXXXXXX, fijo 0X XXXXXXX
  if (digits.startsWith("0")) {
    const local = digits.slice(1);
    if (local.length === 9 && local.startsWith("9")) return { ok: true, phone: `+593${local}` };
    if (local.length === 8) return { ok: true, phone: `+593${local}` };
    return { ok: false, reason: "Revisa el número: en Ecuador son 10 dígitos (09XXXXXXXX)." };
  }

  // Sin cero inicial pero con formato de celular ecuatoriano
  if (digits.startsWith("593") && digits.length >= 11 && digits.length <= 12) {
    return { ok: true, phone: `+${digits}` };
  }
  if (digits.length === 9 && digits.startsWith("9")) return { ok: true, phone: `+593${digits}` };

  return { ok: false, reason: "Escribe el número con 10 dígitos o en formato internacional (+593...)." };
}

// --- validacion ----------------------------------------------------------

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function inList<T extends string>(list: readonly T[], value: unknown): value is T {
  return typeof value === "string" && (list as readonly string[]).includes(value);
}

/**
 * Valida y normaliza un payload sin confiar en su forma. Devuelve errores por
 * campo para que la UI pueda señalar exactamente cuál falla.
 */
export function parseLead(raw: unknown): ParseResult {
  const errors: FieldErrors = {};
  const input = (typeof raw === "object" && raw !== null ? raw : {}) as Record<string, unknown>;

  if (!inList(LEAD_SOURCES, input.source)) errors.source = "Origen no reconocido.";
  if (!inList(CLIENT_TYPES, input.clientType)) errors.clientType = "Tipo de cliente no reconocido.";
  if (!inList(QUERY_TYPES, input.queryType)) errors.queryType = "Tipo de consulta no reconocido.";

  const name = cleanLine(asString(input.name), LEAD_LIMITS.name);
  if (name.length < 2) errors.name = "Escribe tu nombre.";

  const phoneRaw = cleanLine(asString(input.phone), LEAD_LIMITS.phone);
  const phone = normalizePhone(phoneRaw);
  if (!phone.ok) errors.phone = phone.reason;

  const email = cleanLine(asString(input.email), LEAD_LIMITS.email);
  if (email && !EMAIL.test(email)) errors.email = "Revisa el correo electrónico.";

  const company = cleanLine(asString(input.company), LEAD_LIMITS.company);

  const ruc = cleanLine(asString(input.ruc), LEAD_LIMITS.ruc).replace(/\D/g, "");
  if (ruc && ruc.length !== 13) errors.ruc = "El RUC tiene 13 dígitos.";

  let industry: Industry | undefined;
  if (input.industry !== undefined && input.industry !== "") {
    if (inList(INDUSTRIES, input.industry)) industry = input.industry;
    else errors.industry = "Sector no reconocido.";
  }

  const rawIds = Array.isArray(input.productIds) ? input.productIds : [];
  const productIds = [...new Set(rawIds.filter((id): id is string => typeof id === "string"))];
  if (productIds.length > LEAD_LIMITS.productIds) {
    errors.productIds = "Seleccionaste demasiados productos.";
  } else if (productIds.some((id) => !PRODUCT_IDS.includes(id))) {
    errors.productIds = "Uno de los productos no existe en el catálogo.";
  }

  const quantity = cleanLine(asString(input.quantity), LEAD_LIMITS.quantity);
  const message = cleanText(asString(input.message), LEAD_LIMITS.message);

  if (input.privacyAccepted !== true) {
    errors.privacyAccepted = "Necesitamos tu autorización para tratar estos datos.";
  }

  const submissionToken = asString(input.submissionToken);
  if (!UUID.test(submissionToken)) errors.submissionToken = "Solicitud inválida. Recarga la página.";

  if (Object.keys(errors).length > 0) return { ok: false, errors };

  const lead: Lead = {
    source: input.source as LeadSource,
    clientType: input.clientType as ClientType,
    queryType: input.queryType as QueryType,
    name,
    phone: (phone as { ok: true; phone: string }).phone,
    productIds,
    privacyAccepted: true,
    whatsappOptIn: input.whatsappOptIn === true,
    submissionToken,
  };

  // Campos opcionales solo si traen valor, para no guardar cadenas vacias.
  if (email) lead.email = email;
  if (company) lead.company = company;
  if (ruc) lead.ruc = ruc;
  if (industry) lead.industry = industry;
  if (quantity) lead.quantity = quantity;
  if (message) lead.message = message;

  return { ok: true, lead };
}
