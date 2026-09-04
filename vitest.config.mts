import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    // tsconfigPaths resuelve el alias "@/..." para que las pruebas importen
    // igual que la aplicacion.
    tsconfigPaths: true,
    alias: {
      // "server-only" lanza si no lo carga un React Server Component. En las
      // pruebas ese contexto no existe, asi que se sustituye por un modulo
      // vacio; la proteccion real sigue activa en el build de Next.
      "server-only": fileURLToPath(new URL("./src/test/serverOnlyStub.ts", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
