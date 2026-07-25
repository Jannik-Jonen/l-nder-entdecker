import { Country } from '@/types/travel';
import { Progress } from '@/components/ui/progress';
import { format, differenceInDays } from 'date-fns';
import { de } from 'date-fns/locale';
import { MapPin, Calendar, ArrowRight, Clock } from 'lucide-react';

interface CountryCardProps {
  country: Country;
  onClick: () => void;
  index: number;
}

export const CountryCard = ({ country, onClick, index }: CountryCardProps) => {
  const completedTodos = country.todos.filter((t) => t.completed).length;
  const totalTodos = country.todos.length;
  const progress = totalTodos > 0 ? (completedTodos / totalTodos) * 100 : 0;
  const daysUntil = differenceInDays(new Date(country.startDate), new Date());

  const getProgressVariant = () => {
    if (progress === 100) return 'success';
    if (progress >= 50) return 'warning';
    return 'default';
  };

  const countdownLabel =
    daysUntil > 0
      ? `In ${daysUntil} Tagen`
      : daysUntil === 0
      ? 'Heute'
      : daysUntil > -30
      ? 'Läuft gerade'
      : 'Abgeschlossen';

  return (
    <button
      onClick={onClick}
      className="group relative w-full overflow-hidden rounded-2xl bg-card border border-border/60 shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 hover:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 text-left"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={country.imageUrl}
          alt={country.name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={(e) => {
            const code = country.code;
            (e.currentTarget as HTMLImageElement).src = code
              ? `https://flagcdn.com/w1280/${code.toLowerCase()}.png`
              : 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/30 to-transparent" />

        {/* Countdown badge */}
        <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-background/90 backdrop-blur-sm text-xs font-medium shadow-sm">
          <Clock className="h-3 w-3 text-primary" />
          {countdownLabel}
        </div>

        {/* Country name */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center gap-1.5 text-primary-foreground/90 text-xs uppercase tracking-wider mb-1">
            <MapPin className="h-3 w-3" />
            <span>Destination</span>
          </div>
          <h3 className="font-display text-2xl font-bold text-primary-foreground leading-tight">
            {country.name}
          </h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <Calendar className="h-4 w-4 text-primary" />
          <span>
            {format(new Date(country.startDate), 'dd. MMM', { locale: de })} –{' '}
            {format(new Date(country.endDate), 'dd. MMM yyyy', { locale: de })}
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Vorbereitung</span>
            <span className="font-medium tabular-nums">
              {totalTodos > 0 ? `${completedTodos}/${totalTodos}` : '—'}
            </span>
          </div>
          <Progress value={progress} variant={getProgressVariant()} size="sm" />
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-border/50">
          <span className="text-xs text-muted-foreground">
            {progress === 100 ? 'Startklar' : `${Math.round(progress)}% erledigt`}
          </span>
          <span className="inline-flex items-center gap-1 text-primary font-medium text-sm group-hover:gap-2 transition-all">
            Öffnen
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </button>
  );
};
