import { useEffect, useState } from "react";
import { Trophy, Clock, Users, Star } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";

const sampleContests = [
  { id: 1, title: "Weekly Contest #42", status: "live", participants: 234, duration: "90 min", problems: 4, startTime: "Live Now" },
  { id: 2, title: "Weekly Contest #43", status: "upcoming", participants: 0, duration: "90 min", problems: 4, startTime: "Mar 23, 2026 — 8:00 PM" },
  { id: 3, title: "Weekly Contest #41", status: "ended", participants: 512, duration: "90 min", problems: 4, startTime: "Ended" },
  { id: 4, title: "Weekly Contest #40", status: "ended", participants: 489, duration: "90 min", problems: 4, startTime: "Ended" },
];

const leaderboard = [
  { rank: 1, name: "CodeMaster", score: 400, solved: 4, time: "45:12" },
  { rank: 2, name: "AlgoNinja", score: 380, solved: 4, time: "52:30" },
  { rank: 3, name: "DSA_Pro", score: 300, solved: 3, time: "38:45" },
  { rank: 4, name: "ByteRunner", score: 280, solved: 3, time: "55:10" },
  { rank: 5, name: "PixelDev", score: 200, solved: 2, time: "30:22" },
];

const statusStyles: Record<string, string> = {
  live: "bg-easy/15 text-easy border-easy/30",
  upcoming: "bg-primary/15 text-primary border-primary/30",
  ended: "bg-muted text-muted-foreground border-border",
};

const Contests = () => {
  const [contests, setContests] = useState(sampleContests);
  const [contentError, setContentError] = useState("");

  useEffect(() => {
    let active = true;
    api("/contests")
      .then((items) => {
        if (active && items.length > 0) setContests(items);
      })
      .catch((error) => {
        if (active) setContentError(error instanceof Error ? error.message : "Unable to load saved contests.");
      });
    return () => { active = false; };
  }, []);

  return (
    <div className="min-h-screen grid-bg">
      <Navbar />
      <main className="container pt-24 pb-16">
        <h1 className="mb-2 text-3xl font-bold">
          <span className="text-primary">Contests</span> & Rankings
        </h1>
        <p className="mb-8 text-muted-foreground">Compete weekly and climb the leaderboard</p>

        <div className="grid gap-8 lg:grid-cols-[1fr_350px]">
          {/* Contests list */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">All Contests</h2>
            {contentError && <p role="status" className="text-sm text-muted-foreground">Showing sample contests. {contentError}</p>}
            {contests.map((c) => (
              <div key={c.id} className="flex items-center justify-between rounded-xl border border-border bg-card p-5 transition-all hover:glow-border">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Trophy className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{c.title}</h3>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {c.duration}</span>
                      <span>{c.problems} problems</span>
                      {c.participants > 0 && <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {c.participants}</span>}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={`border ${statusStyles[c.status]}`}>
                    {c.status === "live" ? "🔴 Live" : c.status === "upcoming" ? "Upcoming" : "Ended"}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">{c.startTime}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Leaderboard */}
          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
              <Star className="h-5 w-5 text-medium" /> Leaderboard
            </h2>
            <div className="space-y-3">
              {leaderboard.map((entry) => (
                <div key={entry.rank} className="flex items-center justify-between rounded-lg bg-secondary/50 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                      entry.rank <= 3 ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                    }`}>
                      {entry.rank}
                    </span>
                    <span className="font-medium text-sm">{entry.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-primary">{entry.score} pts</span>
                    <p className="text-xs text-muted-foreground">{entry.solved}/4 • {entry.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Contests;