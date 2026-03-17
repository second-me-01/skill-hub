import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/db";
import { eq, desc, and, SQL } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const skillId = searchParams.get("skill_id");
    const type = searchParams.get("type");

    const conditions: SQL[] = [];
    if (skillId) conditions.push(eq(schema.events.skillId, skillId));
    if (type) conditions.push(eq(schema.events.type, type));

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const rows = await db
      .select()
      .from(schema.events)
      .where(where)
      .orderBy(desc(schema.events.createdAt));

    return NextResponse.json({ events: rows });
  } catch (error) {
    console.error("GET /api/events error:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      skill_id?: string;
      type: string;
      channel?: string;
      description: string;
      url?: string;
    };

    if (!body.type || !body.description) {
      return NextResponse.json(
        { error: "type and description are required" },
        { status: 400 },
      );
    }

    const [event] = await db
      .insert(schema.events)
      .values({
        skillId: body.skill_id ?? null,
        type: body.type,
        channel: body.channel ?? null,
        description: body.description,
        url: body.url ?? null,
      })
      .returning();

    return NextResponse.json({ event }, { status: 201 });
  } catch (error) {
    console.error("POST /api/events error:", error);
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 },
    );
  }
}
