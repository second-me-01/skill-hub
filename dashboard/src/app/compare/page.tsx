import { CompareChart } from "@/components/compare-chart";
import { apiFetch } from "@/lib/api";

interface Skill {
  id: string;
  nameCn: string;
}

export const dynamic = "force-dynamic";

export default async function ComparePage() {
  const skills = await apiFetch<Skill[]>("/api/skills");
  const list = skills ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">竞品对比</h1>
        <p className="text-sm text-muted-foreground">
          Compare install trends across skills
        </p>
      </div>

      <CompareChart skills={list} />
    </div>
  );
}
