import { createFileRoute, Link } from "@tanstack/react-router";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { BellRing, Bookmark, Send, Target, ArrowRight } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { OpportunityCard, SampleBadge } from "@/components/OpportunityCard";
import { CATEGORIES, OPPORTUNITIES, deadlineDate } from "@/lib/data";
import { matchOpportunity, useProfile, useTracker } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "FinGuide AI — Student Opportunity Dashboard" },
    { name: "description", content: "AI-matched hackathons, internships, competitions and courses for students." },
    { property: "og:title", content: "FinGuide AI — Student Opportunity Dashboard" },
    { property: "og:description", content: "AI-matched hackathons, internships, competitions and courses for students." },
  ] }),
  component: Dashboard,
});

function Dashboard() {
  const [profile] = useProfile();
  const { tracker, toggleSave } = useTracker();
  const scored = OPPORTUNITIES.map((o) => ({ o, m: matchOpportunity(o, profile) })).sort((a, b) => b.m.score - a.m.score);
  const hasProfile = profile.skills.length > 0;
  const counts = Object.values(tracker);
  const reminders = OPPORTUNITIES.filter((o) => tracker[o.id] && tracker[o.id] !== "applied").sort((a, b) => a.daysUntilDeadline - b.daysUntilDeadline);
  const chart = CATEGORIES.map((c) => ({ name: c.label, count: OPPORTUNITIES.filter((o) => o.category === c.value).length }));
  const strong = scored.filter((s) => s.m.score >= 60).length;

  return (
    <AppShell>
      <section className="rounded-2xl bg-hero p-6 md:p-8 text-primary-foreground">
        <p className="text-sm opacity-80">Welcome back</p>
        <h1 className="mt-1 text-2xl md:text-3xl font-bold">Hi {profile.name || "there"} 👋</h1>
        <p className="mt-2 max-w-xl text-sm md:text-base opacity-90">
          {hasProfile ? `We found ${strong} strong matches for your skills and goals.` : "Tell us about your skills and goals to get personalized matches."}
        </p>
        <Link to={hasProfile ? "/opportunities" : "/profile"} className="mt-4 inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground">
          {hasProfile ? "Explore matches" : "Build my profile"} <ArrowRight className="h-4 w-4" />
        </Link>
      </section>

      <div className="mt-5 grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Stat icon={Target} label="Strong matches" value={strong} />
        <Stat icon={Bookmark} label="Saved" value={counts.filter((s) => s === "saved").length} />
        <Stat icon={BellRing} label="Planned" value={counts.filter((s) => s === "planned").length} />
        <Stat icon={Send} label="Applied" value={counts.filter((s) => s === "applied").length} />
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        <section className="rounded-xl border bg-card p-4 shadow-card lg:col-span-2">
          <h2 className="font-semibold">Opportunities by category</h2>
          <div className="h-52 mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chart}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} width={24} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: "var(--muted)" }} />
                <Bar dataKey="count" fill="var(--accent)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
        <section className="rounded-xl border bg-card p-4 shadow-card" aria-live="polite">
          <h2 className="font-semibold flex items-center gap-2"><BellRing className="h-4 w-4 text-warning" /> Deadline reminders</h2>
          {reminders.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">Save opportunities to see deadline reminders here.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {reminders.slice(0, 5).map((o) => (
                <li key={o.id} className={`rounded-lg p-3 text-sm ${o.daysUntilDeadline <= 7 ? "bg-warning-soft" : "bg-secondary"}`}>
                  <p className="font-medium">{o.title}</p>
                  <p className="text-xs text-muted-foreground">Due {deadlineDate(o.daysUntilDeadline)} · {o.daysUntilDeadline} days left · {tracker[o.id]}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-semibold">Top picks for you</h2>
        <SampleBadge />
      </div>
      <div className="mt-3 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {scored.slice(0, 3).map(({ o, m }) => (
          <OpportunityCard key={o.id} o={o} match={m} saved={!!tracker[o.id]} onToggle={() => toggleSave(o.id)} />
        ))}
      </div>
    </AppShell>
  );
}

function Stat({ icon: Icon, label, value }: { icon: typeof Target; label: string; value: number }) {
  return (
    <div className="rounded-xl border bg-card p-4 shadow-card">
      <Icon className="h-5 w-5 text-accent" aria-hidden />
      <p className="mt-2 text-2xl font-bold font-display">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
