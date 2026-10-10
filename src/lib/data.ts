export type Category = "hackathon" | "internship" | "competition" | "course";

export interface Opportunity {
  id: string;
  title: string;
  organizer: string;
  category: Category;
  mode: "Online" | "In-person" | "Hybrid";
  level: "Beginner" | "Intermediate" | "Advanced";
  skills: string[];
  interests: string[];
  description: string;
  daysUntilDeadline: number;
}

export const CATEGORIES: { value: Category; label: string }[] = [
  { value: "hackathon", label: "Hackathons" },
  { value: "internship", label: "Internships" },
  { value: "competition", label: "Competitions" },
  { value: "course", label: "Courses" },
];

// SAMPLE DATA — fictional opportunities for demonstration only. Not real or verified listings.
export const OPPORTUNITIES: Opportunity[] = [
  { id: "h1", title: "GreenCode Climate Hack (Sample)", organizer: "Demo Org A", category: "hackathon", mode: "Online", level: "Beginner", skills: ["python", "data analysis", "react"], interests: ["climate", "sustainability", "ai"], description: "48-hour sprint building tools that help households cut energy use.", daysUntilDeadline: 3 },
  { id: "h2", title: "HealthBridge AI Challenge (Sample)", organizer: "Demo Org B", category: "hackathon", mode: "Hybrid", level: "Intermediate", skills: ["machine learning", "python", "ui design"], interests: ["healthcare", "ai"], description: "Prototype AI assistants for rural clinics with low connectivity.", daysUntilDeadline: 9 },
  { id: "h3", title: "FinLit Buildathon (Sample)", organizer: "Demo Org C", category: "hackathon", mode: "Online", level: "Beginner", skills: ["javascript", "react", "ui design"], interests: ["finance", "education"], description: "Create apps that teach young people budgeting and saving.", daysUntilDeadline: 15 },
  { id: "i1", title: "Junior Frontend Intern (Sample)", organizer: "Demo Startup D", category: "internship", mode: "Online", level: "Beginner", skills: ["javascript", "react", "html", "css"], interests: ["web development", "education"], description: "Remote 8-week internship building accessible learning interfaces.", daysUntilDeadline: 6 },
  { id: "i2", title: "Data Analyst Intern (Sample)", organizer: "Demo Company E", category: "internship", mode: "In-person", level: "Intermediate", skills: ["sql", "python", "data analysis", "excel"], interests: ["finance", "business"], description: "Analyse customer trends and build weekly dashboards.", daysUntilDeadline: 12 },
  { id: "i3", title: "ML Research Intern (Sample)", organizer: "Demo Lab F", category: "internship", mode: "Hybrid", level: "Advanced", skills: ["machine learning", "python", "statistics"], interests: ["ai", "research"], description: "Support research on fair and explainable ML models.", daysUntilDeadline: 21 },
  { id: "i4", title: "UX Design Intern (Sample)", organizer: "Demo Studio G", category: "internship", mode: "Online", level: "Beginner", skills: ["ui design", "figma", "user research"], interests: ["design", "accessibility"], description: "Design inclusive mobile experiences with a senior mentor.", daysUntilDeadline: 2 },
  { id: "c1", title: "Social Impact Pitch Cup (Sample)", organizer: "Demo Foundation H", category: "competition", mode: "Online", level: "Beginner", skills: ["public speaking", "business", "writing"], interests: ["entrepreneurship", "social impact"], description: "Pitch a startup idea that solves a local community problem.", daysUntilDeadline: 5 },
  { id: "c2", title: "Algorithms Olympiad (Sample)", organizer: "Demo Society I", category: "competition", mode: "Online", level: "Advanced", skills: ["c++", "algorithms", "python"], interests: ["competitive programming"], description: "Timed problem-solving rounds for strong coders.", daysUntilDeadline: 18 },
  { id: "c3", title: "Data Storytelling Contest (Sample)", organizer: "Demo Institute J", category: "competition", mode: "Online", level: "Intermediate", skills: ["data analysis", "writing", "excel"], interests: ["research", "climate"], description: "Turn an open dataset into a compelling visual story.", daysUntilDeadline: 10 },
  { id: "k1", title: "Intro to Python (Sample)", organizer: "Demo Academy K", category: "course", mode: "Online", level: "Beginner", skills: ["python"], interests: ["ai", "data science"], description: "Self-paced fundamentals course with weekly projects.", daysUntilDeadline: 30 },
  { id: "k2", title: "Responsible AI Basics (Sample)", organizer: "Demo University L", category: "course", mode: "Online", level: "Beginner", skills: ["machine learning"], interests: ["ai", "ethics", "social impact"], description: "Learn bias, fairness and safety in everyday AI systems.", daysUntilDeadline: 14 },
  { id: "k3", title: "Modern React Bootcamp (Sample)", organizer: "Demo School M", category: "course", mode: "Online", level: "Intermediate", skills: ["react", "javascript"], interests: ["web development"], description: "Build and deploy three production-style React apps.", daysUntilDeadline: 25 },
];

export function deadlineDate(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toLocaleDateString(undefined, { day: "numeric", month: "short" });
}
