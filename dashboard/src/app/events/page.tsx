import { Badge } from "@/components/ui/badge";
import { EventForm } from "@/components/event-form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { apiFetch } from "@/lib/api";

interface Skill {
  id: string;
  nameCn: string;
}

interface Event {
  id: number;
  skillId?: string | null;
  type: string;
  channel?: string | null;
  description: string;
  url?: string | null;
  createdAt?: string | null;
}

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const [skills, events] = await Promise.all([
    apiFetch<Skill[]>("/api/skills"),
    apiFetch<Event[]>("/api/events"),
  ]);

  const skillList = skills ?? [];
  const eventList = events ?? [];

  // Build skill name lookup
  const skillMap = Object.fromEntries(
    skillList.map((s) => [s.id, s.nameCn])
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">运营事件</h1>
        <p className="text-sm text-muted-foreground">
          Record and track promotional events
        </p>
      </div>

      {/* Event form */}
      <EventForm skills={skillList} />

      {/* Events table */}
      <div className="rounded-lg border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Skill</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Channel</TableHead>
              <TableHead className="min-w-[200px]">Description</TableHead>
              <TableHead>URL</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {eventList.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center text-muted-foreground"
                >
                  No events found
                </TableCell>
              </TableRow>
            )}
            {eventList.map((evt) => (
              <TableRow key={evt.id}>
                <TableCell className="text-muted-foreground">
                  {evt.createdAt
                    ? new Date(evt.createdAt).toLocaleDateString()
                    : "-"}
                </TableCell>
                <TableCell>
                  {evt.skillId ? skillMap[evt.skillId] ?? evt.skillId : "-"}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{evt.type}</Badge>
                </TableCell>
                <TableCell>
                  {evt.channel ? (
                    <Badge variant="secondary">{evt.channel}</Badge>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell className="max-w-xs truncate">
                  {evt.description}
                </TableCell>
                <TableCell>
                  {evt.url ? (
                    <a
                      href={evt.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:underline"
                    >
                      Link
                    </a>
                  ) : (
                    "-"
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
