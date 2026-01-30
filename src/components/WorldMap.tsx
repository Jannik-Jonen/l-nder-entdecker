import { useMemo } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup, Marker } from 'react-simple-maps';
import { useNavigate } from 'react-router-dom';
import { inspirationDestinations, guidePosts } from '@/data/mockData';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

export const WorldMap = () => {
  const navigate = useNavigate();
  const [zoom, setZoom] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const markers = useMemo(() => {
    const coordById: Record<string, [number, number]> = {
      'dest-1': [115, -8], // Bali, Indonesien
      'dest-2': [-19, 65], // Island
      'dest-3': [135, 35], // Kyoto, Japan
      'dest-4': [18, -34], // Kapstadt, Südafrika
      'dest-5': [73, 4], // Malediven
      'dest-6': [-72, -51], // Patagonien
      'dest-7': [25, 36], // Santorini
      'dest-8': [-8, 31], // Marrakesch
      'dest-12': [20.8, 37.8], // Zakynthos
    };
    return inspirationDestinations
      .map((d) => ({
        id: d.id,
        name: d.name,
        coords: coordById[d.id],
      }))
      .filter((m) => Array.isArray(m.coords));
  }, []);

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
                          className="px-2 py-1 rounded bg-primary text-primary-foreground"
                          onClick={(ev) => {
                            ev.preventDefault();
                            ev.stopPropagation();
                            navigate(`/guides/${m.id}`);
                          }}
                        >
                          Guide öffnen
                        </button>
                        {guidePosts.find((p) => p.destinationId === m.id) && (
                          <button
                            className="px-2 py-1 rounded bg-muted text-foreground"
                            onClick={(ev) => {
                              ev.preventDefault();
                              ev.stopPropagation();
                               navigate(`/guides/${m.id}?section=posts`);
                            }}
                          >
                            Beitrag
                          </button>
                        )}
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
    </div>
  );
};
