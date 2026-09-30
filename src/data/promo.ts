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
    /** fotograma final; se muestra mientras carga y con movimiento reducido */
    poster: string;
  } | null;
}

export const promo: Promo = {
  active: true,
  productId: "detergente-liquido",
  eyebrow: "Oferta del mes",
  presentation: "Caneca 20 L",
  price: "12,50",
  ad: {
    video: "/promo/caneca-oferta.mp4",
    poster: "/promo/caneca-oferta.jpg",
  },
};
