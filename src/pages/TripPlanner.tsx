import { useState, useEffect, useCallback, useMemo } from 'react';
import { Header } from '@/components/Header';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { AuthDialog } from '@/components/AuthDialog';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  Plus, Trash2, GripVertical, Plane, Train, Car, Ship, Bus,
  MapPin, Calendar, DollarSign, Globe, ArrowRight, Loader2,
  Route as RouteIcon, Wallet, FileText, ChevronDown, ChevronUp,
  Edit2, Check, X,
} from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { de } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { ComposableMap, Geographies, Geography, ZoomableGroup, Marker, Line } from 'react-simple-maps';

const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

interface TripRoute {
  id: string;
  name: string;
  description: string | null;
  status: string;
  total_budget: number | null;
  budget_currency: string | null;
  created_at: string;
}

interface TripStop {
  id: string;
  route_id: string;
  destination_name: string;
  destination_code: string | null;
  image_url: string | null;
  coords_lat: number | null;
  coords_lon: number | null;
  start_date: string | null;
  end_date: string | null;
  daily_budget: number | null;
  currency: string | null;
  notes: string | null;
  sort_order: number;
  transport_to_next: string | null;
}

const transportIcons: Record<string, typeof Plane> = {
  flight: Plane, train: Train, car: Car, boat: Ship, bus: Bus,
};
const transportLabels: Record<string, string> = {
  flight: 'Flug', train: 'Zug', car: 'Auto', boat: 'Boot/Fähre', bus: 'Bus',
};

const TripPlanner = () => {
  const { user, loading: authLoading } = useAuth();
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [routes, setRoutes] = useState<TripRoute[]>([]);
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
  const [stops, setStops] = useState<TripStop[]>([]);
  const [loading, setLoading] = useState(false);
  const [addStopOpen, setAddStopOpen] = useState(false);
  const [newRouteOpen, setNewRouteOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState(false);
  const [routeName, setRouteName] = useState('');
  const [routeDesc, setRouteDesc] = useState('');
  const [routeBudget, setRouteBudget] = useState('');
  const [routeCurrency, setRouteCurrency] = useState('EUR');

  // Add stop form
  const [stopName, setStopName] = useState('');
  const [stopStartDate, setStopStartDate] = useState('');
  const [stopEndDate, setStopEndDate] = useState('');
  const [stopBudget, setStopBudget] = useState('');
  const [stopCurrency, setStopCurrency] = useState('EUR');
  const [stopTransport, setStopTransport] = useState('flight');
  const [stopNotes, setStopNotes] = useState('');

  // Destination suggestions from DB
  const [destSuggestions, setDestSuggestions] = useState<Array<{ name: string; coords_lat: number | null; coords_lon: number | null; image_url: string | null; country_code: string | null; currency: string | null; average_daily_cost: number | null }>>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedRoute = routes.find((r) => r.id === selectedRouteId) || null;
  const sortedStops = useMemo(() => [...stops].sort((a, b) => a.sort_order - b.sort_order), [stops]);

  // Budget calculations
  const totalStopBudget = useMemo(() => {
    return sortedStops.reduce((sum, s) => {
      if (!s.daily_budget || !s.start_date || !s.end_date) return sum;
      const days = Math.max(1, differenceInDays(new Date(s.end_date), new Date(s.start_date)));
      return sum + s.daily_budget * days;
    }, 0);
  }, [sortedStops]);

  const totalDays = useMemo(() => {
    if (sortedStops.length === 0) return 0;
    const firstStart = sortedStops.find((s) => s.start_date)?.start_date;
    const lastEnd = [...sortedStops].reverse().find((s) => s.end_date)?.end_date;
    if (!firstStart || !lastEnd) return 0;
    return Math.max(0, differenceInDays(new Date(lastEnd), new Date(firstStart)));
  }, [sortedStops]);

  const totalCountries = useMemo(() => {
    return new Set(sortedStops.map((s) => s.destination_code).filter(Boolean)).size;
  }, [sortedStops]);

  // Load routes
  const fetchRoutes = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('trip_routes')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setRoutes((data || []) as TripRoute[]);
      if (data && data.length > 0 && !selectedRouteId) {
        setSelectedRouteId((data[0] as TripRoute).id);
      }
    } catch { toast.error('Fehler beim Laden der Routen'); }
    finally { setLoading(false); }
  }, [user, selectedRouteId]);

  // Load stops for selected route
  const fetchStops = useCallback(async () => {
    if (!selectedRouteId) { setStops([]); return; }
    try {
      const { data, error } = await supabase
        .from('trip_stops')
        .select('*')
        .eq('route_id', selectedRouteId)
        .order('sort_order', { ascending: true });
      if (error) throw error;
      setStops((data || []) as TripStop[]);
    } catch { toast.error('Fehler beim Laden der Stops'); }
  }, [selectedRouteId]);

  useEffect(() => { if (user) fetchRoutes(); }, [user, fetchRoutes]);
  useEffect(() => { fetchStops(); }, [selectedRouteId, fetchStops]);

  // Search destinations
  useEffect(() => {
    if (searchQuery.length < 2) { setDestSuggestions([]); return; }
    const timeout = setTimeout(async () => {
      const { data } = await supabase
        .from('destinations')
        .select('name,coords_lat,coords_lon,image_url,country_code,currency,average_daily_cost')
        .ilike('name', `%${searchQuery}%`)
        .limit(8);
      setDestSuggestions((data || []) as typeof destSuggestions);
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  // Create route
  const handleCreateRoute = async () => {
    if (!user || !routeName.trim()) return;
    try {
      const { data, error } = await supabase
        .from('trip_routes')
        .insert({
          user_id: user.id,
          name: routeName.trim(),
          description: routeDesc.trim() || null,
          total_budget: routeBudget ? Number(routeBudget) : null,
          budget_currency: routeCurrency,
        })
        .select()
        .single();
      if (error) throw error;
      const newRoute = data as TripRoute;
      setRoutes((prev) => [newRoute, ...prev]);
      setSelectedRouteId(newRoute.id);
      setNewRouteOpen(false);
      setRouteName(''); setRouteDesc(''); setRouteBudget('');
      toast.success('Route erstellt!');
    } catch { toast.error('Fehler beim Erstellen'); }
  };

  // Update route
  const handleUpdateRoute = async () => {
    if (!user || !selectedRouteId || !routeName.trim()) return;
    try {
      const { error } = await supabase
        .from('trip_routes')
        .update({
          name: routeName.trim(),
          description: routeDesc.trim() || null,
          total_budget: routeBudget ? Number(routeBudget) : null,
          budget_currency: routeCurrency,
        })
        .eq('id', selectedRouteId);
      if (error) throw error;
      setRoutes((prev) => prev.map((r) => r.id === selectedRouteId ? { ...r, name: routeName.trim(), description: routeDesc.trim() || null, total_budget: routeBudget ? Number(routeBudget) : null, budget_currency: routeCurrency } : r));
      setEditingRoute(false);
      toast.success('Route aktualisiert');
    } catch { toast.error('Fehler beim Aktualisieren'); }
  };

  // Delete route
  const handleDeleteRoute = async (id: string) => {
    try {
      const { error } = await supabase.from('trip_routes').delete().eq('id', id);
      if (error) throw error;
      setRoutes((prev) => prev.filter((r) => r.id !== id));
      if (selectedRouteId === id) setSelectedRouteId(routes.find((r) => r.id !== id)?.id || null);
      toast.success('Route gelöscht');
    } catch { toast.error('Fehler beim Löschen'); }
  };

  // Add stop
  const handleAddStop = async () => {
    if (!selectedRouteId || !stopName.trim()) return;
    // Look up coords from dest suggestions
    const match = destSuggestions.find((d) => d.name === stopName);
    const maxOrder = sortedStops.length > 0 ? Math.max(...sortedStops.map((s) => s.sort_order)) + 1 : 0;
    try {
      const { data, error } = await supabase
        .from('trip_stops')
        .insert({
          route_id: selectedRouteId,
          destination_name: stopName.trim(),
          destination_code: match?.country_code || null,
          image_url: match?.image_url || null,
          coords_lat: match?.coords_lat || null,
          coords_lon: match?.coords_lon || null,
          start_date: stopStartDate || null,
          end_date: stopEndDate || null,
          daily_budget: stopBudget ? Number(stopBudget) : match?.average_daily_cost || null,
          currency: stopCurrency || match?.currency || 'EUR',
          notes: stopNotes.trim() || null,
          sort_order: maxOrder,
          transport_to_next: stopTransport,
        })
        .select()
        .single();
      if (error) throw error;
      setStops((prev) => [...prev, data as TripStop]);
      setAddStopOpen(false);
      resetStopForm();
      toast.success(`${stopName} hinzugefügt!`);
    } catch { toast.error('Fehler beim Hinzufügen'); }
  };

  // Delete stop
  const handleDeleteStop = async (id: string) => {
    try {
      const { error } = await supabase.from('trip_stops').delete().eq('id', id);
      if (error) throw error;
      setStops((prev) => prev.filter((s) => s.id !== id));
      toast.success('Stop entfernt');
    } catch { toast.error('Fehler beim Entfernen'); }
  };

  // Move stop up/down
  const handleMoveStop = async (id: string, direction: 'up' | 'down') => {
    const idx = sortedStops.findIndex((s) => s.id === id);
    if ((direction === 'up' && idx === 0) || (direction === 'down' && idx === sortedStops.length - 1)) return;
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    const a = sortedStops[idx];
    const b = sortedStops[swapIdx];
    try {
      await Promise.all([
        supabase.from('trip_stops').update({ sort_order: b.sort_order }).eq('id', a.id),
        supabase.from('trip_stops').update({ sort_order: a.sort_order }).eq('id', b.id),
      ]);
      setStops((prev) => prev.map((s) => {
        if (s.id === a.id) return { ...s, sort_order: b.sort_order };
        if (s.id === b.id) return { ...s, sort_order: a.sort_order };
        return s;
      }));
    } catch { toast.error('Fehler beim Verschieben'); }
  };

  const resetStopForm = () => {
    setStopName(''); setStopStartDate(''); setStopEndDate('');
    setStopBudget(''); setStopCurrency('EUR'); setStopTransport('flight');
    setStopNotes(''); setSearchQuery(''); setDestSuggestions([]);
  };

  // Map markers & lines
  const mapMarkers = useMemo(() =>
    sortedStops
      .filter((s) => s.coords_lat != null && s.coords_lon != null)
      .map((s, i) => ({
        id: s.id,
        name: s.destination_name,
        coords: [s.coords_lon!, s.coords_lat!] as [number, number],
        index: i,
      })),
    [sortedStops]
  );

  const mapLines = useMemo(() => {
    const lines: Array<{ from: [number, number]; to: [number, number]; transport: string }> = [];
    for (let i = 0; i < mapMarkers.length - 1; i++) {
      lines.push({
        from: mapMarkers[i].coords,
        to: mapMarkers[i + 1].coords,
        transport: sortedStops[i]?.transport_to_next || 'flight',
      });
    }
    return lines;
  }, [mapMarkers, sortedStops]);

  if (authLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-16 text-center">
          <Globe className="h-16 w-16 text-primary mx-auto mb-6" />
          <h1 className="font-display text-4xl font-bold mb-4">Weltreise-Planer</h1>
          <p className="text-muted-foreground text-lg mb-8 max-w-lg mx-auto">
            Plane deine komplette Weltreise mit Multi-Stopp-Routen, Budget-Tracker und interaktiver Karte.
          </p>
          <Button size="lg" onClick={() => setAuthDialogOpen(true)}>Anmelden & loslegen</Button>
          <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8 space-y-6">
        {/* Hero */}
        <section className="relative overflow-hidden rounded-2xl gradient-hero p-8 md:p-10 text-primary-foreground">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-foreground/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <RouteIcon className="h-5 w-5" />
                <span className="text-sm font-medium uppercase tracking-wide opacity-80">Weltreise-Planer</span>
              </div>
              <h1 className="font-display text-3xl md:text-4xl font-bold">
                {selectedRoute ? selectedRoute.name : 'Deine Routen'}
              </h1>
              {selectedRoute?.description && (
                <p className="text-primary-foreground/80 mt-1">{selectedRoute.description}</p>
              )}
            </div>
            <div className="flex gap-2 self-start">
              {selectedRoute && (
                <Button variant="secondary" size="sm" onClick={() => {
                  setRouteName(selectedRoute.name);
                  setRouteDesc(selectedRoute.description || '');
                  setRouteBudget(selectedRoute.total_budget?.toString() || '');
                  setRouteCurrency(selectedRoute.budget_currency || 'EUR');
                  setEditingRoute(true);
                }}>
                  <Edit2 className="h-4 w-4 mr-1" /> Bearbeiten
                </Button>
              )}
              <Button variant="secondary" size="sm" onClick={() => { setRouteName(''); setRouteDesc(''); setRouteBudget(''); setNewRouteOpen(true); }}>
                <Plus className="h-4 w-4 mr-1" /> Neue Route
              </Button>
            </div>
          </div>
        </section>

        {/* Route tabs */}
        {routes.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {routes.map((r) => (
              <button
                key={r.id}
                onClick={() => setSelectedRouteId(r.id)}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
                  r.id === selectedRouteId
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                )}
              >
                {r.name}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : !selectedRoute ? (
          <Card className="text-center py-16">
            <CardContent>
              <Globe className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-display text-xl font-semibold mb-2">Starte deine erste Route</h3>
              <p className="text-muted-foreground mb-6">Erstelle eine Route und füge Stops hinzu.</p>
              <Button onClick={() => { setRouteName('Meine Weltreise'); setRouteDesc(''); setRouteBudget(''); setNewRouteOpen(true); }}>
                <Plus className="h-4 w-4 mr-1" /> Erste Route erstellen
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Stats row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-5 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{sortedStops.length}</div>
                      <div className="text-xs text-muted-foreground">Stops</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-5 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                      <Globe className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{totalCountries}</div>
                      <div className="text-xs text-muted-foreground">Länder</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-5 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-secondary" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{totalDays}</div>
                      <div className="text-xs text-muted-foreground">Tage</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-5 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
                      <Wallet className="h-5 w-5 text-success" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">
                        {totalStopBudget > 0 ? `${totalStopBudget.toLocaleString('de-DE')}€` : '–'}
                      </div>
                      <div className="text-xs text-muted-foreground">Gesamtbudget</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Budget bar */}
            {selectedRoute.total_budget && totalStopBudget > 0 && (
              <Card>
                <CardContent className="pt-5 pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Budget-Auslastung</span>
                    <span className="text-sm text-muted-foreground">
                      {totalStopBudget.toLocaleString('de-DE')}€ / {selectedRoute.total_budget.toLocaleString('de-DE')}€
                    </span>
                  </div>
                  <Progress
                    value={Math.min(100, (totalStopBudget / selectedRoute.total_budget) * 100)}
                    variant={totalStopBudget > selectedRoute.total_budget ? 'warning' : 'success'}
                  />
                </CardContent>
              </Card>
            )}

            {/* Map */}
            {mapMarkers.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Route auf der Karte</CardTitle>
                </CardHeader>
                <CardContent className="p-2">
                  <div className="rounded-xl overflow-hidden border border-border" style={{ touchAction: 'none' }}>
                    <ComposableMap
                      projectionConfig={{ scale: 150 }}
                      className="w-full h-[350px] md:h-[420px]"
                    >
                      <ZoomableGroup center={mapMarkers[0]?.coords || [10, 20]} zoom={1.2}>
                        <Geographies geography={geoUrl}>
                          {({ geographies }) =>
                            geographies.map((geo) => (
                              <Geography
                                key={geo.rsmKey}
                                geography={geo}
                                style={{
                                  default: { fill: 'hsl(var(--muted))', stroke: 'hsl(var(--border))', outline: 'none' },
                                  hover: { fill: 'hsl(var(--muted))', stroke: 'hsl(var(--border))', outline: 'none' },
                                  pressed: { fill: 'hsl(var(--muted))', stroke: 'hsl(var(--border))', outline: 'none' },
                                }}
                              />
                            ))
                          }
                        </Geographies>
                        {mapLines.map((line, i) => (
                          <Line
                            key={`line-${i}`}
                            from={line.from}
                            to={line.to}
                            stroke="hsl(var(--primary))"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeDasharray={line.transport === 'flight' ? '6 4' : undefined}
                          />
                        ))}
                        {mapMarkers.map((m, i) => (
                          <Marker key={m.id} coordinates={m.coords}>
                            <circle r={6} className="fill-primary stroke-primary-foreground" strokeWidth={2} />
                            <text
                              textAnchor="middle"
                              y={-12}
                              className="fill-foreground text-[10px] font-medium"
                            >
                              {i + 1}. {m.name}
                            </text>
                          </Marker>
                        ))}
                      </ZoomableGroup>
                    </ComposableMap>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Timeline stops */}
            <div className="space-y-1">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-xl font-semibold">Reiseroute</h2>
                <Button onClick={() => { resetStopForm(); setAddStopOpen(true); }}>
                  <Plus className="h-4 w-4 mr-1" /> Stop hinzufügen
                </Button>
              </div>

              {sortedStops.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <MapPin className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">Füge deinen ersten Stop hinzu, um die Route zu starten.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute left-[23px] top-6 bottom-6 w-0.5 bg-border hidden md:block" />

                  <div className="space-y-4">
                    {sortedStops.map((stop, i) => {
                      const days = stop.start_date && stop.end_date
                        ? differenceInDays(new Date(stop.end_date), new Date(stop.start_date))
                        : null;
                      const costTotal = days && stop.daily_budget ? days * stop.daily_budget : null;
                      const TransportIcon = stop.transport_to_next ? transportIcons[stop.transport_to_next] || Plane : null;

                      return (
                        <div key={stop.id}>
                          <div className="flex gap-4 items-start">
                            {/* Timeline dot */}
                            <div className="hidden md:flex flex-col items-center shrink-0 pt-5">
                              <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shadow-card">
                                {i + 1}
                              </div>
                            </div>

                            <Card className="flex-1 overflow-hidden hover:shadow-card-hover transition-shadow">
                              <CardContent className="p-4 md:p-5">
                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                                  <div className="flex items-start gap-3 flex-1">
                                    {stop.image_url && (
                                      <img
                                        src={stop.image_url}
                                        alt={stop.destination_name}
                                        className="h-14 w-14 rounded-lg object-cover shrink-0"
                                      />
                                    )}
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2 mb-1">
                                        <span className="md:hidden text-xs font-bold text-primary bg-primary/10 rounded-full h-5 w-5 flex items-center justify-center shrink-0">
                                          {i + 1}
                                        </span>
                                        <h3 className="font-display text-lg font-semibold truncate">{stop.destination_name}</h3>
                                        {stop.destination_code && (
                                          <Badge variant="outline" className="text-xs shrink-0">{stop.destination_code}</Badge>
                                        )}
                                      </div>
                                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                                        {stop.start_date && stop.end_date && (
                                          <span className="flex items-center gap-1">
                                            <Calendar className="h-3.5 w-3.5" />
                                            {format(new Date(stop.start_date), 'dd. MMM', { locale: de })} – {format(new Date(stop.end_date), 'dd. MMM yyyy', { locale: de })}
                                            {days != null && <span className="text-muted-foreground/60">({days} Tage)</span>}
                                          </span>
                                        )}
                                        {costTotal != null && (
                                          <span className="flex items-center gap-1">
                                            <DollarSign className="h-3.5 w-3.5" />
                                            ~{costTotal.toLocaleString('de-DE')} {stop.currency || '€'}
                                          </span>
                                        )}
                                      </div>
                                      {stop.notes && (
                                        <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">{stop.notes}</p>
                                      )}
                                    </div>
                                  </div>

                                  {/* Actions */}
                                  <div className="flex items-center gap-1 shrink-0">
                                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleMoveStop(stop.id, 'up')} disabled={i === 0}>
                                      <ChevronUp className="h-4 w-4" />
                                    </Button>
                                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleMoveStop(stop.id, 'down')} disabled={i === sortedStops.length - 1}>
                                      <ChevronDown className="h-4 w-4" />
                                    </Button>
                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDeleteStop(stop.id)}>
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </div>

                          {/* Transport connector */}
                          {i < sortedStops.length - 1 && TransportIcon && (
                            <div className="flex items-center gap-2 ml-[15px] md:ml-[19px] pl-4 py-1">
                              <div className="w-0.5 h-4 bg-border hidden md:block" />
                              <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted rounded-full px-2.5 py-1">
                                <TransportIcon className="h-3.5 w-3.5" />
                                {transportLabels[stop.transport_to_next!] || stop.transport_to_next}
                              </div>
                              <ArrowRight className="h-3 w-3 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {/* New Route Dialog */}
      <Dialog open={newRouteOpen} onOpenChange={setNewRouteOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Neue Route erstellen</DialogTitle>
            <DialogDescription>Gib deiner Reise einen Namen und lege optional ein Gesamtbudget fest.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div><Label>Name</Label><Input value={routeName} onChange={(e) => setRouteName(e.target.value)} placeholder="z.B. Weltreise 2026" /></div>
            <div><Label>Beschreibung (optional)</Label><Textarea value={routeDesc} onChange={(e) => setRouteDesc(e.target.value)} placeholder="Worum geht es bei dieser Reise?" rows={2} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Gesamtbudget</Label><Input type="number" min="0" value={routeBudget} onChange={(e) => setRouteBudget(e.target.value)} placeholder="10000" /></div>
              <div>
                <Label>Währung</Label>
                <Select value={routeCurrency} onValueChange={setRouteCurrency}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EUR">EUR €</SelectItem>
                    <SelectItem value="USD">USD $</SelectItem>
                    <SelectItem value="GBP">GBP £</SelectItem>
                    <SelectItem value="CHF">CHF</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewRouteOpen(false)}>Abbrechen</Button>
            <Button onClick={handleCreateRoute} disabled={!routeName.trim()}>Erstellen</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Route Dialog */}
      <Dialog open={editingRoute} onOpenChange={setEditingRoute}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Route bearbeiten</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div><Label>Name</Label><Input value={routeName} onChange={(e) => setRouteName(e.target.value)} /></div>
            <div><Label>Beschreibung</Label><Textarea value={routeDesc} onChange={(e) => setRouteDesc(e.target.value)} rows={2} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Gesamtbudget</Label><Input type="number" min="0" value={routeBudget} onChange={(e) => setRouteBudget(e.target.value)} /></div>
              <div>
                <Label>Währung</Label>
                <Select value={routeCurrency} onValueChange={setRouteCurrency}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EUR">EUR €</SelectItem>
                    <SelectItem value="USD">USD $</SelectItem>
                    <SelectItem value="GBP">GBP £</SelectItem>
                    <SelectItem value="CHF">CHF</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingRoute(false)}>Abbrechen</Button>
            <Button onClick={handleUpdateRoute}>Speichern</Button>
            <Button variant="destructive" size="sm" onClick={() => { setEditingRoute(false); handleDeleteRoute(selectedRouteId!); }}>
              <Trash2 className="h-4 w-4 mr-1" /> Löschen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Stop Dialog */}
      <Dialog open={addStopOpen} onOpenChange={setAddStopOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Stop hinzufügen</DialogTitle>
            <DialogDescription>Füge ein neues Reiseziel zu deiner Route hinzu.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="relative">
              <Label>Reiseziel</Label>
              <Input
                value={stopName}
                onChange={(e) => { setStopName(e.target.value); setSearchQuery(e.target.value); }}
                placeholder="Stadt oder Land suchen..."
              />
              {destSuggestions.length > 0 && searchQuery.length >= 2 && (
                <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-popover border border-border rounded-lg shadow-elevated max-h-48 overflow-y-auto">
                  {destSuggestions.map((d) => (
                    <button
                      key={d.name}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-muted flex items-center gap-2"
                      onClick={() => {
                        setStopName(d.name);
                        setSearchQuery('');
                        setDestSuggestions([]);
                        if (d.currency) setStopCurrency(d.currency);
                        if (d.average_daily_cost) setStopBudget(d.average_daily_cost.toString());
                      }}
                    >
                      <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                      {d.name}
                      {d.country_code && <Badge variant="outline" className="text-[10px] ml-auto">{d.country_code}</Badge>}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Ankunft</Label><Input type="date" value={stopStartDate} onChange={(e) => setStopStartDate(e.target.value)} /></div>
              <div><Label>Abreise</Label><Input type="date" value={stopEndDate} onChange={(e) => setStopEndDate(e.target.value)} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Tagesbudget</Label><Input type="number" min="0" value={stopBudget} onChange={(e) => setStopBudget(e.target.value)} placeholder="80" /></div>
              <div>
                <Label>Währung</Label>
                <Select value={stopCurrency} onValueChange={setStopCurrency}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EUR">EUR €</SelectItem>
                    <SelectItem value="USD">USD $</SelectItem>
                    <SelectItem value="GBP">GBP £</SelectItem>
                    <SelectItem value="THB">THB ฿</SelectItem>
                    <SelectItem value="IDR">IDR</SelectItem>
                    <SelectItem value="NZD">NZD $</SelectItem>
                    <SelectItem value="AUD">AUD $</SelectItem>
                    <SelectItem value="JPY">JPY ¥</SelectItem>
                    <SelectItem value="VND">VND ₫</SelectItem>
                    <SelectItem value="BRL">BRL R$</SelectItem>
                    <SelectItem value="CLP">CLP $</SelectItem>
                    <SelectItem value="MAD">MAD</SelectItem>
                    <SelectItem value="ZAR">ZAR R</SelectItem>
                    <SelectItem value="ISK">ISK kr</SelectItem>
                    <SelectItem value="CHF">CHF</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Transport zum nächsten Stop</Label>
              <Select value={stopTransport} onValueChange={setStopTransport}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(transportLabels).map(([k, v]) => {
                    const Icon = transportIcons[k];
                    return <SelectItem key={k} value={k}>{v}</SelectItem>;
                  })}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Notizen (optional)</Label>
              <Textarea value={stopNotes} onChange={(e) => setStopNotes(e.target.value)} placeholder="z.B. Hostel in Khaosan Road gebucht..." rows={2} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddStopOpen(false)}>Abbrechen</Button>
            <Button onClick={handleAddStop} disabled={!stopName.trim()}>Hinzufügen</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />
    </div>
  );
};

export default TripPlanner;
