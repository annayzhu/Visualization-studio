import {
  createPlotModuleRegistry,
  type PlotDataShape,
  type PlotModuleSeed,
} from "./plot-module-registry";

export type PlotType =
  | "bar"
  | "line"
  | "scatter"
  | "correlation"
  | "pca"
  | "pcoa"
  | "umap"
  | "box"
  | "violin"
  | "beeswarm"
  | "raincloud"
  | "histogram"
  | "density"
  | "ridge"
  | "volcano"
  | "ma"
  | "quadrant"
  | "errorbar"
  | "area"
  | "lollipop"
  | "heatmap"
  | "clustered-heatmap"
  | "correlation-heatmap"
  | "enrichment"
  | "enrichment-bar"
  | "gsea"
  | "km"
  | "survival-forest"
  | "roc"
  | "venn"
  | "upset"
  | "sankey"
  | "chord"
  | "circos"
  | "pie"
  | "donut"
  | "rose"
  | "waffle"
  | "treemap"
  | "sunburst"
  | "radar"
  | "polar-profile"
  | "population-pyramid";

export type JournalThemeId =
  | "nature"
  | "cell"
  | "science"
  | "nejm"
  | "lancet"
  | "jama"
  | "nordic"
  | "earth"
  | "colorblind"
  | "cn-beihai"
  | "cn-imperial-orange"
  | "cn-wisteria"
  | "cn-sunset"
  | "cn-hutong"
  | "cn-dragon"
  | "cn-coral"
  | "cn-autumn"
  | "cn-vermilion";

export type PaletteSeriesId = "journal" | "curated" | "chinese-traditional" | "custom";

export const defaultVisualizationThemeId: JournalThemeId = "cn-beihai";
export const defaultVisualizationPaletteSeriesId: PaletteSeriesId = "chinese-traditional";

export type FigureFontId = "arial" | "helvetica" | "system" | "times" | "georgia" | "palatino";

export type DelimitedRow = Record<string, string>;

export type ParsedDataset = {
  headers: string[];
  rows: DelimitedRow[];
  delimiter: "tab" | "comma";
  errors: string[];
  warnings: string[];
};

export type FieldRole = {
  key: string;
  label: string;
  kind: "category" | "number" | "label";
  required: boolean;
};

export type PlotDefinition = {
  id: PlotType;
  name: string;
  family: string;
  summary: string;
  inputHint: string;
  roles: FieldRole[];
  defaultMapping: Record<string, string>;
  sampleData: string;
  examples?: PlotDataExample[];
};

export type PlotGuidance = {
  definition: string;
  suitableData: string;
  answers: string;
  origin?: string;
  references: PlotReference[];
};

export type PlotDataExample = {
  label: string;
  description: string;
  data: string;
  mapping?: Record<string, string>;
};

export type PlotReference = {
  citation: string;
  href: string;
};

export type JournalTheme = {
  id: JournalThemeId;
  series: PaletteSeriesId;
  name: string;
  description: string;
  categorical: string[];
  sequential: [string, string];
  diverging: [string, string, string];
  ink: string;
  muted: string;
  grid: string;
};

export const paletteSeries: Record<PaletteSeriesId, { id: PaletteSeriesId; name: string; description: string; themeIds: JournalThemeId[] }> = {
  journal: {
    id: "journal",
    name: "期刊配色",
    description: "Nature、Cell、Science 与临床医学期刊风格。",
    themeIds: ["nature", "cell", "science", "nejm", "lancet", "jama"],
  },
  curated: {
    id: "curated",
    name: "精选风格",
    description: "适合科研图表的克制型编辑配色与色盲友好方案。",
    themeIds: ["nordic", "earth", "colorblind"],
  },
  "chinese-traditional": {
    id: "chinese-traditional",
    name: "中国传统",
    description: "取自 Pixso 中国传统高级感配色色卡的九套东方配色。",
    themeIds: ["cn-beihai", "cn-imperial-orange", "cn-wisteria", "cn-sunset", "cn-hutong", "cn-dragon", "cn-coral", "cn-autumn", "cn-vermilion"],
  },
  custom: {
    id: "custom",
    name: "自定义",
    description: "保存并复用你手动调整过的科研图表配色。",
    themeIds: [],
  },
};

export const figureFontPresets: Record<FigureFontId, { id: FigureFontId; name: string; family: string; style: "sans" | "serif" }> = {
  arial: { id: "arial", name: "Arial", family: 'Arial, "Helvetica Neue", "PingFang SC", "Microsoft YaHei", sans-serif', style: "sans" },
  helvetica: { id: "helvetica", name: "Helvetica Neue", family: '"Helvetica Neue", Helvetica, Arial, "PingFang SC", "Microsoft YaHei", sans-serif', style: "sans" },
  system: { id: "system", name: "System Sans", family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Arial, "PingFang SC", "Microsoft YaHei", sans-serif', style: "sans" },
  times: { id: "times", name: "Times New Roman", family: '"Times New Roman", Times, "Songti SC", SimSun, serif', style: "serif" },
  georgia: { id: "georgia", name: "Georgia", family: 'Georgia, "Times New Roman", "Songti SC", SimSun, serif', style: "serif" },
  palatino: { id: "palatino", name: "Palatino", family: 'Palatino, "Palatino Linotype", "Songti SC", SimSun, serif', style: "serif" },
};

export type VisualizationSettings = {
  title: string;
  fontFamily: FigureFontId;
  xLabel: string;
  yLabel: string;
  xMin: number | null;
  xMax: number | null;
  yMin: number | null;
  yMax: number | null;
  width: number;
  height: number;
  titleSize: number;
  axisLabelSize: number;
  tickSize: number;
  legendSize: number;
  axisLineWidth: number;
  gridLineWidth: number;
  dataLineWidth: number;
  pointSize: number;
  opacity: number;
  grid: "none" | "y" | "both";
  legendPosition: "right" | "bottom" | "none";
  swapAxes: boolean;
  showTrend: boolean;
  showLabels: boolean;
  showPoints: boolean;
  showSampleSize: boolean;
  showBox: boolean;
  boxErrorType: "none" | "sd" | "sem" | "ci95";
  showDensity: boolean;
  showHistogram: boolean;
  distributionSummary: "none" | "median" | "mean";
  distributionShowPairedLines: boolean;
  distributionShowSignificance: boolean;
  distributionOrientation: "vertical" | "horizontal";
  histogramBins: number;
  barErrorType: "none" | "sd" | "sem";
  barVariant: "grouped" | "stacked" | "percentage" | "horizontal" | "bidirectional" | "faceted" | "polar" | "bullet" | "pyramid" | "axis-break" | "dual-axis" | "overlay";
  barInputMode: "summary" | "long";
  barOverlayType: "line" | "points";
  secondaryAxisLabel: string;
  showSignificance: boolean;
  significanceThreshold: number;
  axisBreakStart: number;
  axisBreakEnd: number;
  barGap: number;
  lineErrorType: "none" | "sd" | "sem" | "ci95";
  lineUncertaintyStyle: "bars" | "band";
  lineBandOpacity: number;
  associationVariant: "points" | "marginal" | "density" | "hexbin" | "ellipse" | "hull" | "pair-matrix" | "3d" | "ternary";
  associationFit: "none" | "linear" | "polynomial" | "loess";
  associationPolynomialDegree: 2 | 3;
  associationLoessSpan: number;
  associationShowConfidenceBand: boolean;
  associationShowPValue: boolean;
  associationGroupMode: "combined" | "by-group";
  associationHexbinSize: number;
  associationDensityBandwidth: number;
  barBorderWidth: number;
  barBorderColor: string;
  errorBarLineWidth: number;
  errorBarCapSize: number;
  violinBandwidth: number;
  violinWidth: number;
  foldChangeThreshold: number;
  pValueThreshold: number;
  labelLimit: number;
  heatmapScale: "row" | "column" | "none";
  heatmapColorMode: "diverging" | "sequential";
  heatmapDisplay: "rectangular" | "circular";
  heatmapTriangle: "full" | "lower" | "upper";
  heatmapDistance: "euclidean" | "correlation";
  heatmapLinkage: "average" | "complete" | "single";
  heatmapShowDendrograms: boolean;
  heatmapRowClusters: number;
  heatmapColumnClusters: number;
  heatmapShowValues: boolean;
  heatmapShowSidePlot: boolean;
  heatmapSidePlotStatistic: "mean" | "sd" | "range";
  heatmapLabelDensity: "auto" | "all" | "none";
  heatmapRowAnnotationData: string;
  heatmapColumnAnnotationData: string;
  correlationMethod: "pearson" | "spearman";
  xThreshold: number;
  yThreshold: number;
  clusterRows: boolean;
  clusterColumns: boolean;
  showRiskTable: boolean;
  forestReferenceValue: number;
  compositionLabelMode: "percent" | "value" | "both" | "none";
  donutHole: number;
  waffleCells: number;
  hierarchyGap: number;
  radarFillOpacity: number;
  radialMaximum: number | null;
  pyramidDisplayMode: "value" | "percent";
  categoricalColors: string[];
  continuousLow: string;
  continuousHigh: string;
  divergingLow: string;
  divergingMid: string;
  divergingHigh: string;
};

export const defaultVisualizationSettings: VisualizationSettings = {
  title: "",
  fontFamily: "arial",
  xLabel: "",
  yLabel: "",
  xMin: null,
  xMax: null,
  yMin: null,
  yMax: null,
  width: 340,
  height: 340,
  titleSize: 17,
  axisLabelSize: 14,
  tickSize: 11,
  legendSize: 11,
  axisLineWidth: 1.4,
  gridLineWidth: 0.8,
  dataLineWidth: 2,
  pointSize: 5,
  opacity: 0.82,
  grid: "y",
  legendPosition: "right",
  swapAxes: false,
  showTrend: true,
  showLabels: false,
  showPoints: true,
  showSampleSize: true,
  showBox: true,
  boxErrorType: "none",
  showDensity: false,
  showHistogram: false,
  distributionSummary: "median",
  distributionShowPairedLines: false,
  distributionShowSignificance: false,
  distributionOrientation: "vertical",
  histogramBins: 8,
  barErrorType: "none",
  barVariant: "grouped",
  barInputMode: "summary",
  barOverlayType: "line",
  secondaryAxisLabel: "Secondary value",
  showSignificance: false,
  significanceThreshold: 0.05,
  axisBreakStart: 5.5,
  axisBreakEnd: 6.5,
  barGap: 0.18,
  lineErrorType: "none",
  lineUncertaintyStyle: "bars",
  lineBandOpacity: 0.16,
  associationVariant: "points",
  associationFit: "none",
  associationPolynomialDegree: 2,
  associationLoessSpan: 0.65,
  associationShowConfidenceBand: false,
  associationShowPValue: false,
  associationGroupMode: "by-group",
  associationHexbinSize: 14,
  associationDensityBandwidth: 1,
  barBorderWidth: 0,
  barBorderColor: "#1D4C50",
  errorBarLineWidth: 1.5,
  errorBarCapSize: 14,
  violinBandwidth: 1,
  violinWidth: 0.34,
  foldChangeThreshold: 1,
  pValueThreshold: 0.05,
  labelLimit: 8,
  heatmapScale: "row",
  heatmapColorMode: "diverging",
  heatmapDisplay: "rectangular",
  heatmapTriangle: "lower",
  heatmapDistance: "euclidean",
  heatmapLinkage: "average",
  heatmapShowDendrograms: true,
  heatmapRowClusters: 3,
  heatmapColumnClusters: 3,
  heatmapShowValues: false,
  heatmapShowSidePlot: false,
  heatmapSidePlotStatistic: "mean",
  heatmapLabelDensity: "auto",
  heatmapRowAnnotationData: "",
  heatmapColumnAnnotationData: "",
  correlationMethod: "pearson",
  xThreshold: 0,
  yThreshold: 0,
  clusterRows: true,
  clusterColumns: true,
  showRiskTable: true,
  forestReferenceValue: 1,
  compositionLabelMode: "percent",
  donutHole: 0.54,
  waffleCells: 100,
  hierarchyGap: 2,
  radarFillOpacity: 0.16,
  radialMaximum: null,
  pyramidDisplayMode: "value",
  categoricalColors: ["#957454", "#1D4C50", "#D4A278", "#3F605B"],
  continuousLow: "#D4A278",
  continuousHigh: "#1D4C50",
  divergingLow: "#91A7A6",
  divergingMid: "#FAF7F2",
  divergingHigh: "#D3BBA4",
};

export const journalThemes: Record<JournalThemeId, JournalTheme> = {
  nature: {
    id: "nature",
    series: "journal",
    name: "Nature",
    description: "Cool blue, coral red, and restrained botanical accents.",
    categorical: ["#3C5488", "#E64B35", "#00A087", "#4DBBD5", "#F39B7F", "#8491B4", "#91D1C2", "#7E6148"],
    sequential: ["#E8F1F2", "#147A86"],
    diverging: ["#3C5488", "#F7F7F4", "#E64B35"],
    ink: "#23242A",
    muted: "#686A73",
    grid: "#E5E5E1",
  },
  cell: {
    id: "cell",
    series: "journal",
    name: "Cell",
    description: "Warm coral, teal, plum, and muted gold for mechanistic figures.",
    categorical: ["#C44E52", "#4C8B8B", "#8172B3", "#CCB974", "#4C72B0", "#DD8452", "#64A66A", "#937860"],
    sequential: ["#F4EEE5", "#A65A3A"],
    diverging: ["#4C72B0", "#FAF7F2", "#C44E52"],
    ink: "#252427",
    muted: "#6B6768",
    grid: "#E8E2DD",
  },
  science: {
    id: "science",
    series: "journal",
    name: "Science",
    description: "High-clarity navy, red, green, and purple with strong separation.",
    categorical: ["#3B4992", "#D64545", "#008B68", "#6A4C93", "#1F7A8C", "#A33D5D", "#7B8F3A", "#6B6D76"],
    sequential: ["#E9EEF6", "#315B88"],
    diverging: ["#3B4992", "#F7F7F7", "#D64545"],
    ink: "#1F2025",
    muted: "#62656D",
    grid: "#E2E4E8",
  },
  nejm: {
    id: "nejm",
    series: "journal",
    name: "NEJM",
    description: "Clinical oxblood, steel blue, muted teal, and restrained ochre.",
    categorical: ["#8E2C3A", "#356A87", "#4E8174", "#C18A3B", "#71627C", "#7C8F99", "#B96A58", "#8B7A64"],
    sequential: ["#F5ECEE", "#8E2C3A"],
    diverging: ["#356A87", "#F8F6F2", "#A33A45"],
    ink: "#252326",
    muted: "#6E686B",
    grid: "#E8E3E2",
  },
  lancet: {
    id: "lancet",
    series: "journal",
    name: "Lancet",
    description: "Editorial burgundy, deep teal, warm amber, and composed slate.",
    categorical: ["#8C294A", "#006D77", "#D49A3A", "#536B87", "#816A8D", "#577C67", "#B9654F", "#74777E"],
    sequential: ["#F5EBEF", "#8C294A"],
    diverging: ["#006D77", "#FAF7F2", "#A64050"],
    ink: "#262326",
    muted: "#6D686C",
    grid: "#E7E2E4",
  },
  jama: {
    id: "jama",
    series: "journal",
    name: "JAMA",
    description: "Medical teal, burnished orange, clear cyan, and muted wine.",
    categorical: ["#374E55", "#DF8F44", "#00A1D5", "#B24745", "#79AF97", "#6A6599", "#80796B", "#5C8290"],
    sequential: ["#EDF2F2", "#374E55"],
    diverging: ["#007FA3", "#F7F6F2", "#B24745"],
    ink: "#23282A",
    muted: "#687176",
    grid: "#E2E7E7",
  },
  nordic: {
    id: "nordic",
    series: "curated",
    name: "Nordic",
    description: "Cool navy and fjord teal balanced by clay, straw, and soft violet.",
    categorical: ["#294C60", "#5B8E8D", "#C7785A", "#A49B62", "#776987", "#688292", "#D0A15F", "#547064"],
    sequential: ["#EAF1F2", "#294C60"],
    diverging: ["#3E7188", "#F7F5EF", "#C7785A"],
    ink: "#22282C",
    muted: "#647078",
    grid: "#E1E7E8",
  },
  earth: {
    id: "earth",
    series: "curated",
    name: "Earth",
    description: "Botanical green, terracotta, ochre, aubergine, and mineral blue.",
    categorical: ["#405D53", "#B86B4B", "#C19745", "#6F5C78", "#718355", "#986A5A", "#4F7880", "#85725B"],
    sequential: ["#F1EFE5", "#405D53"],
    diverging: ["#4F7880", "#F6F2E8", "#B86B4B"],
    ink: "#292825",
    muted: "#706D65",
    grid: "#E7E3D8",
  },
  colorblind: {
    id: "colorblind",
    series: "curated",
    name: "Colorblind",
    description: "Okabe–Ito-derived contrasts tuned for legibility on a white background.",
    categorical: ["#0072B2", "#D55E00", "#009E73", "#CC79A7", "#C58A00", "#56B4E9", "#6B6B6B", "#8A6E00"],
    sequential: ["#E8F2F7", "#0072B2"],
    diverging: ["#0072B2", "#F7F7F3", "#D55E00"],
    ink: "#222426",
    muted: "#666B70",
    grid: "#E2E6E8",
  },
  "cn-beihai": {
    id: "cn-beihai",
    series: "chinese-traditional",
    name: "柴染棕",
    description: "北海公园：柴染棕、青灰蓝、薄香橙与飞泉青。",
    categorical: ["#957454", "#1D4C50", "#D4A278", "#3F605B"],
    sequential: ["#D4A278", "#1D4C50"],
    diverging: ["#91A7A6", "#FAF7F2", "#D3BBA4"],
    ink: "#1D4C50",
    muted: "#957454",
    grid: "#F1E7E5",
  },
  "cn-imperial-orange": {
    id: "cn-imperial-orange",
    series: "chinese-traditional",
    name: "橙绯红",
    description: "贵气天成：橙绯红、石槲绿、洗柿橙与伽罗褐。",
    categorical: ["#DB5E40", "#2E2F25", "#E68959", "#866040"],
    sequential: ["#E68959", "#2E2F25"],
    diverging: ["#A3A59F", "#FCF8F3", "#D8B09B"],
    ink: "#2E2F25",
    muted: "#866040",
    grid: "#F1E7E5",
  },
  "cn-wisteria": {
    id: "cn-wisteria",
    series: "chinese-traditional",
    name: "淡藤萝紫",
    description: "园博园：淡藤萝紫、青灰蓝、赤白橡与芦穗灰。",
    categorical: ["#F1E7E5", "#1D4C50", "#D3A488", "#BDAEAD"],
    sequential: ["#F1E7E5", "#1D4C50"],
    diverging: ["#9AAEAE", "#FCF9F8", "#DFC4B7"],
    ink: "#1D4C50",
    muted: "#BDAEAD",
    grid: "#F1E7E5",
  },
  "cn-sunset": {
    id: "cn-sunset",
    series: "chinese-traditional",
    name: "瓜瓤粉",
    description: "夕阳古楼：瓜瓤粉、长石灰、金莺黄与淡玫瑰灰。",
    categorical: ["#F7CD9B", "#313534", "#F0A72E", "#AE7F77"],
    sequential: ["#F7CD9B", "#313534"],
    diverging: ["#A4AAA8", "#FFF9F2", "#D8BDB7"],
    ink: "#313534",
    muted: "#AE7F77",
    grid: "#F1E7E5",
  },
  "cn-hutong": {
    id: "cn-hutong",
    series: "chinese-traditional",
    name: "蓝墨茶",
    description: "京城胡同：蓝墨茶、赤白橡、中红驼与岩碇黑。",
    categorical: ["#3E443C", "#D3A488", "#8B6B5B", "#24271E"],
    sequential: ["#D3A488", "#24271E"],
    diverging: ["#A4AAA3", "#FAF7F3", "#CBB4A7"],
    ink: "#24271E",
    muted: "#8B6B5B",
    grid: "#F1E7E5",
  },
  "cn-dragon": {
    id: "cn-dragon",
    series: "chinese-traditional",
    name: "棉絮灰",
    description: "盘龙纹：棉絮灰、老茶棕、淡红穹与苍灰绿。",
    categorical: ["#B5A59B", "#655045", "#AF5F54", "#3B4E3D"],
    sequential: ["#B5A59B", "#3B4E3D"],
    diverging: ["#9FAC9F", "#FAF7F5", "#D4A8A2"],
    ink: "#3B4E3D",
    muted: "#655045",
    grid: "#F1E7E5",
  },
  "cn-coral": {
    id: "cn-coral",
    series: "chinese-traditional",
    name: "珊瑚朱",
    description: "京城脚下：珊瑚朱、铜器青、藏花红与淡土棕。",
    categorical: ["#DB785C", "#283F3E", "#E9A182", "#824E40"],
    sequential: ["#E9A182", "#283F3E"],
    diverging: ["#91A7A4", "#FCF8F4", "#D7AC9D"],
    ink: "#283F3E",
    muted: "#824E40",
    grid: "#F1E7E5",
  },
  "cn-autumn": {
    id: "cn-autumn",
    series: "chinese-traditional",
    name: "杏叶黄",
    description: "故宫之秋：杏叶黄、岩碇黑、穹灰蓝与鹿角棕。",
    categorical: ["#E5B552", "#24271E", "#CCD8D0", "#DFBE96"],
    sequential: ["#CCD8D0", "#24271E"],
    diverging: ["#9EA8A2", "#FBF9F3", "#DCCB9C"],
    ink: "#24271E",
    muted: "#DFBE96",
    grid: "#F1E7E5",
  },
  "cn-vermilion": {
    id: "cn-vermilion",
    series: "chinese-traditional",
    name: "中国红",
    description: "青铜兽环：中国红、深栗棕、淡枣红与鹿角棕。",
    categorical: ["#BF1103", "#580F05", "#970804", "#DFBE96"],
    sequential: ["#DFBE96", "#580F05"],
    diverging: ["#B69B96", "#FCF7F3", "#D2A29B"],
    ink: "#580F05",
    muted: "#970804",
    grid: "#F1E7E5",
  },
};

function buildUmapExample() {
  const clusters = [
    { group: "Control", cx: -3.1, cy: 1.5, count: 24 },
    { group: "Responder", cx: 0.2, cy: -1.8, count: 26 },
    { group: "Resistant", cx: 3.4, cy: 1.2, count: 24 },
  ];
  const rows = clusters.flatMap(({ group, cx, cy, count }) => Array.from({ length: count }, (_, index) => {
    const angle = index * 2.3999632297;
    const radius = 0.18 + 0.11 * Math.sqrt(index + 1);
    const x = cx + Math.cos(angle) * radius * 1.35 + Math.sin(index * 0.73) * 0.12;
    const y = cy + Math.sin(angle) * radius * 0.82 + Math.cos(index * 0.51) * 0.1;
    return `${group.slice(0, 3)}_${String(index + 1).padStart(2, "0")}\t${x.toFixed(3)}\t${y.toFixed(3)}\t${group}`;
  }));
  return `sample\tdim1\tdim2\tgroup\n${rows.join("\n")}`;
}

function buildGseaExample() {
  const totalRanks = 100;
  const hitLabels = new Map<number, string>([
    [3, "TP53"], [5, "CDKN1A"], [8, "BAX"], [12, "BBC3"], [16, "GADD45A"],
    [21, "FAS"], [27, "CASP8"], [35, "MDM2"], [49, "SESN1"], [68, "DDB2"],
  ]);
  const hitIncrement = 0.11;
  const missDecrement = (hitLabels.size * hitIncrement) / (totalRanks - hitLabels.size);
  let score = 0;
  const rows = Array.from({ length: totalRanks }, (_, index) => {
    const rank = index + 1;
    const geneLabel = hitLabels.get(rank);
    score += geneLabel ? hitIncrement : -missDecrement;
    if (rank === totalRanks) score = 0;
    return `${rank}\t${score.toFixed(4)}\t${geneLabel ? 1 : 0}\t${geneLabel ?? "—"}`;
  });
  return `rank\trunningES\thit\tlabel\n${rows.join("\n")}`;
}

function buildKaplanMeierExample() {
  const highRisk = Array.from({ length: 24 }, (_, index) => {
    const time = 2 + index * 0.9 + (index % 3) * 0.25;
    const event = index % 6 === 4 ? 0 : 1;
    return `${time.toFixed(1)}\t${event}\tHigh risk`;
  });
  const lowRisk = Array.from({ length: 24 }, (_, index) => {
    const time = 4 + index * 1.25 + (index % 4) * 0.35;
    const event = index < 8 ? (index % 4 === 3 ? 1 : 0) : (index % 3 === 1 ? 1 : 0);
    return `${time.toFixed(1)}\t${event}\tLow risk`;
  });
  return `time\tevent\tgroup\n${[...highRisk, ...lowRisk].join("\n")}`;
}

function buildHeatmapExample() {
  const genes = [
    "TP53", "CDKN1A", "BAX", "BBC3", "EGFR", "ERBB2", "MYC", "CCND1",
    "MKI67", "PCNA", "TOP2A", "BIRC5", "EPCAM", "CDH1", "KRT8", "KRT18",
    "VIM", "SNAI1", "SNAI2", "ZEB1", "BCL2", "MCL1", "GAPDH", "ACTB",
  ];
  const samples = [
    ...Array.from({ length: 6 }, (_, index) => `Control_${index + 1}`),
    ...Array.from({ length: 6 }, (_, index) => `Treatment_${index + 1}`),
  ];
  const rows = genes.map((gene, geneIndex) => {
    const moduleIndex = Math.floor(geneIndex / 4);
    const base = 5.1 + (geneIndex % 5) * 0.48 + Math.floor(geneIndex / 8) * 0.22;
    const values = samples.map((_, sampleIndex) => {
      const treated = sampleIndex >= 6;
      const replicate = sampleIndex % 6;
      const direction = moduleIndex % 4 === 0 ? 1.65 : moduleIndex % 4 === 1 ? -1.45 : moduleIndex % 4 === 2 ? 1.05 : moduleIndex % 4 === 3 ? -0.9 : 0;
      const biologicalShift = treated ? direction : 0;
      const replicateEffect = Math.sin((geneIndex + 1) * 0.81 + replicate * 1.17) * 0.2;
      const batchEffect = (replicate - 2.5) * 0.035 + (sampleIndex % 2 ? 0.06 : -0.04);
      return (base + biologicalShift + replicateEffect + batchEffect).toFixed(2);
    });
    return `${gene}\t${values.join("\t")}`;
  });
  return `gene\t${samples.join("\t")}\n${rows.join("\n")}`;
}

function buildRocExample() {
  const models = [
    { name: "Model A", positiveBase: 0.54, positiveSpan: 0.43, negativeBase: 0.13, negativeSpan: 0.62 },
    { name: "Model B", positiveBase: 0.42, positiveSpan: 0.48, negativeBase: 0.18, negativeSpan: 0.64 },
  ];
  const rows = models.flatMap((model, modelIndex) => Array.from({ length: 60 }, (_, index) => {
    const truth = index % 2 === 0 ? 1 : 0;
    const rank = Math.floor(index / 2) / 29;
    const wave = Math.sin((index + 1) * (modelIndex + 1) * 1.37) * 0.035;
    const score = truth
      ? model.positiveBase + model.positiveSpan * (1 - rank) + wave
      : model.negativeBase + model.negativeSpan * (1 - rank) - wave;
    return `${truth}\t${Math.max(0.01, Math.min(0.99, score)).toFixed(4)}\t${model.name}`;
  }));
  return `truth\tscore\tmodel\n${rows.join("\n")}`;
}

const samples = {
  bar: `category\tvalue\tsd\tsem\tgroup
Control\t4.2\t0.45\t0.20\tControl
Treatment A\t7.8\t0.72\t0.32\tTreatment A
Treatment B\t6.3\t0.58\t0.26\tTreatment B
Treatment C\t9.1\t0.81\t0.36\tTreatment C`,
  barCount: `category\tvalue\tgroup
Low\t18\tNight A
Medium\t32\tNight B
High\t27\tNight C
Very high\t14\tNight D`,
  barLong: `category\tvalue\tgroup\tfacet
Day 1\t3.7\tControl\tEarly
Day 1\t3.9\tControl\tEarly
Day 1\t4.0\tControl\tEarly
Day 1\t4.4\tTreatment\tEarly
Day 1\t4.6\tTreatment\tEarly
Day 1\t4.7\tTreatment\tEarly
Day 7\t7.1\tControl\tLate
Day 7\t7.3\tControl\tLate
Day 7\t7.2\tControl\tLate
Day 7\t8.2\tTreatment\tLate
Day 7\t8.5\tTreatment\tLate
Day 7\t8.4\tTreatment\tLate`,
  barVariants: `category\tvalue\tsd\tgroup\tsecondary\ttarget\tp_value\tfacet
Day 1\t3.8\t0.31\tControl\t4.0\t4.5\t0.41\tEarly
Day 1\t4.2\t0.36\tTreatment A\t4.4\t4.8\t0.12\tEarly
Day 1\t4.5\t0.40\tTreatment B\t4.6\t5.0\t0.032\tEarly
Day 1\t4.8\t0.42\tTreatment C\t4.9\t5.2\t0.008\tEarly
Day 7\t7.2\t0.54\tControl\t6.8\t7.5\t0.18\tLate
Day 7\t7.8\t0.61\tTreatment A\t7.4\t8.1\t0.041\tLate
Day 7\t8.4\t0.66\tTreatment B\t8.0\t8.8\t0.006\tLate
Day 7\t9.0\t0.72\tTreatment C\t8.6\t9.4\t0.0007\tLate`,
  line: `time\tvalue\tsd\tsem\tseries
0\t1.0\t0.12\t0.05\tControl
1\t1.3\t0.16\t0.07\tControl
2\t1.6\t0.18\t0.08\tControl
3\t1.8\t0.21\t0.09\tControl
0\t1.0\t0.14\t0.06\tTreatment
1\t2.1\t0.24\t0.11\tTreatment
2\t3.5\t0.31\t0.14\tTreatment
3\t4.4\t0.38\t0.17\tTreatment`,
  lineNoError: `time\tvalue\tseries
0\t1.0\tControl
1\t1.3\tControl
2\t1.6\tControl
3\t1.8\tControl
0\t1.0\tTreatment
1\t2.1\tTreatment
2\t3.5\tTreatment
3\t4.4\tTreatment`,
  scatter: `x\ty\tgroup\tlabel
1.2\t1.6\tControl\tS1
1.8\t2.1\tControl\tS2
2.2\t2.4\tControl\tS3
2.5\t3.4\tTreatment\tS4
3.2\t3.7\tTreatment\tS5
3.8\t4.6\tTreatment\tS6
4.4\t5.0\tTreatment\tS7`,
  scatterThreeAxis: `x\ty\tz\tgroup\tlabel
0.62\t0.24\t0.14\tControl\tS1
0.55\t0.31\t0.14\tControl\tS2
0.48\t0.36\t0.16\tControl\tS3
0.41\t0.42\t0.17\tControl\tS4
0.30\t0.50\t0.20\tTreatment\tS5
0.24\t0.55\t0.21\tTreatment\tS6
0.20\t0.49\t0.31\tTreatment\tS7
0.16\t0.44\t0.40\tTreatment\tS8
0.12\t0.38\t0.50\tTreatment\tS9`,
  pca: `feature_id\tControl_1_count\tControl_2_count\tControl_3_count\tTreatment_1_count\tTreatment_2_count\tTreatment_3_count
Feature_A\t120\t132\t118\t420\t398\t445
Feature_B\t560\t585\t542\t190\t205\t178
Feature_C\t88\t94\t91\t260\t248\t275
Feature_D\t310\t298\t325\t305\t318\t300
Feature_E\t45\t52\t49\t160\t148\t172
Feature_F\t720\t690\t735\t410\t395\t430
Feature_G\t205\t215\t198\t520\t548\t505
Feature_H\t150\t142\t158\t155\t148\t162`,
  pcaAbundance: `feature_id\tControl_1_tpm\tControl_2_tpm\tControl_3_tpm\tTreatment_1_tpm\tTreatment_2_tpm\tTreatment_3_tpm
Feature_A\t3.2\t3.4\t3.1\t8.9\t8.4\t9.1
Feature_B\t12.5\t12.9\t12.1\t5.2\t5.5\t5.0
Feature_C\t2.1\t2.3\t2.2\t6.8\t6.4\t7.0
Feature_D\t7.4\t7.0\t7.6\t7.2\t7.5\t7.1
Feature_E\t1.0\t1.2\t1.1\t4.6\t4.3\t4.8
Feature_F\t15.8\t15.1\t16.0\t9.2\t8.8\t9.5
Feature_G\t4.9\t5.1\t4.7\t11.3\t11.9\t10.8
Feature_H\t3.6\t3.4\t3.8\t3.7\t3.5\t3.9`,
  distribution: `group\tvalue
Control\t4.1
Control\t4.6
Control\t4.8
Control\t5.0
Control\t5.4
Treatment A\t5.5
Treatment A\t6.2
Treatment A\t6.4
Treatment A\t6.8
Treatment A\t7.4
Treatment B\t4.9
Treatment B\t5.6
Treatment B\t6.1
Treatment B\t7.0
Treatment B\t7.8`,
  distributionPaired: `subject\tgroup\tvalue\tfacet\tp_value
S01\tControl\t4.1\tDiscovery\t0.032
S01\tTreatment\t5.5\tDiscovery\t0.032
S02\tControl\t4.6\tDiscovery\t0.032
S02\tTreatment\t6.2\tDiscovery\t0.032
S03\tControl\t4.8\tDiscovery\t0.032
S03\tTreatment\t6.4\tDiscovery\t0.032
S04\tControl\t4.3\tValidation\t0.018
S04\tTreatment\t5.8\tValidation\t0.018
S05\tControl\t4.9\tValidation\t0.018
S05\tTreatment\t6.7\tValidation\t0.018
S06\tControl\t5.1\tValidation\t0.018
S06\tTreatment\t7.0\tValidation\t0.018`,
  volcano: `gene\tlog2FC\tpadj
TP53\t-2.8\t0.0002
EGFR\t2.4\t0.0008
MYC\t1.8\t0.004
KRAS\t1.2\t0.018
CDKN2A\t-1.9\t0.006
MKI67\t1.5\t0.012
VIM\t0.7\t0.032
GAPDH\t0.2\t0.61
ACTB\t-0.3\t0.44
EPCAM\t-1.1\t0.021
MUC1\t0.9\t0.084
SOX2\t2.1\t0.0014`,
  heatmap: buildHeatmapExample(),
  enrichment: `term\tgeneRatio\tcount\tpadj\tgroup
Cell cycle\t0.36\t18\t0.0003\tBP
DNA repair\t0.30\t15\t0.0012\tBP
Apoptosis\t0.24\t12\t0.0041\tBP
PI3K-AKT signaling\t0.32\t16\t0.0008\tKEGG
p53 signaling\t0.22\t11\t0.0063\tKEGG
Focal adhesion\t0.18\t9\t0.018\tKEGG`,
  enrichmentFraction: `term\tgeneRatio\tcount\tpadj\tgroup
Cell cycle\t18/50\t18\t0.0003\tBP
DNA repair\t15/50\t15\t0.0012\tBP
Apoptosis\t12/50\t12\t0.0041\tBP
PI3K-AKT signaling\t16/50\t16\t0.0008\tKEGG
p53 signaling\t11/50\t11\t0.0063\tKEGG
Focal adhesion\t9/50\t9\t0.018\tKEGG`,
  ma: `gene\tmeanExpression\tlog2FC\tpadj
TP53\t240.5\t-2.8\t0.0002
EGFR\t1580.2\t2.4\t0.0008
MYC\t820.4\t1.8\t0.004
KRAS\t430.8\t1.2\t0.018
CDKN2A\t95.1\t-1.9\t0.006
MKI67\t610.7\t1.5\t0.012
GAPDH\t8900.4\t0.2\t0.61`,
  quadrant: `label\tx\ty\tgroup
Gene A\t1.8\t2.4\tQ1
Gene B\t-1.4\t2.1\tQ2
Gene C\t-2.0\t-1.5\tQ3
Gene D\t1.2\t-2.2\tQ4
Gene E\t0.4\t1.0\tQ1
Gene F\t-0.8\t-0.7\tQ3`,
  errorbar: `category\tmean\tsd\tsem\tgroup
Control\t4.2\t0.45\t0.20\tBaseline
Treatment A\t7.8\t0.72\t0.32\tResponse
Treatment B\t6.3\t0.58\t0.26\tResponse
Treatment C\t9.1\t0.81\t0.36\tResponse`,
  area: `time\tvalue\tseries
0\t1.0\tControl
1\t1.4\tControl
2\t1.8\tControl
3\t2.1\tControl
0\t1.0\tTreatment
1\t2.2\tTreatment
2\t3.4\tTreatment
3\t4.1\tTreatment`,
  lollipop: `category\tvalue\tgroup
Cell cycle\t8.4\tBP
DNA repair\t6.8\tBP
PI3K-AKT\t5.9\tKEGG
p53 signaling\t4.7\tKEGG
Apoptosis\t3.8\tBP`,
  pcoa: `sample\tdim1\tdim2\tgroup
Control_1\t-2.1\t0.8\tControl
Control_2\t-1.6\t1.2\tControl
Control_3\t-1.9\t0.2\tControl
Treatment_1\t1.4\t-0.5\tTreatment
Treatment_2\t2.0\t-0.9\tTreatment
Treatment_3\t1.7\t0.1\tTreatment`,
  umap: buildUmapExample(),
  gsea: buildGseaExample(),
  km: buildKaplanMeierExample(),
  forest: `label\testimate\tlower\tupper\tgroup
Age (per 10 years)\t1.22\t1.05\t1.42\tClinical
Male vs female\t1.11\t0.84\t1.47\tClinical
Stage III-IV\t2.08\t1.45\t2.98\tClinical
High signature\t1.73\t1.20\t2.49\tMolecular`,
  roc: buildRocExample(),
  sets: `item\tset
TP53\tRNA-seq
EGFR\tRNA-seq
MYC\tRNA-seq
TP53\tProteomics
MYC\tProteomics
AKT1\tProteomics
TP53\tCRISPR
AKT1\tCRISPR
KRAS\tCRISPR`,
  network: `source\ttarget\tvalue\tgroup
Tumor\tT cell\t18\tImmune
Tumor\tMacrophage\t12\tImmune
Fibroblast\tTumor\t10\tStroma
Macrophage\tT cell\t7\tImmune
Endothelial\tTumor\t6\tStroma`,
  composition: `category\tvalue
Immune\t34
Stromal\t27
Epithelial\t21
Endothelial\t11
Other\t7`,
  rose: `category\tvalue
Baseline\t42
Week 2\t58
Week 4\t76
Week 6\t64
Week 8\t51
Week 10\t37`,
  hierarchy: `node\tparent\tvalue
All samples\t\t0
Immune\tAll samples\t0
Lymphoid\tImmune\t0
Myeloid\tImmune\t0
T cells\tLymphoid\t32
B cells\tLymphoid\t18
Macrophages\tMyeloid\t24
Dendritic cells\tMyeloid\t10
Stromal\tAll samples\t0
Fibroblasts\tStromal\t12
Endothelial\tStromal\t4`,
  radar: `feature\tvalue\tseries
Sensitivity\t0.88\tModel A
Specificity\t0.81\tModel A
Precision\t0.77\tModel A
Recall\t0.88\tModel A
Calibration\t0.72\tModel A
Robustness\t0.79\tModel A
Sensitivity\t0.79\tModel B
Specificity\t0.90\tModel B
Precision\t0.83\tModel B
Recall\t0.79\tModel B
Calibration\t0.84\tModel B
Robustness\t0.74\tModel B`,
  polarProfile: `angle\tvalue\tseries
ZT0\t1.2\tControl
ZT4\t1.8\tControl
ZT8\t3.1\tControl
ZT12\t4.0\tControl
ZT16\t2.7\tControl
ZT20\t1.5\tControl
ZT0\t1.1\tTreatment
ZT4\t2.4\tTreatment
ZT8\t4.2\tTreatment
ZT12\t3.3\tTreatment
ZT16\t2.0\tTreatment
ZT20\t1.2\tTreatment`,
  populationPyramid: `category\tvalue\tgroup
0-19\t18\tFemale
20-39\t31\tFemale
40-59\t27\tFemale
60-79\t17\tFemale
80+\t7\tFemale
0-19\t20\tMale
20-39\t33\tMale
40-59\t25\tMale
60-79\t15\tMale
80+\t5\tMale`,
  circos: `sourceChr\tsourceStart\tsourceEnd\ttargetChr\ttargetStart\ttargetEnd\tvalue
chr1\t12000000\t18000000\tchr5\t42000000\t47000000\t8
chr2\t35000000\t39000000\tchr8\t76000000\t80000000\t5
chr5\t60000000\t65000000\tchr12\t22000000\t26000000\t7
chr8\t18000000\t23000000\tchr1\t90000000\t96000000\t4`,
};

const plotDefinitionSeeds: PlotDefinition[] = [
  {
    id: "bar",
    name: "Bar",
    family: "Comparison",
    summary: "One categorical family for grouped, stacked, radial, target, overlay, and uncertainty comparisons.",
    inputHint: "Summary mode uses one row per category/group; long-form mode aggregates replicate observations into means and SD/SEM.",
    roles: [
      { key: "category", label: "Category", kind: "category", required: true },
      { key: "value", label: "Value", kind: "number", required: true },
      { key: "error", label: "Error magnitude (SD / SEM)", kind: "number", required: false },
      { key: "group", label: "Group", kind: "category", required: false },
      { key: "secondary", label: "Secondary value", kind: "number", required: false },
      { key: "target", label: "Target value", kind: "number", required: false },
      { key: "pValue", label: "P value", kind: "number", required: false },
      { key: "facet", label: "Facet", kind: "category", required: false },
    ],
    defaultMapping: { category: "category", value: "value", error: "sd", group: "group", secondary: "secondary", target: "target", pValue: "p_value", facet: "facet" },
    sampleData: samples.barVariants,
    examples: [
      { label: "Example 1", description: "Summary values with uncertainty, secondary values, targets, P values, and facets.", data: samples.barVariants, mapping: { category: "category", value: "value", error: "sd", group: "group", secondary: "secondary", target: "target", pValue: "p_value", facet: "facet" } },
      { label: "Example 2", description: "Long-form replicate observations; select Long-form observations to calculate means and uncertainty.", data: samples.barLong, mapping: { category: "category", value: "value", error: "", group: "group", secondary: "", target: "", pValue: "", facet: "facet" } },
      { label: "Example 3", description: "Category counts or proportions without uncertainty.", data: samples.barCount, mapping: { category: "category", value: "value", error: "", group: "group", secondary: "", target: "", pValue: "", facet: "" } },
    ],
  },
  {
    id: "line",
    name: "Line",
    family: "Trend",
    summary: "Time-course or ordered trend with multiple series and visible markers.",
    inputHint: "One row per ordered estimate. Map an optional non-negative SD, SEM, or 95% CI half-width column and display it as bars or a ribbon.",
    roles: [
      { key: "x", label: "X", kind: "number", required: true },
      { key: "value", label: "Value", kind: "number", required: true },
      { key: "error", label: "Uncertainty half-width (SD / SEM / 95% CI)", kind: "number", required: false },
      { key: "series", label: "Series", kind: "category", required: false },
    ],
    defaultMapping: { x: "time", value: "value", error: "sd", series: "series" },
    sampleData: samples.line,
    examples: [
      { label: "Example 1", description: "Ordered means with SD and SEM columns.", data: samples.line, mapping: { x: "time", value: "value", error: "sd", series: "series" } },
      { label: "Example 2", description: "Ordered observations without an error column.", data: samples.lineNoError, mapping: { x: "time", value: "value", error: "", series: "series" } },
    ],
  },
  {
    id: "scatter",
    name: "Scatter",
    family: "Association",
    summary: "Compact association views from points and marginals to fitted, dense, three-axis, and compositional encodings.",
    inputHint: "One row per observation. X and Y are required; Z is additionally required for pair-matrix, 3D, and ternary views.",
    roles: [
      { key: "x", label: "X", kind: "number", required: true },
      { key: "y", label: "Y", kind: "number", required: true },
      { key: "z", label: "Z / third component", kind: "number", required: false },
      { key: "group", label: "Group", kind: "category", required: false },
      { key: "label", label: "Label", kind: "label", required: false },
    ],
    defaultMapping: { x: "x", y: "y", z: "", group: "group", label: "label" },
    sampleData: samples.scatter,
    examples: [
      { label: "Example 1", description: "Two-axis grouped observations for point, fit, marginal, density, hexbin, ellipse, and hull views.", data: samples.scatter, mapping: { x: "x", y: "y", z: "", group: "group", label: "label" } },
      { label: "Example 2", description: "Three non-negative components for pair-matrix, orthographic 3D, and normalized ternary views.", data: samples.scatterThreeAxis, mapping: { x: "x", y: "y", z: "z", group: "group", label: "label" } },
    ],
  },
  {
    id: "pca",
    name: "PCA",
    family: "Dimension reduction",
    summary: "Principal component analysis calculated from a wide high-dimensional feature matrix.",
    inputHint: "Wide matrix: the first column identifies features and remaining columns are observations. Inputs may be counts, non-negative abundance measurements, or already normalized continuous values.",
    roles: [
      { key: "x", label: "X component", kind: "number", required: true },
      { key: "y", label: "Y component", kind: "number", required: true },
      { key: "group", label: "Group", kind: "category", required: false },
      { key: "label", label: "Observation label", kind: "label", required: false },
    ],
    defaultMapping: { x: "PC1", y: "PC2", group: "group", label: "sample" },
    sampleData: samples.pca,
    examples: [
      { label: "Example 1", description: "Wide feature matrix with raw count columns.", data: samples.pca },
      { label: "Example 2", description: "Wide feature matrix with TPM/abundance columns.", data: samples.pcaAbundance },
    ],
  },
  {
    id: "box",
    name: "Box",
    family: "Distribution",
    summary: "Median, IQR, whiskers, and all observations without hiding sample size.",
    inputHint: "Long format: one row per observation.",
    roles: [
      { key: "group", label: "Group", kind: "category", required: true },
      { key: "value", label: "Value", kind: "number", required: true },
      { key: "subject", label: "Subject / pair ID", kind: "label", required: false },
      { key: "facet", label: "Facet", kind: "category", required: false },
      { key: "pValue", label: "Facet / comparison P value", kind: "number", required: false },
    ],
    defaultMapping: { group: "group", value: "value", subject: "", facet: "", pValue: "" },
    sampleData: samples.distribution,
    examples: [
      { label: "Example 1", description: "Independent long-form observations grouped by condition.", data: samples.distribution, mapping: { group: "group", value: "value", subject: "", facet: "", pValue: "" } },
      { label: "Example 2", description: "Paired observations with subject IDs, facets, and supplied group P values.", data: samples.distributionPaired, mapping: { group: "group", value: "value", subject: "subject", facet: "facet", pValue: "p_value" } },
    ],
  },
  {
    id: "violin",
    name: "Violin",
    family: "Distribution",
    summary: "Kernel-density distribution with median and raw observations.",
    inputHint: "Long format. At least three values per group are recommended.",
    roles: [
      { key: "group", label: "Group", kind: "category", required: true },
      { key: "value", label: "Value", kind: "number", required: true },
      { key: "subject", label: "Subject / pair ID", kind: "label", required: false },
      { key: "facet", label: "Facet", kind: "category", required: false },
      { key: "pValue", label: "Facet / comparison P value", kind: "number", required: false },
    ],
    defaultMapping: { group: "group", value: "value", subject: "", facet: "", pValue: "" },
    sampleData: samples.distribution,
    examples: [
      { label: "Example 1", description: "Independent long-form observations grouped by condition.", data: samples.distribution, mapping: { group: "group", value: "value", subject: "", facet: "", pValue: "" } },
      { label: "Example 2", description: "Paired observations with subject IDs, facets, and supplied group P values.", data: samples.distributionPaired, mapping: { group: "group", value: "value", subject: "subject", facet: "facet", pValue: "p_value" } },
    ],
  },
  {
    id: "volcano",
    name: "Volcano",
    family: "Differential analysis",
    summary: "Effect size versus significance with explicit FC and FDR thresholds.",
    inputHint: "Use adjusted P values when available; values must be greater than zero.",
    roles: [
      { key: "label", label: "Gene label", kind: "label", required: true },
      { key: "effect", label: "log2 fold change", kind: "number", required: true },
      { key: "pValue", label: "Adjusted P value", kind: "number", required: true },
    ],
    defaultMapping: { label: "gene", effect: "log2FC", pValue: "padj" },
    sampleData: samples.volcano,
  },
  {
    id: "heatmap",
    name: "Heatmap",
    family: "Matrix",
    summary: "Compact expression matrix with row scaling and a centered diverging scale.",
    inputHint: "First column is the row label; remaining columns must be numeric samples.",
    roles: [],
    defaultMapping: {},
    sampleData: samples.heatmap,
  },
  {
    id: "enrichment",
    name: "Enrichment dot",
    family: "Enrichment",
    summary: "Term, ratio, count, and FDR encoded independently and legibly.",
    inputHint: "One row per term. Ratios may be decimals or fractions such as 8/40.",
    roles: [
      { key: "term", label: "Term", kind: "label", required: true },
      { key: "ratio", label: "Gene ratio", kind: "number", required: true },
      { key: "count", label: "Gene count", kind: "number", required: true },
      { key: "pValue", label: "Adjusted P value", kind: "number", required: true },
      { key: "group", label: "Ontology / group", kind: "category", required: false },
    ],
    defaultMapping: { term: "term", ratio: "geneRatio", count: "count", pValue: "padj", group: "group" },
    sampleData: samples.enrichment,
    examples: [
      { label: "Example 1", description: "Gene ratio supplied as decimals.", data: samples.enrichment },
      { label: "Example 2", description: "Gene ratio supplied as fractions such as 18/50.", data: samples.enrichmentFraction },
    ],
  },
  {
    id: "correlation",
    name: "Correlation",
    family: "Association",
    summary: "Association views with explicit Pearson or Spearman statistics, optional P values, fitted curves, and confidence bands.",
    inputHint: "One row per paired observation. X and Y are required; Z is additionally required for pair-matrix, 3D, and ternary views.",
    roles: [
      { key: "x", label: "X", kind: "number", required: true },
      { key: "y", label: "Y", kind: "number", required: true },
      { key: "z", label: "Z / third component", kind: "number", required: false },
      { key: "group", label: "Group", kind: "category", required: false },
      { key: "label", label: "Label", kind: "label", required: false },
    ],
    defaultMapping: { x: "x", y: "y", z: "", group: "group", label: "label" },
    sampleData: samples.scatter,
    examples: [
      { label: "Example 1", description: "Two-axis grouped observations for association statistics and fitted views.", data: samples.scatter, mapping: { x: "x", y: "y", z: "", group: "group", label: "label" } },
      { label: "Example 2", description: "Three non-negative components for pair-matrix, orthographic 3D, and normalized ternary views.", data: samples.scatterThreeAxis, mapping: { x: "x", y: "y", z: "z", group: "group", label: "label" } },
    ],
  },
  {
    id: "ma",
    name: "MA",
    family: "Differential analysis",
    summary: "Mean abundance versus log2 fold change with FDR and effect-size highlighting.",
    inputHint: "Use a positive baseMean/mean-expression column, log2 fold change, and adjusted P value.",
    roles: [
      { key: "label", label: "Gene label", kind: "label", required: true },
      { key: "mean", label: "Mean expression", kind: "number", required: true },
      { key: "effect", label: "log2 fold change", kind: "number", required: true },
      { key: "pValue", label: "Adjusted P value", kind: "number", required: true },
    ],
    defaultMapping: { label: "gene", mean: "meanExpression", effect: "log2FC", pValue: "padj" },
    sampleData: samples.ma,
  },
  {
    id: "quadrant",
    name: "Quadrant",
    family: "Association",
    summary: "Two-dimensional comparison divided by independently adjustable X and Y thresholds.",
    inputHint: "One row per item with numeric X/Y values; group and label are optional.",
    roles: [
      { key: "x", label: "X", kind: "number", required: true },
      { key: "y", label: "Y", kind: "number", required: true },
      { key: "group", label: "Group", kind: "category", required: false },
      { key: "label", label: "Label", kind: "label", required: false },
    ],
    defaultMapping: { x: "x", y: "y", group: "group", label: "label" },
    sampleData: samples.quadrant,
  },
  {
    id: "errorbar",
    name: "Error bar",
    family: "Comparison",
    summary: "Mean points with symmetric SD or SEM intervals and no compulsory bars.",
    inputHint: "Map a mean and an already-calculated non-negative SD or SEM column.",
    roles: [
      { key: "category", label: "Category", kind: "category", required: true },
      { key: "value", label: "Mean", kind: "number", required: true },
      { key: "error", label: "Error magnitude (SD / SEM)", kind: "number", required: true },
      { key: "group", label: "Group", kind: "category", required: false },
    ],
    defaultMapping: { category: "category", value: "mean", error: "sd", group: "group" },
    sampleData: samples.errorbar,
  },
  {
    id: "area",
    name: "Area",
    family: "Trend",
    summary: "Ordered trajectories with restrained translucent fills and visible outlines.",
    inputHint: "Long format with numeric X, numeric value, and optional series.",
    roles: [
      { key: "x", label: "X", kind: "number", required: true },
      { key: "value", label: "Value", kind: "number", required: true },
      { key: "series", label: "Series", kind: "category", required: false },
    ],
    defaultMapping: { x: "time", value: "value", series: "series" },
    sampleData: samples.area,
  },
  {
    id: "lollipop",
    name: "Lollipop",
    family: "Ranking",
    summary: "Compact ranked values using stems and emphasized endpoints.",
    inputHint: "One row per category with a numeric value and optional group.",
    roles: [
      { key: "category", label: "Category", kind: "category", required: true },
      { key: "value", label: "Value", kind: "number", required: true },
      { key: "group", label: "Group", kind: "category", required: false },
    ],
    defaultMapping: { category: "category", value: "value", group: "group" },
    sampleData: samples.lollipop,
  },
  ...(["beeswarm", "raincloud", "histogram", "density", "ridge"] as const).map((id) => ({
    id,
    name: id === "beeswarm" ? "Beeswarm" : id === "raincloud" ? "Raincloud" : id === "histogram" ? "Histogram" : id === "density" ? "Density" : "Ridge",
    family: "Distribution",
    summary: id === "beeswarm" ? "Deterministically packed raw observations without an enclosing box." : id === "raincloud" ? "Density, raw observations, and compact summaries in one layered view." : id === "histogram" ? "Deterministically binned frequency distributions for grouped observations." : id === "density" ? "Kernel-density estimates with explicit bandwidth and optional raw-data layers." : "Overlapping kernel-density profiles arranged as compact ridgelines.",
    inputHint: "Long format: one row per raw observation. At least three values per group are recommended.",
    roles: [
      { key: "group", label: "Group", kind: "category" as const, required: true },
      { key: "value", label: "Value", kind: "number" as const, required: true },
      { key: "subject", label: "Subject / pair ID", kind: "label" as const, required: false },
      { key: "facet", label: "Facet", kind: "category" as const, required: false },
      { key: "pValue", label: "Facet / comparison P value", kind: "number" as const, required: false },
    ],
    defaultMapping: { group: "group", value: "value", subject: "", facet: "", pValue: "" },
    sampleData: samples.distribution,
    examples: [
      { label: "Example 1", description: "Independent long-form observations grouped by condition.", data: samples.distribution, mapping: { group: "group", value: "value", subject: "", facet: "", pValue: "" } },
      { label: "Example 2", description: "Paired observations with subject IDs, facets, and supplied group P values.", data: samples.distributionPaired, mapping: { group: "group", value: "value", subject: "subject", facet: "facet", pValue: "p_value" } },
    ],
  })),
  ...(["pcoa", "umap"] as const).map((id) => ({
    id,
    name: id === "pcoa" ? "PCoA" : "UMAP",
    family: "Dimension reduction",
    summary: id === "pcoa" ? "Publication-ready display of principal-coordinate scores from a distance analysis." : "Publication-ready display of a precomputed UMAP embedding.",
    inputHint: id === "pcoa" ? "Upload PCoA coordinates produced from a documented distance metric. This plotter does not silently choose a distance." : "Upload precomputed UMAP coordinates; preserve the upstream seed and parameters in your analysis record.",
    roles: [
      { key: "x", label: id === "pcoa" ? "PCoA axis 1" : "UMAP 1", kind: "number" as const, required: true },
      { key: "y", label: id === "pcoa" ? "PCoA axis 2" : "UMAP 2", kind: "number" as const, required: true },
      { key: "group", label: "Group", kind: "category" as const, required: false },
      { key: "label", label: "Observation label", kind: "label" as const, required: false },
    ],
    defaultMapping: { x: "dim1", y: "dim2", group: "group", label: "sample" },
    sampleData: id === "pcoa" ? samples.pcoa : samples.umap,
  })),
  ...(["clustered-heatmap", "correlation-heatmap"] as const).map((id) => ({
    id,
    name: id === "clustered-heatmap" ? "Clustered heatmap" : "Correlation heatmap",
    family: "Matrix",
    summary: id === "clustered-heatmap" ? "Matrix heatmap with explicit, deterministic row and column clustering." : "Pearson or Spearman correlation calculated across numeric columns and displayed as a symmetric matrix.",
    inputHint: "First column supplies row labels; every remaining column must be numeric.",
    roles: [],
    defaultMapping: {},
    sampleData: samples.heatmap,
  })),
  {
    id: "enrichment-bar",
    name: "Enrichment bar",
    family: "Enrichment",
    summary: "Ranked pathway bars with FDR encoded by a continuous color scale.",
    inputHint: "One row per term; ratios may be decimals or fractions such as 8/40.",
    roles: [
      { key: "term", label: "Term", kind: "label", required: true },
      { key: "ratio", label: "Gene ratio", kind: "number", required: true },
      { key: "pValue", label: "Adjusted P value", kind: "number", required: true },
      { key: "group", label: "Ontology / group", kind: "category", required: false },
    ],
    defaultMapping: { term: "term", ratio: "geneRatio", pValue: "padj", group: "group" },
    sampleData: samples.enrichment,
    examples: [
      { label: "Example 1", description: "Gene ratio supplied as decimals.", data: samples.enrichment },
      { label: "Example 2", description: "Gene ratio supplied as fractions such as 18/50.", data: samples.enrichmentFraction },
    ],
  },
  {
    id: "gsea",
    name: "GSEA",
    family: "Enrichment",
    summary: "Running enrichment score with ranked-position hit ticks.",
    inputHint: "Use the running-score output of a documented GSEA workflow; hit must be 0/1. The plotter does not invent NES or FDR.",
    roles: [
      { key: "rank", label: "Rank", kind: "number", required: true },
      { key: "score", label: "Running enrichment score", kind: "number", required: true },
      { key: "hit", label: "Gene-set hit (0 / 1)", kind: "number", required: true },
      { key: "label", label: "Gene label", kind: "label", required: false },
    ],
    defaultMapping: { rank: "rank", score: "runningES", hit: "hit", label: "label" },
    sampleData: samples.gsea,
  },
  {
    id: "km",
    name: "Kaplan–Meier",
    family: "Survival",
    summary: "Kaplan–Meier estimates calculated from subject-level time and event data with censor marks.",
    inputHint: "One row per subject. Event must be 1 for event and 0 for censoring; time must be non-negative.",
    roles: [
      { key: "time", label: "Follow-up time", kind: "number", required: true },
      { key: "event", label: "Event (0 / 1)", kind: "number", required: true },
      { key: "group", label: "Group", kind: "category", required: false },
    ],
    defaultMapping: { time: "time", event: "event", group: "group" },
    sampleData: samples.km,
  },
  {
    id: "survival-forest",
    name: "Survival forest",
    family: "Survival",
    summary: "Effect estimates and confidence intervals against an adjustable null reference.",
    inputHint: "Provide model estimates and lower/upper confidence limits from the same model and scale.",
    roles: [
      { key: "label", label: "Variable", kind: "label", required: true },
      { key: "estimate", label: "Estimate", kind: "number", required: true },
      { key: "lower", label: "Lower CI", kind: "number", required: true },
      { key: "upper", label: "Upper CI", kind: "number", required: true },
      { key: "group", label: "Group", kind: "category", required: false },
    ],
    defaultMapping: { label: "label", estimate: "estimate", lower: "lower", upper: "upper", group: "group" },
    sampleData: samples.forest,
  },
  {
    id: "roc",
    name: "ROC",
    family: "Model evaluation",
    summary: "ROC curves and trapezoidal AUC calculated directly from binary outcomes and continuous scores.",
    inputHint: "Truth must be 0/1. Use held-out or externally validated prediction scores to avoid optimistic performance.",
    roles: [
      { key: "truth", label: "True class (0 / 1)", kind: "number", required: true },
      { key: "score", label: "Prediction score", kind: "number", required: true },
      { key: "group", label: "Model", kind: "category", required: false },
    ],
    defaultMapping: { truth: "truth", score: "score", group: "model" },
    sampleData: samples.roc,
  },
  ...(["venn", "upset"] as const).map((id) => ({
    id,
    name: id === "venn" ? "Venn" : "UpSet",
    family: "Set relationships",
    summary: id === "venn" ? "Two- or three-set overlap with exact region counts." : "Scalable set intersections with membership matrix and ranked intersection sizes.",
    inputHint: id === "venn" ? "Long format item/set membership. Venn is restricted to 2–3 unique sets." : "Long format item/set membership; duplicate memberships are collapsed.",
    roles: [
      { key: "item", label: "Item", kind: "label" as const, required: true },
      { key: "set", label: "Set", kind: "category" as const, required: true },
    ],
    defaultMapping: { item: "item", set: "set" },
    sampleData: samples.sets,
  })),
  ...(["sankey", "chord"] as const).map((id) => ({
    id,
    name: id === "sankey" ? "Sankey" : "Chord",
    family: id === "sankey" ? "Flow" : "Relationships",
    summary: id === "sankey" ? "Weighted source-to-target flows with proportional node and ribbon widths." : "Circular weighted relationships between categorical sectors.",
    inputHint: "One row per edge with non-negative weight. Repeated edges are aggregated.",
    roles: [
      { key: "source", label: "Source", kind: "category" as const, required: true },
      { key: "target", label: "Target", kind: "category" as const, required: true },
      { key: "value", label: "Weight", kind: "number" as const, required: true },
      { key: "group", label: "Group", kind: "category" as const, required: false },
    ],
    defaultMapping: { source: "source", target: "target", value: "value", group: "group" },
    sampleData: samples.network,
  })),
  {
    id: "circos",
    name: "Circos",
    family: "Genomic context",
    summary: "Genomic sectors and inter-locus links using explicit chromosome intervals.",
    inputHint: "Each link needs source and target chromosome/start/end coordinates. Coordinates must be non-negative and end ≥ start.",
    roles: [
      { key: "sourceChr", label: "Source chromosome", kind: "category", required: true },
      { key: "sourceStart", label: "Source start", kind: "number", required: true },
      { key: "sourceEnd", label: "Source end", kind: "number", required: true },
      { key: "targetChr", label: "Target chromosome", kind: "category", required: true },
      { key: "targetStart", label: "Target start", kind: "number", required: true },
      { key: "targetEnd", label: "Target end", kind: "number", required: true },
      { key: "value", label: "Link weight", kind: "number", required: false },
    ],
    defaultMapping: { sourceChr: "sourceChr", sourceStart: "sourceStart", sourceEnd: "sourceEnd", targetChr: "targetChr", targetStart: "targetStart", targetEnd: "targetEnd", value: "value" },
    sampleData: samples.circos,
  },
  ...(["pie", "donut", "waffle"] as const).map((id) => ({
    id,
    name: id === "pie" ? "Pie" : id === "donut" ? "Donut" : "Waffle",
    family: "Composition",
    summary: id === "pie"
      ? "Part-to-whole composition encoded by sector angle and area."
      : id === "donut"
        ? "Part-to-whole composition with a central total and compact ring geometry."
        : "Approximate part-to-whole composition on a discrete unit grid.",
    inputHint: "One row per mutually exclusive category with a non-negative value. Values are normalized to the displayed total.",
    roles: [
      { key: "category", label: "Category", kind: "category" as const, required: true },
      { key: "value", label: "Value", kind: "number" as const, required: true },
    ],
    defaultMapping: { category: "category", value: "value" },
    sampleData: samples.composition,
  })),
  {
    id: "rose",
    name: "Rose",
    family: "Cyclic comparison",
    summary: "Equal-angle sectors whose areas encode magnitude rather than part-to-whole share.",
    inputHint: "One row per ordered category with a non-negative magnitude. Rows are not normalized to a compositional total.",
    roles: [
      { key: "category", label: "Ordered category", kind: "category", required: true },
      { key: "value", label: "Magnitude", kind: "number", required: true },
    ],
    defaultMapping: { category: "category", value: "value" },
    sampleData: samples.rose,
  },
  ...(["treemap", "sunburst"] as const).map((id) => ({
    id,
    name: id === "treemap" ? "Treemap" : "Sunburst",
    family: "Hierarchical composition",
    summary: id === "treemap" ? "Nested rectangles encode hierarchical part-to-whole area." : "Concentric rings encode parent-child hierarchy and descendant share.",
    inputHint: "One row per unique node. Parent is blank only for the single root. Leaf values must be non-negative; internal totals are calculated from descendants.",
    roles: [
      { key: "node", label: "Node", kind: "label" as const, required: true },
      { key: "parent", label: "Parent", kind: "label" as const, required: false },
      { key: "value", label: "Leaf value", kind: "number" as const, required: true },
    ],
    defaultMapping: { node: "node", parent: "parent", value: "value" },
    sampleData: samples.hierarchy,
  })),
  {
    id: "radar",
    name: "Radar",
    family: "Multivariate profile",
    summary: "Comparable multivariate profiles arranged on shared radial axes.",
    inputHint: "Long format with at least three features per series. Every series must contain the same features on a common, interpretable scale.",
    roles: [
      { key: "feature", label: "Feature", kind: "category", required: true },
      { key: "value", label: "Value", kind: "number", required: true },
      { key: "series", label: "Series", kind: "category", required: false },
    ],
    defaultMapping: { feature: "feature", value: "value", series: "series" },
    sampleData: samples.radar,
  },
  {
    id: "polar-profile",
    name: "Polar profile",
    family: "Cyclic profile",
    summary: "Ordered or cyclic measurements connected around a shared radial scale.",
    inputHint: "Rows follow the angular order. Each series must contain the same ordered categories and non-negative values.",
    roles: [
      { key: "angle", label: "Ordered angle category", kind: "category", required: true },
      { key: "value", label: "Value", kind: "number", required: true },
      { key: "series", label: "Series", kind: "category", required: false },
    ],
    defaultMapping: { angle: "angle", value: "value", series: "series" },
    sampleData: samples.polarProfile,
  },
  {
    id: "population-pyramid",
    name: "Population pyramid",
    family: "Paired distribution",
    summary: "Two non-negative distributions mirrored across a common ordered-category baseline.",
    inputHint: "Long format with exactly two groups and one non-negative value per ordered category/group pair.",
    roles: [
      { key: "category", label: "Ordered category", kind: "category", required: true },
      { key: "value", label: "Value", kind: "number", required: true },
      { key: "group", label: "Group", kind: "category", required: true },
    ],
    defaultMapping: { category: "category", value: "value", group: "group" },
    sampleData: samples.populationPyramid,
  },
];

export const plotReferences = {
  visualizationHistory: { citation: "Friendly, 2008. A Brief History of Data Visualization. Handbook of Data Visualization.", href: "https://doi.org/10.1007/978-3-540-33037-0_2" },
  graphicalPerception: { citation: "Cleveland & McGill, 1984. Graphical Perception. JASA.", href: "https://doi.org/10.1080/01621459.1984.10478080" },
  errorBars: { citation: "Cumming, Fidler & Vaux, 2007. Error bars in experimental biology. J Cell Biol.", href: "https://doi.org/10.1083/jcb.200611141" },
  anscombe: { citation: "Anscombe, 1973. Graphs in Statistical Analysis. The American Statistician.", href: "https://doi.org/10.1080/00031305.1973.10478966" },
  pca: { citation: "Jolliffe & Cadima, 2016. Principal component analysis: a review and recent developments. Phil Trans R Soc A.", href: "https://doi.org/10.1098/rsta.2015.0202" },
  pcoa: { citation: "Gower, 1966. Some distance properties of latent root and vector methods used in multivariate analysis. Biometrika.", href: "https://doi.org/10.1093/biomet/53.3-4.325" },
  umap: { citation: "McInnes et al., 2018. UMAP: Uniform Manifold Approximation and Projection. JOSS.", href: "https://doi.org/10.21105/joss.00861" },
  boxplot: { citation: "McGill, Tukey & Larsen, 1978. Variations of Box Plots. The American Statistician.", href: "https://doi.org/10.1080/00031305.1978.10479236" },
  violin: { citation: "Hintze & Nelson, 1998. Violin Plots: A Box Plot-Density Trace Synergism. The American Statistician.", href: "https://doi.org/10.1080/00031305.1998.10480559" },
  rawData: { citation: "Weissgerber et al., 2015. Beyond Bar and Line Graphs: Time for a New Data Presentation Paradigm. PLoS Biol.", href: "https://doi.org/10.1371/journal.pbio.1002128" },
  raincloud: { citation: "Allen et al., 2021. Raincloud plots: a multi-platform tool for robust data visualization. Wellcome Open Res.", href: "https://doi.org/10.12688/wellcomeopenres.15191.2" },
  histogram: { citation: "Scott, 1979. On optimal and data-based histograms. Biometrika.", href: "https://doi.org/10.1093/biomet/66.3.605" },
  kernelDensity: { citation: "Silverman, 1986. Density Estimation for Statistics and Data Analysis. Chapman and Hall.", href: "https://doi.org/10.1201/9781315140919" },
  ridgeline: { citation: "Wilke, 2019. Fundamentals of Data Visualization: Visualizing many distributions at once. O'Reilly.", href: "https://clauswilke.com/dataviz/visualizing-many-distributions-at-once.html" },
  volcano: { citation: "Li, 2012. Volcano Plots in Analyzing Differential Expressions with mRNA Microarrays. J Bioinform Comput Biol.", href: "https://doi.org/10.1142/S0219720012310038" },
  ma: { citation: "Yang et al., 2002. Normalization for cDNA microarray data. Nucleic Acids Res.", href: "https://doi.org/10.1093/nar/30.4.e15" },
  lollipop: { citation: "Jay & Brouwer, 2016. Lollipops in the Clinic: Information Dense Mutation Plots for Precision Medicine. PLoS ONE.", href: "https://doi.org/10.1371/journal.pone.0160519" },
  heatmap: { citation: "Wilkinson & Friendly, 2009. The History of the Cluster Heat Map. The American Statistician.", href: "https://doi.org/10.1198/tas.2009.0033" },
  clusteredHeatmap: { citation: "Eisen et al., 1998. Cluster analysis and display of genome-wide expression patterns. PNAS.", href: "https://doi.org/10.1073/pnas.95.25.14863" },
  complexHeatmap: { citation: "Gu, Eils & Schlesner, 2016. Complex heatmaps reveal patterns and correlations in multidimensional genomic data. Bioinformatics.", href: "https://doi.org/10.1093/bioinformatics/btw313" },
  corrgram: { citation: "Friendly, 2002. Corrgrams: Exploratory Displays for Correlation Matrices. The American Statistician.", href: "https://doi.org/10.1198/000313002533" },
  enrichment: { citation: "Yu et al., 2012. clusterProfiler: an R package for comparing biological themes among gene clusters. OMICS.", href: "https://doi.org/10.1089/omi.2011.0118" },
  gsea: { citation: "Subramanian et al., 2005. Gene set enrichment analysis: a knowledge-based approach. PNAS.", href: "https://doi.org/10.1073/pnas.0506580102" },
  kaplanMeier: { citation: "Kaplan & Meier, 1958. Nonparametric Estimation from Incomplete Observations. JASA.", href: "https://doi.org/10.1080/01621459.1958.10501452" },
  forest: { citation: "Lewis & Clarke, 2001. Forest plots: trying to see the wood and the trees. BMJ.", href: "https://doi.org/10.1136/bmj.322.7300.1479" },
  roc: { citation: "Hanley & McNeil, 1982. The meaning and use of the area under a ROC curve. Radiology.", href: "https://doi.org/10.1148/radiology.143.1.7063747" },
  venn: { citation: "Venn, 1880. On the Diagrammatic and Mechanical Representation of Propositions and Reasonings. Philosophical Magazine.", href: "https://doi.org/10.1080/14786448008626877" },
  upset: { citation: "Lex et al., 2014. UpSet: Visualization of Intersecting Sets. IEEE TVCG.", href: "https://doi.org/10.1109/TVCG.2014.2346248" },
  sankeyHistory: { citation: "Schmidt, 2008. The Sankey Diagram in Energy and Material Flow Management: Part I. J Ind Ecol.", href: "https://doi.org/10.1111/j.1530-9290.2008.00004.x" },
  sankey: { citation: "Schmidt, 2008. The Sankey Diagram in Energy and Material Flow Management. J Ind Ecol.", href: "https://doi.org/10.1111/j.1530-9290.2008.00015.x" },
  chord: { citation: "Gu et al., 2014. circlize Implements and Enhances Circular Visualization in R. Bioinformatics.", href: "https://doi.org/10.1093/bioinformatics/btu393" },
  circos: { citation: "Krzywinski et al., 2009. Circos: An information aesthetic for comparative genomics. Genome Res.", href: "https://doi.org/10.1101/gr.092759.109" },
  pie: { citation: "Spence, 2005. No Humble Pie: The Origins and Usage of a Statistical Chart. Journal of Educational and Behavioral Statistics.", href: "https://doi.org/10.3102/10769986030004353" },
  nightingale: { citation: "Magnello, 2012. Victorian statistical graphics and the iconography of Florence Nightingale's polar area graph. BSHM Bulletin.", href: "https://doi.org/10.1080/17498430.2012.618102" },
  treemap: { citation: "Shneiderman, 1992. Tree visualization with tree-maps: 2-d space-filling approach. ACM Transactions on Graphics.", href: "https://doi.org/10.1145/102377.115768" },
  sunburst: { citation: "Stasko & Zhang, 2000. Focus+context display and navigation techniques for enhancing radial, space-filling hierarchy visualizations. IEEE InfoVis.", href: "https://doi.org/10.1109/INFVIS.2000.885107" },
  radar: { citation: "Kolence & Kiviat, 1973. Software Unit Profiles & Kiviat Figures. ACM SIGMETRICS Performance Evaluation Review.", href: "https://doi.org/10.1145/1041613.1041614" },
  populationPyramid: { citation: "Wilson, 2016. Visualising the demographic factors which shape population age structure. Demographic Research.", href: "https://doi.org/10.4054/DemRes.2016.35.29" },
  loess: { citation: "Cleveland, 1979. Robust Locally Weighted Regression and Smoothing Scatterplots. Journal of the American Statistical Association.", href: "https://doi.org/10.1080/01621459.1979.10481038" },
  hexbin: { citation: "Carr et al., 1987. Scatterplot Matrix Techniques for Large N. Journal of the American Statistical Association.", href: "https://doi.org/10.1080/01621459.1987.10478510" },
  composition: { citation: "Aitchison, 1986. The Statistical Analysis of Compositional Data. Chapman and Hall.", href: "https://doi.org/10.1007/978-94-009-4109-0" },
  correlationTest: { citation: "Student, 1908. The Probable Error of a Correlation Coefficient. Biometrika.", href: "https://doi.org/10.2307/2331554" },
} satisfies Record<string, PlotReference>;

const plotGuidanceSeeds: Record<PlotType, PlotGuidance> = {
  bar: {
    definition: "以共同基线上的长度编码类别汇总量；同一数据契约可切换分组、堆叠、百分比、双向、分面、极坐标、目标线、断轴、双轴和叠加表达。柱形仍代表汇总量，而不是完整原始分布。",
    suitableData: "离散类别的计数、比例、均值或其他汇总值；可输入预先计算的 SD/SEM，也可由长表重复观测计算。Bullet 需要目标值，叠加/双轴需要第二数值，显著性标记需要有效 P 值。",
    answers: "类别间大小、组成、方向、分层差异或相对目标的偏离。百分比图回答组成而非绝对量；双轴仅用于单位明确且必须同时展示的指标。",
    origin: "William Playfair 在 1786 年的《Commercial and Political Atlas》中用柱形比较贸易量，奠定了现代统计柱状图的形式。",
    references: [plotReferences.visualizationHistory, plotReferences.graphicalPerception, plotReferences.errorBars],
  },
  line: {
    definition: "按 X 的自然顺序连接相邻估计值，以位置和线段方向编码连续变化；可将预先计算的 SD、SEM 或 95% CI 半宽显示为逐点误差棒或连续不确定性带。",
    suitableData: "具有自然顺序的时间、剂量或阶段数据；每行应是一个估计值，若显示不确定性还需对应的非负半宽。带状区域不会自动把 SD 或 SEM 变成置信区间。",
    answers: "指标随顺序如何变化，不同序列的方向、速度或响应模式是否不同，以及已给定的不确定性范围有多大。",
    origin: "Playfair 同样在 1786 年用时间序列折线展示贸易变化，使“随时间阅读趋势”成为统计图形的核心用途。",
    references: [plotReferences.visualizationHistory, plotReferences.graphicalPerception, plotReferences.errorBars],
  },
  scatter: {
    definition: "把观察对象映射到二维位置；可叠加边际分布、二维密度、六边形计数、协方差椭圆、凸包、三变量散点矩阵、正交 3D 投影或三元组成坐标。每种变体回答的问题不同，并非装饰性切换。",
    suitableData: "标准视图需要两个连续变量；pair-matrix 与 3D 需要第三个连续变量；ternary 需要三个非负且每行总和大于零的组成分量。分组可决定颜色以及拟合/统计是合并还是组内计算。",
    answers: "变量的联合分布、局部密度、非线性趋势、组内包络、三变量关系或三部分组成权衡是什么。3D 投影会损失深度判断，ternary 只表示相对组成。",
    references: [plotReferences.anscombe, plotReferences.loess, plotReferences.hexbin, plotReferences.composition],
  },
  correlation: {
    definition: "在成对数值的可视分布基础上，用 Pearson r 或 Spearman ρ 量化方向与强度；可选 P 值明确标注为 Pearson t 检验或 Spearman 的渐近 t 近似。",
    suitableData: "成对连续或有序数值；Pearson 适合近似线性且无强影响点的关系，Spearman 适合单调关系或秩数据。组内模式要求每组有足够样本。",
    answers: "两变量关系的方向、强度与在指定检验假设下的兼容性如何；P 值不等于效应大小，相关也不说明因果。",
    references: [plotReferences.anscombe, plotReferences.correlationTest, plotReferences.loess],
  },
  pca: {
    definition: "一种线性无监督降维方法，把高维数据旋转到相互正交、按解释方差由高到低排列的主成分轴。",
    suitableData: "高维特征×观察矩阵，如组学、影像特征、形态学、光谱、传感器或标准化临床特征。",
    answers: "主要变异轴是什么，观察对象是否聚集、分离或存在离群点，以及分组或批次是否与总体结构相关。",
    origin: "Karl Pearson 于 1901 年提出空间点的最佳拟合直线与平面，Harold Hotelling 在 1933 年进一步建立并命名主成分分析。",
    references: [plotReferences.pca],
  },
  pcoa: {
    definition: "从样本间距离或相异度矩阵出发，通过特征分解构造低维坐标；它不是直接对原始特征矩阵做 PCA。",
    suitableData: "由明确距离或相异度度量得到的 PCoA 坐标，常见于生态、微生物群、组成或其他距离型数据。",
    answers: "在所选距离定义下，各观察对象的相似性结构和组间分离情况如何。",
    origin: "J. C. Gower 在 1966 年系统阐述了从距离关系恢复主坐标的数学性质，因此 PCoA 也常称为 Gower 主坐标分析。",
    references: [plotReferences.pcoa],
  },
  umap: {
    definition: "一种非线性流形学习方法，先构建高维邻域图，再寻找尽量保留局部邻域结构的低维嵌入。",
    suitableData: "高维数据上游计算得到的 UMAP 坐标，如单细胞、多组学、影像或表型特征。",
    answers: "局部邻域、亚群和异质性结构如何；不宜把远距离直接解释为定量差异。",
    origin: "McInnes 等人在 2018 年发布 UMAP，把黎曼几何与拓扑思想转化为可扩展的通用降维算法。",
    references: [plotReferences.umap],
  },
  box: {
    definition: "用中位数、上下四分位数、四分位距和按规则定义的“须”概括分布；须不一定代表最小值和最大值。",
    suitableData: "一个或多个分组下的连续原始观测值。",
    answers: "各组的中位数、四分位范围、离群值和整体离散程度有何不同。",
    origin: "John Tukey 在探索性数据分析中推广箱线图；McGill、Tukey 与 Larsen 于 1978 年讨论了缺口和变宽等变体。",
    references: [plotReferences.boxplot],
  },
  violin: {
    definition: "把核密度估计沿中心轴镜像形成“琴身”，并可叠加中位数、箱线或原始点来展示分布形状。",
    suitableData: "各组具有足够观测数的连续数据，适合展示分布密度。",
    answers: "各组分布的形状、偏态、长尾或多峰特征是否不同。",
    origin: "Hintze 与 Nelson 在 1998 年提出 violin plot，意图把箱线图的稳健摘要与密度轨迹结合起来。",
    references: [plotReferences.violin],
  },
  beeswarm: {
    definition: "把每个原始观察值画成点，并在分类轴方向进行防重叠排列；点群宽度来自排布，不是核密度估计。",
    suitableData: "样本量较小或中等的分组连续数据，希望保留每一个原始观察点。",
    answers: "数据实际分散在哪里，是否存在重复、空档、离群点和组内异质性。",
    references: [plotReferences.rawData],
  },
  raincloud: {
    definition: "把半小提琴密度“云”、原始观察点“雨”和箱线或区间摘要组合在同一组中。",
    suitableData: "分组连续原始数据，且希望同时展示密度、稳健汇总和单个观察。",
    answers: "组间中心趋势、分布形状和个体变异能否同时得到支持。",
    origin: "Allen 等人于 2019 年系统整理并命名 raincloud plot，用一个视图同时保留分布、原始数据和汇总统计。",
    references: [plotReferences.raincloud],
  },
  histogram: {
    definition: "把连续数值划入等宽区间，以每个区间的频数绘制相邻矩形；图形形状会随箱数改变。",
    suitableData: "单组或多组连续原始观测，可按分组与分面比较；应报告箱数或箱宽。",
    answers: "数据集中在哪些范围，是否偏态、多峰、长尾或存在稀疏区间。",
    references: [plotReferences.histogram, plotReferences.rawData],
  },
  density: {
    definition: "用核函数平滑每个观察值并求和，得到连续概率密度估计；曲线面积而非高度总和对应 1。",
    suitableData: "具有足够样本量的连续原始观测；带宽必须可追踪并避免把小样本的平滑形状当作真实结构。",
    answers: "分布的整体形状、偏态、峰和尾部如何，且这些形状对带宽是否稳定。",
    references: [plotReferences.kernelDensity, plotReferences.violin],
  },
  ridge: {
    definition: "把多个密度曲线沿分类轴错开排列，以紧凑方式比较许多组的分布轮廓。",
    suitableData: "多个有序或可比较分组的连续原始观测，尤其适合时间点、剂量层级或细胞群。",
    answers: "分布位置与形状如何沿组别移动；曲线重叠较多时不适合精确读取单个密度值。",
    references: [plotReferences.kernelDensity, plotReferences.graphicalPerception],
  },
  volcano: {
    definition: "以效应量（常为 log₂ fold change）为 X，以 −log₁₀(P 值或 FDR) 为 Y 的差异结果散点图。",
    suitableData: "每个特征具有效应量和 P 值或校正 P 值的差异分析结果。",
    answers: "哪些特征同时具有较大的变化幅度和较强的统计证据，变化方向是什么。",
    origin: "它在高通量差异表达分析中流行，点云常形成火山轮廓；Li 在 2012 年系统总结了这种图的统计解释。",
    references: [plotReferences.volcano],
  },
  ma: {
    definition: "以平均丰度 A 为横轴、两条件的对数比值 M 为纵轴，检查效应量是否随总体信号强度变化。",
    suitableData: "每个特征具有平均丰度、效应量及统计证据的差异分析结果。",
    answers: "变化幅度是否依赖总体丰度，低丰度区域是否存在偏差或异常波动。",
    origin: "M–A 表示 log ratio 与 mean average，这种图在早期双通道微阵列归一化和强度依赖偏差诊断中形成。",
    references: [plotReferences.ma],
  },
  quadrant: {
    definition: "用一条 X 阈值线和一条 Y 阈值线把散点图分成四个决策区域，以比较两套量化结果的一致与不一致。",
    suitableData: "同一对象的两套效应量、评分或测量值，并具有可解释的 X/Y 阈值。",
    answers: "两套结果在哪些区域一致或不一致，哪些对象跨越预设决策阈值。",
    references: [plotReferences.anscombe],
  },
  errorbar: {
    definition: "用中心标记配合端帽线段表示估计值及其不确定性或离散程度；必须明确线段是 SD、SEM 还是置信区间。",
    suitableData: "类别汇总值及对应的非负 SD 或 SEM；误差类型必须事先明确。",
    answers: "各组中心估计及其变异或估计精度如何，不替代原始数据分布。",
    references: [plotReferences.errorBars],
  },
  area: {
    definition: "在有序 X 上绘制折线并填充到基线的面积，以强调总量、累计量或趋势的视觉重量。",
    suitableData: "有序 X 上的连续数值或多条序列，适合强调整体量级或累积变化。",
    answers: "趋势和总体量级如何随顺序变化；重叠面积较多时不适合精确组间比较。",
    origin: "Playfair 的早期经济时间序列图已经使用线下填充来强调盈余与赤字，成为现代面积图的前身。",
    references: [plotReferences.visualizationHistory, plotReferences.graphicalPerception],
  },
  lollipop: {
    definition: "用从基线伸出的细杆和末端圆点编码数值，保留柱状图的共同基线，同时降低大面积色块的视觉重量。",
    suitableData: "类别对应的单个数值、效应量、评分或排名。",
    answers: "项目的排序、极端值和相对大小是什么，同时减少实心柱的视觉重量。",
    origin: "这种形状后来被基因组学借用于蛋白结构上的突变位置图；本工具的 Lollipop 是更通用的类别—数值图。",
    references: [plotReferences.lollipop],
  },
  heatmap: {
    definition: "把数值矩阵的每个单元格映射为颜色；如果未启用聚类，行列顺序完全由输入数据决定。",
    suitableData: "行列结构明确的数值矩阵，可使用原始尺度或经过合理标准化的值。",
    answers: "二维矩阵中哪些区域呈现高低模式、梯度、块状结构或异常值。",
    origin: "矩阵着色可追溯到 19 世纪统计图形；Wilkinson 与 Friendly 的历史综述梳理了它发展为现代热图的过程。",
    references: [plotReferences.heatmap, plotReferences.complexHeatmap],
  },
  "clustered-heatmap": {
    definition: "先按指定距离和连接方法对行列进行层次聚类，再按树状图顺序重排热图；颜色和树结构表达的是两层信息。",
    suitableData: "可比较的数值矩阵；行列聚类前应明确缩放、距离和连接方法。",
    answers: "哪些行或列具有相似模式，是否形成候选亚群、模块或共变结构。",
    origin: "聚类热图有更早的统计学前身；Eisen 等人在 1998 年把它用于全基因组表达模式后，使其成为组学分析的经典图形。",
    references: [plotReferences.clusteredHeatmap, plotReferences.heatmap, plotReferences.complexHeatmap],
  },
  "correlation-heatmap": {
    definition: "以同一组变量同时作为行和列，用颜色编码每对变量的相关系数，因此矩阵通常对称且对角线为 1。",
    suitableData: "同一批观察上测量的多个连续或有序变量。",
    answers: "变量之间的相关方向、强度、冗余和潜在模块结构是什么。",
    origin: "Friendly 在 2002 年提出 corrgram 体系，强调同时用颜色、顺序和符号阅读相关矩阵结构。",
    references: [plotReferences.corrgram, plotReferences.complexHeatmap],
  },
  enrichment: {
    definition: "每个功能条目用一个点表示，通常以位置编码富集比例、点大小编码命中数、颜色编码校正 P 值。",
    suitableData: "富集结果表，包含条目、富集比例、命中数量和校正 P 值。",
    answers: "哪些功能条目同时具有较强统计证据、较高富集比例和足够命中数量。",
    origin: "这种多通道编码随着 clusterProfiler 等富集分析工具普及，用一个点同时压缩展示效应、规模和统计证据。",
    references: [plotReferences.enrichment],
  },
  "enrichment-bar": {
    definition: "每个功能条目对应一根横向或纵向柱，柱长编码富集比例、计数或效应量，主要用于清晰排序。",
    suitableData: "可排序的富集结果表，至少包含条目、富集比例或效应值及统计证据。",
    answers: "最主要的富集条目如何排序，其效应或富集程度有多大。",
    references: [plotReferences.enrichment],
  },
  gsea: {
    definition: "沿完整的排序特征列表计算运行和统计量，并标出基因集成员命中位置和 leading-edge 区域。",
    suitableData: "基于完整排序列表计算的运行富集分数和基因集命中位置。",
    answers: "一个基因集主要富集在排序列表的哪一端，驱动富集的命中集中在哪里。",
    origin: "Subramanian 等人在 2005 年系统提出 GSEA，目的是避免只依赖任意显著性阈值截取基因列表。",
    references: [plotReferences.gsea],
  },
  km: {
    definition: "一种处理删失数据的非参数阶梯估计，每个事件时点按条件存活概率的乘积更新生存曲线。",
    suitableData: "个体级随访时间、事件状态和可选分组，包含正确记录的删失。",
    answers: "随时间推移的事件未发生概率如何，各组生存轨迹何时开始分离。",
    origin: "Kaplan 与 Meier 在 1958 年发表乘积极限估计，使不同随访长度和右删失能够被统一处理。",
    references: [plotReferences.kaplanMeier],
  },
  "survival-forest": {
    definition: "把多个效应估计及其置信区间逐行排列在共同参考线上；这里的 forest plot 与“随机森林算法”无关。",
    suitableData: "同一统计尺度上的效应估计及置信区间，如 HR、OR 或回归系数。",
    answers: "各因素或亚组效应的方向、大小和精确度如何，置信区间是否跨越无效线。",
    origin: "森林图从荟萃分析的效应量汇总图发展而来，后来也广泛用于 Cox 回归、亚组分析和多变量结果展示。",
    references: [plotReferences.forest],
  },
  roc: {
    definition: "遍历二分类预测阈值，以假阳性率为 X、真阳性率为 Y，展示敏感度与特异度之间的权衡。",
    suitableData: "二分类真实标签与连续预测分数，最好来自验证集或外部队列。",
    answers: "模型区分两类对象的能力和不同阈值下敏感度/特异度权衡如何；不能说明校准。",
    origin: "ROC 的思想源自信号检测问题，随后进入诊断检验和预测模型评价；AUC 可解释为随机阳性样本得分高于随机阴性样本的概率。",
    references: [plotReferences.roc],
  },
  venn: {
    definition: "用重叠闭合区域表示集合及其交集；区域位置表达集合逻辑，但面积通常不严格按成员数成比例。",
    suitableData: "2–3 个集合的成员关系，如基因、蛋白、峰、样本或候选条目列表。",
    answers: "少量集合之间独有和共享成员各有多少。",
    origin: "John Venn 在 1880 年为形式逻辑系统化这类集合关系图；现代生物学后来把它用于少量基因或候选集合比较。",
    references: [plotReferences.venn],
  },
  upset: {
    definition: "用点阵列明确标出参与某个交集的集合，再用柱长显示该精确交集的大小。",
    suitableData: "三个及以上集合的成员关系，尤其适合交集组合较多的情况。",
    answers: "哪些集合组合构成主要交集，各交集和单集合规模分别多大。",
    origin: "Lex 等人在 2014 年提出 UpSet，目标是把难以扩展到许多集合的 Venn 图转换为可排序、可查询的矩阵视图。",
    references: [plotReferences.upset],
  },
  sankey: {
    definition: "一种有方向的流量图，节点表示阶段或状态，连接带的宽度与从来源流向去向的数量成比例。",
    suitableData: "带非负权重的来源—去向或阶段间流量数据。",
    answers: "对象、数量或比例如何在类别或阶段之间流动，主要通路在哪里。",
    origin: "Captain Sankey 在 1898 年用带宽表示蒸汽机能量输入、有效功和损失，因此这种图最初讲的是“量从哪里流到哪里”。",
    references: [plotReferences.sankeyHistory, plotReferences.sankey],
  },
  chord: {
    definition: "把类别排列在圆周上，用圆内带状连线表示类别之间的关系；带宽编码关系量，默认不包含真实空间或基因组坐标。",
    suitableData: "类别之间的成对关系及非负权重，类别数量不宜过多。",
    answers: "哪些类别之间联系最强，整体关系是否集中于少数节点或模块。",
    origin: "现代 Chord diagram 常由邻接矩阵或 from–to 表生成；circlize 等工具把这种通用圆形关系图推广到迁移、通信和生物网络。",
    references: [plotReferences.chord],
  },
  circos: {
    definition: "以染色体或 contig 的真实坐标为圆周骨架，叠加同心数据轨道，并把连接精确锚定到两个基因组区间。",
    suitableData: "带染色体和起止坐标的基因组区段及区段间连接，如融合、重排或染色质互作。",
    answers: "事件位于哪些基因组区域，跨染色体或远距离连接的整体格局如何。",
    origin: "Krzywinski 等人在 2009 年创建 Circos 来展示比较基因组和结构变异；圆内连带只是它众多轨道中的一种。",
    references: [plotReferences.circos],
  },
  pie: {
    definition: "把互斥类别占总量的比例映射为圆形扇区的角度与面积。所有扇区共同构成一个整体。",
    suitableData: "单一总体中的非负计数、构成比或资源份额，类别应互斥且数量较少。",
    answers: "每个类别占总量多少，以及少数主要部分如何构成整体。精确比较多个相近比例时应优先使用柱状图。",
    origin: "William Playfair 在 1801 年出版的统计图集中使用圆形分区图。现代饼图由此发展，但面积和角度的比较精度低于共同基线上的长度。",
    references: [plotReferences.pie, plotReferences.graphicalPerception],
  },
  donut: {
    definition: "在饼图中心留出空白的环形组成图。扇区仍编码整体中的份额，中心用于显示总量而不是第二个变量。",
    suitableData: "与饼图相同的互斥非负组成数据，适合需要在中心明确显示总量的紧凑版式。",
    answers: "整体由哪些部分构成以及总量是多少。中心孔不会提高相近比例的比较精度。",
    references: [plotReferences.pie, plotReferences.graphicalPerception],
  },
  rose: {
    definition: "把类别分成等角扇区，以扇区面积编码每一项的数值，因此半径按数值平方根缩放。它比较周期或类别强度，不要求各项相加为整体。",
    suitableData: "按时间、方向或阶段排列的非负数值，尤其适合周期模式和同权类别的强度比较。",
    answers: "哪些方向或周期阶段更高，整体轮廓是否呈现集中、偏向或季节性。不要把扇区解释为构成比例。",
    origin: "Florence Nightingale 在 1858 年用极坐标面积图呈现不同死因随月份的变化，使这种图形常被称为 Nightingale rose。",
    references: [plotReferences.nightingale, plotReferences.graphicalPerception],
  },
  waffle: {
    definition: "把总量离散成固定数量的小格，再按比例分配给各类别，是对组成比例的近似计数式表达。",
    suitableData: "互斥非负组成数据，适合面向非技术受众展示直观百分比。",
    answers: "每 100 个单位中大约有多少属于各类别。小份额会受到网格取整影响，精确值应结合标签。",
    references: [plotReferences.graphicalPerception, plotReferences.pie],
  },
  treemap: {
    definition: "用嵌套矩形表示树状层级，叶节点面积编码数值，父节点面积由后代汇总。",
    suitableData: "具有单一根节点、明确父子关系和非负叶节点数值的层级组成数据。",
    answers: "总量在多个层级如何分配，哪些分支和叶节点占据主要份额。细长矩形不适合精确比较。",
    origin: "Ben Shneiderman 在 1990 年代初提出 tree-map，用二维空间填充方式浏览大型层级文件结构。",
    references: [plotReferences.treemap, plotReferences.graphicalPerception],
  },
  sunburst: {
    definition: "以同心环表示树的深度，父节点扇区沿径向向外展开为子节点，角度编码后代份额。",
    suitableData: "具有单一根节点、明确父子关系和非负叶节点数值的层级组成数据。",
    answers: "层级路径如何从根部向外展开，各分支在不同深度的相对份额是多少。层级过深时标签会变得拥挤。",
    origin: "Sunburst 属于径向空间填充层级图。Stasko 与 Zhang 在 2000 年系统研究了这类图的聚焦与导航方法。",
    references: [plotReferences.sunburst, plotReferences.graphicalPerception],
  },
  radar: {
    definition: "把多个可比较指标放在从同一中心放射的轴上，并连接同一对象的数值形成多边形轮廓。",
    suitableData: "至少三个方向一致、量纲可比或已标准化的指标。每个系列必须包含相同指标集合。",
    answers: "对象的多维特征轮廓是否均衡，优势和短板集中在哪些指标。多边形面积不应被当作统计量。",
    origin: "Kiviat figure 在 1970 年代的软件性能分析中用于同时观察多个指标，后来发展为常见的雷达图。",
    references: [plotReferences.radar, plotReferences.graphicalPerception],
  },
  "polar-profile": {
    definition: "把有自然循环顺序的测量放在角度轴上，以半径编码数值并连接为闭合曲线。它强调周期轨迹，不是组成图。",
    suitableData: "昼夜、季节、方向、细胞周期阶段等循环顺序数据，各系列应具有相同的角度类别。",
    answers: "峰值出现在周期的哪个位置，不同系列的相位、振幅和轮廓是否不同。",
    references: [plotReferences.radar, plotReferences.graphicalPerception],
  },
  "population-pyramid": {
    definition: "把两个群体在同一组有序区间上的非负分布分别镜像到中心线两侧，以共同尺度比较形状。",
    suitableData: "恰好两个群体在年龄、分期、剂量区间或其他有序类别中的计数或比例。",
    answers: "两个群体的分布形状、峰值区间和结构差异在哪里。镜像方向是布局，不代表数值为负。",
    origin: "人口学长期使用按年龄和性别镜像排列的条形分布来读取人口结构，后来扩展到其他两组有序分布比较。",
    references: [plotReferences.populationPyramid, plotReferences.graphicalPerception],
  },
};

const advancedRendererIds = new Set<PlotType>([
  "line", "scatter", "correlation", "pcoa", "umap", "box", "violin", "beeswarm", "raincloud", "histogram", "density", "ridge", "ma", "quadrant", "errorbar", "area", "lollipop",
  "heatmap", "clustered-heatmap", "correlation-heatmap", "enrichment-bar", "gsea", "km", "survival-forest", "roc", "venn",
  "upset", "sankey", "chord", "circos",
  "pie", "donut", "rose", "waffle", "treemap", "sunburst", "radar", "polar-profile", "population-pyramid",
]);
const commonSettingKeys: Array<keyof VisualizationSettings> = [
  "title", "fontFamily", "xLabel", "yLabel", "width", "height", "titleSize", "axisLabelSize", "tickSize",
  "legendSize", "axisLineWidth", "gridLineWidth", "dataLineWidth", "pointSize", "opacity", "grid",
  "categoricalColors",
];
const hiddenLegendIds = new Set<PlotType>(["box", "violin", "beeswarm", "raincloud", "histogram", "density", "ridge", "heatmap", "clustered-heatmap", "correlation-heatmap", "venn", "upset", "sankey", "chord", "circos", "treemap"]);
const specializedSettingKeys: Partial<Record<PlotType, Array<keyof VisualizationSettings>>> = {
  bar: ["swapAxes", "barErrorType", "barVariant", "barInputMode", "barOverlayType", "secondaryAxisLabel", "showSignificance", "significanceThreshold", "axisBreakStart", "axisBreakEnd", "barGap", "barBorderWidth", "barBorderColor", "errorBarLineWidth", "errorBarCapSize"],
  line: ["swapAxes", "showPoints", "lineErrorType", "lineUncertaintyStyle", "lineBandOpacity", "errorBarLineWidth", "errorBarCapSize"],
  scatter: ["swapAxes", "showLabels", "correlationMethod", "associationVariant", "associationFit", "associationPolynomialDegree", "associationLoessSpan", "associationShowConfidenceBand", "associationShowPValue", "associationGroupMode", "associationHexbinSize", "associationDensityBandwidth"],
  correlation: ["showLabels", "correlationMethod", "associationVariant", "associationFit", "associationPolynomialDegree", "associationLoessSpan", "associationShowConfidenceBand", "associationShowPValue", "associationGroupMode", "associationHexbinSize", "associationDensityBandwidth"], pca: ["swapAxes", "showLabels"],
  pcoa: ["showLabels"], umap: ["showLabels"],
  box: ["showDensity", "showHistogram", "showBox", "showPoints", "showSampleSize", "distributionSummary", "boxErrorType", "distributionShowPairedLines", "distributionShowSignificance", "significanceThreshold", "distributionOrientation", "histogramBins", "violinBandwidth", "violinWidth", "errorBarLineWidth", "errorBarCapSize"],
  violin: ["showDensity", "showHistogram", "showBox", "showPoints", "showSampleSize", "distributionSummary", "boxErrorType", "distributionShowPairedLines", "distributionShowSignificance", "significanceThreshold", "distributionOrientation", "histogramBins", "violinBandwidth", "violinWidth", "errorBarLineWidth", "errorBarCapSize"],
  beeswarm: ["showDensity", "showHistogram", "showBox", "showPoints", "showSampleSize", "distributionSummary", "boxErrorType", "distributionShowPairedLines", "distributionShowSignificance", "significanceThreshold", "distributionOrientation", "histogramBins", "violinBandwidth", "violinWidth", "errorBarLineWidth", "errorBarCapSize"],
  raincloud: ["showDensity", "showHistogram", "showBox", "showPoints", "showSampleSize", "distributionSummary", "boxErrorType", "distributionShowPairedLines", "distributionShowSignificance", "significanceThreshold", "distributionOrientation", "histogramBins", "violinBandwidth", "violinWidth", "errorBarLineWidth", "errorBarCapSize"],
  histogram: ["showDensity", "showHistogram", "showBox", "showPoints", "showSampleSize", "distributionSummary", "boxErrorType", "distributionShowPairedLines", "distributionShowSignificance", "significanceThreshold", "distributionOrientation", "histogramBins", "violinBandwidth", "violinWidth", "errorBarLineWidth", "errorBarCapSize"],
  density: ["showDensity", "showHistogram", "showBox", "showPoints", "showSampleSize", "distributionSummary", "boxErrorType", "distributionShowPairedLines", "distributionShowSignificance", "significanceThreshold", "distributionOrientation", "histogramBins", "violinBandwidth", "violinWidth", "errorBarLineWidth", "errorBarCapSize"],
  ridge: ["showDensity", "showHistogram", "showBox", "showPoints", "showSampleSize", "distributionSummary", "boxErrorType", "distributionShowPairedLines", "distributionShowSignificance", "significanceThreshold", "distributionOrientation", "histogramBins", "violinBandwidth", "violinWidth", "errorBarLineWidth", "errorBarCapSize"],
  volcano: ["showLabels", "foldChangeThreshold", "pValueThreshold", "labelLimit"],
  ma: ["showLabels", "foldChangeThreshold", "pValueThreshold", "labelLimit"], quadrant: ["showLabels", "xThreshold", "yThreshold"],
  errorbar: ["errorBarLineWidth", "errorBarCapSize"],
  heatmap: ["heatmapScale", "heatmapColorMode", "heatmapDisplay", "heatmapShowValues", "heatmapShowSidePlot", "heatmapSidePlotStatistic", "heatmapLabelDensity", "heatmapRowAnnotationData", "heatmapColumnAnnotationData", "continuousLow", "continuousHigh", "divergingLow", "divergingMid", "divergingHigh"],
  "clustered-heatmap": ["heatmapScale", "heatmapColorMode", "heatmapDisplay", "clusterRows", "clusterColumns", "heatmapDistance", "heatmapLinkage", "heatmapShowDendrograms", "heatmapRowClusters", "heatmapColumnClusters", "heatmapShowValues", "heatmapShowSidePlot", "heatmapSidePlotStatistic", "heatmapLabelDensity", "heatmapRowAnnotationData", "heatmapColumnAnnotationData", "continuousLow", "continuousHigh", "divergingLow", "divergingMid", "divergingHigh"],
  "correlation-heatmap": ["correlationMethod", "heatmapDisplay", "heatmapTriangle", "clusterRows", "clusterColumns", "heatmapDistance", "heatmapLinkage", "heatmapShowDendrograms", "heatmapRowClusters", "heatmapColumnClusters", "heatmapShowValues", "heatmapShowSidePlot", "heatmapSidePlotStatistic", "heatmapLabelDensity", "heatmapRowAnnotationData", "heatmapColumnAnnotationData", "divergingLow", "divergingMid", "divergingHigh"],
  enrichment: ["continuousLow", "continuousHigh"], "enrichment-bar": ["continuousLow", "continuousHigh"],
  km: ["showRiskTable"], "survival-forest": ["forestReferenceValue"],
  pie: ["compositionLabelMode"], donut: ["compositionLabelMode", "donutHole"], waffle: ["compositionLabelMode", "waffleCells"],
  rose: ["compositionLabelMode", "radialMaximum"], treemap: ["compositionLabelMode", "hierarchyGap"], sunburst: ["compositionLabelMode", "hierarchyGap"],
  radar: ["radarFillOpacity", "radialMaximum"], "polar-profile": ["radarFillOpacity", "radialMaximum"],
  "population-pyramid": ["pyramidDisplayMode"],
};

const newAxislessSettingKeys: Partial<Record<PlotType, ReadonlySet<keyof VisualizationSettings>>> = {
  pie: new Set(["title", "fontFamily", "width", "height", "titleSize", "tickSize", "legendSize", "opacity", "legendPosition", "categoricalColors", "compositionLabelMode"]),
  donut: new Set(["title", "fontFamily", "width", "height", "titleSize", "tickSize", "legendSize", "opacity", "legendPosition", "categoricalColors", "compositionLabelMode", "donutHole"]),
  waffle: new Set(["title", "fontFamily", "width", "height", "titleSize", "tickSize", "legendSize", "opacity", "legendPosition", "categoricalColors", "compositionLabelMode", "waffleCells"]),
  rose: new Set(["title", "fontFamily", "width", "height", "titleSize", "tickSize", "legendSize", "gridLineWidth", "opacity", "legendPosition", "categoricalColors", "compositionLabelMode", "radialMaximum"]),
  treemap: new Set(["title", "fontFamily", "width", "height", "titleSize", "tickSize", "opacity", "categoricalColors", "compositionLabelMode", "hierarchyGap"]),
  sunburst: new Set(["title", "fontFamily", "width", "height", "titleSize", "tickSize", "legendSize", "opacity", "legendPosition", "categoricalColors", "compositionLabelMode", "hierarchyGap"]),
  radar: new Set(["title", "fontFamily", "width", "height", "titleSize", "tickSize", "legendSize", "gridLineWidth", "dataLineWidth", "pointSize", "opacity", "legendPosition", "categoricalColors", "radarFillOpacity", "radialMaximum"]),
  "polar-profile": new Set(["title", "fontFamily", "width", "height", "titleSize", "tickSize", "legendSize", "gridLineWidth", "dataLineWidth", "pointSize", "opacity", "legendPosition", "categoricalColors", "radarFillOpacity", "radialMaximum"]),
  "population-pyramid": new Set(["title", "fontFamily", "width", "height", "titleSize", "tickSize", "legendSize", "axisLineWidth", "opacity", "legendPosition", "categoricalColors", "pyramidDisplayMode"]),
};

function dataShapeFor(type: PlotType): PlotDataShape {
  if (["heatmap", "clustered-heatmap", "correlation-heatmap", "pca"].includes(type)) return "matrix";
  if (["pcoa", "umap"].includes(type)) return "coordinates";
  if (["venn", "upset"].includes(type)) return "sets";
  if (["sankey", "chord"].includes(type)) return "network";
  if (["treemap", "sunburst"].includes(type)) return "hierarchy";
  if (type === "circos") return "genomic-links";
  return "long";
}

function numericAxesFor(type: PlotType): Array<"x" | "y"> {
  if (["heatmap", "clustered-heatmap", "correlation-heatmap", "venn", "upset", "sankey", "chord", "circos", "pie", "donut", "rose", "waffle", "treemap", "sunburst", "radar", "polar-profile", "population-pyramid"].includes(type)) return [];
  if (["enrichment", "enrichment-bar", "survival-forest"].includes(type)) return ["x"];
  if (["box", "violin", "beeswarm", "raincloud", "histogram", "density", "ridge"].includes(type)) return ["x", "y"];
  if (["errorbar", "lollipop"].includes(type)) return ["y"];
  if (type === "bar") return ["x", "y"];
  return ["x", "y"];
}

export function activeNumericAxes(type: PlotType, settings: Pick<VisualizationSettings, "swapAxes" | "barVariant" | "distributionOrientation" | "associationVariant">): Array<"x" | "y"> {
  if (type === "bar") {
    if (settings.barVariant === "polar") return [];
    return settings.swapAxes || ["horizontal", "bullet", "pyramid"].includes(settings.barVariant) ? ["x"] : ["y"];
  }
  if (["box", "violin", "beeswarm", "raincloud", "histogram", "density", "ridge"].includes(type)) return settings.distributionOrientation === "horizontal" ? ["x"] : ["y"];
  if (["scatter", "correlation"].includes(type) && ["pair-matrix", "3d", "ternary"].includes(settings.associationVariant)) return [];
  return numericAxesFor(type);
}

export function isPlotRoleActive(type: PlotType, roleKey: string, settings: VisualizationSettings) {
  if (type !== "bar") return true;
  if (roleKey === "secondary") return ["dual-axis", "overlay"].includes(settings.barVariant);
  if (roleKey === "target") return settings.barVariant === "bullet";
  if (roleKey === "pValue") return settings.showSignificance && settings.barVariant !== "polar";
  if (roleKey === "facet") return settings.barVariant === "faceted";
  if (roleKey === "error") return settings.barErrorType !== "none" && !["stacked", "percentage", "polar"].includes(settings.barVariant);
  return true;
}

const plotModuleSeeds: Array<PlotModuleSeed<PlotType, keyof VisualizationSettings>> = plotDefinitionSeeds.map((definition) => ({
  definition,
  guidance: plotGuidanceSeeds[definition.id],
  renderer: advancedRendererIds.has(definition.id) ? "advanced" : "standard",
  capabilities: {
    dataShape: dataShapeFor(definition.id),
    numericAxes: numericAxesFor(definition.id),
    settingKeys: newAxislessSettingKeys[definition.id] ? [...newAxislessSettingKeys[definition.id]!] : [
      ...commonSettingKeys,
      ...(numericAxesFor(definition.id).includes("x") ? ["xMin" as const, "xMax" as const] : []),
      ...(numericAxesFor(definition.id).includes("y") ? ["yMin" as const, "yMax" as const] : []),
      ...(hiddenLegendIds.has(definition.id) ? [] : ["legendPosition" as const]),
      ...(specializedSettingKeys[definition.id] ?? []),
    ],
    grouping: definition.roles.some((role) => role.key === "group" || role.key === "series"),
    multipleExamples: (definition.examples?.length ?? 0) > 1,
  },
}));

export const plotModuleRegistry = createPlotModuleRegistry(plotModuleSeeds, {
  allowedSettingKeys: Object.keys(defaultVisualizationSettings) as Array<keyof VisualizationSettings>,
});

/** @deprecated Read plot definitions through plotModuleRegistry. */
export const plotDefinitions = plotModuleRegistry.list().map((plotModule) => plotModule.definition);

/** @deprecated Read guidance through plotModuleRegistry. */
export const plotGuidance = Object.fromEntries(
  plotModuleRegistry.list().map((plotModule) => [plotModule.definition.id, plotModule.guidance]),
) as Record<PlotType, PlotGuidance>;

export function getPlotModule(type: PlotType) {
  return plotModuleRegistry.get(type);
}

export function getPlotDefinition(type: PlotType) {
  return getPlotModule(type).definition;
}

export function getPlotExamples(definition: PlotDefinition): PlotDataExample[] {
  return [...getPlotModule(definition.id).examples];
}

function detectDelimiter(line: string) {
  return line.includes("\t") ? "\t" : ",";
}

function splitDelimitedLine(line: string, delimiter: string) {
  if (delimiter === "\t") return line.split("\t").map((value) => value.trim());

  const cells: string[] = [];
  let current = "";
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    if (character === '"') {
      if (quoted && line[index + 1] === '"') {
        current += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (character === delimiter && !quoted) {
      cells.push(current.trim());
      current = "";
    } else {
      current += character;
    }
  }
  cells.push(current.trim());
  return cells;
}

export function parseDelimitedData(raw: string): ParsedDataset {
  const lines = raw.replaceAll("\r\n", "\n").replaceAll("\r", "\n").split("\n");
  const nonEmptyLines = lines.filter((line) => line.trim().length > 0);
  if (nonEmptyLines.length === 0) {
    return { headers: [], rows: [], delimiter: "tab", errors: ["Paste tab- or comma-delimited data."], warnings: [] };
  }

  const delimiter = detectDelimiter(nonEmptyLines[0]);
  const headers = splitDelimitedLine(nonEmptyLines[0], delimiter);
  const errors: string[] = [];
  const warnings: string[] = [];

  if (headers.some((header) => header.length === 0)) errors.push("Every column must have a header.");
  if (new Set(headers).size !== headers.length) errors.push("Column headers must be unique.");

  const rows: DelimitedRow[] = [];
  nonEmptyLines.slice(1).forEach((line, rowIndex) => {
    const cells = splitDelimitedLine(line, delimiter);
    if (cells.length !== headers.length) {
      errors.push(`Row ${rowIndex + 2} has ${cells.length} values; expected ${headers.length}.`);
      return;
    }
    rows.push(Object.fromEntries(headers.map((header, index) => [header, cells[index]])));
  });

  if (rows.length === 0 && errors.length === 0) errors.push("The dataset needs at least one data row.");
  const blankCells = rows.reduce((count, row) => count + headers.filter((header) => row[header] === "").length, 0);
  if (blankCells > 0) warnings.push(`${blankCells} blank cell${blankCells === 1 ? "" : "s"} detected.`);
  if (rows.length > 5_000) warnings.push("More than 5,000 rows may reduce browser preview performance.");

  return {
    headers,
    rows,
    delimiter: delimiter === "\t" ? "tab" : "comma",
    errors: errors.slice(0, 8),
    warnings,
  };
}

export function parseNumericValue(value: string | undefined) {
  if (value === undefined || value.trim() === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export type HeatmapAnnotationTrack = {
  name: string;
  kind: "continuous" | "categorical";
  values: Map<string, string>;
  numericExtent: [number, number] | null;
  categories: string[];
};

export type HeatmapAnnotationAlignment = {
  tracks: HeatmapAnnotationTrack[];
  errors: string[];
  warnings: string[];
  matchedIds: number;
  missingIds: string[];
  extraIds: string[];
};

export type HeatmapLayoutOptions = {
  hasAnnotationLegend: boolean;
  rowAnnotationTracks: number;
  columnAnnotationTracks: number;
  showRowCut: boolean;
  showColumnCut: boolean;
  showRowDendrogram: boolean;
  showColumnDendrogram: boolean;
  showSidePlot: boolean;
  rowCount: number;
  columnCount: number;
  maxColumnLabelCharacters: number;
  maxCutClusters: number;
};

/**
 * One source of truth for compact heatmap geometry. Validation and rendering
 * deliberately share these exact measurements so a view that passes the
 * safety gate cannot later grow beyond its export frame.
 */
export function heatmapLayoutMetrics(settings: VisualizationSettings, options: HeatmapLayoutOptions) {
  const annotationLegendWidth = options.hasAnnotationLegend ? Math.max(104, Math.ceil(Math.max(8, settings.legendSize) * 8)) : 0;
  const left = Math.min(108, settings.width * 0.27);
  const top = settings.title ? 48 : 24;
  const bottom = 58;
  const right = 22 + annotationLegendWidth;
  const plotWidth = Math.max(0, settings.width - left - right);
  const plotHeight = Math.max(0, settings.height - top - bottom);
  const rowTrackCount = options.rowAnnotationTracks + (options.showRowCut ? 1 : 0);
  const columnTrackCount = options.columnAnnotationTracks + (options.showColumnCut ? 1 : 0);
  const rowTrackWidth = rowTrackCount * 6;
  const columnTrackHeight = columnTrackCount * 6;
  const rowDendrogramWidth = options.showRowDendrogram ? 28 : 0;
  const columnDendrogramHeight = options.showColumnDendrogram ? 28 : 0;
  const sidePlotWidth = options.showSidePlot ? 48 : 0;
  const legendFontSize = Math.max(8, settings.legendSize);
  const cutItemStep = Math.max(13, legendFontSize * 1.15);
  const cutLegendWidth = options.maxCutClusters > 1 ? 12 + options.maxCutClusters * cutItemStep + legendFontSize * 0.7 : 0;
  const colorLegendHeight = options.showRowCut || options.showColumnCut ? Math.max(36, legendFontSize * 3 + 10) : Math.max(18, legendFontSize + 8);
  const matrixWidth = plotWidth - rowDendrogramWidth - rowTrackWidth - sidePlotWidth;
  const matrixHeight = plotHeight - colorLegendHeight - columnDendrogramHeight - columnTrackHeight;
  const labelReserve = settings.heatmapLabelDensity === "none"
    ? 4
    : Math.ceil(12 + Math.min(12, options.maxColumnLabelCharacters) * Math.max(8, settings.tickSize) * 0.58);
  const circularOuterRadius = Math.min(plotWidth, plotHeight) / 2 - labelReserve - options.columnAnnotationTracks * 5;
  const circularInnerRadius = Math.max(12, circularOuterRadius * 0.2);
  const circularRingWidth = (circularOuterRadius - circularInnerRadius) / Math.max(1, options.rowCount);
  const circularSectorArc = Math.PI * 2 * Math.max(0, circularOuterRadius) / Math.max(1, options.columnCount);
  const circularRingListAvailableHeight = Math.max(0, plotHeight - (legendFontSize * 2 + 4) - colorLegendHeight);
  return {
    frame: { width: settings.width, height: settings.height, left, right, top, bottom, plotWidth, plotHeight },
    annotationLegendWidth,
    rowTrackCount,
    columnTrackCount,
    rowTrackWidth,
    columnTrackHeight,
    rowDendrogramWidth,
    columnDendrogramHeight,
    sidePlotWidth,
    colorLegendHeight,
    matrixWidth,
    matrixHeight,
    circularOuterRadius,
    circularInnerRadius,
    circularRingWidth,
    circularSectorArc,
    circularRingListAvailableHeight,
    cutLegendWidth,
  };
}

/** Expand a chosen categorical palette without silently reusing a color. */
export function categoricalColorForIndex(index: number, colors: string[]) {
  const safeColors = colors.length > 0 ? colors : ["#A7A5A0"];
  const base = safeColors[index % safeColors.length];
  const tier = Math.floor(index / safeColors.length);
  if (tier === 0) return base;
  // Golden-angle hues remain deterministic and unique across the browser
  // safety ceiling (250 categories) while keeping restrained saturation.
  const hue = ((index * 137.50776405003785) % 360).toFixed(6);
  const saturation = 34 + (tier % 4) * 4;
  const lightness = 42 + (tier % 5) * 5;
  return `hsl(${hue} ${saturation}% ${lightness}%)`;
}

/** Parse and align a row/column annotation table by its stable first-column identifier. */
export function alignHeatmapAnnotations(text: string, targetIds: string[], targetLabel: "row" | "column"): HeatmapAnnotationAlignment {
  if (!text.trim()) return { tracks: [], errors: [], warnings: [], matchedIds: 0, missingIds: [], extraIds: [] };
  const parsed = parseDelimitedData(text);
  const errors = [...parsed.errors];
  const warnings = [...parsed.warnings];
  if (parsed.headers.length < 2) errors.push(`${targetLabel === "row" ? "Row" : "Column"} annotations need an ID column and at least one track.`);
  if (parsed.headers.length > 7) errors.push(`${targetLabel === "row" ? "Row" : "Column"} annotations are limited to six tracks in the browser preview.`);
  const idColumn = parsed.headers[0] ?? "id";
  const ids = parsed.rows.map((row) => row[idColumn]?.trim()).filter(Boolean);
  const duplicateIds = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
  if (duplicateIds.length > 0) errors.push(`${targetLabel === "row" ? "Row" : "Column"} annotation IDs must be unique; duplicates: ${duplicateIds.slice(0, 6).join(", ")}.`);
  const idSet = new Set(ids);
  const targetSet = new Set(targetIds);
  const missingIds = targetIds.filter((id) => !idSet.has(id));
  const extraIds = ids.filter((id) => !targetSet.has(id));
  if (missingIds.length > 0) warnings.push(`${missingIds.length} ${targetLabel} ID${missingIds.length === 1 ? " is" : "s are"} missing from the annotation table: ${missingIds.slice(0, 5).join(", ")}${missingIds.length > 5 ? "…" : ""}.`);
  if (extraIds.length > 0) warnings.push(`${extraIds.length} annotation ID${extraIds.length === 1 ? " does" : "s do"} not match the matrix and will be ignored: ${extraIds.slice(0, 5).join(", ")}${extraIds.length > 5 ? "…" : ""}.`);
  const trackHeaders = parsed.headers.slice(1, 7);
  const normalizedTrackNames = trackHeaders.map((header) => header.match(/^(.*?)\s*\[(categorical|continuous)\]\s*$/i)?.[1]?.trim() || header);
  const duplicateTrackNames = [...new Set(normalizedTrackNames.filter((name, index) => normalizedTrackNames.indexOf(name) !== index))];
  if (duplicateTrackNames.length > 0) errors.push(`${targetLabel === "row" ? "Row" : "Column"} annotation track names must remain unique after type declarations are removed; duplicates: ${duplicateTrackNames.join(", ")}.`);
  const tracks = trackHeaders.map((header) => {
    const declaration = header.match(/^(.*?)\s*\[(categorical|continuous)\]\s*$/i);
    const name = declaration?.[1]?.trim() || header;
    const declaredKind = declaration?.[2]?.toLowerCase() as "categorical" | "continuous" | undefined;
    const values = new Map(parsed.rows.map((row) => [row[idColumn]?.trim(), row[header]?.trim() ?? ""]));
    const matchedValues = targetIds.map((id) => values.get(id) ?? "").filter((value) => value !== "");
    const numericValues = matchedValues.map((value) => parseNumericValue(value));
    const allNumeric = matchedValues.length > 0 && numericValues.every((value) => value !== null);
    if (declaredKind === "continuous" && !allNumeric) errors.push(`${targetLabel === "row" ? "Row" : "Column"} annotation track ${name} is declared continuous but contains non-numeric values.`);
    const continuous = declaredKind === "continuous" || (declaredKind === undefined && allNumeric);
    if (declaredKind === undefined && allNumeric) warnings.push(`Numeric annotation track ${name} was inferred as continuous; add [categorical] to the header for codes such as batch, stage, or cluster IDs.`);
    const finite = numericValues.filter((value): value is number => value !== null);
    return {
      name,
      kind: continuous ? "continuous" as const : "categorical" as const,
      values,
      numericExtent: continuous && finite.length > 0 ? [Math.min(...finite), Math.max(...finite)] as [number, number] : null,
      categories: continuous ? [] : [...new Set(matchedValues)].sort((left, right) => left.localeCompare(right)),
    };
  });
  return { tracks, errors, warnings, matchedIds: targetIds.filter((id) => idSet.has(id)).length, missingIds, extraIds };
}

export function parseRatioValue(value: string | undefined) {
  if (!value) return null;
  if (value.includes("/")) {
    const [numerator, denominator] = value.split("/").map(Number);
    if (Number.isFinite(numerator) && Number.isFinite(denominator) && denominator !== 0) return numerator / denominator;
  }
  return parseNumericValue(value);
}

const mappingAliases: Record<string, string[]> = {
  category: ["category", "condition", "sample", "name", "term"],
  value: ["value", "mean", "expression", "score", "abundance", "count"],
  secondary: ["secondary", "secondaryvalue", "comparison", "overlay", "value2"],
  target: ["target", "reference", "goal", "benchmark", "to", "receiver"],
  facet: ["facet", "panel", "stratum", "cohort"],
  subject: ["subject", "subjectid", "pair", "pairid", "participant", "sampleid"],
  group: ["group", "class", "condition", "cluster", "ontology"],
  series: ["series", "group", "condition", "class"],
  x: ["x", "time", "dose", "pc1", "dim1", "dimension1", "umap1"],
  y: ["y", "response", "pc2", "dim2", "dimension2", "umap2"],
  error: ["error", "sd", "sem", "se", "stderr", "standarddeviation", "standarderror"],
  label: ["label", "gene", "feature", "id", "name"],
  effect: ["log2fc", "logfc", "effect", "estimate"],
  pValue: ["padj", "fdr", "adjustedpvalue", "pvalue", "p"],
  term: ["term", "pathway", "description", "name"],
  ratio: ["generatio", "ratio", "richfactor", "foldenrichment"],
  count: ["count", "genes", "hits", "size"],
  mean: ["mean", "basemean", "meanexpression", "averagelogexpression"],
  rank: ["rank", "position", "index"],
  hit: ["hit", "member", "membership", "ingeneset"],
  time: ["time", "followuptime", "survivaltime", "os", "pfs"],
  event: ["event", "status", "death", "outcome"],
  estimate: ["estimate", "hr", "hazardratio", "or", "oddsratio"],
  lower: ["lower", "lowerci", "cilower", "lcl"],
  upper: ["upper", "upperci", "ciupper", "ucl"],
  truth: ["truth", "class", "outcome", "label", "event"],
  score: ["score", "prediction", "probability", "risk", "runninges", "enrichmentscore", "es"],
  item: ["item", "gene", "feature", "id"],
  set: ["set", "geneset", "list", "collection"],
  source: ["source", "from", "sender"],
  sourceChr: ["sourcechr", "chr1", "chromosome1"],
  sourceStart: ["sourcestart", "start1"],
  sourceEnd: ["sourceend", "end1"],
  targetChr: ["targetchr", "chr2", "chromosome2"],
  targetStart: ["targetstart", "start2"],
  targetEnd: ["targetend", "end2"],
  node: ["node", "name", "label", "id"],
  parent: ["parent", "parentnode", "parentid"],
  feature: ["feature", "metric", "dimension", "axis"],
  angle: ["angle", "phase", "time", "direction", "category"],
};

function normalizeMappingName(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

export function inferPlotMapping(definition: PlotDefinition, headers: string[]) {
  const normalized = new Map<string, string>();
  headers.forEach((header) => {
    const key = normalizeMappingName(header);
    if (!normalized.has(key)) normalized.set(key, header);
  });
  return Object.fromEntries(definition.roles.map((role) => {
    const exact = normalized.get(normalizeMappingName(role.key));
    const fallback = mappingAliases[role.key]?.map((alias) => normalized.get(alias)).find(Boolean);
    return [role.key, exact ?? fallback ?? ""];
  }));
}

function heatmapStandardize(values: number[]) {
  const average = values.reduce((sum, value) => sum + value, 0) / Math.max(1, values.length);
  const deviation = Math.sqrt(values.reduce((sum, value) => sum + (value - average) ** 2, 0) / Math.max(1, values.length - 1)) || 1;
  return values.map((value) => (value - average) / deviation);
}

function heatmapRanks(values: number[]) {
  const ordered = values.map((value, index) => ({ value, index })).sort((left, right) => left.value - right.value || left.index - right.index);
  const ranks = Array(values.length).fill(0) as number[];
  for (let start = 0; start < ordered.length;) {
    let end = start;
    while (end + 1 < ordered.length && ordered[end + 1].value === ordered[start].value) end += 1;
    const rank = (start + end + 2) / 2;
    for (let cursor = start; cursor <= end; cursor += 1) ranks[ordered[cursor].index] = rank;
    start = end + 1;
  }
  return ranks;
}

function heatmapCorrelation(left: number[], right: number[], method: VisualizationSettings["correlationMethod"]) {
  const x = method === "spearman" ? heatmapRanks(left) : left;
  const y = method === "spearman" ? heatmapRanks(right) : right;
  const xMean = x.reduce((sum, value) => sum + value, 0) / x.length;
  const yMean = y.reduce((sum, value) => sum + value, 0) / y.length;
  const numerator = x.reduce((sum, value, index) => sum + (value - xMean) * (y[index] - yMean), 0);
  const denominator = Math.sqrt(x.reduce((sum, value) => sum + (value - xMean) ** 2, 0) * y.reduce((sum, value) => sum + (value - yMean) ** 2, 0));
  return denominator > 0 ? numerator / denominator : Number.NaN;
}

function isZeroVariance(values: number[]) {
  return values.length < 2 || values.every((value) => Math.abs(value - values[0]) <= 1e-12);
}

export function validatePlotDataset(
  definition: PlotDefinition,
  dataset: ParsedDataset,
  mapping: Record<string, string>,
  settings?: VisualizationSettings,
) {
  const errors = [...dataset.errors];
  const warnings = [...dataset.warnings];
  if (errors.length > 0) return { errors, warnings };
  if (settings) {
    const activeAxes = activeNumericAxes(definition.id, settings);
    const invalidXLimits = activeAxes.includes("x") && settings.xMin !== null && settings.xMax !== null && settings.xMin >= settings.xMax;
    const invalidYLimits = activeAxes.includes("y") && settings.yMin !== null && settings.yMax !== null && settings.yMin >= settings.yMax;
    if (invalidXLimits) errors.push("X-axis minimum must be smaller than the maximum.");
    if (invalidYLimits) errors.push("Y-axis minimum must be smaller than the maximum.");
    if (!invalidXLimits && !invalidYLimits) {
      const clippingWarning = axisLimitWarning(definition, dataset, mapping, settings);
      if (clippingWarning) warnings.push(clippingWarning);
    }
  }

  if (["heatmap", "clustered-heatmap", "correlation-heatmap"].includes(definition.id)) {
    if (dataset.headers.length < 3) errors.push("Heatmap data needs one row-label column and at least two numeric sample columns.");
    const labelHeader = dataset.headers[0];
    const numericHeaders = dataset.headers.slice(1);
    const rowIds = dataset.rows.map((row) => row[labelHeader]?.trim()).filter(Boolean);
    if (rowIds.length !== dataset.rows.length) errors.push("Heatmap row identifiers must not be blank.");
    if (new Set(rowIds).size !== rowIds.length) errors.push("Heatmap row identifiers must be unique so annotations and labels align reproducibly.");
    const invalid = dataset.rows.filter((row) => numericHeaders.some((header) => parseNumericValue(row[header]) === null));
    if (invalid.length > 0) errors.push(`${invalid.length} heatmap row${invalid.length === 1 ? "" : "s"} contain non-numeric or blank values.`);
    if (definition.id === "correlation-heatmap" && invalid.length === 0) {
      const constantHeaders = numericHeaders.filter((header) => new Set(dataset.rows.map((row) => parseNumericValue(row[header]))).size < 2);
      if (constantHeaders.length > 0) errors.push(`Correlation is undefined for constant columns: ${constantHeaders.join(", ")}.`);
    }
    const circular = settings?.heatmapDisplay === "circular";
    const rowLimit = circular ? 80 : 250;
    const columnLimit = circular ? 60 : 100;
    if (definition.id !== "correlation-heatmap" && dataset.rows.length > rowLimit) errors.push(`${circular ? "Circular h" : "H"}eatmap previews are limited to ${rowLimit} rows; select biologically justified features before plotting.`);
    if (numericHeaders.length > columnLimit) errors.push(`${circular ? "Circular h" : "H"}eatmap previews are limited to ${columnLimit} numeric columns to preserve legibility and browser performance.`);
    if (settings) {
      if (invalid.length === 0 && settings.heatmapDistance === "correlation" && definition.id !== "heatmap") {
        const rawMatrix = dataset.rows.map((row) => numericHeaders.map((header) => parseNumericValue(row[header]) ?? 0));
        let clusteringMatrix = rawMatrix;
        if (definition.id === "correlation-heatmap") {
          const variables = numericHeaders.map((_, columnIndex) => rawMatrix.map((row) => row[columnIndex]));
          clusteringMatrix = variables.map((left) => variables.map((right) => heatmapCorrelation(left, right, settings.correlationMethod)));
        } else if (settings.heatmapScale === "row") clusteringMatrix = rawMatrix.map(heatmapStandardize);
        else if (settings.heatmapScale === "column") {
          const scaledColumns = numericHeaders.map((_, columnIndex) => heatmapStandardize(rawMatrix.map((row) => row[columnIndex])));
          clusteringMatrix = rawMatrix.map((_, rowIndex) => scaledColumns.map((column) => column[rowIndex]));
        }
        const clusteringRowLabels = definition.id === "correlation-heatmap" ? numericHeaders : rowIds;
        if (settings.clusterRows) {
          const constantRows = clusteringMatrix.map((values, index) => isZeroVariance(values) || values.some((value) => !Number.isFinite(value)) ? clusteringRowLabels[index] : "").filter(Boolean);
          if (constantRows.length > 0) errors.push(`Correlation distance is undefined for zero-variance row vectors: ${constantRows.slice(0, 8).join(", ")}${constantRows.length > 8 ? "…" : ""}. Use Euclidean distance or remove/transform these rows.`);
        }
        if (settings.clusterColumns) {
          const constantColumns = numericHeaders.map((header, columnIndex) => ({ header, values: clusteringMatrix.map((row) => row[columnIndex]) })).filter(({ values }) => isZeroVariance(values) || values.some((value) => !Number.isFinite(value))).map(({ header }) => header);
          if (constantColumns.length > 0) errors.push(`Correlation distance is undefined for zero-variance column vectors: ${constantColumns.slice(0, 8).join(", ")}${constantColumns.length > 8 ? "…" : ""}. Use Euclidean distance or remove/transform these columns.`);
        }
      }
      const displayedRowIds = definition.id === "correlation-heatmap" ? numericHeaders : rowIds;
      const rowAnnotations = alignHeatmapAnnotations(settings.heatmapRowAnnotationData, displayedRowIds, "row");
      const columnAnnotations = alignHeatmapAnnotations(settings.heatmapColumnAnnotationData, numericHeaders, "column");
      errors.push(...rowAnnotations.errors, ...columnAnnotations.errors);
      warnings.push(...rowAnnotations.warnings, ...columnAnnotations.warnings);
      const annotationTracks = [...rowAnnotations.tracks, ...columnAnnotations.tracks];
      if (annotationTracks.length > 6) errors.push("The compact export supports at most six annotation tracks in total across rows and columns.");
      const legendRows = annotationTracks.reduce((sum, track) => sum + 1 + (track.kind === "continuous" ? 2 : track.categories.length), 0) + (rowAnnotations.tracks.length > 0 ? 1 : 0) + (columnAnnotations.tracks.length > 0 ? 1 : 0);
      const legendRowHeight = Math.max(8, settings.legendSize) + 3;
      const maximumLegendRows = Math.max(4, Math.floor((settings.height - 54) / legendRowHeight));
      if (legendRows > maximumLegendRows) errors.push(`Annotation legends need ${legendRows} compact rows but this ${settings.height}px-high export can display ${maximumLegendRows}; increase height or reduce tracks/categories.`);
      if (settings.heatmapShowValues && settings.heatmapDisplay === "rectangular" && displayedRowIds.length * numericHeaders.length > 225) warnings.push("Cell values are shown only when the selected view has enough room for legible text.");
      const linkedCorrelation = definition.id === "correlation-heatmap";
      if (linkedCorrelation && settings.clusterRows !== settings.clusterColumns) errors.push("Correlation heatmap row and column clustering must be enabled or disabled together because both axes represent the same variables.");
      const rowCutCount = settings.heatmapRowClusters;
      const columnCutCount = linkedCorrelation ? rowCutCount : settings.heatmapColumnClusters;
      const canCluster = definition.id !== "heatmap";
      const clusterRows = linkedCorrelation ? settings.clusterRows && settings.clusterColumns : settings.clusterRows;
      const clusterColumns = linkedCorrelation ? settings.clusterRows && settings.clusterColumns : settings.clusterColumns;
      const showRowCut = canCluster && clusterRows && rowCutCount > 1;
      const showColumnCut = canCluster && clusterColumns && columnCutCount > 1;
      const showDendrograms = settings.heatmapDisplay === "rectangular" && canCluster && settings.heatmapShowDendrograms;
      const layout = heatmapLayoutMetrics(settings, {
        hasAnnotationLegend: annotationTracks.length > 0,
        rowAnnotationTracks: rowAnnotations.tracks.length,
        columnAnnotationTracks: columnAnnotations.tracks.length,
        showRowCut,
        showColumnCut,
        showRowDendrogram: showDendrograms && clusterRows,
        showColumnDendrogram: showDendrograms && clusterColumns,
        showSidePlot: settings.heatmapDisplay === "rectangular" && settings.heatmapShowSidePlot,
        rowCount: displayedRowIds.length,
        columnCount: numericHeaders.length,
        maxColumnLabelCharacters: Math.max(0, ...numericHeaders.map((label) => label.length)),
        maxCutClusters: Math.max(showRowCut ? Math.min(rowCutCount, displayedRowIds.length) : 0, showColumnCut ? Math.min(columnCutCount, numericHeaders.length) : 0),
      });
      if (settings.heatmapDisplay === "circular") {
        if (layout.circularOuterRadius <= layout.circularInnerRadius) errors.push(`Circular heatmap tracks do not fit inside the ${settings.width} × ${settings.height} export after labels, annotation rings, and legends; increase the figure size or reduce annotations.`);
        if (layout.circularRingWidth < 0.75) errors.push(`Circular heatmap rings would be ${Math.max(0, layout.circularRingWidth).toFixed(2)} px at ${settings.width} × ${settings.height}; reduce rows or increase the figure size.`);
        else if (layout.circularRingWidth < 1.5) warnings.push(`Circular heatmap rings are approximately ${layout.circularRingWidth.toFixed(1)} px; increase the figure size or reduce rows for reliable print reproduction.`);
        if (layout.circularSectorArc < 0.75) errors.push(`Circular heatmap sectors would be ${layout.circularSectorArc.toFixed(2)} px along the outer arc; reduce columns or increase the figure size.`);
        if (settings.heatmapLabelDensity === "all") {
          const requiredRingListHeight = displayedRowIds.length * (Math.max(8, settings.legendSize) + 3);
          if (requiredRingListHeight > layout.circularRingListAvailableHeight) errors.push(`All ${displayedRowIds.length} ring identities need ${requiredRingListHeight.toFixed(0)} px, but only ${layout.circularRingListAvailableHeight.toFixed(0)} px is available; use Auto label density, increase height, or reduce rows.`);
        }
        if (layout.cutLegendWidth > layout.frame.plotWidth) errors.push(`The cluster-cut legend needs ${layout.cutLegendWidth.toFixed(0)} px of width, but the circular plot frame has ${layout.frame.plotWidth.toFixed(0)} px; increase width, reduce the cut count, or reduce legend size.`);
      } else {
        if (layout.matrixWidth < 70) errors.push(`The heatmap matrix has only ${Math.max(0, layout.matrixWidth).toFixed(0)} px of usable width after dendrograms, annotations, legends, and the side plot; increase width or hide optional layers (minimum 70 px).`);
        if (layout.matrixHeight < 70) errors.push(`The heatmap matrix has only ${Math.max(0, layout.matrixHeight).toFixed(0)} px of usable height after dendrograms, annotations, and legends; increase height or hide optional layers (minimum 70 px).`);
        if (layout.cutLegendWidth > Math.max(0, layout.matrixWidth)) errors.push(`The cluster-cut legend needs ${layout.cutLegendWidth.toFixed(0)} px, but the matrix header has ${Math.max(0, layout.matrixWidth).toFixed(0)} px; increase width, reduce the cut count, or reduce legend size.`);
      }
      if (settings.heatmapRowClusters > displayedRowIds.length) warnings.push(`Row cluster cut is capped at ${displayedRowIds.length}, the number of displayed rows.`);
      if (columnCutCount > numericHeaders.length) warnings.push(`Column cluster cut is capped at ${numericHeaders.length}, the number of displayed columns.`);
    }
    return { errors, warnings };
  }

  definition.roles.filter((role) => !settings || isPlotRoleActive(definition.id, role.key, settings)).forEach((role) => {
    const column = mapping[role.key];
    if (role.required && !column) errors.push(`${role.label} must be mapped to a column.`);
    if (column && !dataset.headers.includes(column)) errors.push(`${role.label} references a missing column (${column}).`);
    if (column && role.kind === "number") {
      const invalidCount = dataset.rows.filter((row) => {
        const value = (definition.id === "enrichment" || definition.id === "enrichment-bar") && role.key === "ratio"
          ? parseRatioValue(row[column])
          : parseNumericValue(row[column]);
        return value === null;
      }).length;
      if (invalidCount > 0) errors.push(`${role.label} contains ${invalidCount} non-numeric or blank value${invalidCount === 1 ? "" : "s"}.`);
    }
    if (column && role.required && role.kind !== "number") {
      const blankCount = dataset.rows.filter((row) => !row[column]?.trim()).length;
      if (blankCount > 0) errors.push(`${role.label} contains ${blankCount} blank value${blankCount === 1 ? "" : "s"}.`);
    }
  });

  if (["volcano", "ma", "enrichment", "enrichment-bar"].includes(definition.id) && mapping.pValue) {
    const pColumn = mapping.pValue;
    const invalidP = pColumn
      ? dataset.rows.filter((row) => {
          const value = parseNumericValue(row[pColumn]);
          return value === null || value <= 0 || value > 1;
        }).length
      : 0;
    if (invalidP > 0) errors.push(`Adjusted P value contains ${invalidP} value${invalidP === 1 ? "" : "s"} outside (0, 1].`);
  }

  if (["pie", "donut", "waffle", "rose"].includes(definition.id) && mapping.value) {
    const values = dataset.rows.map((row) => parseNumericValue(row[mapping.value]) ?? 0);
    const negative = values.filter((value) => value < 0).length;
    if (negative > 0) errors.push(`${definition.name} requires non-negative values; detected ${negative} negative value${negative === 1 ? "" : "s"}.`);
    if (values.reduce((sum, value) => sum + value, 0) <= 0) errors.push(`${definition.name} requires a positive displayed total.`);
    const categoryCount = mapping.category ? new Set(dataset.rows.map((row) => row[mapping.category]).filter(Boolean)).size : 0;
    if (mapping.category && categoryCount !== dataset.rows.length) errors.push(`${definition.name} requires one row per unique category.`);
    if (categoryCount > 12) errors.push(`${definition.name} is limited to 12 categories so every exported category remains identifiable; aggregate small parts or use a sorted bar chart.`);
    if (definition.id === "rose" && settings?.radialMaximum !== null && settings?.radialMaximum !== undefined) {
      if (settings.radialMaximum <= 0) errors.push("Radial maximum must be positive or left on Auto.");
      else if (values.some((value) => value > settings.radialMaximum!)) warnings.push("The manual radial maximum clips one or more rose sectors.");
    }
  }

  if (["treemap", "sunburst"].includes(definition.id) && mapping.node && mapping.value) {
    const nodes = dataset.rows.map((row) => row[mapping.node]?.trim()).filter(Boolean);
    const nodeSet = new Set(nodes);
    if (nodeSet.size !== nodes.length) errors.push("Hierarchy node labels must be unique.");
    const roots = dataset.rows.filter((row) => !mapping.parent || !row[mapping.parent]?.trim());
    if (roots.length !== 1) errors.push(`Hierarchy data require exactly one blank-parent root; detected ${roots.length}.`);
    if (roots.length === 1) {
      const expectedRootBlankWarning = warnings.indexOf("1 blank cell detected.");
      if (expectedRootBlankWarning >= 0) warnings.splice(expectedRootBlankWarning, 1);
      if (definition.id === "sunburst" && mapping.parent) {
        const rootName = roots[0][mapping.node]?.trim();
        const topLevelCount = dataset.rows.filter((row) => row[mapping.parent]?.trim() === rootName).length;
        if (topLevelCount > 12) errors.push("Sunburst is limited to 12 top-level branches so every exported branch remains identifiable; combine small branches or use a treemap.");
      }
    }
    const missingParents = dataset.rows.filter((row) => {
      const parent = mapping.parent ? row[mapping.parent]?.trim() : "";
      return Boolean(parent) && !nodeSet.has(parent);
    }).length;
    if (missingParents > 0) errors.push(`${missingParents} hierarchy node${missingParents === 1 ? " references" : "s reference"} a missing parent.`);
    const selfParents = dataset.rows.filter((row) => mapping.parent && row[mapping.node]?.trim() === row[mapping.parent]?.trim()).length;
    if (selfParents > 0) errors.push(`${selfParents} hierarchy node${selfParents === 1 ? " is" : "s are"} its own parent.`);
    const negative = dataset.rows.filter((row) => (parseNumericValue(row[mapping.value]) ?? 0) < 0).length;
    if (negative > 0) errors.push(`Hierarchy leaf values must be non-negative; detected ${negative} negative value${negative === 1 ? "" : "s"}.`);
    const parents = new Set(dataset.rows.map((row) => mapping.parent ? row[mapping.parent]?.trim() : "").filter(Boolean));
    const internalValues = dataset.rows.filter((row) => parents.has(row[mapping.node]?.trim()) && (parseNumericValue(row[mapping.value]) ?? 0) !== 0).length;
    if (internalValues > 0) errors.push(`${internalValues} internal hierarchy node${internalValues === 1 ? " has" : "s have"} a non-zero value; enter values on leaves only.`);
    if (mapping.parent && roots.length === 1) {
      const rootName = roots[0][mapping.node]?.trim();
      const parentByNode = new Map(dataset.rows.map((row) => [row[mapping.node]?.trim(), row[mapping.parent]?.trim()]));
      let cycleCount = 0;
      let disconnectedCount = 0;
      for (const node of nodes) {
        const visited = new Set<string>();
        let cursor = node;
        while (cursor && cursor !== rootName) {
          if (visited.has(cursor)) { cycleCount += 1; break; }
          visited.add(cursor);
          cursor = parentByNode.get(cursor) ?? "";
        }
        if (cursor !== rootName && ![...visited].some((visitedNode) => parentByNode.get(visitedNode) && !nodeSet.has(parentByNode.get(visitedNode)!))) disconnectedCount += 1;
      }
      if (cycleCount > 0) errors.push("Hierarchy parent relationships contain a cycle.");
      else if (disconnectedCount > 0 && missingParents === 0) errors.push(`${disconnectedCount} hierarchy node${disconnectedCount === 1 ? " is" : "s are"} disconnected from the root.`);
    }
    const leafTotal = dataset.rows.filter((row) => !parents.has(row[mapping.node]?.trim())).reduce((sum, row) => sum + (parseNumericValue(row[mapping.value]) ?? 0), 0);
    if (leafTotal <= 0) errors.push("Hierarchy data require a positive total across leaf nodes.");
    if (dataset.rows.length > 80) warnings.push(`${definition.name} has ${dataset.rows.length} nodes; labels may be dense in a compact export.`);
  }

  if (["radar", "polar-profile"].includes(definition.id) && mapping.value) {
    const categoryRole = definition.id === "radar" ? "feature" : "angle";
    const categoryColumn = mapping[categoryRole];
    const seriesColumn = mapping.series;
    const series = [...new Set(dataset.rows.map((row) => seriesColumn ? row[seriesColumn] || "All" : "All"))];
    const referenceCategories = categoryColumn ? [...new Set(dataset.rows.filter((row) => (seriesColumn ? row[seriesColumn] || "All" : "All") === series[0]).map((row) => row[categoryColumn]))] : [];
    if (referenceCategories.length < 3) errors.push(`${definition.name} requires at least three ${definition.id === "radar" ? "features" : "ordered angle categories"}.`);
    for (const currentSeries of series.slice(1)) {
      const categories = categoryColumn ? new Set(dataset.rows.filter((row) => (seriesColumn ? row[seriesColumn] || "All" : "All") === currentSeries).map((row) => row[categoryColumn])) : new Set<string>();
      if (categories.size !== referenceCategories.length || referenceCategories.some((category) => !categories.has(category))) {
        errors.push(`Every ${definition.name} series must contain the same category set.`);
        break;
      }
      if (definition.id === "polar-profile" && categoryColumn) {
        const orderedCategories = dataset.rows.filter((row) => (seriesColumn ? row[seriesColumn] || "All" : "All") === currentSeries).map((row) => row[categoryColumn]);
        if (orderedCategories.some((category, index) => category !== referenceCategories[index])) {
          errors.push("Every Polar profile series must use the same category order.");
          break;
        }
      }
    }
    const duplicates = new Set<string>();
    const seen = new Set<string>();
    dataset.rows.forEach((row) => {
      const key = `${seriesColumn ? row[seriesColumn] || "All" : "All"}\u0000${categoryColumn ? row[categoryColumn] : ""}`;
      if (seen.has(key)) duplicates.add(key); else seen.add(key);
    });
    if (duplicates.size > 0) errors.push(`${definition.name} requires one value per category and series; detected ${duplicates.size} duplicate pair${duplicates.size === 1 ? "" : "s"}.`);
    const negative = dataset.rows.filter((row) => (parseNumericValue(row[mapping.value]) ?? 0) < 0).length;
    if (negative > 0) errors.push(`${definition.name} radial values must be non-negative; detected ${negative} negative value${negative === 1 ? "" : "s"}.`);
    if (series.length > 5) warnings.push(`${definition.name} overlays ${series.length} series; use facets or fewer series to avoid occlusion.`);
    if (settings?.radialMaximum !== null && settings?.radialMaximum !== undefined) {
      if (settings.radialMaximum <= 0) errors.push("Radial maximum must be positive or left on Auto.");
      else if (dataset.rows.some((row) => (parseNumericValue(row[mapping.value]) ?? 0) > settings.radialMaximum!)) warnings.push(`The manual radial maximum clips one or more ${definition.name} values.`);
    }
  }

  if (definition.id === "population-pyramid" && mapping.category && mapping.value && mapping.group) {
    const groups = [...new Set(dataset.rows.map((row) => row[mapping.group]).filter(Boolean))];
    if (groups.length !== 2) errors.push(`Population pyramids require exactly two groups; detected ${groups.length}.`);
    const negative = dataset.rows.filter((row) => (parseNumericValue(row[mapping.value]) ?? 0) < 0).length;
    if (negative > 0) errors.push(`Population-pyramid inputs must be non-negative; detected ${negative} negative value${negative === 1 ? "" : "s"}.`);
    const pairs = dataset.rows.map((row) => `${row[mapping.category]}\u0000${row[mapping.group]}`);
    if (new Set(pairs).size !== pairs.length) errors.push("Population pyramids require one value per category and group pair.");
    const categories = [...new Set(dataset.rows.map((row) => row[mapping.category]).filter(Boolean))];
    if (groups.length === 2 && categories.some((category) => groups.some((group) => !dataset.rows.some((row) => row[mapping.category] === category && row[mapping.group] === group)))) {
      errors.push("Every population-pyramid category must contain both groups.");
    }
    if (groups.some((group) => dataset.rows.filter((row) => row[mapping.group] === group).reduce((sum, row) => sum + (parseNumericValue(row[mapping.value]) ?? 0), 0) <= 0)) {
      errors.push("Each population-pyramid group requires a positive displayed total.");
    }
  }

  if (definition.id === "bar" || definition.id === "line" || definition.id === "errorbar") {
    const barSupportsUncertainty = definition.id !== "bar" || !settings || !["stacked", "percentage", "polar"].includes(settings.barVariant);
    const errorType = definition.id === "bar" ? (barSupportsUncertainty ? settings?.barErrorType : "none") : settings?.lineErrorType;
    const calculatesFromLongForm = definition.id === "bar" && settings?.barInputMode === "long";
    if (definition.id !== "errorbar" && errorType !== undefined && errorType !== "none" && !mapping.error && !calculatesFromLongForm) {
      errors.push(`Map an error column before displaying ${errorType.toUpperCase()} error bars.`);
    }
    if (mapping.error && (definition.id !== "bar" || !settings || isPlotRoleActive("bar", "error", settings))) {
      const negativeErrors = dataset.rows.filter((row) => {
        const value = parseNumericValue(row[mapping.error]);
        return value !== null && value < 0;
      }).length;
      if (negativeErrors > 0) errors.push(`Error magnitude contains ${negativeErrors} negative value${negativeErrors === 1 ? "" : "s"}; SD and SEM must be non-negative, as must all uncertainty half-widths.`);
    }
  }

  if ((definition.id === "scatter" || definition.id === "correlation") && settings) {
    const needsZ = ["pair-matrix", "3d", "ternary"].includes(settings.associationVariant);
    if (needsZ && !mapping.z) errors.push(`${settings.associationVariant === "pair-matrix" ? "Pair-matrix" : settings.associationVariant === "3d" ? "3D scatter" : "Ternary scatter"} requires a mapped Z / third component column.`);
    const points = dataset.rows.flatMap((row) => {
      const x = parseNumericValue(row[mapping.x]);
      const y = parseNumericValue(row[mapping.y]);
      const z = mapping.z ? parseNumericValue(row[mapping.z]) : null;
      return x === null || y === null ? [] : [{ x, y, z, group: mapping.group ? row[mapping.group] || "All" : "All" }];
    });
    if (settings.associationVariant === "ternary" && mapping.z) {
      const negative = points.filter((point) => point.x < 0 || point.y < 0 || (point.z ?? -1) < 0).length;
      const zeroTotal = points.filter((point) => point.x + point.y + (point.z ?? 0) <= 0).length;
      if (negative > 0) errors.push(`Ternary scatter requires non-negative components; detected ${negative} invalid row${negative === 1 ? "" : "s"}.`);
      if (zeroTotal > 0) errors.push(`Ternary scatter requires a positive row total; detected ${zeroTotal} zero-total row${zeroTotal === 1 ? "" : "s"}.`);
      if (points.length > 0 && points.some((point) => Math.abs(point.x + point.y + (point.z ?? 0) - 1) > 1e-6)) warnings.push("Ternary rows are normalized to proportions because one or more component totals differ from 1.");
    }
    if (settings.associationVariant === "3d" && mapping.z && new Set(points.map((point) => point.z)).size < 2) warnings.push("The mapped Z values are constant, so the orthographic 3D projection contains no depth variation.");
    const buckets = settings.associationGroupMode === "by-group"
      ? [...new Set(points.map((point) => point.group))].map((group) => ({ group, points: points.filter((point) => point.group === group) }))
      : [{ group: "Combined", points }];
    const supportsPlanarAnalysis = !["pair-matrix", "3d", "ternary"].includes(settings.associationVariant);
    const reportsByGroup = settings.associationGroupMode === "by-group" && (definition.id === "correlation" || settings.associationShowPValue || settings.associationFit !== "none");
    if (supportsPlanarAnalysis && reportsByGroup && buckets.length > 4) errors.push(`Compact by-group association summaries support at most four groups; found ${buckets.length}. Choose Combined group behavior or filter the displayed groups.`);
    if (supportsPlanarAnalysis && settings.associationFit !== "none") {
      const minimum = settings.associationFit === "polynomial" ? settings.associationPolynomialDegree + 2 : settings.associationFit === "loess" ? 4 : 3;
      const undersized = buckets.filter((bucket) => bucket.points.length < minimum).map((bucket) => `${bucket.group} (n=${bucket.points.length})`);
      if (undersized.length > 0) errors.push(`${settings.associationFit === "linear" ? "Linear regression" : settings.associationFit === "polynomial" ? `Degree-${settings.associationPolynomialDegree} polynomial regression` : "LOESS"} requires at least ${minimum} observations per fitted set; insufficient: ${undersized.join(", ")}.`);
      const requiredDistinctX = settings.associationFit === "polynomial" ? settings.associationPolynomialDegree + 1 : 2;
      const degenerate = buckets.filter((bucket) => new Set(bucket.points.map((point) => point.x)).size < requiredDistinctX).map((bucket) => bucket.group);
      if (degenerate.length > 0) errors.push(`${settings.associationFit === "polynomial" ? `Degree-${settings.associationPolynomialDegree} polynomial regression` : settings.associationFit === "linear" ? "Linear regression" : "LOESS"} requires at least ${requiredDistinctX} distinct X values per fitted set; affected: ${degenerate.join(", ")}.`);
      if (settings.yMin !== null || settings.yMax !== null) {
        const displayedBuckets = buckets.map((bucket) => ({ ...bucket, points: bucket.points.map((point) => settings.swapAxes ? { x: point.y, y: point.x } : point) }));
        const displayedX = displayedBuckets.flatMap((bucket) => bucket.points.map((point) => point.x));
        const xDomain = resolveAxisDomain(numericExtent(displayedX), settings.xMin, settings.xMax);
        const samples = Array.from({ length: 64 }, (_, index) => xDomain[0] + (xDomain[1] - xDomain[0]) * index / 63);
        const fittedValues = displayedBuckets.flatMap((bucket) => {
          if (settings.associationFit === "linear") {
            const fit = linearRegression(bucket.points);
            if (!fit) return [];
            const curve = samples.map((x) => fit.intercept + fit.slope * x);
            const band = settings.associationShowConfidenceBand ? linearConfidenceBand95(bucket.points, samples).flatMap((point) => [point.lower, point.upper]) : [];
            return [...curve, ...band];
          }
          if (settings.associationFit === "polynomial") {
            const fit = polynomialRegression(bucket.points, settings.associationPolynomialDegree);
            return fit ? samples.map((x) => fit.predict(x)) : [];
          }
          return loessSmooth(bucket.points, settings.associationLoessSpan).map((point) => point.y);
        });
        const clippedFit = fittedValues.some((value) => (settings.yMin !== null && value < settings.yMin) || (settings.yMax !== null && value > settings.yMax));
        if (clippedFit) warnings.push("Manual Y-axis limits clip part of the fitted curve or confidence band.");
      }
    }
    if (supportsPlanarAnalysis && settings.associationShowConfidenceBand && settings.associationFit !== "linear") errors.push("Mean 95% confidence bands are currently supported only for linear regression fits.");
    if (supportsPlanarAnalysis && (definition.id === "correlation" || settings.associationShowPValue)) {
      const undersized = buckets.filter((bucket) => bucket.points.length < 3).map((bucket) => `${bucket.group} (n=${bucket.points.length})`);
      if (undersized.length > 0) errors.push(`Correlation P values require at least three observations per reported set; insufficient: ${undersized.join(", ")}.`);
      const constant = buckets.filter((bucket) => new Set(bucket.points.map((point) => point.x)).size < 2 || new Set(bucket.points.map((point) => point.y)).size < 2).map((bucket) => bucket.group);
      if (constant.length > 0) errors.push(`Correlation is undefined for constant X or Y values; affected: ${constant.join(", ")}.`);
    }
    if (["density", "hexbin"].includes(settings.associationVariant) && settings.associationGroupMode !== "combined") errors.push("Density and hexbin aggregation require Combined group behavior so every bin uses one shared count or intensity scale.");
    if (["ellipse", "hull"].includes(settings.associationVariant)) {
      const minimum = settings.associationVariant === "ellipse" ? 3 : 3;
      const undersized = buckets.filter((bucket) => bucket.points.length < minimum).map((bucket) => `${bucket.group} (n=${bucket.points.length})`);
      if (undersized.length > 0) errors.push(`${settings.associationVariant === "ellipse" ? "Covariance ellipses" : "Convex hulls"} require at least three observations per displayed set; insufficient: ${undersized.join(", ")}.`);
      const degenerate = buckets.filter((bucket) => {
        const meanX = bucket.points.reduce((sum, point) => sum + point.x, 0) / Math.max(1, bucket.points.length);
        const meanY = bucket.points.reduce((sum, point) => sum + point.y, 0) / Math.max(1, bucket.points.length);
        const xx = bucket.points.reduce((sum, point) => sum + (point.x - meanX) ** 2, 0);
        const yy = bucket.points.reduce((sum, point) => sum + (point.y - meanY) ** 2, 0);
        const xy = bucket.points.reduce((sum, point) => sum + (point.x - meanX) * (point.y - meanY), 0);
        return xx * yy - xy * xy <= 1e-12;
      }).map((bucket) => bucket.group);
      if (degenerate.length > 0) errors.push(`${settings.associationVariant === "ellipse" ? "Covariance ellipses" : "Convex hulls"} require non-collinear X/Y observations; affected: ${degenerate.join(", ")}.`);
      if (settings.associationVariant === "ellipse" && [settings.xMin, settings.xMax, settings.yMin, settings.yMax].some((limit) => limit !== null)) {
        const boundary = buckets.flatMap((bucket) => covarianceEllipsePoints(bucket.points.map((point) => settings.swapAxes ? { x: point.y, y: point.x } : point)));
        const clipped = boundary.some((point) => (settings.xMin !== null && point.x < settings.xMin) || (settings.xMax !== null && point.x > settings.xMax) || (settings.yMin !== null && point.y < settings.yMin) || (settings.yMax !== null && point.y > settings.yMax));
        if (clipped) warnings.push("Manual axis limits clip part of at least one 95% covariance ellipse boundary.");
      }
    }
    if (settings.associationVariant === "density" && points.length < 5) warnings.push("Two-dimensional density estimates are unstable with fewer than five observations.");
    if (settings.associationVariant === "hexbin" && points.length < 10) warnings.push("Hexbin aggregation is usually unnecessary with fewer than ten observations; a point view may be clearer.");
  }

  if (definition.id === "bar" && settings) {
    const needsSecondary = ["dual-axis", "overlay"].includes(settings.barVariant);
    const needsTarget = settings.barVariant === "bullet";
    const needsFacet = settings.barVariant === "faceted";
    if (needsSecondary && !mapping.secondary) errors.push(`${settings.barVariant === "dual-axis" ? "Dual-axis" : "Overlay"} bars require a mapped secondary value column.`);
    if (needsTarget && !mapping.target) errors.push("Bullet charts require a mapped target value column.");
    if (needsFacet && !mapping.facet) errors.push("Faceted bars require a mapped facet column.");
    if (settings.showSignificance && settings.barVariant !== "polar" && !mapping.pValue) errors.push("Map a P value column before displaying significance annotations.");
    if (mapping.pValue && isPlotRoleActive("bar", "pValue", settings)) {
      const invalidP = dataset.rows.filter((row) => {
        const value = parseNumericValue(row[mapping.pValue]);
        return value === null || value <= 0 || value > 1;
      }).length;
      if (invalidP > 0) errors.push(`P value contains ${invalidP} value${invalidP === 1 ? "" : "s"} outside (0, 1].`);
    }
    if (settings.barVariant === "axis-break" && settings.axisBreakStart >= settings.axisBreakEnd) {
      errors.push("Axis-break start must be lower than axis-break end.");
    }
    if (settings.barVariant === "pyramid" && (!mapping.group || new Set(dataset.rows.map((row) => row[mapping.group]).filter(Boolean)).size < 2)) {
      errors.push("Pyramid charts require at least two groups.");
    }
    if (settings.barVariant === "polar") {
      const negativeValues = dataset.rows.filter((row) => (parseNumericValue(row[mapping.value]) ?? 0) < 0).length;
      if (negativeValues > 0) errors.push("Polar bars require non-negative values because radius cannot encode direction.");
    }
    if (settings.barVariant === "percentage") {
      const negativeValues = dataset.rows.filter((row) => (parseNumericValue(row[mapping.value]) ?? 0) < 0).length;
      if (negativeValues > 0) errors.push("100% stacked bars require non-negative parts; use Bidirectional for signed values.");
    }
    if (settings.barVariant === "axis-break") {
      const displayedValues = settings.barInputMode === "long" ? [...dataset.rows.reduce((buckets, row) => {
        const value = parseNumericValue(row[mapping.value]);
        if (value === null) return buckets;
        const key = `${row[mapping.category] ?? ""}\u0000${mapping.group ? row[mapping.group] ?? "" : ""}\u0000${mapping.facet ? row[mapping.facet] ?? "" : ""}`;
        const bucket = buckets.get(key) ?? []; bucket.push(value); buckets.set(key, bucket); return buckets;
      }, new Map<string, number[]>()).values()].flatMap((values) => {
        const summary = meanErrorStatistics(values);
        const error = settings.barErrorType === "sd" ? summary.sd : settings.barErrorType === "sem" ? summary.sem : 0;
        return error > 0 ? [summary.mean, summary.mean - error, summary.mean + error] : [summary.mean];
      }) : dataset.rows.flatMap((row) => {
        const value = parseNumericValue(row[mapping.value]);
        if (value === null) return [];
        const error = isPlotRoleActive("bar", "error", settings) && mapping.error ? Math.max(0, parseNumericValue(row[mapping.error]) ?? 0) : 0;
        return error > 0 ? [value, value - error, value + error] : [value];
      });
      if (!displayedValues.some((value) => value <= settings.axisBreakStart) || !displayedValues.some((value) => value >= settings.axisBreakEnd)) {
        warnings.push("The current data do not span both sides of the requested axis break; the preview will use an unbroken scale.");
      }
      const insideBreak = displayedValues.filter((value) => value > settings.axisBreakStart && value < settings.axisBreakEnd).length;
      if (insideBreak > 0) errors.push(`Axis break contains ${insideBreak} displayed value${insideBreak === 1 ? "" : "s"} or uncertainty bound${insideBreak === 1 ? "" : "s"}; choose an empty interval so no marks are hidden or relocated.`);
    }
    if (settings.barInputMode === "long" && mapping.error) {
      warnings.push("Long-form mode calculates SD or SEM from replicate observations; the mapped summary error column is ignored.");
    }
  }

  if (["box", "violin", "beeswarm", "raincloud", "histogram", "density", "ridge"].includes(definition.id) && mapping.group) {
    const lanes = distributionNumericLanes(dataset.rows, mapping.group, mapping.value, mapping.facet);
    for (const lane of lanes) {
      const label = mapping.facet ? `${lane.facet} / ${lane.group}` : lane.group;
      if (lane.values.length < 3) warnings.push(`${label} has n=${lane.values.length}; distribution estimates are unstable.`);
    }
    if (settings) {
      const visibleLayers = settings.showDensity || settings.showHistogram || settings.showBox || settings.showPoints || settings.distributionSummary !== "none" || settings.boxErrorType !== "none";
      if (!visibleLayers) errors.push("Enable at least one distribution layer before exporting.");
      if (settings.histogramBins < 3 || settings.histogramBins > 60 || !Number.isInteger(settings.histogramBins)) errors.push("Histogram bins must be an integer from 3 to 60.");
      if (settings.distributionShowPairedLines) {
        if (!mapping.subject) errors.push("Map a Subject / pair ID column before displaying paired lines.");
        else {
          const blankSubjects = dataset.rows.filter((row) => !row[mapping.subject]?.trim()).length;
          if (blankSubjects > 0) errors.push(`Subject / pair ID contains ${blankSubjects} blank value${blankSubjects === 1 ? "" : "s"}; paired lines require a complete identifier for every row.`);
          const pairKeys = dataset.rows.filter((row) => row[mapping.subject]?.trim()).map((row) => `${mapping.facet ? row[mapping.facet] || "All" : "All"}\u0000${row[mapping.group]}\u0000${row[mapping.subject]}`);
          if (new Set(pairKeys).size !== pairKeys.length) errors.push("Paired distribution data require at most one value per subject, group, and facet combination.");
          const facets = [...new Set(dataset.rows.map((row) => mapping.facet ? row[mapping.facet] || "All" : "All"))];
          for (const facet of facets) {
            const facetRows = dataset.rows.filter((row) => (mapping.facet ? row[mapping.facet] || "All" : "All") === facet && row[mapping.subject]?.trim());
            const requiredGroups = [...new Set(facetRows.map((row) => row[mapping.group] || "All"))].sort();
            if (requiredGroups.length < 2) {
              errors.push(`${mapping.facet ? `${facet}: ` : ""}Paired lines require at least two groups.`);
              continue;
            }
            const subjects = [...new Set(facetRows.map((row) => row[mapping.subject]))];
            for (const subject of subjects) {
              const observedGroups = [...new Set(facetRows.filter((row) => row[mapping.subject] === subject).map((row) => row[mapping.group] || "All"))].sort();
              if (observedGroups.length !== requiredGroups.length || observedGroups.some((group, index) => group !== requiredGroups[index])) {
                errors.push(`${mapping.facet ? `${facet}: ` : ""}Subject ${subject} is missing one or more paired groups; every subject must have the same group set within a facet.`);
              }
            }
          }
        }
      }
      if (settings.distributionShowSignificance) {
        if (!mapping.pValue) errors.push("Map a Group P value column before displaying significance labels.");
        else {
          const invalidP = dataset.rows.filter((row) => {
            const value = parseNumericValue(row[mapping.pValue]);
            return value === null || value <= 0 || value > 1;
          }).length;
          if (invalidP > 0) errors.push(`Facet / comparison P value contains ${invalidP} value${invalidP === 1 ? "" : "s"} outside (0, 1].`);
          const facetValues = new Map<string, Set<number>>();
          dataset.rows.forEach((row) => { const value = parseNumericValue(row[mapping.pValue]); if (value === null) return; const facet = mapping.facet ? row[mapping.facet] || "All" : "All"; const values = facetValues.get(facet) ?? new Set<number>(); values.add(value); facetValues.set(facet, values); });
          if ([...facetValues.values()].some((values) => values.size > 1)) errors.push("Each facet must supply one consistent comparison P value.");
        }
      }
      if (settings.boxErrorType !== "none") {
        const insufficient = lanes.filter((lane) => lane.values.length < 2).map((lane) => mapping.facet ? `${lane.facet} / ${lane.group}` : lane.group);
        if (insufficient.length > 0) errors.push(`Uncertainty requires at least two observations in every facet × group lane; insufficient: ${insufficient.join(", ")}.`);
      }
    }
  }

  if (definition.id === "ma" && mapping.mean) {
    const invalidMean = dataset.rows.filter((row) => (parseNumericValue(row[mapping.mean]) ?? 0) <= 0).length;
    if (invalidMean > 0) errors.push(`Mean expression contains ${invalidMean} non-positive value${invalidMean === 1 ? "" : "s"}; MA plots require positive abundance.`);
  }

  if (definition.id === "gsea" && mapping.hit) {
    const invalidHits = dataset.rows.filter((row) => ![0, 1].includes(parseNumericValue(row[mapping.hit]) ?? Number.NaN)).length;
    if (invalidHits > 0) errors.push(`Gene-set hit contains ${invalidHits} value${invalidHits === 1 ? "" : "s"} other than 0 or 1.`);
  }

  if (definition.id === "km") {
    const invalidEvents = dataset.rows.filter((row) => ![0, 1].includes(parseNumericValue(row[mapping.event]) ?? Number.NaN)).length;
    const invalidTimes = dataset.rows.filter((row) => (parseNumericValue(row[mapping.time]) ?? -1) < 0).length;
    if (invalidEvents > 0) errors.push(`Event contains ${invalidEvents} value${invalidEvents === 1 ? "" : "s"} other than 0 or 1.`);
    if (invalidTimes > 0) errors.push(`Follow-up time contains ${invalidTimes} negative value${invalidTimes === 1 ? "" : "s"}.`);
  }

  if (definition.id === "roc" && mapping.truth) {
    const invalidTruth = dataset.rows.filter((row) => ![0, 1].includes(parseNumericValue(row[mapping.truth]) ?? Number.NaN)).length;
    if (invalidTruth > 0) errors.push(`True class contains ${invalidTruth} value${invalidTruth === 1 ? "" : "s"} other than 0 or 1.`);
    const classes = new Set(dataset.rows.map((row) => parseNumericValue(row[mapping.truth])));
    if (invalidTruth === 0 && classes.size < 2) errors.push("ROC calculation requires both outcome classes (0 and 1).");
  }

  if (definition.id === "survival-forest") {
    const invalidIntervals = dataset.rows.filter((row) => {
      const estimate = parseNumericValue(row[mapping.estimate]);
      const lower = parseNumericValue(row[mapping.lower]);
      const upper = parseNumericValue(row[mapping.upper]);
      return estimate === null || lower === null || upper === null || lower > estimate || estimate > upper;
    }).length;
    if (invalidIntervals > 0) errors.push(`${invalidIntervals} confidence interval${invalidIntervals === 1 ? " is" : "s are"} not ordered lower ≤ estimate ≤ upper.`);
  }

  if (definition.id === "venn" && mapping.set) {
    const setCount = new Set(dataset.rows.map((row) => row[mapping.set]).filter(Boolean)).size;
    if (setCount < 2 || setCount > 3) errors.push(`Venn diagrams require 2–3 unique sets; detected ${setCount}. Use UpSet for more sets.`);
  }

  if (["sankey", "chord"].includes(definition.id) && mapping.value) {
    const negativeWeights = dataset.rows.filter((row) => (parseNumericValue(row[mapping.value]) ?? 0) < 0).length;
    if (negativeWeights > 0) errors.push(`Weight contains ${negativeWeights} negative value${negativeWeights === 1 ? "" : "s"}.`);
    if (dataset.rows.length > 250) warnings.push("More than 250 network edges will be visually dense; filter or aggregate before publication.");
  }

  if (definition.id === "circos") {
    const invalidIntervals = dataset.rows.filter((row) => {
      const ss = parseNumericValue(row[mapping.sourceStart]);
      const se = parseNumericValue(row[mapping.sourceEnd]);
      const ts = parseNumericValue(row[mapping.targetStart]);
      const te = parseNumericValue(row[mapping.targetEnd]);
      return ss === null || se === null || ts === null || te === null || ss < 0 || ts < 0 || se < ss || te < ts;
    }).length;
    if (invalidIntervals > 0) errors.push(`${invalidIntervals} Circos row${invalidIntervals === 1 ? " has" : "s have"} invalid genomic intervals.`);
    if (dataset.rows.length > 500) warnings.push("More than 500 Circos links may obscure structure; consider filtering by evidence or weight.");
  }

  return { errors: [...new Set(errors)].slice(0, 10), warnings: [...new Set(warnings)].slice(0, 10) };
}

export function groupNumericValues(rows: DelimitedRow[], groupColumn: string, valueColumn: string) {
  const groups = new Map<string, number[]>();
  rows.forEach((row) => {
    const group = row[groupColumn] || "All";
    const value = parseNumericValue(row[valueColumn]);
    if (value === null) return;
    const current = groups.get(group) ?? [];
    current.push(value);
    groups.set(group, current);
  });
  return groups;
}

export function distributionNumericLanes(rows: DelimitedRow[], groupColumn: string, valueColumn: string, facetColumn = "") {
  const lanes = new Map<string, { facet: string; group: string; values: number[] }>();
  rows.forEach((row) => {
    const facet = facetColumn ? row[facetColumn] || "All" : "All";
    const group = row[groupColumn] || "All";
    const value = parseNumericValue(row[valueColumn]);
    if (value === null) return;
    const key = `${facet}\u0000${group}`;
    const lane = lanes.get(key) ?? { facet, group, values: [] };
    lane.values.push(value);
    lanes.set(key, lane);
  });
  return [...lanes.values()];
}

export function quantile(values: number[], probability: number) {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const position = (sorted.length - 1) * probability;
  const lower = Math.floor(position);
  const upper = Math.ceil(position);
  if (lower === upper) return sorted[lower];
  return sorted[lower] + (sorted[upper] - sorted[lower]) * (position - lower);
}

export function boxStatistics(values: number[]) {
  const sorted = [...values].sort((a, b) => a - b);
  const q1 = quantile(sorted, 0.25);
  const median = quantile(sorted, 0.5);
  const q3 = quantile(sorted, 0.75);
  const iqr = q3 - q1;
  const lowerFence = q1 - 1.5 * iqr;
  const upperFence = q3 + 1.5 * iqr;
  const inliers = sorted.filter((value) => value >= lowerFence && value <= upperFence);
  return {
    q1,
    median,
    q3,
    low: inliers[0] ?? sorted[0] ?? 0,
    high: inliers[inliers.length - 1] ?? sorted[sorted.length - 1] ?? 0,
    outliers: sorted.filter((value) => value < lowerFence || value > upperFence),
  };
}

export function meanErrorStatistics(values: number[]) {
  const finite = values.filter(Number.isFinite);
  if (finite.length === 0) return { mean: 0, sd: 0, sem: 0, n: 0 };
  const mean = finite.reduce((sum, value) => sum + value, 0) / finite.length;
  const variance = finite.length > 1
    ? finite.reduce((sum, value) => sum + (value - mean) ** 2, 0) / (finite.length - 1)
    : 0;
  const sd = Math.sqrt(variance);
  return { mean, sd, sem: sd / Math.sqrt(finite.length), n: finite.length };
}

export function confidenceInterval95(values: number[]) {
  const summary = meanErrorStatistics(values);
  if (summary.n < 2) return { mean: summary.mean, lower: summary.mean, upper: summary.mean, margin: 0, n: summary.n };
  const criticalValues = [12.706, 4.303, 3.182, 2.776, 2.571, 2.447, 2.365, 2.306, 2.262, 2.228, 2.201, 2.179, 2.160, 2.145, 2.131, 2.120, 2.110, 2.101, 2.093, 2.086, 2.080, 2.074, 2.069, 2.064, 2.060, 2.056, 2.052, 2.048, 2.045, 2.042];
  const degreesOfFreedom = summary.n - 1;
  const critical = degreesOfFreedom <= criticalValues.length ? criticalValues[degreesOfFreedom - 1] : studentTCritical95(degreesOfFreedom);
  const margin = critical * summary.sem;
  return { mean: summary.mean, lower: summary.mean - margin, upper: summary.mean + margin, margin, n: summary.n };
}

export function studentTCritical95(degreesOfFreedom: number) {
  if (!Number.isFinite(degreesOfFreedom) || degreesOfFreedom <= 0) return Number.NaN;
  const df = Math.max(1, degreesOfFreedom);
  const z = 1.959963984540054;
  const z2 = z * z;
  const z3 = z2 * z;
  const z5 = z3 * z2;
  const z7 = z5 * z2;
  const z9 = z7 * z2;
  const inverseDf = 1 / df;
  return z
    + (z3 + z) * inverseDf / 4
    + (5 * z5 + 16 * z3 + 3 * z) * inverseDf ** 2 / 96
    + (3 * z7 + 19 * z5 + 17 * z3 - 15 * z) * inverseDf ** 3 / 384
    + (79 * z9 + 776 * z7 + 1482 * z5 - 1920 * z3 - 945 * z) * inverseDf ** 4 / 92160;
}

export function deterministicHistogram(values: number[], requestedBins: number, domain?: [number, number]) {
  const finite = values.filter(Number.isFinite);
  const count = Math.max(3, Math.min(60, Math.round(requestedBins)));
  const automatic = numericExtent(finite);
  const [minimum, maximum] = domain ?? automatic;
  const span = Math.max(maximum - minimum, Number.EPSILON);
  const width = span / count;
  const bins = Array.from({ length: count }, (_, index) => ({
    index,
    lower: minimum + index * width,
    upper: index === count - 1 ? maximum : minimum + (index + 1) * width,
    midpoint: minimum + (index + 0.5) * width,
    count: 0,
  }));
  finite.forEach((value) => {
    if (value < minimum || value > maximum) return;
    const index = value === maximum ? count - 1 : Math.min(count - 1, Math.max(0, Math.floor((value - minimum) / width)));
    bins[index].count += 1;
  });
  return bins;
}

export function deterministicBeeswarmLayout(valuePositions: number[], requestedPointRadius: number, maximumOffset: number) {
  const requestedRadius = Math.max(0.05, requestedPointRadius);
  const limit = Math.max(0, maximumOffset);
  const order = valuePositions.map((valuePosition, index) => ({ valuePosition, index })).sort((left, right) => left.valuePosition - right.valuePosition || left.index - right.index);
  const attempt = (pointRadius: number, gap: number) => {
    const minimumDistance = pointRadius * 2 + gap;
    const candidateStep = Math.max(minimumDistance / 3, Number.EPSILON);
    const candidates = [0];
    for (let distance = candidateStep; distance <= limit + Number.EPSILON; distance += candidateStep) {
      const bounded = Math.min(limit, distance);
      candidates.push(bounded, -bounded);
    }
    const offsets = Array(valuePositions.length).fill(0) as number[];
    const cells = new Map<string, Array<{ valuePosition: number; offset: number }>>();
    const cellAt = (value: number) => Math.floor(value / minimumDistance);
    const clears = (valuePosition: number, offset: number) => {
      const valueCell = cellAt(valuePosition);
      const offsetCell = cellAt(offset);
      for (let valueDelta = -1; valueDelta <= 1; valueDelta += 1) {
        for (let offsetDelta = -1; offsetDelta <= 1; offsetDelta += 1) {
          const neighbors = cells.get(`${valueCell + valueDelta}\u0000${offsetCell + offsetDelta}`) ?? [];
          if (neighbors.some((point) => Math.hypot(valuePosition - point.valuePosition, offset - point.offset) < minimumDistance - 1e-7)) return false;
        }
      }
      return true;
    };
    for (const { valuePosition, index } of order) {
      const selected = candidates.find((candidate) => clears(valuePosition, candidate));
      if (selected === undefined) return null;
      offsets[index] = selected;
      const key = `${cellAt(valuePosition)}\u0000${cellAt(selected)}`;
      const points = cells.get(key) ?? [];
      points.push({ valuePosition, offset: selected });
      cells.set(key, points);
    }
    return { offsets, pointRadius, minimumDistance };
  };
  const requested = attempt(requestedRadius, 0.8);
  if (requested) return { ...requested, scaled: false };
  const capacityDistance = valuePositions.length > 1 ? (limit * 2) / (valuePositions.length - 1) : requestedRadius * 2 + 0.8;
  let scaledRadius = Math.min(requestedRadius, Math.max(Number.EPSILON, capacityDistance / 2.25));
  for (let retry = 0; retry < 12; retry += 1) {
    const scaled = attempt(scaledRadius, scaledRadius * 0.25);
    if (scaled) return { ...scaled, scaled: true };
    scaledRadius *= 0.9;
  }
  const fallbackSpacing = valuePositions.length > 1 ? (limit * 2) / (valuePositions.length - 1) : requestedRadius * 2.25;
  const fallbackRadius = fallbackSpacing / 2.25;
  const offsets = Array(valuePositions.length).fill(0) as number[];
  order.forEach(({ index }, orderIndex) => { offsets[index] = valuePositions.length > 1 ? -limit + orderIndex * fallbackSpacing : 0; });
  return { offsets, pointRadius: fallbackRadius, minimumDistance: fallbackSpacing, scaled: true };
}

export function deterministicBeeswarmOffsets(valuePositions: number[], pointRadius: number, maximumOffset: number) {
  return deterministicBeeswarmLayout(valuePositions, pointRadius, maximumOffset).offsets;
}

export function kernelDensityEstimate(
  values: number[],
  domain: [number, number],
  bandwidthAdjustment = 1,
  sampleCount = 64,
) {
  if (values.length === 0) return { bandwidth: 0, points: [] as Array<{ position: number; density: number }> };
  const sorted = [...values].sort((a, b) => a - b);
  const mean = sorted.reduce((sum, value) => sum + value, 0) / sorted.length;
  const variance = sorted.reduce((sum, value) => sum + (value - mean) ** 2, 0) / Math.max(1, sorted.length - 1);
  const standardDeviation = Math.sqrt(variance);
  const robustScale = (quantile(sorted, 0.75) - quantile(sorted, 0.25)) / 1.349;
  const positiveScales = [standardDeviation, robustScale].filter((value) => Number.isFinite(value) && value > 0);
  const domainSpan = Math.max(domain[1] - domain[0], Number.EPSILON);
  const scale = positiveScales.length > 0 ? Math.min(...positiveScales) : domainSpan / 12;
  const baseBandwidth = 0.9 * scale * Math.pow(Math.max(1, sorted.length), -0.2);
  const bandwidth = Math.max(domainSpan / 120, baseBandwidth * Math.max(0.25, bandwidthAdjustment));
  const supportPadding = bandwidth * 1.8;
  const lower = Math.max(domain[0], sorted[0] - supportPadding);
  const upper = Math.min(domain[1], sorted[sorted.length - 1] + supportPadding);
  const count = Math.max(16, sampleCount);
  const points = Array.from({ length: count }, (_, index) => {
    const position = lower + ((upper - lower) * index) / Math.max(1, count - 1);
    const density = index === 0 || index === count - 1
      ? 0
      : sorted.reduce((sum, value) => sum + Math.exp(-0.5 * ((position - value) / bandwidth) ** 2), 0)
        / (sorted.length * bandwidth * Math.sqrt(2 * Math.PI));
    return { position, density };
  });
  return { bandwidth, points };
}

export function linearRegression(points: Array<{ x: number; y: number }>) {
  if (points.length < 2) return null;
  const meanX = points.reduce((sum, point) => sum + point.x, 0) / points.length;
  const meanY = points.reduce((sum, point) => sum + point.y, 0) / points.length;
  const denominator = points.reduce((sum, point) => sum + (point.x - meanX) ** 2, 0);
  if (denominator === 0) return null;
  const slope = points.reduce((sum, point) => sum + (point.x - meanX) * (point.y - meanY), 0) / denominator;
  const intercept = meanY - slope * meanX;
  const total = points.reduce((sum, point) => sum + (point.y - meanY) ** 2, 0);
  const residual = points.reduce((sum, point) => sum + (point.y - (slope * point.x + intercept)) ** 2, 0);
  return { slope, intercept, rSquared: total === 0 ? 1 : Math.max(0, 1 - residual / total) };
}

function solveLinearSystem(matrix: number[][], vector: number[]) {
  const augmented = matrix.map((row, index) => [...row, vector[index]]);
  for (let pivot = 0; pivot < augmented.length; pivot += 1) {
    let best = pivot;
    for (let row = pivot + 1; row < augmented.length; row += 1) if (Math.abs(augmented[row][pivot]) > Math.abs(augmented[best][pivot])) best = row;
    [augmented[pivot], augmented[best]] = [augmented[best], augmented[pivot]];
    const divisor = augmented[pivot][pivot];
    if (Math.abs(divisor) < 1e-12) return null;
    for (let column = pivot; column <= augmented.length; column += 1) augmented[pivot][column] /= divisor;
    for (let row = 0; row < augmented.length; row += 1) {
      if (row === pivot) continue;
      const factor = augmented[row][pivot];
      for (let column = pivot; column <= augmented.length; column += 1) augmented[row][column] -= factor * augmented[pivot][column];
    }
  }
  return augmented.map((row) => row[augmented.length]);
}

export function polynomialRegression(points: Array<{ x: number; y: number }>, degree: 2 | 3) {
  if (points.length < degree + 1) return null;
  const center = points.reduce((sum, point) => sum + point.x, 0) / points.length;
  const scale = Math.max(...points.map((point) => Math.abs(point.x - center)), Number.EPSILON);
  const normalized = points.map((point) => ({ x: (point.x - center) / scale, y: point.y }));
  const size = degree + 1;
  const matrix = Array.from({ length: size }, (_, row) => Array.from({ length: size }, (_, column) => normalized.reduce((sum, point) => sum + point.x ** (row + column), 0)));
  const vector = Array.from({ length: size }, (_, power) => normalized.reduce((sum, point) => sum + point.y * point.x ** power, 0));
  const normalizedCoefficients = solveLinearSystem(matrix, vector);
  if (!normalizedCoefficients) return null;
  const choose = (n: number, k: number) => {
    let result = 1;
    for (let index = 1; index <= k; index += 1) result = result * (n - index + 1) / index;
    return result;
  };
  const coefficients = Array(size).fill(0) as number[];
  normalizedCoefficients.forEach((coefficient, power) => {
    for (let expandedPower = 0; expandedPower <= power; expandedPower += 1) coefficients[expandedPower] += coefficient * choose(power, expandedPower) * (-center) ** (power - expandedPower) / scale ** power;
  });
  const predict = (x: number) => normalizedCoefficients.reduce((sum, coefficient, power) => sum + coefficient * ((x - center) / scale) ** power, 0);
  const meanY = points.reduce((sum, point) => sum + point.y, 0) / points.length;
  const total = points.reduce((sum, point) => sum + (point.y - meanY) ** 2, 0);
  const residual = points.reduce((sum, point) => sum + (point.y - predict(point.x)) ** 2, 0);
  return { coefficients, degree, center, scale, rSquared: total === 0 ? 1 : Math.max(0, 1 - residual / total), predict };
}

export function loessSmooth(points: Array<{ x: number; y: number }>, span = 0.65, sampleCount = 64) {
  if (points.length < 3) return [] as Array<{ x: number; y: number }>;
  const sorted = [...points].sort((left, right) => left.x - right.x);
  const minimum = sorted[0].x;
  const maximum = sorted[sorted.length - 1].x;
  const neighborhood = Math.max(3, Math.min(sorted.length, Math.ceil(sorted.length * Math.max(0.25, Math.min(1, span)))));
  const count = Math.max(16, sampleCount);
  return Array.from({ length: count }, (_, index) => {
    const x = minimum + (maximum - minimum) * index / Math.max(1, count - 1);
    const nearest = [...sorted].sort((left, right) => Math.abs(left.x - x) - Math.abs(right.x - x)).slice(0, neighborhood);
    const distance = Math.max(...nearest.map((point) => Math.abs(point.x - x)), Number.EPSILON);
    const weighted = nearest.map((point) => ({ ...point, weight: (1 - Math.min(1, Math.abs(point.x - x) / distance) ** 3) ** 3 }));
    const weightSum = weighted.reduce((sum, point) => sum + point.weight, 0) || 1;
    const meanX = weighted.reduce((sum, point) => sum + point.x * point.weight, 0) / weightSum;
    const meanY = weighted.reduce((sum, point) => sum + point.y * point.weight, 0) / weightSum;
    const denominator = weighted.reduce((sum, point) => sum + point.weight * (point.x - meanX) ** 2, 0);
    const slope = denominator > 1e-12 ? weighted.reduce((sum, point) => sum + point.weight * (point.x - meanX) * (point.y - meanY), 0) / denominator : 0;
    return { x, y: meanY + slope * (x - meanX) };
  });
}

export function linearConfidenceBand95(points: Array<{ x: number; y: number }>, xValues: number[]) {
  const fit = linearRegression(points);
  if (!fit || points.length < 3) return [] as Array<{ x: number; estimate: number; lower: number; upper: number }>;
  const meanX = points.reduce((sum, point) => sum + point.x, 0) / points.length;
  const sumSquaresX = points.reduce((sum, point) => sum + (point.x - meanX) ** 2, 0);
  if (sumSquaresX <= 0) return [];
  const residualSumSquares = points.reduce((sum, point) => sum + (point.y - (fit.intercept + fit.slope * point.x)) ** 2, 0);
  const residualStandardError = Math.sqrt(residualSumSquares / (points.length - 2));
  const critical = studentTCritical95(points.length - 2);
  return xValues.map((x) => {
    const estimate = fit.intercept + fit.slope * x;
    const margin = critical * residualStandardError * Math.sqrt(1 / points.length + (x - meanX) ** 2 / sumSquaresX);
    return { x, estimate, lower: estimate - margin, upper: estimate + margin };
  });
}

export function covarianceEllipsePoints(points: Array<{ x: number; y: number }>, probabilityRadius = Math.sqrt(5.991)) {
  if (points.length < 3) return [] as Array<{ x: number; y: number }>;
  const meanX = points.reduce((sum, point) => sum + point.x, 0) / points.length;
  const meanY = points.reduce((sum, point) => sum + point.y, 0) / points.length;
  const varianceX = points.reduce((sum, point) => sum + (point.x - meanX) ** 2, 0) / (points.length - 1);
  const varianceY = points.reduce((sum, point) => sum + (point.y - meanY) ** 2, 0) / (points.length - 1);
  const covariance = points.reduce((sum, point) => sum + (point.x - meanX) * (point.y - meanY), 0) / (points.length - 1);
  const trace = varianceX + varianceY;
  const difference = Math.sqrt(Math.max(0, (varianceX - varianceY) ** 2 + 4 * covariance ** 2));
  const firstEigenvalue = Math.max(0, (trace + difference) / 2);
  const secondEigenvalue = Math.max(0, (trace - difference) / 2);
  if (firstEigenvalue <= 1e-12 || secondEigenvalue <= 1e-12) return [];
  const angle = 0.5 * Math.atan2(2 * covariance, varianceX - varianceY);
  return Array.from({ length: 65 }, (_, index) => {
    const theta = index / 64 * Math.PI * 2;
    const major = probabilityRadius * Math.sqrt(firstEigenvalue) * Math.cos(theta);
    const minor = probabilityRadius * Math.sqrt(secondEigenvalue) * Math.sin(theta);
    return { x: meanX + major * Math.cos(angle) - minor * Math.sin(angle), y: meanY + major * Math.sin(angle) + minor * Math.cos(angle) };
  });
}

export function numericExtent(values: number[], includeZero = false): [number, number] {
  const finite = values.filter(Number.isFinite);
  if (finite.length === 0) return [0, 1];
  const minimum = Math.min(...finite);
  const maximum = Math.max(...finite);
  if (includeZero) {
    if (minimum >= 0) {
      if (maximum === 0) return [0, 1];
      return [0, maximum + maximum * 0.08];
    }
    if (maximum <= 0) {
      return [minimum - Math.abs(minimum) * 0.08, 0];
    }
  }
  if (minimum === maximum) {
    const padding = Math.abs(minimum || 1) * 0.12;
    return [minimum - padding, maximum + padding];
  }
  const padding = (maximum - minimum) * 0.08;
  return [minimum - padding, maximum + padding];
}

export function resolveAxisDomain(
  automatic: [number, number],
  minimum: number | null,
  maximum: number | null,
): [number, number] {
  if (minimum !== null && maximum !== null) return minimum < maximum ? [minimum, maximum] : automatic;
  const automaticSpan = Math.max(automatic[1] - automatic[0], Math.abs(automatic[0]) * 0.12, Math.abs(automatic[1]) * 0.12, 1);
  if (minimum !== null) return [minimum, Math.max(automatic[1], minimum + automaticSpan)];
  if (maximum !== null) return [Math.min(automatic[0], maximum - automaticSpan), maximum];
  return automatic;
}

export function axisLimitWarning(
  definition: PlotDefinition,
  dataset: ParsedDataset,
  mapping: Record<string, string>,
  settings: VisualizationSettings,
) {
  const activeAxes = activeNumericAxes(definition.id, settings);
  const numberAt = (row: DelimitedRow, role: string) => {
    const column = mapping[role];
    return column ? parseNumericValue(row[column]) : null;
  };
  const valuesAt = (role: string) => dataset.rows.flatMap((row) => {
    const value = numberAt(row, role);
    return value === null ? [] : [value];
  });
  let xValues: number[] = [];
  let yValues: number[] = [];
  if (["scatter", "correlation", "pca", "pcoa", "umap", "quadrant"].includes(definition.id)) {
    xValues = valuesAt("x");
    yValues = valuesAt("y");
    if (["scatter", "correlation"].includes(definition.id) && settings.swapAxes) [xValues, yValues] = [yValues, xValues];
    if (definition.id === "quadrant") {
      xValues.push(settings.xThreshold);
      yValues.push(settings.yThreshold);
    }
  } else if (definition.id === "line") {
    const ordered = valuesAt("x");
    const valueExtent = dataset.rows.flatMap((row) => {
      const value = numberAt(row, "value");
      if (value === null) return [];
      const error = settings.lineErrorType !== "none" ? Math.max(0, numberAt(row, "error") ?? 0) : 0;
      return [value - error, value + error];
    });
    [xValues, yValues] = settings.swapAxes ? [valueExtent, ordered] : [ordered, valueExtent];
  } else if (definition.id === "bar") {
    let valueExtent = dataset.rows.flatMap((row) => {
      const value = numberAt(row, "value");
      if (value === null) return [];
      const showsUncertainty = settings.barErrorType !== "none" && !["stacked", "percentage", "polar"].includes(settings.barVariant);
      const error = showsUncertainty ? Math.max(0, numberAt(row, "error") ?? 0) : 0;
      return [value - error, value + error];
    });
    if (["stacked", "percentage"].includes(settings.barVariant)) {
      if (settings.barVariant === "percentage") valueExtent = [0, 100];
      else {
        const categories = new Map<string, { positive: number; negative: number }>();
        dataset.rows.forEach((row) => {
          const category = row[mapping.category] ?? ""; const value = numberAt(row, "value") ?? 0;
          const totals = categories.get(category) ?? { positive: 0, negative: 0 };
          if (value >= 0) totals.positive += value; else totals.negative += value;
          categories.set(category, totals);
        });
        valueExtent = [...categories.values()].flatMap((totals) => [totals.negative, totals.positive]);
      }
    } else {
      if (settings.barVariant === "overlay") valueExtent.push(...valuesAt("secondary"));
      if (settings.barVariant === "bullet") valueExtent.push(...valuesAt("target"));
      if (settings.barVariant === "pyramid" && mapping.group) {
        const groups = [...new Set(dataset.rows.map((row) => row[mapping.group]).filter(Boolean))];
        valueExtent = dataset.rows.flatMap((row) => {
          const value = numberAt(row, "value"); if (value === null) return [];
          return [groups.indexOf(row[mapping.group]) < Math.ceil(groups.length / 2) ? -Math.abs(value) : Math.abs(value)];
        });
      }
    }
    if (settings.swapAxes || ["horizontal", "bullet", "pyramid"].includes(settings.barVariant)) xValues = valueExtent;
    else yValues = valueExtent;
  } else if (definition.id === "errorbar") {
    yValues = dataset.rows.flatMap((row) => {
      const value = numberAt(row, "value");
      if (value === null) return [];
      const error = Math.max(0, numberAt(row, "error") ?? 0);
      return [value - error, value + error];
    });
  } else if (["box", "violin", "beeswarm", "raincloud", "histogram", "density", "ridge"].includes(definition.id)) {
    const distributionValues = valuesAt("value");
    if (settings.distributionOrientation === "horizontal") xValues = distributionValues;
    else yValues = distributionValues;
    if (settings.showDensity && mapping.group) {
      const rawDomain = numericExtent(distributionValues);
      const rawSpan = Math.max(rawDomain[1] - rawDomain[0], 1e-9);
      const densityBoundaryDomain: [number, number] = [rawDomain[0] - rawSpan * 0.16, rawDomain[1] + rawSpan * 0.16];
      const densitySupport = distributionNumericLanes(dataset.rows, mapping.group, mapping.value, mapping.facet).flatMap((lane) => {
        const points = kernelDensityEstimate(lane.values, densityBoundaryDomain, settings.violinBandwidth).points;
        return points.length > 0 ? [points[0].position, points[points.length - 1].position] : [];
      });
      if (settings.distributionOrientation === "horizontal") xValues.push(...densitySupport);
      else yValues.push(...densitySupport);
    }
    if (settings.boxErrorType !== "none" && mapping.group) {
      for (const lane of distributionNumericLanes(dataset.rows, mapping.group, mapping.value, mapping.facet)) {
        if (lane.values.length < 2) continue;
        const summary = meanErrorStatistics(lane.values);
        const error = settings.boxErrorType === "sd" ? summary.sd : settings.boxErrorType === "sem" ? summary.sem : confidenceInterval95(lane.values).margin;
        if (settings.distributionOrientation === "horizontal") xValues.push(summary.mean - error, summary.mean + error);
        else yValues.push(summary.mean - error, summary.mean + error);
      }
    }
  } else if (definition.id === "ma") {
    xValues = valuesAt("mean").map((value) => Math.log10(Math.max(value, Number.MIN_VALUE)));
    yValues = [...valuesAt("effect"), -settings.foldChangeThreshold, settings.foldChangeThreshold];
  } else if (definition.id === "volcano") {
    xValues = [...valuesAt("effect"), -settings.foldChangeThreshold, settings.foldChangeThreshold];
    yValues = valuesAt("pValue").map((value) => -Math.log10(Math.max(value, Number.MIN_VALUE)));
    yValues.push(-Math.log10(settings.pValueThreshold));
  } else if (definition.id === "survival-forest") {
    xValues = [...valuesAt("lower"), ...valuesAt("upper"), ...valuesAt("estimate"), settings.forestReferenceValue];
  } else if (definition.id === "km") {
    xValues = valuesAt("time");
    yValues = [0, 1];
  } else if (definition.id === "roc") {
    xValues = [0, 1];
    yValues = [0, 1];
  } else if (["enrichment", "enrichment-bar"].includes(definition.id)) {
    xValues = dataset.rows.flatMap((row) => {
      const column = mapping.ratio;
      const value = column ? parseRatioValue(row[column]) : null;
      return value === null ? [] : [value];
    });
  } else {
    xValues = valuesAt("x").concat(valuesAt("rank"));
    yValues = valuesAt("y").concat(valuesAt("value"), valuesAt("score"));
  }
  const clippedX = activeAxes.includes("x") ? xValues.filter((value) => (settings.xMin !== null && value < settings.xMin) || (settings.xMax !== null && value > settings.xMax)).length : 0;
  const clippedY = activeAxes.includes("y") ? yValues.filter((value) => (settings.yMin !== null && value < settings.yMin) || (settings.yMax !== null && value > settings.yMax)).length : 0;
  if (clippedX + clippedY === 0) return null;
  return `Manual axis limits clip ${clippedX + clippedY} mapped value${clippedX + clippedY === 1 ? "" : "s"} (${clippedX} on X, ${clippedY} on Y).`;
}

export function scaleLinear(value: number, domain: [number, number], range: [number, number]) {
  const denominator = domain[1] - domain[0] || 1;
  return range[0] + ((value - domain[0]) / denominator) * (range[1] - range[0]);
}

export function formatTick(value: number) {
  const magnitude = Math.abs(value);
  if ((magnitude >= 10_000 || (magnitude > 0 && magnitude < 0.001))) return value.toExponential(1);
  if (magnitude >= 100) return value.toFixed(0);
  if (magnitude >= 10) return value.toFixed(1).replace(/\.0$/, "");
  return value.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
}

export function interpolateColor(start: string, end: string, fraction: number) {
  const clamp = Math.max(0, Math.min(1, fraction));
  const parse = (hex: string) => [1, 3, 5].map((offset) => Number.parseInt(hex.slice(offset, offset + 2), 16));
  const startRgb = parse(start);
  const endRgb = parse(end);
  return `#${startRgb.map((channel, index) => Math.round(channel + (endRgb[index] - channel) * clamp).toString(16).padStart(2, "0")).join("")}`;
}

export function divergingColor(low: string, middle: string, high: string, fraction: number) {
  return fraction <= 0.5
    ? interpolateColor(low, middle, fraction * 2)
    : interpolateColor(middle, high, (fraction - 0.5) * 2);
}
