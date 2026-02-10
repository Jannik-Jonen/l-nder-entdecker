INSERT INTO public.destinations (
  name,
  country,
  country_code,
  type,
  types,
  image_url,
  description,
  highlights,
  best_season,
  average_daily_cost,
  currency,
  visa_info,
  vaccination_info,
  health_safety_info,
  source,
  coords_lat,
  coords_lon
)
SELECT
  'Madagaskar',
  'Madagaskar',
  'MG',
  'country',
  ARRAY['country', 'island'],
  'https://source.unsplash.com/featured/?madagascar',
  'Inselstaat mit einzigartiger Natur, Regenwäldern und Baobabs.',
  ARRAY['Baobab-Allee', 'Lemuren', 'Nosy Be', 'Tsingy de Bemaraha'],
  'April bis Oktober',
  65,
  'MGA',
  'Visum bei Ankunft oder eVisa möglich (aktuelle Bestimmungen prüfen).',
  'Hepatitis A empfohlen; Malariaprophylaxe je nach Region.',
  'Mückenschutz beachten; Infrastruktur außerhalb der Städte eingeschränkt.',
  'curated',
  -18.7669,
  46.8691
WHERE NOT EXISTS (
  SELECT 1
  FROM public.destinations existing
  WHERE existing.type = 'country'
    AND existing.name = 'Madagaskar'
    AND existing.country = 'Madagaskar'
);

INSERT INTO public.destinations (
  name,
  country,
  country_code,
  type,
  types,
  image_url,
  description,
  highlights,
  best_season,
  average_daily_cost,
  currency,
  visa_info,
  vaccination_info,
  health_safety_info,
  source,
  coords_lat,
  coords_lon
)
SELECT
  'Nigeria',
  'Nigeria',
  'NG',
  'country',
  ARRAY['country'],
  'https://source.unsplash.com/featured/?nigeria',
  'Westafrikanisches Land mit pulsierenden Städten, Küste und vielfältiger Kultur.',
  ARRAY['Lagos', 'Abuja', 'Yankari', 'Erin-Ijesha Wasserfälle'],
  'November bis März',
  55,
  'NGN',
  'Visum erforderlich; Einreisebestimmungen vorab prüfen.',
  'Hepatitis A empfohlen; Gelbfieberimpfung vorgeschrieben.',
  'Sicherheitslage prüfen; Reisewege sorgfältig planen.',
  'curated',
  9.082,
  8.6753
WHERE NOT EXISTS (
  SELECT 1
  FROM public.destinations existing
  WHERE existing.type = 'country'
    AND existing.name = 'Nigeria'
    AND existing.country = 'Nigeria'
);
