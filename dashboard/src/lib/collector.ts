/**
 * skills.sh output parser & data collector utilities.
 *
 * The `npx skills` CLI outputs install stats in a table-like format.
 * This module parses that output into structured data we can store
 * in the daily_stats table.
 *
 * Example skills.sh output for `npx skills info <repo>@<skill>`:
 *
 *   Name:      smart-brainstorm
 *   Repo:      second-me-01/skill-hub
 *   Installs:  5,532
 *   Rank:      #42 Hot | #18 Trending
 *   Updated:   2026-03-15
 *
 * Example `npx skills hot` / `npx skills trending` list output:
 *
 *   #  Name                         Installs  Delta  Rating
 *   1  openai/codex@code-review     82,310    +1,205  ★★★★☆
 *   2  anthropic/skills@research    71,889    +983    ★★★★★
 *  ...
 *  42  second-me-01/skill-hub@smart-brainstorm  5,532  +187  ★★★★★
 */

export interface SkillInfoParsed {
  name: string;
  repo: string;
  installs: number;
  rankHot: number | null;
  rankTrending: number | null;
}

export interface RankingEntry {
  rank: number;
  fullName: string; // e.g. "second-me-01/skill-hub@smart-brainstorm"
  installs: number;
  delta: number;
  rating: string;
}

/**
 * Parse the output of `npx skills info <repo>@<skill>`.
 */
export function parseSkillInfo(output: string): SkillInfoParsed | null {
  const lines = output.trim().split("\n").map((l) => l.trim());

  const nameMatch = lines.find((l) => l.startsWith("Name:"));
  const repoMatch = lines.find((l) => l.startsWith("Repo:"));
  const installsMatch = lines.find((l) => l.startsWith("Installs:"));
  const rankMatch = lines.find((l) => l.startsWith("Rank:"));

  if (!nameMatch || !installsMatch) return null;

  const name = nameMatch.replace("Name:", "").trim();
  const repo = repoMatch ? repoMatch.replace("Repo:", "").trim() : "";
  const installs = parseInt(
    installsMatch.replace("Installs:", "").trim().replace(/,/g, ""),
    10
  );

  let rankHot: number | null = null;
  let rankTrending: number | null = null;

  if (rankMatch) {
    const rankStr = rankMatch.replace("Rank:", "").trim();
    const hotMatch = rankStr.match(/#(\d+)\s*Hot/i);
    const trendingMatch = rankStr.match(/#(\d+)\s*Trending/i);
    if (hotMatch) rankHot = parseInt(hotMatch[1], 10);
    if (trendingMatch) rankTrending = parseInt(trendingMatch[1], 10);
  }

  return { name, repo, installs, rankHot, rankTrending };
}

/**
 * Parse the output of `npx skills hot` or `npx skills trending`.
 * Returns an array of ranking entries.
 */
export function parseRankingList(output: string): RankingEntry[] {
  const lines = output.trim().split("\n");
  const entries: RankingEntry[] = [];

  for (const line of lines) {
    // Match lines like: "  42  second-me-01/skill-hub@smart-brainstorm  5,532  +187  ★★★★★"
    const match = line.match(
      /^\s*(\d+)\s+([\w\-./]+@[\w\-]+)\s+([\d,]+)\s+\+?([\d,]+)\s+(.+)$/
    );
    if (match) {
      entries.push({
        rank: parseInt(match[1], 10),
        fullName: match[2],
        installs: parseInt(match[3].replace(/,/g, ""), 10),
        delta: parseInt(match[4].replace(/,/g, ""), 10),
        rating: match[5].trim(),
      });
    }
  }
  return entries;
}

/**
 * Extract skill ID from a full name like "second-me-01/skill-hub@smart-brainstorm".
 */
export function extractSkillId(fullName: string): string {
  const atIndex = fullName.lastIndexOf("@");
  return atIndex >= 0 ? fullName.slice(atIndex + 1) : fullName;
}

/**
 * Find our skills in a ranking list and return their entries.
 */
export function findOurSkills(
  entries: RankingEntry[],
  ourRepo = "second-me-01/skill-hub"
): RankingEntry[] {
  return entries.filter((e) => e.fullName.startsWith(ourRepo));
}

/**
 * Calculate daily delta from two consecutive install counts.
 */
export function calculateDelta(
  todayInstalls: number,
  yesterdayInstalls: number
): number {
  return Math.max(0, todayInstalls - yesterdayInstalls);
}

/**
 * Build a stats row ready for DB insertion from parsed skill info.
 */
export function buildStatsRow(info: SkillInfoParsed, previousInstalls: number) {
  const today = new Date().toISOString().slice(0, 10);
  return {
    skillId: info.name,
    date: today,
    installs: info.installs,
    dailyDelta: calculateDelta(info.installs, previousInstalls),
    rankHot: info.rankHot,
    rankTrending: info.rankTrending,
    platform: "skills.sh" as const,
  };
}
