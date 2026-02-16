import { useMemo, useEffect } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup, Marker } from 'react-simple-maps';
import { inspirationDestinations, defaultTodos } from '@/data/mockData';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { fetchRichDestinationData } from '@/services/travelData';
import { PlanTripDialog, TripPlanData } from '@/components/PlanTripDialog';
import type { Destination } from '@/types/travel';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

export const WorldMap = () => {
  const [zoom, setZoom] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { user } = useAuth();
  const [markers, setMarkers] = useState<Array<{ id: string; name: string; coords: [number, number] }>>([]);
  const [geoDetail, setGeoDetail] = useState<{ name: string; destination: Destination | null } | null>(null);
  const [openPlan, setOpenPlan] = useState(false);
  const [center, setCenter] = useState<[number, number]>([10, 20]);
  const defaultMarkers = useMemo(() => {
    const coordById: Record<string, [number, number]> = {
      'dest-1': [115, -8],
      'dest-2': [-19, 65],
      'dest-3': [135, 35],
      'dest-4': [18, -34],
      'dest-5': [73, 4],
      'dest-6': [-72, -51],
      'dest-7': [25, 36],
      'dest-8': [-8, 31],
      'dest-12': [20.8, 37.8],
    };
    return inspirationDestinations
      .map((d) => ({
        id: d.id,
        name: d.name,
        coords: coordById[d.id],
      }))
      .filter((m) => Array.isArray(m.coords));
  }, []);

  useEffect(() => {
    const loadMarkers = async () => {
      if (!user) {
        setMarkers(defaultMarkers as Array<{ id: string; name: string; coords: [number, number] }>);
        return;
      }
      const { data, error } = await supabase
        .from('saved_trips')
        .select('id,destination_name,notes');
      if (error) {
        setMarkers(defaultMarkers as Array<{ id: string; name: string; coords: [number, number] }>);
        return;
      }
      const trips = (data || []) as Array<{ id: string; destination_name: string; notes: string | null }>;
      const markersList: Array<{ id: string; name: string; coords: [number, number] }> = [];
      // Collect trips without coords to look up from destinations table
      const needsLookup: Array<{ trip: typeof trips[number]; index: number }> = [];

      for (const t of trips) {
        let coords: [number, number] | null = null;
        try {
          const parsed = t.notes ? JSON.parse(t.notes as string) as { coords?: { lat: number; lon: number } } : {};
          if (parsed.coords && typeof parsed.coords.lat === 'number' && typeof parsed.coords.lon === 'number') {
            coords = [parsed.coords.lon, parsed.coords.lat];
          }
        } catch { /* ignore parse errors */ }
        if (coords) {
          markersList.push({ id: t.id, name: t.destination_name, coords });
        } else {
          needsLookup.push({ trip: t, index: markersList.length });
          markersList.push({ id: t.id, name: t.destination_name, coords: [0, 0] }); // placeholder
        }
      }

      // Look up coordinates from destinations table for trips without coords
      if (needsLookup.length > 0) {
        const names = needsLookup.map((n) => n.trip.destination_name);
        const { data: destData } = await supabase
          .from('destinations')
          .select('name,coords_lat,coords_lon')
          .in('name', names);
        const coordsByName = new Map<string, [number, number]>();
        (destData || []).forEach((d: { name: string; coords_lat: number | null; coords_lon: number | null }) => {
          if (typeof d.coords_lat === 'number' && typeof d.coords_lon === 'number') {
            coordsByName.set(d.name, [d.coords_lon, d.coords_lat]);
          }
        });
        // Update markers and persist coords
        const toRemove: number[] = [];
        for (const item of needsLookup) {
          const found = coordsByName.get(item.trip.destination_name);
          if (found) {
            markersList[item.index] = { id: item.trip.id, name: item.trip.destination_name, coords: found };
            // Persist coords in notes
            try {
              const currentNotes = item.trip.notes ? JSON.parse(item.trip.notes as string) : {};
              currentNotes.coords = { lat: found[1], lon: found[0] };
              await supabase
                .from('saved_trips')
                .update({ notes: JSON.stringify(currentNotes) })
                .eq('id', item.trip.id);
            } catch { /* ignore */ }
          } else {
            toRemove.push(item.index);
          }
        }
        // Remove markers without coords (reverse order to keep indices valid)
        toRemove.sort((a, b) => b - a).forEach((i) => markersList.splice(i, 1));
      }

      setMarkers(markersList);
    };
    loadMarkers();
  }, [user, defaultMarkers]);

  return (
    <div
      className="relative rounded-2xl border border-border bg-card p-2 shadow-card select-none"
      style={{ overscrollBehavior: 'contain', touchAction: 'none' }}
    >
      <div className="absolute top-3 right-3 z-10 flex gap-2">
        <Button size="sm" variant="outline" onClick={() => setZoom((z) => Math.min(3, z + 0.25))}>+</Button>
        <Button size="sm" variant="outline" onClick={() => setZoom((z) => Math.max(0.75, z - 0.25))}>−</Button>
      </div>
      <ComposableMap
        projectionConfig={{ scale: 150 }}
        className="w-full h-[420px] text-muted-foreground"
        onWheelCapture={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <ZoomableGroup
          center={center}
          zoom={zoom}
          onClick={() => {
            setSelectedId(null);
          }}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  style={{
                    default: { fill: 'hsl(var(--muted))', stroke: 'hsl(var(--border))', outline: 'none' },
                    hover: { fill: 'hsl(var(--accent)/0.4)', stroke: 'hsl(var(--border))', outline: 'none' },
                    pressed: { fill: 'hsl(var(--accent)/0.6)', stroke: 'hsl(var(--border))', outline: 'none' },
                  }}
                  onClick={async (e) => {
                    e.preventDefault();
                    const name = (geo.properties as { name?: string })?.name || '';
                    if (!name) return;
                    const rich = await fetchRichDestinationData(name);
                    const dest: Destination = {
                      id: `geo-${Date.now()}`,
                      name,
                      country: name,
                      type: 'country',
                      imageUrl: rich?.imageUrl || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&q=80',
                      description: rich?.description || `Inspiration für ${name}.`,
                      highlights: rich?.highlights || [],
                      bestSeason: rich?.bestSeason || 'Ganzjährig',
                      averageDailyCost: rich?.averageDailyCost || 100,
                      currency: rich?.currency || 'EUR',
                      source: 'Lonely Planet • TripAdvisor • Numbeo',
                    };
                    setGeoDetail({ name, destination: dest });
                    setOpenPlan(false);
                  }}
                />
              ))
            }
          </Geographies>
          {markers.map((m) => (
            <Marker
              key={m.id}
              coordinates={m.coords as [number, number]}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedId(m.id);
                setCenter(m.coords);
              }}
            >
              <circle r={4 + (zoom - 1) * 2} className="fill-primary" />
              {selectedId === m.id && (
                <g transform="translate(8,-8)">
                  <foreignObject x="0" y="0" width="220" height="120">
                    <div className="rounded-md bg-background border border-border shadow-card p-3 text-xs">
                      <div className="font-medium mb-2">{m.name}</div>
                      <div className="flex gap-2">
                        <button
                          className="px-2 py-1 rounded bg-muted text-muted-foreground"
                          onClick={(ev) => {
                            ev.preventDefault();
                            ev.stopPropagation();
                            setSelectedId(null);
                          }}
                        >
                          Schließen
                        </button>
                      </div>
                    </div>
                  </foreignObject>
                </g>
              )}
            </Marker>
          ))}
        </ZoomableGroup>
      </ComposableMap>
      {geoDetail && (
        <div className="absolute bottom-3 left-3 right-3 z-10">
          <div className="rounded-md bg-background border border-border shadow-card p-4">
            <div className="font-display text-lg font-semibold mb-1">{geoDetail.destination?.name}</div>
                <p className="text-sm text-muted-foreground mb-3">{geoDetail.destination?.description}</p>
                {geoDetail.destination?.highlights && geoDetail.destination.highlights.length > 0 && (
                  <div className="mb-3 flex flex-wrap gap-2">
                    {geoDetail.destination.highlights.slice(0, 6).map((h, i) => (
                      <Badge key={`hl-${i}`} variant="secondary">{h}</Badge>
                    ))}
                  </div>
                )}
                <div className="mb-3 text-xs text-muted-foreground">
                  <span className="mr-3">Beste Reisezeit: {geoDetail.destination?.bestSeason}</span>
                  <span className="mr-3">Ø Tagesbudget: {geoDetail.destination?.averageDailyCost} {geoDetail.destination?.currency}</span>
                  <span>Quelle: {geoDetail.destination?.source}</span>
                </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => setOpenPlan(true)}>Zu Reisen hinzufügen</Button>
              <Button size="sm" variant="outline" onClick={() => setGeoDetail(null)}>Schließen</Button>
            </div>
          </div>
        </div>
      )}
      {geoDetail && openPlan && geoDetail.destination && (
        <PlanTripDialog
          open={openPlan}
          onOpenChange={(o) => {
            if (!o) setOpenPlan(false);
          }}
          destination={geoDetail.destination}
          onConfirm={async (data: TripPlanData) => {
            if (!user || !geoDetail.destination) {
              toast.error('Bitte anmelden');
              return;
            }
            try {
                  let code = geoDetail.destination.countryCode || 'XX';
                  try {
                    const resp = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(geoDetail.destination.name)}&limit=1&addressdetails=1&accept-language=de`);
                    const arr = await resp.json();
                    const first = Array.isArray(arr) && arr[0];
                    const cc = first?.address?.country_code || first?.country_code || null;
                    if (cc && typeof cc === 'string') {
                      code = cc.toUpperCase();
                    }
                  } catch { void 0; }
              const startIso = new Date(data.startDate).toISOString();
              const endIso = new Date(data.endDate).toISOString();
              let lat: number | null = null;
              let lon: number | null = null;
              try {
                const resp2 = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(geoDetail.destination.name)}&limit=1&accept-language=de`);
                const arr2 = await resp2.json();
                const first2 = Array.isArray(arr2) && arr2[0];
                if (first2?.lat && first2?.lon) {
                  lat = Number(first2.lat);
                  lon = Number(first2.lon);
                }
              } catch { /* ignore */ }
              const { error } = await supabase
                .from('saved_trips')
                .insert({
                  user_id: user.id,
                  destination_name: geoDetail.destination.name,
                      destination_code: code,
                  image_url: geoDetail.destination.imageUrl,
                  daily_budget: data.dailyBudget,
                  currency: geoDetail.destination.currency || 'EUR',
                  start_date: startIso,
                  end_date: endIso,
                  notes: JSON.stringify({
                    peopleCount: data.peopleCount,
                    todos: defaultTodos,
                    coords: lat !== null && lon !== null ? { lat, lon } : undefined,
                  }),
                });
              if (error) throw error;
              toast.success('Reise hinzugefügt');
              setOpenPlan(false);
              setGeoDetail(null);
            } catch (e) {
              toast.error('Fehler beim Speichern');
            }
          }}
        />
      )}
    </div>
  );
};
