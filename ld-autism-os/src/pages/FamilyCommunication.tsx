import { useState } from "react";
import { Sparkles, Send, CheckCircle2, MessageSquare, Mail, Smartphone, FileText } from "lucide-react";
import clsx from "clsx";
import { Card, Badge, SectionHeading, Avatar } from "../components/ui/Primitives";
import { supportThreads, supportDrafts, individualById, type SupportThread } from "../lib/mockData";

const channelIcon = { SMS: Smartphone, App: MessageSquare, Email: Mail, "Easy-read letter": FileText };
const statusTone: Record<SupportThread["status"], "amber" | "moss" | "ink"> = {
  "awaiting-reply": "amber",
  "draft-ready": "moss",
  sent: "ink",
};

export default function FamilyCommunication() {
  const [threads, setThreads] = useState(supportThreads);
  const [selectedId, setSelectedId] = useState(threads[0].id);
  const [drafts, setDrafts] = useState(supportDrafts);
  const selected = threads.find((t) => t.id === selectedId)!;
  const person = individualById(selected.individualId);

  function send(id: string) {
    setThreads((prev) => prev.map((t) => (t.id === id ? { ...t, status: "sent" } : t)));
  }

  function generateDraft(id: string) {
    setDrafts((prev) => ({
      ...prev,
      [id]:
        prev[id] ??
        "Thank you for reaching out — our care team is reviewing the latest notes and will follow up shortly with specifics.",
    }));
    setThreads((prev) => prev.map((t) => (t.id === id ? { ...t, status: "draft-ready" } : t)));
  }

  return (
    <div className="animate-fade-in-up">
      <SectionHeading
        eyebrow="Family & Communication"
        title="Keep the whole circle of support informed"
        description="Lumen drafts updates for family, social workers, GPs and advocates directly from care documentation — including easy-read versions written for the person themselves. Staff review and send in one tap."
      />

      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-5">
        <Card padded={false}>
          <div className="px-4 pt-4 pb-2 text-xs font-semibold uppercase tracking-wide text-ink-400">Conversations</div>
          <div className="divide-y divide-ink-100 max-h-[560px] overflow-y-auto scrollbar-thin">
            {threads.map((t) => {
              const p = individualById(t.individualId);
              const Icon = channelIcon[t.channel];
              return (
                <button
                  key={t.id}
                  onClick={() => setSelectedId(t.id)}
                  className={clsx("w-full text-left px-4 py-3.5 hover:bg-ink-50 transition-colors", selectedId === t.id && "bg-moss-50")}
                >
                  <div className="flex items-start gap-2.5">
                    <Avatar initials={p?.photoInitials ?? "??"} size={30} tone="ink" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <div className="text-[13px] font-semibold text-ink-800 truncate">{t.contact}</div>
                        <Icon size={12} className="text-ink-300 shrink-0" />
                      </div>
                      <div className="text-xs text-ink-500 truncate mt-0.5">{t.relation} of {p?.name}</div>
                      <div className="text-xs text-ink-400 truncate mt-0.5">{t.lastMessage}</div>
                      <div className="flex items-center justify-between mt-1.5">
                        <span className="text-[11px] text-ink-300">{t.timestamp}</span>
                        <Badge tone={statusTone[t.status]} className="capitalize">{t.status.replace("-", " ")}</Badge>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </Card>

        <div className="space-y-5 min-w-0">
          <Card>
            <div className="flex items-center gap-3 mb-1">
              <Avatar initials={person?.photoInitials ?? "??"} tone="ink" />
              <div>
                <div className="text-sm font-semibold text-ink-800">{selected.contact}</div>
                <div className="text-xs text-ink-400">
                  {selected.relation} of {person?.name} &middot; {person?.home} &middot; via {selected.channel}
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="text-xs font-semibold uppercase tracking-wide text-ink-400 mb-2">Incoming message</div>
            <div className="rounded-xl bg-ink-50 p-4 text-[14px] text-ink-700 leading-relaxed">{selected.lastMessage}</div>
          </Card>

          <Card>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-moss-600">
                <Sparkles size={13} /> AI-drafted response {selected.channel === "Easy-read letter" && "(easy-read)"}
              </div>
              {selected.status === "sent" && (
                <span className="flex items-center gap-1 text-xs font-medium text-moss-600">
                  <CheckCircle2 size={13} /> Sent
                </span>
              )}
            </div>

            {drafts[selected.id] ? (
              <>
                <textarea
                  className="w-full min-h-[140px] rounded-xl border border-ink-200 bg-white p-4 text-[14px] text-ink-700 leading-relaxed focus:outline-none focus:ring-2 focus:ring-moss-300 resize-none disabled:bg-ink-50 disabled:text-ink-500"
                  value={drafts[selected.id]}
                  disabled={selected.status === "sent"}
                  onChange={(e) => setDrafts((prev) => ({ ...prev, [selected.id]: e.target.value }))}
                />
                <p className="text-[11px] text-ink-400 mt-2 mb-4">
                  Drafted from today's ABC charts, therapy notes, and incident log for {person?.name}. Review before sending.
                </p>
                {selected.status !== "sent" && (
                  <button
                    onClick={() => send(selected.id)}
                    className="flex items-center gap-2 rounded-xl bg-moss-600 hover:bg-moss-700 text-white text-sm font-semibold px-4 py-2.5 transition-colors"
                  >
                    <Send size={15} /> Send response
                  </button>
                )}
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-sm text-ink-400 mb-3">No draft generated yet for this message.</p>
                <button
                  onClick={() => generateDraft(selected.id)}
                  className="inline-flex items-center gap-2 rounded-xl bg-ink-900 hover:bg-ink-800 text-white text-sm font-semibold px-4 py-2.5 transition-colors"
                >
                  <Sparkles size={15} /> Generate draft response
                </button>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
