import { describe, it, expect, vi, afterEach } from "vitest";
import { sendText, isRetryable } from "./openwa";
import type { OpenWaConfig } from "./env";

const config: OpenWaConfig = {
  baseUrl: "https://openwa.interno.example",
  apiKey: "owa_k1_secreta",
  sessionId: "soley-prod",
  salesChatId: "593999999999@c.us",
  timeoutMs: 100,
};

/** Sustituye fetch por una respuesta controlada. */
function mockFetch(impl: (url: string, init: RequestInit) => Promise<Response> | Response) {
  const spy = vi.fn(impl);
  vi.stubGlobal("fetch", spy);
  return spy;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("sendText", () => {
  it("llama al endpoint de la sesion con la API key en cabecera", async () => {
    const spy = mockFetch(() => Response.json({ messageId: "wa_1" }));
    const r = await sendText("hola", config);

    expect(r).toEqual({ ok: true, messageId: "wa_1" });

    const [url, init] = spy.mock.calls[0];
    expect(url).toBe("https://openwa.interno.example/api/sessions/soley-prod/messages/send-text");
    expect((init.headers as Record<string, string>)["X-API-Key"]).toBe("owa_k1_secreta");
    expect(JSON.parse(init.body as string)).toEqual({
      chatId: "593999999999@c.us",
      text: "hola",
    });
  });

  it("acepta el messageId anidado en data", async () => {
    mockFetch(() => Response.json({ data: { id: "wa_2" } }));
    expect(await sendText("hola", config)).toEqual({ ok: true, messageId: "wa_2" });
  });

  it("no falla si la respuesta no trae messageId", async () => {
    mockFetch(() => Response.json({ status: "PENDING" }));
    expect(await sendText("hola", config)).toEqual({ ok: true, messageId: null });
  });

  it("informa que no esta configurado en vez de intentar la llamada", async () => {
    const spy = mockFetch(() => Response.json({}));
    expect(await sendText("hola", null)).toEqual({ ok: false, failure: "not_configured" });
    expect(spy).not.toHaveBeenCalled();
  });

  it("clasifica la credencial rechazada", async () => {
    mockFetch(() => new Response("", { status: 401 }));
    expect(await sendText("hola", config)).toEqual({ ok: false, failure: "unauthorized" });
  });

  it("clasifica el limite de OpenWA", async () => {
    mockFetch(() => new Response("", { status: 429 }));
    expect(await sendText("hola", config)).toEqual({ ok: false, failure: "rate_limited" });
  });

  it("clasifica la sesion no disponible", async () => {
    for (const status of [404, 409, 503]) {
      mockFetch(() => new Response("", { status }));
      expect(await sendText("hola", config)).toEqual({ ok: false, failure: "session_unavailable" });
    }
  });

  it("clasifica el timeout", async () => {
    mockFetch(
      (_url, init) =>
        new Promise<Response>((_resolve, reject) => {
          (init.signal as AbortSignal).addEventListener("abort", () => {
            const err = new Error("abortada");
            err.name = "AbortError";
            reject(err);
          });
        }),
    );
    expect(await sendText("hola", config)).toEqual({ ok: false, failure: "timeout" });
  });

  it("clasifica el fallo de red", async () => {
    mockFetch(() => Promise.reject(new TypeError("fetch failed")));
    expect(await sendText("hola", config)).toEqual({ ok: false, failure: "network_error" });
  });

  it("nunca lanza: cualquier fallo vuelve como resultado", async () => {
    mockFetch(() => {
      throw new Error("algo raro");
    });
    await expect(sendText("hola", config)).resolves.toMatchObject({ ok: false });
  });

  it("no filtra la API key ni la URL en el resultado", async () => {
    mockFetch(() => new Response("detalle interno con owa_k1_secreta", { status: 500 }));
    const r = await sendText("hola", config);
    const serialized = JSON.stringify(r);
    expect(serialized).not.toContain("owa_k1_secreta");
    expect(serialized).not.toContain("openwa.interno.example");
  });
});

describe("isRetryable", () => {
  it("marca como reintentables los fallos transitorios", () => {
    expect(isRetryable("timeout")).toBe(true);
    expect(isRetryable("network_error")).toBe(true);
    expect(isRetryable("session_unavailable")).toBe(true);
  });

  it("no reintenta lo que no se arregla solo", () => {
    expect(isRetryable("unauthorized")).toBe(false);
    expect(isRetryable("not_configured")).toBe(false);
  });
});
