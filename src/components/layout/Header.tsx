"use client";

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { WhatsAppIcon, MenuIcon, CloseIcon, DocumentIcon } from "@/components/shared/Icons";

interface NavItem { name: string; href: string }

const nav: NavItem[] = [
  { name: "Inicio", href: "#inicio" },
  { name: "Productos", href: "#productos" },
  { name: "Por qué Soley", href: "#por-que" },
  { name: "Empresas", href: "#empresas" },
  { name: "Contacto", href: "#contacto" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "white",
        borderBottom: "1px solid var(--border)",
        boxShadow: scrolled ? "0 2px 8px rgba(0,0,0,0.08)" : "0 1px 3px rgba(0,0,0,0.04)",
        transition: "box-shadow .2s ease",
      }}
    >
      <div className="container-x" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 76 }}>
        <a href="#inicio" style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Image src="/LogoSF.png" alt="Soley" width={100} height={100} style={{ borderRadius: 8 }} />
        </a>

        <nav className="desktop-nav" style={{ display: "flex", alignItems: "center", gap: 36 }}>
          {nav.map((n) => (
            <a key={n.name} href={n.href}
              style={{ fontSize: 14.5, fontWeight: 600, color: "var(--ink-2)", transition: "color .15s" }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "var(--soley-blue)")}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "var(--ink-2)")}
            >{n.name}</a>
          ))}
        </nav>

        <div className="desktop-cta" style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <a href="/Catalogo/CatálogoSOLEY.pdf" target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-blue">
            <DocumentIcon width={16} height={16} />
            Catálogo
          </a>
          <a href="#contacto" className="btn btn-sm btn-ghost">Cotizar</a>
          <a href="https://wa.me/593961264102" target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-red">
            <WhatsAppIcon width={16} height={16} />
            Comprar
          </a>
        </div>

        <button className="mobile-only" onClick={() => setMobileOpen(true)}
          style={{ width: 42, height: 42, borderRadius: 12, border: "1px solid var(--border)", display: "none" }}
          aria-label="Abrir menú"
        >
          <MenuIcon width={22} height={22} />
        </button>
      </div>

      {mobileOpen && (
        <div style={{ position: "fixed", inset: 0, background: "white", zIndex: 60, padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
            <Image src="/LogoSF.png" alt="Soley" width={48} height={48} />
            <button onClick={() => setMobileOpen(false)} style={{ width: 44, height: 44 }} aria-label="Cerrar menú">
              <CloseIcon width={22} height={22} />
            </button>
          </div>
          <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {nav.map((n) => (
              <a key={n.name} href={n.href} onClick={() => setMobileOpen(false)}
                style={{ padding: "16px 0", borderBottom: "1px solid var(--border)", fontSize: 18, fontWeight: 600 }}>
                {n.name}
              </a>
            ))}
          </nav>
          <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 12 }}>
            <a href="/Catalogo/CatálogoSOLEY.pdf" target="_blank" rel="noopener noreferrer" className="btn btn-outline-blue">
              <DocumentIcon width={18} height={18} />
              Descargar catálogo PDF
            </a>
            <a href="#contacto" className="btn btn-blue" onClick={() => setMobileOpen(false)}>Solicitar cotización</a>
            <a href="https://wa.me/593961264102" className="btn btn-red"><WhatsAppIcon width={18} height={18} />WhatsApp</a>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 880px) {
          .desktop-nav, .desktop-cta { display: none !important; }
          .mobile-only { display: inline-flex !important; align-items: center; justify-content: center; }
        }
      `}</style>
    </header>
  );
}
