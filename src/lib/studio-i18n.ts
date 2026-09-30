/** UI-only catalogue. Never pass raw headers, rows, group names or captions here. */
export type StudioLocale='en'|'zh';
export const uiMessages:Record<string,[string,string]>={
 'plot.line.name':['Line','折线图'],'state.ready':['Ready','可作图'],'state.check':['Check data','检查数据'],
 'action.upload':['Upload','导入数据'],'action.template':['Template','下载模板'],'action.autoMap':['Auto-map','自动映射'],'action.reset':['Reset','重置'],
 'panel.data':['Data & mapping','数据与映射'],'panel.palette':['Palette','配色'],'panel.figure':['Figure','图形'],'panel.axes':['Axes','坐标轴'],'panel.labels':['Labels','标签'],'panel.legend':['Legend','图例'],
 'figure.title':['Title','标题'],'figure.width':['Width','宽度'],'figure.height':['Height','高度'],'figure.font':['Figure font','图形字体'],'figure.fontSize':['Font size','字号'],
 'axis.xLabel':['X-axis label','X轴标题'],'axis.yLabel':['Y-axis label','Y轴标题'],'axis.swap':['Swap axes','交换坐标轴'],'axis.grid':['Show grid','显示网格'],
 'legend.show':['Show legend','显示图例'],'legend.position':['Legend position','图例位置'],'label.show':['Show labels','显示标签'],'data.example':['Example data','示例数据'],
 'help.definition':['Definition','定义'],'help.suitable':['Suitable data','适用数据'],'help.question':['Scientific question','科研问题'],'help.references':['References','参考文献'],
 'analysis.source':['Analysis source / design','分析来源／设计'],'analysis.none':['No test','不执行检验'],'analysis.reference':['Reference category','参照组'],'analysis.supplied':['Supplied results','用户提供结果'],'analysis.local':['Calculated in Studio','Studio 本地计算'],
 'plot.bar.name':['Bar','柱状图'],'plot.scatter.name':['Scatter','散点图'],'plot.box.name':['Box','箱线图'],'plot.violin.name':['Violin','小提琴图'],'plot.raincloud.name':['Raincloud','云雨图'],'plot.beeswarm.name':['Beeswarm','蜂群图'],'plot.histogram.name':['Histogram','直方图'],'plot.density.name':['Density','密度图'],'plot.ridge.name':['Ridge','山脊图'],'plot.heatmap.name':['Heatmap','热图'],'plot.enrichment.name':['Enrichment','富集气泡图'],'plot.enrichmentBar.name':['Enrichment bar','富集柱图'],'plot.volcano.name':['Volcano','火山图'],
 'action.savePalette':['Save palette','保存配色'],'state.unsavedColors':['Unsaved colors','配色未保存'],'state.savedPalette':['Saved palette','配色已保存'],'state.noPalette':['No custom palettes','暂无自定义配色'],
 'choice.auto':['Auto','自动'],'choice.none':['None','无'],'choice.top':['Top','上方'],'choice.bottom':['Bottom','下方'],'choice.left':['Left','左侧'],'choice.right':['Right','右侧'],
 'metric.mean':['Mean','均值'],'metric.median':['Median','中位数'],'metric.range':['Range','极差'],'metric.count':['Count','数量'],
 'role.value':['Value','数值'],'role.category':['Category','类别'],'role.group':['Group','分组'],'role.subject':['Subject','个体ID'],'role.term':['Term','条目'],'role.ratio':['Ratio','比例'],
 'group.compare':['Compare groups','组间比较'],'group.trend':['Show change or trend','变化与趋势'],'group.distribution':['Show a distribution','分布'],'group.association':['Show an association','关联'],'group.similarity':['Sample similarity','样本相似性'],'group.differential':['Show differential results','差异结果'],'group.enrichment':['Show pathways or enrichment','通路与富集'],'group.clinical':['Show clinical or model results','临床或模型结果'],'group.sets':['Compare sets','集合比较'],'group.network':['Show flows or networks','流向与网络'],
};
const sourceKeys=new Map(Object.entries(uiMessages).map(([key,[en]])=>[en,key]));
export function translateUi(source:string,locale:StudioLocale) {
 const key=sourceKeys.get(source);if(key)return uiMessages[key][locale==='zh'?1:0];
 // New workflow labels carry an explicit bilingual pair, not arbitrary user text.
 const parts=source.split(' / ');if(parts.length===2 && /[\u3400-\u9fff]/.test(parts[1]))return parts[locale==='zh'?1:0];
 return source;
}
