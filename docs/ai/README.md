# AI figure assistant

The assistant turns a plain-language request into a figure plan: a plot type, a column mapping, a few presentation settings, an optional palette, and a bilingual caption draft. Studio checks the plan against its own registry and the current table, shows every change, and applies it only when the user clicks **Apply plan**. One click on **Undo last plan** restores the previous figure presentation. Editing data or switching projects invalidates earlier undo entries; undo never writes the data table. A proposal is bound to the figure/data/project context that produced it, including delayed model responses, and checked again immediately before applying.

## Using it

1. Open the **AI 智能作图** tab above Figure parameters.
2. **Connect model**: choose a connection type, enter the base URL, model name, and API key, then **Test connection** and **Save**.
   - **DeepSeek**: select the preset; it fills `https://api.deepseek.com` and `deepseek-flash`. Enter your own key. The model is editable; use a model available to your account. Defaults checked against [DeepSeek official documentation](https://api-docs.deepseek.com/) on 2026-10-10.
   - Dify app (for example ZJU aihub): base URL from the app's API page, such as `https://aihub.zju.edu.cn/v1`; the model is chosen inside the app.
   - OpenAI-compatible: for Qwen use `https://dashscope.aliyuncs.com/compatible-mode/v1` and a model such as `qwen-plus`.
   - Anthropic: base URL may be left blank.
3. Describe the figure and click **Propose a plan**. Questions from the model, ignored settings, and validation errors are shown before anything changes.
4. Without a model, use **Copy prompt**, paste it into any chat, and paste the JSON answer under **Paste a plan from another chat**. The same checks apply.

**Publication check** runs locally on every change. It flags text that prints under 6 pt at single-column width (85 mm), palettes with fewer colors than groups, a hidden legend with colored groups, and group colors with similar lightness.

## What leaves the browser

| Sent when you click Propose | Never sent |
|---|---|
| Your request text | Individual rows (unless you tick "share the first 5 rows"); numeric min/max are always disclosed |
| Column names, inferred kind, missing and distinct counts | The full table, project files, exports |
| Numeric minimum and maximum per column | The API key inside the prompt |
| Current plot type, mapping, validation messages, publication checks | |

Connection settings are stored only in this browser: sessionStorage by default, or localStorage when **Remember on this device** is ticked. The key is sent as a header to Studio's own `/api/ai/plan/` route, which builds the prompt on the server from the checked profile and forwards it. The route stores nothing.

## Limits by design

- The model chooses among the registered plots and may only set: title, axis labels, font, size, text sizes, line widths, point size, opacity, grid, legend position, axis swap, labels, and points. Each value is range-checked.
- It can never change statistical settings: tests, P values, significance marks, error-bar statistics, or analysis modes. Requests that need them come back as questions.
- Caption drafts are editable text only and are not written into SVG, PNG, or config exports.

## Deployment settings

| Variable | Effect |
|---|---|
| `STUDIO_AI_PROXY=off` | Disables `/api/ai/plan/` (HTTP 404). The panel still offers Copy prompt and Paste plan. |
| `STUDIO_AI_ALLOWED_HOSTS=api.deepseek.com,aihub.zju.edu.cn,dashscope.aliyuncs.com,api.anthropic.com` | Comma-separated host names the proxy may call. Set on shared deployments. The proxy does not follow redirects, so credentials cannot follow a redirect outside the checked host. |

The proxy accepts only same-origin `application/json` POSTs, caps the body at 200 KB and the model response at 400 KB, times out after 60 s, and removes the key from error messages.

## Code

| File | Role |
|---|---|
| `src/lib/studio-ai-catalog.ts` | Plot catalog for prompts and the whitelist of adjustable settings with runtime checks |
| `src/lib/studio-ai-context.ts` | Column profile, context guard, publication checks |
| `src/lib/studio-ai-plan.ts` | Prompt, plan parsing, and the validation chain |
| `src/lib/studio-ai-upstream.ts`, `src/app/api/ai/plan/route.ts` | Server-side model calls and the same-origin proxy |
| `src/lib/studio-ai-provider.ts`, `src/components/StudioAssistantPanel.tsx` | Browser settings and the assistant panel |
| `src/lib/studio-ai-eval.ts` | Ten fixed evaluation cases |

## Verification

The figures below describe the original 2026-10-09 implementation. See [2026-10-10 acceptance](20261010/ACCEPTANCE.md) for this release; historical screenshots are not evidence that the new build is deployed.

- `npm run typecheck`, `npm run lint`, `npm test`: 19 files, 241 tests pass (16 new), plus 1 live-model test skipped without credentials. The new suites cover the catalog, context guard, plan checks, publication checks, the three provider dialects, key scrubbing, the host allowlist, and the proxy route.
- `tests/e2e/studio-assistant.spec.ts` (desktop and mobile Chromium, dev and production standalone): connect, test, propose, ignored statistical setting, apply, undo, pasted-plan rejection, proxy origin and raw-table refusal. The mock model's received prompt is checked for absent cell values and key.
- Production build includes `ƒ /api/ai/plan`. A build with `NEXT_PUBLIC_VISUALIZATION_STUDIO_BASE_PATH=/visualization-studio` answers at `/visualization-studio/api/ai/plan/` and passes `npm run test:deployment`.

## Evaluation with a real model

```bash
STUDIO_AI_EVAL_TYPE=deepseek \
STUDIO_AI_EVAL_BASE_URL=https://api.deepseek.com \
STUDIO_AI_EVAL_MODEL=deepseek-flash \
STUDIO_AI_EVAL_KEY=… \
npm run eval:assistant
```

The run writes `studio-ai-eval-report.json` with per-case plans, failures and latency, and passes at 8 of 10 cases or better. Rubric `2026-10-10.semantic-v2` checks task-specific mappings (including group/series), and requires both caption drafts. Scientific suitability and caption factuality still need human review; the score is not an overall scientific-accuracy estimate. **It has not yet been run against a real model.** The harness itself is verified: a reference answer scores 10/10 and a wrong one 0/10.
