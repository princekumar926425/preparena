import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import defaultLectures, { Lecture as LectureType } from "@/data/lectures";
import { api } from "@/lib/api";

const Lecture = () => {
  const { id } = useParams();
  const [showVideo, setShowVideo] = useState(true);
  const [lectures, setLectures] = useState(defaultLectures);
  const [contentError, setContentError] = useState("");

  useEffect(() => {
    let active = true;
    api<LectureType[]>("/lectures")
      .then((items) => {
        if (active && items.length > 0) setLectures(items);
      })
      .catch((error) => {
        if (active) setContentError(error instanceof Error ? error.message : "Unable to load saved lectures.");
      });
    return () => { active = false; };
  }, []);

  const lecture = useMemo<LectureType | undefined>(() => lectures.find((entry) => entry.id === id), [id, lectures]);

  if (!lecture) {
    return (
      <div className="min-h-screen grid-bg">
        <Navbar />
        <section className="container py-24">
          <h2 className="text-2xl font-bold">Lecture not found</h2>
          <p className="mt-4">The requested lecture was not found. Go back to <Link to="/subjects" className="text-primary">subjects</Link>.</p>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen grid-bg">
      <Navbar />
      <section className="container py-24">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-primary">{lecture.subject}</p>
            <h1 className="text-3xl font-bold">{lecture.title}</h1>
            <p className="mt-2 text-muted-foreground">{lecture.description}</p>
          </div>
          {contentError && <p role="status" className="mb-4 text-sm text-muted-foreground">Showing the built-in lecture. {contentError}</p>}
          <button
            onClick={() => setShowVideo((s) => !s)}
            className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white"
          >
            {showVideo ? "Hide Video" : "Show Video"}
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <article className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="mb-3 text-xl font-semibold">Lecture Notes</h2>
            <p className="mb-4 text-sm text-muted-foreground">Topic: {lecture.topic}</p>
            <div className="space-y-3 text-sm leading-7 text-foreground/80">
              {lecture.notes.split(". ").map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>
          </article>

          {lecture.videoUrl && showVideo && (
            <div className="rounded-2xl border border-border bg-card p-3 shadow-sm">
              <div className="aspect-video w-full overflow-hidden rounded-xl">
                <iframe
                  title={`${lecture.title} video`}
                  src={lecture.videoUrl}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Lecture;
