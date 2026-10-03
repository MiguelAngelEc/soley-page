"use client";

import { useState, useEffect, useId, useRef } from "react";
import type { Product } from "@/data/products";
import { ArrowIcon, CloseIcon, WhatsAppIcon } from "@/components/shared/Icons";
import { WhatsAppModal } from "@/components/shared/WhatsAppModal";
import { useDialogA11y } from "@/lib/a11y";
import Image from "next/image";

interface ProductStageProps {
  /** Productos que se recorren con las flechas (la lista filtrada del catalogo). */
  products: Product[];
  initialIndex: number;
  /** Presentacion que la tarjeta mostraba al abrir (1 L, 4 L o 20 L). */
  initialPresentation: number;
  onClose: () => void;
}

/**
 * Escenario a pantalla completa estilo "seleccion de personaje": el producto
 * en el centro, flechas (o teclado) para pasar al siguiente y las
 * presentaciones como variantes del mismo producto.
 */
export function ProductStage({ products, initialIndex, initialPresentation, onClose }: ProductStageProps) {
  const [index, setIndex] = useState(initialIndex);
  // Se conserva al cambiar de producto: si se veia la caneca, el siguiente
  // producto tambien aparece en caneca.
  const [presentation, setPresentation] = useState(initialPresentation);
  const [quoteOpen, setQuoteOpen] = useState(false);
  const titleId = useId();
  const containerRef = useRef<HTMLDivElement>(null);

  const product = products[index];
  const current = product.presentations[presentation] ?? product.presentations[0];
  const total = products.length;

  useDialogA11y({ isOpen: true, onClose, containerRef });

  const go = (step: number) => setIndex((i) => (i + step + total) % total);

  // Flechas del teclado. Se ignoran mientras el formulario de cotizacion esta
  // abierto para no cambiar de producto al moverse dentro de un campo.
  useEffect(() => {
    if (quoteOpen || total < 2) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowRight") setIndex((i) => (i + 1) % total);
      else if (e.key === "ArrowLeft") setIndex((i) => (i - 1 + total) % total);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [quoteOpen, total]);

  // Bloquea el desplazamiento de la pagina en <html> (como PromoAdModal) para
  // que el hero tambien detecte el bloqueo y pause su animacion.
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const scrollbar = window.innerWidth - html.clientWidth;
    const prev = { overflow: html.style.overflow, paddingRight: body.style.paddingRight };
    html.style.overflow = "hidden";
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;
    return () => {
      html.style.overflow = prev.overflow;
      body.style.paddingRight = prev.paddingRight;
    };
  }, []);

  return (
    <div
      className="stage"
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      style={{ "--accent": product.color } as React.CSSProperties}
    >
      <div className="stage-top">
        <span className="stage-pill">
          <span className="stage-pill-dot" />
          {product.categoryLabel}
        </span>
        <span className="stage-counter" aria-hidden="true">
          {String(index + 1).padStart(2, "0")} <span>/ {String(total).padStart(2, "0")}</span>
        </span>
        <button type="button" className="stage-close" onClick={onClose} aria-label="Cerrar">
          <CloseIcon width={20} height={20} />
        </button>
      </div>

      <div className="stage-arena">
        {total > 1 && (
          <button type="button" className="stage-arrow stage-arrow-prev" onClick={() => go(-1)} aria-label="Producto anterior">
            <ArrowIcon width={22} height={22} />
          </button>
        )}
        <div className="stage-figure">
          <div className="stage-product">
            <Image
              src={current.image}
              alt={`${product.name} - ${current.volume}`}
              fill
              sizes="(max-width: 760px) 80vw, 50vw"
              style={{ objectFit: "contain" }}
            />
          </div>
          <div className="stage-shadow" aria-hidden="true" />
        </div>
        {total > 1 && (
          <button type="button" className="stage-arrow stage-arrow-next" onClick={() => go(1)} aria-label="Producto siguiente">
            <ArrowIcon width={22} height={22} />
          </button>
        )}
      </div>

      {total > 1 && (
        <div className="stage-roster" role="group" aria-label="Elegir producto">
          {products.map((p, i) => (
            <button
              key={p.id}
              type="button"
              className="stage-roster-item"
              onClick={() => setIndex(i)}
              aria-label={p.name}
              aria-current={i === index ? "true" : undefined}
            >
              <Image
                src={(p.presentations[presentation] ?? p.presentations[0]).image}
                alt=""
                width={56}
                height={56}
                style={{ objectFit: "contain" }}
              />
            </button>
          ))}
        </div>
      )}

      <div className="stage-info">
        <div>
          <div className="stage-tagline">{product.tagline}</div>
          <h2 id={titleId} className="stage-name">{product.name}</h2>
        </div>

        <p className="stage-desc">{product.description}</p>

        <div>
          <div className="stage-label">Presentación</div>
          <div className="stage-skins" role="group" aria-label="Presentación">
            {product.presentations.map((p, i) => (
              <button
                key={p.size}
                type="button"
                className="stage-skin"
                onClick={() => setPresentation(i)}
                aria-pressed={i === presentation}
              >
                <span className="stage-skin-volume">{p.volume}</span>
                <span className="stage-skin-type">{p.type === "mayoreo" ? "Al por mayor" : "Al por menor"}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="stage-label">Especificaciones</div>
          <div className="stage-specs">
            {product.specs.map((s) => (
              <div key={s.k} className="stage-spec">
                <div className="stage-spec-k">{s.k}</div>
                <div className="stage-spec-v">{s.v}</div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="stage-label">Ideal para</div>
          <div className="stage-uses">
            {product.uses.map((u) => (
              <span key={u} className="stage-use">{u}</span>
            ))}
          </div>
        </div>

        <div className="stage-cta">
          <button type="button" onClick={() => setQuoteOpen(true)} className="btn btn-red" style={{ flex: 1 }}>
            <WhatsAppIcon width={16} height={16} />Cotizar<span className="stage-cta-size"> {current.size}</span>
          </button>
          <a href="#contacto" onClick={onClose} className="btn btn-outline-white">Formulario</a>
        </div>
      </div>

      <WhatsAppModal
        isOpen={quoteOpen}
        onClose={() => setQuoteOpen(false)}
        selectedProduct={product}
        initialType={current.type === "mayoreo" ? "mayoreo" : "hogar"}
      />

      <style>{`
        .stage {
          position: fixed; inset: 0; z-index: 100;
          display: grid;
          grid-template-columns: minmax(0, 1.3fr) minmax(360px, 1fr);
          grid-template-rows: auto minmax(0, 1fr) auto;
          grid-template-areas: "top top" "arena info" "roster info";
          background: radial-gradient(ellipse at 35% 45%, #163A75 0%, var(--soley-blue-ink) 70%);
          color: white;
          overflow: hidden;
        }
        .stage-top {
          grid-area: top;
          display: flex; align-items: center; gap: 16px;
          padding: 20px 32px;
        }
        .stage-pill {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 6px 14px; border-radius: 999px;
          font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em;
          background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.16);
        }
        .stage-pill-dot { width: 6px; height: 6px; border-radius: 999px; background: var(--accent); }
        .stage-counter {
          margin-left: auto;
          font-size: 15px; font-weight: 800; letter-spacing: 0.06em; font-variant-numeric: tabular-nums;
        }
        .stage-counter span { color: rgba(255,255,255,0.45); }
        .stage-close {
          width: 44px; height: 44px; border-radius: 999px;
          display: inline-flex; align-items: center; justify-content: center;
          background: rgba(255,255,255,0.1); color: white;
          border: 1px solid rgba(255,255,255,0.16);
        }

        .stage-arena {
          grid-area: arena;
          position: relative; min-height: 0;
          display: flex; align-items: center; justify-content: center;
          padding: 0 24px;
        }
        .stage-figure {
          position: relative;
          height: min(100%, 640px); aspect-ratio: 1 / 1; max-width: 100%;
        }
        .stage-product { position: absolute; inset: 0; }
        .stage-shadow {
          position: absolute; bottom: 8%; left: 25%; width: 50%; height: 28px; border-radius: 50%;
          background: radial-gradient(ellipse, rgba(0,0,0,0.45) 0%, transparent 70%);
          filter: blur(6px); z-index: -1;
        }
        .stage-arrow {
          position: absolute; top: 50%; z-index: 2;
          width: 56px; height: 56px; margin-top: -28px; border-radius: 999px;
          display: inline-flex; align-items: center; justify-content: center;
          background: rgba(255,255,255,0.1); color: white;
          border: 1px solid rgba(255,255,255,0.2);
        }
        .stage-arrow-prev { left: 24px; }
        .stage-arrow-prev svg { transform: rotate(180deg); }
        .stage-arrow-next { right: 24px; }

        .stage-roster {
          grid-area: roster;
          display: flex; justify-content: center; gap: 10px;
          padding: 16px 24px 28px;
        }
        .stage-roster-item {
          width: 64px; height: 64px; padding: 4px; border-radius: 16px;
          display: inline-flex; align-items: center; justify-content: center;
          background: rgba(255,255,255,0.06); border: 2px solid rgba(255,255,255,0.12);
        }
        .stage-roster-item[aria-current="true"] { border-color: var(--accent); background: rgba(255,255,255,0.14); }

        .stage-info {
          grid-area: info;
          display: flex; flex-direction: column; gap: 22px;
          padding: 8px 40px 32px;
          overflow-y: auto; min-height: 0;
        }
        .stage-tagline { font-size: 14px; font-weight: 600; color: rgba(255,255,255,0.65); margin-bottom: 6px; }
        .stage-name { font-size: clamp(32px, 3.4vw, 48px); line-height: 1.05; color: white; }
        .stage-desc { font-size: 15.5px; line-height: 1.6; color: rgba(255,255,255,0.78); }
        .stage-label {
          font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em;
          color: rgba(255,255,255,0.5); margin-bottom: 10px;
        }
        .stage-skins { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
        .stage-skin {
          display: flex; flex-direction: column; align-items: flex-start; gap: 2px;
          padding: 12px 14px; border-radius: 14px; text-align: left; color: white;
          background: rgba(255,255,255,0.06); border: 2px solid rgba(255,255,255,0.12);
        }
        .stage-skin[aria-pressed="true"] { border-color: var(--accent); background: rgba(255,255,255,0.14); }
        .stage-skin-volume { font-size: 18px; font-weight: 800; }
        .stage-skin-type { font-size: 11px; font-weight: 600; color: rgba(255,255,255,0.6); }
        .stage-specs { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
        .stage-spec { padding: 10px 12px; border-radius: 12px; background: rgba(255,255,255,0.06); }
        .stage-spec-k {
          font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em;
          color: rgba(255,255,255,0.5);
        }
        .stage-spec-v { font-size: 13.5px; font-weight: 700; margin-top: 2px; }
        .stage-uses { display: flex; flex-wrap: wrap; gap: 6px; }
        .stage-use {
          padding: 6px 12px; border-radius: 999px; font-size: 12.5px; font-weight: 600;
          background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.85);
        }
        .stage-cta { display: flex; gap: 10px; margin-top: auto; padding-top: 4px; }

        /* Tablet y movil: una sola columna que se desplaza; el producto arriba
           y el boton de cotizar fijo abajo. */
        @media (max-width: 980px) {
          .stage {
            display: flex; flex-direction: column;
            overflow-y: auto; overscroll-behavior: contain;
          }
          .stage-top {
            position: sticky; top: 0; z-index: 3;
            padding: 12px 16px;
            background: linear-gradient(var(--soley-blue-ink) 60%, transparent);
          }
          .stage-arena { flex: none; height: 46dvh; min-height: 260px; padding: 0 8px; }
          .stage-figure { height: 100%; }
          .stage-arrow { width: 44px; height: 44px; margin-top: -22px; }
          .stage-arrow-prev { left: 8px; }
          .stage-arrow-next { right: 8px; }
          .stage-roster { padding: 4px 16px 8px; gap: 8px; }
          .stage-roster-item { width: 48px; height: 48px; border-radius: 12px; }
          .stage-info { overflow: visible; padding: 16px 16px 0; gap: 20px; }
          .stage-cta {
            position: sticky; bottom: 0;
            margin: 0 -16px; padding: 12px 16px calc(12px + env(safe-area-inset-bottom));
            background: linear-gradient(transparent, var(--soley-blue-ink) 35%);
          }
        }
        @media (max-width: 420px) {
          .stage-specs { grid-template-columns: 1fr 1fr; }
          .stage-roster-item { width: 44px; height: 44px; }
          /* El boton no cabe con el tamano; el skin elegido ya lo indica. */
          .stage-cta-size { display: none; }
        }
        /* Movil horizontal: poca altura, producto y datos lado a lado. */
        @media (max-height: 500px) and (orientation: landscape) {
          .stage {
            display: grid; overflow: hidden;
            grid-template-columns: 1fr 1fr;
            grid-template-rows: auto minmax(0, 1fr) auto;
            grid-template-areas: "top top" "arena info" "roster info";
          }
          .stage-top { position: static; background: none; padding: 8px 16px; }
          .stage-arena { height: auto; min-height: 0; }
          .stage-roster { padding: 4px 8px 8px; }
          .stage-roster-item { width: 40px; height: 40px; }
          .stage-info { overflow-y: auto; padding: 0 16px; }
        }
      `}</style>
    </div>
  );
}
