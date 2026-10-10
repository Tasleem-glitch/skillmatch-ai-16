import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { X, Check } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { EMPTY_PROFILE, useProfile, type Profile } from "@/lib/store";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [
    { title: "Your Profile — FinGuide AI" },
    { name: "description", content: "Add your skills, interests, education and goals for personalized opportunity matches." },
    { property: "og:title", content: "Your Profile — FinGuide AI" },
    { property: "og:description", content: "Personalize your opportunity matches." },
  ] }),
  component: ProfilePage,
});

const SKILLS = ["python", "javascript", "react", "html", "css", "sql", "excel", "data analysis", "machine learning", "statistics", "ui design", "figma", "user research", "c++", "algorithms", "writing", "public speaking", "business"];
const INTERESTS = ["ai", "climate", "sustainability", "healthcare", "finance", "education", "web development", "design", "accessibility", "research", "entrepreneurship", "social impact", "competitive programming", "data science", "ethics", "business"];

function ProfilePage() {
  const [stored, save, ready] = useProfile();
  const [p, setP] = useState<Profile>(EMPTY_PROFILE);
  const [saved, setSaved] = useState(false);
  const nav = useNavigate();
  useEffect(() => { if (ready) setP(stored); }, [ready]); // eslint-disable-line react-hooks/exhaustive-deps

  const submit = (e: React.FormEvent) => { e.preventDefault(); save(p); setSaved(true); setTimeout(() => nav({ to: "/opportunities" }), 700); };

  return (
    <AppShell>
      <h1 className="text-2xl font-bold">Your profile</h1>
      <p className="text-sm text-muted-foreground">Saved privately in this browser only.</p>
      <form onSubmit={submit} className="mt-5 space-y-5 rounded-xl border bg-card p-5 shadow-card">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Name"><input required value={p.name} onChange={(e) => setP({ ...p, name: e.target.value })} className="inp" placeholder="e.g. Aisha" /></Field>
          <Field label="Education"><input value={p.education} onChange={(e) => setP({ ...p, education: e.target.value })} className="inp" placeholder="e.g. 2nd year B.Tech CSE" /></Field>
        </div>
        <Field label="Experience level">
          <div className="flex gap-2">
            {(["Beginner", "Intermediate", "Advanced"] as const).map((l) => (
              <button type="button" key={l} onClick={() => setP({ ...p, level: l })} aria-pressed={p.level === l}
                className={`flex-1 rounded-lg py-2 text-sm font-medium ${p.level === l ? "bg-primary text-primary-foreground" : "border"}`}>{l}</button>
            ))}
          </div>
        </Field>
        <TagPicker label="Skills" options={SKILLS} value={p.skills} onChange={(skills) => setP({ ...p, skills })} />
        <TagPicker label="Interests" options={INTERESTS} value={p.interests} onChange={(interests) => setP({ ...p, interests })} />
        <Field label="Career goals"><textarea rows={3} value={p.goals} onChange={(e) => setP({ ...p, goals: e.target.value })} className="inp" placeholder="e.g. Become an AI engineer working on healthcare" /></Field>
        <button className="w-full md:w-auto rounded-lg bg-accent px-6 py-3 font-semibold text-accent-foreground flex items-center justify-center gap-2">
          {saved ? <><Check className="h-4 w-4" /> Saved! Finding matches…</> : "Save & find matches"}
        </button>
      </form>
    </AppShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-1.5 block text-sm font-medium">{label}</span>{children}</label>;
}

function TagPicker({ label, options, value, onChange }: { label: string; options: string[]; value: string[]; onChange: (v: string[]) => void }) {
  const [custom, setCustom] = useState("");
  const toggle = (t: string) => onChange(value.includes(t) ? value.filter((x) => x !== t) : [...value, t]);
  const all = Array.from(new Set([...options, ...value]));
  return (
    <fieldset>
      <legend className="mb-1.5 text-sm font-medium">{label} <span className="text-muted-foreground">({value.length} selected)</span></legend>
      <div className="flex flex-wrap gap-2">
        {all.map((t) => (
          <button type="button" key={t} onClick={() => toggle(t)} aria-pressed={value.includes(t)}
            className={`rounded-full px-3 py-1.5 text-sm ${value.includes(t) ? "bg-accent text-accent-foreground font-medium" : "bg-muted text-foreground"}`}>
            {t}{value.includes(t) && <X className="ml-1 inline h-3 w-3" />}
          </button>
        ))}
      </div>
      <div className="mt-2 flex gap-2">
        <input value={custom} onChange={(e) => setCustom(e.target.value)} placeholder={`Add another ${label.toLowerCase().slice(0, -1)}`} className="inp"
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }} />
        <button type="button" onClick={add} className="rounded-lg border px-4 text-sm font-medium">Add</button>
      </div>
    </fieldset>
  );
  function add() { const t = custom.trim().toLowerCase(); if (t && !value.includes(t)) onChange([...value, t]); setCustom(""); }
}
