import { buildAIContext } from "./studio-ai-context";
import { buildPlanPrompt, checkPlan, parsePlanText, type FigurePlan } from "./studio-ai-plan";
import {
  defaultVisualizationSettings,
  getPlotModule,
  inferPlotMapping,
  isPlotRoleActive,
  parseDelimitedData,
  type PlotType,
} from "./visualization-studio";

/**
 * Fixed evaluation cases for the figure assistant. Each case uses a bundled example table,
 * a request that describes the goal without naming the plot, and the plots a reviewer would
 * accept. A case passes when the plan validates, picks an accepted plot, and maps every
 * task-specific role to an independently specified column, including group/series roles.
 */

export type EvalCase = { id: string; source: PlotType; request: string; locale: "en" | "zh"; accept: PlotType[]; expectedMapping: Record<string, string> };

export const evalCases: EvalCase[] = [
  { id: "distribution-by-group", source: "violin", locale: "en", request: "Show how the values are distributed in each group, including the individual observations.", accept: ["violin", "box", "beeswarm", "raincloud"], expectedMapping: {"group": "group", "value": "value"} },
  { id: "two-numeric", source: "scatter", locale: "zh", request: "看看两个数值变量之间是否有关系。", accept: ["scatter", "correlation"], expectedMapping: {"x": "x", "y": "y"} },
  { id: "time-course", source: "line", locale: "en", request: "Plot how the measurement changes over time for each series.", accept: ["line", "area"], expectedMapping: {"x": "time", "value": "value", "series": "series"} },
  { id: "single-distribution", source: "histogram", locale: "zh", request: "展示这个变量的分布形状。", accept: ["histogram", "density"], expectedMapping: {"group": "group", "value": "value"} },
  { id: "differential", source: "volcano", locale: "en", request: "Show fold change against significance for all genes and highlight the strongest hits.", accept: ["volcano"], expectedMapping: {"label": "gene", "effect": "log2FC", "pValue": "padj"} },
  { id: "matrix", source: "heatmap", locale: "zh", request: "把这个表达矩阵画成热图。", accept: ["heatmap", "clustered-heatmap"], expectedMapping: {} },
  { id: "survival", source: "km", locale: "en", request: "Compare survival over follow-up time between the groups.", accept: ["km"], expectedMapping: {"time": "time", "event": "event", "group": "group"} },
  { id: "sets", source: "venn", locale: "zh", request: "比较几个基因集合之间的交集。", accept: ["venn", "upset"], expectedMapping: {"item": "item", "set": "set"} },
  { id: "ordination", source: "pca", locale: "en", request: "Show sample similarity on the first two components, colored by group.", accept: ["pca"], expectedMapping: {"x": "PC1", "y": "PC2", "group": "group"} },
  { id: "enrichment", source: "enrichment", locale: "zh", request: "展示富集分析结果中最显著的通路。", accept: ["enrichment", "enrichment-bar"], expectedMapping: {"term": "term", "ratio": "geneRatio", "pValue": "padj", "background": "background"} },
];

export function caseContext(item: EvalCase) {
  const source = getPlotModule(item.source);
  const dataset = parseDelimitedData(source.examples[0]?.data ?? source.definition.sampleData);
  // Start from a neutral figure so the request, not the current state, drives the choice.
  const startPlot: PlotType = "bar";
  const context = buildAIContext({ request: item.request, locale: item.locale, dataset, includeSampleRows: false, plotType: startPlot, mapping: {}, validationErrors: [], publicationChecks: [] });
  return { dataset, context, startPlot };
}

/** The registry's own auto-mapping for active roles: what a correct answer looks like. */
export function referenceMapping(plotType: PlotType, headers: string[]) {
  const definition = getPlotModule(plotType).definition;
  const inferred = inferPlotMapping(definition, headers);
  return Object.fromEntries(definition.roles.filter((role) => isPlotRoleActive(plotType, role.key, defaultVisualizationSettings) && inferred[role.key]).map((role) => [role.key, inferred[role.key]]));
}

export type EvalOutcome = { id: string; passed: boolean; plotType?: string; reason?: string; elapsedMs: number; plan?: FigurePlan; ignored?: string[] };

export async function runEval(complete: (system: string, user: string) => Promise<string>, cases = evalCases) {
  const outcomes: EvalOutcome[] = [];
  for (const item of cases) {
    const started = Date.now();
    const { dataset, context, startPlot } = caseContext(item);
    try {
      const { system, user } = buildPlanPrompt(context);
      const { raw } = parsePlanText(await complete(system, user));
      const checked = checkPlan(raw, { plotType: startPlot, mapping: {}, settings: defaultVisualizationSettings, themeId: "cn-beihai", dataset });
      const plotType = checked.plan.plotType;
      const wrong = Object.entries(item.expectedMapping).filter(([role, column]) => checked.plan.mapping[role] !== column);
      const reason = !checked.canApply ? checked.errors.join(" ")
        : !item.accept.includes(plotType) ? `plot ${plotType} not in ${item.accept.join("/")}`
        : wrong.length ? `mapping ${wrong.map(([role, column]) => `${role}≠${column}`).join(", ")}`
        : !checked.plan.caption.en || !checked.plan.caption.zh ? "Both caption drafts are required; factuality still needs human review."
        : undefined;
      outcomes.push({ id: item.id, passed: !reason, plotType, reason, plan: checked.plan, ignored: checked.dropped, elapsedMs: Date.now() - started });
    } catch (error) {
      outcomes.push({ id: item.id, passed: false, reason: error instanceof Error ? error.message : String(error), elapsedMs: Date.now() - started });
    }
  }
  return {
    rubric: "2026-10-10.semantic-v2",
    manualReviewRequired: ["Scientific suitability and caption factuality", "Rendered figure and exported files"],
    passed: outcomes.filter((outcome) => outcome.passed).length, total: cases.length, outcomes,
  };
}
