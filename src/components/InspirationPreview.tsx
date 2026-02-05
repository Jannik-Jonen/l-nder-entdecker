import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { Destination } from '@/types/travel';
import { fetchDestinationsCatalog } from '@/services/travelData';

export const InspirationPreview = () => {
  const [catalog, setCatalog] = useState<Destination[]>([]);
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
  const previewDestinations = catalog.slice(0, 3);

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
            <Link
              key={destination.id}
              to="/inspiration"
              className="group relative overflow-hidden rounded-2xl aspect-[4/3]"
            >
              <img
                src={destination.imageUrl}
                alt={destination.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
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
            </Link>
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
    </section>
  );
};
