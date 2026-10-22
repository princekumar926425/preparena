import { Link } from "react-router-dom";
import { Code2, Cpu, Globe, Box, Database, Brain } from "lucide-react";

const subjects = [
  {
    title: "DSA",
    desc: "Data Structures & Algorithms — the core of placements",
    icon: Code2,
    slug: "",
    path: "/dsa",
    count: "300+ Problems",
    color: "text-primary",
  },
  {
    title: "Operating System",
    desc: "Process management, memory, scheduling & more",
    icon: Cpu,
    slug: "os",
    path: "/subjects",
    count: "120+ Questions",
    color: "text-accent",
  },
  {
    title: "Computer Networks",
    desc: "OSI, TCP/IP, HTTP, DNS & networking fundamentals",
    icon: Globe,
    slug: "cn",
    path: "/subjects",
    count: "100+ Questions",
    color: "text-easy",
  },
  {
    title: "OOPs",
    desc: "Inheritance, polymorphism, abstraction & design patterns",
    icon: Box,
    slug: "oops",
    path: "/subjects",
    count: "80+ Questions",
    color: "text-medium",
  },
  {
    title: "DBMS",
    desc: "SQL, normalization, transactions & indexing",
    icon: Database,
    slug: "dbms",
    path: "/subjects",
    count: "90+ Questions",
    color: "text-hard",
  },
  {
    title: "Aptitude",
    desc: "Quantitative Aptitude, Logical Reasoning & Verbal Ability",
    icon: Brain,
    slug: "",
    path: "/aptitude",
    count: "300+ Questions",
    color: "text-purple-400",
  },
];

const SubjectCards = () => {
  return (
    <section className="container py-24">
      <h2 className="mb-2 text-center text-3xl font-bold">
        Structured <span className="text-primary">Learning Paths</span>
      </h2>

      <p className="mb-12 text-center text-muted-foreground">
        Everything you need to ace your placement interviews
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {subjects.map((s) => {
          const target =
            s.path === "/subjects" && s.slug
              ? `/lecture/${s.slug}`
              : s.path;

          return (
            <Link
              key={s.title}
              to={target}
              className="group rounded-xl border border-border bg-card p-6 transition-all hover:glow-border hover:bg-secondary/50 hover:scale-[1.02]"
            >
              <div
                className={`mb-4 inline-flex rounded-lg bg-secondary p-3 ${s.color}`}
              >
                <s.icon className="h-6 w-6" />
              </div>

              <h3 className="mb-1 text-lg font-semibold">{s.title}</h3>

              <p className="mb-3 text-sm text-muted-foreground">
                {s.desc}
              </p>

              <span className="text-xs font-mono text-muted-foreground">
                {s.count}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default SubjectCards;