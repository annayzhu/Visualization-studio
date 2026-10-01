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
for(const [en,zh] of [
 ["Adjusted P threshold", "调整后 P 阈值"],
 ["All labels", "全部标签"],
 ["All variable features", "全部有变异特征"],
 ["Annotation tracks", "注释轨道"],
 ["Association view", "关联视图"],
 ["Auto (legible)", "自动（保证可读）"],
 ["Auto by explicit suffix; otherwise normalized", "按明确后缀识别，否则视为已归一化"],
 ["Auto detect", "自动识别"],
 ["Average", "平均连接"],
 ["Axis break", "坐标轴断点"],
 ["Axis label size", "坐标轴标题字号"],
 ["Axis line", "坐标轴线"],
 ["Bandwidth", "带宽"],
 ["Bar + overlay", "柱图叠加"],
 ["Bar appearance", "柱形外观"],
 ["Benjamini–Hochberg FDR", "Benjamini–Hochberg FDR 校正"],
 ["Bidirectional", "双向"],
 ["Border color", "边框颜色"],
 ["Border width", "边框宽度"],
 ["Both axes", "两轴"],
 ["Box & whiskers", "箱体与须"],
 ["Break end", "断点终点"],
 ["Break start", "断点起点"],
 ["Bullet", "子弹图"],
 ["Calculate from matrix", "从矩阵计算"],
 ["Calculate significance", "计算显著性"],
 ["Calibration grouping", "校准分组"],
 ["Cap width", "端帽宽度"],
 ["Categorical design", "分类布局"],
 ["Category + value", "类别与数值"],
 ["Cell values when legible", "清晰时显示单元格数值"],
 ["Center hole", "中心孔径"],
 ["Center summary", "中心汇总"],
 ["Choose", "选择"],
 ["Circos tracks", "Circos 轨道"],
 ["Circular heatmap", "环形热图"],
 ["Classic circles · 2–3 sets", "经典圆形：2–3 个集合"],
 ["Cluster columns", "对列聚类"],
 ["Cluster rows", "对行聚类"],
 ["Cluster variables (linked rows + columns)", "变量聚类（行列联动）"],
 ["Clustering", "聚类"],
 ["Cohort ordering", "队列排序"],
 ["Color group", "颜色分组"],
 ["Color scale", "色标"],
 ["Column annotations (TSV)", "列注释（TSV）"],
 ["Column cluster cut", "列聚类切分数"],
 ["Column z-score", "按列 Z 分数"],
 ["Combine all rows", "合并全部行"],
 ["Compact layout", "紧凑布局"],
 ["Compact preset", "紧凑预设"],
 ["Comparison", "比较"],
 ["Complete", "完全连接"],
 ["Config", "配置文件"],
 ["Continuous / already normalized", "连续值／已归一化"],
 ["Convex hull", "凸包"],
 ["Coordinated raw-value row summary", "联动的原始行数值汇总"],
 ["Correlation", "相关"],
 ["Correlation cells", "相关单元格"],
 ["Correlation method", "相关方法"],
 ["Count matrix → log₂(CPM + 1)", "计数矩阵 → log₂(CPM + 1)"],
 ["Custom palette name", "自定义配色名称"],
 ["Data layer", "数据层"],
 ["Data line", "数据线"],
 ["Decision thresholds", "决策阈值"],
 ["Degree 2", "二阶"],
 ["Degree 3", "三阶"],
 ["Degree-centered radial", "以节点度为中心的径向布局"],
 ["Dendrograms", "树状图"],
 ["Density bandwidth", "密度带宽"],
 ["Density width", "密度宽度"],
 ["Detected layers:", "检测到的数据层："],
 ["Deterministic circular", "确定性环形布局"],
 ["Diagram layout", "图形布局"],
 ["Difference (95% CI)", "差值（95% 置信区间）"],
 ["Display style", "显示样式"],
 ["Display supplied P values", "显示用户提供的 P 值"],
 ["Display values", "显示数值"],
 ["Displayed intersections", "显示的交集"],
 ["Distance", "距离"],
 ["Distribution layers", "分布图层"],
 ["Diverging around zero", "以零为中心的发散色标"],
 ["Diverging high", "发散色标高值"],
 ["Diverging low", "发散色标低值"],
 ["Download input data template", "下载输入数据模板"],
 ["Download selected members", "下载所选成员"],
 ["Dual axis", "双坐标轴"],
 ["Edge opacity", "边透明度"],
 ["Editable colors", "可编辑颜色"],
 ["Equal-frequency bins", "等频分箱"],
 ["Error bars", "误差线"],
 ["Error line", "误差线宽"],
 ["Error representation", "误差表示"],
 ["Euclidean", "欧氏距离"],
 ["Exact intersection to download", "选择要下载的精确交集"],
 ["Export PNG at 600 dpi", "导出 600 dpi PNG"],
 ["Faceted", "分面"],
 ["Feature loading arrows", "特征载荷箭头"],
 ["Figure parameters", "图形参数"],
 ["Fit", "拟合"],
 ["Fit/report by group", "按组拟合与报告"],
 ["Flow semantics", "流向语义"],
 ["Forest reference", "森林图参考线"],
 ["Full matrix", "完整矩阵"],
 ["Genome tracks", "基因组轨道"],
 ["Genome-wide threshold", "全基因组阈值"],
 ["Genomic peak overlap", "基因组峰重叠"],
 ["Grid", "网格"],
 ["Grid line", "网格线"],
 ["Grid resolution", "网格分辨率"],
 ["Grid units", "网格单位"],
 ["Group behavior", "分组方式"],
 ["Group centroids", "组中心"],
 ["Group convex hulls", "组凸包"],
 ["Group covariance ellipses", "组协方差椭圆"],
 ["Grouped", "分组"],
 ["Grouped layers", "分组分层"],
 ["Heatmap view", "热图视图"],
 ["Help me choose a plot", "帮助选择图形"],
 ["Hexagon size", "六边形大小"],
 ["Hexbin counts", "六边形分箱计数"],
 ["Hidden", "隐藏"],
 ["Hierarchy gap", "层级间距"],
 ["Hierarchy layout", "层级布局"],
 ["Histogram bins", "直方图分箱数"],
 ["Holm family-wise correction", "Holm 家族错误率校正"],
 ["Horizontal", "水平"],
 ["Horizontal only", "仅水平"],
 ["Horizontal values", "水平数值轴"],
 ["Ideogram labels", "染色体模式图标签"],
 ["Information content (bits)", "信息量（比特）"],
 ["Input structure", "输入结构"],
 ["Item–set membership", "元素与集合的成员关系"],
 ["Keep explicit isolated nodes", "保留明确给出的孤立节点"],
 ["LOESS smoother", "LOESS 平滑"],
 ["LOESS span", "LOESS 跨度"],
 ["Label density", "标签密度"],
 ["Label strongest deviations", "标注偏离最强的点"],
 ["Label strongest loci", "标注最强位点"],
 ["Labels & composition", "标签与组成"],
 ["Layout", "布局"],
 ["Left to right", "从左到右"],
 ["Legend size", "图例字号"],
 ["Letter height", "字母高度"],
 ["Line + points", "折线与点"],
 ["Linear regression", "线性回归"],
 ["Linkage", "连接方法"],
 ["Loading labels", "载荷标签"],
 ["Long-form observations", "长表观测值"],
 ["Lower triangle", "下三角"],
 ["Marginal histograms", "边缘直方图"],
 ["Marks & axes", "图形标记与坐标轴"],
 ["Maximum labels", "标签上限"],
 ["Maximum threshold", "最大阈值"],
 ["Mean + SD/SEM + n · Welch", "均值 + SD/SEM + n：Welch 检验"],
 ["Mean 95% CI", "均值的 95% 置信区间"],
 ["Mean 95% confidence band", "均值的 95% 置信带"],
 ["Mean ± SD", "均值 ± 标准差"],
 ["Mean ± SEM", "均值 ± 标准误"],
 ["Metadata template", "元数据模板"],
 ["Method", "方法"],
 ["Method / scale", "方法／尺度"],
 ["Method note", "方法说明"],
 ["Midpoint", "中点"],
 ["Minimum threshold", "最小阈值"],
 ["Motif scale", "基序尺度"],
 ["Multiple-testing correction", "多重检验校正"],
 ["Network layout", "网络布局"],
 ["Non-negative abundance → log₂(x + 1)", "非负丰度 → log₂(x + 1)"],
 ["Null reference", "零效应参考值"],
 ["Observation label", "观测标签"],
 ["Observation metadata", "观测元数据"],
 ["Opacity", "透明度"],
 ["Ordination view", "排序视图"],
 ["Orientation", "方向"],
 ["Orthographic 3D", "正交三维"],
 ["Orthographic 3D projection", "正交三维投影"],
 ["P adjusted", "调整后 P"],
 ["P raw", "原始 P"],
 ["P value", "P 值"],
 ["P-value threshold", "P 值阈值"],
 ["PCA input mode", "PCA 输入模式"],
 ["PCA observation metadata", "PCA 观测元数据"],
 ["Paired lines", "配对连线"],
 ["Pearson product-moment", "Pearson 积矩相关"],
 ["Percent", "百分比"],
 ["Permutations", "置换次数"],
 ["Plot type", "图形类型"],
 ["Plot types", "图形类型"],
 ["Point labels", "点标签"],
 ["Point size", "点大小"],
 ["Points", "散点"],
 ["Points only", "仅点"],
 ["Pointwise bars", "逐点误差棒"],
 ["Pointwise significance", "逐点显著性"],
 ["Polar bars", "极坐标柱图"],
 ["Polynomial degree", "多项式阶数"],
 ["Polynomial regression", "多项式回归"],
 ["Population pyramid scale", "人口金字塔尺度"],
 ["Probability", "概率"],
 ["Profile fill", "轮廓填充"],
 ["Pyramid", "金字塔"],
 ["QQ labels", "QQ 标签"],
 ["Quadrant thresholds", "象限阈值"],
 ["ROC input", "ROC 输入"],
 ["Radial exact intersections · 2–7 sets", "径向精确交集：2–7 个集合"],
 ["Radial maximum", "径向最大值"],
 ["Radial scale", "径向尺度"],
 ["Raw binary outcomes + scores", "原始二元结局与评分"],
 ["Raw independent observations · Welch", "原始独立观测：Welch 检验"],
 ["Raw matched observations · paired t", "原始配对观测：配对 t 检验"],
 ["Raw observations", "原始观测"],
 ["Raw row summary", "原始行汇总"],
 ["Raw values", "原始数值"],
 ["Recent plots", "最近图形"],
 ["Rectangular matrix", "矩形矩阵"],
 ["Reference series", "参照系列"],
 ["Reproducible seed", "可复现随机种子"],
 ["Ribbon", "带状区间"],
 ["Ribbon opacity", "区间带透明度"],
 ["Rose labels", "玫瑰图标签"],
 ["Row annotations (TSV)", "行注释（TSV）"],
 ["Row cluster cut", "行聚类切分数"],
 ["Row z-score", "按行 Z 分数"],
 ["Sample size", "样本量"],
 ["Scale each feature to unit variance", "将每个特征缩放至单位方差"],
 ["Scaling", "缩放"],
 ["Scores / coordinates", "得分／坐标"],
 ["Scree plot", "碎石图"],
 ["Search plot types", "搜索图形类型"],
 ["Secondary axis label", "次坐标轴标题"],
 ["Secondary mark", "次变量标记"],
 ["Sector labels", "扇区标签"],
 ["Sequential high", "连续色标高值"],
 ["Sequential low", "连续色标低值"],
 ["Sequential low → high", "由低到高的连续色标"],
 ["Set intersections", "集合交集"],
 ["Shape group", "形状分组"],
 ["Show burden and frequency margins", "显示边缘负荷与频率"],
 ["Show compact labels", "显示紧凑标签"],
 ["Show correlation P value", "显示相关 P 值"],
 ["Show cytoband labels", "显示染色体带标签"],
 ["Show feature labels", "显示特征标签"],
 ["Show leaf labels", "显示叶节点标签"],
 ["Show node labels", "显示节点标签"],
 ["Show numbers at risk", "显示风险人数"],
 ["Significance annotations", "显著性标注"],
 ["Significance −log₁₀(P)", "显著性 −log₁₀(P)"],
 ["Single", "单连接"],
 ["Size-weighted visual cue", "按大小加权的视觉提示"],
 ["Sort samples by event burden", "按事件负荷排序样本"],
 ["Spearman rank", "Spearman 秩相关"],
 ["Stacked", "堆叠"],
 ["Statistical analysis", "统计分析"],
 ["Statistical results ·", "统计结果 ·"],
 ["Summary values", "汇总值"],
 ["Supplied P-value labels", "用户提供的 P 值标签"],
 ["Supplied PERMANOVA", "用户提供的 PERMANOVA"],
 ["Supplied coordinates", "用户提供坐标"],
 ["Supplied stress", "用户提供的应力值"],
 ["Survival", "生存"],
 ["Ternary composition", "三元组成"],
 ["Tick size", "刻度字号"],
 ["Time-dependent coordinates + 95% CI", "时间依赖坐标与 95% 置信区间"],
 ["Title size", "标题字号"],
 ["Top N (0 = all)", "前 N 项（0 为全部）"],
 ["Top to bottom", "从上到下"],
 ["Top variable features", "高变异特征数"],
 ["Track gap", "轨道间距"],
 ["Uncertainty", "不确定性"],
 ["Uncertainty line", "不确定性线"],
 ["Upper triangle", "上三角"],
 ["Use mapped shapes", "使用映射形状"],
 ["Value + percent", "数值与百分比"],
 ["Value labels", "数值标签"],
 ["Variable cluster cut", "变量聚类切分数"],
 ["Variant", "变体"],
 ["Vertical values", "垂直数值轴"],
 ["View", "视图"],
 ["Visualization only · no P values", "仅可视化，不计算 P 值"],
 ["What do you want to show?", "希望展示什么？"],
 ["What should the figure show?", "图形要回答什么问题？"],
 ["Within-group percent", "组内百分比"],
 ["Worksheet", "工作表"],
 ["X component", "X 主成分"],
 ["X maximum", "X 最大值"],
 ["X minimum", "X 最小值"],
 ["X minimum must be smaller than X maximum.", "X 最小值必须小于最大值。"],
 ["X threshold", "X 阈值"],
 ["Y component", "Y 主成分"],
 ["Y maximum", "Y 最大值"],
 ["Y minimum", "Y 最小值"],
 ["Y minimum must be smaller than Y maximum.", "Y 最小值必须小于最大值。"],
 ["Y threshold", "Y 阈值"],
 ["Z component", "Z 主成分"],
 ["qPCR · display relative expression, test ΔCt", "qPCR：展示相对表达，检验 ΔCt"],
 ["The first column supplies row labels; all remaining columns form the numeric matrix.", "第一列提供行标签，其余列组成数值矩阵。"],
 ["The secondary column shares the primary value axis and should use the same unit.", "次变量与主变量共用数值轴，必须使用相同单位。"],
 ["Input stays in your browser; exports include a reproducible parameter file.", "输入保留在浏览器中，导出包含可复现的参数文件。"],
 ["Use 1 for ratios such as HR/OR and 0 for additive coefficients.", "HR/OR 等比值使用 1，加性系数使用 0。"]]) uiMessages[`control.${en}`]=[en,zh];
uiMessages["plot.bar.name"]=["Bar", "柱状图"];
uiMessages["plot.line.name"]=["Line", "折线图"];
uiMessages["plot.scatter.name"]=["Scatter", "散点图"];
uiMessages["plot.pca.name"]=["PCA", "主成分分析 PCA"];
uiMessages["plot.box.name"]=["Box", "箱线图"];
uiMessages["plot.violin.name"]=["Violin", "小提琴图"];
uiMessages["plot.volcano.name"]=["Volcano", "火山图"];
uiMessages["plot.heatmap.name"]=["Heatmap", "热图"];
uiMessages["plot.enrichment.name"]=["Enrichment dot", "富集气泡图"];
uiMessages["plot.correlation.name"]=["Correlation", "相关图"];
uiMessages["plot.ma.name"]=["MA", "MA 图"];
uiMessages["plot.quadrant.name"]=["Quadrant", "象限图"];
uiMessages["plot.errorbar.name"]=["Error bar", "误差棒图"];
uiMessages["plot.area.name"]=["Area", "面积图"];
uiMessages["plot.lollipop.name"]=["Lollipop", "棒棒糖图"];
uiMessages["plot.beeswarm.name"]=["Beeswarm", "蜂群图"];
uiMessages["plot.raincloud.name"]=["Raincloud", "云雨图"];
uiMessages["plot.histogram.name"]=["Histogram", "直方图"];
uiMessages["plot.density.name"]=["Density", "密度图"];
uiMessages["plot.ridge.name"]=["Ridge", "山脊图"];
uiMessages["plot.pcoa.name"]=["PCoA", "主坐标分析 PCoA"];
uiMessages["plot.umap.name"]=["UMAP", "UMAP"];
uiMessages["plot.tsne.name"]=["t-SNE", "t-SNE"];
uiMessages["plot.nmds.name"]=["NMDS", "非度量多维尺度 NMDS"];
uiMessages["plot.clustered-heatmap.name"]=["Clustered heatmap", "聚类热图"];
uiMessages["plot.correlation-heatmap.name"]=["Correlation heatmap", "相关热图"];
uiMessages["plot.enrichment-bar.name"]=["Enrichment bar", "富集柱图"];
uiMessages["plot.gsea.name"]=["GSEA", "GSEA"];
uiMessages["plot.go-circle.name"]=["GO circle", "GO 环图"];
uiMessages["plot.kegg-circle.name"]=["KEGG circle", "KEGG 环图"];
uiMessages["plot.go-chord.name"]=["GO chord", "GO 弦图"];
uiMessages["plot.pathway-impact.name"]=["Pathway impact", "通路影响图"];
uiMessages["plot.nes-fdr.name"]=["NES / FDR summary", "NES／FDR 汇总"];
uiMessages["plot.multi-gsea.name"]=["Multi-GSEA", "多条 GSEA 曲线"];
uiMessages["plot.enrichment-ridge.name"]=["Enrichment ridge", "富集山脊图"];
uiMessages["plot.sankey-bubble.name"]=["Relationship ribbon–bubble", "关系带与气泡图"];
uiMessages["plot.geographic-map.name"]=["Geographic point map", "地理点图"];
uiMessages["plot.petal.name"]=["Petal", "花瓣图"];
uiMessages["plot.word-cloud.name"]=["Word cloud", "词云"];
uiMessages["plot.km.name"]=["Kaplan–Meier", "Kaplan–Meier 生存曲线"];
uiMessages["plot.survival-forest.name"]=["Survival forest", "生存森林图"];
uiMessages["plot.roc.name"]=["ROC", "ROC 曲线"];
uiMessages["plot.funnel.name"]=["Funnel", "漏斗图"];
uiMessages["plot.precision-recall.name"]=["Precision–recall", "精确率－召回率曲线"];
uiMessages["plot.calibration.name"]=["Calibration", "校准曲线"];
uiMessages["plot.decision-curve.name"]=["Decision curve", "决策曲线"];
uiMessages["plot.nomogram.name"]=["Nomogram", "列线图"];
uiMessages["plot.lasso-path.name"]=["LASSO path", "LASSO 路径"];
uiMessages["plot.km-cutoff.name"]=["Cutoff KM", "截点 KM 图"];
uiMessages["plot.risk-score.name"]=["Risk-score panel", "风险评分面板"];
uiMessages["plot.venn.name"]=["Venn", "韦恩图"];
uiMessages["plot.upset.name"]=["UpSet", "UpSet 交集图"];
uiMessages["plot.sankey.name"]=["Sankey", "桑基图"];
uiMessages["plot.chord.name"]=["Chord", "弦图"];
uiMessages["plot.alluvial.name"]=["Alluvial", "冲积图"];
uiMessages["plot.ligand-receptor.name"]=["Ligand–receptor", "配体－受体图"];
uiMessages["plot.network.name"]=["Network", "网络图"];
uiMessages["plot.ppi.name"]=["PPI network", "PPI 网络"];
uiMessages["plot.cerna.name"]=["ceRNA network", "ceRNA 网络"];
uiMessages["plot.mirna-target.name"]=["miRNA–target", "miRNA－靶标图"];
uiMessages["plot.cnet.name"]=["Cnet", "基因－通路网络"];
uiMessages["plot.enrichment-map.name"]=["Enrichment map", "富集网络"];
uiMessages["plot.tree.name"]=["Tree", "树图"];
uiMessages["plot.dendrogram.name"]=["Dendrogram", "树状聚类图"];
uiMessages["plot.circos.name"]=["Circos", "Circos 图"];
uiMessages["plot.manhattan.name"]=["Manhattan", "曼哈顿图"];
uiMessages["plot.qq.name"]=["QQ", "QQ 图"];
uiMessages["plot.chromosome-ideogram.name"]=["Chromosome ideogram", "染色体模式图"];
uiMessages["plot.snp-density.name"]=["SNP density", "SNP 密度"];
uiMessages["plot.genome-tracks.name"]=["Genome tracks", "基因组轨道"];
uiMessages["plot.waterfall.name"]=["Mutation waterfall", "突变瀑布图"];
uiMessages["plot.oncoplot.name"]=["Oncoplot", "突变谱图"];
uiMessages["plot.motif-logo.name"]=["Motif logo", "基序标志图"];
uiMessages["plot.pie.name"]=["Pie", "饼图"];
uiMessages["plot.donut.name"]=["Donut", "环形图"];
uiMessages["plot.waffle.name"]=["Waffle", "华夫图"];
uiMessages["plot.rose.name"]=["Rose", "玫瑰图"];
uiMessages["plot.treemap.name"]=["Treemap", "矩形树图"];
uiMessages["plot.sunburst.name"]=["Sunburst", "旭日图"];
uiMessages["plot.radar.name"]=["Radar", "雷达图"];
uiMessages["plot.polar-profile.name"]=["Polar profile", "极坐标轮廓"];
uiMessages["plot.population-pyramid.name"]=["Population pyramid", "人口金字塔"];
uiMessages["help.0"]=["All intervals are aligned on one coordinate system. The viewer does not infer reference build, strand, transcript model, or assay normalization.", "所有区间对齐到同一坐标系；不推断参考基因组版本、链方向、转录本模型或实验归一化方式。"];
uiMessages["help.1"]=["All record types share explicit chromosome/contig lengths from one reference build. Numeric tracks scale independently and display their ranges; correlation is a signed coefficient in [−1, 1]. link, fusion, and correlation require target intervals and target sequence lengths.", "所有记录使用同一参考版本的明确染色体／contig 长度。数值轨道分别缩放并显示范围；相关系数有正负号，范围为 [−1,1]。连线、融合和相关记录需要目标区间及目标序列长度。"];
uiMessages["help.2"]=["At each X value, every non-reference series is compared with the selected reference using an independent-samples Welch t test. Map mean, SD or SEM, and an explicit integer n ≥ 2. BH correction is applied across all displayed pointwise comparisons. Do not use this calculation for paired or repeated-measures data; supply results from the appropriate upstream model instead.", "每个 X 值处，各非参照系列分别与所选参照进行独立样本 Welch t 检验。需映射均值、SD 或 SEM 和明确的整数 n≥2；BH 校正覆盖全部已显示的逐点比较。不适用于配对或重复测量数据；此类设计应提供合适上游模型的结果。"];
uiMessages["help.3"]=["Auto uses a padded maximum from the mapped values. A manual maximum must be positive and may clip larger values.", "自动上限在映射值最大值之外留白。手动上限必须为正值，可能裁切更大的数值。"];
uiMessages["help.4"]=["Circular view keeps cluster ordering, cut tracks, and annotations. Cell text, dendrogram geometry, and the coordinated side plot are available in rectangular view.", "环形视图保留聚类顺序、切分轨道和注释。单元格文字、树状图几何与联动侧图仅在矩形视图中提供。"];
uiMessages["help.5"]=["Counts are exact membership combinations. Peak mode splits half-open intervals [start, end) into disjoint atomic genomic segments wherever active set membership changes; counts are segments, not base pairs or original peaks. Size weighting is only a visual cue, never an area-proportional fit.", "计数对应精确的集合成员组合。峰模式在活跃集合成员变化处，将半开区间 [start,end) 划分为互不重叠的原子基因组区段；计数对象是区段，不是碱基对或原始峰。大小加权仅为视觉提示，不保证面积按比例拟合。"];
uiMessages["help.6"]=["Dense bins aggregate all rows on one common intensity scale; use Points, Ellipse, or Hull to compare groups.", "密集分箱在同一强度尺度上汇总全部行；比较组别时请使用散点、椭圆或凸包。"];
uiMessages["help.7"]=["Each matrix cell is calculated from paired complete observations. This view reports coefficients, not inferential P values.", "每个矩阵单元由配对完整观测计算；此视图报告相关系数，不提供推断性 P 值。"];
uiMessages["help.8"]=["Ellipses summarize within-group covariance; hulls only enclose observed extremes. Neither is a confidence region. The 3D view independently min–max scales each axis before a fixed orthographic projection, so cross-axis distances, angles, and apparent separation are not quantitative; manual 2D limits do not apply.", "椭圆汇总组内协方差；凸包仅包围观测到的极值，均非置信区域。三维视图先分别对各轴进行最小－最大缩放，再作固定正交投影；跨轴距离、角度与表观分离不可作定量解释，二维手动范围不适用。"];
uiMessages["help.9"]=["Expected quantiles use (i − 0.5) / n. Systematic deviation can reflect polygenicity, confounding, or model misspecification; this view does not estimate genomic inflation by itself.", "期望分位数使用 (i−0.5)/n。系统偏离可能来自多基因性、混杂或模型设定不当；本视图不单独估计基因组膨胀因子。"];
uiMessages["help.10"]=["Independent modes use two-sided Welch t-tests within each group/facet. Summary inference requires explicit integer n ≥ 2 and SD or SEM; n is never inferred. Paired mode requires the same subject IDs in both categories. qPCR displays relative expression but tests biological-replicate ΔCt. Technical replicates must be aggregated before import.", "独立模式在各组／分面内使用双侧 Welch t 检验。汇总数据推断需明确整数 n≥2 以及 SD 或 SEM，不推测 n。配对模式要求两类别具备相同个体 ID。qPCR 展示相对表达，但检验生物学重复的 ΔCt；技术重复须在导入前汇总。"];
uiMessages["help.11"]=["Information mode uses R = 2 − H for DNA and letter height p(base) × R. Probabilities must already include any pseudocount treatment; sample-size correction is not inferred.", "DNA 信息量模式使用 R=2−H，字母高度为 p(base)×R。输入概率须已完成所需伪计数处理；不推断样本量校正。"];
uiMessages["help.12"]=["Kaplan–Meier estimates and censor marks are calculated from individual records. A log-rank P value is intentionally omitted until a tested inferential module is added.", "Kaplan–Meier 估计与删失标记从个体记录计算。当前未提供经过验证的推断模块，因此不输出 log-rank P 值。"];
uiMessages["help.13"]=["Leave blank for data-aware automatic limits. Clipped mapped values are reported below the preview.", "留空则根据数据自动确定范围；预览下方会报告被裁切的映射数值。"];
uiMessages["help.14"]=["Map an already-calculated non-negative half-width. SD describes spread, SEM describes mean precision, and a 95% CI half-width describes an interval around the estimate. A ribbon changes only the display, not the statistic.", "映射已计算好的非负区间半宽。SD 描述离散程度，SEM 描述均值精度，95% CI 半宽描述估计值周围的区间；区间带仅改变显示方式，不改变统计量。"];
uiMessages["help.15"]=["Mirroring is a layout convention, not a negative measurement. Percent mode normalizes each of the two groups independently to 100%.", "镜像是布局约定，并非负测量值。百分比模式将两个组分别归一化到 100%。"];
uiMessages["help.16"]=["Net benefit is evaluated only on the displayed threshold grid. Choose a clinically meaningful interval; a grid step ≤0.01 is recommended when narrow utility regions matter.", "净获益仅在所显示的阈值网格上计算。请选择有临床意义的范围；需要识别狭窄效用区间时建议网格步长≤0.01。"];
uiMessages["help.17"]=["No matching plot. Try a scientific question such as “survival”, “enrichment”, “微生物”, or “相关”.", "未找到匹配图形。可尝试“生存”“富集”“微生物”或“相关”等科研问题。"];
uiMessages["help.18"]=["Node color encodes group and optional value controls size. Edge width encodes weight, arrowheads encode direction, color encodes sign, and dash pattern encodes edge type. Layout coordinates are deterministic for the exported seed but have no biological distance meaning.", "节点颜色编码分组，可选数值控制大小；边宽编码权重，箭头编码方向，颜色编码正负，线型编码边类型。导出种子确定布局坐标，但坐标没有生物学距离含义。"];
uiMessages["help.19"]=["Ordering, distance, linkage, and cut count are deterministic and included in the exported configuration.", "顺序、距离、连接方法及切分数均确定性计算，并保存在导出配置中。"];
uiMessages["help.20"]=["Pearson tests linear association; Spearman tests monotonic rank association. Reported P values use a two-sided t approximation and do not adjust for multiple testing. Confidence ribbons are mean-response intervals for linear fits, not prediction intervals. Ternary rows are normalized to proportions. The 3D view independently min–max scales X, Y, and Z before a fixed-size orthographic projection; it preserves order, not cross-axis units or perspective.", "Pearson 检验线性关联，Spearman 检验单调秩关联。P 值使用双侧 t 近似，不作多重检验校正。线性拟合的带状置信区间针对均值响应，并非预测区间。三元图按行归一化为比例。三维视图分别对 X、Y、Z 作最小－最大缩放后固定尺寸正交投影；保留顺序，不保留跨轴单位或透视关系。"];
uiMessages["help.21"]=["Percentages are calculated from the currently mapped non-negative values. Exported labels retain the underlying total.", "百分比由当前映射的非负数值计算；导出标签保留其对应的总量。"];
uiMessages["help.22"]=["Raw mode computes empirical ROC and trapezoidal AUC per model. Time-dependent mode only displays censoring-aware coordinates, pointwise TPR intervals, horizons, and AUC intervals supplied by a documented upstream method; it never infers them from ordinary binary scores.", "原始模式按模型计算经验 ROC 和梯形积分 AUC。时间依赖模式仅展示经过记录的上游方法提供的删失感知坐标、逐点 TPR 区间、时间点和 AUC 区间，不从普通二元评分推断这些内容。"];
uiMessages["help.23"]=["Ribbon width uses the supplied non-negative weight. Sankey aggregates repeated source–target–group rows and discloses it; Alluvial requires conserved flow IDs across ordered axes. Ligand–receptor scores remain upstream evidence, not causal communication proof.", "带宽使用输入的非负权重。桑基图汇总重复的来源－目标－分组行并明确报告；冲积图要求有序轴间的流 ID 守恒。配体－受体评分属于上游证据，不能作为细胞通讯的因果证明。"];
uiMessages["help.24"]=["Rose sector area is proportional to magnitude, with radius scaled by the square root of the value. Values are not normalized to percentages.", "玫瑰扇区面积与数值大小成比例，半径按数值平方根缩放；不将数值归一化为百分比。"];
uiMessages["help.25"]=["Rows are input alteration events. Waterfall height is event count, not normalized tumor mutation burden. Oncoplot co-occurrence is descriptive and is not a mutual-exclusivity test.", "每行是输入的变异事件。瀑布图高度为事件数，不是归一化肿瘤突变负荷。突变谱的共现为描述性展示，不是互斥检验。"];
uiMessages["help.26"]=["SD describes sample spread, SEM describes mean precision, and the 95% CI uses a two-sided Student t interval. Paired lines require a subject ID. P-value labels display mapped results only; this tool does not choose or run a significance test.", "SD 描述样本离散程度，SEM 描述均值精度；95% CI 使用双侧 Student t 区间。配对连线需要个体 ID。P 值标签仅展示映射的已有结果，本工具不替用户选择或执行显著性检验。"];
uiMessages["help.27"]=["Set the width to 0 for borderless bars. The outline remains fully opaque so it stays legible when fill opacity is reduced.", "边框宽度设为 0 可隐藏边框；边框始终不透明，降低填充透明度后仍可辨识。"];
uiMessages["help.28"]=["Stain and centromere geometry are taken only from uploaded intervals; no cytobands are inferred.", "染色体染色带与着丝粒几何仅来自上传区间，不推断未知染色带。"];
uiMessages["help.29"]=["Studio renders the supplied coordinates without recomputing PCA. Add explained variance to the X/Y axis labels when it is available from the upstream workflow.", "Studio 直接绘制输入坐标，不重新计算 PCA。若上游流程提供解释方差，请将其加入 X／Y 轴标题。"];
uiMessages["help.30"]=["Subjects are sorted by predicted probability and divided into approximately equal-frequency bins separately for each model. Fewer bins are more stable in small cohorts.", "分别对各模型按预测概率排序个体，再划分为近似等频组；较少的分箱在小队列中更稳定。"];
uiMessages["help.31"]=["The first column must match matrix observation names after removing _count, _counts, _tpm, or _fpkm. Duplicate or missing IDs block export.", "第一列须与矩阵观测名称匹配（去除 _count、_counts、_tpm 或 _fpkm 后缀后）；重复或缺失 ID 会阻止导出。"];
uiMessages["help.32"]=["The mapped error column must already contain SD or SEM. Record which statistic you used in the title, axis, caption, or exported config.", "映射的误差列须已包含 SD 或 SEM；请在标题、坐标轴、图注或导出配置中记录所用统计量。"];
uiMessages["help.33"]=["The secondary column uses an independently labelled right-side scale. Use only when the two units are explicit and a shared baseline would be misleading.", "次变量使用独立标注的右侧坐标轴；仅在两者单位明确且共用基线会产生误导时使用。"];
uiMessages["help.34"]=["The side plot summarizes uploaded values before heatmap scaling; correlation heatmaps summarize displayed coefficients.", "侧图汇总热图缩放前的上传值；相关热图的侧图汇总显示的相关系数。"];
uiMessages["help.35"]=["The threshold is a display reference only. Choose genome-wide significance according to the tested hypothesis family and study design; the tool does not adjust P values.", "此阈值仅作显示参考。全基因组显著性应依据受检假设家族及研究设计确定；本工具不调整 P 值。"];
uiMessages["help.36"]=["These values are displayed exactly as supplied and are never inferred from the plotted coordinates. Report the upstream distance, grouping formula, strata/blocking, and permutation scheme in the method note.", "这些数值按输入原样展示，绝不从已绘坐标推断。请在方法说明中记录上游距离、分组公式、分层／区组和置换方案。"];
uiMessages["help.37"]=["Tree branch length encodes hierarchy depth only. Dendrogram branch position uses supplied merge height; horizontal leaf spacing is layout and is not a sample distance.", "树图分支长度仅编码层级深度；树状聚类图分支位置使用输入的合并高度，叶节点水平间距仅为布局，不是样本距离。"];
for(const [en,zh] of [
  [
    "A probability",
    "A 概率"
  ],
  [
    "AUC lower 95% CI",
    "AUC 95% CI 下限"
  ],
  [
    "AUC upper 95% CI",
    "AUC 95% CI 上限"
  ],
  [
    "Adjusted P value",
    "调整后 P 值"
  ],
  [
    "Alteration class",
    "变异类别"
  ],
  [
    "Analysis value (ΔCt)",
    "分析值（ΔCt）"
  ],
  [
    "Assigned points",
    "赋分"
  ],
  [
    "Band label",
    "染色体带标签"
  ],
  [
    "Bin end (bp)",
    "分箱终点（bp）"
  ],
  [
    "Bin start (bp)",
    "分箱起点（bp）"
  ],
  [
    "Biological sample / subject ID",
    "生物学样本／个体 ID"
  ],
  [
    "Biological sample size (n)",
    "生物学样本量（n）"
  ],
  [
    "C probability",
    "C 概率"
  ],
  [
    "Chromosome",
    "染色体"
  ],
  [
    "Chromosome (peak input)",
    "染色体（峰输入）"
  ],
  [
    "Chromosome / contig length",
    "染色体／contig 长度"
  ],
  [
    "Coefficient",
    "系数"
  ],
  [
    "Collection",
    "集合来源"
  ],
  [
    "Cytoband stain",
    "染色体带染色类型"
  ],
  [
    "Dimension 1",
    "维度 1"
  ],
  [
    "Dimension 2",
    "维度 2"
  ],
  [
    "Dimension 3 (3D only)",
    "维度 3（仅三维）"
  ],
  [
    "Direction",
    "方向"
  ],
  [
    "Display label",
    "显示标签"
  ],
  [
    "Edge source",
    "边的来源"
  ],
  [
    "Edge target",
    "边的目标"
  ],
  [
    "Edge type / evidence",
    "边类型／证据"
  ],
  [
    "Edge weight",
    "边权重"
  ],
  [
    "Effect estimate",
    "效应估计"
  ],
  [
    "End",
    "终点"
  ],
  [
    "End (bp)",
    "终点（bp）"
  ],
  [
    "End (peak input)",
    "终点（峰输入）"
  ],
  [
    "Enriched term",
    "富集条目"
  ],
  [
    "Error magnitude (SD / SEM)",
    "误差大小（SD／SEM）"
  ],
  [
    "Estimate",
    "估计值"
  ],
  [
    "Evaluation horizon",
    "评价时间点"
  ],
  [
    "Event (0 / 1)",
    "事件（0／1）"
  ],
  [
    "Evidence / method",
    "证据／方法"
  ],
  [
    "Facet",
    "分面"
  ],
  [
    "Facet / comparison P value",
    "分面／比较 P 值"
  ],
  [
    "False-positive rate",
    "假阳性率"
  ],
  [
    "Feature",
    "特征"
  ],
  [
    "Feature label",
    "特征标签"
  ],
  [
    "Flow ID",
    "流 ID"
  ],
  [
    "Follow-up time",
    "随访时间"
  ],
  [
    "G probability",
    "G 概率"
  ],
  [
    "GO term",
    "GO 条目"
  ],
  [
    "Gene",
    "基因"
  ],
  [
    "Gene count",
    "基因数"
  ],
  [
    "Gene effect",
    "基因效应"
  ],
  [
    "Gene label",
    "基因标签"
  ],
  [
    "Gene ratio",
    "基因比例"
  ],
  [
    "Gene set",
    "基因集"
  ],
  [
    "Gene-set hit (0 / 1)",
    "基因集命中（0／1）"
  ],
  [
    "Hit count",
    "命中数"
  ],
  [
    "Interaction weight",
    "相互作用权重"
  ],
  [
    "Item / peak ID",
    "元素／峰 ID"
  ],
  [
    "KEGG pathway",
    "KEGG 通路"
  ],
  [
    "Label",
    "标签"
  ],
  [
    "Latitude",
    "纬度"
  ],
  [
    "Leaf group",
    "叶节点分组"
  ],
  [
    "Leaf value",
    "叶节点数值"
  ],
  [
    "Level",
    "层级"
  ],
  [
    "Ligand",
    "配体"
  ],
  [
    "Longitude",
    "经度"
  ],
  [
    "Lower CI",
    "置信区间下限"
  ],
  [
    "Magnitude",
    "大小"
  ],
  [
    "Mean expression",
    "平均表达"
  ],
  [
    "Member gene",
    "成员基因"
  ],
  [
    "Merge height",
    "合并高度"
  ],
  [
    "Model",
    "模型"
  ],
  [
    "Node",
    "节点"
  ],
  [
    "Node / edge group",
    "节点／边分组"
  ],
  [
    "Node ID",
    "节点 ID"
  ],
  [
    "Node type",
    "节点类型"
  ],
  [
    "Node value / size",
    "节点数值／大小"
  ],
  [
    "Observed outcome (0 / 1)",
    "观测结局（0／1）"
  ],
  [
    "Ontology",
    "本体类别"
  ],
  [
    "Ontology (BP / CC / MF)",
    "本体类别（BP／CC／MF）"
  ],
  [
    "Ontology / group",
    "本体类别／分组"
  ],
  [
    "Ontology / source",
    "本体类别／来源"
  ],
  [
    "Ordered angle category",
    "有序角度类别"
  ],
  [
    "Ordered axis",
    "有序轴"
  ],
  [
    "Ordered category",
    "有序类别"
  ],
  [
    "Parent",
    "父节点"
  ],
  [
    "Parent ID",
    "父节点 ID"
  ],
  [
    "Pathway",
    "通路"
  ],
  [
    "Pathway group",
    "通路分组"
  ],
  [
    "Position",
    "位置"
  ],
  [
    "Position (bp)",
    "位置（bp）"
  ],
  [
    "Positive weight",
    "正权重"
  ],
  [
    "Predicted probability",
    "预测概率"
  ],
  [
    "Prediction / ranking score",
    "预测／排序评分"
  ],
  [
    "Prediction score",
    "预测评分"
  ],
  [
    "Predictor",
    "预测变量"
  ],
  [
    "Rank",
    "排序位置"
  ],
  [
    "Ranked background size",
    "排序背景大小"
  ],
  [
    "Ranked statistic",
    "排序统计量"
  ],
  [
    "Receiver cell",
    "接收细胞"
  ],
  [
    "Receptor",
    "受体"
  ],
  [
    "Record type",
    "记录类型"
  ],
  [
    "Record type (node / edge)",
    "记录类型（节点／边）"
  ],
  [
    "Ribbon group",
    "区间带分组"
  ],
  [
    "Risk score",
    "风险评分"
  ],
  [
    "Running enrichment score",
    "运行富集得分"
  ],
  [
    "Sample",
    "样本"
  ],
  [
    "Sample size (n)",
    "样本量（n）"
  ],
  [
    "Secondary value",
    "次变量数值"
  ],
  [
    "Sender cell",
    "发送细胞"
  ],
  [
    "Series",
    "系列"
  ],
  [
    "Set",
    "集合"
  ],
  [
    "Shape",
    "形状"
  ],
  [
    "Sign",
    "正负号"
  ],
  [
    "Site",
    "位点"
  ],
  [
    "Source",
    "来源"
  ],
  [
    "Standard deviation (SD)",
    "标准差（SD）"
  ],
  [
    "Standard error",
    "标准误"
  ],
  [
    "Standard error (SEM)",
    "标准误（SEM）"
  ],
  [
    "Start",
    "起点"
  ],
  [
    "Start (bp)",
    "起点（bp）"
  ],
  [
    "Start (peak input)",
    "起点（峰输入）"
  ],
  [
    "Stratum",
    "分层"
  ],
  [
    "Study",
    "研究"
  ],
  [
    "Subject / pair ID",
    "个体／配对 ID"
  ],
  [
    "Subject ID",
    "个体 ID"
  ],
  [
    "Supplied cutoff",
    "用户提供截点"
  ],
  [
    "T probability",
    "T 概率"
  ],
  [
    "TPR lower 95% CI",
    "TPR 95% CI 下限"
  ],
  [
    "TPR upper 95% CI",
    "TPR 95% CI 上限"
  ],
  [
    "Target",
    "目标"
  ],
  [
    "Target chromosome",
    "目标染色体"
  ],
  [
    "Target chromosome / contig length",
    "目标染色体／contig 长度"
  ],
  [
    "Target end",
    "目标终点"
  ],
  [
    "Target start",
    "目标起点"
  ],
  [
    "Target value",
    "目标值"
  ],
  [
    "Term FDR",
    "条目 FDR"
  ],
  [
    "Term hit count",
    "条目命中数"
  ],
  [
    "Tested background size",
    "受检背景大小"
  ],
  [
    "Track",
    "轨道"
  ],
  [
    "Track value",
    "轨道数值"
  ],
  [
    "True class (0 / 1)",
    "真实类别（0／1）"
  ],
  [
    "True-positive rate",
    "真阳性率"
  ],
  [
    "Uncertainty half-width (SD / SEM / 95% CI)",
    "不确定性半宽（SD／SEM／95% CI）"
  ],
  [
    "Upper CI",
    "置信区间上限"
  ],
  [
    "Upstream impact score",
    "上游影响评分"
  ],
  [
    "Value / link weight",
    "数值／连线权重"
  ],
  [
    "Variable",
    "变量"
  ],
  [
    "Variant / locus label",
    "变异／位点标签"
  ],
  [
    "Variant count / density",
    "变异数／密度"
  ],
  [
    "Variant label",
    "变异标签"
  ],
  [
    "Weight",
    "权重"
  ],
  [
    "Z / third component",
    "Z／第三成分"
  ],
  [
    "Z component (3D only)",
    "Z 成分（仅三维）"
  ],
  [
    "log2 fold change",
    "log₂ 倍数变化"
  ],
  [
    "Column mapping",
    "列映射"
  ],
  [
    "PCA input",
    "PCA 输入"
  ],
  [
    "Select column",
    "选择列"
  ],
  [
    "Blank or duplicate identifier.",
    "标识符为空或重复。"
  ],
  [
    "Non-numeric value; it will not be converted to zero.",
    "非数值内容，不会转换为零。"
  ],
  [
    "Missing cell preserved; no imputation applied.",
    "保留缺失单元格，不自动插补。"
  ],
  [
    "Empty or duplicate header; rename it before importing.",
    "列名为空或重复，请重命名后导入。"
  ],
  [
    "Leading-zero ID preserved as text.",
    "含前导零的 ID 按文本保留。"
  ],
  [
    "ID spaces preserved; alignment uses exact IDs.",
    "保留 ID 空格，按精确 ID 对齐。"
  ],
  [
    "Comparison",
    "比较"
  ],
  [
    "Association",
    "关联"
  ],
  [
    "Cancer genomics",
    "肿瘤基因组"
  ],
  [
    "Cell communication",
    "细胞通讯"
  ],
  [
    "Clinical prediction",
    "临床预测"
  ],
  [
    "Composition",
    "组成"
  ],
  [
    "Cyclic comparison",
    "周期比较"
  ],
  [
    "Cyclic profile",
    "周期轮廓"
  ],
  [
    "Differential analysis",
    "差异分析"
  ],
  [
    "Dimension reduction",
    "降维"
  ],
  [
    "Distribution",
    "分布"
  ],
  [
    "Enrichment relationships",
    "富集关系"
  ],
  [
    "Evidence synthesis",
    "证据综合"
  ],
  [
    "Flow",
    "流向"
  ],
  [
    "Genomic association",
    "基因组关联"
  ],
  [
    "Genomic context",
    "基因组环境"
  ],
  [
    "Hierarchical clustering",
    "层次聚类"
  ],
  [
    "Hierarchical composition",
    "层级组成"
  ],
  [
    "Hierarchy",
    "层级"
  ],
  [
    "Matrix",
    "矩阵"
  ],
  [
    "Model development",
    "模型开发"
  ],
  [
    "Model evaluation",
    "模型评价"
  ],
  [
    "Molecular interactions",
    "分子相互作用"
  ],
  [
    "Multi-stage flow",
    "多阶段流向"
  ],
  [
    "Multivariate profile",
    "多变量轮廓"
  ],
  [
    "Paired distribution",
    "配对分布"
  ],
  [
    "Pathway analysis",
    "通路分析"
  ],
  [
    "Ranking",
    "排序"
  ],
  [
    "Regulatory relationships",
    "调控关系"
  ],
  [
    "Relationships",
    "关系"
  ],
  [
    "Sequence motif",
    "序列基序"
  ],
  [
    "Set relationships",
    "集合关系"
  ],
  [
    "Specialized",
    "专项"
  ],
  [
    "Trend",
    "趋势"
  ]
]) uiMessages[`role.${en}`]=[en,zh];
const sourceKeys=new Map(Object.entries(uiMessages).map(([key,[en]])=>[en,key]));
export function translateUi(source:string,locale:StudioLocale):string {
 if(source.endsWith(' *'))return translateUi(source.slice(0,-2),locale)+' *';
 const key=sourceKeys.get(source);if(key)return uiMessages[key][locale==='zh'?1:0];
 // New workflow labels carry an explicit bilingual pair, not arbitrary user text.
 const parts=source.split(' / ');if(parts.length===2 && /[\u3400-\u9fff]/.test(parts[1]))return parts[locale==='zh'?1:0];
 return source;
}
