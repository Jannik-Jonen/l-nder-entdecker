import { useState } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { supabaseUntyped } from "@/lib/supabase-untyped";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const CreateBlogPost = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [sourcesInput, setSourcesInput] = useState("");
  const [saving, setSaving] = useState(false);

  const onSubmit = async () => {
    if (!user) {
      toast.error("Bitte zuerst anmelden");
      return;
    }
    if (!title.trim()) {
      toast.error("Titel ist erforderlich");
      return;
    }
    setSaving(true);
    try {
      const tags = tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0);
      const sources = sourcesInput
        .split("\n")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
      const id = `blog-${Date.now()}`;
      const { error } = await supabaseUntyped.from("blog_posts").insert({
        id,
        author_id: user.id,
        title,
        excerpt,
        content,
        image_url: imageUrl,
        tags,
        sources,
        status: "pending_review",
      });
      if (error) throw error;
      toast.success("Blogartikel erstellt");
      navigate(`/blog?post=${id}`);
    } catch {
      toast.error("Speichern fehlgeschlagen");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        <section className="relative overflow-hidden rounded-2xl gradient-hero p-8 md:p-12 text-primary-foreground mb-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-foreground/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
          <div className="relative z-10">
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">Blogartikel erstellen</h1>
            <p className="text-primary-foreground/80 text-lg max-w-2xl">
              Erstelle allgemeine Reiseartikel ohne konkrete Destination – mit Inhalt, Tags und Quellen.
            </p>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Titel</label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="z. B. Minimalistische Packliste" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Bild-URL</label>
              <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Kurzbeschreibung</label>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                rows={3}
                placeholder="Ein prägnanter Teaser-Text"
              />
            </div>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Inhalt</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[220px]"
                rows={10}
                placeholder="Strukturiere deinen Beitrag. Du kannst Absätze, Listen und Zitate verwenden."
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Tags (Kommagetrennt)</label>
              <Input value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} placeholder="Packen, Budget, Gesundheit" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Quellen (eine URL pro Zeile)</label>
              <textarea
                value={sourcesInput}
                onChange={(e) => setSourcesInput(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                rows={4}
                placeholder="https://www.lonelyplanet.com/...&#10;https://betterbeyond.com/..."
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <Button onClick={onSubmit} disabled={saving} variant="default">
            {saving ? "Speichern..." : "Artikel speichern"}
          </Button>
          <Button onClick={() => navigate("/blog")} variant="outline">Abbrechen</Button>
        </div>
      </main>
    </div>
  );
};

export default CreateBlogPost;
