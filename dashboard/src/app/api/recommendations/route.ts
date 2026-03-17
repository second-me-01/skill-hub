import { NextResponse } from "next/server";
import { db, schema } from "@/db";
import { desc, sql, eq } from "drizzle-orm";
import { or } from "drizzle-orm";

export async function GET() {
  try {
    // Subquery for latest installs per skill
    const latestStats = db
      .select({
        skillId: schema.dailyStats.skillId,
        installs: sql<number>`(
          SELECT installs FROM daily_stats ds2
          WHERE ds2.skill_id = ${schema.dailyStats.skillId}
          ORDER BY ds2.date DESC
          LIMIT 1
        )`.as("latest_installs"),
      })
      .from(schema.dailyStats)
      .groupBy(schema.dailyStats.skillId)
      .as("latest_stats");

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
        installs: latestStats.installs,
      })
      .from(schema.skills)
      .leftJoin(latestStats, eq(schema.skills.id, latestStats.skillId))
      .where(
        or(
          eq(schema.skills.source, "featured"),
          eq(schema.skills.source, "curated"),
        ),
      )
      .orderBy(desc(latestStats.installs));

    // Format to match registry/recommendations.json shape
    const recommendations = rows.map((r) => ({
      id: r.id,
      repo: r.repo,
      name_cn: r.nameCn,
      name_en: r.nameEn,
      category: r.category,
      quality_rating: r.qualityRating,
      is_satellite: r.isSatellite,
      source: r.source,
      install_cmd: r.installCmd,
      tags: r.tags ?? [],
      installs: Number(r.installs ?? 0),
    }));

    return NextResponse.json({ recommendations });
  } catch (error) {
    console.error("GET /api/recommendations error:", error);
    return NextResponse.json(
      { error: "Failed to fetch recommendations" },
      { status: 500 },
    );
  }
}
