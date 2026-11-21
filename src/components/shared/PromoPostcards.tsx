"use client";

import { useState, useId, useRef, useEffect } from "react";
import Image from "next/image";
import { promoPostcards } from "@/data/promo";
import { LazyWhatsAppModal as WhatsAppModal } from "@/components/shared/LazyWhatsAppModal";
import { CloseIcon, WhatsAppIcon } from "@/components/shared/Icons";
import { useDialogA11y, useReducedMotionPreference } from "@/lib/a11y";

/** Breve pausa tras la primera pintura antes de mostrar el anuncio. */
const OPEN_DELAY_MS = 700;
/** Desfase entre postales: caen seguidas, en cascada. */
const DROP_EVERY_MS = 280;
const FIRST_DROP_MS = 300;
/** Debe coincidir con la transicion de salida del CSS. */
const CLOSE_MS = 700;

const { slides, title, endsAt } = promoPostcards;
const ENDS_AT = Date.parse(endsAt);
/** Fondo decorativo: filas de "BLACK FRIDAY" repetidas. */
const BG_ROWS = Array.from({ length: 48 }, () => Array(16).fill("BLACK FRIDAY").join(" · "));

type Phase = "loading" | "open" | "closing" | "done";

/**
 * Anuncio de Black Friday: las postales caen una a una y quedan desordenadas
 * sobre la pantalla (en movil, en 2x2). Tocar una la trae al centro con su
 * boton de pedido. Se configura (o se apaga) desde src/data/promo.ts.
 */
export function PromoPostcards() {
  const [phase, setPhase] = useState<Phase>("loading");
  const [fallen, setFallen] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [whatsappFor, setWhatsappFor] = useState<number | null>(null);
  const reducedMotion = useReducedMotionPreference();
  const titleId = useId();
  const titleRef = useRef<HTMLHeadingElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const firstRef = useRef<HTMLImageElement>(null);
  const isOpen = phase === "open";
  const visible = phase === "open" || phase === "closing";

  function close() {
    setPhase((p) => (p === "open" ? "closing" : p));
  }

  useDialogA11y({
    isOpen,
    onClose: () => (selected !== null ? setSelected(null) : close()),
    containerRef: dialogRef,
    initialFocusRef: titleRef,
    preventScroll: true,
  });

  // Abre tras la pausa visual y con la primera postal ya decodificada.
  useEffect(() => {
    const img = firstRef.current;
    if (!img) return;
    let cancelled = false;
    let ready = false;
    let delayElapsed = false;
    const show = () => {
      if (cancelled || !ready || !delayElapsed) return;
      // La pagina se prerenderiza: la fecha de fin se revisa en el navegador.
      if (Date.now() >= ENDS_AT) setPhase("done");
      else setPhase((p) => (p === "loading" ? "open" : p));
    };
    const fail = () => {
      if (!cancelled) setPhase("done");
    };
    const prepare = async () => {
      try {
        await img.decode();
        ready = true;
        show();
      } catch {
        fail();
      }
    };
    img.addEventListener("load", prepare, { once: true });
    img.addEventListener("error", fail, { once: true });
    if (img.complete) {
      if (img.naturalWidth > 0) void prepare();
      else fail();
    }
    const timer = window.setTimeout(() => {
      delayElapsed = true;
      show();
    }, OPEN_DELAY_MS);
    return () => {
      cancelled = true;
      img.removeEventListener("load", prepare);
      img.removeEventListener("error", fail);
      window.clearTimeout(timer);
    };
  }, []);

  // Caen una por una; con movimiento reducido aparecen todas a la vez.
  useEffect(() => {
    if (!isOpen || fallen >= slides.length) return;
    const t = window.setTimeout(
      () => setFallen((n) => (reducedMotion ? slides.length : n + 1)),
      // La primera espera a que termine de oscurecerse el fondo.
      fallen === 0 ? FIRST_DROP_MS : DROP_EVERY_MS,
    );
    return () => window.clearTimeout(t);
  }, [isOpen, fallen, reducedMotion]);

  useEffect(() => {
    if (phase !== "closing") return;
    const t = window.setTimeout(() => setPhase("done"), CLOSE_MS);
    return () => window.clearTimeout(t);
  }, [phase]);

  // Bloquea el scroll de la pagina compensando la barra (como PromoAdModal).
  useEffect(() => {
    if (!visible) return;
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
  }, [visible]);

  function onCardClick(i: number, e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    setSelected((s) => (s === i ? null : i));
  }

  if (!promoPostcards.active) return null;

  return (
    <>
      {phase !== "done" && (
        <div
          ref={dialogRef}
          className={`pc-overlay${isOpen ? " open" : ""}${selected !== null ? " has-selected" : ""}${phase === "closing" ? " closing" : ""}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-hidden={!isOpen}
          inert={!isOpen}
          // Inline a proposito: styled-jsx no viaja en el HTML del servidor, y sin
          // esto las postales se ven sueltas en la pagina antes de hidratar.
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 200,
            overflow: "hidden",
            // Al cerrar sigue visible: se desvanecen el fondo y salen las postales.
            opacity: visible ? 1 : 0,
            pointerEvents: isOpen ? "auto" : "none",
          }}
          onClick={() => (selected !== null ? setSelected(null) : close())}
        >
          <div className="pc-bg" aria-hidden="true">
            {BG_ROWS.map((row, i) => (
              <span key={i}>{row}</span>
            ))}
          </div>

          {/* Barra tipo menu: logo, titulo al centro y cerrar a la derecha. */}
          <div className="pc-head" onClick={(e) => e.stopPropagation()}>
            <Image className="pc-logo" src="/efectos/logo-blanco.webp" alt="Soley" width={899} height={622} />
            <div className="pc-head-text">
              {/* Recibe el foco al abrir: asi la X no aparece marcada de entrada. */}
              <h2 ref={titleRef} id={titleId} className="pc-title" tabIndex={-1}>
                {title}
              </h2>
              <p className="pc-hint">Toca una oferta para pedirla</p>
            </div>
            <button type="button" className="pc-close" onClick={close} aria-label="Cerrar ofertas">
              <CloseIcon width={18} height={18} />
            </button>
          </div>

          {slides.map((s, i) => (
            <button
              key={s.src}
              type="button"
              className={`pc-card pc-${i}${i < fallen ? " dropped" : ""}${selected === i ? " selected" : ""}`}
              style={{ zIndex: selected === i ? 20 : i + 1 }}
              aria-label={s.alt}
              aria-pressed={selected === i}
              onClick={(e) => onCardClick(i, e)}
            >
              <Image
                ref={i === 0 ? firstRef : undefined}
                src={s.src}
                alt=""
                width={1080}
                height={1350}
                sizes="(max-width: 767px) 88vw, 460px"
                loading="eager"
                fetchPriority={i === 0 ? "high" : undefined}
                draggable={false}
              />
            </button>
          ))}

          {selected !== null ? (
            <div className="pc-actions" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                className="btn pc-cta"
                onClick={() => {
                  setWhatsappFor(selected);
                  close();
                }}
              >
                <WhatsAppIcon width={18} height={18} />
                Pedir esta oferta
              </button>
              <button type="button" className="pc-back" onClick={() => setSelected(null)}>
                Ver todas
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="pc-skip"
              onClick={(e) => {
                e.stopPropagation();
                close();
              }}
            >
              Ver la página
            </button>
          )}
        </div>
      )}

      <WhatsAppModal
        isOpen={whatsappFor !== null}
        onClose={() => setWhatsappFor(null)}
        productLabel={whatsappFor !== null ? slides[whatsappFor].pedido : undefined}
      />

      <style jsx>{`
        .pc-overlay {
          overscroll-behavior: contain;
          /* Blanco translucido: se adivina la pagina detras. */
          background: rgba(246, 249, 253, 0.72);
          backdrop-filter: blur(3px);
          -webkit-backdrop-filter: blur(3px);
          transition: opacity 0.5s ease, background-color 0.6s ease, backdrop-filter 0.6s ease;
        }
        /* Salida: el fondo se desvanece y las postales hacen la caida al reves
           (se agrandan hacia quien mira y desaparecen), mas rapido y en orden
           inverso. CLOSE_MS cubre la ultima. */
        .pc-overlay.closing {
          background-color: transparent;
          backdrop-filter: none;
          -webkit-backdrop-filter: none;
        }
        .pc-overlay.closing .pc-bg,
        .pc-overlay.closing .pc-head,
        .pc-overlay.closing .pc-close,
        .pc-overlay.closing .pc-skip,
        .pc-overlay.closing .pc-actions {
          opacity: 0;
          transition: opacity 0.4s ease;
        }
        .pc-overlay.closing .pc-card.dropped {
          animation: pc-leave 0.5s cubic-bezier(0.5, 0, 0.9, 0.6) forwards;
        }
        .pc-overlay.closing .pc-2.dropped { animation-delay: 60ms; }
        .pc-overlay.closing .pc-1.dropped { animation-delay: 120ms; }
        .pc-overlay.closing .pc-0.dropped { animation-delay: 180ms; }
        @keyframes pc-leave {
          to { translate: 70px -40px; rotate: 18deg; scale: 2.3; opacity: 0; }
        }
        /* Fuera de las postales (colores de marca) todo va en paleta Black
           Friday: negro, blanco, rojo y amarillo. El cartel tapa la pagina de
           fondo para que el titulo se lea limpio. */
        /* Texto "BLACK FRIDAY" repetido en blanco, girado, detras de
           las postales. Las filas pares se desplazan para que no se alineen. */
        .pc-bg {
          position: absolute;
          inset: -30%;
          z-index: 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 6px;
          transform: rotate(-12deg);
          pointer-events: none;
          user-select: none;
        }
        .pc-bg span {
          color: white;
          opacity: 0.9;
          font-size: clamp(12px, 1.6vw, 20px);
          font-weight: 900;
          line-height: 1;
          letter-spacing: 0.02em;
          white-space: nowrap;
        }
        .pc-bg span:nth-child(even) {
          margin-left: -3.5em;
        }
        /* Franja negra de lado a lado; el padding lateral deja sitio a la X. */
        .pc-head {
          position: absolute;
          top: 16px;
          left: 0;
          right: 0;
          z-index: 30;
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 12px;
          padding: 8px clamp(12px, 3vw, 32px);
          background: #0b0b0b;
          border-bottom: 3px solid #ffd400;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
        }
        .pc-head :global(.pc-logo) {
          width: auto;
          height: 40px;
        }
        .pc-head-text {
          text-align: center;
        }
        .pc-title {
          margin: 0;
          color: white;
          font-size: clamp(15px, 2vw, 22px);
          font-weight: 900;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }
        .pc-title:focus {
          outline: none;
        }
        .pc-hint {
          margin: 2px 0 0;
          color: #ffd400;
          font-size: 13px;
          font-weight: 600;
          transition: opacity 0.3s ease;
        }
        .has-selected .pc-hint {
          opacity: 0;
        }

        /* Postal: posicion/giro propios (desktop). Se centra con margenes
           (alto = ancho * 1.25) para que transform quede solo con el giro y las
           propiedades translate/rotate/scale de la caida se sumen sin desplazarla. */
        .pc-card {
          --w: min(24vw, 41vh, 300px);
          position: absolute;
          left: var(--x);
          top: var(--y);
          width: var(--w);
          margin: calc(var(--w) * -0.625) 0 0 calc(var(--w) / -2);
          padding: 0;
          border: none;
          border-radius: 6px;
          overflow: hidden;
          background: none;
          box-shadow: 0 16px 36px rgba(11, 23, 54, 0.22), 0 2px 6px rgba(11, 23, 54, 0.1);
          cursor: pointer;
          visibility: hidden;
          transform: rotate(var(--r));
          transition: transform 0.45s ease, left 0.45s ease, top 0.45s ease, width 0.45s ease, margin 0.45s ease;
        }
        .pc-card :global(img) {
          display: block;
          width: 100%;
          height: auto;
          pointer-events: none;
          user-select: none;
        }
        /* Caida como hoja: nace grande frente a quien mira y baja a su sitio
           meciendose. Los fotogramas son muestras de una oscilacion amortiguada
           (vaiven y giro en fase, como una hoja) con descenso ease-out; con
           tramos lineales cortos el movimiento es continuo, sin paradas.
           Sin fill-mode: al terminar mandan el transform de reposo y las
           transiciones de hover/seleccion. */
        .pc-card.dropped {
          visibility: visible;
          animation: pc-leaf 1.5s linear;
        }
        @keyframes pc-leaf {
          0% { translate: 70.0px -40.0px; rotate: 17.6deg; scale: 2.300; opacity: 0.00; }
          5% { translate: 59.6px -34.3px; rotate: 18.3deg; scale: 2.115; opacity: 0.28; }
          10% { translate: 41.8px -29.2px; rotate: 16.2deg; scale: 1.948; opacity: 0.56; }
          15% { translate: 20.7px -24.6px; rotate: 12.0deg; scale: 1.798; opacity: 0.83; }
          20% { translate: 0.0px -20.5px; rotate: 6.7deg; scale: 1.666; opacity: 1.00; }
          25% { translate: -16.9px -16.9px; rotate: 1.4deg; scale: 1.548; }
          30% { translate: -28.0px -13.7px; rotate: -3.2deg; scale: 1.446; }
          35% { translate: -32.5px -11.0px; rotate: -6.3deg; scale: 1.357; }
          40% { translate: -30.9px -8.6px; rotate: -7.8deg; scale: 1.281; }
          45% { translate: -24.8px -6.7px; rotate: -7.6deg; scale: 1.216; }
          50% { translate: -16.3px -5.0px; rotate: -6.3deg; scale: 1.163; }
          55% { translate: -7.5px -3.6px; rotate: -4.3deg; scale: 1.118; }
          60% { translate: 0px -2.6px; rotate: -2.2deg; scale: 1.083; }
          65% { translate: 5.0px -1.7px; rotate: -0.4deg; scale: 1.056; }
          70% { translate: 7.2px -1.1px; rotate: 0.8deg; scale: 1.035; }
          75% { translate: 7.0px -0.6px; rotate: 1.4deg; scale: 1.020; }
          80% { translate: 5.3px -0.3px; rotate: 1.3deg; scale: 1.010; }
          85% { translate: 3.1px -0.1px; rotate: 1.0deg; scale: 1.004; }
          90% { translate: 1.2px 0px; rotate: 0.5deg; scale: 1.001; }
          95% { translate: 0.2px 0px; rotate: 0.1deg; scale: 1.000; }
          100% { translate: 0.0px 0.0px; rotate: 0.0deg; scale: 1.000; opacity: 1.00; }
        }
        .pc-card.dropped:hover:not(.selected) {
          transform: translateY(-6px) rotate(var(--r)) scale(1.03);
        }
        .pc-card:focus-visible {
          outline: 3px solid var(--soley-blue);
          outline-offset: 4px;
        }
        .pc-card.selected {
          --w: min(88vw, calc((100vh - 200px) * 0.8), 460px);
          --w: min(88vw, calc((100svh - 200px) * 0.8), 460px);
          left: 50%;
          top: calc(50% - 30px);
          transform: rotate(0deg);
          cursor: zoom-out;
        }
        .pc-0 { --x: 20%; --y: 54%; --r: -9deg; }
        .pc-1 { --x: 40%; --y: 49%; --r: 6deg; }
        .pc-2 { --x: 60%; --y: 56%; --r: -4deg; }
        .pc-3 { --x: 80%; --y: 50%; --r: 8deg; }

        .pc-actions {
          position: absolute;
          left: 50%;
          bottom: 20px;
          z-index: 30;
          display: flex;
          gap: 10px;
          transform: translateX(-50%);
          width: min(460px, calc(100% - 32px));
        }
        .pc-cta {
          flex: 1;
          justify-content: center;
          background: #e10600;
          border-color: #e10600;
          color: white;
        }
        .pc-cta:hover {
          background: #b80500;
          border-color: #b80500;
        }
        .pc-back,
        .pc-skip {
          min-height: 44px;
          padding: 0 18px;
          border: none;
          border-radius: 999px;
          background: #0b0b0b;
          color: white;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
        }
        .pc-skip {
          position: absolute;
          left: 50%;
          bottom: 20px;
          z-index: 30;
          transform: translateX(-50%);
        }
        .pc-close {
          justify-self: end;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border: none;
          border-radius: 999px;
          background: transparent;
          color: white;
          cursor: pointer;
          transition: background-color 0.2s ease, color 0.2s ease, transform 0.2s ease;
        }
        .pc-close:hover {
          background: #ffd400;
          color: #0b0b0b;
          transform: rotate(90deg);
        }
        .pc-close:focus-visible,
        .pc-back:focus-visible,
        .pc-skip:focus-visible,
        .pc-cta:focus-visible {
          outline: 3px solid #ffd400;
          outline-offset: 2px;
        }

        /* Movil: cuadricula 2x2 desordenada, para ver las 4 a la vez. El
           ancho sale del alto libre (sin cartel ni boton) para que entren
           dos filas: 2 * alto = 2 * 1.25 * ancho. */
        @media (max-width: 767px) {
          .pc-card {
            --w: min(44vw, calc((100vh - 200px) * 0.38));
            --w: min(44vw, calc((100svh - 200px) * 0.38));
          }
          .pc-0 { --x: 27%; --y: 36%; --r: -6deg; }
          .pc-1 { --x: 73%; --y: 38%; --r: 5deg; }
          .pc-2 { --x: 28%; --y: 68%; --r: 4deg; }
          .pc-3 { --x: 72%; --y: 66%; --r: -5deg; }
          .pc-card.dropped:hover:not(.selected) {
            transform: rotate(var(--r));
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .pc-card,
          .pc-card.dropped,
          .pc-overlay.closing .pc-card.dropped {
            transition: none;
            animation: none;
          }
          .pc-overlay.closing .pc-card {
            opacity: 0;
            transition: opacity 0.3s ease;
          }
        }
      `}</style>
    </>
  );
}
