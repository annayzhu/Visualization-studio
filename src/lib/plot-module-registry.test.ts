import { describe, expect, it } from "vitest";
import {
  createPlotModuleRegistry,
  type PlotModuleSeed,
} from "./plot-module-registry";
import {
  getPlotModule,
  plotModuleRegistry,
  type PlotDefinition,
  type PlotGuidance,
} from "./visualization-studio";

const guidance: PlotGuidance = {
  definition: "A deliberately small test definition with enough detail.",
  suitableData: "Categorical labels and numeric values.",
  answers: "Whether groups differ in their displayed values.",
  references: [{ citation: "Test et al., 2026. Registry contract.", href: "https://doi.org/10.1000/registry" }],
};

function seed(id: string, overrides: Partial<PlotModuleSeed> = {}): PlotModuleSeed {
  const definition: PlotDefinition = {
    id: id as PlotDefinition["id"],
    name: id,
    family: "Test",
    summary: "Registry contract test.",
    inputHint: "One row per observation.",
    roles: [],
    defaultMapping: {},
    sampleData: "label\tvalue\nA\t1",
  };
  return {
    definition,
    guidance,
    renderer: "standard",
    capabilities: { dataShape: "long" },
    ...overrides,
  };
}

describe("plot-module registry interface", () => {
  it("normalizes a module behind one immutable public record", () => {
    const registry = createPlotModuleRegistry([seed("bar")]);
    const plotModule = registry.get("bar");

    expect(registry.list()).toEqual([plotModule]);
    expect(plotModule.definition.id).toBe("bar");
    expect(plotModule.guidance).toEqual(guidance);
    expect(plotModule.renderer).toBe("standard");
    expect(plotModule.examples).toEqual([
      {
        label: "Example 1",
        description: "Default input template for this plot type.",
        data: "label\tvalue\nA\t1",
        mapping: {},
      },
    ]);
    expect(Object.isFrozen(plotModule)).toBe(true);
    expect(Object.isFrozen(registry.list())).toBe(true);
  });

  it("rejects duplicate identifiers and incomplete registrations", () => {
    expect(() => createPlotModuleRegistry([seed("bar"), seed("bar")])).toThrow(/duplicate.*bar/i);
    expect(() => createPlotModuleRegistry([seed("bar", { guidance: undefined as never })])).toThrow(/guidance.*bar/i);
    expect(() => createPlotModuleRegistry([seed("bar", { renderer: undefined as never })])).toThrow(/renderer.*bar/i);
  });

  it("reports unknown plot modules instead of silently selecting another chart", () => {
    const registry = createPlotModuleRegistry([seed("bar")]);
    expect(() => registry.get("line")).toThrow(/unknown plot module.*line/i);
  });

  it("adapts all existing plots to the shared module contract", () => {
    expect(plotModuleRegistry.list()).toHaveLength(31);
    plotModuleRegistry.list().forEach((plotModule) => {
      expect(plotModule.definition.id).toBeTruthy();
      expect(plotModule.examples.length).toBeGreaterThan(0);
      expect(plotModule.guidance.references.length).toBeGreaterThan(0);
      expect(["standard", "advanced"]).toContain(plotModule.renderer);
      expect(plotModule.capabilities.dataShape).toBeTruthy();
    });
    expect(getPlotModule("bar").renderer).toBe("standard");
    expect(getPlotModule("circos").renderer).toBe("advanced");
  });
});
