# Studio AI integrity and DeepSeek release

User request (2026-10-10): optimize the reviewed implementation, merge and deploy, and add DeepSeek so the user can connect their own real API.
Review base: main 4eece79176947f1e5805564d0e1944e6d248fe78; original assistant 15bd8dfdb0858761f741b65bb963d10225de8562.

- Preserve the independent Studio product, local data/project storage and existing plotting algorithms.
- AI undo must never overwrite later data edits or apply another project's snapshot.
- Bind proposals to their data/figure/project context. Data changes and late responses invalidate proposals; revalidate immediately before apply.
- Score the ten fixed tasks against explicit task-specific mappings, including requested series/group fields. Require both caption drafts, preserve failures and duration; caption factuality remains a human check.
- Add a visible DeepSeek preset with official URL, editable model name, test/save, existing OpenAI-compatible transport and credential redaction. Do not obtain or call the user's real key.
- Shared deployment must restrict model hosts, include api.deepseek.com, and not forward credentials across redirects.
- Validate typecheck, lint, production build, two time zones and browser workflows; create reviewable PR, merge only after applicable checks pass, then verify actual deployment.
- Do not count mocked responses or reference-answer scores as real-model success. User will perform real API testing.
