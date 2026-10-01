/** Lossless input and explicit, replayable preparation. Cells remain strings. */
export type DataTable = { headers: string[]; rows: string[][] };
export type DataIssue = { severity: 'error' | 'warning'; code: string; table: string; field?: string; row?: number; count?: number; message: string };
export const importLimits = { bytes: 20 * 1024 * 1024, rows: 100_000, columns: 1_000, cells: 1_000_000 };
export function tableText(table: DataTable): string {
  return [table.headers, ...table.rows].map(row => row.map(cell => /[\t\n\r"]/.test(cell) ? `"${cell.replaceAll('"', '""')}"` : cell).join('\t')).join('\n');
}
export function inspectTable(text: string, options: { name?: string; idColumn?: string; idColumns?: string[]; numericColumns?: string[]; units?: Record<string,string> } = {}) {
  const issues: DataIssue[] = [];
  const add = (issue: Omit<DataIssue,'table'>) => issues.push({ table: options.name || 'Data', ...issue });
  if (new TextEncoder().encode(text).byteLength > importLimits.bytes) throw new Error('File exceeds the 20 MiB local import limit. Split the table before importing.');
  const normalized = text.replace(/^\uFEFF/, '').replaceAll('\r\n','\n').replaceAll('\r','\n');
  const delimiter = normalized.split('\n')[0].includes('\t') ? '\t' : ',';
  const records: { cells: string[]; line: number }[] = [];
  let cells: string[] = [], value = '', quoted = false, line = 1, startLine = 1;
  for (let index = 0; index < normalized.length; index++) {
    if(cells.length>importLimits.columns || records.length>importLimits.rows+1 || records.length*(records[0]?.cells.length??1)>importLimits.cells)throw new Error('Local row/column/cell limit exceeded; split the input.');
    const char = normalized[index];
    if (char === '"') {
      if (quoted && normalized[index + 1] === '"') { value += '"'; index++; }
      else if (quoted || value === '') quoted = !quoted;
      else value += char;
    } else if (!quoted && char === delimiter) { cells.push(value); value = ''; }
    else if (!quoted && char === '\n') { records.push({ cells: [...cells, value], line: startLine }); cells = []; value = ''; startLine = line + 1; }
    else value += char;
    if (char === '\n') line++;
  }
  if (cells.length || value.length || !records.length) records.push({ cells: [...cells,value], line: startLine });
  if (quoted) add({ severity:'error', code:'quote', row:line, message:'Unclosed quoted field.' });
  const headers = records.shift()?.cells ?? [];
  const rows = records.map(record => record.cells);
  if (headers.length > importLimits.columns || rows.length > importLimits.rows || rows.length * headers.length > importLimits.cells) add({severity:'error', code:'limit', message:'Local limit: 100,000 rows, 1,000 columns and 1,000,000 cells. Split or precompute larger inputs.'});
  const seenHeaders = new Set<string>();
  headers.forEach(field => {
    if (!field.trim() || seenHeaders.has(field)) add({severity:'error', code:'header', field, row:1, message:'Empty or duplicate header; rename it before importing.'});
    seenHeaders.add(field);
  });
  const idFields = [...new Set([...(options.idColumns??[]),...(options.idColumn?[options.idColumn]:[])])].map(field=>({field,index:headers.indexOf(field),ids:new Set<string>()}));
  for(const {field,index} of idFields) if(index<0) add({severity:'error',code:'id-column',field,message:'Selected ID column is missing.'});
  records.forEach(record => {
    if (record.cells.length !== headers.length) add({severity:'error', code:'width', row:record.line, message:`Row ${record.line} has ${record.cells.length} values; expected ${headers.length}. Original input retained.`});
    for(const {field,index:idIndex,ids} of idFields) if (idIndex >= 0) {
      const id = record.cells[idIndex] ?? '';
      if (!id.trim() || ids.has(id)) add({severity:'error', code:'id', field, row:record.line, message:'Blank or duplicate identifier.'});
      if (/^0\d/.test(id)) add({severity:'warning', code:'leading-zero', field, row:record.line, message:'Leading-zero ID preserved as text.'});
      if (id !== id.trim()) add({severity:'warning', code:'id-space', field, row:record.line, message:'ID spaces preserved; alignment uses exact IDs.'});
      ids.add(id);
    }
    headers.forEach((field,index) => {
      const cell = record.cells[index];
      if (cell === '' || cell === undefined) add({severity:'warning', code:'missing', field,row:record.line, message:'Missing cell preserved; no imputation applied.'});
      else if (options.numericColumns?.includes(field) && (!cell.trim() || !Number.isFinite(Number(cell)))) add({severity:'error',code:'numeric',field,row:record.line,message:'Non-numeric value; it will not be converted to zero.'});
    });
  });
  if (!rows.length) add({severity:'error',code:'empty',message:'At least one data row is required.'});
  return { table: { headers, rows }, issues, units: options.units ?? {} };
}
export type Transform =
  | { kind:'transpose'; id:string }
  | { kind:'wide-to-long'; fixed:string[]; variables:string[]; variableName:string; valueName:string }
  | { kind:'long-to-wide'; fixed:string[]; variable:string; value:string }
  | { kind:'select'; columns:string[]; names:string[] }
  | { kind:'filter-missing'; columns:string[] };
export function transformTable(table:DataTable, step:Transform):DataTable {
  const indices = (names:string[]) => names.map(name => { const index = table.headers.indexOf(name); if(index < 0) throw new Error(`Unknown field: ${name}`); return index; });
  const finish = (result:DataTable) => { if(result.headers.some(h=>!h.trim()) || new Set(result.headers).size!==result.headers.length) throw new Error('Output field names must be non-empty and unique.'); return result; };
  if(step.kind==='select') {
    if(!step.columns.length || step.names.length!==step.columns.length) throw new Error('Choose columns and one name per column.');
    const selected = indices(step.columns);
    return finish({headers:step.names,rows:table.rows.map(row=>selected.map(index=>row[index]))});
  }
  if(step.kind==='filter-missing') { const selected = indices(step.columns); if(!selected.length) throw new Error('Select fields to filter.'); return {headers:[...table.headers], rows:table.rows.filter(row=>selected.every(index=>row[index]!=='' && row[index]!==undefined)).map(row=>[...row])}; }
  if(step.kind==='transpose') {
    const id = indices([step.id])[0];
    const values = table.headers.map((_,index)=>index).filter(index=>index!==id);
    return finish({headers:[step.id,...table.rows.map(row=>row[id])],rows:values.map(index=>[table.headers[index],...table.rows.map(row=>row[index])])});
  }
  const fixed = indices(step.fixed);
  if(!fixed.length) throw new Error('Choose at least one fixed identifier field.');
  if(step.kind==='wide-to-long') {
    const variables = indices(step.variables);
    if(!variables.length || variables.some(index=>fixed.includes(index))) throw new Error('Variable fields must be non-empty and separate from fixed fields.');
    return finish({headers:[...step.fixed,step.variableName,step.valueName],rows:table.rows.flatMap(row=>variables.map(index=>[...fixed.map(i=>row[i]),table.headers[index],row[index]]))});
  }
  const [variable,value] = indices([step.variable,step.value]);
  if(variable===value || fixed.includes(variable) || fixed.includes(value)) throw new Error('Fixed, variable and value fields must be distinct.');
  const variables = [...new Set(table.rows.map(row=>row[variable]))];
  const groups = new Map<string,{ids:string[]; values:Map<string,string>}>();
  table.rows.forEach(row=>{
    const ids = fixed.map(index=>row[index]), key = JSON.stringify(ids);
    const group = groups.get(key) ?? {ids,values:new Map<string,string>()};
    if(group.values.has(row[variable])) throw new Error(`Duplicate pivot key ${key} / ${row[variable]}; no aggregation has been applied.`);
    group.values.set(row[variable],row[value]); groups.set(key,group);
  });
  return finish({headers:[...step.fixed,...variables],rows:[...groups.values()].map(group=>[...group.ids,...variables.map(name=>group.values.get(name) ?? '')])});
}
export function alignAnnotation(matrixIds:string[], annotation:DataTable) {
  const ids = annotation.rows.map(row=>row[0]);
  return { missing:matrixIds.filter(id=>!ids.includes(id)), extra:ids.filter(id=>!matrixIds.includes(id)), duplicates:ids.filter((id,index)=>ids.indexOf(id)!==index), blank:ids.filter(id=>!id.trim()).length };
}
