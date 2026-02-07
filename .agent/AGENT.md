# 医患管理平台 开发规范 (AGENT.md)

本文件定义了本项目的核心开发原则、设计规范及技术架构，以便在后续迭代中保持风格一致性与代码健壮性。

## 1. 视觉设计规范 (Design Aesthetics)

- **高端审美 (Premium Look)**： UI 应具备现代感，使用大圆角（`rounded-[2.5rem]` 或 `rounded-[3rem]`）、优雅的阴影（`shadow-2xl shadow-slate-200/50`）以及毛玻璃效果（`backdrop-blur`）。
- **颜色系统**：
  - `primary`: 主色调（通常为医疗蓝）。
  - `rose-500`: 风险、警报、未支付。
  - `emerald-500`: 成功、已预约、已支付。
  - `slate-400/500`: 辅助文本、边框。
- **动效 (Micro-animations)**： 所有页面切换和模态框进入必须使用 `framer-motion`。
  - 进入效果：`animate-in fade-in slide-in-from-bottom-4 duration-500`。
- **排版**： 标题使用 `font-black`，正文使用 `font-bold` 或 `font-medium`。关键数据使用 `tabular-nums` 以保证对齐。

## 2. 国际化与区域 (i18n & Region)

- **全文本国际化 (Standard i18n)**： 除了专业术语外，UI 中显示的所有文本必须通过 `react-i18next` 进行国际化。禁止在组件内使用三元表达式判断中英文。
- **资源存储**： 所有国际化 Key 必须提取到 `src/i18n/locales/` 目录下的 JSON 文件中（`zh-CN.json`, `en-US.json`）。
- **使用逻辑**： 优先使用组件内的 `useTranslation` 钩子或通过 `RegionContext` 获取预初始化的 `t` 方法。
- **引用方式**：
  ```javascript
  {
    t("billing.createInvoice");
  }
  ```

## 3. 状态管理 (State Management)

- **全局上下文**： 所有核心实体（`patients`, `appointments`, `medicalRecords`, `invoices`, `treatmentPlans`）必须在 `RegionContext.jsx` 中管理。
- **模态框系统**： 避免在组件内部创建复杂的 Modal。使用 `App.jsx` 中的 **Global Modal System**。
  - 触发方式：`setGlobalModal({ type: 'billing', data: null })`。

## 4. 牙科专业逻辑 (Clinical Logic)

- **牙位表示**： 统一使用 **FDI (国际牙科联合会)** 系统（如 11-18, 21-28等）。
- **牙位状态**： 状态定义需遵循 `src/components/ToothData.js` 中的常量（`caries`, `filling`, `implant`, `healthy`, `periodontal`）。
- **数据结构**：
  - `invoices`: 包含 `id`, `patientId`, `date`, `desc`, `amount`, `status`, `method`, `category`。
  - `treatmentPlans`: 包含 `id`, `items` (数组), `totalCost`, `status`。

## 5. 组件开发准则

- **表单组件**： 新表单应在 `src/components/Forms.jsx` 中统一维护。
- **视图层级**： 核心逻辑放在 `src/views/` 下。`PatientDetailView.jsx` 是最复杂的视图，应保持分块清晰。
- **Proactivity**： AI 助手在修改 UI 后需自动检查对比度与响应式布局。

## 6. 交互规范 (Communication Guidelines)

- **语言要求**： AI 助手（Assistant）在与用户交流时，必须始终使用 **中文** 进行回答。
