# DeepSeek and AI integrity acceptance (2026-10-10)

Source requirements: SPEC.md. No real API key obtained or called. Old production port 3400 is not treated as this build.

| Check | Result | Evidence |
|---|---|---|
| Task-specific series scoring regression | PASS: missing series fails; reference answers remain valid | evidence/eval-red.log, eval-green.log |
| Bilingual caption presence | PASS: missing drafts fail; factuality remains human review | evidence/caption-red.log, caption-green.log |
| DeepSeek transport | PASS: official endpoint, model and Bearer token; mocked response only | evidence/deepseek-red.log, deepseek-green.log |
| Redirect credential protection | PASS: model request refuses redirects | evidence/redirect-red.log, redirect-green.log |
| TypeScript, ESLint, production build | PASS locally | evidence/typecheck.log, lint.log, build.log |
| Shanghai and UTC full unit suites | PASS locally; live-model case skipped | evidence/tests-shanghai.log, tests-utc.log |
| Undo/data edit, stale/late response, project switch, desktop/mobile UI | PASS: 14/14 production browser cases across desktop/mobile | evidence/browser.log, evidence/browser/*.png; tested code tree matches cd23a5c |
| Merge, production deployment and readback | PENDING | Must be recorded after completion |
| Real DeepSeek evaluation, user trial, physical phone | NOT EXECUTED | User will connect their own API after deployment |

The earlier audit reproduced the two lifecycle bugs on original 15bd8df. The new browser regressions must pass on this revision before those issues are marked accepted. Unit tests cannot substitute for those page checks.


## Review and delivery block

Both independent code reviews found no additional Studio blocker in the reviewed changes. Browser execution on this revision remains pending. GitHub tree-write approval and local browser/server approval each timed out on both initial attempt and retry; neither is a safety rejection. No PR, merge, launch-agent update or production deployment occurred. The user was asked to enable the required runtime/GitHub permissions. Original worktrees and the existing 3400 service remain untouched.


## Permission recovery and current page evidence

After the user resumed and permitted execution, the production browser suite passed all 14 cases. GitHub PR #48 was created. Screenshots were saved in evidence/browser and inspected. Earlier timeout paragraphs record history only; merge/deployment remain pending until separately recorded. All model responses in these page checks were synthetic, with no real key used.
