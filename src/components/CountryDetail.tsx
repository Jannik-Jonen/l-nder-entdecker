import { Country } from '@/types/travel';
import { TodoItemComponent } from './TodoItem';
import { Progress } from '@/components/ui/progress';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { ArrowLeft, Calendar, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CountryDetailProps {
  country: Country;
  onBack: () => void;
  onToggleTodo: (todoId: string) => void;
}

export const CountryDetail = ({ country, onBack, onToggleTodo }: CountryDetailProps) => {
  const completedTodos = country.todos.filter((t) => t.completed).length;
  const totalTodos = country.todos.length;
  const progress = totalTodos > 0 ? (completedTodos / totalTodos) * 100 : 0;

  const getProgressVariant = () => {
    if (progress === 100) return 'success';
    if (progress >= 50) return 'warning';
    return 'default';
  };

  return (
    <div className="animate-fade-up">
      {/* Back button */}
      <Button
        variant="ghost"
        onClick={onBack}
        className="mb-6 -ml-2 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Zurück zur Übersicht
      </Button>

      {/* Hero image */}
      <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden mb-8">
        <img
          src={country.imageUrl}
          alt={country.name}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent" />
        
        <div className="absolute bottom-6 left-6 right-6 text-primary-foreground">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="h-5 w-5" />
            <span className="text-sm font-medium uppercase tracking-wide opacity-80">Reiseziel</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold">{country.name}</h1>
        </div>
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="rounded-xl bg-card p-5 shadow-card">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="h-5 w-5 text-primary" />
            <h3 className="font-medium">Reisezeitraum</h3>
          </div>
          <p className="text-lg font-semibold">
            {format(new Date(country.startDate), 'dd. MMMM', { locale: de })} –{' '}
            {format(new Date(country.endDate), 'dd. MMMM yyyy', { locale: de })}
          </p>
        </div>

        <div className="rounded-xl bg-card p-5 shadow-card">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium">Vorbereitungsstatus</h3>
            <span className="text-lg font-bold text-primary">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} variant={getProgressVariant()} size="lg" />
          <p className="mt-2 text-sm text-muted-foreground">
            {completedTodos} von {totalTodos} Aufgaben erledigt
          </p>
        </div>
      </div>

      {/* Todo list */}
      <div className="rounded-xl bg-card p-6 shadow-card">
        <h2 className="font-display text-2xl font-semibold mb-6">To-do Liste</h2>
        <div className="space-y-3">
          {country.todos.map((todo) => (
            <TodoItemComponent
              key={todo.id}
              todo={todo}
              onToggle={onToggleTodo}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
