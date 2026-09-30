import { checksum, newId, type AnalysisResult, type StudioProject } from './studio-project';
import { inspectTable, tableText } from './studio-data';
export function shareEnrichment(project:StudioProject,metadata:Record<string,string>):StudioProject {
 const figure=project.figures.find(item=>item.id===project.activeFigureId)!;
 if(!['enrichment','enrichment-bar'].includes(figure.plotType)) throw new Error('Select enrichment dot or bar and map the supplied table first.');
 const dataset=project.datasets.find(item=>item.id===figure.datasetId)!;
 const report=inspectTable(dataset.raw);
 if(report.issues.some(issue=>issue.severity==='error')) throw new Error('Fix table errors before saving the result.');
 if(!figure.mapping.term || !report.table.headers.includes(figure.mapping.term)) throw new Error('Map the term column first.');
 const result:AnalysisResult={schemaVersion:1,id:newId('result'),kind:'enrichment',source:'user-provided',datasetId:dataset.id,inputChecksum:checksum(dataset.raw),parameters:{},data:report.table,metadata:{method:null,softwareVersion:null,databaseVersion:null,...Object.fromEntries(Object.entries(metadata).map(([key,value])=>[key,value||null])),fieldMapping:figure.mapping},createdAt:new Date().toISOString()};
 const figures=(['enrichment','enrichment-bar'] as const).map(plotType=>({...figure,id:newId('figure'),name:plotType==='enrichment'?'Enrichment dot / 富集气泡':'Enrichment bar / 富集柱图',plotType,analysisResultId:result.id}));
 return {...project,analysisResults:[...project.analysisResults,result],figures:[...project.figures,...figures],activeFigureId:figures[0].id};
}
/** Only display rows change; the supplied full result and FDR stay untouched. */
export function enrichmentDisplay(raw:string,display:{topN:number;sortField:string;thresholdField:string;threshold:number|null}) {
 const {table}=inspectTable(raw);let rows=[...table.rows];
 const numeric=(row:string[],field:string)=>{const cell=row[table.headers.indexOf(field)];return cell?.trim() && Number.isFinite(Number(cell))?Number(cell):null;};
 if(display.threshold!==null && display.thresholdField) rows=rows.filter(row=>{const value=numeric(row,display.thresholdField);return value!==null && value<=display.threshold!;});
 if(display.sortField) rows.sort((a,b)=>(numeric(a,display.sortField)??Infinity)-(numeric(b,display.sortField)??Infinity));
 if(display.topN>0)rows=rows.slice(0,Math.floor(display.topN));
 return tableText({...table,rows});
}
