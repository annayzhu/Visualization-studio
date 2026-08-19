import { createRef } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ScientificChartPreview } from "@/components/ScientificChartPreview";
import { analyzeExpressionMatrix } from "./visualization-pca";
import {
  defaultVisualizationSettings,
  defaultVisualizationThemeId,
  inferPlotMapping,
  parseDelimitedData,
  plotModuleRegistry,
  validatePlotDataset,
} from "./visualization-studio";

const expectedAdvancedRenderers = new Set([
  "correlation", "pcoa", "umap", "beeswarm", "raincloud", "ma", "quadrant", "errorbar", "area", "lollipop",
  "clustered-heatmap", "correlation-heatmap", "enrichment-bar", "gsea", "km", "survival-forest", "roc", "venn",
  "upset", "sankey", "chord", "circos",
]);

describe("registered plot-module examples", () => {
  it("parses, maps, validates, and renders every bundled example with finite SVG geometry", () => {
    for (const plotModule of plotModuleRegistry.list()) {
      for (const example of plotModule.examples) {
        const analysis = plotModule.definition.id === "pca" ? analyzeExpressionMatrix(example.data) : null;
        const dataset = analysis?.dataset ?? parseDelimitedData(example.data);
        const inferredMapping = analysis ? plotModule.definition.defaultMapping : inferPlotMapping(plotModule.definition, dataset.headers);
        const selectedMapping = example.mapping ?? inferredMapping;
        const mappings = analysis || example.mapping === undefined ? [selectedMapping] : [selectedMapping, inferredMapping];

        for (const mapping of mappings) {
          const validation = validatePlotDataset(plotModule.definition, dataset, mapping, defaultVisualizationSettings);
          expect(validation.errors, `${plotModule.definition.id} / ${example.label}`).toEqual([]);

          const markup = renderToStaticMarkup(
            <ScientificChartPreview
              svgRef={createRef<SVGSVGElement>()}
              type={plotModule.definition.id}
              dataset={dataset}
              mapping={mapping}
              settings={defaultVisualizationSettings}
              themeId={defaultVisualizationThemeId}
            />,
          );

          const expectedRenderer = expectedAdvancedRenderers.has(plotModule.definition.id) ? "advanced" : "standard";
          expect(plotModule.renderer, plotModule.definition.id).toBe(expectedRenderer);
        expect(markup, `${plotModule.definition.id} / ${example.label}`).toContain("<svg");
        expect(markup, `${plotModule.definition.id} / ${example.label}`).toContain("<clipPath");
          expect(markup, `${plotModule.definition.id} / ${example.label}`).toContain(`data-plot-renderer="${expectedRenderer}"`);
          expect(markup, `${plotModule.definition.id} / ${example.label}`).not.toMatch(/(?:NaN|Infinity|-Infinity|undefined)/);
        }
      }
    }
  });

  it("renders every categorical bar variant with finite marks", () => {
    const plotModule = plotModuleRegistry.get("bar");
    const example = plotModule.examples[0];
    const dataset = parseDelimitedData(example.data);
    const variants = ["grouped", "stacked", "percentage", "horizontal", "bidirectional", "faceted", "polar", "bullet", "pyramid", "axis-break", "dual-axis", "overlay"] as const;
    for (const barVariant of variants) {
      const settings = { ...defaultVisualizationSettings, barVariant, showSignificance: true };
      const validation = validatePlotDataset(plotModule.definition, dataset, example.mapping ?? plotModule.definition.defaultMapping, settings);
      expect(validation.errors, barVariant).toEqual([]);
      const markup = renderToStaticMarkup(<ScientificChartPreview svgRef={createRef<SVGSVGElement>()} type="bar" dataset={dataset} mapping={example.mapping ?? plotModule.definition.defaultMapping} settings={settings} themeId={defaultVisualizationThemeId} />);
      expect(markup, barVariant).toContain("data-plot-element=\"bar\"");
      expect(markup, barVariant).not.toMatch(/(?:NaN|Infinity|-Infinity|undefined)/);
    }
  });

  it("calculates long-form bar summaries without requiring a precomputed error column", () => {
    const plotModule = plotModuleRegistry.get("bar");
    const example = plotModule.examples[1];
    const dataset = parseDelimitedData(example.data);
    const settings = { ...defaultVisualizationSettings, barInputMode: "long" as const, barErrorType: "sem" as const };
    const validation = validatePlotDataset(plotModule.definition, dataset, example.mapping ?? plotModule.definition.defaultMapping, settings);
    expect(validation.errors).toEqual([]);
    const markup = renderToStaticMarkup(<ScientificChartPreview svgRef={createRef<SVGSVGElement>()} type="bar" dataset={dataset} mapping={example.mapping ?? plotModule.definition.defaultMapping} settings={settings} themeId={defaultVisualizationThemeId} />);
    expect(markup).toContain("data-plot-element=\"error-bar\"");
  });

  it("keeps categorical domains finite for positive, negative, and mixed values", () => {
    const plotModule = plotModuleRegistry.get("bar");
    for (const values of [[2, 5, 8], [-2, -5, -8], [-4, 1, 7]]) {
      const dataset = parseDelimitedData(`category\tvalue\tgroup\nA\t${values[0]}\tG1\nB\t${values[1]}\tG2\nC\t${values[2]}\tG3`);
      const mapping = { category: "category", value: "value", group: "group", error: "", secondary: "", target: "", pValue: "", facet: "" };
      const settings = { ...defaultVisualizationSettings, barVariant: "bidirectional" as const };
      expect(validatePlotDataset(plotModule.definition, dataset, mapping, settings).errors).toEqual([]);
      const markup = renderToStaticMarkup(<ScientificChartPreview svgRef={createRef<SVGSVGElement>()} type="bar" dataset={dataset} mapping={mapping} settings={settings} themeId={defaultVisualizationThemeId} />);
      expect(markup.match(/data-plot-element="bar"/g)).toHaveLength(3);
      if (values.some((value) => value < 0)) expect(markup).toMatch(/data-value="-/);
      expect(markup).not.toMatch(/(?:NaN|Infinity|-Infinity|undefined)/);
    }
  });

  it("keeps threshold annotations inside automatic volcano domains", () => {
    const plotModule = plotModuleRegistry.get("volcano");
    const dataset = parseDelimitedData("gene\tlog2FC\tpadj\nA\t0.1\t0.8\nB\t-0.2\t0.6");
    const markup = renderToStaticMarkup(
      <ScientificChartPreview
        svgRef={createRef<SVGSVGElement>()}
        type="volcano"
        dataset={dataset}
        mapping={plotModule.definition.defaultMapping}
        settings={{ ...defaultVisualizationSettings, foldChangeThreshold: 5, pValueThreshold: 1e-10 }}
        themeId={defaultVisualizationThemeId}
      />,
    );
    const foldCoordinates = [...markup.matchAll(/data-plot-element="fold-change-threshold" x1="([\d.]+)"/g)].map((match) => Number(match[1]));
    const pCoordinate = Number(markup.match(/data-plot-element="p-value-threshold"[^>]* y1="([\d.]+)"/)?.[1]);
    expect(foldCoordinates).toHaveLength(2);
    expect(foldCoordinates.every((coordinate) => coordinate >= 60 && coordinate <= 218)).toBe(true);
    expect(pCoordinate).toBeGreaterThanOrEqual(20);
    expect(pCoordinate).toBeLessThanOrEqual(292);
  });
});
