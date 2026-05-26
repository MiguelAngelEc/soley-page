import { Container, Button } from '@/components/ui';
import { featuredProducts } from '@/data/products';
import { ProductCard } from './ProductCard';

export function FeaturedProducts() {
  return (
    <section id="productos" className="py-16 bg-gray-50">
      <Container>
        {/* Section header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Nuestros Productos
            <span className="block text-primary">Destacados</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Descubre nuestra línea completa de productos de limpieza y desinfección,
            diseñados para satisfacer las necesidades más exigentes del mercado.
          </p>
        </div>

        {/* Products grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {featuredProducts.map((product) => (
            <div
              key={product.id}
              className="transform transition-all duration-300 hover:-translate-y-2"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* CTA section */}
        <div className="text-center">
          <p className="text-gray-600 mb-6">
            ¿Necesitas más información sobre nuestros productos?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="px-8">
              Ver Catálogo Completo
            </Button>
            <Button variant="outline" size="lg" className="px-8">
              Solicitar Cotización
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}