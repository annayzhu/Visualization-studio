# P0 execution and acceptance — 2026-10-01

Contract: LabNest `docs/visualization/20260930/EXECUTION_CHECKLIST.md`. **Only VIS-00–08, VIS-18 and applicable VIS-90/91**. P1/P2 are not executed. Issue [#46](https://github.com/annayzhu/Visualization-studio/issues/46); integration [LabNest #84](https://github.com/annayzhu/LabNest/issues/84).

## Version and environment

Baseline main `56316726a176f9b9f9369f9fba36374e18f8535a`; implementation checkpoint `02bc006`; final code tested `b9a7f0f1a9daa8b438fcbe880e14297209a71bdb`. Branch `codex/studio-project-p0-20260930`, isolated development `/private/tmp/visualization-studio-p0-20260930`. The original Studio checkout and dirty LabNest branch were not overwritten. Existing generated next-env, CLAUDE and Sept20 evidence were excluded from commits. Live service was still the separate Sept20 checkout during testing; merge/deploy is recorded separately in RELEASE.md when performed.

Next 16.3.1, React 19.2.7-compatible package lock, TypeScript 5, local Chromium Playwright; exact installed versions in evidence/environment.json. Root and `/visualization-studio/` production builds were tested. All data in committed evidence are synthetic examples, not private records.

## Requirement ledger

| ID | Status / result | Implementation and actual evidence |
|---|---|---|
| VIS-00 | VERIFIED / 通过 | Baseline recorded, old root/packaged source compared, actual registry exported in catalog.json. 82 current modules; this is a snapshot, not a fixed count contract. |
| VIS-01 | VERIFIED / 通过 | studio-project.ts: versioned datasets/figures/results, explicit provenance, change checksum, persisted fields/units, annotation settings and palettes. Invalid references/enums rejected; style changes preserve result; source/mapping changes warn. Unit and project browser tests. |
| VIS-02 | VERIFIED / 通过 | studio-i18n.ts, StudioLanguage, guidance messages: Chinese chart names, UI parameters, help and method boundaries; language switch preserves original headers/cells. Chinese preparation screenshots plus English workflow evidence. Scientific data/export labels are not translated. Product/palette proper names and some recovery notices are intentionally bilingual. |
| VIS-03 | VERIFIED / 通过 | studio-catalog.ts: 11 scenarios, searchable module names/aliases, stable preset favorites and deduplicated recent entries. Actual browser switches preserve data; saved favorite reload/click passes. No new statistics implementation. |
| VIS-04 | VERIFIED / 通过 | studio-data/import, StudioAnnotationImport: local CSV/TSV/XLS/XLSX, explicit worksheet selection, field semantics and issue export; exact-ID double annotation browser fixture includes `001` and ` 001`. Malformed numeric/duplicate ID blocks SVG. Multi-sheet XLS/XLSX tested by generated workbook fixtures. |
| VIS-05 | VERIFIED / 通过 | Pure replayable transforms preserve source; wide-long known values, duplicate pivot rejection, before/after preview and actual UI undo/redo. Project import replays derived history, rejects forged or cyclic ancestry. |
| VIS-06 | VERIFIED / 通过 | Versioned project + legacy Config import atomic validation. Paired Bar, ΔCt Bar, matrix PCA, heatmap, Venn, UpSet, enrichment close/import in fresh browser contexts compare text, marks, dimensions and exported SVG. Imported two-axis annotation strings retained. Current edit during delayed file read is protected. |
| VIS-07 | VERIFIED / 通过 | IndexedDB save/reload/new tab, dirty/saving/failure state; denied storage still exports. Save response cannot erase newer edits; imports consult current dirty state. Browser address scope clearly disclosed. |
| VIS-08 | VERIFIED / 通过 | studio-enrichment.ts: dot + bar share full external result from either entry. Independent display filter, raw P/FDR retained, stale-source alert. Both directions tested on actual page. No inferred network relationships or invented provenance. |
| VIS-18 | VERIFIED / 通过 | Separate LabNest commit 8b31986; external new-tab link, same-origin migration, unconfigured/unreachable paths and exact recoverable retirement inventory. See integration repository RETIREMENT.md and link-report.json. |
| VIS-90 | VERIFIED / 通过（下列边界除外） | 225 unit tests, typecheck/lint/build; 64 browser tests passed, 22 original per-device not-applicable skips. No screenshot baseline changed. Subpath build + nine resources + mobile SVG smoke passed. Logs/artifacts below. |
| VIS-91 | IMPLEMENTED / 发布待核对 | Issues and review completed; PR/merge/deploy receipts must be added after real actions. Not a claim of a running release. |

## Reproduction and evidence

Run from the isolated Studio root, with locked dependencies:

```sh
npm run typecheck
npm run lint
npm test
npm run build:webpack
STUDIO_E2E_PRODUCTION=1 npx playwright test
# In a separate clean copy:
NEXT_PUBLIC_VISUALIZATION_STUDIO_BASE_PATH=/visualization-studio npm run build:webpack
npm run test:deployment
```

All final checks exit 0. `evidence/unit.txt`, `lint.txt`, `build.txt`, `browser.txt`, `prefix-build.txt`, `prefix-smoke.txt` contain actual logs. `review-red.txt`/`review-green.txt` show meaningful failing then fixed input protections. `evidence/artifacts` contains project files, restored chart PNGs and exported SVGs for desktop 1440 and mobile 390. Existing PNG browser acceptance decodes output, checks pixels (380×340 at 600/96 scaling), nonblank pixels, SVG font/geometry/text, and unchanged visual snapshots. No new export format was added in P0.

Two independent code-review passes found and resolved input-limit rendering, late import/save edits, invalid statistical enums/figure names, export/import size asymmetry and bar-to-dot mapping. Final focused static re-review found no remaining blocker; browser checks subsequently passed.

## Boundaries / 未执行

- Physical phone, real soft keyboard/160% browser zoom, researcher usability and accessibility assistive-device testing: **未执行**. Mobile evidence is Chromium device emulation. Open the released LAN URL on the phone, import a synthetic example, edit a value, save/reopen, export a project and SVG, and check 160% zoom without blocked buttons or horizontal page scroll.
- Actual historical user browser storage/Config and original private fault records: **未执行**; migration fixtures are synthetic. No user storage is cleared. Old palette collection is imported, then selected explicitly; the downloaded file retains the original selection preference.
- Public domain, trusted HTTPS, cross-network access: **未执行**. Do not describe localhost/LAN as a public deployment.
- Parser safety bounds: 20 MiB/file, 100,000 rows, 1,000 columns, 1,000,000 cells; projects 80 MiB (same encoded-size rule for save/import/export). These are enforced safety ceilings, **not a claim that every scientific renderer runs interactively at that size**. Browser oversize recovery and unit boundary cases tested; exhaustive maximum-size performance on physical devices not executed.
- P1 VIS-09–14 (multipanel/export/statistics/Table 1) and P2 VIS-15–17 (R service): **未执行，按合同不在本批范围**.
- Current failures: none in the final executed matrix. Intentional device skips are not counted as passed.
