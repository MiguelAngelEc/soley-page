// Promocion destacada de la seccion de productos.
// Para apagarla, poner `active: false`: el banner desaparece y la seccion
// vuelve a quedar como sin promocion. No hace falta tocar nada mas.

export interface Promo {
  active: boolean;
  /** id de un producto de products.ts; define la imagen y el enlace del modal */
  productId: string;
  eyebrow: string;
  headline: string;
  description: string;
  presentation: string;
  price: string;
  discount: string;
  /** vigencia mostrada al cliente */
  validity: string;
  benefits: string[];
}

export const promo: Promo = {
  active: true,
  productId: "detergente-liquido",
  eyebrow: "Oferta del mes",
  headline: "Limpia más. Rinde mejor.",
  description:
    "Detergente Líquido concentrado en caneca de 20 L. Alta espuma, doble rendimiento por carga.",
  presentation: "Caneca 20 L",
  price: "12,50",
  discount: "30%",
  validity: "Válido hasta agotar stock",
  benefits: [
    "Alta espuma, doble rendimiento por carga",
    "Entrega en Ibarra y alrededores",
    "Válido hasta agotar stock",
  ],
};
