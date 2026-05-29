"use client";

import { useState, useRef, useEffect } from "react";
import { useReveal } from "@/lib/hooks";
import { faqs } from "@/data/faqs";
import { PlusIcon, WhatsAppIcon } from "@/components/shared/Icons";

export function FAQ() {
  const [open, setOpen] = useState<number>(0);
  const [heights, setHeights] = useState<number[]>([]);
  const sectionRef = useRef<HTMLElement | null>(null);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);
  useReveal(sectionRef);

  useEffect(() => {
    const calculateHeights = () => {
      const newHeights = contentRefs.current.map(ref => ref?.scrollHeight || 0);
      setHeights(newHeights);
    };

    calculateHeights();
    window.addEventListener("resize", calculateHeights);
    return () => window.removeEventListener("resize", calculateHeights);
  }, []);

  return (
    <section ref={sectionRef} className="section-y" style={{ background: "white" }}>
      <div className="container-x" style={{ maxWidth: 900 }}>
        <div className="section-head center reveal">
          <span className="eyebrow"><span className="dot" />Preguntas frecuentes</span>
          <h2>Todo lo que necesitas <span className="accent">saber</span></h2>
        </div>

        <div className="reveal" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={i} style={{
                background: isOpen ? "var(--bg-soft)" : "white",
                border: `1px solid ${isOpen ? "var(--border-strong)" : "var(--border)"}`,
                borderRadius: 16, overflow: "hidden", transition: "all .2s",
              }}>
                <button onClick={() => setOpen(isOpen ? -1 : i)}
                  style={{
                    width: "100%", padding: "20px 24px",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    gap: 16, textAlign: "left",
                  }}>
                  <span style={{ fontSize: 16.5, fontWeight: 700, color: "var(--ink)" }}>{f.q}</span>
                  <div style={{
                    width: 32, height: 32, borderRadius: 999,
                    background: isOpen ? "var(--soley-blue)" : "var(--bg-blue-tint)",
                    color: isOpen ? "white" : "var(--soley-blue)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all .2s",
                    transform: isOpen ? "rotate(45deg)" : "rotate(0)",
                    flexShrink: 0,
                  }}>
                    <PlusIcon width={16} height={16} />
                  </div>
                </button>
                <div style={{
                  maxHeight: isOpen ? (heights[i] || 400) : 0,
                  overflow: "hidden",
                  transition: "max-height .3s cubic-bezier(0.4, 0, 0.2, 1)",
                }}>
                  <div ref={el => contentRefs.current[i] = el}>
                    <p style={{ padding: "0 24px 22px", fontSize: 14.5, color: "var(--muted)", lineHeight: 1.65 }}>{f.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="reveal" style={{
          marginTop: 40, padding: 28,
          background: "var(--bg-blue-tint)", borderRadius: 20,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          gap: 16, flexWrap: "wrap",
        }}>
          <div>
            <h3 style={{ fontSize: 18, marginBottom: 4 }}>¿Tienes otra pregunta?</h3>
            <p style={{ fontSize: 14 }}>Nuestro equipo te responde por WhatsApp en menos de 1 hora.</p>
          </div>
          <a href="https://wa.me/593961264102" className="btn btn-blue">
            <WhatsAppIcon width={16} height={16} />Escribir ahora
          </a>
        </div>
      </div>
    </section>
  );
}
