import { useMemo } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup, Marker } from 'react-simple-maps';
import { useNavigate } from 'react-router-dom';
import { inspirationDestinations } from '@/data/mockData';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

export const WorldMap = () => {
  const navigate = useNavigate();
  const [zoom, setZoom] = useState(1);
  const markers = useMemo(
    () =>
      inspirationDestinations.map((d) => ({
        id: d.id,
        name: d.name,
        coords:
          d.country === 'Indonesien'
            ? [115, -8]
            : d.country === 'Island'
            ? [-19, 65]
            : d.country === 'Japan'
            ? [135, 35]
            : d.country === 'Finnland'
            ? [25, 64]
            : d.country === 'Neuseeland'
            ? [174, -41]
            : [0, 0],
      })),
    []
  );

  return (
    <div
      className="relative rounded-2xl border border-border bg-card p-2 shadow-card"
      onWheel={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <div className="absolute top-3 right-3 z-10 flex gap-2">
        <Button size="sm" variant="outline" onClick={() => setZoom((z) => Math.min(3, z + 0.25))}>+</Button>
        <Button size="sm" variant="outline" onClick={() => setZoom((z) => Math.max(0.75, z - 0.25))}>−</Button>
      </div>
      <ComposableMap projectionConfig={{ scale: 150 }} className="w-full h-[420px] text-muted-foreground">
        <ZoomableGroup center={[10, 20]} zoom={zoom}>
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
              onClick={() => navigate(`/guides/${m.id}`)}
            >
              <circle r={4} className="fill-primary" />
              <text className="text-xs fill-foreground drop-shadow-md" textAnchor="start" dx={6} dy={3}>
                {m.name}
              </text>
            </Marker>
          ))}
        </ZoomableGroup>
      </ComposableMap>
    </div>
  );
};
