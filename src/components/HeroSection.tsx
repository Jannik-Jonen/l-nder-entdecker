import { Globe, CheckCircle2, Clock } from 'lucide-react';

interface HeroSectionProps {
  tripName: string;
  totalCountries: number;
  completedTasks: number;
  totalTasks: number;
}

export const HeroSection = ({ tripName, totalCountries, completedTasks, totalTasks }: HeroSectionProps) => {
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <section className="relative overflow-hidden rounded-2xl gradient-hero p-8 md:p-12 text-primary-foreground mb-8">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary-foreground/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
      
      <div className="relative z-10">
        <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">{tripName}</h1>
        <p className="text-primary-foreground/80 text-lg mb-8">
          Deine zentrale Übersicht für alle Reisevorbereitungen
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-foreground/20">
              <Globe className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalCountries}</p>
              <p className="text-sm text-primary-foreground/70">Länder</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-foreground/20">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{completedTasks}/{totalTasks}</p>
              <p className="text-sm text-primary-foreground/70">Aufgaben erledigt</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-foreground/20">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{progress}%</p>
              <p className="text-sm text-primary-foreground/70">Gesamtfortschritt</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
