# VIS-01–03 acceptance

Implementation commit: `1f22bbebcbc80cbb67569a5e3df68d6cc491ab8b`, based on `e5173126cceb3379e5137df65549bdced2696aa0`.

Companion [LabNest PR #82](https://github.com/annayzhu/LabNest/pull/82) contains the full Chinese acceptance matrix, before/after 36 real rendered figures, formal SVG/PNG/Config artifacts, desktop/mobile screenshots, geometry and source parity checks in `docs/visualization/20260920/`.

Passed: collapsible whole guidance with independent scroll and keyboard focus; actual reclaimed parameter height; short/narrow screens and preserved chart-switch state; eight redesigned Chinese presets, unchanged China red and all IDs; synthetic saved explicit legacy colors survive reload; unchanged calculations and non-color configurations.

Local validation: 196 unit tests, TypeScript, ESLint, production webpack build; 32 Playwright browser cases passed, 22 intentionally skipped for inapplicable device categories; prefixed production deployment smoke checks HTML and 9 assets. Full root and packaged parity is recorded in the companion PR. This repository preserves its own standalone shell and runs at port 3400 when locally deployed.

Not executed: physical phones, color-vision participant testing, user aesthetic approval. Real browser screenshots do not establish user approval. CI/merge/runtime verification is recorded separately at delivery.
