import { useState } from "react";
import { Package, DoorOpen, Wrench, AlertTriangle, Users2, CalendarDays, BatteryWarning, Clock } from "lucide-react";
import clsx from "clsx";
import { Card, Badge, SectionHeading, ProgressBar, StatTile, Avatar } from "../components/ui/Primitives";
import { inventory, rooms, maintenanceTickets, staff, activityBookings, type RoomInfo, type MaintenanceTicket, type ActivityBooking } from "../lib/mockData";

const invStatusTone = { ok: "moss", low: "amber", critical: "rose" } as const;
const roomStatusMeta: Record<RoomInfo["status"], { label: string; tone: "moss" | "amber" | "sky" | "ink" }> = {
  "in-use": { label: "In use", tone: "moss" },
  available: { label: "Available", tone: "sky" },
  turnover: { label: "Turnover in progress", tone: "amber" },
  maintenance: { label: "Maintenance", tone: "ink" },
};
const priorityTone: Record<MaintenanceTicket["priority"], "rose" | "amber" | "ink"> = { high: "rose", medium: "amber", low: "ink" };
const bookingStatusTone: Record<ActivityBooking["status"], "moss" | "amber" | "rose"> = { confirmed: "moss", pending: "amber", "needs-driver": "rose" };

type Tab = "staffing" | "inventory" | "rooms" | "activities" | "maintenance";

export default function Operations() {
  const [tab, setTab] = useState<Tab>("staffing");
  const critical = inventory.filter((i) => i.status === "critical").length;
  const available = rooms.filter((r) => r.status === "available").length;
  const openTickets = maintenanceTickets.filter((t) => t.status !== "done").length;
  const overloadedStaff = staff.filter((s) => s.status === "overloaded" || s.burnoutSignal === "elevated").length;

  return (
    <div className="animate-fade-in-up">
      <SectionHeading
        eyebrow="Operations"
        title="Staffing ratios, environments, activities & supplies"
        description="Facility-wide operational visibility — 1:1/2:1 support ratios, sensory equipment stock, room and activity scheduling, and maintenance, in one place."
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatTile label="Staff overloaded" value={String(overloadedStaff)} sub="burnout signal elevated" tone={overloadedStaff ? "clay" : "moss"} />
        <StatTile label="Critical supply items" value={String(critical)} sub="sensory equipment & aids" tone="rose" />
        <StatTile label="Rooms available" value={String(available)} sub={`of ${rooms.length} total`} tone="sky" />
        <StatTile label="Open maintenance" value={String(openTickets)} sub="tickets in progress" tone="amber" />
      </div>

      <div className="flex flex-wrap gap-2 mb-5">
        <TabBtn active={tab === "staffing"} onClick={() => setTab("staffing")} icon={Users2} label="Staffing & ratios" />
        <TabBtn active={tab === "inventory"} onClick={() => setTab("inventory")} icon={Package} label="Supplies & equipment" />
        <TabBtn active={tab === "rooms"} onClick={() => setTab("rooms")} icon={DoorOpen} label="Rooms & environments" />
        <TabBtn active={tab === "activities"} onClick={() => setTab("activities")} icon={CalendarDays} label="Activities & transport" />
        <TabBtn active={tab === "maintenance"} onClick={() => setTab("maintenance")} icon={Wrench} label="Maintenance" />
      </div>

      {tab === "staffing" && (
        <Card padded={false}>
          <div className="divide-y divide-ink-100">
            {staff.map((s) => (
              <div key={s.id} className="px-5 py-4">
                <div className="flex items-center gap-2.5 mb-2">
                  <Avatar initials={s.name.split(" ").map((n) => n[0]).join("")} size={32} tone={s.status === "overloaded" ? "clay" : "moss"} />
                  <div className="min-w-0 flex-1">
                    <div className="text-[13.5px] font-semibold text-ink-800 truncate">{s.name}</div>
                    <div className="text-xs text-ink-400">{s.role} &middot; {s.home} &middot; {s.assignedRatio} support</div>
                  </div>
                  <Badge tone={s.status === "overloaded" ? "clay" : s.status === "available" ? "moss" : "ink"} className="capitalize shrink-0">{s.status.replace("-", " ")}</Badge>
                </div>
                <ProgressBar value={s.taskLoad} tone={s.taskLoad > 80 ? "clay" : s.taskLoad > 60 ? "amber" : "moss"} />
                <div className="flex items-center justify-between mt-1.5 text-[11px] text-ink-400">
                  <span className="flex items-center gap-1"><Clock size={11} /> {s.hoursOnShift.toFixed(1)}h on shift</span>
                  <span>Task load {s.taskLoad}%</span>
                  {s.burnoutSignal !== "none" && (
                    <span className={clsx("flex items-center gap-1 font-medium", s.burnoutSignal === "elevated" ? "text-clay-600" : "text-amber-600")}>
                      <BatteryWarning size={11} /> {s.burnoutSignal}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

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
                    below par level
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
                  <span className="font-display text-base text-ink-900">{r.label}</span>
                  <Badge tone={meta.tone}>{meta.label}</Badge>
                </div>
                <div className="text-xs text-ink-400 mb-1">{r.home} &middot; {r.purpose}</div>
                <div className="text-[13px] text-ink-700 font-medium">{r.occupant ?? "No current occupant"}</div>
              </Card>
            );
          })}
        </div>
      )}

      {tab === "activities" && (
        <Card padded={false}>
          <div className="divide-y divide-ink-100">
            {activityBookings.map((b) => (
              <div key={b.id} className="flex items-start gap-3 px-5 py-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sky-100 text-sky-600">
                  <CalendarDays size={15} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[13.5px] font-semibold text-ink-800">{b.individualName} &middot; {b.activity}</span>
                    <Badge tone={bookingStatusTone[b.status]} className="capitalize shrink-0">{b.status.replace("-", " ")}</Badge>
                  </div>
                  <div className="text-xs text-ink-500 mt-1">
                    {b.date} &middot; {b.transport} &middot; support ratio {b.supportRatio}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
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
