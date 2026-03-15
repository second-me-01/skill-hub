# Design Tokens Reference

本文档定义了 UI Design System 的完整 token 规范。所有 token 均以 CSS Custom Properties 为基础格式，可转换为 Tailwind config 或 JS 对象。

## 1. Color System / 色彩系统

### 1.1 色阶生成算法

从品牌主色（HSL 格式）出发，通过调整 Lightness 生成 11 级色阶（50 ~ 950）：

```
Step      Lightness (Light Mode)    Lightness (Dark Mode)
──────    ──────────────────────    ─────────────────────
50        97%                       5%
100       93%                       10%
200       86%                       18%
300       76%                       28%
400       62%                       40%
500       50% (anchor)              50% (anchor, -10% sat)
600       40%                       62%
700       30%                       74%
800       22%                       84%
900       14%                       91%
950       8%                        96%
```

**饱和度调整规则：**
- 50-200: 原始饱和度 × 0.9（避免低亮度高饱和的视觉不适）
- 300-700: 保持原始饱和度
- 800-950: 原始饱和度 × 0.85
- Dark mode: 全局饱和度降低 10-15%

### 1.2 Primary Colors

以默认品牌色 `hsl(217, 91%, 60%)` (#2563EB) 为例：

```css
:root {
  --color-primary-50:  217 100% 97%;   /* #eff6ff — 最浅背景 */
  --color-primary-100: 217 95% 93%;    /* #dbeafe — 浅背景、hover 态 */
  --color-primary-200: 217 92% 86%;    /* #bfdbfe — 边框、分割线 */
  --color-primary-300: 217 90% 76%;    /* #93c5fd — 禁用态文字 */
  --color-primary-400: 217 91% 62%;    /* #60a5fa — 图标、次要按钮 */
  --color-primary-500: 217 91% 50%;    /* #3b82f6 — 品牌主色、主按钮 */
  --color-primary-600: 217 91% 40%;    /* #2563eb — 主按钮 hover */
  --color-primary-700: 217 90% 30%;    /* #1d4ed8 — 主按钮 active */
  --color-primary-800: 217 85% 22%;    /* #1e3a8a — 深色文字 */
  --color-primary-900: 217 80% 14%;    /* #172554 — 最深背景 */
  --color-primary-950: 217 75% 8%;     /* #0c1631 — 极深 */
}
```

**对比度参考（white #fff 为背景）：**

| Token | Contrast vs White | WCAG Level | 推荐用途 |
|-------|------------------|------------|---------|
| 50    | 1.04:1           | —          | 浅色背景填充 |
| 100   | 1.12:1           | —          | hover 背景 |
| 200   | 1.35:1           | —          | 边框、分割线 |
| 300   | 2.02:1           | —          | 装饰性元素 |
| 400   | 3.04:1           | AA Large   | 大号文字、图标 |
| 500   | 4.56:1           | AA         | 正文、按钮背景 |
| 600   | 6.28:1           | AA         | 链接文字、重要按钮 |
| 700   | 9.15:1           | AAA        | 标题文字 |
| 800   | 12.4:1           | AAA        | 高对比文字 |
| 900   | 15.8:1           | AAA        | 极高对比场景 |
| 950   | 18.1:1           | AAA        | 接近纯黑 |

### 1.3 Secondary Colors

从 primary 色相偏移 +40° 生成。若 primary H=217，则 secondary H=257（紫色系）。

生成规则与 primary 相同，色阶亮度一致。

```css
:root {
  --color-secondary-50:  257 85% 97%;
  --color-secondary-100: 257 80% 93%;
  --color-secondary-200: 257 78% 86%;
  --color-secondary-300: 257 75% 76%;
  --color-secondary-400: 257 78% 62%;
  --color-secondary-500: 257 80% 50%;
  --color-secondary-600: 257 80% 40%;
  --color-secondary-700: 257 78% 30%;
  --color-secondary-800: 257 72% 22%;
  --color-secondary-900: 257 68% 14%;
  --color-secondary-950: 257 62% 8%;
}
```

### 1.4 Neutral Colors

取 primary 色相，饱和度降至 5-8%，形成带品牌色倾向的中性色。

```css
:root {
  --color-neutral-50:  217 8% 98%;    /* #f8f9fa — 页面背景 */
  --color-neutral-100: 217 7% 95%;    /* #f1f3f5 — 卡片背景、斑马纹 */
  --color-neutral-200: 217 6% 90%;    /* #e5e7eb — 边框、分割线 */
  --color-neutral-300: 217 6% 80%;    /* #ced4da — 禁用态边框 */
  --color-neutral-400: 217 5% 64%;    /* #9ca3af — placeholder 文字 */
  --color-neutral-500: 217 5% 50%;    /* #6b7280 — 次要文字 */
  --color-neutral-600: 217 5% 40%;    /* #4b5563 — 正文 */
  --color-neutral-700: 217 6% 28%;    /* #374151 — 标题 */
  --color-neutral-800: 217 7% 18%;    /* #1f2937 — 重要文字 */
  --color-neutral-900: 217 8% 10%;    /* #111827 — 最深文字 */
  --color-neutral-950: 217 8% 4%;     /* #030712 — 接近纯黑 */
}
```

### 1.5 Semantic Colors

语义色与品牌色无关，保持全局一致性。

```css
:root {
  /* Success — 绿色系 */
  --color-success-50:  142 76% 96%;
  --color-success-100: 141 72% 90%;
  --color-success-200: 141 70% 80%;
  --color-success-300: 142 68% 68%;
  --color-success-400: 142 69% 55%;
  --color-success-500: 142 71% 45%;   /* #22c55e */
  --color-success-600: 142 72% 36%;
  --color-success-700: 142 68% 28%;
  --color-success-800: 143 64% 20%;
  --color-success-900: 144 60% 12%;
  --color-success-950: 145 55% 6%;

  /* Warning — 琥珀色系 */
  --color-warning-50:  48 96% 96%;
  --color-warning-100: 48 93% 90%;
  --color-warning-200: 40 92% 80%;
  --color-warning-300: 38 92% 68%;
  --color-warning-400: 36 93% 56%;
  --color-warning-500: 38 92% 50%;    /* #f59e0b */
  --color-warning-600: 32 90% 42%;
  --color-warning-700: 26 86% 34%;
  --color-warning-800: 22 80% 26%;
  --color-warning-900: 20 75% 16%;
  --color-warning-950: 18 70% 8%;

  /* Error — 红色系 */
  --color-error-50:  0 86% 97%;
  --color-error-100: 0 84% 93%;
  --color-error-200: 0 82% 86%;
  --color-error-300: 0 80% 76%;
  --color-error-400: 0 82% 66%;
  --color-error-500: 0 84% 60%;       /* #ef4444 */
  --color-error-600: 0 72% 50%;
  --color-error-700: 0 68% 40%;
  --color-error-800: 0 62% 30%;
  --color-error-900: 0 56% 20%;
  --color-error-950: 0 50% 10%;

  /* Info — 蓝色系 (可与 primary 共用，也可独立) */
  --color-info-50:  204 94% 96%;
  --color-info-100: 204 90% 92%;
  --color-info-200: 204 86% 84%;
  --color-info-300: 205 82% 74%;
  --color-info-400: 205 84% 64%;
  --color-info-500: 205 86% 56%;      /* #38bdf8 */
  --color-info-600: 205 82% 46%;
  --color-info-700: 205 78% 36%;
  --color-info-800: 205 72% 26%;
  --color-info-900: 205 68% 18%;
  --color-info-950: 205 62% 8%;
}
```

### 1.6 Dark Mode Color Overrides

```css
[data-theme="dark"] {
  /* Surfaces */
  --color-bg-primary:   var(--color-neutral-950);
  --color-bg-secondary: var(--color-neutral-900);
  --color-bg-tertiary:  var(--color-neutral-800);

  /* Text */
  --color-text-primary:   var(--color-neutral-50);
  --color-text-secondary: var(--color-neutral-300);
  --color-text-tertiary:  var(--color-neutral-400);

  /* Borders */
  --color-border-default: var(--color-neutral-700);
  --color-border-strong:  var(--color-neutral-600);

  /* Primary — lower saturation in dark mode */
  --color-primary-500: 217 78% 55%;
  --color-primary-600: 217 75% 65%;
}

/* System preference fallback */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    /* same overrides as above */
  }
}
```

## 2. Typography / 排版系统

### 2.1 Modular Scale

基准: `1rem = 16px`，比例: `1.250` (Major Third)

```css
:root {
  --text-xs:   0.75rem;    /* 12px */
  --text-sm:   0.875rem;   /* 14px */
  --text-base: 1rem;       /* 16px — anchor */
  --text-lg:   1.125rem;   /* 18px */
  --text-xl:   1.25rem;    /* 20px */
  --text-2xl:  1.5rem;     /* 24px */
  --text-3xl:  1.875rem;   /* 30px */
  --text-4xl:  2.25rem;    /* 36px */
  --text-5xl:  3rem;       /* 48px */
  --text-6xl:  3.75rem;    /* 60px */
  --text-7xl:  4.5rem;     /* 72px */
}
```

### 2.2 Font Stacks

```css
:root {
  /* Primary sans-serif (Latin-first, CJK fallback) */
  --font-sans: 'Inter', 'Noto Sans SC', 'PingFang SC',
               'Hiragino Sans GB', 'Microsoft YaHei',
               -apple-system, BlinkMacSystemFont,
               'Segoe UI', sans-serif;

  /* CJK-first (for Chinese-dominant interfaces) */
  --font-cjk: 'Noto Sans SC', 'PingFang SC',
              'Hiragino Sans GB', 'Microsoft YaHei',
              'Inter', sans-serif;

  /* Monospace */
  --font-mono: 'JetBrains Mono', 'Fira Code',
               'SF Mono', 'Cascadia Code',
               Consolas, 'Liberation Mono', monospace;

  /* Serif (for editorial / long-form) */
  --font-serif: 'Source Serif 4', 'Noto Serif SC',
                'Songti SC', Georgia, 'Times New Roman', serif;
}
```

### 2.3 Line Heights

```css
:root {
  --leading-none:    1;       /* 标题紧凑 */
  --leading-tight:   1.25;    /* 标题、标签 */
  --leading-snug:    1.375;   /* 小标题 */
  --leading-normal:  1.5;     /* 英文正文 */
  --leading-relaxed: 1.625;   /* 中文正文 */
  --leading-loose:   2;       /* 大段阅读 */
}
```

### 2.4 Font Weights

```css
:root {
  --font-thin:       100;
  --font-light:      300;
  --font-normal:     400;  /* 正文 */
  --font-medium:     500;  /* 强调 */
  --font-semibold:   600;  /* 小标题 */
  --font-bold:       700;  /* 标题 */
  --font-extrabold:  800;  /* 展示标题 */
}
```

### 2.5 Letter Spacing

```css
:root {
  --tracking-tighter: -0.05em;  /* 大号标题 */
  --tracking-tight:   -0.025em; /* 中号标题 */
  --tracking-normal:   0;       /* 正文 */
  --tracking-wide:     0.025em; /* 大写字母、标签 */
  --tracking-wider:    0.05em;  /* 全大写标题 */
  --tracking-widest:   0.1em;   /* 超宽间距装饰 */
}
```

### 2.6 Prose Presets (Paragraph Styles)

```css
.prose-sm {
  font-size: var(--text-sm);
  line-height: var(--leading-relaxed);
  letter-spacing: var(--tracking-normal);
}

.prose-base {
  font-size: var(--text-base);
  line-height: var(--leading-relaxed);
  letter-spacing: var(--tracking-normal);
}

.prose-lg {
  font-size: var(--text-lg);
  line-height: var(--leading-relaxed);
  letter-spacing: var(--tracking-normal);
}

/* CJK-optimized paragraph */
.prose-cjk {
  font-family: var(--font-cjk);
  line-height: 1.8;
  letter-spacing: 0.02em;
  text-align: justify;
  word-break: break-all;
  overflow-wrap: break-word;
}
```

## 3. Spacing / 间距系统

基础单位: `4px`（0.25rem）。所有间距为基础单位的倍数。

```css
:root {
  --space-0:    0;
  --space-px:   1px;
  --space-0\.5: 0.125rem;   /* 2px */
  --space-1:    0.25rem;    /* 4px */
  --space-1\.5: 0.375rem;   /* 6px */
  --space-2:    0.5rem;     /* 8px */
  --space-2\.5: 0.625rem;   /* 10px */
  --space-3:    0.75rem;    /* 12px */
  --space-3\.5: 0.875rem;   /* 14px */
  --space-4:    1rem;       /* 16px */
  --space-5:    1.25rem;    /* 20px */
  --space-6:    1.5rem;     /* 24px */
  --space-7:    1.75rem;    /* 28px */
  --space-8:    2rem;       /* 32px */
  --space-9:    2.25rem;    /* 36px */
  --space-10:   2.5rem;     /* 40px */
  --space-11:   2.75rem;    /* 44px — min touch target */
  --space-12:   3rem;       /* 48px */
  --space-14:   3.5rem;     /* 56px */
  --space-16:   4rem;       /* 64px */
  --space-20:   5rem;       /* 80px */
  --space-24:   6rem;       /* 96px */
  --space-28:   7rem;       /* 112px */
  --space-32:   8rem;       /* 128px */
  --space-36:   9rem;       /* 144px */
  --space-40:   10rem;      /* 160px */
  --space-48:   12rem;      /* 192px */
  --space-56:   14rem;      /* 224px */
  --space-64:   16rem;      /* 256px */
}
```

**使用指南：**

| 场景 | 推荐 Token | 像素值 |
|-----|-----------|-------|
| 图标与文字间距 | space-1 ~ space-2 | 4-8px |
| 按钮内边距 (水平) | space-3 ~ space-4 | 12-16px |
| 按钮内边距 (垂直) | space-2 ~ space-2.5 | 8-10px |
| 表单元素间距 | space-3 ~ space-4 | 12-16px |
| 卡片内边距 | space-4 ~ space-6 | 16-24px |
| 区块间距 | space-8 ~ space-12 | 32-48px |
| 页面边距 (mobile) | space-4 | 16px |
| 页面边距 (desktop) | space-6 ~ space-8 | 24-32px |
| Section 间距 | space-16 ~ space-24 | 64-96px |

## 4. Shadows / 阴影系统

```css
:root {
  --shadow-xs:    0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-sm:    0 1px 3px 0 rgb(0 0 0 / 0.1),
                  0 1px 2px -1px rgb(0 0 0 / 0.1);
  --shadow-md:    0 4px 6px -1px rgb(0 0 0 / 0.1),
                  0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg:    0 10px 15px -3px rgb(0 0 0 / 0.1),
                  0 4px 6px -4px rgb(0 0 0 / 0.1);
  --shadow-xl:    0 20px 25px -5px rgb(0 0 0 / 0.1),
                  0 8px 10px -6px rgb(0 0 0 / 0.1);
  --shadow-2xl:   0 25px 50px -12px rgb(0 0 0 / 0.25);
  --shadow-inner: inset 0 2px 4px 0 rgb(0 0 0 / 0.05);
  --shadow-none:  0 0 #0000;

  /* Focus ring */
  --shadow-ring:       0 0 0 2px hsl(var(--color-primary-500));
  --shadow-ring-inset: inset 0 0 0 2px hsl(var(--color-primary-500));
}

/* Dark mode shadows — darker, more opaque */
[data-theme="dark"] {
  --shadow-xs:    0 1px 2px 0 rgb(0 0 0 / 0.2);
  --shadow-sm:    0 1px 3px 0 rgb(0 0 0 / 0.3),
                  0 1px 2px -1px rgb(0 0 0 / 0.3);
  --shadow-md:    0 4px 6px -1px rgb(0 0 0 / 0.35),
                  0 2px 4px -2px rgb(0 0 0 / 0.35);
  --shadow-lg:    0 10px 15px -3px rgb(0 0 0 / 0.4),
                  0 4px 6px -4px rgb(0 0 0 / 0.4);
  --shadow-xl:    0 20px 25px -5px rgb(0 0 0 / 0.45),
                  0 8px 10px -6px rgb(0 0 0 / 0.45);
  --shadow-2xl:   0 25px 50px -12px rgb(0 0 0 / 0.6);
}
```

**使用指南：**

| 场景 | 推荐阴影 |
|-----|---------|
| 输入框 focus | shadow-xs or shadow-ring |
| 卡片 | shadow-sm |
| 下拉菜单 | shadow-md |
| 弹出层 / Popover | shadow-lg |
| Modal / Dialog | shadow-xl |
| 全屏遮罩后内容 | shadow-2xl |

## 5. Border Radius / 圆角

```css
:root {
  --radius-none: 0;
  --radius-sm:   0.125rem;   /* 2px */
  --radius-md:   0.25rem;    /* 4px — 输入框、按钮 (企业级) */
  --radius-lg:   0.5rem;     /* 8px — 卡片 */
  --radius-xl:   0.75rem;    /* 12px — 大卡片、对话框 */
  --radius-2xl:  1rem;       /* 16px — 圆润风格 */
  --radius-3xl:  1.5rem;     /* 24px — 高度圆润 */
  --radius-full: 9999px;     /* 胶囊形、圆形头像 */
}
```

**风格对照：**

| 风格 | 按钮圆角 | 卡片圆角 | 输入框圆角 |
|-----|---------|---------|----------|
| 企业级 / 严肃 | radius-md | radius-lg | radius-md |
| 现代 / 中性 | radius-lg | radius-xl | radius-lg |
| 圆润 / 活泼 | radius-xl ~ radius-full | radius-2xl | radius-xl |

## 6. Breakpoints / 断点

```css
/* Mobile-first breakpoints */
:root {
  --screen-sm:  640px;    /* 大屏手机横屏 / 小平板 */
  --screen-md:  768px;    /* 平板竖屏 */
  --screen-lg:  1024px;   /* 平板横屏 / 小笔记本 */
  --screen-xl:  1280px;   /* 笔记本 / 桌面 */
  --screen-2xl: 1536px;   /* 大桌面 */
}
```

**容器最大宽度：**

```css
:root {
  --container-sm:  640px;
  --container-md:  768px;
  --container-lg:  1024px;
  --container-xl:  1280px;
  --container-2xl: 1536px;
  --container-prose: 65ch;   /* 正文最大宽度 */
}
```

## 7. Transitions / 过渡

```css
:root {
  /* Duration */
  --duration-fast:    150ms;
  --duration-normal:  200ms;
  --duration-slow:    300ms;
  --duration-lazy:    500ms;

  /* Easing */
  --ease-default:  cubic-bezier(0.4, 0, 0.2, 1);   /* ease-in-out */
  --ease-in:       cubic-bezier(0.4, 0, 1, 1);
  --ease-out:      cubic-bezier(0, 0, 0.2, 1);
  --ease-bounce:   cubic-bezier(0.34, 1.56, 0.64, 1);
  --ease-spring:   cubic-bezier(0.175, 0.885, 0.32, 1.275);

  /* Presets */
  --transition-colors:   color, background-color, border-color, fill, stroke;
  --transition-opacity:  opacity;
  --transition-shadow:   box-shadow;
  --transition-transform: transform;
  --transition-all:      all;
}

/* Reduce motion for users who prefer it */
@media (prefers-reduced-motion: reduce) {
  :root {
    --duration-fast:   0ms;
    --duration-normal: 0ms;
    --duration-slow:   0ms;
    --duration-lazy:   0ms;
  }
}
```

## 8. Z-Index / 层级

```css
:root {
  --z-base:      0;
  --z-raised:    1;       /* 微提升（badge、chip） */
  --z-dropdown:  1000;    /* 下拉菜单 */
  --z-sticky:    1100;    /* 吸顶导航、表头 */
  --z-overlay:   1200;    /* 遮罩层 */
  --z-modal:     1300;    /* 模态框 */
  --z-popover:   1400;    /* Popover、Tooltip */
  --z-toast:     1500;    /* Toast 通知 */
  --z-max:       9999;    /* 紧急覆盖（慎用） */
}
```

## 9. Tailwind CSS Config 输出

将上述所有 token 整合为 `tailwind.config.js`：

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50:  'hsl(var(--color-primary-50) / <alpha-value>)',
          100: 'hsl(var(--color-primary-100) / <alpha-value>)',
          200: 'hsl(var(--color-primary-200) / <alpha-value>)',
          300: 'hsl(var(--color-primary-300) / <alpha-value>)',
          400: 'hsl(var(--color-primary-400) / <alpha-value>)',
          500: 'hsl(var(--color-primary-500) / <alpha-value>)',
          600: 'hsl(var(--color-primary-600) / <alpha-value>)',
          700: 'hsl(var(--color-primary-700) / <alpha-value>)',
          800: 'hsl(var(--color-primary-800) / <alpha-value>)',
          900: 'hsl(var(--color-primary-900) / <alpha-value>)',
          950: 'hsl(var(--color-primary-950) / <alpha-value>)',
        },
        secondary: { /* same pattern */ },
        neutral:   { /* same pattern */ },
        success:   { /* same pattern */ },
        warning:   { /* same pattern */ },
        error:     { /* same pattern */ },
        info:      { /* same pattern */ },
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans SC', 'PingFang SC', 'Hiragino Sans GB',
               'Microsoft YaHei', '-apple-system', 'BlinkMacSystemFont',
               'Segoe UI', 'sans-serif'],
        cjk:  ['Noto Sans SC', 'PingFang SC', 'Hiragino Sans GB',
               'Microsoft YaHei', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'SF Mono', 'Cascadia Code',
               'Consolas', 'Liberation Mono', 'monospace'],
      },
      borderRadius: {
        sm:   '0.125rem',
        md:   '0.25rem',
        lg:   '0.5rem',
        xl:   '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        xs:    '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        sm:    '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        md:    '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        lg:    '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        xl:    '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
        ring:  '0 0 0 2px hsl(var(--color-primary-500))',
      },
      zIndex: {
        dropdown: '1000',
        sticky:   '1100',
        overlay:  '1200',
        modal:    '1300',
        popover:  '1400',
        toast:    '1500',
      },
      transitionDuration: {
        fast:   '150ms',
        normal: '200ms',
        slow:   '300ms',
        lazy:   '500ms',
      },
    },
  },
}
```
