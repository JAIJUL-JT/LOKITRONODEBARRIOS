// Edge Function: proxy seguro hacia la Inference API de Hugging Face.
//
// El token de Hugging Face (HF_TOKEN) es un secreto del proyecto Supabase y
// NUNCA se envía al navegador. El cliente solo conoce la URL pública de esta
// función. Ver scripts/configurar_oraculo_hf.py para configurar el secreto y
// desplegar.
//
// Invocación (desde el navegador):
//   POST {SUPABASE_URL}/functions/v1/oraculo-hf
//   headers: apikey: <anon key>, Authorization: Bearer <anon key>
//   body:    { "prompt": "...", "model": "meta-llama/Llama-3.1-8B-Instruct" }
//   resp:    { "text": "...", "model": "...", "fuente": "Hugging Face (proxy)" }

const HF_CHAT_ENDPOINT = "https://router.huggingface.co/v1/chat/completions";
const DEFAULT_MODEL = "meta-llama/Llama-3.1-8B-Instruct";

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

  const token = Deno.env.get("HF_TOKEN");
  if (!token) {
    return json(
      { error: "El Oráculo no está configurado: falta el secreto HF_TOKEN." },
      500,
    );
  }

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
    const hfResponse = await fetch(HF_CHAT_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
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

    if (!hfResponse.ok) {
      const detail = (await hfResponse.text()).slice(0, 500);
      return json(
        { error: `Hugging Face respondió con HTTP ${hfResponse.status}.`, detail },
        502,
      );
    }

    const data = await hfResponse.json();
    const text: string =
      data?.choices?.[0]?.message?.content ??
      data?.[0]?.generated_text ??
      "";

    if (!text.trim()) {
      return json({ error: "El modelo devolvió una respuesta vacía." }, 502);
    }

    return json({ text, model, fuente: "Hugging Face (proxy)" });
  } catch (err) {
    return json(
      { error: `No se pudo contactar con Hugging Face: ${String(err)}` },
      502,
    );
  }
});
