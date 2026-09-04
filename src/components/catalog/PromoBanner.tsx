"use client";

import { useState } from "react";
import Image from "next/image";
import { promo } from "@/data/promo";
import { products } from "@/data/products";
import { WhatsAppModal } from "@/components/shared/WhatsAppModal";
import { CloseIcon, WhatsAppIcon, CheckIcon } from "@/components/shared/Icons";

export function PromoBanner() {
  const [detailOpen, setDetailOpen] = useState(false);
  const [whatsappOpen, setWhatsappOpen] = useState(false);

  if (!promo.active) return null;

  const product = products.find((p) => p.id === promo.productId);
  if (!product) return null;

  const image =
    product.presentations.find((p) => p.presentationSize === "caneca")?.image ??
    product.presentations[0].image;

  return (
    <>
      <div className="promo-banner reveal" onClick={() => setDetailOpen(true)}>
        <div className="promo-media">
          <div className="promo-seal">
            <span className="promo-seal-value">{promo.discount}</span>
            <span className="promo-seal-label">Dscto</span>
          </div>
          <Image
            src={image}
            alt={`${product.name} — ${promo.presentation}`}
            width={232}
            height={232}
            style={{ objectFit: "contain", width: 232, height: "auto" }}
          />
        </div>

        <div className="promo-body">
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 22, height: 2, borderRadius: 2, background: "var(--soley-red)" }} />
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--soley-red)" }}>
              {promo.eyebrow}
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <div className="promo-headline">{promo.headline}</div>
            <p className="promo-desc">{promo.description}</p>
          </div>

          <div className="promo-cta-row">
            <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "var(--muted)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                Este mes
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 2 }}>
                <span style={{ fontSize: 19, fontWeight: 700, color: "var(--soley-blue-deep)", alignSelf: "flex-start", marginTop: 5 }}>$</span>
                <span className="promo-price">{promo.price}</span>
              </div>
            </div>

            <button
              className="btn btn-blue"
              onClick={(e) => {
                e.stopPropagation();
                setWhatsappOpen(true);
              }}
              style={{ marginBottom: 5 }}
            >
              <WhatsAppIcon width={17} height={17} />
              Pide el tuyo hoy
            </button>
          </div>
        </div>
      </div>

      {detailOpen && (
        <div className="modal-overlay open" onClick={() => setDetailOpen(false)}>
          <div className="promo-modal" onClick={(e) => e.stopPropagation()}>
            <div className="promo-modal-head">
              <button onClick={() => setDetailOpen(false)} className="promo-modal-close" aria-label="Cerrar">
                <CloseIcon width={15} height={15} />
              </button>

              <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, textAlign: "center" }}>
                <span className="promo-modal-tag">{promo.eyebrow}</span>
                <div className="promo-modal-headline">{promo.headline}</div>
                <div style={{ fontSize: 14.5, fontWeight: 600, color: "rgba(255,255,255,0.82)" }}>
                  {product.tagline}
                </div>
                <Image
                  src={image}
                  alt={`${product.name} — ${promo.presentation}`}
                  width={200}
                  height={200}
                  style={{
                    objectFit: "contain", width: 200, height: "auto", marginTop: 10,
                    filter: "drop-shadow(0 18px 28px rgba(10,38,85,0.45))",
                  }}
                />
              </div>
            </div>

            <div className="promo-modal-body">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 22 }}>
                <div className="promo-seal promo-seal-lg">
                  <span className="promo-seal-value">{promo.discount}</span>
                  <span className="promo-seal-label">Dscto</span>
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 3 }}>
                  <span style={{ fontSize: 22, fontWeight: 700, color: "var(--soley-blue-deep)", alignSelf: "flex-start", marginTop: 6 }}>$</span>
                  <span className="promo-modal-price">{promo.price}</span>
                </div>
              </div>

              <div style={{ textAlign: "center", fontSize: 14, fontWeight: 600 }}>
                {product.name} · {promo.presentation}
              </div>

              <div className="promo-benefits">
                {promo.benefits.map((b) => (
                  <div key={b} style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 13, fontWeight: 500, color: "var(--ink-2)" }}>
                    <CheckIcon width={15} height={15} style={{ color: "#16A34A", flexShrink: 0 }} />
                    {b}
                  </div>
                ))}
              </div>

              <button
                className="promo-modal-cta"
                onClick={() => {
                  setDetailOpen(false);
                  setWhatsappOpen(true);
                }}
              >
                <WhatsAppIcon width={18} height={18} />
                Pide el tuyo hoy
              </button>

              <div style={{ textAlign: "center", fontSize: 11.5, fontWeight: 500, color: "var(--muted-2)" }}>
                Se abre WhatsApp con tu pedido listo para enviar
              </div>
            </div>
          </div>
        </div>
      )}

      <WhatsAppModal
        isOpen={whatsappOpen}
        onClose={() => setWhatsappOpen(false)}
        selectedProduct={product}
      />

      <style jsx>{`
        .promo-banner {
          display: grid;
          grid-template-columns: 340px minmax(0, 1fr);
          margin-top: 32px;
          border-radius: 24px;
          overflow: hidden;
          border: 1px solid var(--border);
          background: white;
          box-shadow: var(--shadow-md);
          cursor: pointer;
          transition: transform .25s ease, box-shadow .25s ease, border-color .2s;
        }

        .promo-banner:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
          border-color: var(--border-strong);
        }

        .promo-media {
          position: relative;
          background: linear-gradient(160deg, var(--bg-blue-tint) 0%, #D6E6FA 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 30px;
        }

        .promo-seal {
          position: absolute;
          top: 22px;
          left: 22px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 74px;
          height: 74px;
          border-radius: 999px;
          background: var(--soley-red);
          color: white;
          box-shadow: var(--shadow-red);
          z-index: 2;
        }

        .promo-seal-value { font-size: 23px; font-weight: 800; letter-spacing: -0.03em; line-height: 1; }
        .promo-seal-label { font-size: 8.5px; font-weight: 700; letter-spacing: 0.09em; text-transform: uppercase; margin-top: 1px; }

        .promo-body {
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 14px;
          padding: 34px 38px;
        }

        .promo-headline {
          font-size: 33px;
          font-weight: 800;
          letter-spacing: -0.03em;
          line-height: 1.1;
          text-wrap: balance;
        }

        .promo-desc {
          font-size: 14.5px;
          font-weight: 500;
          color: var(--muted);
          line-height: 1.5;
          max-width: 560px;
          margin: 0;
        }

        /* Precio a la izquierda y boton al borde derecho, igual que el banner
           del catalogo PDF que va justo debajo. */
        .promo-cta-row {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 26px;
          margin-top: 4px;
          flex-wrap: wrap;
        }

        .promo-price {
          font-size: 42px;
          font-weight: 800;
          color: var(--soley-blue-deep);
          letter-spacing: -0.035em;
          line-height: 1;
        }

        .promo-modal {
          position: relative;
          width: 90%;
          max-width: 480px;
          max-height: 90vh;
          overflow-y: auto;
          border-radius: 24px;
          background: white;
          box-shadow: 0 25px 60px rgba(0,0,0,0.35);
        }

        .promo-modal-head {
          position: relative;
          background: linear-gradient(150deg, var(--soley-blue-ink) 0%, var(--soley-blue) 60%, var(--soley-blue-bright) 100%);
          padding: 28px 28px 0 28px;
          overflow: hidden;
        }

        .promo-modal-head::before {
          content: "";
          position: absolute;
          top: -120px;
          left: 50%;
          width: 420px;
          height: 420px;
          margin-left: -210px;
          border-radius: 999px;
          background: radial-gradient(circle, rgba(255,255,255,0.24) 0%, rgba(255,255,255,0) 68%);
          pointer-events: none;
        }

        .promo-modal-close {
          position: absolute;
          top: 16px;
          right: 16px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 34px;
          height: 34px;
          border-radius: 999px;
          background: rgba(255,255,255,0.2);
          color: white;
          z-index: 2;
          transition: background .2s;
        }

        .promo-modal-close:hover { background: rgba(255,255,255,0.3); }

        .promo-modal-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 13px;
          border-radius: 999px;
          background: var(--soley-red);
          color: white;
          font-size: 10.5px;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .promo-modal-headline {
          font-size: 33px;
          font-weight: 800;
          color: white;
          letter-spacing: -0.03em;
          line-height: 1.08;
          margin-top: 8px;
        }

        .promo-modal-body {
          padding: 24px 28px 28px 28px;
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .promo-seal-lg { position: static; width: 66px; height: 66px; }
        .promo-seal-lg .promo-seal-value { font-size: 21px; }
        .promo-seal-lg .promo-seal-label { font-size: 8px; }

        .promo-modal-price {
          font-size: 54px;
          font-weight: 800;
          color: var(--soley-blue-deep);
          letter-spacing: -0.04em;
          line-height: 1;
        }

        .promo-benefits {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: 14px 16px;
          border-radius: 12px;
          background: var(--bg-soft);
          border: 1px solid var(--border);
        }

        .promo-modal-cta {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          width: 100%;
          padding: 15px 20px;
          border-radius: 12px;
          background: #25D366;
          color: white;
          font-size: 15px;
          font-weight: 700;
          box-shadow: 0 12px 26px rgba(37,211,102,0.3);
          transition: background .2s, transform .2s;
        }

        .promo-modal-cta:hover { background: #128C7E; transform: translateY(-2px); }

        @media (max-width: 860px) {
          .promo-banner { grid-template-columns: 1fr; }
          .promo-media { padding: 28px 24px 20px; }
          .promo-body { padding: 26px 24px 28px; }
          .promo-headline { font-size: 27px; }
        }

        @media (max-width: 480px) {
          .promo-seal { width: 62px; height: 62px; top: 16px; left: 16px; }
          .promo-seal-value { font-size: 19px; }
          .promo-headline { font-size: 24px; }
          .promo-price { font-size: 36px; }
          .promo-modal-headline { font-size: 27px; }
          .promo-modal-price { font-size: 44px; }
          .promo-cta-row { gap: 18px; }
        }
      `}</style>
    </>
  );
}
