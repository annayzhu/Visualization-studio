import {isCustomPalette, type CustomPalette} from './studio-palettes';
import { figureFontPresets, defaultVisualizationSettings, defaultVisualizationThemeId, getPlotModule, journalThemes, plotModuleRegistry, type PlotType, type VisualizationSettings, type JournalThemeId } from './visualization-studio';
import { defaultPcaOptions, type PcaOptions } from './visualization-pca';
import { importLimits, inspectTable, transformTable, tableText, type Transform } from './studio-data';
export type StudioDataset = {id:string; name:string; raw:string; checksum:string; fields:Record<string,{kind:'text'|'number'|'id';unit:string|null}>; parentId?:string; transform?:Transform};
export type AnalysisResult = {schemaVersion:1;id:string;kind:'enrichment'|'differential-expression'|'statistics'|'pca'|'sets';source:'user-provided'|'studio-local'|'r-service';datasetId:string;inputChecksum:string;parameters:Record<string,unknown>;data:unknown;metadata:{method:string|null;softwareVersion:string|null;databaseVersion:string|null;[key:string]:unknown};createdAt:string};
export type StudioFigure = {id:string;name:string;plotType:PlotType;datasetId:string;analysisResultId?:string;mapping:Record<string,string>;settings:VisualizationSettings;themeId:JournalThemeId;pca:{inputMode:'scores'|'matrix';options:PcaOptions;observationMetadata:string};display?:{topN:number;sortField:string;thresholdField:string;threshold:number|null}};
export type StudioProject = {format:'visualization-studio-project';schemaVersion:1;id:string;name:string;createdAt:string;updatedAt:string;datasets:StudioDataset[];analysisResults:AnalysisResult[];figures:StudioFigure[];activeFigureId:string;palettes:CustomPalette[];history:{datasetIds:string[];cursor:number}};
export function newId(prefix:string) { return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,10)}`; }
/** FNV-1a over UTF-16 is a deterministic change detector, not a security hash. */
export function checksum(text:string) { let value=2166136261; for(let i=0;i<text.length;i++) value=Math.imul(value^text.charCodeAt(i),16777619); return `fnv1a-utf16:${(value>>>0).toString(16).padStart(8,'0')}`; }
export function makeDataset(raw:string,name='Data'):StudioDataset { return {id:newId('data'),name,raw,checksum:checksum(raw),fields:{}}; }
export function createProject():StudioProject {
 const dataset=makeDataset(getPlotModule('bar').examples[0].data), time=new Date().toISOString();
 const figure:StudioFigure={id:newId('figure'),name:'Bar',plotType:'bar',datasetId:dataset.id,mapping:{...getPlotModule('bar').definition.defaultMapping},settings:{...defaultVisualizationSettings},themeId:defaultVisualizationThemeId,pca:{inputMode:'scores',options:{...defaultPcaOptions},observationMetadata:''}};
 return {format:'visualization-studio-project',schemaVersion:1,id:newId('project'),name:'Untitled project',createdAt:time,updatedAt:time,datasets:[dataset],analysisResults:[],figures:[figure],activeFigureId:figure.id,palettes:[],history:{datasetIds:[dataset.id],cursor:0}};
}
export function updateFigure(project:StudioProject,figure:StudioFigure):StudioProject {return {...project,updatedAt:new Date().toISOString(),figures:project.figures.map(item=>item.id===figure.id?figure:item)};}
export function analysisIsStale(project:StudioProject,result:AnalysisResult,parameters=result.parameters) { const dataset=project.datasets.find(item=>item.id===result.datasetId); return !dataset || checksum(dataset.raw)!==result.inputChecksum || JSON.stringify(parameters)!==JSON.stringify(result.parameters); }
function object(value:unknown):value is Record<string,unknown> {return Boolean(value && typeof value==='object' && !Array.isArray(value));}
function assert(condition:unknown,message:string):asserts condition {if(!condition) throw new Error(message);}
// Keep import validation aligned with the finite UI choices; never guess an analytical mode.
const settingChoices: Partial<Record<keyof VisualizationSettings, readonly string[]>> = {
  "grid": [
    "none",
    "y",
    "both"
  ],
  "legendPosition": [
    "right",
    "bottom",
    "none"
  ],
  "boxErrorType": [
    "none",
    "sd",
    "sem",
    "ci95"
  ],
  "distributionSummary": [
    "none",
    "median",
    "mean"
  ],
  "distributionOrientation": [
    "vertical",
    "horizontal"
  ],
  "barErrorType": [
    "none",
    "sd",
    "sem"
  ],
  "barVariant": [
    "grouped",
    "stacked",
    "percentage",
    "horizontal",
    "bidirectional",
    "faceted",
    "polar",
    "bullet",
    "pyramid",
    "axis-break",
    "dual-axis",
    "overlay"
  ],
  "barInputMode": [
    "summary",
    "long"
  ],
  "barAnalysisMode": [
    "none",
    "supplied",
    "raw-independent",
    "summary-independent",
    "raw-paired",
    "qpcr-delta-ct"
  ],
  "barPAdjustment": [
    "none",
    "holm",
    "bh"
  ],
  "barOverlayType": [
    "line",
    "points"
  ],
  "lineErrorType": [
    "none",
    "sd",
    "sem",
    "ci95"
  ],
  "lineUncertaintyStyle": [
    "bars",
    "band"
  ],
  "linePAdjustment": [
    "none",
    "bh"
  ],
  "associationVariant": [
    "points",
    "marginal",
    "density",
    "hexbin",
    "ellipse",
    "hull",
    "pair-matrix",
    "3d",
    "ternary"
  ],
  "associationFit": [
    "none",
    "linear",
    "polynomial",
    "loess"
  ],
  "associationGroupMode": [
    "combined",
    "by-group"
  ],
  "heatmapScale": [
    "row",
    "column",
    "none"
  ],
  "heatmapColorMode": [
    "diverging",
    "sequential"
  ],
  "heatmapDisplay": [
    "rectangular",
    "circular"
  ],
  "heatmapTriangle": [
    "full",
    "lower",
    "upper"
  ],
  "heatmapDistance": [
    "euclidean",
    "correlation"
  ],
  "heatmapLinkage": [
    "average",
    "complete",
    "single"
  ],
  "heatmapSidePlotStatistic": [
    "mean",
    "sd",
    "range"
  ],
  "heatmapLabelDensity": [
    "auto",
    "all",
    "none"
  ],
  "ordinationView": [
    "scores",
    "scree",
    "3d"
  ],
  "motifDisplayMode": [
    "information",
    "probability"
  ],
  "networkLayout": [
    "circular",
    "layered",
    "radial"
  ],
  "treeOrientation": [
    "vertical",
    "horizontal"
  ],
  "setInputMode": [
    "auto",
    "membership",
    "peak-overlap"
  ],
  "rocInputMode": [
    "raw",
    "precomputed-time"
  ],
  "vennLayout": [
    "auto",
    "classic",
    "radial"
  ],
  "correlationMethod": [
    "pearson",
    "spearman"
  ],
  "compositionLabelMode": [
    "percent",
    "value",
    "both",
    "none"
  ],
  "pyramidDisplayMode": [
    "value",
    "percent"
  ]
};
function validSettings(value:unknown):asserts value is VisualizationSettings {
 assert(object(value),'Figure settings are missing.');
 for(const [key,defaultValue] of Object.entries(defaultVisualizationSettings)) {
  const supplied=value[key];
  assert(supplied!==undefined && (Array.isArray(defaultValue)? Array.isArray(supplied) && supplied.every(item=>typeof item==='string') : defaultValue===null ? supplied===null || typeof supplied==='number' : typeof supplied===typeof defaultValue),`Invalid setting: ${key}`);
  if(typeof supplied==='number') assert(Number.isFinite(supplied),`Non-finite setting: ${key}`);
 }
 for(const [key,choices] of Object.entries(settingChoices)) assert(choices.includes(String(value[key])),`Unknown setting: ${key}`);
 assert(Object.hasOwn(figureFontPresets,String(value.fontFamily)),'Unknown setting: fontFamily');
 assert([2,3].includes(Number(value.associationPolynomialDegree)),'Unknown setting: associationPolynomialDegree');
 assert(Number(value.width)>0 && Number(value.height)>0 && Number(value.width)<=10000 && Number(value.height)<=10000,'Figure dimensions must be 1–10000 pixels.');
}
export function validateProject(value:unknown):asserts value is StudioProject {
 assert(new TextEncoder().encode(JSON.stringify(value,null,2)).byteLength<=importLimits.bytes*4,'Project exceeds 80 MiB. Keep the workspace open and export individual data/Config files.');
 assert(object(value) && value.format==='visualization-studio-project' && value.schemaVersion===1,'Unsupported project format/version. Current workspace has not changed.');
 assert(typeof value.id==='string' && typeof value.name==='string' && typeof value.createdAt==='string' && typeof value.updatedAt==='string','Invalid project identity.');
 assert(Array.isArray(value.datasets) && value.datasets.length>0 && Array.isArray(value.figures) && value.figures.length>0 && Array.isArray(value.analysisResults) && Array.isArray(value.palettes),'Project collections are missing.');
 assert(value.palettes.every(isCustomPalette),'Invalid project palette.');
 const ids=new Set<string>();
 for(const dataset of value.datasets) {
  assert(object(dataset) && typeof dataset.id==='string' && typeof dataset.name==='string' && typeof dataset.raw==='string' && object(dataset.fields),'Invalid dataset.');
  assert(!ids.has(dataset.id),'Duplicate dataset ID.'); ids.add(dataset.id);
  assert(dataset.checksum===checksum(dataset.raw),'Dataset checksum mismatch.');
  inspectTable(dataset.raw); // Invalid unfinished tables may still be saved.
  for(const field of Object.values(dataset.fields))assert(object(field)&&['text','number','id'].includes(String(field.kind))&&(field.unit===null||typeof field.unit==='string'),'Invalid field semantics.');
 }
 for(const dataset of value.datasets) if(dataset.parentId) {
  assert(ids.has(dataset.parentId) && dataset.parentId!==dataset.id && object(dataset.transform),'Invalid derived-data source.');
  const visited=new Set([dataset.id]);let cursor=dataset;
  while(cursor.parentId){assert(!visited.has(cursor.parentId),'Cyclic dataset ancestry.');visited.add(cursor.parentId);cursor=value.datasets.find(item=>item.id===cursor.parentId);assert(cursor,'Missing parent dataset.');}
  const parent=value.datasets.find(item=>item.id===dataset.parentId);
  assert(tableText(transformTable(inspectTable(parent.raw).table,dataset.transform as Transform))===dataset.raw,'Derived data does not match its replayed preparation steps.');
 }
 const resultIds=new Set<string>();
 for(const result of value.analysisResults) {
  assert(object(result) && typeof result.id==='string' && !resultIds.has(result.id) && result.schemaVersion===1 && typeof result.datasetId==='string' && ids.has(result.datasetId),'Invalid analysis reference.');
  assert(['user-provided','studio-local','r-service'].includes(String(result.source)) && ['enrichment','differential-expression','statistics','pca','sets'].includes(String(result.kind)) && object(result.parameters) && object(result.metadata) && typeof result.inputChecksum==='string','Invalid analysis contract.'); resultIds.add(result.id);
 }
 const figures=new Set<string>(), moduleIds=new Set(plotModuleRegistry.list().map(module=>module.definition.id));
 for(const figure of value.figures) {
  assert(object(figure) && typeof figure.id==='string' && typeof figure.name==='string' && !figures.has(figure.id) && moduleIds.has(figure.plotType as PlotType) && typeof figure.datasetId==='string' && ids.has(figure.datasetId),'Invalid figure or dataset reference.'); figures.add(figure.id);
  assert(typeof figure.themeId==='string' && Object.hasOwn(journalThemes,figure.themeId),'Unknown palette ID.');
  assert(object(figure.mapping) && Object.values(figure.mapping).every(v=>typeof v==='string'),'Invalid field mapping.'); validSettings(figure.settings);
  assert(object(figure.pca) && ['scores','matrix'].includes(String(figure.pca.inputMode)) && object(figure.pca.options) && typeof figure.pca.observationMetadata==='string','Invalid PCA configuration.');
  const pcaOptions=figure.pca.options;
  assert(['auto','counts','abundance','normalized'].includes(String(pcaOptions.dataLayer)) && typeof pcaOptions.scaleFeatures==='boolean' && Number.isInteger(pcaOptions.topVariableFeatures) && Number(pcaOptions.topVariableFeatures)>=0 && Number(pcaOptions.topVariableFeatures)<=1000000,'Invalid PCA layer, feature limit or scaling option.');
  if(figure.display) assert(object(figure.display) && Number.isInteger(figure.display.topN) && Number(figure.display.topN)>=0 && Number(figure.display.topN)<=100000 && typeof figure.display.sortField==='string' && typeof figure.display.thresholdField==='string' && (figure.display.threshold===null || (typeof figure.display.threshold==='number' && Number.isFinite(figure.display.threshold))),'Invalid display filter.');
  if(figure.analysisResultId) assert(typeof figure.analysisResultId==='string' && resultIds.has(figure.analysisResultId),'Missing analysis result.');
 }
 assert(typeof value.activeFigureId==='string' && figures.has(value.activeFigureId),'Active figure is missing.');
 assert(object(value.history) && Array.isArray(value.history.datasetIds) && value.history.datasetIds.every(id=>ids.has(String(id))) && Number.isInteger(value.history.cursor) && Number(value.history.cursor)>=0 && Number(value.history.cursor)<value.history.datasetIds.length,'Invalid preparation history.');
}
export function encodeProject(project:StudioProject) { validateProject(project); return JSON.stringify(project,null,2); }
export function decodeProject(text:string):{project:StudioProject;warnings:string[]} {
 if(new TextEncoder().encode(text).byteLength>importLimits.bytes*4) throw new Error('Project exceeds 80 MiB. Current workspace has not changed.');
 const value:unknown=JSON.parse(text,(key,value)=>{ if(['__proto__','constructor','prototype'].includes(key)) throw new Error('Unsafe property in project file.'); return value; });
 if(object(value) && value.format==='visualization-studio-project') {validateProject(value);return {project:value,warnings:[]};}
 assert(object(value) && (value.schemaVersion===undefined || value.schemaVersion===1) && typeof value.plotType==='string' && typeof value.data==='string','Unrecognized legacy Config.');
 assert(plotModuleRegistry.list().some(module=>module.definition.id===value.plotType),'Unknown legacy plot type.');
 const project=createProject(), dataset=makeDataset(value.data,'Legacy Config data'), figure=project.figures[0];
 project.datasets=[dataset]; project.history={datasetIds:[dataset.id],cursor:0};
 figure.plotType=value.plotType as PlotType;figure.name=getPlotModule(figure.plotType).definition.name; figure.datasetId=dataset.id;
 figure.mapping=object(value.mapping)?value.mapping as Record<string,string>:{...getPlotModule(figure.plotType).definition.defaultMapping};
 figure.settings={...defaultVisualizationSettings,...object(value.settings)?value.settings:{}};
 const warnings=['Migrated legacy Config. Original analysis software/database versions and unsaved work cannot be recovered; unknown provenance remains unknown. Missing settings use documented defaults.'];
 if(typeof value.themeId==='string' && Object.hasOwn(journalThemes,value.themeId)) figure.themeId=value.themeId as JournalThemeId;
 else warnings.push('Unknown/missing palette ID uses the default palette; explicit setting colors are preserved.');
 if(object(value.pca)) figure.pca={inputMode:value.pca.inputMode==='matrix'?'matrix':'scores', options:{...defaultPcaOptions,...object(value.pca.options)?value.pca.options:{}},observationMetadata:typeof value.pca.observationMetadata==='string'?value.pca.observationMetadata:''};
 validateProject(project); return {project,warnings};
}
