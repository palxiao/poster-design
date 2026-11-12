---
version: 2.1.0
name: xunpai-design-poster-editor
description: "迅排设计海报编辑器的界面规范。浅色、无装饰的桌面端工具型 UI：白色面板 + 灰色画布工作区，唯一的强调色 #2254f4 只服务于「选中 / 激活 / 主按钮」三种语义，字重只有 400 与 600 两级，圆角统一 6px，面板之间靠 1px hairline 与 rgba(0,0,0,0.07) 分隔而不是阴影。画布层保留虚线选框、画板投影与遮罩聚光三处刻意保留的视觉强度。除编辑器外还覆盖 /admin 后台的独立外壳（248px 浅侧栏 + 64px 带职责说明的顶栏 + 可滚动白托盘内容区）。本文件由 Vercel / Figma 两份 DESIGN.md 的 token 体系提炼而来，并补齐了设计画布类工具独有的交互规范。"

colors:
  # ── 品牌强调色 ──
  primary: "#2254f4"
  primary-hover: "#1a44d6"
  primary-active: "#1639b8"
  primary-soft: "#e8efff"
  primary-ring: "rgba(34, 84, 244, 0.15)"

  # ── 文本 ──
  ink-strong: "#262c33"
  ink: "#333333"
  ink-secondary: "#50555b"
  ink-muted: "#666666"
  ink-hint: "#999999"
  ink-disabled: "#c2c2c2"

  # ── 表面 ──
  canvas: "#ffffff"
  canvas-artboard: "#f8f8f8"
  canvas-page: "#f0f2f5"
  surface-inset: "#f0f0f0"
  surface-hover: "rgba(0, 0, 0, 0.03)"

  # ── 描边 ──
  hairline: "#e5e7eb"
  hairline-soft: "rgba(0, 0, 0, 0.07)"
  hairline-strong: "#dcdfe6"

  # ── 语义色（与 Element Plus 默认值对齐，勿单独改）──
  success: "#67c23a"
  warning: "#e6a23c"
  danger: "#f56c6c"
  info: "#909399"

  # ── 画布专用 ──
  scrim-spotlight: "rgba(248, 248, 248, 0.99)"
  transparent-checker: "#f0f0f0"
  transparent-checker-alt: "#ffffff"
  transparent-checker-size: "16px"

typography:
  family-ui: "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif"
  family-brand: "'TitleFont', system-ui, -apple-system, 'Segoe UI', 'PingFangSC-Semibold', 'PingFang SC', sans-serif"
  family-mono: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"

  ui-brand:
    fontFamily: "{typography.family-brand}"
    fontSize: 22px
    fontWeight: 400
    letterSpacing: 2px
  ui-heading:
    fontFamily: "{typography.family-ui}"
    fontSize: 14px
    fontWeight: 600
    lineHeight: 1.5
  ui-body:
    fontFamily: "{typography.family-ui}"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
  ui-body-strong:
    fontFamily: "{typography.family-ui}"
    fontSize: 14px
    fontWeight: 600
    lineHeight: 1.5
  ui-caption:
    fontFamily: "{typography.family-ui}"
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.5
  ui-hint:
    fontFamily: "{typography.family-ui}"
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.5
  ui-mono:
    fontFamily: "{typography.family-mono}"
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.5

rounded:
  xs: 4px
  sm: 6px
  md: 8px
  lg: 12px
  full: 9999px

spacing:
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px

shell:
  min-width: 1180px
  topbar-height: 54px
  rail-width: 66px
  rail-drawer-width: 328px
  rail-total-width: 394px
  property-panel-width: 280px
  artboard-strip-height: 90px
  artboard-strip-height-collapsed: 38px
  zoom-control-right: 292px
  zoom-control-bottom: 10px
  scrollbar-width: 5px
  scrollbar-radius: 3px

admin-shell:
  sidebar-width: 248px
  topbar-height: 64px
  body-padding: "24px 28px 28px"
  pane-padding: "20px 22px"
  pane-gap: 16px
  brand-height: 64px
  nav-item-height: 38px
  nav-item-radius: "{rounded.sm}"
  stat-grid-columns: 4
  stat-card-icon: 44px
  stat-value-size: 26px
  quick-action-grid-columns: 2
  table-header-font: 13px
  table-body-font: 13px

elevation:
  flat: "none"
  hairline: "0 0 0 1px {colors.hairline}"
  floating: "0 0 2px 0 rgba(0, 0, 0, 0.08), 0 4px 12px 0 rgba(0, 0, 0, 0.04)"
  selected: "0 0 2px 3px {colors.primary}"
  artboard: "1px 1px 10px 3px rgba(0, 0, 0, 0.1)"
  spotlight-scrim: "0 0 0 5000px {colors.scrim-spotlight}"

components:
  # ── 顶栏 ──
  topbar:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.ui-body}"
    height: "{shell.topbar-height}"
    borderBottom: "1px solid {colors.hairline-soft}"
  brand-name:
    textColor: "{colors.ink}"
    typography: "{typography.ui-brand}"
    margin: "0 16px"
  toolbar-action:
    typography: "{typography.ui-body-strong}"
    textColor: "{colors.ink}"
    padding: 16px
    iconSize: 14px
    gap: "0.4rem"
  toolbar-action-disabled:
    textColor: "{colors.ink-disabled}"
    cursor: "not-allowed"

  # ── 按钮 ──
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.canvas}"
    typography: "{typography.ui-body-strong}"
    rounded: "{rounded.sm}"
    size: 28px
  button-plain:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.primary}"
    borderColor: "{colors.primary}"
    typography: "{typography.ui-body-strong}"
    rounded: "{rounded.sm}"
    size: 28px
  button-ghost:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.ui-body-strong}"
    padding: "0 12px"

  # ── 面板 ──
  rail-item:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink-muted}"
    typography: "{typography.ui-caption}"
    iconSize: 24px
    width: "{shell.rail-width}"
    padding: 16px
    gap: "4px"
  rail-item-active:
    backgroundColor: "{colors.primary-soft}"
    textColor: "{colors.primary}"
    indicatorBar: "4px solid {colors.primary}"
    indicatorPosition: "left"
  rail-item-hover:
    backgroundColor: "{colors.surface-hover}"
  panel-drawer:
    backgroundColor: "{colors.canvas}"
    width: "{shell.rail-drawer-width}"
    borderRight: "1px solid {colors.hairline-soft}"
    padding: 16px
  panel-section-header:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink-muted}"
    typography: "{typography.ui-body-strong}"
    padding: 16px 0
    borderBottom: "none"
  panel-divider:
    borderColor: "{colors.hairline-soft}"
  property-panel:
    backgroundColor: "{colors.canvas}"
    width: "{shell.property-panel-width}"
    borderLeft: "1px solid {colors.hairline-soft}"

  # ── 表单 ──
  input-text:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink-strong}"
    borderColor: "{colors.hairline}"
    placeholderColor: "{colors.ink-hint}"
    typography: "{typography.ui-body}"
    rounded: "{rounded.sm}"
    height: 30px
  input-focused:
    borderColor: "{colors.primary}"
    boxShadow: "0 0 0 2px {colors.primary-ring}"
  input-disabled:
    backgroundColor: "{colors.surface-inset}"
    textColor: "{colors.ink-disabled}"

  # ── 选择与状态 ──
  selection-outline:
    outline: "2px dashed {colors.primary}"
  selected-state:
    boxShadow: "0 0 2px 3px {colors.primary}"
  tag-soft:
    backgroundColor: "{colors.primary-soft}"
    textColor: "{colors.primary}"
    rounded: "{rounded.sm}"
  icon-button:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    iconSize: "14px"
    hitArea: 28px
    rounded: "{rounded.sm}"

  # ── 画布层 ──
  artboard:
    backgroundColor: "{colors.canvas}"
    boxShadow: "{elevation.artboard}"
  artboard-tray:
    backgroundColor: "{colors.canvas}"
    borderRadius: "{rounded.lg}"
    boxShadow: "{elevation.floating}"
    height: "{shell.artboard-strip-height}"
  artboard-tray-item:
    borderRadius: "{rounded.sm}"
    padding: 8px
    gap: 8px
  zoom-control:
    backgroundColor: "{colors.canvas}"
    borderColor: "{colors.hairline}"
    borderRadius: "{rounded.sm}"
    right: "{shell.zoom-control-right}"
    bottom: "{shell.zoom-control-bottom}"
  scrim-spotlight:
    boxShadow: "0 0 0 5000px {colors.scrim-spotlight}"
    zIndex: 8
  transparent-checker:
    backgroundColor: "{colors.transparent-checker}"
    backgroundImage: "linear-gradient(to top right, {colors.transparent-checker-alt} 25%, transparent 25%, transparent 75%, {colors.transparent-checker-alt} 75%, {colors.transparent-checker-alt})"
    backgroundSize: "16px 16px"

  # ── 后台：外壳 ──
  admin-sidebar:
    backgroundColor: "{colors.canvas}"
    width: "{admin-shell.sidebar-width}"
    borderRight: "1px solid {colors.hairline-soft}"
  admin-brand:
    height: "{admin-shell.brand-height}"
    borderColor: "{colors.hairline-soft}"
    borderBottom: "1px solid {colors.hairline-soft}"
    markSize: 32px
    markRadius: "{rounded.md}"
    markBackground: "{colors.primary}"
    markColor: "{colors.canvas}"
  admin-nav-group-title:
    textColor: "{colors.ink-hint}"
    typography: "{typography.ui-caption}"
    fontSize: 11px
    fontWeight: 600
    letterSpacing: "0.08em"
  admin-nav-item:
    height: "{admin-shell.nav-item-height}"
    radius: "{rounded.sm}"
    textColor: "{colors.ink-secondary}"
    typography: "{typography.ui-body}"
    iconSize: 16px
    gap: 10px
  admin-nav-item-hover:
    backgroundColor: "{colors.surface-hover}"
  admin-nav-item-active:
    backgroundColor: "{colors.primary-soft}"
    textColor: "{colors.primary}"
    fontWeight: 600
  admin-user-avatar:
    size: 32px
    radius: "{rounded.full}"
    backgroundColor: "{colors.primary-soft}"
    color: "{colors.primary}"
    fontWeight: 600
    font: 13px
  admin-topbar:
    backgroundColor: "{colors.canvas}"
    height: "{admin-shell.topbar-height}"
    padding: "0 28px"
    borderBottom: "1px solid {colors.hairline-soft}"
  admin-topbar-title:
    typography: "{typography.ui-heading}"
    fontSize: 17px
    textColor: "{colors.ink-strong}"
  admin-topbar-desc:
    typography: "{typography.ui-caption}"
    fontSize: 13px
    textColor: "{colors.ink-muted}"
  admin-pane:
    backgroundColor: "{colors.canvas}"
    padding: "{admin-shell.pane-padding}"
    border: "1px solid {colors.hairline}"
    borderRadius: "{rounded.md}"
    stackGap: "{admin-shell.pane-gap}"
  admin-pane-title:
    typography: "{typography.ui-heading}"
    fontSize: 15px
    textColor: "{colors.ink-strong}"
    marginBottom: 14px
  admin-pane-toolbar:
    gap: 10px
    marginBottom: 16px
  admin-search-input:
    width: 260px
  admin-name-input:
    width: 200px
  admin-pagination:
    alignment: "flex-end"
    marginTop: 16px

  # ── 后台：总览页 ──
  stat-card:
    backgroundColor: "{colors.canvas}"
    border: "1px solid {colors.hairline}"
    borderRadius: "{rounded.md}"
    padding: "18px 20px"
    gap: 14px
    hoverBorder: "1px solid {colors.hairline-strong}"
  stat-card-icon:
    size: "{admin-shell.stat-card-icon}"
    radius: "{rounded.sm}"
    backgroundColor: "{colors.primary-soft}"
    color: "{colors.primary}"
    iconSize: 22px
  stat-card-label:
    typography: "{typography.ui-caption}"
    fontSize: 13px
    textColor: "{colors.ink-muted}"
  stat-card-value:
    fontSize: "{admin-shell.stat-value-size}"
    fontWeight: 600
    textColor: "{colors.ink-strong}"
    fontVariantNumeric: "tabular-nums"
  stat-card-hint:
    typography: "{typography.ui-caption}"
    textColor: "{colors.ink-hint}"
  stat-card-arrow:
    color: "{colors.primary}"
    iconSize: 16px
    revealOn: "hover"
  quick-action:
    backgroundColor: "{colors.canvas}"
    border: "1px solid {colors.hairline}"
    borderRadius: "{rounded.sm}"
    padding: "14px 16px"
    gap: 14px
    hoverBorder: "1px solid {colors.hairline-strong}"
    focusRing: "1px solid {colors.primary}, 0 0 0 2px {colors.primary-ring}"
  quick-action-icon:
    size: 36px
    radius: "{rounded.sm}"
    backgroundColor: "{colors.surface-inset}"
    color: "{colors.ink-secondary}"
    iconSize: 18px
  quick-action-name:
    typography: "{typography.ui-body-strong}"
  quick-action-desc:
    typography: "{typography.ui-caption}"
    textColor: "{colors.ink-muted}"
  quick-action-arrow:
    color: "{colors.ink-hint}"
    hoverColor: "{colors.primary}"

  # ── 后台：数据表 ──
  data-table:
    size: "small"
    stripe: true
    headerBackground: "{colors.canvas-page}"
    headerColor: "{colors.ink-muted}"
    headerFont: "{admin-shell.table-header-font}"
    headerWeight: 600
    headerCellPadding: "11px 0"
    bodyColor: "{colors.ink}"
    bodyFont: "{admin-shell.table-body-font}"
    bodyCellPadding: "9px 0"
    emptyBlockMinHeight: 120px
  data-table-cell-link:
    textColor: "{colors.primary}"
    hoverColor: "{colors.primary-hover}"
  data-table-muted:
    typography: "{typography.ui-caption}"
    textColor: "{colors.ink-hint}"
  cover-empty:
    backgroundColor: "{colors.canvas-page}"
    color: "{colors.ink-hint}"
    size: "64px × 36px"

  # ── 浮层 ──
  dialog:
    backgroundColor: "{colors.canvas}"
    borderRadius: "{rounded.sm}"
    padding: 24px
    boxShadow: "{elevation.floating}"
  toast:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.canvas}"
    borderRadius: "{rounded.sm}"
    padding: "12px 16px"
---

## 1. 视觉主题与氛围

一个**只做一件事**的桌面端编辑器：把画布交还给用户，界面本身退到最浅。

整个 chrome 是白色面板叠在浅灰工作区上，没有任何渐变、毛玻璃、发光或插画。视觉强度只来自三个地方——`#2254f4` 的选中态、面板之间的 1px 分隔线、画布上元素的虚线描边。其余一切（面板标题、图标、次要文字）都用同一套灰色阶梯做区分。

这套规范有意**不追求视觉记忆点**。海报设计器的画布内容永远是主角，任何在 chrome 上制造"品牌感"的装饰都会和用户做的图抢注意力。

**核心特征：**

- 单一强调色 `{colors.primary}`，语义严格限定为「选中 / 激活 / 主按钮」，不做任何装饰用途。
- 字重只有 **400 和 600** 两级。编辑器 chrome 的层级靠字号（12 / 14 / 22）与颜色阶梯区分，不靠字重；后台 `/admin` 是密集数据界面，另用一套更细的字号阶梯（见 §6.1）。
- 面板分层靠 **1px hairline**（`{colors.hairline}` / `{colors.hairline-soft}`），不靠阴影。
- 阴影只留给三类：浮层（画板托盘、弹窗、Popover）、选中态光晕、画板本身。
- 中文走系统字栈，无第三方字体依赖（唯一的品牌字体 `TitleFont` 只用在 22px 的 logo 处）。

## 2. 颜色与角色

> 现有代码中的取值。标「新增」的是本规范补齐、尚未落地的。

### 强调色

- **Primary** (`{colors.primary}` — `#2254f4`)：整个系统唯一的品牌色。用在主按钮、当前画板选中、左侧图标轨激活项、输入框聚焦边框。
- **Primary Hover / Active** (`{colors.primary-hover}` / `{colors.primary-active}`)：`#1a44d6` / `#1639b8`。**新增**，按 EP 的加深逻辑推得，落地前请确认。
- **Primary Soft** (`{colors.primary-soft}` — `#e8efff`)：激活行的底色、软标签底。**新增**。
- **Primary Ring** (`{colors.primary-ring}`)：输入框聚焦光晕 `0 0 0 2px`。**新增**。

### 文本阶梯（六级，全部来自现有代码）

| Token | 值 | 用途 |
|---|---|---|
| `{colors.ink-strong}` | `#262c33` | 输入框内的文字（`@color-dark-gray`） |
| `{colors.ink}` | `#333333` | 正文、顶栏文字、logo |
| `{colors.ink-secondary}` | `#50555b` | 次级标题、说明（`@color4`） |
| `{colors.ink-muted}` | `#666666` | 面板分区标题、次要信息 |
| `{colors.ink-hint}` | `#999999` | 占位符、时间戳、禁用提示 |
| `{colors.ink-disabled}` | `#c2c2c2` | 不可点状态（顶栏 `.disable`） |

### 表面

| Token | 值 | 用途 |
|---|---|---|
| `{colors.canvas}` | `#ffffff` | 面板、顶栏、输入框、弹窗 |
| `{colors.canvas-artboard}` | `#f8f8f8` | 画布工作区（`@canvasBG`） |
| `{colors.canvas-page}` | `#f0f2f5` | 首页、模板列表页（`@pageBG`） |
| `{colors.surface-inset}` | `#f0f0f0` | 内嵌区域、禁用输入底、透明棋盘格底（`@transparent-bg`） |
| `{colors.surface-hover}` | `rgba(0,0,0,0.03)` | 图标轨 hover 底。**新增** |

`#f8f8f8` 与 `#ffffff` 的差值故意只有 2%——画布区和面板必须看得出界限，但不能形成视觉上的第二层。

### 描边

- `{colors.hairline}` `#e5e7eb` — 全局 1px 边框（`*` 默认 border-color，输入框、按钮、画板托盘）。
- `{colors.hairline-soft}` `rgba(0,0,0,0.07)` — 面板内部分区线、左右面板与画布的分界。
- `{colors.hairline-strong}` `#dcdfe6` — 需要更强对比的表格线（与 EP `--el-border-color` 对齐）。

### 语义色

`success #67c23a` / `warning #e6a23c` / `danger #f56c6c` / `info #909399` —— 直接沿用 Element Plus 默认值，**不单独覆写**。理由：EP 组件（`ElDialog`、表单校验、消息提示）已经内置这套值，自定义一套只会在组件库和手写样式之间产生两套语义色。

## 3. 字体排印

### 字体族

- **UI** — `{typography.family-ui}`：`system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial, Hiragino Sans GB, Microsoft YaHei, sans-serif`。全局正文，无第三方字体。Latin 系统字体在前以保证越南语声调符号正确渲染，CJK 字体仅作兜底。
- **Brand** — `{typography.family-brand}`：`TitleFont`（本地子集 `xpsj.subset.woff2`）→ `PingFang SC` 兜底。**只用于 22px 的 logo 一处**，不参与任何 UI 层级。
- **Mono** — `{typography.family-mono}`：`ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`。用于 px 数值、尺寸标注、坐标读数。**新增**，系统字栈，无需下载。

> 画布内的**用户内容字体**（海报文字）由运行时按需从服务端加载，不属于本规范的 chrome 字体，不在此约束。

### 层级

| Token | 大小 / 字重 | 用途 |
|---|---|---|
| `{typography.ui-brand}` | 22px / 400，letter-spacing 2px | 顶栏 logo |
| `{typography.ui-heading}` | 14px / 600 | 面板分区标题（`el-collapse` 头被强制为 14px） |
| `{typography.ui-body}` | 14px / 400 | 默认正文、输入框 |
| `{typography.ui-body-strong}` | 14px / 600 | 按钮、顶栏操作项文字 |
| `{typography.ui-caption}` | 12px / 400 | 图标轨标签、次级说明 |
| `{typography.ui-hint}` | 12px / 400，色 `{colors.ink-hint}` | 占位符、禁用提示 |
| `{typography.ui-mono}` | 12px / 400 | 数值与尺寸读数 |

### 原则

- **字重只有 400 与 600。** 不引入 300 / 500 / 700。14px 下 400 与 600 的对比已经足够分辨层级，更多字重在小字号下反而糊。
- **编辑器 chrome 只有 12 / 14 / 22 三档字号。** 需要"更大的标题"时，说明这块内容属于画布而非界面。后台 `/admin` 例外：数据密集界面需要更细的区分，用 11（分组标题）/ 13（表体）/ 15（面板标题）/ 17（页面标题）/ 26（总览数字）/ 12（辅助说明），见 §6.1。
- 顶栏操作项的图标与文字间距固定 `0.4rem`（≈6px），不用 CSS gap 随手调。

## 4. 组件样式

### 按钮

- **`button-primary`** — 主操作（保存、下载、确认）。EP `type="primary"`，`font-weight: 600`，高度 28px，圆角 6px。
- **`button-plain`** — 次主操作。白底 + 主色描边 + 主色文字。
- **`button-ghost`** — 顶栏操作项、纯文字按钮。无底色无边框，`{typography.ui-body-strong}`。
- **`icon-button`** — 画布工具条、图层层级调整。透明底，图标 14px，命中区 28px，**不加圆形底色**（图标轨是扁平 rail，不是圆形按钮）。

按钮统一 `font-weight: 600`，这是现有 `.primary-btn` / `.text` 的约定，保持一致。

### 面板与分区

- **`rail-item`** — 左侧 66px 图标轨：图标 24px + 标签 12px，垂直排列，间距 4px，内边距 16px。
  - 激活态：`{colors.primary-soft}` 底 + 主色文字 + **左侧 4px 主色竖条**。竖条是这套系统里最主要的"当前在哪"信号。
  - Hover 态：`{colors.surface-hover}` 底（新增）。
- **`rail-drawer`** — 328px 内容抽屉，右侧 `1px solid {colors.hairline-soft}`，内边距 16px。收起手柄位于 `left: 394px`。
- **`panel-section-header`** — 分区标题（`el-collapse`）：14px / 600，色 `{colors.ink-muted}`，`padding: 0`，无外边框，展开内容与上一区分靠 `{colors.hairline-soft}` 线。
- **`property-panel`** — 右侧 280px 固定宽，左侧 `1px solid {colors.hairline-soft}`，「设置 / 图层」双标签。

### 表单

- **`input-text`** — 14px，高度 30px，圆角 6px，边框 `{colors.hairline}`，文字 `{colors.ink-strong}`。
- **`input-focused`** — 边框变主色 + `0 0 0 2px {colors.primary-ring}` 光晕。焦点只靠这个表达，不改底色。
- **`input-disabled`** — 底 `{colors.surface-inset}`，文字 `{colors.ink-disabled}`。

### 选择与状态

- **`selection-outline`** — `2px dashed {colors.primary}`。画布元素 hover 与选中同一套（`.layer` / `.layer-hover`）。
- **`selected-state`** — `0 0 2px 3px {colors.primary}`。画板托盘项、模板项的选中标记。
- **`tag-soft`** — `{colors.primary-soft}` 底 + 主色文字，圆角 6px。用于模板分类、状态标记。
- **`icon-button`** — 见上。

> 图标是 **Alibaba iconfont**（`font_2717063` 的 `iconfont icon-*` 与 `font_3228074` 的 `icon sd-*` 两套，运行时注入），字号 14–24px。注意：iconfont 通过 `color` 控色、无法逐处改填充，也不适合做 `background-image` 替换。新增图标时沿用两套 iconfont，不引入 SVG sprite。

## 5. 设计画布与编辑器交互

> 这一节是本规范的核心增量。参考过的那几份 DESIGN.md 全部是营销官网文档，画布类工具的部分是空白，只能由本项目自定。

### 画板

- 画板本体 `1px` 白底 + `{elevation.artboard}`（`1px 1px 10px 3px rgba(0,0,0,0.1)`）。这是界面里唯一"重"的阴影，因为它要区分**用户的内容**和**画布区域**。
- 画板在 `{colors.canvas-artboard}`（`#f8f8f8`）上居中。
- 透明背景用棋盘格：`#f0f0f0` 底 + 白色 16px 斜纹（`.transparent-bg`），`user-select: none`。

### 选区

- **虚线是唯一的选择语言**：hover 与选中都用 `2px dashed {colors.primary}`，不区分粗细或虚实差异。用户已经习惯"虚线 = 可点"。
- 多选用 `selecto` 的矩形拉框，单元素操作手柄由 `moveable` 提供。这两套库的手柄颜色**必须**覆盖成 `{colors.primary}`，不允许出现它们自带的青色/紫色默认值。
- 锁定元素 `.layer-lock`：`pointer-events: none`。视觉上不额外加锁图标，除非是图层面板内的标记。

### 多画板

- 底部画板托盘可折叠：展开 90px / 折叠 38px，圆角 12px（`{rounded.lg}`），阴影 `{elevation.floating}`。
- 托盘内画板缩略图圆角 6px，内边距 8px。
- 当前画板用 `{elevation.selected}` 标记。

### 缩放控件

- 绝对定位 `bottom: 10px; right: 292px`——刚好落在右侧属性面板（280px）的外缘。
- 白底 + `{colors.hairline}` 边框 + 6px 圆角，阴影 `{elevation.floating}`。
- 百分比与像素读数用 `{typography.ui-mono}`。

### 遮罩聚光

- `shelter` / `shelter-bg`：`0 0 0 5000px rgba(248,248,248,0.99)`，`z-index: 8`，`pointer-events: none`。
- 用途：局部工具（如批量裁剪、对齐辅助）需要"把视线压到一块区域内"时的环境遮罩。
- 这是全界面唯一的"大面积着色"手法，**只限此类交互**，不得用于装饰或分区背景。

### 坐标 / 辅助线

- 对齐辅助线用 `@scena/guides`，颜色必须为主色或 `{colors.ink}` 的单色，不使用彩虹色辅助线。

## 6. 布局与面板拓扑

```
┌────────────────────────────────────────────────────────────┐
│  topbar  54px  ───────────────────────────────────────────  │  logo · 撤销重做 · 文件/帮助/AI 助手 · 保存 下载 登录
├──┬──────┬─────────────────────────────────────┬───────────┤
│66│  328 │                                      │           │
│rail│drawer│        canvas-artboard #f8f8f8      │ property  │
│    │      │        ┌──────────┐                │ 280px     │
│66px│      │        │ artboard │                │ 设置/图层  │
│    │      │        └──────────┘   [zoom 292px] │           │
│    │      │                                      │           │
├──┴──────┴─────────────────────────────────────┴───────────┤
│  artboard strip  90px（折叠 38px）                          │
└────────────────────────────────────────────────────────────┘
```

- 整体 `min-width: 1180px`，`overflow: hidden`。三段横向布局，画布区 `flex: 1`。
- 面板宽度是**固定值**，不随视口缩放：rail 66、drawer 328、property 280。只有画布区吃剩余空间。
- 顶栏 `position: fixed`，下方内容不为其留 padding，靠 `flex` 撑满。
- 间距基础网格 **8px**：`{spacing.xxs} 4` / `xs 8` / `sm 12` / `md 16` / `lg 24` / `xl 32`。顶栏内边距统一 16px。

### 6.1 后台 `/admin`

后台是**独立的第二套壳**，不复用编辑器的 66px 图标轨：那里是「常驻工具栏」，需要一眼扫全；后台是「文档型导航」，需要分组和文字标签。

```
┌────────────────────────────────────────────────────────────┐
│ sidebar 248px  │   topbar 64px  标题 + 一句职责说明  [打开编辑器] │
│  brand         ├───────────────────────────────────────────┤
│  ├ 概览         │                                            │
│  ├ 内容与资源   │   admin-body  padding 24px 28px 28px       │
│  ├ 用户         │   ┌────────── admin-pane ────────────┐    │
│  └ 系统         │   │ toolbar （左：筛选；右：主操作）   │    │
│ ─────────────  │   │ ┌── data-table ──────────────┐   │    │
│  A  admin  登出│   │ └─────────────────────────────┘   │    │
│                │   │              [pagination 右对齐] │    │
│                │   └──────────────────────────────────┘    │
└────────────────────────────────────────────────────────────┘
```

- **浅侧栏，不做暗色控制台。** 暗侧栏是管理类产品的惯性，但会引入第二个背景色族，与编辑器的白色面板体系冲突。侧栏与面板同为 `{colors.canvas}`，靠 `1px {colors.hairline-soft}` 分界。
- **导航靠分组标题定位，不靠图标色块。** 分组标题 11px / `{colors.ink-hint}` / `letter-spacing: 0.08em`，是全站唯一的极小字号，用来标记「层级」而非「内容」。
- **激活项 = `{colors.primary-soft}` 底 + 主色文字 + 600 字重**，圆角 6px 填满行宽 38px 高。**不加左侧竖条**——竖条在 248px 宽的侧栏里会显得过重，`{colors.primary-soft}` 的底色对比已经足够；左侧竖条只留给编辑器的 66px 图标轨（那地方底色面积太小，必须靠竖条）。
- **内容区整体滚动，不是表格内滚动。** 每个 pane 是独立白托盘（`1px {colors.hairline}` + 8px 圆角），pane 之间 16px 间距，`admin-body` 一个滚动容器吃剩余高度。不写 `calc(100vh - Npx)` 的表格高度魔法数字——那是脆弱的，且会让分页按钮随内容跳动。
- **顶栏带一句职责说明。** 标题 17px / 600，下方 13px / `{colors.ink-muted}` 的一句话说明（如「管理可直接使用的完整设计模板，以及可组合到画布中的设计组件」）。这是「不专业」的主要成因之一：原来只有页签标题，用户不知道当前页管什么、不删什么。
- **总览页优先于数据表。** 首页是 4 张统计卡（26px 数字，`tabular-nums` 对齐）+ 4 个常用操作入口，而不是直接甩一张表。统计卡与操作入口的底色是白，图标 chip 分别是 `{colors.primary-soft}`（统计）与 `{colors.surface-inset}`（操作），两者不共用，避免「所有卡片长得一样」。
- **数据表统一为 `size="small"` + stripe + 13px 字号**，表头底色 `{colors.canvas-page}`（`#f0f2f5`，与内容区底色同色，形成「表头属于页面、表格浮在页面上」的视觉关系），表头 600 / `{colors.ink-muted}`，单元格内边距纵向 11px / 9px。表头样式由 `Admin.vue` 用 scoped `:deep()` 从一处统一下发，包括子组件 `AdminTemplateTable.vue` 内部的表头——不要在各表格上分散覆写。
- **工具栏左右分区**：筛选与搜索靠左，主操作靠右，中间 `flex: 1` 的 spacer。搜索输入固定 260px、名称输入固定 200px，不随内容伸缩。
- **分页右对齐**，`margin-top: 16px`。字体页因自带搜索分页，`adminTotal` 保持 0，不与全局分页共存。
- **不做移动端折叠。** 248px 侧栏为固定宽度；`@media (max-width: 900px)` 只处理统计卡（4→2 列）、快捷操作（2→1 列）与工具栏换行，不改变骨架。后台面向桌面端管理员，不做响应式抽屉。

## 7. 深度与阴影

| 级别 | 值 | 用途 |
|---|---|---|
| `flat` | `none` | 面板、顶栏、输入框、画板托盘项 |
| `hairline` | `1px {colors.hairline}` | 需要框起来的元素（输入框、表格行、画板托盘） |
| `floating` | `0 0 2px 0 rgba(0,0,0,.08), 0 4px 12px 0 rgba(0,0,0,.04)` | **浮层专用**：画板托盘、弹窗、Popover、缩放控件 |
| `selected` | `0 0 2px 3px {colors.primary}` | 选中态光晕（画板托盘项） |
| `artboard` | `1px 1px 10px 3px rgba(0,0,0,.1)` | 画板本体 |
| `spotlight-scrim` | `0 0 0 5000px rgba(248,248,248,.99)` | 局部遮罩 |

`floating` 是叠层阴影（近处 2px 极淡 + 远处 12px 更淡），不是单个大投影——这是刻意的：工具 UI 的浮层要"浮起来"但不能显得像卡片贴纸。

**阴影不用于面板分层。** 左右面板与画布区之间是 1px 线，加阴影会让人误以为面板是浮在画布上的。

## 8. Element Plus 落地映射

覆写集中在 `src/assets/styles/tokens.less`（由 `index.less` 只编译一次）。LESS 变量（`color.less`）是单一真源，`:root` 里的值全部从 LESS 变量派生，**不需要两处同值**。

```less
:root {
  --el-color-primary:         @color-primary;                        // #2254f4
  --el-color-primary-light-3: mix(white, @color-primary, 30%);       // #6487f7
  --el-color-primary-light-5: mix(white, @color-primary, 50%);       // #91aafa
  --el-color-primary-light-7: mix(white, @color-primary, 70%);       // #bdccfc
  --el-color-primary-light-8: mix(white, @color-primary, 80%);       // #d3ddfd
  --el-color-primary-light-9: mix(white, @color-primary, 90%);       // #e9eefe
  --el-color-primary-dark-2:  mix(black,  @color-primary, 20%);      // #1b43c3
  --el-color-primary-rgb:     34, 84, 244;
  --el-border-radius-base:    @radius-sm;                            // 6px
}
```

**为什么必须显式给出浅色档**：EP 打包时用 Sass `mix()` 把 `--el-color-primary-light-N` / `-dark-2` 烘焙成字面量（`light-N = mix(white, base, N*10%)`，`dark-2 = mix(black, base, 20%)`），运行时**不会**跟随 `--el-color-primary` 重算。只覆写 `--el-color-primary` 会让 ElButton 的 hover/active、`is-plain` 底色、ElTag 浅底停留在 EP 默认的 `#409eff` 色族。上面用 LESS 的 `mix()` 按同一公式现场推导——LESS 输出与 EP 的 Sass 逐值一致（已用 EP 内置 `#409eff` 的 light-3/5/9 与 dark-2 四个值校验过），因此改 `@color-primary` 时无需手工维护这一组。

> 实测：`.el-button--primary.is-plain` 的底色取 `--el-color-primary-light-9`、边框取 `-light-5`。回归时「登录 / 注册」「成组」两个 plain 按钮已确认算出 `#e9eefe` / `#91aafa`，即本表生效，而非 EP 默认的 `#ecf5ff` / `#a0cfff`。

**刻意不覆写的三项**（保持 EP 默认）：

| 变量 | EP 默认 | 不覆写的理由 |
| --- | --- | --- |
| `--el-text-color-*` | `#303133` / `#606266` / `#909399` | 与 ink 阶梯相差 ≤2 个色阶，覆写只会在 `/admin` 密集表格里造成无意义漂移 |
| `--el-fill-color-light` | `#f5f7fa` | 表格行 hover 背景依赖它，改成 `#f8f8f8` 会让 hover 态几乎不可见 |
| `--el-border-color-lighter` | `#ebeef5` | 表格单元格线依赖它，改成 `#e5e7eb` 会让表格线整体变深 |

EP 内部的字重（如 `.el-collapse-item__header` 的 `500`）不改——§3 的「字重只有 400 与 600」约束适用于本项目源码，不覆盖组件库自身实现。

全局注册的 EP 组件只有 `ElSpace / ElButton / ElCard / ElCollapse / ElCollapseItem / ElCollapseTransition / ElColorPicker / ElDialog / ElDivider / ElImage / ElInput / ElPopover`（见 `src/utils/widgets/elementConfig.ts`），其余需手动引入。本规范的 `button-*`、`input-*`、`dialog` 对应这几个；其余组件按同一套 token 手动实现。

## 9. 该做与不该做

### 该做

- 用 6px 作为唯一基准圆角；`12px` 只给浮层托盘，`4px` 只给滚动条和极小的 chip。
- 层级靠「字号（编辑器 12/14/22，后台另用 §6.1 的阶梯）+ 颜色阶梯（6 档灰）+ 字重（400/600）」表达，不要再加第四种手段。
- 面板之间只用 1px 线（`{colors.hairline}` 或 `{colors.hairline-soft}`）。
- 主色只出现在三种语义上：选中、激活、主按钮。
- 画布区内的任何用户内容样式，都不要用 chrome 的 token 去描述——那是两份不同的系统。
- 新增图标沿用两套 iconfont（`iconfont icon-*` / `icon sd-*`）。

### 不该做

- **不做暗色模式，不做主题切换。** 当前只有浅色一套，本规范只描述浅色。
- 不在 chrome 里放渐变、毛玻璃、发光、插画、emoji 装饰。
- 不用阴影区分面板层级——那是线的活。
- 不引入 6 档以外的中间灰（历史代码里的 `#808080`、`#a5a5a5` 已收敛到 `#999999`）。
- 不使用第二、第三个蓝色（历史遗留 `#1195db`、`#24b9ff`，见第 12 节）。
- 不用衬线字体，不用等宽字体排正文（等宽只给数值读数）。
- 不给图标按钮加圆形底色——图标轨是扁平 rail。
- 不给画布区加任何背景纹理、水印色块或装饰。
- 不用 `!important` 覆盖本规范的 token，除非是修 Element Plus 内部类（`base.less` 里那几处历史 fix 除外）。

## 10. 响应式与断点

这是一个**桌面端工具**，不做移动端适配。

| 约束 | 值 | 说明 |
|---|---|---|
| 最小宽度 | 1180px | `#page-design-index` 的 `min-width`，低于此宽直接不可用 |
| 画布区 | `flex: 1` | 唯一随视口伸缩的区域 |
| 左侧抽屉 | 328px 固定 | 可整体收起，手柄在 `left: 394px` |
| 右侧属性面板 | 280px 固定 | 不折叠 |
| 底部画板托盘 | 90 / 38px | 可折叠 |
| 触摸目标 | 28px 最小命中区 | 桌面工具，不追 44px 移动标准 |

缩放由用户主动控制（缩放控件 + 快捷键），**不做自适应缩放**。

## 11. Agent 提示指南

### 快速色值参考

```
主色   #2254f4    选中 / 激活 / 主按钮（唯一强调色）
文本   #333333    正文      #262c33 输入内文字
       #50555b    次级      #666666 分区标题
       #999999    占位符    #c2c2c2 禁用
白面板 #ffffff    面板/输入/弹窗
工作区 #f8f8f8    画布区域  #f0f2f5 列表页
内嵌   #f0f0f0    内嵌区/棋盘格底
边框   #e5e7eb    全局 1px   rgba(0,0,0,.07) 面板分区线
圆角   6px 基准    12px 浮层托盘
字重   400 / 600  （仅此两级）
字号   12 / 14 / 22 px（编辑器 chrome 仅此三档；后台见 §6.1）
```

### 可直接使用的提示

1. **加一个新面板分区**
   > 在右侧属性面板里加一个「阴影」分区：用 `panel-section-header` 标题（14px/600、`#666666`、padding 16px 0、无外边框），分区之间用 `rgba(0,0,0,0.07)` 的 1px 线分隔，内部控件用 `input-text`（14px、30px 高、6px 圆角、`#e5e7eb` 边框）。不加阴影、不加渐变。

2. **做一个新的浮层托盘 / 弹窗**
   > 浮层用白底 + `0 0 2px 0 rgba(0,0,0,.08), 0 4px 12px 0 rgba(0,0,0,.04)` 的叠层阴影，托盘圆角 12px、内部缩略图圆角 6px。不要用单个大投影，也不要给面板本身加阴影。

3. **标记"当前选中"**
   > 选中态二选一：画板托盘项用 `0 0 2px 3px #2254f4`；画布元素用 `2px dashed #2254f4`。左侧图标轨激活项额外加左侧 4px 主色竖条 + `#e8efff` 底 + 主色文字。不要引入第二套选中视觉。

4. **写一处需要显示数值的读数（px / % / 坐标）**
   > 用 `ui-monospace`（`ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`）12px，颜色 `#666666`，不要对正文使用等宽字体。

5. **给后台加一个新的管理页**
   > 在 `src/views/admin/constants.ts` 的 `NAV_GROUPS` 里加导航项（`key` 必须与 `Admin.vue` 里 pane 的激活键一致），在 `PAGE_META` 里补一句 14 字以内的职责说明。`Admin.vue` 里加一个 `<section v-else-if="activeTab === '<key>'" class="pane">`，工具栏按「筛选靠左 / 主操作靠右」排布，表格用 `class="admin-table" size="small" stripe v-loading="loading"`——表头与单元格样式由 `Admin.vue` 的 scoped `:deep()` 统一下发，不要在新 pane 里再写一遍表头样式，也不要写 `calc(100vh - Npx)` 的表格高度。分页接共享的 `adminPage / adminPageSize / adminTotal`，`data-table` 字号统一 13px。侧栏用浅底，激活项是 `#e8efff` 底 + 主色文字，不加左侧竖条。

### 修改本文件

1. 一次只改一类 token，改完在 `version` 上递增。
2. 新增 token 时，先确认现有代码里没有语义重复的值（尤其是灰色和蓝色）。
3. 改色只改 `src/assets/styles/color.less`；第 8 节的 EP 变量由 LESS `mix()` 从 `@color-primary` 现场推导，无需手工同步（改完更新 §8 括号里的示例值即可）。
4. 新增组件变体写成独立条目（`-hover` / `-active` / `-disabled`），不要写进散文。
5. 标为「新增」的 token 落地前需要在代码里找到对应实现，或在第 13 节登记。

## 12. 遗留值收敛状态

本规范定了唯一主色与唯一圆角基准。本轮已收敛的项标记为 ✅（不要回退），未收敛项保留原因。

| 遗留值 | 位置 | 状态 |
|---|---|---|
| `#1195db` | `public/favicon.svg` 的 `fill` | ✅ → `#2254f4`。注释里的旧值仅作为「已废弃」说明保留 |
| `#24b9ff` | `base.less` `.el-pager .active` 背景 | ✅ → `@color-primary` |
| `#fa8334` | `color.less` 注释里的橙色历史值 | ✅ 已随 `@active-text-color` / `@main-color` 归并消失 |
| `5px` | `base.less` 分页 / select 输入 / 跳转框、`HeaderOptions.vue` 弹窗 | ✅ → `@radius-sm` 6px |
| `rgba(202, 119, 119, 0.1)` | `design.less` `.top-nav-wrap` 的 `border-bottom` | ✅ → `@color-hairline-soft`（原为偏粉残留色） |
| `#a5a5a5` | `base.less` 翻页器未激活文字 / 箭头 | ✅ → `@color-ink-hint` |
| 游离蓝 `#409eff` / `#66b1ff` / `#3771e5` / `#3b74f1` | `AiAssistant.vue`、`ProgressLoading/*`、`valueSelect.vue`、`sizeControl.vue`、`wGroupStyle.vue` | ✅ 全部 → `@color-primary` 系列 |
| `/admin` 的 `el-tabs` 骨架、`calc(100vh - 360px)` 表格高度、硬编码 `#a8abb2` / `#f5f7fa` / `#fff` | `Admin.vue`、`AdminTemplateTable.vue`、`admin/comps/AdminSidebar.vue` | ✅ 换为「浅侧栏 + 带职责说明的顶栏 + 可滚动白托盘」（§6.1）；表格高度交由 `admin-body` 单一滚动容器，不再写视口魔法数字；硬编码色值全部收敛为 token |
| 字重 `bold` / `500` | `iconItemSelect` / `layerList` / `ToolsListWrap` / `searchHeader` / `HeaderOptions` / `ProgressLoading/*` / `widgetPanel` / `TempListWrap` | ✅ → `600`，落实 §3「字重只有 400 与 600」 |
| `#808080` (`@color5`) / `#50555b` (`@color4`) | `design.less` 第 3–4 行 | ⏸ **刻意不改**：两者是死定义，构建产物中 0 次引用，且 `zoomControl` 在 `index.vue` 内局部重新定义了同名变量。改动会影响编辑器缩放控件的现有关键位置，收益为零 |
| `@color-light-gray: #3e4651` | `color.less`（命名与值相反） | ⏸ 已降级为无引用的死别名并标注「待废弃」，删引用前保留以防存量代码依赖 |
| `#333` / `#666` / `#999` / `#ffffff` 散落在 `.vue` 的 style 块中 | 各处 | ⏸ **刻意不批量替换**：值是 token 同值，替换只产生 diff 噪音且零视觉变化，反而放大回归风险 |

## 13. 已知缺口与工程约束

- `/admin` 已按 §6.1 重做外壳，并用管理员账号在浏览器里**逐 pane 验证了全部 10 个面板**：总览（4 张统计卡 + 4 个常用操作）、模板与组件、素材管理（8 行）、照片管理（20 行 / 共 88 条 / 5 页，共享分页正常）、分类管理、字体管理（4 行，`fontQuery.total ≤ pageSize` 时不渲染共享分页，无重复分页）、用户图片（空态）、用户管理（admin 行显示「受保护」、无删除按钮）、用户作品（空态）、AI 设置（表单 + 开关 + 测试连接）。分类管理内的三分支也已验证：切到「照片分类」时**新增「分类键」列**并**移除「模板 / 组件」子切换**，与 `Admin.vue` 的 `v-if="categoryTab === 'photos'"` 条件渲染一致。统计卡跳转已修好：点「组件」卡会切到模板与组件面板并选中组件子视图（原先 `onSelectTab(stat.key)` 指向不存在的 `components` 面板键，会渲染空白内容区）。控制台 0 error / 0 warning。
- **写路径（新增 / 编辑 / 删除 / 修改分类）未回归**：这些操作会真实写入后端数据库，为避免污染数据未执行。仅静态核对了模板与提交逻辑。
- **本轮顺手修掉的遗留 bug**：① 总览「组件」统计卡原先指向不存在的 `components` 面板键，点击后内容区渲染空白，已改为跳 `templates` 并带上组件筛选；② `saveCategory()` 判定成功时读的是 `fontDialog.form.id`（字体弹窗上次的 id）而非本行 id，由于「修改分类」永远是编辑、编辑接口只回 `{ code: 200 }` 不带 `id`，只要本次页面生命周期内没打开过字体编辑弹窗，就会走 `Number(undefined) > 0` → `NaN > 0` 为假 → **后端更新成功了却弹「更新失败」**，已改为只判 `res?.code === 200`；③ 字体弹窗确认按钮编辑态也显示「确认新增」，已按 `fontDialog.form.id` 切换为「确认编辑」。
- **`/admin` 的总览统计有 100 行上限**：模板 / 组件的拆分计数来自 `adminService.getTemplates`（该接口忽略 `type` 参数、返回两类混合结果），取 `pageSize: 100` 一次拉全后在前端按 `type` 过滤计数。超过 100 条时计数会饱和，这是已知取舍——常规管理规模下不会触及。
- **后台无移动端适配**：248px 侧栏为固定宽度，`@media (max-width: 900px)` 只折叠统计卡 / 快捷操作列数与工具栏换行，不改变骨架（见 §6.1 末条）。
- **`lessc` 单独编译会失败，不能当作校验门槛**：`color.less` 依赖 `vite.config.ts` 的 `less.modifyVars` 注入才能解析，直接跑 `lessc index.less` 会报 `NameError: @main-color undefined`。校验改动请用 `npx vite build` 或开发服务器。
- **token 的注入机制**：`vite.config.ts` 用 `modifyVars: { color: 'true; @import "./src/assets/styles/color.less"' }` 把 `color.less` 前置进**每一次** LESS 编译（所有 `.less` 文件与所有 `<style lang="less">` 块）。新增 token 只改 `color.less`，零接线成本。
- **LESS 4.2 的逗号列表 bug**：在逗号分隔的 CSS 自定义属性值里，只有**第一个**函数调用会被求值。`--a: red(@c), green(@c), blue(@c)` 会输出 `34, green(#2254f4), blue(#2254f4)`（无效 CSS）。`tokens.less` 已把三个通道各自解引用为变量规避，并在文件内注释了原因——请勿「简化」回去。
- **`primary-hover` / `primary-active` / `primary-soft` / `primary-ring` / `surface-hover`** 已落地为 token（`color.less` + `tokens.less`），但部分尚无组件消费（如 `--pd-primary-ring` 没有输入框聚焦态在用），属预留而非遗漏。
- 本规范只覆盖**浅色**，没有暗色模式与主题切换（这是产品决策，不是遗漏）。
- 画布内**用户内容**的样式（字号、行高、文字效果、图层层级 z-index 规则）不属于本规范，仍由各功能的实现决定。
- 图标系统未做规范化的填充/描边约定：iconfont 只能整字控色，无法区分前景/背景色，也无法做双色图标。
- 第 4 节的 `data-table` / `dialog` 是按 EP 惯例写的，`/admin` 中尚未逐条核对（见本节首条）。
- 顶栏 54px 与面板内边距 16px 之间存在非网格值（54 = 8×6 + 6），未强行对齐到 8px 网格，以保持现有像素位置不变。
- 本文件不替代 `CLAUDE.md` / `AGENTS.md`：后者描述「怎么改代码」，本文件描述「长什么样」。两份都需要在各自的开头互相指向。
