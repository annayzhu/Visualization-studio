import { describe, expect, it } from 'vitest';
import { inspectTable, transformTable, tableText } from './studio-data';
describe('local data preparation contract', () => {
  it('preserves exact identifiers, quoted multiline values and reports malformed rows without dropping them', () => {
    const result = inspectTable('id,value,note\n001,2,"a\nb"\n 01 ,3,z\n003,4', { idColumn: 'id', numericColumns: ['value'] });
    expect(result.table.rows).toEqual([['001','2','a\nb'],[' 01 ','3','z'],['003','4']]);
    expect(result.issues.some(i => i.severity === 'error' && i.row === 5)).toBe(true);
    expect(inspectTable(tableText({ headers:['id','value'], rows:[['001','2']] })).table.rows[0][0]).toBe('001');
  });
});
it('round-trips paired identifiers and refuses ambiguous pivots', () => {
  const wide = { headers:['id','before','after'], rows:[['001','2','4'],[' 01 ','3','5']] };
  const long = transformTable(wide, {kind:'wide-to-long',fixed:['id'],variables:['before','after'],variableName:'visit',valueName:'value'});
  expect(long.rows).toEqual([['001','before','2'],['001','after','4'],[' 01 ','before','3'],[' 01 ','after','5']]);
  expect(transformTable(long,{kind:'long-to-wide',fixed:['id'],variable:'visit',value:'value'})).toEqual(wide);
  expect(()=>transformTable({...long, rows:[...long.rows,long.rows[0]]},{kind:'long-to-wide',fixed:['id'],variable:'visit',value:'value'})).toThrow(/Duplicate pivot/);
});
it('treats whitespace-only numeric entries as invalid instead of numeric zero',()=>{
 expect(inspectTable('id\tvalue\n001\t ',{numericColumns:['value']}).issues.some(issue=>issue.code==='numeric')).toBe(true);
});
