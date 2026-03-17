import { NextResponse } from "next/server";
import { db, schema } from "@/db";
import { eq, desc } from "drizzle-orm";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const [skill] = await db
      .select()
      .from(schema.skills)
      .where(eq(schema.skills.id, id))
      .limit(1);

    if (!skill) {
      return NextResponse.json({ error: "Skill not found" }, { status: 404 });
    }

    const [latestStats] = await db
      .select()
      .from(schema.dailyStats)
      .where(eq(schema.dailyStats.skillId, id))
      .orderBy(desc(schema.dailyStats.date))
      .limit(1);

    return NextResponse.json({ skill, latestStats: latestStats ?? null });
  } catch (error) {
    console.error("GET /api/skills/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch skill" },
      { status: 500 },
    );
  }
}
