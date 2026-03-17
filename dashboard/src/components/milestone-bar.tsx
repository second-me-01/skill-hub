interface MilestoneBarProps {
  current: number;
  target: number;
  label: string;
  week: string;
}

export function MilestoneBar({ current, target, label, week }: MilestoneBarProps) {
  const pct = Math.min((current / target) * 100, 100);

  return (
    <div className="rounded-lg border bg-white p-4">
      <div className="mb-2 flex items-center justify-between">
        <div>
          <span className="text-sm font-medium">{label}</span>
          <span className="ml-2 text-xs text-muted-foreground">{week}</span>
        </div>
        <span className="text-sm font-semibold tabular-nums">
          {current.toLocaleString()} / {target.toLocaleString()}
        </span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-zinc-100">
        <div
          className="h-full rounded-full bg-indigo-500 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-1 text-right text-xs text-muted-foreground">
        {pct.toFixed(1)}%
      </p>
    </div>
  );
}
