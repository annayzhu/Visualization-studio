"use client";

import { Bot, ClipboardCopy, LoaderCircle, PlugZap, Settings2, Undo2, Wand2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useStudioLanguage } from "./StudioLanguage";
import { buildAIContext, type PublicationCheck } from "@/lib/studio-ai-context";
import { checkPlan, manualPrompt, parsePlanText, type CheckedPlan, type FigurePlan } from "@/lib/studio-ai-plan";
import { providerLabels, readProviderSettings, requestPlan, testProvider, writeProviderSettings, type ProviderSettings } from "@/lib/studio-ai-provider";
import { providerTypes, type ProviderType } from "@/lib/studio-ai-types";
import { getPlotModule, type JournalThemeId, type ParsedDataset, type PlotType, type VisualizationSettings } from "@/lib/visualization-studio";

const fieldClass = "focus-ring h-8 w-full rounded-[7px] border border-hairline bg-white px-2.5 text-xs text-ink placeholder:text-muted";
const areaClass = "focus-ring w-full rounded-[7px] border border-hairline bg-white px-2.5 py-2 text-xs leading-5 text-ink placeholder:text-muted";

type Props = {
  dataset: ParsedDataset;
  plotType: PlotType;
  mapping: Record<string, string>;
  settings: VisualizationSettings;
  themeId: JournalThemeId;
  validationErrors: string[];
  checks: PublicationCheck[];
  canUndo: boolean;
  onApply: (plan: FigurePlan) => void;
  onUndo: () => void;
};

export function StudioAssistantPanel(props: Props) {
  const { locale } = useStudioLanguage();
  const t = (en: string, zh: string) => (locale === "zh" ? zh : en);
  const [provider, setProvider] = useState<ProviderSettings | null>(null);
  const [editing, setEditing] = useState(false);
  const [request, setRequest] = useState("");
  const [includeRows, setIncludeRows] = useState(false);
  const [busy, setBusy] = useState<"plan" | "test">();
  const [error, setError] = useState<string>();
  const [status, setStatus] = useState<string>();
  const [result, setResult] = useState<{ checked: CheckedPlan; model?: string; source: "model" | "pasted"; applied?: boolean }>();
  const [pasted, setPasted] = useState("");
  const [caption, setCaption] = useState({ en: "", zh: "" });

  useEffect(() => {
    const timer = setTimeout(() => {
      const stored = readProviderSettings();
      setProvider(stored);
      setEditing(!stored);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const context = useMemo(() => buildAIContext({
    request: request || "(no request yet)",
    locale,
    dataset: props.dataset,
    includeSampleRows: includeRows,
    plotType: props.plotType,
    mapping: props.mapping,
    validationErrors: props.validationErrors,
    publicationChecks: props.checks.map((check) => check.message.en),
  }), [includeRows, locale, props.checks, props.dataset, props.mapping, props.plotType, props.validationErrors, request]);

  function check(text: string, source: "model" | "pasted", model?: string) {
    const { raw } = parsePlanText(text);
    const checked = checkPlan(raw, { plotType: props.plotType, mapping: props.mapping, settings: props.settings, themeId: props.themeId, dataset: props.dataset });
    setResult({ checked, model, source });
    setCaption(checked.plan.caption);
  }

  async function propose() {
    if (!provider || !request.trim()) return;
    setBusy("plan"); setError(undefined); setStatus(undefined); setResult(undefined);
    try {
      const { text, model } = await requestPlan(provider, context);
      check(text, "model", model);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : String(caught));
    } finally {
      setBusy(undefined);
    }
  }

  function checkPasted() {
    setError(undefined); setStatus(undefined);
    try { check(pasted, "pasted"); } catch (caught) { setError(caught instanceof Error ? caught.message : String(caught)); }
  }

  async function copyPrompt() {
    if (!request.trim()) { setError(t("Describe the figure first.", "请先描述想要的图。")); return; }
    try {
      await navigator.clipboard.writeText(manualPrompt(context));
      setStatus(t("Prompt copied. Paste the model's JSON answer below.", "提示词已复制。请把模型返回的 JSON 粘贴到下方。"));
    } catch {
      setError(t("The clipboard is not available in this browser.", "此浏览器无法使用剪贴板。"));
    }
  }

  function saveProvider(next: ProviderSettings) {
    writeProviderSettings(next);
    setProvider(next);
    setEditing(false);
    setStatus(next.remember ? t("Connection saved on this device.", "连接已保存在此设备。") : t("Connection kept for this browser session only.", "连接仅保留到关闭浏览器标签页。"));
  }

  async function runTest(next: ProviderSettings) {
    setBusy("test"); setError(undefined); setStatus(undefined);
    try {
      const model = await testProvider(next);
      setStatus(t(`Connected${model ? ` (${model})` : ""}.`, `已连接${model ? `（${model}）` : ""}。`));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : String(caught));
    } finally {
      setBusy(undefined);
    }
  }

  const sentColumns = context.columns.length;
  const checked = result?.checked;

  return (
    <section aria-label="AI figure assistant" className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 text-xs font-semibold text-ink"><Bot className="h-4 w-4 text-moss" aria-hidden />{t("AI figure assistant", "智能作图助手")}</p>
          <p className="mt-1 text-[11px] leading-4 text-muted">{provider && !editing ? `${providerLabels[provider.type]}${provider.model ? ` · ${provider.model}` : ""}` : t("No model connected. You can still copy the prompt and paste a plan.", "尚未连接模型；仍可复制提示词并粘贴方案。")}</p>
        </div>
        <Button size="sm" variant="ghost" onClick={() => setEditing((open) => !open)}><Settings2 className="h-3.5 w-3.5" aria-hidden />{provider ? t("Model settings", "模型设置") : t("Connect model", "连接模型")}</Button>
      </div>

      {editing ? <ProviderForm initial={provider} t={t} busy={busy === "test"} onSave={saveProvider} onTest={runTest} onForget={() => { writeProviderSettings(null); setProvider(null); setStatus(t("Connection removed from this device.", "已从此设备移除连接。")); }} /> : null}

      <div className="space-y-2">
        <label className="block text-[11px] font-semibold text-graphite" htmlFor="assistant-request">{t("What should the figure show?", "想画什么图？")}</label>
        <textarea id="assistant-request" rows={4} value={request} onChange={(event) => setRequest(event.target.value)} className={areaClass} placeholder={t("e.g. Compare expression across treatment groups as a violin plot with raw points; legend at the bottom.", "例如：用 treatment 分组画小提琴图并叠加原始点，图例放在下方。")} />
        <label className="flex items-start gap-2 text-[11px] leading-4 text-graphite">
          <input type="checkbox" checked={includeRows} onChange={(event) => setIncludeRows(event.target.checked)} className="mt-0.5 h-3.5 w-3.5 accent-[var(--moss)]" />
          <span>{t("Also share the first 5 rows of values", "同时发送前 5 行数值")}</span>
        </label>
        <p className="rounded-[7px] bg-stone px-2.5 py-2 text-[11px] leading-4 text-muted">
          {t(
            `Sent to the model: your request, ${sentColumns} column names with type, counts and numeric ranges, the current plot and mapping${includeRows ? ", and 5 rows of values" : ". No cell values"}.`,
            `发送给模型：你的描述、${sentColumns} 个列名及其类型、计数与数值范围、当前图形与映射${includeRows ? "，以及 5 行数值" : "；不发送任何单元格数值"}。`,
          )}
        </p>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="primary" onClick={propose} disabled={!provider || editing || !request.trim() || Boolean(busy)}>
            {busy === "plan" ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" aria-hidden /> : <Wand2 className="h-3.5 w-3.5" aria-hidden />}
            {busy === "plan" ? t("Thinking…", "生成中…") : t("Propose a plan", "生成方案")}
          </Button>
          <Button size="sm" onClick={copyPrompt} disabled={Boolean(busy)}><ClipboardCopy className="h-3.5 w-3.5" aria-hidden />{t("Copy prompt", "复制提示词")}</Button>
          {props.canUndo ? <Button size="sm" onClick={props.onUndo}><Undo2 className="h-3.5 w-3.5" aria-hidden />{t("Undo last plan", "撤销上次应用")}</Button> : null}
        </div>
      </div>

      <details className="rounded-[8px] border border-hairline bg-white">
        <summary className="focus-ring cursor-pointer px-3 py-2 text-[11px] font-semibold text-graphite">{t("Paste a plan from another chat", "粘贴其他对话返回的方案")}</summary>
        <div className="space-y-2 border-t border-hairline p-3">
          <textarea aria-label={t("Pasted plan JSON", "粘贴的方案 JSON")} rows={5} value={pasted} onChange={(event) => setPasted(event.target.value)} className={`${areaClass} font-mono`} placeholder='{"plotType":"violin","mapping":{...},"settingsPatch":{...},"caption":{"en":"","zh":""},"rationale":"","questions":[]}' />
          <Button size="sm" onClick={checkPasted} disabled={!pasted.trim()}>{t("Check pasted plan", "校验粘贴的方案")}</Button>
        </div>
      </details>

      {error ? <p role="alert" className="rounded-[8px] border border-error/25 bg-error-surface px-3 py-2 text-xs leading-5 text-error">{error}</p> : null}
      {status ? <p role="status" className="rounded-[8px] bg-sage-surface px-3 py-2 text-xs leading-5 text-graphite">{status}</p> : null}

      {checked ? (
        <div role="group" className="space-y-3 rounded-[9px] border border-moss/25 bg-white p-3" aria-label={t("Proposed plan", "建议方案")}>
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge tone={checked.canApply ? "success" : "danger"}>{checked.canApply ? t("Ready to apply", "可以应用") : t("Cannot apply", "无法应用")}</Badge>
            <Badge tone="sage">{getPlotModule(checked.plan.plotType).definition.name}</Badge>
            <span className="text-[11px] text-muted">{result?.source === "pasted" ? t("pasted plan", "粘贴的方案") : result?.model ?? ""}</span>
          </div>
          {checked.plan.rationale ? <p className="text-xs leading-5 text-graphite">{checked.plan.rationale}</p> : null}
          {checked.plan.questions.length ? (
            <div className="rounded-[8px] border border-warning/30 bg-warning-surface px-3 py-2 text-xs leading-5 text-warning">
              <p className="font-semibold">{t("Please confirm before relying on this plan:", "应用前请先确认：")}</p>
              <ul className="mt-1 list-disc pl-4">{checked.plan.questions.map((question) => <li key={question}>{question}</li>)}</ul>
            </div>
          ) : null}
          <div>
            <p className="text-[11px] font-semibold text-graphite">{t("Changes", "变更")}</p>
            {checked.changes.length ? (
              <ul className="mt-1 space-y-1">{checked.changes.map((change) => (
                <li key={`${change.kind}-${change.key}`} className="grid grid-cols-[minmax(0,1fr)_auto] gap-2 rounded-[6px] bg-stone px-2 py-1 font-mono text-[11px] text-graphite">
                  <span className="truncate" title={change.key}>{change.kind === "mapping" ? `mapping.${change.key}` : change.key}</span>
                  <span className="truncate text-right"><span className="text-muted line-through">{change.from || "—"}</span> → <span className="text-ink">{change.to || "—"}</span></span>
                </li>
              ))}</ul>
            ) : <p className="mt-1 text-[11px] text-muted">{t("No changes to the current figure.", "与当前图相同。")}</p>}
          </div>
          {[...checked.errors.map((message) => ({ message, tone: "error" })), ...checked.dropped.map((message) => ({ message, tone: "muted" })), ...checked.warnings.map((message) => ({ message, tone: "warning" }))].map(({ message, tone }) => (
            <p key={`${tone}-${message}`} className={tone === "error" ? "rounded-[6px] bg-error-surface px-2 py-1 text-[11px] leading-4 text-error" : tone === "warning" ? "rounded-[6px] bg-warning-surface px-2 py-1 text-[11px] leading-4 text-warning" : "rounded-[6px] bg-stone px-2 py-1 text-[11px] leading-4 text-muted"}>
              {tone === "muted" ? `${t("Ignored", "已忽略")}: ` : ""}{message}
            </p>
          ))}
          <div className="space-y-2">
            <p className="text-[11px] font-semibold text-graphite">{t("Caption draft (edit before use; not added to exports)", "图注草稿（使用前请修改；不会写入导出文件）")}</p>
            {(["en", "zh"] as const).map((language) => (
              <div key={language} className="space-y-1">
                <textarea aria-label={language === "en" ? "English caption draft" : "Chinese caption draft"} rows={3} value={caption[language]} onChange={(event) => setCaption((current) => ({ ...current, [language]: event.target.value }))} className={areaClass} />
                <Button size="sm" variant="ghost" disabled={!caption[language]} onClick={() => { void navigator.clipboard?.writeText(caption[language]).then(() => setStatus(t("Caption copied.", "图注已复制。")), () => setError(t("The clipboard is not available in this browser.", "此浏览器无法使用剪贴板。"))); }}><ClipboardCopy className="h-3.5 w-3.5" aria-hidden />{language === "en" ? t("Copy English caption", "复制英文图注") : t("Copy Chinese caption", "复制中文图注")}</Button>
              </div>
            ))}
          </div>
          <Button size="sm" variant="primary" disabled={!checked.canApply || result?.applied} onClick={() => { props.onApply(checked.plan); setResult((current) => current && { ...current, applied: true }); setStatus(t("Plan applied. Use Undo to go back.", "已应用方案；可用撤销返回。")); }}>{result?.applied ? t("Applied", "已应用") : t("Apply plan", "应用方案")}</Button>
        </div>
      ) : null}

      <div className="space-y-1.5">
        <p className="text-[11px] font-semibold text-graphite">{t("Publication check", "出版检查")}</p>
        {props.checks.length ? props.checks.map((item) => (
          <p key={item.id} className={item.severity === "warning" ? "rounded-[6px] bg-warning-surface px-2 py-1 text-[11px] leading-4 text-warning" : "rounded-[6px] bg-stone px-2 py-1 text-[11px] leading-4 text-graphite"}>{item.message[locale === "zh" ? "zh" : "en"]}</p>
        )) : <p className="rounded-[6px] bg-sage-surface px-2 py-1 text-[11px] leading-4 text-graphite">{t("No issues found for text size, palette length, legend, or grayscale contrast.", "字号、颜色数量、图例与灰度对比未发现问题。")}</p>}
      </div>
    </section>
  );
}

function ProviderForm({ initial, t, busy, onSave, onTest, onForget }: {
  initial: ProviderSettings | null;
  t: (en: string, zh: string) => string;
  busy: boolean;
  onSave: (settings: ProviderSettings) => void;
  onTest: (settings: ProviderSettings) => void;
  onForget: () => void;
}) {
  const [draft, setDraft] = useState<ProviderSettings>(initial ?? { type: "dify", baseUrl: "", model: "", apiKey: "", remember: false });
  const complete = draft.apiKey.trim() && (draft.baseUrl.trim() || draft.type === "anthropic") && (draft.model.trim() || draft.type === "dify");
  const update = <K extends keyof ProviderSettings>(key: K, value: ProviderSettings[K]) => setDraft((current) => ({ ...current, [key]: value }));
  return (
    <form className="space-y-2 rounded-[8px] border border-hairline bg-stone p-3" onSubmit={(event) => { event.preventDefault(); if (complete) onSave({ ...draft, baseUrl: draft.baseUrl.trim(), model: draft.model.trim(), apiKey: draft.apiKey.trim() }); }} autoComplete="off">
      <label className="block text-[11px] text-graphite">{t("Connection type", "接入方式")}
        <select value={draft.type} onChange={(event) => update("type", event.target.value as ProviderType)} className={`${fieldClass} mt-1`}>
          {providerTypes.map((type) => <option key={type} value={type}>{providerLabels[type]}</option>)}
        </select>
      </label>
      <label className="block text-[11px] text-graphite">{t("Base URL", "服务地址")}
        <input value={draft.baseUrl} onChange={(event) => update("baseUrl", event.target.value)} className={`${fieldClass} mt-1`} placeholder={draft.type === "dify" ? "https://aihub.zju.edu.cn/v1" : draft.type === "anthropic" ? "https://api.anthropic.com/v1" : "https://dashscope.aliyuncs.com/compatible-mode/v1"} />
      </label>
      <label className="block text-[11px] text-graphite">{t("Model", "模型名称")}
        <input value={draft.model} onChange={(event) => update("model", event.target.value)} className={`${fieldClass} mt-1`} placeholder={draft.type === "dify" ? t("Optional for Dify", "Dify 可留空") : "qwen-plus"} />
      </label>
      <label className="block text-[11px] text-graphite">{t("API key", "密钥")}
        <input type="password" autoComplete="new-password" value={draft.apiKey} onChange={(event) => update("apiKey", event.target.value)} className={`${fieldClass} mt-1`} />
      </label>
      <label className="flex items-start gap-2 text-[11px] leading-4 text-graphite">
        <input type="checkbox" checked={draft.remember} onChange={(event) => update("remember", event.target.checked)} className="mt-0.5 h-3.5 w-3.5 accent-[var(--moss)]" />
        <span>{t("Remember on this device (stored in this browser only)", "在此设备记住（仅保存在本浏览器）")}</span>
      </label>
      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant="primary" type="submit" disabled={!complete}>{t("Save", "保存")}</Button>
        <Button size="sm" type="button" disabled={!complete || busy} onClick={() => onTest(draft)}>{busy ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" aria-hidden /> : <PlugZap className="h-3.5 w-3.5" aria-hidden />}{t("Test connection", "测试连接")}</Button>
        {initial ? <Button size="sm" type="button" variant="ghost" onClick={onForget}>{t("Forget", "移除")}</Button> : null}
      </div>
    </form>
  );
}
