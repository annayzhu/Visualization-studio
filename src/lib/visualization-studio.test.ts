import { describe, expect, it } from "vitest";
import {
  boxStatistics,
  confidenceInterval95,
  defaultVisualizationPaletteSeriesId,
  defaultVisualizationSettings,
  defaultVisualizationThemeId,
  deterministicBeeswarmLayout,
  deterministicBeeswarmOffsets,
  deterministicHistogram,
  distributionNumericLanes,
  figureFontPresets,
  getPlotDefinition,
  getPlotExamples,
  journalThemes,
  paletteSeries,
  kernelDensityEstimate,
  linearRegression,
  meanErrorStatistics,
  numericExtent,
  parseDelimitedData,
  parseRatioValue,
  resolveAxisDomain,
  studentTCritical95,
  plotDefinitions,
  plotGuidance,
  plotReferences,
  validatePlotDataset,
} from "./visualization-studio";

function relativeLuminance(hex: string) {
  const channels = [1, 3, 5].map((start) => Number.parseInt(hex.slice(start, start + 2), 16) / 255)
    .map((channel) => channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4);
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function rgbChroma(hex: string) {
  const channels = [1, 3, 5].map((start) => Number.parseInt(hex.slice(start, start + 2), 16) / 255);
  return Math.max(...channels) - Math.min(...channels);
}

describe("Visualization Studio data contracts", () => {
  it("uses a compact default canvas without reducing publication text sizes", () => {
    expect(defaultVisualizationSettings.width).toBe(340);
    expect(defaultVisualizationSettings.height).toBe(340);
    expect(defaultVisualizationSettings.titleSize).toBe(17);
    expect(defaultVisualizationSettings.axisLabelSize).toBe(14);
    expect(defaultVisualizationSettings.tickSize).toBe(11);
    expect(defaultVisualizationSettings.legendSize).toBe(11);
  });

  it("uses automatic domains by default and warns when manual limits clip mapped values", () => {
    expect(resolveAxisDomain([-2, 8], null, null)).toEqual([-2, 8]);
    expect(resolveAxisDomain([-2, 8], 0, 5)).toEqual([0, 5]);
    expect(resolveAxisDomain([-2, 8], 5, 0)).toEqual([-2, 8]);
    expect(resolveAxisDomain([-2, 8], 100, null)).toEqual([100, 110]);
    expect(resolveAxisDomain([-2, 8], null, -100)).toEqual([-110, -100]);

    const definition = getPlotDefinition("scatter");
    const dataset = parseDelimitedData("x\ty\n-2\t1\n4\t9");
    const settings = { ...defaultVisualizationSettings, xMin: 0, yMax: 5 };
    const validation = validatePlotDataset(definition, dataset, { x: "x", y: "y", group: "", label: "" }, settings);
    expect(validation.warnings).toContain("Manual axis limits clip 2 mapped values (1 on X, 1 on Y).");

    const bar = validatePlotDataset(
      getPlotDefinition("bar"),
      parseDelimitedData("category\tvalue\terror\nA\t5\t2"),
      { category: "category", value: "value", error: "error", group: "" },
      { ...defaultVisualizationSettings, barErrorType: "sd", yMax: 6 },
    );
    expect(bar.warnings).toContain("Manual axis limits clip 1 mapped value (0 on X, 1 on Y).");

    const invalid = validatePlotDataset(
      definition,
      dataset,
      { x: "x", y: "y", group: "", label: "" },
      { ...defaultVisualizationSettings, xMin: 5, xMax: 0 },
    );
    expect(invalid.errors).toContain("X-axis minimum must be smaller than the maximum.");

    const oneSided = validatePlotDataset(
      definition,
      dataset,
      { x: "x", y: "y", group: "", label: "" },
      { ...defaultVisualizationSettings, yMin: 100 },
    );
    expect(oneSided.errors).toEqual([]);
    expect(oneSided.warnings).toContain("Manual axis limits clip 2 mapped values (0 on X, 2 on Y).");

    const inactiveAxis = validatePlotDataset(
      getPlotDefinition("box"),
      parseDelimitedData("group\tvalue\nA\t1\nA\t2\nA\t3"),
      { group: "group", value: "value" },
      { ...defaultVisualizationSettings, xMin: 5, xMax: 0 },
    );
    expect(inactiveAxis.errors).toEqual([]);
  });

  it("ships every requested first-batch plot type with a sample data contract", () => {
    const requested = [
      "scatter", "correlation", "volcano", "ma", "quadrant", "bar", "errorbar", "line", "area", "lollipop",
      "box", "violin", "beeswarm", "raincloud", "histogram", "density", "ridge", "clustered-heatmap", "correlation-heatmap", "pca", "pcoa", "umap",
      "enrichment", "enrichment-bar", "gsea", "km", "survival-forest", "roc", "venn", "upset", "sankey", "chord", "circos",
      "pie", "donut", "rose", "waffle", "treemap", "sunburst", "radar", "polar-profile", "population-pyramid",
    ];
    expect(plotDefinitions).toHaveLength(43);
    expect(requested.every((id) => plotDefinitions.some((definition) => definition.id === id && definition.sampleData.length > 20))).toBe(true);
    plotDefinitions.forEach((definition) => {
      const examples = getPlotExamples(definition);
      expect(examples.length).toBeGreaterThan(0);
      expect(examples.every((example) => example.label.startsWith("Example ") && example.data.length > 20)).toBe(true);
    });
    expect(getPlotExamples(getPlotDefinition("bar"))).toHaveLength(3);
    expect(getPlotExamples(getPlotDefinition("line"))).toHaveLength(2);
    expect(getPlotExamples(getPlotDefinition("pca"))).toHaveLength(2);
  });

  it("uses representative demo sizes for dense scientific plots", () => {
    const umap = parseDelimitedData(getPlotDefinition("umap").sampleData);
    const gsea = parseDelimitedData(getPlotDefinition("gsea").sampleData);
    const survival = parseDelimitedData(getPlotDefinition("km").sampleData);
    const roc = parseDelimitedData(getPlotDefinition("roc").sampleData);
    const heatmap = parseDelimitedData(getPlotDefinition("heatmap").sampleData);
    expect(umap.rows.length).toBeGreaterThanOrEqual(60);
    expect(new Set(umap.rows.map((row) => row.group)).size).toBe(3);
    expect(gsea.rows).toHaveLength(100);
    expect(Number(gsea.rows[0].runningES)).toBeCloseTo(0, 1);
    expect(Number(gsea.rows.at(-1)?.runningES)).toBe(0);
    expect(Math.max(...gsea.rows.map((row) => Number(row.runningES)))).toBeGreaterThan(0.5);
    expect(survival.rows.length).toBeGreaterThanOrEqual(40);
    expect(new Set(survival.rows.map((row) => row.group))).toEqual(new Set(["High risk", "Low risk"]));
    expect(survival.rows.some((row) => row.event === "0")).toBe(true);
    expect(survival.rows.some((row) => row.event === "1")).toBe(true);
    expect(roc.rows).toHaveLength(120);
    expect(new Set(roc.rows.map((row) => row.model))).toEqual(new Set(["Model A", "Model B"]));
    expect(heatmap.rows).toHaveLength(24);
    expect(heatmap.headers).toHaveLength(13);
  });

  it("shows all four Chai-dyed Brown categorical colors in the default bar demo", () => {
    const barDataset = parseDelimitedData(getPlotDefinition("bar").sampleData);
    expect(new Set(barDataset.rows.map((row) => row.group))).toEqual(new Set(["Control", "Treatment A", "Treatment B", "Treatment C"]));
    expect(defaultVisualizationSettings.categoricalColors).toHaveLength(4);
  });

  it("keeps plot families method-level and provides guidance for every module", () => {
    expect(getPlotDefinition("pca").family).toBe("Dimension reduction");
    expect(getPlotDefinition("pca").summary).not.toMatch(/RNA-seq|gene-expression/i);
    expect(plotGuidance.pca.suitableData).toMatch(/组学、影像特征、形态学、光谱/);
    expect(Object.keys(plotGuidance)).toHaveLength(plotDefinitions.length);
    plotDefinitions.forEach((definition) => {
      expect(plotGuidance[definition.id].definition.length).toBeGreaterThan(15);
      expect(plotGuidance[definition.id].suitableData.length).toBeGreaterThan(10);
      expect(plotGuidance[definition.id].answers.length).toBeGreaterThan(15);
      if (plotGuidance[definition.id].origin) expect(plotGuidance[definition.id].origin?.length).toBeGreaterThan(20);
      expect(plotGuidance[definition.id].references.length).toBeGreaterThan(0);
      plotGuidance[definition.id].references.forEach((reference) => {
        expect(reference.citation).toMatch(/\d{4}/);
        expect(reference.href).toMatch(/^https:\/\/doi\.org\/10\./);
      });
    });
    expect(Object.keys(plotReferences).length).toBeGreaterThanOrEqual(25);
    expect(plotGuidance.pca.references).toContain(plotReferences.pca);
  });

  it("distinguishes circular category relationships from coordinate-based genome tracks", () => {
    expect(plotGuidance.chord.definition).toMatch(/类别.*关系/);
    expect(plotGuidance.chord.definition).toMatch(/不包含.*基因组坐标/);
    expect(plotGuidance.circos.definition).toMatch(/真实坐标/);
    expect(plotGuidance.circos.definition).toMatch(/同心数据轨道/);
    expect(plotGuidance.chord.suitableData).not.toMatch(/染色体|基因组区段/);
    expect(plotGuidance.circos.suitableData).toMatch(/染色体.*起止坐标/);
  });

  it("parses tab-delimited data and reports blank cells", () => {
    const dataset = parseDelimitedData("sample\tvalue\nS1\t1.4\nS2\t\n");
    expect(dataset.delimiter).toBe("tab");
    expect(dataset.headers).toEqual(["sample", "value"]);
    expect(dataset.rows).toHaveLength(2);
    expect(dataset.warnings).toContain("1 blank cell detected.");
  });

  it("parses quoted comma-delimited labels", () => {
    const dataset = parseDelimitedData('term,value\n"DNA repair, homologous",0.32\n');
    expect(dataset.delimiter).toBe("comma");
    expect(dataset.rows[0]).toEqual({ term: "DNA repair, homologous", value: "0.32" });
  });

  it("rejects malformed row widths without silently shifting values", () => {
    const dataset = parseDelimitedData("sample,value\nS1,1,unexpected\n");
    expect(dataset.errors.join(" ")).toMatch(/Row 2 has 3 values; expected 2/);
    expect(dataset.rows).toHaveLength(0);
  });

  it("supports enrichment ratios encoded as fractions", () => {
    expect(parseRatioValue("8/40")).toBeCloseTo(0.2);
    expect(parseRatioValue("0.35")).toBeCloseTo(0.35);
    expect(parseRatioValue("2/0")).toBeNull();
  });

  it("validates required numeric mappings", () => {
    const definition = getPlotDefinition("scatter");
    const dataset = parseDelimitedData("x\ty\tgroup\n1\t2\tA\n2\tbad\tB\n");
    const validation = validatePlotDataset(definition, dataset, { x: "x", y: "y", group: "group", label: "" });
    expect(validation.errors).toContain("Y contains 1 non-numeric or blank value.");
  });

  it("validates volcano probability bounds", () => {
    const definition = getPlotDefinition("volcano");
    const dataset = parseDelimitedData("gene\tlog2FC\tpadj\nTP53\t2.1\t0\nEGFR\t1.3\t1.2\n");
    const validation = validatePlotDataset(definition, dataset, { label: "gene", effect: "log2FC", pValue: "padj" });
    expect(validation.errors.join(" ")).toMatch(/outside \(0, 1\]/);
  });

  it("rejects one-class ROC data and oversized heatmaps", () => {
    const roc = validatePlotDataset(
      getPlotDefinition("roc"),
      parseDelimitedData("truth\tscore\n1\t0.9\n1\t0.7\n"),
      { truth: "truth", score: "score", group: "" },
    );
    expect(roc.errors).toContain("ROC calculation requires both outcome classes (0 and 1).");

    const rows = Array.from({ length: 251 }, (_, index) => `G${index}\t${index}\t${index + 1}`).join("\n");
    const heatmap = validatePlotDataset(getPlotDefinition("clustered-heatmap"), parseDelimitedData(`gene\tS1\tS2\n${rows}`), {});
    expect(heatmap.errors.join(" ")).toMatch(/limited to 250 rows/);
  });

  it("requires a mapped non-negative error column when bar SD or SEM is enabled", () => {
    const definition = getPlotDefinition("bar");
    const dataset = parseDelimitedData("category\tvalue\terror\nControl\t4.2\t-0.4\n");
    const missing = validatePlotDataset(definition, dataset, { category: "category", value: "value", error: "" }, { ...defaultVisualizationSettings, barErrorType: "sd" });
    expect(missing.errors).toContain("Map an error column before displaying SD error bars.");

    const negative = validatePlotDataset(definition, dataset, { category: "category", value: "value", error: "error" }, { ...defaultVisualizationSettings, barErrorType: "sem" });
    expect(negative.errors.join(" ")).toMatch(/SD and SEM must be non-negative/);
  });

  it("rejects misleading percentage and axis-break inputs while ignoring hidden uncertainty", () => {
    const definition = getPlotDefinition("bar");
    const signed = parseDelimitedData("category\tvalue\tgroup\nA\t-2\tG1\nA\t5\tG2");
    const mapping = { category: "category", value: "value", group: "group", error: "", secondary: "", target: "", pValue: "", facet: "" };
    const percentage = validatePlotDataset(definition, signed, mapping, { ...defaultVisualizationSettings, barVariant: "percentage", barErrorType: "sd" });
    expect(percentage.errors).toContain("100% stacked bars require non-negative parts; use Bidirectional for signed values.");
    expect(percentage.errors.join(" ")).not.toMatch(/Map an error column/);

    const inactive = parseDelimitedData("category\tvalue\tbad\nA\t2\tnot-a-number");
    const inactiveMapping = { ...mapping, group: "", secondary: "bad", target: "bad", pValue: "bad", error: "bad" };
    expect(validatePlotDataset(definition, inactive, inactiveMapping, { ...defaultVisualizationSettings, barVariant: "grouped" }).errors).toEqual([]);

    const broken = parseDelimitedData("category\tvalue\tgroup\nA\t4\tG1\nB\t6\tG1\nC\t8\tG1");
    const axisBreak = validatePlotDataset(definition, broken, mapping, { ...defaultVisualizationSettings, barVariant: "axis-break", axisBreakStart: 5, axisBreakEnd: 7 });
    expect(axisBreak.errors.join(" ")).toMatch(/Axis break contains 1 displayed value/);

    const long = parseDelimitedData("category\tvalue\tgroup\nA\t3\tG1\nA\t4\tG1\nA\t5\tG1\nB\t8\tG1\nB\t9\tG1\nB\t10\tG1");
    const longBreak = validatePlotDataset(definition, long, mapping, { ...defaultVisualizationSettings, barVariant: "axis-break", barInputMode: "long", barErrorType: "sd", axisBreakStart: 4.8, axisBreakEnd: 5.2 });
    expect(longBreak.errors.join(" ")).toMatch(/uncertainty bound/);
  });

  it("requires a mapped non-negative error column when line SD or SEM is enabled", () => {
    const definition = getPlotDefinition("line");
    const dataset = parseDelimitedData("time\tvalue\terror\tseries\n0\t1.0\t-0.1\tControl\n");
    const missing = validatePlotDataset(definition, dataset, { x: "time", value: "value", error: "", series: "series" }, { ...defaultVisualizationSettings, lineErrorType: "sd" });
    expect(missing.errors).toContain("Map an error column before displaying SD error bars.");

    const negative = validatePlotDataset(definition, dataset, { x: "time", value: "value", error: "error", series: "series" }, { ...defaultVisualizationSettings, lineErrorType: "sem" });
    expect(negative.errors.join(" ")).toMatch(/SD and SEM must be non-negative/);
  });

  it("computes Tukey box statistics and outliers reproducibly", () => {
    expect(boxStatistics([1, 2, 3, 4, 100])).toEqual({
      q1: 2,
      median: 3,
      q3: 4,
      low: 1,
      high: 4,
      outliers: [100],
    });
  });

  it("computes sample SD and SEM for point-summary error bars", () => {
    const summary = meanErrorStatistics([1, 2, 3]);
    expect(summary).toEqual({ mean: 2, sd: 1, sem: 1 / Math.sqrt(3), n: 3 });
    expect(meanErrorStatistics([4])).toEqual({ mean: 4, sd: 0, sem: 0, n: 1 });
  });

  it("computes deterministic bins and Student t 95% confidence intervals", () => {
    expect(deterministicHistogram([0, 1, 2, 3, 4], 4, [0, 4]).map((bin) => bin.count)).toEqual([1, 1, 1, 2]);
    expect(deterministicHistogram([0, 1, 2, 3, 4], 4, [0, 4])).toEqual(deterministicHistogram([0, 1, 2, 3, 4], 4, [0, 4]));
    const interval = confidenceInterval95([1, 2, 3]);
    expect(interval.mean).toBe(2);
    expect(interval.margin).toBeCloseTo(4.303 / Math.sqrt(3), 6);
    expect(interval.lower).toBeCloseTo(2 - 4.303 / Math.sqrt(3), 6);
    expect(interval.upper).toBeCloseTo(2 + 4.303 / Math.sqrt(3), 6);
    expect(studentTCritical95(31)).toBeCloseTo(2.03951, 4);
    const largerValues = Array.from({ length: 32 }, (_, index) => index + 1);
    const largerSample = confidenceInterval95(largerValues);
    const largerSummary = meanErrorStatistics(largerValues);
    expect(largerSample.margin).toBeCloseTo(studentTCritical95(31) * largerSummary.sem, 8);
    expect(largerSample.margin / largerSummary.sem).toBeGreaterThan(1.96);
  });

  it("packs duplicate and nearby beeswarm points deterministically without collisions", () => {
    const valuePositions = [100, 100, 100, 100, 100, 101, 101.5, 102, 102];
    const radius = 3;
    const offsets = deterministicBeeswarmOffsets(valuePositions, radius, 42);
    expect(offsets).toEqual(deterministicBeeswarmOffsets(valuePositions, radius, 42));
    expect(offsets.every((offset) => Math.abs(offset) <= 42)).toBe(true);
    for (let left = 0; left < offsets.length; left += 1) {
      for (let right = left + 1; right < offsets.length; right += 1) {
        expect(Math.hypot(valuePositions[left] - valuePositions[right], offsets[left] - offsets[right])).toBeGreaterThanOrEqual(radius * 2 + 0.8 - 1e-7);
      }
    }
    const denseLayout = deterministicBeeswarmLayout(Array(64).fill(100), 3, 8);
    expect(denseLayout.scaled).toBe(true);
    expect(denseLayout.pointRadius).toBeGreaterThan(0);
    expect(denseLayout.offsets.every((offset) => Math.abs(offset) <= 8 + 1e-7)).toBe(true);
    for (let left = 0; left < denseLayout.offsets.length; left += 1) {
      for (let right = left + 1; right < denseLayout.offsets.length; right += 1) {
        expect(Math.abs(denseLayout.offsets[left] - denseLayout.offsets[right])).toBeGreaterThanOrEqual(denseLayout.minimumDistance - 1e-7);
      }
    }
  });

  it("validates layered, paired, and significance distribution contracts", () => {
    const definition = getPlotDefinition("density");
    const independent = parseDelimitedData("group\tvalue\nA\t1\nA\t2\nA\t3");
    const empty = validatePlotDataset(definition, independent, { group: "group", value: "value", subject: "", facet: "", pValue: "" }, { ...defaultVisualizationSettings, showDensity: false, showHistogram: false, showBox: false, showPoints: false, distributionSummary: "none", boxErrorType: "none" });
    expect(empty.errors).toContain("Enable at least one distribution layer before exporting.");
    const missingPair = validatePlotDataset(definition, independent, { group: "group", value: "value", subject: "", facet: "", pValue: "" }, { ...defaultVisualizationSettings, showDensity: true, distributionShowPairedLines: true });
    expect(missingPair.errors).toContain("Map a Subject / pair ID column before displaying paired lines.");
    const invalidP = validatePlotDataset(definition, parseDelimitedData("group\tvalue\tp\nA\t1\t0\nA\t2\t1.2\nA\t3\t0.2"), { group: "group", value: "value", subject: "", facet: "", pValue: "p" }, { ...defaultVisualizationSettings, showDensity: true, distributionShowSignificance: true });
    expect(invalidP.errors.some((error) => error.includes("outside (0, 1]"))).toBe(true);

    const incompletePairs = validatePlotDataset(
      definition,
      parseDelimitedData("subject\tgroup\tvalue\nS1\tA\t1\nS1\tB\t2\nS2\tA\t3\n\tB\t4"),
      { group: "group", value: "value", subject: "subject", facet: "", pValue: "" },
      { ...defaultVisualizationSettings, showDensity: true, distributionShowPairedLines: true },
    );
    expect(incompletePairs.errors.some((error) => error.includes("blank value"))).toBe(true);
    expect(incompletePairs.errors.some((error) => error.includes("missing one or more paired groups"))).toBe(true);

    const faceted = parseDelimitedData("facet\tgroup\tvalue\nF1\tA\t1\nF1\tB\t2\nF1\tB\t3\nF2\tA\t10\nF2\tA\t12\nF2\tB\t8\nF2\tB\t9");
    expect(distributionNumericLanes(faceted.rows, "group", "value", "facet").map((lane) => [lane.facet, lane.group, lane.values.length])).toEqual([
      ["F1", "A", 1], ["F1", "B", 2], ["F2", "A", 2], ["F2", "B", 2],
    ]);
    const lowN = validatePlotDataset(
      definition,
      faceted,
      { group: "group", value: "value", subject: "", facet: "facet", pValue: "" },
      { ...defaultVisualizationSettings, showDensity: true, boxErrorType: "ci95" },
    );
    expect(lowN.errors).toContain("Uncertainty requires at least two observations in every facet × group lane; insufficient: F1 / A.");

    const facetClip = validatePlotDataset(
      definition,
      parseDelimitedData("facet\tgroup\tvalue\nF1\tA\t0\nF1\tA\t2\nF2\tA\t10\nF2\tA\t12"),
      { group: "group", value: "value", subject: "", facet: "facet", pValue: "" },
      { ...defaultVisualizationSettings, showDensity: false, showPoints: true, boxErrorType: "sem", yMax: 11.5 },
    );
    expect(facetClip.errors).toEqual([]);
    expect(facetClip.warnings).toContain("Manual axis limits clip 2 mapped values (0 on X, 2 on Y).");

    for (const orientation of ["vertical", "horizontal"] as const) {
      const densitySupportClip = validatePlotDataset(
        definition,
        parseDelimitedData("group\tvalue\nA\t0\nA\t1\nA\t2\nB\t3\nB\t4\nB\t5"),
        { group: "group", value: "value", subject: "", facet: "", pValue: "" },
        {
          ...defaultVisualizationSettings,
          showDensity: true,
          distributionOrientation: orientation,
          ...(orientation === "horizontal" ? { xMin: 0, xMax: 5 } : { yMin: 0, yMax: 5 }),
        },
      );
      const warning = densitySupportClip.warnings.find((entry) => entry.startsWith("Manual axis limits clip"));
      expect(warning).toBeTruthy();
      expect(warning).toContain(orientation === "horizontal" ? "on X" : "on Y");
    }
  });

  it("provides complete publication palettes for categorical and continuous plots", () => {
    expect(Object.keys(journalThemes)).toHaveLength(18);
    expect(paletteSeries.journal.themeIds).toHaveLength(6);
    expect(paletteSeries.curated.themeIds).toHaveLength(3);
    expect(paletteSeries["chinese-traditional"].themeIds).toHaveLength(9);
    expect(paletteSeries.custom.themeIds).toHaveLength(0);
    expect(defaultVisualizationPaletteSeriesId).toBe("chinese-traditional");
    expect(defaultVisualizationThemeId).toBe("cn-beihai");
    expect(journalThemes[defaultVisualizationThemeId].name).toBe("柴染棕");
    expect(defaultVisualizationSettings.categoricalColors).toEqual(journalThemes[defaultVisualizationThemeId].categorical);
    expect(defaultVisualizationSettings.continuousLow).toBe(journalThemes[defaultVisualizationThemeId].sequential[0]);
    expect(defaultVisualizationSettings.continuousHigh).toBe(journalThemes[defaultVisualizationThemeId].sequential[1]);
    expect(defaultVisualizationSettings.divergingLow).toBe(journalThemes[defaultVisualizationThemeId].diverging[0]);
    expect(defaultVisualizationSettings.divergingMid).toBe(journalThemes[defaultVisualizationThemeId].diverging[1]);
    expect(defaultVisualizationSettings.divergingHigh).toBe(journalThemes[defaultVisualizationThemeId].diverging[2]);
    Object.values(journalThemes).forEach((theme) => {
      expect(theme.categorical.length).toBeGreaterThanOrEqual(theme.series === "chinese-traditional" ? 4 : 8);
      expect(new Set(theme.categorical).size).toBe(theme.categorical.length);
      const colors = [...theme.categorical, ...theme.sequential, ...theme.diverging, theme.ink, theme.muted, theme.grid];
      expect(colors.every((color) => /^#[0-9A-F]{6}$/i.test(color))).toBe(true);
      expect(Math.abs(relativeLuminance(theme.sequential[0]) - relativeLuminance(theme.sequential[1]))).toBeGreaterThan(theme.series === "chinese-traditional" ? 0.25 : 0.35);
      expect(relativeLuminance(theme.diverging[1])).toBeGreaterThan(Math.max(relativeLuminance(theme.diverging[0]), relativeLuminance(theme.diverging[2])));
    });
    Object.values(journalThemes).filter((theme) => theme.series === "chinese-traditional").forEach((theme) => {
      expect(relativeLuminance(theme.diverging[1])).toBeGreaterThan(0.85);
      expect(relativeLuminance(theme.diverging[0])).toBeGreaterThan(0.3);
      expect(relativeLuminance(theme.diverging[2])).toBeGreaterThan(0.3);
      expect(rgbChroma(theme.diverging[0])).toBeLessThan(0.3);
      expect(rgbChroma(theme.diverging[2])).toBeLessThan(0.3);
    });
  });

  it("keeps the nine Pixso Chinese-traditional source palettes exact", () => {
    const sourcePalettes = {
      "cn-beihai": ["#957454", "#1D4C50", "#D4A278", "#3F605B"],
      "cn-imperial-orange": ["#DB5E40", "#2E2F25", "#E68959", "#866040"],
      "cn-wisteria": ["#F1E7E5", "#1D4C50", "#D3A488", "#BDAEAD"],
      "cn-sunset": ["#F7CD9B", "#313534", "#F0A72E", "#AE7F77"],
      "cn-hutong": ["#3E443C", "#D3A488", "#8B6B5B", "#24271E"],
      "cn-dragon": ["#B5A59B", "#655045", "#AF5F54", "#3B4E3D"],
      "cn-coral": ["#DB785C", "#283F3E", "#E9A182", "#824E40"],
      "cn-autumn": ["#E5B552", "#24271E", "#CCD8D0", "#DFBE96"],
      "cn-vermilion": ["#BF1103", "#580F05", "#970804", "#DFBE96"],
    } as const;
    Object.entries(sourcePalettes).forEach(([id, colors]) => {
      expect(journalThemes[id as keyof typeof journalThemes].categorical).toEqual(colors);
    });
  });

  it("provides portable sans-serif and serif figure-font presets", () => {
    expect(defaultVisualizationSettings.fontFamily).toBe("arial");
    expect(Object.keys(figureFontPresets)).toHaveLength(6);
    expect(Object.values(figureFontPresets).some((font) => font.style === "sans")).toBe(true);
    expect(Object.values(figureFontPresets).some((font) => font.style === "serif")).toBe(true);
    Object.values(figureFontPresets).forEach((font) => expect(font.family).toMatch(/sans-serif|serif/));
  });

  it("returns a fitted line and R-squared for numeric pairs", () => {
    const fit = linearRegression([{ x: 1, y: 2 }, { x: 2, y: 4 }, { x: 3, y: 6 }]);
    expect(fit).not.toBeNull();
    expect(fit?.slope).toBeCloseTo(2);
    expect(fit?.intercept).toBeCloseTo(0);
    expect(fit?.rSquared).toBeCloseTo(1);
  });

  it("limits violin density to group support and closes both tails at zero", () => {
    const estimate = kernelDensityEstimate([4.1, 4.6, 4.8, 5.0, 5.4], [3, 9], 1);
    expect(estimate.bandwidth).toBeGreaterThan(0);
    expect(estimate.points[0].position).toBeGreaterThan(3);
    expect(estimate.points.at(-1)?.position).toBeLessThan(9);
    expect(estimate.points[0].density).toBe(0);
    expect(estimate.points.at(-1)?.density).toBe(0);
    expect(Math.max(...estimate.points.map((point) => point.density))).toBeGreaterThan(0);
  });

  it("keeps zero-baseline domains scientifically interpretable", () => {
    expect(numericExtent([4, 8, 10], true)).toEqual([0, 10.8]);
    expect(numericExtent([-10, -4], true)).toEqual([-10.8, 0]);
    expect(numericExtent([-2, 3], true)).toEqual([-2.4, 3.4]);
  });

  it("rejects invalid composition totals and negative radial values", () => {
    const pie = validatePlotDataset(
      getPlotDefinition("pie"),
      parseDelimitedData("category\tvalue\nA\t0\nB\t0"),
      { category: "category", value: "value" },
      defaultVisualizationSettings,
    );
    expect(pie.errors).toContain("Pie requires a positive displayed total.");

    const rose = validatePlotDataset(
      getPlotDefinition("rose"),
      parseDelimitedData("category\tvalue\tgroup\nA\t2\tG\nB\t-1\tG\nC\t3\tG"),
      { category: "category", value: "value", group: "group" },
      defaultVisualizationSettings,
    );
    expect(rose.errors.some((error) => error.includes("requires non-negative values"))).toBe(true);

    const densePie = validatePlotDataset(
      getPlotDefinition("pie"),
      parseDelimitedData(`category\tvalue\n${Array.from({ length: 13 }, (_, index) => `Part ${index + 1}\t${index + 1}`).join("\n")}`),
      { category: "category", value: "value" },
      defaultVisualizationSettings,
    );
    expect(densePie.errors.some((error) => error.includes("limited to 12 categories"))).toBe(true);
  });

  it("validates hierarchy, radial-profile, and population-pyramid contracts", () => {
    const hierarchy = validatePlotDataset(
      getPlotDefinition("treemap"),
      parseDelimitedData("node\tparent\tvalue\nRoot\t\t0\nA\tMissing\t4"),
      { node: "node", parent: "parent", value: "value" },
      defaultVisualizationSettings,
    );
    expect(hierarchy.errors.some((error) => error.includes("missing parent"))).toBe(true);

    const cyclicHierarchy = validatePlotDataset(
      getPlotDefinition("sunburst"),
      parseDelimitedData("node\tparent\tvalue\nRoot\t\t0\nLeaf\tRoot\t4\nA\tB\t0\nB\tA\t0"),
      { node: "node", parent: "parent", value: "value" },
      defaultVisualizationSettings,
    );
    expect(cyclicHierarchy.errors).toContain("Hierarchy parent relationships contain a cycle.");

    const blankHierarchyNode = validatePlotDataset(
      getPlotDefinition("treemap"),
      parseDelimitedData("node\tparent\tvalue\nRoot\t\t0\n\tRoot\t4"),
      { node: "node", parent: "parent", value: "value" },
      defaultVisualizationSettings,
    );
    expect(blankHierarchyNode.errors).toContain("Node contains 1 blank value.");

    const denseSunburst = validatePlotDataset(
      getPlotDefinition("sunburst"),
      parseDelimitedData(`node\tparent\tvalue\nRoot\t\t0\n${Array.from({ length: 13 }, (_, index) => `Branch ${index + 1}\tRoot\t1`).join("\n")}`),
      { node: "node", parent: "parent", value: "value" },
      defaultVisualizationSettings,
    );
    expect(denseSunburst.errors.some((error) => error.includes("limited to 12 top-level branches"))).toBe(true);

    const radar = validatePlotDataset(
      getPlotDefinition("radar"),
      parseDelimitedData("feature\tvalue\tseries\nA\t1\tOne\nB\t2\tOne\nC\t3\tOne\nA\t1\tTwo\nB\t2\tTwo"),
      { feature: "feature", value: "value", series: "series" },
      defaultVisualizationSettings,
    );
    expect(radar.errors).toContain("Every Radar series must contain the same category set.");

    const reorderedPolar = validatePlotDataset(
      getPlotDefinition("polar-profile"),
      parseDelimitedData("angle\tvalue\tseries\nA\t1\tOne\nB\t2\tOne\nC\t3\tOne\nA\t1\tTwo\nC\t3\tTwo\nB\t2\tTwo"),
      { angle: "angle", value: "value", series: "series" },
      defaultVisualizationSettings,
    );
    expect(reorderedPolar.errors).toContain("Every Polar profile series must use the same category order.");

    const pyramid = validatePlotDataset(
      getPlotDefinition("population-pyramid"),
      parseDelimitedData("category\tvalue\tgroup\nYoung\t10\tA\nYoung\t9\tB\nYoung\t8\tC"),
      { category: "category", value: "value", group: "group" },
      defaultVisualizationSettings,
    );
    expect(pyramid.errors).toContain("Population pyramids require exactly two groups; detected 3.");

    const zeroGroupPyramid = validatePlotDataset(
      getPlotDefinition("population-pyramid"),
      parseDelimitedData("category\tvalue\tgroup\nYoung\t0\tA\nYoung\t9\tB\nOld\t0\tA\nOld\t3\tB"),
      { category: "category", value: "value", group: "group" },
      defaultVisualizationSettings,
    );
    expect(zeroGroupPyramid.errors).toContain("Each population-pyramid group requires a positive displayed total.");
  });
});
