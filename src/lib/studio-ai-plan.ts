import { assistantSettingKeysFor, assistantSettings, catalogText, isAssistantSettingKey, isPlotType, isThemeId, settingsText, themesText, type AssistantSettingKey } from "./studio-ai-catalog";
import type { AIContext } from "./studio-ai-context";
import {
  getPlotModule,
  isPlotRoleActive,
  journalThemes,
  validatePlotDataset,
  type JournalThemeId,
  type ParsedDataset,
  type PlotType,
  type VisualizationSettings,
} from "./visualization-studio";

/**
 * A figure plan is the model's proposal. It is parsed loosely, then every part is checked
 * against the plot registry, the current table, and the settings whitelist. Only a plan
 * without errors can be applied, and applying it is always undoable.
 */

export type FigurePlan = {
  plotType: PlotType;
  mapping: Record<string, string>;
  settingsPatch: Partial<Pick<VisualizationSettings, AssistantSettingKey>>;
  themeId?: JournalThemeId;
  caption: { en: string; zh: string };
  rationale: string;
  questions: string[];
};

export type PlanChange = { kind: "plot" | "mapping" | "setting" | "theme"; key: string; from: string; to: string };

export type CheckedPlan = {
  plan: FigurePlan;
  changes: PlanChange[];
  errors: string[];
  /** Parts of the model output that were dropped, with the reason. */
  dropped: string[];
  warnings: string[];
  canApply: boolean;
};

export const PLAN_RESPONSE_LIMIT = 100_000;

export function buildPlanPrompt(context: AIContext) {
  const system = [
    "You are a figure assistant inside Visualization Studio, a scientific plotting tool. You propose a figure plan; the scientist reviews it, and the tool validates and renders it.",
    "Return only one JSON object:",
    '{"plotType": string, "mapping": {roleKey: columnName}, "settingsPatch": {settingKey: value}, "themeId": string (optional), "caption": {"en": string, "zh": string}, "rationale": string, "questions": [string]}',
    "Rules:",
    "- plotType must be an id from the catalog. Prefer simple, conventional plots that answer the stated question.",
    "- mapping keys must be role keys of that plot; values must be exact column names from the data profile. Fill every required role (marked *).",
    `- settingsPatch may only use these keys and ranges: ${settingsText()}. Omit keys you do not need to change.`,
    `- themeId, when the user asks for colors, must be one of: ${themesText()}.`,
    "- Never choose or change statistical tests, P values, significance marks, or error-bar statistics. If the request needs them, say so in questions.",
    "- If the study design is unclear (for example paired versus independent samples, which column identifies subjects, or what the error column contains), ask in questions instead of guessing. Keep questions short.",
    "- caption: a factual draft that names what is plotted and the encodings. Do not state results, effect sizes, or significance that the data profile does not show. Leave placeholders like [n = ?] where facts are missing.",
    "- rationale: one or two sentences on why this plot and mapping fit the request.",
    context.locale === "zh" ? "- Write rationale and questions in Chinese." : "- Write rationale and questions in English.",
    "",
    "Plot catalog (id | name | family | data shape | roles | summary):",
    catalogText(),
  ].join("\n");
  const user = [
    `Request: ${context.request}`,
    "",
    `Data profile (${context.rowCount} rows; values are not included unless sample rows are shown):`,
    JSON.stringify(context.columns),
    context.sampleRows?.length ? `Sample rows shared by the user:\n${JSON.stringify(context.sampleRows)}` : "",
    "",
    `Current figure: ${JSON.stringify(context.current)}`,
  ].filter((line) => line !== "").join("\n");
  return { system, user };
}

/** The whole prompt as one text block, for pasting into an external chat window. */
export function manualPrompt(context: AIContext) {
  const { system, user } = buildPlanPrompt(context);
  return `${system}\n\n---\n\n${user}`;
}

function extractJsonObject(text: string) {
  const fenced = /```(?:json)?\s*([\s\S]*?)```/i.exec(text);
  const body = (fenced?.[1] ?? text).trim();
  if (body.startsWith("{")) return body;
  const start = body.indexOf("{");
  const end = body.lastIndexOf("}");
  if (start === -1 || end <= start) throw new Error("The response contains no JSON object.");
  return body.slice(start, end + 1);
}

const asString = (value: unknown, max: number) => (typeof value === "string" ? value.trim().slice(0, max) : "");
const isRecord = (value: unknown): value is Record<string, unknown> => Boolean(value) && typeof value === "object" && !Array.isArray(value);

/** Reads model text into a plan. Throws only when no usable plotType can be read. */
export function parsePlanText(text: string): { raw: Record<string, unknown> } {
  if (text.length > PLAN_RESPONSE_LIMIT) throw new Error("The model response is too large.");
  let raw: unknown;
  try {
    raw = JSON.parse(extractJsonObject(text));
  } catch (error) {
    throw new Error(error instanceof Error && error.message.startsWith("The response") ? error.message : "The response is not valid JSON.");
  }
  if (!isRecord(raw)) throw new Error("The response is not a JSON object.");
  return { raw };
}

export function checkPlan(
  raw: Record<string, unknown>,
  current: { plotType: PlotType; mapping: Record<string, string>; settings: VisualizationSettings; themeId: JournalThemeId; dataset: ParsedDataset },
): CheckedPlan {
  const errors: string[] = [];
  const dropped: string[] = [];
  const changes: PlanChange[] = [];

  const plotType = isPlotType(raw.plotType) ? raw.plotType : current.plotType;
  if (raw.plotType !== undefined && !isPlotType(raw.plotType)) errors.push(`Unknown plot type "${String(raw.plotType)}".`);
  if (plotType !== current.plotType) changes.push({ kind: "plot", key: "plotType", from: current.plotType, to: plotType });
  const plotModule = getPlotModule(plotType);
  const definition = plotModule.definition;

  // Settings first: some roles are only active under certain settings.
  const allowedKeys = new Set<string>(assistantSettingKeysFor(plotType));
  const settingsPatch: FigurePlan["settingsPatch"] = {};
  if (raw.settingsPatch !== undefined && !isRecord(raw.settingsPatch)) dropped.push("settingsPatch is not an object.");
  for (const [key, value] of Object.entries(isRecord(raw.settingsPatch) ? raw.settingsPatch : {})) {
    if (!isAssistantSettingKey(key)) { dropped.push(`Setting "${key}" is not adjustable by the assistant.`); continue; }
    if (!allowedKeys.has(key)) { dropped.push(`Setting "${key}" does not apply to ${definition.name}.`); continue; }
    const coerced = typeof value === "string" && typeof current.settings[key] === "number" ? Number(value) : value;
    if (!assistantSettings[key].check(coerced)) { dropped.push(`Setting "${key}" value ${JSON.stringify(value)} is outside ${assistantSettings[key].hint}.`); continue; }
    (settingsPatch as Record<string, unknown>)[key] = coerced;
    if (current.settings[key] !== coerced) changes.push({ kind: "setting", key, from: String(current.settings[key]), to: String(coerced) });
  }

  let themeId: JournalThemeId | undefined;
  if (raw.themeId !== undefined && raw.themeId !== null && raw.themeId !== "") {
    if (isThemeId(raw.themeId)) {
      themeId = raw.themeId;
      if (themeId !== current.themeId) changes.push({ kind: "theme", key: "themeId", from: journalThemes[current.themeId].name, to: journalThemes[themeId].name });
    } else dropped.push(`Palette "${String(raw.themeId)}" does not exist.`);
  }

  const candidateSettings = { ...current.settings, ...settingsPatch };
  const headers = new Set(current.dataset.headers);
  const roleKeys = new Set(definition.roles.map((role) => role.key));
  const mapping: Record<string, string> = {};
  if (raw.mapping !== undefined && !isRecord(raw.mapping)) errors.push("mapping is not an object.");
  for (const [key, value] of Object.entries(isRecord(raw.mapping) ? raw.mapping : {})) {
    if (!roleKeys.has(key)) { dropped.push(`Role "${key}" does not exist for ${definition.name}.`); continue; }
    if (value === "" || value === null) continue;
    if (typeof value !== "string" || !headers.has(value)) { errors.push(`Column "${String(value)}" for role "${key}" is not in the table.`); continue; }
    mapping[key] = value;
  }
  for (const role of definition.roles) {
    if (role.required && isPlotRoleActive(plotType, role.key, candidateSettings) && !mapping[role.key]) errors.push(`Required role "${role.label}" (${role.key}) has no column.`);
  }
  const previous = plotType === current.plotType ? current.mapping : {};
  for (const key of new Set([...Object.keys(previous), ...Object.keys(mapping)])) {
    if ((previous[key] ?? "") !== (mapping[key] ?? "")) changes.push({ kind: "mapping", key, from: previous[key] || "—", to: mapping[key] || "—" });
  }

  const warnings: string[] = [];
  if (!errors.length) {
    const validation = validatePlotDataset(definition, current.dataset, mapping, candidateSettings);
    errors.push(...validation.errors);
    warnings.push(...validation.warnings);
  }

  const caption = isRecord(raw.caption) ? { en: asString(raw.caption.en, 1200), zh: asString(raw.caption.zh, 1200) } : { en: asString(raw.caption, 1200), zh: "" };
  const questions = Array.isArray(raw.questions) ? raw.questions.filter((item): item is string => typeof item === "string" && item.trim() !== "").map((item) => item.trim().slice(0, 300)).slice(0, 6) : [];
  const plan: FigurePlan = { plotType, mapping, settingsPatch, ...(themeId ? { themeId } : {}), caption, rationale: asString(raw.rationale, 800), questions };
  return { plan, changes, errors, dropped, warnings, canApply: errors.length === 0 };
}
