"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot,
} from "recharts";

interface DataPoint {
  date: string;
  installs: number;
}

interface EventMarker {
  date: string;
  description: string;
}

interface InstallChartProps {
  data: DataPoint[];
  events?: EventMarker[];
  height?: number;
}

export function InstallChart({
  data,
  events = [],
  height = 300,
}: InstallChartProps) {
  const eventDates = new Set(events.map((e) => e.date));
  const eventMap = Object.fromEntries(events.map((e) => [e.date, e.description]));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 16, right: 24, left: 0, bottom: 0 }}>
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
          labelFormatter={(label) => {
            const key = String(label);
            const note = eventMap[key];
            return note ? `${key} — ${note}` : key;
          }}
          formatter={(value) => [Number(value).toLocaleString(), "Installs"]}
        />
        <Line
          type="monotone"
          dataKey="installs"
          stroke="#4f46e5"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, fill: "#4f46e5" }}
        />
        {data
          .filter((d) => eventDates.has(d.date))
          .map((d) => (
            <ReferenceDot
              key={d.date}
              x={d.date}
              y={d.installs}
              r={5}
              fill="#f59e0b"
              stroke="#fff"
              strokeWidth={2}
            />
          ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
