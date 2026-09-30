"use client";

import { useEffect, useRef, useState } from "react";

interface Bubble {
  id: number;
  /** posicion horizontal, % del area de la caneca */
  x: number;
  size: number;
  /** segundos que tarda en subir */
  dur: number;
  /** retraso inicial (negativo = ya va subiendo al cargar) */
  delay: number;
  /** vaiven lateral, px */
  sway: number;
  /** delante de la caneca (true) o detras */
  front: boolean;
}

// Valores fijos (no aleatorios) para que servidor y cliente pinten lo mismo.
const BUBBLES: Bubble[] = [
  { id: 0, x: 6, size: 46, dur: 11, delay: -2, sway: 18, front: false },
  { id: 1, x: 18, size: 78, dur: 14, delay: -9, sway: 26, front: true },
  { id: 2, x: 30, size: 32, dur: 9, delay: -5, sway: 14, front: false },
  { id: 3, x: 44, size: 58, dur: 12, delay: -11, sway: 22, front: true },
  { id: 4, x: 58, size: 38, dur: 10, delay: -1, sway: 16, front: false },
  { id: 5, x: 70, size: 92, dur: 16, delay: -7, sway: 30, front: true },
  { id: 6, x: 82, size: 42, dur: 10.5, delay: -4, sway: 18, front: false },
  { id: 7, x: 90, size: 64, dur: 13, delay: -12, sway: 24, front: true },
  { id: 8, x: 36, size: 26, dur: 8.5, delay: -6, sway: 12, front: true },
  { id: 9, x: 64, size: 30, dur: 9.5, delay: -3, sway: 12, front: false },
];

const POP_MS = 420;
const RESPAWN_DELAY_S = 0.6;
const DROPLETS = 8;
const POP_SOUND = "/efectos/burbuja-pop.mp3";

// Audio compartido por las dos capas de burbujas. Se crea en el primer clic
// (los navegadores solo permiten sonido tras una interaccion) y el archivo se
// decodifica una sola vez.
let popAudio: { ctx: AudioContext; buffer: Promise<AudioBuffer | null> } | null = null;

function playPop(size: number) {
  if (!popAudio) {
    const ctx = new AudioContext();
    popAudio = {
      ctx,
      buffer: fetch(POP_SOUND)
        .then((r) => r.arrayBuffer())
        .then((data) => ctx.decodeAudioData(data))
        .catch(() => null),
    };
  }
  const { ctx, buffer } = popAudio;
  void ctx.resume();
  void buffer.then((buf) => {
    if (!buf) return;
    const source = ctx.createBufferSource();
    source.buffer = buf;
    // Burbujas chicas suenan mas agudas, las grandes mas graves.
    source.playbackRate.value = Math.min(1.5, Math.max(0.8, 1.6 - size / 100));
    const gain = ctx.createGain();
    gain.gain.value = 0.45;
    source.connect(gain).connect(ctx.destination);
    source.start();
  });
}

/**
 * Burbujas decorativas que suben alrededor de la caneca del hero. Un clic (o
 * toque) las revienta con un "pop" y vuelven a salir desde abajo. Con
 * movimiento reducido no se muestran.
 */
export function HeroBubbles({ layer }: { layer: "back" | "front" }) {
  // Cada burbuja lleva un contador: al cambiar, React la vuelve a montar y su
  // animacion arranca otra vez desde abajo.
  const [generation, setGeneration] = useState<Record<number, number>>({});
  const [popping, setPopping] = useState<Record<number, boolean>>({});
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach((t) => window.clearTimeout(t));
  }, []);

  function pop(id: number, size: number) {
    if (popping[id]) return;
    playPop(size);
    setPopping((p) => ({ ...p, [id]: true }));
    timers.current.push(
      window.setTimeout(() => {
        setPopping((p) => ({ ...p, [id]: false }));
        setGeneration((g) => ({ ...g, [id]: (g[id] ?? 0) + 1 }));
      }, POP_MS),
    );
  }

  return (
    <div className={`hero-bubbles hero-bubbles-${layer}`} aria-hidden="true">
      {BUBBLES.filter((b) => b.front === (layer === "front")).map((b) => {
        const gen = generation[b.id] ?? 0;
        return (
          <span
            key={`${b.id}-${gen}`}
            className="bubble-track"
            style={
              {
                left: `${b.x}%`,
                "--size": `${b.size}px`,
                "--dur": `${b.dur}s`,
                "--delay": `${gen === 0 ? b.delay : RESPAWN_DELAY_S}s`,
                "--sway": `${b.sway}px`,
              } as React.CSSProperties
            }
          >
            <span className="bubble-sway">
              <span
                className={`bubble${popping[b.id] ? " is-popping" : ""}`}
                onPointerDown={() => pop(b.id, b.size)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- sprite de 30 KB, sin beneficio de next/image */}
                <img src="/efectos/burbuja.webp" alt="" draggable={false} />
                {popping[b.id] && (
                  <>
                    <span className="bubble-ring" />
                    {Array.from({ length: DROPLETS }, (_, i) => (
                      <span key={i} className="bubble-drop" style={{ "--a": `${(360 / DROPLETS) * i}deg` } as React.CSSProperties} />
                    ))}
                  </>
                )}
              </span>
            </span>
          </span>
        );
      })}

      <style>{`
        .hero-bubbles {
          position: absolute; inset: 0;
          pointer-events: none;
        }
        .hero-bubbles-back { z-index: 0; }
        .hero-bubbles-front { z-index: 2; }
        /* Sube desde el borde inferior del area hasta pasar la parte de arriba. */
        .bubble-track {
          position: absolute; bottom: 0;
          width: var(--size); height: var(--size);
          margin-left: calc(var(--size) / -2);
          animation: bubble-rise var(--dur) linear var(--delay) infinite both;
        }
        .bubble-sway {
          display: block; width: 100%; height: 100%;
          animation: bubble-sway calc(var(--dur) / 3) ease-in-out var(--delay) infinite alternate;
        }
        .bubble {
          position: relative; display: block; width: 100%; height: 100%;
          pointer-events: auto; cursor: pointer;
          animation: bubble-wobble 2.6s ease-in-out infinite alternate;
        }
        .bubble img {
          width: 100%; height: 100%; display: block;
          user-select: none; -webkit-user-drag: none;
        }
        @keyframes bubble-rise {
          0% { transform: translateY(20%); opacity: 0; }
          8% { opacity: 1; }
          85% { opacity: 1; }
          100% { transform: translateY(calc(-1 * var(--rise, 640px))); opacity: 0; }
        }
        @keyframes bubble-sway {
          from { transform: translateX(calc(var(--sway) * -1)); }
          to { transform: translateX(var(--sway)); }
        }
        @keyframes bubble-wobble {
          from { transform: scale(1, 0.95); }
          to { transform: scale(0.96, 1); }
        }

        /* Reventar: la pelicula se infla y desaparece, sale un anillo y gotitas. */
        .bubble.is-popping { animation: none; pointer-events: none; }
        .bubble.is-popping img { animation: bubble-pop 0.22s ease-out forwards; }
        @keyframes bubble-pop {
          to { transform: scale(1.35); opacity: 0; }
        }
        .bubble-ring {
          position: absolute; inset: 0; border-radius: 50%;
          border: 2px solid rgba(255, 255, 255, 0.9);
          box-shadow: 0 0 10px rgba(120, 190, 255, 0.6);
          animation: bubble-ring 0.4s ease-out forwards;
        }
        @keyframes bubble-ring {
          from { transform: scale(0.9); opacity: 1; }
          to { transform: scale(1.7); opacity: 0; }
        }
        .bubble-drop {
          position: absolute; left: 50%; top: 50%;
          width: 6px; height: 6px; margin: -3px 0 0 -3px; border-radius: 50%;
          background: radial-gradient(circle at 35% 35%, #fff, rgba(140, 200, 255, 0.85));
          transform: rotate(var(--a)) translateY(0);
          animation: bubble-drop 0.4s ease-out forwards;
        }
        @keyframes bubble-drop {
          to { transform: rotate(var(--a)) translateY(calc(var(--size) * -0.85)) scale(0.4); opacity: 0; }
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-bubbles { display: none; }
        }
      `}</style>
    </div>
  );
}
