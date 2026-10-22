import Navbar from "@/components/Navbar";
import { Link } from "react-router-dom";

const cards = [
  { title: "DSA Sheet", desc: "Track your preparation", path: "/dsa" },
  { title: "Subjects", desc: "Reading notes and lectures", path: "/subjects" },
  { title: "Contests", desc: "Join live competitions", path: "/contests" },
  { title: "Aptitude", desc: "Timed practice tests", path: "/aptitude" }
];

export default function Dashboard() {
  return (
    <div className="min-h-screen grid-bg">
      <Navbar />
      <main className="container py-24">
        <h1 className="text-3xl font-bold">Student Dashboard</h1>
        <p className="mt-2 text-muted-foreground">A complete overview of your learning journey.</p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {cards.map((card) => (
            <Link key={card.title} to={card.path} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h2 className="text-xl font-semibold">{card.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{card.desc}</p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
