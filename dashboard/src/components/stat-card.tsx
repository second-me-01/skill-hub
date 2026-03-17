import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  delta?: number;
  suffix?: string;
}

export function StatCard({ title, value, delta, suffix }: StatCardProps) {
  return (
    <Card className="bg-white">
      <CardContent className="pt-1">
        <p className="text-sm text-muted-foreground">{title}</p>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight">
            {typeof value === "number" ? value.toLocaleString() : value}
          </span>
          {suffix && (
            <span className="text-sm text-muted-foreground">{suffix}</span>
          )}
        </div>
        {delta !== undefined && delta !== null && (
          <div
            className={cn(
              "mt-1 flex items-center gap-1 text-xs font-medium",
              delta > 0
                ? "text-emerald-600"
                : delta < 0
                  ? "text-red-500"
                  : "text-muted-foreground"
            )}
          >
            {delta > 0 ? (
              <TrendingUp className="size-3.5" />
            ) : delta < 0 ? (
              <TrendingDown className="size-3.5" />
            ) : null}
            {delta > 0 ? "+" : ""}
            {delta.toLocaleString()}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
