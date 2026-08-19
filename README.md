# Visualization Studio

A browser-local scientific visualization workspace for creating compact, publication-ready figures from CSV, TSV, XLS, and XLSX data.

## Highlights

- Publication-oriented defaults with Arial typography and compact figure dimensions
- A categorical Bar family with grouped, stacked, 100% stacked, horizontal, bidirectional, faceted, polar, bullet, pyramid, axis-break, dual-axis, and overlay variants, plus line, scatter, PCA, box, violin, volcano, heatmap, enrichment, survival, ROC, Venn, UpSet, Sankey, chord, Circos, and additional scientific plot types
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
npm run build
```

## Scientific scope

The application focuses on visualization and deterministic browser-side transformations. It does not invent P values or substitute statistical summaries. Users remain responsible for selecting methods appropriate to their study design and for reporting whether uncertainty represents SD, SEM, confidence intervals, or another statistic.

## Privacy

Input files are parsed in the browser. The standalone application has no database and no upload API.

## License

No open-source license has been granted yet. The source is publicly viewable, but reuse rights remain reserved by the repository owner unless a license is added later.
