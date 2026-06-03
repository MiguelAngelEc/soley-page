"use client";

import { useState, useEffect } from "react";
import type { Product, PresentationType } from "@/data/products";
import { ArrowIcon } from "@/components/shared/Icons";
import Image from "next/image";

export function ProductCard({ product, mode, onOpen }: { product: Product; mode: PresentationType; onOpen: () => void }) {
  const [hoverCard, setHoverCard] = useState(false);
  const [hoverImage, setHoverImage] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Todas las presentaciones disponibles (las 3)
  const allPresentations = product.presentations;
  const currentPresentation = allPresentations[currentIndex];

  // Función para cambiar de presentación con efecto fade
  const changePresentation = (newIndex: number) => {
    if (newIndex === currentIndex || isTransitioning) return;

    setIsTransitioning(true);

    setTimeout(() => {
      setCurrentIndex(newIndex);

      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    }, 200);
  };

  // Rotación automática constante cada 4 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isTransitioning) {
        changePresentation((currentIndex + 1) % allPresentations.length);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [currentIndex, isTransitioning, allPresentations.length]);

  return (
    <article
      onMouseEnter={() => setHoverCard(true)}
      onMouseLeave={() => setHoverCard(false)}
      style={{
        background: "white", borderRadius: 24, overflow: "hidden",
        border: "1px solid var(--border)", cursor: "default",
        transition: "transform .25s ease, box-shadow .25s ease, border-color .2s",
        transform: hoverCard ? "translateY(-6px)" : "translateY(0)",
        boxShadow: hoverCard ? "var(--shadow-lg)" : "var(--shadow-sm)",
        borderColor: hoverCard ? "var(--border-strong)" : "var(--border)",
        display: "flex", flexDirection: "column",
      }}
    >
      <div style={{
        position: "relative", aspectRatio: "1 / 1",
        background: "linear-gradient(160deg, #FAFCFE 0%, #EEF4FB 100%)",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: 16, left: 16, width: 100, height: 100,
          backgroundImage: "radial-gradient(var(--soley-blue) 1px, transparent 1.5px)",
          backgroundSize: "10px 10px", opacity: 0.30,
          maskImage: "linear-gradient(135deg, black 30%, transparent 80%)",
          WebkitMaskImage: "linear-gradient(135deg, black 30%, transparent 80%)",
        }} />

        <div style={{
          position: "absolute", top: 16, right: 16,
          padding: "6px 12px", borderRadius: 999,
          fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em",
          background: "white", color: product.color, border: "1px solid var(--border)",
          display: "flex", alignItems: "center", gap: 6,
          zIndex: 3,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: 999, background: product.color }} />
          {product.categoryLabel}
        </div>

        {/* Contenedor de la imagen con fade */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 32,
            opacity: isTransitioning ? 0 : 1,
            transition: "opacity 0.2s ease-out",
            cursor: "pointer",
          }}
          onMouseEnter={() => setHoverImage(true)}
          onMouseLeave={() => setHoverImage(false)}
          onClick={onOpen}
        >
          <Image
            src={currentPresentation.image}
            alt={`${product.name} - ${currentPresentation.volume}`}
            width={220}
            height={220}
            style={{
              objectFit: "contain",
              maxWidth: "100%",
              maxHeight: "100%",
              filter: hoverCard ? "drop-shadow(0 20px 40px rgba(11,23,54,0.18))" : "drop-shadow(0 10px 25px rgba(11,23,54,0.12))",
              transition: "filter 0.25s",
            }}
            priority
          />

          {/* Overlay Ver detalle - Solo sobre la imagen */}
          <div style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(0deg, rgba(30,91,186,0.92) 0%, rgba(30,91,186,0.6) 100%)",
            opacity: hoverImage ? 1 : 0,
            transition: "opacity .25s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            borderRadius: 16,
          }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontWeight: 700, fontSize: 15 }}>
              Ver detalle <ArrowIcon width={16} height={16} />
            </span>
          </div>
        </div>

        {/* Indicadores de presentación */}
        <div style={{
          position: "absolute",
          bottom: 16,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: 6,
          zIndex: 2,
        }}>
          {allPresentations.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                changePresentation(index);
              }}
              style={{
                width: currentIndex === index ? 24 : 8,
                height: 8,
                borderRadius: 999,
                background: currentIndex === index ? product.color : "rgba(0,0,0,0.2)",
                border: "none",
                transition: "all 0.25s",
                cursor: "pointer",
              }}
              aria-label={`Ver presentación ${allPresentations[index].volume}`}
            />
          ))}
        </div>

        {/* Etiqueta de tamaño actual */}
        <div style={{
          position: "absolute",
          bottom: 16,
          left: 16,
          background: "white",
          padding: "8px 14px",
          borderRadius: 12,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          display: "flex",
          alignItems: "center",
          gap: 8,
          opacity: isTransitioning ? 0 : 1,
          transition: "opacity 0.2s ease-out",
          zIndex: 2,
        }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Presentación
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, color: product.color }}>
            {currentPresentation.volume}
          </div>
        </div>
      </div>

      <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 14, flex: 1 }}>
        <div>
          <div style={{ fontSize: 12.5, fontWeight: 600, color: "var(--muted)", marginBottom: 4 }}>{product.tagline}</div>
          <h3 style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em" }}>{product.name}</h3>
        </div>

        {/* Precio dinámico */}
        <div style={{
          background: "var(--bg-soft)",
          padding: "12px 16px",
          borderRadius: 12,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          opacity: isTransitioning ? 0 : 1,
          transition: "opacity 0.2s ease-out",
        }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: "var(--muted)", marginBottom: 2 }}>
              Precio desde
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, color: product.color, letterSpacing: "-0.02em" }}>
              ${currentPresentation.price}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: "var(--muted)" }}>
              {currentPresentation.type === "mayoreo" ? "Al Por Mayor" : "Al Por Menor"}
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--ink)", marginTop: 2 }}>
              {currentPresentation.size}
            </div>
          </div>
        </div>

      </div>
    </article>
  );
}