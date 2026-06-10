"use client";

import { useState, useRef, ComponentType, SVGProps } from "react";
import { useReveal } from "@/lib/hooks";
import { products } from "@/data/products";
import {
  ArrowIcon, WhatsAppIcon, MailIcon, PinIcon, IgIcon, FbIcon, DocumentIcon,
} from "@/components/shared/Icons";

type IconCmp = ComponentType<SVGProps<SVGSVGElement>>;

interface FormState {
  type: "menudeo" | "mayoreo";
  name: string;
  email: string;
  phone: string;
  company: string;
  products: string[];
  quantity: string;
  message: string;
}

export function Contact() {
  const sectionRef = useRef<HTMLElement | null>(null);
  useReveal(sectionRef);

  const [form, setForm] = useState<FormState>({
    type: "menudeo", name: "", email: "", phone: "", company: "",
    products: [], quantity: "", message: "",
  });
  const [sent, setSent] = useState(false);

  const toggleProduct = (p: string) =>
    setForm((f) => ({
      ...f,
      products: f.products.includes(p) ? f.products.filter((x) => x !== p) : [...f.products, p],
    }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const productList = form.products.length ? form.products.join(", ") : "—";
    const text = `Hola Soley, quiero cotizar:

Tipo: ${form.type === "mayoreo" ? "Al Por Mayor / Empresa" : "Al Por Menor / Hogar"}
Nombre: ${form.name}
Email: ${form.email}
Teléfono: ${form.phone}
${form.company ? `Empresa: ${form.company}\n` : ""}Productos: ${productList}
Cantidad estimada: ${form.quantity || "—"}

${form.message}`;
    setSent(true);
    setTimeout(() => {
      window.open(`https://wa.me/593961264102?text=${encodeURIComponent(text)}`, "_blank");
    }, 600);
  };

  const allProducts = products.map((p) => p.name);

  return (
    <section id="contacto" ref={sectionRef} className="section-y" style={{ background: "var(--bg-soft)", position: "relative", overflow: "hidden" }}>
      <div className="halftone" style={{ top: 80, right: -80, width: 320, height: 320, opacity: 0.14 }} />

      <div className="container-x" style={{ position: "relative" }}>
        <div className="section-head center reveal">
          <span className="eyebrow"><span className="dot" />Hablemos</span>
          <h2>Cotiza tu pedido <span className="accent">en menos de 24 horas</span></h2>
          <p className="lead">Cuéntanos qué necesitas y te respondemos con precios, presentaciones y tiempos de entrega.</p>
        </div>

        <div className="contact-grid">
          <div className="reveal" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <ContactItem Icon={WhatsAppIcon} label="WhatsApp" value="+593 96 126 4102" href="https://wa.me/593961264102" accent="#25D366" />
              <ContactItem Icon={MailIcon} label="Email" value="soleyjaboneria@gmail.com" href="mailto:soleyjaboneria@gmail.com" accent="var(--soley-red)" />
              <ContactItem Icon={PinIcon} label="Dirección" value="Luis J. Pérez 4-54 y J. Tobar, Ibarra" accent="var(--soley-blue)" full />
              <ContactItem Icon={IgIcon} label="Instagram" value="@soleyjaboneria" href="https://www.instagram.com/soleyjaboneria/" accent="#E4405F" />
              <ContactItem Icon={FbIcon} label="Facebook" value="soleyjaboneria" href="https://www.facebook.com/profile.php?id=100057119543790" accent="#1877F2" />
            </div>

            <div style={{
              background: "white", borderRadius: 24, padding: 16,
              border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)",
            }}>
              <div style={{
                position: "relative", aspectRatio: "16 / 11",
                background: "var(--bg-marble)", borderRadius: 16, overflow: "hidden",
              }}>
                <iframe
                  title="Ubicación Soley"
                  src="https://www.google.com/maps?q=Ibarra+Ecuador&output=embed"
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0, filter: "grayscale(0.2)" }}
                  loading="lazy"
                />
                <div style={{
                  position: "absolute", top: "50%", left: "50%",
                  transform: "translate(-50%, -100%)", pointerEvents: "none",
                }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 999,
                    background: "var(--soley-red)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "white", boxShadow: "var(--shadow-red)",
                    border: "3px solid white",
                  }}>
                    <PinIcon width={20} height={20} />
                  </div>
                </div>
              </div>
              <div style={{ padding: "16px 8px 8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>Planta y bodega principal</div>
                  <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 2 }}>Lun-Sáb · 8:00 – 18:00</div>
                </div>
                <a href="https://maps.google.com/?q=Luis+Jaramillo+Perez+4-54+Ibarra+Ecuador" target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: 13, fontWeight: 700, color: "var(--soley-blue)", display: "inline-flex", alignItems: "center", gap: 6 }}>
                  Cómo llegar <ArrowIcon width={14} height={14} />
                </a>
              </div>
            </div>
          </div>

          <form onSubmit={submit} className="reveal" style={{
            background: "white", borderRadius: 28, padding: 36,
            border: "1px solid var(--border)", boxShadow: "var(--shadow-md)",
            display: "flex", flexDirection: "column", gap: 18,
          }}>
            <div style={{
              background: "linear-gradient(135deg, #F0F6FD 0%, #E3F0FF 100%)",
              borderRadius: 16,
              padding: "16px 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
              marginBottom: 8,
              border: "1px solid rgba(30, 91, 186, 0.15)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <DocumentIcon width={20} height={20} style={{ color: "var(--soley-blue)" }} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "var(--soley-blue-deep)" }}>
                    ¿Prefieres revisar primero?
                  </div>
                  <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 1 }}>
                    Descarga nuestro catálogo completo
                  </div>
                </div>
              </div>
              <a
                href="/Catalogo/CatálogoSOLEY.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm btn-outline-blue"
              >
                PDF
              </a>
            </div>
            <div>
              <Label>Tipo de cotización</Label>
              <div style={{
                display: "grid", gridTemplateColumns: "1fr 1fr",
                background: "var(--bg-soft)", padding: 4, borderRadius: 999, marginTop: 6,
              }}>
                {([
                  { id: "menudeo", label: "Hogar" },
                  { id: "mayoreo", label: "Empresa / Al Por Mayor" },
                ] as const).map((t) => (
                  <button key={t.id} type="button" onClick={() => setForm({ ...form, type: t.id })}
                    style={{
                      padding: "10px 14px", borderRadius: 999,
                      fontSize: 13.5, fontWeight: 700,
                      background: form.type === t.id ? "white" : "transparent",
                      color: form.type === t.id ? "var(--soley-blue-deep)" : "var(--muted)",
                      boxShadow: form.type === t.id ? "var(--shadow-sm)" : "none",
                      transition: "all .2s",
                    }}>{t.label}</button>
                ))}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <Field label="Nombre" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required placeholder="Tu nombre" />
              <Field label="Teléfono" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} required placeholder="+593..." />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: form.type === "mayoreo" ? "1fr 1fr" : "1fr", gap: 14 }}>
              <Field label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} required placeholder="tu@email.com" />
              {form.type === "mayoreo" && (
                <Field label="Empresa" value={form.company} onChange={(v) => setForm({ ...form, company: v })} placeholder="Nombre de la empresa" />
              )}
            </div>

            <div>
              <Label>Productos de interés</Label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 6 }}>
                {allProducts.map((p) => {
                  const active = form.products.includes(p);
                  return (
                    <button key={p} type="button" onClick={() => toggleProduct(p)}
                      style={{
                        padding: "8px 14px", borderRadius: 999,
                        fontSize: 12.5, fontWeight: 600,
                        background: active ? "var(--soley-blue)" : "white",
                        color: active ? "white" : "var(--ink-2)",
                        border: `1px solid ${active ? "var(--soley-blue)" : "var(--border)"}`,
                        transition: "all .15s",
                      }}>{p}</button>
                  );
                })}
              </div>
            </div>

            <Field
              label={form.type === "mayoreo" ? "Volumen estimado / mes" : "Cantidad aproximada"}
              value={form.quantity}
              onChange={(v) => setForm({ ...form, quantity: v })}
              placeholder={form.type === "mayoreo" ? "Ej. 10 canecas/mes" : "Ej. 2 galones"}
            />

            <div>
              <Label>Mensaje (opcional)</Label>
              <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                rows={3} placeholder="Cuéntanos cualquier detalle adicional..." style={fieldStyle} />
            </div>

            <button type="submit" className="btn btn-lg btn-red" style={{ marginTop: 4 }}>
              {sent ? "Abriendo WhatsApp..." : "Enviar cotización"}
              {!sent && <ArrowIcon width={18} height={18} />}
            </button>

            <p style={{ fontSize: 12, color: "var(--muted-2)", textAlign: "center", marginTop: 4 }}>
              Al enviar, abrimos WhatsApp con tu solicitud lista. Tiempo de respuesta promedio: 1 hora.
            </p>
          </form>
        </div>
      </div>

      <style>{`
        .contact-grid { display: grid; grid-template-columns: 1fr 1.05fr; gap: 32px; }
        @media (max-width: 980px) { .contact-grid { grid-template-columns: 1fr; } }

        /* Mobile styles for contact items */
        @media (max-width: 640px) {
          /* Hide text for phone, email, and social media on mobile */
          .contact-item-text:not(.address-item) {
            display: none;
          }

          /* Show text only for address */
          .contact-item-text.address-item {
            display: block;
          }

          /* Center icons when text is hidden */
          .contact-item-text:not(.address-item) + div {
            margin: 0 auto;
          }

          /* Adjust contact items for icon-only display */
          a[href*="wa.me"] > div:first-child,
          a[href*="mailto"] > div:first-child,
          a[href*="instagram"] > div:first-child,
          a[href*="facebook"] > div:first-child {
            width: 48px;
            height: 48px;
            margin: 0 auto;
          }

          /* Make contact items more compact on mobile */
          a[href*="wa.me"],
          a[href*="mailto"],
          a[href*="instagram"],
          a[href*="facebook"] {
            justify-content: center;
            padding: 14px;
          }
        }
      `}</style>
    </section>
  );
}

function ContactItem({ Icon, label, value, href, accent, full }: {
  Icon: IconCmp; label: string; value: string; href?: string; accent: string; full?: boolean;
}) {
  const isAddress = label === "Dirección";
  const isSocial = label === "Instagram" || label === "Facebook";

  const baseStyle: React.CSSProperties = {
    background: "white", borderRadius: 16, padding: 18,
    border: "1px solid var(--border)",
    display: "flex", gap: 14, alignItems: "flex-start",
    gridColumn: full ? "1 / -1" : "auto",
    transition: "transform .15s, border-color .2s",
    cursor: href ? "pointer" : "default",
  };
  const inner = (
    <>
      <div style={{
        width: 40, height: 40, borderRadius: 12,
        background: `${accent}15`, color: accent,
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>
        <Icon width={18} height={18} />
      </div>
      <div className={`contact-item-text ${isAddress ? 'address-item' : ''} ${isSocial ? 'social-item' : ''}`} style={{ minWidth: 0 }}>
        <div style={{ fontSize: 11.5, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</div>
        <div style={{ fontSize: 14, fontWeight: 700, color: "var(--ink)", marginTop: 2, wordBreak: "break-word" }}>{value}</div>
      </div>
    </>
  );
  if (href) {
    return (
      <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" style={baseStyle}
        onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.borderColor = "var(--border-strong)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "var(--border)"; }}
      >
        {inner}
      </a>
    );
  }
  return <div style={baseStyle}>{inner}</div>;
}

function SocialFollowBtn({ Icon, label, handle, href, accent }: {
  Icon: IconCmp; label: string; handle: string; href: string; accent: string;
}) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
      style={{
        flex: 1, display: "flex", alignItems: "center", gap: 14,
        padding: "14px 18px", borderRadius: 16,
        border: "1px solid var(--border)",
        textDecoration: "none", color: "inherit",
        transition: "transform .15s, border-color .2s",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.borderColor = "var(--border-strong)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "var(--border)"; }}
    >
      <div style={{
        width: 44, height: 44, borderRadius: 14,
        background: `${accent}15`, color: accent,
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>
        <Icon width={20} height={20} />
      </div>
      <div>
        <div style={{ fontSize: 11.5, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</div>
        <div style={{ fontSize: 14, fontWeight: 700, color: "var(--ink)", marginTop: 2 }}>{handle}</div>
      </div>
    </a>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <label style={{ fontSize: 12, fontWeight: 700, color: "var(--ink-2)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{children}</label>;
}

function Field({ label, value, onChange, type = "text", required, placeholder }: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; required?: boolean; placeholder?: string;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)}
        required={required} placeholder={placeholder} style={fieldStyle} />
    </div>
  );
}

const fieldStyle: React.CSSProperties = {
  marginTop: 6, width: "100%", padding: "12px 16px",
  border: "1px solid var(--border)", borderRadius: 12,
  fontSize: 14.5, color: "var(--ink)", background: "white",
  outline: "none", transition: "border-color .15s, box-shadow .15s",
  resize: "vertical",
};
