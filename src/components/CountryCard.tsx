import { Country } from '@/types/travel';
import { Progress } from '@/components/ui/progress';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { MapPin, Calendar, ArrowRight } from 'lucide-react';

interface CountryCardProps {
  country: Country;
  onClick: () => void;
  index: number;
}

export const CountryCard = ({ country, onClick, index }: CountryCardProps) => {
  const completedTodos = country.todos.filter((t) => t.completed).length;
  const totalTodos = country.todos.length;
  const progress = totalTodos > 0 ? (completedTodos / totalTodos) * 100 : 0;

  const getProgressVariant = () => {
    if (progress === 100) return 'success';
    if (progress >= 50) return 'warning';
    return 'default';
  };

  return (
    <button
      onClick={onClick}
      className="group relative w-full overflow-hidden rounded-lg bg-card shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 text-left"
      style={{
        animationDelay: `${index * 100}ms`,
      }}
    >
      {/* Image */}
      <div className="relative h-40 overflow-hidden">
        <img
          src={country.imageUrl}
          alt={country.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => { (e.currentTarget as HTMLImageElement).src = `https://source.unsplash.com/featured/?${encodeURIComponent(country.name)},landscape`; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
        
        {/* Country name overlay */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center gap-2 text-primary-foreground">
            <MapPin className="h-4 w-4" />
            <h3 className="font-display text-xl font-semibold">{country.name}</h3>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Date */}
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <Calendar className="h-4 w-4" />
          <span>
            {format(new Date(country.startDate), 'dd. MMM', { locale: de })} –{' '}
            {format(new Date(country.endDate), 'dd. MMM yyyy', { locale: de })}
          </span>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Fortschritt</span>
            <span className="font-medium">
              {completedTodos} von {totalTodos} Aufgaben
            </span>
          </div>
          <Progress value={progress} variant={getProgressVariant()} size="lg" />
        </div>

        {/* CTA */}
        <div className="flex items-center justify-end pt-2 text-primary font-medium text-sm group-hover:gap-2 transition-all">
          <span>Details ansehen</span>
          <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </button>
  );
};
