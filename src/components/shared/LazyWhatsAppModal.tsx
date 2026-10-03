"use client";

import dynamic from "next/dynamic";
import type { ComponentProps } from "react";
import type { WhatsAppModal as WhatsAppModalType } from "./WhatsAppModal";

const WhatsAppModal = dynamic(() => import("./WhatsAppModal").then((m) => m.WhatsAppModal), { ssr: false });

/**
 * El formulario de WhatsApp pesa bastante y casi nadie lo abre al cargar: su
 * codigo se descarga recien la primera vez que se abre (code splitting).
 */
export function LazyWhatsAppModal(props: ComponentProps<typeof WhatsAppModalType>) {
  return props.isOpen ? <WhatsAppModal {...props} /> : null;
}
