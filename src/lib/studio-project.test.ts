import { expect, it } from 'vitest';
import { decodeProject, createProject, updateFigure, encodeProject, analysisIsStale } from './studio-project';
import { defaultVisualizationSettings } from './visualization-studio';
it('restores a legacy paired Bar without inventing provenance or altering explicit colors', () => {
 const {project,warnings} = decodeProject(JSON.stringify({plotType:'bar',data:'id\tvalue\n001\t2',settings:{barAnalysisMode:'raw-paired',categoricalColors:['#123456']},mapping:{category:'id',value:'value'},themeId:'chai-brown'}));
 expect(project.figures[0].settings.categoricalColors).toEqual(['#123456']);
 expect(project.figures[0].settings.barAnalysisMode).toBe('raw-paired');
 expect(project.datasets[0].raw).toBe('id\tvalue\n001\t2');
 expect(warnings.length).toBeGreaterThan(0);
 expect(decodeProject(encodeProject(project)).project).toEqual(project);
});
it('rejects unknown project versions and corrupt references before replacing a workspace', () => {
 expect(()=>decodeProject('{"schemaVersion":999,"format":"visualization-studio-project"}')).toThrow();
 const project=createProject(); project.figures[0].datasetId='missing';
 expect(()=>decodeProject(JSON.stringify(project))).toThrow();
});
it('invalidates analysis after source changes, not style changes',()=>{
 const project=createProject();
 const figure=project.figures[0];
 const result={schemaVersion:1 as const,id:'analysis-1',kind:'statistics' as const,source:'studio-local' as const,datasetId:figure.datasetId,inputChecksum:project.datasets[0].checksum,parameters:{mode:'paired'},data:[],metadata:{method:null,softwareVersion:null,databaseVersion:null},createdAt:'2026-09-30'};
 project.analysisResults.push(result);
 const styled=updateFigure(project,{...figure,settings:{...defaultVisualizationSettings,width:500}});
 expect(analysisIsStale(styled,result,{mode:'paired'})).toBe(false);
 styled.datasets[0].raw+='\nnew\t3';
 expect(analysisIsStale(styled,result,{mode:'paired'})).toBe(true);
});
it('rejects invalid PCA analysis options rather than guessing preprocessing',()=>{
 const project=createProject();project.figures[0].pca.options.dataLayer='invalid' as never;
 expect(()=>decodeProject(JSON.stringify(project))).toThrow(/PCA/);
});
it('verifies replayed derived tables instead of trusting a forged history',()=>{
 const project=createProject(),parent=project.datasets[0];
 const derived={...parent,id:'derived',parentId:parent.id,transform:{kind:'select' as const,columns:['category'],names:['category']}};
 project.datasets.push(derived);
 expect(()=>decodeProject(JSON.stringify(project))).toThrow();
});

it.each(['barAnalysisMode','barPAdjustment','heatmapScale','correlationMethod','fontFamily'])('rejects unknown %s without guessing scientific settings',key=>{
 const project=createProject();Object.assign(project.figures[0].settings,{[key]:'invalid-value'});
 expect(()=>decodeProject(JSON.stringify(project))).toThrow(/setting/);
});
it('rejects a non-text figure name before rendering imported tabs',()=>{
 const project=createProject();Object.assign(project.figures[0],{name:{unexpected:'object'}});
 expect(()=>decodeProject(JSON.stringify(project))).toThrow(/figure/);
});
