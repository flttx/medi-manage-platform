# RTL (Right-to-Left) 布局适配预研报告

## 1. 背景

为了满足未来向中东地区（如阿拉伯语、希伯来语）扩展的需求，系统需要支持从右往左（RTL）的布局。

## 2. 当前架构分析

- **CSS 框架**: 使用 Tailwind CSS 3.4。
- **布局技术**: 主要采用 Flexbox 和 Grid。
- **图标**: 使用 Lucide React。

## 3. 适配成本评估

### 3.1 布局对齐 (Flex/Grid)

- **挑战**: 目前大量使用了 `ml-auto`, `pr-4`, `text-left` 等方向性类名。
- **解决方案**: Tailwind CSS 提供了 `logical properties` 支持。
  - 使用 `ms-*` (margin-start) 替代 `ml-*`。
  - 使用 `me-*` (margin-end) 替代 `mr-*`。
  - 使用 `ps-*` 和 `pe-*` 替代 `pl-*/pr-*`。
  - 使用 `text-start` 替代 `text-left`。
- **工作量**: 目前代码中约有 30% 的布局使用了物理类名，需迁移至逻辑类名。

### 3.2 图标转换

- **挑战**: 像 `ChevronRight`, `ArrowRight` 这种指示方向的图标在 RTL 下需要镜像翻转，但像 `User`, `Wallet` 等静态图标通常不需要。
- **解决方案**:
  - 给需要翻转的图标添加 `rtl:rotate-180`。
  - 或者封装一个 `Icon` 组件，自动根据当前 `dir` 决定是否镜像。

### 3.3 交互组件 (Modal, Sidebar)

- **挑战**: 桌面端侧边栏（Sidebar）目前固定在左侧。
- **解决方案**: RTL 下 Sidebar 应移动到右侧。需要将容器的 `left-0` 改为 `inset-inline-start-0`。

## 4. 实施策略 (Phase 1)

1. **全局容器控制**: 在 `html` 标签上动态切换 `dir="rtl"` 属性。
2. **逻辑属性迁移**: 在后续开发中，强制要求使用 `start/end` 替代 `left/right`。
3. **i18n 集成**: 在 `i18next` 初始化时，根据 `locale` 自动决定 `dir`。

## 结论

目前系统适配 RTL 的基础良好（主要由于 Flex/Grid 的大量使用），适配的核心工作在于**物理类名向逻辑类名的渐进式重构**。建议在下个大版本迭代中开始引入逻辑类名规范。
