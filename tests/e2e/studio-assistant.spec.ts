import { expect, test } from "@playwright/test";
import { createServer, type Server } from "node:http";
import type { AddressInfo } from "node:net";

/**
 * Figure assistant against a mock OpenAI-compatible model. Every request the Studio proxy
 * forwards is recorded so the test can prove that cell values and the key stay out of the prompt.
 */

const table = "sample\tgroup\tvalue\nS1\tcontrol\t1.21\nS2\tcontrol\t1.35\nS3\tcontrol\t1.18\nS4\ttreated\t7.777\nS5\ttreated\t4.4321\nS6\ttreated\t2.91";
const key = "studio-e2e-fake-key";
const plan = {
  plotType: "violin",
  mapping: { group: "group", value: "value" },
  settingsPatch: { title: "Assistant violin", legendPosition: "bottom", showSignificance: true },
  caption: { en: "Violin plot of value by group with individual observations; [n = ?] per group.", zh: "按分组展示数值的小提琴图并叠加原始点；每组 [n = ?]。" },
  rationale: "Distributions per group with raw points.",
  questions: ["Are the samples paired?"],
};

let server: Server;
let base = "";
const prompts: string[] = [];
const auth: string[] = [];

test.beforeAll(async () => {
  server = createServer(async (req, res) => {
    const chunks: Buffer[] = [];
    for await (const chunk of req) chunks.push(chunk as Buffer);
    prompts.push(Buffer.concat(chunks).toString());
    auth.push(String(req.headers.authorization));
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify({ model: "mock-figure-model", choices: [{ message: { content: "```json\n" + JSON.stringify(plan) + "\n```" } }] }));
  });
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  base = `http://127.0.0.1:${(server.address() as AddressInfo).port}/v1`;
});

test.afterAll(async () => {
  await new Promise((resolve) => server.close(resolve));
});

test("proposes, checks, applies and undoes a plan without sending cell values", async ({ page }, info) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await page.getByRole("textbox", { name: "CSV or TSV data", exact: true }).fill(table);
  await page.getByRole("tab", { name: /AI 智能作图/ }).click();
  const assistant = page.getByRole("region", { name: "AI figure assistant" });
  await expect(assistant.getByText("No model connected")).toBeVisible();

  await assistant.getByRole("combobox", { name: "Connection type" }).selectOption("openai_compatible");
  await assistant.getByRole("textbox", { name: "Base URL" }).fill(base);
  await assistant.getByRole("textbox", { name: "Model" }).fill("mock-figure-model");
  await assistant.getByLabel("API key").fill(key);
  await assistant.getByRole("button", { name: "Test connection" }).click();
  await expect(assistant.getByRole("status")).toContainText("Connected (mock-figure-model)");
  await assistant.getByRole("button", { name: "Save", exact: true }).click();
  expect(await page.evaluate(() => [sessionStorage.getItem("studio.ai.provider") !== null, localStorage.getItem("studio.ai.provider")])).toEqual([true, null]);

  await assistant.getByRole("textbox", { name: "What should the figure show?" }).fill("Compare value between groups and show every observation.");
  await assistant.getByRole("button", { name: "Propose a plan" }).click();
  const proposal = assistant.getByRole("group", { name: "Proposed plan" });
  await expect(proposal.getByText("Ready to apply")).toBeVisible();
  await expect(proposal.getByText("Are the samples paired?")).toBeVisible();
  await expect(proposal.getByText(/Ignored: Setting "showSignificance"/)).toBeVisible();
  await expect(proposal.getByText("mapping.group")).toBeVisible();

  const prompt = prompts.at(-1)!;
  expect(prompt).toContain("Compare value between groups");
  expect(prompt).toContain('\\"name\\":\\"value\\"');
  expect(prompt).toContain("7.777"); // column maximum, disclosed as a numeric range
  expect(prompt).not.toContain("4.4321");
  expect(prompt).not.toContain("S4");
  expect(prompt).not.toContain(key);
  expect(auth.at(-1)).toBe(`Bearer ${key}`);
  expect(await page.content()).not.toContain(key);

  await proposal.getByRole("button", { name: "Apply plan" }).click();
  await expect(page.getByText("Violin preview")).toBeVisible();
  await expect(proposal.getByRole("button", { name: "Applied" })).toBeDisabled();
  await expect(page.getByRole("textbox", { name: "CSV or TSV data", exact: true })).toHaveValue(table);
  await page.screenshot({ path: info.outputPath("assistant-applied.png"), fullPage: true });
  await assistant.getByRole("button", { name: "Undo last plan" }).click();
  await expect(page.getByText("Bar preview")).toBeVisible();
  await expect(page.getByRole("textbox", { name: "CSV or TSV data", exact: true })).toHaveValue(table);

  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  expect(errors).toEqual([]);
});

test("a pasted plan with an unknown column cannot be applied", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("textbox", { name: "CSV or TSV data", exact: true }).fill(table);
  await page.getByRole("tab", { name: /AI 智能作图/ }).click();
  const assistant = page.getByRole("region", { name: "AI figure assistant" });
  await assistant.getByText("Paste a plan from another chat").click();
  await assistant.getByRole("textbox", { name: "Pasted plan JSON" }).fill(JSON.stringify({ ...plan, mapping: { group: "arm", value: "value" } }));
  await assistant.getByRole("button", { name: "Check pasted plan" }).click();
  const proposal = assistant.getByRole("group", { name: "Proposed plan" });
  await expect(proposal.getByText("Cannot apply")).toBeVisible();
  await expect(proposal.getByText(/Column "arm"/)).toBeVisible();
  await expect(proposal.getByRole("button", { name: "Apply plan" })).toBeDisabled();
});

test("the proxy refuses foreign origins and raw tables", async ({ request }) => {
  const provider = { type: "openai_compatible", baseUrl: base, model: "m" };
  const before = prompts.length;
  const foreign = await request.post("/api/ai/plan/", { headers: { origin: "https://evil.example", "x-studio-ai-key": key }, data: { provider, ping: true } });
  expect(foreign.status()).toBe(403);
  const raw = await request.post("/api/ai/plan/", { headers: { origin: "http://127.0.0.1:33117", "x-studio-ai-key": key }, data: { provider, context: { raw: table } } });
  expect(raw.status()).toBe(400);
  expect(prompts.length).toBe(before);
});

test("editing data after applying AI disables its undo and preserves the new value", async ({ page }, info) => {
  await page.goto("/");
  const data = page.getByRole("textbox", { name: "CSV or TSV data", exact: true });
  await data.fill(table);
  await page.getByRole("tab", { name: /AI 智能作图/ }).click();
  const assistant = page.getByRole("region", { name: "AI figure assistant" });
  await assistant.getByText("Paste a plan from another chat").click();
  await assistant.getByRole("textbox", { name: "Pasted plan JSON" }).fill(JSON.stringify(plan));
  await assistant.getByRole("button", { name: "Check pasted plan" }).click();
  await assistant.getByRole("button", { name: "Apply plan", exact: true }).click();
  await expect(assistant.getByRole("button", { name: "Undo last plan" })).toBeVisible();
  const edited = table.replace("4.4321", "99.2");
  await data.fill(edited);
  await expect(assistant.getByRole("button", { name: "Undo last plan" })).toBeHidden();
  await expect(data).toHaveValue(edited);
  await page.screenshot({ path: info.outputPath("data-edit-preserved.png"), fullPage: true });
});

test("a checked plan becomes stale when columns change", async ({ page }) => {
  await page.goto("/");
  const data = page.getByRole("textbox", { name: "CSV or TSV data", exact: true });
  await data.fill(table);
  await page.getByRole("tab", { name: /AI 智能作图/ }).click();
  const assistant = page.getByRole("region", { name: "AI figure assistant" });
  await assistant.getByText("Paste a plan from another chat").click();
  await assistant.getByRole("textbox", { name: "Pasted plan JSON" }).fill(JSON.stringify(plan));
  await assistant.getByRole("button", { name: "Check pasted plan" }).click();
  const apply = assistant.getByRole("button", { name: "Apply plan", exact: true });
  await expect(apply).toBeEnabled();
  await data.fill(table.replace("value", "measurement"));
  await expect(apply).toBeDisabled();
  await expect(assistant.getByText(/Data or figure changed/)).toBeVisible();
  await assistant.getByRole("button", { name: "Check pasted plan" }).click();
  await expect(assistant.getByText(/Column "value"/)).toBeVisible();
  await expect(apply).toBeDisabled();
});

test("a late model response cannot be applied after the data changes", async ({ page }) => {
  let release!: () => void;
  const waiting = new Promise<void>((resolve) => { release = resolve; });
  let sent!: () => void;
  const received = new Promise<void>((resolve) => { sent = resolve; });
  await page.route("**/api/ai/plan/", async (route) => {
    sent(); await waiting;
    await route.fulfill({ json: { text: JSON.stringify(plan), model: "synthetic-deepseek" } });
  });
  await page.goto("/");
  const data = page.getByRole("textbox", { name: "CSV or TSV data", exact: true });
  await data.fill(table);
  await page.getByRole("tab", { name: /AI 智能作图/ }).click();
  const assistant = page.getByRole("region", { name: "AI figure assistant" });
  await assistant.getByRole("combobox", { name: "Connection type" }).selectOption("deepseek");
  await expect(assistant.getByRole("textbox", { name: "Base URL" })).toHaveValue("https://api.deepseek.com");
  await expect(assistant.getByRole("textbox", { name: "Model", exact: true })).toHaveValue("deepseek-flash");
  await assistant.getByLabel("API key").fill("synthetic-only");
  await assistant.getByRole("button", { name: "Save", exact: true }).click();
  await assistant.getByRole("textbox", { name: "What should the figure show?" }).fill("Compare groups");
  await assistant.getByRole("button", { name: "Propose a plan" }).click();
  await received;
  await data.fill(table.replace("value", "measurement"));
  release();
  await expect(assistant.getByRole("button", { name: "Apply plan", exact: true })).toBeDisabled();
  await expect(assistant.getByText(/Data or figure changed/)).toBeVisible();
});

test("switching project invalidates an earlier AI undo", async ({ page }) => {
  await page.goto("/");
  const data = page.getByRole("textbox", { name: "CSV or TSV data", exact: true });
  await data.fill(table);
  await page.getByRole("tab", { name: /AI 智能作图/ }).click();
  const assistant = page.getByRole("region", { name: "AI figure assistant" });
  await assistant.getByText("Paste a plan from another chat").click();
  await assistant.getByRole("textbox", { name: "Pasted plan JSON" }).fill(JSON.stringify(plan));
  await assistant.getByRole("button", { name: "Check pasted plan" }).click();
  await assistant.getByRole("button", { name: "Apply plan", exact: true }).click();
  page.on("dialog", (dialog) => dialog.accept());
  await page.getByRole("region", { name: "Project workspace" }).getByRole("button", { name: /New/ }).click();
  await expect(assistant.getByRole("button", { name: "Undo last plan" })).toBeHidden();
  await expect(data).not.toHaveValue(table);
});
