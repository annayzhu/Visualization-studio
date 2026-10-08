import { isPlotType } from "./studio-ai-catalog";
import {
  categoricalColorForIndex,
  parseNumericValue,
  type ParsedDataset,
  type PlotType,
  type VisualizationSettings,
} from "./visualization-studio";

/**
 * The data summary the figure assistant may send to a model.
 *
 * By default it holds column names, inferred kinds, counts and numeric ranges only. Up to
 * five sample rows are added only when the user opts in. Raw tables and exported configs are
 * never part of it.
 */

export const CONTEXT_LIMITS = { columns: 200, columnName: 120, sampleRows: 5, cell: 120, request: 2000, checks: 30, mapping: 40 } as const;

export type ColumnProfile = {
  name: string;
  kind: "number" | "category" | "label" | "empty";
  missing: number;
  distinct: number;
  min?: number;
  max?: number;
};

export type AIContext = {
  request: string;
  locale: "en" | "zh";
  rowCount: number;
  columns: ColumnProfile[];
  sampleRows?: Record<string, string>[];
  current: { plotType: PlotType; mapping: Record<string, string>; validationErrors: string[]; publicationChecks: string[] };
};

export function profileColumns(dataset: Pick<ParsedDataset, "headers" | "rows">): ColumnProfile[] {
  return dataset.headers.slice(0, CONTEXT_LIMITS.columns).map((header) => {
    const values = dataset.rows.map((row) => (row[header] ?? "").trim());
    const present = values.filter(Boolean);
    const numbers = present.map((value) => parseNumericValue(value)).filter((value): value is number => value !== null);
    const distinct = new Set(present).size;
    const name = header.slice(0, CONTEXT_LIMITS.columnName);
    if (!present.length) return { name, kind: "empty", missing: values.length, distinct: 0 };
    if (numbers.length / present.length >= 0.9) {
      return { name, kind: "number", missing: values.length - present.length, distinct, min: Math.min(...numbers), max: Math.max(...numbers) };
    }
    // Few repeated values look like groups; mostly unique text looks like identifiers or labels.
    const kind = distinct <= Math.max(2, Math.min(50, present.length * 0.5)) ? "category" : "label";
    return { name, kind, missing: values.length - present.length, distinct };
  });
}

export function buildAIContext(input: {
  request: string;
  locale: "en" | "zh";
  dataset: Pick<ParsedDataset, "headers" | "rows">;
  includeSampleRows: boolean;
  plotType: PlotType;
  mapping: Record<string, string>;
  validationErrors: string[];
  publicationChecks: string[];
}): AIContext {
  const columns = profileColumns(input.dataset);
  const kept = new Set(columns.map((column) => column.name));
  return {
    request: input.request.trim().slice(0, CONTEXT_LIMITS.request),
    locale: input.locale,
    rowCount: input.dataset.rows.length,
    columns,
    ...(input.includeSampleRows ? {
      sampleRows: input.dataset.rows.slice(0, CONTEXT_LIMITS.sampleRows).map((row) =>
        Object.fromEntries(Object.entries(row).filter(([key]) => kept.has(key)).map(([key, value]) => [key, value.slice(0, CONTEXT_LIMITS.cell)]))),
    } : {}),
    current: {
      plotType: input.plotType,
      mapping: Object.fromEntries(Object.entries(input.mapping).filter(([, value]) => value).slice(0, CONTEXT_LIMITS.mapping)),
      validationErrors: input.validationErrors.slice(0, CONTEXT_LIMITS.checks),
      publicationChecks: input.publicationChecks.slice(0, CONTEXT_LIMITS.checks),
    },
  };
}

const isRecord = (value: unknown): value is Record<string, unknown> => Boolean(value) && typeof value === "object" && !Array.isArray(value);
const shortStrings = (value: unknown, max: number, length: number) => Array.isArray(value) && value.length <= max && value.every((item) => typeof item === "string" && item.length <= length);

/** Server-side guard: rejects a context that is oversized or carries more than the documented fields. */
export function isAIContext(value: unknown): value is AIContext {
  if (!isRecord(value)) return false;
  const allowed = new Set(["request", "locale", "rowCount", "columns", "sampleRows", "current"]);
  if (Object.keys(value).some((key) => !allowed.has(key))) return false;
  if (typeof value.request !== "string" || !value.request.trim() || value.request.length > CONTEXT_LIMITS.request) return false;
  if (value.locale !== "en" && value.locale !== "zh") return false;
  if (typeof value.rowCount !== "number" || !Number.isInteger(value.rowCount) || value.rowCount < 0) return false;
  if (!Array.isArray(value.columns) || value.columns.length > CONTEXT_LIMITS.columns) return false;
  const columnKeys = new Set(["name", "kind", "missing", "distinct", "min", "max"]);
  for (const column of value.columns) {
    if (!isRecord(column) || Object.keys(column).some((key) => !columnKeys.has(key))) return false;
    if (typeof column.name !== "string" || column.name.length > CONTEXT_LIMITS.columnName) return false;
    if (!["number", "category", "label", "empty"].includes(String(column.kind))) return false;
    if (![column.missing, column.distinct].every((n) => typeof n === "number" && Number.isFinite(n))) return false;
    if ([column.min, column.max].some((n) => n !== undefined && (typeof n !== "number" || !Number.isFinite(n)))) return false;
  }
  if (value.sampleRows !== undefined) {
    if (!Array.isArray(value.sampleRows) || value.sampleRows.length > CONTEXT_LIMITS.sampleRows) return false;
    for (const row of value.sampleRows) {
      if (!isRecord(row) || Object.keys(row).length > CONTEXT_LIMITS.columns) return false;
      if (Object.values(row).some((cell) => typeof cell !== "string" || cell.length > CONTEXT_LIMITS.cell)) return false;
    }
  }
  const current = value.current;
  if (!isRecord(current) || !isPlotType(current.plotType) || !isRecord(current.mapping)) return false;
  if (Object.keys(current.mapping).length > CONTEXT_LIMITS.mapping || Object.values(current.mapping).some((v) => typeof v !== "string" || v.length > CONTEXT_LIMITS.columnName)) return false;
  return shortStrings(current.validationErrors, CONTEXT_LIMITS.checks, 400) && shortStrings(current.publicationChecks, CONTEXT_LIMITS.checks, 400);
}

// ---------------------------------------------------------------------------
// Publication checks (deterministic, no model involved)
// ---------------------------------------------------------------------------

export type PublicationCheck = { id: string; severity: "warning" | "info"; message: { en: string; zh: string } };

/** Common journal column widths at 96 px per inch. */
const SINGLE_COLUMN_PX = (85 / 25.4) * 96;
const MIN_PRINT_POINT = 6;

function luminance(hex: string) {
  const match = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!match) return null;
  const channel = (offset: number) => {
    const value = parseInt(match[1].slice(offset, offset + 2), 16) / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(0) + 0.7152 * channel(2) + 0.0722 * channel(4);
}

export function publicationChecks(input: { plotType: PlotType; settings: VisualizationSettings; settingKeys: readonly string[]; groupCount: number }): PublicationCheck[] {
  const { settings, settingKeys, groupCount } = input;
  const checks: PublicationCheck[] = [];
  const scale = Math.min(1, SINGLE_COLUMN_PX / settings.width);
  const smallest = Math.min(...(["tickSize", "legendSize", "axisLabelSize"] as const).filter((key) => settingKeys.includes(key)).map((key) => settings[key]), settings.titleSize);
  const printedPoint = smallest * scale * 0.75;
  if (printedPoint < MIN_PRINT_POINT) {
    checks.push({
      id: "font-size",
      severity: "warning",
      message: {
        en: `At single-column width (85 mm) the smallest text prints at about ${printedPoint.toFixed(1)} pt; many journals ask for at least ${MIN_PRINT_POINT} pt. Increase text sizes or reduce the figure width.`,
        zh: `缩放到单栏宽度（85 mm）时最小字号约 ${printedPoint.toFixed(1)} pt，多数期刊要求不少于 ${MIN_PRINT_POINT} pt。请增大字号或减小图宽。`,
      },
    });
  }
  const palette = settings.categoricalColors;
  if (groupCount > palette.length && palette.length > 0) {
    checks.push({
      id: "palette-repeat",
      severity: "warning",
      message: {
        en: `${groupCount} groups share a ${palette.length}-color palette, so colors repeat. Use fewer groups, facets, or a larger palette.`,
        zh: `${groupCount} 个分组共用 ${palette.length} 种颜色，颜色会重复。请减少分组、分面或换用更多颜色的配色。`,
      },
    });
  }
  if (groupCount >= 2 && settingKeys.includes("legendPosition") && settings.legendPosition === "none") {
    checks.push({ id: "legend-hidden", severity: "warning", message: { en: "The legend is hidden while two or more groups are colored. Explain the colors in the caption or show the legend.", zh: "有两个以上分组着色但图例已隐藏。请在图注中说明颜色或显示图例。" } });
  }
  const used = Array.from({ length: Math.min(groupCount, 8) }, (_, index) => categoricalColorForIndex(index, palette));
  const levels = used.map(luminance).filter((value): value is number => value !== null);
  const close = levels.some((a, i) => levels.some((b, j) => j > i && Math.abs(a - b) < 0.05));
  if (groupCount >= 2 && close) {
    checks.push({ id: "grayscale", severity: "info", message: { en: "Some group colors have similar lightness and may merge in grayscale print. Consider adding shapes, line types, or direct labels.", zh: "部分分组颜色明度相近，灰度打印时可能难以区分。可增加点形、线型或直接标注。" } });
  }
  return checks;
}
