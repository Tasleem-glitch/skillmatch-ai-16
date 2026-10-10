import { createFileRoute, Link } from "@tanstack/react-router";
import { Trash2, CalendarClock } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { SampleBadge } from "@/components/OpportunityCard";
import { OPPORTUNITIES, deadlineDate } from "@/lib/data";
import { useTracker, type Status } from "@/lib/store";

export const Route = createFileRoute("/tracker")({
  head: () => ({ meta: [
    { title: "Application Tracker — FinGuide AI" },
    { name: "description", content: "Track saved, planned and applied opportunities with deadline reminders." },
    { property: "og:title", content: "Application Tracker — FinGuide AI" },
    { property: "og:description", content: "Track saved, planned and applied opportunities." },
  ] }),
  component: Tracker,
});

const COLS: { s: Status; label: string }[] = [{ s: "saved", label: "Saved" }, { s: "planned", label: "Planned" }, { s: "applied", label: "Applied" }];

function Tracker() {
  const { tracker, setStatus, toggleSave } = useTracker();
  const items = OPPORTUNITIES.filter((o) => tracker[o.id]);
  return (
    <AppShell>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-bold">Application tracker</h1>
        <SampleBadge />
      </div>
      {items.length === 0 ? (
        <div className="mt-8 rounded-xl border bg-card p-8 text-center shadow-card">
          <p className="text-muted-foreground">Nothing tracked yet.</p>
          <Link to="/opportunities" className="mt-3 inline-block rounded-lg bg-accent px-4 py-2 font-semibold text-accent-foreground">Find opportunities</Link>
        </div>
      ) : (
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {COLS.map(({ s, label }) => {
            const col = items.filter((o) => tracker[o.id] === s).sort((a, b) => a.daysUntilDeadline - b.daysUntilDeadline);
            return (
              <section key={s} className="rounded-xl bg-secondary p-3">
                <h2 className="px-1 pb-2 text-sm font-semibold">{label} · {col.length}</h2>
                <div className="space-y-2">
                  {col.map((o) => (
                    <div key={o.id} className="rounded-lg border bg-card p-3 shadow-card">
                      <p className="text-sm font-medium">{o.title}</p>
                      <p className={`mt-1 flex items-center gap-1 text-xs ${o.daysUntilDeadline <= 7 && s !== "applied" ? "text-destructive font-medium" : "text-muted-foreground"}`}>
                        <CalendarClock className="h-3.5 w-3.5" /> Due {deadlineDate(o.daysUntilDeadline)} · {o.daysUntilDeadline}d left
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <label className="sr-only" htmlFor={`st-${o.id}`}>Status</label>
                        <select id={`st-${o.id}`} value={s} onChange={(e) => setStatus(o.id, e.target.value as Status)} className="flex-1 rounded-md border bg-card px-2 py-1.5 text-sm">
                          {COLS.map((c) => <option key={c.s} value={c.s}>{c.label}</option>)}
                        </select>
                        <button onClick={() => toggleSave(o.id)} aria-label={`Remove ${o.title}`} className="rounded-md border p-2 text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </div>
                  ))}
                  {col.length === 0 && <p className="px-1 text-xs text-muted-foreground">Empty</p>}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </AppShell>
  );
}
