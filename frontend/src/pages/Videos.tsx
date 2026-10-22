import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import defaultLectures from "@/data/lectures";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";

export default function Videos() {
  const [lectures, setLectures] = useState(defaultLectures);
  const [contentError, setContentError] = useState("");
  const [query, setQuery] = useState("");
  const [subject, setSubject] = useState("All");

  useEffect(() => {
    let active = true;
    api("/lectures")
      .then((items) => {
        if (active && items.length > 0) setLectures(items);
      })
      .catch((error) => {
        if (active) setContentError(error instanceof Error ? error.message : "Unable to load saved lectures.");
      });
    return () => { active = false; };
  }, []);

  const filtered = useMemo(() => lectures.filter((lecture) => {
    const matchesQuery = lecture.title.toLowerCase().includes(query.toLowerCase()) || lecture.tags.join(" ").toLowerCase().includes(query.toLowerCase());
    const matchesSubject = subject === "All" || lecture.subject === subject;
    return matchesQuery && matchesSubject;
  }), [lectures, query, subject]);

  return (
    <div className="min-h-screen grid-bg">
      <Navbar />
      <main className="container py-24">
        <h1 className="text-3xl font-bold">Video Lectures</h1>
        <p className="mt-2 text-muted-foreground">Search, filter and play organized lectures by subject and topic.</p>
        {contentError && <p role="status" className="mt-3 text-sm text-muted-foreground">Showing built-in lectures. {contentError}</p>}
        <div className="mt-6 flex flex-col gap-3 md:flex-row">
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search lectures" className="w-full rounded-lg border border-border bg-card px-4 py-2" />
          <select value={subject} onChange={(e) => setSubject(e.target.value)} className="rounded-lg border border-border bg-card px-4 py-2">
            <option value="All">All Subjects</option>
            <option value="DBMS">DBMS</option>
            <option value="OOP">OOP</option>
            <option value="OS">OS</option>
            <option value="CN">CN</option>
          </select>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {filtered.map((lecture) => (
            <Link key={lecture.id} to={`/lecture/${lecture.id}`} className="rounded-2xl border border-border bg-card p-4 shadow-sm">
              <img src={lecture.thumbnail} alt={lecture.title} className="mb-3 h-40 w-full rounded-xl object-cover" />
              <p className="text-sm text-primary">{lecture.subject} • {lecture.topic}</p>
              <h2 className="mt-2 text-lg font-semibold">{lecture.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{lecture.description}</p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
