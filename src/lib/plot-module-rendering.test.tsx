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
