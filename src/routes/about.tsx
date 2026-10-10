import { createFileRoute } from "@tanstack/react-router";
import { AlertCircle, Lightbulb, HeartHandshake, ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [
    { title: "About FinGuide AI — Problem, Solution & Impact" },
    { name: "description", content: "Why FinGuide AI exists: helping every student discover opportunities that fit them." },
    { property: "og:title", content: "About FinGuide AI" },
    { property: "og:description", content: "Helping every student discover opportunities that fit them." },
  ] }),
  component: About,
});

const BLOCKS = [
  { icon: AlertCircle, title: "The problem", text: "Opportunities are scattered across many sites. Students — especially first-generation and rural learners — miss deadlines or never hear about programs that fit them." },
  { icon: Lightbulb, title: "Our solution", text: "FinGuide AI builds a profile of your skills, interests, level and goals, then scores every opportunity by skill overlap, interest alignment and difficulty fit — and explains why in plain language." },
  { icon: HeartHandshake, title: "The impact", text: "Less time searching, more time applying. Transparent matching builds confidence, and in-app deadline reminders plus a tracker turn discovery into action." },
  { icon: ShieldCheck, title: "Privacy & honesty", text: "Your profile stays in your browser's local storage. All listings in this demo are clearly labelled sample data — no fabricated real-world opportunities." },
];

function About() {
  return (
    <AppShell>
      <section className="rounded-2xl bg-hero p-6 md:p-8 text-primary-foreground">
        <p className="text-sm opacity-80">HackNowa Global Hackathon 2026 · AI for Everyday Life</p>
        <h1 className="mt-1 text-2xl md:text-3xl font-bold">Every student deserves to find their next opportunity.</h1>
      </section>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {BLOCKS.map(({ icon: Icon, title, text }) => (
          <article key={title} className="rounded-xl border bg-card p-5 shadow-card">
            <Icon className="h-6 w-6 text-accent" aria-hidden />
            <h2 className="mt-3 text-lg font-semibold">{title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{text}</p>
          </article>
        ))}
      </div>
      <section className="mt-5 rounded-xl border bg-card p-5 shadow-card">
        <h2 className="text-lg font-semibold">How the match score works</h2>
        <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
          <li>• 55% — share of required skills you already have</li>
          <li>• 30% — overlap with your interests and career goals</li>
          <li>• 15% — fit between the opportunity level and your experience</li>
        </ul>
      </section>
    </AppShell>
  );
}
