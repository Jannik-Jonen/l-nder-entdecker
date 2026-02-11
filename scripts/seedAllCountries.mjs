import { createClient } from "@supabase/supabase-js";
import { createWriteStream } from "node:fs";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
import { Readable } from "node:stream";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Bitte SUPABASE_URL und SUPABASE_SERVICE_ROLE_KEY in der Umgebung setzen.");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const defaultDestinationImage = "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop";

const imageFromName = (name, countryCode) => {
  if (countryCode) return `https://flagcdn.com/w1280/${String(countryCode).toLowerCase()}.png`;
  if (!name) return defaultDestinationImage;
  const q = String(name).trim().replace(/\s+/g, "+");
  return `https://picsum.photos/seed/${encodeURIComponent(q)}/1200/800`;
};

const toSlug = (value) => {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};


const regionCostMap = {
  Europe: { cost: 110, currencyFallback: "EUR" },
  Asia: { cost: 60, currencyFallback: "USD" },
  Africa: { cost: 70, currencyFallback: "USD" },
  Americas: { cost: 120, currencyFallback: "USD" },
  Oceania: { cost: 140, currencyFallback: "AUD" },
  Antarctic: { cost: 120, currencyFallback: "USD" },
  Other: { cost: 90, currencyFallback: "USD" },
};
const getRegionDefaults = (regionName) => regionCostMap[regionName] || regionCostMap.Other;

const islandNameSet = new Set([
  "bahamas","barbados","cabo-verde","cape-verde","comoros","cuba","dominican-republic","east-timor","fiji","grenada","haiti",
  "iceland","indonesia","ireland","jamaica","japan","kiribati","maldives","marshall-islands","mauritius","micronesia","new-zealand",
  "palau","papua-new-guinea","philippines","saint-kitts-and-nevis","saint-lucia","saint-vincent-and-the-grenadines","samoa","seychelles",
  "singapore","solomon-islands","sri-lanka","taiwan","tonga","trinidad-and-tobago","tuvalu","united-kingdom","vanuatu"
]);
const isIslandCountry = (country, name) => {
  const key = toSlug(name);
  if (key.includes("island") || key.includes("islands")) return true;
  if (country.region && String(country.region).toLowerCase() === "oceania") return true;
  if (islandNameSet.has(key)) return true;
  return false;
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const americasIso2Set = new Set([
  "AG","AR","BS","BB","BZ","BO","BR","CA","CL","CO","CR","CU","DM","DO","EC","GD","GT","GY","HN","HT","JM","KN","LC","MX",
  "NI","PA","PE","PY","SR","SV","TT","US","UY","VC","VE"
]);

const isAmericasCountry = (country) => {
  if (country?.region && String(country.region).toLowerCase() === "americas") return true;
  if (country?.subregion && /america|caribbean/i.test(String(country.subregion))) return true;
  const code = String(country?.cca2 || "").toUpperCase();
  if (americasIso2Set.has(code)) return true;
  return false;
};

const worldCitiesUrls = [
  "https://gist.githubusercontent.com/curran/a59ef43debb9fcfd38858d0be4f3b087/raw/worldcities_clean.csv",
  "https://cdn.jsdelivr.net/gh/curran/worldcities@master/worldcities_clean.csv",
  "https://raw.githubusercontent.com/curran/worldcities/master/worldcities_clean.csv",
];

const fetchCountriesFromDb = async () => {
  const rows = [];
  let from = 0;
  const step = 1000;
  for (;;) {
    const { data, error } = await supabase
      .from("destinations")
      .select("name,country_code,currency,coords_lat,coords_lon,highlights")
      .eq("type", "country")
      .range(from, from + step - 1);
    if (error) throw error;
    if (!data || data.length === 0) break;
    rows.push(...data);
    if (data.length < step) break;
    from += step;
  }
  return rows.map((row) => ({
    name: { common: row.name },
    cca2: row.country_code,
    cca3: row.country_code || row.name,
    region: "Other",
    subregion: null,
    capital: Array.isArray(row.highlights) && row.highlights.length > 0 ? [row.highlights[0]] : null,
    latlng: row.coords_lat && row.coords_lon ? [Number(row.coords_lat), Number(row.coords_lon)] : null,
    currencies: row.currency ? { [row.currency]: { name: row.currency } } : null,
    altSpellings: row.name ? [row.name] : [],
  })).filter((row) => row.cca2);
};

const fetchCountries = async () => {
  const url = "https://restcountries.com/v3.1/all?fields=name,cca2,cca3,region,subregion,capital,latlng,capitalInfo,currencies,landlocked,altSpellings";
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);
    try {
      const resp = await fetch(url, { signal: controller.signal });
      if (!resp.ok) throw new Error("restcountries");
      const list = await resp.json();
      return Array.isArray(list) ? list : [];
    } catch (error) {
      if (attempt === 3) break;
      await sleep(1000 * attempt);
    } finally {
      clearTimeout(timeout);
    }
  }
  return fetchCountriesFromDb();
};

const getGeonamesDataset = () => {
  const dataset = process.env.GEONAMES_DATASET || "allCountries";
  const map = {
    allCountries: {
      url: "https://download.geonames.org/export/dump/allCountries.zip",
      fileName: "allCountries.txt",
    },
    cities15000: {
      url: "https://download.geonames.org/export/dump/cities15000.zip",
      fileName: "cities15000.txt",
    },
    cities5000: {
      url: "https://download.geonames.org/export/dump/cities5000.zip",
      fileName: "cities5000.txt",
    },
    cities1000: {
      url: "https://download.geonames.org/export/dump/cities1000.zip",
      fileName: "cities1000.txt",
    },
    cities500: {
      url: "https://download.geonames.org/export/dump/cities500.zip",
      fileName: "cities500.txt",
    },
  };
  const selected = map[dataset];
  if (!selected) {
    throw new Error(`Unbekanntes GEONAMES_DATASET: ${dataset}`);
  }
  return selected;
};

const parseCsvLine = (line) => {
  const result = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }
    if (ch === "," && !inQuotes) {
      result.push(current);
      current = "";
      continue;
    }
    current += ch;
  }
  result.push(current);
  return result;
};

const runProcess = (command, args) => {
  return new Promise((resolve, reject) => {
    const proc = spawn(command, args);
    proc.on("error", reject);
    proc.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${command}-exit-${code}`));
    });
  });
};

const fetchTextWithRetry = async (url, label) => {
  const attemptFetch = async () => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);
    try {
      const resp = await fetch(url, { signal: controller.signal });
      if (!resp.ok) throw new Error(label);
      return await resp.text();
    } finally {
      clearTimeout(timeout);
    }
  };
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      return await attemptFetch();
    } catch (error) {
      if (attempt === 3) return null;
      await sleep(1000 * attempt);
    }
  }
  return null;
};

const fetchWorldCities = async () => {
  let text = null;
  for (const url of worldCitiesUrls) {
    text = await fetchTextWithRetry(url, "worldcities");
    if (text) break;
  }
  if (!text) {
    for (const url of worldCitiesUrls) {
      try {
        const tmpPath = path.join(os.tmpdir(), `worldcities-${Date.now()}.csv`);
        await runProcess("curl", ["-L", "-o", tmpPath, url]);
        text = await fs.readFile(tmpPath, "utf8");
        await fs.unlink(tmpPath).catch(() => undefined);
        if (text) break;
      } catch (error) {
        text = null;
      }
    }
  }
  if (!text) {
    console.warn("Worldcities-Download fehlgeschlagen, ueberspringe Amerika-Staedte.");
    return new Map();
  }
  const lines = text.split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (lines.length === 0) return new Map();
  const header = parseCsvLine(lines[0]).map((h) => h.trim());
  const cityIndex = header.indexOf("city");
  const cityAsciiIndex = header.indexOf("city_ascii");
  const nameIndex = cityIndex >= 0 ? cityIndex : cityAsciiIndex;
  const latIndex = header.indexOf("lat");
  const lngIndex = header.indexOf("lng");
  const countryIndex = header.indexOf("country");
  const iso2Index = header.indexOf("iso2");
  const populationIndex = header.indexOf("population");
  if (nameIndex < 0 || latIndex < 0 || lngIndex < 0 || iso2Index < 0 || populationIndex < 0) {
    console.warn("Worldcities-CSV ohne erwartete Spalten, ueberspringe Amerika-Staedte.");
    return new Map();
  }
  const byIso2 = new Map();
  for (let i = 1; i < lines.length; i += 1) {
    const row = parseCsvLine(lines[i]);
    if (row.length <= populationIndex) continue;
    const name = row[nameIndex];
    const iso2 = row[iso2Index];
    const lat = Number(row[latIndex]);
    const lng = Number(row[lngIndex]);
    const population = Number(row[populationIndex]);
    if (!name || !iso2 || Number.isNaN(lat) || Number.isNaN(lng) || Number.isNaN(population)) continue;
    const code = iso2.toUpperCase();
    const entry = { name, lat, lng, population, country: row[countryIndex] || null };
    if (!byIso2.has(code)) byIso2.set(code, []);
    byIso2.get(code).push(entry);
  }
  return byIso2;
};

const buildAmericasCityRows = (countries, countryNameByCode, currencyByCode, regionByCode, existingKeys, worldCitiesByIso2) => {
  const rows = [];
  countries.filter(isAmericasCountry).forEach((country) => {
    const code = String(country?.cca2 || "").toUpperCase();
    if (!code || !worldCitiesByIso2.has(code)) return;
    const cities = worldCitiesByIso2.get(code)
      .filter((entry) => Number.isFinite(entry.population))
      .sort((a, b) => b.population - a.population);
    if (cities.length === 0) return;
    const topTen = cities.slice(0, 10);
    const remaining = cities.slice(10);
    const hiddenCandidates = remaining.filter((entry) => entry.population >= 50000 && entry.population <= 300000);
    let hidden = hiddenCandidates.slice(0, 2);
    if (hidden.length < 2) hidden = remaining.slice(0, 2);
    const selected = [
      ...topTen.map((entry) => ({ ...entry, isHidden: false })),
      ...hidden.map((entry) => ({ ...entry, isHidden: true })),
    ];
    const countryName = countryNameByCode.get(code) || country?.name?.common || code;
    const regionName = regionByCode.get(code) || country?.region || "Americas";
    const regionDefaults = getRegionDefaults(regionName);
    const currency = currencyByCode.get(code) || regionDefaults.currencyFallback;
    selected.forEach((entry) => {
      const key = `${entry.name}__${code}__city`;
      if (existingKeys.has(key)) return;
      rows.push({
        name: entry.name,
        country: countryName,
        country_code: code,
        type: "city",
        types: entry.isHidden ? ["city", "hidden-gem"] : ["city"],
        image_url: imageFromName(entry.name, code),
        description: entry.isHidden
          ? `Geheimtipp: ${entry.name} bietet authentische Einblicke in ${countryName} abseits der Hauptziele.`
          : `${entry.name} ist eine der groessten Staedte in ${countryName}.`,
        highlights: entry.isHidden
          ? ["Lokale Maerkte", "Altstadt", "Natur in der Naehe", "Cafes"]
          : ["Altstadt", "Maerkte", "Parks", "Lokale Kueche"],
        best_season: null,
        average_daily_cost: regionDefaults.cost,
        currency,
        visa_info: null,
        vaccination_info: null,
        health_safety_info: null,
        source: "worldcities",
        parent_id: null,
        coords_lat: entry.lat,
        coords_lon: entry.lng,
        children_count: null,
      });
      existingKeys.add(key);
    });
  });
  return rows;
};

const downloadZip = async (url, destPath) => {
  const attemptFetch = async () => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    try {
      const resp = await fetch(url, { signal: controller.signal });
      if (!resp.ok || !resp.body) throw new Error("geonames");
      return resp;
    } finally {
      clearTimeout(timeout);
    }
  };
  let resp = null;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      resp = await attemptFetch();
      break;
    } catch (error) {
      if (attempt === 3) {
        resp = null;
      } else {
        await sleep(1500 * attempt);
      }
    }
  }
  if (!resp) {
    await runProcess("curl", ["-L", "-o", destPath, url]);
    return;
  }
  const fileStream = createWriteStream(destPath);
  const stream = Readable.fromWeb(resp.body);
  await new Promise((resolve, reject) => {
    stream.pipe(fileStream);
    stream.on("error", reject);
    fileStream.on("error", reject);
    fileStream.on("finish", resolve);
  });
};

const buildRows = (countries) => {
  const rows = [];
  countries.forEach((country) => {
    const name = country?.name?.common;
    const cca2 = country?.cca2 || null;
    const cca3 = country?.cca3 || null;
    if (!name || !cca3) return;
    const regionName = country?.region || "Other";
    const subregionName = country?.subregion || null;
    const regionDefaults = getRegionDefaults(regionName);
    const types = ["country"];
    if (isIslandCountry(country, name)) types.push("island");
    const currencyCode = country?.currencies ? Object.keys(country.currencies)[0] : null;
    const capital = Array.isArray(country?.capital) ? country.capital[0] : null;
    const description = subregionName
      ? `${name} ist ein Land in ${regionName} (${subregionName}).`
      : `${name} ist ein Land in ${regionName}.`;
    rows.push({
      name,
      country: name,
      country_code: cca2,
      type: "country",
      types,
      image_url: imageFromName(name, cca2),
      description,
      highlights: capital ? [capital] : [],
      best_season: null,
      average_daily_cost: regionDefaults.cost,
      currency: currencyCode || regionDefaults.currencyFallback,
      visa_info: null,
      vaccination_info: null,
      health_safety_info: null,
      source: "restcountries",
      parent_id: null,
      coords_lat: country?.latlng?.[0] ?? null,
      coords_lon: country?.latlng?.[1] ?? null,
      children_count: null,
    });
  });
  return rows;
};

const fetchExistingCountries = async () => {
  const existing = [];
  let from = 0;
  const step = 1000;
  for (;;) {
    const { data, error } = await supabase
      .from("destinations")
      .select("name,country,type")
      .eq("type", "country")
      .range(from, from + step - 1);
    if (error) throw error;
    if (!data || data.length === 0) break;
    existing.push(...data);
    if (data.length < step) break;
    from += step;
  }
  const set = new Set();
  existing.forEach((row) => {
    set.add(`${row.name}__${row.country}__${row.type}`);
  });
  return set;
};

const fetchExistingCountryMap = async () => {
  const existing = [];
  let from = 0;
  const step = 1000;
  for (;;) {
    const { data, error } = await supabase
      .from("destinations")
      .select("name,country_code,type")
      .eq("type", "country")
      .range(from, from + step - 1);
    if (error) throw error;
    if (!data || data.length === 0) break;
    existing.push(...data);
    if (data.length < step) break;
    from += step;
  }
  const map = new Map();
  existing.forEach((row) => {
    if (row.country_code) map.set(row.country_code, row.name);
  });
  return map;
};

const streamGeonamesRows = async (countries, countryNameByCode, currencyByCode, regionByCode, existingKeys) => {
  const fallbackNames = new Map();
  countries.forEach((country) => {
    if (!country?.cca2) return;
    if (country?.name?.common) fallbackNames.set(country.cca2, country.name.common);
  });

  const { url, fileName } = getGeonamesDataset();
  const tmpPath = path.join(os.tmpdir(), `geonames-${Date.now()}.zip`);
  await downloadZip(url, tmpPath);

  const unzip = spawn("unzip", ["-p", tmpPath, fileName]);
  const unzipExit = new Promise((resolve, reject) => {
    unzip.on("close", resolve);
    unzip.on("error", reject);
  });
  let buffer = "";
  let batch = [];
  let inserted = 0;
  let skipped = 0;

  const flushBatch = async () => {
    if (batch.length === 0) return;
    const toInsert = batch;
    batch = [];
    await insertRows(toInsert);
    inserted += toInsert.length;
  };

  const pushRow = async (row) => {
    batch.push(row);
    if (batch.length >= 500) {
      await flushBatch();
    }
  };

  const handleLine = async (line) => {
    if (!line) return;
    const parts = line.split("\t");
    if (parts.length < 9) return;
    const name = parts[1];
    const lat = parts[4];
    const lon = parts[5];
    const featureClass = parts[6];
    const featureCode = parts[7];
    const countryCode = parts[8];
    if (!name || !countryCode) return;
    let type = null;
    let types = null;
    if (featureClass === "P") {
      type = "city";
      types = ["city"];
    } else if (featureClass === "A") {
      type = "region";
      types = ["region"];
    } else if (featureClass === "T" && /^(ISL|ISLS|ATOL)/.test(featureCode)) {
      type = "island";
      types = ["island"];
    } else if (["S", "H", "L", "T", "V"].includes(featureClass)) {
      type = "region";
      types = ["region"];
    } else {
      return;
    }
    const key = `${name}__${countryCode}__${type}`;
    if (existingKeys.has(key)) {
      skipped += 1;
      return;
    }
    const countryName = countryNameByCode.get(countryCode) || fallbackNames.get(countryCode) || countryCode;
    const regionDefaults = getRegionDefaults(regionByCode.get(countryCode) || "Other");
    const currency = currencyByCode.get(countryCode) || regionDefaults.currencyFallback;
    const description = type === "city"
      ? `${name} ist eine Stadt in ${countryName}.`
      : type === "island"
        ? `${name} ist eine Insel in ${countryName}.`
        : `${name} ist eine Region in ${countryName}.`;
    const highlights = type === "city"
      ? ["Altstadt", "Maerkte", "Parks", "Lokale Kueche"]
      : ["Landschaft", "Aussichten", "Natur", "Kultur"];
    await pushRow({
      name,
      country: countryName,
      country_code: countryCode,
      type,
      types,
      image_url: imageFromName(name, countryCode),
      description,
      highlights,
      best_season: null,
      average_daily_cost: regionDefaults.cost,
      currency,
      visa_info: null,
      vaccination_info: null,
      health_safety_info: null,
      source: "geonames",
      parent_id: null,
      coords_lat: lat ? Number(lat) : null,
      coords_lon: lon ? Number(lon) : null,
      children_count: null,
    });
    existingKeys.add(key);
  };

  try {
    for await (const chunk of unzip.stdout) {
      buffer += chunk.toString("utf8");
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";
      for (const line of lines) {
        await handleLine(line.trim());
      }
    }
    if (buffer) {
      await handleLine(buffer.trim());
    }
    await flushBatch();
    const exitCode = await unzipExit;
    if (exitCode && exitCode !== 0) {
      throw new Error("geonames-unzip");
    }
  } finally {
    unzip.kill();
    await fs.unlink(tmpPath).catch(() => undefined);
  }

  return { inserted, skipped };
};

const fetchExistingKeysForRows = async (rows) => {
  if (!rows || rows.length === 0) return new Set();
  const names = Array.from(new Set(rows.map((row) => row.name).filter(Boolean)));
  const countries = Array.from(new Set(rows.map((row) => row.country).filter(Boolean)));
  const types = Array.from(new Set(rows.map((row) => row.type).filter(Boolean)));
  if (names.length === 0 || countries.length === 0 || types.length === 0) return new Set();
  const { data, error } = await supabase
    .from("destinations")
    .select("name,country,type")
    .in("name", names)
    .in("country", countries)
    .in("type", types);
  if (error) throw error;
  const set = new Set();
  (data || []).forEach((row) => {
    set.add(`${row.name}__${row.country}__${row.type}`);
  });
  return set;
};

const insertRows = async (rows) => {
  const chunkSize = 200;
  for (let i = 0; i < rows.length; i += chunkSize) {
    const chunk = rows.slice(i, i + chunkSize);
    const existingKeys = await fetchExistingKeysForRows(chunk);
    const filtered = chunk.filter((row) => !existingKeys.has(`${row.name}__${row.country}__${row.type}`));
    if (filtered.length === 0) continue;
    const { error } = await supabase
      .from("destinations")
      .insert(filtered);
    if (error) throw error;
  }
};

const main = async () => {
  console.log("Seed-Script:", new URL(import.meta.url).pathname);
  console.log("Länderkatalog wird aufgebaut …");
  const countries = await fetchCountries();
  const rows = buildRows(countries);
  const existing = await fetchExistingCountries();
  const newRows = rows.filter((row) => !existing.has(`${row.name}__${row.country}__${row.type}`));
  await insertRows(newRows);
  console.log(`Fertig. ${newRows.length} Länder eingefügt, ${existing.size} bereits vorhanden.`);
  console.log("Seed-Weiter: Laender abgeschlossen.");

  console.log("Laender-Mapping wird geladen …");
  const countryNameByCode = await fetchExistingCountryMap();
  console.log("Laender-Mapping geladen.");
  const currencyByCode = new Map();
  const regionByCode = new Map();
  countries.forEach((country) => {
    if (!country?.cca2) return;
    const code = country?.currencies ? Object.keys(country.currencies)[0] : null;
    if (code) currencyByCode.set(country.cca2, code);
    if (country?.region) regionByCode.set(country.cca2, country.region);
  });
  console.log("Destination-Keys werden lokal verfolgt …");
  const existingKeys = new Set();
  console.log("Worldcities wird geladen …");
  const worldCitiesByIso2 = await fetchWorldCities();
  const americasRows = buildAmericasCityRows(
    countries,
    countryNameByCode,
    currencyByCode,
    regionByCode,
    existingKeys,
    worldCitiesByIso2
  );
  if (americasRows.length > 0) {
    await insertRows(americasRows);
  }
  console.log(`Amerika-Staedte: ${americasRows.length} eingefuegt.`);
  console.log("Geonames-Import wird gestartet …");
  try {
    const { inserted, skipped } = await streamGeonamesRows(countries, countryNameByCode, currencyByCode, regionByCode, existingKeys);
    console.log(`Geonames-Orte: ${inserted} eingefuegt, ${skipped} bereits vorhanden.`);
  } catch (error) {
    console.warn("Geonames-Import fehlgeschlagen, uebersprungen.", error?.message || error);
  }
};

main().catch((e) => {
  console.error("Seeding fehlgeschlagen:", e);
  process.exit(1);
});
