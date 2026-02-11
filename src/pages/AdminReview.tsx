import { useCallback, useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { isLocalSupabase, supabase } from "@/integrations/supabase/client";
import { supabaseUntyped } from "@/lib/supabase-untyped";
import { inspirationDestinations } from "@/data/mockData";
import { Destination } from "@/types/travel";
import { MapPin, Check, X, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

type GuidePostRow = {
  id: string;
  title: string;
  excerpt: string;
  image_url: string;
  destination_id: string;
  status: "draft" | "pending_review" | "published" | "rejected";
};
type BlogPostRow = {
  id: string;
  title: string;
  excerpt: string;
  image_url: string;
  status: "draft" | "pending_review" | "published" | "rejected";
};

type RestCountry = {
  name?: { common?: string };
  cca2?: string;
  cca3?: string;
  region?: string;
  subregion?: string;
  capital?: string[];
  latlng?: number[];
  capitalInfo?: { latlng?: number[] };
  currencies?: Record<string, { name?: string; symbol?: string }>;
  landlocked?: boolean;
};

const toSlug = (value: string) => {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

const toKey = (value: string) => toSlug(value || "");

const islandNameSet = new Set([
  "bahamas",
  "barbados",
  "cabo-verde",
  "cape-verde",
  "comoros",
  "cuba",
  "dominican-republic",
  "east-timor",
  "fiji",
  "grenada",
  "haiti",
  "iceland",
  "indonesia",
  "ireland",
  "jamaica",
  "japan",
  "kiribati",
  "maldives",
  "marshall-islands",
  "mauritius",
  "micronesia",
  "new-zealand",
  "palau",
  "papua-new-guinea",
  "philippines",
  "saint-kitts-and-nevis",
  "saint-lucia",
  "saint-vincent-and-the-grenadines",
  "samoa",
  "seychelles",
  "singapore",
  "solomon-islands",
  "sri-lanka",
  "taiwan",
  "tonga",
  "trinidad-and-tobago",
  "tuvalu",
  "united-kingdom",
  "vanuatu",
]);

const isIslandCountry = (country: RestCountry, name: string) => {
  const key = toKey(name);
  if (key.includes("island") || key.includes("islands")) return true;
  if (country.region && country.region.toLowerCase() === "oceania") return true;
  if (islandNameSet.has(key)) return true;
  return false;
};

const defaultDestinationImage = "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop";

const imageFromName = (name?: string, fallback = defaultDestinationImage, countryCode?: string | null) => {
  if (countryCode) return `https://flagcdn.com/w1280/${countryCode.toLowerCase()}.png`;
  if (!name) return fallback;
  return `https://picsum.photos/seed/${encodeURIComponent(name)}/1200/800`;
};

const regionCostMap: Record<string, { cost: number; currencyFallback: string }> = {
  Europe: { cost: 110, currencyFallback: "EUR" },
  Asia: { cost: 60, currencyFallback: "USD" },
  Africa: { cost: 70, currencyFallback: "USD" },
  Americas: { cost: 120, currencyFallback: "USD" },
  Oceania: { cost: 140, currencyFallback: "AUD" },
  Antarctic: { cost: 120, currencyFallback: "USD" },
  Other: { cost: 90, currencyFallback: "USD" },
};

const getRegionDefaults = (regionName?: string | null) => {
  if (regionName && regionCostMap[regionName]) return regionCostMap[regionName];
  return regionCostMap.Other;
};

const buildCountriesFromIntl = (): RestCountry[] => {
  const supportedValuesOf = (Intl as unknown as { supportedValuesOf?: (type: string) => string[] }).supportedValuesOf;
  if (typeof supportedValuesOf !== "function") return [];
  const display = new Intl.DisplayNames(["en"], { type: "region" });
  return supportedValuesOf("region")
    .map((code) => ({
      name: { common: display.of(code) || code },
      cca2: code,
      cca3: code,
      region: "Other",
    }))
    .filter((entry) => entry.name?.common);
};

const extraDestinations: Destination[] = [
  {
    id: "island-zakynthos",
    name: "Zakynthos",
    country: "Griechenland",
    countryCode: "GR",
    type: "island",
    types: ["island"],
    imageUrl: "https://images.unsplash.com/photo-1629286521433-dfa4637fbe9a?q=80&w=800",
    description: "Ionische Insel mit türkisfarbenen Buchten, Steilklippen und berühmtem Schiffswrackstrand.",
    highlights: ["Navagio Beach", "Blaue Grotten", "Gerakas Beach", "Keri Cliffs"],
    bestSeason: "Mai bis Oktober",
    averageDailyCost: 110,
    currency: "EUR",
    visaInfo: "Kein Visum erforderlich (EU/Schengen).",
    vaccinationInfo: "Standardimpfungen empfohlen.",
    healthSafetyInfo: "Starker Sonnenschutz und ausreichend Trinkwasser; in der Hochsaison früh zu beliebten Stränden.",
    source: "curated",
    parentId: "country-grc",
    coords: { lat: 37.787, lon: 20.899 },
  },
  {
    id: "island-santorini",
    name: "Santorin",
    country: "Griechenland",
    countryCode: "GR",
    type: "island",
    types: ["island"],
    imageUrl: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=800&q=80",
    description: "Vulkaninsel mit weiß‑blauen Dörfern, spektakulärer Caldera und Sonnenuntergängen.",
    highlights: ["Caldera", "Oia", "Fira", "Schwarze Sandstrände"],
    bestSeason: "Mai bis Oktober",
    averageDailyCost: 140,
    currency: "EUR",
    visaInfo: "Kein Visum erforderlich (EU/Schengen).",
    vaccinationInfo: "Standardimpfungen empfohlen.",
    healthSafetyInfo: "Viel Sonne und steile Wege – feste Schuhe und Sonnenschutz einplanen.",
    source: "curated",
    parentId: "country-grc",
    coords: { lat: 36.393, lon: 25.461 },
  },
  {
    id: "island-mykonos",
    name: "Mykonos",
    country: "Griechenland",
    countryCode: "GR",
    type: "island",
    types: ["island"],
    imageUrl: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&q=80",
    description: "Kykladeninsel mit lebendiger Altstadt, Windmühlen und lebhaften Strandbars.",
    highlights: ["Windmühlen", "Little Venice", "Paradise Beach", "Altstadt"],
    bestSeason: "Mai bis September",
    averageDailyCost: 160,
    currency: "EUR",
    visaInfo: "Kein Visum erforderlich (EU/Schengen).",
    vaccinationInfo: "Standardimpfungen empfohlen.",
    healthSafetyInfo: "Hochsaison ist sehr voll und teuer – rechtzeitig buchen.",
    source: "curated",
    parentId: "country-grc",
    coords: { lat: 37.446, lon: 25.328 },
  },
  {
    id: "island-crete",
    name: "Kreta",
    country: "Griechenland",
    countryCode: "GR",
    type: "island",
    types: ["island"],
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
    description: "Größte griechische Insel mit Stränden, Schluchten, Bergen und minoischer Geschichte.",
    highlights: ["Samaria-Schlucht", "Palast von Knossos", "Elafonissi", "Chania"],
    bestSeason: "April bis Oktober",
    averageDailyCost: 120,
    currency: "EUR",
    visaInfo: "Kein Visum erforderlich (EU/Schengen).",
    vaccinationInfo: "Standardimpfungen empfohlen.",
    healthSafetyInfo: "Mietwagen ideal für Erkundung; in den Bergen wechselhaftes Wetter beachten.",
    source: "curated",
    parentId: "country-grc",
    coords: { lat: 35.24, lon: 24.809 },
  },
  {
    id: "island-rhodes",
    name: "Rhodos",
    country: "Griechenland",
    countryCode: "GR",
    type: "island",
    types: ["island"],
    imageUrl: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80",
    description: "Sonnenreiche Insel mit mittelalterlicher Altstadt, Stränden und historischen Burgen.",
    highlights: ["Altstadt von Rhodos", "Lindos", "Strände", "Buchten"],
    bestSeason: "Mai bis Oktober",
    averageDailyCost: 115,
    currency: "EUR",
    visaInfo: "Kein Visum erforderlich (EU/Schengen).",
    vaccinationInfo: "Standardimpfungen empfohlen.",
    healthSafetyInfo: "Sonnenschutz und ausreichend Wasser; Altstadt ist kopfsteingepflastert.",
    source: "curated",
    parentId: "country-grc",
    coords: { lat: 36.434, lon: 28.217 },
  },
  {
    id: "island-corfu",
    name: "Korfu",
    country: "Griechenland",
    countryCode: "GR",
    type: "island",
    types: ["island"],
    imageUrl: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800&q=80",
    description: "Grüne Insel im Ionischen Meer mit venezianischer Altstadt und ruhigen Buchten.",
    highlights: ["Altstadt", "Paleokastritsa", "Olivenhaine", "Buchten"],
    bestSeason: "Mai bis Oktober",
    averageDailyCost: 110,
    currency: "EUR",
    visaInfo: "Kein Visum erforderlich (EU/Schengen).",
    vaccinationInfo: "Standardimpfungen empfohlen.",
    healthSafetyInfo: "Leichte Mückenbelastung im Sommer – Repellent mitnehmen.",
    source: "curated",
    parentId: "country-grc",
    coords: { lat: 39.624, lon: 19.922 },
  },
  {
    id: "island-mallorca",
    name: "Mallorca",
    country: "Spanien",
    countryCode: "ES",
    type: "island",
    types: ["island"],
    imageUrl: "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?w=800&q=80",
    description: "Baleareninsel mit abwechslungsreicher Küste, Bergen und lebendiger Hauptstadt.",
    highlights: ["Serra de Tramuntana", "Palma", "Cala Mondragó", "Valldemossa"],
    bestSeason: "April bis Oktober",
    averageDailyCost: 130,
    currency: "EUR",
    visaInfo: "Kein Visum erforderlich (EU/Schengen).",
    vaccinationInfo: "Standardimpfungen empfohlen.",
    healthSafetyInfo: "In der Hochsaison früh reservieren; Mietwagen für abgelegene Buchten hilfreich.",
    source: "curated",
    parentId: "country-esp",
    coords: { lat: 39.613, lon: 2.882 },
  },
  {
    id: "island-ibiza",
    name: "Ibiza",
    country: "Spanien",
    countryCode: "ES",
    type: "island",
    types: ["island"],
    imageUrl: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80",
    description: "Baleareninsel mit ruhigen Buchten, Altstadt und legendären Sonnenuntergängen.",
    highlights: ["Cala Comte", "Dalt Vila", "Sonnenuntergänge", "Strände"],
    bestSeason: "Mai bis Oktober",
    averageDailyCost: 150,
    currency: "EUR",
    visaInfo: "Kein Visum erforderlich (EU/Schengen).",
    vaccinationInfo: "Standardimpfungen empfohlen.",
    healthSafetyInfo: "Nachts Transfers planen; tagsüber Sonnenschutz wichtig.",
    source: "curated",
    parentId: "country-esp",
    coords: { lat: 38.906, lon: 1.42 },
  },
  {
    id: "island-sicily",
    name: "Sizilien",
    country: "Italien",
    countryCode: "IT",
    type: "island",
    types: ["island"],
    imageUrl: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&q=80",
    description: "Italiens größte Insel mit Vulkanlandschaften, Stränden und barocken Städten.",
    highlights: ["Ätna", "Taormina", "Cefalù", "Val di Noto"],
    bestSeason: "April bis Oktober",
    averageDailyCost: 125,
    currency: "EUR",
    visaInfo: "Kein Visum erforderlich (EU/Schengen).",
    vaccinationInfo: "Standardimpfungen empfohlen.",
    healthSafetyInfo: "Sommer sehr heiß – Ausflüge früh oder spät planen.",
    source: "curated",
    parentId: "country-ita",
    coords: { lat: 37.599, lon: 14.015 },
  },
  {
    id: "island-sardinia",
    name: "Sardinien",
    country: "Italien",
    countryCode: "IT",
    type: "island",
    types: ["island"],
    imageUrl: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=800&q=80",
    description: "Mittelmeerinsel mit türkisfarbenen Buchten, Granitküste und traditionellen Dörfern.",
    highlights: ["Costa Smeralda", "La Maddalena", "Cala Luna", "Alghero"],
    bestSeason: "Mai bis Oktober",
    averageDailyCost: 130,
    currency: "EUR",
    visaInfo: "Kein Visum erforderlich (EU/Schengen).",
    vaccinationInfo: "Standardimpfungen empfohlen.",
    healthSafetyInfo: "Mietwagen sinnvoll; viele Buchten sind nur per Auto erreichbar.",
    source: "curated",
    parentId: "country-ita",
    coords: { lat: 40.12, lon: 9.012 },
  },
  {
    id: "island-madeira",
    name: "Madeira",
    country: "Portugal",
    countryCode: "PT",
    type: "island",
    types: ["island"],
    imageUrl: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800&q=80",
    description: "Ganzjähriges Wanderparadies mit Levadas, Steilküsten und üppiger Vegetation.",
    highlights: ["Levadas", "Funchal", "Pico do Arieiro", "Klifflandschaften"],
    bestSeason: "Ganzjährig",
    averageDailyCost: 110,
    currency: "EUR",
    visaInfo: "Kein Visum erforderlich (EU/Schengen).",
    vaccinationInfo: "Standardimpfungen empfohlen.",
    healthSafetyInfo: "Wetter kann schnell wechseln – Regenjacke und gutes Schuhwerk mitnehmen.",
    source: "curated",
    parentId: "country-prt",
    coords: { lat: 32.76, lon: -16.959 },
  },
  {
    id: "island-azores",
    name: "Azoren",
    country: "Portugal",
    countryCode: "PT",
    type: "island",
    types: ["island"],
    imageUrl: "https://images.unsplash.com/photo-1482192505345-5655af888cc4?w=800&q=80",
    description: "Atlantischer Archipel mit Kraterseen, Thermalquellen und besten Whale-Watching-Spots.",
    highlights: ["Sete Cidades", "Whale Watching", "Wandern", "Thermalquellen"],
    bestSeason: "Mai bis Oktober",
    averageDailyCost: 105,
    currency: "EUR",
    visaInfo: "Kein Visum erforderlich (EU/Schengen).",
    vaccinationInfo: "Standardimpfungen empfohlen.",
    healthSafetyInfo: "Wechselhaftes Wetter; Kleidung im Zwiebellook einplanen.",
    source: "curated",
    parentId: "country-prt",
    coords: { lat: 37.742, lon: -25.675 },
  },
];

const curatedDestinations = [...inspirationDestinations, ...extraDestinations];

type SeedDestinationRow = {
  id: string;
  name: string;
  country: string;
  country_code: string | null;
  type: "country" | "island" | "city" | "region";
  types: Array<"country" | "island" | "city" | "region">;
  image_url: string | null;
  description: string | null;
  highlights: string[] | null;
  best_season: string | null;
  average_daily_cost: number | null;
  currency: string | null;
  visa_info: string | null;
  vaccination_info: string | null;
  health_safety_info: string | null;
  source: string | null;
  parent_id: string | null;
  coords_lat: number | null;
  coords_lon: number | null;
  children_count: number | null;
};

const buildDestinationSeedRows = async () => {
  const entries: SeedDestinationRow[] = [];
  const entryById = new Map<string, SeedDestinationRow>();
  const regionByName = new Map<string, SeedDestinationRow>();
  const subregionByName = new Map<string, SeedDestinationRow>();
  const countryByName = new Map<string, SeedDestinationRow>();
  const countryByCode = new Map<string, SeedDestinationRow>();

  const addEntry = (entry: SeedDestinationRow) => {
    entries.push(entry);
    entryById.set(entry.id, entry);
    return entry;
  };

  const ensureRegion = (name: string) => {
    const key = toKey(name);
    const existing = regionByName.get(key);
    if (existing) return existing;
    const regionDefaults = getRegionDefaults(name);
    const entry = addEntry({
      id: `region-${key}`,
      name,
      country: name,
      country_code: null,
      type: "region",
      types: ["region"],
      image_url: imageFromName(name),
      description: null,
      highlights: [],
      best_season: null,
      average_daily_cost: regionDefaults.cost,
      currency: regionDefaults.currencyFallback,
      visa_info: null,
      vaccination_info: null,
      health_safety_info: null,
      source: "restcountries",
      parent_id: null,
      coords_lat: null,
      coords_lon: null,
      children_count: null,
    });
    regionByName.set(key, entry);
    return entry;
  };

  const ensureSubregion = (region: SeedDestinationRow, name: string) => {
    const key = `${toKey(region.name)}-${toKey(name)}`;
    const existing = subregionByName.get(key);
    if (existing) return existing;
    const regionDefaults = getRegionDefaults(region.name);
    const entry = addEntry({
      id: `region-${key}`,
      name,
      country: region.name,
      country_code: null,
      type: "region",
      types: ["region"],
      image_url: imageFromName(name),
      description: null,
      highlights: [],
      best_season: null,
      average_daily_cost: regionDefaults.cost,
      currency: regionDefaults.currencyFallback,
      visa_info: null,
      vaccination_info: null,
      health_safety_info: null,
      source: "restcountries",
      parent_id: region.id,
      coords_lat: null,
      coords_lon: null,
      children_count: null,
    });
    subregionByName.set(key, entry);
    return entry;
  };

  const ensureUniqueId = (base: string) => {
    let id = base;
    let idx = 1;
    while (entryById.has(id)) {
      id = `${base}-${idx}`;
      idx += 1;
    }
    return id;
  };

  let list: RestCountry[] = [];
  try {
    const resp = await fetch("https://restcountries.com/v3.1/all?fields=name,cca2,cca3,region,subregion,capital,latlng,capitalInfo,currencies,landlocked");
    if (!resp.ok) throw new Error("restcountries");
    list = (await resp.json()) as RestCountry[];
  } catch {
    list = buildCountriesFromIntl();
  }

  list.forEach((country) => {
    const name = country.name?.common;
    const cca3 = country.cca3;
    if (!name || !cca3) return;
    const regionName = country.region || "Other";
    const regionDefaults = getRegionDefaults(regionName);
    const region = ensureRegion(regionName);
    const subregion = country.subregion ? ensureSubregion(region, country.subregion) : null;
    const types: Array<"country" | "island" | "city" | "region"> = ["country"];
    if (isIslandCountry(country, name)) types.push("island");
    const currencyCode = country.currencies ? Object.keys(country.currencies)[0] : null;
    const countryEntry = addEntry({
      id: `country-${cca3.toLowerCase()}`,
      name,
      country: name,
      country_code: country.cca2 || null,
      type: "country",
      types,
      image_url: imageFromName(name, defaultDestinationImage, country.cca2 || null),
      description: null,
      highlights: [],
      best_season: null,
      average_daily_cost: regionDefaults.cost,
      currency: currencyCode || regionDefaults.currencyFallback,
      visa_info: null,
      vaccination_info: null,
      health_safety_info: null,
      source: "restcountries",
      parent_id: subregion?.id || region.id,
      coords_lat: country.latlng?.[0] ?? null,
      coords_lon: country.latlng?.[1] ?? null,
      children_count: null,
    });
    countryByName.set(toKey(name), countryEntry);
    if (country.cca2) countryByCode.set(country.cca2.toUpperCase(), countryEntry);
    (country.capital || []).forEach((capital) => {
      if (!capital) return;
      const capitalId = ensureUniqueId(`city-${cca3.toLowerCase()}-${toSlug(capital)}`);
      addEntry({
        id: capitalId,
        name: capital,
        country: name,
        country_code: country.cca2 || null,
        type: "city",
        types: ["city"],
        image_url: imageFromName(capital, defaultDestinationImage, country.cca2 || null),
        description: null,
        highlights: [],
        best_season: null,
        average_daily_cost: regionDefaults.cost,
        currency: currencyCode || regionDefaults.currencyFallback,
        visa_info: null,
        vaccination_info: null,
        health_safety_info: null,
        source: "restcountries",
        parent_id: countryEntry.id,
        coords_lat: country.capitalInfo?.latlng?.[0] ?? null,
        coords_lon: country.capitalInfo?.latlng?.[1] ?? null,
        children_count: null,
      });
    });
  });

  if (list.length === 0) {
    curatedDestinations.forEach((d) => {
      addEntry({
        id: d.id,
        name: d.name,
        country: d.country,
        country_code: d.countryCode || null,
        type: d.type,
        types: d.types && d.types.length > 0 ? d.types : [d.type],
        image_url: d.imageUrl,
        description: d.description,
        highlights: d.highlights,
        best_season: d.bestSeason || null,
        average_daily_cost: d.averageDailyCost ?? null,
        currency: d.currency || null,
        visa_info: d.visaInfo || null,
        vaccination_info: d.vaccinationInfo || null,
        health_safety_info: d.healthSafetyInfo || null,
        source: d.source || null,
        parent_id: d.parentId || null,
        coords_lat: d.coords?.lat ?? null,
        coords_lon: d.coords?.lon ?? null,
        children_count: d.childrenCount ?? null,
      });
    });
  }

  curatedDestinations.forEach((d) => {
    const nameKey = toKey(d.name);
    const isCountryLevel = toKey(d.name) === toKey(d.country);
    const byName = countryByName.get(nameKey);
    const byCode = isCountryLevel && d.countryCode ? countryByCode.get(d.countryCode.toUpperCase()) : null;
    const target = byName || byCode;
    if (target) {
      const existingTypes = Array.isArray(target.types) ? target.types.slice() : [];
      const nextTypes = new Set(existingTypes);
      nextTypes.add(d.type);
      (d.types || []).forEach((t) => nextTypes.add(t));
      target.types = Array.from(nextTypes);
      target.image_url = d.imageUrl || target.image_url;
      target.description = d.description || target.description;
      target.highlights = d.highlights || target.highlights;
      target.best_season = d.bestSeason || target.best_season;
      target.average_daily_cost = d.averageDailyCost ?? target.average_daily_cost;
      target.currency = d.currency || target.currency;
      target.visa_info = d.visaInfo || target.visa_info;
      target.vaccination_info = d.vaccinationInfo || target.vaccination_info;
      target.health_safety_info = d.healthSafetyInfo || target.health_safety_info;
      target.source = d.source || target.source;
      return;
    }
    const parentFromCode = d.countryCode ? countryByCode.get(d.countryCode.toUpperCase()) : null;
    const id = ensureUniqueId(`dest-${toSlug(d.name)}`);
    addEntry({
      id,
      name: d.name,
      country: d.country,
      country_code: d.countryCode || null,
      type: d.type,
      types: d.types && d.types.length > 0 ? d.types : [d.type],
      image_url: d.imageUrl || null,
      description: d.description || null,
      highlights: d.highlights || [],
      best_season: d.bestSeason || null,
      average_daily_cost: d.averageDailyCost ?? null,
      currency: d.currency || null,
      visa_info: d.visaInfo || null,
      vaccination_info: d.vaccinationInfo || null,
      health_safety_info: d.healthSafetyInfo || null,
      source: d.source || null,
      parent_id: parentFromCode?.id || d.parentId || null,
      coords_lat: d.coords?.lat ?? null,
      coords_lon: d.coords?.lon ?? null,
      children_count: d.childrenCount ?? null,
    });
  });

  const childCounts = new Map<string, number>();
  entries.forEach((entry) => {
    if (!entry.parent_id) return;
    const count = childCounts.get(entry.parent_id) || 0;
    childCounts.set(entry.parent_id, count + 1);
  });
  entries.forEach((entry) => {
    const count = childCounts.get(entry.id);
    if (typeof count === "number") entry.children_count = count;
  });

  return entries;
};

const AdminReview = () => {
  const { user } = useAuth();
  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || "jannik.jonen@gmail.com";
  const isAdmin = !!user && !!adminEmail && user.email === adminEmail;
  const [posts, setPosts] = useState<GuidePostRow[]>([]);
  const [generalPosts, setGeneralPosts] = useState<BlogPostRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [mfaLevel, setMfaLevel] = useState<"aal1" | "aal2" | null>(null);
  const [mfaChecked, setMfaChecked] = useState(false);
  const [mfaCode, setMfaCode] = useState("");
  const [mfaChallengeId, setMfaChallengeId] = useState<string | null>(null);
  const [mfaRequesting, setMfaRequesting] = useState(false);
  const [mfaVerifying, setMfaVerifying] = useState(false);
  const [localCodeHint, setLocalCodeHint] = useState<string | null>(null);

  const refreshMfa = useCallback(async () => {
    if (!isAdmin) return;
    setMfaChecked(false);
    try {
      const { data, error } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
      if (error || !data?.currentLevel) {
        setMfaLevel("aal1");
        return;
      }
      setMfaLevel(data.currentLevel === "aal2" ? "aal2" : "aal1");
    } catch {
      setMfaLevel("aal1");
    } finally {
      setMfaChecked(true);
    }
  }, [isAdmin]);

  useEffect(() => {
    refreshMfa();
  }, [refreshMfa]);

  const extractLocalCode = (value: unknown) => {
    if (!value || typeof value !== "object") return null;
    if (!("code" in value)) return null;
    const code = (value as Record<string, unknown>).code;
    return typeof code === "string" ? code : null;
  };

  const requestLocalMfa = async () => {
    setMfaRequesting(true);
    setLocalCodeHint(null);
    try {
      const { data, error } = await supabase.auth.mfa.challenge({ factorId: "local" });
      if (error) {
        toast.error("2FA‑Code konnte nicht erstellt werden");
        return;
      }
      if (data && typeof data === "object" && "id" in data) {
        const id = (data as Record<string, unknown>).id;
        if (typeof id === "string") setMfaChallengeId(id);
      }
      const code = extractLocalCode(data);
      if (code) {
        setLocalCodeHint(code);
        toast.success(`Lokaler 2FA‑Code: ${code}`);
      }
    } finally {
      setMfaRequesting(false);
    }
  };

  const verifyLocalMfa = async () => {
    if (!mfaChallengeId) {
      toast.error("Bitte zuerst einen Code anfordern");
      return;
    }
    if (!mfaCode.trim()) {
      toast.error("Bitte den 2FA‑Code eingeben");
      return;
    }
    setMfaVerifying(true);
    try {
      const { error } = await supabase.auth.mfa.verify({
        factorId: "local",
        challengeId: mfaChallengeId,
        code: mfaCode.trim(),
      });
      if (error) {
        toast.error("2FA‑Code ungültig");
        return;
      }
      await refreshMfa();
      setMfaCode("");
      setMfaChallengeId(null);
      setLocalCodeHint(null);
      toast.success("2FA bestätigt");
    } finally {
      setMfaVerifying(false);
    }
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabaseUntyped
          .from("guide_posts")
          .select("id,title,excerpt,image_url,destination_id,status")
          .eq("status", "pending_review")
          .order("created_at", { ascending: false });
        if (!error && data) {
          setPosts(data as unknown as GuidePostRow[]);
        } else {
          setPosts([]);
        }
        const { data: blogData, error: blogErr } = await supabaseUntyped
          .from("blog_posts")
          .select("id,title,excerpt,image_url,status")
          .eq("status", "pending_review")
          .order("created_at", { ascending: false });
        if (!blogErr && blogData) {
          setGeneralPosts(blogData as unknown as BlogPostRow[]);
        } else {
          setGeneralPosts([]);
        }
      } finally {
        setLoading(false);
      }
    };
    if (isAdmin && mfaLevel === "aal2") load();
  }, [isAdmin, mfaLevel]);

  const updateStatus = async (id: string, status: GuidePostRow["status"]) => {
    try {
      const { error } = await supabaseUntyped
        .from("guide_posts")
        .update({ status })
        .eq("id", id);
      if (error) {
        toast.error("Update fehlgeschlagen");
        return;
      }
      setPosts((prev) => prev.filter((p) => p.id !== id));
      toast.success(status === "published" ? "Veröffentlicht" : "Zurückgewiesen");
    } catch {
      toast.error("Update fehlgeschlagen");
    }
  };
  const updateBlogStatus = async (id: string, status: BlogPostRow["status"]) => {
    try {
      const { error } = await supabaseUntyped
        .from("blog_posts")
        .update({ status })
        .eq("id", id);
      if (error) {
        toast.error("Update fehlgeschlagen");
        return;
      }
      setGeneralPosts((prev) => prev.filter((p) => p.id !== id));
      toast.success(status === "published" ? "Veröffentlicht" : "Zurückgewiesen");
    } catch {
      toast.error("Update fehlgeschlagen");
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-20 text-center">
          <div className="text-muted-foreground">Nicht berechtigt</div>
        </main>
      </div>
    );
  }
  if (mfaChecked && mfaLevel !== "aal2") {
    if (isLocalSupabase) {
      return (
        <div className="min-h-screen bg-background">
          <Header />
          <main className="container py-20 text-center">
            <div className="text-xl font-semibold mb-2">Admin‑2FA erforderlich</div>
            <div className="text-muted-foreground mb-6">
              Erstelle einen lokalen 2FA‑Code und bestätige ihn, um fortzufahren.
            </div>
            <div className="max-w-sm mx-auto space-y-3">
              <Input
                placeholder="6‑stelliger Code"
                value={mfaCode}
                onChange={(e) => setMfaCode(e.target.value)}
              />
              {localCodeHint ? (
                <div className="text-sm text-muted-foreground">Code: {localCodeHint}</div>
              ) : null}
              <div className="flex flex-col gap-2">
                <Button variant="secondary" onClick={requestLocalMfa} disabled={mfaRequesting}>
                  Code anfordern
                </Button>
                <Button onClick={verifyLocalMfa} disabled={mfaVerifying}>
                  Code bestätigen
                </Button>
              </div>
            </div>
          </main>
        </div>
      );
    }
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-20 text-center">
          <div className="text-xl font-semibold mb-2">Zwei‑Faktor‑Anmeldung erforderlich</div>
          <div className="text-muted-foreground mb-4">
            Bitte aktiviere 2FA (TOTP) in deinem Profil und melde dich danach erneut an.
          </div>
          <Link to="/profile">
            <Button variant="secondary">2FA aktivieren</Button>
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-3xl md:text-4xl font-bold">Beiträge prüfen</h1>
          <Button variant="secondary" className="gap-2" onClick={async () => {
            try {
              const rows = await buildDestinationSeedRows();
              const { error } = await supabaseUntyped
                .from("destinations")
                .upsert(rows, { onConflict: "id" });
              if (error) {
                toast.error("Destination-Seeding fehlgeschlagen");
                return;
              }
              toast.success("Destinations erfolgreich importiert");
            } catch {
              toast.error("Destination-Seeding fehlgeschlagen");
            }
          }}>
            <Sparkles className="h-4 w-4" /> Destinations seeden
          </Button>
          <Button variant="secondary" className="gap-2" onClick={async () => {
            try {
              const samples = inspirationDestinations.slice(0, 3).map((d, i) => ({
                id: `seed-${Date.now()}-${i}`,
                author_id: user?.id,
                destination_id: d.id,
                title: `Guide: ${d.name} – Route & Tipps`,
                excerpt: `Kompletter Reise-Guide für ${d.name} mit Route, Budget und praktischen Hinweisen.`,
                content: [
                  `Einleitung`,
                  `Warum ${d.name} und was erwartet dich.`,
                  ``,
                  `Praktische Infos`,
                  `• Beste Reisezeit: ${d.bestSeason}`,
                  `• Ø Tagesbudget: ${d.averageDailyCost} ${d.currency}/Tag`,
                  ``,
                  `Beispielroute`,
                  `• Tag 1–2: Highlights und Orientierung`,
                  `• Tag 3–5: Natur/Kultur je nach Region`,
                  ``,
                  `Budgettipps & Vorbereitung`,
                  `• Transport, Unterkunft, Packliste, Versicherungen`,
                ].join("\n"),
                image_url: d.imageUrl,
                tags: ["Guide", "Planung", d.type],
                sources: [],
                status: "pending_review" as const,
              }));
              const { error } = await supabaseUntyped.from("guide_posts").insert(samples);
              if (error) {
                toast.error("Seeding fehlgeschlagen");
                return;
              }
              toast.success("Beispiel‑Beiträge hinzugefügt");
            } catch {
              toast.error("Seeding fehlgeschlagen");
            }
          }}>
            <Sparkles className="h-4 w-4" /> Beispiel‑Beiträge hinzufügen
          </Button>
          <Button variant="secondary" className="gap-2" onClick={async () => {
            try {
              const now = Date.now();
              const samples = [
                {
                  id: `blog-seed-${now}-a`,
                  author_id: user?.id,
                  title: "Minimalistische Packliste: Reisen mit Handgepäck",
                  excerpt: "Was wirklich in deinen Rucksack gehört – praxisnah & leicht.",
                  content: [
                    "Einleitung",
                    "Warum minimalistisches Packen Freiheit schafft.",
                    "",
                    "Liste",
                    "• Kleidung, Hygiene, Technik, Notfall",
                    "",
                    "Tipps",
                    "• Multi-Use Items, Layering, Kompression"
                  ].join("\n"),
                  image_url: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800&q=80",
                  tags: ["Packen", "Ausrüstung", "Leicht"],
                  sources: [],
                  status: "pending_review" as const,
                },
                {
                  id: `blog-seed-${now}-b`,
                  author_id: user?.id,
                  title: "Reisebudget planen: Von Tageskosten bis Notfallpuffer",
                  excerpt: "Struktur und Tools für ein realistisches Budget ohne Stress.",
                  content: [
                    "Einleitung",
                    "Budget-Bausteine und typische Kosten.",
                    "",
                    "Aufteilung",
                    "• Fixkosten, variable Ausgaben, Puffer",
                    "",
                    "Werkzeuge",
                    "• Tabellen, Apps, Bargeldstrategie"
                  ].join("\n"),
                  image_url: "https://images.unsplash.com/photo-1518546305927-5a555bb702b3?w=800&q=80",
                  tags: ["Budget", "Planung", "Finanzen"],
                  sources: [],
                  status: "pending_review" as const,
                },
              ];
              const { error } = await supabaseUntyped.from("blog_posts").insert(samples);
              if (error) {
                toast.error("Seeding fehlgeschlagen");
                return;
              }
              toast.success("Beispiel‑Artikel hinzugefügt");
            } catch {
              toast.error("Seeding fehlgeschlagen");
            }
          }}>
            <Sparkles className="h-4 w-4" /> Beispiel‑Artikel hinzufügen
          </Button>
        </div>
        {loading ? (
          <div className="text-muted-foreground">Laden…</div>
        ) : (
          <>
            <div className="mb-8">
              <h2 className="font-display text-2xl font-semibold mb-3">Guides mit Destination</h2>
              {posts.length === 0 ? (
                <div className="text-muted-foreground">Keine Guide-Beiträge zur Prüfung</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {posts.map((p) => (
                    <div key={p.id} className="rounded-xl bg-card border border-border overflow-hidden">
                      <div className="relative h-40">
                        <img
                          src={p.image_url}
                          alt={p.title}
                          className="h-full w-full object-cover"
                          onError={(e) => { (e.currentTarget as HTMLImageElement).src = 'https://via.placeholder.com/800x480?text=Bild+nicht+verfügbar'; }}
                        />
                      </div>
                      <div className="p-4">
                        <div className="flex items-center gap-2 text-muted-foreground text-sm">
                          <MapPin className="h-4 w-4" />
                          <span>{(inspirationDestinations.find((d) => d.id === p.destination_id)?.name) || "Destination"}</span>
                        </div>
                        <h3 className="font-display text-lg font-semibold mt-1">{p.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">{p.excerpt}</p>
                        <div className="mt-4 flex items-center gap-2">
                          <Button variant="outline" asChild size="sm">
                            <Link to={`/guides/posts/${p.id}`}>Öffnen</Link>
                          </Button>
                          <Button variant="default" size="sm" className="gap-1" onClick={() => updateStatus(p.id, "published")}>
                            <Check className="h-4 w-4" /> Freigeben
                          </Button>
                          <Button variant="destructive" size="sm" className="gap-1" onClick={() => updateStatus(p.id, "rejected")}>
                            <X className="h-4 w-4" /> Ablehnen
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div>
              <h2 className="font-display text-2xl font-semibold mb-3">Allgemeine Blogartikel</h2>
              {generalPosts.length === 0 ? (
                <div className="text-muted-foreground">Keine Artikel zur Prüfung</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {generalPosts.map((p) => (
                    <div key={p.id} className="rounded-xl bg-card border border-border overflow-hidden">
                      <div className="relative h-40">
                        <img
                          src={p.image_url}
                          alt={p.title}
                          className="h-full w-full object-cover"
                          onError={(e) => { (e.currentTarget as HTMLImageElement).src = 'https://via.placeholder.com/800x480?text=Bild+nicht+verfügbar'; }}
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-display text-lg font-semibold mt-1">{p.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">{p.excerpt}</p>
                        <div className="mt-4 flex items-center gap-2">
                          <Button variant="outline" asChild size="sm">
                            <Link to={`/blog?post=${p.id}`}>Öffnen</Link>
                          </Button>
                          <Button variant="default" size="sm" className="gap-1" onClick={() => updateBlogStatus(p.id, "published")}>
                            <Check className="h-4 w-4" /> Freigeben
                          </Button>
                          <Button variant="destructive" size="sm" className="gap-1" onClick={() => updateBlogStatus(p.id, "rejected")}>
                            <X className="h-4 w-4" /> Ablehnen
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default AdminReview;
