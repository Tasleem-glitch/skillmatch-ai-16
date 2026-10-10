import { useEffect, useState, useCallback } from "react";
import type { Opportunity } from "./data";

export interface Profile {
  name: string;
  education: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  skills: string[];
  interests: string[];
  goals: string;
}
export type Status = "saved" | "planned" | "applied";

export const EMPTY_PROFILE: Profile = { name: "", education: "", level: "Beginner", skills: [], interests: [], goals: "" };

const PK = "finguide.profile";
const SK = "finguide.tracker";

function read<T>(k: string, fb: T): T {
  try { const v = localStorage.getItem(k); return v ? (JSON.parse(v) as T) : fb; } catch { return fb; }
}
function emit() { window.dispatchEvent(new Event("finguide-store")); }

function useStored<T>(key: string, fallback: T) {
  const [val, setVal] = useState<T>(fallback);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const sync = () => setVal(read(key, fallback));
    sync(); setReady(true);
    window.addEventListener("finguide-store", sync);
    window.addEventListener("storage", sync);
    return () => { window.removeEventListener("finguide-store", sync); window.removeEventListener("storage", sync); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  const save = useCallback((v: T) => { localStorage.setItem(key, JSON.stringify(v)); emit(); }, [key]);
  return [val, save, ready] as const;
}

export function useProfile() { return useStored<Profile>(PK, EMPTY_PROFILE); }

export function useTracker() {
  const [tracker, save, ready] = useStored<Record<string, Status>>(SK, {});
  const toggleSave = (id: string) => {
    const n = { ...tracker };
    if (n[id]) delete n[id]; else n[id] = "saved";
    save(n);
  };
  const setStatus = (id: string, s: Status) => save({ ...tracker, [id]: s });
  return { tracker, toggleSave, setStatus, ready };
}

const norm = (s: string) => s.trim().toLowerCase();

export interface Match { score: number; reasons: string[]; matchedSkills: string[]; matchedInterests: string[] }

export function matchOpportunity(o: Opportunity, p: Profile): Match {
  const ps = p.skills.map(norm), pi = p.interests.map(norm);
  const goals = norm(p.goals);
  const matchedSkills = o.skills.filter((s) => ps.includes(s));
  const matchedInterests = o.interests.filter((i) => pi.includes(i) || (goals && goals.includes(i)));
  const skillPart = o.skills.length ? matchedSkills.length / o.skills.length : 0;
  const intPart = o.interests.length ? matchedInterests.length / o.interests.length : 0;
  const order = ["Beginner", "Intermediate", "Advanced"];
  const gap = order.indexOf(o.level) - order.indexOf(p.level);
  const levelPart = gap <= 0 ? 1 : gap === 1 ? 0.5 : 0;
  const score = Math.round(skillPart * 55 + intPart * 30 + levelPart * 15);
  const reasons: string[] = [];
  if (matchedSkills.length) reasons.push(`You already have ${matchedSkills.length} of ${o.skills.length} required skills: ${matchedSkills.join(", ")}.`);
  else reasons.push(`Builds new skills for you: ${o.skills.slice(0, 3).join(", ")}.`);
  if (matchedInterests.length) reasons.push(`Aligns with your interests in ${matchedInterests.join(", ")}.`);
  if (gap <= 0) reasons.push(`Level (${o.level}) fits your experience.`);
  else reasons.push(`A stretch: it's ${o.level} and you're ${p.level}.`);
  if (o.daysUntilDeadline <= 7) reasons.push(`Deadline is soon — apply within ${o.daysUntilDeadline} days.`);
  return { score, reasons, matchedSkills, matchedInterests };
}
