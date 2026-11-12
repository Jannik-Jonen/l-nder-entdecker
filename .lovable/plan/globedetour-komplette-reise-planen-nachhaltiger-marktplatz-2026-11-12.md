# GlobeDetour: Komplette Reise planen + nachhaltiger Marktplatz

## Ziel
Statt "Weltreise" steht jetzt im Mittelpunkt: **eine komplette Reise planen und alles auf einen Blick haben**. Nachhaltige Anbieter können ihre Unterkünfte, Erlebnisse und Touren anbieten. Die Weltreise bleibt als eigener Modus erhalten.

## Phase 1 – Neue Positionierung (jetzt)
- Startseite neu: Hauptbotschaft "Deine ganze Reise. Ein Überblick." mit großem Eingabefeld: *"Beschreibe deine Wunschreise…"* (z. B. "10 Tage Portugal, nachhaltig, Wandern, 1.500 €").
- Abschnitte: So funktioniert's, Alles an einem Ort (Ablauf, Unterkünfte, Transport, Aktivitäten, Budget), Nachhaltige Anbieter, Weltreise als Zusatzmodus, Aufruf "Anbieter werden".
- Navigation: Dashboard · Reisen · Entdecken · Guides · Blog · Für Anbieter. "Weltreise" wandert in den Planer.

## Phase 2 – Reise-Übersicht (Kernstück)
Neue Seite pro Reise mit Reitern:
- **Überblick**: Zeitraum, Ziele, Budget-Ampel, nächste To-dos.
- **Tagesplan**: Tag für Tag, Einträge per Ziehen sortierbar (Aktivität, Sehenswürdigkeit, Transport, Unterkunft, Notiz).
- **Unterkünfte & Transport**: mit Check-in/out, Abfahrt/Ankunft, Buchungsstatus, Link.
- **Aktivitäten & Sehenswürdigkeiten**: eigene oder aus Anbieter-Angeboten übernommen.
- **Budget**: geplante vs. tatsächliche Kosten nach Kategorie.
- **Inspiration** (optional einblendbar): passende Guides, Ziele und Anbieter-Angebote.
- Bestehende Reisen und Weltreisen werden in dieser Übersicht angezeigt.

## Phase 3 – KI-Reiseerstellung aus Freitext
- Nutzer beschreibt Wunsch → KI erstellt komplette Reise (Tagesplan, Unterkunftsvorschläge, Transport, Aktivitäten, Budget) und bevorzugt passende Anbieter-Angebote aus der Plattform.
- Ergebnis landet direkt in der Reise-Übersicht und bleibt komplett bearbeitbar.

## Phase 4 – Anbieter-Bereich
- Seite "Für Anbieter" mit Vorteilen und Nachhaltigkeitskriterien.
- Registrierung als Anbieter: Firmenprofil, Nachhaltigkeitsnachweise (z. B. Zertifikate), Kontakt.
- Anbieter-Dashboard: Angebote anlegen (Unterkunft, Erlebnis, Tour, Transport) mit Bildern, Preis, Ort, Buchungslink.
- Freigabe aller Anbieter und Angebote durch dich im Admin-Bereich.
- Für Reisende: Suche/Filter nach Angeboten auf Ziel- und Inspirationsseiten, "Zur Reise hinzufügen", vorerst Weiterleitung zum Anbieter.

## Später (bewusst nicht jetzt)
- Direkt buchen & bezahlen bei GlobeDetour (Zahlungsanbieter mit Auszahlung an Anbieter + Provision).
- Flugsuche (benötigt einen externen Flugdaten-Anbieter mit eigenem Zugang).

## Technische Details
- Neue Tabellen: `trip_items` (route_id, day, type, title, time, cost_planned/actual, booking_status, link, offer_id, sort_order), `providers` (owner, Profil, Zertifikate, status), `provider_offers` (provider_id, type, destination_id, Preis, Bilder, external_url, status). RLS: Eigentümer verwalten, Öffentlichkeit sieht nur freigegebene, Admin via `has_role`.
- Rolle `provider` im bestehenden `app_role`-Enum ergänzen; Bilder in einem Storage-Bucket.
- `trip_routes` bekommt `trip_type` ('trip' | 'world_trip'), Start-/Enddatum; bestehende Daten bleiben gültig.
- Neue Edge Function für die Freitext-KI-Planung über das AI Gateway; nutzt freigegebene Angebote als Kontext.
- Admin-Prüfung im Header auf `has_role` umstellen statt E-Mail-Vergleich.

Reihenfolge: Phase 1 → 2 → 3 → 4, jeweils mit Prüfung im Browser.
