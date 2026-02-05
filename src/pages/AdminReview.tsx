import { useCallback, useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { isLocalSupabase, supabase } from "@/integrations/supabase/client";
import { supabaseUntyped } from "@/lib/supabase-untyped";
import { inspirationDestinations } from "@/data/mockData";
import { MapPin, Check, X, Sparkles } from "lucide-react";
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
type BlogPostRow = {
  id: string;
  title: string;
  excerpt: string;
  image_url: string;
  status: "draft" | "pending_review" | "published" | "rejected";
};

const AdminReview = () => {
  const { user } = useAuth();
  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || "jannik.jonen@gmail.com";
  const isAdmin = !!user && !!adminEmail && user.email === adminEmail;
  const [posts, setPosts] = useState<GuidePostRow[]>([]);
  const [generalPosts, setGeneralPosts] = useState<BlogPostRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [mfaLevel, setMfaLevel] = useState<"aal1" | "aal2" | null>(null);
  const [mfaChecked, setMfaChecked] = useState(false);
  const [mfaCode, setMfaCode] = useState("");
  const [mfaChallengeId, setMfaChallengeId] = useState<string | null>(null);
  const [mfaRequesting, setMfaRequesting] = useState(false);
  const [mfaVerifying, setMfaVerifying] = useState(false);
  const [localCodeHint, setLocalCodeHint] = useState<string | null>(null);

  const refreshMfa = useCallback(async () => {
    if (!isAdmin) return;
    setMfaChecked(false);
    try {
      const { data, error } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
      if (error || !data?.currentLevel) {
        setMfaLevel("aal1");
        return;
      }
      setMfaLevel(data.currentLevel === "aal2" ? "aal2" : "aal1");
    } catch {
      setMfaLevel("aal1");
    } finally {
      setMfaChecked(true);
    }
  }, [isAdmin]);

  useEffect(() => {
    refreshMfa();
  }, [refreshMfa]);

  const extractLocalCode = (value: unknown) => {
    if (!value || typeof value !== "object") return null;
    if (!("code" in value)) return null;
    const code = (value as Record<string, unknown>).code;
    return typeof code === "string" ? code : null;
  };

  const requestLocalMfa = async () => {
    setMfaRequesting(true);
    setLocalCodeHint(null);
    try {
      const { data, error } = await supabase.auth.mfa.challenge({ factorId: "local" });
      if (error) {
        toast.error("2FA‑Code konnte nicht erstellt werden");
        return;
      }
      if (data && typeof data === "object" && "id" in data) {
        const id = (data as Record<string, unknown>).id;
        if (typeof id === "string") setMfaChallengeId(id);
      }
      const code = extractLocalCode(data);
      if (code) {
        setLocalCodeHint(code);
        toast.success(`Lokaler 2FA‑Code: ${code}`);
      }
    } finally {
      setMfaRequesting(false);
    }
  };

  const verifyLocalMfa = async () => {
    if (!mfaChallengeId) {
      toast.error("Bitte zuerst einen Code anfordern");
      return;
    }
    if (!mfaCode.trim()) {
      toast.error("Bitte den 2FA‑Code eingeben");
      return;
    }
    setMfaVerifying(true);
    try {
      const { error } = await supabase.auth.mfa.verify({
        factorId: "local",
        challengeId: mfaChallengeId,
        code: mfaCode.trim(),
      });
      if (error) {
        toast.error("2FA‑Code ungültig");
        return;
      }
      await refreshMfa();
      setMfaCode("");
      setMfaChallengeId(null);
      setLocalCodeHint(null);
      toast.success("2FA bestätigt");
    } finally {
      setMfaVerifying(false);
    }
  };

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
        const { data: blogData, error: blogErr } = await supabaseUntyped
          .from("blog_posts")
          .select("id,title,excerpt,image_url,status")
          .eq("status", "pending_review")
          .order("created_at", { ascending: false });
        if (!blogErr && blogData) {
          setGeneralPosts(blogData as unknown as BlogPostRow[]);
        } else {
          setGeneralPosts([]);
        }
      } finally {
        setLoading(false);
      }
    };
    if (isAdmin && mfaLevel === "aal2") load();
  }, [isAdmin, mfaLevel]);

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
  const updateBlogStatus = async (id: string, status: BlogPostRow["status"]) => {
    try {
      const { error } = await supabaseUntyped
        .from("blog_posts")
        .update({ status })
        .eq("id", id);
      if (error) {
        toast.error("Update fehlgeschlagen");
        return;
      }
      setGeneralPosts((prev) => prev.filter((p) => p.id !== id));
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
  if (mfaChecked && mfaLevel !== "aal2") {
    if (isLocalSupabase) {
      return (
        <div className="min-h-screen bg-background">
          <Header />
          <main className="container py-20 text-center">
            <div className="text-xl font-semibold mb-2">Admin‑2FA erforderlich</div>
            <div className="text-muted-foreground mb-6">
              Erstelle einen lokalen 2FA‑Code und bestätige ihn, um fortzufahren.
            </div>
            <div className="max-w-sm mx-auto space-y-3">
              <Input
                placeholder="6‑stelliger Code"
                value={mfaCode}
                onChange={(e) => setMfaCode(e.target.value)}
              />
              {localCodeHint ? (
                <div className="text-sm text-muted-foreground">Code: {localCodeHint}</div>
              ) : null}
              <div className="flex flex-col gap-2">
                <Button variant="secondary" onClick={requestLocalMfa} disabled={mfaRequesting}>
                  Code anfordern
                </Button>
                <Button onClick={verifyLocalMfa} disabled={mfaVerifying}>
                  Code bestätigen
                </Button>
              </div>
            </div>
          </main>
        </div>
      );
    }
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-20 text-center">
          <div className="text-xl font-semibold mb-2">Zwei‑Faktor‑Anmeldung erforderlich</div>
          <div className="text-muted-foreground mb-4">
            Bitte aktiviere 2FA (TOTP) in deinem Profil und melde dich danach erneut an.
          </div>
          <Link to="/profile">
            <Button variant="secondary">2FA aktivieren</Button>
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-3xl md:text-4xl font-bold">Beiträge prüfen</h1>
          <Button variant="secondary" className="gap-2" onClick={async () => {
            try {
              const rows = inspirationDestinations.map((d) => ({
                id: d.id,
                name: d.name,
                country: d.country,
                country_code: d.countryCode || null,
                type: d.type,
                image_url: d.imageUrl,
                description: d.description,
                highlights: d.highlights,
                best_season: d.bestSeason,
                average_daily_cost: d.averageDailyCost,
                currency: d.currency,
                visa_info: d.visaInfo || null,
                vaccination_info: d.vaccinationInfo || null,
                health_safety_info: d.healthSafetyInfo || null,
                source: d.source || null,
                parent_id: d.parentId || null,
                coords_lat: d.coords?.lat ?? null,
                coords_lon: d.coords?.lon ?? null,
                children_count: d.childrenCount ?? null,
              }));
              const { error } = await supabaseUntyped
                .from("destinations")
                .upsert(rows, { onConflict: "id" });
              if (error) {
                toast.error("Destination-Seeding fehlgeschlagen");
                return;
              }
              toast.success("Destinations erfolgreich importiert");
            } catch {
              toast.error("Destination-Seeding fehlgeschlagen");
            }
          }}>
            <Sparkles className="h-4 w-4" /> Destinations seeden
          </Button>
          <Button variant="secondary" className="gap-2" onClick={async () => {
            try {
              const samples = inspirationDestinations.slice(0, 3).map((d, i) => ({
                id: `seed-${Date.now()}-${i}`,
                author_id: user?.id,
                destination_id: d.id,
                title: `Guide: ${d.name} – Route & Tipps`,
                excerpt: `Kompletter Reise-Guide für ${d.name} mit Route, Budget und praktischen Hinweisen.`,
                content: [
                  `Einleitung`,
                  `Warum ${d.name} und was erwartet dich.`,
                  ``,
                  `Praktische Infos`,
                  `• Beste Reisezeit: ${d.bestSeason}`,
                  `• Ø Tagesbudget: ${d.averageDailyCost} ${d.currency}/Tag`,
                  ``,
                  `Beispielroute`,
                  `• Tag 1–2: Highlights und Orientierung`,
                  `• Tag 3–5: Natur/Kultur je nach Region`,
                  ``,
                  `Budgettipps & Vorbereitung`,
                  `• Transport, Unterkunft, Packliste, Versicherungen`,
                ].join("\n"),
                image_url: d.imageUrl,
                tags: ["Guide", "Planung", d.type],
                sources: [],
                status: "pending_review" as const,
              }));
              const { error } = await supabaseUntyped.from("guide_posts").insert(samples);
              if (error) {
                toast.error("Seeding fehlgeschlagen");
                return;
              }
              toast.success("Beispiel‑Beiträge hinzugefügt");
            } catch {
              toast.error("Seeding fehlgeschlagen");
            }
          }}>
            <Sparkles className="h-4 w-4" /> Beispiel‑Beiträge hinzufügen
          </Button>
          <Button variant="secondary" className="gap-2" onClick={async () => {
            try {
              const now = Date.now();
              const samples = [
                {
                  id: `blog-seed-${now}-a`,
                  author_id: user?.id,
                  title: "Minimalistische Packliste: Reisen mit Handgepäck",
                  excerpt: "Was wirklich in deinen Rucksack gehört – praxisnah & leicht.",
                  content: [
                    "Einleitung",
                    "Warum minimalistisches Packen Freiheit schafft.",
                    "",
                    "Liste",
                    "• Kleidung, Hygiene, Technik, Notfall",
                    "",
                    "Tipps",
                    "• Multi-Use Items, Layering, Kompression"
                  ].join("\n"),
                  image_url: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800&q=80",
                  tags: ["Packen", "Ausrüstung", "Leicht"],
                  sources: [],
                  status: "pending_review" as const,
                },
                {
                  id: `blog-seed-${now}-b`,
                  author_id: user?.id,
                  title: "Reisebudget planen: Von Tageskosten bis Notfallpuffer",
                  excerpt: "Struktur und Tools für ein realistisches Budget ohne Stress.",
                  content: [
                    "Einleitung",
                    "Budget-Bausteine und typische Kosten.",
                    "",
                    "Aufteilung",
                    "• Fixkosten, variable Ausgaben, Puffer",
                    "",
                    "Werkzeuge",
                    "• Tabellen, Apps, Bargeldstrategie"
                  ].join("\n"),
                  image_url: "https://images.unsplash.com/photo-1518546305927-5a555bb702b3?w=800&q=80",
                  tags: ["Budget", "Planung", "Finanzen"],
                  sources: [],
                  status: "pending_review" as const,
                },
              ];
              const { error } = await supabaseUntyped.from("blog_posts").insert(samples);
              if (error) {
                toast.error("Seeding fehlgeschlagen");
                return;
              }
              toast.success("Beispiel‑Artikel hinzugefügt");
            } catch {
              toast.error("Seeding fehlgeschlagen");
            }
          }}>
            <Sparkles className="h-4 w-4" /> Beispiel‑Artikel hinzufügen
          </Button>
        </div>
        {loading ? (
          <div className="text-muted-foreground">Laden…</div>
        ) : (
          <>
            <div className="mb-8">
              <h2 className="font-display text-2xl font-semibold mb-3">Guides mit Destination</h2>
              {posts.length === 0 ? (
                <div className="text-muted-foreground">Keine Guide-Beiträge zur Prüfung</div>
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
            </div>
            <div>
              <h2 className="font-display text-2xl font-semibold mb-3">Allgemeine Blogartikel</h2>
              {generalPosts.length === 0 ? (
                <div className="text-muted-foreground">Keine Artikel zur Prüfung</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {generalPosts.map((p) => (
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
                        <h3 className="font-display text-lg font-semibold mt-1">{p.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">{p.excerpt}</p>
                        <div className="mt-4 flex items-center gap-2">
                          <Button variant="outline" asChild size="sm">
                            <Link to={`/blog?post=${p.id}`}>Öffnen</Link>
                          </Button>
                          <Button variant="default" size="sm" className="gap-1" onClick={() => updateBlogStatus(p.id, "published")}>
                            <Check className="h-4 w-4" /> Freigeben
                          </Button>
                          <Button variant="destructive" size="sm" className="gap-1" onClick={() => updateBlogStatus(p.id, "rejected")}>
                            <X className="h-4 w-4" /> Ablehnen
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default AdminReview;
