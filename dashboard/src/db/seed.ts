import { sql } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";
import * as schema from "./schema";

const db = drizzle(sql, { schema });

const OUR_SKILLS = [
  {
    id: "skill-hub",
    repo: "second-me-01/skill-hub",
    nameCn: "Skill Hub",
    nameEn: "Skill Hub",
    category: "meta",
    qualityRating: "S",
    isSatellite: false,
    source: "featured",
    installCmd: "npx skills add secondme-team/skill-hub --all -g",
    tags: ["skill marketplace", "技能市场", "安装", "发现"],
  },
  {
    id: "smart-brainstorm",
    repo: "second-me-01/skill-hub",
    nameCn: "结构化头脑风暴",
    nameEn: "Smart Brainstorm",
    category: "productivity",
    qualityRating: "S",
    isSatellite: true,
    source: "featured",
    installCmd: "npx skills add second-me-01/skill-hub@smart-brainstorm -g -y",
    tags: ["brainstorm", "ideation", "头脑风暴", "创意"],
  },
  {
    id: "ui-design-system",
    repo: "second-me-01/skill-hub",
    nameCn: "设计系统生成器",
    nameEn: "UI Design System",
    category: "design",
    qualityRating: "S",
    isSatellite: true,
    source: "featured",
    installCmd: "npx skills add second-me-01/skill-hub@ui-design-system -g -y",
    tags: ["design system", "UI", "设计系统", "组件库", "Tailwind"],
  },
  {
    id: "xhs-writer",
    repo: "second-me-01/skill-hub",
    nameCn: "小红书爆款写手",
    nameEn: "XHS Writer",
    category: "chinese-ecosystem",
    qualityRating: "S",
    isSatellite: true,
    source: "featured",
    installCmd: "npx skills add second-me-01/skill-hub@xhs-writer -g -y",
    tags: ["小红书", "种草", "内容创作", "xiaohongshu"],
  },
  {
    id: "video-script",
    repo: "second-me-01/skill-hub",
    nameCn: "视频脚本助手",
    nameEn: "Video Script",
    category: "content-creation",
    qualityRating: "S",
    isSatellite: true,
    source: "featured",
    installCmd: "npx skills add second-me-01/skill-hub@video-script -g -y",
    tags: ["视频脚本", "分镜", "字幕", "短视频", "video"],
  },
  {
    id: "feishu-kit",
    repo: "second-me-01/skill-hub",
    nameCn: "飞书集成工具包",
    nameEn: "Feishu Kit",
    category: "chinese-ecosystem",
    qualityRating: "A",
    isSatellite: true,
    source: "featured",
    installCmd: "npx skills add second-me-01/skill-hub@feishu-kit -g -y",
    tags: ["飞书", "feishu", "lark", "机器人", "多维表格"],
  },
];

const COMPETITORS = [
  {
    id: "comp-brainstorming",
    repo: "anthropics/claude-skills",
    nameCn: "Brainstorming (竞品)",
    nameEn: "Brainstorming",
    category: "productivity",
    qualityRating: "B",
    isSatellite: false,
    source: "competitor",
    installCmd: null,
    tags: ["brainstorm", "competitor"],
  },
  {
    id: "comp-daqi-xhs",
    repo: "daqi/xhs-assistant",
    nameCn: "大奇小红书助手 (竞品)",
    nameEn: "Daqi XHS Assistant",
    category: "chinese-ecosystem",
    qualityRating: "B",
    isSatellite: false,
    source: "competitor",
    installCmd: null,
    tags: ["小红书", "competitor"],
  },
];

/** Generate synthetic daily stats for the past N days */
function generateDailyStats(skillId: string, baseLine: number, days: number) {
  const rows: {
    skillId: string;
    date: string;
    installs: number;
    dailyDelta: number;
    platform: string;
  }[] = [];
  let cumulative = baseLine;
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);

    // Simulate organic growth with some variance
    const base = Math.max(5, Math.floor(baseLine / days));
    const variance = Math.floor(Math.random() * base * 0.6) - Math.floor(base * 0.2);
    const delta = base + variance;
    cumulative += delta;

    rows.push({
      skillId,
      date: dateStr,
      installs: cumulative,
      dailyDelta: delta,
      platform: "skills.sh",
    });
  }
  return rows;
}

async function seed() {
  console.log("Seeding skills...");
  const allSkills = [...OUR_SKILLS, ...COMPETITORS];
  for (const s of allSkills) {
    await db
      .insert(schema.skills)
      .values(s)
      .onConflictDoNothing();
  }
  console.log(`  Inserted ${allSkills.length} skills`);

  console.log("Seeding daily stats (30 days)...");
  const statsConfig: Record<string, number> = {
    "skill-hub": 8500,
    "smart-brainstorm": 4200,
    "ui-design-system": 3800,
    "xhs-writer": 2600,
    "video-script": 1900,
    "feishu-kit": 1100,
    "comp-brainstorming": 55000,
    "comp-daqi-xhs": 800,
  };

  for (const [skillId, baseline] of Object.entries(statsConfig)) {
    const rows = generateDailyStats(skillId, baseline, 30);
    for (const row of rows) {
      await db
        .insert(schema.dailyStats)
        .values(row)
        .onConflictDoNothing();
    }
  }
  console.log("  Inserted daily stats for all skills");

  console.log("Seeding events...");
  const events = [
    {
      skillId: "skill-hub",
      type: "launch",
      channel: "技术社区",
      description: "Skill Hub v1.0 全平台上架",
      url: "https://github.com/second-me-01/skill-hub",
    },
    {
      skillId: "smart-brainstorm",
      type: "promotion",
      channel: "知乎",
      description: "知乎专栏首发：结构化头脑风暴 Skill 深度解析",
      url: null,
    },
    {
      skillId: "xhs-writer",
      type: "promotion",
      channel: "小红书运营群",
      description: "小红书运营群首批体验推广",
      url: null,
    },
    {
      skillId: "skill-hub",
      type: "milestone",
      channel: null,
      description: "累计安装量突破 5,000",
      url: null,
    },
    {
      skillId: "ui-design-system",
      type: "promotion",
      channel: "设计师社群",
      description: "设计师微信群推广",
      url: null,
    },
    {
      skillId: "video-script",
      type: "promotion",
      channel: "V2EX",
      description: "V2EX 帖子：用 Agent Skill 写视频脚本",
      url: null,
    },
  ];

  for (const e of events) {
    await db.insert(schema.events).values(e);
  }
  console.log(`  Inserted ${events.length} events`);

  console.log("Seed complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
