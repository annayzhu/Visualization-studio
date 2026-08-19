"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties, type ChangeEvent, type ReactNode } from "react";
import { Check, ChevronDown, Download, ExternalLink, FileJson, Image as ImageIcon, Lightbulb, RotateCcw, Save, Upload } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { ScientificChartPreview } from "@/components/ScientificChartPreview";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { cn } from "@/lib/cn";
import { analyzeExpressionMatrix, defaultPcaOptions, type PcaDataLayer, type PcaOptions } from "@/lib/visualization-pca";
import {
  defaultVisualizationPaletteSeriesId,
  defaultVisualizationSettings,
  defaultVisualizationThemeId,
  activeNumericAxes,
  figureFontPresets,
  getPlotDefinition,
  getPlotModule,
  inferPlotMapping,
  isPlotRoleActive,
  journalThemes,
  paletteSeries,
  parseDelimitedData,
  parseNumericValue,
  plotModuleRegistry,
  validatePlotDataset,
  type JournalThemeId,
  type PaletteSeriesId,
  type FieldRole,
  type FigureFontId,
  type PlotType,
  type VisualizationSettings,
} from "@/lib/visualization-studio";

const controlClass =
  "focus-ring h-8 w-full rounded-[7px] border border-hairline bg-white px-2.5 text-xs text-ink placeholder:text-muted";
const palettePreferenceStorageKey = "labnest:visualization-studio:palette";
const customPaletteStorageKey = "labnest:visualization-studio:custom-palettes";

type BuiltInPaletteSeriesId = Exclude<PaletteSeriesId, "custom">;

type PalettePreference = {
  seriesId: PaletteSeriesId;
  themeId: JournalThemeId;
  customPaletteId?: string;
};

type CustomPalette = {
  id: string;
  name: string;
  sourceThemeId: JournalThemeId;
  categoricalColors: string[];
  continuousLow: string;
  continuousHigh: string;
  divergingLow: string;
  divergingMid: string;
  divergingHigh: string;
  barBorderColor: string;
  createdAt: string;
  updatedAt: string;
};

function isPaletteSeriesId(value: string | null): value is PaletteSeriesId {
  return Boolean(value && value in paletteSeries);
}

function isJournalThemeId(value: string | null): value is JournalThemeId {
  return Boolean(value && value in journalThemes);
}

function readPalettePreference(): PalettePreference | null {
  try {
    const stored = window.localStorage.getItem(palettePreferenceStorageKey);
    if (!stored) return null;
    const parsed = JSON.parse(stored) as Partial<Record<keyof PalettePreference, string>>;
    const seriesId = parsed.seriesId ?? null;
    const themeId = parsed.themeId ?? null;
    if (!isPaletteSeriesId(seriesId) || !isJournalThemeId(themeId)) return null;
    if (seriesId !== "custom" && journalThemes[themeId].series !== seriesId) return null;
    return { seriesId, themeId, customPaletteId: parsed.customPaletteId };
  } catch {
    return null;
  }
}

function writePalettePreference(preference: PalettePreference) {
  try {
    window.localStorage.setItem(palettePreferenceStorageKey, JSON.stringify(preference));
  } catch {
    // Local storage can be disabled; the studio should remain fully usable.
  }
}

function isHexColor(value: unknown): value is string {
  return typeof value === "string" && /^#[0-9A-F]{6}$/i.test(value);
}

function isCustomPalette(value: unknown): value is CustomPalette {
  if (!value || typeof value !== "object") return false;
  const palette = value as Partial<CustomPalette>;
  return (
    typeof palette.id === "string" &&
    typeof palette.name === "string" &&
    isJournalThemeId(palette.sourceThemeId ?? null) &&
    Array.isArray(palette.categoricalColors) &&
    palette.categoricalColors.length > 0 &&
    palette.categoricalColors.every(isHexColor) &&
    isHexColor(palette.continuousLow) &&
    isHexColor(palette.continuousHigh) &&
    isHexColor(palette.divergingLow) &&
    isHexColor(palette.divergingMid) &&
    isHexColor(palette.divergingHigh) &&
    isHexColor(palette.barBorderColor) &&
    typeof palette.createdAt === "string" &&
    typeof palette.updatedAt === "string"
  );
}

function readCustomPalettes(): CustomPalette[] {
  try {
    const stored = window.localStorage.getItem(customPaletteStorageKey);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed.filter(isCustomPalette) : [];
  } catch {
    return [];
  }
}

function writeCustomPalettes(palettes: CustomPalette[]) {
  try {
    window.localStorage.setItem(customPaletteStorageKey, JSON.stringify(palettes));
  } catch {
    // Local storage can be disabled; custom palette saving should fail quietly.
  }
}

function paletteColorsFromSettings(settings: VisualizationSettings, sourceThemeId: JournalThemeId): Omit<CustomPalette, "id" | "name" | "createdAt" | "updatedAt"> {
  return {
    sourceThemeId,
    categoricalColors: [...settings.categoricalColors],
    continuousLow: settings.continuousLow,
    continuousHigh: settings.continuousHigh,
    divergingLow: settings.divergingLow,
    divergingMid: settings.divergingMid,
    divergingHigh: settings.divergingHigh,
    barBorderColor: settings.barBorderColor,
  };
}

function applyCustomPalette(current: VisualizationSettings, palette: CustomPalette): VisualizationSettings {
  return {
    ...current,
    categoricalColors: [...palette.categoricalColors],
    continuousLow: palette.continuousLow,
    continuousHigh: palette.continuousHigh,
    divergingLow: palette.divergingLow,
    divergingMid: palette.divergingMid,
    divergingHigh: palette.divergingHigh,
    barBorderColor: palette.barBorderColor,
  };
}

function colorFingerprint(colors: Omit<CustomPalette, "id" | "name" | "createdAt" | "updatedAt">) {
  return JSON.stringify(colors);
}

function settingsForTheme(themeId: JournalThemeId): VisualizationSettings {
  const theme = journalThemes[themeId];
  return {
    ...defaultVisualizationSettings,
    categoricalColors: [...theme.categorical],
    continuousLow: theme.sequential[0],
    continuousHigh: theme.sequential[1],
    divergingLow: theme.diverging[0],
    divergingMid: theme.diverging[1],
    divergingHigh: theme.diverging[2],
    barBorderColor: theme.ink,
  };
}

function mappingRoleLabel(plotType: PlotType, role: FieldRole, swapAxes: boolean) {
  if (plotType !== "bar") return role.label;
  if (role.key === "category") return `${swapAxes ? "Y" : "X"}-axis · category`;
  if (role.key === "value") return `${swapAxes ? "X" : "Y"}-axis · value`;
  return role.label;
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.style.display = "none";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1_000);
}

function slug(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "labnest-figure";
}

function uniqueColumnValues(rows: Array<Record<string, string>>, column: string | undefined, fallback: string) {
  if (!column) return [fallback];
  const values = rows.map((row) => row[column]?.trim()).filter((value): value is string => Boolean(value));
  return [...new Set(values.length > 0 ? values : [fallback])];
}

function categoricalColorLabels(plotType: PlotType, rows: Array<Record<string, string>>, mapping: Record<string, string>) {
  if (plotType === "bar") return uniqueColumnValues(rows, mapping.group, "Value");
  if (plotType === "line" || plotType === "area") return uniqueColumnValues(rows, mapping.series, "All");
  if (["scatter", "correlation", "quadrant", "pca", "pcoa", "umap", "errorbar", "lollipop", "km", "survival-forest", "roc"].includes(plotType)) return uniqueColumnValues(rows, mapping.group, "All");
  if (["box", "violin", "beeswarm", "raincloud"].includes(plotType)) return uniqueColumnValues(rows, mapping.group, "All");
  if (plotType === "volcano" || plotType === "ma") return ["Down", "Up", "Not significant"];
  if (plotType === "gsea") return ["Running ES", "Gene-set hits"];
  if (plotType === "venn" || plotType === "upset") return uniqueColumnValues(rows, mapping.set, "Set");
  if (plotType === "sankey" || plotType === "chord") return [...new Set(rows.flatMap((row) => [row[mapping.source], row[mapping.target]]).filter(Boolean))];
  if (plotType === "circos") return [...new Set(rows.flatMap((row) => [row[mapping.sourceChr], row[mapping.targetChr]]).filter(Boolean))];
  if (["pie", "donut", "rose", "waffle"].includes(plotType)) return uniqueColumnValues(rows, mapping.category, "Part");
  if (plotType === "treemap" || plotType === "sunburst") {
    const root = rows.find((row) => !mapping.parent || !row[mapping.parent]?.trim())?.[mapping.node];
    const topLevel = root && mapping.parent ? rows.filter((row) => row[mapping.parent] === root).map((row) => row[mapping.node]).filter(Boolean) : [];
    return [...new Set(topLevel.length > 0 ? topLevel : ["Node"])].slice(0, 12);
  }
  if (plotType === "radar" || plotType === "polar-profile") return uniqueColumnValues(rows, mapping.series, "All");
  if (plotType === "population-pyramid") return uniqueColumnValues(rows, mapping.group, "Group");
  return [];
}

function spreadsheetRowsToTsv(rows: unknown[][]) {
  return rows.map((row) => row.map((cell) => String(cell ?? "").replace(/[\t\r\n]+/g, " ")).join("\t")).join("\n");
}

function pcaAxisLabel(component: string, explainedVariance: number[]) {
  const match = component.match(/^PC(\d+)$/i);
  const index = match ? Number(match[1]) - 1 : -1;
  const proportion = explainedVariance[index];
  return Number.isFinite(proportion) ? `${component.toUpperCase()} (${(proportion * 100).toFixed(1)}%)` : component;
}

function serializeSvg(svg: SVGSVGElement, fontFamily: string) {
  const clone = svg.cloneNode(true) as SVGSVGElement;
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  clone.setAttribute("font-family", fontFamily);
  return `<?xml version="1.0" encoding="UTF-8"?>\n${new XMLSerializer().serializeToString(clone)}`;
}

function ControlGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="space-y-2.5 border-t border-hairline pt-3 first:border-0 first:pt-0">
      <legend className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">{title}</legend>
      {children}
    </fieldset>
  );
}

function TextControl({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string }) {
  return (
    <label className="grid gap-1 text-xs text-graphite">
      <span>{label}</span>
      <input className={controlClass} value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function SelectControl({ label, value, onChange, children }: { label: string; value: string; onChange: (value: string) => void; children: ReactNode }) {
  return (
    <label className="grid gap-1 text-xs text-graphite">
      <span>{label}</span>
      <select className={controlClass} value={value} onChange={(event) => onChange(event.target.value)}>{children}</select>
    </label>
  );
}

function RangeControl({ label, value, minimum, maximum, step = 1, unit, onChange }: { label: string; value: number; minimum: number; maximum: number; step?: number; unit?: string; onChange: (value: number) => void }) {
  const [draft, setDraft] = useState<string | null>(null);
  const displayedValue = draft ?? String(value);

  const commitDraft = () => {
    const parsed = Number(displayedValue.trim());
    if (!Number.isFinite(parsed)) {
      setDraft(null);
      return;
    }
    const nextValue = Math.min(maximum, Math.max(minimum, parsed));
    setDraft(null);
    onChange(nextValue);
  };

  return (
    <div className="grid gap-1 text-xs text-graphite">
      <div className="flex items-center justify-between gap-2">
        <span>{label}</span>
        <span className="flex items-center font-mono text-[11px] text-muted">
          <input
            type="text"
            inputMode="decimal"
            aria-label={`${label} value`}
            value={displayedValue}
            onChange={(event) => setDraft(event.target.value)}
            onBlur={commitDraft}
            onKeyDown={(event) => {
              if (event.key === "Enter") event.currentTarget.blur();
              if (event.key === "Escape") {
                setDraft(null);
              }
            }}
            className="focus-ring w-14 rounded-[4px] border border-transparent bg-transparent px-1 py-0.5 text-right font-mono text-[11px] text-muted hover:border-hairline focus:border-border-strong focus:bg-white focus:text-ink"
          />
          {unit ? <span>{unit}</span> : null}
        </span>
      </div>
      <input aria-label={`${label} slider`} className="h-5 w-full accent-[var(--color-moss)]" type="range" min={minimum} max={maximum} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} />
    </div>
  );
}

function OptionalNumberControl({ label, value, invalid = false, describedBy, onChange }: { label: string; value: number | null; invalid?: boolean; describedBy?: string; onChange: (value: number | null) => void }) {
  const commit = (draft: string) => {
    const trimmed = draft.trim();
    if (!trimmed) {
      onChange(null);
      return;
    }
    const parsed = Number(trimmed);
    if (Number.isFinite(parsed)) onChange(parsed);
  };
  return (
    <label className="grid gap-1 text-xs text-graphite">
      <span>{label}</span>
      <input
        className={controlClass}
        type="text"
        inputMode="decimal"
        key={value ?? "auto"}
        defaultValue={value ?? ""}
        placeholder="Auto"
        aria-invalid={invalid || undefined}
        aria-describedby={invalid ? describedBy : undefined}
        onBlur={(event) => {
          commit(event.currentTarget.value);
          if (event.currentTarget.value.trim() && !Number.isFinite(Number(event.currentTarget.value))) {
            event.currentTarget.value = value === null ? "" : String(value);
          }
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter") event.currentTarget.blur();
          if (event.key === "Escape") event.currentTarget.value = value === null ? "" : String(value);
        }}
      />
    </label>
  );
}

function ToggleControl({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 text-xs text-graphite">
      <span>{label}</span>
      <span className={cn("relative h-5 w-9 rounded-full transition", checked ? "bg-moss" : "bg-stone")}>
        <input type="checkbox" className="sr-only" checked={checked} onChange={(event) => onChange(event.target.checked)} />
        <span className={cn("absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition", checked ? "left-[18px]" : "left-0.5")} />
      </span>
    </label>
  );
}

function ColorControl({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="flex items-center justify-between gap-3 text-xs text-graphite">
      <span>{label}</span>
      <span className="flex items-center gap-2 font-mono text-[10px] text-muted">
        {value.toUpperCase()}
        <input aria-label={label} type="color" value={value} onChange={(event) => onChange(event.target.value)} className="h-7 w-9 cursor-pointer rounded border border-hairline bg-white p-0.5" />
      </span>
    </label>
  );
}

export function VisualizationStudio() {
  const initialDefinition = getPlotDefinition("bar");
  const [plotType, setPlotType] = useState<PlotType>("bar");
  const [rawData, setRawData] = useState(initialDefinition.sampleData);
  const [mapping, setMapping] = useState<Record<string, string>>(initialDefinition.defaultMapping);
  const [selectedExampleIndex, setSelectedExampleIndex] = useState(0);
  const [themeId, setThemeId] = useState<JournalThemeId>(defaultVisualizationThemeId);
  const [paletteSeriesId, setPaletteSeriesId] = useState<PaletteSeriesId>(defaultVisualizationPaletteSeriesId);
  const [settings, setSettings] = useState<VisualizationSettings>(() => settingsForTheme(defaultVisualizationThemeId));
  const [pcaOptions, setPcaOptions] = useState<PcaOptions>(defaultPcaOptions);
  const [customPalettes, setCustomPalettes] = useState<CustomPalette[]>([]);
  const [selectedCustomPaletteId, setSelectedCustomPaletteId] = useState("");
  const [customPaletteName, setCustomPaletteName] = useState("");
  const [mobilePaletteOpen, setMobilePaletteOpen] = useState(false);
  const [loadedFileName, setLoadedFileName] = useState("");
  const [fileError, setFileError] = useState("");
  const [stickyHeaderHeight, setStickyHeaderHeight] = useState(0);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const stickyHeaderRef = useRef<HTMLDivElement | null>(null);
  const previewCardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const storedCustomPalettes = readCustomPalettes();
      setCustomPalettes(storedCustomPalettes);
      const preference = readPalettePreference();
      if (!preference) return;
      if (preference.seriesId === "custom") {
        const customPalette = storedCustomPalettes.find((palette) => palette.id === preference.customPaletteId) ?? storedCustomPalettes[0];
        if (!customPalette) return;
        setPaletteSeriesId("custom");
        setSelectedCustomPaletteId(customPalette.id);
        setCustomPaletteName(customPalette.name);
        setThemeId(customPalette.sourceThemeId);
        setSettings((current) => applyCustomPalette(current, customPalette));
        return;
      }
      setPaletteSeriesId(preference.seriesId);
      setThemeId(preference.themeId);
      setSettings(settingsForTheme(preference.themeId));
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    const element = stickyHeaderRef.current;
    if (!element || typeof ResizeObserver === "undefined") return;
    let frameId = 0;
    const updateHeight = () => {
      window.cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(() => {
        setStickyHeaderHeight(Math.ceil(element.getBoundingClientRect().height));
      });
    };
    const observer = new ResizeObserver(updateHeight);
    observer.observe(element);
    window.addEventListener("resize", updateHeight);
    updateHeight();
    return () => {
      window.cancelAnimationFrame(frameId);
      observer.disconnect();
      window.removeEventListener("resize", updateHeight);
    };
  }, []);

  const plotModule = getPlotModule(plotType);
  const definition = plotModule.definition;
  const dataExamples = plotModule.examples;
  const guidance = plotModule.guidance;
  const hasSetting = (key: keyof VisualizationSettings) => plotModule.capabilities.settingKeys.includes(key);
  const visibleRoles = definition.roles.filter((role) => isPlotRoleActive(plotType, role.key, settings));
  const manualAxes = activeNumericAxes(plotType, settings);
  const invalidXLimits = manualAxes.includes("x") && settings.xMin !== null && settings.xMax !== null && settings.xMin >= settings.xMax;
  const invalidYLimits = manualAxes.includes("y") && settings.yMin !== null && settings.yMax !== null && settings.yMin >= settings.yMax;
  const pcaAnalysis = useMemo(() => plotType === "pca" ? analyzeExpressionMatrix(rawData, pcaOptions) : null, [plotType, rawData, pcaOptions]);
  const dataset = useMemo(() => pcaAnalysis?.dataset ?? parseDelimitedData(rawData), [pcaAnalysis, rawData]);
  const barBreakRange = useMemo(() => {
    if (plotType !== "bar" || !mapping.value) return { minimum: -100, maximum: 100, step: 0.5 };
    const values = dataset.rows.flatMap((row) => {
      const value = parseNumericValue(row[mapping.value]);
      return value === null ? [] : [value];
    });
    if (!values.length) return { minimum: -100, maximum: 100, step: 0.5 };
    const low = Math.min(...values); const high = Math.max(...values); const span = Math.max(1, high - low, Math.abs(low) * .2, Math.abs(high) * .2);
    return { minimum: Math.floor(low - span * .25), maximum: Math.ceil(high + span * .25), step: Math.max(0.01, Number((span / 200).toPrecision(2))) };
  }, [dataset.rows, mapping.value, plotType]);
  const validation = useMemo(
    () => validatePlotDataset(getPlotDefinition(plotType), dataset, mapping, settings),
    [plotType, dataset, mapping, settings],
  );
  const categoryLabels = useMemo(() => categoricalColorLabels(plotType, dataset.rows, mapping), [plotType, dataset.rows, mapping]);
  const isValid = validation.errors.length === 0;
  const mainGridStyle = {
    "--visualization-panel-top": `${stickyHeaderHeight + 12}px`,
    "--visualization-panel-height": `calc(100dvh - ${stickyHeaderHeight + 28}px)`,
  } as CSSProperties;
  const currentColorFingerprint = useMemo(() => colorFingerprint(paletteColorsFromSettings(settings, themeId)), [settings, themeId]);
  const selectedCustomPalette = useMemo(() => customPalettes.find((palette) => palette.id === selectedCustomPaletteId), [customPalettes, selectedCustomPaletteId]);
  const selectedPaletteFingerprint = useMemo(() => {
    if (selectedCustomPalette) return colorFingerprint(paletteColorsFromSettings(applyCustomPalette(settingsForTheme(selectedCustomPalette.sourceThemeId), selectedCustomPalette), selectedCustomPalette.sourceThemeId));
    if (paletteSeriesId === "custom") return "";
    return colorFingerprint(paletteColorsFromSettings(settingsForTheme(themeId), themeId));
  }, [paletteSeriesId, selectedCustomPalette, themeId]);
  const currentPaletteName = paletteSeriesId === "custom" ? selectedCustomPalette?.name || "Custom" : journalThemes[themeId].name;
  const currentPalettePreviewColors = paletteColorsFromSettings(settings, themeId).categoricalColors.slice(0, 4);
  const hasUnsavedColorChanges = currentColorFingerprint !== selectedPaletteFingerprint;
  const previewSettings = useMemo(() => {
    if (!pcaAnalysis) return settings;
    return {
      ...settings,
      xLabel: settings.xLabel || pcaAxisLabel(mapping.x, pcaAnalysis.explainedVariance),
      yLabel: settings.yLabel || pcaAxisLabel(mapping.y, pcaAnalysis.explainedVariance),
    };
  }, [mapping.x, mapping.y, pcaAnalysis, settings]);

  const updateSetting = <Key extends keyof VisualizationSettings>(key: Key, value: VisualizationSettings[Key]) => {
    setSettings((current) => ({ ...current, [key]: value }));
  };

  const updateCategoryColor = (index: number, value: string) => {
    setSettings((current) => {
      const themeColors = journalThemes[themeId].categorical;
      const nextLength = Math.max(current.categoricalColors.length, index + 1);
      const categoricalColors = Array.from({ length: nextLength }, (_, colorIndex) => current.categoricalColors[colorIndex] ?? themeColors[colorIndex % themeColors.length]);
      categoricalColors[index] = value;
      return { ...current, categoricalColors };
    });
  };

  const applyDataExample = (exampleIndex: number) => {
    const example = dataExamples[exampleIndex];
    if (!example) return;
    setSelectedExampleIndex(exampleIndex);
    setRawData(example.data);
    setMapping(example.mapping ?? definition.defaultMapping);
    setLoadedFileName("");
    setFileError("");
    if (plotType === "pca") setPcaOptions(defaultPcaOptions);
    if (plotType === "bar") updateSetting("barInputMode", exampleIndex === 1 ? "long" : "summary");
  };

  const selectPlot = (nextType: PlotType) => {
    const nextModule = getPlotModule(nextType);
    const next = nextModule.definition;
    const nextExample = nextModule.examples[0];
    setPlotType(nextType);
    setSelectedExampleIndex(0);
    setRawData(nextExample.data);
    setMapping(nextExample.mapping ?? next.defaultMapping);
    setLoadedFileName("");
    setFileError("");
    if (nextType === "pca") setPcaOptions(defaultPcaOptions);
    setSettings((current) => ({
      ...current,
      title: "",
      xLabel: "",
      yLabel: "",
      swapAxes: false,
      compositionLabelMode: nextType === "rose" ? "value" : current.compositionLabelMode,
      legendPosition: (["heatmap", "clustered-heatmap", "correlation-heatmap", "enrichment", "enrichment-bar", "venn", "upset", "sankey", "chord", "circos"] as PlotType[]).includes(nextType) && current.legendPosition === "bottom" ? "right" : current.legendPosition,
    }));
    window.requestAnimationFrame(() => {
      previewCardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const selectTheme = (nextTheme: JournalThemeId) => {
    const theme = journalThemes[nextTheme];
    setThemeId(nextTheme);
    setPaletteSeriesId(theme.series);
    setSelectedCustomPaletteId("");
    writePalettePreference({ seriesId: theme.series, themeId: nextTheme });
    setSettings((current) => ({
      ...current,
      categoricalColors: [...theme.categorical],
      continuousLow: theme.sequential[0],
      continuousHigh: theme.sequential[1],
      divergingLow: theme.diverging[0],
      divergingMid: theme.diverging[1],
      divergingHigh: theme.diverging[2],
      barBorderColor: theme.ink,
    }));
  };

  const selectPaletteSeries = (nextSeries: PaletteSeriesId) => {
    if (nextSeries === "custom") {
      const firstCustomPalette = customPalettes[0];
      setPaletteSeriesId("custom");
      if (!firstCustomPalette) {
        writePalettePreference({ seriesId: "custom", themeId });
        return;
      }
      setSelectedCustomPaletteId(firstCustomPalette.id);
      setCustomPaletteName(firstCustomPalette.name);
      setThemeId(firstCustomPalette.sourceThemeId);
      setSettings((current) => applyCustomPalette(current, firstCustomPalette));
      writePalettePreference({ seriesId: "custom", themeId: firstCustomPalette.sourceThemeId, customPaletteId: firstCustomPalette.id });
      return;
    }
    const builtInSeries = nextSeries as BuiltInPaletteSeriesId;
    const firstTheme = paletteSeries[builtInSeries].themeIds[0];
    setPaletteSeriesId(nextSeries);
    selectTheme(firstTheme);
  };

  const selectCustomPalette = (palette: CustomPalette) => {
    setPaletteSeriesId("custom");
    setSelectedCustomPaletteId(palette.id);
    setCustomPaletteName(palette.name);
    setThemeId(palette.sourceThemeId);
    setSettings((current) => applyCustomPalette(current, palette));
    writePalettePreference({ seriesId: "custom", themeId: palette.sourceThemeId, customPaletteId: palette.id });
  };

  const saveCustomPalette = () => {
    const name = customPaletteName.trim() || `Custom ${customPalettes.length + 1}`;
    const now = new Date().toISOString();
    const existing = customPalettes.find((palette) => palette.name.trim().toLowerCase() === name.toLowerCase());
    const palette: CustomPalette = {
      id: existing?.id ?? globalThis.crypto?.randomUUID?.() ?? `custom-${Date.now()}`,
      name,
      ...paletteColorsFromSettings(settings, themeId),
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };
    const nextPalettes = existing
      ? customPalettes.map((item) => item.id === existing.id ? palette : item)
      : [palette, ...customPalettes];
    writeCustomPalettes(nextPalettes);
    setCustomPalettes(nextPalettes);
    setPaletteSeriesId("custom");
    setSelectedCustomPaletteId(palette.id);
    setCustomPaletteName(name);
    writePalettePreference({ seriesId: "custom", themeId: palette.sourceThemeId, customPaletteId: palette.id });
  };

  const selectErrorType = (key: "barErrorType" | "lineErrorType", value: VisualizationSettings["barErrorType"]) => {
    setSettings((current) => ({ ...current, [key]: value }));
    if (value === "none") return;
    const preferredAliases = value === "sd"
      ? ["sd", "standarddeviation", "error"]
      : ["sem", "se", "stderr", "standarderror", "error"];
    const normalizedHeaders = new Map(dataset.headers.map((header) => [header.toLowerCase().replace(/[^a-z0-9]/g, ""), header]));
    const preferredColumn = preferredAliases.map((alias) => normalizedHeaders.get(alias)).find(Boolean);
    if (preferredColumn) setMapping((current) => ({ ...current, error: preferredColumn }));
  };

  const selectBarVariant = (value: VisualizationSettings["barVariant"]) => {
    setSettings((current) => ({
      ...current,
      barVariant: value,
      swapAxes: ["dual-axis", "overlay", "polar", "faceted"].includes(value) ? false : current.swapAxes,
      legendPosition: value === "dual-axis" && current.legendPosition === "right" ? "bottom" : current.legendPosition,
    }));
  };

  const loadFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setFileError("");
    try {
      const text = file.name.toLowerCase().endsWith(".xlsx")
        ? spreadsheetRowsToTsv(await (await import("read-excel-file/browser")).readSheet(file))
        : await file.text();
      setRawData(text);
      setSelectedExampleIndex(-1);
      setLoadedFileName(file.name);
      if (plotType === "pca") setMapping(definition.defaultMapping);
      else setMapping(inferPlotMapping(definition, parseDelimitedData(text).headers));
    } catch (error) {
      setFileError(error instanceof Error ? error.message : "The selected file could not be read.");
    }
    event.target.value = "";
  };

  const downloadInputTemplate = () => {
    const example = dataExamples[selectedExampleIndex >= 0 ? selectedExampleIndex : 0] ?? dataExamples[0];
    downloadBlob(new Blob([example.data], { type: "text/tab-separated-values;charset=utf-8" }), `${slug(definition.name)}-${slug(example.label)}-template.tsv`);
  };

  const exportSvg = () => {
    if (!svgRef.current || !isValid) return;
    const source = serializeSvg(svgRef.current, figureFontPresets[settings.fontFamily].family);
    downloadBlob(new Blob([source], { type: "image/svg+xml;charset=utf-8" }), `${slug(settings.title || definition.name)}.svg`);
  };

  const exportPng = async () => {
    if (!svgRef.current || !isValid) return;
    const source = serializeSvg(svgRef.current, figureFontPresets[settings.fontFamily].family);
    const url = URL.createObjectURL(new Blob([source], { type: "image/svg+xml;charset=utf-8" }));
    const image = new window.Image();
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error("The SVG preview could not be rasterized."));
      image.src = url;
    });
    const scale = 600 / 96;
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(settings.width * scale);
    canvas.height = Math.round(settings.height * scale);
    const context = canvas.getContext("2d");
    if (!context) {
      URL.revokeObjectURL(url);
      return;
    }
    context.fillStyle = "#FFFFFF";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    URL.revokeObjectURL(url);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
    if (blob) downloadBlob(blob, `${slug(settings.title || definition.name)}-600dpi.png`);
  };

  const exportConfig = () => {
    const payload = {
      schemaVersion: 1,
      generatedAt: new Date().toISOString(),
      plotType,
      themeId,
      mapping,
      settings,
      pca: pcaAnalysis ? {
        options: pcaOptions,
        detectedLayer: pcaAnalysis.detectedLayer,
        sampleColumns: pcaAnalysis.sampleColumns,
        featuresRead: pcaAnalysis.featuresRead,
        featuresUsed: pcaAnalysis.featuresUsed,
        explainedVariance: pcaAnalysis.explainedVariance,
        transformation: pcaAnalysis.transformation,
      } : undefined,
      data: rawData,
    };
    downloadBlob(new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" }), `${slug(settings.title || definition.name)}.labnest-figure.json`);
  };

  return (
    <div className="space-y-[var(--ln-vis-panel-gap)]" data-visualization-workbench>
      <div ref={stickyHeaderRef} data-visualization-sticky-header className="sticky top-0 z-20 -mx-1 space-y-1.5 border-b border-hairline/70 bg-paper/95 px-1 pb-2 backdrop-blur">
        <PageHeader identifier="TOOLS / VIS" title="Visualization Studio" className="min-h-8" />
        <Card className="overflow-hidden rounded-[var(--ln-vis-panel-radius)] border-[var(--ln-vis-panel-border)] shadow-none">
          <button
            type="button"
            aria-expanded={mobilePaletteOpen}
            aria-controls="visualization-mobile-palette-controls"
            onClick={() => setMobilePaletteOpen((open) => !open)}
            className="focus-ring flex w-full items-center justify-between gap-3 px-3 py-2 text-left md:hidden"
          >
            <span className="flex min-w-0 items-center gap-2">
              <span className="flex -space-x-0.5" aria-hidden>{currentPalettePreviewColors.map((color, colorIndex) => <span key={`mobile-current-${color}-${colorIndex}`} className="h-3.5 w-3.5 rounded-full border border-white" style={{ backgroundColor: color }} />)}</span>
              <span className="truncate text-xs font-semibold text-ink">{currentPaletteName}</span>
            </span>
            <ChevronDown className={cn("h-4 w-4 shrink-0 text-muted transition-transform", mobilePaletteOpen && "rotate-180")} aria-hidden />
          </button>
          <div id="visualization-mobile-palette-controls" className={cn("md:block", mobilePaletteOpen ? "block border-t border-hairline" : "hidden")}>
          <CardBody className="grid gap-1.5 p-2.5">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="mr-0.5 text-[11px] font-semibold text-graphite">Palette</span>
              {(Object.keys(paletteSeries) as PaletteSeriesId[]).map((id) => (
                <button key={id} type="button" title={paletteSeries[id].description} onClick={() => selectPaletteSeries(id)} className={cn("focus-ring h-7 rounded-[6px] border px-2 text-[11px] font-medium transition-colors", paletteSeriesId === id ? "border-moss bg-[var(--ln-vis-active-bg)] text-ink" : "border-transparent bg-transparent text-graphite hover:border-hairline hover:bg-warm")}>{paletteSeries[id].name}</button>
              ))}
              <span className="mx-0.5 h-5 w-px bg-hairline" aria-hidden />
              {paletteSeriesId === "custom" ? customPalettes.length ? customPalettes.map((palette) => (
                <button key={palette.id} type="button" title={palette.name} onClick={() => selectCustomPalette(palette)} className={cn("focus-ring flex h-7 items-center gap-1.5 rounded-[6px] border px-2 text-[11px] transition", selectedCustomPaletteId === palette.id ? "border-moss bg-sage-surface text-ink" : "border-hairline bg-white text-graphite hover:border-border-strong")}>
                  <span className="flex -space-x-0.5">{palette.categoricalColors.slice(0, 4).map((color, colorIndex) => <span key={`${palette.id}-${color}-${colorIndex}`} className="h-3 w-3 rounded-full border border-white" style={{ backgroundColor: color }} />)}</span>
                  {palette.name}
                  {selectedCustomPaletteId === palette.id ? <Check className="h-3.5 w-3.5" aria-hidden /> : null}
                </button>
              )) : <span className="rounded-[6px] border border-dashed border-hairline px-2 py-1 text-[11px] text-muted">No custom palettes</span> : paletteSeries[paletteSeriesId].themeIds.map((id) => (
                <button key={id} type="button" title={journalThemes[id].description} onClick={() => selectTheme(id)} className={cn("focus-ring flex h-7 items-center gap-1.5 rounded-[6px] border px-2 text-[11px] transition", themeId === id ? "border-moss bg-sage-surface text-ink" : "border-hairline bg-white text-graphite hover:border-border-strong") }>
                  <span className="flex -space-x-0.5">{journalThemes[id].categorical.slice(0, 4).map((color) => <span key={color} className="h-3 w-3 rounded-full border border-white" style={{ backgroundColor: color }} />)}</span>
                  {journalThemes[id].name}
                  {themeId === id ? <Check className="h-3.5 w-3.5" aria-hidden /> : null}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              <input aria-label="Custom palette name" value={customPaletteName} placeholder="Custom palette name" onChange={(event) => setCustomPaletteName(event.target.value)} className="focus-ring h-7 w-40 rounded-[6px] border border-hairline bg-white px-2 text-[11px] text-ink placeholder:text-muted" />
              <Button size="sm" variant={hasUnsavedColorChanges ? "primary" : "secondary"} onClick={saveCustomPalette}><Save className="h-3.5 w-3.5" aria-hidden />Save palette</Button>
              {hasUnsavedColorChanges ? <Badge tone="warning">Unsaved colors</Badge> : selectedCustomPaletteId ? <Badge tone="success">Saved palette</Badge> : null}
              <select aria-label="Figure font" className="focus-ring h-7 rounded-[6px] border border-hairline bg-white px-2 text-[11px] text-graphite" value={settings.fontFamily} onChange={(event) => updateSetting("fontFamily", event.target.value as FigureFontId)}>
                {(Object.keys(figureFontPresets) as FigureFontId[]).map((id) => <option key={id} value={id}>{figureFontPresets[id].name}</option>)}
              </select>
              <Badge tone="sage">Compact preset</Badge>
            </div>
          </CardBody>
          </div>
        </Card>
        <Card className="rounded-[var(--ln-vis-panel-radius)] border-[var(--ln-vis-panel-border)] shadow-none md:hidden">
          <CardBody className="p-2">
            <div className="relative">
              <select aria-label="Plot type" value={plotType} onChange={(event) => selectPlot(event.target.value as PlotType)} className="focus-ring h-10 w-full appearance-none rounded-[8px] border border-hairline bg-white px-3 pr-9 text-sm font-medium text-ink">
                {plotModuleRegistry.list().map(({ definition: plot }) => <option key={plot.id} value={plot.id}>{plot.name}</option>)}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="grid items-start gap-[var(--ln-vis-panel-gap)] xl:grid-cols-[180px_minmax(0,1fr)_288px] xl:items-start" style={mainGridStyle}>
        <Card className="hidden rounded-[var(--ln-vis-panel-radius)] border-[var(--ln-vis-panel-border)] shadow-none md:block xl:sticky xl:top-[var(--visualization-panel-top)] xl:flex xl:h-[var(--visualization-panel-height)] xl:min-h-0 xl:flex-col xl:overflow-hidden">
          <CardHeader title="Plot types" className="h-12 shrink-0" />
          <CardBody className="space-y-1 p-2 xl:min-h-0 xl:flex-1 xl:overflow-y-auto xl:[scrollbar-gutter:stable]">
            {plotModuleRegistry.list().map(({ definition: plot }) => (
              <button key={plot.id} type="button" onClick={() => selectPlot(plot.id)} className={cn("focus-ring relative w-full rounded-[6px] border border-transparent px-2.5 py-2 text-left transition-colors before:absolute before:inset-y-2 before:left-0 before:w-0.5 before:rounded-full before:bg-transparent", plotType === plot.id ? "bg-[var(--ln-vis-active-bg)] before:bg-moss" : "hover:bg-warm") }>
                <span className="block text-[13px] font-medium text-ink">{plot.name}</span>
                <span className="mt-0.5 block text-[10px] uppercase tracking-[0.07em] text-muted">{plot.family}</span>
              </button>
            ))}
          </CardBody>
        </Card>

        <div className="min-w-0 space-y-[var(--ln-vis-panel-gap)]">
          <div ref={previewCardRef} className="scroll-mt-[var(--visualization-panel-top)]">
          <Card className="overflow-hidden rounded-[var(--ln-vis-panel-radius)] border-[var(--ln-vis-preview-border)] shadow-[var(--ln-vis-preview-shadow)]">
            <CardHeader className="min-h-12 shrink-0 max-sm:block max-sm:[&_.card-action]:mt-2" title={`${definition.name} preview`} action={<div className="flex flex-wrap items-center justify-end gap-1.5 max-sm:justify-start"><Badge>{dataset.rows.length} {plotType === "pca" ? "observations" : "rows"}</Badge><Badge tone={isValid ? "success" : "danger"}>{isValid ? "Ready" : "Check data"}</Badge><span className="mx-0.5 h-5 w-px bg-hairline max-sm:hidden" aria-hidden /><Button size="sm" onClick={exportSvg} disabled={!isValid}><Download className="h-3.5 w-3.5" aria-hidden />SVG</Button><Button size="sm" onClick={exportPng} disabled={!isValid} title="Export PNG at 600 dpi"><ImageIcon className="h-3.5 w-3.5" aria-hidden />PNG</Button><Button size="sm" onClick={exportConfig}><FileJson className="h-3.5 w-3.5" aria-hidden />Config</Button></div>} />
            <CardBody className="p-3 sm:p-4">
              <p className="mb-3 text-xs leading-5 text-muted">{definition.summary}</p>
              {validation.errors.length > 0 ? (
                <div className="rounded-[9px] border border-error/25 bg-error-surface px-3 py-2 text-xs leading-5 text-error">
                  {validation.errors.map((error) => <p key={error}>• {error}</p>)}
                </div>
              ) : (
                <div className="overflow-auto rounded-[8px] border border-[var(--ln-vis-panel-border)] bg-[var(--ln-vis-canvas-bg)] p-2 sm:p-3">
                  <div className="mx-auto w-fit min-w-max max-w-none rounded-[4px] bg-white shadow-[0_1px_6px_rgba(35,36,42,0.08)]">
                    <ScientificChartPreview svgRef={svgRef} type={plotType} dataset={dataset} mapping={mapping} settings={previewSettings} themeId={themeId} />
                  </div>
                </div>
              )}
              {validation.warnings.length > 0 ? <div className="mt-3 rounded-[8px] border border-warning/20 bg-warning-surface px-3 py-2 text-xs leading-5 text-warning">{validation.warnings.join(" · ")}</div> : null}
            </CardBody>
          </Card>
          </div>

          <Card className="overflow-hidden rounded-[var(--ln-vis-panel-radius)] border-[var(--ln-vis-panel-border)] shadow-none">
            <CardHeader
              className="h-12"
              title="Data & mapping"
              action={(
                <div className="flex flex-wrap justify-end gap-2">
                  <input ref={fileRef} type="file" accept=".tsv,.csv,.txt,.xls,.xlsx,text/csv,text/tab-separated-values,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" className="hidden" onChange={loadFile} />
                  <Button size="sm" onClick={() => fileRef.current?.click()}><Upload className="h-3.5 w-3.5" aria-hidden />Upload</Button>
                  <Button size="sm" onClick={downloadInputTemplate} title="Download input data template"><Download className="h-3.5 w-3.5" aria-hidden />Template</Button>
                </div>
              )}
            />
            <CardBody className="grid items-start gap-3 p-3 lg:grid-cols-[minmax(0,1fr)_minmax(240px,0.56fr)] sm:p-4">
              <div className="grid content-start gap-2 text-xs text-graphite">
                <div className="flex flex-wrap items-end justify-between gap-2">
                  <span>{plotType === "pca" ? "Feature matrix" : "CSV or TSV data"}</span>
                  <div className="flex flex-wrap gap-1.5" aria-label="Example data">
                    {dataExamples.map((example, exampleIndex) => (
                      <button
                        key={`${definition.id}-${example.label}`}
                        type="button"
                        title={example.description}
                        onClick={() => applyDataExample(exampleIndex)}
                        className={cn(
                          "focus-ring h-7 rounded-[7px] border px-2 text-[11px] font-medium transition",
                          selectedExampleIndex === exampleIndex ? "border-moss bg-sage-surface text-ink" : "border-hairline bg-white text-graphite hover:border-border-strong",
                        )}
                      >
                        {example.label}
                      </button>
                    ))}
                  </div>
                </div>
                {rawData.length > 500_000 ? (
                  <div className="min-h-44 overflow-hidden rounded-[8px] border border-hairline bg-[#FBFBF9] p-3">
                    <p className="font-medium text-ink">{loadedFileName || "Large matrix"} loaded locally</p>
                    <p className="mt-1 text-[11px] text-muted">{(rawData.length / 1_048_576).toFixed(1)} MB · the full text is not rendered here to keep the browser responsive.</p>
                    <pre className="mt-3 max-h-40 overflow-hidden whitespace-pre-wrap font-mono text-[10px] leading-4 text-graphite">{rawData.slice(0, 8_000)}</pre>
                  </div>
                ) : <textarea aria-label={plotType === "pca" ? "Feature matrix" : "CSV or TSV data"} value={rawData} onChange={(event) => { setRawData(event.target.value); setSelectedExampleIndex(-1); setLoadedFileName(""); }} spellCheck={false} className="focus-ring min-h-44 resize-y rounded-[8px] border border-hairline bg-[#FBFBF9] p-3 font-mono text-[11px] leading-5 text-ink" />}
                {fileError ? <span className="text-error">{fileError}</span> : null}
              </div>
              <div className="space-y-2.5">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold text-graphite">{plotType === "pca" ? "PCA input" : "Column mapping"}</p>
                    {plotType !== "pca" && definition.roles.length > 0 ? <Button size="sm" variant="ghost" onClick={() => setMapping(inferPlotMapping(definition, dataset.headers))}>Auto-map</Button> : null}
                  </div>
                  <p className="mt-1 text-[11px] leading-4 text-muted">{definition.inputHint}</p>
                </div>
                {plotType === "pca" && pcaAnalysis ? <>
                  <SelectControl label="Data layer" value={pcaOptions.dataLayer} onChange={(value) => setPcaOptions((current) => ({ ...current, dataLayer: value as PcaDataLayer }))}>
                    <option value="auto">Auto-detect (recommended)</option>
                    <option value="counts">Count matrix → log₂(CPM + 1)</option>
                    <option value="abundance">Non-negative abundance → log₂(x + 1)</option>
                    <option value="normalized">Continuous / already normalized</option>
                  </SelectControl>
                  <SelectControl label="Top variable features" value={String(pcaOptions.topVariableFeatures)} onChange={(value) => setPcaOptions((current) => ({ ...current, topVariableFeatures: Number(value) }))}>
                    <option value="500">500</option><option value="1000">1,000</option><option value="2000">2,000</option><option value="5000">5,000</option><option value="10000">10,000</option><option value="0">All variable features</option>
                  </SelectControl>
                  <ToggleControl label="Scale each feature to unit variance" checked={pcaOptions.scaleFeatures} onChange={(value) => setPcaOptions((current) => ({ ...current, scaleFeatures: value }))} />
                  <SelectControl label="X component" value={mapping.x} onChange={(value) => setMapping((current) => ({ ...current, x: value }))}>
                    {dataset.headers.filter((header) => /^PC\d+$/.test(header)).map((header) => <option key={header} value={header}>{pcaAxisLabel(header, pcaAnalysis.explainedVariance)}</option>)}
                  </SelectControl>
                  <SelectControl label="Y component" value={mapping.y} onChange={(value) => setMapping((current) => ({ ...current, y: value }))}>
                    {dataset.headers.filter((header) => /^PC\d+$/.test(header)).map((header) => <option key={header} value={header}>{pcaAxisLabel(header, pcaAnalysis.explainedVariance)}</option>)}
                  </SelectControl>
                  <div className="rounded-[8px] border border-hairline px-3 py-2 text-[11px] leading-5 text-muted">
                    <p>{pcaAnalysis.sampleColumns.length} observations · {pcaAnalysis.featuresUsed.toLocaleString()} / {pcaAnalysis.featuresRead.toLocaleString()} features used</p>
                    <p>{pcaAnalysis.transformation || "Waiting for a valid feature matrix."}</p>
                    <p>{pcaAnalysis.groups.length} inferred group{pcaAnalysis.groups.length === 1 ? "" : "s"}: {pcaAnalysis.groups.join(" · ") || "—"}</p>
                    {pcaAnalysis.availableLayers.length > 1 ? <p>Detected layers: {pcaAnalysis.availableLayers.map((layer) => `${layer.label} (${layer.columns})`).join(" · ")}</p> : null}
                  </div>
                </> : visibleRoles.length === 0 ? <p className="rounded-[8px] bg-stone px-3 py-2 text-xs leading-5 text-graphite">The first column supplies row labels; all remaining columns form the numeric matrix.</p> : visibleRoles.map((role) => (
                  <SelectControl key={role.key} label={`${mappingRoleLabel(plotType, role, settings.swapAxes || ["horizontal", "bullet", "pyramid"].includes(settings.barVariant))}${role.required ? " *" : ""}`} value={mapping[role.key] ?? ""} onChange={(value) => setMapping((current) => ({ ...current, [role.key]: value }))}>
                    <option value="">{role.required ? "Select column" : "None"}</option>
                    {dataset.headers.map((header) => <option key={header} value={header}>{header}</option>)}
                  </SelectControl>
                ))}
                <div className="rounded-[8px] border border-hairline px-3 py-2 text-[11px] leading-5 text-muted">
                  <p>{dataset.headers.length} columns · {dataset.rows.length} {plotType === "pca" ? "PCA observations" : "data rows"} · {dataset.delimiter === "tab" ? "TSV" : "CSV"}</p>
                  <p>Input stays in your browser; exports include a reproducible parameter file.</p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="flex min-h-0 flex-col gap-[var(--ln-vis-panel-gap)] overflow-hidden xl:sticky xl:top-[var(--visualization-panel-top)] xl:h-[var(--visualization-panel-height)]">
          <Card className="min-h-0 rounded-[var(--ln-vis-panel-radius)] border-[var(--ln-vis-panel-border)] shadow-none xl:flex xl:flex-1 xl:flex-col">
            <CardHeader className="h-12 shrink-0" title="Figure parameters" action={<Button size="sm" variant="ghost" onClick={() => {
              const resetSettings = settingsForTheme(themeId);
              setSettings(plotType === "rose" ? { ...resetSettings, compositionLabelMode: "value" } : resetSettings);
            }}><RotateCcw className="h-3.5 w-3.5" aria-hidden />Reset</Button>} />
            <CardBody className="space-y-4 p-4 xl:min-h-0 xl:flex-1 xl:overflow-y-auto xl:[scrollbar-gutter:stable]">
              <ControlGroup title="Labels">
                <TextControl label="Title" value={settings.title} onChange={(value) => updateSetting("title", value)} placeholder={`${definition.name} title`} />
              {hasSetting("xLabel") ? <TextControl label="X-axis label" value={settings.xLabel} onChange={(value) => updateSetting("xLabel", value)} /> : null}
              {hasSetting("yLabel") ? <TextControl label="Y-axis label" value={settings.yLabel} onChange={(value) => updateSetting("yLabel", value)} /> : null}
              {manualAxes.length > 0 ? (
                <div className="grid grid-cols-2 gap-2">
                  {manualAxes.includes("x") ? <><OptionalNumberControl label="X minimum" value={settings.xMin} invalid={invalidXLimits} describedBy="x-axis-limit-error" onChange={(value) => updateSetting("xMin", value)} /><OptionalNumberControl label="X maximum" value={settings.xMax} invalid={invalidXLimits} describedBy="x-axis-limit-error" onChange={(value) => updateSetting("xMax", value)} /></> : null}
                  {manualAxes.includes("y") ? <><OptionalNumberControl label="Y minimum" value={settings.yMin} invalid={invalidYLimits} describedBy="y-axis-limit-error" onChange={(value) => updateSetting("yMin", value)} /><OptionalNumberControl label="Y maximum" value={settings.yMax} invalid={invalidYLimits} describedBy="y-axis-limit-error" onChange={(value) => updateSetting("yMax", value)} /></> : null}
                  {invalidXLimits ? <p id="x-axis-limit-error" className="col-span-2 text-[11px] leading-4 text-error">X minimum must be smaller than X maximum.</p> : null}
                  {invalidYLimits ? <p id="y-axis-limit-error" className="col-span-2 text-[11px] leading-4 text-error">Y minimum must be smaller than Y maximum.</p> : null}
                  <p className="col-span-2 text-[11px] leading-4 text-muted">Leave blank for data-aware automatic limits. Clipped mapped values are reported below the preview.</p>
                </div>
              ) : null}
              </ControlGroup>

            <ControlGroup title="Compact layout">
              <RangeControl label="Width" value={settings.width} minimum={300} maximum={1600} step={10} unit=" px" onChange={(value) => updateSetting("width", value)} />
              <RangeControl label="Height" value={settings.height} minimum={280} maximum={1200} step={10} unit=" px" onChange={(value) => updateSetting("height", value)} />
              <RangeControl label="Title size" value={settings.titleSize} minimum={13} maximum={26} unit=" pt" onChange={(value) => updateSetting("titleSize", value)} />
              {hasSetting("axisLabelSize") ? <RangeControl label="Axis label size" value={settings.axisLabelSize} minimum={10} maximum={20} unit=" pt" onChange={(value) => updateSetting("axisLabelSize", value)} /> : null}
              {hasSetting("tickSize") ? <RangeControl label="Tick size" value={settings.tickSize} minimum={9} maximum={16} unit=" pt" onChange={(value) => updateSetting("tickSize", value)} /> : null}
              {hasSetting("legendSize") ? <RangeControl label="Legend size" value={settings.legendSize} minimum={9} maximum={16} unit=" pt" onChange={(value) => updateSetting("legendSize", value)} /> : null}
            </ControlGroup>

            {(["axisLineWidth", "gridLineWidth", "dataLineWidth", "pointSize", "opacity", "grid", "legendPosition", "swapAxes", "showTrend", "showLabels", "showPoints", "showSampleSize"] as Array<keyof VisualizationSettings>).some(hasSetting) ? <ControlGroup title="Marks & axes">
              {hasSetting("axisLineWidth") ? <RangeControl label="Axis line" value={settings.axisLineWidth} minimum={0.8} maximum={3} step={0.1} unit=" px" onChange={(value) => updateSetting("axisLineWidth", value)} /> : null}
              {hasSetting("gridLineWidth") ? <RangeControl label="Grid line" value={settings.gridLineWidth} minimum={0.4} maximum={2} step={0.1} unit=" px" onChange={(value) => updateSetting("gridLineWidth", value)} /> : null}
              {hasSetting("dataLineWidth") ? <RangeControl label="Data line" value={settings.dataLineWidth} minimum={1} maximum={5} step={0.1} unit=" px" onChange={(value) => updateSetting("dataLineWidth", value)} /> : null}
              {hasSetting("pointSize") ? <RangeControl label="Point size" value={settings.pointSize} minimum={2} maximum={12} step={0.5} unit=" px" onChange={(value) => updateSetting("pointSize", value)} /> : null}
              {hasSetting("opacity") ? <RangeControl label="Opacity" value={settings.opacity} minimum={0.25} maximum={1} step={0.05} onChange={(value) => updateSetting("opacity", value)} /> : null}
              {hasSetting("grid") ? <SelectControl label="Grid" value={settings.grid} onChange={(value) => updateSetting("grid", value as VisualizationSettings["grid"])}><option value="none">None</option><option value="y">Horizontal only</option><option value="both">Both axes</option></SelectControl> : null}
              {hasSetting("legendPosition") ? <SelectControl label="Legend" value={settings.legendPosition} onChange={(value) => updateSetting("legendPosition", value as VisualizationSettings["legendPosition"])}><option value="right">Right</option>{plotType !== "enrichment" && plotType !== "enrichment-bar" ? <option value="bottom">Bottom</option> : null}<option value="none">Hidden</option></SelectControl> : null}
              {(["line", "scatter", "pca"] as PlotType[]).includes(plotType) || (plotType === "bar" && !["horizontal", "bullet", "pyramid", "dual-axis", "overlay", "polar", "faceted"].includes(settings.barVariant)) ? <ToggleControl label="Swap axes" checked={settings.swapAxes} onChange={(value) => updateSetting("swapAxes", value)} /> : null}
              {plotType === "scatter" || plotType === "correlation" ? <><ToggleControl label="Linear trend" checked={settings.showTrend} onChange={(value) => updateSetting("showTrend", value)} /><ToggleControl label="Point labels" checked={settings.showLabels} onChange={(value) => updateSetting("showLabels", value)} /></> : null}
              {(["pca", "pcoa", "umap", "quadrant"] as PlotType[]).includes(plotType) ? <ToggleControl label="Point labels" checked={settings.showLabels} onChange={(value) => updateSetting("showLabels", value)} /> : null}
              {(["box", "violin", "beeswarm", "raincloud"] as PlotType[]).includes(plotType) ? <><ToggleControl label="Show observations" checked={settings.showPoints} onChange={(value) => updateSetting("showPoints", value)} /><ToggleControl label="Show sample size" checked={settings.showSampleSize} onChange={(value) => updateSetting("showSampleSize", value)} /></> : null}
            </ControlGroup> : null}

            {plotType === "line" || (plotType === "bar" && !["stacked", "percentage", "polar"].includes(settings.barVariant)) ? <ControlGroup title={`${plotType === "bar" ? "Bar" : "Line"} error bars`}>
              <SelectControl label="Error representation" value={plotType === "bar" ? settings.barErrorType : settings.lineErrorType} onChange={(value) => selectErrorType(plotType === "bar" ? "barErrorType" : "lineErrorType", value as VisualizationSettings["barErrorType"])}><option value="none">None</option><option value="sd">Mean ± SD</option><option value="sem">Mean ± SEM</option></SelectControl>
              {(plotType === "bar" ? settings.barErrorType : settings.lineErrorType) !== "none" ? <><RangeControl label="Error line" value={settings.errorBarLineWidth} minimum={0.8} maximum={3} step={0.1} unit=" px" onChange={(value) => updateSetting("errorBarLineWidth", value)} /><RangeControl label="Cap width" value={settings.errorBarCapSize} minimum={4} maximum={30} step={1} unit=" px" onChange={(value) => updateSetting("errorBarCapSize", value)} /><p className="rounded-[8px] bg-stone px-3 py-2 text-[11px] leading-4 text-graphite">Map the column containing the already-calculated {(plotType === "bar" ? settings.barErrorType : settings.lineErrorType).toUpperCase()} values under Data &amp; mapping. SD and SEM are not interchangeable; SEM = SD / √n.</p></> : null}
            </ControlGroup> : null}

            {plotType === "bar" ? <>
              <ControlGroup title="Categorical design">
                <SelectControl label="Variant" value={settings.barVariant} onChange={(value) => selectBarVariant(value as VisualizationSettings["barVariant"])}>
                  <option value="grouped">Grouped</option><option value="stacked">Stacked</option><option value="percentage">100% stacked</option><option value="horizontal">Horizontal</option><option value="bidirectional">Bidirectional</option><option value="faceted">Faceted</option><option value="polar">Polar bars</option><option value="bullet">Bullet</option><option value="pyramid">Pyramid</option><option value="axis-break">Axis break</option><option value="dual-axis">Dual axis</option><option value="overlay">Bar + overlay</option>
                </SelectControl>
                <SelectControl label="Input structure" value={settings.barInputMode} onChange={(value) => updateSetting("barInputMode", value as VisualizationSettings["barInputMode"])}><option value="summary">Summary values</option><option value="long">Long-form observations</option></SelectControl>
                <RangeControl label={settings.barVariant === "polar" ? "Angular gap" : "Gap"} value={settings.barGap} minimum={0.04} maximum={0.5} step={0.01} onChange={(value) => updateSetting("barGap", value)} />
                {["dual-axis", "overlay"].includes(settings.barVariant) ? <SelectControl label="Secondary mark" value={settings.barOverlayType} onChange={(value) => updateSetting("barOverlayType", value as VisualizationSettings["barOverlayType"])}><option value="line">Line + points</option><option value="points">Points only</option></SelectControl> : null}
                {settings.barVariant === "dual-axis" ? <TextControl label="Secondary axis label" value={settings.secondaryAxisLabel} onChange={(value) => updateSetting("secondaryAxisLabel", value)} placeholder="Secondary value (unit)" /> : null}
                {settings.barVariant === "dual-axis" ? <p className="rounded-[8px] bg-stone px-3 py-2 text-[11px] leading-4 text-graphite">The secondary column uses an independently labelled right-side scale. Use only when the two units are explicit and a shared baseline would be misleading.</p> : null}
                {settings.barVariant === "overlay" ? <p className="rounded-[8px] bg-stone px-3 py-2 text-[11px] leading-4 text-graphite">The secondary column shares the primary value axis and should use the same unit.</p> : null}
                {settings.barVariant === "axis-break" ? <><RangeControl label="Break start" value={settings.axisBreakStart} minimum={barBreakRange.minimum} maximum={barBreakRange.maximum} step={barBreakRange.step} onChange={(value) => updateSetting("axisBreakStart", value)} /><RangeControl label="Break end" value={settings.axisBreakEnd} minimum={barBreakRange.minimum} maximum={barBreakRange.maximum} step={barBreakRange.step} onChange={(value) => updateSetting("axisBreakEnd", value)} /></> : null}
                {settings.barVariant !== "polar" ? <ToggleControl label="Significance annotations" checked={settings.showSignificance} onChange={(value) => updateSetting("showSignificance", value)} /> : null}
                {settings.showSignificance && settings.barVariant !== "polar" ? <RangeControl label="P-value threshold" value={settings.significanceThreshold} minimum={0.001} maximum={0.1} step={0.001} onChange={(value) => updateSetting("significanceThreshold", value)} /> : null}
              </ControlGroup>
              {settings.barVariant !== "polar" ? <ControlGroup title="Bar appearance"><RangeControl label="Border width" value={settings.barBorderWidth} minimum={0} maximum={3} step={0.1} unit=" px" onChange={(value) => updateSetting("barBorderWidth", value)} />{settings.barBorderWidth > 0 ? <ColorControl label="Border color" value={settings.barBorderColor} onChange={(value) => updateSetting("barBorderColor", value)} /> : null}<p className="text-[11px] leading-4 text-muted">Set the width to 0 for borderless bars. The outline remains fully opaque so it stays legible when fill opacity is reduced.</p></ControlGroup> : null}
            </> : null}

            {plotType === "box" ? <ControlGroup title="Box & summary">
              <ToggleControl label="Show box & whiskers" checked={settings.showBox} onChange={(value) => updateSetting("showBox", value)} />
              <SelectControl label="Summary error bar" value={settings.boxErrorType} onChange={(value) => updateSetting("boxErrorType", value as VisualizationSettings["boxErrorType"])}><option value="none">None</option><option value="sd">Mean ± SD</option><option value="sem">Mean ± SEM</option></SelectControl>
              {settings.boxErrorType !== "none" ? <><RangeControl label="Error line" value={settings.errorBarLineWidth} minimum={0.8} maximum={3} step={0.1} unit=" px" onChange={(value) => updateSetting("errorBarLineWidth", value)} /><RangeControl label="Cap width" value={settings.errorBarCapSize} minimum={4} maximum={30} step={1} unit=" px" onChange={(value) => updateSetting("errorBarCapSize", value)} /><p className="rounded-[8px] bg-stone px-3 py-2 text-[11px] leading-4 text-graphite">Calculated from the raw observations in each group. SD uses the sample estimate (n−1); SEM = SD / √n. The open center marker denotes the mean.</p></> : <p className="text-[11px] leading-4 text-muted">Turn off the box layer to show raw points only, or add a mean ± SD/SEM summary bar.</p>}
            </ControlGroup> : null}

            {plotType === "violin" || plotType === "raincloud" ? <ControlGroup title={`${plotType === "violin" ? "Violin" : "Raincloud"} density`}><RangeControl label="Bandwidth" value={settings.violinBandwidth} minimum={0.5} maximum={2.5} step={0.05} unit="×" onChange={(value) => updateSetting("violinBandwidth", value)} />{plotType === "violin" ? <RangeControl label="Body width" value={settings.violinWidth} minimum={0.18} maximum={0.46} step={0.01} onChange={(value) => updateSetting("violinWidth", value)} /> : null}<p className="text-[11px] leading-4 text-muted">Higher bandwidth produces a smoother density; the raw observations remain available as a separate layer.</p></ControlGroup> : null}

            {plotType === "volcano" || plotType === "ma" ? <ControlGroup title={`${plotType === "volcano" ? "Volcano" : "MA"} thresholds`}><RangeControl label="|log₂FC| threshold" value={settings.foldChangeThreshold} minimum={0} maximum={5} step={0.1} onChange={(value) => updateSetting("foldChangeThreshold", value)} /><RangeControl label="Adjusted P threshold" value={settings.pValueThreshold} minimum={0.001} maximum={0.1} step={0.001} onChange={(value) => updateSetting("pValueThreshold", value)} /><RangeControl label="Maximum labels" value={settings.labelLimit} minimum={0} maximum={30} onChange={(value) => updateSetting("labelLimit", value)} /></ControlGroup> : null}
            {plotType === "correlation" || plotType === "correlation-heatmap" ? <ControlGroup title="Correlation"><SelectControl label="Method" value={settings.correlationMethod} onChange={(value) => updateSetting("correlationMethod", value as VisualizationSettings["correlationMethod"])}><option value="pearson">Pearson</option><option value="spearman">Spearman</option></SelectControl><p className="rounded-[8px] bg-stone px-3 py-2 text-[11px] leading-4 text-graphite">The coefficient is calculated from the mapped values. The tool reports r/ρ and n but does not fabricate an inferential P value.</p></ControlGroup> : null}
            {plotType === "quadrant" ? <ControlGroup title="Quadrant thresholds"><RangeControl label="X threshold" value={settings.xThreshold} minimum={-10} maximum={10} step={0.1} onChange={(value) => updateSetting("xThreshold", value)} /><RangeControl label="Y threshold" value={settings.yThreshold} minimum={-10} maximum={10} step={0.1} onChange={(value) => updateSetting("yThreshold", value)} /></ControlGroup> : null}
            {plotType === "errorbar" ? <ControlGroup title="Error bars"><RangeControl label="Error line" value={settings.errorBarLineWidth} minimum={0.8} maximum={3} step={0.1} unit=" px" onChange={(value) => updateSetting("errorBarLineWidth", value)} /><RangeControl label="Cap width" value={settings.errorBarCapSize} minimum={4} maximum={30} step={1} unit=" px" onChange={(value) => updateSetting("errorBarCapSize", value)} /><p className="rounded-[8px] bg-stone px-3 py-2 text-[11px] leading-4 text-graphite">The mapped error column must already contain SD or SEM. Record which statistic you used in the title, axis, caption, or exported config.</p></ControlGroup> : null}
            {(["heatmap", "clustered-heatmap", "correlation-heatmap"] as PlotType[]).includes(plotType) ? <ControlGroup title="Heatmap">{plotType !== "correlation-heatmap" ? <SelectControl label="Scaling" value={settings.heatmapScale} onChange={(value) => updateSetting("heatmapScale", value as VisualizationSettings["heatmapScale"])}><option value="row">Row z-score</option><option value="none">Raw values</option></SelectControl> : null}{plotType !== "heatmap" ? <><ToggleControl label="Cluster rows" checked={settings.clusterRows} onChange={(value) => updateSetting("clusterRows", value)} /><ToggleControl label="Cluster columns" checked={settings.clusterColumns} onChange={(value) => updateSetting("clusterColumns", value)} /><p className="text-[11px] leading-4 text-muted">Deterministic Euclidean average-linkage ordering is used for the preview.</p></> : null}</ControlGroup> : null}
            {plotType === "km" ? <ControlGroup title="Survival"><ToggleControl label="Show numbers at risk" checked={settings.showRiskTable} onChange={(value) => updateSetting("showRiskTable", value)} /><p className="rounded-[8px] bg-stone px-3 py-2 text-[11px] leading-4 text-graphite">Kaplan–Meier estimates and censor marks are calculated from individual records. A log-rank P value is intentionally omitted until a tested inferential module is added.</p></ControlGroup> : null}
            {plotType === "survival-forest" ? <ControlGroup title="Forest reference"><RangeControl label="Null reference" value={settings.forestReferenceValue} minimum={0} maximum={5} step={0.1} onChange={(value) => updateSetting("forestReferenceValue", value)} /><p className="text-[11px] leading-4 text-muted">Use 1 for ratios such as HR/OR and 0 for additive coefficients.</p></ControlGroup> : null}

            {(["pie", "donut", "waffle", "treemap", "sunburst"] as PlotType[]).includes(plotType) ? <ControlGroup title="Labels & composition">
              <SelectControl label="Value labels" value={settings.compositionLabelMode} onChange={(value) => updateSetting("compositionLabelMode", value as VisualizationSettings["compositionLabelMode"])}><option value="percent">Percent</option><option value="value">Value</option><option value="both">Value + percent</option><option value="none">Hidden</option></SelectControl>
              {plotType === "donut" ? <RangeControl label="Center hole" value={settings.donutHole} minimum={0.32} maximum={0.72} step={0.02} onChange={(value) => updateSetting("donutHole", value)} /> : null}
              {plotType === "waffle" ? <RangeControl label="Grid units" value={settings.waffleCells} minimum={25} maximum={225} step={25} onChange={(value) => updateSetting("waffleCells", value)} /> : null}
              {plotType === "treemap" || plotType === "sunburst" ? <RangeControl label="Hierarchy gap" value={settings.hierarchyGap} minimum={0} maximum={8} step={0.5} unit=" px" onChange={(value) => updateSetting("hierarchyGap", value)} /> : null}
              <p className="text-[11px] leading-4 text-muted">Percentages are calculated from the currently mapped non-negative values. Exported labels retain the underlying total.</p>
            </ControlGroup> : null}

            {plotType === "rose" ? <ControlGroup title="Rose labels">
              <SelectControl label="Sector labels" value={settings.compositionLabelMode === "none" ? "none" : "value"} onChange={(value) => updateSetting("compositionLabelMode", value as "value" | "none")}><option value="value">Category + value</option><option value="none">Hidden</option></SelectControl>
              <p className="text-[11px] leading-4 text-muted">Rose sector area is proportional to magnitude, with radius scaled by the square root of the value. Values are not normalized to percentages.</p>
            </ControlGroup> : null}

            {(["rose", "radar", "polar-profile"] as PlotType[]).includes(plotType) ? <ControlGroup title="Radial scale">
              <OptionalNumberControl label="Radial maximum" value={settings.radialMaximum} invalid={settings.radialMaximum !== null && settings.radialMaximum <= 0} onChange={(value) => updateSetting("radialMaximum", value)} />
              {plotType === "radar" || plotType === "polar-profile" ? <RangeControl label="Profile fill" value={settings.radarFillOpacity} minimum={0} maximum={0.5} step={0.02} onChange={(value) => updateSetting("radarFillOpacity", value)} /> : null}
              <p className="text-[11px] leading-4 text-muted">Auto uses a padded maximum from the mapped values. A manual maximum must be positive and may clip larger values.</p>
            </ControlGroup> : null}

            {plotType === "population-pyramid" ? <ControlGroup title="Population pyramid scale">
              <SelectControl label="Display values" value={settings.pyramidDisplayMode} onChange={(value) => updateSetting("pyramidDisplayMode", value as VisualizationSettings["pyramidDisplayMode"])}><option value="value">Absolute values</option><option value="percent">Within-group percent</option></SelectControl>
              <p className="text-[11px] leading-4 text-muted">Mirroring is a layout convention, not a negative measurement. Percent mode normalizes each of the two groups independently to 100%.</p>
            </ControlGroup> : null}

              <ControlGroup title="Editable colors">
                {categoryLabels.map((label, index) => <ColorControl key={`${label}-${index}`} label={`${index + 1} · ${label}`} value={settings.categoricalColors[index] ?? journalThemes[themeId].categorical[index % journalThemes[themeId].categorical.length]} onChange={(value) => updateCategoryColor(index, value)} />)}
                {plotType === "enrichment" || plotType === "enrichment-bar" ? <><ColorControl label="Sequential low" value={settings.continuousLow} onChange={(value) => updateSetting("continuousLow", value)} /><ColorControl label="Sequential high" value={settings.continuousHigh} onChange={(value) => updateSetting("continuousHigh", value)} /></> : null}
                {(["heatmap", "clustered-heatmap", "correlation-heatmap"] as PlotType[]).includes(plotType) ? <><ColorControl label="Diverging low" value={settings.divergingLow} onChange={(value) => updateSetting("divergingLow", value)} /><ColorControl label="Midpoint" value={settings.divergingMid} onChange={(value) => updateSetting("divergingMid", value)} /><ColorControl label="Diverging high" value={settings.divergingHigh} onChange={(value) => updateSetting("divergingHigh", value)} /></> : null}
              </ControlGroup>
            </CardBody>
          </Card>

          <aside data-plot-guidance={plotType} aria-live="polite" className="rounded-[var(--ln-vis-panel-radius)] border border-moss/20 bg-sage-surface/70 p-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-ink"><Lightbulb className="h-3.5 w-3.5 text-moss" aria-hidden />图形定义与适用场景</div>
            <div className="mt-2 space-y-2 text-[11px] leading-[1.55] text-graphite">
              <p><span className="font-semibold text-ink">基本定义：</span>{guidance.definition}</p>
              <p><span className="font-semibold text-ink">适合的数据：</span>{guidance.suitableData}</p>
              <p><span className="font-semibold text-ink">适合说明的问题：</span>{guidance.answers}</p>
              {guidance.origin ? (
                <details data-plot-origin={plotType} className="border-t border-moss/20 pt-2">
                  <summary className="focus-ring cursor-pointer rounded text-[11px] font-semibold text-ink">方法由来</summary>
                  <p className="mt-2 text-[10px] leading-[1.55] text-graphite">{guidance.origin}</p>
                </details>
              ) : null}
              <details data-plot-references={plotType} className="border-t border-moss/20 pt-2">
                <summary className="focus-ring cursor-pointer rounded text-[11px] font-semibold text-ink">方法学参考文献（{guidance.references.length}）</summary>
                <ul className="mt-2 space-y-2">
                  {guidance.references.map((reference) => (
                    <li key={reference.href}>
                      <a className="group flex items-start gap-1.5 text-[10px] leading-[1.5] text-graphite underline decoration-moss/35 underline-offset-2 hover:text-ink hover:decoration-moss" href={reference.href} target="_blank" rel="noreferrer">
                        <span>{reference.citation}</span>
                        <ExternalLink className="mt-0.5 h-3 w-3 shrink-0 text-moss" aria-hidden />
                      </a>
                    </li>
                  ))}
                </ul>
              </details>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
