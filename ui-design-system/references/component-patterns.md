# Component Patterns Reference

本文档定义了 UI Design System 中所有核心组件的完整模式规范。每个组件包含结构、状态、变体、无障碍要求和代码示例。

---

## 1. Button

### Anatomy / 结构

```
┌─────────────────────────────┐
│  [icon?]  [label]  [icon?]  │
└─────────────────────────────┘
  leadingIcon  children  trailingIcon
```

DOM 结构: `<button>` 或 `<a>`（导航场景）

### States / 状态

| State | 视觉变化 | 说明 |
|-------|---------|------|
| Default | 基础样式 | — |
| Hover | 背景加深一级（如 500 → 600） | cursor: pointer |
| Active / Pressed | 背景再加深（600 → 700），轻微 scale(0.98) | — |
| Focus-visible | 外环 ring（2px offset，primary-500） | 仅键盘触发 |
| Disabled | opacity: 0.5, pointer-events: none | aria-disabled="true" |
| Loading | 内容替换为 spinner，保持宽度不变 | aria-busy="true"，禁止重复点击 |

### Variants / 变体

**Size:**

| Size | Height | Padding (H) | Font Size | Icon Size |
|------|--------|-------------|-----------|-----------|
| xs | 28px | 8px | 12px | 14px |
| sm | 32px | 12px | 14px | 16px |
| md | 40px | 16px | 14px | 18px |
| lg | 44px | 20px | 16px | 20px |
| xl | 52px | 24px | 18px | 22px |

**Style:**

| Style | Background | Text | Border | Use Case |
|-------|-----------|------|--------|----------|
| Primary | primary-500 | white | none | 主要操作 |
| Secondary | primary-50 | primary-600 | none | 次要操作 |
| Outline | transparent | primary-600 | primary-300 | 三级操作 |
| Ghost | transparent | neutral-700 | none | 内联操作 |
| Destructive | error-500 | white | none | 删除、危险操作 |
| Link | transparent | primary-600 | none | 文字链接样式 |

### Accessibility / 无障碍

- 使用原生 `<button>` 元素（非 `<div>`）
- 如果只有图标没有文字，必须提供 `aria-label`
- Loading 状态设置 `aria-busy="true"` 且禁用点击
- Disabled 使用 `aria-disabled="true"` 而非 HTML `disabled`（保持可聚焦，屏幕阅读器可读）
- 确保按钮文字能明确传达操作（避免「点击这里」）
- 最小触摸目标 44x44px（mobile）

### Code Example / 代码示例

```tsx
import { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  // Base styles
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:
          'bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700',
        secondary:
          'bg-primary-50 text-primary-600 hover:bg-primary-100 active:bg-primary-200',
        outline:
          'border border-primary-300 text-primary-600 hover:bg-primary-50 active:bg-primary-100',
        ghost:
          'text-neutral-700 hover:bg-neutral-100 active:bg-neutral-200',
        destructive:
          'bg-error-500 text-white hover:bg-error-600 active:bg-error-700',
        link:
          'text-primary-600 underline-offset-4 hover:underline',
      },
      size: {
        xs: 'h-7 px-2 text-xs',
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4 text-sm',
        lg: 'h-11 px-5 text-base',
        xl: 'h-13 px-6 text-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, leadingIcon, trailingIcon, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        aria-busy={isLoading || undefined}
        aria-disabled={props.disabled || isLoading || undefined}
        disabled={props.disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
            <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" fill="currentColor" className="opacity-75" />
          </svg>
        ) : (
          <>
            {leadingIcon && <span className="shrink-0">{leadingIcon}</span>}
            {children}
            {trailingIcon && <span className="shrink-0">{trailingIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
export { Button, buttonVariants };
```

---

## 2. Input

### Anatomy / 结构

```
  ┌── Label ──────────────────┐
  │                           │
  │ ┌─[icon?]─[input]─[action?]─┐
  │ └────────────────────────────┘
  │                           │
  │  Helper text / Error msg  │
  └───────────────────────────┘
```

### States / 状态

| State | Border | Background | 说明 |
|-------|--------|-----------|------|
| Default | neutral-300 | white | — |
| Hover | neutral-400 | white | — |
| Focus | primary-500 (ring) | white | ring-2 |
| Disabled | neutral-200 | neutral-50 | opacity: 0.7 |
| Error | error-500 | error-50 | 显示错误信息 |
| Success | success-500 | white | 可选：显示校验通过 |
| Read-only | neutral-200 | neutral-50 | 可选中复制但不可编辑 |

### Variants / 变体

| Size | Height | Padding | Font Size |
|------|--------|---------|-----------|
| sm | 32px | 8px 12px | 14px |
| md | 40px | 10px 14px | 14px |
| lg | 44px | 12px 16px | 16px |

### Accessibility / 无障碍

- `<input>` 必须关联 `<label>`（使用 `htmlFor`/`id` 或嵌套）
- 错误信息通过 `aria-describedby` 关联到 input
- 错误状态设置 `aria-invalid="true"`
- 必填字段使用 `aria-required="true"` + 可视标记
- placeholder 不替代 label
- 自动完成场景设置正确的 `autocomplete` 属性

### Code Example / 代码示例

```tsx
import { forwardRef, useId } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
  leadingIcon?: React.ReactNode;
  trailingAction?: React.ReactNode;
  inputSize?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-3.5 text-sm',
  lg: 'h-11 px-4 text-base',
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leadingIcon, trailingAction, inputSize = 'md', className, id: propId, ...props }, ref) => {
    const generatedId = useId();
    const id = propId || generatedId;
    const errorId = `${id}-error`;
    const helperId = `${id}-helper`;

    return (
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={id}
          className="text-sm font-medium text-neutral-700"
        >
          {label}
          {props.required && <span className="ml-0.5 text-error-500">*</span>}
        </label>

        <div className="relative">
          {leadingIcon && (
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
              {leadingIcon}
            </span>
          )}

          <input
            ref={ref}
            id={id}
            className={cn(
              'w-full rounded-lg border bg-white transition-colors duration-fast',
              'placeholder:text-neutral-400',
              'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
              'disabled:cursor-not-allowed disabled:opacity-70 disabled:bg-neutral-50',
              error
                ? 'border-error-500 bg-error-50 focus:ring-error-500'
                : 'border-neutral-300 hover:border-neutral-400',
              leadingIcon && 'pl-10',
              trailingAction && 'pr-10',
              sizeClasses[inputSize],
              className
            )}
            aria-invalid={error ? 'true' : undefined}
            aria-describedby={
              error ? errorId : helperText ? helperId : undefined
            }
            aria-required={props.required || undefined}
            {...props}
          />

          {trailingAction && (
            <span className="absolute right-2 top-1/2 -translate-y-1/2">
              {trailingAction}
            </span>
          )}
        </div>

        {error && (
          <p id={errorId} className="text-sm text-error-600" role="alert">
            {error}
          </p>
        )}
        {!error && helperText && (
          <p id={helperId} className="text-sm text-neutral-500">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export { Input };
```

---

## 3. Card

### Anatomy / 结构

```
┌─────────────────────────────┐
│  [media?]                   │  ← Optional image/video
├─────────────────────────────┤
│  [header?]                  │  ← Title + subtitle + action
│  [body]                     │  ← Main content
│  [footer?]                  │  ← Actions, metadata
└─────────────────────────────┘
```

### Variants / 变体

| Variant | Border | Shadow | Background |
|---------|--------|--------|-----------|
| Elevated | none | shadow-sm | white |
| Outlined | neutral-200 | none | white |
| Filled | none | none | neutral-50 |
| Interactive | neutral-200 | shadow-sm → shadow-md on hover | white |

### Accessibility / 无障碍

- 如果整张卡片可点击，使用 `<article>` + 内部 `<a>` 拉伸覆盖，而非将整张卡片做成 `<a>`
- 卡片标题使用适当的 heading 层级
- 交互式卡片需要 focus-visible 样式
- 卡片内多个链接/按钮应独立可聚焦

### Code Example / 代码示例

```tsx
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'elevated' | 'outlined' | 'filled' | 'interactive';
}

const variantClasses = {
  elevated: 'bg-white shadow-sm',
  outlined: 'bg-white border border-neutral-200',
  filled:   'bg-neutral-50',
  interactive:
    'bg-white border border-neutral-200 shadow-sm hover:shadow-md transition-shadow duration-normal cursor-pointer',
};

function Card({ variant = 'elevated', className, children, ...props }: CardProps) {
  return (
    <div
      className={cn('rounded-xl p-0 overflow-hidden', variantClasses[variant], className)}
      {...props}
    >
      {children}
    </div>
  );
}

function CardHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('px-6 pt-6 pb-2', className)} {...props}>
      {children}
    </div>
  );
}

function CardBody({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('px-6 py-2', className)} {...props}>
      {children}
    </div>
  );
}

function CardFooter({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('px-6 pb-6 pt-2 flex items-center gap-3', className)} {...props}>
      {children}
    </div>
  );
}

export { Card, CardHeader, CardBody, CardFooter };
```

---

## 4. Modal / Dialog

### Anatomy / 结构

```
┌─ Overlay (backdrop) ──────────────────────┐
│                                           │
│   ┌─ Dialog ─────────────────────────┐    │
│   │  [close button]                  │    │
│   │  ┌─ Header ────────────────────┐ │    │
│   │  │  Title                      │ │    │
│   │  │  Description?               │ │    │
│   │  └─────────────────────────────┘ │    │
│   │  ┌─ Body ──────────────────────┐ │    │
│   │  │  Content                    │ │    │
│   │  └─────────────────────────────┘ │    │
│   │  ┌─ Footer ────────────────────┐ │    │
│   │  │  [cancel]  [confirm]        │ │    │
│   │  └─────────────────────────────┘ │    │
│   └──────────────────────────────────┘    │
│                                           │
└───────────────────────────────────────────┘
```

### States / 状态

- **Opening**: fade-in overlay + slide-up/scale dialog (duration-normal)
- **Open**: body scroll locked, focus trapped inside
- **Closing**: reverse animation, restore focus to trigger element

### Variants / 变体

| Size | Max Width | Use Case |
|------|-----------|----------|
| sm | 400px | 确认对话框 |
| md | 500px | 表单、详情 |
| lg | 680px | 复杂表单 |
| xl | 900px | 数据展示 |
| full | 100vw - 2rem | 全屏编辑 |

### Accessibility / 无障碍 (Critical)

- 使用 `role="dialog"` + `aria-modal="true"`
- `aria-labelledby` 指向标题元素
- `aria-describedby` 指向描述元素（如有）
- **焦点陷阱**: Tab/Shift+Tab 只在 dialog 内循环
- **Escape 关闭**: 按 Escape 关闭 dialog
- **关闭后恢复焦点**: 焦点回到触发 dialog 的元素
- **背景滚动锁定**: `body { overflow: hidden }` 打开时
- 关闭按钮有 `aria-label="Close dialog"`

### Code Example / 代码示例

```tsx
import { useEffect, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  children: React.ReactNode;
  footer?: React.ReactNode;
}

const sizeClasses = {
  sm:   'max-w-[400px]',
  md:   'max-w-[500px]',
  lg:   'max-w-[680px]',
  xl:   'max-w-[900px]',
  full: 'max-w-[calc(100vw-2rem)]',
};

function Modal({ isOpen, onClose, title, description, size = 'md', children, footer }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<Element | null>(null);

  // Capture trigger element and lock scroll
  useEffect(() => {
    if (isOpen) {
      triggerRef.current = document.activeElement;
      document.body.style.overflow = 'hidden';
      // Focus first focusable element inside dialog
      requestAnimationFrame(() => {
        const focusable = dialogRef.current?.querySelector<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        focusable?.focus();
      });
    } else {
      document.body.style.overflow = '';
      (triggerRef.current as HTMLElement)?.focus();
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Escape key handler
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-modal flex items-center justify-center p-4"
      onKeyDown={handleKeyDown}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 animate-in fade-in duration-normal"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby={description ? 'modal-desc' : undefined}
        className={cn(
          'relative z-10 w-full rounded-xl bg-white shadow-xl',
          'animate-in fade-in slide-in-from-bottom-4 duration-normal',
          sizeClasses[size]
        )}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1 text-neutral-400 hover:text-neutral-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          aria-label="Close dialog"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="px-6 pt-6 pb-2">
          <h2 id="modal-title" className="text-lg font-semibold text-neutral-900">
            {title}
          </h2>
          {description && (
            <p id="modal-desc" className="mt-1 text-sm text-neutral-500">
              {description}
            </p>
          )}
        </div>

        {/* Body */}
        <div className="px-6 py-4 max-h-[60vh] overflow-y-auto">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 px-6 pb-6 pt-2">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export { Modal };
```

---

## 5. Navigation

### 5.1 Navbar

#### Anatomy

```
┌──────────────────────────────────────────────────┐
│ [logo]    [nav-items...]          [actions]       │
└──────────────────────────────────────────────────┘
  Mobile: logo + hamburger → slide-out drawer
```

#### Accessibility

- 使用 `<nav aria-label="Main navigation">`
- 当前页面链接标记 `aria-current="page"`
- 移动端汉堡菜单: `aria-expanded`, `aria-controls`
- 下拉菜单项使用 `role="menuitem"`

#### Code Example

```tsx
function Navbar() {
  return (
    <header className="sticky top-0 z-sticky border-b border-neutral-200 bg-white/80 backdrop-blur-sm">
      <nav aria-label="Main navigation" className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2 font-semibold text-neutral-900">
          Logo
        </a>

        {/* Desktop nav items */}
        <ul className="hidden md:flex items-center gap-1">
          {['Products', 'Solutions', 'Pricing', 'Docs'].map((item) => (
            <li key={item}>
              <a
                href={`/${item.toLowerCase()}`}
                className="rounded-lg px-3 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
              >
                {item}
              </a>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm">Sign in</Button>
          <Button variant="primary" size="sm">Get started</Button>
        </div>
      </nav>
    </header>
  );
}
```

### 5.2 Breadcrumb

```tsx
interface BreadcrumbItem {
  label: string;
  href?: string;
}

function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center gap-1.5 text-sm">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1.5">
            {i > 0 && (
              <svg className="h-4 w-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d="M9 5l7 7-7 7" />
              </svg>
            )}
            {item.href && i < items.length - 1 ? (
              <a href={item.href} className="text-neutral-500 hover:text-neutral-700 transition-colors">
                {item.label}
              </a>
            ) : (
              <span className="font-medium text-neutral-900" aria-current="page">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
```

### 5.3 Tabs

```tsx
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

function Tabs({ tabs, defaultTab }: { tabs: Tab[]; defaultTab?: string }) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  return (
    <div>
      <div role="tablist" aria-label="Content tabs" className="flex border-b border-neutral-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={activeTab === tab.id}
            aria-controls={`panel-${tab.id}`}
            tabIndex={activeTab === tab.id ? 0 : -1}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px',
              activeTab === tab.id
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {tabs.map((tab) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`panel-${tab.id}`}
          aria-labelledby={`tab-${tab.id}`}
          hidden={activeTab !== tab.id}
          tabIndex={0}
          className="py-4"
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
}
```

### 5.4 Pagination

```tsx
function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  const pages = generatePageNumbers(currentPage, totalPages);

  return (
    <nav aria-label="Pagination">
      <ul className="flex items-center gap-1">
        <li>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Previous page"
            className="h-9 w-9 rounded-lg flex items-center justify-center text-neutral-500 hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            &lsaquo;
          </button>
        </li>

        {pages.map((page, i) =>
          page === '...' ? (
            <li key={`ellipsis-${i}`}>
              <span className="h-9 w-9 flex items-center justify-center text-neutral-400">...</span>
            </li>
          ) : (
            <li key={page}>
              <button
                onClick={() => onPageChange(page as number)}
                aria-current={currentPage === page ? 'page' : undefined}
                className={cn(
                  'h-9 w-9 rounded-lg flex items-center justify-center text-sm font-medium transition-colors',
                  currentPage === page
                    ? 'bg-primary-500 text-white'
                    : 'text-neutral-600 hover:bg-neutral-100'
                )}
              >
                {page}
              </button>
            </li>
          )
        )}

        <li>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="Next page"
            className="h-9 w-9 rounded-lg flex items-center justify-center text-neutral-500 hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            &rsaquo;
          </button>
        </li>
      </ul>
    </nav>
  );
}

function generatePageNumbers(current: number, total: number): (number | '...')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 3) return [1, 2, 3, 4, '...', total];
  if (current >= total - 2) return [1, '...', total - 3, total - 2, total - 1, total];
  return [1, '...', current - 1, current, current + 1, '...', total];
}
```

---

## 6. Table

### Anatomy / 结构

```
┌─ Toolbar ──────────────────────────────────┐
│  [search]  [filters]  [bulk actions]       │
├────────────────────────────────────────────┤
│  ☐  Column A ↕  Column B ↕  Column C      │  ← Header (sortable)
├────────────────────────────────────────────┤
│  ☐  Cell      Cell        Cell             │  ← Row
│  ☐  Cell      Cell        Cell             │
│  ☐  Cell      Cell        Cell             │
├────────────────────────────────────────────┤
│  Showing 1-10 of 100   [pagination]        │  ← Footer
└────────────────────────────────────────────┘
```

### Accessibility / 无障碍

- 使用语义化 `<table>`, `<thead>`, `<tbody>`, `<th>`, `<td>`
- 排序列使用 `aria-sort="ascending"` / `"descending"` / `"none"`
- 列标题使用 `scope="col"`
- 可选择行使用 `aria-selected`
- 全选 checkbox 使用 `aria-label="Select all rows"`
- 确保表格在小屏可横向滚动，外层包裹 `role="region"` + `aria-label` + `tabindex="0"`

### Responsive Strategy

- < 768px: 横向滚动 或 转为卡片布局（stacked layout）
- 使用 `min-width` 约束列宽，避免内容被压缩

### Code Example / 代码示例

```tsx
interface Column<T> {
  key: keyof T;
  header: string;
  sortable?: boolean;
  width?: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  sortKey?: keyof T;
  sortDir?: 'asc' | 'desc';
  onSort?: (key: keyof T) => void;
  selectable?: boolean;
  selectedRows?: Set<number>;
  onSelectRow?: (index: number) => void;
  onSelectAll?: () => void;
}

function DataTable<T extends Record<string, unknown>>({
  columns, data, sortKey, sortDir, onSort, selectable, selectedRows, onSelectRow, onSelectAll,
}: TableProps<T>) {
  return (
    <div role="region" aria-label="Data table" tabIndex={0} className="overflow-x-auto rounded-lg border border-neutral-200">
      <table className="w-full text-sm">
        <thead className="border-b border-neutral-200 bg-neutral-50">
          <tr>
            {selectable && (
              <th className="w-12 px-3 py-3">
                <input
                  type="checkbox"
                  aria-label="Select all rows"
                  checked={selectedRows?.size === data.length}
                  onChange={onSelectAll}
                  className="h-4 w-4 rounded border-neutral-300 text-primary-500 focus:ring-primary-500"
                />
              </th>
            )}
            {columns.map((col) => (
              <th
                key={String(col.key)}
                scope="col"
                aria-sort={sortKey === col.key ? (sortDir === 'asc' ? 'ascending' : 'descending') : undefined}
                className="px-4 py-3 text-left font-medium text-neutral-600"
                style={{ width: col.width }}
              >
                {col.sortable ? (
                  <button
                    onClick={() => onSort?.(col.key)}
                    className="inline-flex items-center gap-1 hover:text-neutral-900 transition-colors"
                  >
                    {col.header}
                    <span className="text-neutral-400">
                      {sortKey === col.key ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}
                    </span>
                  </button>
                ) : (
                  col.header
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100">
          {data.map((row, i) => (
            <tr
              key={i}
              aria-selected={selectedRows?.has(i) || undefined}
              className={cn(
                'transition-colors hover:bg-neutral-50',
                selectedRows?.has(i) && 'bg-primary-50'
              )}
            >
              {selectable && (
                <td className="px-3 py-3">
                  <input
                    type="checkbox"
                    checked={selectedRows?.has(i)}
                    onChange={() => onSelectRow?.(i)}
                    aria-label={`Select row ${i + 1}`}
                    className="h-4 w-4 rounded border-neutral-300 text-primary-500 focus:ring-primary-500"
                  />
                </td>
              )}
              {columns.map((col) => (
                <td key={String(col.key)} className="px-4 py-3 text-neutral-700">
                  {col.render ? col.render(row[col.key], row) : String(row[col.key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

---

## 7. Form

### Anatomy / 结构

```
┌─ Form ─────────────────────────────────┐
│  ┌─ Section ─────────────────────────┐ │
│  │  Section Title                    │ │
│  │  Section Description              │ │
│  │                                   │ │
│  │  [field]                          │ │
│  │  [field]                          │ │
│  │  [field]   [field]  (inline)      │ │
│  └───────────────────────────────────┘ │
│                                        │
│  ┌─ Actions ─────────────────────────┐ │
│  │           [cancel]  [submit]      │ │
│  └───────────────────────────────────┘ │
└────────────────────────────────────────┘
```

### Validation States

| State | Visual | Message |
|-------|--------|---------|
| Idle | Default border | Helper text (optional) |
| Validating | Subtle spinner | "Checking..." |
| Valid | Success border + checkmark | "Available" (optional) |
| Invalid | Error border + icon | Specific error message |
| Submitted w/ errors | Scroll to first error, announce | Summary at top |

### Accessibility / 无障碍

- 使用原生 `<form>` 元素
- 所有字段有关联的 `<label>`
- 验证错误通过 `aria-describedby` 关联
- 错误摘要使用 `role="alert"` 或 `aria-live="polite"`
- 提交后有错误时，焦点移到第一个错误字段或错误摘要
- 分组字段使用 `<fieldset>` + `<legend>`
- 提交按钮在加载时标记 `aria-busy="true"`

### Code Example / 代码示例

```tsx
import { FormEvent, useState } from 'react';

interface FormErrors {
  [key: string]: string;
}

function ContactForm() {
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const newErrors: FormErrors = {};

    // Validate
    if (!formData.get('name')) newErrors.name = 'Name is required';
    if (!formData.get('email')) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.get('email') as string)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      // Focus first error field
      const firstErrorKey = Object.keys(newErrors)[0];
      document.getElementById(firstErrorKey)?.focus();
      return;
    }

    // Submit
    setErrors({});
    await submitForm(formData);
    setIsSubmitting(false);
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {Object.keys(errors).length > 0 && (
        <div role="alert" className="rounded-lg border border-error-200 bg-error-50 p-4">
          <p className="font-medium text-error-800">
            Please fix {Object.keys(errors).length} error(s) below:
          </p>
          <ul className="mt-2 list-disc pl-5 text-sm text-error-700">
            {Object.entries(errors).map(([key, msg]) => (
              <li key={key}>
                <a href={`#${key}`} className="underline">{msg}</a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <Input
        id="name"
        name="name"
        label="Name"
        required
        error={errors.name}
        autoComplete="name"
      />

      <Input
        id="email"
        name="email"
        label="Email"
        type="email"
        required
        error={errors.email}
        autoComplete="email"
      />

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="ghost">Cancel</Button>
        <Button type="submit" isLoading={isSubmitting}>Submit</Button>
      </div>
    </form>
  );
}
```

---

## 8. Toast / Notification

### Anatomy / 结构

```
┌───────────────────────────────────────┐
│  [icon]  [title]              [close] │
│          [description?]               │
│          [action?]                    │
└───────────────────────────────────────┘
```

Position: 右上角 (desktop), 顶部居中 (mobile)

### Variants / 变体

| Variant | Icon | Left Border Color | Use Case |
|---------|------|-------------------|----------|
| Info | info circle | info-500 | 一般信息通知 |
| Success | checkmark | success-500 | 操作成功 |
| Warning | alert triangle | warning-500 | 需注意事项 |
| Error | x circle | error-500 | 操作失败 |

### Behavior

- 自动消失：info/success 5s，warning 8s，error 不自动消失
- 鼠标悬停时暂停计时
- 最多同时显示 3 条，多余的排队
- 入场动画：从右侧滑入 + 淡入（desktop）/ 从顶部滑入（mobile）
- 离场动画：向右滑出 + 淡出

### Accessibility / 无障碍

- 容器使用 `role="status"` + `aria-live="polite"`（info/success）
- Error/Warning 使用 `role="alert"` + `aria-live="assertive"`
- 关闭按钮有 `aria-label="Dismiss notification"`
- 不要用 toast 传达关键信息——关键操作结果应在页面内显示
- Action 按钮必须有明确的文字标签

### Code Example / 代码示例

```tsx
import { useEffect, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';

type ToastVariant = 'info' | 'success' | 'warning' | 'error';

interface Toast {
  id: string;
  variant: ToastVariant;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
  duration?: number;
}

const variantConfig = {
  info:    { borderColor: 'border-l-info-500',    role: 'status' as const, live: 'polite' as const },
  success: { borderColor: 'border-l-success-500', role: 'status' as const, live: 'polite' as const },
  warning: { borderColor: 'border-l-warning-500', role: 'alert' as const,  live: 'assertive' as const },
  error:   { borderColor: 'border-l-error-500',   role: 'alert' as const,  live: 'assertive' as const },
};

const defaultDurations: Record<ToastVariant, number> = {
  info: 5000,
  success: 5000,
  warning: 8000,
  error: 0, // no auto-dismiss
};

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
  const [isPaused, setIsPaused] = useState(false);
  const config = variantConfig[toast.variant];
  const duration = toast.duration ?? defaultDurations[toast.variant];

  useEffect(() => {
    if (duration === 0 || isPaused) return;
    const timer = setTimeout(() => onDismiss(toast.id), duration);
    return () => clearTimeout(timer);
  }, [duration, isPaused, toast.id, onDismiss]);

  return (
    <div
      role={config.role}
      aria-live={config.live}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className={cn(
        'pointer-events-auto w-full max-w-sm rounded-lg border border-neutral-200 bg-white shadow-lg border-l-4',
        'animate-in slide-in-from-right fade-in duration-normal',
        config.borderColor
      )}
    >
      <div className="flex items-start gap-3 p-4">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-neutral-900">{toast.title}</p>
          {toast.description && (
            <p className="mt-1 text-sm text-neutral-500">{toast.description}</p>
          )}
          {toast.action && (
            <button
              onClick={toast.action.onClick}
              className="mt-2 text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              {toast.action.label}
            </button>
          )}
        </div>
        <button
          onClick={() => onDismiss(toast.id)}
          aria-label="Dismiss notification"
          className="shrink-0 rounded p-1 text-neutral-400 hover:text-neutral-600"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function ToastContainer({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: string) => void }) {
  return (
    <div
      aria-label="Notifications"
      className={cn(
        'fixed z-toast flex flex-col gap-3 pointer-events-none',
        // Desktop: top-right, Mobile: top-center
        'top-4 right-4 left-4 sm:left-auto sm:w-[380px]'
      )}
    >
      {toasts.slice(0, 3).map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

export { ToastContainer, ToastItem };
export type { Toast, ToastVariant };
```

---

## Component Checklist

每个新组件实现前，确认满足以下要求：

- [ ] 使用语义化 HTML 元素
- [ ] 所有交互状态有对应样式（hover, active, focus-visible, disabled）
- [ ] `focus-visible` 使用 ring 样式（非 outline）
- [ ] 键盘可操作（Tab, Enter, Space, Escape, Arrow keys 按需）
- [ ] 屏幕阅读器可读（ARIA roles, labels, descriptions）
- [ ] 色彩对比度 >= 4.5:1 (正文), >= 3:1 (大号文字/图标)
- [ ] 移动端触摸目标 >= 44x44px
- [ ] 支持 dark mode（使用 CSS 变量）
- [ ] 支持 `prefers-reduced-motion`
- [ ] 使用 design tokens 而非硬编码值
- [ ] 组件 API 支持 className 透传（可扩展）
- [ ] TypeScript 类型完整，导出 Props 类型
