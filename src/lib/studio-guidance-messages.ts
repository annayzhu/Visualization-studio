/** Existing English registry contracts paired with the original full Chinese guidance. */
export const guidanceMessages:Record<string,[string,string]>={
  "help.bar.definition": [
    "One categorical family for grouped, stacked, radial, target, overlay, and uncertainty comparisons.",
    "以共同基线上的长度编码类别汇总量；同一数据契约可切换分组、堆叠、百分比、双向、分面、极坐标、目标线、断轴、双轴和叠加表达。柱形仍代表汇总量，而不是完整原始分布。"
  ],
  "help.bar.data": [
    "Choose a visualization-only, supplied-P, independent raw, summary-statistics, paired, or qPCR ΔCt workflow. Inference requires biological IDs or explicit n.",
    "离散类别的计数、比例、均值或其他汇总值；可输入预先计算的 SD/SEM，也可由长表重复观测计算。Bullet 需要目标值，叠加/双轴需要第二数值，显著性标记需要有效 P 值。"
  ],
  "help.bar.question": [
    "One categorical family for grouped, stacked, radial, target, overlay, and uncertainty comparisons.",
    "类别间大小、组成、方向、分层差异或相对目标的偏离。百分比图回答组成而非绝对量；双轴仅用于单位明确且必须同时展示的指标。"
  ],
  "help.line.definition": [
    "Time-course or ordered trend with multiple series and visible markers.",
    "按实际 X 采样值的自然顺序连接相邻估计值，以位置和线段方向编码连续变化；可将预先计算的 SD、SEM 或 95% CI 半宽显示为逐点误差棒或连续不确定性带。"
  ],
  "help.line.data": [
    "One row per ordered estimate. Map SD or SEM plus sample size to calculate reference-series Welch tests at each X value, or display uncertainty without testing.",
    "具有自然顺序的时间、剂量或阶段数据；每行应是一个估计值。若计算逐时间点显著性，必须提供均值、SD 或 SEM、显式样本量 n 和分组，并明确数据不是配对或重复测量。"
  ],
  "help.line.question": [
    "Time-course or ordered trend with multiple series and visible markers.",
    "指标随顺序如何变化，不同序列的方向、速度或响应模式是否不同，以及已给定的不确定性范围有多大。可选 Welch 检验只回答各时间点相对参考组的独立样本差异，不检验整体时间×组交互。"
  ],
  "help.scatter.definition": [
    "Compact association views from points and marginals to fitted, dense, three-axis, and compositional encodings.",
    "把观察对象映射到二维位置；可叠加边际分布、二维密度、六边形计数、协方差椭圆、凸包、三变量散点矩阵、正交 3D 投影或三元组成坐标。每种变体回答的问题不同，并非装饰性切换。"
  ],
  "help.scatter.data": [
    "One row per observation. X and Y are required; Z is additionally required for pair-matrix, 3D, and ternary views.",
    "标准视图需要两个连续变量；pair-matrix 与 3D 需要第三个连续变量；ternary 需要三个非负且每行总和大于零的组成分量。分组可决定颜色以及拟合/统计是合并还是组内计算。"
  ],
  "help.scatter.question": [
    "Compact association views from points and marginals to fitted, dense, three-axis, and compositional encodings.",
    "变量的联合分布、局部密度、非线性趋势、组内包络、三变量关系或三部分组成权衡是什么。3D 投影会损失深度判断，ternary 只表示相对组成。"
  ],
  "help.pca.definition": [
    "Plot supplied principal-component coordinates or calculate PCA locally from a wide feature matrix.",
    "一种线性无监督降维方法，把高维数据旋转到相互正交、按解释方差由高到低排列的主成分轴；scores 表示观察对象，loadings 表示特征对各轴的贡献。"
  ],
  "help.pca.data": [
    "Choose supplied coordinates when PCA was calculated upstream, or matrix calculation when the first column identifies features and remaining columns are observations.",
    "高维特征×观察矩阵，如组学、影像特征、形态学、光谱、传感器或标准化临床特征。矩阵模式会透明记录过滤、变换、中心化与缩放。"
  ],
  "help.pca.question": [
    "Plot supplied principal-component coordinates or calculate PCA locally from a wide feature matrix.",
    "主要变异轴是什么，观察对象是否聚集、分离或存在离群点，哪些特征推动这些轴，以及分组或批次是否与总体结构相关。Scree 图用于判断方差在各主成分间如何分配。"
  ],
  "help.box.definition": [
    "Median, IQR, whiskers, and all observations without hiding sample size.",
    "用中位数、上下四分位数、四分位距和按规则定义的“须”概括分布；须不一定代表最小值和最大值。"
  ],
  "help.box.data": [
    "Long format: one row per observation.",
    "一个或多个分组下的连续原始观测值。"
  ],
  "help.box.question": [
    "Median, IQR, whiskers, and all observations without hiding sample size.",
    "各组的中位数、四分位范围、离群值和整体离散程度有何不同。"
  ],
  "help.violin.definition": [
    "Kernel-density distribution with median and raw observations.",
    "把核密度估计沿中心轴镜像形成“琴身”，并可叠加中位数、箱线或原始点来展示分布形状。"
  ],
  "help.violin.data": [
    "Long format. At least three values per group are recommended.",
    "各组具有足够观测数的连续数据，适合展示分布密度。"
  ],
  "help.violin.question": [
    "Kernel-density distribution with median and raw observations.",
    "各组分布的形状、偏态、长尾或多峰特征是否不同。"
  ],
  "help.volcano.definition": [
    "Effect size versus significance with explicit FC and FDR thresholds.",
    "以效应量（常为 log₂ fold change）为 X，以 −log₁₀(P 值或 FDR) 为 Y 的差异结果散点图。"
  ],
  "help.volcano.data": [
    "Use adjusted P values when available; values must be greater than zero.",
    "每个特征具有效应量和 P 值或校正 P 值的差异分析结果。"
  ],
  "help.volcano.question": [
    "Effect size versus significance with explicit FC and FDR thresholds.",
    "哪些特征同时具有较大的变化幅度和较强的统计证据，变化方向是什么。"
  ],
  "help.heatmap.definition": [
    "Compact expression matrix with row scaling and a centered diverging scale.",
    "把数值矩阵的每个单元格映射为颜色；如果未启用聚类，行列顺序完全由输入数据决定。"
  ],
  "help.heatmap.data": [
    "First column is the row label; remaining columns must be numeric samples.",
    "行列结构明确的数值矩阵，可使用原始尺度或经过合理标准化的值。"
  ],
  "help.heatmap.question": [
    "Compact expression matrix with row scaling and a centered diverging scale.",
    "二维矩阵中哪些区域呈现高低模式、梯度、块状结构或异常值。"
  ],
  "help.enrichment.definition": [
    "Term, ratio, count, and FDR encoded independently and legibly.",
    "每个功能条目用一个点表示，通常以位置编码富集比例、点大小编码命中数、颜色编码校正 P 值。"
  ],
  "help.enrichment.data": [
    "One row per precomputed term with tested background, ratio, count, and FDR. Ratios may be decimals or fractions such as 8/40; this module does not run enrichment.",
    "预计算富集结果表，包含条目、明确测试背景、富集比例、命中数量和 FDR；数据库版本与多重校正方法应保存在分析记录中。"
  ],
  "help.enrichment.question": [
    "Term, ratio, count, and FDR encoded independently and legibly.",
    "哪些功能条目同时具有较强统计证据、较高富集比例和足够命中数量。"
  ],
  "help.correlation.definition": [
    "Association views with explicit Pearson or Spearman statistics, optional P values, fitted curves, and confidence bands.",
    "在成对数值的可视分布基础上，用 Pearson r 或 Spearman ρ 量化方向与强度；可选 P 值明确标注为 Pearson t 检验或 Spearman 的渐近 t 近似。"
  ],
  "help.correlation.data": [
    "One row per paired observation. X and Y are required; Z is additionally required for pair-matrix, 3D, and ternary views.",
    "成对连续或有序数值；Pearson 适合近似线性且无强影响点的关系，Spearman 适合单调关系或秩数据。组内模式要求每组有足够样本。"
  ],
  "help.correlation.question": [
    "Association views with explicit Pearson or Spearman statistics, optional P values, fitted curves, and confidence bands.",
    "两变量关系的方向、强度与在指定检验假设下的兼容性如何；P 值不等于效应大小，相关也不说明因果。"
  ],
  "help.ma.definition": [
    "Mean abundance versus log2 fold change with FDR and effect-size highlighting.",
    "以平均丰度 A 为横轴、两条件的对数比值 M 为纵轴，检查效应量是否随总体信号强度变化。"
  ],
  "help.ma.data": [
    "Use a positive baseMean/mean-expression column, log2 fold change, and adjusted P value.",
    "每个特征具有平均丰度、效应量及统计证据的差异分析结果。"
  ],
  "help.ma.question": [
    "Mean abundance versus log2 fold change with FDR and effect-size highlighting.",
    "变化幅度是否依赖总体丰度，低丰度区域是否存在偏差或异常波动。"
  ],
  "help.quadrant.definition": [
    "Two-dimensional comparison divided by independently adjustable X and Y thresholds.",
    "用一条 X 阈值线和一条 Y 阈值线把散点图分成四个决策区域，以比较两套量化结果的一致与不一致。"
  ],
  "help.quadrant.data": [
    "One row per item with numeric X/Y values; group and label are optional.",
    "同一对象的两套效应量、评分或测量值，并具有可解释的 X/Y 阈值。"
  ],
  "help.quadrant.question": [
    "Two-dimensional comparison divided by independently adjustable X and Y thresholds.",
    "两套结果在哪些区域一致或不一致，哪些对象跨越预设决策阈值。"
  ],
  "help.errorbar.definition": [
    "Mean points with symmetric SD or SEM intervals and no compulsory bars.",
    "用中心标记配合端帽线段表示估计值及其不确定性或离散程度；必须明确线段是 SD、SEM 还是置信区间。"
  ],
  "help.errorbar.data": [
    "Map a mean and an already-calculated non-negative SD or SEM column.",
    "类别汇总值及对应的非负 SD 或 SEM；误差类型必须事先明确。"
  ],
  "help.errorbar.question": [
    "Mean points with symmetric SD or SEM intervals and no compulsory bars.",
    "各组中心估计及其变异或估计精度如何，不替代原始数据分布。"
  ],
  "help.area.definition": [
    "Ordered trajectories with restrained translucent fills and visible outlines.",
    "在有序 X 上绘制折线并填充到基线的面积，以强调总量、累计量或趋势的视觉重量。"
  ],
  "help.area.data": [
    "Long format with numeric X, numeric value, and optional series.",
    "有序 X 上的连续数值或多条序列，适合强调整体量级或累积变化。"
  ],
  "help.area.question": [
    "Ordered trajectories with restrained translucent fills and visible outlines.",
    "趋势和总体量级如何随顺序变化；重叠面积较多时不适合精确组间比较。"
  ],
  "help.lollipop.definition": [
    "Compact ranked values using stems and emphasized endpoints.",
    "用从基线伸出的细杆和末端圆点编码数值，保留柱状图的共同基线，同时降低大面积色块的视觉重量。"
  ],
  "help.lollipop.data": [
    "One row per category with a numeric value and optional group.",
    "类别对应的单个数值、效应量、评分或排名。"
  ],
  "help.lollipop.question": [
    "Compact ranked values using stems and emphasized endpoints.",
    "项目的排序、极端值和相对大小是什么，同时减少实心柱的视觉重量。"
  ],
  "help.beeswarm.definition": [
    "Deterministically packed raw observations without an enclosing box.",
    "把每个原始观察值画成点，并在分类轴方向进行防重叠排列；点群宽度来自排布，不是核密度估计。"
  ],
  "help.beeswarm.data": [
    "Long format: one row per raw observation. At least three values per group are recommended.",
    "样本量较小或中等的分组连续数据，希望保留每一个原始观察点。"
  ],
  "help.beeswarm.question": [
    "Deterministically packed raw observations without an enclosing box.",
    "数据实际分散在哪里，是否存在重复、空档、离群点和组内异质性。"
  ],
  "help.raincloud.definition": [
    "Density, raw observations, and compact summaries in one layered view.",
    "把半小提琴密度“云”、原始观察点“雨”和箱线或区间摘要组合在同一组中。"
  ],
  "help.raincloud.data": [
    "Long format: one row per raw observation. At least three values per group are recommended.",
    "分组连续原始数据，且希望同时展示密度、稳健汇总和单个观察。"
  ],
  "help.raincloud.question": [
    "Density, raw observations, and compact summaries in one layered view.",
    "组间中心趋势、分布形状和个体变异能否同时得到支持。"
  ],
  "help.histogram.definition": [
    "Deterministically binned frequency distributions for grouped observations.",
    "把连续数值划入等宽区间，以每个区间的频数绘制相邻矩形；图形形状会随箱数改变。"
  ],
  "help.histogram.data": [
    "Long format: one row per raw observation. At least three values per group are recommended.",
    "单组或多组连续原始观测，可按分组与分面比较；应报告箱数或箱宽。"
  ],
  "help.histogram.question": [
    "Deterministically binned frequency distributions for grouped observations.",
    "数据集中在哪些范围，是否偏态、多峰、长尾或存在稀疏区间。"
  ],
  "help.density.definition": [
    "Kernel-density estimates with explicit bandwidth and optional raw-data layers.",
    "用核函数平滑每个观察值并求和，得到连续概率密度估计；曲线面积而非高度总和对应 1。"
  ],
  "help.density.data": [
    "Long format: one row per raw observation. At least three values per group are recommended.",
    "具有足够样本量的连续原始观测；带宽必须可追踪并避免把小样本的平滑形状当作真实结构。"
  ],
  "help.density.question": [
    "Kernel-density estimates with explicit bandwidth and optional raw-data layers.",
    "分布的整体形状、偏态、峰和尾部如何，且这些形状对带宽是否稳定。"
  ],
  "help.ridge.definition": [
    "Overlapping kernel-density profiles arranged as compact ridgelines.",
    "把多个密度曲线沿分类轴错开排列，以紧凑方式比较许多组的分布轮廓。"
  ],
  "help.ridge.data": [
    "Long format: one row per raw observation. At least three values per group are recommended.",
    "多个有序或可比较分组的连续原始观测，尤其适合时间点、剂量层级或细胞群。"
  ],
  "help.ridge.question": [
    "Overlapping kernel-density profiles arranged as compact ridgelines.",
    "分布位置与形状如何沿组别移动；曲线重叠较多时不适合精确读取单个密度值。"
  ],
  "help.pcoa.definition": [
    "Publication-ready display of principal-coordinate scores from a documented distance analysis.",
    "从样本间距离或相异度矩阵出发，通过特征分解构造低维坐标；它不是直接对原始特征矩阵做 PCA。"
  ],
  "help.pcoa.data": [
    "Upload precomputed PCoA coordinates and document the upstream distance metric; coordinates are never silently recomputed.",
    "由明确距离或相异度度量得到的 PCoA 坐标，常见于生态、微生物群、组成或其他距离型数据。"
  ],
  "help.pcoa.question": [
    "Publication-ready display of principal-coordinate scores from a documented distance analysis.",
    "在所选距离定义下，各观察对象的相似性结构和组间分离情况如何。"
  ],
  "help.umap.definition": [
    "Publication-ready display of a precomputed UMAP embedding.",
    "一种非线性流形学习方法，先构建高维邻域图，再寻找尽量保留局部邻域结构的低维嵌入。"
  ],
  "help.umap.data": [
    "Upload precomputed UMAP coordinates; preserve the upstream seed, neighbors, minimum distance, and metric in your analysis record.",
    "高维数据上游计算得到的 UMAP 坐标，如单细胞、多组学、影像或表型特征。"
  ],
  "help.umap.question": [
    "Publication-ready display of a precomputed UMAP embedding.",
    "局部邻域、亚群和异质性结构如何；不宜把远距离直接解释为定量差异。"
  ],
  "help.tsne.definition": [
    "Publication-ready display of a precomputed t-SNE embedding.",
    "t-SNE 以高维与低维邻域概率分布之间的差异为目标进行非线性嵌入；本模块只展示上游已计算坐标，不重新拟合。"
  ],
  "help.tsne.data": [
    "Upload precomputed t-SNE coordinates; preserve the upstream seed, perplexity, metric, initialization, and iterations.",
    "由记录了随机种子、perplexity、距离度量、初始化与迭代设置的 t-SNE 流程产生的样本或细胞坐标。"
  ],
  "help.tsne.question": [
    "Publication-ready display of a precomputed t-SNE embedding.",
    "局部邻域和潜在亚群在所给嵌入中如何组织。簇间距离、簇面积与全局方向通常没有直接定量含义。"
  ],
  "help.nmds.definition": [
    "Publication-ready display of precomputed non-metric multidimensional scaling coordinates.",
    "非度量多维尺度分析仅要求低维距离保持原始相异度的秩次关系，通过最小化 stress 得到配置；本模块展示预计算结果。"
  ],
  "help.nmds.data": [
    "Upload precomputed NMDS coordinates; preserve the dissimilarity, dimensions, starts, convergence, and stress.",
    "由明确相异度（如 Bray–Curtis）和多次随机起点得到的 NMDS 坐标，并应同时记录维数、收敛状态与 stress。"
  ],
  "help.nmds.question": [
    "Publication-ready display of precomputed non-metric multidimensional scaling coordinates.",
    "在相异度排序意义下样本结构、梯度和组间重叠如何；轴方向与绝对尺度本身通常没有固定含义。"
  ],
  "help.clustered-heatmap.definition": [
    "Matrix heatmap with explicit, deterministic row and column clustering.",
    "先按指定距离和连接方法对行列进行层次聚类，再按树状图顺序重排热图；颜色和树结构表达的是两层信息。"
  ],
  "help.clustered-heatmap.data": [
    "First column supplies row labels; every remaining column must be numeric.",
    "可比较的数值矩阵；行列聚类前应明确缩放、距离和连接方法。"
  ],
  "help.clustered-heatmap.question": [
    "Matrix heatmap with explicit, deterministic row and column clustering.",
    "哪些行或列具有相似模式，是否形成候选亚群、模块或共变结构。"
  ],
  "help.correlation-heatmap.definition": [
    "Pearson or Spearman correlation calculated across numeric columns and displayed as a symmetric matrix.",
    "以同一组变量同时作为行和列，用颜色编码每对变量的相关系数，因此矩阵通常对称且对角线为 1。"
  ],
  "help.correlation-heatmap.data": [
    "First column supplies row labels; every remaining column must be numeric.",
    "同一批观察上测量的多个连续或有序变量。"
  ],
  "help.correlation-heatmap.question": [
    "Pearson or Spearman correlation calculated across numeric columns and displayed as a symmetric matrix.",
    "变量之间的相关方向、强度、冗余和潜在模块结构是什么。"
  ],
  "help.enrichment-bar.definition": [
    "Ranked pathway bars with FDR encoded by a continuous color scale.",
    "每个功能条目对应一根横向或纵向柱，柱长编码富集比例、计数或效应量，主要用于清晰排序。"
  ],
  "help.enrichment-bar.data": [
    "One row per precomputed term with tested background, ratio, and FDR; ratios may be decimals or fractions such as 8/40. This module does not run enrichment.",
    "可排序的预计算富集结果表，至少包含条目、明确测试背景、富集比例和 FDR。"
  ],
  "help.enrichment-bar.question": [
    "Ranked pathway bars with FDR encoded by a continuous color scale.",
    "最主要的富集条目如何排序，其效应或富集程度有多大。"
  ],
  "help.gsea.definition": [
    "Running enrichment score with ranked-position hit ticks.",
    "沿完整的排序特征列表计算运行和统计量，并标出基因集成员命中位置和 leading-edge 区域。"
  ],
  "help.gsea.data": [
    "Use the running-score output of a documented GSEA workflow; hit must be 0/1. The plotter does not invent NES or FDR.",
    "基于完整排序列表计算的运行富集分数和基因集命中位置。"
  ],
  "help.gsea.question": [
    "Running enrichment score with ranked-position hit ticks.",
    "一个基因集主要富集在排序列表的哪一端，驱动富集的命中集中在哪里。"
  ],
  "help.go-circle.definition": [
    "Circular GO term overview grouped by BP, CC, and MF with count and FDR encodings.",
    "把预计算 GO 条目排列在装饰性圆周上，以颜色表示 FDR、圆面积近似表示命中数，并保留 BP、CC、MF 本体分组。"
  ],
  "help.go-circle.data": [
    "Use precomputed GO enrichment results. Supply ontology, gene ratio, hit count, FDR, and tested background size; this module does not run enrichment.",
    "具有明确背景基因数、Gene ratio、命中数和 FDR 的 GO 富集结果；本模块不执行富集检验。"
  ],
  "help.go-circle.question": [
    "Circular GO term overview grouped by BP, CC, and MF with count and FDR encodings.",
    "哪些 GO 条目在三个本体分支中具有更强证据或更多命中；圆周位置不表示条目相似度。"
  ],
  "help.kegg-circle.definition": [
    "Circular KEGG pathway overview with pathway groups, counts, ratios, and FDR.",
    "把预计算 KEGG 通路以圆形概览展示，颜色、面积分别编码 FDR 与命中数。"
  ],
  "help.kegg-circle.data": [
    "Use precomputed KEGG enrichment output with a declared tested background; the circular position is decorative and does not recalculate pathways.",
    "具有明确测试背景、Gene ratio、命中数和 FDR 的 KEGG 富集结果。"
  ],
  "help.kegg-circle.question": [
    "Circular KEGG pathway overview with pathway groups, counts, ratios, and FDR.",
    "哪些通路兼具统计证据和命中规模；圆周顺序与距离没有定量含义。"
  ],
  "help.go-chord.definition": [
    "Term–gene membership links arranged as a compact circular relationship diagram.",
    "以圆形节点和弦线展示 GO term 与成员基因的多对多关系，线宽只编码明确提供的基因效应绝对值。"
  ],
  "help.go-chord.data": [
    "One row per precomputed GO term–gene membership. Repeat term-level ratio, count, FDR, ontology, and tested background consistently across member rows.",
    "预计算 GO term–gene membership 长表，并在同一 term 的各行一致重复背景、ratio、count 与 FDR。"
  ],
  "help.go-chord.question": [
    "Term–gene membership links arranged as a compact circular relationship diagram.",
    "哪些基因同时连接多个富集条目，成员效应方向如何；曲率和弧顺序不代表统计距离。"
  ],
  "help.pathway-impact.definition": [
    "Supplied pathway-topology impact versus FDR with hit-count bubbles.",
    "把上游拓扑感知方法给出的 pathway impact 与 −log10(FDR) 放在正交坐标上，并以点面积表示命中数。"
  ],
  "help.pathway-impact.data": [
    "Use impact scores from a documented upstream topology-aware pathway method. Supply ratio, count, FDR, pathway group, and tested background; impact is never inferred here.",
    "已由明确算法计算的 pathway impact、FDR、Gene ratio、命中数和背景；不能把普通富集比例伪装成 impact。"
  ],
  "help.pathway-impact.question": [
    "Supplied pathway-topology impact versus FDR with hit-count bubbles.",
    "哪些通路同时有较高拓扑影响和统计证据；影响分数的定义取决于上游方法。"
  ],
  "help.nes-fdr.definition": [
    "Signed normalized enrichment scores with FDR encoded independently.",
    "以共同零基线显示带方向的 NES，并独立披露 FDR。"
  ],
  "help.nes-fdr.data": [
    "Use precomputed NES and FDR values from a documented ranked-set analysis; include gene ratio and tested background for context.",
    "由 GSEA 或兼容 ranked-set 方法预计算的 NES、FDR、Gene ratio、集合来源和排序背景。"
  ],
  "help.nes-fdr.question": [
    "Signed normalized enrichment scores with FDR encoded independently.",
    "哪些基因集富集于排序列表上端或下端，以及证据强弱如何。"
  ],
  "help.multi-gsea.definition": [
    "Multiple supplied running-enrichment curves over one complete common ranked list, with hit positions, NES, and FDR.",
    "在同一完整共同排序坐标中叠加多个预计算 running-ES 轨迹，并显示各自命中位置、NES 和 FDR。"
  ],
  "help.multi-gsea.data": [
    "Provide precomputed running scores and 0/1 hit indicators at representative positions spanning rank 0 through one common ranked-background endpoint for every set. Running ES must be zero at both endpoints; repeat constant per-set NES and FDR.",
    "每个集合在从 0 到共同 background 端点、足够密集且递增的 rank 网格上的 running ES 与 0/1 hits；两端 ES=0，集合内 NES/FDR 恒定。"
  ],
  "help.multi-gsea.question": [
    "Multiple supplied running-enrichment curves over one complete common ranked list, with hit positions, NES, and FDR.",
    "多个集合的富集方向、峰位置和 hit density 如何在同一排序尺度上比较；曲线只显示上游结果，不重算统计量。"
  ],
  "help.enrichment-ridge.definition": [
    "Per-term distributions of supplied member-level ranked statistics.",
    "按富集条目分层绘制成员级排序统计量的核密度，每一条密度独立归一化。"
  ],
  "help.enrichment-ridge.data": [
    "Provide member-level statistics for each precomputed enriched term and repeat its FDR, gene ratio, and tested background consistently; density is normalized within term.",
    "每个预计算富集条目下的成员基因及其排名统计量，并一致重复 term 的 FDR、ratio 与背景。"
  ],
  "help.enrichment-ridge.question": [
    "Per-term distributions of supplied member-level ranked statistics.",
    "不同条目的成员统计量主要位于排序的哪一侧、分布是否集中；ridge 高度不能跨条目比较总量。"
  ],
  "help.sankey-bubble.definition": [
    "Non-conserved source-to-term relationship ribbons combined with term bubbles for ratios and counts.",
    "用非守恒 relationship ribbon 连接来源本体与条目，以每条独立 ribbon 的宽度表示 ratio、bubble 面积近似表示 count；它不是满足流量守恒的 Sankey 图。"
  ],
  "help.sankey-bubble.data": [
    "Use precomputed enrichment rows with source collection, term, gene ratio, hit count, FDR, and tested background. Each ribbon width is an independent ratio; unlike a Sankey flow, widths are not conserved or summed at the source.",
    "每个预计算富集条目的来源、背景、ratio、count 与 FDR；各 ratio 不要求在来源内相加为固定总量。"
  ],
  "help.sankey-bubble.question": [
    "Non-conserved source-to-term relationship ribbons combined with term bubbles for ratios and counts.",
    "不同来源关联哪些条目以及单条关联的相对规模如何；面积和宽度不适合精确读数，也不能解释成来源总流量的分配。"
  ],
  "help.geographic-map.definition": [
    "Approximate equirectangular site locations with value-sized points.",
    "以等距圆柱投影近似定位经纬度站点，并用点面积表示非负量值。"
  ],
  "help.geographic-map.data": [
    "One row per site with decimal latitude, longitude, non-negative value, and optional group. This is a locator map, not a boundary, distance, or area analysis.",
    "十进制度纬度、经度、站点名称与量值；不包含行政边界推断。"
  ],
  "help.geographic-map.question": [
    "Approximate equirectangular site locations with value-sized points.",
    "观察站点大致位于何处、哪些区域量值更大；投影会扭曲距离和面积。"
  ],
  "help.petal.definition": [
    "Decorative radial ranking with value-proportional petal lengths.",
    "以花瓣长度近似编码类别值的装饰性径向排名图。"
  ],
  "help.petal.data": [
    "One row per category with a non-negative value. Use bars or dots when accurate magnitude comparison is required.",
    "少量类别及非负汇总值，适合概览或海报式摘要。"
  ],
  "help.petal.question": [
    "Decorative radial ranking with value-proportional petal lengths.",
    "哪些维度相对突出；角度与花瓣形状降低精确比较能力，正式定量比较优先使用 bar/dot。"
  ],
  "help.word-cloud.definition": [
    "Deterministic word-size overview for qualitative prominence.",
    "以字号近似表示词项权重，并采用确定性网格避免随机位置漂移。"
  ],
  "help.word-cloud.data": [
    "One row per unique term with a strictly positive weight. Font size supports approximate prominence only; position and color are non-quantitative.",
    "唯一词项及严格正权重，例如文本频次或主题权重。"
  ],
  "help.word-cloud.question": [
    "Deterministic word-size overview for qualitative prominence.",
    "哪些词更突出；位置、方向和颜色没有数量含义，字号也不适合精确比值判断。"
  ],
  "help.km.definition": [
    "Kaplan–Meier estimates calculated from subject-level time and event data with censor marks.",
    "一种处理删失数据的非参数阶梯估计，每个事件时点按条件存活概率的乘积更新生存曲线。"
  ],
  "help.km.data": [
    "One row per subject. Event must be 1 for event and 0 for censoring; time must be non-negative.",
    "个体级随访时间、事件状态和可选分组，包含正确记录的删失。"
  ],
  "help.km.question": [
    "Kaplan–Meier estimates calculated from subject-level time and event data with censor marks.",
    "随时间推移的事件未发生概率如何，各组生存轨迹何时开始分离。"
  ],
  "help.survival-forest.definition": [
    "Effect estimates and confidence intervals against an adjustable null reference.",
    "把多个效应估计及其置信区间逐行排列在共同参考线上；这里的 forest plot 与“随机森林算法”无关。"
  ],
  "help.survival-forest.data": [
    "Provide model estimates and lower/upper confidence limits from the same model and scale.",
    "同一统计尺度上的效应估计及置信区间，如 HR、OR 或回归系数。"
  ],
  "help.survival-forest.question": [
    "Effect estimates and confidence intervals against an adjustable null reference.",
    "各因素或亚组效应的方向、大小和精确度如何，置信区间是否跨越无效线。"
  ],
  "help.roc.definition": [
    "Raw multi-model ROC or supplied time-dependent ROC curves with explicit uncertainty and evaluation horizons.",
    "普通模式遍历二分类预测阈值；时间依赖模式显示上游删失感知方法提供的 FPR、TPR、逐点区间、评价时点和 AUC 区间。"
  ],
  "help.roc.data": [
    "Raw mode calculates ROC/AUC from 0/1 outcomes and held-out scores. Time-dependent mode displays upstream estimates and pointwise 95% confidence limits without recomputing censoring-aware statistics.",
    "验证集或外部队列的二分类真实标签与连续预测分数，或由明确生存方法计算的时间依赖 ROC 坐标与不确定性。"
  ],
  "help.roc.question": [
    "Raw multi-model ROC or supplied time-dependent ROC curves with explicit uncertainty and evaluation horizons.",
    "模型区分两类对象的能力和不同阈值下敏感度/特异度权衡如何；时间依赖模式还比较指定时点，但两种模式都不能说明校准或临床效用。"
  ],
  "help.funnel.definition": [
    "Study effects against precision with inverse-variance center and pseudo 95% funnel limits.",
    "把独立研究的效应量放在横轴、精度 1/SE 放在纵轴，并叠加逆方差中心与伪 95% 漏斗边界。"
  ],
  "help.funnel.data": [
    "One row per independent study estimate. SE must be positive and on the same effect scale; asymmetry is not by itself proof of publication bias.",
    "同一效应尺度上的研究级估计与正标准误。"
  ],
  "help.funnel.question": [
    "Study effects against precision with inverse-variance center and pseudo 95% funnel limits.",
    "研究结果是否围绕汇总效应近似对称；不对称也可能来自异质性、小样本效应或方法差异，不能单独证明发表偏倚。"
  ],
  "help.precision-recall.definition": [
    "Precision–recall curves and average precision from binary outcomes and held-out scores.",
    "遍历分类阈值，以召回率为横轴、阳性预测值为纵轴，并计算 average precision。"
  ],
  "help.precision-recall.data": [
    "One row per subject per model. Outcome must be 0/1; any continuous held-out ranking score is accepted. Average precision is prevalence-dependent.",
    "二分类结局与独立验证或交叉验证得到的连续分数。"
  ],
  "help.precision-recall.question": [
    "Precision–recall curves and average precision from binary outcomes and held-out scores.",
    "在类别不平衡时，模型找回阳性与保持阳性预测值之间的权衡。"
  ],
  "help.calibration.definition": [
    "Grouped observed-versus-predicted calibration with Wilson 95% intervals and identity reference.",
    "按预测概率分箱，比较每箱平均预测概率与实际事件比例，并显示 Wilson 95% 区间和理想对角线。"
  ],
  "help.calibration.data": [
    "One row per subject per model. Outcome must be 0/1; prediction must be a held-out probability in [0,1]. Repeated subjects across model names are allowed.",
    "0/1 观察结局和真正概率尺度的预测值。"
  ],
  "help.calibration.question": [
    "Grouped observed-versus-predicted calibration with Wilson 95% intervals and identity reference.",
    "预测概率是否系统性过高或过低；分箱图不能替代校准截距、斜率和外部验证。"
  ],
  "help.decision-curve.definition": [
    "Net benefit across threshold probabilities with treat-all and treat-none references.",
    "在一系列阈值概率下计算模型净获益，并与 treat-all 和 treat-none 策略比较。"
  ],
  "help.decision-curve.data": [
    "One row per subject per model. Outcome must be 0/1; prediction must be a held-out probability in [0,1]. Repeated subjects across model names are allowed.",
    "0/1 结局与验证集预测概率；阈值范围应有临床意义。"
  ],
  "help.decision-curve.question": [
    "Net benefit across threshold probabilities with treat-all and treat-none references.",
    "在给定错判权衡下使用模型是否比全做或全不做更有净获益；不是治疗建议。"
  ],
  "help.nomogram.definition": [
    "Aligned predictor-level point assignments supplied by a documented fitted model.",
    "把已拟合模型中不同预测变量水平转换成对齐的积分标尺。"
  ],
  "help.nomogram.data": [
    "Provide predictor, displayed level, and already-derived points. This renderer does not fit a model or infer individual risk.",
    "上游模型已经给出的 predictor-level points。"
  ],
  "help.nomogram.question": [
    "Aligned predictor-level point assignments supplied by a documented fitted model.",
    "各变量水平如何贡献模型积分；本图不重新拟合模型，也不能证明临床有效性。"
  ],
  "help.lasso-path.definition": [
    "Coefficient trajectories across positive regularization parameters from an upstream penalized model.",
    "展示 L1 正则化参数变化时各特征系数从零进入并收缩的轨迹。"
  ],
  "help.lasso-path.data": [
    "Provide one row per feature and lambda. Paths are descriptive; model selection and cross-validation must be performed upstream without test-set leakage.",
    "上游 penalized regression 输出的 lambda、feature、coefficient 长表。"
  ],
  "help.lasso-path.question": [
    "Coefficient trajectories across positive regularization parameters from an upstream penalized model.",
    "不同正则化强度下模型稀疏性和系数稳定性如何；最终 lambda 必须在训练流程内选择。"
  ],
  "help.km-cutoff.definition": [
    "Kaplan–Meier curves stratified by a single supplied risk-score cutoff.",
    "使用一个明确提供的风险分数截点把受试者分组，再计算 Kaplan–Meier 曲线。"
  ],
  "help.km-cutoff.data": [
    "Provide subject-level follow-up, event, risk score, and one constant cutoff derived upstream. Optimizing and evaluating the cutoff in the same cohort is exploratory and optimistic.",
    "随访时间、删失事件、连续风险分数和同一常数截点。"
  ],
  "help.km-cutoff.question": [
    "Kaplan–Meier curves stratified by a single supplied risk-score cutoff.",
    "该预先指定或上游优化截点下两组生存经验分布如何；同队列寻优再评价会夸大差异。"
  ],
  "help.risk-score.definition": [
    "Subjects ranked by supplied risk score with an aligned binary-outcome strip.",
    "按风险分数排序受试者，并对齐显示二分类结局条带。"
  ],
  "help.risk-score.data": [
    "One row per subject with a score and observed 0/1 outcome. This descriptive panel does not estimate discrimination, calibration, or clinical utility.",
    "每位受试者一个风险分数和0/1观察结局。"
  ],
  "help.risk-score.question": [
    "Subjects ranked by supplied risk score with an aligned binary-outcome strip.",
    "分数排序与结局分布的描述性关系；不能替代 ROC、校准、DCA 或外部验证。"
  ],
  "help.venn.definition": [
    "Exact two-to-seven-set intersections using classic circles or a compact radial exact-intersection layout.",
    "用经典圆形（2–3 集合）或径向精确交集索引（4–7 集合）表示观察到的集合组合；径向模式不是闭合曲线 Venn 图。"
  ],
  "help.venn.data": [
    "Use item–set membership rows, or genomic peak intervals (set, chromosome, start, end). Duplicate rows collapse; peak counts are disjoint atomic genomic segments with constant active-set membership.",
    "2–7 个集合的 item–set 成员长表，或带 set、chromosome、start、end 的 genomic peak 区间。"
  ],
  "help.venn.question": [
    "Exact two-to-seven-set intersections using classic circles or a compact radial exact-intersection layout.",
    "少量集合之间独有和共享成员各有多少；size-weighted 模式只是视觉提示，不是面积拟合，仍应以区域数字作为精确计数。"
  ],
  "help.upset.definition": [
    "Adaptive ranked exact intersections with a membership matrix, set-size summaries, and downloadable members.",
    "用点阵列明确标出参与某个交集的集合，再用柱长显示该精确交集的大小。"
  ],
  "help.upset.data": [
    "Use item–set membership rows, or genomic peak intervals (set, chromosome, start, end). Duplicate rows collapse; peak counts are disjoint atomic genomic segments with constant active-set membership.",
    "两个及以上集合的 item–set 成员关系或 genomic peak 区间，尤其适合交集组合较多的情况。"
  ],
  "help.upset.question": [
    "Adaptive ranked exact intersections with a membership matrix, set-size summaries, and downloadable members.",
    "哪些精确集合组合构成主要交集，各交集和单集合规模分别多大，并可下载所选交集的明确成员清单。"
  ],
  "help.sankey.definition": [
    "Weighted source-to-target flows with proportional node and ribbon widths.",
    "一种有方向的流量图，节点表示阶段或状态，连接带的宽度与从来源流向去向的数量成比例。"
  ],
  "help.sankey.data": [
    "One row per directed flow with a strictly positive weight. Repeated source–target–group rows are aggregated and disclosed.",
    "带非负权重的来源—去向或阶段间流量数据。"
  ],
  "help.sankey.question": [
    "Weighted source-to-target flows with proportional node and ribbon widths.",
    "对象、数量或比例如何在类别或阶段之间流动，主要通路在哪里。"
  ],
  "help.chord.definition": [
    "Circular weighted relationships between categorical sectors.",
    "把类别排列在圆周上，用圆内带状连线表示类别之间的关系；带宽编码关系量，默认不包含真实空间或基因组坐标。"
  ],
  "help.chord.data": [
    "One row per categorical relationship with a strictly positive weight. Repeated source–target rows are aggregated; Chord color represents the source sector.",
    "类别之间的成对关系及非负权重，类别数量不宜过多。"
  ],
  "help.chord.question": [
    "Circular weighted relationships between categorical sectors.",
    "哪些类别之间联系最强，整体关系是否集中于少数节点或模块。"
  ],
  "help.alluvial.definition": [
    "Weighted cohorts traced across two or more ordered categorical axes.",
    "Alluvial 图把同一 flow ID 在多个有序阶段中的类别位置连接起来；每条带宽代表该 cohort 的恒定数量或权重，竖向块表示各阶段的类别总量。"
  ],
  "help.alluvial.data": [
    "Long format: one row per flow ID and ordered axis. A flow must retain one positive weight across every supplied axis.",
    "同一批对象在至少两个有序时间点、状态或分类轴上的去向；每个 flow ID 在各轴应有唯一类别和一致的正权重。"
  ],
  "help.alluvial.question": [
    "Weighted cohorts traced across two or more ordered categorical axes.",
    "同一 cohort 如何跨多个阶段重新分配，主要迁移路径和流失/聚合位置在哪里。阶段顺序来自输入，不由图形推断。"
  ],
  "help.ligand-receptor.definition": [
    "Directed sender–ligand–receptor–receiver relationships with explicit evidence and weight.",
    "按 sender cell → ligand → receptor → receiver cell 四层展示上游给定的细胞通讯候选关系，线宽编码显式输入的 interaction weight，evidence 字段保留推断或验证来源。"
  ],
  "help.ligand-receptor.data": [
    "One row per supplied ligand–receptor interaction. Weight must be strictly positive and its upstream meaning must be documented.",
    "来自明确配体–受体数据库和上游评分流程的细胞对、配体、受体、权重与证据类型。不同工具的分数不可在未校准时直接比较。"
  ],
  "help.ligand-receptor.question": [
    "Directed sender–ligand–receptor–receiver relationships with explicit evidence and weight.",
    "哪些细胞群可能通过哪些配体–受体对发生通信，以及候选关系由什么证据支持。表达共现或算法评分不证明直接结合、方向性效应或体内因果。"
  ],
  "help.network.definition": [
    "General node–edge network with explicit direction, weight, sign, type, grouping, and isolated-node records.",
    "通用 network 由节点与边构成：节点颜色编码分组，大小编码可选节点值；边宽编码非负权重，箭头编码方向，颜色编码正/负/中性符号，线型编码关系类型。孤立节点必须用独立 node 记录声明。"
  ],
  "help.network.data": [
    "One row per record. Node rows require node and may declare group/type/value; edge rows require source/target and may declare non-negative weight, direction, sign, edge type, and group.",
    "明确区分 node 与 edge 的关系数据。Edge 记录可给 direction、weight、sign、edge type；node 记录可给 group、type、value。布局由所选算法和整数 seed 确定，但几何距离不等于统计距离。"
  ],
  "help.network.question": [
    "General node–edge network with explicit direction, weight, sign, type, grouping, and isolated-node records.",
    "哪些对象相连、关系方向与符号是什么、哪些节点具有较高连接度或形成模块。网络中心性外观不证明因果、调控或生物学重要性。"
  ],
  "help.ppi.definition": [
    "Protein–protein interaction network that keeps evidence type and interaction weight explicit.",
    "PPI network 专门表示蛋白质之间的物理或功能相互作用；边默认无向，但仍保留输入的证据类型、权重和方向声明。"
  ],
  "help.ppi.data": [
    "One row per record. Node rows require node and may declare group/type/value; edge rows require source/target and may declare non-negative weight, direction, sign, edge type, and group.",
    "来自明确数据库、实验或评分流程的蛋白–蛋白关系，并应保留物种、数据库版本、证据类型和评分含义。不同来源的分数不可在没有校准时直接比较。"
  ],
  "help.ppi.question": [
    "Protein–protein interaction network that keeps evidence type and interaction weight explicit.",
    "候选蛋白是否处于同一相互作用模块、哪些连接由何种证据支持。数据库共现或预测边不等于体内直接结合。"
  ],
  "help.cerna.definition": [
    "Typed lncRNA/miRNA/mRNA relationship network for explicitly supplied putative ceRNA edges.",
    "ceRNA network 用带类型的 lncRNA/miRNA/mRNA 节点和有向边表达上游给定的竞争性内源 RNA 假设关系；图形不会从相关性自动建立 ceRNA 机制。"
  ],
  "help.cerna.data": [
    "One row per record. Node rows require node and may declare group/type/value; edge rows require source/target and may declare non-negative weight, direction, sign, edge type, and group.",
    "具有 miRNA 靶向证据、表达方向、位点或其他验证依据的候选 ceRNA 关系。应分别保存预测、数据库支持和实验验证等 edge type。"
  ],
  "help.cerna.question": [
    "Typed lncRNA/miRNA/mRNA relationship network for explicitly supplied putative ceRNA edges.",
    "哪些 RNA 通过共享 miRNA 形成候选调控结构，以及证据链在何处中断。它是机制假设图，不是因果证明。"
  ],
  "help.mirna-target.definition": [
    "Directed miRNA-to-target relationships with validation/evidence class retained as edge type.",
    "从 miRNA 指向靶基因的有向二部网络；箭头表示声明的调控方向，负号通常表示抑制，但必须来自输入而非图形默认推断。"
  ],
  "help.mirna-target.data": [
    "One row per record. Node rows require node and may declare group/type/value; edge rows require source/target and may declare non-negative weight, direction, sign, edge type, and group.",
    "miRNA–target 配对及预测或验证类别、非负权重和可选效应符号。建议保留物种、3′UTR/位点上下文、数据库版本与验证来源。"
  ],
  "help.mirna-target.question": [
    "Directed miRNA-to-target relationships with validation/evidence class retained as edge type.",
    "一个 miRNA 可能影响哪些靶点、多个 miRNA 是否汇聚于共同靶基因，以及哪些边具有更强或更直接的证据。"
  ],
  "help.cnet.definition": [
    "Bipartite enriched-term–gene membership network with term and gene nodes kept distinct.",
    "cnet 是富集 term 与 gene 的二部成员网络：term–gene 边表示基因属于对应富集集合，不等同于基因之间存在调控或蛋白互作。"
  ],
  "help.cnet.data": [
    "One row per record. Node rows require node and may declare group/type/value; edge rows require source/target and may declare non-negative weight, direction, sign, edge type, and group.",
    "富集结果中选定的 term–gene membership，可在 node value 中放入基因效应量或 term 显著性，但必须在图注说明尺度。"
  ],
  "help.cnet.question": [
    "Bipartite enriched-term–gene membership network with term and gene nodes kept distinct.",
    "哪些富集条目共享驱动基因，哪些基因连接多个生物学主题。共享成员不会自动证明通路间调控。"
  ],
  "help.enrichment-map.definition": [
    "Term similarity network whose edge weight represents an explicitly supplied overlap or similarity score.",
    "把每个富集 term 作为节点，以基因集重叠或相似度作为无向加权边；节点分组可表示上游主题聚类。"
  ],
  "help.enrichment-map.data": [
    "One row per record. Node rows require node and may declare group/type/value; edge rows require source/target and may declare non-negative weight, direction, sign, edge type, and group.",
    "经过明确阈值筛选的富集条目，以及由 Jaccard、overlap coefficient 或其他已记录指标计算的非负 term–term similarity。不同指标不可混用。"
  ],
  "help.enrichment-map.question": [
    "Term similarity network whose edge weight represents an explicitly supplied overlap or similarity score.",
    "冗余富集条目如何聚成主题、哪些 term 共享大量成员。它概括 gene-set 重叠，不表示通路因果顺序。"
  ],
  "help.tree.definition": [
    "Parent–child hierarchy drawn as a rooted tree without converting branches into a generic network.",
    "rooted tree 以唯一父节点关系保存层级；每个非根节点恰有一个 parent，分支位置表示层级与输入子节点顺序，而不是通用网络的力导向距离。"
  ],
  "help.tree.data": [
    "One row per unique node with exactly one blank-parent root. Input child order is preserved.",
    "分类体系、谱系、决策或其他单根无环 parent–child 结构。输入顺序会作为同一父节点下的显示顺序保留。"
  ],
  "help.tree.question": [
    "Parent–child hierarchy drawn as a rooted tree without converting branches into a generic network.",
    "对象如何从根分层展开、每条路径包含哪些父子关系。分支长度在普通 tree 中没有数值含义。"
  ],
  "help.dendrogram.definition": [
    "Rooted hierarchy whose internal merge heights determine dendrogram branch positions.",
    "dendrogram 是层次聚类结果的树形表示，内部节点的 merge height 决定分支高度；叶顺序与合并结构必须由上游聚类结果提供。"
  ],
  "help.dendrogram.data": [
    "One row per unique node with one root; leaf heights are zero and every parent height must be at least each child height.",
    "单根无环层级及每个节点的非负 height；叶通常为 0，父节点 height 不得低于任一子节点。距离、链接方法、标准化和叶排序必须在方法中记录。"
  ],
  "help.dendrogram.question": [
    "Rooted hierarchy whose internal merge heights determine dendrogram branch positions.",
    "哪些观察对象先合并、各簇在何种不相似度高度汇合。叶片间横向距离只用于排版，不是原始样本距离。"
  ],
  "help.circos.definition": [
    "A shared genomic coordinate system for concentric bars, heatmaps, scatter, labels, fusions, correlations, and links.",
    "以显式提供的染色体或 contig 长度及真实坐标为唯一圆周骨架，在同一坐标系叠加 bar、heatmap、scatter、label 等同心数据轨道，并把 link、fusion、correlation 精确锚定到两个基因组区间。每个数值轨道独立缩放并显示范围；它不同于只表达类别关系的 Chord。"
  ],
  "help.circos.data": [
    "Each row declares record_type and an explicit chromosome/contig length from one reference build. Link, fusion, and correlation rows additionally need target coordinates and target sequence length.",
    "同一参考基因组版本下的染色体或 contig 序列长度与安全整数起止坐标、区段数值及区段间连接。每行用 record_type 明确图层语义；correlation 必须为 [-1,1] 的系数，数值记录不得留空。"
  ],
  "help.circos.question": [
    "A shared genomic coordinate system for concentric bars, heatmaps, scatter, labels, fusions, correlations, and links.",
    "多类事件位于哪些基因组区域，不同轨道是否共定位，跨染色体或远距离连接的整体格局如何。图形不会推断参考版本或结构变异真实性。"
  ],
  "help.manhattan.definition": [
    "Genome-wide association significance across naturally ordered chromosomes.",
    "把每个遗传变异按染色体与碱基位置排列在连续基因组轴上，纵轴为 −log10(P)；交替颜色只帮助区分相邻染色体。"
  ],
  "help.manhattan.data": [
    "One row per tested variant with a chromosome, positive base-pair position, P value in (0, 1], and optional label.",
    "GWAS、QTL 或其他全基因组关联检验结果；每行需包含染色体、正整数位置和 (0,1] 内的 P 值。不同基因组版本不可混用；浏览器预览最多 20,000 个位点。"
  ],
  "help.manhattan.question": [
    "Genome-wide association significance across naturally ordered chromosomes.",
    "哪些基因组区域出现超出预设阈值的关联信号，以及信号是否聚集成区域。它不单独证明因果变异，也不替代群体结构、批次和多重检验控制。"
  ],
  "help.qq.definition": [
    "Observed versus expected −log10 P values for association-calibration assessment.",
    "将排序后的观测 P 值与均匀零假设下的期望分位数比较，两个轴都显示 −log10(P)。对角线表示整体校准一致。"
  ],
  "help.qq.data": [
    "One row per test with a P value in (0, 1]; expected quantiles are calculated from rank using (i − 0.5) / n.",
    "同一分析框架产生的一组有效 P 值；应保留全部检验而非只输入显著结果。浏览器预览上限为 20,000 个 P 值，更大分析应使用有记录的确定性子集或上游栅格化流程。"
  ],
  "help.qq.question": [
    "Observed versus expected −log10 P values for association-calibration assessment.",
    "P 值整体是否接近期望分布，是否存在系统性膨胀、保守性或仅在尾部偏离。偏离可能来自真实多基因信号，也可能来自混杂或模型失配。"
  ],
  "help.chromosome-ideogram.definition": [
    "Naturally ordered chromosome bars partitioned into supplied cytoband intervals.",
    "按自然染色体顺序排列长度成比例的染色体条，并用输入的细胞遗传学区带区间分割条带。"
  ],
  "help.chromosome-ideogram.data": [
    "One row per non-overlapping band with chromosome, zero-based start, end greater than start, optional stain, and band label.",
    "与同一参考基因组版本一致的 chromosome/start/end 区带表；stain 可留空，或使用 gneg、gpos25/50/75/100、acen、gvar、stalk，并可附 band 名称。"
  ],
  "help.chromosome-ideogram.question": [
    "Naturally ordered chromosome bars partitioned into supplied cytoband intervals.",
    "染色体的相对长度、区带边界与目标区域的大体基因组位置。该图不会从坐标自动推断真实着丝粒或细胞遗传学带。"
  ],
  "help.snp-density.definition": [
    "Binned variant density along naturally ordered chromosome ideograms.",
    "把预先划分的基因组窗口沿染色体排列，以颜色强度编码每个窗口的变异计数或密度。"
  ],
  "help.snp-density.data": [
    "One row per genomic bin with chromosome, zero-based start, end greater than start, and a non-negative variant count or density.",
    "不重叠或有明确含义的 chromosome/start/end 窗口及非负计数/密度；不同窗口宽度时应优先输入密度而非原始计数。"
  ],
  "help.snp-density.question": [
    "Binned variant density along naturally ordered chromosome ideograms.",
    "变异在基因组上的疏密是否均匀，哪些染色体区段形成高密度或低密度区域。"
  ],
  "help.genome-tracks.definition": [
    "Aligned interval tracks on one shared naturally ordered genomic coordinate system.",
    "把多个区间型数据轨道对齐到同一基因组坐标轴；每个轨道保持独立行，位置与宽度都由真实区间决定。"
  ],
  "help.genome-tracks.data": [
    "One row per feature interval with chromosome, zero-based start, end greater than start, track, optional numeric value, and optional label.",
    "基因、峰、拷贝数区段、变异或注释等 chromosome/start/end 区间，附 track、可选数值和标签；所有轨道必须使用同一参考版本。"
  ],
  "help.genome-tracks.question": [
    "Aligned interval tracks on one shared naturally ordered genomic coordinate system.",
    "不同类型的基因组事件是否在同一位置重叠或邻近，以及一个区域内的多层证据如何对齐。"
  ],
  "help.waterfall.definition": [
    "Samples ranked by total alteration burden with stacked alteration classes.",
    "按每个样本的事件总数排序，用堆叠柱显示不同 alteration class 对样本总突变/变异负荷的贡献。"
  ],
  "help.waterfall.data": [
    "Long format: one row per sample–gene alteration event. Repeated sample–gene rows are retained as multiple alteration classes.",
    "长表 sample–gene–alteration 事件，可包含 SNV、indel、融合和拷贝数类别，预览最多 10,000 个事件。这里的柱高是输入事件数，不是标准化 TMB；无事件样本不会出现在纯事件长表中。"
  ],
  "help.waterfall.question": [
    "Samples ranked by total alteration burden with stacked alteration classes.",
    "队列中哪些样本事件负荷较高，负荷由哪些 alteration class 构成。它不显示每个基因在每个样本中的完整矩阵。"
  ],
  "help.oncoplot.definition": [
    "Gene-by-sample alteration matrix with optional sample burden and gene-frequency margins.",
    "以基因为行、样本为列显示 alteration class；上方可给出样本事件数，右侧给出受影响样本比例。一个格可保留多种事件。"
  ],
  "help.oncoplot.data": [
    "Long format: one row per sample–gene alteration event. Repeated sample–gene rows are retained as multiple alteration classes.",
    "长表 sample–gene–alteration 队列结果，预览最多 10,000 个事件；样本和基因标识必须非空，alteration 类别应定义清楚。纯事件长表不能表示所选基因中完全无事件的样本。"
  ],
  "help.oncoplot.question": [
    "Gene-by-sample alteration matrix with optional sample burden and gene-frequency margins.",
    "常见驱动基因是否互斥或共现，队列的分子异质性与基因频率格局如何。可视共现不等于统计学互斥/共现检验。"
  ],
  "help.motif-logo.definition": [
    "DNA sequence logo from position-specific A/C/G/T probabilities.",
    "在每个位置堆叠 A/C/G/T 字母；information 模式中总高度为 2−H bits，各字母高度等于其概率乘以该信息量。"
  ],
  "help.motif-logo.data": [
    "One row per unique positive integer position. A, C, G, and T must be probabilities in [0, 1] that sum to 1; no small-sample correction is inferred.",
    "DNA position probability matrix：每个正整数位置唯一，A/C/G/T 均在 [0,1] 且和为 1，最多 60 个位置且还需满足当前画幅的最小字母宽度。输入应已处理 pseudocount；工具不会反推样本量或加入小样本校正。"
  ],
  "help.motif-logo.question": [
    "DNA sequence logo from position-specific A/C/G/T probabilities.",
    "序列 motif 在哪些位置最保守、偏好哪些碱基，以及各位置的不确定性有多大。Probability 模式显示频率而非信息量。"
  ],
  "help.pie.definition": [
    "Part-to-whole composition encoded by sector angle and area.",
    "把互斥类别占总量的比例映射为圆形扇区的角度与面积。所有扇区共同构成一个整体。"
  ],
  "help.pie.data": [
    "One row per mutually exclusive category with a non-negative value. Values are normalized to the displayed total.",
    "单一总体中的非负计数、构成比或资源份额，类别应互斥且数量较少。"
  ],
  "help.pie.question": [
    "Part-to-whole composition encoded by sector angle and area.",
    "每个类别占总量多少，以及少数主要部分如何构成整体。精确比较多个相近比例时应优先使用柱状图。"
  ],
  "help.donut.definition": [
    "Part-to-whole composition with a central total and compact ring geometry.",
    "在饼图中心留出空白的环形组成图。扇区仍编码整体中的份额，中心用于显示总量而不是第二个变量。"
  ],
  "help.donut.data": [
    "One row per mutually exclusive category with a non-negative value. Values are normalized to the displayed total.",
    "与饼图相同的互斥非负组成数据，适合需要在中心明确显示总量的紧凑版式。"
  ],
  "help.donut.question": [
    "Part-to-whole composition with a central total and compact ring geometry.",
    "整体由哪些部分构成以及总量是多少。中心孔不会提高相近比例的比较精度。"
  ],
  "help.waffle.definition": [
    "Approximate part-to-whole composition on a discrete unit grid.",
    "把总量离散成固定数量的小格，再按比例分配给各类别，是对组成比例的近似计数式表达。"
  ],
  "help.waffle.data": [
    "One row per mutually exclusive category with a non-negative value. Values are normalized to the displayed total.",
    "互斥非负组成数据，适合面向非技术受众展示直观百分比。"
  ],
  "help.waffle.question": [
    "Approximate part-to-whole composition on a discrete unit grid.",
    "每 100 个单位中大约有多少属于各类别。小份额会受到网格取整影响，精确值应结合标签。"
  ],
  "help.rose.definition": [
    "Equal-angle sectors whose areas encode magnitude rather than part-to-whole share.",
    "把类别分成等角扇区，以扇区面积编码每一项的数值，因此半径按数值平方根缩放。它比较周期或类别强度，不要求各项相加为整体。"
  ],
  "help.rose.data": [
    "One row per ordered category with a non-negative magnitude. Rows are not normalized to a compositional total.",
    "按时间、方向或阶段排列的非负数值，尤其适合周期模式和同权类别的强度比较。"
  ],
  "help.rose.question": [
    "Equal-angle sectors whose areas encode magnitude rather than part-to-whole share.",
    "哪些方向或周期阶段更高，整体轮廓是否呈现集中、偏向或季节性。不要把扇区解释为构成比例。"
  ],
  "help.treemap.definition": [
    "Nested rectangles encode hierarchical part-to-whole area.",
    "用嵌套矩形表示树状层级，叶节点面积编码数值，父节点面积由后代汇总。"
  ],
  "help.treemap.data": [
    "One row per unique node. Parent is blank only for the single root. Leaf values must be non-negative; internal totals are calculated from descendants.",
    "具有单一根节点、明确父子关系和非负叶节点数值的层级组成数据。"
  ],
  "help.treemap.question": [
    "Nested rectangles encode hierarchical part-to-whole area.",
    "总量在多个层级如何分配，哪些分支和叶节点占据主要份额。细长矩形不适合精确比较。"
  ],
  "help.sunburst.definition": [
    "Concentric rings encode parent-child hierarchy and descendant share.",
    "以同心环表示树的深度，父节点扇区沿径向向外展开为子节点，角度编码后代份额。"
  ],
  "help.sunburst.data": [
    "One row per unique node. Parent is blank only for the single root. Leaf values must be non-negative; internal totals are calculated from descendants.",
    "具有单一根节点、明确父子关系和非负叶节点数值的层级组成数据。"
  ],
  "help.sunburst.question": [
    "Concentric rings encode parent-child hierarchy and descendant share.",
    "层级路径如何从根部向外展开，各分支在不同深度的相对份额是多少。层级过深时标签会变得拥挤。"
  ],
  "help.radar.definition": [
    "Comparable multivariate profiles arranged on shared radial axes.",
    "把多个可比较指标放在从同一中心放射的轴上，并连接同一对象的数值形成多边形轮廓。"
  ],
  "help.radar.data": [
    "Long format with at least three features per series. Every series must contain the same features on a common, interpretable scale.",
    "至少三个方向一致、量纲可比或已标准化的指标。每个系列必须包含相同指标集合。"
  ],
  "help.radar.question": [
    "Comparable multivariate profiles arranged on shared radial axes.",
    "对象的多维特征轮廓是否均衡，优势和短板集中在哪些指标。多边形面积不应被当作统计量。"
  ],
  "help.polar-profile.definition": [
    "Ordered or cyclic measurements connected around a shared radial scale.",
    "把有自然循环顺序的测量放在角度轴上，以半径编码数值并连接为闭合曲线。它强调周期轨迹，不是组成图。"
  ],
  "help.polar-profile.data": [
    "Rows follow the angular order. Each series must contain the same ordered categories and non-negative values.",
    "昼夜、季节、方向、细胞周期阶段等循环顺序数据，各系列应具有相同的角度类别。"
  ],
  "help.polar-profile.question": [
    "Ordered or cyclic measurements connected around a shared radial scale.",
    "峰值出现在周期的哪个位置，不同系列的相位、振幅和轮廓是否不同。"
  ],
  "help.population-pyramid.definition": [
    "Two non-negative distributions mirrored across a common ordered-category baseline.",
    "把两个群体在同一组有序区间上的非负分布分别镜像到中心线两侧，以共同尺度比较形状。"
  ],
  "help.population-pyramid.data": [
    "Long format with exactly two groups and one non-negative value per ordered category/group pair.",
    "恰好两个群体在年龄、分期、剂量区间或其他有序类别中的计数或比例。"
  ],
  "help.population-pyramid.question": [
    "Two non-negative distributions mirrored across a common ordered-category baseline.",
    "两个群体的分布形状、峰值区间和结构差异在哪里。镜像方向是布局，不代表数值为负。"
  ]
};
