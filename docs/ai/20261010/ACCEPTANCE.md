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
| Undo/data edit, stale/late response, project switch, desktop/mobile UI | PENDING browser execution for current revision | tests/e2e/studio-assistant.spec.ts; local test server was blocked by sandbox and automatic approval timed out |
| Merge, production deployment and readback | PENDING | Must be recorded after completion |
| Real DeepSeek evaluation, user trial, physical phone | NOT EXECUTED | User will connect their own API after deployment |

The earlier audit reproduced the two lifecycle bugs on original 15bd8df. The new browser regressions must pass on this revision before those issues are marked accepted. Unit tests cannot substitute for those page checks.


## Review and delivery block

Both independent code reviews found no additional Studio blocker in the reviewed changes. Browser execution on this revision remains pending. GitHub tree-write approval and local browser/server approval each timed out on both initial attempt and retry; neither is a safety rejection. No PR, merge, launch-agent update or production deployment occurred. The user was asked to enable the required runtime/GitHub permissions. Original worktrees and the existing 3400 service remain untouched.
