"use client";

import { useState, useId, useRef, useEffect } from "react";
import Image from "next/image";
import { promo } from "@/data/promo";
import { products } from "@/data/products";
import { LazyWhatsAppModal as WhatsAppModal } from "@/components/shared/LazyWhatsAppModal";
import { CloseIcon, WhatsAppIcon } from "@/components/shared/Icons";
import { useDialogA11y, useReducedMotionPreference } from "@/lib/a11y";

/** Breve pausa tras la primera pintura antes de mostrar el anuncio. */
const OPEN_DELAY_MS = 700;
/** Debe coincidir con la transicion de salida del CSS. */
const CLOSE_MS = 380;

type Phase = "loading" | "open" | "closing" | "done";

/**
 * Anuncio de la promocion del mes con el video generado en HyperFrames. Se
 * configura (o se apaga) desde src/data/promo.ts.
 *
 * Prepara el poster desde el principio y entra tras una breve pausa visual.
 * El video no retrasa la apertura. El fondo permanece bloqueado hasta que
 * termina la salida.
 */
export function PromoAdModal() {
  const [phase, setPhase] = useState<Phase>("loading");
  const [whatsappOpen, setWhatsappOpen] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const reducedMotion = useReducedMotionPreference();
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const posterRef = useRef<HTMLImageElement>(null);
  const isOpen = phase === "open";
  const scrollLocked = isOpen || phase === "closing";

  function close() {
    setPhase((p) => (p === "open" ? "closing" : p));
  }

  useDialogA11y({ isOpen, onClose: close, containerRef: dialogRef, preventScroll: true });

  // 1) Espera solo la pausa visual y el poster decodificado, no window.load.
  useEffect(() => {
    const poster = posterRef.current;
    if (!poster) return;
    let cancelled = false;
    let posterReady = false;
    let delayElapsed = false;
    let timer = 0;
    let frame = 0;
    const show = () => {
      if (!cancelled && posterReady && delayElapsed) {
        setPhase((p) => (p === "loading" ? "open" : p));
      }
    };
    const fail = () => {
      if (!cancelled) setPhase("done");
    };
    const prepare = async () => {
      try {
        await poster.decode();
        posterReady = true;
        show();
      } catch {
        fail();
      }
    };
    poster.addEventListener("load", prepare, { once: true });
    poster.addEventListener("error", fail, { once: true });
    if (poster.complete) {
      if (poster.naturalWidth > 0) void prepare();
      else fail();
    }
    frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => {
        timer = window.setTimeout(() => {
          delayElapsed = true;
          show();
        }, OPEN_DELAY_MS);
      });
    });
    return () => {
      cancelled = true;
      poster.removeEventListener("load", prepare);
      poster.removeEventListener("error", fail);
      cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, []);

  // Arranca el video desde el principio justo cuando el anuncio entra.
  useEffect(() => {
    if (!isOpen || reducedMotion || videoFailed) return;
    const video = videoRef.current;
    if (!video) return;
    let cancelled = false;
    video.muted = true;
    video.currentTime = 0;
    void video.play().catch(() => {
      if (!cancelled) {
        setVideoPlaying(false);
        setVideoFailed(true);
      }
    });
    return () => {
      cancelled = true;
      video.pause();
    };
  }, [isOpen, reducedMotion, videoFailed]);

  // 3) Salida suave: se desmonta cuando termina la transicion.
  useEffect(() => {
    if (phase !== "closing") return;
    const t = window.setTimeout(() => setPhase("done"), CLOSE_MS);
    return () => window.clearTimeout(t);
  }, [phase]);

  // Bloquea el desplazamiento de la pagina mientras el anuncio esta abierto,
  // compensando el ancho de la barra de scroll para que nada se mueva.
  useEffect(() => {
    if (!scrollLocked) return;
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
  }, [scrollLocked]);

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
          inert={!isOpen}
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
                ref={posterRef}
                className="ad-poster"
                src={poster}
                alt=""
                width={1080}
                height={1350}
                sizes="(max-width: 600px) 100vw, 560px"
                loading="eager"
                fetchPriority="high"
              />
              {scrollLocked && !reducedMotion && !videoFailed && (
                <video
                  ref={videoRef}
                  className={`ad-video${videoPlaying ? " playing" : ""}`}
                  src={video}
                  muted
                  loop
                  playsInline
                  controls={false}
                  preload="auto"
                  onPlaying={() => setVideoPlaying(true)}
                  onPause={() => {
                    if (isOpen) {
                      setVideoPlaying(false);
                      setVideoFailed(true);
                    }
                  }}
                  onError={() => {
                    setVideoPlaying(false);
                    setVideoFailed(true);
                  }}
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
          width: min(560px, 100%, calc((100vh - 170px) * 0.8));
          width: min(560px, 100%, calc((100svh - 170px) * 0.8));
          border-radius: 24px;
          overflow: hidden;
          background: white;
          box-shadow: var(--shadow-lg);
          opacity: 0;
          transform: translateY(12px);
          transition: opacity 0.38s ease, transform 0.38s ease;
        }
        .ad-overlay.open .ad-card {
          opacity: 1;
          transform: none;
          transition: opacity 0.3s ease, transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
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
          flex-shrink: 0;
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
