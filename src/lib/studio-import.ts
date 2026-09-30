import { importLimits } from './studio-data';
export type ImportedSheet={name:string;text:string};
export async function readLocalFile(file:File):Promise<ImportedSheet[]> {
 if(file.size>importLimits.bytes) throw new Error('File exceeds 20 MiB. Split the input before importing.');
 if(/\.xlsx?$/i.test(file.name)) {
  // XLS and XLSX require a workbook parser; neither format may be decoded as text.
  const XLSX=await import('xlsx');
  const workbook=XLSX.read(await file.arrayBuffer(),{type:'array',cellDates:false});
  return workbook.SheetNames.map(name=>({name,text:XLSX.utils.sheet_to_csv(workbook.Sheets[name],{FS:'\t',RS:'\n',blankrows:true})}));
 }
 return [{name:file.name,text:await file.text()}];
}
