import { isAIContext } from "@/lib/studio-ai-context";
import { buildPlanPrompt } from "@/lib/studio-ai-plan";
import { providerTypes, type ProviderType } from "@/lib/studio-ai-types";
import { UpstreamError, callUpstream } from "@/lib/studio-ai-upstream";

export const runtime = "nodejs";

const BODY_LIMIT = 200_000;

/**
 * Same-origin proxy for the figure assistant. It accepts only a data profile (never a raw
 * table), builds the prompt itself, forwards it to the endpoint the user configured, and
 * returns the model text. Nothing is stored. Set STUDIO_AI_PROXY=off to disable it.
 */
export async function POST(request: Request) {
  if (process.env.STUDIO_AI_PROXY === "off") return Response.json({ error: "The AI assistant proxy is disabled on this deployment." }, { status: 404 });
  if (request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !== "application/json") return Response.json({ error: "Send application/json." }, { status: 415 });
  try {
    const origin = new URL(request.headers.get("origin") ?? "");
    const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? new URL(request.url).host;
    if (origin.host !== host) throw new Error("origin");
  } catch {
    return Response.json({ error: "Requests must come from the Studio page on this origin." }, { status: 403 });
  }
  const raw = await request.text();
  if (raw.length > BODY_LIMIT) return Response.json({ error: "The request is too large." }, { status: 413 });
  let body: { provider?: { type?: string; baseUrl?: string; model?: string }; context?: unknown; ping?: boolean };
  try {
    body = JSON.parse(raw);
  } catch {
    return Response.json({ error: "The request is not valid JSON." }, { status: 400 });
  }
  const type = body.provider?.type as ProviderType;
  if (!providerTypes.includes(type) || typeof body.provider?.baseUrl !== "string" || typeof body.provider?.model !== "string") {
    return Response.json({ error: "Provider settings are incomplete." }, { status: 400 });
  }
  const apiKey = request.headers.get("x-studio-ai-key")?.trim() ?? "";
  const provider = { type, baseUrl: body.provider.baseUrl, model: body.provider.model, apiKey };

  let prompt: { system: string; user: string };
  if (body.ping === true) prompt = { system: "Reply with the single word OK.", user: "ping" };
  else if (isAIContext(body.context)) prompt = buildPlanPrompt(body.context);
  else return Response.json({ error: "The data profile is missing or exceeds the allowed fields and sizes." }, { status: 400 });

  try {
    const result = await callUpstream(provider, prompt.system, prompt.user);
    return Response.json(body.ping ? { ok: true, model: result.model ?? null } : { text: result.text, model: result.model ?? null }, { headers: { "cache-control": "no-store" } });
  } catch (error) {
    const status = error instanceof UpstreamError ? error.status : 502;
    return Response.json({ error: error instanceof Error ? error.message : "The model request failed." }, { status, headers: { "cache-control": "no-store" } });
  }
}
