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
