import clsx from "clsx";
import type { LucideIcon } from "lucide-react";

export interface GraphNode {
  id: string;
  label: string;
  icon: LucideIcon;
  tone: "moss" | "clay" | "amber" | "rose" | "sky" | "ink";
  count?: number;
}

const toneBg: Record<GraphNode["tone"], string> = {
  moss: "bg-moss-500",
  clay: "bg-clay-500",
  amber: "bg-amber-500",
  rose: "bg-rose-500",
  sky: "bg-sky-500",
  ink: "bg-ink-500",
};
const toneRing: Record<GraphNode["tone"], string> = {
  moss: "ring-moss-300",
  clay: "ring-clay-300",
  amber: "ring-amber-300",
  rose: "ring-rose-300",
  sky: "ring-sky-300",
  ink: "ring-ink-300",
};

export default function RelationshipGraph({
  centerInitials,
  centerLabel,
  nodes,
  activeId,
  onSelect,
}: {
  centerInitials: string;
  centerLabel: string;
  nodes: GraphNode[];
  activeId: string | null;
  onSelect: (id: string) => void;
}) {
  const cx = 50;
  const cy = 50;
  const r = 36;

  const positions = nodes.map((n, i) => {
    const angle = -90 + i * (360 / nodes.length);
    const rad = (angle * Math.PI) / 180;
    return { ...n, x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  });

  return (
    <div className="relative mx-auto w-full max-w-[440px] aspect-square">
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden="true">
        {positions.map((n) => (
          <line
            key={n.id}
            x1={cx}
            y1={cy}
            x2={n.x}
            y2={n.y}
            stroke={n.id === activeId ? "#8b9c9e" : "#d9e2e3"}
            strokeWidth={n.id === activeId ? 0.6 : 0.4}
          />
        ))}
      </svg>

      <button
        type="button"
        className="absolute -translate-x-1/2 -translate-y-1/2 flex h-20 w-20 items-center justify-center rounded-full bg-ink-900 text-white shadow-[var(--shadow-lifted)] cursor-default"
        style={{ left: `${cx}%`, top: `${cy}%` }}
      >
        <span className="font-display text-lg">{centerInitials}</span>
      </button>
      <div
        className="absolute -translate-x-1/2 text-center text-[11px] font-semibold text-ink-700 w-28"
        style={{ left: `${cx}%`, top: `calc(${cy}% + 44px)` }}
      >
        {centerLabel}
      </div>

      {positions.map((n) => {
        const Icon = n.icon;
        const active = n.id === activeId;
        return (
          <button
            key={n.id}
            type="button"
            onClick={() => onSelect(n.id)}
            className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1.5 group"
            style={{ left: `${n.x}%`, top: `${n.y}%` }}
          >
            <span
              className={clsx(
                "relative flex h-12 w-12 items-center justify-center rounded-full text-white shadow-[var(--shadow-soft)] transition-transform",
                toneBg[n.tone],
                active ? clsx("ring-4", toneRing[n.tone], "scale-110") : "group-hover:scale-105"
              )}
            >
              <Icon size={19} strokeWidth={2} />
              {typeof n.count === "number" && n.count > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-white px-1 text-[9px] font-bold text-ink-800 border border-ink-100">
                  {n.count}
                </span>
              )}
            </span>
            <span className={clsx("text-[10.5px] font-medium leading-tight text-center w-20", active ? "text-ink-900" : "text-ink-500")}>
              {n.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
