import { useState } from 'react';
import { Header } from '@/components/Header';
import { inspirationDestinations } from '@/data/mockData';
import { Destination } from '@/types/travel';
import { MapPin, Calendar, DollarSign, Sparkles, Palmtree, Building2, Globe, Mountain } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const typeIcons: Record<Destination['type'], React.ElementType> = {
  country: Globe,
  island: Palmtree,
  city: Building2,
  region: Mountain,
};

const typeLabels: Record<Destination['type'], string> = {
  country: 'Land',
  island: 'Insel',
  city: 'Stadt',
  region: 'Region',
};

const Inspiration = () => {
  const [selectedType, setSelectedType] = useState<Destination['type'] | 'all'>('all');
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);

  const filteredDestinations = selectedType === 'all'
    ? inspirationDestinations
    : inspirationDestinations.filter((d) => d.type === selectedType);

  const types: Array<Destination['type'] | 'all'> = ['all', 'country', 'island', 'city', 'region'];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8">
        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-2xl gradient-hero p-8 md:p-12 text-primary-foreground mb-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-foreground/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-6 w-6" />
              <span className="text-sm font-medium uppercase tracking-wide opacity-80">Entdecke</span>
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">Reise-Inspirationen</h1>
            <p className="text-primary-foreground/80 text-lg max-w-2xl">
              Lass dich von atemberaubenden Destinationen inspirieren und finde dein nächstes Abenteuer
            </p>
          </div>
        </section>

        {/* Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {types.map((type) => {
            const Icon = type === 'all' ? Globe : typeIcons[type];
            return (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all",
                  selectedType === type
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                <Icon className="h-4 w-4" />
                {type === 'all' ? 'Alle' : typeLabels[type]}
              </button>
            );
          })}
        </div>

        {/* Destination Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDestinations.map((destination, index) => {
            const TypeIcon = typeIcons[destination.type];
            return (
              <button
                key={destination.id}
                onClick={() => setSelectedDestination(destination)}
                className="group relative overflow-hidden rounded-xl bg-card shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 text-left animate-fade-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={destination.imageUrl}
                    alt={destination.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent" />

                  <div className="absolute top-3 left-3">
                    <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                      <TypeIcon className="h-3 w-3 mr-1" />
                      {typeLabels[destination.type]}
                    </Badge>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 text-primary-foreground">
                    <h3 className="font-display text-xl font-semibold">{destination.name}</h3>
                    <p className="text-sm opacity-80">{destination.country}</p>
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {destination.description}
                  </p>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{destination.bestSeason}</span>
                    </div>
                    <div className="flex items-center gap-1 font-medium text-primary">
                      <DollarSign className="h-4 w-4" />
                      <span>~{destination.averageDailyCost}€/Tag</span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Detail Modal */}
        {selectedDestination && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/50 backdrop-blur-sm animate-fade-up"
            onClick={() => setSelectedDestination(null)}
          >
            <div
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-card shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={selectedDestination.imageUrl}
                  alt={selectedDestination.name}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent" />
                <button
                  onClick={() => setSelectedDestination(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
                >
                  ✕
                </button>
                <div className="absolute bottom-6 left-6 right-6 text-primary-foreground">
                  <Badge variant="secondary" className="mb-2 bg-background/80 backdrop-blur-sm">
                    {typeLabels[selectedDestination.type]}
                  </Badge>
                  <h2 className="font-display text-3xl font-bold">{selectedDestination.name}</h2>
                  <p className="text-lg opacity-80">{selectedDestination.country}</p>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <p className="text-muted-foreground">{selectedDestination.description}</p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl bg-muted/50 p-4">
                    <div className="flex items-center gap-2 mb-2 text-primary">
                      <Calendar className="h-5 w-5" />
                      <h4 className="font-medium">Beste Reisezeit</h4>
                    </div>
                    <p className="text-sm">{selectedDestination.bestSeason}</p>
                  </div>
                  <div className="rounded-xl bg-muted/50 p-4">
                    <div className="flex items-center gap-2 mb-2 text-primary">
                      <DollarSign className="h-5 w-5" />
                      <h4 className="font-medium">Tagesbudget</h4>
                    </div>
                    <p className="text-sm">~{selectedDestination.averageDailyCost} {selectedDestination.currency}/Tag</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Highlights
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedDestination.highlights.map((highlight, i) => (
                      <Badge key={i} variant="outline" className="bg-primary/5">
                        {highlight}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-border mt-16 py-8">
        <div className="container text-center text-sm text-muted-foreground">
          <p>GlobeDetour – Dein Begleiter für unvergessliche Reisen</p>
        </div>
      </footer>
    </div>
  );
};

export default Inspiration;
