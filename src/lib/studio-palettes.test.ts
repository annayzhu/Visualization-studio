import {expect,it} from 'vitest';
import {decodeLegacyPreferences} from './studio-palettes';
import {createProject,decodeProject,encodeProject} from './studio-project';
import {journalThemes,defaultVisualizationThemeId} from './visualization-studio';
it('moves explicit old palette colors into a project without interpreting arbitrary storage keys',()=>{
 const theme=journalThemes[defaultVisualizationThemeId];
 const palette={id:'legacy',name:'Synthetic saved palette',sourceThemeId:defaultVisualizationThemeId,categoricalColors:['#123456'],continuousLow:theme.sequential[0],continuousHigh:theme.sequential[1],divergingLow:theme.diverging[0],divergingMid:theme.diverging[1],divergingHigh:theme.diverging[2],barBorderColor:'#123456',createdAt:'2026-09-30',updatedAt:'2026-09-30'};
 const palettes=decodeLegacyPreferences({format:'visualization-studio-preferences',schemaVersion:1,preferences:{'labnest:visualization-studio:custom-palettes':[palette],unrelated:'ignored'}});
 const project=createProject();project.palettes=palettes;
 expect(decodeProject(encodeProject(project)).project.palettes).toEqual([palette]);
 expect(()=>decodeLegacyPreferences({format:'visualization-studio-preferences',schemaVersion:1,preferences:{'labnest:visualization-studio:custom-palettes':[{}]}})).toThrow(/No preferences changed/);
});
