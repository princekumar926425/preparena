import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, Filter, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import { problems, dsaTopics, type Difficulty } from "@/data/problems";

const difficultyClass: Record<Difficulty, string> = {
  Easy: "bg-easy/15 text-easy border-easy/30",
  Medium: "bg-medium/15 text-medium border-medium/30",
  Hard: "bg-hard/15 text-hard border-hard/30",
};

const DSASheet = () => {
  const [search, setSearch] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);

  const filtered = useMemo(() => {
    return problems.filter((p) => {
      if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false;
      if (selectedTopic && p.topic !== selectedTopic) return false;
      if (selectedDifficulty && p.difficulty !== selectedDifficulty) return false;
      return true;
    });
  }, [search, selectedTopic, selectedDifficulty]);

  const topicCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    problems.forEach((p) => { counts[p.topic] = (counts[p.topic] || 0) + 1; });
    return counts;
  }, []);

  return (
    <div className="min-h-screen grid-bg">
      <Navbar />
      <main className="container pt-24 pb-16">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">DSA <span className="text-primary">Sheet</span></h1>
          <p className="text-muted-foreground">Curated problems to crack any coding interview</p>
        </div>

        {/* Search & Filters */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search problems..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-card border-border"
            />
          </div>
          <div className="flex gap-2">
            {(["Easy", "Medium", "Hard"] as Difficulty[]).map((d) => (
              <button
                key={d}
                onClick={() => setSelectedDifficulty(selectedDifficulty === d ? null : d)}
                className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                  selectedDifficulty === d ? difficultyClass[d] : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Topic pills */}
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedTopic(null)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
              !selectedTopic ? "bg-primary/15 text-primary border border-primary/30" : "border border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            All ({problems.length})
          </button>
          {dsaTopics.filter((t) => topicCounts[t]).map((topic) => (
            <button
              key={topic}
              onClick={() => setSelectedTopic(selectedTopic === topic ? null : topic)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                selectedTopic === topic ? "bg-primary/15 text-primary border border-primary/30" : "border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {topic} ({topicCounts[topic]})
            </button>
          ))}
        </div>

        {/* Problem List */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="grid grid-cols-[1fr_100px_1fr] gap-4 border-b border-border px-6 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <span>Problem</span>
            <span>Difficulty</span>
            <span>Tags</span>
          </div>
          {filtered.map((problem, i) => (
            <Link
              key={problem.id}
              to={`/problem/${problem.id}`}
              className={`grid grid-cols-[1fr_100px_1fr] gap-4 items-center px-6 py-4 transition-all hover:bg-secondary/50 ${
                i !== filtered.length - 1 ? "border-b border-border" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-muted-foreground w-6">{i + 1}.</span>
                <span className="font-medium">{problem.title}</span>
              </div>
              <span className={`inline-flex w-fit rounded-md border px-2 py-0.5 text-xs font-medium ${difficultyClass[problem.difficulty]}`}>
                {problem.difficulty}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {problem.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs bg-secondary text-secondary-foreground border-0">
                    {tag}
                  </Badge>
                ))}
              </div>
            </Link>
          ))}
          {filtered.length === 0 && (
            <div className="px-6 py-12 text-center text-muted-foreground">
              No problems found matching your filters.
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DSASheet;