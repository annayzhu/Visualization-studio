import { expect, it } from 'vitest';
import { createProject, makeDataset, decodeProject, encodeProject } from './studio-project';
import { shareEnrichment, enrichmentDisplay } from './studio-enrichment';
import { getPlotModule } from './visualization-studio';
import { inspectTable, alignAnnotation, importLimits } from './studio-data';
import { translateUi } from './studio-i18n';
import { readLocalFile } from './studio-import';
import * as XLSX from 'xlsx';
it('preserves the full supplied enrichment result while two figures select display rows',()=>{
 const project=createProject(),dataset=makeDataset('term\tgeneRatio\tcount\tpadj\tbackground\nA\t0.1\t2\t0.04\t200\nB\t0.2\t4\t0.001\t200');
 project.datasets=[dataset];project.history={datasetIds:[dataset.id],cursor:0};project.figures[0]={...project.figures[0],plotType:'enrichment',datasetId:dataset.id,mapping:getPlotModule('enrichment').definition.defaultMapping};
 const shared=shareEnrichment(project,{species:'',source:'synthetic reference'});
 expect(shared.figures.slice(-2).map(figure=>figure.analysisResultId)).toEqual([shared.analysisResults[0].id,shared.analysisResults[0].id]);
 expect(shared.analysisResults[0].metadata.species).toBe(null);
 expect(inspectTable(enrichmentDisplay(dataset.raw,{topN:1,sortField:'padj',thresholdField:'padj',threshold:0.01})).table.rows).toEqual([['B','0.2','4','0.001','200']]);
 expect(decodeProject(encodeProject(shared)).project.analysisResults[0].data).toEqual(inspectTable(dataset.raw).table);
});
it('reports exact-ID annotation mismatches instead of aligning by position',()=>{
 expect(alignAnnotation(['001','002'],{headers:['id','group'],rows:[['002','B'],['01','A'],['002','C']]})).toEqual({missing:['001'],extra:['01'],duplicates:['002'],blank:0});
});
it('rejects empty, duplicate, oversized and nonnumeric inputs with locations',()=>{
 const result=inspectTable('id\tvalue\n001\tx\n\t2\n001\t3',{idColumn:'id',numericColumns:['value']});
 expect(result.issues.filter(issue=>issue.severity==='error').map(issue=>[issue.code,issue.row])).toEqual([['numeric',2],['id',3],['id',4]]);
 expect(inspectTable('id\tid\n1\t2').issues[0].code).toBe('header');
 expect(()=>inspectTable('x'.repeat(importLimits.bytes+1))).toThrow(/20 MiB/);
});
it('does not translate raw header values when the interface changes',()=>{
 const text='Line\tgroup\tReady\n001\tcontrol\t2';
 expect(translateUi('Line','zh')).toBe('折线图');expect(translateUi('Ready','zh')).toBe('可作图');
 expect(inspectTable(text).table.headers).toEqual(['Line','group','Ready']);
});
it.each(['xls','xlsx'] as const)('reads all %s worksheets locally without replacing leading-zero string IDs',async bookType=>{
 const book=XLSX.utils.book_new();XLSX.utils.book_append_sheet(book,XLSX.utils.aoa_to_sheet([['id','value'],['001',2]]),'First');XLSX.utils.book_append_sheet(book,XLSX.utils.aoa_to_sheet([['id','value'],['002',3]]),'Second');
 const bytes=XLSX.write(book,{type:'array',bookType:bookType==='xls'?'biff8':'xlsx'});
 const sheets=await readLocalFile(new File([bytes],`fixture.${bookType}`));expect(sheets.map(sheet=>sheet.name)).toEqual(['First','Second']);expect(inspectTable(sheets[0].text).table.rows[0]).toEqual(['001','2']);
});
