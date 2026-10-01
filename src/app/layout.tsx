import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const jbMono = JetBrains_Mono({
  variable: "--font-jb-mono",
  subsets: ["latin"],
  weight: ["500", "700"],
});

export const metadata: Metadata = {
  title: "Soley · Amenities & Productos de Limpieza | Al por mayor y al por menor",
  description:
    "Fabricantes ecuatorianos de productos de limpieza profesionales. Detergente, cloro, jabón líquido, desinfectante, alcohol y gel antibacterial. Al por mayor y al por menor desde Ibarra.",
  keywords: [
    "productos limpieza Ecuador",
    "detergente líquido",
    "cloro 5%",
    "amenities hotel",
    "jabón líquido",
    "desinfectante",
    "al por mayor Ibarra",
    "soleyjaboneria",
  ],
  openGraph: {
    title: "Soley · Amenities & Productos de Limpieza",
    description:
      "Productos de limpieza profesionales fabricados en Ecuador. Calidad ARCSA para empresas, hoteles y hogares.",
    type: "website",
    locale: "es_EC",
  },
  twitter: {
    card: "summary_large_image",
    title: "Soley · Amenities & Productos de Limpieza",
    description:
      "Productos de limpieza profesionales fabricados en Ecuador. Al por mayor y al por menor.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es"
      className={`${jakarta.variable} ${jbMono.variable} h-full antialiased`}
    >
      <head>
        {/* Ejecuta antes de pintar: solo una recarga completa vuelve al inicio. */}
        <script
          id="reload-scroll-reset"
          dangerouslySetInnerHTML={{
            __html: `(() => {
              const navigation = performance.getEntriesByType("navigation")[0];
              if (!navigation || navigation.type !== "reload") return;
              const restoration = history.scrollRestoration;
              history.scrollRestoration = "manual";
              window.scrollTo({ top: 0, left: 0, behavior: "instant" });
              document.addEventListener("DOMContentLoaded", () => {
                window.scrollTo({ top: 0, left: 0, behavior: "instant" });
              }, { once: true });
              window.addEventListener("pageshow", () => {
                window.scrollTo({ top: 0, left: 0, behavior: "instant" });
                requestAnimationFrame(() => requestAnimationFrame(() => {
                  history.scrollRestoration = restoration;
                }));
              }, { once: true });
            })();`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
