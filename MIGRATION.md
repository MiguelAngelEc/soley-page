# Soley · Rediseño UI/UX — Guía de migración

Este paquete contiene los archivos `.tsx` rediseñados listos para reemplazar / añadir a tu repo Next.js `soley-page`.

## 📁 Estructura

```
src/
├── app/
│   ├── globals.css         ← REEMPLAZAR
│   ├── layout.tsx          ← REEMPLAZAR (cambia fuentes a Plus Jakarta Sans + JetBrains Mono)
│   └── page.tsx            ← REEMPLAZAR
├── data/
│   ├── products.ts         ← REEMPLAZAR (estructura ampliada con specs, uses, etc.)
│   └── faqs.ts             ← NUEVO
├── lib/
│   └── hooks.ts            ← NUEVO (useReveal, useCountUp, useInView)
└── components/
    ├── shared/
    │   └── Icons.tsx       ← NUEVO (todos los íconos SVG)
    ├── layout/
    │   ├── Header.tsx          ← REEMPLAZAR
    │   ├── Hero.tsx            ← REEMPLAZAR
    │   ├── WhySoley.tsx        ← REEMPLAZAR
    │   ├── Audience.tsx        ← NUEVO (reemplaza TargetMarkets.tsx — bórralo)
    │   ├── Process.tsx         ← NUEVO
    │   ├── Instagram.tsx       ← NUEVO
    │   ├── FAQ.tsx             ← NUEVO
    │   ├── Contact.tsx         ← NUEVO (reemplaza ContactCTA.tsx — bórralo)
    │   ├── Footer.tsx          ← REEMPLAZAR
    │   └── WhatsAppFloat.tsx   ← NUEVO
    └── catalog/
        ├── Catalog.tsx           ← NUEVO (reemplaza FeaturedProducts.tsx — bórralo)
        ├── ProductCard.tsx       ← REEMPLAZAR (totalmente nuevo diseño)
        ├── ProductIllustration.tsx ← NUEVO
        └── ProductModal.tsx      ← NUEVO
```

## 🗑️ Archivos a BORRAR del repo original

```
src/components/layout/TargetMarkets.tsx     (reemplazado por Audience.tsx)
src/components/layout/ContactCTA.tsx        (reemplazado por Contact.tsx)
src/components/catalog/FeaturedProducts.tsx (reemplazado por Catalog.tsx)
src/components/layout/index.ts              (ya no se usa barrel export)
src/components/catalog/index.ts             (ya no se usa barrel export)
src/components/ui/                          (Button, Card, Container quedan sin uso — opcional borrar)
```

## ⚙️ Pasos

1. **Backup**: haz commit de tu estado actual o crea una rama nueva.
2. **Copia los archivos** de `repo/src/` sobre `tu-proyecto/src/` respetando la estructura.
3. **Borra los archivos listados arriba**.
4. **Instala las fuentes nuevas** — ya están en `layout.tsx` (Plus Jakarta Sans + JetBrains Mono via `next/font/google`). No requiere instalación de paquetes.
5. **Verifica que `public/LogoSF.png` existe** en tu repo (ya estaba).
6. **Ejecuta**:
   ```bash
   npm run dev
   ```

## 🎨 Sistema de diseño

| Token        | Color        | Uso                       |
|--------------|--------------|---------------------------|
| `soley-blue` | `#1E5BBA`    | Primario, acentos         |
| `soley-blue-deep` | `#0F3C7A` | Titulares, hover          |
| `soley-blue-ink`  | `#0A2655` | Footer, dark panels       |
| `soley-red`  | `#E11D2E`    | CTAs principales, ribbon  |
| `bg`         | `#FFFFFF`    | Background principal      |
| `bg-soft`    | `#F6F9FD`    | Background secciones      |
| `ink`        | `#0B1736`    | Texto principal           |
| `muted`      | `#5B6B86`    | Texto secundario          |

**Tipografía**: Plus Jakarta Sans (display + body) · JetBrains Mono (números de paso)

## 📞 Datos de contacto (hardcodeados)

- WhatsApp: `+593 96 126 4102` → `https://wa.me/593961264102`
- Email: `soleyjaboneria@gmail.com`
- Dirección: Luis Jaramillo Pérez 4-54 y José Tobar Tobar, Ibarra
- Instagram: `@soleyjaboneria`
- Facebook: `soleyjaboneria`

Si cambian, busca-y-reemplaza en los archivos. Lo ideal es moverlos a un `src/data/contact.ts` central — te lo puedo hacer si lo pides.

## 🧩 Imágenes de producto

Actualmente las cards usan ilustraciones CSS estilizadas con label SOLEY. Cuando tengas las fotos reales de los 6 productos:

1. Súbelas a `public/products/` (ej. `detergente-liquido.png`, `cloro-5.png`, etc.)
2. Añade `image: "/products/detergente-liquido.png"` a cada objeto en `src/data/products.ts`
3. En `src/components/catalog/ProductCard.tsx` y `ProductModal.tsx`, cambia el render para usar `<Image>` cuando exista `product.image`, si no caer al `<ProductIllustration>`.

## ⚡ Componentes interactivos

- **Hero**: carousel auto-rotativo cada 6s, con dots de navegación
- **Catalog**: filtros por categoría + toggle Mayoreo/Menudeo cambia presentaciones visibles
- **ProductModal**: ESC para cerrar, scroll lock en body
- **WhySoley**: contadores animados al entrar en viewport
- **FAQ**: acordeón con una sola pregunta abierta
- **Contact**: formulario que abre WhatsApp con mensaje prellenado
- **WhatsAppFloat**: FAB con popup de opciones rápidas

Cualquier ajuste — colores, copy, nuevas secciones — dímelo y lo aplico.
