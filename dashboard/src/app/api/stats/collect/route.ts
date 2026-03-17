import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/db";
import { eq, and, sql } from "drizzle-orm";

interface CollectItem {
  skill_id: string;
  installs: number;
  rank_hot?: number | null;
  rank_trending?: number | null;
  platform?: string;
}

export async function POST(request: NextRequest) {
  try {
    // Auth check
    const secret = request.headers.get("x-api-secret");
    if (!process.env.API_SECRET || secret !== process.env.API_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as { data: CollectItem[] };
    if (!Array.isArray(body.data) || body.data.length === 0) {
      return NextResponse.json(
        { error: "Invalid body: data array required" },
        { status: 400 },
      );
    }

    const today = new Date().toISOString().slice(0, 10);
    const results: { skillId: string; installs: number; dailyDelta: number }[] =
      [];

    for (const item of body.data) {
      const platform = item.platform ?? "skills.sh";

      // Get previous day's installs for delta calculation
      const [prev] = await db
        .select({ installs: schema.dailyStats.installs })
        .from(schema.dailyStats)
        .where(
          and(
            eq(schema.dailyStats.skillId, item.skill_id),
            eq(schema.dailyStats.platform, platform),
            sql`${schema.dailyStats.date} < ${today}`,
          ),
        )
        .orderBy(sql`${schema.dailyStats.date} DESC`)
        .limit(1);

      const dailyDelta = prev ? item.installs - prev.installs : item.installs;

      // Upsert into daily_stats
      await db
        .insert(schema.dailyStats)
        .values({
          skillId: item.skill_id,
          date: today,
          installs: item.installs,
          dailyDelta,
          rankHot: item.rank_hot ?? null,
          rankTrending: item.rank_trending ?? null,
          platform,
        })
        .onConflictDoUpdate({
          target: [
            schema.dailyStats.skillId,
            schema.dailyStats.date,
            schema.dailyStats.platform,
          ],
          set: {
            installs: item.installs,
            dailyDelta,
            rankHot: item.rank_hot ?? null,
            rankTrending: item.rank_trending ?? null,
          },
        });

      results.push({
        skillId: item.skill_id,
        installs: item.installs,
        dailyDelta,
      });
    }

    return NextResponse.json({ ok: true, upserted: results.length, results });
  } catch (error) {
    console.error("POST /api/stats/collect error:", error);
    return NextResponse.json(
      { error: "Failed to collect stats" },
      { status: 500 },
    );
  }
}
