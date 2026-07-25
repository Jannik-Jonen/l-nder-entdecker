import { Globe2, ListChecks, TrendingUp } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface HeroSectionProps {
  tripName: string;
  totalCountries: number;
  completedTasks: number;
  totalTasks: number;
}

export const HeroSection = ({ tripName, totalCountries, completedTasks, totalTasks }: HeroSectionProps) => {
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const stats = [
    {
      icon: Globe2,
      value: totalCountries,
      label: totalCountries === 1 ? 'Reiseziel' : 'Reiseziele',
      sub: totalCountries === 0 ? 'Zeit für Nummer 1' : 'in deiner Planung',
    },
    {
      icon: ListChecks,
      value: totalTasks > 0 ? `${completedTasks}/${totalTasks}` : '–',
      label: 'Aufgaben',
      sub: totalTasks === 0 ? 'noch keine offen' : `${totalTasks - completedTasks} offen`,
    },
    {
      icon: TrendingUp,
      value: `${progress}%`,
      label: 'Fortschritt',
      sub:
        progress === 100
          ? 'Alles bereit ✨'
          : progress >= 50
          ? 'Guter Zwischenstand'
          : 'Auf gutem Weg',
    },
  ];

  return (
    <section className="relative overflow-hidden rounded-2xl gradient-hero p-8 md:p-10 text-primary-foreground shadow-elevated">
      <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-primary-foreground/10 blur-3xl" />
      <div className="absolute -bottom-32 -left-24 h-64 w-64 rounded-full bg-accent/25 blur-3xl" />

      <div className="relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-foreground/15 backdrop-blur-sm text-xs font-medium uppercase tracking-wider mb-4">
          Reise-Cockpit
        </div>
        <h2 className="font-display text-3xl md:text-4xl font-bold mb-2 leading-tight">
          {tripName}
        </h2>
        <p className="text-primary-foreground/80 text-base md:text-lg mb-8 max-w-xl">
          Deine zentrale Übersicht: Reiseziele, offene Aufgaben und Fortschritt auf einen Blick.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="flex items-center gap-4 rounded-xl bg-primary-foreground/10 backdrop-blur-sm p-4 border border-primary-foreground/10"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary-foreground/20 shrink-0">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="font-display text-2xl font-bold leading-none">{stat.value}</p>
                  <p className="text-sm font-medium mt-1">{stat.label}</p>
                  <p className="text-xs text-primary-foreground/70">{stat.sub}</p>
                </div>
              </div>
            );
          })}
        </div>

        {totalTasks > 0 && (
          <div className="max-w-md">
            <div className="flex items-center justify-between text-xs text-primary-foreground/80 mb-1.5">
              <span>Gesamtfortschritt</span>
              <span>{progress}%</span>
            </div>
            <Progress
              value={progress}
              size="sm"
              className="bg-primary-foreground/15 [&>div]:bg-primary-foreground"
            />
          </div>
        )}
      </div>
    </section>
  );
};
