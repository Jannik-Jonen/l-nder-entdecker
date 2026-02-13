import { Header } from '@/components/Header';
import { useEffect, useMemo, useState } from 'react';
import { Destination } from '@/types/travel';
import { fetchDestinationsCatalog } from '@/services/travelData';
import { Link } from 'react-router-dom';
import { MapPin, BookOpen, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { supabaseUntyped } from '@/lib/supabase-untyped';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

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
  const [catalogLoading, setCatalogLoading] = useState(false);
  const [currentParentId, setCurrentParentId] = useState<string | null>(null);
  useEffect(() => {
    const load = async () => {
      setCatalogLoading(true);
      try {
        const data = await fetchDestinationsCatalog();
        setCatalog(Array.isArray(data) ? data : []);
      } catch {
        setCatalog([]);
      } finally {
        setCatalogLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (!user) { setIsAdmin(false); return; }
    supabase.rpc('has_role', { _user_id: user.id, _role: 'admin' }).then(({ data }) => setIsAdmin(!!data));
  }, [user]);

  useEffect(() => {
    const loadPosts = async () => {
      const { data } = await supabaseUntyped
        .from('guide_posts')
        .select('id,title,excerpt,image_url,destination_id,tags')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(6);
      if (data && Array.isArray(data)) setGuidePosts(data as unknown as GuidePostRow[]);
    };
    loadPosts();
  }, []);
  const sourceList = catalog;
  const [currentPath, setCurrentPath] = useState<Destination[]>([]);
  useEffect(() => {
    if (!currentParentId) {
      setCurrentPath([]);
      return;
    }
    const map = new Map(sourceList.map((d) => [d.id, d]));
    const path: Destination[] = [];
    let current = map.get(currentParentId);
    while (current) {
      path.unshift(current);
      current = current.parentId ? map.get(current.parentId) : undefined;
    }
    setCurrentPath(path);
  }, [currentParentId, sourceList]);
  const rootList = useMemo(() => sourceList.filter((d) => !d.parentId), [sourceList]);
  const visibleList = useMemo(() => {
    if (!currentParentId) return rootList;
    return sourceList.filter((d) => d.parentId === currentParentId);
  }, [currentParentId, rootList, sourceList]);
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
              <span className="text-sm font-medium uppercase tracking-wide opacity-80">Guides</span>
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">Orts-Guides & Beiträge</h1>
            <p className="text-primary-foreground/80 text-lg max-w-2xl">
              Inspirierende Artikel und praktische Hinweise zu den schönsten Orten der Welt.
            </p>
          </div>
        </section>

        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-2xl font-semibold">Ziel‑Guides</h2>
            <div className="flex items-center gap-2">
              {user && (
                <Button asChild variant="default">
                  <Link to="/guides/create" className="gap-2">Beitrag erstellen</Link>
                </Button>
              )}
              {isAdmin && (
                <>
                  <Button asChild variant="outline">
                    <Link to="/admin/destinations" className="gap-2">Destinationen</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link to="/admin/review" className="gap-2">Beiträge prüfen</Link>
                  </Button>
                </>
              )}
              <Button asChild variant="ghost">
                <Link to="/inspiration" className="gap-2">Zur Inspiration <ArrowRight className="h-4 w-4" /></Link>
              </Button>
            </div>
          </div>
          <div className="rounded-xl bg-card border border-border p-4 mb-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="text-sm text-muted-foreground">
                {catalogLoading ? 'Katalog wird geladen…' : 'Hierarchisch stöbern'}
              </div>
              {currentParentId && (
                <Button variant="outline" size="sm" onClick={() => setCurrentParentId(null)}>
                  Zur obersten Ebene
                </Button>
              )}
            </div>
            {currentPath.length > 0 && (
              <Breadcrumb className="mt-3">
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <button type="button" onClick={() => setCurrentParentId(null)}>Alle Ziele</button>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  {currentPath.map((entry, index) => (
                    <BreadcrumbItem key={entry.id}>
                      <BreadcrumbSeparator />
                      {index === currentPath.length - 1 ? (
                        <BreadcrumbPage>{entry.name}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink asChild>
                          <button type="button" onClick={() => setCurrentParentId(entry.id)}>{entry.name}</button>
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
            )}
            <div className="mt-4 flex flex-wrap gap-2">
              {(currentParentId ? visibleList : rootList).slice(0, 16).map((d) => (
                <Button key={d.id} variant="outline" size="sm" onClick={() => setCurrentParentId(d.id)}>
                  {d.name}
                </Button>
              ))}
              {!catalogLoading && (currentParentId ? visibleList : rootList).length === 0 && (
                <div className="text-sm text-muted-foreground">Keine Unterziele gefunden</div>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleList.map((d) => (
              <div key={d.id} className="group relative overflow-hidden rounded-xl bg-card border border-border hover:shadow-card-hover transition-all">
                <div className="relative h-40">
                  <img src={d.imageUrl} alt={d.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      const code = d.countryCode;
                      (e.currentTarget as HTMLImageElement).src = code
                        ? `https://flagcdn.com/w1280/${code.toLowerCase()}.png`
                        : 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop';
                    }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="font-display text-xl font-semibold text-white">{d.name}</h3>
                    <p className="text-white/80 text-sm line-clamp-2">{d.description}</p>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <MapPin className="h-4 w-4" />
                    <span>{d.country}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-sm text-muted-foreground">
                    <span>Beste Reisezeit: {d.bestSeason}</span>
                    <span>Ø {d.averageDailyCost} {d.currency}/Tag</span>
                  </div>
                  <div className="mt-3">
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/guides/${d.id}`} className="gap-2">Details <ArrowRight className="h-4 w-4" /></Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {!catalogLoading && visibleList.length === 0 && (
            <div className="mt-6 rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">
              Keine Ziele im Katalog gefunden.
            </div>
          )}
        </section>

        {guidePosts.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-2xl font-semibold">Neueste Guide-Beiträge</h2>
              <Button asChild variant="ghost">
                <Link to="/blog" className="gap-2">Alle Beiträge <ArrowRight className="h-4 w-4" /></Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {guidePosts.map((p) => {
                const dest = catalog.find((d) => d.id === p.destination_id);
                return (
                  <Link
                    key={p.id}
                    to={`/guides/posts/${p.id}`}
                    className="group relative overflow-hidden rounded-xl bg-card border border-border hover:shadow-card-hover transition-all"
                  >
                    <div className="relative h-40">
                      <img
                        src={p.image_url}
                        alt={p.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=800'; }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="font-display text-lg font-semibold text-white">{p.title}</h3>
                        <p className="text-white/80 text-sm line-clamp-2">{p.excerpt}</p>
                      </div>
                    </div>
                    <div className="p-4 flex items-center justify-between">
                      <span className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" /> {dest?.name || 'Destination'}
                      </span>
                      <span className="text-sm text-primary">Lesen →</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-2xl font-semibold">Blog & Community</h2>
            <Button asChild variant="ghost">
              <Link to="/blog" className="gap-2">Zum Blog <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </div>
          <div className="rounded-xl bg-card border border-border p-4 text-sm text-muted-foreground">
            Im Blog findest du ausführliche Artikel, Erfahrungsberichte und Reisetipps von der Community.
          </div>
        </section>
      </main>
    </div>
  );
};

export default Guides;
