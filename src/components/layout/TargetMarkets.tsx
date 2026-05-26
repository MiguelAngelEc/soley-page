import { Container, Button } from '@/components/ui';

export function TargetMarkets() {
  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
      <Container>
        {/* Section header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Soluciones para Cada
            <span className="block text-primary">Necesidad</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Ofrecemos productos especializados tanto para el sector empresarial
            como para el uso doméstico.
          </p>
        </div>

        {/* Markets grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Business/Hotels */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="bg-gradient-to-br from-primary to-blue-700 p-8 text-white">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-2xl">🏢</span>
                </div>
                <h3 className="text-2xl font-bold">Empresas & Hoteles</h3>
              </div>
              <p className="text-blue-100 mb-6">
                Soluciones de limpieza profesional para el sector comercial y hotelero.
              </p>
            </div>

            <div className="p-8">
              <div className="space-y-4 mb-6">
                <div className="flex items-start">
                  <span className="text-green-500 mr-3 mt-1">✓</span>
                  <div>
                    <h4 className="font-semibold text-gray-900">Bidones Industriales</h4>
                    <p className="text-gray-600 text-sm">Presentaciones de gran volumen para uso intensivo</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-green-500 mr-3 mt-1">✓</span>
                  <div>
                    <h4 className="font-semibold text-gray-900">Precios de Mayoreo</h4>
                    <p className="text-gray-600 text-sm">Descuentos especiales por volumen</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-green-500 mr-3 mt-1">✓</span>
                  <div>
                    <h4 className="font-semibold text-gray-900">Entrega Programada</h4>
                    <p className="text-gray-600 text-sm">Distribución constante según tus necesidades</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-green-500 mr-3 mt-1">✓</span>
                  <div>
                    <h4 className="font-semibold text-gray-900">Soporte Técnico</h4>
                    <p className="text-gray-600 text-sm">Asesoría en uso y aplicación de productos</p>
                  </div>
                </div>
              </div>

              <Button className="w-full" size="lg">
                Cotizar al Mayoreo
              </Button>
            </div>
          </div>

          {/* Home */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="bg-gradient-to-br from-accent to-red-600 p-8 text-white">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-2xl">🏠</span>
                </div>
                <h3 className="text-2xl font-bold">Hogar & Familia</h3>
              </div>
              <p className="text-red-100 mb-6">
                Productos de limpieza seguros y efectivos para tu hogar.
              </p>
            </div>

            <div className="p-8">
              <div className="space-y-4 mb-6">
                <div className="flex items-start">
                  <span className="text-green-500 mr-3 mt-1">✓</span>
                  <div>
                    <h4 className="font-semibold text-gray-900">Presentaciones Familiares</h4>
                    <p className="text-gray-600 text-sm">Galones y botellas de 1L para uso doméstico</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-green-500 mr-3 mt-1">✓</span>
                  <div>
                    <h4 className="font-semibold text-gray-900">Fórmulas Seguras</h4>
                    <p className="text-gray-600 text-sm">Productos seguros para toda la familia</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-green-500 mr-3 mt-1">✓</span>
                  <div>
                    <h4 className="font-semibold text-gray-900">Fácil Aplicación</h4>
                    <p className="text-gray-600 text-sm">Productos listos para usar</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-green-500 mr-3 mt-1">✓</span>
                  <div>
                    <h4 className="font-semibold text-gray-900">Calidad Garantizada</h4>
                    <p className="text-gray-600 text-sm">La misma calidad profesional en tu hogar</p>
                  </div>
                </div>
              </div>

              <Button variant="outline" className="w-full border-accent text-accent hover:bg-accent hover:text-white" size="lg">
                Ver Productos para Hogar
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}