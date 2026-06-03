"use client";

import { useState, useEffect } from "react";
import { WhatsAppIcon, CloseIcon, ArrowIcon } from "@/components/shared/Icons";

const options = [
  "Quiero cotizar al por mayor",
  "Necesito producto para mi hogar",
  "Personalizar etiqueta (marca blanca)",
];

export function WhatsAppFloat() {
  const [open, setOpen] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 1500);
    return () => clearTimeout(t);
  }, []);

  if (!show) return null;

  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 90 }}>
      {open && (
        <div style={{
          position: "absolute", bottom: 80, right: 0, width: 320,
          background: "white", borderRadius: 18,
          boxShadow: "0 20px 60px rgba(11,23,54,0.20)",
          overflow: "hidden", animation: "popIn .25s ease",
        }}>
          <div style={{
            background: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)",
            padding: 20, color: "white", display: "flex", gap: 12, alignItems: "center",
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 999,
              background: "white", color: "#25D366",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <WhatsAppIcon width={22} height={22} />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700 }}>Soley · Atención</div>
              <div style={{ fontSize: 12, opacity: 0.85, display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
                <span style={{ width: 6, height: 6, borderRadius: 999, background: "#A7F3D0" }} />
                Respondemos en ~1 hora
              </div>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Cerrar"
              style={{
                marginLeft: "auto", width: 28, height: 28, borderRadius: 999,
                background: "rgba(255,255,255,0.2)", color: "white",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
              <CloseIcon width={14} height={14} />
            </button>
          </div>
          <div style={{ padding: "18px 20px" }}>
            <div style={{
              padding: "12px 14px",
              background: "var(--bg-soft)",
              borderRadius: "0 14px 14px 14px",
              fontSize: 14, color: "var(--ink-2)", marginBottom: 14,
            }}>
              ¡Hola! 👋 Cuéntanos qué producto te interesa y te enviamos precio y disponibilidad.
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {options.map((opt) => (
                <a key={opt} href={`https://wa.me/593961264102?text=${encodeURIComponent(opt)}`}
                  target="_blank" rel="noopener noreferrer"
                  style={{
                    padding: "10px 14px", borderRadius: 12,
                    border: "1px solid var(--border)",
                    fontSize: 13.5, fontWeight: 600, color: "var(--ink-2)",
                    transition: "all .15s",
                    display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8,
                  }}>
                  {opt}
                  <ArrowIcon width={14} height={14} style={{ color: "#25D366" }} />
                </a>
              ))}
            </div>
            <a href="https://wa.me/593961264102" target="_blank" rel="noopener noreferrer"
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                marginTop: 14, padding: 12,
                background: "#25D366", color: "white", borderRadius: 999,
                fontSize: 14, fontWeight: 700,
              }}>
              <WhatsAppIcon width={16} height={16} />Abrir WhatsApp
            </a>
          </div>
        </div>
      )}

      <button onClick={() => setOpen((o) => !o)} aria-label="WhatsApp" style={{
        width: 64, height: 64, borderRadius: 999,
        background: "#25D366", color: "white",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 14px 30px rgba(37,211,102,0.40)", position: "relative",
        animation: open ? "none" : "pulse 2.5s ease infinite",
      }}>
        <WhatsAppIcon width={30} height={30} />
        {!open && (
          <span style={{
            position: "absolute", top: -4, right: -4,
            background: "var(--soley-red)", color: "white",
            fontSize: 11, fontWeight: 800,
            width: 22, height: 22, borderRadius: 999,
            display: "flex", alignItems: "center", justifyContent: "center",
            border: "2px solid white",
          }}>1</span>
        )}
      </button>

      <style>{`
        @keyframes pulse {
          0%, 100% { box-shadow: 0 14px 30px rgba(37,211,102,0.40), 0 0 0 0 rgba(37,211,102,0.4); }
          50% { box-shadow: 0 14px 30px rgba(37,211,102,0.40), 0 0 0 16px rgba(37,211,102,0); }
        }
        @keyframes popIn {
          from { opacity: 0; transform: translateY(10px) scale(.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
