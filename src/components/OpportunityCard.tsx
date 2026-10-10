import { useState } from "react";
import { Bookmark, BookmarkCheck, CalendarClock, ChevronDown, Code2, Briefcase, Trophy, GraduationCap, Sparkles } from "lucide-react";
import { deadlineDate, type Opportunity } from "@/lib/data";
import type { Match } from "@/lib/store";

const ICONS = { hackathon: Code2, internship: Briefcase, competition: Trophy, course: GraduationCap };

export function OpportunityCard({ o, match, saved, onToggle }: { o: Opportunity; match: Match; saved: boolean; onToggle: () => void }) {
  const [open, setOpen] = useState(false);
  const Icon = ICONS[o.category];
  const tone = match.score >= 70 ? "bg-accent text-accent-foreground" : match.score >= 40 ? "bg-teal-soft text-primary" : "bg-muted text-muted-foreground";
  return (
    <article className="rounded-xl border bg-card p-4 shadow-card flex flex-col">
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-secondary text-primary"><Icon className="h-5 w-5" aria-hidden /></span>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold leading-tight">{o.title}</h3>
          <p className="text-xs text-muted-foreground">{o.organizer} · {o.mode} · {o.level}</p>
        </div>
        <div className={`rounded-full px-2.5 py-1 text-xs font-bold ${tone}`} aria-label={`Match score ${match.score} percent`}>{match.score}%</div>
      </div>
      <p className="mt-3 text-sm text-muted-foreground">{o.description}</p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {o.skills.map((s) => (
          <span key={s} className={`rounded-md px-2 py-0.5 text-xs ${match.matchedSkills.includes(s) ? "bg-teal-soft text-primary font-medium" : "bg-muted text-muted-foreground"}`}>{s}</span>
        ))}
      </div>
      <button onClick={() => setOpen(!open)} aria-expanded={open} className="mt-3 flex items-center gap-1 text-sm font-medium text-accent">
        <Sparkles className="h-4 w-4" /> Why this matches you <ChevronDown className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <ul className="mt-2 space-y-1 rounded-lg bg-secondary p-3 text-sm">
          {match.reasons.map((r) => <li key={r}>• {r}</li>)}
        </ul>
      )}
      <div className="mt-auto pt-4 flex items-center justify-between">
        <span className={`flex items-center gap-1 text-xs font-medium ${o.daysUntilDeadline <= 7 ? "text-destructive" : "text-muted-foreground"}`}>
          <CalendarClock className="h-4 w-4" /> Due {deadlineDate(o.daysUntilDeadline)} ({o.daysUntilDeadline}d)
        </span>
        <button onClick={onToggle} aria-pressed={saved}
          className={`flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium ${saved ? "bg-primary text-primary-foreground" : "border text-primary hover:bg-secondary"}`}>
          {saved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />} {saved ? "Saved" : "Save"}
        </button>
      </div>
    </article>
  );
}

export function SampleBadge() {
  return <span className="inline-block rounded-full bg-warning-soft px-2.5 py-1 text-xs font-semibold text-foreground">Sample data · not real listings</span>;
}
