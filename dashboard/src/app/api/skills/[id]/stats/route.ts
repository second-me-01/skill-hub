import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/db";
import { eq, desc, and, sql } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const searchParams = request.nextUrl.searchParams;
    const days = parseInt(searchParams.get("days") ?? "30", 10);

    const stats = await db
      .select({
        date: schema.dailyStats.date,
        installs: schema.dailyStats.installs,
        dailyDelta: schema.dailyStats.dailyDelta,
        rankHot: schema.dailyStats.rankHot,
        rankTrending: schema.dailyStats.rankTrending,
      })
      .from(schema.dailyStats)
      .where(
        and(
          eq(schema.dailyStats.skillId, id),
          sql`${schema.dailyStats.date} >= current_date - ${days}::int`,
        ),
      )
      .orderBy(desc(schema.dailyStats.date));

    return NextResponse.json({ stats });
  } catch (error) {
    console.error("GET /api/skills/[id]/stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 },
    );
  }
}
