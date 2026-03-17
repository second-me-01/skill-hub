# Skill Hub 数据运营平台 Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an internal dashboard + API to track Skill installs, visualize growth, and serve dynamic recommendations.

**Architecture:** Next.js 15 App Router full-stack app. Vercel Postgres for storage, Drizzle ORM, Recharts for charts, shadcn/ui components. GitHub Actions cron for hourly data collection via `npx skills find`.

**Tech Stack:** Next.js 15, Vercel, Vercel Postgres (Neon), Drizzle, Recharts, shadcn/ui, Tailwind CSS

---

## File Structure

```
dashboard/
├── package.json
├── tsconfig.json
├── next.config.ts
├── tailwind.config.ts
├── drizzle.config.ts
├── .env.local                        # POSTGRES_URL, API_SECRET
├── src/
│   ├── db/
│   │   ├── schema.ts                 # Drizzle schema (skills, daily_stats, events)
│   │   ├── index.ts                  # DB connection
│   │   └── seed.ts                   # Seed initial skill data
│   ├── lib/
│   │   ├── collector.ts              # Parse npx skills find output
│   │   └── milestones.ts             # Milestone targets config
│   ├── app/
│   │   ├── layout.tsx                # Root layout with nav
│   │   ├── page.tsx                  # Dashboard overview
│   │   ├── skills/
│   │   │   └── [id]/
│   │   │       └── page.tsx          # Skill detail page
│   │   ├── compare/
│   │   │   └── page.tsx              # Competitor compare page
│   │   ├── events/
│   │   │   └── page.tsx              # Events management page
│   │   └── api/
│   │       ├── skills/
│   │       │   ├── route.ts          # GET /api/skills
│   │       │   └── [id]/
│   │       │       ├── route.ts      # GET /api/skills/:id
│   │       │       └── stats/
│   │       │           └── route.ts  # GET /api/skills/:id/stats
│   │       ├── stats/
│   │       │   ├── overview/
│   │       │   │   └── route.ts      # GET /api/stats/overview
│   │       │   └── collect/
│   │       │       └── route.ts      # POST /api/stats/collect
│   │       ├── events/
│   │       │   └── route.ts          # GET/POST /api/events
│   │       └── recommendations/
│   │           └── route.ts          # GET /api/recommendations
│   └── components/
│       ├── nav.tsx                    # Sidebar navigation
│       ├── stat-card.tsx             # Big number card
│       ├── install-chart.tsx         # Line chart with event annotations
│       ├── milestone-bar.tsx         # Progress bar to milestone
│       ├── skill-table.tsx           # Skills list table
│       └── event-form.tsx            # Add event form
└── scripts/
    └── collect.ts                    # CLI script for GitHub Actions
```

---

## Chunk 1: Project Setup + Database

### Task 1: Scaffold Next.js project

**Files:**
- Create: `dashboard/package.json`, `dashboard/tsconfig.json`, `dashboard/next.config.ts`, `dashboard/tailwind.config.ts`

- [ ] **Step 1: Create Next.js app**

```bash
cd /Users/baofangyi/github/skillhub
npx create-next-app@latest dashboard --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
```

- [ ] **Step 2: Install dependencies**

```bash
cd dashboard
npm install drizzle-orm @vercel/postgres recharts
npm install -D drizzle-kit
npx shadcn@latest init -d
npx shadcn@latest add button card input label select table badge tabs separator dialog textarea
```

- [ ] **Step 3: Verify dev server starts**

```bash
npm run dev
# Expected: compiles, http://localhost:3000 shows Next.js default page
```

- [ ] **Step 4: Commit**

```bash
git add dashboard/
git commit -m "feat(dashboard): scaffold Next.js project with deps"
```

### Task 2: Database schema

**Files:**
- Create: `dashboard/src/db/schema.ts`
- Create: `dashboard/src/db/index.ts`
- Create: `dashboard/drizzle.config.ts`

- [ ] **Step 1: Create Drizzle schema**

```typescript
// dashboard/src/db/schema.ts
import { pgTable, text, integer, boolean, timestamp, date, serial, unique } from "drizzle-orm/pg-core";

export const skills = pgTable("skills", {
  id: text("id").primaryKey(),
  repo: text("repo").notNull(),
  nameCn: text("name_cn").notNull(),
  nameEn: text("name_en"),
  category: text("category").notNull(),
  qualityRating: text("quality_rating").notNull().default("B"),
  isSatellite: boolean("is_satellite").notNull().default(false),
  source: text("source").notNull().default("featured"),
  installCmd: text("install_cmd"),
  tags: text("tags").array(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const dailyStats = pgTable("daily_stats", {
  id: serial("id").primaryKey(),
  skillId: text("skill_id").notNull().references(() => skills.id),
  date: date("date").notNull(),
  installs: integer("installs").notNull().default(0),
  dailyDelta: integer("daily_delta").notNull().default(0),
  rankHot: integer("rank_hot"),
  rankTrending: integer("rank_trending"),
  platform: text("platform").notNull().default("skills.sh"),
}, (table) => [
  unique("uq_skill_date_platform").on(table.skillId, table.date, table.platform),
]);

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  skillId: text("skill_id").references(() => skills.id),
  type: text("type").notNull(),
  channel: text("channel"),
  description: text("description").notNull(),
  url: text("url"),
  createdAt: timestamp("created_at").defaultNow(),
});
```

- [ ] **Step 2: Create DB connection**

```typescript
// dashboard/src/db/index.ts
import { sql } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";
import * as schema from "./schema";

export const db = drizzle(sql, { schema });
export { schema };
```

- [ ] **Step 3: Create Drizzle config**

```typescript
// dashboard/drizzle.config.ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.POSTGRES_URL!,
  },
});
```

- [ ] **Step 4: Commit**

```bash
git add dashboard/src/db/ dashboard/drizzle.config.ts
git commit -m "feat(dashboard): add Drizzle schema for skills, daily_stats, events"
```

### Task 3: Seed script

**Files:**
- Create: `dashboard/src/db/seed.ts`

- [ ] **Step 1: Create seed script with our 6 skills + known competitors**

```typescript
// dashboard/src/db/seed.ts
import { db, schema } from "./index";

const SKILLS = [
  { id: "skill-hub", repo: "second-me-01/skill-hub", nameCn: "Skill Hub", nameEn: "Skill Hub", category: "productivity", qualityRating: "A", isSatellite: false, source: "featured", installCmd: "npx skills add second-me-01/skill-hub@skill-hub -g -y", tags: ["marketplace", "安全扫描"] },
  { id: "smart-brainstorm", repo: "second-me-01/skill-hub", nameCn: "结构化头脑风暴", nameEn: "Smart Brainstorm", category: "productivity", qualityRating: "S", isSatellite: true, source: "featured", installCmd: "npx skills add second-me-01/skill-hub@smart-brainstorm -g -y", tags: ["brainstorm", "头脑风暴"] },
  { id: "ui-design-system", repo: "second-me-01/skill-hub", nameCn: "设计系统生成器", nameEn: "UI Design System", category: "design", qualityRating: "S", isSatellite: true, source: "featured", installCmd: "npx skills add second-me-01/skill-hub@ui-design-system -g -y", tags: ["design", "设计系统"] },
  { id: "xhs-writer", repo: "second-me-01/skill-hub", nameCn: "小红书文案助手", nameEn: "XHS Writer", category: "chinese-ecosystem", qualityRating: "S", isSatellite: true, source: "featured", installCmd: "npx skills add second-me-01/skill-hub@xhs-writer -g -y", tags: ["小红书", "内容创作"] },
  { id: "video-script", repo: "second-me-01/skill-hub", nameCn: "视频脚本助手", nameEn: "Video Script", category: "content-creation", qualityRating: "S", isSatellite: true, source: "featured", installCmd: "npx skills add second-me-01/skill-hub@video-script -g -y", tags: ["视频", "脚本"] },
  { id: "feishu-kit", repo: "second-me-01/skill-hub", nameCn: "飞书集成工具包", nameEn: "Feishu Kit", category: "chinese-ecosystem", qualityRating: "A", isSatellite: true, source: "featured", installCmd: "npx skills add second-me-01/skill-hub@feishu-kit -g -y", tags: ["飞书", "feishu"] },
  // Competitors
  { id: "comp-brainstorming", repo: "other/brainstorming", nameCn: "brainstorming (竞品)", nameEn: "brainstorming", category: "productivity", qualityRating: "B", isSatellite: false, source: "competitor", tags: ["brainstorm"] },
  { id: "comp-daqi-xhs", repo: "daqi/daqi-skills", nameCn: "xhs-writer (竞品)", nameEn: "daqi xhs-writer", category: "chinese-ecosystem", qualityRating: "B", isSatellite: false, source: "competitor", tags: ["小红书"] },
];

async function seed() {
  for (const skill of SKILLS) {
    await db.insert(schema.skills).values(skill).onConflictDoNothing();
  }
  console.log(`Seeded ${SKILLS.length} skills`);
}

seed().then(() => process.exit(0)).catch(console.error);
```

- [ ] **Step 2: Commit**

```bash
git add dashboard/src/db/seed.ts
git commit -m "feat(dashboard): add seed script with skills + competitors"
```

---

## Chunk 2: API Routes

### Task 4: Stats collection API + parser

**Files:**
- Create: `dashboard/src/lib/collector.ts`
- Create: `dashboard/src/app/api/stats/collect/route.ts`

- [ ] **Step 1: Create skills.sh output parser**

```typescript
// dashboard/src/lib/collector.ts
export interface SkillData {
  name: string;
  repo: string;
  installs: number;
}

export function parseSkillsOutput(output: string): SkillData[] {
  const results: SkillData[] = [];
  const lines = output.split("\n");

  for (let i = 0; i < lines.length; i++) {
    // Match lines like: "owner/repo@skill-name  123 installs"
    const cleanLine = lines[i].replace(/\x1b\[[0-9;]*m/g, "").trim();
    const match = cleanLine.match(/^(.+?)@(.+?)\s+(\d[\d,.]*K?)\s+installs?$/);
    if (match) {
      let installs = match[3].replace(/,/g, "");
      if (installs.endsWith("K")) {
        installs = String(parseFloat(installs) * 1000);
      }
      results.push({
        repo: match[1],
        name: match[2],
        installs: Math.round(parseFloat(installs)),
      });
    }
  }
  return results;
}
```

- [ ] **Step 2: Create collect API route**

```typescript
// dashboard/src/app/api/stats/collect/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/db";
import { eq, and } from "drizzle-orm";

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-api-secret");
  if (secret !== process.env.API_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  // body: { data: [{ skill_id, installs, rank_hot?, rank_trending?, platform }] }

  const today = new Date().toISOString().split("T")[0];
  let upserted = 0;

  for (const item of body.data) {
    // Get yesterday's installs to calc delta
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
    const prev = await db.query.dailyStats.findFirst({
      where: and(
        eq(schema.dailyStats.skillId, item.skill_id),
        eq(schema.dailyStats.date, yesterday),
        eq(schema.dailyStats.platform, item.platform || "skills.sh")
      ),
    });

    const dailyDelta = prev ? item.installs - prev.installs : 0;

    await db.insert(schema.dailyStats).values({
      skillId: item.skill_id,
      date: today,
      installs: item.installs,
      dailyDelta,
      rankHot: item.rank_hot ?? null,
      rankTrending: item.rank_trending ?? null,
      platform: item.platform || "skills.sh",
    }).onConflictDoUpdate({
      target: [schema.dailyStats.skillId, schema.dailyStats.date, schema.dailyStats.platform],
      set: { installs: item.installs, dailyDelta, rankHot: item.rank_hot ?? null, rankTrending: item.rank_trending ?? null },
    });
    upserted++;
  }

  return NextResponse.json({ ok: true, upserted });
}
```

- [ ] **Step 3: Commit**

```bash
git add dashboard/src/lib/collector.ts dashboard/src/app/api/stats/
git commit -m "feat(dashboard): add stats collection API + parser"
```

### Task 5: Skills + Overview + Events API routes

**Files:**
- Create: `dashboard/src/app/api/skills/route.ts`
- Create: `dashboard/src/app/api/skills/[id]/route.ts`
- Create: `dashboard/src/app/api/skills/[id]/stats/route.ts`
- Create: `dashboard/src/app/api/stats/overview/route.ts`
- Create: `dashboard/src/app/api/events/route.ts`
- Create: `dashboard/src/app/api/recommendations/route.ts`
- Create: `dashboard/src/lib/milestones.ts`

- [ ] **Step 1: Create milestones config**

```typescript
// dashboard/src/lib/milestones.ts
export const MILESTONES = [
  { week: 1, target: 0, label: "产品上线" },
  { week: 2, target: 1000, label: "冲 Hot 榜" },
  { week: 3, target: 5000, label: "种子期完成" },
  { week: 5, target: 10000, label: "交叉导流" },
  { week: 8, target: 30000, label: "Trending 榜" },
  { week: 12, target: 60000, label: "自然流量" },
  { week: 16, target: 100000, label: "第三方入驻" },
  { week: 20, target: 150000, label: "企业安装" },
  { week: 24, target: 200000, label: "目标达成" },
];

// Project start date
export const PROJECT_START = new Date("2026-03-15");

export function getCurrentWeek(): number {
  const now = new Date();
  const diff = now.getTime() - PROJECT_START.getTime();
  return Math.ceil(diff / (7 * 24 * 60 * 60 * 1000));
}

export function getCurrentMilestone() {
  const week = getCurrentWeek();
  const current = MILESTONES.filter(m => m.week <= week).pop() || MILESTONES[0];
  const next = MILESTONES.find(m => m.week > week) || MILESTONES[MILESTONES.length - 1];
  return { current, next, week };
}
```

- [ ] **Step 2: Create all API routes**

Create `GET /api/skills` — list all skills with latest stats.
Create `GET /api/skills/[id]` — single skill detail.
Create `GET /api/skills/[id]/stats` — time series data for charts.
Create `GET /api/stats/overview` — aggregated numbers for dashboard.
Create `GET/POST /api/events` — list + create events.
Create `GET /api/recommendations` — dynamic recommendations for skill-hub.

(Each route follows the same pattern: query DB with Drizzle, return JSON.)

- [ ] **Step 3: Commit**

```bash
git add dashboard/src/app/api/ dashboard/src/lib/milestones.ts
git commit -m "feat(dashboard): add all API routes (skills, stats, events, recommendations)"
```

---

## Chunk 3: Dashboard UI

### Task 6: Layout + Navigation

**Files:**
- Create: `dashboard/src/components/nav.tsx`
- Modify: `dashboard/src/app/layout.tsx`

- [ ] **Step 1: Create sidebar nav component**

Sidebar with links: 总览, Skills, 竞品对比, 运营事件. Use shadcn components.

- [ ] **Step 2: Update root layout with nav + dark theme**

- [ ] **Step 3: Commit**

```bash
git add dashboard/src/components/nav.tsx dashboard/src/app/layout.tsx
git commit -m "feat(dashboard): add sidebar navigation layout"
```

### Task 7: Overview dashboard page

**Files:**
- Create: `dashboard/src/components/stat-card.tsx`
- Create: `dashboard/src/components/install-chart.tsx`
- Create: `dashboard/src/components/milestone-bar.tsx`
- Create: `dashboard/src/components/skill-table.tsx`
- Modify: `dashboard/src/app/page.tsx`

- [ ] **Step 1: Create stat-card component** (big number + delta)
- [ ] **Step 2: Create install-chart** (Recharts LineChart with 7-day data)
- [ ] **Step 3: Create milestone-bar** (progress to next milestone)
- [ ] **Step 4: Create skill-table** (all skills with latest installs)
- [ ] **Step 5: Wire up overview page** fetching from /api/stats/overview + /api/skills
- [ ] **Step 6: Commit**

```bash
git add dashboard/src/components/ dashboard/src/app/page.tsx
git commit -m "feat(dashboard): add overview page with charts and stats"
```

### Task 8: Skill detail page

**Files:**
- Create: `dashboard/src/app/skills/[id]/page.tsx`

- [ ] **Step 1: Build skill detail page**

Fetch skill info + time series from API. Recharts AreaChart with event annotations overlaid. Show quality rating badge, category, tags.

- [ ] **Step 2: Commit**

```bash
git add dashboard/src/app/skills/
git commit -m "feat(dashboard): add skill detail page with install curve + events"
```

### Task 9: Events management page

**Files:**
- Create: `dashboard/src/components/event-form.tsx`
- Create: `dashboard/src/app/events/page.tsx`

- [ ] **Step 1: Create event form** (type, channel, skill, description, url)
- [ ] **Step 2: Create events page** (form + event list table with filters)
- [ ] **Step 3: Commit**

```bash
git add dashboard/src/components/event-form.tsx dashboard/src/app/events/
git commit -m "feat(dashboard): add events management page"
```

### Task 10: Compare page

**Files:**
- Create: `dashboard/src/app/compare/page.tsx`

- [ ] **Step 1: Build compare page**

Two dropdowns to select skills. Overlay their install curves on one chart. Show delta.

- [ ] **Step 2: Commit**

```bash
git add dashboard/src/app/compare/
git commit -m "feat(dashboard): add competitor comparison page"
```

---

## Chunk 4: Data Collection + Deploy

### Task 11: Collection script for GitHub Actions

**Files:**
- Create: `dashboard/scripts/collect.ts`
- Create: `.github/workflows/collect-stats.yml`

- [ ] **Step 1: Create collect script**

```typescript
// dashboard/scripts/collect.ts
// Runs: npx skills find "second-me-01" etc.
// Parses output using collector.ts
// POSTs to /api/stats/collect
```

- [ ] **Step 2: Create GitHub Actions workflow**

```yaml
# .github/workflows/collect-stats.yml
name: Collect Skill Stats
on:
  schedule:
    - cron: '17 * * * *'  # Every hour at :17
  workflow_dispatch: {}

jobs:
  collect:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm install -g @anthropic-ai/skills
      - run: npx tsx dashboard/scripts/collect.ts
        env:
          API_URL: ${{ secrets.API_URL }}
          API_SECRET: ${{ secrets.API_SECRET }}
```

- [ ] **Step 3: Commit**

```bash
git add dashboard/scripts/collect.ts .github/workflows/collect-stats.yml
git commit -m "feat: add GitHub Actions hourly stats collection"
```

### Task 12: Deploy to Vercel

- [ ] **Step 1: Create Vercel project linked to dashboard/ subdirectory**

```bash
cd dashboard && vercel link
```

- [ ] **Step 2: Create Vercel Postgres database**

```bash
vercel env pull .env.local
```

- [ ] **Step 3: Push schema to database**

```bash
npx drizzle-kit push
```

- [ ] **Step 4: Run seed**

```bash
npx tsx src/db/seed.ts
```

- [ ] **Step 5: Deploy**

```bash
vercel --prod
```

- [ ] **Step 6: Set GitHub Actions secrets**

```bash
gh secret set API_URL --body "https://skillhub-dashboard.vercel.app"
gh secret set API_SECRET --body "$(openssl rand -hex 32)"
```

- [ ] **Step 7: Commit any remaining changes and push**

```bash
git add -A && git commit -m "chore(dashboard): deployment config" && git push
```
