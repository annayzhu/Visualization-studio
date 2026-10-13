/** Protocol presets reuse the same checked plan and OpenAI-compatible transport. */
export const providerTypes = ["deepseek", "dify", "openai_compatible", "anthropic"] as const;
export type ProviderType = (typeof providerTypes)[number];

// Defaults verified against https://api-docs.deepseek.com/ on 2026-10-10.
// Keep the model editable: account availability and vendor aliases can change.
export const providerDefaults: Record<ProviderType, { baseUrl: string; model: string }> = {
  deepseek: { baseUrl: "https://api.deepseek.com", model: "deepseek-flash" },
  dify: { baseUrl: "", model: "" },
  openai_compatible: { baseUrl: "", model: "" },
  anthropic: { baseUrl: "https://api.anthropic.com/v1", model: "" },
};
