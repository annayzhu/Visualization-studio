'use client';
import { useEffect, useEffectEvent, useMemo, useRef, useState } from 'react';
import { Ui, LanguagePicker } from "./StudioLanguage";
import { Button } from './ui/Button';
import {decodeLegacyPreferences, type CustomPalette} from '@/lib/studio-palettes';
import { analysisIsStale, createProject, decodeProject, encodeProject, makeDataset, type StudioProject, type StudioDataset, type StudioFigure } from '@/lib/studio-project';
import { shareEnrichment } from '@/lib/studio-enrichment';
import { listProjects, saveProject } from '@/lib/studio-storage';
import { inspectTable, tableText, transformTable, type DataTable, type Transform } from '@/lib/studio-data';
export type FigureSnapshot=Omit<StudioFigure,'id'|'datasetId'|'name'> & {raw:string;fields?:StudioDataset["fields"]};
export function downloadLocal(text:string,name:string,type='application/json') {const url=URL.createObjectURL(new Blob([text],{type}));const link=document.createElement('a');link.href=url;link.download=name;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
const fieldClass='focus-ring rounded-[7px] border border-hairline bg-white px-2 py-1 text-sm min-w-0';
export function StudioProjectPanel({snapshot,onRestore,palettes,onPalettes}:{snapshot:FigureSnapshot;onRestore:(snapshot:FigureSnapshot)=>void;palettes:CustomPalette[];onPalettes:(palettes:CustomPalette[])=>void}) {
 const [project,setProject]=useState<StudioProject>(()=>createProject());
 const [recent,setRecent]=useState<StudioProject[]>([]), [status,setStatus]=useState(''), [message,setMessage]=useState('');
 const [savedSignature,setSavedSignature]=useState('');const importRef=useRef<HTMLInputElement>(null);
 const restoreLatest=useEffectEvent(onRestore);
 const restorePalettes=useEffectEvent(onPalettes);
 const [metadata,setMetadata]=useState({species:'',idType:'',background:'',source:'',method:'',databaseVersion:''});
 const [mode,setMode]=useState<Transform['kind']>('wide-to-long'),[fixed,setFixed]=useState(''),[variables,setVariables]=useState(''),[variable,setVariable]=useState('variable'),[value,setValue]=useState('value');
 const [preview,setPreview]=useState<{before:DataTable;table:DataTable;step:Transform;source:string}|null>(null);
 const editedDataset=useMemo(()=>makeDataset(snapshot.raw),[snapshot.raw]);
 const captured=useMemo(()=>{
  const active=project.figures.find(figure=>figure.id===project.activeFigureId)!;
  let dataset=project.datasets.find(item=>item.id===active.datasetId)!;
  const datasets=[...project.datasets];
  if(dataset.raw!==snapshot.raw) {dataset=datasets.find(item=>item.raw===snapshot.raw) ?? editedDataset;if(!datasets.some(item=>item.id===dataset.id))datasets.push(dataset);}
  dataset={...dataset,fields:snapshot.fields??dataset.fields};
  const persistedDatasets=datasets.map(item=>item.id===dataset.id?dataset:item);
  const {raw: _raw,fields:_fields,...state}=snapshot;void _raw;void _fields;
  return {...project,palettes,datasets:persistedDatasets,figures:project.figures.map(figure=>figure.id===active.id?{...figure,...state,datasetId:dataset.id}:figure)};
 },[project,snapshot,editedDataset,palettes]);
 const activeFigure=captured.figures.find(figure=>figure.id===captured.activeFigureId)!;
 const activeResult=captured.analysisResults.find(result=>result.id===activeFigure.analysisResultId);
 const staleResult=activeResult && (activeResult.datasetId!==activeFigure.datasetId || analysisIsStale(captured,activeResult) || JSON.stringify(activeResult.metadata.fieldMapping)!==JSON.stringify(activeFigure.mapping));
 const signature=JSON.stringify(captured),dirty=signature!==savedSignature;
 const latestSignature=useRef(signature);
 useEffect(()=>{latestSignature.current=signature;},[signature]);
 const apply=(next:StudioProject,saved=false)=>{
  const figure=next.figures.find(item=>item.id===next.activeFigureId)!;const data=next.datasets.find(item=>item.id===figure.datasetId)!;
  setProject(next);onPalettes(next.palettes);onRestore({...figure,raw:data.raw,fields:data.fields});setSavedSignature(saved?JSON.stringify(next):'');setStatus(saved?'Saved locally / 已本地保存':'');setPreview(null);
 };
 useEffect(()=>{
  let cancelled=false, userInteracted=false;
  const markInteraction=()=>{userInteracted=true;};
  document.addEventListener('input',markInteraction,true);
  document.addEventListener('click',markInteraction,true);
  listProjects().then(projects=>{
   if(cancelled)return;setRecent(projects);
   if(projects.length && !userInteracted){const next=projects[0],figure=next.figures.find(item=>item.id===next.activeFigureId)!,data=next.datasets.find(item=>item.id===figure.datasetId)!;setProject(next);restorePalettes(next.palettes);restoreLatest({...figure,raw:data.raw,fields:data.fields});setSavedSignature(JSON.stringify(next));setStatus('Restored locally / 已恢复');}
  }).catch(()=>{if(!cancelled)setMessage('Local storage is unavailable. You can still export/import project files. 本地存储不可用，可导出项目文件。');});
  return ()=>{cancelled=true;document.removeEventListener('input',markInteraction,true);document.removeEventListener('click',markInteraction,true);};
 },[]);
 useEffect(()=>{const protect=(event:BeforeUnloadEvent)=>{if(dirty){event.preventDefault();event.returnValue='';}};window.addEventListener('beforeunload',protect);return()=>window.removeEventListener('beforeunload',protect);},[dirty]);
 const latestSavedSignature=useRef(savedSignature);
 useEffect(()=>{latestSavedSignature.current=savedSignature;},[savedSignature]);
 const canReplace=()=>latestSignature.current===latestSavedSignature.current || window.confirm('Discard unsaved changes? Export or save first to keep them. 放弃未保存修改？可先保存或导出。');
 const save=async()=>{
  const submittedSignature=signature, next={...captured,updatedAt:new Date().toISOString()};
  setStatus('Saving / 保存中');
  try {
   await saveProject(next);
   if(latestSignature.current===submittedSignature){setProject(next);setSavedSignature(JSON.stringify(next));setStatus('Saved locally / 已本地保存');}
   else {setMessage('Saved the requested version; newer edits remain unsaved. 已保存请求时的版本，后续修改仍未保存。');setStatus('');}
   setRecent(await listProjects());
  }catch(error){setStatus('Save failed / 保存失败');setMessage(`${String(error)} Export a project file to keep your work. 请导出项目文件。`);}
 };
 const prepare=()=>{try{
  const report=inspectTable(snapshot.raw);if(report.issues.some(issue=>issue.severity==='error'))throw new Error('Fix input errors before transforming. 请先修复输入错误。');
  const split=(text:string)=>text.split(',').filter(Boolean);
  const step:Transform=mode==='transpose'?{kind:mode,id:fixed}:mode==='wide-to-long'?{kind:mode,fixed:split(fixed),variables:split(variables),variableName:variable,valueName:value}:mode==='long-to-wide'?{kind:mode,fixed:split(fixed),variable,value}:mode==='select'?{kind:mode,columns:split(fixed),names:split(variables)}:{kind:mode,columns:split(fixed)};
  setPreview({before:report.table,table:transformTable(report.table,step),step,source:snapshot.raw});setMessage('');
 }catch(error){setMessage(String(error));setPreview(null);}};
 const applyTransform=()=>{if(!preview || preview.source!==snapshot.raw){setMessage('Data changed. Preview the transformation again. 数据已变化，请重新预览。');return;}
  const figure=captured.figures.find(item=>item.id===captured.activeFigureId)!;
  const dataset={...makeDataset(tableText(preview.table),'Prepared data'),parentId:figure.datasetId,transform:preview.step};
  const history=captured.history.datasetIds.slice(0,captured.history.cursor+1);if(history.at(-1)!==figure.datasetId)history.push(figure.datasetId);history.push(dataset.id);
  apply({...captured,datasets:[...captured.datasets,dataset],figures:captured.figures.map(item=>item.id===figure.id?{...item,datasetId:dataset.id,analysisResultId:undefined}:item),history:{datasetIds:history,cursor:history.length-1}});
 };
 const moveHistory=(delta:number)=>{const cursor=captured.history.cursor+delta,id=captured.history.datasetIds[cursor];if(!id)return;apply({...captured,figures:captured.figures.map(item=>item.id===captured.activeFigureId?{...item,datasetId:id,analysisResultId:undefined}:item),history:{...captured.history,cursor}});};
 return <section aria-label="Project workspace" className="rounded-[9px] border border-hairline bg-white p-3 space-y-2">
  <div className="flex flex-wrap items-center gap-2"><LanguagePicker />
   <input aria-label="Project name" className={fieldClass} value={project.name} onChange={event=>setProject({...project,name:event.target.value})}/>
   <Button size="sm" onClick={save}><Ui text={"Save project / 保存项目"} /></Button>
   <Button size="sm" onClick={()=>{try{downloadLocal(encodeProject(captured),`${project.name || 'project'}.studio-project.json`);setMessage('Project file contains original data. 项目文件包含原始数据。');}catch(error){setMessage(String(error));}}}><Ui text={"Export project / 导出项目"} /></Button>
   <Button size="sm" onClick={()=>importRef.current?.click()}><Ui text={"Open project / 导入项目"} /></Button>
   <Button size="sm" onClick={()=>{if(canReplace())apply(createProject());}}><Ui text={"New / 新建"} /></Button>
   <span role="status" className="text-xs text-graphite">{status.startsWith('Saving') || status.startsWith('Save failed')?status:dirty?'Unsaved / 未保存':status}</span>
  </div>
  <p className="text-xs text-graphite"><Ui text={"Local to this browser and address. Project files include raw data; use export/import to move between computers or addresses. 仅保存在当前浏览器及地址；迁移请导出、导入项目文件。"} /></p>
  <input ref={importRef} aria-label="Project file" type="file" accept=".json" className="hidden" onChange={async event=>{const file=event.target.files?.[0];event.target.value='';if(!file)return;try{const text=await file.text();if(JSON.parse(text).format==='visualization-studio-preferences'){const incoming=decodeLegacyPreferences(JSON.parse(text));onPalettes([...palettes.filter(item=>!incoming.some(next=>next.id===item.id)),...incoming]);setMessage('Imported palette collection; choose a palette explicitly. 已导入配色集合，请选择需要的配色。');return;}const result=decodeProject(text);if(canReplace()){apply(result.project);setMessage(result.warnings.join(' '));}}catch(error){setMessage(String(error));}}}/>
  {recent.length>0?<label className="text-sm"><Ui text={"Recent projects / 最近项目"} /><select aria-label="Recent projects" className={fieldClass} value="" onChange={event=>{const next=recent.find(item=>item.id===event.target.value);if(next&&canReplace())apply(next,true);}}><option value=""><Ui text={"Choose / 选择"} /></option>{recent.map(item=><option key={item.id} value={item.id}>{item.name}</option>)}</select></label>:null}
  {staleResult?<p role="alert" className="text-sm text-warning"><Ui text="Source changed: recalculate or import an updated result. This figure no longer represents the saved analysis. / 源数据已变化：需重新计算或导入更新结果，当前图不再代表已保存分析。" /></p>:null}
  {message?<p role="alert" className="break-words text-sm text-warning">{message}</p>:null}
  {captured.figures.length > 1 ? <div className="flex flex-wrap gap-2" aria-label="Project figures">{captured.figures.map(figure=><Button key={figure.id} size="sm" variant={figure.id===captured.activeFigureId?'primary':'secondary'} onClick={()=>apply({...captured,activeFigureId:figure.id})}>{figure.name}</Button>)}</div>:null}
  {['enrichment','enrichment-bar'].includes(snapshot.plotType)?<details><summary className="cursor-pointer text-sm font-medium"><Ui text={"Reuse external enrichment result / 复用外部富集结果"} /></summary><p className="my-2 text-xs"><Ui text={"Unknown fields stay unknown. Full table and supplied P/FDR are preserved. Network/Cnet/chord require explicit membership and edges. 未知字段留空；保留全量结果，不重算 FDR，不推断网络关系。"} /></p><div className="grid gap-2 sm:grid-cols-3">{Object.entries(metadata).map(([key,text])=><label key={key} className="grid gap-1 text-xs">{key}<input className={fieldClass} value={text} onChange={event=>setMetadata({...metadata,[key]:event.target.value})}/></label>)}</div><Button size="sm" onClick={()=>{try{apply(shareEnrichment(captured,metadata));setMessage('Two figures share one full result. 两图共享同一完整结果。');}catch(error){setMessage(String(error));}}}><Ui text={"Create dot + bar / 创建气泡图和柱图"} /></Button></details>:null}
  <details><summary className="cursor-pointer text-sm font-medium"><Ui text={"Prepare data / 数据整理"} /></summary>
   <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
    <label className="grid gap-1 text-xs"><Ui text={"Operation / 操作"} /><select className={fieldClass} value={mode} onChange={event=>{setMode(event.target.value as Transform['kind']);setPreview(null);}}><option value="wide-to-long"><Ui text={"Wide to long / 宽转长"} /></option><option value="long-to-wide"><Ui text={"Long to wide / 长转宽"} /></option><option value="transpose"><Ui text={"Transpose / 转置"} /></option><option value="select"><Ui text={"Select / rename / 选择重命名"} /></option><option value="filter-missing"><Ui text={"Filter missing / 过滤缺失"} /></option></select></label>
    <label className="grid gap-1 text-xs"><Ui text={"ID / fixed fields / 固定列（逗号分隔）"} /><input className={fieldClass} value={fixed} onChange={event=>{setFixed(event.target.value);setPreview(null);}}/></label>
    {['wide-to-long','select'].includes(mode)?<label className="grid gap-1 text-xs">{mode==='select'?'New names / 新列名':'Variable fields / 变量列'}<input className={fieldClass} value={variables} onChange={event=>{setVariables(event.target.value);setPreview(null);}}/></label>:null}
    {mode.includes('to-')?<><label className="grid gap-1 text-xs"><Ui text={"Variable field / 变量列名"} /><input className={fieldClass} value={variable} onChange={event=>{setVariable(event.target.value);setPreview(null);}}/></label><label className="grid gap-1 text-xs"><Ui text={"Value field / 数值列名"} /><input className={fieldClass} value={value} onChange={event=>{setValue(event.target.value);setPreview(null);}}/></label></>:null}
   </div><div className="mt-2 flex flex-wrap gap-2"><Button size="sm" onClick={prepare}><Ui text={"Preview / 预览"} /></Button><Button size="sm" onClick={()=>moveHistory(-1)} disabled={captured.history.cursor===0}><Ui text={"Undo / 撤销"} /></Button><Button size="sm" onClick={()=>moveHistory(1)} disabled={captured.history.cursor>=captured.history.datasetIds.length-1}><Ui text={"Redo / 重做"} /></Button></div>
   {preview && preview.source===snapshot.raw?<div className="mt-2 grid gap-2 sm:grid-cols-2">{[{label:'Before / 转换前',table:preview.before},{label:'After / 转换后',table:preview.table}].map(item=><div key={item.label} className="min-w-0"><p className="text-sm">{item.label}: {item.table.rows.length} × {item.table.headers.length}</p><pre className="max-h-40 overflow-auto bg-stone p-2 text-xs">{tableText({...item.table,rows:item.table.rows.slice(0,5)})}</pre></div>)}<p className="text-xs"><Ui text={"No imputation, normalization or aggregation. 原始数据保留，不自动插补、标准化或聚合。"} /></p><Button size="sm" onClick={applyTransform}><Ui text={"Apply prepared table / 应用派生表"} /></Button></div>:null}
  </details>
 </section>;
}
