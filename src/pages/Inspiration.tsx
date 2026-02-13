import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { defaultTodos, inspirationDestinations } from '@/data/mockData';
import type { PackingItem, TodoItem } from '@/types/travel';
import { Destination } from '@/types/travel';
import { MapPin, Calendar, DollarSign, Sparkles, Palmtree, Building2, Globe, Mountain, Plus, FileCheck, Syringe, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { PlanTripDialog, TripPlanData } from '@/components/PlanTripDialog';
import { Loader2, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';


const typeIcons: Record<Destination['type'], React.ElementType> = {
  country: Globe,
  island: Palmtree,
  city: Building2,
  region: Mountain,
};

const typeLabels: Record<Destination['type'], string> = {
  country: 'Land',
  island: 'Insel',
  city: 'Stadt',
  region: 'Region',
};

import { fetchDestinationsCatalog } from '@/services/travelData';

const normalizeSearch = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/\uFFFD/g, '')
    .trim();

const stripReplacementChar = (value: string) => value.replace(/\uFFFD/g, '');

const displayNames = (() => {
  try {
    return {
      de: new Intl.DisplayNames(['de'], { type: 'region' }),
      en: new Intl.DisplayNames(['en'], { type: 'region' }),
    };
  } catch {
    return null;
  }
})();

const getCountryAliases = (code?: string | null) => {
  if (!code || !displayNames) return [];
  const de = displayNames.de.of(code);
  const en = displayNames.en.of(code);
  return [de, en].filter((value): value is string => Boolean(value));
};

const Inspiration = () => {
  const { user } = useAuth();
  const [selectedType, setSelectedType] = useState<Destination['type'] | 'all'>('all');
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [planningDestination, setPlanningDestination] = useState<Destination | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [catalog, setCatalog] = useState<Destination[]>([]);
  const [catalogLoading, setCatalogLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState('');
  const lastFetchKey = useRef<string | null>(null);

  useEffect(() => {
    const query = searchQuery.trim();
    const type = selectedType === 'all' ? undefined : selectedType;
    const fetchKey = `${selectedType}|${selectedType === 'all' ? '' : query}`;
    if (lastFetchKey.current === fetchKey) return;
    lastFetchKey.current = fetchKey;
    let active = true;
    const delay = query && selectedType !== 'all' ? 300 : 0;
    const handle = window.setTimeout(async () => {
      setCatalogLoading(true);
      try {
        const data = await fetchDestinationsCatalog({
          search: selectedType === 'all' ? undefined : query || undefined,
          type,
        });
        if (active) setCatalog(Array.isArray(data) ? data : []);
      } catch {
        if (active) setCatalog([]);
      } finally {
        if (active) setCatalogLoading(false);
      }
    }, delay);
    return () => {
      active = false;
      window.clearTimeout(handle);
    };
  }, [searchQuery, selectedType]);

  const defaultInspirationList = React.useMemo(() => {
    if (catalog.length === 0) return inspirationDestinations;
    const byCode = new Map<string, Destination[]>();
    catalog.forEach((item) => {
      if (!item.countryCode) return;
      const key = item.countryCode.toUpperCase();
      const list = byCode.get(key) || [];
      list.push(item);
      byCode.set(key, list);
    });
    const seen = new Set<string>();
    const ordered = inspirationDestinations.map((seed) => {
      const normalizedName = normalizeSearch(seed.name);
      const normalizedCountry = normalizeSearch(seed.country);
      const codeMatches = seed.countryCode
        ? byCode
            .get(seed.countryCode.toUpperCase())
            ?.find(
              (item) =>
                item.type === seed.type ||
                (Array.isArray(item.types) && item.types.includes(seed.type)),
            )
        : undefined;
      const nameMatch =
        codeMatches ||
        catalog.find((item) => {
          const itemName = normalizeSearch(item.name);
          const itemCountry = normalizeSearch(item.country);
          return itemName === normalizedName || itemCountry === normalizedCountry;
        });
      return nameMatch || seed;
    });
    return ordered.filter((item) => {
      const key = item.countryCode
        ? `${item.type}:${item.countryCode.toUpperCase()}`
        : `${item.type}:${normalizeSearch(item.name)}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [catalog]);

  const searchFilteredDestinations = React.useMemo(() => {
    const query = normalizeSearch(searchQuery);
    if (!query) return defaultInspirationList;
    const scored = catalog
      .filter((d) => {
        const name = normalizeSearch(d.name);
        const country = normalizeSearch(d.country);
        const description = d.description ? normalizeSearch(d.description) : '';
        if (name.includes(query) || country.includes(query) || description.includes(query)) return true;
        const aliases = getCountryAliases(d.countryCode).map(normalizeSearch);
        return aliases.some((alias) => alias.includes(query));
      })
      .map((d) => {
        const name = normalizeSearch(d.name);
        const country = normalizeSearch(d.country);
        const aliases = getCountryAliases(d.countryCode).map(normalizeSearch);
        let score = 0;
        if (name.startsWith(query)) score += 3;
        else if (name.includes(query)) score += 2;
        if (country.startsWith(query)) score += 2;
        else if (country.includes(query)) score += 1;
        if (aliases.some((alias) => alias.startsWith(query))) score += 2;
        else if (aliases.some((alias) => alias.includes(query))) score += 1;
        return { destination: d, score };
      });
    const deduped = new Map<string, { destination: Destination; score: number }>();
    scored.forEach((entry) => {
      const key = entry.destination.countryCode
        ? `${entry.destination.type}:${entry.destination.countryCode.toUpperCase()}`
        : `${entry.destination.type}:${normalizeSearch(entry.destination.name)}`;
      const existing = deduped.get(key);
      if (!existing || entry.score > existing.score) {
        deduped.set(key, entry);
      }
    });
    return Array.from(deduped.values())
      .sort((a, b) => b.score - a.score)
      .map((entry) => entry.destination);
  }, [catalog, defaultInspirationList, searchQuery]);

  const startPlanningTrip = (destination: Destination) => {
    setPlanningDestination(destination);
  };

  const handlePlanConfirm = async (data: TripPlanData) => {
    if (!planningDestination) return;
    if (!user) {
      localStorage.setItem('pendingPlan', JSON.stringify({
        destination: planningDestination,
        planData: data
      }));
      window.location.href = '/?login=1';
      return;
    }
    setIsAdding(true);

    try {
      const startIso = new Date(data.startDate).toISOString();
      const endIso = new Date(data.endDate).toISOString();
      const days =
        Math.max(
          1,
          Math.ceil((new Date(data.endDate).getTime() - new Date(data.startDate).getTime()) / (1000 * 60 * 60 * 24)),
        );

      // Generate initial packing list heuristically
      const basePacking: PackingItem[] = [
        { id: `doc-${Date.now()}`, name: 'Reisedokumente (Pass/Personalausweis)', packed: false, category: 'documents' },
        { id: `phone-${Date.now()}`, name: 'Smartphone + Ladegerät', packed: false, category: 'electronics' },
        { id: `adapter-${Date.now()}`, name: 'Steckdosenadapter (falls nötig)', packed: false, category: 'electronics' },
        { id: `sunscreen-${Date.now()}`, name: 'Sonnencreme', packed: false, category: 'toiletries' },
        { id: `meds-${Date.now()}`, name: 'Reiseapotheke', packed: false, category: 'toiletries' },
      ];
      const clothingItems: PackingItem[] = [
        { id: `tops-${Date.now()}`, name: `${days}× Oberteile`, packed: false, category: 'clothing' },
        { id: `bottoms-${Date.now()}`, name: `${Math.ceil(days / 2)}× Hosen/Röcke`, packed: false, category: 'clothing' },
        { id: `under-${Date.now()}`, name: `${days}× Unterwäsche & Socken`, packed: false, category: 'clothing' },
        { id: `shoes-${Date.now()}`, name: 'Bequeme Schuhe', packed: false, category: 'clothing' },
        { id: `jacket-${Date.now()}`, name: 'Leichte Jacke/Regenschutz', packed: false, category: 'clothing' },
      ];
      const typeExtras: PackingItem[] =
        planningDestination.type === 'island'
          ? [
              { id: `swim-${Date.now()}`, name: 'Badesachen', packed: false, category: 'other' },
              { id: `hat-${Date.now()}`, name: 'Sonnenhut/Cap', packed: false, category: 'other' },
            ]
          : planningDestination.type === 'region' || planningDestination.type === 'country'
          ? [{ id: `hike-${Date.now()}`, name: 'Wanderausrüstung (falls geplant)', packed: false, category: 'other' }]
          : [{ id: `powerbank-${Date.now()}`, name: 'Powerbank', packed: false, category: 'electronics' }];
      const packingList: PackingItem[] = [...basePacking, ...clothingItems, ...typeExtras];

      const todos: TodoItem[] = defaultTodos.map((t, i) => ({
        ...t,
        id: `todo-${Date.now()}-${i}`,
        completed: false,
      }));

      // Generate travel tips & transport notes
      const tips: string[] =
        planningDestination.type === 'city'
          ? [
              'Kostenlose Stadtführungen (Free Walking Tours) nutzen',
              'Aussichtspunkte bei Sonnenaufgang meiden Andrang',
              'Streetfood-Märkte für günstige, authentische Küche',
              'ÖPNV-Apps installieren (Tickets, Routen, Echtzeit)',
              'Reservierung für Top-Restaurants frühzeitig vornehmen',
              'City Pass prüfen (Museen, Attraktionen, Ermäßigungen)',
            ]
          : planningDestination.type === 'island'
          ? [
              'Sonnenaufgang am Strand: ruhige Spots abseits der Hauptstrände',
              'Lokaler Fischmarkt besuchen für frische Spezialitäten',
              'Schnorchelspots vorab recherchieren (Sichtweiten, Strömung)',
              'Sonnenschutz & Trinkwasser immer mitnehmen',
              'Riffschutz beachten (kein Anfassen, umweltfreundliche Sonnencreme)',
              'Roller/Fahrrad vor Ort vergleichen (Versicherung, Helm)',
            ]
          : [
              'Panorama-Route mit Foto‑Stopps planen',
              'Regionalmärkte: beste Zeit am Vormittag',
              'Sonnenuntergangs‑Spots mit wenig Verkehr',
              'Offline-Karten laden (Fernstraßen, Funklöcher möglich)',
              'Tankstellen-/Mautplanung vorab checken',
              'Notfallkit im Auto (Wasser, Snacks, Powerbank)',
            ];

      const transportNotes: string[] =
        planningDestination.type === 'city'
          ? ['ÖPNV‑Pass kaufen (Tages/Mehrtagestickets)', 'Bike‑Sharing und Metro nutzen', 'App‑Tickets vorbereiten']
          : planningDestination.type === 'island'
          ? ['Fähren vorab buchen (Hauptzeiten beachten)', 'Roller/Fahrrad mieten', 'Küstenstraßen langsam fahren']
          : ['Mietwagen für flexible Routen', 'Zug/Fernbus zwischen Städten', 'Maut & Parkzonen beachten'];

      const itinerary: string[] = Array.from({ length: days }).map((_, i) => {
        const d = i + 1;
        const baseCity = [
          '08:30 Frühstück',
          '10:00 Free Walking Tour (Altstadt)',
          '13:00 Lunch',
          '15:00 Museum/Galerie',
          '18:00 Aussichtspunkt/Skyline',
          '20:00 Dinner (lokale Küche)'
        ];
        const baseIsland = [
          '08:00 Strand/Spaziergang',
          '10:30 Schnorcheln/Bootstour',
          '13:00 Lunch (Seafood)',
          '15:30 Küstenroute/Hidden Beach',
          '18:30 Sonnenuntergangs‑Spot',
          '20:00 Dinner'
        ];
        const baseRegion = [
          '08:30 Frühstück',
          '10:00 Panorama‑Route (Fotostopps)',
          '13:00 Lunch/Markt',
          '15:30 Natur‑Highlight',
          '18:00 Aussichtspunkt',
          '20:00 Dinner'
        ];
        const plan = planningDestination.type === 'city' ? baseCity : planningDestination.type === 'island' ? baseIsland : baseRegion;
        return `Tag ${d}: ${plan.join(' • ')}`;
      });

      let countryCode = planningDestination.countryCode || 'XX';
      let lat: number | null = null;
      let lon: number | null = null;
      try {
        const resp = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(planningDestination.name)}&limit=1&addressdetails=1&accept-language=de`);
        const arr = await resp.json();
        const first = Array.isArray(arr) && arr[0];
        const cc = first?.address?.country_code || first?.country_code || null;
        if (cc && typeof cc === 'string') {
          countryCode = cc.toUpperCase();
        }
        if (first?.lat && first?.lon) {
          lat = Number(first.lat);
          lon = Number(first.lon);
        }
      } catch { void 0; }
      const { error } = await supabase
        .from('saved_trips')
        .insert({
          user_id: user.id,
          destination_name: planningDestination.name,
          destination_code: countryCode,
          image_url: planningDestination.imageUrl,
          daily_budget: data.dailyBudget,
          currency: planningDestination.currency || 'EUR',
          start_date: startIso,
          end_date: endIso,
          notes: JSON.stringify({
            peopleCount: data.peopleCount,
            packingList,
            todos,
            bestTimeToVisit: planningDestination.bestSeason,
            tips,
            transportNotes,
            itinerary,
            coords: lat !== null && lon !== null ? { lat, lon } : undefined,
          }),
        });

      if (error) throw error;
      toast.success('Reise erfolgreich gespeichert! Packtipps & Aufgaben wurden hinzugefügt.');
      setPlanningDestination(null);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Unbekannter Fehler';
      toast.error('Fehler beim Speichern: ' + msg);
    } finally {
      setIsAdding(false);
    }
  };
 

 

 

  const visibleDestinations = searchFilteredDestinations;
  const filteredDestinations = selectedType === 'all'
    ? visibleDestinations
    : visibleDestinations.filter((d) => d.type === selectedType || (Array.isArray(d.types) && d.types.includes(selectedType)));

  const types: Array<Destination['type'] | 'all'> = ['all', 'country', 'island', 'city', 'region'];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8">
        
        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-2xl gradient-hero p-8 md:p-12 text-primary-foreground mb-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-foreground/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-6 w-6" />
              <span className="text-sm font-medium uppercase tracking-wide opacity-80">Entdecke</span>
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">Reise-Inspirationen</h1>
            <p className="text-primary-foreground/80 text-lg max-w-2xl">
              Lass dich von atemberaubenden Destinationen inspirieren und finde dein nächstes Abenteuer
            </p>
            {catalogLoading && (
              <div className="mt-2 text-xs text-primary flex items-center gap-2">
                <Loader2 className="h-3 w-3 animate-spin" />
                Katalog wird geladen...
              </div>
            )}
            {!catalogLoading && catalog.length === 0 && (
              <p className="mt-2 text-xs text-muted-foreground">
                Aktuell sind keine Destinationen im Katalog verfügbar.
              </p>
            )}
          </div>
        </section>

        {/* Search Section */}
        <div className="mb-8 max-w-2xl mx-auto">
          <div className="bg-card p-4 rounded-xl shadow-sm border border-border">
             <div className="flex items-center justify-between mb-2">
               <h3 className="text-sm font-medium text-muted-foreground">Suche nach Destinationen in der Datenbank:</h3>
             </div>
             <div className="relative">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
               <Input
                 type="text"
                 placeholder="Land, Stadt, Insel oder Region eingeben..."
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="pl-10 h-12"
               />
             </div>
             {searchQuery && searchFilteredDestinations.length === 0 && !catalogLoading && (
               <p className="mt-2 text-sm text-muted-foreground">
                 Keine Treffer gefunden. <Link to="/admin/destinations" className="text-primary underline">Neue Destination anlegen?</Link>
               </p>
             )}
          </div>
        </div>

        {/* Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {types.map((type) => {
            const Icon = type === 'all' ? Globe : typeIcons[type];
            return (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all",
                  selectedType === type
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                <Icon className="h-4 w-4" />
                {type === 'all' ? 'Alle' : typeLabels[type]}
              </button>
            );
          })}
        </div>

        {/* Destination Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDestinations.map((destination, index) => {
            const typeList = Array.isArray(destination.types) && destination.types.length > 0
              ? Array.from(new Set([destination.type, ...destination.types]))
              : [destination.type];
            const safeName = stripReplacementChar(destination.name);
            const safeCountry = stripReplacementChar(destination.country);
            const safeDescription = destination.description ? stripReplacementChar(destination.description) : '';
            return (
              <div
                key={destination.id}
                role="button"
                tabIndex={0}
                onClick={() => setSelectedDestination(destination)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedDestination(destination);
                  }
                }}
                className="group relative overflow-hidden rounded-xl bg-card shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 text-left animate-fade-up cursor-pointer"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={destination.imageUrl}
                    alt={safeName}
                    loading="lazy"
                    onError={(e) => {
                      const code = destination.countryCode;
                      (e.currentTarget as HTMLImageElement).src = code
                        ? `https://flagcdn.com/w1280/${code.toLowerCase()}.png`
                        : 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop';
                    }}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* stärkerer, dunkler Overlay für bessere Lesbarkeit */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/40 to-transparent" />

                <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                  {typeList.slice(0, 2).map((type) => {
                    const TypeIcon = typeIcons[type];
                    return (
                      <Badge
                        key={`${destination.id}-${type}`}
                        variant="secondary"
                        className="bg-black/75 text-white backdrop-blur-sm ring-1 ring-white/30 shadow-xl px-3 py-1 flex items-center"
                      >
                        <TypeIcon className="h-3 w-3 mr-1 text-white" />
                        {typeLabels[type]}
                      </Badge>
                    );
                  })}
                </div>

                  <div className="absolute bottom-4 left-4 right-4 text-white drop-shadow-xl">
                    <h3 className="font-display text-xl font-semibold">{safeName}</h3>
                    <p className="text-sm opacity-90">{safeCountry}</p>
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {safeDescription}
                  </p>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{destination.bestSeason}</span>
                    </div>
                    <div className="flex items-center gap-1 font-medium text-primary">
                      <DollarSign className="h-4 w-4" />
                      <span>~{destination.averageDailyCost} {destination.currency || 'EUR'}/Tag</span>
                    </div>
                  </div>
                  
                  
                </div>
              </div>
            );
          })}
        </div>
        {!catalogLoading && filteredDestinations.length === 0 && (
          <div className="mt-6 rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">
            Keine passenden Destinationen gefunden.
          </div>
        )}

        

        {/* Detail Modal */}
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
              {/* Bild + Header */}
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

                {/* Travel Info Section */}
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

                  <Button 
                    onClick={() => startPlanningTrip(selectedDestination)}
                    disabled={isAdding}
                    size="sm"
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    {isAdding ? '...' : 'Planen'}
                  </Button>
                </div>
              </div>
                  </>
                );
              })()}
            </div>
          </div>
        )}
        <PlanTripDialog 
          open={!!planningDestination} 
          onOpenChange={(open) => !open && setPlanningDestination(null)}
          destination={planningDestination}
          onConfirm={handlePlanConfirm}
        />
      </main>

      <footer className="border-t border-border mt-16 py-8">
        <div className="container text-center text-sm text-muted-foreground">
          <p>GlobeDetour – Dein Begleiter für unvergessliche Reisen</p>
        </div>
      </footer>
    </div>
  );
};

export default Inspiration;
