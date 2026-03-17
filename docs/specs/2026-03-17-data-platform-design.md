# Skill Hub 数据运营平台设计

> 2026-03-17 | Internal Strategy Document

## 需求

- 维护每个 Skill 的安装量、浏览量等数据
- 根据数据驱动推广动作（人工决策）
- Web Dashboard 内部可视化
- API 供 skill-hub skill 查询推荐数据

## 架构

```
                     ┌─────────────────────────────────────┐
                     │      GitHub Actions Cron             │
                     │  (每小时爬取 skills.sh 安装量数据)     │
                     └──────────────┬──────────────────────┘
                                    │ POST /api/stats/collect
                                    ▼
┌──────────────┐    ┌──────────────────────────────────────┐
│ skill-hub    │    │          Vercel Postgres              │
│ (Agent 端)   │◄──►│                                      │
│ 查询推荐数据  │ API │  skills     │ daily_stats │ events  │
└──────────────┘    └──────────────────────────────────────┘
                                    │ 读取
                                    ▼
                     ┌─────────────────────────────────────┐
                     │     Next.js Dashboard (内部)         │
                     │                                     │
                     │  ┌─────────┐ ┌──────────┐ ┌──────┐ │
                     │  │ 总览面板 │ │ Skill详情│ │ 对比 │ │
                     │  └─────────┘ └──────────┘ └──────┘ │
                     └─────────────────────────────────────┘
```

## 核心用户

仅内部运营团队。不对外开放。

## 数据模型

### skills — Skill 基本信息

| 字段 | 类型 | 说明 |
|------|------|------|
| id | TEXT PK | "smart-brainstorm" |
| repo | TEXT | "second-me-01/skill-hub" |
| name_cn | TEXT | "结构化头脑风暴" |
| name_en | TEXT | "Structured Brainstorming" |
| category | TEXT | "productivity" |
| quality_rating | TEXT | S/A/B/C |
| is_satellite | BOOLEAN | 是否我们的卫星 Skill |
| source | TEXT | "featured" / "curated" / "competitor" |
| install_cmd | TEXT | npx skills add ... |
| tags | TEXT[] | 搜索标签 |
| created_at | TIMESTAMP | 创建时间 |

### daily_stats — 每日数据快照

| 字段 | 类型 | 说明 |
|------|------|------|
| id | SERIAL PK | 自增 |
| skill_id | TEXT FK | 关联 skills.id |
| date | DATE | 数据日期 |
| installs | INTEGER | 累计安装量 |
| daily_delta | INTEGER | 日增量 |
| rank_hot | INTEGER | Hot 榜排名 (nullable) |
| rank_trending | INTEGER | Trending 榜排名 (nullable) |
| platform | TEXT | "skills.sh" / "clawhub" |
| UNIQUE(skill_id, date, platform) | | |

### events — 运营事件日志

| 字段 | 类型 | 说明 |
|------|------|------|
| id | SERIAL PK | 自增 |
| skill_id | TEXT FK | 关联的 Skill (nullable = 全局事件) |
| type | TEXT | "content_posted" / "kol_outreach" / "feature_update" / "bug_fix" |
| channel | TEXT | "zhihu" / "jike" / "xhs" / "reddit" / "twitter" |
| description | TEXT | 事件描述 |
| url | TEXT | 帖子链接 |
| created_at | TIMESTAMP | 事件时间 |

## API 设计

```
GET  /api/skills                  -- 所有 Skill 列表 + 最新数据
GET  /api/skills/:id              -- 单个 Skill 详情
GET  /api/skills/:id/stats        -- 历史数据 (?days=30)
GET  /api/stats/overview          -- 总览 (总量、日增、排名)
GET  /api/recommendations         -- 供 skill-hub 查询的推荐列表
POST /api/events                  -- 记录运营事件
POST /api/stats/collect           -- GitHub Actions 触发的数据采集
```

### /api/recommendations

替代现有 GitHub raw JSON。支持动态排序（按安装量、评级、更新时间）。
现有 `registry/recommendations.json` 保留作为 fallback。

## Dashboard 页面

### 1. 总览 /dashboard

- 总安装量大数字 + 日增趋势
- 里程碑进度条 (当前 vs 目标)
- 各 Skill 安装量占比饼图
- 最近 7 天增长曲线
- 最近运营事件时间线

### 2. Skill 详情 /dashboard/skills/:id

- 安装量曲线 (30天/90天/全部)
- 事件标注叠加在曲线上 (发帖后涨了多少)
- 质量评级、分类、标签
- 相关竞品列表

### 3. 竞品对比 /dashboard/compare

- 选择我们的 Skill vs 竞品
- 安装增速对比曲线
- 差距分析

### 4. 事件管理 /dashboard/events

- 添加运营事件 (发了什么内容、联系了什么 KOL)
- 关联到具体 Skill
- 事件列表 + 筛选

## 数据采集

### GitHub Actions 定时任务

```yaml
# .github/workflows/collect-stats.yml
schedule:
  - cron: '0 * * * *'  # 每小时

steps:
  - run: npx skills find "second-me-01"
  # 解析输出，提取安装量
  - run: npx skills find "smart-brainstorm"
  # 解析竞品数据
  - run: curl -X POST $API_URL/api/stats/collect
  # 写入数据库
```

### 爬取策略

| Skill | 搜索关键词 | 说明 |
|-------|----------|------|
| 自有 Skill | "second-me-01" | 一次搜索获取全部 |
| xhs-writer 竞品 | "xhs" "xiaohongshu" | 监控竞品安装量 |
| brainstorm 竞品 | "brainstorm" | 监控竞品安装量 |
| design 竞品 | "design system" "design guidelines" | 监控竞品安装量 |

## 技术栈

| 组件 | 方案 |
|------|------|
| 框架 | Next.js 15 (App Router) |
| 部署 | Vercel |
| 数据库 | Vercel Postgres (Neon) |
| ORM | Drizzle |
| 图表 | Recharts |
| 认证 | Vercel Password Protection (简单密码) |
| 定时采集 | GitHub Actions |
| 样式 | Tailwind CSS + shadcn/ui |

## 与现有系统的关系

| 现在 | 之后 |
|------|------|
| skill-hub → WebFetch GitHub raw JSON | skill-hub → WebFetch /api/recommendations |
| recommendations.json 手动维护 | Dashboard UI 管理，JSON 作为 fallback |
| Agent A 手动追踪 | Dashboard 自动展示 |
| Agent F 手动管理 registry | Dashboard 管理 + API 自动同步 |

## 实施优先级

1. 数据库 schema + API (基础)
2. GitHub Actions 爬虫 (数据采集)
3. 总览 Dashboard (可视化)
4. /api/recommendations (替代静态 JSON)
5. Skill 详情 + 事件管理 (运营深度)
6. 竞品对比 (分析)
