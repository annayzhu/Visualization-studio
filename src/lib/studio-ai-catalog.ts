import { plotChineseNames } from "./studio-catalog";
import {
  figureFontPresets,
  getPlotModule,
  journalThemes,
  plotModuleRegistry,
  type JournalThemeId,
  type PlotType,
  type VisualizationSettings,
} from "./visualization-studio";

/**
 * What the figure assistant may know about and change.
 *
 * The catalog lists every registered plot so the model can only choose real modules.
 * `assistantSettings` is the complete list of settings the model may write, each with a
 * runtime check. Statistical settings (tests, P values, significance marks, analysis
 * modes) are deliberately absent: the assistant never changes how results are computed.
 */

export type CatalogItem = {
  id: PlotType;
  name: string;
  zh: string;
  family: string;
  summary: string;
  roles: { key: string; kind: "category" | "number" | "label"; required: boolean }[];
  dataShape: string;
};

const SUMMARY_LIMIT = 140;

export function assistantCatalog(): CatalogItem[] {
  return plotModuleRegistry.list().map(({ definition, capabilities }) => ({
    id: definition.id,
    name: definition.name,
    zh: (plotChineseNames as Record<string, string>)[definition.id] ?? "",
    family: definition.family,
    summary: definition.summary.length > SUMMARY_LIMIT ? `${definition.summary.slice(0, SUMMARY_LIMIT - 1)}…` : definition.summary,
    roles: definition.roles.map((role) => ({ key: role.key, kind: role.kind, required: role.required })),
    dataShape: capabilities.dataShape,
  }));
}

/** Compact one-line-per-plot text for prompts. */
export function catalogText(catalog = assistantCatalog()) {
  return catalog
    .map((item) => `${item.id} | ${item.name}${item.zh ? ` / ${item.zh}` : ""} | ${item.family} | ${item.dataShape} | roles: ${item.roles.map((role) => `${role.key}:${role.kind}${role.required ? "*" : ""}`).join(", ") || "first column labels, other columns numeric matrix"} | ${item.summary}`)
    .join("\n");
}

type Check = (value: unknown) => boolean;
const text = (max: number): Check => (value) => typeof value === "string" && value.length <= max;
const range = (min: number, max: number): Check => (value) => typeof value === "number" && Number.isFinite(value) && value >= min && value <= max;
const oneOf = (...options: readonly string[]): Check => (value) => typeof value === "string" && options.includes(value);
const flag: Check = (value) => typeof value === "boolean";

export const assistantSettings = {
  title: { check: text(160), hint: "string ≤160" },
  xLabel: { check: text(120), hint: "string ≤120" },
  yLabel: { check: text(120), hint: "string ≤120" },
  fontFamily: { check: oneOf(...Object.keys(figureFontPresets)), hint: Object.keys(figureFontPresets).join("|") },
  width: { check: range(300, 1600), hint: "300–1600 px" },
  height: { check: range(280, 1200), hint: "280–1200 px" },
  titleSize: { check: range(9, 30), hint: "9–30 px" },
  axisLabelSize: { check: range(8, 24), hint: "8–24 px" },
  tickSize: { check: range(7, 20), hint: "7–20 px" },
  legendSize: { check: range(7, 20), hint: "7–20 px" },
  axisLineWidth: { check: range(0.8, 3), hint: "0.8–3" },
  gridLineWidth: { check: range(0.4, 2), hint: "0.4–2" },
  dataLineWidth: { check: range(1, 5), hint: "1–5" },
  pointSize: { check: range(2, 12), hint: "2–12" },
  opacity: { check: range(0.25, 1), hint: "0.25–1" },
  grid: { check: oneOf("none", "y", "both"), hint: "none|y|both" },
  legendPosition: { check: oneOf("right", "bottom", "none"), hint: "right|bottom|none" },
  swapAxes: { check: flag, hint: "boolean" },
  showLabels: { check: flag, hint: "boolean" },
  showPoints: { check: flag, hint: "boolean" },
} as const satisfies Partial<Record<keyof VisualizationSettings, { check: Check; hint: string }>>;

export type AssistantSettingKey = keyof typeof assistantSettings;

export function isAssistantSettingKey(key: string): key is AssistantSettingKey {
  return Object.prototype.hasOwnProperty.call(assistantSettings, key);
}

/** Keys the assistant may set for one plot: whitelisted and supported by that module. */
export function assistantSettingKeysFor(plotType: PlotType): AssistantSettingKey[] {
  const supported = new Set<string>(getPlotModule(plotType).capabilities.settingKeys);
  return (Object.keys(assistantSettings) as AssistantSettingKey[]).filter((key) => supported.has(key));
}

export function settingsText() {
  return (Object.entries(assistantSettings) as [string, { hint: string }][]).map(([key, { hint }]) => `${key}: ${hint}`).join("; ");
}

export function themesText() {
  return (Object.keys(journalThemes) as JournalThemeId[]).map((id) => `${id} (${journalThemes[id].name})`).join(", ");
}

export function isThemeId(value: unknown): value is JournalThemeId {
  return typeof value === "string" && Object.prototype.hasOwnProperty.call(journalThemes, value);
}

export function isPlotType(value: unknown): value is PlotType {
  return typeof value === "string" && plotModuleRegistry.list().some((module) => module.definition.id === value);
}
