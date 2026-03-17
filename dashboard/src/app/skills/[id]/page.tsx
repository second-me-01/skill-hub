import { Badge } from "@/components/ui/badge";
import { InstallChart } from "@/components/install-chart";
import { apiFetch } from "@/lib/api";

interface Skill {
  id: string;
  nameCn: string;
  nameEn?: string | null;
  category: string;
  qualityRating: string;
  source: string;
  tags?: string[] | null;
  repo?: string;
  installCmd?: string | null;
}

interface StatPoint {
  date: string;
  installs: number;
}

interface StatsResponse {
  stats: StatPoint[];
  events?: { date: string; description: string }[];
}

interface Event {
  id: number;
  type: string;
  channel?: string | null;
  description: string;
  url?: string | null;
  createdAt?: string | null;
}

export const dynamic = "force-dynamic";

export default async function SkillDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [skill, statsRes] = await Promise.all([
    apiFetch<Skill>(`/api/skills/${id}`),
    apiFetch<StatsResponse>(`/api/skills/${id}/stats?days=30`),
  ]);

  if (!skill) {
    return (
      <div className="py-20 text-center text-muted-foreground">
        Skill not found or API unavailable.
      </div>
    );
  }

  const stats = statsRes?.stats ?? [];
  const events = statsRes?.events ?? [];

  // Also try to fetch events list
  const eventsList = await apiFetch<Event[]>(
    `/api/events?skill_id=${id}`
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{skill.nameCn}</h1>
        {skill.nameEn && (
          <p className="text-sm text-muted-foreground">{skill.nameEn}</p>
        )}
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <Badge variant="outline">{skill.category}</Badge>
          <Badge>{skill.qualityRating}</Badge>
          {skill.tags?.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
        {skill.repo && (
          <p className="mt-2 text-sm text-muted-foreground">
            Repo:{" "}
            <a
              href={`https://github.com/${skill.repo}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:underline"
            >
              {skill.repo}
            </a>
          </p>
        )}
      </div>

      {/* 30-day chart */}
      {stats.length > 0 && (
        <div className="rounded-lg border bg-white p-4">
          <h2 className="mb-3 text-base font-semibold">30 日安装趋势</h2>
          <InstallChart data={stats} events={events} />
        </div>
      )}

      {/* Events list */}
      <div>
        <h2 className="mb-3 text-base font-semibold">Related Events</h2>
        {(!eventsList || eventsList.length === 0) ? (
          <p className="text-sm text-muted-foreground">No events recorded.</p>
        ) : (
          <div className="space-y-2">
            {eventsList.map((evt) => (
              <div
                key={evt.id}
                className="rounded-lg border bg-white px-4 py-3"
              >
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{evt.type}</Badge>
                  {evt.channel && (
                    <Badge variant="secondary">{evt.channel}</Badge>
                  )}
                  {evt.createdAt && (
                    <span className="text-xs text-muted-foreground">
                      {new Date(evt.createdAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm">{evt.description}</p>
                {evt.url && (
                  <a
                    href={evt.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-indigo-600 hover:underline"
                  >
                    {evt.url}
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
