import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { AlertTriangle, Info, TrendingUp, TrendingDown, Minus, Activity, Smile } from "lucide-react";
import clsx from "clsx";
import { Card, Badge, SectionHeading, Avatar } from "../components/ui/Primitives";
import {
  residents,
  vitalsByResident,
  deteriorationSignals,
  behavioralPatterns,
  comfortLog,
  residentById,
} from "../lib/mockData";

const severityTone = { info: "sky", watch: "amber", urgent: "rose" } as const;

export default function ResidentMonitoring() {
  const monitored = residents.filter((r) => vitalsByResident[r.id]);
  const [selectedId, setSelectedId] = useState(monitored[0].id);
  const resident = residentById(selectedId)!;
  const vitals = vitalsByResident[selectedId];
  const signals = deteriorationSignals.filter((d) => d.residentId === selectedId);
  const behaviors = behavioralPatterns.filter((b) => b.residentId === selectedId);
  const comfort = comfortLog.filter((c) => c.residentId === selectedId);

  return (
    <div className="animate-fade-in-up">
      <SectionHeading
        eyebrow="Resident Monitoring"
        title="Deterioration, vitals & wellbeing tracking"
        description="Continuous signal from vitals, documentation, and behavioral observation combine into one early-warning view per resident."
      />

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-5">
        <Card padded={false} className="h-fit">
          <div className="px-4 pt-4 pb-2 text-xs font-semibold uppercase tracking-wide text-ink-400">Residents monitored</div>
          <div className="divide-y divide-ink-100">
            {monitored.map((r) => {
              const sigCount = deteriorationSignals.filter((d) => d.residentId === r.id).length;
              return (
                <button
                  key={r.id}
                  onClick={() => setSelectedId(r.id)}
                  className={clsx("w-full text-left px-4 py-3 hover:bg-ink-50 transition-colors flex items-center gap-2.5", selectedId === r.id && "bg-moss-50")}
                >
                  <Avatar initials={r.photoInitials} size={30} tone={r.deteriorationRisk > 65 ? "rose" : r.deteriorationRisk > 40 ? "amber" : "moss"} />
                  <div className="min-w-0 flex-1">
                    <div className="text-[13px] font-semibold text-ink-800 truncate">{r.name}</div>
                    <div className="text-[11px] text-ink-400">Room {r.room}</div>
                  </div>
                  {sigCount > 0 && <Badge tone="amber">{sigCount}</Badge>}
                </button>
              );
            })}
          </div>
        </Card>

        <div className="space-y-5 min-w-0">
          <Card>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2.5">
                <Avatar initials={resident.photoInitials} tone={resident.deteriorationRisk > 65 ? "rose" : "amber"} />
                <div>
                  <div className="text-sm font-semibold text-ink-800">{resident.name}, {resident.age}</div>
                  <div className="text-xs text-ink-400">Room {resident.room} &middot; {resident.careLevel}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-ink-400">Deterioration risk</div>
                <div className={clsx("font-display text-2xl", resident.deteriorationRisk > 65 ? "text-rose-600" : resident.deteriorationRisk > 40 ? "text-amber-600" : "text-moss-600")}>
                  {resident.deteriorationRisk}
                  <span className="text-sm text-ink-400">/100</span>
                </div>
              </div>
            </div>
          </Card>

          {signals.length > 0 && (
            <Card>
              <h2 className="font-display text-lg text-ink-900 mb-3 flex items-center gap-2">
                <AlertTriangle size={17} className="text-amber-500" /> Deterioration signals
              </h2>
              <div className="space-y-2.5">
                {signals.map((s, i) => (
                  <div key={i} className="flex items-start gap-3 rounded-xl border border-ink-100 p-3">
                    <Badge tone={severityTone[s.severity]} className="mt-0.5 shrink-0 capitalize">{s.severity}</Badge>
                    <div>
                      <div className="text-[13.5px] font-semibold text-ink-800">{s.label}</div>
                      <div className="text-xs text-ink-500 mt-0.5">{s.detail}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          <Card>
            <h2 className="font-display text-lg text-ink-900 mb-4 flex items-center gap-2">
              <Activity size={17} className="text-sky-600" /> Vitals & observation trend
              <span className="text-xs font-normal text-ink-400">&middot; last 14 days</span>
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
              <VitalChart title="Heart rate (bpm)" data={vitals} dataKey="hr" color="#3d7297" />
              <VitalChart title="SpO2 (%)" data={vitals} dataKey="spo2" color="#5a8548" />
              <VitalChart title="Systolic BP (mmHg)" data={vitals} dataKey="systolic" color="#c2622b" />
              <VitalChart title="Respiratory rate" data={vitals} dataKey="resp" color="#b5871c" />
            </div>
          </Card>

          <div className="grid md:grid-cols-2 gap-5">
            <Card>
              <h2 className="font-display text-lg text-ink-900 mb-3 flex items-center gap-2">
                <Info size={17} className="text-clay-600" /> Behavioral patterns
              </h2>
              {behaviors.length === 0 && <p className="text-sm text-ink-400">No notable patterns flagged this week.</p>}
              <div className="space-y-3">
                {behaviors.map((b, i) => (
                  <div key={i} className="border-l-2 border-clay-300 pl-3">
                    <div className="flex items-center justify-between">
                      <div className="text-[13px] font-semibold text-ink-800">{b.pattern}</div>
                      <div className="text-[11px] text-ink-400">{b.date}</div>
                    </div>
                    <div className="text-xs text-ink-500 mt-0.5">{b.note}</div>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <h2 className="font-display text-lg text-ink-900 mb-3 flex items-center gap-2">
                <Smile size={17} className="text-rose-500" /> Pain & comfort tracking
              </h2>
              {comfort.length === 0 && <p className="text-sm text-ink-400">No pain/comfort entries logged this week.</p>}
              <div className="space-y-3">
                {comfort.map((c, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="flex flex-col items-center shrink-0">
                      <div className={clsx("flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white", c.painScore >= 6 ? "bg-rose-500" : c.painScore >= 3 ? "bg-amber-500" : "bg-moss-500")}>
                        {c.painScore}
                      </div>
                      <span className="text-[9px] text-ink-400 mt-0.5">pain</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[13px] font-semibold text-ink-800">{c.method}</span>
                        <span className="text-[11px] text-ink-400">{c.date}</span>
                      </div>
                      <p className="text-xs text-ink-500 mt-0.5">{c.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function VitalChart({ title, data, dataKey, color }: { title: string; data: any[]; dataKey: string; color: string }) {
  const first = data[0][dataKey];
  const last = data[data.length - 1][dataKey];
  const delta = last - first;
  const TrendIcon = delta > 0.5 ? TrendingUp : delta < -0.5 ? TrendingDown : Minus;
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-medium text-ink-600">{title}</span>
        <span className={clsx("flex items-center gap-1 text-xs font-medium", Math.abs(delta) > 0.5 ? "text-clay-600" : "text-ink-400")}>
          <TrendIcon size={12} /> {delta > 0 ? "+" : ""}
          {delta.toFixed(1)}
        </span>
      </div>
      <ResponsiveContainer width="100%" height={90}>
        <LineChart data={data} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="#eef1ec" />
          <XAxis dataKey="t" hide />
          <YAxis hide domain={["dataMin - 2", "dataMax + 2"]} />
          <Tooltip
            contentStyle={{ borderRadius: 12, border: "1px solid #dde3de", fontSize: 12 }}
            labelStyle={{ color: "#6b7b70" }}
          />
          <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
