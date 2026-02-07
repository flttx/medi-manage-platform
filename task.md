# 核心开发任务与深度优化指南 (Full Roadmap)

## 🚀 P1: 临床诊疗全链路协同 (Clinical Workflow Synergy)

### 1.1 医生端 H5 深度补完 (Mobile Clinical Entry) [DONE]

- [x] **触控优化型牙位选择**: 针对手机窄屏优化 `ToothPositionSelect`，实现“长按选择牙齿、点击标记牙面”的轻量化交互。 (已在 H5 核心链路中集成)
- [x] **实时病历同步协议**: 建立基于 BroadcastChannel 的同步机制。医生在 H5 保存记录时，桌面端详情页自动触发视图更新。
- [x] **推送方案协议 (Push-to-Patient)**: 实现医生手机端“发送方案” -> 患者微信端实时收到推送。

### 1.2 影像采集即时响应 (Instant Imaging) [DONE]

- [x] **H5 快速拍照上传**: 在 `DoctorH5` 增加相机切换模式（口内、面部、X光），上传后自动带上 `PatientID` 标签。
- [x] **桌面端即时预览 (Hot-reload Preview)**: 当检测到新影像上传时，在桌面端右下角弹出高清缩略图预览气泡。
- [x] **临床 AI 助手 (Clinical AI Copilot)**: 在 `DoctorH5` 接诊界面集成了 AI 辅助诊断，支持实时提取影像/病史特征并一键应用至病历。 [DONE]
- [x] **影像中心 AI 增强 (AI Diagnostic Analytics)**: 在桌面端 `ImagingTab` 集成了影像特征自动扫描与标记功能，支持热点病变识别与置信度展示。 [DONE]
- [x] **零延迟预加载 (Zero-Latency UX)**: 在 `PatientListView` 实现了基于 Hover 的前端预加载模拟，消除诊疗切换时的感知延迟。 [DONE]
- [x] **动态隐私脱敏 (Privacy Shield)**: 增加了全局“隐私模式”开关，一键对敏感患者信息（电话、身份证号）进行合规性脱敏处理。 [DONE]

---

## 📊 P2: 数据报表与财务可视化 (Data & Finance Visualization) [DONE]

### 2.1 财务驾驶舱升级 (Wealth Dashboard) [DONE]

- [x] **营收拆解饼图**: 使用 Recharts 实时展示诊疗类别比例（种植、正畸、牙周等）。
- [x] **欠费账龄分析 (Aging Report)**: 实现了“0-30/31-60/60-90+天”分段统计，并在财务首页以 BarChart 显式展示。
- [x] **收支平衡汇总表**: 自动生成实收、预收、退费的财务汇总卡片，支持净现金流监控。

### 2.2 医生效能分析 (Clinician Metrics) [DONE]

- [x] **方案转化率追踪**: 实时统计特定医生制定的方案确认执行（active）与拒绝/挂起情况。
- [x] **效率分析组件**: 集成了接诊时长、单客产值、以及客流量的复合趋势分析。

---

## 🦷 P3: 数字化牙科深度探索 (Advanced Dental Depth)

### 3.1 图形化牙周探针系统 (Graphical Perio Chart)

- [x] **动态路径渲染**: 使用 SVG 渲染牙周轮廓，基于 PD（探针深度）数据自动绘制连线。 [DONE]
- [x] **历史趋势对比**: 点击牙位弹窗显示该点位过去 3 次检查的深度变化趋势。 [DONE]

### 3.2 AI 影像模拟增强 (AI-Vision Simulation) [DONE]

- [x] **影像标注图层 (Annotation Layer)**: 在 `ImagingCenter` 增加一个 SVG 透明图层覆盖在全景片上。 [DONE]
- [x] **智能扫描模拟**: 模拟雷达扫描波纹，动态标记出“疑似病灶点”（基于 Mock 数据展示 UI 潜力）。 [DONE]
- [x] **3D 牙齿可视化 (WebGL Enhancement)**: 集成 `Three.js` 实现可交互的 3D 牙齿模型，支持旋转查看与病灶状态渲染。 [DONE]

---

## 🌎 P4: 极致体验与全球化补完 (Experience & i18n) [DONE]

### 4.1 全局格式化引擎 (Localization Engine) [DONE]

- [x] **Currency & Date Standard**: 集成 `dayjs` 等工具，封装标准的金额（¥/$）与日期处理函数。 [DONE]
- [x] **全模块国际化自检**: 修复 Dashboard 等核心页面的 Key 缺失问题。(已完成全量补完与校验)
- [x] **多语种容器适配**: 针对英文/德文等超长文本进行 CSS 的响应式优化（防止溢出）。 [DONE]
- [x] **多语言切换逻辑**: 确保 `RegionToggle` 能实时更新所有子组件的方案对比内容。 [DONE]

### 4.2 模块化开关系统 (Feature Flags) [DONE]

- [x] **模块访问控制**: 根据账号角色动态隐藏/显示“财务”或“设置”模块。 [DONE]
- [x] **开发中模块占位**: 为暂时隐藏的“加工件中心”和“库存管理”预留权限开关。 [DONE]

### 4.3 触控性能与移动端视觉优化 (Mobile UI/UX Refinement) [DONE]

- [x] **移动端深色模式 (H5 Dark Mode)**: 实现了完整的 H5 深色模式适配，支持实时切换与持久化。 [DONE]
- [x] **个人中心状态可视化**: 在 H5 个人中心集成了 `MiniDentalChart`，直观展示患者当前牙齿健康状况。 [DONE]
- [x] **触控交互增强**: 优化了支付确认、预约切换等核心场景的 Framer Motion 动画，实现“丝滑”触感。 [DONE]
- [x] **H5 全量国际化**: 完成了移动端所有硬编码字符串的翻译与同步。 [DONE]

### 4.4 移动端高阶交互补完 (Advanced Mobile Interaction) [DONE]

- [x] **高清影像画廊 (Image Gallery Pro)**: 实现了移动端影像的全屏预览功能，支持平滑缩放与元数据展示。 [DONE]
- [x] **实时就诊候诊区 (Live Queue Status)**: 在 H5 首页增加了动态候诊状态位，实时展示“前面还有几人”及“预计等待时间”。 [DONE]
- [x] **交互微动效优化**: 为 H5 导航、切换与支付确认增加了更丰富的反馈动效（Spring Animation）。 [DONE]

---

## 🛡️ P5: 基础设施与系统稳健性 (Engineering & Infrastructure)

### 5.1 工程化监控 (Engineering Guards)

- [x] **i18n Key 缺失监控**: 增加开发脚本，自动巡检代码中使用了 `t()` 但在 JSON 中未定义的 Key。 (已完成全量审计与补丁)
- [x] **RTL (Right-to-Left) 预研**: 评估如果要支持阿语等地区，目前的 Flex/Grid 布局方案的适配成本。(已完成调研报告)

### 5.2 性能与性能质量 (Performance & Quality)

- [x] **骨架屏优化 (Skeletons)**: 将目前的 `DataPlaceholder` 升级为业务感知型的骨架图。(已完成通用 Skeleton 与患者列表骨架屏)
- [x] **缓存策略**: 对列表数据、牙位状态等高频访问数据引入本地持久化缓存。(已实现 storage 工具与 hook)
- [ ] **单元测试**: 为核心计算逻辑（如复发风险、账单结算）增加逻辑层单元测试。(已集成 Vitest & 编写部分测试用例)

---

## 📦 P6: 业务模块扩展 (Business Expansion)

- [x] **运营驾驶舱 (Operations Dashboard)**: 实现了患者留存漏斗分析、批量关怀发送与生日祝福引擎。 [DONE]
- [x] **暗黑模式适配**: 运营中心已全量适配 Dark Mode，图表与卡片在深色主题下视觉表现完美。 [DONE]

### 6.1 加工件中心 (Lab Orders)

- [ ] **加工单流转**: 设计“发送加工 - 制作中 - 已回件 - 已戴牙”的状态流转看板。
- [ ] **技工所对接**: 模拟外部技工所的数据接口，实现数字化模型文件的可追溯传输。

### 6.2 耗材与库存 (Inventory)

- [ ] **库存预警**: 建立耗材 SKU 系统，当库存低于安全水位时触发 Dashboard 提醒。
- [ ] **批次效期管理**: 增加试剂/材料的有效期追踪，防止过期使用。
