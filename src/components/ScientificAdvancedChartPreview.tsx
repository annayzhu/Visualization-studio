"use client";

import type { ReactNode, RefObject } from "react";
import {
  buildSetMemberships,
  correlation,
  correlationMatrix,
  hierarchicalClusterOrder,
  kaplanMeier,
  matrixFromRows,
  rocCurve,
  upsetVerticalLayout,
  vennRegionLayout,
} from "@/lib/visualization-advanced";
import {
  boxStatistics,
  confidenceInterval95,
  deterministicBeeswarmLayout,
  deterministicHistogram,
  divergingColor,
  figureFontPresets,
  formatTick,
  getPlotDefinition,
  interpolateColor,
  journalThemes,
  kernelDensityEstimate,
  linearRegression,
  meanErrorStatistics,
  numericExtent,
  parseNumericValue,
  parseRatioValue,
  resolveAxisDomain,
  scaleLinear,
  type JournalThemeId,
  type ParsedDataset,
  type PlotType,
  type VisualizationSettings,
} from "@/lib/visualization-studio";

type Props = {
  svgRef: RefObject<SVGSVGElement | null>;
  type: PlotType;
  dataset: ParsedDataset;
  mapping: Record<string, string>;
  settings: VisualizationSettings;
  themeId: JournalThemeId;
};

type Frame = { width: number; height: number; left: number; right: number; top: number; bottom: number; plotWidth: number; plotHeight: number };
type LegendEntry = { label: string; color: string };
const TEXT = "#23242A";

function frameFor(type: PlotType, settings: VisualizationSettings): Frame {
  const noAxes = ["venn", "sankey", "chord", "circos", "pie", "donut", "rose", "waffle", "treemap", "sunburst", "radar", "polar-profile", "population-pyramid"].includes(type);
  const labelHeavy = ["enrichment-bar", "survival-forest", "upset"].includes(type);
  const hasLegend = !["box", "violin", "beeswarm", "raincloud", "histogram", "density", "ridge", "clustered-heatmap", "correlation-heatmap", "venn", "upset", "sankey", "chord", "circos", "treemap"].includes(type);
  const compactRadialLegend = ["pie", "donut", "rose", "waffle", "sunburst", "radar", "polar-profile", "population-pyramid"].includes(type);
  const legend = hasLegend && settings.legendPosition === "right" ? (compactRadialLegend ? 110 : 145) : 0;
  const left = noAxes ? 14 : labelHeavy ? Math.min(178, settings.width * 0.32) : 66;
  const top = settings.title ? 48 : 24;
  const bottom = hasLegend && settings.legendPosition === "bottom" ? 80 : 58;
  const right = 22 + legend;
  return { width: settings.width, height: settings.height, left, right, top, bottom, plotWidth: Math.max(100, settings.width - left - right), plotHeight: Math.max(90, settings.height - top - bottom) };
}

function palette(groups: string[], colors: string[]) {
  return new Map(groups.map((group, index) => [group, colors[index % Math.max(1, colors.length)]]));
}

function tickValues(domain: [number, number], count = 5) {
  return Array.from({ length: count }, (_, index) => domain[0] + (domain[1] - domain[0]) * index / Math.max(1, count - 1));
}

function Axes({ frame, settings, xDomain, yDomain, xLabel, yLabel, gridColor, hideXTicks = false, hideYTicks = false, categoryXPositions, categoryYPositions }: { frame: Frame; settings: VisualizationSettings; xDomain: [number, number]; yDomain: [number, number]; xLabel: string; yLabel: string; gridColor: string; hideXTicks?: boolean; hideYTicks?: boolean; categoryXPositions?: number[]; categoryYPositions?: number[] }) {
  const bottom = frame.top + frame.plotHeight;
  const xTicks = tickValues(xDomain, Math.max(3, Math.min(6, Math.floor(frame.plotWidth / 90))));
  const yTicks = tickValues(yDomain, Math.max(3, Math.min(6, Math.floor(frame.plotHeight / 70))));
  const verticalGridPositions = categoryXPositions
    ?? (hideXTicks ? [] : xTicks.map((value) => scaleLinear(value, xDomain, [frame.left, frame.left + frame.plotWidth])));
  const horizontalGridPositions = categoryYPositions
    ?? (hideYTicks ? [] : yTicks.map((value) => scaleLinear(value, yDomain, [bottom, frame.top])));
  return <g>
    {settings.grid === "both" ? verticalGridPositions.map((x) => <line key={`gx-${x}`} data-grid-axis="x" x1={x} x2={x} y1={frame.top} y2={bottom} stroke={gridColor} strokeWidth={settings.gridLineWidth} />) : null}
    {settings.grid !== "none" ? horizontalGridPositions.map((y) => <line key={`gy-${y}`} data-grid-axis="y" x1={frame.left} x2={frame.left + frame.plotWidth} y1={y} y2={y} stroke={gridColor} strokeWidth={settings.gridLineWidth} />) : null}
    <line x1={frame.left} x2={frame.left + frame.plotWidth} y1={bottom} y2={bottom} stroke={TEXT} strokeWidth={settings.axisLineWidth} />
    <line x1={frame.left} x2={frame.left} y1={frame.top} y2={bottom} stroke={TEXT} strokeWidth={settings.axisLineWidth} />
    {!hideXTicks ? xTicks.map((value) => { const x = scaleLinear(value, xDomain, [frame.left, frame.left + frame.plotWidth]); return <g key={`xt-${value}`}><line x1={x} x2={x} y1={bottom} y2={bottom + 5} stroke={TEXT} strokeWidth={settings.axisLineWidth} /><text x={x} y={bottom + 19} textAnchor="middle" fill={TEXT} fontSize={settings.tickSize}>{formatTick(value)}</text></g>; }) : null}
    {!hideYTicks ? yTicks.map((value) => { const y = scaleLinear(value, yDomain, [bottom, frame.top]); return <g key={`yt-${value}`}><line x1={frame.left - 5} x2={frame.left} y1={y} y2={y} stroke={TEXT} strokeWidth={settings.axisLineWidth} /><text x={frame.left - 9} y={y + 4} textAnchor="end" fill={TEXT} fontSize={settings.tickSize}>{formatTick(value)}</text></g>; }) : null}
    {xLabel ? <text x={frame.left + frame.plotWidth / 2} y={frame.height - (settings.legendPosition === "bottom" ? 47 : 13)} textAnchor="middle" fill={TEXT} fontSize={settings.axisLabelSize} fontWeight={600}>{xLabel}</text> : null}
    {yLabel ? <text transform={`translate(18 ${frame.top + frame.plotHeight / 2}) rotate(-90)`} textAnchor="middle" fill={TEXT} fontSize={settings.axisLabelSize} fontWeight={600}>{yLabel}</text> : null}
  </g>;
}

function Legend({ entries, frame, settings }: { entries: LegendEntry[]; frame: Frame; settings: VisualizationSettings }) {
  if (settings.legendPosition === "none" || entries.length < 2) return null;
  if (settings.legendPosition === "bottom") {
    const visible = entries.slice(0, 12);
    const perRow = Math.max(2, Math.min(4, Math.floor(frame.plotWidth / 90)));
    const cellWidth = frame.plotWidth / perRow;
    return <g transform={`translate(${frame.left} ${frame.height - 72})`}>{visible.map((entry, index) => <g key={entry.label} transform={`translate(${(index % perRow) * cellWidth} ${Math.floor(index / perRow) * (settings.legendSize + 7)})`}><circle cx={4} cy={-4} r={4} fill={entry.color} /><text x={13} y={0} fill={TEXT} fontSize={settings.legendSize}>{entry.label.slice(0, 15)}</text></g>)}</g>;
  }
  return <g transform={`translate(${frame.left + frame.plotWidth + 18} ${frame.top + 5})`}>{entries.slice(0, 12).map((entry, index) => <g key={entry.label} transform={`translate(0 ${index * (settings.legendSize + 10)})`}><circle cx={4} cy={-4} r={4} fill={entry.color} /><text x={13} y={0} fill={TEXT} fontSize={settings.legendSize}>{entry.label.slice(0, 24)}</text></g>)}</g>;
}

function ScatterFamily({ type, frame, dataset, mapping, settings, colors, gridColor }: Omit<Props, "svgRef" | "themeId"> & { frame: Frame; colors: string[]; gridColor: string }) {
  const points = dataset.rows.map((row, index) => ({
    x: parseNumericValue(row[mapping.x]) ?? 0,
    y: parseNumericValue(row[mapping.y]) ?? 0,
    group: mapping.group ? row[mapping.group] || "All" : "All",
    label: mapping.label ? row[mapping.label] || "" : "",
    index,
  }));
  const xDomain = resolveAxisDomain(numericExtent([...points.map((point) => point.x), ...(type === "quadrant" ? [settings.xThreshold] : [])]), settings.xMin, settings.xMax);
  const yDomain = resolveAxisDomain(numericExtent([...points.map((point) => point.y), ...(type === "quadrant" ? [settings.yThreshold] : [])]), settings.yMin, settings.yMax);
  const groups = [...new Set(points.map((point) => point.group))];
  const colorMap = palette(groups, colors);
  const xAt = (value: number) => scaleLinear(value, xDomain, [frame.left, frame.left + frame.plotWidth]);
  const yAt = (value: number) => scaleLinear(value, yDomain, [frame.top + frame.plotHeight, frame.top]);
  const fit = linearRegression(points);
  const coefficient = correlation(points.map((point) => point.x), points.map((point) => point.y), settings.correlationMethod);
  const xLabel = settings.xLabel || (type === "pcoa" ? "PCoA 1" : type === "umap" ? "UMAP 1" : "X");
  const yLabel = settings.yLabel || (type === "pcoa" ? "PCoA 2" : type === "umap" ? "UMAP 2" : "Y");
  return <>
    <Axes frame={frame} settings={settings} xDomain={xDomain} yDomain={yDomain} xLabel={xLabel} yLabel={yLabel} gridColor={gridColor} />
    <g data-plot-data>
    {type === "quadrant" ? <><line x1={xAt(settings.xThreshold)} x2={xAt(settings.xThreshold)} y1={frame.top} y2={frame.top + frame.plotHeight} stroke={TEXT} strokeDasharray="5 4" opacity={0.65} /><line x1={frame.left} x2={frame.left + frame.plotWidth} y1={yAt(settings.yThreshold)} y2={yAt(settings.yThreshold)} stroke={TEXT} strokeDasharray="5 4" opacity={0.65} /></> : null}
    {type === "correlation" && settings.showTrend && fit ? <line x1={xAt(xDomain[0])} y1={yAt(fit.intercept + fit.slope * xDomain[0])} x2={xAt(xDomain[1])} y2={yAt(fit.intercept + fit.slope * xDomain[1])} stroke={colors[0]} strokeWidth={settings.dataLineWidth} /> : null}
    {points.map((point) => { const x = xAt(point.x); const y = yAt(point.y); const rightHalf = point.x > (xDomain[0] + xDomain[1]) / 2; const upperHalf = point.y > (yDomain[0] + yDomain[1]) / 2; return <g key={point.index}><circle cx={x} cy={y} r={settings.pointSize} fill={colorMap.get(point.group)} fillOpacity={settings.opacity} stroke="#FFFFFF" strokeWidth={0.7} />{settings.showLabels && point.label ? <text data-plot-label x={rightHalf ? x - settings.pointSize - 2 : x + settings.pointSize + 2} y={upperHalf ? y + settings.tickSize + 2 + (point.index % 2) * 3 : y - 3 - (point.index % 2) * 3} textAnchor={rightHalf ? "end" : "start"} fill={TEXT} fontSize={settings.tickSize}>{point.label}</text> : null}</g>; })}
    </g>
    {type === "correlation" ? <text x={frame.left + 10} y={frame.top + 18} fill={TEXT} fontSize={settings.legendSize} fontWeight={700}>{settings.correlationMethod === "pearson" ? "Pearson r" : "Spearman ρ"} = {coefficient.toFixed(3)} · n = {points.length}</text> : null}
    <Legend entries={groups.map((group) => ({ label: group, color: colorMap.get(group) ?? colors[0] }))} frame={frame} settings={settings} />
  </>;
}

function MaPlot({ frame, dataset, mapping, settings, colors, gridColor }: { frame: Frame; dataset: ParsedDataset; mapping: Record<string, string>; settings: VisualizationSettings; colors: string[]; gridColor: string }) {
  const rows = dataset.rows.map((row, index) => ({ index, label: row[mapping.label], x: Math.log10(Math.max(parseNumericValue(row[mapping.mean]) ?? 1, Number.MIN_VALUE)), effect: parseNumericValue(row[mapping.effect]) ?? 0, p: parseNumericValue(row[mapping.pValue]) ?? 1 }));
  const xDomain = resolveAxisDomain(numericExtent(rows.map((row) => row.x)), settings.xMin, settings.xMax);
  const yDomain = resolveAxisDomain(numericExtent([...rows.map((row) => row.effect), -settings.foldChangeThreshold, settings.foldChangeThreshold]), settings.yMin, settings.yMax);
  const xAt = (value: number) => scaleLinear(value, xDomain, [frame.left, frame.left + frame.plotWidth]);
  const yAt = (value: number) => scaleLinear(value, yDomain, [frame.top + frame.plotHeight, frame.top]);
  const labels = new Set(rows.filter((row) => row.p <= settings.pValueThreshold && Math.abs(row.effect) >= settings.foldChangeThreshold).sort((a, b) => a.p - b.p).slice(0, settings.labelLimit).map((row) => row.index));
  return <>
    <Axes frame={frame} settings={settings} xDomain={xDomain} yDomain={yDomain} xLabel={settings.xLabel || "log₁₀ mean expression"} yLabel={settings.yLabel || "log₂ fold change"} gridColor={gridColor} />
    <g data-plot-data>
    <line x1={frame.left} x2={frame.left + frame.plotWidth} y1={yAt(0)} y2={yAt(0)} stroke={TEXT} strokeDasharray="4 4" />
    {rows.map((row) => { const up = row.p <= settings.pValueThreshold && row.effect >= settings.foldChangeThreshold; const down = row.p <= settings.pValueThreshold && row.effect <= -settings.foldChangeThreshold; const color = up ? colors[1] ?? colors[0] : down ? colors[0] : "#B7B8BC"; const x = xAt(row.x); const y = yAt(row.effect); const rightHalf = row.x > (xDomain[0] + xDomain[1]) / 2; const upperHalf = row.effect > (yDomain[0] + yDomain[1]) / 2; return <g key={row.index}><circle cx={x} cy={y} r={settings.pointSize * 0.75} fill={color} fillOpacity={settings.opacity} />{labels.has(row.index) ? <text data-plot-label x={rightHalf ? x - 4 : x + 4} y={upperHalf ? y + settings.tickSize + 2 + (row.index % 2) * 3 : y - 4 - (row.index % 2) * 3} textAnchor={rightHalf ? "end" : "start"} fill={TEXT} fontSize={settings.tickSize}>{row.label}</text> : null}</g>; })}
    </g>
    <Legend entries={[{ label: "Down", color: colors[0] }, { label: "Up", color: colors[1] ?? colors[0] }, { label: "Not significant", color: "#B7B8BC" }]} frame={frame} settings={settings} />
  </>;
}

function ErrorBarPlot({ frame, dataset, mapping, settings, colors, gridColor }: { frame: Frame; dataset: ParsedDataset; mapping: Record<string, string>; settings: VisualizationSettings; colors: string[]; gridColor: string }) {
  const rows = dataset.rows.map((row) => ({ category: row[mapping.category], value: parseNumericValue(row[mapping.value]) ?? 0, error: Math.max(0, parseNumericValue(row[mapping.error]) ?? 0), group: mapping.group ? row[mapping.group] || "All" : "All" }));
  const yDomain = resolveAxisDomain(numericExtent(rows.flatMap((row) => [row.value - row.error, row.value + row.error]), true), settings.yMin, settings.yMax);
  const band = frame.plotWidth / Math.max(1, rows.length);
  const groups = [...new Set(rows.map((row) => row.group))];
  const colorMap = palette(groups, colors);
  const yAt = (value: number) => scaleLinear(value, yDomain, [frame.top + frame.plotHeight, frame.top]);
  const categoryPositions = rows.map((_, index) => frame.left + band * (index + 0.5));
  return <>
    <Axes frame={frame} settings={settings} xDomain={[0, rows.length]} yDomain={yDomain} xLabel={settings.xLabel} yLabel={settings.yLabel || "Mean ± error"} gridColor={gridColor} hideXTicks categoryXPositions={categoryPositions} />
    <g data-plot-data>
    {rows.map((row, index) => { const x = frame.left + band * (index + 0.5); const low = yAt(row.value - row.error); const high = yAt(row.value + row.error); const color = colorMap.get(row.group) ?? colors[0]; return <g key={`${row.category}-${index}`}><line x1={x} x2={x} y1={low} y2={high} stroke={color} strokeWidth={settings.errorBarLineWidth} /><line x1={x - settings.errorBarCapSize / 2} x2={x + settings.errorBarCapSize / 2} y1={low} y2={low} stroke={color} strokeWidth={settings.errorBarLineWidth} /><line x1={x - settings.errorBarCapSize / 2} x2={x + settings.errorBarCapSize / 2} y1={high} y2={high} stroke={color} strokeWidth={settings.errorBarLineWidth} /><circle cx={x} cy={yAt(row.value)} r={settings.pointSize} fill="#FFFFFF" stroke={color} strokeWidth={settings.dataLineWidth} /><text x={x} y={frame.top + frame.plotHeight + 19} textAnchor="middle" fill={TEXT} fontSize={settings.tickSize} transform={`rotate(-28 ${x} ${frame.top + frame.plotHeight + 19})`}>{row.category.slice(0, 16)}</text></g>; })}
    </g>
    <Legend entries={groups.map((group) => ({ label: group, color: colorMap.get(group) ?? colors[0] }))} frame={frame} settings={settings} />
  </>;
}

function AreaPlot({ frame, dataset, mapping, settings, colors, gridColor }: { frame: Frame; dataset: ParsedDataset; mapping: Record<string, string>; settings: VisualizationSettings; colors: string[]; gridColor: string }) {
  const rows = dataset.rows.map((row) => ({ x: parseNumericValue(row[mapping.x]) ?? 0, y: parseNumericValue(row[mapping.value]) ?? 0, group: mapping.series ? row[mapping.series] || "All" : "All" }));
  const xDomain = resolveAxisDomain(numericExtent(rows.map((row) => row.x)), settings.xMin, settings.xMax);
  const yDomain = resolveAxisDomain(numericExtent([...rows.map((row) => row.y), 0], true), settings.yMin, settings.yMax);
  const groups = [...new Set(rows.map((row) => row.group))];
  const colorMap = palette(groups, colors);
  const xAt = (value: number) => scaleLinear(value, xDomain, [frame.left, frame.left + frame.plotWidth]);
  const yAt = (value: number) => scaleLinear(value, yDomain, [frame.top + frame.plotHeight, frame.top]);
  return <>
    <Axes frame={frame} settings={settings} xDomain={xDomain} yDomain={yDomain} xLabel={settings.xLabel || "X"} yLabel={settings.yLabel || "Value"} gridColor={gridColor} />
    <g data-plot-data>
    {groups.map((group) => { const points = rows.filter((row) => row.group === group).sort((a, b) => a.x - b.x); const line = points.map((point) => `${xAt(point.x)},${yAt(point.y)}`).join(" "); const area = `${xAt(points[0]?.x ?? 0)},${yAt(0)} ${line} ${xAt(points.at(-1)?.x ?? 0)},${yAt(0)}`; const color = colorMap.get(group) ?? colors[0]; return <g key={group}><polygon points={area} fill={color} fillOpacity={settings.opacity * 0.28} /><polyline points={line} fill="none" stroke={color} strokeWidth={settings.dataLineWidth} strokeLinejoin="round" />{points.map((point, index) => <circle key={index} cx={xAt(point.x)} cy={yAt(point.y)} r={settings.pointSize * 0.65} fill={color} />)}</g>; })}
    </g>
    <Legend entries={groups.map((group) => ({ label: group, color: colorMap.get(group) ?? colors[0] }))} frame={frame} settings={settings} />
  </>;
}

function LollipopPlot({ frame, dataset, mapping, settings, colors, gridColor }: { frame: Frame; dataset: ParsedDataset; mapping: Record<string, string>; settings: VisualizationSettings; colors: string[]; gridColor: string }) {
  const rows = dataset.rows.map((row) => ({ category: row[mapping.category], value: parseNumericValue(row[mapping.value]) ?? 0, group: mapping.group ? row[mapping.group] || "All" : "All" }));
  const yDomain = resolveAxisDomain(numericExtent([...rows.map((row) => row.value), 0], true), settings.yMin, settings.yMax);
  const groups = [...new Set(rows.map((row) => row.group))];
  const colorMap = palette(groups, colors);
  const band = frame.plotWidth / Math.max(1, rows.length);
  const yAt = (value: number) => scaleLinear(value, yDomain, [frame.top + frame.plotHeight, frame.top]);
  const categoryPositions = rows.map((_, index) => frame.left + band * (index + 0.5));
  return <>
    <Axes frame={frame} settings={settings} xDomain={[0, rows.length]} yDomain={yDomain} xLabel={settings.xLabel} yLabel={settings.yLabel || "Value"} gridColor={gridColor} hideXTicks categoryXPositions={categoryPositions} />
    <g data-plot-data>
    {rows.map((row, index) => { const x = frame.left + band * (index + 0.5); const color = colorMap.get(row.group) ?? colors[0]; return <g key={`${row.category}-${index}`}><line x1={x} x2={x} y1={yAt(0)} y2={yAt(row.value)} stroke={color} strokeWidth={settings.dataLineWidth} /><circle cx={x} cy={yAt(row.value)} r={settings.pointSize + 1} fill={color} fillOpacity={settings.opacity} /><text x={x} y={frame.top + frame.plotHeight + 19} textAnchor="end" fill={TEXT} fontSize={settings.tickSize} transform={`rotate(-35 ${x} ${frame.top + frame.plotHeight + 19})`}>{row.category.slice(0, 18)}</text></g>; })}
    </g>
    <Legend entries={groups.map((group) => ({ label: group, color: colorMap.get(group) ?? colors[0] }))} frame={frame} settings={settings} />
  </>;
}

type DistributionPlotType = "box" | "violin" | "beeswarm" | "raincloud" | "histogram" | "density" | "ridge";

function DistributionPlot({ type, frame, dataset, mapping, settings, colors, gridColor }: { type: DistributionPlotType; frame: Frame; dataset: ParsedDataset; mapping: Record<string, string>; settings: VisualizationSettings; colors: string[]; gridColor: string }) {
  const facetFor = (row: Record<string, string>) => mapping.facet ? row[mapping.facet] || "All" : "All";
  const facets = [...new Set(dataset.rows.map(facetFor))];
  const lanes = facets.flatMap((facet) => [...new Set(dataset.rows.filter((row) => facetFor(row) === facet).map((row) => row[mapping.group] || "All"))].map((group) => ({
    facet,
    group,
    key: `${facet}\u0000${group}`,
    rows: dataset.rows.filter((row) => facetFor(row) === facet && (row[mapping.group] || "All") === group),
  }))).map((lane) => ({ ...lane, values: lane.rows.flatMap((row) => { const value = parseNumericValue(row[mapping.value]); return value === null ? [] : [value]; }) }));
  const rawValues = lanes.flatMap((lane) => lane.values);
  const rawDomain = numericExtent(rawValues);
  const rawSpan = Math.max(rawDomain[1] - rawDomain[0], 1e-9);
  const densityBoundaryDomain: [number, number] = [rawDomain[0] - rawSpan * 0.16, rawDomain[1] + rawSpan * 0.16];
  const densityCurves = new Map(lanes.map((lane) => [lane.key, kernelDensityEstimate(lane.values, densityBoundaryDomain, settings.violinBandwidth).points]));
  const histograms = new Map(lanes.map((lane) => [lane.key, deterministicHistogram(lane.values, settings.histogramBins, rawDomain)]));
  const maximumDensity = Math.max(...[...densityCurves.values()].flatMap((curve) => curve.map((point) => point.density)), 1e-9);
  const maximumBinCount = Math.max(...[...histograms.values()].flatMap((bins) => bins.map((bin) => bin.count)), 1);
  const uncertaintyExtent = settings.boxErrorType === "none" ? [] : lanes.flatMap((lane) => {
    const summary = meanErrorStatistics(lane.values);
    if (summary.n < 2) return [];
    const margin = settings.boxErrorType === "sd" ? summary.sd : settings.boxErrorType === "sem" ? summary.sem : confidenceInterval95(lane.values).margin;
    return [summary.mean - margin, summary.mean + margin];
  });
  const densityExtent = settings.showDensity ? [...densityCurves.values()].flatMap((curve) => curve.map((point) => point.position)) : [];
  const automaticDomain = numericExtent([...rawValues, ...uncertaintyExtent, ...densityExtent]);
  const horizontal = settings.distributionOrientation === "horizontal";
  const valueDomain = horizontal ? resolveAxisDomain(automaticDomain, settings.xMin, settings.xMax) : resolveAxisDomain(automaticDomain, settings.yMin, settings.yMax);
  const laneRange: [number, number] = horizontal ? [frame.top, frame.top + frame.plotHeight] : [frame.left, frame.left + frame.plotWidth];
  const band = Math.abs(laneRange[1] - laneRange[0]) / Math.max(1, lanes.length);
  const laneAt = (index: number) => laneRange[0] + band * (index + 0.5);
  const valueAt = (value: number) => horizontal ? scaleLinear(value, valueDomain, [frame.left, frame.left + frame.plotWidth]) : scaleLinear(value, valueDomain, [frame.top + frame.plotHeight, frame.top]);
  const colorMap = palette([...new Set(lanes.map((lane) => lane.group))], colors);
  const lanePositions = lanes.map((_, index) => laneAt(index));
  const axes = horizontal
    ? <Axes frame={frame} settings={settings} xDomain={valueDomain} yDomain={[0, lanes.length]} xLabel={settings.xLabel || "Value"} yLabel={settings.yLabel || "Group"} gridColor={gridColor} hideYTicks categoryYPositions={lanePositions} />
    : <Axes frame={frame} settings={settings} xDomain={[0, lanes.length]} yDomain={valueDomain} xLabel={settings.xLabel || "Group"} yLabel={settings.yLabel || "Value"} gridColor={gridColor} hideXTicks categoryXPositions={lanePositions} />;
  const subjectPaths = settings.distributionShowPairedLines && mapping.subject ? [...new Set(dataset.rows.map((row) => row[mapping.subject]).filter(Boolean))].flatMap((subject) => facets.map((facet) => {
    const points = lanes.map((lane, index) => {
      if (lane.facet !== facet) return null;
      const row = lane.rows.find((entry) => entry[mapping.subject] === subject); const value = parseNumericValue(row?.[mapping.value]);
      return value === null ? null : horizontal ? [valueAt(value), laneAt(index)] : [laneAt(index), valueAt(value)];
    }).filter((point): point is number[] => Boolean(point));
    return points.length > 1 ? <polyline key={`${facet}-${subject}`} data-plot-element="paired-line" points={points.map((point) => point.join(",")).join(" ")} fill="none" stroke={TEXT} strokeWidth={Math.max(0.7, settings.dataLineWidth * 0.55)} strokeOpacity={0.28} /> : null;
  })) : [];
  const facetStarts = facets.slice(1).map((facet) => lanes.findIndex((lane) => lane.facet === facet)).filter((index) => index > 0);

  return <>
    {axes}
    <g data-plot-data data-plot-family="distribution">
      {facetStarts.map((index) => horizontal ? <line key={index} x1={frame.left} x2={frame.left + frame.plotWidth} y1={laneRange[0] + index * band} y2={laneRange[0] + index * band} stroke={gridColor} strokeWidth={1.2} /> : <line key={index} x1={laneRange[0] + index * band} x2={laneRange[0] + index * band} y1={frame.top} y2={frame.top + frame.plotHeight} stroke={gridColor} strokeWidth={1.2} />)}
      {mapping.facet ? facets.map((facet) => { const indices = lanes.map((lane, index) => lane.facet === facet ? index : -1).filter((index) => index >= 0); const first = Math.min(...indices); const last = Math.max(...indices); return horizontal ? <text key={facet} data-plot-element="facet-label" x={frame.left + 4} y={laneAt(first) - band * 0.36} fill={TEXT} fontSize={Math.max(8, settings.tickSize - 1)} fontWeight={700}>{facet.slice(0, 16)}</text> : <text key={facet} data-plot-element="facet-label" x={(laneAt(first) + laneAt(last)) / 2} y={frame.top + 10} textAnchor="middle" fill={TEXT} fontSize={Math.max(8, settings.tickSize - 1)} fontWeight={700}>{facet.slice(0, 16)}</text>; }) : null}
      {settings.distributionShowSignificance && mapping.pValue ? facets.map((facet) => { const indices = lanes.map((lane, index) => lane.facet === facet ? index : -1).filter((index) => index >= 0); const first = Math.min(...indices); const last = Math.max(...indices); const value = dataset.rows.filter((row) => facetFor(row) === facet).map((row) => parseNumericValue(row[mapping.pValue])).find((entry): entry is number => entry !== null) ?? null; if (value === null) return null; const label = value <= settings.significanceThreshold ? `p=${formatTick(value)}` : "ns"; return horizontal ? <text key={facet} data-plot-element="significance-label" x={frame.left + frame.plotWidth - 2} y={(laneAt(first) + laneAt(last)) / 2 + 3} textAnchor="end" fill={TEXT} fontSize={Math.max(8, settings.tickSize - 1)}>{label}</text> : <text key={facet} data-plot-element="significance-label" x={(laneAt(first) + laneAt(last)) / 2} y={frame.top + 24} textAnchor="middle" fill={TEXT} fontSize={Math.max(8, settings.tickSize - 1)}>{label}</text>; }) : null}
      {subjectPaths}
      {lanes.map((lane, laneIndex) => {
        const center = laneAt(laneIndex); const color = colorMap.get(lane.group) ?? colors[0]; const stats = boxStatistics(lane.values); const summary = meanErrorStatistics(lane.values);
        const curve = densityCurves.get(lane.key) ?? []; const densityWidth = band * settings.violinWidth;
        const symmetric = type !== "raincloud" && type !== "ridge";
        const densityPoints = horizontal
          ? [...curve.map((point) => `${valueAt(point.position)},${center - point.density / maximumDensity * densityWidth}`), ...(symmetric ? [...curve].reverse().map((point) => `${valueAt(point.position)},${center + point.density / maximumDensity * densityWidth}`) : [...curve].reverse().map((point) => `${valueAt(point.position)},${center}`))]
          : [...curve.map((point) => `${center + point.density / maximumDensity * densityWidth},${valueAt(point.position)}`), ...(symmetric ? [...curve].reverse().map((point) => `${center - point.density / maximumDensity * densityWidth},${valueAt(point.position)}`) : [...curve].reverse().map((point) => `${center},${valueAt(point.position)}`))];
        const bins = histograms.get(lane.key) ?? [];
        const summaryValue = settings.distributionSummary === "mean" ? summary.mean : stats.median;
        const margin = settings.boxErrorType === "sd" ? summary.sd : settings.boxErrorType === "sem" ? summary.sem : settings.boxErrorType === "ci95" ? confidenceInterval95(lane.values).margin : 0;
        const basePointRadius = Math.max(2.1, settings.pointSize * 0.62);
        const lanePointRadius = type === "beeswarm" ? Math.min(basePointRadius, Math.max(Number.EPSILON, band * 0.2)) : basePointRadius;
        const laneBoundaryGap = Math.min(0.4, band * 0.05);
        const maximumBeeswarmOffset = Math.max(0, band / 2 - lanePointRadius - laneBoundaryGap);
        const beeswarmLayout = type === "beeswarm" ? deterministicBeeswarmLayout(lane.values.map(valueAt), lanePointRadius, maximumBeeswarmOffset) : null;
        const pointRadius = beeswarmLayout?.pointRadius ?? basePointRadius;
        const pointOffsets = beeswarmLayout?.offsets ?? lane.values.map((_, index) => (((index * 37) % 17) - 8) / 8 * band * 0.22);
        return <g key={lane.key}>
          {settings.showDensity && densityPoints.length > 2 ? <polygon data-plot-element="density" data-density-scale-maximum={maximumDensity} points={densityPoints.join(" ")} fill={color} fillOpacity={settings.opacity * 0.28} stroke={color} strokeWidth={settings.dataLineWidth} /> : null}
          {settings.showHistogram ? bins.map((bin) => {
            const frequencySize = bin.count / maximumBinCount * band * 0.68;
            if (horizontal) return <rect key={bin.index} data-plot-element="histogram-bin" data-bin-count={bin.count} data-bin-scale-maximum={maximumBinCount} x={valueAt(bin.lower)} y={center - frequencySize / 2} width={Math.max(0.7, valueAt(bin.upper) - valueAt(bin.lower) - 0.6)} height={frequencySize} fill={color} fillOpacity={settings.opacity * 0.48} stroke={color} strokeWidth={0.5} />;
            return <rect key={bin.index} data-plot-element="histogram-bin" data-bin-count={bin.count} data-bin-scale-maximum={maximumBinCount} x={center - frequencySize / 2} y={valueAt(bin.upper)} width={frequencySize} height={Math.max(0.7, valueAt(bin.lower) - valueAt(bin.upper) - 0.6)} fill={color} fillOpacity={settings.opacity * 0.48} stroke={color} strokeWidth={0.5} />;
          }) : null}
          {settings.showBox ? horizontal ? <g data-plot-element="box-layer"><line x1={valueAt(stats.low)} x2={valueAt(stats.high)} y1={center} y2={center} stroke={TEXT} strokeWidth={settings.dataLineWidth} /><rect x={valueAt(stats.q1)} y={center - band * 0.13} width={Math.max(1, valueAt(stats.q3) - valueAt(stats.q1))} height={band * 0.26} fill={color} fillOpacity={0.24} stroke={color} strokeWidth={settings.dataLineWidth} /><line x1={valueAt(stats.median)} x2={valueAt(stats.median)} y1={center - band * 0.13} y2={center + band * 0.13} stroke={TEXT} strokeWidth={settings.dataLineWidth} /></g> : <g data-plot-element="box-layer"><line x1={center} x2={center} y1={valueAt(stats.low)} y2={valueAt(stats.high)} stroke={TEXT} strokeWidth={settings.dataLineWidth} /><rect x={center - band * 0.13} y={valueAt(stats.q3)} width={band * 0.26} height={Math.max(1, valueAt(stats.q1) - valueAt(stats.q3))} fill={color} fillOpacity={0.24} stroke={color} strokeWidth={settings.dataLineWidth} /><line x1={center - band * 0.13} x2={center + band * 0.13} y1={valueAt(stats.median)} y2={valueAt(stats.median)} stroke={TEXT} strokeWidth={settings.dataLineWidth} /></g> : null}
          {settings.distributionSummary !== "none" ? horizontal ? <line data-plot-element="center-summary" x1={valueAt(summaryValue)} x2={valueAt(summaryValue)} y1={center - band * 0.2} y2={center + band * 0.2} stroke={TEXT} strokeWidth={2} /> : <line data-plot-element="center-summary" x1={center - band * 0.2} x2={center + band * 0.2} y1={valueAt(summaryValue)} y2={valueAt(summaryValue)} stroke={TEXT} strokeWidth={2} /> : null}
          {settings.boxErrorType !== "none" && summary.n >= 2 ? horizontal ? <g data-plot-element="uncertainty" stroke={TEXT} strokeWidth={settings.errorBarLineWidth}><line x1={valueAt(summary.mean - margin)} x2={valueAt(summary.mean + margin)} y1={center} y2={center} /><line x1={valueAt(summary.mean - margin)} x2={valueAt(summary.mean - margin)} y1={center - settings.errorBarCapSize / 2} y2={center + settings.errorBarCapSize / 2} /><line x1={valueAt(summary.mean + margin)} x2={valueAt(summary.mean + margin)} y1={center - settings.errorBarCapSize / 2} y2={center + settings.errorBarCapSize / 2} /></g> : <g data-plot-element="uncertainty" stroke={TEXT} strokeWidth={settings.errorBarLineWidth}><line x1={center} x2={center} y1={valueAt(summary.mean - margin)} y2={valueAt(summary.mean + margin)} /><line x1={center - settings.errorBarCapSize / 2} x2={center + settings.errorBarCapSize / 2} y1={valueAt(summary.mean - margin)} y2={valueAt(summary.mean - margin)} /><line x1={center - settings.errorBarCapSize / 2} x2={center + settings.errorBarCapSize / 2} y1={valueAt(summary.mean + margin)} y2={valueAt(summary.mean + margin)} /></g> : null}
          {settings.showPoints ? lane.values.map((value, index) => <circle key={index} data-plot-element="observation" data-beeswarm-offset={type === "beeswarm" ? pointOffsets[index] : undefined} data-beeswarm-scaled={beeswarmLayout?.scaled ? "true" : undefined} cx={horizontal ? valueAt(value) : center + pointOffsets[index]} cy={horizontal ? center + pointOffsets[index] : valueAt(value)} r={pointRadius} fill={color} fillOpacity={settings.opacity} stroke="#FFFFFF" strokeWidth={Math.min(0.55, pointRadius * 0.25)} />) : null}
          {horizontal ? <><text x={frame.left - 8} y={center + 3} textAnchor="end" fill={TEXT} fontSize={settings.tickSize}>{lane.group.slice(0, 14)}</text>{settings.showSampleSize ? <text x={frame.left + frame.plotWidth - 2} y={center - 5} textAnchor="end" fill={TEXT} fontSize={Math.max(8, settings.tickSize - 1)}>n={lane.values.length}</text> : null}</> : <><text x={center} y={frame.top + frame.plotHeight + 18} textAnchor="middle" fill={TEXT} fontSize={settings.tickSize}>{lane.group.slice(0, 12)}</text>{settings.showSampleSize ? <text x={center} y={frame.top + frame.plotHeight + 33} textAnchor="middle" fill={TEXT} fontSize={Math.max(8, settings.tickSize - 1)}>n={lane.values.length}</text> : null}</>}
        </g>;
      })}
    </g>
  </>;
}

function MatrixPlot({ type, frame, dataset, settings, diverging }: { type: "clustered-heatmap" | "correlation-heatmap"; frame: Frame; dataset: ParsedDataset; settings: VisualizationSettings; diverging: [string, string, string] }) {
  const labelColumn = dataset.headers[0];
  const sourceColumns = dataset.headers.slice(1);
  const source = matrixFromRows(dataset.rows, sourceColumns);
  let rowLabels: string[];
  let columnLabels: string[];
  let matrix: number[][];
  if (type === "correlation-heatmap") {
    matrix = correlationMatrix(source, settings.correlationMethod);
    rowLabels = [...sourceColumns];
    columnLabels = [...sourceColumns];
  } else {
    matrix = settings.heatmapScale === "row" ? source.map((row) => { const avg = row.reduce((sum, value) => sum + value, 0) / row.length; const sd = Math.sqrt(row.reduce((sum, value) => sum + (value - avg) ** 2, 0) / Math.max(1, row.length - 1)) || 1; return row.map((value) => (value - avg) / sd); }) : source;
    rowLabels = dataset.rows.map((row) => row[labelColumn]);
    columnLabels = [...sourceColumns];
  }
  const rowOrder = settings.clusterRows ? hierarchicalClusterOrder(matrix) : matrix.map((_, index) => index);
  const columnVectors = columnLabels.map((_, column) => matrix.map((row) => row[column]));
  const columnOrder = settings.clusterColumns ? hierarchicalClusterOrder(columnVectors) : columnLabels.map((_, index) => index);
  if (type === "correlation-heatmap" && (settings.clusterRows || settings.clusterColumns)) {
    const shared = settings.clusterRows ? rowOrder : columnOrder;
    rowLabels = shared.map((index) => rowLabels[index]);
    columnLabels = shared.map((index) => columnLabels[index]);
    matrix = shared.map((row) => shared.map((column) => matrix[row][column]));
  } else {
    rowLabels = rowOrder.map((index) => rowLabels[index]);
    columnLabels = columnOrder.map((index) => columnLabels[index]);
    matrix = rowOrder.map((row) => columnOrder.map((column) => matrix[row][column]));
  }
  const max = type === "correlation-heatmap" ? 1 : Math.max(...matrix.flat().map(Math.abs), 1);
  const cellWidth = frame.plotWidth / Math.max(1, columnLabels.length);
  const cellHeight = frame.plotHeight / Math.max(1, rowLabels.length);
  return <g>
    {matrix.map((row, rowIndex) => row.map((value, columnIndex) => <rect key={`${rowIndex}-${columnIndex}`} x={frame.left + columnIndex * cellWidth} y={frame.top + rowIndex * cellHeight} width={cellWidth + 0.2} height={cellHeight + 0.2} fill={divergingColor(diverging[0], diverging[1], diverging[2], scaleLinear(value, [-max, max], [0, 1]))} />))}
    {rowLabels.slice(0, Math.floor(frame.plotHeight / Math.max(10, settings.tickSize + 2))).map((label, index) => <text key={label} x={frame.left - 7} y={frame.top + (index + 0.68) * cellHeight} textAnchor="end" fill={TEXT} fontSize={settings.tickSize}>{label.slice(0, 12)}</text>)}
    {columnLabels.map((label, index) => <text key={label} x={frame.left + (index + 0.5) * cellWidth} y={frame.top + frame.plotHeight + 8} textAnchor="end" fill={TEXT} fontSize={settings.tickSize} transform={`rotate(-45 ${frame.left + (index + 0.5) * cellWidth} ${frame.top + frame.plotHeight + 8})`}>{label.slice(0, 12)}</text>)}
    <rect x={frame.left} y={frame.top} width={frame.plotWidth} height={frame.plotHeight} fill="none" stroke={TEXT} strokeWidth={0.8} />
  </g>;
}

function EnrichmentBar({ frame, dataset, mapping, settings, sequential, gridColor }: { frame: Frame; dataset: ParsedDataset; mapping: Record<string, string>; settings: VisualizationSettings; sequential: [string, string]; gridColor: string }) {
  const rows = dataset.rows.map((row) => ({ term: row[mapping.term], ratio: parseRatioValue(row[mapping.ratio]) ?? 0, p: Math.max(parseNumericValue(row[mapping.pValue]) ?? 1, Number.MIN_VALUE) })).sort((a, b) => a.ratio - b.ratio);
  const domain = resolveAxisDomain(numericExtent(rows.map((row) => row.ratio), true), settings.xMin, settings.xMax);
  const significance = rows.map((row) => -Math.log10(row.p));
  const sigDomain = numericExtent(significance, true);
  const band = frame.plotHeight / Math.max(1, rows.length);
  const categoryPositions = rows.map((_, index) => frame.top + frame.plotHeight - band * (index + 0.5));
  return <>
    <Axes frame={frame} settings={settings} xDomain={domain} yDomain={[0, rows.length]} xLabel={settings.xLabel || "Gene ratio"} yLabel="" gridColor={gridColor} hideYTicks categoryYPositions={categoryPositions} />
    <g data-plot-data>
    {rows.map((row, index) => { const y = frame.top + frame.plotHeight - band * (index + 0.84); const width = scaleLinear(row.ratio, domain, [0, frame.plotWidth]); const color = interpolateColor(sequential[0], sequential[1], scaleLinear(-Math.log10(row.p), sigDomain, [0, 1])); return <g key={`${row.term}-${index}`}><rect x={frame.left} y={y} width={Math.max(0, width)} height={band * 0.68} rx={2} fill={color} fillOpacity={settings.opacity} /><text x={frame.left - 8} y={y + band * 0.47} textAnchor="end" fill={TEXT} fontSize={settings.tickSize}>{row.term.slice(0, 22)}</text></g>; })}
    </g>
  </>;
}

function GseaPlot({ frame, dataset, mapping, settings, colors, gridColor }: { frame: Frame; dataset: ParsedDataset; mapping: Record<string, string>; settings: VisualizationSettings; colors: string[]; gridColor: string }) {
  const rows = dataset.rows.map((row) => ({ rank: parseNumericValue(row[mapping.rank]) ?? 0, score: parseNumericValue(row[mapping.score]) ?? 0, hit: parseNumericValue(row[mapping.hit]) === 1 }));
  const xDomain = resolveAxisDomain(numericExtent(rows.map((row) => row.rank)), settings.xMin, settings.xMax);
  const yDomain = resolveAxisDomain(numericExtent([...rows.map((row) => row.score), 0]), settings.yMin, settings.yMax);
  const xAt = (value: number) => scaleLinear(value, xDomain, [frame.left, frame.left + frame.plotWidth]);
  const yAt = (value: number) => scaleLinear(value, yDomain, [frame.top + frame.plotHeight, frame.top]);
  return <>
    <Axes frame={frame} settings={settings} xDomain={xDomain} yDomain={yDomain} xLabel={settings.xLabel || "Rank in ordered dataset"} yLabel={settings.yLabel || "Running enrichment score"} gridColor={gridColor} />
    <g data-plot-data>
    <line x1={frame.left} x2={frame.left + frame.plotWidth} y1={yAt(0)} y2={yAt(0)} stroke={TEXT} opacity={0.6} />
    <polyline points={rows.sort((a, b) => a.rank - b.rank).map((row) => `${xAt(row.rank)},${yAt(row.score)}`).join(" ")} fill="none" stroke={colors[0]} strokeWidth={settings.dataLineWidth} strokeLinejoin="round" />
    {rows.filter((row) => row.hit).map((row, index) => <line key={index} x1={xAt(row.rank)} x2={xAt(row.rank)} y1={frame.top + frame.plotHeight - 18} y2={frame.top + frame.plotHeight} stroke={colors[1] ?? TEXT} strokeWidth={1.2} />)}
    </g>
  </>;
}

function KmPlot({ frame, dataset, mapping, settings, colors, gridColor }: { frame: Frame; dataset: ParsedDataset; mapping: Record<string, string>; settings: VisualizationSettings; colors: string[]; gridColor: string }) {
  const groups = [...new Set(dataset.rows.map((row) => mapping.group ? row[mapping.group] || "All" : "All"))];
  const colorMap = palette(groups, colors);
  const maxTime = Math.max(...dataset.rows.map((row) => parseNumericValue(row[mapping.time]) ?? 0), 1);
  const xDomain = resolveAxisDomain([0, maxTime], settings.xMin, settings.xMax);
  const yDomain = resolveAxisDomain([0, 1], settings.yMin, settings.yMax);
  const chartFrame = settings.showRiskTable ? { ...frame, plotHeight: Math.max(70, frame.plotHeight - 44) } : frame;
  const xAt = (value: number) => scaleLinear(value, xDomain, [chartFrame.left, chartFrame.left + chartFrame.plotWidth]);
  const yAt = (value: number) => scaleLinear(value, yDomain, [chartFrame.top + chartFrame.plotHeight, chartFrame.top]);
  return <>
    <Axes frame={chartFrame} settings={settings} xDomain={xDomain} yDomain={yDomain} xLabel={settings.xLabel || "Time"} yLabel={settings.yLabel || "Survival probability"} gridColor={gridColor} />
    <g data-plot-data>
    {groups.map((group) => { const records = dataset.rows.filter((row) => (mapping.group ? row[mapping.group] || "All" : "All") === group).map((row) => ({ time: parseNumericValue(row[mapping.time]) ?? 0, event: (parseNumericValue(row[mapping.event]) === 1 ? 1 : 0) as 0 | 1 })); const curve = kaplanMeier(records); const path = curve.slice(1).reduce((current, point) => `${current} H ${xAt(point.time)} V ${yAt(point.survival)}`, `M ${xAt(0)} ${yAt(1)}`); const color = colorMap.get(group) ?? colors[0]; return <g key={group}><path d={path} fill="none" stroke={color} strokeWidth={settings.dataLineWidth} />{curve.filter((point) => point.censored > 0).map((point) => <g key={point.time}><line x1={xAt(point.time) - 4} x2={xAt(point.time) + 4} y1={yAt(point.survival)} y2={yAt(point.survival)} stroke={color} strokeWidth={1.5} /><line x1={xAt(point.time)} x2={xAt(point.time)} y1={yAt(point.survival) - 4} y2={yAt(point.survival) + 4} stroke={color} strokeWidth={1.5} /></g>)}{settings.showRiskTable ? <text x={chartFrame.left - 8} y={chartFrame.top + chartFrame.plotHeight + 36 + groups.indexOf(group) * 13} textAnchor="end" fill={color} fontSize={settings.tickSize - 1}>{group.slice(0, 10)}</text> : null}{settings.showRiskTable ? [0, maxTime / 2, maxTime].map((time) => <text key={time} x={xAt(time)} y={chartFrame.top + chartFrame.plotHeight + 36 + groups.indexOf(group) * 13} textAnchor="middle" fill={TEXT} fontSize={settings.tickSize - 1}>{records.filter((record) => record.time >= time).length}</text>) : null}</g>; })}
    </g>
    {settings.showRiskTable ? <text x={chartFrame.left - 8} y={chartFrame.top + chartFrame.plotHeight + 21} textAnchor="end" fill={TEXT} fontSize={settings.tickSize} fontWeight={700}>At risk</text> : null}
    <Legend entries={groups.map((group) => ({ label: group, color: colorMap.get(group) ?? colors[0] }))} frame={frame} settings={settings} />
  </>;
}

function ForestPlot({ frame, dataset, mapping, settings, colors, gridColor }: { frame: Frame; dataset: ParsedDataset; mapping: Record<string, string>; settings: VisualizationSettings; colors: string[]; gridColor: string }) {
  const rows = dataset.rows.map((row) => ({ label: row[mapping.label], estimate: parseNumericValue(row[mapping.estimate]) ?? 0, lower: parseNumericValue(row[mapping.lower]) ?? 0, upper: parseNumericValue(row[mapping.upper]) ?? 0, group: mapping.group ? row[mapping.group] || "All" : "All" }));
  const xDomain = resolveAxisDomain(numericExtent([...rows.flatMap((row) => [row.lower, row.upper]), settings.forestReferenceValue]), settings.xMin, settings.xMax);
  const groups = [...new Set(rows.map((row) => row.group))];
  const colorMap = palette(groups, colors);
  const xAt = (value: number) => scaleLinear(value, xDomain, [frame.left, frame.left + frame.plotWidth]);
  const band = frame.plotHeight / Math.max(1, rows.length);
  const categoryPositions = rows.map((_, index) => frame.top + band * (index + 0.5));
  return <>
    <Axes frame={frame} settings={settings} xDomain={xDomain} yDomain={[0, rows.length]} xLabel={settings.xLabel || "Effect estimate (95% CI)"} yLabel="" gridColor={gridColor} hideYTicks categoryYPositions={categoryPositions} />
    <g data-plot-data>
    <line x1={xAt(settings.forestReferenceValue)} x2={xAt(settings.forestReferenceValue)} y1={frame.top} y2={frame.top + frame.plotHeight} stroke={TEXT} strokeDasharray="5 4" />
    {rows.map((row, index) => { const y = frame.top + band * (index + 0.5); const color = colorMap.get(row.group) ?? colors[0]; return <g key={`${row.label}-${index}`}><line x1={xAt(row.lower)} x2={xAt(row.upper)} y1={y} y2={y} stroke={color} strokeWidth={settings.errorBarLineWidth} /><line x1={xAt(row.lower)} x2={xAt(row.lower)} y1={y - 4} y2={y + 4} stroke={color} /><line x1={xAt(row.upper)} x2={xAt(row.upper)} y1={y - 4} y2={y + 4} stroke={color} /><rect x={xAt(row.estimate) - settings.pointSize} y={y - settings.pointSize} width={settings.pointSize * 2} height={settings.pointSize * 2} fill={color} /><text x={frame.left - 8} y={y + 4} textAnchor="end" fill={TEXT} fontSize={settings.tickSize}>{row.label.slice(0, 23)}</text></g>; })}
    </g>
    <Legend entries={groups.map((group) => ({ label: group, color: colorMap.get(group) ?? colors[0] }))} frame={frame} settings={settings} />
  </>;
}

function RocPlot({ frame, dataset, mapping, settings, colors, gridColor }: { frame: Frame; dataset: ParsedDataset; mapping: Record<string, string>; settings: VisualizationSettings; colors: string[]; gridColor: string }) {
  const groups = [...new Set(dataset.rows.map((row) => mapping.group ? row[mapping.group] || "Model" : "Model"))];
  const colorMap = palette(groups, colors);
  const xDomain = resolveAxisDomain([0, 1], settings.xMin, settings.xMax);
  const yDomain = resolveAxisDomain([0, 1], settings.yMin, settings.yMax);
  const xAt = (value: number) => scaleLinear(value, xDomain, [frame.left, frame.left + frame.plotWidth]);
  const yAt = (value: number) => scaleLinear(value, yDomain, [frame.top + frame.plotHeight, frame.top]);
  const curves = groups.map((group) => ({ group, ...rocCurve(dataset.rows.filter((row) => (mapping.group ? row[mapping.group] || "Model" : "Model") === group).map((row) => ({ truth: (parseNumericValue(row[mapping.truth]) === 1 ? 1 : 0) as 0 | 1, score: parseNumericValue(row[mapping.score]) ?? 0 }))) }));
  return <>
    <Axes frame={frame} settings={settings} xDomain={xDomain} yDomain={yDomain} xLabel={settings.xLabel || "1 − specificity"} yLabel={settings.yLabel || "Sensitivity"} gridColor={gridColor} />
    <g data-plot-data>
    <line x1={xAt(0)} x2={xAt(1)} y1={yAt(0)} y2={yAt(1)} stroke="#9B9DA3" strokeDasharray="5 4" />
    {curves.map((curve) => <polyline key={curve.group} points={curve.points.map((point) => `${xAt(point.fpr)},${yAt(point.tpr)}`).join(" ")} fill="none" stroke={colorMap.get(curve.group)} strokeWidth={settings.dataLineWidth} />)}
    </g>
    <Legend entries={curves.map((curve) => ({ label: `${curve.group} · AUC ${Number.isFinite(curve.auc) ? curve.auc.toFixed(3) : "NA"}`, color: colorMap.get(curve.group) ?? colors[0] }))} frame={frame} settings={settings} />
  </>;
}

function VennPlot({ frame, dataset, mapping, settings, colors }: { frame: Frame; dataset: ParsedDataset; mapping: Record<string, string>; settings: VisualizationSettings; colors: string[] }) {
  const membership = buildSetMemberships(dataset.rows, mapping.item, mapping.set);
  const sets = membership.sets;
  const centers = sets.length === 2 ? [[frame.left + frame.plotWidth * 0.43, frame.top + frame.plotHeight * 0.52], [frame.left + frame.plotWidth * 0.57, frame.top + frame.plotHeight * 0.52]] : [[frame.left + frame.plotWidth * 0.43, frame.top + frame.plotHeight * 0.43], [frame.left + frame.plotWidth * 0.57, frame.top + frame.plotHeight * 0.43], [frame.left + frame.plotWidth * 0.5, frame.top + frame.plotHeight * 0.59]];
  const radius = Math.min(frame.plotWidth, frame.plotHeight) * 0.27;
  const layout = vennRegionLayout(centers as Array<[number, number]>, radius);
  const exact = (wanted: string[]) => [...membership.memberships.values()].filter((itemSets) => itemSets.size === wanted.length && wanted.every((set) => itemSets.has(set))).length;
  return <g>
    {sets.map((set, index) => <g key={set}><circle cx={centers[index][0]} cy={centers[index][1]} r={radius} fill={colors[index % colors.length]} fillOpacity={settings.opacity * 0.3} stroke={colors[index % colors.length]} strokeWidth={settings.dataLineWidth} /><text x={layout.setLabels[index][0]} y={layout.setLabels[index][1]} textAnchor="middle" fill={TEXT} fontSize={settings.legendSize} fontWeight={700}>{set}</text></g>)}
    {sets.map((set, index) => <text key={`only-${set}`} x={layout.only[index][0]} y={layout.only[index][1]} textAnchor="middle" fill={TEXT} fontSize={settings.axisLabelSize} fontWeight={700}>{exact([set])}</text>)}
    {sets.length >= 2 ? <text x={layout.pairs[0][0]} y={layout.pairs[0][1]} textAnchor="middle" fill={TEXT} fontSize={settings.axisLabelSize} fontWeight={700}>{exact([sets[0], sets[1]])}</text> : null}
    {sets.length === 3 && layout.triple ? <><text x={layout.pairs[1][0]} y={layout.pairs[1][1]} textAnchor="middle" fill={TEXT} fontSize={settings.tickSize} fontWeight={700}>{exact([sets[0], sets[2]])}</text><text x={layout.pairs[2][0]} y={layout.pairs[2][1]} textAnchor="middle" fill={TEXT} fontSize={settings.tickSize} fontWeight={700}>{exact([sets[1], sets[2]])}</text><text x={layout.triple[0]} y={layout.triple[1]} textAnchor="middle" fill={TEXT} fontSize={settings.axisLabelSize} fontWeight={700}>{exact(sets)}</text></> : null}
  </g>;
}

function UpSetPlot({ frame, dataset, mapping, settings, colors }: { frame: Frame; dataset: ParsedDataset; mapping: Record<string, string>; settings: VisualizationSettings; colors: string[] }) {
  const membership = buildSetMemberships(dataset.rows, mapping.item, mapping.set);
  const intersections = membership.intersections.slice(0, Math.min(10, Math.floor(frame.plotWidth / 38)));
  const max = Math.max(...intersections.map((entry) => entry.size), 1);
  const layout = upsetVerticalLayout(frame.top, frame.plotHeight, membership.sets.length);
  const band = frame.plotWidth / Math.max(1, intersections.length);
  return <g>
    <line x1={frame.left} x2={frame.left + frame.plotWidth} y1={layout.baseline} y2={layout.baseline} stroke={TEXT} strokeWidth={settings.axisLineWidth} />
    {intersections.map((entry, index) => { const height = entry.size / max * layout.barHeight; const x = frame.left + band * (index + 0.5); return <g key={entry.sets.join("|")}><rect x={x - band * 0.28} y={layout.baseline - height} width={band * 0.56} height={height} fill={colors[0]} fillOpacity={settings.opacity} /><text x={x} y={layout.baseline - height - 7} textAnchor="middle" fill={TEXT} fontSize={settings.tickSize}>{entry.size}</text>{membership.sets.map((set, setIndex) => <circle key={set} cx={x} cy={layout.matrixTop + setIndex * layout.rowGap} r={4.5} fill={entry.sets.includes(set) ? colors[1] ?? colors[0] : "#D5D6D8"} />)}{entry.sets.length > 1 ? <line x1={x} x2={x} y1={layout.matrixTop + Math.min(...entry.sets.map((set) => membership.sets.indexOf(set))) * layout.rowGap} y2={layout.matrixTop + Math.max(...entry.sets.map((set) => membership.sets.indexOf(set))) * layout.rowGap} stroke={colors[1] ?? colors[0]} strokeWidth={2} /> : null}</g>; })}
    {membership.sets.map((set, index) => <text key={set} x={frame.left - 8} y={layout.matrixTop + index * layout.rowGap + settings.tickSize * 0.34} textAnchor="end" fill={TEXT} fontSize={settings.tickSize}>{set.slice(0, 16)}</text>)}
    <text x={frame.left} y={frame.top + settings.axisLabelSize} fill={TEXT} fontSize={settings.axisLabelSize} fontWeight={700}>Intersection size</text>
  </g>;
}

function SankeyPlot({ frame, dataset, mapping, settings, colors }: { frame: Frame; dataset: ParsedDataset; mapping: Record<string, string>; settings: VisualizationSettings; colors: string[] }) {
  const edges = dataset.rows.map((row) => ({ source: row[mapping.source], target: row[mapping.target], value: Math.max(0, parseNumericValue(row[mapping.value]) ?? 0) }));
  const sources = [...new Set(edges.map((edge) => edge.source))];
  const targets = [...new Set(edges.map((edge) => edge.target))];
  const nodes = [...new Set([...sources, ...targets])];
  const colorMap = palette(nodes, colors);
  const sourceTotals = new Map(sources.map((source) => [source, edges.filter((edge) => edge.source === source).reduce((sum, edge) => sum + edge.value, 0)]));
  const targetTotals = new Map(targets.map((target) => [target, edges.filter((edge) => edge.target === target).reduce((sum, edge) => sum + edge.value, 0)]));
  const maximumTotal = Math.max(...sourceTotals.values(), ...targetTotals.values(), 1);
  const sourceY = new Map(sources.map((source, index) => [source, frame.top + frame.plotHeight * (index + 0.5) / sources.length]));
  const targetY = new Map(targets.map((target, index) => [target, frame.top + frame.plotHeight * (index + 0.5) / targets.length]));
  const left = frame.left + frame.plotWidth * 0.08;
  const right = frame.left + frame.plotWidth * 0.92;
  return <g>
    {edges.map((edge, index) => { const sy = sourceY.get(edge.source) ?? 0; const ty = targetY.get(edge.target) ?? 0; const width = Math.max(1, edge.value / maximumTotal * 32); return <path key={index} d={`M ${left + 10} ${sy} C ${left + frame.plotWidth * 0.35} ${sy}, ${right - frame.plotWidth * 0.35} ${ty}, ${right - 10} ${ty}`} fill="none" stroke={colorMap.get(edge.source)} strokeWidth={width} strokeOpacity={settings.opacity * 0.5} />; })}
    {sources.map((source) => { const y = sourceY.get(source) ?? 0; const h = Math.max(12, (sourceTotals.get(source) ?? 0) / maximumTotal * 40); return <g key={source}><rect x={left} y={y - h / 2} width={10} height={h} rx={2} fill={colorMap.get(source)} /><text x={left - 7} y={y + 4} textAnchor="end" fill={TEXT} fontSize={settings.tickSize}>{source.slice(0, 15)}</text></g>; })}
    {targets.map((target) => { const y = targetY.get(target) ?? 0; const h = Math.max(12, (targetTotals.get(target) ?? 0) / maximumTotal * 40); return <g key={target}><rect x={right - 10} y={y - h / 2} width={10} height={h} rx={2} fill={colorMap.get(target)} /><text x={right + 7} y={y + 4} fill={TEXT} fontSize={settings.tickSize}>{target.slice(0, 15)}</text></g>; })}
  </g>;
}

function polar(cx: number, cy: number, radius: number, angle: number) { return [cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius] as const; }
function arcPath(cx: number, cy: number, radius: number, start: number, end: number) { const a = polar(cx, cy, radius, start); const b = polar(cx, cy, radius, end); return `M ${a[0]} ${a[1]} A ${radius} ${radius} 0 ${end - start > Math.PI ? 1 : 0} 1 ${b[0]} ${b[1]}`; }

function ChordPlot({ frame, dataset, mapping, settings, colors }: { frame: Frame; dataset: ParsedDataset; mapping: Record<string, string>; settings: VisualizationSettings; colors: string[] }) {
  const edges = dataset.rows.map((row) => ({ source: row[mapping.source], target: row[mapping.target], value: Math.max(0, parseNumericValue(row[mapping.value]) ?? 0) }));
  const nodes = [...new Set(edges.flatMap((edge) => [edge.source, edge.target]))];
  const colorMap = palette(nodes, colors);
  const cx = frame.left + frame.plotWidth / 2; const cy = frame.top + frame.plotHeight / 2; const radius = Math.min(frame.plotWidth, frame.plotHeight) * 0.39;
  const angle = new Map(nodes.map((node, index) => [node, -Math.PI / 2 + index * Math.PI * 2 / nodes.length]));
  const maxValue = Math.max(...edges.map((edge) => edge.value), 1);
  return <g>
    {nodes.map((node) => { const center = angle.get(node) ?? 0; const start = center - Math.PI * 0.8 / nodes.length; const end = center + Math.PI * 0.8 / nodes.length; const label = polar(cx, cy, radius + 20, center); return <g key={node}><path d={arcPath(cx, cy, radius, start, end)} fill="none" stroke={colorMap.get(node)} strokeWidth={12} /><text x={label[0]} y={label[1] + 4} textAnchor={Math.cos(center) > 0.15 ? "start" : Math.cos(center) < -0.15 ? "end" : "middle"} fill={TEXT} fontSize={settings.tickSize}>{node.slice(0, 14)}</text></g>; })}
    {edges.map((edge, index) => { const source = polar(cx, cy, radius - 7, angle.get(edge.source) ?? 0); const target = polar(cx, cy, radius - 7, angle.get(edge.target) ?? 0); return <path key={index} d={`M ${source[0]} ${source[1]} Q ${cx} ${cy} ${target[0]} ${target[1]}`} fill="none" stroke={colorMap.get(edge.source)} strokeOpacity={settings.opacity * 0.55} strokeWidth={1 + edge.value / maxValue * 8} />; })}
  </g>;
}

function CircosPlot({ frame, dataset, mapping, settings, colors }: { frame: Frame; dataset: ParsedDataset; mapping: Record<string, string>; settings: VisualizationSettings; colors: string[] }) {
  const links = dataset.rows.map((row) => ({ sourceChr: row[mapping.sourceChr], sourceStart: parseNumericValue(row[mapping.sourceStart]) ?? 0, sourceEnd: parseNumericValue(row[mapping.sourceEnd]) ?? 0, targetChr: row[mapping.targetChr], targetStart: parseNumericValue(row[mapping.targetStart]) ?? 0, targetEnd: parseNumericValue(row[mapping.targetEnd]) ?? 0, value: Math.max(0, parseNumericValue(row[mapping.value]) ?? 1) }));
  const chromosomes = [...new Set(links.flatMap((link) => [link.sourceChr, link.targetChr]))];
  const lengths = new Map(chromosomes.map((chromosome) => [chromosome, Math.max(1, ...links.flatMap((link) => [link.sourceChr === chromosome ? link.sourceEnd : 0, link.targetChr === chromosome ? link.targetEnd : 0]))]));
  const total = [...lengths.values()].reduce((sum, value) => sum + value, 0);
  const gap = 0.045;
  let cursor = -Math.PI / 2;
  const sectors = new Map<string, { start: number; end: number }>();
  chromosomes.forEach((chromosome) => { const span = (Math.PI * 2 - gap * chromosomes.length) * (lengths.get(chromosome) ?? 1) / total; sectors.set(chromosome, { start: cursor, end: cursor + span }); cursor += span + gap; });
  const cx = frame.left + frame.plotWidth / 2; const cy = frame.top + frame.plotHeight / 2; const radius = Math.min(frame.plotWidth, frame.plotHeight) * 0.39;
  const colorMap = palette(chromosomes, colors); const maxValue = Math.max(...links.map((link) => link.value), 1);
  const coordinateAngle = (chromosome: string, position: number) => { const sector = sectors.get(chromosome)!; return sector.start + (sector.end - sector.start) * position / (lengths.get(chromosome) ?? 1); };
  return <g>
    {chromosomes.map((chromosome) => { const sector = sectors.get(chromosome)!; const mid = (sector.start + sector.end) / 2; const label = polar(cx, cy, radius + 20, mid); return <g key={chromosome}><path d={arcPath(cx, cy, radius, sector.start, sector.end)} fill="none" stroke={colorMap.get(chromosome)} strokeWidth={14} /><path d={arcPath(cx, cy, radius - 20, sector.start, sector.end)} fill="none" stroke={colorMap.get(chromosome)} strokeOpacity={0.35} strokeWidth={5} /><text x={label[0]} y={label[1] + 4} textAnchor={Math.cos(mid) > 0.15 ? "start" : Math.cos(mid) < -0.15 ? "end" : "middle"} fill={TEXT} fontSize={settings.tickSize} fontWeight={700}>{chromosome}</text></g>; })}
    {links.map((link, index) => { const sourceAngle = coordinateAngle(link.sourceChr, (link.sourceStart + link.sourceEnd) / 2); const targetAngle = coordinateAngle(link.targetChr, (link.targetStart + link.targetEnd) / 2); const source = polar(cx, cy, radius - 23, sourceAngle); const target = polar(cx, cy, radius - 23, targetAngle); return <path key={index} d={`M ${source[0]} ${source[1]} Q ${cx} ${cy} ${target[0]} ${target[1]}`} fill="none" stroke={colorMap.get(link.sourceChr)} strokeWidth={1 + link.value / maxValue * 7} strokeOpacity={settings.opacity * 0.55} />; })}
  </g>;
}

function sectorPath(cx: number, cy: number, outerRadius: number, start: number, end: number, innerRadius = 0) {
  const safeEnd = Math.min(end, start + Math.PI * 2 - 1e-6);
  const outerStart = polar(cx, cy, outerRadius, start);
  const outerEnd = polar(cx, cy, outerRadius, safeEnd);
  const large = safeEnd - start > Math.PI ? 1 : 0;
  if (innerRadius <= 0) return `M ${cx} ${cy} L ${outerStart[0]} ${outerStart[1]} A ${outerRadius} ${outerRadius} 0 ${large} 1 ${outerEnd[0]} ${outerEnd[1]} Z`;
  const innerEnd = polar(cx, cy, innerRadius, safeEnd);
  const innerStart = polar(cx, cy, innerRadius, start);
  return `M ${outerStart[0]} ${outerStart[1]} A ${outerRadius} ${outerRadius} 0 ${large} 1 ${outerEnd[0]} ${outerEnd[1]} L ${innerEnd[0]} ${innerEnd[1]} A ${innerRadius} ${innerRadius} 0 ${large} 0 ${innerStart[0]} ${innerStart[1]} Z`;
}

function compositionLabel(mode: VisualizationSettings["compositionLabelMode"], value: number, total: number) {
  const percent = total > 0 ? `${(value / total * 100).toFixed(value / total < 0.1 ? 1 : 0)}%` : "0%";
  if (mode === "value") return formatTick(value);
  if (mode === "both") return `${formatTick(value)} (${percent})`;
  return mode === "percent" ? percent : "";
}

function CompositionPlot({ type, frame, dataset, mapping, settings, colors }: { type: "pie" | "donut" | "rose"; frame: Frame; dataset: ParsedDataset; mapping: Record<string, string>; settings: VisualizationSettings; colors: string[] }) {
  const rows = dataset.rows.map((row) => ({ category: row[mapping.category], value: Math.max(0, parseNumericValue(row[mapping.value]) ?? 0) }));
  const total = rows.reduce((sum, row) => sum + row.value, 0);
  const colorMap = palette(rows.map((row) => row.category), colors);
  const cx = frame.left + frame.plotWidth / 2;
  const cy = frame.top + frame.plotHeight / 2;
  const radius = Math.min(frame.plotWidth, frame.plotHeight) * 0.42;
  if (type === "rose") {
    const maximum = settings.radialMaximum && settings.radialMaximum > 0 ? settings.radialMaximum : Math.max(...rows.map((row) => row.value), 1) * 1.05;
    const step = Math.PI * 2 / rows.length;
    return <><g data-plot-data data-plot-family="rose">{[0.25, 0.5, 0.75, 1].map((fraction) => <circle key={fraction} cx={cx} cy={cy} r={radius * fraction} fill="none" stroke="#E4E1DC" strokeWidth={settings.gridLineWidth} />)}{rows.map((row, index) => {
      const start = -Math.PI / 2 + index * step + 0.018;
      const end = start + step - 0.036;
      const rowRadius = radius * Math.sqrt(Math.min(1, row.value / maximum));
      const labelPoint = polar(cx, cy, radius + 13, start + (end - start) / 2);
      const labelCosine = Math.cos(start + (end - start) / 2);
      return <g key={`${row.category}-${index}`}><path data-plot-element="rose-sector" d={sectorPath(cx, cy, rowRadius, start, end)} fill={colorMap.get(row.category)} fillOpacity={settings.opacity} stroke="#FFFFFF" strokeWidth={1} />{settings.compositionLabelMode !== "none" ? <text x={labelPoint[0]} y={labelPoint[1] + 3} textAnchor={labelCosine < -0.2 ? "start" : labelCosine > 0.2 ? "end" : "middle"} fill={TEXT} fontSize={settings.tickSize}>{row.category.slice(0, 8)} {formatTick(row.value)}</text> : null}</g>;
    })}</g><Legend entries={rows.map((row) => ({ label: row.category, color: colorMap.get(row.category) ?? colors[0] }))} frame={frame} settings={settings} /></>;
  }
  const inner = type === "donut" ? radius * settings.donutHole : 0;
  return <><g data-plot-data data-plot-family={type}>{rows.map((row, index) => {
    const previous = rows.slice(0, index).reduce((sum, entry) => sum + entry.value, 0);
    const start = -Math.PI / 2 + (previous / Math.max(total, Number.EPSILON)) * Math.PI * 2;
    const end = start + (row.value / Math.max(total, Number.EPSILON)) * Math.PI * 2;
    const middle = (start + end) / 2;
    const labelRadius = inner + (radius - inner) * 0.61;
    const labelPoint = polar(cx, cy, labelRadius, middle);
    const label = compositionLabel(settings.compositionLabelMode, row.value, total);
    return <g key={`${row.category}-${index}`}><path data-plot-element={`${type}-sector`} d={sectorPath(cx, cy, radius, start, end, inner)} fill={colorMap.get(row.category)} fillOpacity={settings.opacity} stroke="#FFFFFF" strokeWidth={1.2} />{label && row.value / total >= 0.045 ? <text x={labelPoint[0]} y={labelPoint[1] + 3} textAnchor="middle" fill={TEXT} fontSize={settings.tickSize} fontWeight={700}>{label}</text> : null}</g>;
  })}{type === "donut" ? <><text x={cx} y={cy - 3} textAnchor="middle" fill={TEXT} fontSize={settings.legendSize}>Total</text><text x={cx} y={cy + settings.axisLabelSize} textAnchor="middle" fill={TEXT} fontSize={settings.axisLabelSize} fontWeight={700}>{formatTick(total)}</text></> : null}</g><Legend entries={rows.map((row) => ({ label: `${row.category} ${compositionLabel("percent", row.value, total)}`, color: colorMap.get(row.category) ?? colors[0] }))} frame={frame} settings={settings} /></>;
}

function WafflePlot({ frame, dataset, mapping, settings, colors }: { frame: Frame; dataset: ParsedDataset; mapping: Record<string, string>; settings: VisualizationSettings; colors: string[] }) {
  const rows = dataset.rows.map((row) => ({ category: row[mapping.category], value: Math.max(0, parseNumericValue(row[mapping.value]) ?? 0) }));
  const total = rows.reduce((sum, row) => sum + row.value, 0);
  const count = Math.max(25, Math.min(400, Math.round(settings.waffleCells)));
  const columns = Math.ceil(Math.sqrt(count)); const rowCount = Math.ceil(count / columns);
  const gap = 2; const cell = Math.max(2, Math.min((frame.plotWidth - gap * (columns - 1)) / columns, (frame.plotHeight - gap * (rowCount - 1)) / rowCount));
  const gridWidth = columns * cell + (columns - 1) * gap; const gridHeight = rowCount * cell + (rowCount - 1) * gap;
  const left = frame.left + (frame.plotWidth - gridWidth) / 2; const top = frame.top + (frame.plotHeight - gridHeight) / 2;
  const colorMap = palette(rows.map((row) => row.category), colors);
  const cumulative = rows.reduce<number[]>((acc, row) => [...acc, (acc.at(-1) ?? 0) + row.value / Math.max(total, Number.EPSILON) * count], []);
  return <><g data-plot-data data-plot-family="waffle">{Array.from({ length: count }, (_, index) => {
    const matchedIndex = cumulative.findIndex((boundary) => index + 0.5 <= boundary);
    const row = rows[matchedIndex < 0 ? rows.length - 1 : matchedIndex];
    const columnIndex = index % columns; const rowIndex = rowCount - 1 - Math.floor(index / columns);
    return <rect key={index} data-plot-element="waffle-cell" x={left + columnIndex * (cell + gap)} y={top + rowIndex * (cell + gap)} width={cell} height={cell} rx={Math.min(1.5, cell * 0.15)} fill={colorMap.get(row.category)} fillOpacity={settings.opacity} />;
  })}</g><Legend entries={rows.map((row) => ({ label: settings.compositionLabelMode === "none" ? row.category : `${row.category} ${compositionLabel(settings.compositionLabelMode, row.value, total)}`, color: colorMap.get(row.category) ?? colors[0] }))} frame={frame} settings={settings} /></>;
}

type HierarchyNode = { name: string; ownValue: number; value: number; depth: number; children: HierarchyNode[]; color: string };
function hierarchyFromRows(dataset: ParsedDataset, mapping: Record<string, string>, colors: string[]) {
  const nodes = new Map<string, HierarchyNode>();
  dataset.rows.forEach((row) => nodes.set(row[mapping.node], { name: row[mapping.node], ownValue: Math.max(0, parseNumericValue(row[mapping.value]) ?? 0), value: 0, depth: 0, children: [], color: colors[0] }));
  let root: HierarchyNode | undefined;
  dataset.rows.forEach((row) => { const node = nodes.get(row[mapping.node])!; const parentName = mapping.parent ? row[mapping.parent] : ""; const parent = parentName ? nodes.get(parentName) : undefined; if (parent) parent.children.push(node); else root = node; });
  const fill = (node: HierarchyNode, depth: number, inheritedColor: string): number => { node.depth = depth; node.color = inheritedColor; node.value = node.children.length ? node.children.reduce((sum, child, index) => sum + fill(child, depth + 1, depth === 0 ? colors[index % colors.length] : inheritedColor), 0) : node.ownValue; return node.value; };
  if (root) fill(root, 0, colors[0]);
  return root;
}

function TreemapPlot({ frame, dataset, mapping, settings, colors }: { frame: Frame; dataset: ParsedDataset; mapping: Record<string, string>; settings: VisualizationSettings; colors: string[] }) {
  const root = hierarchyFromRows(dataset, mapping, colors);
  if (!root) return null;
  const marks: ReactNode[] = [];
  const layout = (node: HierarchyNode, x: number, y: number, width: number, height: number, vertical: boolean, key: string) => {
    if (node.depth > 0) {
      const gap = Math.min(settings.hierarchyGap, width / 5, height / 5);
      marks.push(<g key={key}><rect data-plot-element="treemap-node" x={x + gap / 2} y={y + gap / 2} width={Math.max(0, width - gap)} height={Math.max(0, height - gap)} fill={node.color} fillOpacity={Math.max(0.28, settings.opacity - node.depth * 0.12)} stroke="#FFFFFF" strokeWidth={0.8} />{width > 55 && height > 24 ? <><text x={x + 6} y={y + 15} fill={TEXT} fontSize={settings.tickSize} fontWeight={node.children.length ? 700 : 500}>{node.name.slice(0, Math.max(6, Math.floor(width / 7)))}</text>{settings.compositionLabelMode !== "none" && height > 39 ? <text x={x + 6} y={y + 30} fill={TEXT} fontSize={Math.max(8, settings.tickSize - 1)}>{compositionLabel(settings.compositionLabelMode, node.value, root.value)}</text> : null}</> : null}</g>);
    }
    if (!node.children.length || node.value <= 0) return;
    let cursor = vertical ? x : y;
    node.children.forEach((child, index) => { const fraction = child.value / node.value; const childWidth = vertical ? width * fraction : width; const childHeight = vertical ? height : height * fraction; layout(child, vertical ? cursor : x, vertical ? y : cursor, childWidth, childHeight, !vertical, `${key}-${index}`); cursor += vertical ? childWidth : childHeight; });
  };
  layout(root, frame.left, frame.top, frame.plotWidth, frame.plotHeight, frame.plotWidth >= frame.plotHeight, "root");
  return <g data-plot-data data-plot-family="treemap">{marks}</g>;
}

function SunburstPlot({ frame, dataset, mapping, settings, colors }: { frame: Frame; dataset: ParsedDataset; mapping: Record<string, string>; settings: VisualizationSettings; colors: string[] }) {
  const root = hierarchyFromRows(dataset, mapping, colors);
  if (!root) return null;
  const cx = frame.left + frame.plotWidth / 2; const cy = frame.top + frame.plotHeight / 2;
  const depthOf = (node: HierarchyNode): number => node.children.length ? Math.max(node.depth, ...node.children.map(depthOf)) : node.depth;
  const maximumDepth = Math.max(1, depthOf(root));
  const radius = Math.min(frame.plotWidth, frame.plotHeight) * 0.43; const ring = radius / (maximumDepth + 1);
  const safeGap = Math.min(settings.hierarchyGap, ring * 0.7);
  const marks: ReactNode[] = [];
  const renderNode = (node: HierarchyNode, start: number, end: number, key: string) => {
    if (node.depth > 0) {
      marks.push(<path key={key} data-plot-element="sunburst-node" d={sectorPath(cx, cy, ring * (node.depth + 1) - safeGap / 2, start, end, ring * node.depth + safeGap / 2)} fill={node.color} fillOpacity={Math.max(0.3, settings.opacity - node.depth * 0.1)} stroke="#FFFFFF" strokeWidth={0.7} />);
    }
    let cursor = start;
    node.children.forEach((child, index) => { const childEnd = cursor + (end - start) * child.value / Math.max(node.value, Number.EPSILON); renderNode(child, cursor, childEnd, `${key}-${index}`); cursor = childEnd; });
  };
  renderNode(root, -Math.PI / 2, Math.PI * 1.5, "root");
  return <><g data-plot-data data-plot-family="sunburst"><circle cx={cx} cy={cy} r={Math.max(5, ring - safeGap / 2)} fill="#F5F2ED" /><text x={cx} y={cy + 3} textAnchor="middle" fill={TEXT} fontSize={Math.max(8, settings.tickSize - 1)} fontWeight={700}>{root.name.slice(0, 11)}</text>{marks}</g><Legend entries={root.children.map((node) => ({ label: settings.compositionLabelMode === "none" ? node.name : `${node.name} ${compositionLabel(settings.compositionLabelMode, node.value, root.value)}`, color: node.color }))} frame={frame} settings={settings} /></>;
}

function RadialProfilePlot({ type, frame, dataset, mapping, settings, colors }: { type: "radar" | "polar-profile"; frame: Frame; dataset: ParsedDataset; mapping: Record<string, string>; settings: VisualizationSettings; colors: string[] }) {
  const categoryKey = type === "radar" ? "feature" : "angle";
  const categories = [...new Set(dataset.rows.map((row) => row[mapping[categoryKey]]))];
  const series = [...new Set(dataset.rows.map((row) => mapping.series ? row[mapping.series] || "All" : "All"))];
  const colorMap = palette(series, colors); const values = dataset.rows.map((row) => Math.max(0, parseNumericValue(row[mapping.value]) ?? 0));
  const maximum = settings.radialMaximum && settings.radialMaximum > 0 ? settings.radialMaximum : Math.max(...values, 1) * 1.08;
  const cx = frame.left + frame.plotWidth / 2 + Math.min(22, frame.plotWidth * 0.1); const cy = frame.top + frame.plotHeight / 2; const radius = Math.min(frame.plotWidth * 0.31, frame.plotHeight * 0.39);
  const angleAt = (index: number) => -Math.PI / 2 + index * Math.PI * 2 / categories.length;
  const pointAt = (category: string, currentSeries: string) => { const row = dataset.rows.find((entry) => entry[mapping[categoryKey]] === category && (mapping.series ? entry[mapping.series] || "All" : "All") === currentSeries); const value = Math.max(0, parseNumericValue(row?.[mapping.value]) ?? 0); return polar(cx, cy, radius * Math.min(1, value / maximum), angleAt(categories.indexOf(category))); };
  return <><g data-plot-data data-plot-family={type}>{[0.25, 0.5, 0.75, 1].map((fraction) => <polygon key={fraction} points={categories.map((_, index) => polar(cx, cy, radius * fraction, angleAt(index)).join(",")).join(" ")} fill="none" stroke="#DDD9D2" strokeWidth={settings.gridLineWidth} />)}{categories.map((category, index) => { const end = polar(cx, cy, radius, angleAt(index)); const label = polar(cx, cy, radius + 16, angleAt(index)); return <g key={category}><line x1={cx} y1={cy} x2={end[0]} y2={end[1]} stroke="#DDD9D2" strokeWidth={settings.gridLineWidth} /><text x={label[0]} y={label[1] + 3} textAnchor={Math.cos(angleAt(index)) > 0.2 ? "start" : Math.cos(angleAt(index)) < -0.2 ? "end" : "middle"} fill={TEXT} fontSize={settings.tickSize}>{category.slice(0, 13)}</text></g>; })}{series.map((currentSeries) => { const points = categories.map((category) => pointAt(category, currentSeries)); const closed = [...points, points[0]]; return <g key={currentSeries}><polygon data-plot-element={`${type}-profile`} points={points.map((point) => point.join(",")).join(" ")} fill={colorMap.get(currentSeries)} fillOpacity={settings.radarFillOpacity} stroke={colorMap.get(currentSeries)} strokeWidth={settings.dataLineWidth} />{closed.slice(0, -1).map((point, index) => <circle key={index} cx={point[0]} cy={point[1]} r={Math.max(2.5, settings.pointSize * 0.65)} fill={colorMap.get(currentSeries)} stroke="#FFFFFF" strokeWidth={0.7} />)}</g>; })}</g><Legend entries={series.map((entry) => ({ label: entry, color: colorMap.get(entry) ?? colors[0] }))} frame={frame} settings={settings} /></>;
}

function PopulationPyramidPlot({ frame, dataset, mapping, settings, colors }: { frame: Frame; dataset: ParsedDataset; mapping: Record<string, string>; settings: VisualizationSettings; colors: string[] }) {
  const categories = [...new Set(dataset.rows.map((row) => row[mapping.category]))]; const groups = [...new Set(dataset.rows.map((row) => row[mapping.group]))];
  const groupTotals = new Map(groups.map((group) => [group, dataset.rows.filter((row) => row[mapping.group] === group).reduce((sum, row) => sum + Math.max(0, parseNumericValue(row[mapping.value]) ?? 0), 0)]));
  const displayedValue = (row: Record<string, string> | undefined, group: string) => {
    const raw = Math.max(0, parseNumericValue(row?.[mapping.value]) ?? 0);
    return settings.pyramidDisplayMode === "percent" ? raw / Math.max(groupTotals.get(group) ?? 0, Number.EPSILON) * 100 : raw;
  };
  const maximum = Math.max(...dataset.rows.map((row) => displayedValue(row, row[mapping.group])), 1) * 1.08;
  const center = frame.left + frame.plotWidth / 2; const half = frame.plotWidth * 0.43; const band = frame.plotHeight / Math.max(1, categories.length);
  const colorMap = palette(groups, colors);
  const valueFor = (category: string, group: string) => displayedValue(dataset.rows.find((row) => row[mapping.category] === category && row[mapping.group] === group), group);
  const valueLabel = (value: number) => settings.pyramidDisplayMode === "percent" ? `${value.toFixed(value < 10 ? 1 : 0)}%` : formatTick(value);
  return <><g data-plot-data data-plot-family="population-pyramid"><line x1={center} x2={center} y1={frame.top} y2={frame.top + frame.plotHeight} stroke={TEXT} strokeWidth={settings.axisLineWidth} />{categories.map((category, index) => { const y = frame.top + index * band + band * 0.14; const height = band * 0.72; const leftValue = valueFor(category, groups[0]); const rightValue = valueFor(category, groups[1]); const leftWidth = leftValue / maximum * half; const rightWidth = rightValue / maximum * half; return <g key={category}><rect data-plot-element="pyramid-bar" x={center - leftWidth} y={y} width={leftWidth} height={height} fill={colorMap.get(groups[0])} fillOpacity={settings.opacity} /><rect data-plot-element="pyramid-bar" x={center} y={y} width={rightWidth} height={height} fill={colorMap.get(groups[1])} fillOpacity={settings.opacity} /><text x={center} y={y + height / 2 + settings.tickSize * 0.35} textAnchor="middle" fill="#FFFFFF" stroke={TEXT} strokeWidth={2.8} paintOrder="stroke" fontSize={settings.tickSize} fontWeight={700}>{category.slice(0, 11)}</text><text x={center - leftWidth - 5} y={y + height / 2 + 4} textAnchor="end" fill={TEXT} fontSize={settings.tickSize}>{valueLabel(leftValue)}</text><text x={center + rightWidth + 5} y={y + height / 2 + 4} fill={TEXT} fontSize={settings.tickSize}>{valueLabel(rightValue)}</text></g>; })}</g><Legend entries={groups.map((group) => ({ label: group, color: colorMap.get(group) ?? colors[0] }))} frame={frame} settings={settings} /></>;
}

export function ScientificAdvancedChartPreview({ svgRef, type, dataset, mapping, settings, themeId }: Props) {
  const theme = journalThemes[themeId];
  const definition = getPlotDefinition(type);
  const frame = frameFor(type, settings);
  const colors = settings.categoricalColors.length > 0 ? settings.categoricalColors : theme.categorical;
  const sequential: [string, string] = [settings.continuousLow, settings.continuousHigh];
  const diverging: [string, string, string] = [settings.divergingLow, settings.divergingMid, settings.divergingHigh];
  let content: ReactNode = null;
  if (["correlation", "quadrant", "pcoa", "umap"].includes(type)) content = <ScatterFamily type={type} frame={frame} dataset={dataset} mapping={mapping} settings={settings} colors={colors} gridColor={theme.grid} />;
  else if (type === "ma") content = <MaPlot frame={frame} dataset={dataset} mapping={mapping} settings={settings} colors={colors} gridColor={theme.grid} />;
  else if (type === "errorbar") content = <ErrorBarPlot frame={frame} dataset={dataset} mapping={mapping} settings={settings} colors={colors} gridColor={theme.grid} />;
  else if (type === "area") content = <AreaPlot frame={frame} dataset={dataset} mapping={mapping} settings={settings} colors={colors} gridColor={theme.grid} />;
  else if (type === "lollipop") content = <LollipopPlot frame={frame} dataset={dataset} mapping={mapping} settings={settings} colors={colors} gridColor={theme.grid} />;
  else if (["box", "violin", "beeswarm", "raincloud", "histogram", "density", "ridge"].includes(type)) content = <DistributionPlot type={type as DistributionPlotType} frame={frame} dataset={dataset} mapping={mapping} settings={settings} colors={colors} gridColor={theme.grid} />;
  else if (type === "clustered-heatmap" || type === "correlation-heatmap") content = <MatrixPlot type={type} frame={frame} dataset={dataset} settings={settings} diverging={diverging} />;
  else if (type === "enrichment-bar") content = <EnrichmentBar frame={frame} dataset={dataset} mapping={mapping} settings={settings} sequential={sequential} gridColor={theme.grid} />;
  else if (type === "gsea") content = <GseaPlot frame={frame} dataset={dataset} mapping={mapping} settings={settings} colors={colors} gridColor={theme.grid} />;
  else if (type === "km") content = <KmPlot frame={frame} dataset={dataset} mapping={mapping} settings={settings} colors={colors} gridColor={theme.grid} />;
  else if (type === "survival-forest") content = <ForestPlot frame={frame} dataset={dataset} mapping={mapping} settings={settings} colors={colors} gridColor={theme.grid} />;
  else if (type === "roc") content = <RocPlot frame={frame} dataset={dataset} mapping={mapping} settings={settings} colors={colors} gridColor={theme.grid} />;
  else if (type === "venn") content = <VennPlot frame={frame} dataset={dataset} mapping={mapping} settings={settings} colors={colors} />;
  else if (type === "upset") content = <UpSetPlot frame={frame} dataset={dataset} mapping={mapping} settings={settings} colors={colors} />;
  else if (type === "sankey") content = <SankeyPlot frame={frame} dataset={dataset} mapping={mapping} settings={settings} colors={colors} />;
  else if (type === "chord") content = <ChordPlot frame={frame} dataset={dataset} mapping={mapping} settings={settings} colors={colors} />;
  else if (type === "circos") content = <CircosPlot frame={frame} dataset={dataset} mapping={mapping} settings={settings} colors={colors} />;
  else if (type === "pie" || type === "donut" || type === "rose") content = <CompositionPlot type={type} frame={frame} dataset={dataset} mapping={mapping} settings={settings} colors={colors} />;
  else if (type === "waffle") content = <WafflePlot frame={frame} dataset={dataset} mapping={mapping} settings={settings} colors={colors} />;
  else if (type === "treemap") content = <TreemapPlot frame={frame} dataset={dataset} mapping={mapping} settings={settings} colors={colors} />;
  else if (type === "sunburst") content = <SunburstPlot frame={frame} dataset={dataset} mapping={mapping} settings={settings} colors={colors} />;
  else if (type === "radar" || type === "polar-profile") content = <RadialProfilePlot type={type} frame={frame} dataset={dataset} mapping={mapping} settings={settings} colors={colors} />;
  else if (type === "population-pyramid") content = <PopulationPyramidPlot frame={frame} dataset={dataset} mapping={mapping} settings={settings} colors={colors} />;
  return <svg ref={svgRef} xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${frame.width} ${frame.height}`} width={frame.width} height={frame.height} role="img" data-plot-renderer="advanced" data-chart-text-color={TEXT} aria-label={`${definition.name} scientific figure preview`} style={{ fontFamily: figureFontPresets[settings.fontFamily].family, background: "white", maxWidth: "100%", height: "auto" }}>
    <title>{settings.title || `${definition.name} figure`}</title><desc>{definition.summary} Generated in LabNest Visualization Studio.</desc><rect width={frame.width} height={frame.height} fill="#FFFFFF" />
    <defs><clipPath id={`plot-area-${type}`}><rect x={frame.left} y={frame.top} width={frame.plotWidth} height={frame.plotHeight} /></clipPath></defs>
    <style>{`[data-plot-data] path,[data-plot-data] circle,[data-plot-data] rect,[data-plot-data] line,[data-plot-data] polyline,[data-plot-data] polygon,[data-plot-data] text[data-plot-label]{clip-path:url(#plot-area-${type})}`}</style>
    {settings.title ? <text x={frame.left} y={24} fill={TEXT} fontSize={settings.titleSize} fontWeight={700}>{settings.title}</text> : null}
    {content}
  </svg>;
}
