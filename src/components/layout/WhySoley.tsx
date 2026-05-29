"use client";

import { useRef } from "react";
import { useReveal, useCountUp, useInView } from "@/lib/hooks";
import { FlaskIcon, ShieldIcon, TruckIcon } from "@/components/shared/Icons";
import Image from "next/image";

export function WhySoley() {
  const sectionRef = useRef<HTMLElement | null>(null);
  useReveal(sectionRef);
  const statsRef = useRef<HTMLDivElement | null>(null);
  const statsVisible = useInView(statsRef);

  const years = useCountUp(10, statsVisible);
  const clients = useCountUp(450, statsVisible);
  const orders = useCountUp(12000, statsVisible);

  const pillars = [
    {
      Icon: FlaskIcon,
      title: "Formulación propia",
      desc: "Fabricamos cada producto en planta propia bajo Buenas Prácticas de Manufactura. Control total sobre concentración, pH y consistencia.",
      tag: "I+D continuo",
      image: "/cards/card-1.png",
    },
    {
      Icon: ShieldIcon,
      title: "Registro ARCSA",
      desc: "Todos nuestros productos cuentan con notificación sanitaria obligatoria emitida por la Agencia de Regulación Sanitaria del Ecuador.",
      tag: "Cumplimiento legal",
      image: "/cards/card-2.png",
    },
    {
      Icon: TruckIcon,
      title: "Entrega programada",
      desc: "Logística propia en Imbabura. Coordinamos despachos semanales, quincenales o mensuales según tu consumo.",
      tag: "Sin quiebres de stock",
      image: "/cards/card-3.png",
    },
  ];

  return (
    <section id="por-que" ref={sectionRef} className="section-y" style={{ background: "white" }}>
      <div className="container-x">
        <div className="section-head center reveal">
          <span className="eyebrow"><span className="dot" />Por qué Soley</span>
          <h2>10 años fabricando lo que <span className="accent">Ecuador necesita limpio</span></h2>
          <p className="lead">No revendemos. Formulamos, envasamos y entregamos cada producto desde nuestra planta en Ibarra. Esa cadena corta es la que sostiene la calidad.</p>
        </div>

        <div className="reveal-stagger" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, marginBottom: 72 }}>
          {pillars.map((p, i) => (
            <article key={i} style={{
              borderRadius: 24, background: "white",
              border: "1px solid var(--border)",
              display: "flex", flexDirection: "column", position: "relative",
              transition: "transform .2s, box-shadow .2s",
              overflow: "hidden",
            }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "var(--shadow-md)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <div style={{
                position: "relative",
                height: 160,
                background: "linear-gradient(135deg, #F7FAFD 0%, #E9F1FB 100%)",
                overflow: "hidden",
              }}>
                <Image
                  src={p.image}
                  alt={p.title}
                  fill
                  style={{
                    objectFit: "contain",
                    padding: "15px",
                  }}
                />
                <div style={{
                  position: "absolute",
                  top: 16,
                  left: 16,
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: "linear-gradient(135deg, var(--soley-blue) 0%, var(--soley-blue-deep) 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  boxShadow: "var(--shadow-blue)",
                }}>
                  <p.Icon width={24} height={24} />
                </div>
              </div>
              <div style={{ padding: 32, display: "flex", flexDirection: "column", gap: 20 }}>
                <div>
                  <div style={{
                    display: "inline-block", padding: "4px 10px",
                    fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em",
                    color: "var(--soley-red)", background: "rgba(225,29,46,0.08)",
                    borderRadius: 999, marginBottom: 12,
                  }}>{p.tag}</div>
                  <h3 style={{ fontSize: 22, marginBottom: 8 }}>{p.title}</h3>
                  <p style={{ fontSize: 14.5, lineHeight: 1.6 }}>{p.desc}</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div ref={statsRef} className="reveal" style={{
          borderRadius: 32,
          background: "linear-gradient(135deg, #0A2655 0%, #1E5BBA 100%)",
          padding: 56, color: "white", position: "relative", overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", top: -60, left: -40, width: 320, height: 320,
            backgroundImage: "radial-gradient(white 1.5px, transparent 2px)",
            backgroundSize: "16px 16px", opacity: 0.08,
          }} />
          <div style={{
            position: "absolute", bottom: -80, right: -60, width: 360, height: 360,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(225,29,46,0.30) 0%, transparent 70%)",
          }} />

          <div className="stats-grid" style={{ position: "relative", display: "grid", gridTemplateColumns: "1.2fr 2fr", gap: 48, alignItems: "center" }}>
            <div>
              <h3 style={{ color: "white", fontSize: 32, lineHeight: 1.1, marginBottom: 16 }}>Hechos en cifras</h3>
              <p style={{ color: "rgba(255,255,255,0.78)", fontSize: 15.5 }}>
                Una década formulando productos que rinden, no que solo se ven bien en el estante.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
              {[
                { val: String(years), suf: "+", lbl: "Años en el mercado" },
                { val: String(clients), suf: "+", lbl: "Clientes activos" },
                { val: orders.toLocaleString("es-EC"), suf: "+", lbl: "Pedidos entregados" },
              ].map((s, i) => (
                <div key={i} style={{ paddingLeft: i === 0 ? 0 : 24, borderLeft: i === 0 ? "none" : "1px solid rgba(255,255,255,0.15)" }}>
                  <div className="stat-num" style={{ fontSize: 56, fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1 }}>
                    {s.val}<span style={{ color: "var(--soley-red)" }}>{s.suf}</span>
                  </div>
                  <div style={{ fontSize: 13.5, color: "rgba(255,255,255,0.72)", marginTop: 8, fontWeight: 600 }}>{s.lbl}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 880px) {
          .stats-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
