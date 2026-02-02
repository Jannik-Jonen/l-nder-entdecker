import { useState } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { supabaseUntyped } from "@/lib/supabase-untyped";
import { inspirationDestinations } from "@/data/mockData";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const CreateGuidePost = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [destinationId, setDestinationId] = useState<string>("");
  const [imageUrl, setImageUrl] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [sourcesInput, setSourcesInput] = useState("");
  const [saving, setSaving] = useState(false);

  const destOptions = inspirationDestinations.map((d) => ({ id: d.id, name: d.name }));

  const onSubmit = async () => {
    if (!user) {
      toast.error("Bitte zuerst anmelden");
      return;
    }
    if (!title.trim() || !destinationId) {
      toast.error("Titel und Destination sind erforderlich");
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
      const id = `post-${Date.now()}`;
      const { error } = await supabaseUntyped.from("guide_posts").insert({
        id,
        author_id: user.id,
        destination_id: destinationId,
        title,
        excerpt,
        content,
        image_url: imageUrl,
        tags,
        sources,
      });
      if (error) throw error;
      toast.success("Beitrag erstellt");
      navigate(`/guides/posts/${id}`);
    } catch (e) {
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
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">Guide-Beitrag erstellen</h1>
            <p className="text-primary-foreground/80 text-lg max-w-2xl">
              Erstelle einen redaktionellen Beitrag und verweise auf Quellen wie Lonely Planet, Better Beyond u. a.
            </p>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Titel</label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="z. B. Die perfekte Route für Island" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Destination</label>
              <Select value={destinationId} onValueChange={setDestinationId}>
                <SelectTrigger>
                  <SelectValue placeholder="Destination auswählen" />
                </SelectTrigger>
                <SelectContent>
                  {destOptions.map((d) => (
                    <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              <Input value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} placeholder="Roadtrip, Natur, Planung" />
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
            {saving ? "Speichern..." : "Beitrag speichern"}
          </Button>
          <Button onClick={() => navigate("/guides")} variant="outline">Abbrechen</Button>
        </div>
      </main>
    </div>
  );
};

export default CreateGuidePost;
