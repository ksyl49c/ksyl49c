import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { TrendingUp, TrendingDown, Minus, AlertTriangle, ClipboardCheck, Users, Stethoscope } from "lucide-react";
import { Card, Badge, SectionHeading, Avatar, ProgressBar } from "../components/ui/Primitives";
import { riskEntries, pbsPlanEffectiveness, supportDemandForecast, overshadowingFlags, individualById } from "../lib/mockData";

const trendIcon = { up: TrendingUp, down: TrendingDown, flat: Minus };
const severityTone = { info: "sky", watch: "amber", urgent: "rose" } as const;

export default function PredictiveIntelligence() {
  return (
    <div className="animate-fade-in-up">
      <SectionHeading
        eyebrow="Predictive Intelligence"
        title="See risk before it becomes an incident"
        description="Models trained on ABC chart patterns, sensory triggers, and documentation history surface who needs attention next — including a dedicated check for diagnostic overshadowing, where physical health changes get mistaken for behaviour."
      />

      <Card className="mb-5 border-rose-200 bg-rose-50/60">
        <div className="flex items-center gap-2 mb-3">
          <Stethoscope size={17} className="text-rose-600" />
          <h2 className="font-display text-lg text-ink-900">Diagnostic overshadowing watch</h2>
        </div>
        <p className="text-xs text-ink-600 mb-4 max-w-2xl">
          People with learning disabilities and autism are at high risk of physical health symptoms being
          attributed to their behaviour or condition instead of investigated. These flags surface when a
          behaviour change pattern looks more like unmet physical need than escalation.
        </p>
        <div className="space-y-2.5">
          {overshadowingFlags.map((f, i) => {
            const person = individualById(f.individualId);
            return (
              <div key={i} className="flex items-start gap-3 rounded-xl border border-ink-100 bg-white p-3">
                <Avatar initials={person?.photoInitials ?? "??"} size={32} tone={severityTone[f.severity]} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-[13.5px] font-semibold text-ink-800">{person?.name} &middot; {f.label}</div>
                    <Badge tone={severityTone[f.severity]} className="capitalize shrink-0">{f.severity}</Badge>
                  </div>
                  <div className="text-xs text-ink-500 mt-1">{f.detail}</div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mb-5">
        <Card padded={false}>
          <div className="p-5 pb-3 flex items-center gap-2">
            <AlertTriangle size={17} className="text-rose-500" />
            <h2 className="font-display text-lg text-ink-900">Escalation & placement stability risk</h2>
          </div>
          <div className="divide-y divide-ink-100">
            {riskEntries.map((r) => {
              const person = individualById(r.individualId)!;
              const TrendIcon = trendIcon[r.trend];
              return (
                <div key={r.individualId} className="px-5 py-4">
                  <div className="flex items-center gap-2.5 mb-2.5">
                    <Avatar initials={person.photoInitials} size={30} tone={r.escalationRisk > 60 ? "rose" : "amber"} />
                    <div className="min-w-0 flex-1">
                      <div className="text-[13px] font-semibold text-ink-800">{person.name}</div>
                      <div className="text-[11px] text-ink-400">{person.home}</div>
                    </div>
                    <TrendIcon size={15} className={r.trend === "up" ? "text-rose-500" : r.trend === "down" ? "text-moss-500" : "text-ink-300"} />
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-2.5">
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-ink-400 mb-1">
                        <span>Escalation</span>
                        <span className="font-semibold text-ink-700">{r.escalationRisk}%</span>
                      </div>
                      <ProgressBar value={r.escalationRisk} tone={r.escalationRisk > 60 ? "rose" : "amber"} />
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-ink-400 mb-1">
                        <span>Placement stability</span>
                        <span className="font-semibold text-ink-700">{r.placementStabilityRisk}%</span>
                      </div>
                      <ProgressBar value={r.placementStabilityRisk} tone={r.placementStabilityRisk > 60 ? "rose" : "amber"} />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {r.primaryDrivers.map((d) => (
                      <Badge key={d} tone="ink">{d}</Badge>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card padded={false}>
          <div className="p-5 pb-3 flex items-center gap-2">
            <ClipboardCheck size={17} className="text-sky-600" />
            <h2 className="font-display text-lg text-ink-900">PBS plan effectiveness</h2>
          </div>
          <div className="divide-y divide-ink-100">
            {pbsPlanEffectiveness.map((c) => {
              const person = individualById(c.individualId)!;
              return (
                <div key={c.individualId} className="px-5 py-4">
                  <div className="flex items-center gap-2.5 mb-2">
                    <Avatar initials={person.photoInitials} size={30} tone="ink" />
                    <div className="min-w-0 flex-1">
                      <div className="text-[13px] font-semibold text-ink-800">{person.name}</div>
                      <div className="text-[11px] text-ink-400">{c.planFocus}</div>
                    </div>
                    <Badge tone={c.trend === "declining" ? "rose" : c.trend === "improving" ? "moss" : "ink"} className="capitalize shrink-0">
                      {c.trend}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex-1">
                      <ProgressBar value={c.effectivenessScore} tone={c.effectivenessScore > 70 ? "moss" : c.effectivenessScore > 50 ? "amber" : "rose"} />
                    </div>
                    <span className="text-[13px] font-semibold text-ink-700 shrink-0">{c.effectivenessScore}%</span>
                  </div>
                  <p className="text-xs text-ink-500">{c.note}</p>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex items-center gap-2 mb-1">
          <Users size={17} className="text-moss-600" />
          <h2 className="font-display text-lg text-ink-900">Support hours demand forecasting</h2>
        </div>
        <p className="text-sm text-ink-500 mb-4 max-w-2xl">
          Predicted 1:1/2:1 support hours vs. current schedule, based on individual support ratios, recent escalation
          trends, and planned community activities for the coming week.
        </p>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={supportDemandForecast} barGap={6} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="#ecf1f1" />
            <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: "#647579", fontSize: 12 }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fill: "#647579", fontSize: 12 }} />
            <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #d9e2e3", fontSize: 12 }} cursor={{ fill: "#e7edee" }} />
            <Legend wrapperStyle={{ fontSize: 12, color: "#647579" }} />
            <Bar dataKey="scheduledHours" name="Scheduled hours" fill="#aedad5" radius={[6, 6, 0, 0]} />
            <Bar dataKey="predictedHours" name="Predicted need" fill="#297166" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-3 flex items-center gap-2 text-xs text-amber-700 bg-amber-50 rounded-lg px-3 py-2 w-fit">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
          Wednesday & Sunday are understaffed against predicted need &mdash; consider relief pool cover.
        </div>
      </Card>
    </div>
  );
}
