import { Header } from '@/components/Header';
import { useEffect, useMemo, useState } from 'react';
import { Destination } from '@/types/travel';
import { fetchDestinationsCatalog } from '@/services/travelData';
import { Link } from 'react-router-dom';
import { MapPin, BookOpen, ArrowRight, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

const Guides = () => {
  const { user } = useAuth();
  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || "jannik.jonen@gmail.com";
  const isAdmin = !!user && !!adminEmail && user.email === adminEmail;
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
                <Button asChild variant="outline">
                  <Link to="/admin/review" className="gap-2">Beiträge prüfen</Link>
                </Button>
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
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = 'https://via.placeholder.com/800x480?text=Bild+nicht+verfügbar'; }} />
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
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/guides/${d.id}`} className="gap-2">Details <ArrowRight className="h-4 w-4" /></Link>
                    </Button>
                    <a
                      href={`https://www.lonelyplanet.com/search?q=${encodeURIComponent(d.name)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center rounded-md border border-border px-3 py-2 text-sm hover:bg-muted"
                    >
                      Lonely Planet <ExternalLink className="h-4 w-4 ml-1" />
                    </a>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <a
                      href={`https://www.urlaubsguru.de/?s=${encodeURIComponent(d.name)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center rounded-md border border-border px-3 py-2 text-sm hover:bg-muted"
                    >
                      Urlaubsguru <ExternalLink className="h-4 w-4 ml-1" />
                    </a>
                    <a
                      href={`https://www.google.com/search?q=${encodeURIComponent(`${d.name} BetterBeyond Blog`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center rounded-md border border-border px-3 py-2 text-sm hover:bg-muted"
                    >
                      BetterBeyond <ExternalLink className="h-4 w-4 ml-1" />
                    </a>
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

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-2xl font-semibold">Redaktionelle Beiträge</h2>
            <Button asChild variant="ghost">
              <Link to="/blog" className="gap-2">Zum Blog <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </div>
          <div className="rounded-xl bg-card border border-border p-4 text-sm text-muted-foreground">
            Im Blog findest du ausführliche Artikel und Guides. Die Inspiration‑Seite zeigt kompakte Ideen – hier geht es tiefer in die Planung.
          </div>
        </section>
      </main>
    </div>
  );
};

export default Guides;
