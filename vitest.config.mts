import { defineConfig } from "vitest/config";

export default defineConfig({
  // tsconfigPaths resuelve el alias "@/..." para que las pruebas importen
  // igual que la aplicacion.
  resolve: { tsconfigPaths: true },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
