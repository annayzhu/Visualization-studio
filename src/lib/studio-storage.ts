import { validateProject, type StudioProject } from './studio-project';
const databaseName='visualization-studio-projects';
function openDatabase():Promise<IDBDatabase> {return new Promise((resolve,reject)=>{if(typeof indexedDB==='undefined') return reject(new Error('Local project storage is unavailable. Export a project file instead.')); const request=indexedDB.open(databaseName,1); request.onupgradeneeded=()=>request.result.createObjectStore('projects',{keyPath:'id'}); request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);request.onblocked=()=>reject(new Error('Close other Studio tabs and retry saving, or export a project file.'));});}
export async function saveProject(project:StudioProject):Promise<void> {
 validateProject(project);const db=await openDatabase();
 try {await new Promise<void>((resolve,reject)=>{const tx=db.transaction('projects','readwrite');tx.objectStore('projects').put(project);tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error ?? new Error('Local save was aborted. Export a project file.'));});} finally {db.close();}
}
export async function listProjects():Promise<StudioProject[]> {
 const db=await openDatabase();try {return await new Promise((resolve,reject)=>{const request=db.transaction('projects').objectStore('projects').getAll();request.onsuccess=()=>{try {const projects=request.result as StudioProject[];projects.forEach(validateProject);resolve(projects.sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt)));}catch(error){reject(error);}};request.onerror=()=>reject(request.error);});}finally{db.close();}
}
