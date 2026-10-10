import { providerDefaults, type ProviderType } from "./studio-ai-types";

/**
 * Server-side calls from the Studio proxy to a model endpoint. The API key arrives per request
 * from the browser and is never stored or logged; every error message is scrubbed of it.
 */


export type UpstreamProvider = { type: ProviderType; baseUrl: string; model: string; apiKey: string };

export class UpstreamError extends Error {
  constructor(message: string, readonly status = 502) {
    super(message);
    this.name = "UpstreamError";
  }
}

const RESPONSE_LIMIT = 400_000;


/** Optional allowlist (comma-separated host names) so a shared deployment cannot be used to reach internal hosts. */
export function checkAllowedHost(baseUrl: string, allowList = process.env.STUDIO_AI_ALLOWED_HOSTS) {
  let url: URL;
  try {
    url = new URL(baseUrl);
  } catch {
    throw new UpstreamError("The base URL is not a valid URL.", 400);
  }
  if (!["http:", "https:"].includes(url.protocol) || url.username || url.password) throw new UpstreamError("The base URL must be http(s) without embedded credentials.", 400);
  const hosts = (allowList ?? "").split(",").map((host) => host.trim().toLowerCase()).filter(Boolean);
  if (hosts.length && !hosts.includes(url.hostname.toLowerCase())) throw new UpstreamError(`Host ${url.hostname} is not in STUDIO_AI_ALLOWED_HOSTS.`, 403);
  return url.toString().replace(/\/+$/, "");
}

function scrub(message: string, apiKey: string) {
  return apiKey ? message.split(apiKey).join("[redacted]").split(encodeURIComponent(apiKey)).join("[redacted]") : message;
}

async function readLimited(response: Response) {
  const text = await response.text();
  if (text.length > RESPONSE_LIMIT) throw new UpstreamError("The model response is too large.");
  return text;
}

export async function callUpstream(
  provider: UpstreamProvider,
  system: string,
  user: string,
  options: { fetchImpl?: typeof fetch; timeoutMs?: number } = {},
): Promise<{ text: string; model?: string }> {
  const fetchImpl = options.fetchImpl ?? fetch;
  const base = checkAllowedHost(provider.baseUrl.trim() || providerDefaults[provider.type]?.baseUrl || "");
  if (!provider.apiKey) throw new UpstreamError("No API key was provided.", 400);
  if (provider.type !== "dify" && !provider.model.trim()) throw new UpstreamError("A model name is required.", 400);

  const request: { path: string; headers: Record<string, string>; body: unknown } =
    provider.type === "anthropic"
      ? { path: "/messages", headers: { "x-api-key": provider.apiKey, "anthropic-version": "2023-06-01" }, body: { model: provider.model, max_tokens: 2048, temperature: 0, system, messages: [{ role: "user", content: user }] } }
      : provider.type === "dify"
        ? { path: "/chat-messages", headers: { authorization: `Bearer ${provider.apiKey}` }, body: { inputs: {}, query: `${system}\n\n${user}`, response_mode: "blocking", user: "visualization-studio" } }
        : { path: "/chat/completions", headers: { authorization: `Bearer ${provider.apiKey}` }, body: { model: provider.model, temperature: 0, messages: [{ role: "system", content: system }, { role: "user", content: user }] } };

  let response: Response;
  try {
    response = await fetchImpl(`${base}${request.path}`, {
      method: "POST",
      // Credentials must never follow a redirect beyond the checked model host.
      redirect: "error",
      headers: { "content-type": "application/json", ...request.headers },
      body: JSON.stringify(request.body),
      signal: AbortSignal.timeout(options.timeoutMs ?? 60_000),
    });
  } catch (error) {
    const reason = error instanceof Error && (error.name === "TimeoutError" || error.name === "AbortError") ? "the request timed out" : error instanceof Error ? error.message : "network error";
    throw new UpstreamError(scrub(`Could not reach the model endpoint: ${reason}.`, provider.apiKey));
  }
  const body = await readLimited(response);
  if (!response.ok) {
    let detail = body;
    try {
      const json = JSON.parse(body) as { error?: { message?: string } | string; message?: string };
      detail = typeof json.error === "string" ? json.error : json.error?.message ?? json.message ?? body;
    } catch {
      // keep text
    }
    throw new UpstreamError(scrub(`The model endpoint returned HTTP ${response.status}: ${scrub(detail, provider.apiKey).slice(0, 300)}`, provider.apiKey), response.status === 401 || response.status === 403 ? 401 : 502);
  }
  let json: Record<string, unknown>;
  try {
    json = JSON.parse(body);
  } catch {
    throw new UpstreamError("The model endpoint did not return JSON.");
  }
  if (provider.type === "anthropic") {
    const blocks = Array.isArray(json.content) ? (json.content as { type?: string; text?: string }[]) : [];
    const text = blocks.filter((block) => block.type === "text").map((block) => block.text ?? "").join("");
    if (!text) throw new UpstreamError("The model returned no text.");
    return { text, model: typeof json.model === "string" ? json.model : provider.model };
  }
  if (provider.type === "dify") {
    if (typeof json.answer !== "string" || !json.answer.trim()) throw new UpstreamError("The Dify application returned an empty answer.");
    return { text: json.answer, model: provider.model || undefined };
  }
  const choices = Array.isArray(json.choices) ? (json.choices as { message?: { content?: unknown } }[]) : [];
  const content = choices[0]?.message?.content;
  const text = typeof content === "string" ? content : Array.isArray(content) ? content.map((part) => (typeof part?.text === "string" ? part.text : "")).join("") : "";
  if (!text) throw new UpstreamError("The model returned no message.");
  return { text, model: typeof json.model === "string" ? json.model : provider.model };
}
