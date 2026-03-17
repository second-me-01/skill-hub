import { NextResponse } from "next/server";
import { db, schema } from "@/db";
import { desc, eq, sql } from "drizzle-orm";

export async function GET() {
  try {
    // Subquery: latest date per skill
    const latestDateSubquery = db
      .select({
        skillId: schema.dailyStats.skillId,
        maxDate: sql<string>`max(${schema.dailyStats.date})`.as("max_date"),
      })
      .from(schema.dailyStats)
      .groupBy(schema.dailyStats.skillId)
      .as("latest_dates");

    // Join skills with their latest daily stats
    const rows = await db
      .select({
        id: schema.skills.id,
        repo: schema.skills.repo,
        nameCn: schema.skills.nameCn,
        nameEn: schema.skills.nameEn,
        category: schema.skills.category,
        qualityRating: schema.skills.qualityRating,
        isSatellite: schema.skills.isSatellite,
        source: schema.skills.source,
        installCmd: schema.skills.installCmd,
        tags: schema.skills.tags,
        createdAt: schema.skills.createdAt,
        latestInstalls: schema.dailyStats.installs,
        dailyDelta: schema.dailyStats.dailyDelta,
      })
      .from(schema.skills)
      .leftJoin(
        latestDateSubquery,
        eq(schema.skills.id, latestDateSubquery.skillId),
      )
      .leftJoin(
        schema.dailyStats,
        sql`${schema.dailyStats.skillId} = ${latestDateSubquery.skillId}
            AND ${schema.dailyStats.date} = ${latestDateSubquery.maxDate}`,
      )
      .orderBy(desc(schema.dailyStats.installs));

    const skills = rows.map((r) => ({
      ...r,
      latestInstalls: r.latestInstalls ?? 0,
      dailyDelta: r.dailyDelta ?? 0,
    }));

    return NextResponse.json({ skills });
  } catch (error) {
    console.error("GET /api/skills error:", error);
    return NextResponse.json(
      { error: "Failed to fetch skills" },
      { status: 500 },
    );
  }
}
