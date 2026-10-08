import { afterEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/ai/plan/route";
import { assistantCatalog, assistantSettingKeysFor, catalogText } from "./studio-ai-catalog";
import { buildAIContext, isAIContext, profileColumns, publicationChecks } from "./studio-ai-context";
import { buildPlanPrompt, checkPlan, manualPrompt, parsePlanText } from "./studio-ai-plan";
import { callUpstream, checkAllowedHost } from "./studio-ai-upstream";
import { defaultVisualizationSettings, getPlotModule, parseDelimitedData, plotModuleRegistry, type PlotType } from "./visualization-studio";

const table = parseDelimitedData([
  "sample\ttreatment\tdose\texpression\tnote",
  "S1\tcontrol\t0\t1.2\tok",
  "S2\tcontrol\t0\t1.4\t",
  "S3\tdrug\t10\t2.8\tbatch 2",
  "S4\tdrug\t10\t3.1\tok",
].join("\n"));

const current = { plotType: "bar" as PlotType, mapping: { category: "treatment", value: "expression" }, settings: defaultVisualizationSettings, themeId: "cn-beihai" as const, dataset: table };

function contextFor(request = "Compare expression by treatment", includeSampleRows = false) {
  return buildAIContext({ request, locale: "en", dataset: table, includeSampleRows, plotType: "bar", mapping: current.mapping, validationErrors: [], publicationChecks: [] });
}

describe("assistant catalog", () => {
  it("covers every registered plot and only real roles", () => {
    const catalog = assistantCatalog();
    expect(catalog).toHaveLength(plotModuleRegistry.list().length);
    expect(catalog.length).toBeGreaterThanOrEqual(82);
    for (const item of catalog) expect(item.roles.map((role) => role.key)).toEqual(getPlotModule(item.id).definition.roles.map((role) => role.key));
    expect(catalogText()).toContain("violin | Violin");
  });

  it("never exposes statistical settings to the model", () => {
    for (const { definition } of plotModuleRegistry.list()) {
      const keys = assistantSettingKeysFor(definition.id);
      expect(keys.some((key) => /significance|pValue|PValue|AnalysisMode|ErrorType|Adjustment/i.test(key))).toBe(false);
    }
    expect(assistantSettingKeysFor("bar")).toContain("title");
  });
});

describe("data context", () => {
  it("profiles columns without values unless the user opts in", () => {
    expect(profileColumns(table)).toEqual([
      { name: "sample", kind: "label", missing: 0, distinct: 4 },
      { name: "treatment", kind: "category", missing: 0, distinct: 2 },
      { name: "dose", kind: "number", missing: 0, distinct: 2, min: 0, max: 10 },
      { name: "expression", kind: "number", missing: 0, distinct: 4, min: 1.2, max: 3.1 },
      { name: "note", kind: "category", missing: 1, distinct: 2 },
    ]);
    const context = contextFor();
    expect(context.sampleRows).toBeUndefined();
    expect(JSON.stringify(context)).not.toContain("batch 2");
    const shared = contextFor("x", true);
    expect(shared.sampleRows).toHaveLength(4);
    expect(isAIContext(shared)).toBe(true);
  });

  it("guards the proxy against extra fields and oversized input", () => {
    expect(isAIContext(contextFor())).toBe(true);
    expect(isAIContext({ ...contextFor(), raw: "a\tb" })).toBe(false);
    expect(isAIContext({ ...contextFor(), request: "x".repeat(2001) })).toBe(false);
    expect(isAIContext({ ...contextFor(), sampleRows: Array.from({ length: 6 }, () => ({ a: "1" })) })).toBe(false);
    expect(isAIContext({ ...contextFor(), current: { ...contextFor().current, plotType: "pie-chart-3d" } })).toBe(false);
  });

  it("builds a prompt with the catalog, rules and profile but no cell values", () => {
    const { system, user } = buildPlanPrompt(contextFor());
    expect(system).toContain("Never choose or change statistical tests");
    expect(system).toContain("violin");
    expect(user).toContain('"name":"expression"');
    expect(user).not.toContain("batch 2");
    expect(manualPrompt(contextFor())).toContain("---");
  });
});

describe("plan checks", () => {
  const plan = (value: Record<string, unknown>) => checkPlan(parsePlanText("```json\n" + JSON.stringify(value) + "\n```").raw, current);

  it("accepts a valid plan and lists the changes", () => {
    const result = plan({ plotType: "violin", mapping: { group: "treatment", value: "expression" }, settingsPatch: { legendPosition: "bottom", title: "Expression" }, themeId: "nature", caption: { en: "Violin plot", zh: "小提琴图" }, rationale: "Shows distributions.", questions: [] });
    expect(result.errors).toEqual([]);
    expect(result.canApply).toBe(true);
    expect(result.changes.map((change) => `${change.kind}:${change.key}`)).toEqual(expect.arrayContaining(["plot:plotType", "theme:themeId", "mapping:group", "setting:title"]));
    expect(result.plan.caption.zh).toBe("小提琴图");
  });

  it("blocks unknown plots, missing columns, and missing required roles", () => {
    expect(plan({ plotType: "spiral", mapping: {} }).errors[0]).toMatch(/Unknown plot type/);
    expect(plan({ plotType: "violin", mapping: { group: "arm", value: "expression" } }).errors.join()).toMatch(/Column "arm"/);
    const missing = plan({ plotType: "scatter", mapping: { x: "dose" } });
    expect(missing.canApply).toBe(false);
    expect(missing.errors.join()).toMatch(/Required role/);
  });

  it("drops statistical, unsupported, and out-of-range settings without blocking", () => {
    const result = plan({ plotType: "bar", mapping: current.mapping, settingsPatch: { showSignificance: true, barAnalysisMode: "raw-independent", width: 99999, opacity: "0.5", legendPosition: "left" } });
    expect(result.plan.settingsPatch).toEqual({ opacity: 0.5 });
    expect(result.dropped).toHaveLength(4);
    expect(result.canApply).toBe(true);
  });

  it("keeps questions and rejects non-JSON text", () => {
    const result = plan({ plotType: "bar", mapping: current.mapping, questions: ["Are the samples paired?"] });
    expect(result.plan.questions).toEqual(["Are the samples paired?"]);
    expect(() => parsePlanText("I would draw a bar chart.")).toThrow(/no JSON/);
  });
});

describe("publication checks", () => {
  it("flags tiny text, repeated colors, hidden legends, and similar lightness", () => {
    const settings = { ...defaultVisualizationSettings, width: 1200, tickSize: 8, legendPosition: "none" as const, categoricalColors: ["#336699", "#336698"] };
    const ids = publicationChecks({ plotType: "bar", settings, settingKeys: getPlotModule("bar").capabilities.settingKeys.concat("legendPosition"), groupCount: 3 }).map((check) => check.id);
    expect(ids).toEqual(["font-size", "palette-repeat", "legend-hidden", "grayscale"]);
    expect(publicationChecks({ plotType: "bar", settings: defaultVisualizationSettings, settingKeys: getPlotModule("bar").capabilities.settingKeys, groupCount: 1 })).toEqual([]);
  });
});

describe("upstream calls", () => {
  const replies: Array<{ url: string; init: RequestInit }> = [];
  const fake = (body: unknown, status = 200) => (async (url: RequestInfo | URL, init?: RequestInit) => {
    replies.push({ url: String(url), init: init ?? {} });
    return new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });
  }) as typeof fetch;
  afterEach(() => { replies.length = 0; vi.unstubAllGlobals(); vi.unstubAllEnvs(); });

  it("speaks the three provider dialects", async () => {
    await callUpstream({ type: "openai_compatible", baseUrl: "https://m.example/v1/", model: "qwen-plus", apiKey: "k1" }, "sys", "usr", { fetchImpl: fake({ model: "qwen-plus", choices: [{ message: { content: "{}" } }] }) });
    await callUpstream({ type: "dify", baseUrl: "https://aihub.example/v1", model: "", apiKey: "k2" }, "sys", "usr", { fetchImpl: fake({ answer: "{}" }) });
    await callUpstream({ type: "anthropic", baseUrl: "", model: "claude-x", apiKey: "k3" }, "sys", "usr", { fetchImpl: fake({ content: [{ type: "text", text: "{}" }] }) });
    expect(replies.map((reply) => reply.url)).toEqual(["https://m.example/v1/chat/completions", "https://aihub.example/v1/chat-messages", "https://api.anthropic.com/v1/messages"]);
    expect(JSON.parse(String(replies[1].init.body)).response_mode).toBe("blocking");
    expect((replies[2].init.headers as Record<string, string>)["x-api-key"]).toBe("k3");
  });

  it("scrubs the key from errors and enforces the host allowlist", async () => {
    await expect(callUpstream({ type: "openai_compatible", baseUrl: "https://m.example/v1", model: "m", apiKey: "secret-key-123" }, "s", "u", { fetchImpl: fake({ error: { message: "bad key secret-key-123" } }, 401) }))
      .rejects.toThrow(/\[redacted\]/);
    expect(() => checkAllowedHost("https://evil.internal/v1", "aihub.zju.edu.cn")).toThrow(/not in STUDIO_AI_ALLOWED_HOSTS/);
    expect(checkAllowedHost("https://aihub.zju.edu.cn/v1/", "aihub.zju.edu.cn")).toBe("https://aihub.zju.edu.cn/v1");
    expect(() => checkAllowedHost("file:///etc/passwd", "")).toThrow(/http/);
  });
});

describe("proxy route", () => {
  afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); });
  const call = (body: unknown, headers: Record<string, string> = {}) => POST(new Request("http://127.0.0.1:3400/api/ai/plan/", {
    method: "POST",
    headers: { "content-type": "application/json", origin: "http://127.0.0.1:3400", host: "127.0.0.1:3400", "x-studio-ai-key": "route-key", ...headers },
    body: JSON.stringify(body),
  }));
  const provider = { type: "openai_compatible", baseUrl: "https://m.example/v1", model: "m" };

  it("builds the prompt server-side and returns the model text", async () => {
    const seen: string[] = [];
    vi.stubGlobal("fetch", (async (_url: RequestInfo | URL, init?: RequestInit) => {
      seen.push(String(init?.body));
      return new Response(JSON.stringify({ model: "m", choices: [{ message: { content: '{"plotType":"bar"}' } }] }), { status: 200 });
    }) as typeof fetch);
    const response = await call({ provider, context: contextFor() });
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ text: '{"plotType":"bar"}', model: "m" });
    expect(seen[0]).toContain("Plot catalog");
    expect(seen[0]).not.toContain("route-key");
  });

  it("rejects foreign origins, raw tables, and disabled deployments before calling out", async () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);
    expect((await call({ provider, context: contextFor() }, { origin: "https://evil.example" })).status).toBe(403);
    expect((await call({ provider, context: { ...contextFor(), raw: "S1\t1" } })).status).toBe(400);
    expect((await call({ provider: { type: "ftp" }, context: contextFor() })).status).toBe(400);
    vi.stubEnv("STUDIO_AI_PROXY", "off");
    expect((await call({ provider, context: contextFor() })).status).toBe(404);
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
