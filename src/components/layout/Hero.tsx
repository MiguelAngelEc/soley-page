"use client";

import { useState, useEffect, useRef } from "react";
import { products } from "@/data/products";
import type { Product } from "@/data/products";
import { ArrowIcon, WhatsAppIcon } from "@/components/shared/Icons";
import Image from "next/image";

interface Slide {
  eyebrow: string;
  title: [string, string];
  desc: string;
  tag: string;
  productId: string | null;
}

const slides: Slide[] = [
  {
    eyebrow: "Detergente Líquido",
    title: ["Limpieza que", "rinde el doble y ahorra más"],
    desc: "Detergente concentrado de alta espuma. Una sola tapa lava lo que otras marcas lavan con dos.",
    tag: "Hasta 80 lavados",
    productId: "detergente-liquido",
  },
  {
    eyebrow: "Cloro al 5%",
    title: ["Desinfección", "de grado hospitalario"],
    desc: "Hipoclorito de sodio al 5.0% — el estándar de la industria para superficies, sanitarios y blanqueo.",
    tag: "5.0% concentración",
    productId: "cloro-5",
  },
  {
    eyebrow: "Línea completa",
    title: ["Amenities y limpieza", "para tu negocio"],
    desc: "6 productos, 3 presentaciones cada uno. Hecho en Ecuador con registro sanitario ARCSA.",
    tag: "Al Por Mayor & Al Por Menor",
    productId: null,
  },
];

export function Hero() {
  const [idx, setIdx] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const slide = slides[idx];
  const featured: Product | null = slide.productId ? products.find((p) => p.id === slide.productId) ?? null : null;

  const changeSlide = (newIdx: number) => {
    if (newIdx === idx || isTransitioning) return;

    setIsTransitioning(true);

    setTimeout(() => {
      setIdx(newIdx);

      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    }, 150);
  };

  useEffect(() => {
    const t = setInterval(() => {
      if (!isTransitioning) {
        changeSlide((idx + 1) % slides.length);
      }
    }, 6000);
    return () => clearInterval(t);
  }, [idx, isTransitioning]);

  return (
    <section id="inicio" className="hero-section" style={{
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
              <a href="https://wa.me/593961264102" target="_blank" rel="noopener noreferrer" className="btn btn-lg btn-ghost">
                <WhatsAppIcon width={18} height={18} style={{ color: "#25D366" }} />
                Comprar por WhatsApp
              </a>
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

          <div style={{ position: "relative", height: 560 }}>
            <HeroShowcase slide={slide} featured={featured} idx={idx} isTransitioning={isTransitioning} />
            <div style={{ position: "absolute", bottom: -8, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 8, zIndex: 5 }}>
              {slides.map((_, i) => (
                <button key={i} onClick={() => changeSlide(i)} aria-label={`Slide ${i + 1}`}
                  style={{
                    width: idx === i ? 32 : 10, height: 10, borderRadius: 999,
                    background: idx === i ? "var(--soley-blue)" : "var(--border-strong)",
                    transition: "all .25s",
                  }} />
              ))}
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
        .hero-grid { display: grid; grid-template-columns: 1.05fr 1fr; gap: 80px; align-items: center; }
        @media (max-width: 980px) {
          .hero-grid { grid-template-columns: 1fr; gap: 48px; }
          .hero-grid > div:last-child { min-height: 460px !important; }
        }
      `}</style>
    </section>
  );
}

function HeroShowcase({ slide, featured, idx, isTransitioning }: { slide: Slide; featured: Product | null; idx: number; isTransitioning: boolean }) {
  return (
    <div style={{
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderRadius: 32,
      background: "linear-gradient(160deg, #F7FAFD 0%, #E9F1FB 100%)",
      overflow: "hidden",
      opacity: isTransitioning ? 0 : 1,
      transform: isTransitioning ? "scale(0.98)" : "scale(1)",
      transition: "opacity 0.15s ease-out, transform 0.15s ease-out",
    }}>
      <div style={{
        position: "absolute", top: 24, left: 24, width: 200, height: 200,
        backgroundImage: "radial-gradient(var(--soley-blue) 1.5px, transparent 2px)",
        backgroundSize: "14px 14px", opacity: 0.22,
        maskImage: "linear-gradient(135deg, black 30%, transparent 80%)",
        WebkitMaskImage: "linear-gradient(135deg, black 30%, transparent 80%)",
      }} />

      <div style={{
        position: "absolute", top: 28, right: 28, background: "white",
        padding: "10px 18px", borderRadius: 999, fontSize: 13, fontWeight: 700,
        color: "var(--soley-blue-deep)", boxShadow: "var(--shadow-md)",
        display: "flex", alignItems: "center", gap: 8, zIndex: 2,
      }}>
        <span style={{ width: 8, height: 8, borderRadius: 999, background: "var(--soley-red)" }} />
        {slide.tag}
      </div>

      <div style={{
        position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)",
        width: "65%", height: 24, borderRadius: "50%",
        background: "radial-gradient(ellipse, rgba(11,23,54,0.18) 0%, transparent 70%)",
        filter: "blur(6px)"
      }} />

      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", padding: 40 }}>
        {featured ? <HeroBigBottle product={featured} /> : <ProductLineup />}
      </div>

    </div>
  );
}

function HeroBigBottle({ product }: { product: Product }) {
  // Mapeo de productos a sus imágenes - usando CANECA no Galón
  const productImages: Record<string, string> = {
    "detergente-liquido": "/productos/Detergente Caneca.png",
    "cloro-5": "/productos/Cloro Caneca.png",
  };

  const imageSrc = productImages[product.id];

  if (imageSrc) {
    return (
      <div style={{ position: "relative", width: 380, height: 450, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <Image
          src={imageSrc}
          alt={product.name}
          width={360}
          height={360}
          style={{
            objectFit: "contain",
            filter: "drop-shadow(0 25px 50px rgba(11,23,54,0.20))",
          }}
          priority
        />
        <div style={{
          marginTop: 20,
          textAlign: "center",
          background: "white",
          padding: "12px 24px",
          borderRadius: 12,
          boxShadow: "0 4px 12px rgba(11,23,54,0.10)"
        }}>
          <div style={{ fontSize: 11.5, fontWeight: 800, color: product.color, textTransform: "uppercase", letterSpacing: "0.08em" }}>
            {product.categoryLabel}
          </div>
          <div style={{ fontSize: 16, fontWeight: 800, color: "var(--ink)", marginTop: 4 }}>{product.name}</div>
          <div style={{ fontSize: 10, color: "var(--muted)", marginTop: 6 }}>CANECA · 20 L</div>
        </div>
      </div>
    );
  }

  // Fallback al diseño CSS original si no hay imagen
  return (
    <div style={{ position: "relative", width: 260, height: 420 }}>
      <div style={{
        position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 92, height: 40,
        background: "linear-gradient(180deg, var(--soley-blue-deep) 0%, #061B40 100%)",
        borderRadius: "8px 8px 0 0", boxShadow: "inset -8px 0 16px rgba(0,0,0,0.25)"
      }} />
      <div style={{
        position: "absolute", top: 40, left: "50%", transform: "translateX(-50%)", width: 72, height: 32,
        background: "linear-gradient(90deg, #5683C8, #1E5BBA, #5683C8)", boxShadow: "inset 0 -4px 8px rgba(0,0,0,0.2)"
      }} />
      <div style={{
        position: "absolute", top: 72, left: 0, right: 0, bottom: 0,
        background: "linear-gradient(135deg, #4F86D5 0%, #1E5BBA 50%, #143F87 100%)",
        borderRadius: "24px 24px 48px 48px",
        boxShadow: "inset -22px 0 40px rgba(0,0,0,0.20), inset 18px 0 30px rgba(255,255,255,0.22), 0 30px 60px rgba(11,23,54,0.20)",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: 16, left: 20, width: 24, bottom: 40,
          background: "rgba(255,255,255,0.30)", borderRadius: 999, filter: "blur(3px)"
        }} />
        <div style={{
          position: "absolute", top: "22%", left: "14%", right: "14%", height: "58%",
          background: "white", borderRadius: 12,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          gap: 8, padding: 14, textAlign: "center", boxShadow: "0 4px 12px rgba(11,23,54,0.10)",
        }}>
          <span style={{ fontSize: 22, fontWeight: 800, color: "var(--soley-blue)", letterSpacing: "-0.02em" }}>SOLEY</span>
          <div style={{
            background: "var(--soley-red)", color: "white", padding: "3px 10px", borderRadius: 3,
            fontSize: 8.5, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
          }}>Amenities & Limpieza</div>
          <div style={{ borderTop: "1px solid var(--border)", paddingTop: 8, marginTop: 4, width: "100%" }}>
            <div style={{ fontSize: 11.5, fontWeight: 800, color: product.color, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              {product.categoryLabel}
            </div>
            <div style={{ fontSize: 14, fontWeight: 800, color: "var(--ink)", marginTop: 4, lineHeight: 1.1 }}>{product.name}</div>
            <div style={{ fontSize: 9.5, color: "var(--muted)", marginTop: 6, fontFamily: "var(--font-mono)" }}>GALÓN · 4 L</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductLineup() {
  const productsToShow = [
    { src: "/productos/Alcohol Antiséptico Litro.png", label: "1 L", name: "Alcohol Antiséptico", scale: 0.85 },
    { src: "/productos/Desinfectante Caneca.png", label: "Caneca 20 L", name: "Desinfectante", scale: 1 },
    { src: "/productos/Jabón de Manos Galón.png", label: "Galón 4 L", name: "Jabón", scale: 0.9 },
  ];

  return (
    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 24, height: "85%" }}>
      {productsToShow.map((p, i) => (
        <div key={i} style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-end",
        }}>
          <div style={{
            width: 200,
            height: 280,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <Image
              src={p.src}
              alt={p.name}
              width={180 * (p.scale || 1)}
              height={260 * (p.scale || 1)}
              style={{
                objectFit: "contain",
                filter: "drop-shadow(0 15px 30px rgba(11,23,54,0.15))",
              }}
              priority
            />
          </div>
          <div style={{
            marginTop: 12,
            background: "white",
            border: "1px solid var(--border)",
            borderRadius: 8,
            padding: "10px 18px",
            textAlign: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            minWidth: 120
          }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: "var(--soley-blue)", letterSpacing: "0.04em" }}>SOLEY</div>
            <div style={{
              background: "var(--soley-red)",
              color: "white",
              padding: "3px 8px",
              borderRadius: 3,
              fontSize: 8,
              fontWeight: 700,
              marginTop: 4,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}>Limpieza</div>
            <div style={{ fontSize: 10, color: "var(--soley-blue)", marginTop: 5, fontWeight: 700 }}>{p.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
