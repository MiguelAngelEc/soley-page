export interface ProductPresentation {
  size: string;
  type: 'industrial' | 'retail';
  description: string;
}

export interface Product {
  id: string;
  name: string;
  category: 'cleaning' | 'disinfection' | 'sanitization';
  description: string;
  presentations: ProductPresentation[];
  featured: boolean;
  image?: string;
}

export const productPresentations: ProductPresentation[] = [
  { size: 'Caneca', type: 'industrial', description: 'Para mayoreo' },
  { size: 'Galón', type: 'retail', description: 'Presentación estándar' },
  { size: '1 Litro', type: 'retail', description: 'Para uso doméstico' }
];

export const products: Product[] = [
  {
    id: 'gel-antibacterial',
    name: 'Gel Antibacterial',
    category: 'sanitization',
    description: 'Gel antibacterial de alta calidad para desinfección de manos',
    presentations: productPresentations,
    featured: true
  },
  {
    id: 'alcohol-antiseptico',
    name: 'Alcohol Antiséptico',
    category: 'disinfection',
    description: 'Alcohol antiséptico efectivo contra virus y bacterias',
    presentations: productPresentations,
    featured: true
  },
  {
    id: 'desinfectante-antibacterial',
    name: 'Desinfectante Antibacterial',
    category: 'disinfection',
    description: 'Desinfectante multiusos para superficies y ambientes',
    presentations: productPresentations,
    featured: true
  },
  {
    id: 'jabon-liquido',
    name: 'Jabón Líquido',
    category: 'cleaning',
    description: 'Jabón líquido suave y efectivo para manos',
    presentations: productPresentations,
    featured: false
  },
  {
    id: 'cloro-5',
    name: 'Cloro al 5%',
    category: 'disinfection',
    description: 'Cloro concentrado al 5% para desinfección profunda',
    presentations: productPresentations,
    featured: true
  },
  {
    id: 'detergente-liquido',
    name: 'Detergente Líquido',
    category: 'cleaning',
    description: 'Detergente líquido concentrado para ropa y superficies',
    presentations: productPresentations,
    featured: false
  }
];

export const featuredProducts = products.filter(product => product.featured);

export const benefits = [
  {
    title: 'Calidad Garantizada',
    description: 'Productos fabricados con los más altos estándares de calidad y eficacia',
    icon: '✓'
  },
  {
    title: 'Mayoreo y Menudeo',
    description: 'Servimos tanto a empresas como a hogares con precios competitivos',
    icon: '🏢'
  },
  {
    title: 'Fabricación Propia',
    description: 'Control total del proceso productivo garantiza consistencia y frescura',
    icon: '🏭'
  }
];