import { useMemo, useEffect } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup, Marker } from 'react-simple-maps';
import { useNavigate } from 'react-router-dom';
import { inspirationDestinations, guidePosts, defaultTodos } from '@/data/mockData';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { fetchRichDestinationData } from '@/services/travelData';
import { PlanTripDialog, TripPlanData } from '@/components/PlanTripDialog';
import type { Destination } from '@/types/travel';
import { toast } from 'sonner';

const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

export const WorldMap = () => {
  const navigate = useNavigate();
  const [zoom, setZoom] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { user } = useAuth();
  const [markers, setMarkers] = useState<Array<{ id: string; name: string; coords: [number, number] }>>([]);
  const [geoDetail, setGeoDetail] = useState<{ name: string; destination: Destination | null } | null>(null);
  const [openPlan, setOpenPlan] = useState(false);
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
        .select('id,destination_name');
      if (error) {
        setMarkers(defaultMarkers as Array<{ id: string; name: string; coords: [number, number] }>);
        return;
      }
      const trips = (data || []) as Array<{ id: string; destination_name: string }>;
      const geocoded = await Promise.all(
        trips.map(async (t) => {
          try {
            const resp = await fetch(
              `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                t.destination_name
              )}&limit=1&accept-language=de`
            );
            const arr = await resp.json();
            const first = Array.isArray(arr) && arr[0];
            if (!first || !first.lat || !first.lon) return null;
            const lat = Number(first.lat);
            const lon = Number(first.lon);
            return { id: t.id, name: t.destination_name, coords: [lon, lat] as [number, number] };
          } catch {
            return null;
          }
        })
      );
      setMarkers(geocoded.filter(Boolean) as Array<{ id: string; name: string; coords: [number, number] }>);
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
          center={[10, 20]}
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
              }}
            >
              <circle r={4} className="fill-primary" />
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
              const startIso = new Date(data.startDate).toISOString();
              const endIso = new Date(data.endDate).toISOString();
              const { error } = await supabase
                .from('saved_trips')
                .insert({
                  user_id: user.id,
                  destination_name: geoDetail.destination.name,
                  destination_code: geoDetail.destination.countryCode || 'XX',
                  image_url: geoDetail.destination.imageUrl,
                  daily_budget: data.dailyBudget,
                  currency: geoDetail.destination.currency || 'EUR',
                  start_date: startIso,
                  end_date: endIso,
                  notes: JSON.stringify({
                    peopleCount: data.peopleCount,
                    todos: defaultTodos,
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
