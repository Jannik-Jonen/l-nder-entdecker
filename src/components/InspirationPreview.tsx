import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, DollarSign, FileCheck, MapPin, ShieldCheck, Syringe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState } from 'react';
import { Destination } from '@/types/travel';
import { fetchDestinationsCatalog } from '@/services/travelData';
import { inspirationDestinations } from '@/data/mockData';

export const InspirationPreview = () => {
  const [catalog, setCatalog] = useState<Destination[]>([]);
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchDestinationsCatalog();
        setCatalog(Array.isArray(data) ? data : []);
      } catch {
        setCatalog([]);
      }
    };
    load();
  }, []);
  const previewDestinations = (catalog.length > 0 ? catalog : inspirationDestinations).slice(0, 3);
  const stripReplacementChar = (value: string) => value.replace(/\uFFFD/g, '');
  const typeLabels: Record<Destination['type'], string> = {
    country: 'Land',
    city: 'Stadt',
    island: 'Insel',
    region: 'Region',
  };

  return (
    <section className="py-16 bg-muted/30">
      <div className="container">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-semibold">
              Lass dich inspirieren
            </h2>
            <p className="text-muted-foreground mt-2">
              Entdecke traumhafte Reiseziele für dein nächstes Abenteuer
            </p>
          </div>
          <Button variant="ghost" asChild className="hidden sm:flex">
            <Link to="/inspiration" className="gap-2">
              Alle Ziele <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {previewDestinations.map((destination) => (
            <button
              key={destination.id}
              type="button"
              onClick={() => setSelectedDestination(destination)}
              className="group relative overflow-hidden rounded-2xl aspect-[4/3] text-left"
            >
              <img
                src={destination.imageUrl}
                alt={destination.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                onError={(e) => {
                  const code = destination.countryCode;
                  (e.currentTarget as HTMLImageElement).src = code
                    ? `https://flagcdn.com/w1280/${code.toLowerCase()}.png`
                    : 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="font-display text-xl font-semibold text-white mb-1">
                  {destination.name}
                </h3>
                <p className="text-white/80 text-sm line-clamp-2">
                  {destination.description}
                </p>
              </div>
            </button>
          ))}
        </div>
        {previewDestinations.length === 0 && (
          <div className="rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">
            Aktuell sind keine Inspirationen verfügbar.
          </div>
        )}

        <div className="mt-8 text-center sm:hidden">
          <Button variant="outline" asChild>
            <Link to="/inspiration" className="gap-2">
              Alle Ziele entdecken <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
      {selectedDestination && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/50 backdrop-blur-sm animate-fade-up"
          onClick={() => setSelectedDestination(null)}
        >
          <div
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-card shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {(() => {
              const safeSelectedName = stripReplacementChar(selectedDestination.name);
              const safeSelectedCountry = stripReplacementChar(selectedDestination.country);
              const safeSelectedDescription = selectedDestination.description
                ? stripReplacementChar(selectedDestination.description)
                : '';
              const safeHighlights = selectedDestination.highlights?.map(stripReplacementChar) || [];
              return (
                <>
                  <div className="relative h-64 overflow-hidden rounded-t-2xl">
                    <img
                      src={selectedDestination.imageUrl}
                      alt={safeSelectedName}
                      loading="lazy"
                      onError={(e) => {
                        const code = selectedDestination.countryCode;
                        (e.currentTarget as HTMLImageElement).src = code
                          ? `https://flagcdn.com/w1280/${code.toLowerCase()}.png`
                          : 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop';
                      }}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
                    <button
                      type="button"
                      onClick={() => setSelectedDestination(null)}
                      className="absolute top-4 right-4 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="secondary" className="bg-black/60 text-white backdrop-blur-sm ring-1 ring-white/20 shadow-md px-3 py-1">
                        {typeLabels[selectedDestination.type]}
                      </Badge>
                    </div>

                    <h2 className="font-display text-2xl font-bold mb-1">{safeSelectedName}</h2>
                    <p className="text-sm opacity-80 mb-4">{safeSelectedCountry}</p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                      <div className="rounded-lg bg-muted/40 p-3 flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        <div className="text-sm"><span className="font-medium">Beste Reisezeit</span><div className="text-muted-foreground">{selectedDestination.bestSeason}</div></div>
                      </div>
                      <div className="rounded-lg bg-muted/40 p-3 flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-primary" />
                        <div className="text-sm"><span className="font-medium">Budget</span><div className="text-muted-foreground">~{selectedDestination.averageDailyCost}{selectedDestination.currency ? ` ${selectedDestination.currency}` : '€'}/Tag</div></div>
                      </div>
                      <div className="rounded-lg bg-muted/40 p-3 flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        <div className="text-sm"><span className="font-medium">Kategorie</span><div className="text-muted-foreground">{typeLabels[selectedDestination.type]}</div></div>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mb-6">{safeSelectedDescription}</p>
                    {selectedDestination.source && (
                      <p className="text-xs text-muted-foreground mb-6">Quelle: {selectedDestination.source}</p>
                    )}

                    {safeHighlights.length > 0 && (
                      <div className="mb-6">
                        <div className="text-sm font-medium mb-2">Highlights</div>
                        <div className="flex flex-wrap gap-2">
                          {safeHighlights.map((h, i) => (
                            <Badge key={`${selectedDestination.id}-hl-${i}`} variant="secondary" className="px-3 py-1">
                              {h}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 gap-3 mb-6">
                      {selectedDestination.visaInfo && (
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/50">
                          <FileCheck className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                          <div className="text-sm">
                            <span className="font-medium text-blue-700 dark:text-blue-400 block mb-1">Visa & Einreise</span>
                            <p className="text-muted-foreground leading-relaxed">{selectedDestination.visaInfo}</p>
                          </div>
                        </div>
                      )}
                      
                      {selectedDestination.vaccinationInfo && (
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/50">
                          <Syringe className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                          <div className="text-sm">
                            <span className="font-medium text-emerald-700 dark:text-emerald-400 block mb-1">Impfungen & Gesundheit</span>
                            <p className="text-muted-foreground leading-relaxed">{selectedDestination.vaccinationInfo}</p>
                          </div>
                        </div>
                      )}

                      {selectedDestination.healthSafetyInfo && (
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/50">
                          <ShieldCheck className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                          <div className="text-sm">
                            <span className="font-medium text-amber-700 dark:text-amber-400 block mb-1">Sicherheit & Hinweise</span>
                            <p className="text-muted-foreground leading-relaxed">{selectedDestination.healthSafetyInfo}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          const q = encodeURIComponent(`${selectedDestination.name} Reise Informationen`);
                          window.open(`https://www.google.com/search?q=${q}`, '_blank');
                        }}
                        className="px-4 py-2 rounded-md bg-muted text-muted-foreground hover:bg-muted/90 transition text-sm"
                      >
                        Mehr Infos
                      </button>
                      <a
                        href={`https://www.google.com/search?q=${encodeURIComponent(`site:lonelyplanet.com ${selectedDestination.name}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-md bg-muted text-muted-foreground hover:bg-muted/90 transition text-sm"
                      >
                        Lonely Planet
                      </a>
                      <a
                        href={`https://www.google.com/search?q=${encodeURIComponent(`site:tripadvisor.${navigator.language?.includes('de') ? 'de' : 'com'} ${selectedDestination.name}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-md bg-muted text-muted-foreground hover:bg-muted/90 transition text-sm"
                      >
                        TripAdvisor
                      </a>
                      <a
                        href={`https://www.google.com/search?q=${encodeURIComponent(`site:numbeo.com ${selectedDestination.name}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-md bg-muted text-muted-foreground hover:bg-muted/90 transition text-sm"
                      >
                        Numbeo
                      </a>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </section>
  );
};
