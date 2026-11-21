// Promocion del mes: se muestra como anuncio en video al entrar a la pagina.
// Para apagarla, poner `active: false` (o `ad: null`). No hace falta tocar
// nada mas.

export interface Promo {
  active: boolean;
  /** id de un producto de products.ts; define el producto del pedido por WhatsApp */
  productId: string;
  eyebrow: string;
  presentation: string;
  price: string;
  /**
   * Anuncio en video que se abre como modal al entrar a la pagina.
   * El video se genera con HyperFrames en ../videos/soley-promo-caneca
   * (ver su README) y se copia a public/promo/.
   */
  ad: {
    video: string;
    /** version liviana (720px) para pantallas de movil */
    videoMobile?: string;
    /** fotograma final; se muestra mientras carga y con movimiento reducido */
    poster: string;
  } | null;
}

export const promo: Promo = {
  // Apagada mientras dura Black Friday: la caneca tiene otro precio ahi.
  active: false,
  productId: "detergente-liquido",
  eyebrow: "Oferta del mes",
  presentation: "Caneca 20 L",
  price: "12,50",
  ad: {
    video: "/promo/caneca-oferta.mp4",
    videoMobile: "/promo/caneca-oferta-mobile.mp4",
    poster: "/promo/caneca-oferta.jpg",
  },
};

// Postales que caen (Black Friday). Si esta activo se muestra en lugar del video
// de arriba y se apaga solo al llegar a `endsAt`.
export interface PromoSlide {
  src: string;
  /** texto alternativo: lo que dice la imagen */
  alt: string;
  /** se precarga en "Producto de interes" del formulario de WhatsApp (max. 120) */
  pedido: string;
}

export interface PromoPostcards {
  active: boolean;
  title: string;
  /** fecha ISO; desde ese momento el anuncio ya no se abre */
  endsAt: string;
  slides: PromoSlide[];
}

export const promoPostcards: PromoPostcards = {
  active: true,
  title: "Ofertas Black Friday Soley",
  endsAt: "2026-11-30T00:00:00-05:00",
  slides: [
    {
      src: "/promo/black-friday/combo-limpieza-799.png",
      alt: "Black Friday. Combo Limpieza: Desinfectante 4 L + Cloro 4 L + Jabón de manos 1 L. Todo por solo $7,99. 9 litros de limpieza para tu hogar.",
      pedido: "Combo Limpieza $7,99: Desinfectante 4 L + Cloro 4 L + Jabón de manos 1 L",
    },
    {
      src: "/promo/black-friday/combo-detergente-750.png",
      alt: "Black Friday. Combo Limpieza: 2 galones de 5 litros de detergente. Todo por solo $7,50. 10 litros de detergente para tu hogar.",
      pedido: "Combo Detergente $7,50: 2 galones de 5 L",
    },
    {
      src: "/promo/black-friday/caneca-jabon-1150.png",
      alt: "Black Friday. 20 L de detergente más 1 L de jabón de manos gratis. Todo por solo $11,50. Canje con caneca vacía de 20 L, no incluye envase.",
      pedido: "Caneca Detergente 20 L + 1 L Jabón de manos gratis $11,50 (canje con caneca vacía)",
    },
    {
      src: "/promo/black-friday/combo-limpieza-999.png",
      alt: "Black Friday. Combo Limpieza: Detergente 4 L + Cloro 4 L + Desinfectante 4 L. Todo por solo $9,99. 12 litros de limpieza para tu hogar.",
      pedido: "Combo Limpieza $9,99: Detergente 4 L + Cloro 4 L + Desinfectante 4 L",
    },
  ],
};
