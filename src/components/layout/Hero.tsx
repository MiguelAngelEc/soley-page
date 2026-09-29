"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { ArrowIcon, WhatsAppIcon } from "@/components/shared/Icons";
import { WhatsAppModal } from "@/components/shared/WhatsAppModal";
import { useReducedMotionPreference } from "@/lib/a11y";
import Image from "next/image";

interface Slide {
  eyebrow: string;
  title: [string, string];
  desc: string;
}

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
  const reducedMotion = useReducedMotionPreference();
  const contentRef = useRef<HTMLDivElement>(null);
  const slide = slides[idx];
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef(0);

  useEffect(() => () => cancelAnimationFrame(frameRef.current), []);

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
    if (reducedMotion || e.pointerType !== "mouse") return;
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
              <h1>
                <span style={{ color: "var(--ink)" }}>{slide.title[0]}</span>{" "}
                <span style={{ color: "var(--soley-blue)" }}>{slide.title[1]}</span>
              </h1>
              <p className="lead" style={{ maxWidth: 540, minHeight: 60 }}>{slide.desc}</p>

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
            className="hero-caneca-area"
            onPointerMove={onCanecaPointerMove}
            onPointerLeave={() => moveCaneca(0, 0)}
          >
            <div className="hero-caneca-shadow" aria-hidden="true" />
            <div className="hero-caneca">
              <Image
                src="/productos/Detergente Caneca 3D Angulo.png"
                alt="Caneca de Detergente Líquido Soley de 20 litros"
                fill
                sizes="(max-width: 980px) 90vw, 600px"
                style={{ objectFit: "contain" }}
                preload
              />
            </div>
          </div>
        </div>
      </div>

      <div style={{ borderTop: "1px solid var(--border)", background: "var(--bg-soft)" }}>
        <div className="container-x" style={{ padding: "20px 24px", display: "flex", alignItems: "center", gap: 32, overflow: "hidden" }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: "var(--muted)", letterSpacing: "0.08em", textTransform: "uppercase", flexShrink: 0 }}>
            Confían en nosotros
          </span>
          <div style={{ overflow: "hidden", flex: 1, maskImage: "linear-gradient(90deg, transparent, black 10%, black 90%, transparent)", WebkitMaskImage: "linear-gradient(90deg, transparent, black 10%, black 90%, transparent)" }}>
            <div style={{ display: "flex", gap: 56, animation: "marquee 30s linear infinite", width: "fit-content" }}>
              {[
                "Hotel Quito", "Hotel Imperial", "Restaurant La Casona", "Hostería El Prado",
                "Comercial Andina", "Lavandería Express", "Clínica Ibarra", "Resort San Antonio",
                "Hotel Quito", "Hotel Imperial", "Restaurant La Casona", "Hostería El Prado",
                "Comercial Andina", "Lavandería Express", "Clínica Ibarra", "Resort San Antonio",
              ].map((n, i) => (
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
          background: linear-gradient(rgba(255,255,255,0.75), rgba(255,255,255,0.75)), url('/Img-fondo/Img-fondo.png');
          background-size: contain;
          background-position: 25% center;
          background-repeat: no-repeat;
        }
        @media (max-width: 768px) {
          .hero-section {
            background: linear-gradient(rgba(255,255,255,0.75), rgba(255,255,255,0.75));
          }
        }
        .hero-caneca-area { position: relative; height: 580px; }
        .hero-grid { display: grid; grid-template-columns: 1.05fr 1fr; gap: 80px; align-items: center; }
        @media (max-width: 980px) {
          .hero-grid { grid-template-columns: 1fr; gap: 48px; }
          .hero-caneca-area { height: 470px; }
        }
        .hero-caneca, .hero-caneca-shadow {
          /* Easing con rebote: la caneca "salta" un poco al seguir el mouse. */
          transition: transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1);
          will-change: transform;
        }
        .hero-caneca {
          position: absolute; inset: 0 0 4%;
          filter: drop-shadow(0 30px 45px rgba(11,23,54,0.22));
          transform: perspective(1000px)
            translate3d(calc(var(--mx, 0) * 30px), calc(var(--my, 0) * 22px), 0)
            rotateY(calc(var(--mx, 0) * 16deg)) rotateX(calc(var(--my, 0) * -10deg))
            rotateZ(calc(var(--mx, 0) * 4deg));
          animation: hero-caneca-float 4.5s ease-in-out infinite;
        }
        .hero-caneca-shadow {
          position: absolute; bottom: 1%; left: 18%; width: 64%; height: 34px; border-radius: 50%;
          background: radial-gradient(ellipse, rgba(11,23,54,0.28) 0%, transparent 70%);
          filter: blur(8px);
          transform: translate3d(calc(var(--mx, 0) * -34px), 0, 0) scaleX(calc(1 - var(--my, 0) * 0.12));
          animation: hero-caneca-shadow 4.5s ease-in-out infinite;
        }
        /* Flotacion en reposo; usa translate/scale sueltos para sumarse al
           transform del mouse sin pisarlo. */
        @keyframes hero-caneca-float {
          0%, 100% { translate: 0 0; }
          50% { translate: 0 -18px; }
        }
        @keyframes hero-caneca-shadow {
          0%, 100% { scale: 1; opacity: 1; }
          50% { scale: 0.82; opacity: 0.7; }
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-caneca, .hero-caneca-shadow { transform: none; animation: none; }
        }
      `}</style>
    </section>
  );
}
