"use client";

import { useState, useId, useRef, useEffect } from "react";
import Image from "next/image";
import { promo } from "@/data/promo";
import { products } from "@/data/products";
import { WhatsAppModal } from "@/components/shared/WhatsAppModal";
import { CloseIcon, WhatsAppIcon } from "@/components/shared/Icons";
import { useDialogA11y, useReducedMotionPreference } from "@/lib/a11y";

/** Pausa tras cargar la pagina antes de mostrar el anuncio. */
const OPEN_DELAY_MS = 900;
/** Si el video tarda, se muestra igual con el poster pasado este tiempo. */
const VIDEO_WAIT_MS = 2500;
/** Debe coincidir con la transicion de salida del CSS. */
const CLOSE_MS = 380;

type Phase = "idle" | "loading" | "open" | "closing" | "done";

/**
 * Anuncio de la promocion del mes con el video generado en HyperFrames. Se
 * configura (o se apaga) desde src/data/promo.ts.
 *
 * Para que no aparezca de golpe: espera a que la pagina termine de cargar,
 * prepara el video oculto y solo entonces entra con un fundido. Mientras esta
 * abierto, el fondo no se puede desplazar.
 */
export function PromoAdModal() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [whatsappOpen, setWhatsappOpen] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const reducedMotion = useReducedMotionPreference();
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isOpen = phase === "open";

  function close() {
    setPhase((p) => (p === "open" ? "closing" : p));
  }

  useDialogA11y({ isOpen, onClose: close, containerRef: dialogRef });

  // 1) Tras la carga completa de la pagina, empieza a preparar el anuncio.
  useEffect(() => {
    let timer = 0;
    const start = () => {
      timer = window.setTimeout(() => setPhase("loading"), OPEN_DELAY_MS);
    };
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    return () => {
      window.removeEventListener("load", start);
      window.clearTimeout(timer);
    };
  }, []);

  // 2) Se muestra cuando el video puede reproducirse (o al agotar la espera).
  useEffect(() => {
    if (phase !== "loading") return;
    const video = videoRef.current;
    const show = () => setPhase((p) => (p === "loading" ? "open" : p));
    if (reducedMotion || !video) {
      show();
      return;
    }
    if (video.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) show();
    video.addEventListener("canplay", show, { once: true });
    const fallback = window.setTimeout(show, VIDEO_WAIT_MS);
    return () => {
      video.removeEventListener("canplay", show);
      window.clearTimeout(fallback);
    };
  }, [phase, reducedMotion]);

  // Arranca el video desde el principio justo cuando el anuncio entra.
  useEffect(() => {
    if (!isOpen || reducedMotion) return;
    const video = videoRef.current;
    if (!video) return;
    let cancelled = false;
    video.muted = true;
    video.currentTime = 0;
    void video.play().catch(() => {
      if (!cancelled) setVideoPlaying(false);
    });
    return () => {
      cancelled = true;
      video.pause();
    };
  }, [isOpen, reducedMotion]);

  // 3) Salida suave: se desmonta cuando termina la transicion.
  useEffect(() => {
    if (phase !== "closing") return;
    const t = window.setTimeout(() => setPhase("done"), CLOSE_MS);
    return () => window.clearTimeout(t);
  }, [phase]);

  // Bloquea el desplazamiento de la pagina mientras el anuncio esta abierto,
  // compensando el ancho de la barra de scroll para que nada se mueva.
  useEffect(() => {
    if (!isOpen) return;
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
  }, [isOpen]);

  const product = products.find((p) => p.id === promo.productId);
  if (!promo.active || !promo.ad || !product) return null;
  const { video, poster } = promo.ad;

  return (
    <>
      {(phase === "loading" || phase === "open" || phase === "closing") && (
        <div
          className={`modal-overlay ad-overlay${isOpen ? " open" : ""}`}
          onClick={close}
          aria-hidden={!isOpen}
        >
          <div
            ref={dialogRef}
            className="ad-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            onClick={(e) => e.stopPropagation()}
          >
            <button type="button" className="ad-close" onClick={close} aria-label="Cerrar anuncio">
              <CloseIcon width={16} height={16} />
            </button>

            <h2 id={titleId} className="sr-only">
              {promo.eyebrow}: {product.name} {promo.presentation} a ${promo.price}
            </h2>

            {/* El poster cubre el video hasta que se reproduce, sin UI del reproductor. */}
            <div className="ad-media">
              <Image
                className="ad-poster"
                src={poster}
                alt=""
                width={1080}
                height={1350}
                unoptimized
              />
              {!reducedMotion && (
                <video
                  ref={videoRef}
                  className={`ad-video${videoPlaying ? " playing" : ""}`}
                  src={video}
                  poster={poster}
                  muted
                  loop
                  playsInline
                  controls={false}
                  preload="auto"
                  onPlaying={() => setVideoPlaying(true)}
                  onWaiting={() => setVideoPlaying(false)}
                  onPause={() => setVideoPlaying(false)}
                  onError={() => setVideoPlaying(false)}
                  aria-hidden="true"
                />
              )}
            </div>

            <div className="ad-actions">
              <button
                type="button"
                className="btn btn-blue ad-cta"
                onClick={() => {
                  close();
                  setWhatsappOpen(true);
                }}
              >
                <WhatsAppIcon width={18} height={18} />
                Pide el tuyo hoy
              </button>
              <button type="button" className="ad-skip" onClick={close}>
                Ver la página
              </button>
            </div>
          </div>
        </div>
      )}

      <WhatsAppModal isOpen={whatsappOpen} onClose={() => setWhatsappOpen(false)} selectedProduct={product} />

      <style jsx>{`
        /* Entrada y salida suaves: el fondo se oscurece y la tarjeta sube un
           poco mientras aparece, sin rebotes. */
        .ad-overlay {
          z-index: 200;
          overscroll-behavior: contain;
          transition: opacity 0.38s ease;
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
          opacity: 0;
          transform: translateY(24px) scale(0.97);
          transition: opacity 0.38s ease, transform 0.38s ease;
        }
        .ad-overlay.open .ad-card {
          opacity: 1;
          transform: none;
          transition: opacity 0.5s ease 0.08s, transform 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.08s;
        }
        @media (prefers-reduced-motion: reduce) {
          .ad-card,
          .ad-overlay.open .ad-card {
            transform: none;
          }
        }
        .ad-media {
          position: relative;
          aspect-ratio: 4 / 5;
          background: #f4f8fd;
        }
        .ad-poster,
        .ad-video {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .ad-video {
          position: absolute;
          inset: 0;
          opacity: 0;
          pointer-events: none;
        }
        .ad-video.playing {
          opacity: 1;
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
