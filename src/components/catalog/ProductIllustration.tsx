"use client";

import type { Product } from "@/data/products";
import Image from "next/image";

export function ProductIllustration({ product, hover }: { product: Product; hover: boolean }) {
  // Mapeo de IDs de productos a nombres de archivos de imagen
  const productImages: Record<string, string> = {
    "gel-antibacterial": "/productos/Gel Galón.png",
    "alcohol-antiseptico": "/productos/Alcohol Galón.png",
    "desinfectante": "/productos/Desinfectante Galon.png",
    "jabon-liquido": "/productos/Jabón de Manos Galón.png",
    "cloro-5": "/productos/Cloro Galón.png",
    "detergente-liquido": "/productos/Detergente Galón.png",
  };

  const imageSrc = productImages[product.id];

  // Si no hay imagen, usar el diseño CSS original como fallback
  if (!imageSrc) {
    return (
      <div style={{
        position: "relative", width: 180, height: 240,
        transition: "transform .35s", transform: hover ? "scale(1.04)" : "scale(1)",
      }}>
        <div style={{
          position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
          width: 64, height: 26,
          background: "var(--soley-blue-deep)",
          borderRadius: "6px 6px 0 0",
        }} />
        <div style={{
          position: "absolute", top: 26, left: "50%", transform: "translateX(-50%)",
          width: 52, height: 22,
          background: "linear-gradient(90deg, #5683C8, #1E5BBA, #5683C8)",
        }} />
        <div style={{
          position: "absolute", top: 48, left: 0, right: 0, bottom: 0,
          background: "linear-gradient(135deg, #4F86D5 0%, #1E5BBA 60%, #143F87 100%)",
          borderRadius: "18px 18px 32px 32px",
          boxShadow: "inset -16px 0 30px rgba(0,0,0,0.18), inset 14px 0 24px rgba(255,255,255,0.22)",
          overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", top: 12, left: 14, width: 18, bottom: 28,
            background: "rgba(255,255,255,0.35)", borderRadius: 999, filter: "blur(2px)",
          }} />
          <div style={{
            position: "absolute", top: "30%", left: "12%", right: "12%", height: "50%",
            background: "white", borderRadius: 8,
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            gap: 4, padding: 8, textAlign: "center",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ fontSize: 14, fontWeight: 800, color: "var(--soley-blue)", letterSpacing: "0.04em" }}>SOLEY</span>
            </div>
            <div style={{
              background: product.color, color: "white",
              padding: "3px 8px", borderRadius: 4,
              fontSize: 9, fontWeight: 700,
              textTransform: "uppercase", letterSpacing: "0.08em",
            }}>{product.categoryLabel}</div>
            <div style={{ fontSize: 10, fontWeight: 700, color: "var(--ink-2)", marginTop: 2, lineHeight: 1.1 }}>{product.name}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      position: "relative", width: 200, height: 200,
      transition: "transform .35s", transform: hover ? "scale(1.1)" : "scale(1)",
    }}>
      <Image
        src={imageSrc}
        alt={product.name}
        width={200}
        height={200}
        style={{
          objectFit: "contain",
          filter: hover ? "drop-shadow(0 8px 16px rgba(0,0,0,0.15))" : "drop-shadow(0 4px 8px rgba(0,0,0,0.1))",
          transition: "filter .35s",
        }}
        priority={product.featured}
      />
    </div>
  );
}
