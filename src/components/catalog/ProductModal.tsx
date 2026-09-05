"use client";

import { useState, useEffect, useId, useRef } from "react";
import type { Product } from "@/data/products";
import { ProductIllustration } from "./ProductIllustration";
import { CloseIcon, WhatsAppIcon } from "@/components/shared/Icons";
import { WhatsAppModal } from "@/components/shared/WhatsAppModal";
import { useDialogA11y } from "@/lib/a11y";

export function ProductModal({ product, onClose }: { product: Product; onClose: () => void }) {
  const [whatsappModalOpen, setWhatsappModalOpen] = useState(false);
  const titleId = useId();
  const containerRef = useRef<HTMLDivElement>(null);

  useDialogA11y({ isOpen: true, onClose, containerRef });

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="modal-overlay open" onClick={onClose}>
      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className="modal-image-section" style={{
          position: "relative",
          background: "linear-gradient(160deg, #F7FAFD 0%, #E2ECF8 100%)",
          padding: 32, display: "flex", alignItems: "center", justifyContent: "center", minHeight: 420,
        }}>
          <div style={{
            position: "absolute", top: 24, left: 24, width: 140, height: 140,
            backgroundImage: "radial-gradient(var(--soley-blue) 1.5px, transparent 2px)",
            backgroundSize: "12px 12px", opacity: 0.20,
            maskImage: "linear-gradient(135deg, black 30%, transparent 80%)",
            WebkitMaskImage: "linear-gradient(135deg, black 30%, transparent 80%)",
          }} />
          <ProductIllustration product={product} hover={false} />
        </div>

        <div className="modal-content-section" style={{ padding: "32px 36px", display: "flex", flexDirection: "column", gap: 18, overflowY: "auto", maxHeight: "90vh" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <span style={{
              padding: "6px 12px", borderRadius: 999,
              fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em",
              background: "var(--bg-blue-tint)", color: product.color,
            }}>{product.categoryLabel}</span>
            <button onClick={onClose} aria-label="Cerrar"
              style={{
                width: 36, height: 36, borderRadius: 999,
                background: "var(--bg-soft)",
                display: "inline-flex", alignItems: "center", justifyContent: "center",
              }}>
              <CloseIcon width={18} height={18} />
            </button>
          </div>

          <div>
            <div style={{ fontSize: 13, color: "var(--muted)", fontWeight: 600, marginBottom: 4 }}>{product.tagline}</div>
            <h3 id={titleId} style={{ fontSize: 30 }}>{product.name}</h3>
          </div>

          <p style={{ fontSize: 15, lineHeight: 1.6, color: "var(--muted)" }}>{product.description}</p>

          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
              Especificaciones
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
              {product.specs.map((s) => (
                <div key={s.k} style={{ padding: "10px 12px", background: "var(--bg-soft)", borderRadius: 12 }}>
                  <div style={{ fontSize: 10.5, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700 }}>{s.k}</div>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: "var(--ink)", marginTop: 2 }}>{s.v}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
              Presentaciones disponibles
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {product.presentations.map((p) => (
                <div key={p.size} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "10px 14px", borderRadius: 12, border: "1px solid var(--border)",
                }}>
                  <span style={{ fontWeight: 700, fontSize: 14 }}>{p.size}</span>
                  <span style={{
                    fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em",
                    color: p.type === "mayoreo" ? "var(--soley-red)" : "var(--soley-blue)",
                    padding: "4px 10px", borderRadius: 999,
                    background: p.type === "mayoreo" ? "rgba(225,29,46,0.08)" : "var(--bg-blue-tint)",
                  }}>{p.type}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
              Ideal para
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {product.uses.map((u) => (
                <span key={u} style={{
                  padding: "6px 12px", background: "var(--bg-soft)", borderRadius: 999,
                  fontSize: 12.5, color: "var(--ink-2)", fontWeight: 600,
                }}>{u}</span>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: "auto", paddingTop: 8 }}>
            <button
              onClick={() => setWhatsappModalOpen(true)}
              className="btn btn-red"
              style={{ flex: 1 }}
            >
              <WhatsAppIcon width={16} height={16} />Cotizar
            </button>
            <a href="#contacto" onClick={onClose} className="btn btn-ghost">Formulario</a>
          </div>
        </div>
      </div>

      <WhatsAppModal
        isOpen={whatsappModalOpen}
        onClose={() => setWhatsappModalOpen(false)}
        selectedProduct={product}
      />

      <style jsx>{`
        @media (max-width: 760px) {
          .modal-image-section {
            min-height: 200px !important;
            max-height: 200px !important;
            padding: 16px !important;
          }
          .modal-content-section {
            padding: 20px !important;
            max-height: calc(95vh - 200px) !important;
            overflow-y: auto !important;
          }
        }
      `}</style>
    </div>
  );
}
