// Sustituto de "server-only" para las pruebas.
//
// El paquete real lanza si no lo importa un React Server Component. Vitest no
// crea ese contexto, asi que aqui no hace nada: la proteccion sigue activa en
// el build de Next, que es donde importa.
export {};
