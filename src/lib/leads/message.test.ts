import { describe, it, expect } from "vitest";
import { buildNotification, OPENWA_TEXT_LIMIT } from "./message";
import { parseLead, type Lead } from "./schema";

function leadFrom(overrides: Record<string, unknown> = {}): Lead {
  const r = parseLead({
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
  });
  if (!r.ok) throw new Error(`payload de prueba inválido: ${JSON.stringify(r.errors)}`);
  return r.lead;
}

describe("buildNotification", () => {
  it("abre con el leadId para poder correlacionarlo", () => {
    const texto = buildNotification(leadFrom(), "lead_abc123");
    expect(texto.split("\n")[0]).toBe("NUEVO LEAD WEB · lead_abc123");
  });

  it("traduce ids a etiquetas legibles para ventas", () => {
    const texto = buildNotification(leadFrom({ source: "modal", clientType: "mayoreo" }), "lead_1");
    expect(texto).toContain("Origen: modal de producto");
    expect(texto).toContain("Cliente: al por mayor");
  });

  it("muestra el nombre del producto, no su id", () => {
    const texto = buildNotification(leadFrom({ productIds: ["detergente-liquido"] }), "lead_1");
    expect(texto).toContain("Detergente Líquido");
    expect(texto).not.toContain("detergente-liquido");
  });

  it("nunca incluye el RUC", () => {
    const texto = buildNotification(
      leadFrom({ clientType: "mayoreo", queryType: "cotizar-mayoreo", ruc: "1790012345001" }),
      "lead_1",
    );
    expect(texto).not.toContain("1790012345001");
    expect(texto).not.toMatch(/RUC/i);
  });

  it("indica el consentimiento de WhatsApp explicitamente", () => {
    expect(buildNotification(leadFrom({ whatsappOptIn: true }), "l")).toContain("Consentimiento WhatsApp: sí");
    expect(buildNotification(leadFrom({ whatsappOptIn: false }), "l")).toContain("Consentimiento WhatsApp: no");
  });

  it("omite los campos opcionales que no vienen", () => {
    const texto = buildNotification(leadFrom(), "lead_1");
    expect(texto).not.toContain("Email:");
    expect(texto).not.toContain("Empresa:");
    expect(texto).not.toContain("Mensaje:");
  });

  it("impide que un campo simule otra linea de la plantilla", () => {
    // El contrato ya elimina los saltos; esto comprueba el resultado final.
    const texto = buildNotification(leadFrom({ name: "Ana\nTeléfono: 0999999999" }), "lead_1");
    const lineasTelefono = texto.split("\n").filter((l) => l.startsWith("Teléfono:"));
    expect(lineasTelefono).toHaveLength(1);
    expect(lineasTelefono[0]).toBe("Teléfono: +593991234567");
  });

  it("aplana el mensaje libre y lo deja al final", () => {
    const texto = buildNotification(leadFrom({ message: "línea uno\nlínea dos" }), "lead_1");
    const lineas = texto.split("\n");
    expect(lineas.indexOf("Mensaje:")).toBeGreaterThan(lineas.indexOf("Consentimiento WhatsApp: no"));
    expect(texto).toContain("línea uno · línea dos");
  });

  it("se mantiene muy por debajo del limite de OpenWA", () => {
    const texto = buildNotification(
      leadFrom({
        message: "z".repeat(5000),
        company: "c".repeat(200),
        quantity: "q".repeat(100),
      }),
      "lead_1",
    );
    expect(texto.length).toBeLessThan(OPENWA_TEXT_LIMIT);
  });
});
