import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, DollarSign, FileCheck, MapPin, Plus, ShieldCheck, Syringe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Destination, PackingItem, TodoItem } from '@/types/travel';
import { fetchDestinationsCatalog, getDestinationById } from '@/services/travelData';
import { defaultTodos, inspirationDestinations } from '@/data/mockData';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { PlanTripDialog, TripPlanData } from '@/components/PlanTripDialog';

const isUuid = (value: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);

export const InspirationPreview = () => {
  const [catalog, setCatalog] = useState<Destination[]>([]);
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [planningDestination, setPlanningDestination] = useState<Destination | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedDetailsLoading, setSelectedDetailsLoading] = useState(false);
  const lastDetailsId = useRef<string | null>(null);
  const { user } = useAuth();
  const normalizeSearch = (value: string) =>
    value
      .toLowerCase()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .replace(/\uFFFD/g, '')
      .trim();
  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchDestinationsCatalog({ fields: 'summary' });
        setCatalog(Array.isArray(data) ? data : []);
      } catch {
        setCatalog([]);
      }
    };
    load();
  }, []);
  useEffect(() => {
    if (!selectedDestination?.id) return;
    if (!isUuid(selectedDestination.id)) return;
    if (lastDetailsId.current === selectedDestination.id) return;
    if (
      (selectedDestination.highlights && selectedDestination.highlights.length > 0) ||
      selectedDestination.visaInfo ||
      selectedDestination.vaccinationInfo ||
      selectedDestination.healthSafetyInfo
    ) {
      lastDetailsId.current = selectedDestination.id;
      return;
    }
    lastDetailsId.current = selectedDestination.id;
    let active = true;
    setSelectedDetailsLoading(true);
    getDestinationById(selectedDestination.id)
      .then((full) => {
        if (!active || !full) return;
        setSelectedDestination((prev) => (prev && prev.id === full.id ? { ...prev, ...full } : prev));
      })
      .finally(() => {
        if (active) setSelectedDetailsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [selectedDestination]);
  const defaultInspirationList = useMemo(() => {
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
      const codeMatch = seed.countryCode
        ? byCode
            .get(seed.countryCode.toUpperCase())
            ?.find(
              (item) =>
                item.type === seed.type ||
                (Array.isArray(item.types) && item.types.includes(seed.type)),
            )
        : undefined;
      const nameMatch =
        codeMatch ||
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
  const previewDestinations = defaultInspirationList.slice(0, 3);
  const stripReplacementChar = (value: string) => value.replace(/\uFFFD/g, '');
  const typeLabels: Record<Destination['type'], string> = {
    country: 'Land',
    city: 'Stadt',
    island: 'Insel',
    region: 'Region',
  };
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
            <button
              key={destination.id}
              type="button"
              onClick={() => setSelectedDestination(destination)}
              className="group relative overflow-hidden rounded-2xl aspect-[4/3] text-left"
            >
              <img
                src={destination.imageUrl}
                alt={destination.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                onError={(e) => {
                  const code = destination.countryCode;
                  (e.currentTarget as HTMLImageElement).src = code
                    ? `https://flagcdn.com/w1280/${code.toLowerCase()}.png`
                    : 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop';
                }}
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
            </button>
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
                      type="button"
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
                    {selectedDetailsLoading && (
                      <p className="text-xs text-muted-foreground mb-6">Details werden geladen…</p>
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
                        type="button"
                        onClick={() => {
                          const q = encodeURIComponent(`${selectedDestination.name} Reise Informationen`);
                          window.open(`https://www.google.com/search?q=${q}`, '_blank');
                        }}
                        className="px-4 py-2 rounded-md bg-muted text-muted-foreground hover:bg-muted/90 transition text-sm"
                      >
                        Mehr Infos
                      </button>
                      <Button 
                        onClick={() => startPlanningTrip(selectedDestination)}
                        disabled={isAdding}
                        size="sm"
                        className="gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        {isAdding ? '...' : 'Zu Reisen hinzufügen'}
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
    </section>
  );
};
