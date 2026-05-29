"use client";

import { useRef } from "react";
import { useReveal } from "@/lib/hooks";
import { ArrowIcon, CheckIcon } from "@/components/shared/Icons";

const steps = [
  { n: "01", title: "Formulación", desc: "Cada receta nace en nuestro laboratorio. Probamos pH, viscosidad y eficacia antes de escalar." },
  { n: "02", title: "Mezcla y control", desc: "Tanques de acero inoxidable y agitadores calibrados aseguran homogeneidad lote a lote." },
  { n: "03", title: "Envasado", desc: "Llenado en línea automatizada con sellado al vacío para máxima conservación." },
  { n: "04", title: "Despacho", desc: "Etiquetado, paletizado y entrega directa con nuestra propia flota en Imbabura." },
];

export function Process() {
  const sectionRef = useRef<HTMLElement | null>(null);
  useReveal(sectionRef);

  return (
    <section ref={sectionRef} className="section-y" style={{ background: "white", position: "relative", overflow: "hidden" }}>
      <div className="container-x">
        <div className="process-grid">
          <div className="reveal">
            <span className="eyebrow"><span className="dot" />Nuestro proceso</span>
            <h2 style={{ marginTop: 16, marginBottom: 20 }}>De la planta a tu <span className="accent">puerta</span>, sin intermediarios</h2>
            <p className="lead" style={{ marginBottom: 28 }}>
              Toda nuestra cadena de valor ocurre bajo un mismo techo. Eso nos permite ofrecer precios justos y mantener consistencia en cada lote.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 32 }}>
              {[
                "Planta propia en Ibarra, Imbabura",
                "Materias primas certificadas",
                "Lote rastreable por código QR",
                "Visitas guiadas para clientes B2B",
              ].map((b) => (
                <div key={b} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{
                    width: 24, height: 24, borderRadius: 999,
                    background: "var(--bg-blue-tint)", color: "var(--soley-blue)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <CheckIcon width={14} height={14} />
                  </div>
                  <span style={{ fontSize: 15, fontWeight: 500, color: "var(--ink-2)" }}>{b}</span>
                </div>
              ))}
            </div>

            <a href="#contacto" className="btn btn-blue">Agendar visita<ArrowIcon width={16} height={16} /></a>
          </div>

          <div className="reveal-stagger" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {steps.map((s, i) => (
              <div key={s.n} style={{
                padding: 24,
                background: i % 2 === 0 ? "var(--bg-soft)" : "white",
                border: "1px solid var(--border)",
                borderRadius: 20, position: "relative",
                marginTop: i % 2 === 1 ? 32 : 0,
              }}>
                <div style={{
                  fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 700,
                  color: "var(--soley-red)", marginBottom: 16,
                }}>{s.n}</div>
                <h3 style={{ fontSize: 19, marginBottom: 8 }}>{s.title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.5 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .process-grid { display: grid; grid-template-columns: 1fr 1.1fr; gap: 80px; align-items: center; }
        @media (max-width: 980px) { .process-grid { grid-template-columns: 1fr; gap: 48px; } }
      `}</style>
    </section>
  );
}
