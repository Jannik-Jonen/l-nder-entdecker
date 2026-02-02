import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabaseUntyped } from "@/lib/supabase-untyped";
import { inspirationDestinations } from "@/data/mockData";
import { MapPin, Check, X } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

type GuidePostRow = {
  id: string;
  title: string;
  excerpt: string;
  image_url: string;
  destination_id: string;
  status: "draft" | "pending_review" | "published" | "rejected";
};

const AdminReview = () => {
  const { user } = useAuth();
  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
  const isAdmin = !!user && !!adminEmail && user.email === adminEmail;
  const [posts, setPosts] = useState<GuidePostRow[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabaseUntyped
          .from("guide_posts")
          .select("id,title,excerpt,image_url,destination_id,status")
          .eq("status", "pending_review")
          .order("created_at", { ascending: false });
        if (!error && data) {
          setPosts(data as unknown as GuidePostRow[]);
        } else {
          setPosts([]);
        }
      } finally {
        setLoading(false);
      }
    };
    if (isAdmin) load();
  }, [isAdmin]);

  const updateStatus = async (id: string, status: GuidePostRow["status"]) => {
    try {
      const { error } = await supabaseUntyped
        .from("guide_posts")
        .update({ status })
        .eq("id", id);
      if (error) {
        toast.error("Update fehlgeschlagen");
        return;
      }
      setPosts((prev) => prev.filter((p) => p.id !== id));
      toast.success(status === "published" ? "Veröffentlicht" : "Zurückgewiesen");
    } catch {
      toast.error("Update fehlgeschlagen");
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-20 text-center">
          <div className="text-muted-foreground">Nicht berechtigt</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        <h1 className="font-display text-3xl md:text-4xl font-bold mb-6">Beiträge prüfen</h1>
        {loading ? (
          <div className="text-muted-foreground">Laden…</div>
        ) : posts.length === 0 ? (
          <div className="text-muted-foreground">Keine Beiträge zur Prüfung</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((p) => (
              <div key={p.id} className="rounded-xl bg-card border border-border overflow-hidden">
                <div className="relative h-40">
                  <img
                    src={p.image_url}
                    alt={p.title}
                    className="h-full w-full object-cover"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = 'https://via.placeholder.com/800x480?text=Bild+nicht+verfügbar'; }}
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <MapPin className="h-4 w-4" />
                    <span>{(inspirationDestinations.find((d) => d.id === p.destination_id)?.name) || "Destination"}</span>
                  </div>
                  <h3 className="font-display text-lg font-semibold mt-1">{p.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{p.excerpt}</p>
                  <div className="mt-4 flex items-center gap-2">
                    <Button variant="outline" asChild size="sm">
                      <Link to={`/guides/posts/${p.id}`}>Öffnen</Link>
                    </Button>
                    <Button variant="default" size="sm" className="gap-1" onClick={() => updateStatus(p.id, "published")}>
                      <Check className="h-4 w-4" /> Freigeben
                    </Button>
                    <Button variant="destructive" size="sm" className="gap-1" onClick={() => updateStatus(p.id, "rejected")}>
                      <X className="h-4 w-4" /> Ablehnen
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminReview;
