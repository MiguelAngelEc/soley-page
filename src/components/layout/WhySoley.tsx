import { Container } from '@/components/ui';
import { benefits } from '@/data/products';

export function WhySoley() {
  return (
    <section id="nosotros" className="py-16 bg-white">
      <Container>
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            ¿Por qué elegir
            <span className="block text-primary">SOLEY?</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Más de una década de experiencia nos respalda como líderes en la fabricación
            de productos de limpieza y amenities de la más alta calidad.
          </p>
        </div>

        {/* Benefits grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="text-center group hover:transform hover:-translate-y-2 transition-all duration-300"
            >
              {/* Icon */}
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-primary to-blue-700 rounded-full flex items-center justify-center mb-6 group-hover:shadow-lg transition-shadow duration-300">
                <span className="text-2xl text-white">{benefit.icon}</span>
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-primary transition-colors">
                {benefit.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>

        {/* Additional content */}
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-8 md:p-12 text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Compromiso con la Excelencia
          </h3>
          <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed mb-6">
            En Soley, cada producto que fabricamos pasa por estrictos controles de calidad.
            Utilizamos materias primas de primera calidad y procesos innovadores para garantizar
            que nuestros clientes reciban productos que superen sus expectativas.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">10+</div>
              <div className="text-gray-600">Años de Experiencia</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">1000+</div>
              <div className="text-gray-600">Clientes Satisfechos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">6</div>
              <div className="text-gray-600">Productos Principales</div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}