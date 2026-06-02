"use client";

import { useRef } from "react";
import { useReveal } from "@/lib/hooks";
import { IgIcon } from "@/components/shared/Icons";
import Image from "next/image";

type TileType = "product" | "promo" | "behind" | "quote";

interface Tile {
  type: TileType;
  title: string;
  body?: string;
  color: string;
  image?: string;
}

const tiles: Tile[] = [
  { type: "product", title: "Promoción 1", color: "#3B82F6", image: "/IG/1.png" },
  { type: "product", title: "Promoción 2", color: "#06B6D4", image: "/IG/2.png" },
  { type: "quote", title: "5★", body: "\"Calidad consistente caneca tras caneca.\"", color: "var(--soley-red)" },
  { type: "product", title: "Promoción 3", color: "var(--soley-blue)", image: "/IG/3.png" },
  { type: "behind", title: "En planta", body: "Cómo formulamos nuestro desinfectante multiusos.", color: "var(--soley-blue-deep)" },
  { type: "product", title: "Promoción 4", color: "#F59E0B", image: "/IG/4.png" },
];

export function Instagram() {
  const sectionRef = useRef<HTMLElement | null>(null);
  useReveal(sectionRef);

  return (
    <section ref={sectionRef} className="section-y" style={{ background: "var(--bg-soft)" }}>
      <div className="container-x">
        <div className="reveal" style={{
          display: "flex", alignItems: "flex-end", justifyContent: "space-between",
          marginBottom: 40, gap: 24, flexWrap: "wrap",
        }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span className="eyebrow"><span className="dot" />@soleyjaboneria</span>
            <h2 style={{ marginTop: 16, marginBottom: 12 }}>Síguenos en <span className="accent">Instagram</span></h2>
            <p style={{ fontSize: 15, color: "var(--muted)" }}>Promociones, lanzamientos y detrás de cámaras de nuestra planta.</p>
          </div>
          <a href="https://instagram.com/soleyjaboneria" target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
            <IgIcon width={18} height={18} />Ver perfil
          </a>
        </div>

        <div className="ig-grid reveal-stagger">
          {tiles.map((t, i) => {
            const isLight = t.type === "promo" || t.type === "behind";
            return (
              <a key={i} href="https://instagram.com/soleyjaboneria" target="_blank" rel="noopener noreferrer"
                style={{
                  position: "relative", aspectRatio: "1 / 1",
                  borderRadius: 18, overflow: "hidden",
                  background: isLight
                    ? `linear-gradient(135deg, ${t.color}, ${t.color === "var(--soley-red)" ? "var(--soley-red-deep)" : "var(--soley-blue-deep)"})`
                    : "white",
                  border: "1px solid var(--border)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: isLight || t.type === "quote" ? "white" : "var(--ink)",
                  padding: 20, cursor: "pointer", transition: "transform .25s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.02)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
              >
                <div style={{
                  position: "absolute", top: 0, left: 0, width: "60%", height: "60%",
                  backgroundImage: `radial-gradient(${t.type === "product" ? "var(--soley-blue)" : "white"} 1.5px, transparent 2px)`,
                  backgroundSize: "12px 12px",
                  opacity: t.type === "product" ? 0.20 : 0.18,
                  maskImage: "linear-gradient(135deg, black 30%, transparent 80%)",
                  WebkitMaskImage: "linear-gradient(135deg, black 30%, transparent 80%)",
                }} />
                <div style={{
                  position: "absolute", top: 12, right: 12,
                  width: 32, height: 32, borderRadius: 999,
                  background: "rgba(255,255,255,0.92)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: t.type === "product" ? "var(--ink)" : t.color === "var(--soley-red)" ? "var(--soley-red)" : "var(--soley-blue)",
                }}>
                  <IgIcon width={16} height={16} />
                </div>

                {t.type === "product" && (
                  t.image ? (
                    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Image
                        src={t.image}
                        alt={t.title}
                        fill
                        style={{
                          objectFit: "cover",
                        }}
                      />
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                      <div style={{ width: 80, height: 110, background: t.color, borderRadius: "8px 8px 14px 14px" }} />
                      <div style={{ marginTop: 12, fontSize: 13.5, fontWeight: 700, color: "var(--soley-blue-deep)" }}>{t.title}</div>
                    </div>
                  )
                )}
                {t.type === "promo" && (
                  <div style={{ textAlign: "center", position: "relative" }}>
                    <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.10em", textTransform: "uppercase", opacity: 0.85, marginBottom: 8 }}>
                      Promoción
                    </div>
                    <h3 style={{ color: "white", fontSize: 24, lineHeight: 1.1, marginBottom: 10 }}>{t.title}</h3>
                    <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 12.5, lineHeight: 1.4 }}>{t.body}</p>
                  </div>
                )}
                {t.type === "behind" && (
                  <div style={{ textAlign: "center", position: "relative" }}>
                    <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.10em", textTransform: "uppercase", opacity: 0.85, marginBottom: 8 }}>
                      Behind the scenes
                    </div>
                    <h3 style={{ color: "white", fontSize: 22, lineHeight: 1.1, marginBottom: 10 }}>{t.title}</h3>
                    <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 12.5, lineHeight: 1.4 }}>{t.body}</p>
                  </div>
                )}
                {t.type === "quote" && (
                  <div style={{ textAlign: "center", position: "relative", padding: 12 }}>
                    <div style={{ fontSize: 32, fontWeight: 800, color: "var(--soley-red)", lineHeight: 1, marginBottom: 8 }}>{t.title}</div>
                    <p style={{ fontStyle: "italic", color: "var(--ink-2)", fontSize: 13, lineHeight: 1.5 }}>{t.body}</p>
                    <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 10, fontWeight: 600 }}>— Cliente Soley</div>
                  </div>
                )}
              </a>
            );
          })}
        </div>
      </div>

      <style>{`
        .ig-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 14px; }
        @media (max-width: 980px) { .ig-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 540px) { .ig-grid { grid-template-columns: repeat(2, 1fr); } }
      `}</style>
    </section>
  );
}
