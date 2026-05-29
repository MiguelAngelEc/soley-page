"use client";

"use client";

import { useState } from "react";
import type { Product, PresentationType } from "@/data/products";
import { ProductIllustration } from "./ProductIllustration";
import { ArrowIcon } from "@/components/shared/Icons";

export function ProductCard({ product, mode, onOpen }: { product: Product; mode: PresentationType; onOpen: () => void }) {
  const [hover, setHover] = useState(false);
  const presentations = product.presentations.filter((p) => p.type === mode);

  return (
    <article
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onOpen}
      style={{
        background: "white", borderRadius: 24, overflow: "hidden",
        border: "1px solid var(--border)", cursor: "pointer",
        transition: "transform .25s ease, box-shadow .25s ease, border-color .2s",
        transform: hover ? "translateY(-6px)" : "translateY(0)",
        boxShadow: hover ? "var(--shadow-lg)" : "var(--shadow-sm)",
        borderColor: hover ? "var(--border-strong)" : "var(--border)",
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
        }}>
          <span style={{ width: 6, height: 6, borderRadius: 999, background: product.color }} />
          {product.categoryLabel}
        </div>

        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <ProductIllustration product={product} hover={hover} />
        </div>

        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(0deg, rgba(30,91,186,0.92) 0%, rgba(30,91,186,0.6) 100%)",
          opacity: hover ? 1 : 0, transition: "opacity .25s",
          display: "flex", alignItems: "center", justifyContent: "center", color: "white",
        }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontWeight: 700, fontSize: 15 }}>
            Ver detalle <ArrowIcon width={16} height={16} />
          </span>
        </div>
      </div>

      <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 14, flex: 1 }}>
        <div>
          <div style={{ fontSize: 12.5, fontWeight: 600, color: "var(--muted)", marginBottom: 4 }}>{product.tagline}</div>
          <h3 style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em" }}>{product.name}</h3>
        </div>

        <div style={{ marginTop: "auto", paddingTop: 16, borderTop: "1px solid var(--border)" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>
            {mode === "mayoreo" ? "Para empresas" : "Para hogar"}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {presentations.map((p) => (
              <span key={p.size} style={{
                padding: "6px 12px", background: "var(--bg-blue-tint)",
                color: "var(--soley-blue-deep)", borderRadius: 999,
                fontSize: 12.5, fontWeight: 600, whiteSpace: "nowrap",
              }}>{p.size}</span>
            ))}
            {presentations.length === 0 && (<span style={{ fontSize: 13, color: "var(--muted)" }}>—</span>)}
          </div>
        </div>
      </div>
    </article>
  );
}
