import Navbar from "@/components/Navbar";

export default function Admin() {
  return (
    <div className="min-h-screen grid-bg">
      <Navbar />
      <main className="container py-24">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <p className="mt-2 text-muted-foreground">Upload lectures, manage playlists and organize course content.</p>
        <div className="mt-8 rounded-2xl border border-border bg-card p-6">
          <h2 className="text-xl font-semibold">Upload Lecture</h2>
          <p className="mt-2 text-sm text-muted-foreground">You can add video links, local upload references, subject tags, chapters and playlists from here.</p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-dashed border-border p-4">
              <p className="font-medium">Local Device Upload</p>
              <p className="mt-1 text-sm text-muted-foreground">Upload MP4/WebM files from your device.</p>
            </div>
            <div className="rounded-xl border border-dashed border-border p-4">
              <p className="font-medium">YouTube Embed</p>
              <p className="mt-1 text-sm text-muted-foreground">Paste a YouTube URL and it will appear in the lectures library automatically.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
