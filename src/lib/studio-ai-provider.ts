"use client";
import type { AIContext } from "./studio-ai-context";
import type { ProviderType } from "./studio-ai-types";

/**
 * Browser-side model connection settings. They stay on this device: in sessionStorage by
 * default, or localStorage when the user asks to remember them. The key is sent only as a
 * header to this Studio's own proxy route.
 */

export type ProviderSettings = { type: ProviderType; baseUrl: string; model: string; apiKey: string; remember: boolean };

const STORAGE_KEY = "studio.ai.provider";

export const providerLabels: Record<ProviderType, string> = {
  dify: "Dify app (e.g. ZJU aihub)",
  openai_compatible: "OpenAI-compatible (Qwen, OpenAI, vLLM…)",
  anthropic: "Anthropic",
};

export function readProviderSettings(): ProviderSettings | null {
  for (const store of [() => window.sessionStorage, () => window.localStorage]) {
    try {
      const value = store().getItem(STORAGE_KEY);
      if (!value) continue;
      const parsed = JSON.parse(value) as Partial<ProviderSettings>;
      if (parsed.type && typeof parsed.baseUrl === "string" && typeof parsed.apiKey === "string") {
        return { type: parsed.type, baseUrl: parsed.baseUrl, model: parsed.model ?? "", apiKey: parsed.apiKey, remember: Boolean(parsed.remember) };
      }
    } catch {
      // Storage may be blocked; the user can enter settings again.
    }
  }
  return null;
}

export function writeProviderSettings(settings: ProviderSettings | null) {
  try {
    window.sessionStorage.removeItem(STORAGE_KEY);
    window.localStorage.removeItem(STORAGE_KEY);
    if (settings) (settings.remember ? window.localStorage : window.sessionStorage).setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // Storage may be blocked; the settings still apply for this page view.
  }
}

/** The proxy URL under the deployment's base path; trailingSlash is enabled in next.config. */
export function planEndpoint() {
  const base = (process.env.NEXT_PUBLIC_VISUALIZATION_STUDIO_BASE_PATH ?? "").trim().replace(/^\/*/, "/").replace(/\/+$/, "");
  return `${base === "/" ? "" : base}/api/ai/plan/`;
}

async function post(settings: ProviderSettings, body: Record<string, unknown>) {
  const response = await fetch(planEndpoint(), {
    method: "POST",
    headers: { "content-type": "application/json", "x-studio-ai-key": settings.apiKey },
    body: JSON.stringify({ provider: { type: settings.type, baseUrl: settings.baseUrl, model: settings.model }, ...body }),
  });
  const payload = (await response.json().catch(() => ({}))) as { text?: string; model?: string | null; ok?: boolean; error?: string };
  if (!response.ok) throw new Error(payload.error ?? `The assistant request failed (HTTP ${response.status}).`);
  return payload;
}

export async function requestPlan(settings: ProviderSettings, context: AIContext) {
  const payload = await post(settings, { context });
  if (typeof payload.text !== "string") throw new Error("The assistant returned no text.");
  return { text: payload.text, model: payload.model ?? undefined };
}

export async function testProvider(settings: ProviderSettings) {
  const payload = await post(settings, { ping: true });
  return payload.model ?? undefined;
}
