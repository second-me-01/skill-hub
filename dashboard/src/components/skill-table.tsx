import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

interface SkillTableProps {
  skills: Skill[];
}

function ratingColor(rating: string) {
  switch (rating) {
    case "S":
      return "default" as const;
    case "A":
      return "secondary" as const;
    case "B":
      return "outline" as const;
    default:
      return "outline" as const;
  }
}

export function SkillTable({ skills }: SkillTableProps) {
  return (
    <div className="rounded-lg border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead className="text-right">Installs</TableHead>
            <TableHead className="text-right">Daily Delta</TableHead>
            <TableHead>Source</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {skills.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground">
                No skills found
              </TableCell>
            </TableRow>
          )}
          {skills.map((skill) => (
            <TableRow key={skill.id}>
              <TableCell>
                <Link
                  href={`/skills/${skill.id}`}
                  className="font-medium text-indigo-600 hover:underline"
                >
                  {skill.nameCn}
                </Link>
                {skill.nameEn && (
                  <span className="ml-1.5 text-xs text-muted-foreground">
                    {skill.nameEn}
                  </span>
                )}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {skill.category}
              </TableCell>
              <TableCell>
                <Badge variant={ratingColor(skill.qualityRating)}>
                  {skill.qualityRating}
                </Badge>
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {(skill.installs ?? 0).toLocaleString()}
              </TableCell>
              <TableCell className="text-right tabular-nums">
                <span
                  className={
                    (skill.dailyDelta ?? 0) > 0
                      ? "text-emerald-600"
                      : (skill.dailyDelta ?? 0) < 0
                        ? "text-red-500"
                        : ""
                  }
                >
                  {(skill.dailyDelta ?? 0) > 0 ? "+" : ""}
                  {(skill.dailyDelta ?? 0).toLocaleString()}
                </span>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {skill.source}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
