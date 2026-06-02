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
      image: "/IG/card-1.png",
    },
    {
      Icon: ShieldIcon,
      title: "Registro ARCSA",
      desc: "Todos nuestros productos cuentan con notificación sanitaria obligatoria emitida por la Agencia de Regulación Sanitaria del Ecuador.",
      tag: "Cumplimiento legal",
      image: "/IG/card-2.png",
    },
    {
      Icon: TruckIcon,
      title: "Entrega programada",
      desc: "Logística propia en Imbabura. Coordinamos despachos semanales, quincenales o mensuales según tu consumo.",
      tag: "Sin quiebres de stock",
      image: "/IG/card-3.png",
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

        <div className="pillars-grid reveal-stagger">
          {pillars.map((p, i) => (
            <article key={i} className="pillar-card">
              <div className="pillar-card-header">
                <Image
                  src={p.image}
                  alt={p.title}
                  fill
                  style={{
                    objectFit: "contain",
                    padding: "15px",
                  }}
                />
                <div className="pillar-card-icon">
                  <p.Icon width={24} height={24} />
                </div>
              </div>
              <div className="pillar-card-content">
                <div>
                  <div className="pillar-card-tag">{p.tag}</div>
                  <h3 className="pillar-card-title">{p.title}</h3>
                  <p className="pillar-card-desc">{p.desc}</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div ref={statsRef} className="stats-section reveal">
          <div className="stats-bg-pattern" />
          <div className="stats-bg-gradient" />

          <div className="stats-grid">
            <div className="stats-header">
              <h3 className="stats-title">Hechos en cifras</h3>
              <p className="stats-desc">
                Una década formulando productos que rinden, no que solo se ven bien en el estante.
              </p>
            </div>

            <div className="stats-numbers">
              {[
                { val: String(years), suf: "+", lbl: "Años en el mercado" },
                { val: String(clients), suf: "+", lbl: "Clientes activos" },
                { val: orders.toLocaleString("es-EC"), suf: "+", lbl: "Pedidos entregados" },
              ].map((s, i) => (
                <div key={i} className={`stat-item ${i > 0 ? 'stat-item-bordered' : ''}`}>
                  <div className="stat-num">
                    {s.val}<span style={{ color: "var(--soley-red)" }}>{s.suf}</span>
                  </div>
                  <div className="stat-label">{s.lbl}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        /* Pillars Grid - Mobile First */
        .pillars-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
          margin-bottom: 48px;
        }

        .pillar-card {
          border-radius: 20px;
          background: white;
          border: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          position: relative;
          transition: transform .2s, box-shadow .2s;
          overflow: hidden;
        }

        .pillar-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-md);
        }

        .pillar-card-header {
          position: relative;
          height: 140px;
          background: linear-gradient(135deg, #F7FAFD 0%, #E9F1FB 100%);
          overflow: hidden;
        }

        .pillar-card-icon {
          position: absolute;
          top: 12px;
          left: 12px;
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: linear-gradient(135deg, var(--soley-blue) 0%, var(--soley-blue-deep) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: var(--shadow-blue);
        }

        .pillar-card-content {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .pillar-card-tag {
          display: inline-block;
          padding: 3px 8px;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--soley-red);
          background: rgba(225,29,46,0.08);
          border-radius: 999px;
          margin-bottom: 10px;
        }

        .pillar-card-title {
          font-size: 18px;
          margin-bottom: 6px;
          line-height: 1.2;
        }

        .pillar-card-desc {
          font-size: 13px;
          line-height: 1.5;
          color: var(--text-secondary);
        }

        /* Stats Section - Mobile First */
        .stats-section {
          border-radius: 24px;
          background: linear-gradient(135deg, #0A2655 0%, #1E5BBA 100%);
          padding: 32px 24px;
          color: white;
          position: relative;
          overflow: hidden;
        }

        .stats-bg-pattern {
          position: absolute;
          top: -40px;
          left: -20px;
          width: 200px;
          height: 200px;
          background-image: radial-gradient(white 1.5px, transparent 2px);
          background-size: 16px 16px;
          opacity: 0.08;
        }

        .stats-bg-gradient {
          position: absolute;
          bottom: -40px;
          right: -30px;
          width: 180px;
          height: 180px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(225,29,46,0.30) 0%, transparent 70%);
        }

        .stats-grid {
          position: relative;
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
        }

        .stats-header {
          text-align: center;
        }

        .stats-title {
          color: white;
          font-size: 24px;
          line-height: 1.1;
          margin-bottom: 12px;
        }

        .stats-desc {
          color: rgba(255,255,255,0.78);
          font-size: 14px;
          line-height: 1.4;
        }

        .stats-numbers {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
        }

        .stat-item {
          text-align: center;
        }

        .stat-item-bordered {
          padding-top: 24px;
          border-top: 1px solid rgba(255,255,255,0.15);
        }

        .stat-num {
          font-size: 36px;
          font-weight: 800;
          letter-spacing: -0.02em;
          line-height: 1;
        }

        .stat-label {
          font-size: 12px;
          color: rgba(255,255,255,0.72);
          margin-top: 6px;
          font-weight: 600;
        }

        /* Tablet Breakpoint - 640px */
        @media (min-width: 640px) {
          .pillars-grid {
            gap: 20px;
            margin-bottom: 56px;
          }

          .pillar-card-header {
            height: 150px;
          }

          .pillar-card-icon {
            top: 14px;
            left: 14px;
            width: 44px;
            height: 44px;
          }

          .pillar-card-content {
            padding: 28px;
            gap: 18px;
          }

          .pillar-card-tag {
            padding: 4px 9px;
            font-size: 11px;
            margin-bottom: 11px;
          }

          .pillar-card-title {
            font-size: 20px;
            margin-bottom: 7px;
          }

          .pillar-card-desc {
            font-size: 14px;
            line-height: 1.6;
          }

          .stats-section {
            border-radius: 28px;
            padding: 40px 32px;
          }

          .stats-bg-pattern {
            top: -50px;
            left: -30px;
            width: 250px;
            height: 250px;
          }

          .stats-bg-gradient {
            bottom: -50px;
            right: -40px;
            width: 220px;
            height: 220px;
          }

          .stats-grid {
            gap: 32px;
          }

          .stats-title {
            font-size: 28px;
            margin-bottom: 14px;
          }

          .stats-desc {
            font-size: 15px;
          }

          .stats-numbers {
            grid-template-columns: repeat(3, 1fr);
            gap: 0;
          }

          .stat-item {
            text-align: left;
          }

          .stat-item-bordered {
            padding-top: 0;
            padding-left: 24px;
            border-top: none;
            border-left: 1px solid rgba(255,255,255,0.15);
          }

          .stat-num {
            font-size: 42px;
          }

          .stat-label {
            font-size: 13px;
            margin-top: 7px;
          }
        }

        /* Medium Breakpoint - 768px */
        @media (min-width: 768px) {
          .pillars-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 24px;
            margin-bottom: 64px;
          }

          .stats-section {
            padding: 48px 40px;
          }

          .stats-grid {
            grid-template-columns: 1.2fr 2fr;
            gap: 40px;
            align-items: center;
          }

          .stats-header {
            text-align: left;
          }

          .stats-title {
            font-size: 30px;
            margin-bottom: 16px;
          }

          .stats-desc {
            font-size: 15.5px;
          }

          .stat-num {
            font-size: 48px;
          }

          .stat-label {
            font-size: 13.5px;
            margin-top: 8px;
          }
        }

        /* Large Breakpoint - 880px and up */
        @media (min-width: 880px) {
          .pillars-grid {
            grid-template-columns: repeat(3, 1fr);
            margin-bottom: 72px;
          }

          .pillar-card {
            border-radius: 24px;
          }

          .pillar-card-header {
            height: 160px;
          }

          .pillar-card-icon {
            top: 16px;
            left: 16px;
            width: 48px;
            height: 48px;
            border-radius: 12px;
          }

          .pillar-card-content {
            padding: 32px;
            gap: 20px;
          }

          .pillar-card-title {
            font-size: 22px;
            margin-bottom: 8px;
          }

          .pillar-card-desc {
            font-size: 14.5px;
          }

          .stats-section {
            border-radius: 32px;
            padding: 56px;
          }

          .stats-bg-pattern {
            top: -60px;
            left: -40px;
            width: 320px;
            height: 320px;
          }

          .stats-bg-gradient {
            bottom: -80px;
            right: -60px;
            width: 360px;
            height: 360px;
          }

          .stats-grid {
            gap: 48px;
          }

          .stats-title {
            font-size: 32px;
          }

          .stat-num {
            font-size: 56px;
            letter-spacing: -0.03em;
          }
        }
      `}</style>
    </section>
  );
}
