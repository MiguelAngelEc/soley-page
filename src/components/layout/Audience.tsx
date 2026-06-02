"use client";

import { useRef } from "react";
import { useReveal } from "@/lib/hooks";
import { ArrowIcon, CheckIcon, DropIcon, FactoryIcon, WhatsAppIcon } from "@/components/shared/Icons";

export function Audience() {
  const sectionRef = useRef<HTMLElement | null>(null);
  useReveal(sectionRef);

  return (
    <section id="empresas" ref={sectionRef} className="section-y" style={{ background: "var(--bg-soft)", position: "relative", overflow: "hidden" }}>
      <div className="container-x">
        <div className="section-head center reveal">
          <span className="eyebrow"><span className="dot" />Soluciones</span>
          <h2>Misma calidad, <span className="accent">distinta presentación</span></h2>
          <p className="lead">Servimos al hogar con cariño y a la operación industrial con disciplina. Tú decides cómo te entregamos.</p>
        </div>

        <div className="reveal-stagger audience-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          {/* HOGAR */}
          <article className="audience-card" style={{
            borderRadius: 28,
            overflow: "hidden",
            border: "1px solid var(--border)",
            display: "flex",
            flexDirection: "column",
            position: "relative",
            minHeight: 480,
            isolation: "isolate",
          }}>
            {/* Capa de imagen — cubre TODO el article */}
            <div style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `linear-gradient(rgba(255,255,255,0.85), rgba(255,255,255,0.75)), url('/Img-fondo/img-familia.png')`,
              backgroundSize: "cover",
              backgroundPosition: "center 20%",
              backgroundRepeat: "no-repeat",
              zIndex: 0,
            }} />

            {/* Contenido por encima */}
            <div style={{
              padding: "40px 40px 40px",
              position: "relative",
              zIndex: 1,
              flex: 1,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 16,
                  background: "linear-gradient(135deg, var(--soley-red) 0%, var(--soley-red-deep) 100%)",
                  display: "flex", alignItems: "center", justifyContent: "center", color: "white",
                  boxShadow: "var(--shadow-red)",
                }}>
                  <DropIcon width={26} height={26} />
                </div>
                <span className="eyebrow eyebrow-red"><span className="dot" />Para tu hogar</span>
              </div>

              <h3 style={{ fontSize: 32, marginBottom: 12 }}>
                Productos profesionales <span style={{ color: "var(--soley-red)" }}>al alcance de la familia</span>
              </h3>
              <p style={{ fontSize: 15.5, lineHeight: 1.6, marginBottom: 28 }}>
                La misma fórmula que usan hoteles 4 estrellas, en botellas pensadas para tu cocina, baño y lavandería.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 32 }}>
                {[
                  "Presentaciones 1L y galón 4L",
                  "Fórmulas seguras y biodegradables",
                  "Aromas suaves de larga duración",
                  "Entrega a domicilio en Ibarra",
                ].map((b) => (
                  <div key={b} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{
                      width: 22, height: 22, borderRadius: 999,
                      background: "rgba(225,29,46,0.10)", color: "var(--soley-red)",
                      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                    }}>
                      <CheckIcon width={13} height={13} />
                    </div>
                    <span style={{ fontSize: 14.5, color: "var(--ink-2)", fontWeight: 500 }}>{b}</span>
                  </div>
                ))}
              </div>

              <a href="https://wa.me/593961264102?text=Hola%2C%20me%20interesa%20comprar%20para%20mi%20hogar"
                target="_blank" rel="noopener noreferrer" className="btn btn-red" style={{ alignSelf: "flex-start" }}>
                <WhatsAppIcon width={16} height={16} />Pedir por WhatsApp
              </a>
            </div>
          </article>

          {/* EMPRESAS */}
          <article className="audience-card" style={{
            borderRadius: 28,
            overflow: "hidden",
            color: "white",
            display: "flex",
            flexDirection: "column",
            position: "relative",
            minHeight: 480,
            isolation: "isolate",
          }}>
            {/* Capa de imagen — cubre TODO el article */}
            <div style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `linear-gradient(rgba(11,23,54,0.85), rgba(11,23,54,0.75)), url('/Img-fondo/img-trabajador.png')`,
              backgroundSize: "cover",
              backgroundPosition: "center 20%",
              backgroundRepeat: "no-repeat",
              zIndex: 0,
            }} />
            <div style={{
              position: "absolute", top: -40, right: -40, width: 260, height: 260,
              backgroundImage: "radial-gradient(white 1.5px, transparent 2px)",
              backgroundSize: "16px 16px", opacity: 0.10,
              zIndex: 1,
            }} />

            <div style={{ padding: "40px 40px 0", position: "relative", zIndex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 16,
                  background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.15)",
                  display: "flex", alignItems: "center", justifyContent: "center", color: "white",
                }}>
                  <FactoryIcon width={26} height={26} />
                </div>
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "6px 14px", background: "rgba(255,255,255,0.10)", borderRadius: 999,
                  fontSize: 12.5, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase",
                }}>
                  <span style={{ width: 6, height: 6, borderRadius: 999, background: "white" }} />
                  Para empresas
                </span>
              </div>

              <h3 style={{ color: "white", fontSize: 32, marginBottom: 12 }}>
                Canecas industriales <span style={{ color: "#8FB5E8" }}>con precios al mayoreo</span>
              </h3>
              <p style={{ fontSize: 15.5, lineHeight: 1.6, marginBottom: 28, color: "rgba(255,255,255,0.78)" }}>
                Hoteles, restaurantes, lavanderías y clínicas confían en nuestras canecas de 20L para sostener su operación diaria.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 32 }}>
                {[
                  "Canecas industriales de 20 litros",
                  "Crédito a 30 días para empresas",
                  "Etiqueta privada (marca blanca) desde 20 u.",
                  "Reposición programada según consumo",
                ].map((b) => (
                  <div key={b} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{
                      width: 22, height: 22, borderRadius: 999,
                      background: "rgba(255,255,255,0.15)", color: "white",
                      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                    }}>
                      <CheckIcon width={13} height={13} />
                    </div>
                    <span style={{ fontSize: 14.5, color: "rgba(255,255,255,0.92)", fontWeight: 500 }}>{b}</span>
                  </div>
                ))}
              </div>

              <a href="#contacto" className="btn btn-red">Solicitar cotización<ArrowIcon width={16} height={16} /></a>
            </div>
          </article>
        </div>
      </div>

      <style>{`
        .audience-card { transition: transform .25s; }
        .audience-card:hover { transform: translateY(-4px); }
        @media (max-width: 880px) { .audience-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}