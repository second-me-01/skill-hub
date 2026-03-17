"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  List,
  GitCompareArrows,
  CalendarPlus,
} from "lucide-react";

const links = [
  { href: "/", label: "总览", icon: LayoutDashboard },
  { href: "/skills", label: "Skills 列表", icon: List },
  { href: "/compare", label: "竞品对比", icon: GitCompareArrows },
  { href: "/events", label: "运营事件", icon: CalendarPlus },
] as const;

export function Nav() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-56 shrink-0 flex-col border-r border-border bg-zinc-950 text-zinc-300">
      <div className="flex h-14 items-center gap-2 border-b border-white/10 px-5">
        <span className="text-lg font-semibold tracking-tight text-white">
          Skill Hub
        </span>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
        {links.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === "/"
              ? pathname === "/"
              : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-white/10 text-white"
                  : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
              )}
            >
              <Icon className="size-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 px-5 py-3">
        <p className="text-xs text-zinc-500">Skill Hub v0.1</p>
      </div>
    </aside>
  );
}
