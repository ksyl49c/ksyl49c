import { useState } from "react";
import { Package, BedDouble, Wrench, AlertTriangle } from "lucide-react";
import clsx from "clsx";
import { Card, Badge, SectionHeading, ProgressBar, StatTile } from "../components/ui/Primitives";
import { inventory, rooms, maintenanceTickets, type RoomInfo, type MaintenanceTicket } from "../lib/mockData";

const invStatusTone = { ok: "moss", low: "amber", critical: "rose" } as const;
const roomStatusMeta: Record<RoomInfo["status"], { label: string; tone: "moss" | "amber" | "sky" | "ink" }> = {
  occupied: { label: "Occupied", tone: "moss" },
  "vacant-ready": { label: "Vacant · Ready", tone: "sky" },
  "vacant-turnover": { label: "Turnover in progress", tone: "amber" },
  maintenance: { label: "Maintenance", tone: "ink" },
};
const priorityTone: Record<MaintenanceTicket["priority"], "rose" | "amber" | "ink"> = { high: "rose", medium: "amber", low: "ink" };

type Tab = "inventory" | "rooms" | "maintenance";

export default function Operations() {
  const [tab, setTab] = useState<Tab>("inventory");
  const critical = inventory.filter((i) => i.status === "critical").length;
  const vacant = rooms.filter((r) => r.status.startsWith("vacant")).length;
  const openTickets = maintenanceTickets.filter((t) => t.status !== "done").length;

  return (
    <div className="animate-fade-in-up">
      <SectionHeading
        eyebrow="Operations"
        title="Supplies, rooms & maintenance"
        description="Facility-wide operational visibility — inventory burn rate, bed availability, and maintenance requests, in one place."
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatTile label="Critical supply items" value={String(critical)} sub="below 3-day threshold" tone="rose" />
        <StatTile label="Vacant beds" value={String(vacant)} sub={`of ${rooms.length} total`} tone="sky" />
        <StatTile label="Open maintenance" value={String(openTickets)} sub="tickets in progress" tone="amber" />
        <StatTile label="Rooms in turnover" value={String(rooms.filter((r) => r.status === "vacant-turnover").length)} sub="being prepared" tone="ink" />
      </div>

      <div className="flex gap-2 mb-5">
        <TabBtn active={tab === "inventory"} onClick={() => setTab("inventory")} icon={Package} label="Inventory" />
        <TabBtn active={tab === "rooms"} onClick={() => setTab("rooms")} icon={BedDouble} label="Room & bed management" />
        <TabBtn active={tab === "maintenance"} onClick={() => setTab("maintenance")} icon={Wrench} label="Maintenance" />
      </div>

      {tab === "inventory" && (
        <Card padded={false}>
          <div className="divide-y divide-ink-100">
            {inventory.map((item) => (
              <div key={item.id} className="flex items-center gap-4 px-5 py-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[13.5px] font-semibold text-ink-800">{item.name}</span>
                    <Badge tone="ink">{item.category}</Badge>
                    {item.status !== "ok" && (
                      <Badge tone={invStatusTone[item.status]} className="capitalize">
                        {item.status}
                      </Badge>
                    )}
                  </div>
                  <div className="mt-2 max-w-md">
                    <ProgressBar value={(item.onHand / item.parLevel) * 100} tone={invStatusTone[item.status]} />
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-[13px] font-semibold text-ink-800">
                    {item.onHand} / {item.parLevel} {item.unit}
                  </div>
                  <div className={clsx("text-xs mt-0.5", item.status === "critical" ? "text-rose-600" : item.status === "low" ? "text-amber-600" : "text-ink-400")}>
                    {item.daysOfSupply} days of supply
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {tab === "rooms" && (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {rooms.map((r) => {
            const meta = roomStatusMeta[r.status];
            return (
              <Card key={r.id} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-display text-lg text-ink-900">{r.label}</span>
                  <Badge tone={meta.tone}>{meta.label}</Badge>
                </div>
                <div className="text-xs text-ink-400 mb-1">
                  {r.wing} &middot; Floor {r.floor} &middot; {r.bedType} room
                </div>
                <div className="text-[13px] text-ink-700 font-medium">{r.occupant ?? "No current occupant"}</div>
              </Card>
            );
          })}
        </div>
      )}

      {tab === "maintenance" && (
        <Card padded={false}>
          <div className="divide-y divide-ink-100">
            {maintenanceTickets.map((t) => (
              <div key={t.id} className="flex items-start gap-3 px-5 py-4">
                <div className={clsx("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", t.priority === "high" ? "bg-rose-100 text-rose-600" : t.priority === "medium" ? "bg-amber-100 text-amber-600" : "bg-ink-100 text-ink-500")}>
                  {t.priority === "high" ? <AlertTriangle size={15} /> : <Wrench size={15} />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[13.5px] font-semibold text-ink-800">{t.title}</span>
                    <Badge tone={priorityTone[t.priority]} className="capitalize shrink-0">{t.priority}</Badge>
                  </div>
                  <div className="text-xs text-ink-500 mt-1">
                    {t.location} &middot; raised by {t.raisedBy} &middot; {t.age} ago
                  </div>
                </div>
                <Badge tone="ink" className="capitalize shrink-0">{t.status.replace("-", " ")}</Badge>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

function TabBtn({ active, onClick, icon: Icon, label }: { active: boolean; onClick: () => void; icon: typeof Package; label: string }) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "flex items-center gap-2 rounded-xl px-4 py-2.5 text-[13.5px] font-semibold transition-colors",
        active ? "bg-ink-900 text-white" : "bg-white text-ink-600 border border-ink-100 hover:bg-ink-50"
      )}
    >
      <Icon size={15} /> {label}
    </button>
  );
}
