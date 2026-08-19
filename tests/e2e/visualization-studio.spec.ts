import { expect, test } from "@playwright/test";
import { readFile } from "node:fs/promises";

test.describe("Visualization Studio browser acceptance", () => {
  test("selects, resets, remaps, adjusts, and exports a representative plot", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-chromium", "Desktop interaction baseline");
    await page.goto("/");

    await page.getByRole("button", { name: /^Raincloud/ }).click();
    await expect(page.getByRole("heading", { name: "Raincloud preview" })).toBeVisible();
    const dataInput = page.getByRole("textbox", { name: "CSV or TSV data" });
    await dataInput.fill("broken\nrow");
    await expect(page.getByText("Check data", { exact: true })).toBeVisible();
    await page.getByRole("button", { name: "Example 1" }).click();
    await expect(page.getByText("Ready", { exact: true })).toBeVisible();
    await page.getByRole("combobox", { name: "Value *" }).selectOption("group");
    await expect(page.getByText("Check data", { exact: true })).toBeVisible();
    await page.getByRole("button", { name: "Auto-map" }).click();
    await expect(page.getByText("Ready", { exact: true })).toBeVisible();

    const width = page.getByRole("textbox", { name: "Width value", exact: true });
    await width.fill("380");
    await width.press("Enter");
    await expect(page.locator("svg[aria-label='Raincloud scientific figure preview']")).toHaveAttribute("width", "380");

    const svgDownload = page.waitForEvent("download");
    await page.getByRole("button", { name: "SVG" }).click();
    const downloadedSvg = await svgDownload;
    expect(downloadedSvg.suggestedFilename()).toMatch(/raincloud.*\.svg$/i);
    const svgPath = await downloadedSvg.path();
    expect(svgPath).not.toBeNull();
    const svgSource = await readFile(svgPath!, "utf8");
    expect(svgSource).toContain('width="380"');
    expect(svgSource).toContain('height="340"');
    expect(svgSource).toContain('font-family="Arial');
    expect(svgSource).toContain('fill="#FFFFFF"');
    expect(svgSource).toContain("Raincloud figure");
    expect(svgSource).toContain("Treatment A");
    expect(svgSource).toMatch(/#[0-9A-F]{6}/i);

    const pngDownload = page.waitForEvent("download");
    await page.getByRole("button", { name: "PNG" }).click();
    const downloadedPng = await pngDownload;
    expect(downloadedPng.suggestedFilename()).toMatch(/raincloud.*600dpi\.png$/i);
    const pngPath = await downloadedPng.path();
    expect(pngPath).not.toBeNull();
    const pngBytes = await readFile(pngPath!);
    expect(pngBytes.subarray(1, 4).toString("ascii")).toBe("PNG");
    expect(pngBytes.readUInt32BE(16)).toBe(Math.round(380 * 600 / 96));
    expect(pngBytes.readUInt32BE(20)).toBe(Math.round(340 * 600 / 96));
    const pngDataUrl = `data:image/png;base64,${pngBytes.toString("base64")}`;
    const rasterEvidence = await page.evaluate(async (source) => {
      const image = new Image();
      image.src = source;
      await image.decode();
      const canvas = document.createElement("canvas");
      canvas.width = image.width;
      canvas.height = image.height;
      const context = canvas.getContext("2d")!;
      context.drawImage(image, 0, 0);
      const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
      const colors = new Set<string>();
      let nonWhite = 0;
      for (let index = 0; index < pixels.length; index += 1600) {
        const color = `${pixels[index]},${pixels[index + 1]},${pixels[index + 2]},${pixels[index + 3]}`;
        colors.add(color);
        if (pixels[index] < 245 || pixels[index + 1] < 245 || pixels[index + 2] < 245) nonWhite += 1;
      }
      return { uniqueColors: colors.size, nonWhite };
    }, pngDataUrl);
    expect(rasterEvidence.uniqueColors).toBeGreaterThan(10);
    expect(rasterEvidence.nonWhite).toBeGreaterThan(50);

    const previewCard = page.getByRole("heading", { name: "Raincloud preview" }).locator("xpath=ancestor::section");
    await expect(previewCard).toHaveScreenshot("raincloud-dense-desktop.png", { animations: "disabled" });

    const yMaximum = page.getByRole("textbox", { name: "Y maximum", exact: true });
    await yMaximum.fill("5");
    await yMaximum.press("Enter");
    await expect(page.getByText(/Manual axis limits clip \d+ mapped values/)).toBeVisible();
    const yMinimum = page.getByRole("textbox", { name: "Y minimum", exact: true });
    await yMinimum.fill("6");
    await yMinimum.press("Enter");
    await expect(yMinimum).toHaveAttribute("aria-invalid", "true");
    await expect(page.getByText("Y minimum must be smaller than Y maximum.", { exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "SVG" })).toBeDisabled();
    await expect(page.getByRole("button", { name: "PNG" })).toBeDisabled();
    await yMinimum.fill("");
    await yMinimum.press("Enter");
    await yMaximum.fill("");
    await yMaximum.press("Enter");

    await page.getByRole("button", { name: /^Scatter/ }).click();
    await page.getByRole("textbox", { name: "CSV or TSV data" }).fill(`x\ty\tgroup\tlabel
1\t2\tBaseline reference cohort\tS1
2\t3\tEarly treatment responder\tS2
3\t2.5\tLate treatment responder\tS3
4\t4\tImmune enriched subgroup\tS4
5\t3.8\tStromal enriched subgroup\tS5
6\t5\tMolecular high-risk subgroup\tS6
7\t4.6\tMolecular low-risk subgroup\tS7
8\t5.5\tIndependent validation cohort\tS8`);
    await page.getByRole("button", { name: "Auto-map" }).click();
    const legendPreview = page.getByRole("heading", { name: "Scatter preview" }).locator("xpath=ancestor::section");
    await expect(legendPreview).toHaveScreenshot("scatter-long-legend-desktop.png", { animations: "disabled" });

    await page.getByRole("textbox", { name: "X minimum", exact: true }).fill("10");
    await page.getByRole("textbox", { name: "X minimum", exact: true }).press("Enter");
    await page.getByRole("textbox", { name: "X maximum", exact: true }).fill("1");
    await page.getByRole("textbox", { name: "X maximum", exact: true }).press("Enter");
    await expect(page.getByText("X minimum must be smaller than X maximum.", { exact: true })).toBeVisible();
    await page.getByRole("button", { name: /^Box/ }).click();
    await expect(page.getByRole("textbox", { name: "X minimum", exact: true })).toHaveCount(0);
    await expect(page.getByText("Ready", { exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "SVG" })).toBeEnabled();
  });

  test("keeps mobile plot and palette selectors compact", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "mobile-chromium", "Mobile layout baseline");
    await page.goto("/");

    const plotSelect = page.getByRole("combobox", { name: "Plot type" });
    await plotSelect.selectOption("correlation-heatmap");
    await expect(page.getByRole("heading", { name: "Correlation heatmap preview" })).toBeVisible();

    const paletteToggle = page.getByRole("button", { name: "柴染棕" }).first();
    await expect(paletteToggle).toHaveAttribute("aria-expanded", "false");
    await paletteToggle.click();
    await expect(paletteToggle).toHaveAttribute("aria-expanded", "true");

    const previewCard = page.getByRole("heading", { name: "Correlation heatmap preview" }).locator("xpath=ancestor::section");
    await expect(previewCard).toHaveScreenshot("correlation-heatmap-mobile.png", { animations: "disabled" });
  });

  test("switches categorical variants and computes long-form uncertainty", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-chromium", "Desktop categorical-family baseline");
    await page.goto("/");
    const variant = page.getByRole("combobox", { name: "Variant" });
    const svg = page.locator("svg[aria-label='Bar scientific figure preview']");
    for (const value of ["stacked", "percentage", "horizontal", "bidirectional", "faceted", "polar", "bullet", "pyramid", "axis-break", "dual-axis", "overlay"]) {
      await variant.selectOption(value);
      await expect(page.getByText("Ready", { exact: true })).toBeVisible();
      await expect(svg.locator("[data-plot-element='bar']").first()).toBeVisible();
      await expect(page.getByRole("combobox", { name: "Secondary value" })).toHaveCount(["dual-axis", "overlay"].includes(value) ? 1 : 0);
      await expect(page.getByRole("combobox", { name: "Target value" })).toHaveCount(value === "bullet" ? 1 : 0);
      await expect(page.getByRole("combobox", { name: "Facet" })).toHaveCount(value === "faceted" ? 1 : 0);
      await expect(page.getByRole("combobox", { name: "Error representation" })).toHaveCount(["stacked", "percentage", "polar"].includes(value) ? 0 : 1);
    }

    await variant.selectOption("grouped");
    await page.getByRole("button", { name: "Example 2" }).click();
    await expect(page.getByRole("combobox", { name: "Input structure" })).toHaveValue("long");
    await page.getByRole("combobox", { name: "Error representation" }).selectOption("sem");
    await expect(svg.locator("[data-plot-element='error-bar']")).toHaveCount(4);

    await page.getByRole("button", { name: "Example 1" }).click();
    await variant.selectOption("dual-axis");
    await expect(page.getByRole("textbox", { name: "Secondary axis label" })).toHaveValue("Secondary value");
    const previewCard = page.getByRole("heading", { name: "Bar preview" }).locator("xpath=ancestor::section");
    await expect(previewCard).toHaveScreenshot("bar-dual-axis-desktop.png", { animations: "disabled" });

    await variant.selectOption("bidirectional");
    await page.getByRole("combobox", { name: "Error representation" }).selectOption("none");
    for (const values of [[2, 5, 8], [-2, -5, -8], [-4, 1, 7]]) {
      await page.getByRole("textbox", { name: "CSV or TSV data" }).fill(`category\tvalue\tgroup\nA\t${values[0]}\tG1\nB\t${values[1]}\tG2\nC\t${values[2]}\tG3`);
      await page.getByRole("button", { name: "Auto-map" }).click();
      await expect(page.getByText("Ready", { exact: true })).toBeVisible();
      const downloadEvent = page.waitForEvent("download");
      await page.getByRole("button", { name: "SVG" }).click();
      const download = await downloadEvent; const path = await download.path();
      expect(path).not.toBeNull();
      const source = await readFile(path!, "utf8");
      expect(source.match(/data-plot-element="bar"/g)).toHaveLength(3);
      if (values.some((value) => value < 0)) expect(source).toMatch(/data-value="-/);
      expect(source).not.toMatch(/(?:NaN|Infinity|-Infinity|undefined)/);
    }
  });

  test("renders composition and profile families responsively and exports finite SVG", async ({ page }, testInfo) => {
    await page.goto("/");
    const plotSelect = page.getByRole("combobox", { name: "Plot type" });
    const newPlots = ["pie", "donut", "rose", "waffle", "treemap", "sunburst", "radar", "polar-profile", "population-pyramid"];

    if (testInfo.project.name === "desktop-chromium") {
      for (const plotType of newPlots) {
        await page.getByRole("button", { name: new RegExp(`^${plotType === "polar-profile" ? "Polar profile" : plotType === "population-pyramid" ? "Population pyramid" : plotType[0].toUpperCase() + plotType.slice(1)}`) }).click();
        await expect(page.getByText("Ready", { exact: true })).toBeVisible();
        const svg = page.locator(`svg[data-plot-renderer='advanced'][aria-label$='scientific figure preview']`);
        await expect(svg.locator("[data-plot-data]")).toHaveCount(1);
        const clippedLabels = await svg.evaluate((element) => {
          const canvas = element.getBoundingClientRect();
          return [...element.querySelectorAll("text")].flatMap((label) => {
            const box = label.getBoundingClientRect();
            const inside = box.left >= canvas.left - 1 && box.top >= canvas.top - 1 && box.right <= canvas.right + 1 && box.bottom <= canvas.bottom + 1;
            return inside ? [] : [{ text: label.textContent, left: box.left - canvas.left, top: box.top - canvas.top, right: box.right - canvas.left, bottom: box.bottom - canvas.top }];
          });
        });
        expect(clippedLabels, `${plotType} labels should remain inside the export canvas`).toEqual([]);
      }
      await expect(page.getByRole("combobox", { name: "Display values" })).toBeVisible();
      await page.getByRole("combobox", { name: "Display values" }).selectOption("percent");
      await expect(page.locator("svg[aria-label='Population pyramid scientific figure preview']")).toContainText("%");

      await page.getByRole("button", { name: /^Rose/ }).click();
      await page.getByRole("button", { name: "Reset" }).click();
      const roseConfigEvent = page.waitForEvent("download");
      await page.getByRole("button", { name: "Config" }).click();
      const roseConfigPath = await (await roseConfigEvent).path();
      expect(roseConfigPath).not.toBeNull();
      const roseConfig = JSON.parse(await readFile(roseConfigPath!, "utf8"));
      expect(roseConfig.settings.compositionLabelMode).toBe("value");

      await page.getByRole("button", { name: /^Pie/ }).click();
      await expect(page.getByRole("textbox", { name: "X-axis label" })).toHaveCount(0);
      await expect(page.getByRole("combobox", { name: "Grid" })).toHaveCount(0);
      const compositionInput = page.getByRole("textbox", { name: "CSV or TSV data" });
      await compositionInput.fill(`category\tvalue\n${Array.from({ length: 13 }, (_, index) => `Part ${index + 1}\t${index + 1}`).join("\n")}`);
      await page.getByRole("button", { name: "Auto-map" }).click();
      await expect(page.getByText(/limited to 12 categories/)).toBeVisible();
      await expect(page.getByRole("button", { name: "SVG" })).toBeDisabled();
      await compositionInput.fill(`category\tvalue\n${Array.from({ length: 12 }, (_, index) => `Part ${index + 1}\t${index + 1}`).join("\n")}`);
      await page.getByRole("button", { name: "Auto-map" }).click();
      await expect(page.getByText("Ready", { exact: true })).toBeVisible();
      await page.getByRole("combobox", { name: "Legend" }).selectOption("bottom");
      const pieSvg = page.locator("svg[aria-label='Pie scientific figure preview']");
      const clippedPieLabels = await pieSvg.evaluate((element) => {
        const canvas = element.getBoundingClientRect();
        return [...element.querySelectorAll("text")].filter((label) => {
          const box = label.getBoundingClientRect();
          return box.left < canvas.left - 1 || box.top < canvas.top - 1 || box.right > canvas.right + 1 || box.bottom > canvas.bottom + 1;
        }).map((label) => label.textContent);
      });
      expect(clippedPieLabels).toEqual([]);

      await page.getByRole("button", { name: /^Sunburst/ }).click();
      await page.getByRole("combobox", { name: "Legend" }).selectOption("right");
      const previewCard = page.getByRole("heading", { name: "Sunburst preview" }).locator("xpath=ancestor::section");
      await expect(previewCard).toHaveScreenshot("sunburst-hierarchy-desktop.png", { animations: "disabled", maxDiffPixels: 100 });
    } else {
      await plotSelect.selectOption("radar");
      await expect(page.getByRole("heading", { name: "Radar preview" })).toBeVisible();
      const svgBox = await page.locator("svg[aria-label='Radar scientific figure preview']").boundingBox();
      expect(svgBox).not.toBeNull();
      expect(svgBox!.width).toBeLessThanOrEqual(340);
      const previewCard = page.getByRole("heading", { name: "Radar preview" }).locator("xpath=ancestor::section");
      await expect(previewCard).toHaveScreenshot("radar-profile-mobile.png", { animations: "disabled" });
      await plotSelect.selectOption("sunburst");
    }

    const downloadEvent = page.waitForEvent("download");
    await page.getByRole("button", { name: "SVG" }).click();
    const download = await downloadEvent;
    const path = await download.path();
    expect(path).not.toBeNull();
    const source = await readFile(path!, "utf8");
    expect(source).toContain('data-plot-renderer="advanced"');
    expect(source).toContain('data-plot-family="sunburst"');
    expect(source).not.toMatch(/(?:NaN|Infinity|-Infinity|undefined)/);
  });
});
