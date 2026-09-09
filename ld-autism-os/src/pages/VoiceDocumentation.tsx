import { useState, useEffect, useRef } from "react";
import { Mic, Square, FileText, ShieldAlert, ClipboardList, Check, Loader2, Sparkles } from "lucide-react";
import clsx from "clsx";
import { Card, Badge, SectionHeading, Avatar } from "../components/ui/Primitives";
import { voiceCaptures, individualById } from "../lib/mockData";

type Stage = "idle" | "recording" | "transcribing" | "structuring" | "done";

const categoryIcon: Record<string, typeof FileText> = {
  "ABC Chart": ClipboardList,
  "Sensory Log": ClipboardList,
  "Daily Living Note": FileText,
  "PBS Plan Update": ClipboardList,
  "Restrictive Practice Log": ShieldAlert,
  "Shift Handover": FileText,
  "Safeguarding Flag": ShieldAlert,
  "Incident Report": ShieldAlert,
};

export default function VoiceDocumentation() {
  const [selectedId, setSelectedId] = useState(voiceCaptures[0].id);
  const [stage, setStage] = useState<Stage>("done");
  const [liveTranscript, setLiveTranscript] = useState("");
  const [visibleOutputs, setVisibleOutputs] = useState(99);
  const [tab, setTab] = useState<"documentation" | "safety">("documentation");
  const timers = useRef<number[]>([]);

  const selected = voiceCaptures.find((c) => c.id === selectedId) ?? voiceCaptures[0];
  const demoCapture = voiceCaptures[0];

  function clearTimers() {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  }

  function startDemo() {
    clearTimers();
    setSelectedId(demoCapture.id);
    setStage("recording");
    setLiveTranscript("");
    setVisibleOutputs(0);
    setTab("documentation");

    timers.current.push(
      window.setTimeout(() => {
        setStage("transcribing");
        const words = demoCapture.transcript.split(" ");
        let i = 0;
        const interval = window.setInterval(() => {
          i += 3;
          setLiveTranscript(words.slice(0, i).join(" "));
          if (i >= words.length) {
            window.clearInterval(interval);
            setStage("structuring");
            timers.current.push(
              window.setTimeout(() => {
                setStage("done");
                let n = 0;
                const outInterval = window.setInterval(() => {
                  n += 1;
                  setVisibleOutputs(n);
                  if (n >= demoCapture.outputs.length) window.clearInterval(outInterval);
                }, 350);
              }, 900)
            );
          }
        }, 70);
      }, 2200)
    );
  }

  useEffect(() => () => clearTimers(), []);

  const isDemoActive = stage !== "done" && stage !== "idle";
  const activeCapture = isDemoActive ? demoCapture : selected;
  const activeOutputCount = isDemoActive ? visibleOutputs : activeCapture.outputs.length;
  const activeTranscript = isDemoActive ? liveTranscript : activeCapture.transcript;

  const docOutputs = activeCapture.outputs.slice(0, activeOutputCount).filter((o) => o.group === "documentation");
  const safetyOutputs = activeCapture.outputs.slice(0, activeOutputCount).filter((o) => o.group === "safety");

  return (
    <div className="animate-fade-in-up">
      <SectionHeading
        eyebrow="Voice-First Documentation"
        title="Speak it once, it files itself"
        description="Support workers narrate observations, handovers, and interactions in the moment. Lumen transcribes in real time and structures the output into ABC charts, PBS updates, and safety records automatically."
      />

      <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-5">
        <div className="space-y-5">
          <Card className="text-center">
            <button
              onClick={startDemo}
              disabled={isDemoActive}
              className={clsx(
                "relative mx-auto flex h-24 w-24 items-center justify-center rounded-full transition-all",
                stage === "recording" ? "bg-rose-500" : "bg-moss-600 hover:bg-moss-700",
                isDemoActive && "cursor-not-allowed"
              )}
            >
              {stage === "recording" && <span className="absolute inset-0 rounded-full bg-rose-500 animate-pulse-ring" />}
              {stage === "recording" ? <Square size={26} className="text-white relative" fill="white" /> : <Mic size={30} className="text-white relative" />}
            </button>
            <div className="mt-4 text-sm font-semibold text-ink-800">
              {stage === "idle" && "Tap to start recording"}
              {stage === "recording" && "Listening..."}
              {stage === "transcribing" && "Transcribing..."}
              {stage === "structuring" && "Structuring into records..."}
              {stage === "done" && "Tap to try a live capture"}
            </div>
            {stage === "recording" && (
              <div className="mt-3 flex items-center justify-center gap-1 h-6">
                {Array.from({ length: 18 }).map((_, i) => (
                  <span
                    key={i}
                    className="w-1 rounded-full bg-rose-400 animate-wave-bar"
                    style={{ height: `${8 + (i % 5) * 4}px`, animationDelay: `${i * 0.06}s` }}
                  />
                ))}
              </div>
            )}
            {(stage === "transcribing" || stage === "structuring") && (
              <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-ink-400">
                <Loader2 size={13} className="animate-spin" />
                {stage === "transcribing" ? "Converting speech to text" : "Routing to documentation & safety modules"}
              </div>
            )}
            <p className="text-xs text-ink-400 mt-4 leading-relaxed">
              Worn device auto-detects support-related speech during shifts &mdash; no manual start needed. Demo playback shown here.
            </p>
          </Card>

          <Card padded={false}>
            <div className="px-4 pt-4 pb-2 text-xs font-semibold uppercase tracking-wide text-ink-400">Recent captures</div>
            <div className="divide-y divide-ink-100 max-h-[480px] overflow-y-auto scrollbar-thin">
              {voiceCaptures.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    if (isDemoActive) return;
                    setSelectedId(c.id);
                    setTab("documentation");
                  }}
                  className={clsx(
                    "w-full text-left px-4 py-3 hover:bg-ink-50 transition-colors",
                    !isDemoActive && selectedId === c.id && "bg-moss-50"
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <Avatar initials={c.staffName.split(" ").map((n) => n[0]).join("")} size={28} tone="moss" />
                    <div className="min-w-0 flex-1">
                      <div className="text-[13px] font-semibold text-ink-800 truncate">{c.staffName}</div>
                      <div className="text-xs text-ink-400">
                        {individualById(c.individualId)?.name} &middot; {c.timestamp}
                      </div>
                    </div>
                    <Badge tone="ink" className="shrink-0">{c.outputs.length} records</Badge>
                  </div>
                </button>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-5 min-w-0">
          <Card>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <Avatar initials={activeCapture.staffName.split(" ").map((n) => n[0]).join("")} size={32} tone="moss" />
                <div>
                  <div className="text-sm font-semibold text-ink-800">{activeCapture.staffName}</div>
                  <div className="text-xs text-ink-400">
                    re: {individualById(activeCapture.individualId)?.name} &middot; {activeCapture.timestamp} &middot; {activeCapture.durationSec}s
                  </div>
                </div>
              </div>
              {isDemoActive && (
                <Badge tone="rose">
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" /> live
                </Badge>
              )}
            </div>
            <div className="rounded-xl bg-ink-50 p-4 text-[14px] leading-relaxed text-ink-700 min-h-[64px]">
              {activeTranscript || <span className="text-ink-300">Transcript will appear here...</span>}
              {stage === "transcribing" && <span className="inline-block w-0.5 h-4 bg-ink-400 ml-0.5 align-middle animate-pulse" />}
            </div>
          </Card>

          <Card padded={false}>
            <div className="flex items-center border-b border-ink-100">
              <TabButton active={tab === "documentation"} onClick={() => setTab("documentation")} icon={FileText} label="Documentation" count={docOutputs.length} />
              <TabButton active={tab === "safety"} onClick={() => setTab("safety")} icon={ShieldAlert} label="Safety & Incidents" count={safetyOutputs.length} tone="rose" />
            </div>
            <div className="p-4 space-y-3">
              {(tab === "documentation" ? docOutputs : safetyOutputs).length === 0 && (
                <div className="text-sm text-ink-400 py-8 text-center flex flex-col items-center gap-2">
                  <Sparkles size={20} className="text-ink-300" />
                  {stage === "structuring" ? "Structuring records..." : "No records in this category for this capture."}
                </div>
              )}
              {(tab === "documentation" ? docOutputs : safetyOutputs).map((o, idx) => {
                const Icon = categoryIcon[o.category] ?? FileText;
                return (
                  <div key={idx} className="rounded-xl border border-ink-100 p-4 animate-fade-in-up">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <div className={clsx("flex h-7 w-7 items-center justify-center rounded-lg", o.group === "safety" ? "bg-rose-100 text-rose-600" : "bg-moss-100 text-moss-700")}>
                          <Icon size={14} />
                        </div>
                        <div>
                          <Badge tone={o.group === "safety" ? "rose" : "moss"}>{o.category}</Badge>
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1 text-xs text-ink-400 shrink-0">
                        <Check size={12} /> drafted
                      </span>
                    </div>
                    <div className="text-[13.5px] font-semibold text-ink-800 mb-1">{o.title}</div>
                    <p className="text-[13.5px] text-ink-600 leading-relaxed">{o.body}</p>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon: Icon,
  label,
  count,
  tone = "moss",
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof FileText;
  label: string;
  count: number;
  tone?: "moss" | "rose";
}) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "flex items-center gap-2 px-5 py-3.5 text-[13.5px] font-semibold border-b-2 -mb-px transition-colors",
        active ? (tone === "rose" ? "border-rose-500 text-rose-600" : "border-moss-600 text-moss-700") : "border-transparent text-ink-400 hover:text-ink-600"
      )}
    >
      <Icon size={15} />
      {label}
      <span className={clsx("rounded-full px-1.5 py-0.5 text-[11px]", active ? (tone === "rose" ? "bg-rose-100" : "bg-moss-100") : "bg-ink-100")}>{count}</span>
    </button>
  );
}
