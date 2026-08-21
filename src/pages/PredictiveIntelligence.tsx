import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { TrendingUp, TrendingDown, Minus, Ambulance, ClipboardCheck, Users, ListChecks, User } from "lucide-react";
import clsx from "clsx";
import { Card, Badge, SectionHeading, Avatar, ProgressBar } from "../components/ui/Primitives";
import { riskEntries, carePlanEffectiveness, staffDemandForecast, residentById } from "../lib/mockData";

const trendIcon = { up: TrendingUp, down: TrendingDown, flat: Minus };

export default function PredictiveIntelligence() {
  return (
    <div className="animate-fade-in-up">
      <SectionHeading
        eyebrow="Predictive Intelligence"
        title="See risk before it becomes an incident"
        description="Models trained on vitals trends, documentation patterns, and care history surface who needs attention next — and whether current care plans are actually working."
      />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mb-5">
        <Card padded={false}>
          <div className="p-5 pb-3 flex items-center gap-2">
            <Ambulance size={17} className="text-rose-500" />
            <h2 className="font-display text-lg text-ink-900">Hospitalization & readmission risk</h2>
          </div>
          <div className="divide-y divide-ink-100">
            {riskEntries.map((r) => {
              const resident = residentById(r.residentId)!;
              const TrendIcon = trendIcon[r.trend];
              return (
                <div key={r.residentId} className="px-5 py-4">
                  <div className="flex items-center gap-2.5 mb-2.5">
                    <Avatar initials={resident.photoInitials} size={30} tone={r.hospitalizationRisk > 60 ? "rose" : "amber"} />
                    <div className="min-w-0 flex-1">
                      <div className="text-[13px] font-semibold text-ink-800">{resident.name}</div>
                      <div className="text-[11px] text-ink-400">Room {resident.room}</div>
                    </div>
                    <TrendIcon size={15} className={r.trend === "up" ? "text-rose-500" : r.trend === "down" ? "text-moss-500" : "text-ink-300"} />
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-2.5">
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-ink-400 mb-1">
                        <span>Hospitalization</span>
                        <span className="font-semibold text-ink-700">{r.hospitalizationRisk}%</span>
                      </div>
                      <ProgressBar value={r.hospitalizationRisk} tone={r.hospitalizationRisk > 60 ? "rose" : "amber"} />
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-ink-400 mb-1">
                        <span>Readmission</span>
                        <span className="font-semibold text-ink-700">{r.readmissionRisk}%</span>
                      </div>
                      <ProgressBar value={r.readmissionRisk} tone={r.readmissionRisk > 60 ? "rose" : "amber"} />
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
            <h2 className="font-display text-lg text-ink-900">Care plan effectiveness</h2>
          </div>
          <div className="divide-y divide-ink-100">
            {carePlanEffectiveness.map((c) => {
              const resident = residentById(c.residentId)!;
              return (
                <div key={c.residentId} className="px-5 py-4">
                  <div className="flex items-center gap-2.5 mb-2">
                    <Avatar initials={resident.photoInitials} size={30} tone="ink" />
                    <div className="min-w-0 flex-1">
                      <div className="text-[13px] font-semibold text-ink-800">{resident.name}</div>
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

      <Card padded={false} className="mb-5">
        <div className="p-5 pb-1 flex items-center gap-2">
          <ListChecks size={17} className="text-clay-600" />
          <h2 className="font-display text-lg text-ink-900">Recommended action plans</h2>
        </div>
        <p className="px-5 text-sm text-ink-500 mb-1 max-w-2xl">
          Synthesized from each resident's risk drivers into concrete next steps, ranked by hospitalization risk.
        </p>
        <div className="divide-y divide-ink-100">
          {[...riskEntries]
            .sort((a, b) => b.hospitalizationRisk - a.hospitalizationRisk)
            .map((r) => {
              const resident = residentById(r.residentId)!;
              return (
                <div key={r.residentId} className="px-5 py-4">
                  <div className="flex items-center gap-2.5 mb-3">
                    <Avatar initials={resident.photoInitials} size={30} tone={r.hospitalizationRisk > 60 ? "rose" : "amber"} />
                    <div className="min-w-0 flex-1">
                      <div className="text-[13px] font-semibold text-ink-800">{resident.name}</div>
                      <div className="text-[11px] text-ink-400">Room {resident.room}</div>
                    </div>
                    <Badge tone={r.hospitalizationRisk > 60 ? "rose" : "amber"}>{r.hospitalizationRisk}% hospitalization risk</Badge>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-x-4 gap-y-2 pl-1">
                    {r.actionPlan.map((item, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span
                          className={clsx(
                            "mt-1.5 h-1.5 w-1.5 rounded-full shrink-0",
                            item.timeframe.toLowerCase().includes("immediate") || item.timeframe.toLowerCase().includes("24h")
                              ? "bg-rose-500"
                              : "bg-amber-500"
                          )}
                        />
                        <div className="min-w-0">
                          <div className="text-[13px] text-ink-700 leading-snug">{item.action}</div>
                          <div className="flex items-center gap-1 text-[11px] text-ink-400 mt-0.5">
                            <User size={10} /> {item.owner}
                            <span className="mx-0.5">&middot;</span>
                            {item.timeframe}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
        </div>
      </Card>

      <Card>
        <div className="flex items-center gap-2 mb-1">
          <Users size={17} className="text-moss-600" />
          <h2 className="font-display text-lg text-ink-900">Staff demand forecasting</h2>
        </div>
        <p className="text-sm text-ink-500 mb-4 max-w-2xl">
          Predicted staffing need vs. current schedule, based on resident acuity mix, historical call-bell volume, and admission forecasts for the coming week.
        </p>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={staffDemandForecast} barGap={6} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="#eef1ec" />
            <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: "#6b7b70", fontSize: 12 }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fill: "#6b7b70", fontSize: 12 }} />
            <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #dde3de", fontSize: 12 }} cursor={{ fill: "#f3ede0" }} />
            <Legend wrapperStyle={{ fontSize: 12, color: "#6b7b70" }} />
            <Bar dataKey="scheduled" name="Scheduled" fill="#c1d6b8" radius={[6, 6, 0, 0]} />
            <Bar dataKey="predictedNeed" name="Predicted need" fill="#446a36" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-3 flex items-center gap-2 text-xs text-amber-700 bg-amber-50 rounded-lg px-3 py-2 w-fit">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
          Wednesday & Sunday are understaffed against predicted need &mdash; consider float pool coverage.
        </div>
      </Card>
    </div>
  );
}
