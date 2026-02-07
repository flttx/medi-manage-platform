# 🚀 优化规划与路线图 (Optimization Roadmap - V3)

> **Updated: 2026.02.06 - "Serious Medical & AI" Focus**

本路线图基于 "去商业化" 和 "增强医疗专业性" 的指导思想进行调整。

## 1. 📋 医疗保险与商保直付 (Medical Insurance)

**目标**：为严肃医疗场景提供核心支付支撑。

- **功能方案**：
  - **医保卡读卡**：模拟通过 PC/Pad 读取医保卡信息，自动带入就诊人。
  - **医保目录对照**：建立 `MedicalItem` (医保项目) 与 `ClinicService` (自费项目) 的映射关系。
  - **商保直付**：增加 `InsurancePolicy` 字段，支持不同保险公司的 Claim 流程。
  - **自付/统筹计算**：自动拆分账单费用为统筹支付、个人账户支付、自费现金支付。

## 2. 🗓️ 智能排班与医生 KPI (Smart Scheduling)

**目标**：解决大型诊所的多人排班与绩效痛点。

- **功能方案**：
  - **Roster Grid**：可视化的排班网格，支持跨院区排班。
  - **规则引擎**：医生请假审批流，自动检测排班冲突。
  - **绩效计算器**：基于 `Revenue - MaterialCost` 的可配置提成公式。

## 3. 📊 高级商业智能 (Advanced BI)

**目标**：让数据驱动决策。

- **功能方案**：
  - **Patient Retention**：留存率分析 (Recall Rate)，流失预警。
  - **Treatment Acceptance**：方案转化率漏斗 (Presented -> Accepted -> Started)。
  - **Inventory Forecast**：基于历史消耗量的智能采购建议。

## 4. 🔗 外部系统集成 (Integrations)

**目标**：打破信息孤岛。

- **功能方案**：
  - **DICOM Server**：真实对接 PACS 系统获取影像。
  - **Third-party Lab**：对接主流义齿加工厂的订单 API。

---

### 💡 优先级推荐 (Recommendation)

1.  **首选**：**医保与商保模块**。这是区别于 "美容院式诊所" 的核心标志，也是公立医院/高端诊所的刚需。
2.  **次选**：**智能排班**。对于 5 张牙椅以上的诊所，这是运营效率的关键。
