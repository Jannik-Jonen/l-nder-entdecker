import { Header } from '@/components/Header';
import { inspirationDestinations } from '@/data/mockData';
import { useParams, Link } from 'react-router-dom';
import { Destination } from '@/types/travel';
import { ArrowLeft, MapPin, Info, ShieldCheck, Syringe, ListChecks, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const GuideDetail = () => {
  const { id } = useParams();
  const dest: Destination | undefined = inspirationDestinations.find((d) => d.id === id);

  if (!dest) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-20 text-center">
          <div className="text-muted-foreground">Guide nicht gefunden</div>
          <Link to="/guides" className="mt-4 inline-block text-primary underline">
            Zur Übersicht
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        <Button variant="ghost" asChild className="mb-4 -ml-2 text-muted-foreground hover:text-foreground">
          <Link to="/guides">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Zurück zu den Guides
          </Link>
        </Button>

        <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden mb-8">
          <img
            src={dest.imageUrl}
            alt={dest.name}
            className="h-full w-full object-cover"
            onError={(e) => { (e.currentTarget as HTMLImageElement).src = 'https://via.placeholder.com/1200x600?text=Bild+nicht+verfügbar'; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 text-primary-foreground">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="h-5 w-5" />
              <span className="text-sm font-medium uppercase tracking-wide opacity-80">{dest.country}</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold">{dest.name}</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="rounded-xl bg-card p-6 shadow-card">
            <h2 className="font-display text-xl font-semibold mb-2 flex items-center gap-2">
              <Info className="h-5 w-5 text-primary" />
              Überblick
            </h2>
            <p className="text-sm text-muted-foreground">{dest.description}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {dest.highlights.slice(0, 4).map((h) => (
                <Badge key={h} variant="outline" className="text-xs">
                  <Star className="h-3 w-3 mr-1 text-primary" />
                  {h}
                </Badge>
              ))}
            </div>
          </div>

          <div className="rounded-xl bg-card p-6 shadow-card">
            <h2 className="font-display text-xl font-semibold mb-2 flex items-center gap-2">
              <ListChecks className="h-5 w-5 text-primary" />
              Reiseinfos
            </h2>
            <div className="text-sm text-muted-foreground space-y-2">
              <div className="flex items-center justify-between">
                <span>Beste Reisezeit</span>
                <Badge variant="outline">{dest.bestSeason}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Ø Tagesbudget</span>
                <Badge variant="outline">~{dest.averageDailyCost} {dest.currency}</Badge>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-card p-6 shadow-card">
            <h2 className="font-display text-xl font-semibold mb-2 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              Einreise & Sicherheit
            </h2>
            <div className="space-y-3 text-sm text-muted-foreground">
              {dest.visaInfo && <p>{dest.visaInfo}</p>}
              {dest.healthSafetyInfo && <p>{dest.healthSafetyInfo}</p>}
            </div>
          </div>
        </div>

        {dest.vaccinationInfo && (
          <div className="rounded-xl bg-card p-6 shadow-card mb-8">
            <h2 className="font-display text-xl font-semibold mb-2 flex items-center gap-2">
              <Syringe className="h-5 w-5 text-primary" />
              Impfungen
            </h2>
            <p className="text-sm text-muted-foreground">{dest.vaccinationInfo}</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default GuideDetail;
