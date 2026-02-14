import { Header } from '@/components/Header';
import { useEffect, useState } from 'react';
import { Destination } from '@/types/travel';
import { fetchDestinationsCatalog } from '@/services/travelData';
import { Link } from 'react-router-dom';
import { MapPin, BookOpen, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { supabaseUntyped } from '@/lib/supabase-untyped';

type GuidePostRow = {
  id: string;
  title: string;
  excerpt: string;
  image_url: string;
  destination_id: string;
  tags?: string[];
};

const Guides = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [guidePosts, setGuidePosts] = useState<GuidePostRow[]>([]);
  const [catalog, setCatalog] = useState<Destination[]>([]);

  useEffect(() => {
    fetchDestinationsCatalog().then(data => setCatalog(Array.isArray(data) ? data : [])).catch(() => setCatalog([]));
  }, []);

  useEffect(() => {
    if (!user) { setIsAdmin(false); return; }
    supabase.rpc('has_role', { _user_id: user.id, _role: 'admin' }).then(({ data }) => setIsAdmin(!!data));
  }, [user]);

  useEffect(() => {
    supabaseUntyped
      .from('guide_posts')
      .select('id,title,excerpt,image_url,destination_id,tags')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .then(({ data }: any) => { if (data) setGuidePosts(data); });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        {/* Hero */}
        <section className="relative overflow-hidden rounded-2xl gradient-hero p-8 md:p-12 text-primary-foreground mb-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-foreground/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="h-6 w-6" />
              <span className="text-sm font-medium uppercase tracking-wide opacity-80">Redaktionelle Guides</span>
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">Ausführliche Reise-Guides</h1>
            <p className="text-primary-foreground/80 text-lg max-w-2xl">
              Detaillierte, redaktionelle Berichte mit konkreten Tipps, Fakten und Erfahrungen – alles was du für die Planung brauchst.
            </p>
          </div>
        </section>

        {/* Actions */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl font-semibold">Alle Guides</h2>
          <div className="flex items-center gap-2">
            {user && (
              <Button asChild variant="default">
                <Link to="/guides/create" className="gap-2">Beitrag erstellen</Link>
              </Button>
            )}
            {isAdmin && (
              <Button asChild variant="outline">
                <Link to="/admin/review" className="gap-2">Beiträge prüfen</Link>
              </Button>
            )}
          </div>
        </div>

        {/* Guide Posts Grid */}
        {guidePosts.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-8 text-center text-muted-foreground">
            Noch keine Guide-Beiträge vorhanden.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guidePosts.map((p) => {
              const dest = catalog.find((d) => d.id === p.destination_id);
              return (
                <Link
                  key={p.id}
                  to={`/guides/posts/${p.id}`}
                  className="group relative overflow-hidden rounded-xl bg-card border border-border hover:shadow-card-hover transition-all"
                >
                  <div className="relative h-48">
                    <img
                      src={p.image_url}
                      alt={p.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => { (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=800'; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="font-display text-xl font-semibold text-white">{p.title}</h3>
                      <p className="text-white/80 text-sm line-clamp-2 mt-1">{p.excerpt}</p>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" /> {dest?.name || 'Destination'}
                      </span>
                      <span className="text-sm font-medium text-primary flex items-center gap-1">
                        Lesen <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                    {p.tags && p.tags.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {p.tags.slice(0, 3).map(t => (
                          <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{t}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default Guides;
