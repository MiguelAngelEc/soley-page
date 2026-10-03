"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { ArrowIcon, WhatsAppIcon } from "@/components/shared/Icons";
import { LazyWhatsAppModal as WhatsAppModal } from "@/components/shared/LazyWhatsAppModal";
import { HeroBubbles } from "@/components/layout/HeroBubbles";
import { useReducedMotionPreference } from "@/lib/a11y";
import Image from "next/image";

interface Slide {
  eyebrow: string;
  title: [string, string];
  desc: string;
}

// Compromisos que el propio sitio respalda (sin clientes ni cifras inventadas).
const commitments = [
  "Fabricado en Ecuador",
  "Registro sanitario ARCSA",
  "Más de 10 años fabricando",
  "Fórmulas concentradas de alto rendimiento",
  "Presentaciones de 1 L, 4 L y 20 L",
  "Al por mayor y al por menor",
  "Atención directa por WhatsApp",
];

const slides: Slide[] = [
  {
    eyebrow: "Detergente Líquido",
    title: ["Limpieza que", "rinde el doble y ahorra más"],
    desc: "Detergente concentrado de alta espuma. Una sola tapa lava lo que otras marcas lavan con dos.",
  },
  {
    eyebrow: "Cloro al 5%",
    title: ["Desinfección", "de grado hospitalario"],
    desc: "Hipoclorito de sodio al 5.0% — el estándar de la industria para superficies, sanitarios y blanqueo.",
  },
  {
    eyebrow: "Línea completa",
    title: ["Amenities y limpieza", "para tu negocio"],
    desc: "6 productos, 3 presentaciones cada uno. Hecho en Ecuador con registro sanitario ARCSA.",
  },
];

export function Hero() {
  const [idx, setIdx] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [whatsappModalOpen, setWhatsappModalOpen] = useState(false);
  const [canecaReady, setCanecaReady] = useState(false);
  const [canecaFallback, setCanecaFallback] = useState(false);
  const [canecaRunning, setCanecaRunning] = useState(false);
  const reducedMotion = useReducedMotionPreference();
  const contentRef = useRef<HTMLDivElement>(null);
  const slide = slides[idx];
  const sectionRef = useRef<HTMLElement>(null);
  const canecaAreaRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef(0);

  useEffect(() => () => cancelAnimationFrame(frameRef.current), []);

  // Pausa caneca y sombra fuera de pantalla, en segundo plano o tras el anuncio.
  useEffect(() => {
    const area = canecaAreaRef.current;
    if (!area) return;
    let inView = false;
    const update = () => setCanecaRunning(
      inView && !document.hidden && document.documentElement.style.overflow !== "hidden",
    );
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      update();
    });
    observer.observe(area);
    const scrollLockObserver = new MutationObserver(update);
    scrollLockObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["style"] });
    document.addEventListener("visibilitychange", update);
    return () => {
      observer.disconnect();
      scrollLockObserver.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, []);

  // La caneca empieza de frente y solo gira cuando el mouse pasa sobre ella;
  // escribe variables CSS (un frame por movimiento), sin estado de React.
  function moveCaneca(x: number, y: number) {
    cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(() => {
      sectionRef.current?.style.setProperty("--mx", x.toFixed(3));
      sectionRef.current?.style.setProperty("--my", y.toFixed(3));
    });
  }

  function onCanecaPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (reducedMotion || !canecaReady || !canecaRunning || e.pointerType !== "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect();
    moveCaneca(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      ((e.clientY - rect.top) / rect.height) * 2 - 1,
    );
  }

  const changeSlide = useCallback((newIdx: number) => {
    if (newIdx === idx || isTransitioning) return;

    setIsTransitioning(true);

    setTimeout(() => {
      setIdx(newIdx);

      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    }, 150);
  }, [idx, isTransitioning]);

  // Avanza siempre cada 6s, sin pausa por hover o foco; solo se detiene si
  // el visitante pidio menos movimiento en su sistema.
  useEffect(() => {
    if (reducedMotion) return;
    const t = setInterval(() => {
      if (!isTransitioning) {
        changeSlide((idx + 1) % slides.length);
      }
    }, 6000);
    return () => clearInterval(t);
  }, [idx, isTransitioning, changeSlide, reducedMotion]);

  return (
    <section
      id="inicio"
      ref={sectionRef}
      className="hero-section"
      style={{
      position: "relative",
      overflow: "hidden"
    }}>
      <div className="halftone" style={{ top: 80, left: -60, width: 380, height: 380 }} />
      <div className="halftone halftone-red" style={{ bottom: -40, right: -60, width: 280, height: 280, transform: "rotate(180deg)" }} />
      <div style={{
        position: "absolute", top: "-10%", right: "-10%",
        width: 560, height: 560, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(30,91,186,0.10) 0%, rgba(30,91,186,0) 70%)",
        pointerEvents: "none",
      }} />

      <div className="container-x" style={{ position: "relative", paddingTop: 56, paddingBottom: 96 }}>
        <div className="hero-grid">
          <div
            role="region"
            aria-roledescription="carrusel"
            aria-label="Presentación de productos destacados"
          >
            <div
              ref={contentRef}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 28,
                minHeight: 420,
                transition: "opacity 0.15s ease-out",
                opacity: isTransitioning ? 0 : 1,
              }}
            >
              <span className="eyebrow"><span className="dot" />{slide.eyebrow}</span>
              <div className="hero-copy">
                {slides.map((s, i) => {
                  const active = i === idx;
                  // Solo la diapositiva visible es el h1; las otras solo reservan su alto.
                  const Title = active ? "h1" : "div";
                  return (
                    <div key={i} className="hero-copy-slide" data-active={active} aria-hidden={active ? undefined : true}>
                      <Title className="hero-title">
                        <span style={{ color: "var(--ink)" }}>{s.title[0]}</span>{" "}
                        <span style={{ color: "var(--soley-blue)" }}>{s.title[1]}</span>
                      </Title>
                      <p className="lead" style={{ maxWidth: 540, minHeight: 60 }}>{s.desc}</p>
                    </div>
                  );
                })}
              </div>

              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 4 }}>
                <a href="#productos" className="btn btn-lg btn-red">Ver catálogo<ArrowIcon width={18} height={18} /></a>
                <button
                  onClick={() => setWhatsappModalOpen(true)}
                  className="btn btn-lg btn-ghost"
                >
                  <WhatsAppIcon width={18} height={18} style={{ color: "#25D366" }} />
                  Comprar por WhatsApp
                </button>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, marginTop: 32, paddingTop: 28, borderTop: "1px solid var(--border)" }}>
                {[
                  { k: "10+", v: "años fabricando" },
                  { k: "ARCSA", v: "registro sanitario" },
                  { k: "100%", v: "hecho en Ecuador" },
                ].map((t) => (
                  <div key={t.k}>
                    <div style={{ fontSize: 24, fontWeight: 800, color: "var(--soley-blue-deep)", letterSpacing: "-0.02em" }}>{t.k}</div>
                    <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 2 }}>{t.v}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", gap: 4, marginTop: 20, marginLeft: -7 }}>
              {slides.map((_, i) => (
                <button key={i} type="button" onClick={() => changeSlide(i)}
                  aria-label={`Ir a la diapositiva ${i + 1} de ${slides.length}`}
                  aria-current={idx === i ? "true" : undefined}
                  style={{
                    padding: 7, background: "none", border: "none", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                  <span style={{
                    width: idx === i ? 32 : 10, height: 10, borderRadius: 999,
                    background: idx === i ? "var(--soley-blue)" : "var(--border-strong)",
                    transition: "all .25s", display: "block",
                  }} />
                </button>
              ))}
            </div>
          </div>

          <div
            ref={canecaAreaRef}
            className="hero-caneca-area"
            data-ready={canecaReady}
            data-running={canecaRunning}
            onPointerMove={onCanecaPointerMove}
            onPointerLeave={() => moveCaneca(0, 0)}
          >
            <div className="hero-caneca-shadow" aria-hidden="true">
              <div className="hero-caneca-shadow-tilt" />
            </div>
            <HeroBubbles layer="back" />
            <div className="hero-caneca">
              <div className="hero-caneca-tilt">
                <Image
                  src="/productos/Detergente Caneca 3D Angulo.png"
                  alt="Caneca de Detergente Líquido Soley de 20 litros"
                  fill
                  sizes="(max-width: 980px) 90vw, 600px"
                  style={{ objectFit: "contain" }}
                  preload
                  unoptimized={canecaFallback}
                  onLoad={() => setCanecaReady(true)}
                  onError={() => {
                    setCanecaReady(false);
                    setCanecaFallback(true);
                  }}
                />
              </div>
            </div>
            <HeroBubbles layer="front" />
          </div>
        </div>
      </div>

      <div style={{ borderTop: "1px solid var(--border)", background: "var(--bg-soft)" }}>
        <div className="container-x" style={{ padding: "20px 24px", display: "flex", alignItems: "center", gap: 32, overflow: "hidden" }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: "var(--muted)", letterSpacing: "0.08em", textTransform: "uppercase", flexShrink: 0 }}>
            Nuestro compromiso
          </span>
          <div style={{ overflow: "hidden", flex: 1, maskImage: "linear-gradient(90deg, transparent, black 10%, black 90%, transparent)", WebkitMaskImage: "linear-gradient(90deg, transparent, black 10%, black 90%, transparent)" }}>
            <div style={{ display: "flex", gap: 56, animation: "marquee 30s linear infinite", width: "fit-content" }}>
              {/* La lista va dos veces para que la animacion en bucle no tenga corte. */}
              {[...commitments, ...commitments].map((n, i) => (
                <span key={i} style={{ fontSize: 16, fontWeight: 700, color: "var(--muted-2)", whiteSpace: "nowrap" }}>{n}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <WhatsAppModal
        isOpen={whatsappModalOpen}
        onClose={() => setWhatsappModalOpen(false)}
      />

      <style>{`
        .hero-section {
          background: linear-gradient(rgba(255,255,255,0.75), rgba(255,255,255,0.75)), url('/Img-fondo/Img-fondo.webp');
          background-size: contain;
          background-position: 25% center;
          background-repeat: no-repeat;
        }
        @media (max-width: 768px) {
          .hero-section {
            background: linear-gradient(rgba(255,255,255,0.75), rgba(255,255,255,0.75));
          }
        }
        .hero-caneca-area { position: relative; height: 580px; --rise: 660px; }
        .hero-copy-slide { display: flex; flex-direction: column; gap: 28px; }
        .hero-copy-slide[data-active="false"] { display: none; }
        .hero-title {
          font-size: clamp(40px, 6vw, 76px); line-height: 1.02; font-weight: 800;
          letter-spacing: -0.02em; margin: 0;
        }
        /* Movil: cada titulo ocupa un alto distinto y empujaba los botones al
           rotar (CLS). Las tres diapositivas comparten celda, asi el bloque
           siempre mide lo de la mas alta. */
        @media (max-width: 980px) {
          .hero-copy { display: grid; }
          .hero-copy-slide { grid-area: 1 / 1; }
          .hero-copy-slide[data-active="false"] { display: flex; visibility: hidden; }
        }
        .hero-grid { display: grid; grid-template-columns: 1.05fr 1fr; gap: 80px; align-items: center; }
        @media (max-width: 980px) {
          .hero-grid { grid-template-columns: 1fr; gap: 48px; }
          .hero-caneca-area { height: 470px; --rise: 540px; }
        }
        .hero-caneca-tilt, .hero-caneca-shadow-tilt {
          /* Easing con rebote: la caneca "salta" un poco al seguir el mouse. */
          transition: transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .hero-caneca {
          position: absolute; inset: 0 0 4%; z-index: 1;
        }
        .hero-caneca-tilt {
          position: absolute; inset: 0;
          filter: drop-shadow(0 30px 45px rgba(11,23,54,0.22));
          transform: perspective(1000px)
            translate3d(calc(var(--mx, 0) * 12px), calc(var(--my, 0) * 8px), 0)
            rotateY(calc(var(--mx, 0) * 5deg)) rotateX(calc(var(--my, 0) * -3deg))
            rotateZ(calc(var(--mx, 0) * 1deg));
        }
        .hero-caneca-shadow {
          position: absolute; bottom: 1%; left: 18%; width: 64%; height: 34px; border-radius: 50%;
        }
        .hero-caneca-shadow-tilt {
          position: absolute; inset: 0; border-radius: inherit;
          background: radial-gradient(ellipse, rgba(11,23,54,0.28) 0%, transparent 70%);
          filter: blur(8px);
          transform: translate3d(calc(var(--mx, 0) * -14px), 0, 0) scaleX(calc(1 - var(--my, 0) * 0.05));
        }
        .hero-caneca-area[data-ready="false"] .hero-caneca-shadow { opacity: 0; }
        .hero-caneca-area[data-ready="true"] .hero-caneca {
          animation: product-float 4.5s ease-in-out infinite;
        }
        .hero-caneca-area[data-ready="true"] .hero-caneca-shadow {
          animation: product-float-shadow 4.5s ease-in-out infinite;
        }
        .hero-caneca-area[data-running="false"] .hero-caneca,
        .hero-caneca-area[data-running="false"] .hero-caneca-shadow {
          animation-play-state: paused;
        }
        /* Contenedores separados: flotacion y giro no compiten por transform.
           Keyframes product-float* en globals.css. */
        @media (prefers-reduced-motion: reduce) {
          .hero-caneca-area .hero-caneca,
          .hero-caneca-area .hero-caneca-shadow { transform: none; animation: none !important; }
          .hero-caneca-tilt, .hero-caneca-shadow-tilt { transform: none; transition: none; }
        }
      `}</style>
    </section>
  );
}
