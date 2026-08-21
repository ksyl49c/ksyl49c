import { Bot, Truck, SprayCan, Video, BatteryCharging, Zap, PlugZap, Gauge, Navigation, Pause, AlertTriangle, Undo2, ListChecks } from "lucide-react";
import clsx from "clsx";
import { Card, Badge, SectionHeading, ProgressBar, StatTile } from "../components/ui/Primitives";
import { robots, robotMissions, robotPowerMetrics, robotById, type RobotUnit, type RobotMission } from "../lib/mockData";

const typeIcon: Record<RobotUnit["type"], typeof Truck> = {
  Delivery: Truck,
  Disinfection: SprayCan,
  Telepresence: Video,
};

const statusMeta: Record<RobotUnit["status"], { label: string; tone: "sky" | "amber" | "ink" | "moss" | "rose"; icon: typeof Navigation }> = {
  "on-mission": { label: "On mission", tone: "sky", icon: Navigation },
  charging: { label: "Charging", tone: "amber", icon: BatteryCharging },
  idle: { label: "Idle", tone: "ink", icon: Pause },
  returning: { label: "Returning to dock", tone: "moss", icon: Undo2 },
  error: { label: "Needs attention", tone: "rose", icon: AlertTriangle },
};

const missionStatusTone: Record<RobotMission["status"], "moss" | "sky" | "ink" | "rose"> = {
  completed: "moss",
  "in-progress": "sky",
  queued: "ink",
  failed: "rose",
};

function batteryTone(pct: number): "moss" | "amber" | "rose" {
  if (pct > 60) return "moss";
  if (pct >= 30) return "amber";
  return "rose";
}

export default function RobotManagement() {
  const onMission = robots.filter((r) => r.status === "on-mission").length;
  const needsAttention = robots.filter((r) => r.status === "error").length;
  const avgBattery = Math.round(robots.reduce((sum, r) => sum + r.batteryPct, 0) / robots.length);
  const missionsToday = robots.reduce((sum, r) => sum + r.missionsToday, 0);

  return (
    <div className="animate-fade-in-up">
      <SectionHeading
        eyebrow="Robot Management"
        title="Autonomous fleet, live"
        description="Delivery, disinfection, and telepresence robots supporting the care team — mission status, battery, and power draw across the fleet."
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatTile label="On mission" value={String(onMission)} sub={`of ${robots.length} robots active`} tone="sky" />
        <StatTile label="Avg battery" value={`${avgBattery}%`} sub="across fleet" tone={batteryTone(avgBattery)} />
        <StatTile label="Missions today" value={String(missionsToday)} sub="completed + in progress" tone="moss" />
        <StatTile label="Needs attention" value={String(needsAttention)} sub="charging fault or error" tone={needsAttention > 0 ? "rose" : "moss"} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-5">
        <Card padded={false}>
          <div className="p-5 pb-3 flex items-center gap-2">
            <Bot size={17} className="text-moss-600" />
            <h2 className="font-display text-lg text-ink-900">Fleet</h2>
          </div>
          <div className="divide-y divide-ink-100">
            {robots.map((r) => {
              const TypeIcon = typeIcon[r.type];
              const meta = statusMeta[r.status];
              const StatusIcon = meta.icon;
              return (
                <div key={r.id} className="px-5 py-4">
                  <div className="flex items-center gap-2.5 mb-2.5">
                    <div className={clsx("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", r.status === "error" ? "bg-rose-100 text-rose-600" : "bg-ink-100 text-ink-600")}>
                      <TypeIcon size={16} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[13.5px] font-semibold text-ink-800">{r.name}</div>
                      <div className="text-[11px] text-ink-400">
                        {r.type} &middot; {r.wing} &middot; Floor {r.floor}
                      </div>
                    </div>
                    <Badge tone={meta.tone} className="shrink-0">
                      <StatusIcon size={11} /> {meta.label}
                    </Badge>
                  </div>

                  {r.currentMission && (
                    <div className={clsx("text-xs mb-2.5 pl-11", r.status === "error" ? "text-rose-600" : "text-ink-500")}>{r.currentMission}</div>
                  )}

                  <div className="flex items-center gap-3 pl-11">
                    <div className="flex-1 flex items-center gap-2">
                      <BatteryCharging size={13} className="text-ink-300 shrink-0" />
                      <ProgressBar value={r.batteryPct} tone={batteryTone(r.batteryPct)} />
                      <span className="text-[11px] font-semibold text-ink-600 w-8 text-right shrink-0">{r.batteryPct}%</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 pl-11 mt-2 text-[11px] text-ink-400">
                    <span>{r.missionsToday} missions today</span>
                    <span>{r.distanceKm.toFixed(1)} km traveled</span>
                    <span>Serviced {r.lastServiced}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <div className="space-y-5">
          <Card padded={false}>
            <div className="p-5 pb-3 flex items-center gap-2">
              <ListChecks size={16} className="text-clay-600" />
              <h2 className="font-display text-base text-ink-900">Mission log</h2>
            </div>
            <div className="divide-y divide-ink-100 max-h-[420px] overflow-y-auto scrollbar-thin">
              {robotMissions.map((m) => {
                const robot = robotById(m.robotId);
                return (
                  <div key={m.id} className="px-5 py-3">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[12.5px] font-semibold text-ink-800">{robot?.name}</span>
                      <Badge tone={missionStatusTone[m.status]} className="capitalize shrink-0">
                        {m.status.replace("-", " ")}
                      </Badge>
                    </div>
                    <div className="text-xs text-ink-500">{m.summary}</div>
                    <div className="text-[11px] text-ink-400 mt-1">{m.timestamp}</div>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-2 mb-4">
              <Zap size={16} className="text-amber-500" />
              <h2 className="font-display text-base text-ink-900">Electricity & charging</h2>
            </div>
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs text-ink-500">
                  <Gauge size={13} /> Energy used today
                </span>
                <span className="text-[13px] font-semibold text-ink-800">{robotPowerMetrics.kwhToday} kWh</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs text-ink-500">
                  <Zap size={13} /> Est. cost today
                </span>
                <span className="text-[13px] font-semibold text-ink-800">${robotPowerMetrics.estCostToday.toFixed(2)}</span>
              </div>
              <div>
                <div className="flex items-center justify-between text-xs text-ink-500 mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <PlugZap size={13} /> Charging docks in use
                  </span>
                  <span className="font-semibold text-ink-700">
                    {robotPowerMetrics.chargingDocksInUse} / {robotPowerMetrics.chargingDocksTotal}
                  </span>
                </div>
                <ProgressBar value={(robotPowerMetrics.chargingDocksInUse / robotPowerMetrics.chargingDocksTotal) * 100} tone="amber" />
              </div>
              <div>
                <div className="flex items-center justify-between text-xs text-ink-500 mb-1.5">
                  <span>Fleet uptime</span>
                  <span className="font-semibold text-ink-700">{robotPowerMetrics.fleetUptimePct}%</span>
                </div>
                <ProgressBar value={robotPowerMetrics.fleetUptimePct} tone="moss" />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
