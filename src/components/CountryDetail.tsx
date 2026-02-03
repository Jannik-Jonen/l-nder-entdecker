import { useEffect, useState } from 'react';
import { Country, PackingItem, TripStop } from '@/types/travel';
import { TodoItemComponent } from './TodoItem';
import { PackingList } from './PackingList';
import { Progress } from '@/components/ui/progress';
import { format, differenceInDays } from 'date-fns';
import { de } from 'date-fns/locale';
import { ArrowLeft, Calendar, MapPin, Clock, Sun, Cloud, CloudRain, Snowflake, Plane, Hotel, Utensils, Camera, DollarSign, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LocationSearch, LocationResult } from '@/components/LocationSearch';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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

const replaceUmlauts = (s: string) =>
  s
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss');

const baseNormalize = (raw: string) =>
  replaceUmlauts(raw.toLowerCase().trim()).replace(/[-_]/g, ' ').replace(/\s+/g, ' ').replace(/\W+/g, '');

const levenshtein = (a: string, b: string) => {
  const m = a.length;
  const n = b.length;
  const dp = Array.from({ length: m + 1 }, () => new Array<number>(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  return dp[m][n];
};

const canonicalize = (name: string, category: PackingItem['category']) => {
  const n = baseNormalize(name);
  if (category === 'clothing') {
    const candidates = ['tshirts', 'socken', 'unterwaesche', 'hosen', 'jacke', 'regenjacke', 'schuhe', 'badekleidung'];
    let best = n;
    let bestScore = Number.POSITIVE_INFINITY;
    for (const c of candidates) {
      const d = levenshtein(n, c);
      if (d < bestScore) {
        bestScore = d;
        best = c;
      }
    }
    if (bestScore <= 2) return best;
  }
  return n;
};

const dedupePackingItems = (items: PackingItem[]) => {
  const map = new Map<string, PackingItem>();
  for (const item of items) {
    const key = `${item.category}:${canonicalize(item.name, item.category)}`;
    const existing = map.get(key);
    if (!existing) {
      map.set(key, item);
    } else {
      const merged: PackingItem = {
        ...existing,
        packed: existing.packed || item.packed,
        quantity: Math.max(
          typeof existing.quantity === 'number' ? existing.quantity : 1,
          typeof item.quantity === 'number' ? item.quantity : 1
        ),
      };
      map.set(key, merged);
    }
  }
  return Array.from(map.values());
};

export const CountryDetail = ({ country, onBack, onToggleTodo }: CountryDetailProps) => {
  const [packingItems, setPackingItems] = useState<PackingItem[]>(country.packingList || []);
  const [selectedCity, setSelectedCity] = useState<string>(() => {
    try { return localStorage.getItem(`tripCity::${country.id}`) || ''; } catch { return ''; }
  });
  const [stops, setStops] = useState<TripStop[]>(country.stops || []);
  const [newPoi, setNewPoi] = useState<string>('');
  const [eurAmount, setEurAmount] = useState<string>('100');
  const [rate, setRate] = useState<number | null>(null);
  const [converted, setConverted] = useState<number | null>(null);

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

  const persistPackingList = async (nextItems: PackingItem[]) => {
    try {
      const { data } = await supabase
        .from('saved_trips')
        .select('notes')
        .eq('id', country.id)
        .limit(1)
        .maybeSingle();
      let notes: { [key: string]: unknown; packingList?: PackingItem[] } = {};
      try {
        notes = data?.notes ? (JSON.parse(data.notes as string) as { [key: string]: unknown; packingList?: PackingItem[] }) : {};
      } catch {
        notes = {};
      }
      notes.packingList = nextItems;
      const { error } = await supabase
        .from('saved_trips')
        .update({ notes: JSON.stringify(notes) })
        .eq('id', country.id);
      if (error) throw error;
    } catch {
      // ignore
    }
  };

  const handleTogglePacking = (id: string) => {
    const next = packingItems.map((item) =>
      item.id === id ? { ...item, packed: !item.packed } : item
    );
    setPackingItems(next);
    persistPackingList(next);
  };

  const handleAddPacking = (name: string, category: PackingItem['category'], quantity?: number) => {
    const qty = typeof quantity === 'number' ? quantity : 1;
    const keyToAdd = `${category}:${canonicalize(name, category)}`;
    const existingIndex = packingItems.findIndex(
      (it) => `${it.category}:${canonicalize(it.name, it.category)}` === keyToAdd
    );
    let next: PackingItem[];
    if (existingIndex >= 0) {
      next = packingItems.map((it, idx) =>
        idx === existingIndex
          ? { ...it, quantity: Math.max(typeof it.quantity === 'number' ? it.quantity : 1, qty) }
          : it
      );
    } else {
      const newItem: PackingItem = {
        id: `pack-${Date.now()}`,
        name,
        packed: false,
        category,
        quantity: qty,
      };
      next = [...packingItems, newItem];
    }
    next = dedupePackingItems(next);
    setPackingItems(next);
    persistPackingList(next);
  };

  const handleDeletePacking = (id: string) => {
    const next = packingItems.filter((item) => item.id !== id);
    setPackingItems(next);
    persistPackingList(next);
  };

  const handleChangePackingQuantity = (id: string, quantity: number) => {
    let next = packingItems.map((item) =>
      item.id === id ? { ...item, quantity } : item
    );
    next = dedupePackingItems(next);
    setPackingItems(next);
    persistPackingList(next);
  };

  const handleCitySelect = (loc: LocationResult) => {
    if (loc.type !== 'city' && loc.type !== 'town' && loc.type !== 'village') return;
    setSelectedCity(loc.name);
    try {
      localStorage.setItem(`tripCity::${country.id}`, loc.name);
    } catch (e) {
      // ignore
    }
    const stop: TripStop = {
      id: `stop-${Date.now()}`,
      name: loc.name,
      type: 'city',
      tips: [
        'Free Walking Tour',
        'Museen und Pässe prüfen',
        'ÖPNV‑Apps installieren',
        'Lokale Märkte besuchen',
      ],
    };
    const next = [...stops, stop];
    setStops(next);
    persistStops(next);
  };
  const addPoi = () => {
    if (!newPoi.trim()) return;
    const stop: TripStop = {
      id: `stop-${Date.now()}`,
      name: newPoi.trim(),
      type: 'poi',
      tips: ['Öffnungszeiten prüfen', 'Tickets vorab buchen', 'Beste Besuchszeit wählen'],
    };
    const next = [...stops, stop];
    setStops(next);
    setNewPoi('');
    persistStops(next);
  };
  const persistStops = async (nextStops: TripStop[]) => {
    try {
      const { data } = await supabase
        .from('saved_trips')
        .select('notes')
        .eq('id', country.id)
        .limit(1)
        .maybeSingle();
      let notes: { stops?: TripStop[]; [key: string]: unknown } = {};
      try {
        notes = data?.notes ? (JSON.parse(data.notes as string) as { stops?: TripStop[]; [key: string]: unknown }) : {};
      } catch {
        notes = {};
      }
      notes.stops = nextStops;
      const { error } = await supabase
        .from('saved_trips')
        .update({ notes: JSON.stringify(notes) })
        .eq('id', country.id);
      if (error) throw error;
      toast.success('Stop hinzugefügt');
    } catch {
      toast.error('Speichern fehlgeschlagen');
    }
  };

  useEffect(() => {
    setPackingItems(dedupePackingItems(country.packingList || []));
  }, [country.id, country.packingList]);

  useEffect(() => {
    const fetchRate = async () => {
      if (!country.currency || country.currency === 'EUR') {
        setRate(1);
        setConverted(Number(eurAmount));
        return;
      }
      try {
        const res = await fetch(`https://api.exchangerate.host/latest?base=EUR&symbols=${encodeURIComponent(country.currency)}`);
        const data = await res.json();
        const r = data?.rates?.[country.currency] || null;
        setRate(r);
        if (r) setConverted(Math.round(Number(eurAmount) * r * 100) / 100);
      } catch {
        setRate(null);
        setConverted(null);
      }
    };
    fetchRate();
  }, [country.currency, eurAmount]);

  const flightRange = (() => {
    const cur = (country.currency || 'EUR').toUpperCase();
    if (cur === 'EUR') return '150–400 € (Europa, saisonabhängig)';
    if (['USD','CAD'].includes(cur)) return '500–900 € (Nordamerika, saisonabhängig)';
    if (['JPY','THB','VND','IDR','INR','CNY','KRW'].includes(cur)) return '600–1200 € (Asien, saisonabhängig)';
    if (['AUD','NZD'].includes(cur)) return '900–1400 € (Ozeanien, saisonabhängig)';
    return '400–1000 € (je nach Distanz & Saison)';
  })();

  return (
    <div className="animate-fade-up">
      <Button variant="ghost" onClick={onBack} className="mb-6 -ml-2 text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Zurück zur Übersicht
      </Button>

      {/* Hero image */}
      <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden mb-8">
        <img
          src={country.imageUrl}
          alt={country.name}
          className="h-full w-full object-cover"
          onError={(e) => { (e.currentTarget as HTMLImageElement).src = 'https://via.placeholder.com/1200x600?text=Bild+nicht+verfügbar'; }}
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
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="eurAmount" className="text-xs">Währungsumrechner (EUR → {country.currency || 'EUR'})</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    id="eurAmount"
                    type="number"
                    value={eurAmount}
                    onChange={(e) => setEurAmount(e.target.value)}
                    className="w-28"
                  />
                  <span className="text-sm">EUR ≈ {converted !== null ? converted : '–'} {country.currency || 'EUR'}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{rate ? `Kurs: 1 EUR ≈ ${rate} ${country.currency}` : 'Kurs nicht verfügbar'}</p>
              </div>
              <div>
                <Label className="text-xs">Flugkosten‑Spanne</Label>
                <p className="mt-1 text-sm">{flightRange}</p>
              </div>
            </div>
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
                  <img
                    src={attr.imageUrl}
                    alt={attr.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = 'https://via.placeholder.com/800x480?text=Bild+nicht+verfügbar'; }}
                  />
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
                  <img
                    src={hotel.imageUrl}
                    alt={hotel.name}
                    className="h-16 w-16 rounded-lg object-cover"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = 'https://via.placeholder.com/160x160?text=Bild'; }}
                  />
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
                  <img
                    src={rest.imageUrl}
                    alt={rest.name}
                    className="h-16 w-16 rounded-lg object-cover"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = 'https://via.placeholder.com/160x160?text=Bild'; }}
                  />
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
            <TabsTrigger value="city">Stadt auswählen</TabsTrigger>
            <TabsTrigger value="stops">Geplante Stops</TabsTrigger>
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
              onChangeQuantity={handleChangePackingQuantity}
              peopleCount={country.peopleCount || 1}
              tripDays={Math.max(1, differenceInDays(new Date(country.endDate), new Date(country.startDate)))}
            />
          </TabsContent>
          <TabsContent value="city">
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">Wähle eine Stadt für deine Vorbereitung innerhalb des Ziels.</p>
              <LocationSearch onSelect={handleCitySelect} />
              {selectedCity && (
                <p className="text-sm">
                  Ausgewählte Stadt: <span className="font-medium">{selectedCity}</span>
                </p>
              )}
            </div>
          </TabsContent>
          <TabsContent value="stops">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Input placeholder="Sehenswürdigkeit/Ort hinzufügen" value={newPoi} onChange={(e) => setNewPoi(e.target.value)} />
                <Button onClick={addPoi}>Hinzufügen</Button>
              </div>
              <div className="space-y-2">
                {stops.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Noch keine Stops geplant.</p>
                ) : (
                  stops.map((s) => (
                    <div key={s.id} className="rounded-lg border border-border p-3">
                      <div className="flex items-center justify-between">
                        <div className="font-medium text-sm">{s.name}</div>
                        <Badge variant="outline" className="text-xs">{s.type === 'city' ? 'Stadt' : 'POI'}</Badge>
                      </div>
                      {s.tips && s.tips.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {s.tips.map((t, i) => (
                            <Badge key={`${s.id}-tip-${i}`} variant="secondary">{t}</Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
