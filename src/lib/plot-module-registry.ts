import type {
  PlotDataExample,
  PlotDefinition,
  PlotGuidance,
  PlotType,
} from "./visualization-studio";

export type PlotRendererId = "standard" | "advanced";

export type PlotDataShape =
  | "long"
  | "matrix"
  | "coordinates"
  | "sets"
  | "network"
  | "genomic-links";

export type PlotModuleCapabilities = {
  dataShape: PlotDataShape;
  grouping?: boolean;
  multipleExamples?: boolean;
};

export type PlotModuleSeed = {
  definition: PlotDefinition;
  guidance: PlotGuidance;
  renderer: PlotRendererId;
  capabilities: PlotModuleCapabilities;
};

export type PlotModule = Readonly<{
  definition: Readonly<PlotDefinition>;
  examples: readonly Readonly<PlotDataExample>[];
  guidance: Readonly<PlotGuidance>;
  renderer: PlotRendererId;
  capabilities: Readonly<PlotModuleCapabilities>;
}>;

export type PlotModuleRegistry = Readonly<{
  list: () => readonly PlotModule[];
  get: (type: PlotType) => PlotModule;
}>;

function normalizedExamples(definition: PlotDefinition): readonly Readonly<PlotDataExample>[] {
  const examples = definition.examples?.length
    ? definition.examples
    : [{
        label: "Example 1",
        description: "Default input template for this plot type.",
        data: definition.sampleData,
        mapping: definition.defaultMapping,
      }];
  return Object.freeze(examples.map((example) => Object.freeze({ ...example })));
}

function assertSeed(seed: PlotModuleSeed, index: number) {
  const id = seed?.definition?.id ?? `at index ${index}`;
  if (!seed?.definition?.id || !seed.definition.name || !seed.definition.family) {
    throw new Error(`Plot module ${id} needs a complete definition.`);
  }
  if (!seed.guidance?.definition || !seed.guidance.suitableData || !seed.guidance.answers) {
    throw new Error(`Plot module guidance is incomplete for ${id}.`);
  }
  if (!seed.renderer) throw new Error(`Plot module renderer is missing for ${id}.`);
  if (!seed.capabilities?.dataShape) throw new Error(`Plot module data shape is missing for ${id}.`);
}

export function createPlotModuleRegistry(seeds: readonly PlotModuleSeed[]): PlotModuleRegistry {
  const byId = new Map<PlotType, PlotModule>();
  const modules = seeds.map((seed, index) => {
    assertSeed(seed, index);
    const id = seed.definition.id;
    if (byId.has(id)) throw new Error(`Duplicate plot module identifier: ${id}.`);
    const plotModule = Object.freeze({
      definition: Object.freeze({ ...seed.definition }),
      examples: normalizedExamples(seed.definition),
      guidance: Object.freeze({ ...seed.guidance }),
      renderer: seed.renderer,
      capabilities: Object.freeze({ ...seed.capabilities }),
    }) satisfies PlotModule;
    byId.set(id, plotModule);
    return plotModule;
  });
  const immutableModules = Object.freeze(modules);
  return Object.freeze({
    list: () => immutableModules,
    get: (type: PlotType) => {
      const plotModule = byId.get(type);
      if (!plotModule) throw new Error(`Unknown plot module: ${type}.`);
      return plotModule;
    },
  });
}
