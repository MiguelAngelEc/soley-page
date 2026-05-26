import { Card, CardContent } from '@/components/ui';
import { Product } from '@/data/products';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const getCategoryBadge = (category: string) => {
    const badges = {
      cleaning: { text: 'Limpieza', color: 'bg-blue-100 text-blue-800' },
      disinfection: { text: 'Desinfección', color: 'bg-red-100 text-red-800' },
      sanitization: { text: 'Sanitización', color: 'bg-green-100 text-green-800' }
    };
    return badges[category as keyof typeof badges] || badges.cleaning;
  };

  const badge = getCategoryBadge(product.category);

  return (
    <Card hover className="group h-full">
      <CardContent className="p-6">
        {/* Placeholder image */}
        <div className="relative mb-4 h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <div className="w-16 h-16 mx-auto mb-2 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-2xl">🧴</span>
              </div>
              <p className="text-sm font-medium">{product.name}</p>
            </div>
          </div>
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <span className="text-white font-medium">Ver detalles</span>
          </div>
        </div>

        {/* Category badge */}
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-3 ${badge.color}`}>
          {badge.text}
        </span>

        {/* Product info */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>

        <p className="text-gray-600 text-sm mb-4 leading-relaxed">
          {product.description}
        </p>

        {/* Presentations */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-gray-700 uppercase tracking-wide">
            Disponible en:
          </p>
          <div className="flex flex-wrap gap-1">
            {product.presentations.map((presentation, index) => (
              <span
                key={index}
                className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
              >
                {presentation.size}
              </span>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}