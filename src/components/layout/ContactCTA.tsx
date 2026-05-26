import { Container, Button } from '@/components/ui';

export function ContactCTA() {
  return (
    <section id="contacto" className="py-16 bg-gradient-to-br from-primary via-blue-800 to-blue-900 text-white">
      <Container>
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            ¿Listo para Trabajar
            <span className="block text-transparent bg-gradient-to-r from-blue-300 to-white bg-clip-text">
              con Nosotros?
            </span>
          </h2>

          <p className="text-lg text-blue-100 mb-8 leading-relaxed">
            Contáctanos hoy mismo para recibir una cotización personalizada.
            Nuestro equipo está listo para atender tus necesidades específicas.
          </p>

          {/* Contact buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button
              size="lg"
              className="bg-accent hover:bg-accent/90 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 px-8 py-4"
            >
              Solicitar Cotización
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 px-8 py-4"
            >
              Hablar con un Asesor
            </Button>
          </div>

          {/* Social media section */}
          <div className="border-t border-white/20 pt-8">
            <p className="text-blue-200 mb-6">Síguenos en nuestras redes sociales</p>

            <div className="flex justify-center space-x-6">
              <a
                href="https://facebook.com/soleyjaboneria"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center space-x-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 transition-all duration-300 hover:scale-105"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium">Facebook</span>
              </a>

              <a
                href="https://instagram.com/soleyjaboneria"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center space-x-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 transition-all duration-300 hover:scale-105"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.621 5.367 11.988 11.988 11.988s11.987-5.367 11.987-11.988C24.004 5.367 18.637.001 12.017.001zM8.449 20.25c-2.608 0-4.72-2.113-4.72-4.721V8.472c0-2.608 2.112-4.72 4.72-4.72h7.102c2.607 0 4.72 2.112 4.72 4.72v7.057c0 2.608-2.113 4.721-4.72 4.721H8.449z" clipRule="evenodd" />
                  <path fillRule="evenodd" d="M12.017 7.075c-2.708 0-4.9 2.192-4.9 4.9s2.192 4.901 4.9 4.901c2.709 0 4.901-2.193 4.901-4.901s-2.192-4.9-4.901-4.9zm0 8.068c-1.748 0-3.168-1.42-3.168-3.168 0-1.747 1.42-3.167 3.168-3.167s3.168 1.42 3.168 3.167c0 1.748-1.42 3.168-3.168 3.168z" clipRule="evenodd" />
                  <circle cx="16.951" cy="7.075" r="1.154" />
                </svg>
                <span className="text-sm font-medium">Instagram</span>
              </a>
            </div>

            <p className="text-blue-200 text-sm mt-4">@soleyjaboneria</p>
          </div>
        </div>
      </Container>
    </section>
  );
}