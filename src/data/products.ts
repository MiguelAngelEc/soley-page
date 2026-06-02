export type ProductCategory = "cleaning" | "disinfection" | "sanitization";
export type PresentationType = "mayoreo" | "menudeo";
export type PresentationSize = "litro" | "galon" | "caneca";

export interface ProductPresentation {
  size: string;
  type: PresentationType;
  presentationSize: PresentationSize;
  volume: string;
  price: number;
  image: string;
}

export interface ProductSpec {
  k: string;
  v: string;
}

export interface Product {
  id: string;
  name: string;
  tagline: string;
  category: ProductCategory;
  categoryLabel: string;
  description: string;
  uses: string[];
  specs: ProductSpec[];
  presentations: ProductPresentation[];
  featured: boolean;
  color: string;
}

export const products: Product[] = [
  {
    id: "gel-antibacterial",
    name: "Gel Antibacterial",
    tagline: "Higiene de manos profesional",
    category: "sanitization",
    categoryLabel: "Sanitización",
    description:
      "Gel antibacterial con base alcohólica al 70%. Elimina el 99.9% de bacterias y virus en segundos sin resecar la piel.",
    uses: ["Hospitales y clínicas", "Hoteles y restaurantes", "Oficinas y comercio", "Hogar"],
    specs: [
      { k: "Alcohol", v: "70%" },
      { k: "Eficacia", v: "99.9% bacterias" },
      { k: "Aroma", v: "Neutro / floral" },
    ],
    presentations: [
      { size: "Botella 1 L", type: "menudeo", presentationSize: "litro", volume: "1 L", price: 1, image: "/productos/Gel Litro.png" },
      { size: "Galón 4 L", type: "menudeo", presentationSize: "galon", volume: "4 L", price: 6, image: "/productos/Gel Galón.png" },
      { size: "Caneca 20 L", type: "mayoreo", presentationSize: "caneca", volume: "20 L", price: 20, image: "/productos/Gel Caneca.png" },
    ],
    featured: true,
    color: "#16A34A",
  },
  {
    id: "alcohol-antiseptico",
    name: "Alcohol Antiséptico",
    tagline: "Desinfección profunda",
    category: "disinfection",
    categoryLabel: "Desinfección",
    description:
      "Alcohol antiséptico de uso externo. Ideal para limpieza de superficies, instrumentos y heridas menores.",
    uses: ["Centros médicos", "Belleza y estética", "Industria alimentaria", "Hogar"],
    specs: [
      { k: "Concentración", v: "96°" },
      { k: "Tipo", v: "Etílico" },
      { k: "Uso", v: "Externo" },
    ],
    presentations: [
      { size: "Botella 1 L", type: "menudeo", presentationSize: "litro", volume: "1 L", price: 1, image: "/productos/Alcohol Antiséptico Litro.png" },
      { size: "Galón 4 L", type: "menudeo", presentationSize: "galon", volume: "4 L", price: 6, image: "/productos/Alcohol Antiséptico Galón.png" },
      { size: "Caneca 20 L", type: "mayoreo", presentationSize: "caneca", volume: "20 L", price: 20, image: "/productos/Alcohol Antiséptico Caneca.png" },
    ],
    featured: true,
    color: "#0EA5E9",
  },
  {
    id: "desinfectante",
    name: "Desinfectante Multiusos",
    tagline: "Acción antibacterial",
    category: "disinfection",
    categoryLabel: "Desinfección",
    description:
      "Desinfectante de amplio espectro para superficies y ambientes. Aroma fresco prolongado.",
    uses: ["Hoteles y resorts", "Edificios corporativos", "Centros educativos", "Hogar"],
    specs: [
      { k: "Acción", v: "Bactericida" },
      { k: "Aromas", v: "Lavanda · Bebé · Floral" },
      { k: "Diluible", v: "Sí" },
    ],
    presentations: [
      { size: "Botella 1 L", type: "menudeo", presentationSize: "litro", volume: "1 L", price: 1, image: "/productos/Desinfectante Litro.png" },
      { size: "Galón 4 L", type: "menudeo", presentationSize: "galon", volume: "4 L", price: 6, image: "/productos/Desinfectante Galón.png" },
      { size: "Caneca 20 L", type: "mayoreo", presentationSize: "caneca", volume: "20 L", price: 20, image: "/productos/Desinfectante Caneca.png" },
    ],
    featured: true,
    color: "#7C3AED",
  },
  {
    id: "jabon-liquido",
    name: "Jabón Líquido",
    tagline: "Suave con la piel",
    category: "cleaning",
    categoryLabel: "Limpieza",
    description:
      "Jabón líquido cremoso con glicerina. Limpieza efectiva sin resecar las manos. pH balanceado.",
    uses: ["Amenities hoteleros", "Restaurantes", "Oficinas", "Hogar"],
    specs: [
      { k: "pH", v: "Neutro 6-7" },
      { k: "Aromas", v: "Manzana · Coco · Floral" },
      { k: "Glicerina", v: "Sí" },
    ],
    presentations: [
      { size: "Botella 1 L", type: "menudeo", presentationSize: "litro", volume: "1 L", price: 1, image: "/productos/Jabón de Manos Litro.png" },
      { size: "Galón 4 L", type: "menudeo", presentationSize: "galon", volume: "4 L", price: 6, image: "/productos/Jabón de Manos Galón.png" },
      { size: "Caneca 20 L", type: "mayoreo", presentationSize: "caneca", volume: "20 L", price: 20, image: "/productos/Jabón de Manos Caneca.png" },
    ],
    featured: true,
    color: "#F59E0B",
  },
  {
    id: "cloro-5",
    name: "Cloro al 5%",
    tagline: "Desinfección hospitalaria",
    category: "disinfection",
    categoryLabel: "Desinfección",
    description:
      "Hipoclorito de sodio al 5%. Estándar de la industria para desinfección profunda de superficies y blanqueo.",
    uses: ["Industria alimentaria", "Hospitales", "Lavanderías", "Hogar"],
    specs: [
      { k: "Concentración", v: "5.0%" },
      { k: "Uso", v: "Externo" },
      { k: "Acción", v: "Desinfectante" },
    ],
    presentations: [
      { size: "Botella 1 L", type: "menudeo", presentationSize: "litro", volume: "1 L", price: 1, image: "/productos/Cloro Litro.png" },
      { size: "Galón 4 L", type: "menudeo", presentationSize: "galon", volume: "4 L", price: 6, image: "/productos/Cloro Galón.png" },
      { size: "Caneca 20 L", type: "mayoreo", presentationSize: "caneca", volume: "20 L", price: 20, image: "/productos/Cloro Caneca.png" },
    ],
    featured: true,
    color: "#06B6D4",
  },
  {
    id: "detergente-liquido",
    name: "Detergente Líquido",
    tagline: "Alto rendimiento",
    category: "cleaning",
    categoryLabel: "Limpieza",
    description:
      "Detergente líquido concentrado de bajo nivel de espuma. Rinde el doble por carga.",
    uses: ["Lavanderías industriales", "Hoteles", "Lavado en frío", "Hogar"],
    specs: [
      { k: "Concentración", v: "Alta" },
      { k: "Espuma", v: "Baja" },
      { k: "Rendimiento", v: "2× estándar" },
    ],
    presentations: [
      { size: "Botella 1 L", type: "menudeo", presentationSize: "litro", volume: "1 L", price: 1, image: "/productos/Detergente Litro.png" },
      { size: "Galón 4 L", type: "menudeo", presentationSize: "galon", volume: "4 L", price: 6, image: "/productos/Detergente Galón.png" },
      { size: "Caneca 20 L", type: "mayoreo", presentationSize: "caneca", volume: "20 L", price: 20, image: "/productos/Detergente Caneca.png" },
    ],
    featured: true,
    color: "#3B82F6",
  },
];

export const categories: { id: ProductCategory | "all"; label: string }[] = [
  { id: "all", label: "Todos" },
  { id: "cleaning", label: "Limpieza" },
  { id: "disinfection", label: "Desinfección" },
  { id: "sanitization", label: "Sanitización" },
];

export const featuredProducts = products.filter((p) => p.featured);
