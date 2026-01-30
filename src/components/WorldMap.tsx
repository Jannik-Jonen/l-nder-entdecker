import { useMemo } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup, Marker } from 'react-simple-maps';
import { useNavigate } from 'react-router-dom';
import { inspirationDestinations } from '@/data/mockData';

const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

export const WorldMap = () => {
  const navigate = useNavigate();
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
    <div className="rounded-2xl border border-border bg-card p-2 shadow-card">
      <ComposableMap
        projectionConfig={{ scale: 150 }}
        className="w-full h-[420px] text-muted-foreground"
      >
        <ZoomableGroup center={[10, 20]} zoom={1}>
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
              <text className="text-xs fill-foreground" textAnchor="start" dx={6} dy={3}>
                {m.name}
              </text>
            </Marker>
          ))}
        </ZoomableGroup>
      </ComposableMap>
    </div>
  );
};
