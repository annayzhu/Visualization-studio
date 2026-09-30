# P0 execution status (2026-09-30)

Contract: LabNest docs/visualization/20260930/EXECUTION_CHECKLIST.md. Only VIS-00–08, VIS-18, VIS-90/91. Independent Studio owns new features. Scientific engines and palettes retained.

Baseline: origin/main 56316726a176f9b9f9369f9fba36374e18f8535a, branch codex/studio-project-p0-20260930. Development: Visualization-studio-20260920. Live 3400: Visualization-studio-deploy-20260920 (not modified for development). Existing generated next-env.d.ts and untracked Sept20 evidence/AGENTS/CLAUDE preserved. Baseline: 196/196 tests pass (evidence/baseline-tests.log).

Issues: Studio #46, LabNest #84. LabNest integration isolated in /Users/annayzhu/.codex/worktrees/studio-link-p0/LabNest; original branch 1941d6d remains untouched.

| ID | Status | Changes/evidence | Next |
|---|---|---|---|
| VIS-00 | IN_PROGRESS | baseline SHA/tests recorded | registry/runtime inventory |
| VIS-01 | IMPLEMENTED | studio-project.ts; migration/change-detector tests | browser integration and validation hardening |
| VIS-02 | TODO | incumbent standalone is English only | semantic translation |
| VIS-03 | IN_PROGRESS | confirmed selectPlot replaces data | preserve data, presets and history |
| VIS-04 | IN_PROGRESS | studio-data.ts, studio-import.ts | upload/preflight/annotation UI |
| VIS-05 | IN_PROGRESS | reversible pure transforms; pivot roundtrip test | preview/history UI |
| VIS-06 | IN_PROGRESS | decode/encode legacy and versioned project | close/import UI |
| VIS-07 | IN_PROGRESS | IndexedDB adapter | honest save state and failure UI |
| VIS-08 | TODO | existing external enrichment renderers retained | shared result/figure references |
| VIS-18 | TODO | separate LabNest checkout and issue | migration/link/retirement |
| VIS-90 | TODO | incremental seam tests only | full release matrix |
| VIS-91 | TODO | issues created | PR/merge/deploy after acceptance |

P1/P2 not executed by contract. No real user data, phone hardware or external network access acceptance claimed.
