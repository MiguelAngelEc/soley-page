import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Soley - Amenities & Productos de Limpieza | Mayoreo y Menudeo",
  description: "Fabricantes de productos de limpieza de alta calidad. Gel antibacterial, alcohol antiséptico, desinfectantes, jabón líquido, cloro y detergente. Servicio mayoreo para empresas y hoteles, también venta al menudeo.",
  keywords: ["productos limpieza", "gel antibacterial", "desinfectante", "jabón líquido", "cloro", "detergente", "mayoreo", "amenities", "hoteles", "empresas"],
  openGraph: {
    title: "Soley - Amenities & Productos de Limpieza",
    description: "Productos de limpieza y amenities de la más alta calidad para empresas, hoteles y hogares.",
    type: "website",
    locale: "es_MX",
  },
  twitter: {
    card: "summary_large_image",
    title: "Soley - Amenities & Productos de Limpieza",
    description: "Productos de limpieza y amenities de la más alta calidad para empresas, hoteles y hogares.",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
