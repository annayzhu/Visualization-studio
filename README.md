# Visualization Studio

A browser-local scientific visualization workspace for creating compact, publication-ready figures from CSV, TSV, XLS, and XLSX data.

## Highlights

- Publication-oriented defaults with Arial typography and compact figure dimensions
- Forty-three registry-owned modules, including categorical comparison, distribution, dimension reduction, enrichment, survival, set, network, genomic, composition, hierarchy, cyclic profile, and paired-distribution families
- Distinct pie, donut, rose, waffle, treemap, sunburst, radar, polar-profile, and population-pyramid contracts with scientific suitability guidance and references
- A unified Box, Violin, Beeswarm, Raincloud, Histogram, Density, and Ridge layer system with deterministic binning, KDE, quartiles, SD, SEM, Student t confidence intervals, pairing, facets, and orientation controls
- Line uncertainty as pointwise SD, SEM, or supplied 95% CI half-widths, displayed as bars or ribbons
- Association views spanning points, marginals, 2D density, hexbin counts, covariance ellipses, convex hulls, three-variable pair matrices, orthographic 3D, and ternary compositions, with linear, polynomial, or LOESS fits
- Heatmaps with row/column z-scaling, Euclidean or correlation distance, average/complete/single linkage, dendrograms, reproducible cluster cuts, stable-ID annotation tracks, triangular correlations, circular layouts, and coordinated row summaries
- Adjustable labels, dimensions, line weights, marks, grids, legends, uncertainty bars, palettes, and plot-specific parameters
- Built-in journal-inspired and traditional Chinese color palettes
- SVG, 600 dpi PNG, and reproducible JSON configuration export
- Example datasets and downloadable input templates
- Browser-local processing: uploaded data is not sent to a server
- Responsive desktop and mobile layouts

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Validation

```bash
npm run typecheck
npm test
npm run test:e2e
npm run build
```

## Scientific scope

The application focuses on visualization and deterministic browser-side transformations. Correlation panels can optionally calculate two-sided P values using the conventional t approximation (Pearson product-moment or Spearman rank, as labeled); they do not adjust for multiple testing. Linear confidence ribbons describe mean-response uncertainty, not prediction intervals. Other modules do not invent P values or substitute unreported statistical summaries. Users remain responsible for selecting methods appropriate to their study design and for reporting whether uncertainty represents SD, SEM, confidence intervals, or another statistic.

### Heatmap data contract

Heatmap matrices use the first column as a unique row identifier and all remaining columns as numeric matrix values. Optional row and column annotation tables are TSV/CSV text whose first column contains stable identifiers; they are joined by exact ID rather than row order. Declare track semantics in headers such as `batch[categorical]` or `age[continuous]`; undeclared numeric tracks are inferred as continuous with an explicit warning. Duplicate identifiers and invalid continuous declarations block rendering, while missing and extra identifiers are reported explicitly. Browser previews are capped at 250 × 100 cells for rectangular layouts and 80 × 60 for circular layouts, with an additional size-aware minimum ring-width check. Scaling, distance, linkage, cluster-cut counts, view mode, and palettes are preserved in the JSON configuration export.

## Privacy

Input files are parsed in the browser. The standalone application has no database and no upload API.

## License

No open-source license has been granted yet. The source is publicly viewable, but reuse rights remain reserved by the repository owner unless a license is added later.
