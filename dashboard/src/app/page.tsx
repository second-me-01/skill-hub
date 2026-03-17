import { StatCard } from "@/components/stat-card";
import { MilestoneBar } from "@/components/milestone-bar";
import { InstallChart } from "@/components/install-chart";
import { SkillTable } from "@/components/skill-table";
import { apiFetch } from "@/lib/api";

interface OverviewData {
  totalInstalls: number;
  todayDelta: number;
  weekDelta: number;
  skillCount: number;
  milestone?: {
    current: number;
    target: number;
    label: string;
    week: string;
  };
  trend?: { date: string; installs: number }[];
}

interface Skill {
  id: string;
  nameCn: string;
  nameEn?: string | null;
  category: string;
  qualityRating: string;
  installs?: number;
  dailyDelta?: number;
  source: string;
}

export const dynamic = "force-dynamic";

export default async function OverviewPage() {
  const [overview, skills] = await Promise.all([
    apiFetch<OverviewData>("/api/stats/overview"),
    apiFetch<Skill[]>("/api/skills"),
  ]);

  const o = overview ?? {
    totalInstalls: 0,
    todayDelta: 0,
    weekDelta: 0,
    skillCount: 0,
  };

  const milestone = o.milestone ?? {
    current: o.totalInstalls,
    target: Math.ceil(o.totalInstalls / 10000) * 10000 || 10000,
    label: "Next milestone",
    week: "Current",
  };

  const trend = o.trend ?? [];
  const skillList = skills ?? [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">总览</h1>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="总安装量" value={o.totalInstalls} />
        <StatCard title="今日增量" value={o.todayDelta} delta={o.todayDelta} />
        <StatCard title="本周增量" value={o.weekDelta} delta={o.weekDelta} />
        <StatCard title="Skill 数量" value={o.skillCount} />
      </div>

      {/* Milestone */}
      <MilestoneBar
        current={milestone.current}
        target={milestone.target}
        label={milestone.label}
        week={milestone.week}
      />

      {/* 7-day trend chart */}
      {trend.length > 0 && (
        <div className="rounded-lg border bg-white p-4">
          <h2 className="mb-3 text-base font-semibold">7 日安装趋势</h2>
          <InstallChart data={trend} />
        </div>
      )}

      {/* Skills table */}
      <div>
        <h2 className="mb-3 text-base font-semibold">Skills</h2>
        <SkillTable skills={skillList} />
      </div>
    </div>
  );
}
