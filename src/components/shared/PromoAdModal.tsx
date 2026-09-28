"use client";

import { useState, useId, useRef } from "react";
import { promo } from "@/data/promo";
import { products } from "@/data/products";
import { WhatsAppModal } from "@/components/shared/WhatsAppModal";
import { CloseIcon, WhatsAppIcon } from "@/components/shared/Icons";
import { useDialogA11y, useReducedMotionPreference } from "@/lib/a11y";

/**
 * Anuncio de la promocion del mes: se abre al cargar la pagina con el video
 * generado en HyperFrames. Se configura (o se apaga) desde src/data/promo.ts.
 */
export function PromoAdModal() {
  const [open, setOpen] = useState(true);
  const [whatsappOpen, setWhatsappOpen] = useState(false);
  const reducedMotion = useReducedMotionPreference();
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);

  useDialogA11y({ isOpen: open, onClose: () => setOpen(false), containerRef: dialogRef });

  const product = products.find((p) => p.id === promo.productId);
  if (!promo.active || !promo.ad || !product) return null;
  const { video, poster } = promo.ad;

  return (
    <>
      {open && (
        <div className="modal-overlay open ad-overlay" onClick={() => setOpen(false)}>
          <div
            ref={dialogRef}
            className="ad-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            onClick={(e) => e.stopPropagation()}
          >
            <button type="button" className="ad-close" onClick={() => setOpen(false)} aria-label="Cerrar anuncio">
              <CloseIcon width={16} height={16} />
            </button>

            <h2 id={titleId} className="sr-only">
              {promo.eyebrow}: {product.name} {promo.presentation} a ${promo.price}
            </h2>

            {/* Con movimiento reducido no se reproduce solo: queda el poster y controles. */}
            <video
              className="ad-video"
              src={video}
              poster={poster}
              autoPlay={!reducedMotion}
              muted
              loop
              playsInline
              controls={reducedMotion}
              preload="auto"
              aria-hidden="true"
            />

            <div className="ad-actions">
              <button
                type="button"
                className="btn btn-blue ad-cta"
                onClick={() => {
                  setOpen(false);
                  setWhatsappOpen(true);
                }}
              >
                <WhatsAppIcon width={18} height={18} />
                Pide el tuyo hoy
              </button>
              <button type="button" className="ad-skip" onClick={() => setOpen(false)}>
                Ver la página
              </button>
            </div>
          </div>
        </div>
      )}

      <WhatsAppModal isOpen={whatsappOpen} onClose={() => setWhatsappOpen(false)} selectedProduct={product} />

      <style jsx>{`
        .ad-overlay {
          z-index: 200;
        }
        .ad-card {
          position: relative;
          display: flex;
          flex-direction: column;
          width: min(560px, 100%, calc((100dvh - 170px) * 0.8));
          border-radius: 24px;
          overflow: hidden;
          background: white;
          box-shadow: var(--shadow-lg);
          animation: ad-in 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        @keyframes ad-in {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .ad-video {
          display: block;
          width: 100%;
          aspect-ratio: 4 / 5;
          object-fit: cover;
          background: #f4f8fd;
        }
        .ad-close {
          position: absolute;
          top: 12px;
          right: 12px;
          z-index: 1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border: none;
          border-radius: 999px;
          background: rgba(10, 38, 85, 0.72);
          color: white;
          cursor: pointer;
        }
        .ad-close:focus-visible,
        .ad-skip:focus-visible {
          outline: 3px solid var(--soley-blue);
          outline-offset: 2px;
        }
        .ad-actions {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          gap: 6px;
          padding: 14px 16px 12px;
        }
        .ad-cta {
          justify-content: center;
        }
        .ad-skip {
          min-height: 40px;
          border: none;
          background: none;
          color: var(--muted);
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
        }
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          overflow: hidden;
          clip: rect(0 0 0 0);
          white-space: nowrap;
        }
      `}</style>
    </>
  );
}
