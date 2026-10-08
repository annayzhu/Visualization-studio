import { writeFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { caseContext, evalCases, referenceMapping, runEval } from "./studio-ai-eval";
import { checkPlan } from "./studio-ai-plan";
import { defaultVisualizationSettings } from "./visualization-studio";
import { callUpstream } from "./studio-ai-upstream";
import type { ProviderType } from "./studio-ai-types";

describe("assistant evaluation harness", () => {
  it("every case has a usable table and a valid reference answer", () => {
    for (const item of evalCases) {
      const { dataset, startPlot } = caseContext(item);
      expect(dataset.errors, item.id).toEqual([]);
      const checked = checkPlan({ plotType: item.accept[0], mapping: referenceMapping(item.accept[0], dataset.headers) }, { plotType: startPlot, mapping: {}, settings: defaultVisualizationSettings, themeId: "cn-beihai", dataset });
      expect(checked.errors, item.id).toEqual([]);
    }
  });

  it("scores a reference model that answers every case correctly as 10/10, and a wrong one as 0", async () => {
    let index = 0;
    const reference = async () => {
      const item = evalCases[index++];
      const { dataset } = caseContext(item);
      return JSON.stringify({ plotType: item.accept[0], mapping: referenceMapping(item.accept[0], dataset.headers), caption: { en: "", zh: "" }, rationale: "", questions: [] });
    };
    const good = await runEval(reference);
    expect(good.outcomes.filter((outcome) => !outcome.passed)).toEqual([]);
    expect(good.passed).toBe(10);
    const bad = await runEval(async () => JSON.stringify({ plotType: "pie", mapping: {} }));
    expect(bad.passed).toBe(0);
  });

  // Live run: STUDIO_AI_EVAL_TYPE=openai_compatible STUDIO_AI_EVAL_BASE_URL=… STUDIO_AI_EVAL_MODEL=… STUDIO_AI_EVAL_KEY=… npm run eval:assistant
  it.skipIf(!process.env.STUDIO_AI_EVAL_KEY)("live model passes at least 8 of 10 cases", async () => {
    const provider = {
      type: (process.env.STUDIO_AI_EVAL_TYPE ?? "openai_compatible") as ProviderType,
      baseUrl: process.env.STUDIO_AI_EVAL_BASE_URL ?? "",
      model: process.env.STUDIO_AI_EVAL_MODEL ?? "",
      apiKey: process.env.STUDIO_AI_EVAL_KEY ?? "",
    };
    const result = await runEval(async (system, user) => (await callUpstream(provider, system, user, { timeoutMs: 120_000 })).text);
    const report = { at: new Date().toISOString(), provider: provider.type, model: provider.model, ...result };
    writeFileSync(process.env.STUDIO_AI_EVAL_REPORT ?? "studio-ai-eval-report.json", JSON.stringify(report, null, 2));
    expect(result.passed).toBeGreaterThanOrEqual(8);
  }, 30 * 60_000);
});
