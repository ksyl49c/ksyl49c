import { useState } from "react";
import { HandHelping, BatteryWarning, Footprints, Clock, Zap, ArrowRight, CheckCircle2 } from "lucide-react";
import clsx from "clsx";
import { Card, Badge, SectionHeading, ProgressBar, Avatar } from "../components/ui/Primitives";
import FloorMap from "../components/FloorMap";
import { residents as allResidents, staff as allStaff, type StaffMember, type Resident } from "../lib/mockData";

const statusLabel: Record<StaffMember["status"], string> = {
  available: "Available",
  "with-resident": "With resident",
  break: "On break",
  handover: "In handover",
  overloaded: "Overloaded",
};
const statusTone: Record<StaffMember["status"], "moss" | "sky" | "ink" | "amber" | "clay"> = {
  available: "moss",
  "with-resident": "sky",
  break: "ink",
  handover: "amber",
  overloaded: "clay",
};

export default function ResourceManagement() {
  const [residents, setResidents] = useState(allResidents);
  const [staffList, setStaffList] = useState(allStaff);
  const [selected, setSelected] = useState<{ id: string; kind: "resident" | "staff" } | null>(null);
  const [dispatched, setDispatched] = useState<Record<string, string>>({});

  const overloaded = staffList.filter((s) => s.status === "overloaded" || s.burnoutSignal === "elevated");
  const needHelp = residents.filter((r) => r.needsHelp);

  function handleSelect(id: string, kind: "resident" | "staff") {
    setSelected({ id, kind });
  }

  function resolveHelp(residentId: string) {
    setResidents((prev) => prev.map((r) => (r.id === residentId ? { ...r, needsHelp: false, helpReason: undefined } : r)));
    setSelected(null);
  }

  function sendBackup(staffId: string) {
    const overloadedStaff = staffList.find((s) => s.id === staffId);
    if (!overloadedStaff) return;
    const helper = staffList.find((s) => s.status === "available" && s.wing !== overloadedStaff.wing);
    const helperName = helper ? helper.name : "Float pool nurse";
    setDispatched((prev) => ({ ...prev, [staffId]: helperName }));
    if (helper) {
      setStaffList((prev) =>
        prev.map((s) =>
          s.id === helper.id
            ? { ...s, status: "with-resident", wing: overloadedStaff.wing, taskLoad: Math.min(100, s.taskLoad + 15) }
            : s.id === staffId
            ? { ...s, taskLoad: Math.max(40, s.taskLoad - 25), burnoutSignal: "watch" }
            : s
        )
      );
    }
  }

  const selectedResident: Resident | undefined = selected?.kind === "resident" ? residents.find((r) => r.id === selected.id) : undefined;
  const selectedStaff: StaffMember | undefined = selected?.kind === "staff" ? staffList.find((s) => s.id === selected.id) : undefined;

  return (
    <div className="animate-fade-in-up">
      <SectionHeading
        eyebrow="Resource Management"
        title="Live floor map & staff capacity"
        description="Real-time location of every resident and staff member, sourced from worn location badges. Coverage gaps, task overload, and burnout signals trigger automatic rebalancing suggestions."
      />

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-5">
        <div className="space-y-5 min-w-0">
          <Card padded={false} className="overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 pb-0">
              <div className="flex items-center gap-4 text-xs text-ink-500">
                <LegendDot color="bg-rose-500" label="Needs help" />
                <LegendDot color="bg-moss-500" label="Staff available" />
                <LegendDot color="bg-sky-500" label="Staff w/ resident" />
                <LegendDot color="bg-clay-600" label="Staff overloaded" />
              </div>
              <div className="flex items-center gap-2">
                <Badge tone="clay">{overloaded.length} staff overloaded</Badge>
                <Badge tone="rose">{needHelp.length} active alerts</Badge>
              </div>
            </div>
            <div className="p-4">
              <FloorMap residents={residents} staffList={staffList} selectedId={selected?.id ?? null} onSelect={handleSelect} />
            </div>
          </Card>

          {needHelp.length > 0 && (
            <Card>
              <h2 className="font-display text-lg text-ink-900 mb-3">Assistance requested</h2>
              <div className="space-y-2.5">
                {needHelp.map((r) => (
                  <div key={r.id} className="flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50/60 p-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-rose-500 text-white">
                      <HandHelping size={16} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[13.5px] font-semibold text-ink-800">
                        {r.name} &middot; Room {r.room}
                      </div>
                      <div className="text-xs text-ink-500">{r.helpReason}</div>
                    </div>
                    <button
                      onClick={() => resolveHelp(r.id)}
                      className="shrink-0 rounded-full bg-ink-900 text-white text-xs font-semibold px-3.5 py-2 hover:bg-ink-800 transition-colors"
                    >
                      Mark attended
                    </button>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        <div className="space-y-5">
          {selected && (selectedResident || selectedStaff) && (
            <Card className="animate-fade-in-up">
              {selectedResident && (
                <>
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar initials={selectedResident.photoInitials} tone={selectedResident.needsHelp ? "rose" : "ink"} />
                    <div>
                      <div className="text-sm font-semibold text-ink-800">{selectedResident.name}</div>
                      <div className="text-xs text-ink-400">Room {selectedResident.room} &middot; {selectedResident.wing}</div>
                    </div>
                  </div>
                  <div className="space-y-2 text-[13px]">
                    <Row label="Care level" value={selectedResident.careLevel} />
                    <Row label="Deterioration risk" value={`${selectedResident.deteriorationRisk}/100`} />
                    <Row label="Conditions" value={selectedResident.primaryConditions.join(", ")} />
                  </div>
                  {selectedResident.needsHelp && (
                    <button onClick={() => resolveHelp(selectedResident.id)} className="mt-4 w-full rounded-xl bg-ink-900 text-white text-xs font-semibold py-2.5 hover:bg-ink-800 transition-colors">
                      Mark attended
                    </button>
                  )}
                </>
              )}
              {selectedStaff && (
                <>
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar initials={selectedStaff.name.split(" ").map((n) => n[0]).join("")} tone={selectedStaff.status === "overloaded" ? "clay" : "moss"} />
                    <div>
                      <div className="text-sm font-semibold text-ink-800">{selectedStaff.name}</div>
                      <div className="text-xs text-ink-400">{selectedStaff.role} &middot; {selectedStaff.wing}</div>
                    </div>
                  </div>
                  <div className="space-y-2 text-[13px] mb-3">
                    <Row label="Status" value={statusLabel[selectedStaff.status]} />
                    <Row label="Hours on shift" value={`${selectedStaff.hoursOnShift.toFixed(1)}h`} />
                    <Row label="Steps today" value={selectedStaff.stepsToday.toLocaleString()} />
                  </div>
                  <div className="text-xs text-ink-400 mb-1">Task load</div>
                  <ProgressBar value={selectedStaff.taskLoad} tone={selectedStaff.taskLoad > 80 ? "clay" : "moss"} />
                </>
              )}
            </Card>
          )}

          <Card padded={false}>
            <div className="flex items-center justify-between px-5 pt-5 pb-3">
              <h2 className="font-display text-lg text-ink-900">Capacity & burnout tracker</h2>
              <Zap size={16} className="text-clay-500" />
            </div>
            <div className="divide-y divide-ink-100">
              {staffList.map((s) => (
                <div key={s.id} className="px-5 py-3.5">
                  <div className="flex items-center gap-2.5 mb-2">
                    <Avatar initials={s.name.split(" ").map((n) => n[0]).join("")} size={28} tone={s.status === "overloaded" ? "clay" : "moss"} />
                    <div className="min-w-0 flex-1">
                      <div className="text-[13px] font-semibold text-ink-800 truncate">{s.name}</div>
                      <div className="text-[11px] text-ink-400">{s.role} &middot; {s.wing}</div>
                    </div>
                    <Badge tone={statusTone[s.status]} className="shrink-0">{statusLabel[s.status]}</Badge>
                  </div>
                  <ProgressBar value={s.taskLoad} tone={s.taskLoad > 80 ? "clay" : s.taskLoad > 60 ? "amber" : "moss"} />
                  <div className="flex items-center justify-between mt-1.5 text-[11px] text-ink-400">
                    <span className="flex items-center gap-1">
                      <Clock size={11} /> {s.hoursOnShift.toFixed(1)}h
                    </span>
                    <span className="flex items-center gap-1">
                      <Footprints size={11} /> {(s.stepsToday / 1000).toFixed(1)}k steps
                    </span>
                    {s.burnoutSignal !== "none" && (
                      <span className={clsx("flex items-center gap-1 font-medium", s.burnoutSignal === "elevated" ? "text-clay-600" : "text-amber-600")}>
                        <BatteryWarning size={11} /> {s.burnoutSignal}
                      </span>
                    )}
                  </div>
                  {(s.status === "overloaded" || s.burnoutSignal === "elevated") && (
                    <div className="mt-2.5">
                      {dispatched[s.id] ? (
                        <div className="flex items-center gap-1.5 text-xs font-medium text-moss-700 bg-moss-50 rounded-lg px-2.5 py-2">
                          <CheckCircle2 size={13} /> {dispatched[s.id]} dispatched to cover
                        </div>
                      ) : (
                        <button
                          onClick={() => sendBackup(s.id)}
                          className="flex items-center gap-1.5 text-xs font-semibold text-clay-700 bg-clay-100 hover:bg-clay-200 rounded-lg px-2.5 py-2 transition-colors w-full justify-center"
                        >
                          Send backup / rebalance load <ArrowRight size={12} />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={clsx("h-2 w-2 rounded-full", color)} />
      {label}
    </span>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-ink-400">{label}</span>
      <span className="text-ink-700 font-medium text-right">{value}</span>
    </div>
  );
}
