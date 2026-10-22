import { useState, type ChangeEvent, type FormEvent } from "react";
import Navbar from "@/components/Navbar";
import { api } from "@/lib/api";

export default function Admin() {
  const [form, setForm] = useState({
    id: "",
    title: "",
    subject: "",
    topic: "",
    description: "",
    notes: "",
    videoUrl: "",
    thumbnail: "",
  });
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const updateField = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const saveLecture = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      await api("/lectures", { method: "POST", body: JSON.stringify({ ...form, tags: [] }) });
      setMessage("Lecture saved.");
      setForm({ id: "", title: "", subject: "", topic: "", description: "", notes: "", videoUrl: "", thumbnail: "" });
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to save the lecture.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen grid-bg">
      <Navbar />
      <main className="container py-24">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <p className="mt-2 text-muted-foreground">Add YouTube-linked lectures and organize course content.</p>
        <div className="mt-8 rounded-2xl border border-border bg-card p-6">
          <h2 className="text-xl font-semibold">Upload Lecture</h2>
          <p className="mt-2 text-sm text-muted-foreground">Add video links, subject tags, topics, and lecture notes.</p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-dashed border-border p-4">
              <p className="font-medium">Local Device Upload</p>
              <p className="mt-1 text-sm text-muted-foreground">Video file uploads require a configured storage provider and are not enabled yet.</p>
            </div>
            <div className="rounded-xl border border-dashed border-border p-4">
              <p className="font-medium">YouTube Embed</p>
              <p className="mt-1 text-sm text-muted-foreground">Paste a YouTube URL and it will appear in the lectures library automatically.</p>
            </div>
          </div>
          <form onSubmit={saveLecture} className="mt-6 grid gap-4 md:grid-cols-2">
            {[
              ["id", "Lecture ID"],
              ["title", "Title"],
              ["subject", "Subject"],
              ["topic", "Topic"],
              ["videoUrl", "YouTube embed URL"],
              ["thumbnail", "Thumbnail URL"],
            ].map(([name, label]) => (
              <input
                key={name}
                name={name}
                value={form[name as keyof typeof form]}
                onChange={updateField}
                placeholder={label}
                required={["id", "title", "subject", "topic"].includes(name)}
                className="rounded-lg border border-border bg-background px-4 py-2"
              />
            ))}
            <textarea
              name="description"
              value={form.description}
              onChange={updateField}
              placeholder="Description"
              className="rounded-lg border border-border bg-background px-4 py-2"
            />
            <textarea
              name="notes"
              value={form.notes}
              onChange={updateField}
              placeholder="Lecture notes"
              className="rounded-lg border border-border bg-background px-4 py-2"
            />
            {message && <p role="status" className="text-sm text-muted-foreground md:col-span-2">{message}</p>}
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-primary px-4 py-2 font-semibold text-primary-foreground disabled:opacity-70"
            >
              {saving ? "Saving..." : "Save Lecture"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
