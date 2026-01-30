import { Header } from '@/components/Header';
import { guidePosts, inspirationDestinations, travelTips } from '@/data/mockData';
import { Link, useSearchParams } from 'react-router-dom';
import { BookOpen, MapPin, ArrowRight, ListChecks } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Blog = () => {
  const [searchParams] = useSearchParams();
  const destinationId = searchParams.get('destination');
  const postId = searchParams.get('post');

  const destination = inspirationDestinations.find((d) => d.id === destinationId || undefined);
  const filteredPosts = destinationId
    ? guidePosts.filter((p) => p.destinationId === destinationId)
    : guidePosts;

  const activePost = postId
    ? guidePosts.find((p) => p.id === postId)
    : undefined;

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

        {activePost && (
          <section className="mb-8">
            <div className="rounded-2xl overflow-hidden border border-border bg-card">
              <div className="relative h-56">
                <img
                  src={activePost.imageUrl}
                  alt={activePost.title}
                  className="h-full w-full object-cover"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).src = 'https://via.placeholder.com/1200x600?text=Bild+nicht+verfügbar'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className="flex items-center gap-2 mb-2 text-white/80">
                    <MapPin className="h-4 w-4" />
                    <span>
                      {(inspirationDestinations.find((d) => d.id === activePost.destinationId)?.name) || 'Destination'}
                    </span>
                  </div>
                  <h2 className="font-display text-2xl font-semibold">{activePost.title}</h2>
                  <p className="text-white/80 text-sm mt-1">{activePost.excerpt}</p>
                </div>
              </div>
            </div>
          </section>
        )}

        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-2xl font-semibold">Beiträge</h2>
            {destinationId && (
              <Button variant="ghost" asChild>
                <Link to="/blog">
                  Filter zurücksetzen
                </Link>
              </Button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((p) => (
              <div
                key={p.id}
                className="group relative overflow-hidden rounded-xl bg-card border border-border hover:shadow-card-hover transition-all"
              >
                <div className="relative h-40">
                  <img
                    src={p.imageUrl}
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
                    <span>{(inspirationDestinations.find((d) => d.id === p.destinationId)?.name) || 'Destination'}</span>
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

        <section>
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
