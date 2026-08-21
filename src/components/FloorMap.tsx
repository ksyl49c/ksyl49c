import clsx from "clsx";
import { HandHelping, User2 } from "lucide-react";
import type { Resident, StaffMember, Wing } from "../lib/mockData";

const wingZones: { wing: Wing; left: number; top: number; width: number; height: number; color: string }[] = [
  { wing: "Magnolia", left: 4, top: 22, width: 26, height: 46, color: "moss" },
  { wing: "Cedar", left: 32, top: 40, width: 20, height: 44, color: "amber" },
  { wing: "Birchwood", left: 54, top: 10, width: 20, height: 58, color: "sky" },
  { wing: "Willow", left: 76, top: 18, width: 20, height: 58, color: "clay" },
];

const zoneColorMap: Record<string, string> = {
  moss: "border-moss-300/70 bg-moss-100/60",
  amber: "border-amber-300/70 bg-amber-100/50",
  sky: "border-sky-300/70 bg-sky-100/60",
  clay: "border-clay-300/70 bg-clay-100/50",
};
const zoneLabelColorMap: Record<string, string> = {
  moss: "text-moss-700",
  amber: "text-amber-700",
  sky: "text-sky-700",
  clay: "text-clay-700",
};

const staffStatusColor: Record<StaffMember["status"], string> = {
  available: "bg-moss-500",
  "with-resident": "bg-sky-500",
  break: "bg-ink-400",
  handover: "bg-amber-500",
  overloaded: "bg-clay-600",
};

export default function FloorMap({
  residents,
  staffList,
  selectedId,
  onSelect,
}: {
  residents: Resident[];
  staffList: StaffMember[];
  selectedId: string | null;
  onSelect: (id: string, kind: "resident" | "staff") => void;
}) {
  return (
    <div className="relative w-full aspect-[16/10] overflow-hidden rounded-2xl bg-gradient-to-b from-ink-100 to-ink-50" style={{ perspective: "1600px" }}>
      <div
        className="absolute inset-0 bg-noise"
        style={{
          transform: "rotateX(48deg) scale(1.05)",
          transformOrigin: "center",
        }}
      >
        {wingZones.map((z) => (
          <div
            key={z.wing}
            className={clsx("absolute rounded-2xl border-2 shadow-[var(--shadow-soft)]", zoneColorMap[z.color])}
            style={{ left: `${z.left}%`, top: `${z.top}%`, width: `${z.width}%`, height: `${z.height}%` }}
          >
            <div
              className={clsx("absolute top-2 left-3 text-[11px] font-bold uppercase tracking-wider", zoneLabelColorMap[z.color])}
              style={{ transform: "rotateX(-48deg)", transformOrigin: "top left" }}
            >
              {z.wing}
            </div>
          </div>
        ))}

        {residents.map((r) => (
          <button
            key={r.id}
            onClick={() => onSelect(r.id, "resident")}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
            style={{ left: `${r.x}%`, top: `${r.y}%` }}
          >
            <div style={{ transform: "rotateX(-48deg)" }} className="flex flex-col items-center animate-float-marker">
              {r.needsHelp && <span className="absolute inset-0 -m-1.5 rounded-full bg-rose-500/60 animate-pulse-ring" />}
              <div
                className={clsx(
                  "relative flex h-6 w-6 items-center justify-center rounded-full border-2 border-white text-[10px] font-bold text-white shadow-md transition-transform hover:scale-125",
                  r.needsHelp ? "bg-rose-500" : r.deteriorationRisk > 65 ? "bg-clay-600" : "bg-ink-500",
                  selectedId === r.id && "ring-2 ring-offset-2 ring-ink-800"
                )}
              >
                {r.needsHelp ? <HandHelping size={12} /> : r.photoInitials.slice(0, 1)}
              </div>
            </div>
          </button>
        ))}

        {staffList.map((s) => (
          <button
            key={s.id}
            onClick={() => onSelect(s.id, "staff")}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
            style={{ left: `${s.x}%`, top: `${s.y}%` }}
          >
            <div style={{ transform: "rotateX(-48deg)" }} className="flex flex-col items-center">
              <div
                className={clsx(
                  "relative flex h-4 w-4 items-center justify-center rounded-full border-2 border-white shadow-md transition-transform hover:scale-125",
                  staffStatusColor[s.status],
                  selectedId === s.id && "ring-2 ring-offset-2 ring-ink-800"
                )}
              >
                {s.status === "overloaded" && <span className="absolute inset-0 rounded-full bg-clay-500 animate-pulse-ring" />}
                <User2 size={9} className="text-white" />
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
