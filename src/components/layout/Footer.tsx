import { Container } from '@/components/ui';
import Image from 'next/image';

export function Footer() {
  return (
    <footer className="bg-primary text-secondary">
      <Container className="py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo y descripción */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Image
                src="/Logo.png"
                alt="Soley Logo"
                width={100}
                height={100}
                className="rounded-full"
              />
            </div>
            <p className="text-gray-200 text-sm">
              Productos de limpieza y amenities de la más alta calidad para empresas y hogares.
            </p>
          </div>

          {/* Enlaces rápidos */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Enlaces</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#inicio" className="text-gray-200 hover:text-white transition-colors">
                  Inicio
                </a>
              </li>
              <li>
                <a href="#productos" className="text-gray-200 hover:text-white transition-colors">
                  Productos
                </a>
              </li>
              <li>
                <a href="#nosotros" className="text-gray-200 hover:text-white transition-colors">
                  Nosotros
                </a>
              </li>
              <li>
                <a href="#contacto" className="text-gray-200 hover:text-white transition-colors">
                  Contacto
                </a>
              </li>
            </ul>
          </div>

          {/* Contacto y redes */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Síguenos</h3>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com/soleyjaboneria"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-200 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a
                href="https://instagram.com/soleyjaboneria"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-200 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.621 5.367 11.988 11.988 11.988s11.987-5.367 11.987-11.988C24.004 5.367 18.637.001 12.017.001zM8.449 20.25c-2.608 0-4.72-2.113-4.72-4.721V8.472c0-2.608 2.112-4.72 4.72-4.72h7.102c2.607 0 4.72 2.112 4.72 4.72v7.057c0 2.608-2.113 4.721-4.72 4.721H8.449z" clipRule="evenodd" />
                  <path fillRule="evenodd" d="M12.017 7.075c-2.708 0-4.9 2.192-4.9 4.9s2.192 4.901 4.9 4.901c2.709 0 4.901-2.193 4.901-4.901s-2.192-4.9-4.901-4.9zm0 8.068c-1.748 0-3.168-1.42-3.168-3.168 0-1.747 1.42-3.167 3.168-3.167s3.168 1.42 3.168 3.167c0 1.748-1.42 3.168-3.168 3.168z" clipRule="evenodd" />
                  <circle cx="16.951" cy="7.075" r="1.154" />
                </svg>
              </a>
            </div>
            <p className="text-gray-200 text-sm">@soleyjaboneria</p>
          </div>
        </div>

        <div className="border-t border-gray-600 mt-8 pt-8 text-center">
          <p className="text-gray-200 text-sm">
            © 2024 Soley - Amenities & Productos de Limpieza. Todos los derechos reservados.
          </p>
        </div>
      </Container>
    </footer>
  );
}