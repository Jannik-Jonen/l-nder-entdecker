import { Header } from '@/components/Header';
import { travelTips, guidePosts as guidePostsFallback } from '@/data/mockData';
import { Link, useSearchParams } from 'react-router-dom';
import { BookOpen, MapPin, ArrowRight, ListChecks, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useMemo, useState } from 'react';
import { supabaseUntyped } from '@/lib/supabase-untyped';
import { useAuth } from '@/hooks/useAuth';
import { Destination } from '@/types/travel';
import { fetchDestinationsCatalog } from '@/services/travelData';

const Blog = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const destinationId = searchParams.get('destination');
  const postId = searchParams.get('post');
  type GuidePostRow = {
    id: string;
    title: string;
    excerpt: string;
    image_url: string;
    destination_id: string;
    tags?: string[];
    sources?: string[];
    content?: string;
  };
  type BlogPostRow = {
    id: string;
    title: string;
    excerpt: string;
    image_url: string;
    tags?: string[];
    sources?: string[];
    content?: string;
  };
  type CombinedPost = {
    id: string;
    title: string;
    excerpt: string;
    image_url: string;
    destination_id?: string;
    tags?: string[];
    sources?: string[];
    content?: string;
  };
  const [posts, setPosts] = useState<GuidePostRow[]>([]);
  const [generalPosts, setGeneralPosts] = useState<BlogPostRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeDetail, setActiveDetail] = useState<CombinedPost | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [catalog, setCatalog] = useState<Destination[]>([]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabaseUntyped
          .from('guide_posts')
          .select('*')
          .eq('status', 'published')
          .order('created_at', { ascending: false });
        if (error) {
          setPosts(guidePostsFallback.map((p) => ({
            id: p.id,
            title: p.title,
            excerpt: p.excerpt,
            image_url: p.imageUrl,
            destination_id: p.destinationId,
            tags: p.tags,
            sources: [],
          })));
        } else {
          if (data && Array.isArray(data)) {
            setPosts(data as unknown as GuidePostRow[]);
          } else {
            setPosts([]);
          }
        }
        const { data: blogData, error: blogError } = await supabaseUntyped
          .from('blog_posts')
          .select('id,title,excerpt,image_url,tags,sources,status')
          .eq('status', 'published')
          .order('created_at', { ascending: false });
        if (!blogError && blogData && Array.isArray(blogData)) {
          setGeneralPosts(blogData as unknown as BlogPostRow[]);
        } else {
          setGeneralPosts([]);
        }
      } catch {
        setPosts(guidePostsFallback.map((p) => ({
          id: p.id,
          title: p.title,
          excerpt: p.excerpt,
          image_url: p.imageUrl,
          destination_id: p.destinationId,
          tags: p.tags,
          sources: [],
        })));
        setGeneralPosts([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const loadCatalog = async () => {
      try {
        const data = await fetchDestinationsCatalog();
        setCatalog(Array.isArray(data) ? data : []);
      } catch {
        setCatalog([]);
      }
    };
    loadCatalog();
  }, []);

  const destinationCatalog = catalog;
  const destinationById = useMemo(() => new Map(destinationCatalog.map((d) => [d.id, d])), [destinationCatalog]);
  const destination = destinationId ? destinationById.get(destinationId) : undefined;
  const filteredPosts = destinationId
    ? posts.filter((p) => p.destination_id === destinationId)
    : posts;

  const activePost: CombinedPost | undefined = postId
    ? [...posts, ...generalPosts.map((p) => ({ ...p, destination_id: undefined }))].find((p) => p.id === postId)
    : undefined;

  useEffect(() => {
    // Sofortige Anzeige aus bereits geladenen Listen (Cache),
    // selbst wenn Content fehlt – Supabase-Detailabruf aktualisiert später.
    if (activePost) {
      setActiveDetail(activePost);
    } else if (!postId) {
      setActiveDetail(null);
    }
  }, [activePost, postId]);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!postId) {
        setActiveDetail(null);
        return;
      }
      setLoadingDetail(true);
      try {
        // Zuerst versuchen, aus bereits geladenen Arrays zu finden (Cache)
        const fromGuides = posts.find((p) => p.id === postId);
        const fromGeneral = generalPosts.find((p) => p.id === postId);
        const cacheDetail = fromGuides
          ? (fromGuides as unknown as CombinedPost)
          : fromGeneral
          ? ({ ...fromGeneral, destination_id: undefined } as CombinedPost)
          : null;
        if (cacheDetail) {
          setActiveDetail(cacheDetail);
        }

        // Try guide_posts first (destination-linked)
        const { data: guide } = await supabaseUntyped
          .from('guide_posts')
          .select('*')
          .eq('id', postId)
          .eq('status', 'published')
          .maybeSingle();
        if (guide) {
          setActiveDetail(guide as unknown as CombinedPost);
          return;
        }
        // Fallback to general blog_posts
        const { data: blog } = await supabaseUntyped
          .from('blog_posts')
          .select('*')
          .eq('id', postId)
          .eq('status', 'published')
          .maybeSingle();
        if (blog) {
          setActiveDetail(blog as unknown as CombinedPost);
        } else if (!cacheDetail) {
          setActiveDetail(null);
        }
      } finally {
        setLoadingDetail(false);
      }
    };
    fetchDetail();
  }, [postId, posts, generalPosts]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        <section className="relative overflow-hidden rounded-2xl gradient-hero p-8 md:p-12 text-primary-foreground mb-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-foreground/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="h-6 w-6" />
              <span className="text-sm font-medium uppercase tracking-wide opacity-80">Beiträge & Tipps</span>
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
              {destination ? `Beiträge und Tipps: ${destination.name}` : 'Reisebeiträge und ausführliche Tipps'}
            </h1>
            <p className="text-primary-foreground/80 text-lg max-w-2xl">
              Ausführliche Empfehlungen, detaillierte Hinweise und inspirierende Inhalte für deine Reiseplanung.
            </p>
          </div>
        </section>
        <section className="mb-8">
          {!postId && (
            <div className="rounded-2xl border border-border bg-card p-4">
              <p className="text-sm text-muted-foreground">
                Inspiration zeigt kompakte Ideen und Ziele. Der Blog bietet ausführliche Artikel und Guides – hier findest du Tiefe und konkrete Planungshilfen.
              </p>
            </div>
          )}
        </section>

        {activePost && (
          <section className="mb-8">
            <div className="rounded-2xl overflow-hidden border border-border bg-card">
              <div className="relative h-56">
                <img
                  src={activePost.image_url}
                  alt={activePost.title}
                  className="h-full w-full object-cover"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).src = 'https://via.placeholder.com/1200x600?text=Bild+nicht+verfügbar'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  {!!activePost.destination_id && (
                    <div className="flex items-center gap-2 mb-2 text-white/80">
                      <MapPin className="h-4 w-4" />
                      <span>{destinationById.get(activePost.destination_id)?.name || 'Destination'}</span>
                    </div>
                  )}
                  <h2 className="font-display text-2xl font-semibold">{activePost.title}</h2>
                  <p className="text-white/80 text-sm mt-1">{activePost.excerpt}</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {postId && (
          <section className="mb-10">
            <div className="rounded-2xl border border-border bg-card p-6">
              {loadingDetail && (
                <div className="text-sm text-muted-foreground">Lade Beitrag…</div>
              )}
              {!loadingDetail && activeDetail && (
                <article className="prose prose-slate dark:prose-invert max-w-none">
                  {activeDetail.destination_id && (
                    <p className="text-sm text-muted-foreground">
                      Verknüpft mit: {destinationById.get(activeDetail.destination_id)?.name || 'Destination'}
                    </p>
                  )}
                  <p className="text-muted-foreground">{activeDetail.excerpt}</p>
                  {activeDetail.content && <div className="mt-4 whitespace-pre-wrap">{activeDetail.content}</div>}
                  <div className="mt-6 flex flex-wrap gap-2">
                    {(activeDetail.tags || []).map((t) => (
                      <span key={t} className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">{t}</span>
                    ))}
                  </div>
                  {(activeDetail.sources && activeDetail.sources.length > 0) && (
                    <div className="mt-8">
                      <h3>Quellen</h3>
                      <ul className="list-disc ml-5">
                        {activeDetail.sources.map((s) => (
                          <li key={s}><a href={s} target="_blank" rel="noreferrer" className="text-primary underline">{s}</a></li>
                        ))}
                      </ul>
                    </div>
                  )}
                </article>
              )}
              {!loadingDetail && !activeDetail && (
                <div className="text-sm text-muted-foreground">Beitrag konnte nicht geladen werden.</div>
              )}
            </div>
          </section>
        )}

        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-2xl font-semibold">Guides mit Destination</h2>
            <div className="flex items-center gap-2">
              {destinationId && (
                <Button variant="ghost" asChild>
                  <Link to="/blog">
                    Filter zurücksetzen
                  </Link>
                </Button>
              )}
              {user && (
                <Button variant="outline" asChild>
                  <Link to="/guides/create">
                    Guide-Beitrag erstellen
                  </Link>
                </Button>
              )}
              {!user && (
                <Button variant="outline" asChild>
                  <Link to="/?login=1">
                    Anmelden zum Schreiben
                  </Link>
                </Button>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((p) => (
              <div
                key={p.id}
                className="group relative overflow-hidden rounded-xl bg-card border border-border hover:shadow-card-hover transition-all"
              >
                <div className="relative h-40">
                  <img
                    src={p.image_url}
                    alt={p.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = 'https://via.placeholder.com/800x480?text=Bild+nicht+verfügbar'; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="font-display text-xl font-semibold text-white">{p.title}</h3>
                    <p className="text-white/80 text-sm line-clamp-2">{p.excerpt}</p>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <MapPin className="h-4 w-4" />
                    <span>{destinationById.get(p.destination_id)?.name || 'Destination'}</span>
                  </div>
                  <div className="mt-3 flex justify-end">
                    <Button variant="outline" size="sm" className="gap-2" asChild>
                      <Link to={`/blog?post=${p.id}`}>
                        Öffnen <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
        
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-2xl font-semibold">Allgemeine Blogartikel</h2>
            {!destinationId && user && (
              <Button variant="ghost" asChild>
                <Link to="/blog/create">Artikel erstellen</Link>
              </Button>
            )}
            {!destinationId && !user && (
              <Button variant="ghost" asChild>
                <Link to="/?login=1">Anmelden zum Schreiben</Link>
              </Button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {generalPosts.map((p) => (
              <div
                key={p.id}
                className="group relative overflow-hidden rounded-xl bg-card border border-border hover:shadow-card-hover transition-all"
              >
                <div className="relative h-40">
                  <img
                    src={p.image_url}
                    alt={p.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = 'https://via.placeholder.com/800x480?text=Bild+nicht+verfügbar'; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="font-display text-xl font-semibold text-white">{p.title}</h3>
                    <p className="text-white/80 text-sm line-clamp-2">{p.excerpt}</p>
                  </div>
                </div>
                <div className="p-4">
                  <div className="mt-1 flex justify-end">
                    <Button variant="outline" size="sm" className="gap-2" asChild>
                      <Link to={`/blog?post=${p.id}`}>
                        Öffnen <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <ListChecks className="h-5 w-5 text-primary" />
            <h2 className="font-display text-2xl font-semibold">Ausführliche Tipps</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {travelTips.map((t) => (
              <div key={t.id} className="rounded-xl bg-card border border-border p-6 shadow-card">
                <div className="text-2xl mb-2">{t.icon}</div>
                <h3 className="font-display text-xl font-semibold mb-1">{t.title}</h3>
                <p className="text-sm text-muted-foreground">{t.content}</p>
              </div>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
};

export default Blog;
