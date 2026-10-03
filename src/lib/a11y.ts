"use client";

import { useEffect, useRef, useState } from "react";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Elementos realmente visibles (excluye lo oculto por display:none o un padre colapsado). */
function isRendered(el: HTMLElement): boolean {
  return el.getClientRects().length > 0;
}

/**
 * Dialogos abiertos, del mas antiguo al mas reciente. Con modales anidados
 * (el formulario de cotizacion dentro del escenario del catalogo) solo el de
 * arriba responde a Escape y Tab; si no, Escape cerraria los dos a la vez.
 */
const openDialogs: symbol[] = [];

interface DialogA11yOptions {
  isOpen: boolean;
  onClose: () => void;
  containerRef: React.RefObject<HTMLElement | null>;
  /** Foco inicial; por defecto el primer elemento enfocable del contenedor. */
  initialFocusRef?: React.RefObject<HTMLElement | null>;
  /** Evita que el foco inicial desplace la pagina. */
  preventScroll?: boolean;
}

/**
 * Comportamiento estandar de dialogo modal (A11Y-001):
 * - Atrapa el Tab dentro del contenedor mientras esta abierto.
 * - Cierra con Escape.
 * - Devuelve el foco a quien abrio el modal al cerrarse.
 *
 * Limitacion conocida: no marca el resto de la pagina como inerte, asi que
 * un lector de pantalla que navegue con el cursor virtual (no con Tab)
 * todavia puede llegar al contenido de fondo. Los modales de este sitio se
 * renderizan en el lugar del arbol donde viven, no en un portal separado del
 * contenido, asi que aislar el fondo exigiria una reestructuracion mayor.
 */
export function useDialogA11y({ isOpen, onClose, containerRef, initialFocusRef, preventScroll = false }: DialogA11yOptions) {
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!isOpen) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const token = Symbol("dialog");
    openDialogs.push(token);

    const target = initialFocusRef?.current ?? containerRef.current?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
    // Deja pintar el modal antes de mover el foco.
    const raf = requestAnimationFrame(() => target?.focus({ preventScroll }));

    function onKeyDown(e: KeyboardEvent) {
      if (openDialogs[openDialogs.length - 1] !== token) return;
      if (e.key === "Escape") {
        e.stopPropagation();
        onCloseRef.current();
        return;
      }
      if (e.key !== "Tab") return;

      const container = containerRef.current;
      if (!container) return;
      const focusable = Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(isRendered);
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown, true);

    return () => {
      cancelAnimationFrame(raf);
      openDialogs.splice(openDialogs.indexOf(token), 1);
      document.removeEventListener("keydown", onKeyDown, true);
      previouslyFocused?.focus?.({ preventScroll });
    };
  }, [isOpen, containerRef, initialFocusRef, preventScroll]);
}

/** true si el visitante pidio menos movimiento en el sistema operativo. */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Version reactiva de prefersReducedMotion: se actualiza si el visitante
 * cambia la preferencia del sistema mientras la pagina esta abierta.
 */
export function useReducedMotionPreference(): boolean {
  const [reduced, setReduced] = useState(prefersReducedMotion);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(mql.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return reduced;
}
