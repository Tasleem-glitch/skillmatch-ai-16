import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { OpportunityCard, SampleBadge } from "@/components/OpportunityCard";
import { CATEGORIES, OPPORTUNITIES, type Category } from "@/lib/data";
import { matchOpportunity, useProfile, useTracker } from "@/lib/store";

export const Route = createFileRoute("/opportunities")({
  head: () => ({ meta: [
    { title: "Explore Opportunities — FinGuide AI" },
    { name: "description", content: "Search and filter hackathons, internships, competitions and courses ranked by your match score." },
    { property: "og:title", content: "Explore Opportunities — FinGuide AI" },
    { property: "og:description", content: "Search and filter opportunities ranked by your match score." },
  ] }),
  component: Explore,
});

function Explore() {
  const [profile] = useProfile();
  const { tracker, toggleSave } = useTracker();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<Category | "all">("all");
  const [sort, setSort] = useState<"match" | "deadline">("match");
  const ql = q.toLowerCase();
  const list = OPPORTUNITIES
    .filter((o) => cat === "all" || o.category === cat)
    .filter((o) => !ql || [o.title, o.description, o.organizer, ...o.skills, ...o.interests].join(" ").toLowerCase().includes(ql))
    .map((o) => ({ o, m: matchOpportunity(o, profile) }))
    .sort((a, b) => sort === "match" ? b.m.score - a.m.score : a.o.daysUntilDeadline - b.o.daysUntilDeadline);

  return (
    <AppShell>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-bold">Explore opportunities</h1>
        <SampleBadge />
      </div>
      <label className="relative mt-4 block">
        <span className="sr-only">Search opportunities</span>
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by title, skill or interest…"
          className="w-full rounded-xl border bg-card py-3 pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
      </label>
      <div className="mt-3 flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Category filter">
        {[{ value: "all" as const, label: "All" }, ...CATEGORIES].map((c) => (
          <button key={c.value} onClick={() => setCat(c.value)} aria-pressed={cat === c.value}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium ${cat === c.value ? "bg-primary text-primary-foreground" : "border bg-card text-foreground"}`}>
            {c.label}
          </button>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{list.length} results</span>
        <label className="flex items-center gap-2">Sort
          <select value={sort} onChange={(e) => setSort(e.target.value as "match" | "deadline")} className="rounded-lg border bg-card px-2 py-1.5">
            <option value="match">Best match</option><option value="deadline">Deadline soonest</option>
          </select>
        </label>
      </div>
      {list.length === 0 ? <p className="mt-10 text-center text-muted-foreground">No opportunities match your search.</p> : (
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {list.map(({ o, m }) => <OpportunityCard key={o.id} o={o} match={m} saved={!!tracker[o.id]} onToggle={() => toggleSave(o.id)} />)}
        </div>
      )}
    </AppShell>
  );
}
