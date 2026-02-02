import { Header } from '@/components/Header';
import { inspirationDestinations, guidePosts } from '@/data/mockData';
import { Link } from 'react-router-dom';
import { MapPin, BookOpen, ArrowRight, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

const Guides = () => {
  const { user } = useAuth();
  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || "jannik.jonen@gmail.com";
  const isAdmin = !!user && !!adminEmail && user.email === adminEmail;
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {inspirationDestinations.map((d) => (
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
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-2xl font-semibold">Redaktionelle Beiträge</h2>
            <Button asChild variant="ghost">
              <Link to="/blog" className="gap-2">Zum Blog <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guidePosts.map((p) => (
              <Link key={p.id} to={`/blog?post=${p.id}`} className="group relative overflow-hidden rounded-xl bg-card border border-border hover:shadow-card-hover transition-all">
                <div className="relative h-40">
                  <img src={p.imageUrl} alt={p.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = 'https://via.placeholder.com/800x480?text=Bild+nicht+verfügbar'; }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="font-display text-xl font-semibold text-white">{p.title}</h3>
                    <p className="text-white/80 text-sm line-clamp-2">{p.excerpt}</p>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <MapPin className="h-4 w-4" />
                    <span>{(inspirationDestinations.find((d) => d.id === p.destinationId)?.name) || 'Destination'}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Guides;
