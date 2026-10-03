"use client";

import { useState, useEffect, useId, useRef } from "react";
import { isLightColor } from "@/data/products";
import type { Product } from "@/data/products";
import { ArrowIcon, CloseIcon, WhatsAppIcon } from "@/components/shared/Icons";
import { WhatsAppModal } from "@/components/shared/WhatsAppModal";
import { useDialogA11y } from "@/lib/a11y";
import { preload } from "react-dom";
import Image, { getImageProps } from "next/image";

const STAGE_IMAGE_SIZES = "(max-width: 980px) 80vw, 50vw";

/**
 * Pide de antemano la imagen grande de una presentacion, con el mismo srcset
 * que usara el escenario, para que ya este lista al abrirlo.
 */
export function preloadStageImage(src: string) {
  const { props } = getImageProps({ src, alt: "", fill: true, sizes: STAGE_IMAGE_SIZES });
  preload(props.src, { as: "image", imageSrcSet: props.srcSet, imageSizes: props.sizes });
}

interface ProductStageProps {
  product: Product;
  /** Presentacion que la tarjeta mostraba al abrir (1 L, 4 L o 20 L). */
  initialPresentation: number;
  /** Se abre con la imagen de la tarjeta volando hasta aqui: sin subida inicial. */
  morph: boolean;
  onClose: () => void;
}

interface StageView {
  /** Presentacion visible. */
  index: number;
  /** Presentacion que esta saliendo (-1 al abrir). */
  prev: number;
  /** Cambia en cada salto para reiniciar las animaciones de entrada y salida. */
  swap: number;
}

function move(view: StageView, index: number): StageView {
  if (index === view.index) return view;
  return { index, prev: view.index, swap: view.swap + 1 };
}

/**
 * Escenario estilo "seleccion de personaje" sobre la pagina oscurecida: el
 * producto flota a un lado y sus presentaciones (1 L, 4 L, 20 L) se recorren
 * con flechas o teclado, como variantes del mismo personaje.
 */
export function ProductStage({ product, initialPresentation, morph, onClose }: ProductStageProps) {
  const [view, setView] = useState<StageView>({ index: initialPresentation, prev: -1, swap: 0 });
  const [quoteOpen, setQuoteOpen] = useState(false);
  const titleId = useId();
  const containerRef = useRef<HTMLDivElement>(null);

  const presentations = product.presentations;
  const total = presentations.length;
  const presentation = view.index;
  const current = presentations[presentation];

  useDialogA11y({ isOpen: true, onClose, containerRef });

  const go = (step: number) => setView((v) => move(v, (v.index + step + total) % total));

  // Deslizar con el dedo sobre el producto cambia de presentacion. El
  // navegador conserva el scroll vertical (touch-action: pan-y) y cancela el
  // gesto si empieza a desplazar la pagina.
  const swipeRef = useRef<{ x: number; y: number; t: number } | null>(null);

  function onArenaPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType === "mouse") return;
    swipeRef.current = { x: e.clientX, y: e.clientY, t: e.timeStamp };
  }

  function onArenaPointerUp(e: React.PointerEvent<HTMLDivElement>) {
    const start = swipeRef.current;
    swipeRef.current = null;
    if (!start) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    const speed = Math.abs(dx) / Math.max(1, e.timeStamp - start.t);
    // Horizontal y suficiente: 40px, o 20px si fue un gesto rapido.
    const horizontal = Math.abs(dx) > Math.abs(dy) * 1.2;
    if (horizontal && (Math.abs(dx) > 40 || (Math.abs(dx) > 20 && speed > 0.3))) go(dx < 0 ? 1 : -1);
  }

  // Flechas del teclado. Se ignoran mientras el formulario de cotizacion esta
  // abierto para no cambiar de presentacion al moverse dentro de un campo.
  useEffect(() => {
    if (quoteOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowRight") setView((v) => move(v, (v.index + 1) % total));
      else if (e.key === "ArrowLeft") setView((v) => move(v, (v.index - 1 + total) % total));
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
      style={{
        "--accent": product.color,
        // Texto sobre el color del producto: oscuro si el color es claro (Gel).
        "--accent-ink": isLightColor(product.color) ? "var(--ink)" : "white",
      } as React.CSSProperties}
    >
      <div className="stage-top">
        <span className="stage-pill">
          <span className="stage-pill-dot" />
          {product.categoryLabel}
        </span>
        <span className="stage-counter" aria-hidden="true">
          {String(presentation + 1).padStart(2, "0")} <span>/ {String(total).padStart(2, "0")}</span>
        </span>
        <button type="button" className="stage-close" onClick={onClose} aria-label="Cerrar">
          <CloseIcon width={20} height={20} />
        </button>
      </div>

      <div
        className="stage-arena"
        onPointerDown={onArenaPointerDown}
        onPointerUp={onArenaPointerUp}
        onPointerCancel={() => { swipeRef.current = null; }}
      >
        <button type="button" className="stage-arrow stage-arrow-prev" onClick={() => go(-1)} aria-label="Presentación anterior">
          <ArrowIcon width={22} height={22} />
        </button>
        <div className="stage-figure">
          <div className="stage-glow" aria-hidden="true" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="stage-logo" src="/efectos/logo-blanco.webp" alt="" aria-hidden="true" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="stage-pedestal" src="/efectos/pedestal.webp" alt="" aria-hidden="true" />
          <div className="stage-shadow" aria-hidden="true" />
          {/* Destello del pedestal en cada cambio (se vuelve a montar con swap). */}
          {view.swap > 0 && <div key={view.swap} className="stage-flash" aria-hidden="true" />}
          {/* Las 3 presentaciones quedan montadas (y precargadas): la anterior
              se hunde en el pedestal, la actual emerge de el y el resto espera
              oculta, asi el cambio no parpadea esperando la imagen. */}
          <div className="stage-product">
            {presentations.map((p, i) => {
              const state = i === view.index ? "in" : i === view.prev ? "out" : "idle";
              return (
                <div
                  key={state === "idle" ? p.size : `${p.size}-${view.swap}`}
                  className="stage-layer"
                  data-state={state}
                  data-morph={morph && view.swap === 0 ? "" : undefined}
                  aria-hidden={state !== "in"}
                  style={state === "in" ? { viewTransitionName: "stage-product" } : undefined}
                >
                  <Image
                    src={p.image}
                    alt={state === "in" ? `${product.name} - ${p.volume}` : ""}
                    fill
                    sizes={STAGE_IMAGE_SIZES}
                    loading="eager"
                    style={{ objectFit: "contain" }}
                  />
                </div>
              );
            })}
          </div>
        </div>
        <button type="button" className="stage-arrow stage-arrow-next" onClick={() => go(1)} aria-label="Presentación siguiente">
          <ArrowIcon width={22} height={22} />
        </button>
      </div>

      {/* Anuncia cada cambio de presentacion a los lectores de pantalla (el
          contador visible queda oculto para no leerlo dos veces). */}
      <div className="sr-only" aria-live="polite">
        {view.swap > 0 && `${current.size}, ${presentation + 1} de ${total}`}
      </div>

      <div className="stage-roster" role="group" aria-label="Presentación">
        {presentations.map((p, i) => (
          <button
            key={p.size}
            type="button"
            className="stage-roster-item"
            onClick={() => setView((v) => move(v, i))}
            aria-label={p.size}
            aria-pressed={i === presentation}
          >
            <span className="stage-roster-thumb">
              <Image src={p.image} alt="" width={56} height={56} style={{ objectFit: "contain" }} />
            </span>
            <span className="stage-roster-volume">{p.volume}</span>
          </button>
        ))}
      </div>

      <div className="stage-info">
        <div>
          <div className="stage-tagline">{product.tagline}</div>
          <h2 id={titleId} className="stage-name">{product.name}</h2>
          <div className="stage-current" key={presentation}>
            {current.size}
            <span>{current.type === "mayoreo" ? "Al por mayor" : "Al por menor"}</span>
          </div>
        </div>

        <p className="stage-desc">{product.description}</p>

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
            <WhatsAppIcon width={16} height={16} />
            <span>Cotizar<span className="stage-cta-size"> {current.size}</span></span>
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
        /* Sin panel propio: la pagina queda visible detras, oscurecida y
           desenfocada, y el escenario flota encima. */
        .stage {
          position: fixed; inset: 0; z-index: 100;
          display: grid;
          grid-template-columns: minmax(0, 1.2fr) minmax(360px, 1fr);
          grid-template-rows: auto minmax(0, 1fr) auto;
          grid-template-areas: "top top" "arena info" "roster info";
          color: white;
          overflow: hidden;
        }
        /* El oscurecido va en una capa aparte: un backdrop-filter en .stage
           la volveria el contenedor de los position: fixed internos, y el
           formulario de cotizacion se desplazaria con el escenario. */
        .stage::before {
          content: ""; position: fixed; inset: 0; z-index: -1;
          background: rgba(6, 20, 48, 0.72);
          backdrop-filter: blur(10px) saturate(1.1); -webkit-backdrop-filter: blur(10px) saturate(1.1);
        }
        /* Sin desenfoque disponible: fondo mas oscuro para que el texto se lea. */
        @supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
          .stage::before { background: rgba(6, 20, 48, 0.92); }
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
          touch-action: pan-y;
        }
        /* Logo Soley blanco translucido detras del producto, centrado en la
           zona de la imagen (generado con Higgsfield a partir del logo oficial). */
        .stage-logo {
          position: absolute; left: 50%; top: 28%; transform: translate(-50%, -50%);
          width: 92%; opacity: 0.1;
          pointer-events: none; user-select: none;
        }
        /* Figura cuadrada: producto arriba (base al ~77% del alto) y la
           superficie del pedestal justo debajo. */
        .stage-figure {
          position: relative;
          height: min(100%, 620px); aspect-ratio: 1 / 1; max-width: 100%;
        }
        .stage-glow {
          position: absolute; left: 10%; right: 10%; top: 12%; bottom: 18%; border-radius: 50%;
          background: radial-gradient(circle, var(--accent) 0%, transparent 68%);
          opacity: 0.38; filter: blur(30px);
        }
        .stage-pedestal {
          position: absolute; left: 14%; width: 72%; top: 68%;
          opacity: 0.72; pointer-events: none;
        }
        .stage-product {
          position: absolute; inset: 0 0 14%;
          filter: drop-shadow(0 24px 30px rgba(0,0,0,0.35));
          animation: product-float 4.5s ease-in-out infinite;
        }
        .stage-layer { position: absolute; inset: 0; }
        .stage-layer[data-state="idle"] { visibility: hidden; }
        /* Todo cambio ocurre en el pedestal: la anterior se hunde en el y la
           nueva emerge desde su superficie (origen en la base del producto). */
        .stage-layer { transform-origin: 50% 90%; }
        .stage-layer[data-state="in"] {
          animation: stage-rise 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }
        /* Al abrir con la imagen volando desde la tarjeta, sin subida. */
        .stage-layer[data-morph] { animation: none; }
        .stage-layer[data-state="out"] {
          animation: stage-sink 0.28s cubic-bezier(0.4, 0, 1, 1) both;
        }
        /* Al cambiar, la nueva espera a que la anterior se hunda. Reglas
           separadas: en navegadores sin :has() solo se pierde la segunda. */
        .stage-layer[data-state="out"] ~ .stage-layer[data-state="in"] { animation-delay: 0.16s; }
        .stage-layer[data-state="in"]:has(~ .stage-layer[data-state="out"]) { animation-delay: 0.16s; }
        @keyframes stage-rise {
          from { opacity: 0; transform: translateY(40px) scale(0.6, 0.3); filter: brightness(2.2); }
          55% { filter: brightness(1.3); }
          to { opacity: 1; transform: none; filter: none; }
        }
        @keyframes stage-sink {
          from { opacity: 1; transform: none; filter: none; }
          to { opacity: 0; transform: translateY(40px) scale(0.6, 0.3); filter: brightness(2.2); }
        }
        /* Destello sobre la superficie del pedestal. */
        .stage-flash {
          position: absolute; left: 22%; width: 56%; top: 70%; height: 14%; border-radius: 50%;
          background: radial-gradient(ellipse, rgba(255,255,255,0.9) 0%, var(--accent) 35%, transparent 70%);
          filter: blur(8px); pointer-events: none;
          animation: stage-flash 0.7s ease-out both;
        }
        @keyframes stage-flash {
          0% { opacity: 0; transform: scaleX(0.4); }
          30% { opacity: 0.9; transform: scaleX(1.1); }
          100% { opacity: 0; transform: scaleX(1.25); }
        }
        .stage-current { animation: stage-fade 0.35s ease-out both; }
        @keyframes stage-fade {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: none; }
        }
        .stage-shadow {
          position: absolute; top: 74%; left: 30%; width: 40%; height: 6%; border-radius: 50%;
          background: radial-gradient(ellipse, rgba(0,0,0,0.55) 0%, transparent 70%);
          filter: blur(6px);
        }
        .stage-shadow { animation: product-float-shadow 4.5s ease-in-out infinite; }
        .stage-arrow {
          position: absolute; top: 50%; z-index: 2;
          width: 56px; height: 56px; margin-top: -28px; border-radius: 999px;
          display: inline-flex; align-items: center; justify-content: center;
          background: rgba(255,255,255,0.1); color: white;
          border: 1px solid rgba(255,255,255,0.2);
        }
        .stage-arrow { transition: background .2s, transform .2s; }
        /* Solo con mouse: en pantallas tactiles el hover queda pegado tras tocar. */
        @media (hover: hover) {
          .stage-arrow:hover { background: rgba(255,255,255,0.2); transform: scale(1.06); }
          .stage-roster-item:hover .stage-roster-thumb { background: rgba(255,255,255,0.12); transform: translateY(-2px); }
        }
        .stage-arrow-prev { left: 24px; }
        .stage-arrow-prev svg { transform: rotate(180deg); }
        .stage-arrow-next { right: 24px; }

        .stage-roster {
          grid-area: roster;
          display: flex; justify-content: center; gap: 12px;
          padding: 12px 24px 28px;
        }
        .stage-roster-item {
          display: flex; flex-direction: column; align-items: center; gap: 6px;
          background: none; border: none; color: rgba(255,255,255,0.6);
          font-size: 13px; font-weight: 700;
          transition: color .2s;
        }
        .stage-roster-thumb {
          width: 72px; height: 72px; padding: 6px; border-radius: 18px;
          display: inline-flex; align-items: center; justify-content: center;
          background: rgba(255,255,255,0.06); border: 2px solid rgba(255,255,255,0.14);
          transition: transform .25s cubic-bezier(0.34, 1.56, 0.64, 1), border-color .2s, background .2s, box-shadow .2s;
        }
        .stage-roster-item[aria-pressed="true"] { color: white; }
        .stage-roster-item[aria-pressed="true"] .stage-roster-thumb {
          border-color: var(--accent); background: rgba(255,255,255,0.16);
          transform: translateY(-4px);
          box-shadow: 0 0 0 4px rgba(255,255,255,0.06), 0 10px 26px -6px var(--accent);
        }

        .stage-info {
          grid-area: info; align-self: center;
          display: flex; flex-direction: column; gap: 22px;
          padding: 8px 48px 32px 8px; max-width: 560px;
          overflow-y: auto; max-height: 100%; min-height: 0;
        }
        .stage-tagline { font-size: 14px; font-weight: 600; color: rgba(255,255,255,0.65); margin-bottom: 6px; }
        .stage-name { font-size: clamp(32px, 3.4vw, 48px); line-height: 1.05; color: white; }
        .stage-current {
          display: inline-flex; align-items: center; gap: 10px; margin-top: 12px;
          font-size: 15px; font-weight: 800;
        }
        .stage-current span {
          padding: 4px 10px; border-radius: 999px;
          font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em;
          background: var(--accent); color: var(--accent-ink);
        }
        .stage-desc { font-size: 15.5px; line-height: 1.6; color: rgba(255,255,255,0.8); }
        .stage-label {
          font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em;
          color: rgba(255,255,255,0.55); margin-bottom: 10px;
        }
        .stage-specs { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
        .stage-spec { padding: 10px 12px; border-radius: 12px; background: rgba(255,255,255,0.08); }
        .stage-spec-k {
          font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em;
          color: rgba(255,255,255,0.55);
        }
        .stage-spec-v { font-size: 13.5px; font-weight: 700; margin-top: 2px; }
        .stage-uses { display: flex; flex-wrap: wrap; gap: 6px; }
        .stage-use {
          padding: 6px 12px; border-radius: 999px; font-size: 12.5px; font-weight: 600;
          background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.88);
        }
        .stage-cta { display: flex; gap: 10px; padding-top: 4px; }

        /* Tablet y movil: producto al centro y la informacion debajo; todo se
           desplaza y el boton de cotizar queda fijo abajo. */
        @media (max-width: 980px) {
          .stage {
            display: flex; flex-direction: column;
            overflow-y: auto; overscroll-behavior: contain;
          }
          .stage-top {
            position: sticky; top: 0; z-index: 3; padding: 12px 16px;
            background: linear-gradient(rgba(6, 20, 48, 0.92) 55%, transparent);
          }
          .stage-arena { flex: none; height: 46vh; height: 46dvh; min-height: 260px; padding: 0 8px; }
          .stage-figure { height: 100%; }
          .stage-arrow { width: 44px; height: 44px; margin-top: -22px; }
          .stage-arrow-prev { left: 8px; }
          .stage-arrow-next { right: 8px; }
          .stage-roster { padding: 4px 16px 8px; gap: 16px; }
          .stage-roster-thumb { width: 60px; height: 60px; border-radius: 16px; }
          .stage-info {
            align-self: stretch; max-width: none; max-height: none; overflow: visible;
            padding: 16px 16px 0; gap: 20px;
          }
          .stage-cta {
            position: sticky; bottom: 0;
            margin: 0 -16px; padding: 12px 16px calc(12px + env(safe-area-inset-bottom));
            background: linear-gradient(transparent, rgba(6, 20, 48, 0.92) 35%);
          }
        }
        @media (max-width: 420px) {
          .stage-specs { grid-template-columns: 1fr 1fr; }
          /* El boton no cabe con el tamano; la presentacion elegida ya se ve arriba. */
          .stage-cta-size { display: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          .stage-product, .stage-shadow { animation: none; }
          .stage-layer[data-state] { animation: stage-crossfade 0.15s linear both; }
          .stage-layer[data-state="out"] { animation-direction: reverse; }
          .stage-current, .stage-flash { animation: none; }
          .stage-flash { display: none; }
          @keyframes stage-crossfade { from { opacity: 0; } to { opacity: 1; } }
        }
        /* Movil horizontal: poca altura, producto y datos lado a lado. */
        @media (max-height: 500px) and (orientation: landscape) {
          .stage {
            display: grid; overflow: hidden;
            grid-template-columns: 1fr 1fr;
            grid-template-rows: auto minmax(0, 1fr) auto;
            grid-template-areas: "top top" "arena info" "roster info";
          }
          .stage-top { position: static; padding: 8px 16px; background: none; }
          .stage-arena { height: auto; min-height: 0; }
          .stage-roster { padding: 4px 8px 8px; }
          .stage-roster-thumb { width: 40px; height: 40px; padding: 3px; border-radius: 10px; }
          .stage-info { align-self: stretch; max-height: none; overflow-y: auto; padding: 0 16px; }
        }
      `}</style>
    </div>
  );
}
