import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { checkRateLimit, resetRateLimit } from "./rateLimit";

beforeEach(() => {
  resetRateLimit();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("checkRateLimit", () => {
  it("deja pasar hasta el limite y bloquea despues", () => {
    for (let i = 0; i < 5; i++) {
      expect(checkRateLimit("1.2.3.4").allowed).toBe(true);
    }
    const bloqueado = checkRateLimit("1.2.3.4");
    expect(bloqueado.allowed).toBe(false);
    expect(bloqueado.retryAfter).toBeGreaterThan(0);
  });

  it("cuenta cada clave por separado", () => {
    for (let i = 0; i < 5; i++) checkRateLimit("1.1.1.1");
    expect(checkRateLimit("1.1.1.1").allowed).toBe(false);
    expect(checkRateLimit("2.2.2.2").allowed).toBe(true);
  });

  it("vuelve a permitir cuando pasa la ventana", () => {
    vi.useFakeTimers();
    for (let i = 0; i < 5; i++) checkRateLimit("3.3.3.3", 5, 1000);
    expect(checkRateLimit("3.3.3.3", 5, 1000).allowed).toBe(false);

    vi.advanceTimersByTime(1001);
    expect(checkRateLimit("3.3.3.3", 5, 1000).allowed).toBe(true);
  });

  it("respeta un limite personalizado", () => {
    expect(checkRateLimit("4.4.4.4", 1).allowed).toBe(true);
    expect(checkRateLimit("4.4.4.4", 1).allowed).toBe(false);
  });
});
