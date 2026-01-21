import { useState } from 'react';
import { Country, PackingItem } from '@/types/travel';
import { TodoItemComponent } from './TodoItem';
import { PackingList } from './PackingList';
import { Progress } from '@/components/ui/progress';
import { format, differenceInDays } from 'date-fns';
import { de } from 'date-fns/locale';
import { ArrowLeft, Calendar, MapPin, Clock, Sun, Cloud, CloudRain, Snowflake, Plane, Hotel, Utensils, Camera, DollarSign, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface CountryDetailProps {
  country: Country;
  onBack: () => void;
  onToggleTodo: (todoId: string) => void;
}

const weatherIcons = {
  sunny: Sun,
  cloudy: Cloud,
  rainy: CloudRain,
  snowy: Snowflake,
  mixed: Cloud,
};

const priceLevelLabels = {
  free: 'Kostenlos',
  low: '€',
  medium: '€€',
  high: '€€€',
};

export const CountryDetail = ({ country, onBack, onToggleTodo }: CountryDetailProps) => {
  const [packingItems, setPackingItems] = useState<PackingItem[]>([]);

  const completedTodos = country.todos.filter((t) => t.completed).length;
  const totalTodos = country.todos.length;
  const progress = totalTodos > 0 ? (completedTodos / totalTodos) * 100 : 0;
  const daysUntilTrip = differenceInDays(new Date(country.startDate), new Date());

  const getProgressVariant = () => {
    if (progress === 100) return 'success';
    if (progress >= 50) return 'warning';
    return 'default';
  };

  const WeatherIcon = country.weather ? weatherIcons[country.weather.condition] : Sun;

  const handleTogglePacking = (id: string) => {
    setPackingItems(packingItems.map((item) =>
      item.id === id ? { ...item, packed: !item.packed } : item
    ));
  };

  const handleAddPacking = (name: string, category: PackingItem['category']) => {
    const newItem: PackingItem = {
      id: `pack-${Date.now()}`,
      name,
      packed: false,
      category,
    };
    setPackingItems([...packingItems, newItem]);
  };

  const handleDeletePacking = (id: string) => {
    setPackingItems(packingItems.filter((item) => item.id !== id));
  };

  return (
    <div className="animate-fade-up">
      <Button variant="ghost" onClick={onBack} className="mb-6 -ml-2 text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Zurück zur Übersicht
      </Button>

      {/* Hero image */}
      <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden mb-8">
        <img src={country.imageUrl} alt={country.name} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6 text-primary-foreground">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="h-5 w-5" />
            <span className="text-sm font-medium uppercase tracking-wide opacity-80">Reiseziel</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold">{country.name}</h1>
        </div>
      </div>

      {/* Countdown & Info cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {daysUntilTrip > 0 && (
          <div className="rounded-xl gradient-hero p-5 text-primary-foreground">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="h-5 w-5" />
              <h3 className="font-medium">Countdown</h3>
            </div>
            <p className="text-3xl font-bold">{daysUntilTrip} Tage</p>
            <p className="text-sm opacity-80">bis zur Abreise</p>
          </div>
        )}
        <div className="rounded-xl bg-card p-5 shadow-card">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="h-5 w-5 text-primary" />
            <h3 className="font-medium">Reisezeitraum</h3>
          </div>
          <p className="text-lg font-semibold">
            {format(new Date(country.startDate), 'dd. MMM', { locale: de })} – {format(new Date(country.endDate), 'dd. MMM yyyy', { locale: de })}
          </p>
        </div>
        {country.dailyCost && (
          <div className="rounded-xl bg-card p-5 shadow-card">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="h-5 w-5 text-primary" />
              <h3 className="font-medium">Tagesbudget</h3>
            </div>
            <p className="text-lg font-semibold">~{country.dailyCost} {country.currency}/Tag</p>
          </div>
        )}
      </div>

      {/* Progress */}
      <div className="rounded-xl bg-card p-5 shadow-card mb-8">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium">Vorbereitungsstatus</h3>
          <span className="text-lg font-bold text-primary">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} variant={getProgressVariant()} size="lg" />
        <p className="mt-2 text-sm text-muted-foreground">{completedTodos} von {totalTodos} Aufgaben erledigt</p>
      </div>

      {/* Weather */}
      {country.weather && (
        <div className="rounded-xl bg-card p-6 shadow-card mb-8">
          <h2 className="font-display text-xl font-semibold mb-4 flex items-center gap-2">
            <WeatherIcon className="h-5 w-5 text-primary" />
            Wetter & Klima
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-2xl font-bold">{country.weather.averageTemp}°C</p>
              <p className="text-sm text-muted-foreground">Durchschnittstemperatur</p>
              <p className="mt-2 text-sm"><strong>Beste Reisezeit:</strong> {country.weather.bestTimeToVisit}</p>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Packtipps:</p>
              <div className="flex flex-wrap gap-1">
                {country.weather.packingTips.map((tip, i) => (
                  <Badge key={i} variant="secondary">{tip}</Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Attractions */}
      {country.attractions && country.attractions.length > 0 && (
        <div className="rounded-xl bg-card p-6 shadow-card mb-8">
          <h2 className="font-display text-xl font-semibold mb-4 flex items-center gap-2">
            <Camera className="h-5 w-5 text-primary" />
            Sehenswürdigkeiten
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {country.attractions.map((attr) => (
              <a
                key={attr.id}
                href={attr.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-lg overflow-hidden border border-border hover:border-primary hover:shadow-lg transition-all duration-300"
              >
                <div className="relative h-32 overflow-hidden">
                  <img src={attr.imageUrl} alt={attr.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  {attr.externalUrl && (
                    <div className="absolute top-2 right-2 p-1.5 rounded-full bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ExternalLink className="h-3 w-3" />
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <h4 className="font-medium group-hover:text-primary transition-colors">{attr.name}</h4>
                  <p className="text-xs text-muted-foreground line-clamp-2">{attr.description}</p>
                  <div className="flex items-center justify-between mt-2">
                    {attr.rating && <span className="text-xs">⭐ {attr.rating}</span>}
                    {attr.priceLevel && <Badge variant="outline" className="text-xs">{priceLevelLabels[attr.priceLevel]}</Badge>}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Hotels & Restaurants Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {country.hotels && country.hotels.length > 0 && (
          <div className="rounded-xl bg-card p-6 shadow-card">
            <h2 className="font-display text-xl font-semibold mb-4 flex items-center gap-2">
              <Hotel className="h-5 w-5 text-primary" />
              Hotelvorschläge
            </h2>
            <div className="space-y-3">
              {country.hotels.map((hotel) => (
                <a
                  key={hotel.id}
                  href={hotel.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex gap-3 p-3 rounded-lg bg-muted/50 hover:bg-primary/10 transition-colors"
                >
                  <img src={hotel.imageUrl} alt={hotel.name} className="h-16 w-16 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm group-hover:text-primary transition-colors flex items-center gap-1">
                      {hotel.name}
                      <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h4>
                    <p className="text-xs text-muted-foreground">ab {hotel.pricePerNight}€/Nacht • ⭐ {hotel.rating}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {country.restaurants && country.restaurants.length > 0 && (
          <div className="rounded-xl bg-card p-6 shadow-card">
            <h2 className="font-display text-xl font-semibold mb-4 flex items-center gap-2">
              <Utensils className="h-5 w-5 text-primary" />
              Restaurants
            </h2>
            <div className="space-y-3">
              {country.restaurants.map((rest) => (
                <a
                  key={rest.id}
                  href={rest.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex gap-3 p-3 rounded-lg bg-muted/50 hover:bg-primary/10 transition-colors"
                >
                  <img src={rest.imageUrl} alt={rest.name} className="h-16 w-16 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm group-hover:text-primary transition-colors flex items-center gap-1">
                      {rest.name}
                      <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h4>
                    <p className="text-xs text-muted-foreground">{rest.cuisine} • {priceLevelLabels[rest.priceLevel]} • ⭐ {rest.rating}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Flights */}
      {country.flights && country.flights.length > 0 && (
        <div className="rounded-xl bg-card p-6 shadow-card mb-8">
          <h2 className="font-display text-xl font-semibold mb-4 flex items-center gap-2">
            <Plane className="h-5 w-5 text-primary" />
            Flugverbindungen
          </h2>
          <div className="space-y-3">
            {country.flights.map((flight) => (
              <a
                key={flight.id}
                href={flight.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-primary/10 transition-colors"
              >
                <div>
                  <p className="font-medium group-hover:text-primary transition-colors flex items-center gap-1">
                    {flight.airline}
                    <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </p>
                  <p className="text-sm text-muted-foreground">{flight.departureCity} → {flight.arrivalCity}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-primary">{flight.priceRange}</p>
                  <p className="text-xs text-muted-foreground">{flight.duration} • {flight.stops === 0 ? 'Direkt' : `${flight.stops} Stopp`}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Todo & Packing Tabs */}
      <div className="rounded-xl bg-card p-6 shadow-card">
        <Tabs defaultValue="todos">
          <TabsList className="mb-4">
            <TabsTrigger value="todos">To-do Liste</TabsTrigger>
            <TabsTrigger value="packing">Packliste</TabsTrigger>
          </TabsList>
          <TabsContent value="todos">
            <div className="space-y-3">
              {country.todos.map((todo) => (
                <TodoItemComponent key={todo.id} todo={todo} onToggle={onToggleTodo} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="packing">
            <PackingList
              items={packingItems}
              onToggle={handleTogglePacking}
              onAdd={handleAddPacking}
              onDelete={handleDeletePacking}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};