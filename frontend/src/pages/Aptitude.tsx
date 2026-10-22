import { useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import { aptitudeCategories, aptitudeQuestions, type AptitudeCategory } from "@/data/aptitude";

const historyKey = "aptitude-history";

type HistoryEntry = {
  score: number;
  total: number;
  category: AptitudeCategory;
  date: string;
};

export default function Aptitude() {
  const [selectedCategory, setSelectedCategory] = useState<AptitudeCategory>("Quantitative");
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>(() => {
    if (typeof window === "undefined") return [];
    return JSON.parse(localStorage.getItem(historyKey) || "[]") as HistoryEntry[];
  });

  const filteredQuestions = useMemo(() => aptitudeQuestions.filter((q) => q.category === selectedCategory), [selectedCategory]);

  const score = useMemo(() => {
    return filteredQuestions.reduce((total, q) => (answers[q.id] === q.answer ? total + 1 : total), 0);
  }, [answers, filteredQuestions]);

  const submitTest = () => {
    const entry = { score, total: filteredQuestions.length, category: selectedCategory, date: new Date().toLocaleString() };
    const nextHistory = [entry, ...history].slice(0, 5);
    setHistory(nextHistory);
    localStorage.setItem(historyKey, JSON.stringify(nextHistory));
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen grid-bg">
      <Navbar />
      <main className="container py-24">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Aptitude <span className="text-primary">Practice</span></h1>
            <p className="mt-2 text-muted-foreground">Timed sections, instant scoring and test history.</p>
          </div>
          <div className="rounded-xl border border-border bg-card px-4 py-3 text-sm">
            <p className="font-semibold">Category</p>
            <div className="mt-2 flex gap-2">
              {aptitudeCategories.map((cat) => (
                <button key={cat} onClick={() => { setSelectedCategory(cat); setSubmitted(false); }} className={`rounded-full px-3 py-1 text-xs ${selectedCategory === cat ? "bg-primary text-white" : "bg-secondary"}`}>
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            {filteredQuestions.map((q) => (
              <div key={q.id} className="rounded-2xl border border-border bg-card p-5">
                <p className="font-semibold">{q.prompt}</p>
                <div className="mt-3 grid gap-2">
                  {q.options.map((option) => (
                    <label key={option} className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm">
                      <input type="radio" name={`q-${q.id}`} checked={answers[q.id] === option} onChange={() => setAnswers((prev) => ({ ...prev, [q.id]: option }))} />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
            <button onClick={submitTest} className="rounded-lg bg-primary px-4 py-2 font-semibold text-white">Submit Test</button>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-border bg-card p-5">
              <h2 className="text-lg font-semibold">Instant Score</h2>
              <p className="mt-2 text-sm text-muted-foreground">Current score: {score}/{filteredQuestions.length}</p>
              {submitted && <p className="mt-3 rounded-lg bg-primary/10 p-3 text-sm text-primary">Completed! You scored {score} out of {filteredQuestions.length}.</p>}
            </div>
            <div className="rounded-2xl border border-border bg-card p-5">
              <h2 className="text-lg font-semibold">Previous Tests</h2>
              <div className="mt-3 space-y-2">
                {history.length === 0 ? <p className="text-sm text-muted-foreground">No attempts yet.</p> : history.map((entry, i) => (
                  <div key={`${entry.date}-${i}`} className="rounded-lg bg-secondary/50 p-3 text-sm">
                    <p className="font-medium">{entry.category}</p>
                    <p className="text-muted-foreground">{entry.score}/{entry.total} • {entry.date}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}