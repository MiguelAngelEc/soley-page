import { describe, it, expect } from "vitest";
import { parseLead, normalizePhone, cleanLine, cleanText, LEAD_LIMITS } from "./schema";

/** Payload valido minimo; cada prueba cambia solo lo que le interesa. */
function validPayload(overrides: Record<string, unknown> = {}) {
  return {
    source: "contact",
    clientType: "hogar",
    queryType: "cotizar-hogar",
    name: "Ana Pérez",
    phone: "0991234567",
    productIds: ["detergente-liquido"],
    privacyAccepted: true,
    whatsappOptIn: false,
    submissionToken: "3f2504e0-4f89-11d3-9a0c-0305e82c3301",
    ...overrides,
  };
}

describe("normalizePhone", () => {
  it("convierte el celular local de Ecuador a E.164", () => {
    expect(normalizePhone("0991234567")).toEqual({ ok: true, phone: "+593991234567" });
  });

  it("acepta separadores y espacios", () => {
    expect(normalizePhone("099 123 4567")).toEqual({ ok: true, phone: "+593991234567" });
    expect(normalizePhone("(099) 123-4567")).toEqual({ ok: true, phone: "+593991234567" });
  });

  it("acepta el fijo local", () => {
    expect(normalizePhone("062951234")).toEqual({ ok: true, phone: "+59362951234" });
  });

  it("conserva el formato internacional ya prefijado", () => {
    expect(normalizePhone("+593991234567")).toEqual({ ok: true, phone: "+593991234567" });
    expect(normalizePhone("+34600123456")).toEqual({ ok: true, phone: "+34600123456" });
  });

  it("trata 00 como prefijo internacional", () => {
    expect(normalizePhone("00593991234567")).toEqual({ ok: true, phone: "+593991234567" });
  });

  it("acepta 593 sin signo mas", () => {
    expect(normalizePhone("593991234567")).toEqual({ ok: true, phone: "+593991234567" });
  });

  it("rechaza numeros demasiado cortos o vacios", () => {
    expect(normalizePhone("")).toMatchObject({ ok: false });
    expect(normalizePhone("099")).toMatchObject({ ok: false });
    expect(normalizePhone("+1")).toMatchObject({ ok: false });
  });

  it("rechaza texto sin digitos", () => {
    expect(normalizePhone("llámame")).toMatchObject({ ok: false });
  });
});

describe("cleanLine", () => {
  it("colapsa espacios y recorta", () => {
    expect(cleanLine("  Ana   María  ", 80)).toBe("Ana María");
  });

  it("convierte saltos y tabs en espacio", () => {
    expect(cleanLine("Ana\nMaría\tPérez", 80)).toBe("Ana María Pérez");
  });

  it("elimina caracteres de control sin partir palabras", () => {
    const conControles = "An" + String.fromCharCode(0) + "a" + String.fromCharCode(7) + " María";
    expect(cleanLine(conControles, 80)).toBe("Ana María");
  });

  it("conserva unicode y corta al maximo", () => {
    expect(cleanLine("Ñandú 中文 🎉", 80)).toBe("Ñandú 中文 🎉");
    expect(cleanLine("x".repeat(200), 80)).toHaveLength(80);
  });
});

describe("cleanText", () => {
  it("colapsa tres o mas saltos en dos", () => {
    expect(cleanText("a\n\n\n\n\nb", 1000)).toBe("a\n\nb");
  });

  it("normaliza CRLF", () => {
    expect(cleanText("a\r\nb", 1000)).toBe("a\nb");
  });

  it("corta al maximo", () => {
    expect(cleanText("y".repeat(5000), LEAD_LIMITS.message)).toHaveLength(LEAD_LIMITS.message);
  });
});

describe("parseLead", () => {
  it("acepta un lead valido y normaliza el telefono", () => {
    const r = parseLead(validPayload());
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.lead.phone).toBe("+593991234567");
      expect(r.lead.name).toBe("Ana Pérez");
      expect(r.lead.productIds).toEqual(["detergente-liquido"]);
    }
  });

  it("rechaza un payload que no es objeto", () => {
    expect(parseLead(null).ok).toBe(false);
    expect(parseLead("hola").ok).toBe(false);
    expect(parseLead(42).ok).toBe(false);
  });

  it("rechaza un producto que no existe en el catalogo", () => {
    const r = parseLead(validPayload({ productIds: ["producto-inventado"] }));
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors.productIds).toBeDefined();
  });

  it("rechaza valores categoricos manipulados", () => {
    const r = parseLead(validPayload({ clientType: "admin", queryType: "x", source: "y" }));
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.errors.clientType).toBeDefined();
      expect(r.errors.queryType).toBeDefined();
      expect(r.errors.source).toBeDefined();
    }
  });

  it("exige el consentimiento de privacidad", () => {
    const r = parseLead(validPayload({ privacyAccepted: false }));
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors.privacyAccepted).toBeDefined();
  });

  it("no da por aceptado el consentimiento con un valor que solo parece cierto", () => {
    for (const valor of ["true", 1, "on", {}]) {
      expect(parseLead(validPayload({ privacyAccepted: valor })).ok).toBe(false);
    }
  });

  it("deja whatsappOptIn en false salvo que sea exactamente true", () => {
    const r1 = parseLead(validPayload({ whatsappOptIn: "true" }));
    expect(r1.ok && r1.lead.whatsappOptIn).toBe(false);
    const r2 = parseLead(validPayload({ whatsappOptIn: true }));
    expect(r2.ok && r2.lead.whatsappOptIn).toBe(true);
  });

  it("exige un submissionToken con forma de uuid", () => {
    expect(parseLead(validPayload({ submissionToken: "abc" })).ok).toBe(false);
    expect(parseLead(validPayload({ submissionToken: "" })).ok).toBe(false);
  });

  it("valida el correo solo cuando viene", () => {
    expect(parseLead(validPayload({ email: "" })).ok).toBe(true);
    expect(parseLead(validPayload({ email: "no-es-correo" })).ok).toBe(false);
    expect(parseLead(validPayload({ email: "a@b.co" })).ok).toBe(true);
  });

  it("valida el RUC solo cuando viene y acepta separadores", () => {
    expect(parseLead(validPayload({ ruc: "" })).ok).toBe(true);
    expect(parseLead(validPayload({ ruc: "123" })).ok).toBe(false);
    const r = parseLead(validPayload({ ruc: "1790012345001" }));
    expect(r.ok && r.lead.ruc).toBe("1790012345001");
  });

  it("elimina productos duplicados", () => {
    const r = parseLead(validPayload({ productIds: ["cloro-5", "cloro-5", "detergente-liquido"] }));
    expect(r.ok && r.lead.productIds).toEqual(["cloro-5", "detergente-liquido"]);
  });

  it("rechaza demasiados productos", () => {
    const muchos = Array.from({ length: LEAD_LIMITS.productIds + 1 }, (_, i) => `p${i}`);
    const r = parseLead(validPayload({ productIds: muchos }));
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors.productIds).toBeDefined();
  });

  it("ignora campos opcionales vacios en vez de guardarlos como cadena vacia", () => {
    const r = parseLead(validPayload({ email: "  ", company: "", quantity: "   ", message: "" }));
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect("email" in r.lead).toBe(false);
      expect("company" in r.lead).toBe(false);
      expect("quantity" in r.lead).toBe(false);
      expect("message" in r.lead).toBe(false);
    }
  });

  it("no deja que un campo inyecte saltos de linea", () => {
    const r = parseLead(validPayload({ name: "Ana\nTeléfono: 0999999999" }));
    expect(r.ok && r.lead.name).toBe("Ana Teléfono: 0999999999");
  });

  it("acumula todos los errores en vez de parar en el primero", () => {
    const r = parseLead({});
    expect(r.ok).toBe(false);
    if (!r.ok) expect(Object.keys(r.errors).length).toBeGreaterThan(4);
  });
});
