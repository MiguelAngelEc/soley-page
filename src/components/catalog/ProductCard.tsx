"use client";

import { useState } from "react";
import { isLightColor } from "@/data/products";
import type { Product } from "@/data/products";
import { WhatsAppIcon } from "@/components/shared/Icons";
import { LazyWhatsAppModal as WhatsAppModal } from "@/components/shared/LazyWhatsAppModal";
import Image from "next/image";
import { preloadStageImage } from "./ProductStage";

export function ProductCard({ product, presentation, onSelectPresentation, onInteract, onOpen }: {
  product: Product;
  /** Presentacion visible, compartida por todas las tarjetas (la decide Catalog). */
  presentation: number;
  onSelectPresentation: (index: number) => void;
  /** Avisa si el visitante esta sobre la tarjeta (hover o foco por teclado) para pausar el slider. */
  onInteract: (active: boolean) => void;
  /** Abre el escenario; recibe el boton de la imagen para la transicion. */
  onOpen: (card: HTMLElement) => void;
}) {
  const [hoverCard, setHoverCard] = useState(false);
  const [quoteOpen, setQuoteOpen] = useState(false);
  // Un color muy claro (Gel, blanco) no se lee sobre la tarjeta: los textos
  // pasan a gris y los puntos blancos llevan un borde.
  const light = isLightColor(product.color);
  const textColor = light ? "var(--muted)" : product.color;
  const dotRing = light ? "inset 0 0 0 1px rgba(11,23,54,0.3)" : "none";

  // Todas las presentaciones disponibles (las 3)
  const allPresentations = product.presentations;
  const currentPresentation = allPresentations[presentation];

  return (
    <article
      onMouseEnter={() => { setHoverCard(true); onInteract(true); }}
      onMouseLeave={() => { setHoverCard(false); onInteract(false); }}
      // Pausa por foco solo con teclado: al cerrar el escenario el foco vuelve
      // aqui por programa y no debe dejar el slider detenido.
      onFocus={(e) => { if (e.target.matches(":focus-visible")) onInteract(true); }}
      onBlur={() => onInteract(false)}
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
          background: "white", color: textColor, border: "1px solid var(--border)",
          display: "flex", alignItems: "center", gap: 6,
          zIndex: 3,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: 999, background: product.color, boxShadow: dotRing }} />
          {product.categoryLabel}
        </div>

        {/* Las 3 presentaciones apiladas: la visible tiene opacidad 1 y el
            cambio es un fundido cruzado por CSS, sin temporizadores. */}
        <button
          type="button"
          className="product-card-open-btn"
          style={{
            position: "absolute",
            inset: 0,
            cursor: "pointer",
            background: "none",
            border: "none",
            width: "100%",
          }}
          onPointerEnter={() => preloadStageImage(currentPresentation.image)}
          onTouchStart={() => preloadStageImage(currentPresentation.image)}
          onFocus={() => preloadStageImage(currentPresentation.image)}
          onClick={(e) => onOpen(e.currentTarget)}
          aria-label={`Ver detalle de ${product.name}`}
        >
          {allPresentations.map((p, i) => (
            <div
              key={p.size}
              data-active={i === presentation ? "" : undefined}
              style={{
                position: "absolute", inset: 32,
                display: "flex", alignItems: "center", justifyContent: "center",
                opacity: i === presentation ? 1 : 0,
                transition: "opacity 0.45s ease",
              }}
            >
              <Image
                src={p.image}
                alt={i === presentation ? `${product.name} - ${p.volume}` : ""}
                width={220}
                height={220}
                style={{
                  objectFit: "contain",
                  maxWidth: "100%",
                  maxHeight: "100%",
                  filter: hoverCard ? "drop-shadow(0 20px 40px rgba(11,23,54,0.18))" : "drop-shadow(0 10px 25px rgba(11,23,54,0.12))",
                  transition: "filter 0.25s",
                }}
              />
            </div>
          ))}
        </button>

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
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSelectPresentation(index);
              }}
              style={{
                padding: 8, background: "none", border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
              aria-label={`Ver presentación ${allPresentations[index].volume}`}
              aria-current={presentation === index ? "true" : undefined}
            >
              <span style={{
                width: presentation === index ? 24 : 8,
                height: 8,
                borderRadius: 999,
                background: presentation === index ? product.color : "rgba(0,0,0,0.2)",
                boxShadow: presentation === index ? dotRing : "none",
                transition: "all 0.25s",
                display: "block",
              }} />
            </button>
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
          zIndex: 2,
        }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Presentación
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, color: textColor }}>
            {currentPresentation.volume}
          </div>
        </div>
      </div>

      <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 14, flex: 1 }}>
        <div>
          <div style={{ fontSize: 12.5, fontWeight: 600, color: "var(--muted)", marginBottom: 4 }}>{product.tagline}</div>
          <h3 style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em" }}>{product.name}</h3>
        </div>

        {/* Cotización: sustituye al precio hasta tener lista de precios publicable */}
        <button
          onClick={() => setQuoteOpen(true)}
          style={{
            background: "var(--bg-soft)",
            padding: "12px 16px",
            borderRadius: 12,
            border: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            width: "100%",
            textAlign: "left",
            transition: "border-color 0.2s, background 0.2s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--border-strong)"; e.currentTarget.style.background = "white"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.background = "var(--bg-soft)"; }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
            <span style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              width: 34, height: 34, borderRadius: 10,
              background: "#E8F8EE", color: "#16A34A", flexShrink: 0,
            }}>
              <WhatsAppIcon width={17} height={17} />
            </span>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13.5, fontWeight: 700, letterSpacing: "-0.01em" }}>Cotiza por WhatsApp</div>
              <div style={{ fontSize: 11, fontWeight: 500, color: "var(--muted)", marginTop: 1 }}>Respuesta en ~1 hora</div>
            </div>
          </div>
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: "var(--muted)" }}>
              {currentPresentation.type === "mayoreo" ? "Al por mayor" : "Al por menor"}
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--ink)", marginTop: 2 }}>
              {currentPresentation.size}
            </div>
          </div>
        </button>

      </div>

      <WhatsAppModal
        isOpen={quoteOpen}
        onClose={() => setQuoteOpen(false)}
        selectedProduct={product}
        initialType={currentPresentation.type === "mayoreo" ? "mayoreo" : "hogar"}
      />
    </article>
  );
}