import { Header } from '@/components/Header';
import { useEffect, useState, useMemo } from 'react';
import { Destination } from '@/types/travel';
import { fetchDestinationsCatalog } from '@/services/travelData';
import { Link } from 'react-router-dom';
import { MapPin, BookOpen, ArrowRight, Search, Clock, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
  content?: string;
  created_at?: string;
};

function estimateReadingTime(content?: string): number {
  if (!content) return 1;
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

const Guides = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [guidePosts, setGuidePosts] = useState<GuidePostRow[]>([]);
  const [catalog, setCatalog] = useState<Destination[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

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
      .select('id,title,excerpt,image_url,destination_id,tags,content,created_at')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .then(({ data }: any) => { if (data) setGuidePosts(data); });
  }, []);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    guidePosts.forEach(p => (p.tags || []).forEach(t => tags.add(t)));
    return Array.from(tags).sort();
  }, [guidePosts]);

  const filteredPosts = useMemo(() => {
    let result = guidePosts;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.excerpt?.toLowerCase().includes(q) ||
        (p.tags || []).some(t => t.toLowerCase().includes(q))
      );
    }
    if (selectedTag) {
      result = result.filter(p => (p.tags || []).includes(selectedTag));
    }
    return result;
  }, [guidePosts, searchQuery, selectedTag]);

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

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Guides durchsuchen…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
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

        {/* Tags filter */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setSelectedTag(null)}
              className={`text-xs px-3 py-1.5 rounded-full transition-colors ${!selectedTag ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'}`}
            >
              Alle
            </button>
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                className={`text-xs px-3 py-1.5 rounded-full transition-colors ${selectedTag === tag ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'}`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}

        {/* Results info */}
        {(searchQuery || selectedTag) && (
          <p className="text-sm text-muted-foreground mb-4">
            {filteredPosts.length} {filteredPosts.length === 1 ? 'Guide' : 'Guides'} gefunden
            {selectedTag && <> zum Thema <Badge variant="secondary" className="ml-1">{selectedTag}</Badge></>}
          </p>
        )}

        {/* Guide Posts Grid */}
        {filteredPosts.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-8 text-center text-muted-foreground">
            {searchQuery || selectedTag ? 'Keine Guides zu deiner Suche gefunden.' : 'Noch keine Guide-Beiträge vorhanden.'}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((p) => {
              const dest = catalog.find((d) => d.id === p.destination_id);
              const readingTime = estimateReadingTime(p.content);
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
                    {/* Reading time badge */}
                    <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/50 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                      <Clock className="h-3 w-3" /> {readingTime} Min.
                    </div>
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
