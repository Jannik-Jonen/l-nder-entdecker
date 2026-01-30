import { Header } from '@/components/Header';
import { inspirationDestinations } from '@/data/mockData';
import { Link } from 'react-router-dom';
import { MapPin, BookOpen, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Guides = () => {
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

        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {inspirationDestinations.map((d) => (
              <Link
                key={d.id}
                to={`/guides/${d.id}`}
                className="group relative overflow-hidden rounded-xl bg-card border border-border hover:shadow-card-hover transition-all"
              >
                <div className="relative h-40">
                  <img
                    src={d.imageUrl}
                    alt={d.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = 'https://via.placeholder.com/800x480?text=Bild+nicht+verfügbar'; }}
                  />
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
                  <div className="mt-3 flex justify-end">
                    <Button variant="outline" size="sm" className="gap-2">
                      Weiterlesen <ArrowRight className="h-4 w-4" />
                    </Button>
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
