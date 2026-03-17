import { NextResponse } from "next/server";
import { db, schema } from "@/db";
import { sql } from "drizzle-orm";
import {
  getCurrentMilestone,
  getNextMilestone,
  getMilestoneProgress,
} from "@/lib/milestones";

export async function GET() {
  try {
    // Total installs: sum of the latest installs per skill (most recent date each)
    const [totals] = await db
      .select({
        totalInstalls: sql<number>`coalesce(sum(latest.installs), 0)`,
      })
      .from(
        sql`(
          SELECT DISTINCT ON (skill_id) installs
          FROM daily_stats
          ORDER BY skill_id, date DESC
        ) AS latest`,
      );

    const totalInstalls = Number(totals?.totalInstalls ?? 0);

    // Today's delta: sum of daily_delta where date = today
    const [todayRow] = await db
      .select({
        todayDelta: sql<number>`coalesce(sum(${schema.dailyStats.dailyDelta}), 0)`,
      })
      .from(schema.dailyStats)
      .where(sql`${schema.dailyStats.date} = current_date`);

    const todayDelta = Number(todayRow?.todayDelta ?? 0);

    // Week delta: sum of daily_delta for the last 7 days
    const [weekRow] = await db
      .select({
        weekDelta: sql<number>`coalesce(sum(${schema.dailyStats.dailyDelta}), 0)`,
      })
      .from(schema.dailyStats)
      .where(sql`${schema.dailyStats.date} >= current_date - 7`);

    const weekDelta = Number(weekRow?.weekDelta ?? 0);

    // Skill count
    const [countRow] = await db
      .select({
        skillCount: sql<number>`count(*)`,
      })
      .from(schema.skills);

    const skillCount = Number(countRow?.skillCount ?? 0);

    // Milestones
    const current = getCurrentMilestone(totalInstalls);
    const next = getNextMilestone(totalInstalls);
    const progress = getMilestoneProgress(totalInstalls);

    return NextResponse.json({
      totalInstalls,
      todayDelta,
      weekDelta,
      skillCount,
      milestone: {
        current,
        next,
        progress,
      },
    });
  } catch (error) {
    console.error("GET /api/stats/overview error:", error);
    return NextResponse.json(
      { error: "Failed to fetch overview" },
      { status: 500 },
    );
  }
}
