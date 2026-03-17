import { SkillTable } from "@/components/skill-table";
import { apiFetch } from "@/lib/api";

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

export default async function SkillsListPage() {
  const skills = await apiFetch<Skill[]>("/api/skills");
  const list = skills ?? [];

  // Sort by installs descending
  const sorted = [...list].sort(
    (a, b) => (b.installs ?? 0) - (a.installs ?? 0)
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Skills 列表</h1>
        <p className="text-sm text-muted-foreground">
          All skills sorted by installs
        </p>
      </div>
      <SkillTable skills={sorted} />
    </div>
  );
}
