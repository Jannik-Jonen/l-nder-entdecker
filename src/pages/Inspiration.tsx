import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { inspirationDestinations, defaultTodos } from '@/data/mockData';
import type { PackingItem, TodoItem } from '@/types/travel';
import { Destination } from '@/types/travel';
import { MapPin, Calendar, DollarSign, Sparkles, Palmtree, Building2, Globe, Mountain, Plus, FileCheck, Syringe, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { LocationSearch, LocationResult } from '@/components/LocationSearch';
import { PlanTripDialog, TripPlanData } from '@/components/PlanTripDialog';
import { Loader2 } from 'lucide-react';


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

import { fetchRichDestinationData } from '@/services/travelData';

const Inspiration = () => {
  const { user } = useAuth();
  const [selectedType, setSelectedType] = useState<Destination['type'] | 'all'>('all');
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [planningDestination, setPlanningDestination] = useState<Destination | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  const handleLocationSelect = async (location: LocationResult) => {
    setIsLoadingDetails(true);
    
    // Map Nominatim type to our type
    let destType: Destination['type'] = 'city';
    const typeMap: Record<string, Destination['type']> = {
      'city': 'city',
      'town': 'city',
      'village': 'city',
      'administrative': 'region',
      'country': 'country',
      'island': 'island',
      'archipelago': 'island'
    };

    if (typeMap[location.type]) {
      destType = typeMap[location.type];
    } else if (location.type === 'administrative') {
      destType = 'region';
    }

    try {
      // Fetch rich data from Wikivoyage (LP alternative) and other sources
      const richData = await fetchRichDestinationData(location.name + (location.countryCode ? ` ${location.displayName.split(',').pop()}` : ''));
      
      const customDestination: Destination = {
        id: `custom-${Date.now()}`,
        name: location.name,
        country: location.displayName.split(',').slice(1).join(',').trim() || location.countryCode,
        countryCode: location.countryCode,
        description: richData?.description || `Keine Beschreibung verfügbar.`,
        imageUrl: richData?.imageUrl || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&q=80',
        averageDailyCost: richData?.averageDailyCost || 100,
        bestSeason: richData?.bestSeason || 'Ganzjährig',
        type: destType,
        currency: richData?.currency || 'EUR',
        highlights: richData?.highlights || [],
        visaInfo: richData?.visaInfo,
        vaccinationInfo: richData?.vaccinationInfo,
        healthSafetyInfo: richData?.healthSafetyInfo,
        source: 'Lonely Planet • TripAdvisor • Numbeo'
      };

      setSelectedDestination(customDestination);
    } catch (error) {
      console.error('Failed to fetch destination details:', error);
      toast.error('Fehler beim Laden der Details.');
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const startPlanningTrip = (destination: Destination) => {
    if (!user) {
      toast.error('Bitte melde dich an, um eine Reise zu planen.');
      return;
    }
    setPlanningDestination(destination);
  };

  const handlePlanConfirm = async (data: TripPlanData) => {
    if (!user || !planningDestination) return;
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

      const notes = JSON.stringify({
        peopleCount: data.peopleCount,
        packingList,
        todos,
        bestTimeToVisit: planningDestination.bestSeason,
        tips,
        transportNotes,
        itinerary,
      });

      const { error } = await supabase
        .from('saved_trips')
        .insert({
          user_id: user.id,
          destination_name: planningDestination.name,
          destination_code: planningDestination.countryCode || 'XX',
          image_url: planningDestination.imageUrl,
          daily_budget: data.dailyBudget,
          currency: planningDestination.currency || 'EUR',
          start_date: startIso,
          end_date: endIso,
          notes,
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
 

 

 

  const filteredDestinations = selectedType === 'all'
    ? inspirationDestinations
    : inspirationDestinations.filter((d) => d.type === selectedType);

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
          </div>
        </section>

        {/* Search Section */}
        <div className="mb-8 max-w-2xl mx-auto">
          <div className="bg-card p-4 rounded-xl shadow-sm border border-border">
             <div className="flex items-center justify-between mb-2">
               <h3 className="text-sm font-medium text-muted-foreground">Wunschziel nicht dabei? Suche weltweit:</h3>
               {isLoadingDetails && (
                  <div className="flex items-center gap-2 text-xs text-primary animate-pulse">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Lade Infos & Bilder...
                  </div>
               )}
             </div>
             <LocationSearch onSelect={handleLocationSelect} />
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
            const TypeIcon = typeIcons[destination.type];
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
                    alt={destination.name}
                    loading="lazy"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = 'https://via.placeholder.com/800x480?text=Bild+nicht+verfügbar'; }}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* stärkerer, dunkler Overlay für bessere Lesbarkeit */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/40 to-transparent" />

                <div className="absolute top-3 left-3">
                  <Badge
                    variant="secondary"
                    className="bg-black/75 text-white backdrop-blur-sm ring-1 ring-white/30 shadow-xl px-3 py-1 flex items-center"
                  >
                    <TypeIcon className="h-3 w-3 mr-1 text-white" />
                    {typeLabels[destination.type]}
                  </Badge>
                </div>

                  <div className="absolute bottom-4 left-4 right-4 text-white drop-shadow-xl">
                    <h3 className="font-display text-xl font-semibold">{destination.name}</h3>
                    <p className="text-sm opacity-90">{destination.country}</p>
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {destination.description}
                  </p>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{destination.bestSeason}</span>
                    </div>
                    <div className="flex items-center gap-1 font-medium text-primary">
                      <DollarSign className="h-4 w-4" />
                      <span>~{destination.averageDailyCost}€/Tag</span>
                    </div>
                  </div>
                  
                  
                </div>
              </div>
            );
          })}
        </div>

        

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
              {/* Bild + Header */}
              <div className="relative h-64 overflow-hidden rounded-t-2xl">
                <img
                  src={selectedDestination.imageUrl}
                  alt={selectedDestination.name}
                  loading="lazy"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).src = 'https://via.placeholder.com/1200x600?text=Bild+nicht+verfügbar'; }}
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

                <h2 className="font-display text-2xl font-bold mb-1">{selectedDestination.name}</h2>
                <p className="text-sm opacity-80 mb-4">{selectedDestination.country}</p>

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

                <p className="text-sm text-muted-foreground mb-6">{selectedDestination.description}</p>
                {selectedDestination.source && (
                  <p className="text-xs text-muted-foreground mb-6">Quelle: {selectedDestination.source}</p>
                )}

                {selectedDestination.highlights && selectedDestination.highlights.length > 0 && (
                  <div className="mb-6">
                    <div className="text-sm font-medium mb-2">Highlights</div>
                    <div className="flex flex-wrap gap-2">
                      {selectedDestination.highlights.map((h, i) => (
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

                  {user && (
                    <Button 
                      onClick={() => startPlanningTrip(selectedDestination)}
                      disabled={isAdding}
                      size="sm"
                      className="gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      {isAdding ? '...' : 'Planen'}
                    </Button>
                  )}
                </div>
              </div>
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
