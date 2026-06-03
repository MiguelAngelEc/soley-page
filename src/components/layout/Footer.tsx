"use client";

import Image from "next/image";
import { WhatsAppIcon, FbIcon, IgIcon, PinIcon, PhoneIcon, MailIcon } from "@/components/shared/Icons";

const productLinks: [string, string][] = [
  ["Detergente Líquido", "#productos"],
  ["Cloro al 5%", "#productos"],
  ["Desinfectante Multiusos", "#productos"],
  ["Jabón Líquido", "#productos"],
  ["Alcohol Antiséptico", "#productos"],
  ["Gel Antibacterial", "#productos"],
];

const companyLinks: [string, string][] = [
  ["Por qué Soley", "#por-que"],
  ["Para empresas", "#empresas"],
  ["Cotización al por mayor", "#contacto"],
  ["Etiqueta privada", "#contacto"],
  ["Preguntas frecuentes", "#"],
];

export function Footer() {
  return (
    <footer style={{
      background: "var(--soley-blue-ink)", color: "white",
      position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: -80, left: -60, width: 320, height: 320,
        backgroundImage: "radial-gradient(white 1.5px, transparent 2px)",
        backgroundSize: "16px 16px", opacity: 0.06,
      }} />

      <div className="container-x" style={{ padding: "72px 24px 32px", position: "relative" }}>
        <div className="footer-grid">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <Image src="/LogoSF.png" alt="Soley" width={56} height={56} style={{ borderRadius: 10, background: "white", padding: 4 }} />
              <div>
                <div style={{ fontWeight: 800, fontSize: 22, letterSpacing: "-0.02em" }}>SOLEY</div>
                <div style={{ fontSize: 10.5, fontWeight: 700, color: "#FFA8B0", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                  Amenities & Limpieza
                </div>
              </div>
            </div>
            <p style={{ fontSize: 14.5, color: "rgba(255,255,255,0.65)", lineHeight: 1.65, maxWidth: 340 }}>
              Fabricantes de productos de limpieza de alta calidad en Ibarra, Ecuador. Servicio al por mayor y al por menor con registro sanitario ARCSA.
            </p>

            <div style={{ display: "flex", gap: 8, marginTop: 24 }}>
              <SocialBtn href="https://facebook.com/soleyjaboneria" Icon={FbIcon} />
              <SocialBtn href="https://instagram.com/soleyjaboneria" Icon={IgIcon} />
              <SocialBtn href="https://wa.me/593961264102" Icon={WhatsAppIcon} />
            </div>
          </div>

          <div>
            <FooterTitle>Productos</FooterTitle>
            <FooterList items={productLinks} />
          </div>

          <div>
            <FooterTitle>Empresa</FooterTitle>
            <FooterList items={companyLinks} />
          </div>

          <div>
            <FooterTitle>Contacto</FooterTitle>
            <div style={{ display: "flex", flexDirection: "column", gap: 14, fontSize: 14, color: "rgba(255,255,255,0.78)" }}>
              <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <PinIcon width={16} height={16} style={{ color: "#8FB5E8", flexShrink: 0, marginTop: 2 }} />
                <span>Luis Jaramillo Pérez 4-54 y José Tobar Tobar, Ibarra, Ecuador</span>
              </div>
              <a href="https://wa.me/593961264102" style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <PhoneIcon width={16} height={16} style={{ color: "#8FB5E8", flexShrink: 0 }} />
                <span>+593 96 126 4102</span>
              </a>
              <a href="mailto:soleyjaboneria@gmail.com" style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <MailIcon width={16} height={16} style={{ color: "#8FB5E8", flexShrink: 0 }} />
                <span>soleyjaboneria@gmail.com</span>
              </a>
            </div>

            <div style={{
              marginTop: 24, padding: "14px 16px",
              background: "rgba(255,255,255,0.06)", borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.08)",
            }}>
              <div style={{ fontSize: 11.5, fontWeight: 700, color: "#FFA8B0", textTransform: "uppercase", letterSpacing: "0.06em" }}>Horario</div>
              <div style={{ fontSize: 13.5, marginTop: 4 }}>Lun – Sáb · 8:00 – 18:00</div>
            </div>
          </div>
        </div>

        <div style={{
          borderTop: "1px solid rgba(255,255,255,0.10)",
          marginTop: 56, paddingTop: 24,
          display: "flex", justifyContent: "space-between", alignItems: "center",
          gap: 16, flexWrap: "wrap",
        }}>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.55)" }}>
            © {new Date().getFullYear()} Soley · Amenities & Productos de Limpieza. Hecho en Ibarra, Ecuador.
          </p>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.55)" }}>Registro sanitario ARCSA</p>
        </div>
      </div>

      <style>{`
        .footer-grid { display: grid; grid-template-columns: 1.4fr 1fr 1fr 1.3fr; gap: 56px; }
        @media (max-width: 980px) { .footer-grid { grid-template-columns: 1fr 1fr; gap: 40px; } }
        @media (max-width: 560px) { .footer-grid { grid-template-columns: 1fr; } }
      `}</style>
    </footer>
  );
}

function FooterTitle({ children }: { children: React.ReactNode }) {
  return (
    <h4 style={{
      fontSize: 13, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em",
      color: "white", marginBottom: 18,
    }}>{children}</h4>
  );
}

function FooterList({ items }: { items: [string, string][] }) {
  return (
    <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 11 }}>
      {items.map(([label, href]) => (
        <li key={label}>
          <a href={href} style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", transition: "color .15s" }}>
            {label}
          </a>
        </li>
      ))}
    </ul>
  );
}

function SocialBtn({ href, Icon }: { href: string; Icon: React.ComponentType<React.SVGProps<SVGSVGElement>> }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" style={{
      width: 40, height: 40, borderRadius: 12,
      background: "rgba(255,255,255,0.08)",
      border: "1px solid rgba(255,255,255,0.10)",
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      color: "white", transition: "background .15s",
    }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.18)")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
    >
      <Icon width={18} height={18} />
    </a>
  );
}
