---
name: dental-ui-development
description: Standards and logic for dental-specific UI components like charts and tooth selection
---

# 牙科 UI 开发指南 (Dental UI Skill)

本 Skill 用于指导如何在该平台中开发和维护具有医疗行业深度的 UI 组件。

## 1. 牙位逻辑 (Tooth Logic)

- **FDI 编号**：
  - 成人：11-18, 21-28, 31-38, 41-48。
  - 儿童：51-55, 61-65, 71-75, 81-85。
- **状态处理**：
  - 渲染牙位时，必须包含 `TOOTH_STATUSES` 映射。
  - 悬停(Hover)应显示动态预览，显示该牙位的临床状态及图标颜色。

## 2. 财务逻辑 (Billing & Finance)

- **账单生成**： 账单必须包含 `category`（Exam, Treatment, Deposit, Supplies）和 `method`（AliPay, WeChat, Cash, etc.）。
- **统计计算**：
  - `Outstanding` = 待支付账单总额 或 (方案总额 - 已支付总额)。
  - `Total Paid` = 所有 `Paid` 状态账单的累加。

## 3. 临床文档与方案 (Treatment Planning)

- **方案对比**： 当一个患者有多个推荐方案时，须提供 `ComparePlans` 功能。对比项包括：关键步骤、总时长、总造价、AI 推荐指数。
- **病历记录**： `NewMedicalRecordForm` 必须能联动 `ToothPositionSelect` 记录受影响的牙位及其具体状态。

## 4. 牙周数据 (Periodontal Data)

- **探诊记录 (PD/BI)**： 牙周图表渲染遵循 6 点探诊原则。高风险位点（PD > 4mm）应在 UI 中通过红色高亮（`text-rose-500`）标记。
