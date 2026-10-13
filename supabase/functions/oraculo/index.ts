// Edge Function: proxy seguro hacia la API de Groq (capa gratuita).
//
// La clave (GROQ_API_KEY) es un secreto del proyecto Supabase y NUNCA se envía
// al navegador. El cliente solo conoce la URL pública de esta función.
// Ver scripts/configurar_oraculo.py para configurar el secreto y desplegar.
//
// El proxy es compatible con cualquier proveedor OpenAI-compatible: basta con
// definir ORACULO_API_URL (y opcionalmente ORACULO_PROVIDER para la etiqueta).
//
// Invocación (desde el navegador):
//   POST {SUPABASE_URL}/functions/v1/oraculo
//   headers: apikey: <anon key>, Authorization: Bearer <anon key>
//   body:    { "prompt": "...", "model": "openai/gpt-oss-120b" }
//   resp:    { "text": "...", "model": "...", "fuente": "Groq (proxy)" }

const DEFAULT_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const DEFAULT_MODEL = "openai/gpt-oss-120b";
const DEFAULT_PROVIDER = "Groq";

const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SYSTEM_PROMPT =
  "Eres el Oráculo Imperial de 'LokiTrono de Barrios', la contienda gastronómica " +
  "feudal entre las Casas de Bilbao. Responde SIEMPRE en español con un estilo " +
  "medieval, solemne y tabernero, breve y evocador.";

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }

  if (req.method !== "POST") {
    return json({ error: "Método no permitido. Usa POST." }, 405);
  }

  const apiKey = Deno.env.get("GROQ_API_KEY") ?? Deno.env.get("ORACULO_API_KEY");
  if (!apiKey) {
    return json(
      { error: "El Oráculo no está configurado: falta el secreto GROQ_API_KEY." },
      500,
    );
  }

  const apiUrl = Deno.env.get("ORACULO_API_URL") || DEFAULT_API_URL;
  const proveedor = Deno.env.get("ORACULO_PROVIDER") || DEFAULT_PROVIDER;

  let payload: { prompt?: unknown; model?: unknown };
  try {
    payload = await req.json();
  } catch {
    return json({ error: "Cuerpo JSON inválido." }, 400);
  }

  const prompt = String(payload?.prompt ?? "").trim();
  if (!prompt) {
    return json({ error: "Falta el campo 'prompt'." }, 400);
  }

  const model = String(payload?.model ?? DEFAULT_MODEL).trim() || DEFAULT_MODEL;

  try {
    const respuesta = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: prompt },
        ],
        max_tokens: 700,
        temperature: 0.8,
      }),
    });

    if (!respuesta.ok) {
      const detail = (await respuesta.text()).slice(0, 500);
      return json(
        { error: `El proveedor de IA respondió con HTTP ${respuesta.status}.`, detail },
        502,
      );
    }

    const data = await respuesta.json();
    const text: string =
      data?.choices?.[0]?.message?.content ??
      data?.[0]?.generated_text ??
      "";

    if (!text.trim()) {
      return json({ error: "El modelo devolvió una respuesta vacía." }, 502);
    }

    return json({ text, model, fuente: `${proveedor} (proxy)` });
  } catch (err) {
    return json(
      { error: `No se pudo contactar con el proveedor de IA: ${String(err)}` },
      502,
    );
  }
});
