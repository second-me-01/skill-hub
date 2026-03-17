"use client";

import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface Skill {
  id: string;
  nameCn: string;
}

interface CompareChartProps {
  skills: Skill[];
}

interface DataPoint {
  date: string;
  [key: string]: string | number;
}

const COLORS = ["#4f46e5", "#e11d48"];

export function CompareChart({ skills }: CompareChartProps) {
  const [skillA, setSkillA] = useState("");
  const [skillB, setSkillB] = useState("");
  const [data, setData] = useState<DataPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentA, setCurrentA] = useState<number | null>(null);
  const [currentB, setCurrentB] = useState<number | null>(null);

  const nameA = skills.find((s) => s.id === skillA)?.nameCn ?? skillA;
  const nameB = skills.find((s) => s.id === skillB)?.nameCn ?? skillB;

  useEffect(() => {
    if (!skillA && !skillB) {
      setData([]);
      setCurrentA(null);
      setCurrentB(null);
      return;
    }

    async function load() {
      setLoading(true);
      try {
        const fetches: Promise<{ date: string; installs: number }[] | null>[] = [];

        const fetchStats = async (id: string) => {
          if (!id) return null;
          const res = await fetch(`/api/skills/${id}/stats?days=30`);
          if (!res.ok) return null;
          const json = await res.json();
          return json.stats ?? json;
        };

        const [dataA, dataB] = await Promise.all([
          fetchStats(skillA),
          fetchStats(skillB),
        ]);

        // Merge
        const dateMap = new Map<string, DataPoint>();
        if (dataA) {
          for (const d of dataA) {
            const existing: DataPoint = dateMap.get(d.date) ?? { date: d.date };
            existing[skillA] = d.installs;
            dateMap.set(d.date, existing);
          }
          setCurrentA(dataA.length > 0 ? dataA[dataA.length - 1].installs : null);
        } else {
          setCurrentA(null);
        }
        if (dataB) {
          for (const d of dataB) {
            const existing: DataPoint = dateMap.get(d.date) ?? { date: d.date };
            existing[skillB] = d.installs;
            dateMap.set(d.date, existing);
          }
          setCurrentB(dataB.length > 0 ? dataB[dataB.length - 1].installs : null);
        } else {
          setCurrentB(null);
        }

        const merged = Array.from(dateMap.values()).sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        setData(merged);
      } catch {
        setData([]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [skillA, skillB]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Skill A</label>
          <select
            value={skillA}
            onChange={(e) => setSkillA(e.target.value)}
            className="flex h-8 w-56 items-center rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <option value="">Select...</option>
            {skills.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nameCn}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Skill B</label>
          <select
            value={skillB}
            onChange={(e) => setSkillB(e.target.value)}
            className="flex h-8 w-56 items-center rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <option value="">Select...</option>
            {skills.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nameCn}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Current installs comparison */}
      {(currentA !== null || currentB !== null) && (
        <div className="flex gap-6">
          {currentA !== null && (
            <div className="rounded-md border bg-white px-4 py-2">
              <p className="text-xs text-muted-foreground">{nameA}</p>
              <p className="text-lg font-bold tabular-nums">
                {currentA.toLocaleString()}
              </p>
            </div>
          )}
          {currentB !== null && (
            <div className="rounded-md border bg-white px-4 py-2">
              <p className="text-xs text-muted-foreground">{nameB}</p>
              <p className="text-lg font-bold tabular-nums">
                {currentB.toLocaleString()}
              </p>
            </div>
          )}
        </div>
      )}

      {loading && (
        <p className="text-sm text-muted-foreground">Loading data...</p>
      )}

      {!loading && data.length > 0 && (
        <div className="rounded-lg border bg-white p-4">
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={data} margin={{ top: 8, right: 24, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12, fill: "#6b7280" }}
                tickLine={false}
                axisLine={{ stroke: "#e5e7eb" }}
                tickFormatter={(v: string) => {
                  const d = new Date(v);
                  return `${d.getMonth() + 1}/${d.getDate()}`;
                }}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "#6b7280" }}
                tickLine={false}
                axisLine={false}
                width={60}
                tickFormatter={(v: number) =>
                  v >= 1000 ? `${(v / 1000).toFixed(1)}k` : String(v)
                }
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 8,
                  border: "1px solid #e5e7eb",
                  fontSize: 13,
                }}
              />
              <Legend />
              {skillA && (
                <Line
                  type="monotone"
                  dataKey={skillA}
                  name={nameA}
                  stroke={COLORS[0]}
                  strokeWidth={2}
                  dot={false}
                />
              )}
              {skillB && (
                <Line
                  type="monotone"
                  dataKey={skillB}
                  name={nameB}
                  stroke={COLORS[1]}
                  strokeWidth={2}
                  dot={false}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {!loading && data.length === 0 && (skillA || skillB) && (
        <p className="text-sm text-muted-foreground">
          No data available for the selected skills.
        </p>
      )}
    </div>
  );
}
