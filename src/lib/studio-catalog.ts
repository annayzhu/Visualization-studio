import { getPlotModule, type PlotType, type VisualizationSettings } from './visualization-studio';
export const chartAliases:Partial<Record<PlotType,string>>={bar:'柱状图 独立组比较',line:'折线图 趋势',raincloud:'云雨图 配对云雨',box:'箱线图',violin:'小提琴图',beeswarm:'蜂群图',histogram:'直方图 分布',density:'密度图',ridge:'山脊图',scatter:'散点图',correlation:'相关图',heatmap:'热图 表达矩阵','clustered-heatmap':'聚类热图','correlation-heatmap':'相关热图',pca:'主成分分析 样本相似性',pcoa:'主坐标分析',umap:'统一流形近似投影',tsne:'t-SNE降维',nmds:'非度量多维尺度',volcano:'火山图 差异表达',ma:'MA图 表达差异',enrichment:'富集气泡图 通路 GO KEGG','enrichment-bar':'富集柱图',roc:'ROC曲线 临床模型',km:'生存曲线',venn:'韦恩图 集合',upset:'集合交集图',network:'网络图',cnet:'基因通路网络',chord:'弦图',sankey:'桑基图',gsea:'基因集富集图'};
export const scenarioPresets:{id:string;en:string;zh:string;plotType:PlotType;settings?:Partial<VisualizationSettings>}[]=[
{id:'independent',en:'Independent groups',zh:'独立组比较',plotType:'bar',settings:{barInputMode:'long',barAnalysisMode:'none'}},
{id:'paired',en:'Paired change',zh:'配对变化',plotType:'raincloud',settings:{distributionShowPairedLines:true}},
{id:'paired-raincloud',en:'Paired raincloud',zh:'配对云雨',plotType:'raincloud',settings:{distributionShowPairedLines:true,showDensity:true,showPoints:true,showBox:true}},
{id:'distribution',en:'Distribution',zh:'分布',plotType:'box'},
{id:'trend',en:'Trend',zh:'趋势 折线',plotType:'line'},
{id:'differential',en:'Expression differences',zh:'表达差异',plotType:'volcano'},
{id:'enrichment',en:'External enrichment',zh:'外部富集结果',plotType:'enrichment'},
{id:'similarity',en:'Sample similarity',zh:'样本相似性',plotType:'pca'},
{id:'clinical',en:'Clinical model results',zh:'临床模型结果 ROC',plotType:'roc'},
{id:'sets',en:'Sets',zh:'集合交集',plotType:'upset'},
{id:'networks',en:'Networks',zh:'网络',plotType:'network'}];
export function catalogPreference(values:unknown):PlotType[]{if(!Array.isArray(values))return [];return [...new Set(values.filter((id):id is PlotType=>typeof id==='string' && (()=>{try{return Boolean(getPlotModule(id as PlotType));}catch{return false;}})()))].slice(0,12);}
