import {test,expect} from '@playwright/test';
import {readFile} from 'node:fs/promises';
const text='Line\tgroup\tReady\n001\tcontrol\t2\n002\ttreated\t3';
test('retains data through language, plot switching, project export and fresh-session restore',async({page,context},info)=>{
 const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));
 await page.goto('/');
 await page.getByRole('textbox',{name:'CSV or TSV data',exact:true}).fill(text);
 await page.getByRole('textbox',{name:'Project name',exact:true}).fill('P0 synthetic recovery');
 await page.getByRole('combobox',{name:'Interface language'}).selectOption('zh');
 await expect(page.getByRole('textbox',{name:'CSV or TSV data',exact:true})).toHaveValue(text);
 await page.getByRole('combobox',{name:'Interface language'}).selectOption('en');
 // Use the visible catalogue: mobile select / desktop list.
 if(info.project.name.startsWith('mobile'))await page.getByRole('combobox',{name:'Plot type',exact:true}).selectOption('line');
 else await page.locator('[data-visualization-panel="plots"]').getByRole('button',{name:/^Line /}).click();
 await expect(page.getByRole('textbox',{name:'CSV or TSV data',exact:true})).toHaveValue(text);
 await page.getByRole('button',{name:'Save project',exact:true}).click();
 await expect(page.getByRole('status')).toContainText('Saved locally');
 const pending=page.waitForEvent('download');await page.getByRole('button',{name:'Export project',exact:true}).click();
 const download=await pending,source=await readFile((await download.path())!,'utf8');
 const project=JSON.parse(source);expect(project.datasets.some((data:{raw:string})=>data.raw===text)).toBe(true);
 await download.saveAs(info.outputPath('synthetic.studio-project.json'));
 await page.reload();await expect(page.getByRole('textbox',{name:'Project name',exact:true})).toHaveValue('P0 synthetic recovery');
 await expect(page.getByRole('textbox',{name:'CSV or TSV data',exact:true})).toHaveValue(text);
 const newPage=await context.newPage();await page.close();await newPage.goto('/');
 await expect(newPage.getByRole('textbox',{name:'Project name',exact:true})).toHaveValue('P0 synthetic recovery');
 await newPage.getByLabel('Project file',{exact:true}).setInputFiles({name:'bad.json',mimeType:'application/json',buffer:Buffer.from('{"schemaVersion":999}')});
 await expect(newPage.getByRole('textbox',{name:'CSV or TSV data',exact:true})).toHaveValue(text);
 expect(await newPage.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
 await newPage.screenshot({path:info.outputPath('project-recovery.png'),fullPage:true});expect(errors).toEqual([]);
});
test('failed persistence offers export without claiming successful save',async({page})=>{
 await page.addInitScript(()=>Object.defineProperty(window,'indexedDB',{value:{open(){throw new Error('Synthetic storage denial');}}}));
 await page.goto('/');await page.getByRole('button',{name:'Save project',exact:true}).click();
 await expect(page.getByRole('status')).toContainText('Save failed');
 const pending=page.waitForEvent('download');await page.getByRole('button',{name:'Export project',exact:true}).click();
 expect(JSON.parse(await readFile((await (await pending).path())!,'utf8')).format).toBe('visualization-studio-project');
});
test('declared ID and numeric preflight blocks malformed data without replacing text',async({page})=>{
 await page.goto('/');
 await page.getByRole('textbox',{name:'CSV or TSV data',exact:true}).fill('id\tvalue\n001\tx\n001\t2');
 await page.getByText('Field semantics and units',{exact:true}).click();
 await page.getByRole('combobox',{name:'id field type',exact:true}).selectOption('id');
 await page.getByRole('combobox',{name:'value field type',exact:true}).selectOption('number');
 await expect(page.getByRole('button',{name:'SVG',exact:true})).toBeDisabled();
 await page.locator('summary').filter({hasText:'Input check'}).click();
 await expect(page.getByText('Blank or duplicate identifier.',{exact:false})).toBeVisible();
 await expect(page.getByText('Non-numeric value; it will not be converted to zero.',{exact:false})).toBeVisible();
});

for(const entry of ['enrichment','enrichment-bar'] as const) test(`from ${entry}: reuses a full enrichment result across two figures and warns after source edits`,async({page},info)=>{
 await page.goto('/');page.on('dialog',dialog=>dialog.accept());
 if(info.project.name.startsWith('mobile'))await page.getByRole('combobox',{name:'Plot type',exact:true}).selectOption(entry);
 else await page.locator('[data-visualization-panel="plots"]').getByRole('button',{name:entry==='enrichment'?/^Enrichment dot /:/^Enrichment bar /}).click();
 await page.getByRole('button',{name:'Example 1'}).click();
 await page.getByText('Reuse external enrichment result',{exact:true}).click();
 await page.getByRole('button',{name:'Create dot + bar',exact:true}).click();
 const exportProject=async()=>{const event=page.waitForEvent('download');await page.getByRole('button',{name:'Export project',exact:true}).click();return JSON.parse(await readFile((await(await event).path())!,'utf8'));};
 const before=await exportProject();expect(before.analysisResults).toHaveLength(1);expect(before.figures.slice(-2).map((figure:{analysisResultId:string})=>figure.analysisResultId)).toEqual([before.analysisResults[0].id,before.analysisResults[0].id]);
 await page.getByRole('textbox',{name:'Top N (0 = all) value',exact:true}).fill('2');await page.getByRole('textbox',{name:'Top N (0 = all) value',exact:true}).press('Enter');
 const after=await exportProject();expect(after.analysisResults).toEqual(before.analysisResults);
 await page.getByRole('button',{name:'Enrichment bar / 富集柱图',exact:true}).click();
 await expect(page.getByText('Ready',{exact:true})).toBeVisible();
 const input=page.getByRole('textbox',{name:'CSV or TSV data',exact:true});await input.fill((await input.inputValue()).replace('Cell cycle','Edited term'));
 await expect(page.getByText('Source changed: recalculate or import an updated result. This figure no longer represents the saved analysis.',{exact:true})).toBeVisible();
 expect((await exportProject()).analysisResults).toEqual(before.analysisResults);
});

import {getPlotModule,defaultVisualizationSettings,defaultVisualizationThemeId} from '../../src/lib/visualization-studio';
import {defaultPcaOptions} from '../../src/lib/visualization-pca';
for(const [plotType,index] of [['bar',3],['bar',4],['pca',0],['heatmap',0],['venn',0],['upset',0],['enrichment',0]] as const){
 test(`roundtrips legacy ${plotType} example ${index+1} through a new browser context`,async({page,browser},info)=>{
  const plot=getPlotModule(plotType),example=plot.examples[index];
  const legacy={plotType,data:example.data,mapping:example.mapping??plot.definition.defaultMapping,settings:{...defaultVisualizationSettings,...example.settings},themeId:defaultVisualizationThemeId,pca:{inputMode:example.pcaInputMode??(plotType==='pca'?'matrix':'scores'),options:defaultPcaOptions,observationMetadata:example.metadata??''}};
  await page.goto('/');page.on('dialog',dialog=>dialog.accept());
  await page.getByLabel('Project file',{exact:true}).setInputFiles({name:'legacy.labnest-figure.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(legacy))});
  await expect(page.getByRole('button',{name:'SVG',exact:true})).toBeEnabled();
  const svg=page.locator('svg[aria-label$="scientific figure preview"]');
  const original=await svg.evaluate(element=>({text:[...element.querySelectorAll('text')].map(node=>node.textContent),marks:element.querySelectorAll('[data-plot-element]').length,width:element.getAttribute('width'),height:element.getAttribute('height')}));
  const event=page.waitForEvent('download');await page.getByRole('button',{name:'Export project',exact:true}).click();const download=await event;const project=await readFile((await download.path())!);
  const isolated=await browser.newContext({viewport:info.project.use.viewport});const reopened=await isolated.newPage();reopened.on('dialog',dialog=>dialog.accept());await reopened.goto('http://127.0.0.1:33117/');
  await reopened.getByLabel('Project file',{exact:true}).setInputFiles({name:'reopen.studio-project.json',mimeType:'application/json',buffer:project});
  const restored=reopened.locator('svg[aria-label$="scientific figure preview"]');await expect(restored).toBeVisible();
  expect(await restored.evaluate(element=>({text:[...element.querySelectorAll('text')].map(node=>node.textContent),marks:element.querySelectorAll('[data-plot-element]').length,width:element.getAttribute('width'),height:element.getAttribute('height')}))).toEqual(original);
  const svgEvent=reopened.waitForEvent('download');await reopened.getByRole('button',{name:'SVG',exact:true}).click();const output=await svgEvent;await output.saveAs(info.outputPath(`${plotType}-${index}.svg`));const source=await readFile((await output.path())!,'utf8');expect(source).not.toMatch(/NaN|Infinity/);
  await restored.screenshot({path:info.outputPath('restored-chart.png')});await isolated.close();
 });
}
test('imports both heatmap annotation axes by exact ID and retains them in a project',async({page},info)=>{
 await page.goto('/');page.on('dialog',dialog=>dialog.accept());
 const legacy={plotType:'heatmap',data:'gene\tSampleA\tSampleB\n001\t1\t2\n 001\t3\t5',settings:{...defaultVisualizationSettings,width:600,height:480,heatmapScale:'none'},themeId:defaultVisualizationThemeId};
 await page.getByLabel('Project file',{exact:true}).setInputFiles({name:'heatmap.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(legacy))});
 const row='id\tpathway[categorical]\n 001\tB\n001\tA',column='id\tbatch[categorical]\nSampleB\tBatch2\nSampleA\tBatch1';
 await page.getByLabel('row annotation file',{exact:true}).setInputFiles({name:'row.tsv',mimeType:'text/tab-separated-values',buffer:Buffer.from(row)});
 await page.getByLabel('column annotation file',{exact:true}).setInputFiles({name:'column.tsv',mimeType:'text/tab-separated-values',buffer:Buffer.from(column)});
 const svg=page.locator('svg[aria-label$="scientific figure preview"]');await expect(svg.locator('[data-annotation-target="row"]')).toHaveCount(2);await expect(svg.locator('[data-annotation-target="column"]')).toHaveCount(2);
 expect(await svg.locator('[data-annotation-target="row"] title').allTextContents()).toEqual(['pathway · 001: A','pathway ·  001: B']);
 const event=page.waitForEvent('download');await page.getByRole('button',{name:'Export project',exact:true}).click();const project=JSON.parse(await readFile((await(await event).path())!,'utf8'));
 expect(project.figures[0].settings.heatmapRowAnnotationData).toBe(row);expect(project.figures[0].settings.heatmapColumnAnnotationData).toBe(column);
 await svg.screenshot({path:info.outputPath('exact-id-two-axis-heatmap.png')});
});

test('retains edits made while a project file is being read',async({page})=>{
 await page.goto('/');await page.getByRole('button',{name:'Save project',exact:true}).click();await expect(page.getByRole('status')).toContainText('Saved locally');
 await page.evaluate(()=>{const original=File.prototype.text;File.prototype.text=function(){return new Promise(resolve=>{Object.assign(window,{releaseImport:()=>original.call(this).then(resolve)});});};});
 const legacy={plotType:'bar',data:'category\tvalue\nold\t1'};
 await page.getByLabel('Project file',{exact:true}).setInputFiles({name:'delayed.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(legacy))});
 await page.getByRole('textbox',{name:'Project name',exact:true}).fill('New edit during import');
 const dialog=page.waitForEvent('dialog');await page.evaluate(()=>{(window as unknown as {releaseImport:()=>void}).releaseImport();});
 await (await dialog).dismiss();await expect(page.getByRole('textbox',{name:'Project name',exact:true})).toHaveValue('New edit during import');
});
test('keeps the editor recoverable when an active transformation preview receives oversized input',async({page})=>{
 const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));await page.goto('/');
 await page.getByRole('textbox',{name:'CSV or TSV data',exact:true}).fill('id\tA\tB\n001\t1\t2');
 await page.getByText('Prepare data',{exact:true}).click();
 await page.getByLabel('ID / fixed fields',{exact:false}).fill('id');await page.getByLabel('Variable fields',{exact:false}).fill('A,B');
 await page.getByRole('button',{name:'Preview',exact:true}).click();await expect(page.getByRole('button',{name:'Apply prepared table',exact:true})).toBeVisible();
 await page.getByRole('textbox',{name:'CSV or TSV data',exact:true}).fill(Array.from({length:1003},(_,i)=>`c${i}`).join('\t')+'\n1');
 await expect(page.getByRole('button',{name:'SVG',exact:true})).toBeDisabled();await expect(page.getByRole('textbox',{name:'Project name',exact:true})).toBeVisible();
 await page.getByRole('textbox',{name:'CSV or TSV data',exact:true}).fill('id\tA\n001\t1');expect(errors).toEqual([]);
});

test('prepares a derived table with undo redo and restores a favorite preset',async({page},info)=>{
 await page.goto('/');const raw='id\tA\tB\n001\t1\t2\n002\t3\t4',input=page.getByRole('textbox',{name:'CSV or TSV data',exact:true});await input.fill(raw);
 await page.getByText('Prepare data',{exact:true}).click();await page.getByLabel('ID / fixed fields',{exact:false}).fill('id');await page.getByLabel('Variable fields',{exact:false}).fill('A,B');
 await page.getByRole('button',{name:'Preview',exact:true}).click();await page.getByRole('button',{name:'Apply prepared table',exact:true}).click();
 const derived=await input.inputValue();expect(derived).toBe('id\tvariable\tvalue\n001\tA\t1\n001\tB\t2\n002\tA\t3\n002\tB\t4');
 await page.getByRole('button',{name:'Undo',exact:true}).click();await expect(input).toHaveValue(raw);await page.getByRole('button',{name:'Redo',exact:true}).click();await expect(input).toHaveValue(derived);
 await page.getByText('Scenarios, favorites & recent',{exact:true}).click();await page.getByRole('button',{name:'Trend / 趋势 折线',exact:true}).click();await expect(input).toHaveValue(derived);
 await page.getByRole('button',{name:'Favorite / 收藏当前图',exact:true}).click();await page.getByRole('button',{name:'Save project',exact:true}).click();await expect(page.getByRole('status')).toContainText('Saved locally');
 await page.reload();await expect(input).toHaveValue(derived);await page.getByText('Scenarios, favorites & recent',{exact:true}).click();await expect(page.getByRole('button',{name:'Trend',exact:true})).toHaveCount(2);await page.getByRole('button',{name:'Trend',exact:true}).first().click();await expect(page.getByRole('button',{name:'Unfavorite / 取消收藏',exact:true})).toBeVisible();
 await page.getByRole('combobox',{name:'Interface language'}).selectOption('zh');await page.screenshot({path:info.outputPath('chinese-preparation.png'),fullPage:true});
});
