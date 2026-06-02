"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { products, categories } from "@/data/products";
import type { Product, ProductCategory, PresentationType } from "@/data/products";
import { ProductCard } from "./ProductCard";
import { ProductModal } from "./ProductModal";
import { useReveal } from "@/lib/hooks";
import { ArrowIcon, WhatsAppIcon } from "@/components/shared/Icons";

export function Catalog() {
  const [cat, setCat] = useState<ProductCategory | "all">("all");
  const [mode, setMode] = useState<PresentationType>("menudeo");
  const [modalProduct, setModalProduct] = useState<Product | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [gridHeight, setGridHeight] = useState<number | "auto">("auto");
  const gridRef = useRef<HTMLDivElement | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  useReveal(sectionRef);

  const filtered = useMemo(() => {
    if (cat === "all") return products;
    return products.filter((p) => p.category === cat);
  }, [cat]);

  const handleCategoryChange = (newCat: ProductCategory | "all") => {
    if (newCat === cat) return;

    if (gridRef.current) {
      setGridHeight(gridRef.current.offsetHeight);
    }

    setIsTransitioning(true);

    setTimeout(() => {
      setCat(newCat);

      setTimeout(() => {
        setGridHeight("auto");
        setIsTransitioning(false);
      }, 50);
    }, 150);
  };

  useEffect(() => {
    const handleResize = () => {
      if (!isTransitioning) {
        setGridHeight("auto");
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isTransitioning]);

  return (
    <section id="productos" ref={sectionRef} className="section-y" style={{ background: "var(--bg-soft)", position: "relative", overflow: "hidden" }}>
      <div className="halftone" style={{ top: -40, right: -60, width: 320, height: 320, opacity: 0.12 }} />

      <div className="container-x" style={{ position: "relative" }}>
        <div className="section-head reveal">
          <span className="eyebrow"><span className="dot" />Catálogo</span>
          <h2>Productos pensados para <span className="accent">cada uso</span></h2>
          <p className="lead">Seis productos esenciales, cada uno en tres presentaciones. Desde el hogar hasta la operación industrial.</p>
        </div>

        <div className="catalog-controls reveal">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {categories.map((c) => (
              <button key={c.id} onClick={() => handleCategoryChange(c.id)}
                style={{
                  padding: "10px 20px", borderRadius: 999,
                  fontSize: 14, fontWeight: 600,
                  background: cat === c.id ? "var(--soley-blue)" : "white",
                  color: cat === c.id ? "white" : "var(--ink-2)",
                  border: cat === c.id ? "1px solid var(--soley-blue)" : "1px solid var(--border)",
                  transition: "all .15s",
                  boxShadow: cat === c.id ? "var(--shadow-blue)" : "var(--shadow-sm)",
                }}>{c.label}</button>
            ))}
          </div>

          <div style={{
            background: "white", padding: 4, borderRadius: 999,
            border: "1px solid var(--border)", display: "flex", position: "relative",
          }}>
            <div
              className="mode-slider"
              style={{
                position: "absolute",
                top: 4,
                left: mode === "menudeo" ? 4 : "50%",
                width: "calc(50% - 4px)",
                height: "calc(100% - 8px)",
                background: "var(--soley-red)",
                borderRadius: 999,
                transition: "left 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                zIndex: 0,
              }}
            />
            {([
              { id: "menudeo", label: "Menudeo · Hogar" },
              { id: "mayoreo", label: "Mayoreo · Empresas" },
            ] as const).map((m) => (
              <button key={m.id} onClick={() => setMode(m.id)}
                style={{
                  padding: "10px 18px", borderRadius: 999,
                  fontSize: 13.5, fontWeight: 700,
                  color: mode === m.id ? "white" : "var(--muted)",
                  background: "transparent",
                  transition: "color .2s", position: "relative", zIndex: 1,
                  flex: 1,
                }}>{m.label}</button>
            ))}
          </div>
        </div>

        <div
          ref={gridRef}
          className="catalog-grid-wrapper"
          style={{
            marginTop: 32,
            height: gridHeight,
            transition: "height 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <div
            className="catalog-grid reveal-stagger"
            style={{
              opacity: isTransitioning ? 0 : 1,
              transform: isTransitioning ? "translateY(10px)" : "translateY(0)",
              transition: "opacity 0.15s ease-out, transform 0.15s ease-out",
            }}
          >
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} mode={mode} onOpen={() => setModalProduct(p)} />
            ))}
          </div>
        </div>

        <div className="reveal" style={{
          marginTop: 56,
          background: "linear-gradient(135deg, var(--soley-blue-deep) 0%, var(--soley-blue) 100%)",
          borderRadius: 32, padding: "48px 56px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          gap: 32, flexWrap: "wrap", color: "white", position: "relative", overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", top: -40, right: -40, width: 260, height: 260,
            backgroundImage: "radial-gradient(white 1.5px, transparent 2px)",
            backgroundSize: "16px 16px", opacity: 0.10,
          }} />
          <div style={{ position: "relative", maxWidth: 540 }}>
            <h3 style={{ color: "white", fontSize: 28, marginBottom: 8 }}>¿Necesitas precios al mayoreo?</h3>
            <p style={{ color: "rgba(255,255,255,0.82)", fontSize: 15.5 }}>
              Cotizamos tu pedido en menos de 24 horas. Desde 4 canecas en adelante con descuentos por volumen.
            </p>
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", position: "relative" }}>
            <a href="#contacto" className="btn btn-red">Solicitar cotización<ArrowIcon width={16} height={16} /></a>
            <a href="https://wa.me/593961264102" className="btn btn-outline-white"><WhatsAppIcon width={16} height={16} />WhatsApp directo</a>
          </div>
        </div>
      </div>

      {modalProduct && (<ProductModal product={modalProduct} onClose={() => setModalProduct(null)} />)}

      <style>{`
        .catalog-controls {
          display: flex; justify-content: space-between; align-items: center;
          gap: 24px; flex-wrap: wrap;
        }
        .catalog-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
        .catalog-grid-wrapper {
          will-change: height;
        }
        @media (max-width: 980px) { .catalog-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 640px) { .catalog-grid { grid-template-columns: 1fr; } }
      `}</style>
    </section>
  );
}
