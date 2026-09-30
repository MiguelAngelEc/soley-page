import type { NextConfig } from "next";

// CSP en modo reporte (AUD-003). Next.js inyecta scripts y estilos inline para
// hidratacion y styled-jsx, por lo que 'unsafe-inline' se mantiene hasta migrar
// a nonce/hash. Observar violaciones antes de convertirla en exigible.
const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "style-src 'self' 'unsafe-inline'",
  "script-src 'self' 'unsafe-inline'",
  "frame-src https://www.google.com",
  "connect-src 'self'",
  // Sin 'upgrade-insecure-requests': en modo Report-Only el navegador la
  // ignora y solo emite un aviso en consola. Vercel ya sirve todo por HTTPS.
].join("; ");

const nextConfig: NextConfig = {
  // Fija la raiz del workspace: hay un pnpm-lock.yaml en un directorio padre y
  // Turbopack lo tomaba como raiz, ampliando el alcance del build (AUD-007).
  turbopack: { root: __dirname },
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy-Report-Only", value: contentSecurityPolicy },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
          },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
