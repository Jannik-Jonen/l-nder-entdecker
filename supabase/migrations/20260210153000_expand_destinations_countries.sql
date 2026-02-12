WITH data AS (
  SELECT *
  FROM jsonb_to_recordset(
    '[
      {
        "name": "Venezuela",
        "country": "Venezuela",
        "country_code": "VE",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://plus.unsplash.com/premium_photo-1733317216216-1bf7b1db4f65?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Land mit Karibikküste, Tepuis und Wasserfällen.",
        "highlights": [
          "Angel Falls",
          "Los Roques",
          "Caracas",
          "Tepuis"
        ],
        "best_season": "Dezember bis April",
        "average_daily_cost": 80,
        "currency": "VES",
        "visa_info": "Visumfrei für viele EU-Länder bis 90 Tage.",
        "vaccination_info": "Hepatitis A empfohlen; Gelbfieber je nach Region.",
        "health_safety_info": "Sicherheitslage prüfen und Reisewege gut planen.",
        "source": "curated",
        "coords_lat": 6.4238,
        "coords_lon": -66.5897
      },
      {
        "name": "Kolumbien",
        "country": "Kolumbien",
        "country_code": "CO",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1577070173374-6894bfa13803?q=80&w=685&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Vielfältiges Land mit Anden, Karibik und Kaffeezonen.",
        "highlights": [
          "Cartagena",
          "Medellín",
          "Kaffeezone",
          "Tayrona"
        ],
        "best_season": "Dezember bis März",
        "average_daily_cost": 70,
        "currency": "COP",
        "visa_info": "Visumfrei für viele EU-Länder bis 90 Tage.",
        "vaccination_info": "Hepatitis A empfohlen; Gelbfieber je nach Region.",
        "health_safety_info": "Sicherheitslage prüfen; Wertgegenstände unauffällig halten.",
        "source": "curated",
        "coords_lat": 4.5709,
        "coords_lon": -74.2973
      },
      {
        "name": "Peru",
        "country": "Peru",
        "country_code": "PE",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Land der Anden mit Inka-Kultur, Wüste und Regenwald.",
        "highlights": [
          "Machu Picchu",
          "Cusco",
          "Arequipa",
          "Amazonas"
        ],
        "best_season": "Mai bis September",
        "average_daily_cost": 65,
        "currency": "PEN",
        "visa_info": "Visumfrei für viele EU-Länder bis 90 Tage.",
        "vaccination_info": "Hepatitis A empfohlen; Gelbfieber für Amazonasregion.",
        "health_safety_info": "Höhenlage beachten; Mückenschutz im Regenwald.",
        "source": "curated",
        "coords_lat": -9.19,
        "coords_lon": -75.0152
      },
      {
        "name": "Chile",
        "country": "Chile",
        "country_code": "CL",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1478827387698-1527781a4887?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Langes Küstenland mit Wüste, Bergen und Patagonien.",
        "highlights": [
          "Atacama",
          "Santiago",
          "Valparaíso",
          "Patagonien"
        ],
        "best_season": "Oktober bis März",
        "average_daily_cost": 85,
        "currency": "CLP",
        "visa_info": "Visumfrei für viele EU-Länder bis 90 Tage.",
        "vaccination_info": "Standardimpfungen empfohlen.",
        "health_safety_info": "Große Distanzen; Inlandsflüge einplanen.",
        "source": "curated",
        "coords_lat": -35.6751,
        "coords_lon": -71.543
      },
      {
        "name": "Ecuador",
        "country": "Ecuador",
        "country_code": "EC",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1606591808963-8fc3c63fa6a2?q=80&w=1402&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Kleines Land mit Anden, Amazonas und Galápagos.",
        "highlights": [
          "Quito",
          "Galápagos",
          "Baños",
          "Amazonas"
        ],
        "best_season": "Juni bis September",
        "average_daily_cost": 60,
        "currency": "USD",
        "visa_info": "Visumfrei für viele EU-Länder bis 90 Tage.",
        "vaccination_info": "Hepatitis A empfohlen; Gelbfieber für Amazonasregion.",
        "health_safety_info": "Höhenlage beachten; Mückenschutz im Regenwald.",
        "source": "curated",
        "coords_lat": -1.8312,
        "coords_lon": -78.1834
      },
      {
        "name": "Costa Rica",
        "country": "Costa Rica",
        "country_code": "CR",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1620658927695-c33df6fb8130?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Naturparadies mit Regenwald, Vulkanen und Stränden.",
        "highlights": [
          "Arenal",
          "Monteverde",
          "Manuel Antonio",
          "Tamarindo"
        ],
        "best_season": "Dezember bis April",
        "average_daily_cost": 95,
        "currency": "CRC",
        "visa_info": "Visumfrei für viele EU-Länder bis 90 Tage.",
        "vaccination_info": "Hepatitis A empfohlen.",
        "health_safety_info": "Mückenschutz beachten; Regenzeit berücksichtigen.",
        "source": "curated",
        "coords_lat": 9.7489,
        "coords_lon": -83.7534
      },
      {
        "name": "Südafrika",
        "country": "Südafrika",
        "country_code": "ZA",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Land mit Safari, Küsten und abwechslungsreicher Natur.",
        "highlights": [
          "Kapstadt",
          "Krüger Park",
          "Garden Route",
          "Weinregionen"
        ],
        "best_season": "Mai bis September",
        "average_daily_cost": 80,
        "currency": "ZAR",
        "visa_info": "Visumfrei für viele EU-Länder bis 90 Tage.",
        "vaccination_info": "Hepatitis A empfohlen; Malariaprophylaxe in bestimmten Gebieten.",
        "health_safety_info": "Sicherheitshinweise beachten; Fahrten bei Nacht meiden.",
        "source": "curated",
        "coords_lat": -30.5595,
        "coords_lon": 22.9375
      },
      {
        "name": "Kenia",
        "country": "Kenia",
        "country_code": "KE",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?q=80&w=1467&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Safari-Land mit Savannen, Seen und Küste.",
        "highlights": [
          "Masai Mara",
          "Nairobi",
          "Diani Beach",
          "Naivasha"
        ],
        "best_season": "Juni bis Oktober",
        "average_daily_cost": 90,
        "currency": "KES",
        "visa_info": "eVisa erforderlich; vorab online beantragen.",
        "vaccination_info": "Gelbfieberimpfung empfohlen; Malariaprophylaxe je nach Region.",
        "health_safety_info": "Mückenschutz; Straßenverhältnisse beachten.",
        "source": "curated",
        "coords_lat": -0.0236,
        "coords_lon": 37.9062
      },
      {
        "name": "Tansania",
        "country": "Tansania",
        "country_code": "TZ",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1613864309738-9102a9e22883?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Safari-Klassiker mit Serengeti und Sansibar.",
        "highlights": [
          "Serengeti",
          "Sansibar",
          "Ngorongoro",
          "Kilimandscharo"
        ],
        "best_season": "Juni bis Oktober",
        "average_daily_cost": 90,
        "currency": "TZS",
        "visa_info": "Visum erforderlich; vorab oder bei Ankunft.",
        "vaccination_info": "Gelbfieberimpfung je nach Einreise; Malariaprophylaxe empfohlen.",
        "health_safety_info": "Mückenschutz; Safari nur mit lizenzierten Guides.",
        "source": "curated",
        "coords_lat": -6.369,
        "coords_lon": 34.8888
      },
      {
        "name": "Uganda",
        "country": "Uganda",
        "country_code": "UG",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1551357141-f73a8402ceb3?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Grünes Land mit Gorillas, Seen und Savannen.",
        "highlights": [
          "Bwindi",
          "Kampala",
          "Murchison Falls",
          "Lake Bunyonyi"
        ],
        "best_season": "Juni bis August, Dezember bis Februar",
        "average_daily_cost": 70,
        "currency": "UGX",
        "visa_info": "eVisa erforderlich; vorab online beantragen.",
        "vaccination_info": "Gelbfieberimpfung verpflichtend; Malariaprophylaxe empfohlen.",
        "health_safety_info": "Mückenschutz und Trinkwasser beachten.",
        "source": "curated",
        "coords_lat": 1.3733,
        "coords_lon": 32.2903
      },
      {
        "name": "Ägypten",
        "country": "Ägypten",
        "country_code": "EG",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1600520611035-84157ad4084d?q=80&w=1631&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Antikes Kulturland mit Pyramiden und Roter Meer Küste.",
        "highlights": [
          "Gizeh",
          "Luxor",
          "Nil",
          "Hurghada"
        ],
        "best_season": "Oktober bis April",
        "average_daily_cost": 55,
        "currency": "EGP",
        "visa_info": "Visum erforderlich; eVisa möglich.",
        "vaccination_info": "Hepatitis A empfohlen.",
        "health_safety_info": "Sonnenschutz; Trinkwasser beachten.",
        "source": "curated",
        "coords_lat": 26.8206,
        "coords_lon": 30.8025
      },
      {
        "name": "Namibia",
        "country": "Namibia",
        "country_code": "NA",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1559160581-44bd4222d397?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Wüstenland mit Weite, Dünen und Safaris.",
        "highlights": [
          "Sossusvlei",
          "Etosha",
          "Swakopmund",
          "Skeleton Coast"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 95,
        "currency": "NAD",
        "visa_info": "Visumfrei für viele EU-Länder bis 90 Tage.",
        "vaccination_info": "Hepatitis A empfohlen; Malariaprophylaxe im Norden.",
        "health_safety_info": "Große Distanzen; Fahrzeugzustand prüfen.",
        "source": "curated",
        "coords_lat": -22.9576,
        "coords_lon": 18.4904
      },
      {
        "name": "Botswana",
        "country": "Botswana",
        "country_code": "BW",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1591046940577-5badf473537a?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Safari-Land mit Okavango Delta und weiten Ebenen.",
        "highlights": [
          "Okavango",
          "Chobe",
          "Makgadikgadi",
          "Gaborone"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 120,
        "currency": "BWP",
        "visa_info": "Visumfrei für viele EU-Länder bis 90 Tage.",
        "vaccination_info": "Hepatitis A empfohlen; Malariaprophylaxe in bestimmten Gebieten.",
        "health_safety_info": "Safari nur mit erfahrenen Anbietern.",
        "source": "curated",
        "coords_lat": -22.3285,
        "coords_lon": 24.6849
      },
      {
        "name": "Thailand",
        "country": "Thailand",
        "country_code": "TH",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1519451241324-20b4ea2c4220?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Beliebtes Reiseziel mit Tempeln, Inseln und Streetfood.",
        "highlights": [
          "Bangkok",
          "Chiang Mai",
          "Phuket",
          "Krabi"
        ],
        "best_season": "November bis Februar",
        "average_daily_cost": 50,
        "currency": "THB",
        "visa_info": "Visumfrei für viele EU-Länder bis 30 Tage.",
        "vaccination_info": "Hepatitis A empfohlen; je nach Region Typhus.",
        "health_safety_info": "Mückenschutz beachten; Verkehr kann chaotisch sein.",
        "source": "curated",
        "coords_lat": 15.87,
        "coords_lon": 100.9925
      },
      {
        "name": "Malaysia",
        "country": "Malaysia",
        "country_code": "MY",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1508062878650-88b52897f298?q=80&w=627&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Land mit Regenwald, Metropolen und Inseln.",
        "highlights": [
          "Kuala Lumpur",
          "Borneo",
          "Penang",
          "Langkawi"
        ],
        "best_season": "Mai bis September",
        "average_daily_cost": 55,
        "currency": "MYR",
        "visa_info": "Visumfrei für viele EU-Länder bis 90 Tage.",
        "vaccination_info": "Hepatitis A empfohlen.",
        "health_safety_info": "Mückenschutz; Regenzeiten regional beachten.",
        "source": "curated",
        "coords_lat": 4.2105,
        "coords_lon": 101.9758
      },
      {
        "name": "Singapur",
        "country": "Singapur",
        "country_code": "SG",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?q=80&w=1352&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Moderne Stadtstaat-Metropole mit Kultur und Kulinarik.",
        "highlights": [
          "Marina Bay",
          "Gardens by the Bay",
          "Sentosa",
          "Chinatown"
        ],
        "best_season": "Ganzjährig",
        "average_daily_cost": 150,
        "currency": "SGD",
        "visa_info": "Visumfrei für viele EU-Länder bis 90 Tage.",
        "vaccination_info": "Standardimpfungen empfohlen.",
        "health_safety_info": "Sehr sicher; strenge Gesetze beachten.",
        "source": "curated",
        "coords_lat": 1.3521,
        "coords_lon": 103.8198
      },
      {
        "name": "Indien",
        "country": "Indien",
        "country_code": "IN",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1496372412473-e8548ffd82bc?q=80&w=1614&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Riesiges Land mit Kulturen, Bergen und tropischen Stränden.",
        "highlights": [
          "Delhi",
          "Agra",
          "Kerala",
          "Rajasthan"
        ],
        "best_season": "Oktober bis März",
        "average_daily_cost": 45,
        "currency": "INR",
        "visa_info": "eVisa erforderlich; vorab online beantragen.",
        "vaccination_info": "Hepatitis A empfohlen; je nach Region weitere Impfungen.",
        "health_safety_info": "Trinkwasser beachten; Verkehr kann chaotisch sein.",
        "source": "curated",
        "coords_lat": 20.5937,
        "coords_lon": 78.9629
      },
      {
        "name": "Sri Lanka",
        "country": "Sri Lanka",
        "country_code": "LK",
        "type": "country",
        "types": [
          "country",
          "island"
        ],
        "image_url": "https://images.unsplash.com/photo-1612862862126-865765df2ded?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Insel im Indischen Ozean mit Teeplantagen und Stränden.",
        "highlights": [
          "Sigiriya",
          "Kandy",
          "Ella",
          "Galle"
        ],
        "best_season": "Dezember bis März",
        "average_daily_cost": 50,
        "currency": "LKR",
        "visa_info": "ETA erforderlich; vorab online beantragen.",
        "vaccination_info": "Hepatitis A empfohlen.",
        "health_safety_info": "Mückenschutz beachten; Regenzeiten regional beachten.",
        "source": "curated",
        "coords_lat": 7.8731,
        "coords_lon": 80.7718
      },
      {
        "name": "Philippinen",
        "country": "Philippinen",
        "country_code": "PH",
        "type": "country",
        "types": [
          "country",
          "island"
        ],
        "image_url": "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Archipel mit Traumstränden, Vulkanen und Tauchspots.",
        "highlights": [
          "Palawan",
          "Cebu",
          "Bohol",
          "Siargao"
        ],
        "best_season": "Dezember bis Mai",
        "average_daily_cost": 55,
        "currency": "PHP",
        "visa_info": "Visumfrei für viele EU-Länder bis 30 Tage.",
        "vaccination_info": "Hepatitis A empfohlen; je nach Region Typhus.",
        "health_safety_info": "Taifun-Saison beachten; Inselhopping einplanen.",
        "source": "curated",
        "coords_lat": 12.8797,
        "coords_lon": 121.774
      },
      {
        "name": "Australien",
        "country": "Australien",
        "country_code": "AU",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1494233892892-84542a694e72?q=80&w=765&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Kontinent mit Metropolen, Outback und Stränden.",
        "highlights": [
          "Sydney",
          "Great Barrier Reef",
          "Melbourne",
          "Outback"
        ],
        "best_season": "September bis November, März bis Mai",
        "average_daily_cost": 140,
        "currency": "AUD",
        "visa_info": "eVisitor oder ETA erforderlich; vorab online beantragen.",
        "vaccination_info": "Standardimpfungen empfohlen.",
        "health_safety_info": "Große Distanzen; UV-Schutz beachten.",
        "source": "curated",
        "coords_lat": -25.2744,
        "coords_lon": 133.7751
      },
      {
        "name": "Neuseeland",
        "country": "Neuseeland",
        "country_code": "NZ",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1597655601841-214a4cfe8b2c?q=80&w=989&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Naturparadies mit Fjorden, Bergen und Seen.",
        "highlights": [
          "Queenstown",
          "Fiordland",
          "Rotorua",
          "Aoraki"
        ],
        "best_season": "November bis März",
        "average_daily_cost": 130,
        "currency": "NZD",
        "visa_info": "NZeTA erforderlich; vorab online beantragen.",
        "vaccination_info": "Standardimpfungen empfohlen.",
        "health_safety_info": "Wetter kann schnell wechseln; Outdoor-Ausrüstung beachten.",
        "source": "curated",
        "coords_lat": -40.9006,
        "coords_lon": 174.886
      },
      {
        "name": "Kanada",
        "country": "Kanada",
        "country_code": "CA",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?q=80&w=1411&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Weites Land mit Nationalparks, Seen und Städten.",
        "highlights": [
          "Banff",
          "Vancouver",
          "Toronto",
          "Niagara"
        ],
        "best_season": "Juni bis September",
        "average_daily_cost": 140,
        "currency": "CAD",
        "visa_info": "eTA erforderlich; vorab online beantragen.",
        "vaccination_info": "Standardimpfungen empfohlen.",
        "health_safety_info": "Wetter kann schnell wechseln; Mückenschutz in Seenregionen.",
        "source": "curated",
        "coords_lat": 56.1304,
        "coords_lon": -106.3468
      },
      {
        "name": "Mexiko",
        "country": "Mexiko",
        "country_code": "MX",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1568402102990-bc541580b59f?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Land mit Maya-Kultur, Kolonialstädten und Pazifik- sowie Karibikküste.",
        "highlights": [
          "Mexiko-Stadt",
          "Yucatán",
          "Oaxaca",
          "Baja California"
        ],
        "best_season": "November bis April",
        "average_daily_cost": 75,
        "currency": "MXN",
        "visa_info": "Visumfrei für viele EU-Länder bis 180 Tage.",
        "vaccination_info": "Hepatitis A empfohlen; je nach Region Typhus.",
        "health_safety_info": "Reiserouten planen; Nachtfahrten meiden.",
        "source": "curated",
        "coords_lat": 23.6345,
        "coords_lon": -102.5528
      },
      {
        "name": "Brasilien",
        "country": "Brasilien",
        "country_code": "BR",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Riesiges Land mit Amazonas, Stränden und pulsierenden Städten.",
        "highlights": [
          "Rio de Janeiro",
          "Amazonas",
          "Iguaçu",
          "Salvador"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 85,
        "currency": "BRL",
        "visa_info": "Visumfrei für viele EU-Länder bis 90 Tage.",
        "vaccination_info": "Hepatitis A empfohlen; Gelbfieber je nach Region.",
        "health_safety_info": "Sicherheitslage prüfen; Mückenschutz im Amazonas.",
        "source": "curated",
        "coords_lat": -14.235,
        "coords_lon": -51.9253
      },
      {
        "name": "Argentinien",
        "country": "Argentinien",
        "country_code": "AR",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1599094792743-7df3e8870800?q=80&w=1458&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Land mit Anden, Weingebieten und Patagonien.",
        "highlights": [
          "Buenos Aires",
          "Patagonien",
          "Mendoza",
          "Iguazú"
        ],
        "best_season": "Oktober bis März",
        "average_daily_cost": 85,
        "currency": "ARS",
        "visa_info": "Visumfrei für viele EU-Länder bis 90 Tage.",
        "vaccination_info": "Hepatitis A empfohlen; Gelbfieber je nach Region.",
        "health_safety_info": "Große Distanzen; Inlandsflüge einplanen.",
        "source": "curated",
        "coords_lat": -38.4161,
        "coords_lon": -63.6167
      },
      {
        "name": "Bolivien",
        "country": "Bolivien",
        "country_code": "BO",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1529801877115-8a69a227fcc0?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Höhenland mit Salzseen, Anden und indigener Kultur.",
        "highlights": [
          "Salar de Uyuni",
          "La Paz",
          "Sucre",
          "Titicacasee"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 50,
        "currency": "BOB",
        "visa_info": "Visumfrei für viele EU-Länder bis 90 Tage.",
        "vaccination_info": "Hepatitis A empfohlen; Gelbfieber je nach Region.",
        "health_safety_info": "Höhenlage beachten; langsam akklimatisieren.",
        "source": "curated",
        "coords_lat": -16.2902,
        "coords_lon": -63.5887
      },
      {
        "name": "Paraguay",
        "country": "Paraguay",
        "country_code": "PY",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1614949260630-1d8a27791215?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Ruhiges Land mit Flusslandschaften und kolonialem Erbe.",
        "highlights": [
          "Asunción",
          "Itaipú",
          "Jesuitenruinen",
          "Chaco"
        ],
        "best_season": "Mai bis September",
        "average_daily_cost": 45,
        "currency": "PYG",
        "visa_info": "Visumfrei für viele EU-Länder bis 90 Tage.",
        "vaccination_info": "Hepatitis A empfohlen.",
        "health_safety_info": "Hitze im Sommer beachten; Mückenschutz.",
        "source": "curated",
        "coords_lat": -23.4425,
        "coords_lon": -58.4438
      },
      {
        "name": "Uruguay",
        "country": "Uruguay",
        "country_code": "UY",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1689723744935-60e01c337543?q=80&w=1529&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Küstenland mit Stränden, Weingütern und entspannter Atmosphäre.",
        "highlights": [
          "Montevideo",
          "Punta del Este",
          "Colonia",
          "Weingüter"
        ],
        "best_season": "November bis März",
        "average_daily_cost": 85,
        "currency": "UYU",
        "visa_info": "Visumfrei für viele EU-Länder bis 90 Tage.",
        "vaccination_info": "Standardimpfungen empfohlen.",
        "health_safety_info": "Sommer ist Hochsaison; früh buchen.",
        "source": "curated",
        "coords_lat": -32.5228,
        "coords_lon": -55.7658
      },
      {
        "name": "Guatemala",
        "country": "Guatemala",
        "country_code": "GT",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1628128594359-25d5e30661dd?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Vulkanland mit Maya-Stätten und kolonialen Städten.",
        "highlights": [
          "Antigua",
          "Tikal",
          "Atitlán",
          "Semuc Champey"
        ],
        "best_season": "November bis April",
        "average_daily_cost": 55,
        "currency": "GTQ",
        "visa_info": "Visumfrei für viele EU-Länder bis 90 Tage.",
        "vaccination_info": "Hepatitis A empfohlen.",
        "health_safety_info": "Reiserouten planen; Nachtfahrten meiden.",
        "source": "curated",
        "coords_lat": 15.7835,
        "coords_lon": -90.2308
      },
      {
        "name": "Panama",
        "country": "Panama",
        "country_code": "PA",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1632505702897-cc41b0ba3b64?q=80&w=1633&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Land mit Kanal, Regenwald und Karibikinseln.",
        "highlights": [
          "Panamakanal",
          "Casco Viejo",
          "San Blas",
          "Boquete"
        ],
        "best_season": "Dezember bis April",
        "average_daily_cost": 85,
        "currency": "PAB",
        "visa_info": "Visumfrei für viele EU-Länder bis 90 Tage.",
        "vaccination_info": "Hepatitis A empfohlen.",
        "health_safety_info": "Mückenschutz; Regenzeit beachten.",
        "source": "curated",
        "coords_lat": 8.538,
        "coords_lon": -80.7821
      },
      {
        "name": "Nicaragua",
        "country": "Nicaragua",
        "country_code": "NI",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1590856028965-5683c4b48ad0?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Land mit Vulkanen, Seen und kolonialen Städten.",
        "highlights": [
          "Granada",
          "Ometepe",
          "León",
          "Vulkane"
        ],
        "best_season": "November bis April",
        "average_daily_cost": 45,
        "currency": "NIO",
        "visa_info": "Visumfrei für viele EU-Länder bis 90 Tage.",
        "vaccination_info": "Hepatitis A empfohlen.",
        "health_safety_info": "Reiserouten planen; Nachtfahrten meiden.",
        "source": "curated",
        "coords_lat": 12.8654,
        "coords_lon": -85.2072
      },
      {
        "name": "Honduras",
        "country": "Honduras",
        "country_code": "HN",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1637353831495-80b454520a24?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Land mit Karibikinseln, Regenwald und Maya-Stätten.",
        "highlights": [
          "Roatán",
          "Copán",
          "Karibikküste",
          "Nationalparks"
        ],
        "best_season": "November bis April",
        "average_daily_cost": 55,
        "currency": "HNL",
        "visa_info": "Visumfrei für viele EU-Länder bis 90 Tage.",
        "vaccination_info": "Hepatitis A empfohlen.",
        "health_safety_info": "Reiserouten planen; Nachtfahrten meiden.",
        "source": "curated",
        "coords_lat": 15.2,
        "coords_lon": -86.2419
      },
      {
        "name": "Belize",
        "country": "Belize",
        "country_code": "BZ",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1585541115010-5ea9833eacfe?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Karibikland mit Riffen, Dschungel und Höhlen.",
        "highlights": [
          "Barrier Reef",
          "Cayes",
          "ATM Cave",
          "Dschungel"
        ],
        "best_season": "November bis April",
        "average_daily_cost": 90,
        "currency": "BZD",
        "visa_info": "Visumfrei für viele EU-Länder bis 30 Tage.",
        "vaccination_info": "Hepatitis A empfohlen.",
        "health_safety_info": "Mückenschutz; Trinkwasser beachten.",
        "source": "curated",
        "coords_lat": 17.1899,
        "coords_lon": -88.4976
      },
      {
        "name": "Kuba",
        "country": "Kuba",
        "country_code": "CU",
        "type": "country",
        "types": [
          "country",
          "island"
        ],
        "image_url": "https://images.unsplash.com/photo-1529426301869-82f4d98d3d81?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Inselstaat mit kolonialen Städten, Oldtimern und Stränden.",
        "highlights": [
          "Havanna",
          "Trinidad",
          "Viñales",
          "Varadero"
        ],
        "best_season": "November bis April",
        "average_daily_cost": 70,
        "currency": "CUP",
        "visa_info": "Touristenkarte erforderlich; vorab beantragen.",
        "vaccination_info": "Hepatitis A empfohlen.",
        "health_safety_info": "Bargeld einplanen; Infrastruktur beachten.",
        "source": "curated",
        "coords_lat": 21.5218,
        "coords_lon": -77.7812
      },
      {
        "name": "Dominikanische Republik",
        "country": "Dominikanische Republik",
        "country_code": "DO",
        "type": "country",
        "types": [
          "country",
          "island"
        ],
        "image_url": "https://images.unsplash.com/photo-1551908080-36c7c22746a2?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Karibikland mit Stränden, Bergen und Kolonialgeschichte.",
        "highlights": [
          "Punta Cana",
          "Santo Domingo",
          "Samaná",
          "Jarabacoa"
        ],
        "best_season": "November bis April",
        "average_daily_cost": 95,
        "currency": "DOP",
        "visa_info": "Visumfrei für viele EU-Länder bis 90 Tage.",
        "vaccination_info": "Hepatitis A empfohlen.",
        "health_safety_info": "Sonnenschutz; Regenzeit beachten.",
        "source": "curated",
        "coords_lat": 18.7357,
        "coords_lon": -70.1627
      },
      {
        "name": "Jamaika",
        "country": "Jamaika",
        "country_code": "JM",
        "type": "country",
        "types": [
          "country",
          "island"
        ],
        "image_url": "https://images.unsplash.com/photo-1437719417032-8595fd9e9dc6?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Reggae-Insel mit Stränden, Bergen und Wasserfällen.",
        "highlights": [
          "Negril",
          "Blue Mountains",
          "Dunn''''s River Falls",
          "Kingston"
        ],
        "best_season": "November bis April",
        "average_daily_cost": 100,
        "currency": "JMD",
        "visa_info": "Visumfrei für viele EU-Länder bis 90 Tage.",
        "vaccination_info": "Hepatitis A empfohlen.",
        "health_safety_info": "Sicherheitslage prüfen; Nachtfahrten meiden.",
        "source": "curated",
        "coords_lat": 18.1096,
        "coords_lon": -77.2975
      },
      {
        "name": "Island",
        "country": "Island",
        "country_code": "IS",
        "type": "country",
        "types": [
          "country",
          "island"
        ],
        "image_url": "https://images.unsplash.com/photo-1531168556467-80aace0d0144?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Insel mit Geysiren, Wasserfällen und spektakulären Landschaften.",
        "highlights": [
          "Golden Circle",
          "Reykjavík",
          "Skógafoss",
          "Gletscher"
        ],
        "best_season": "Juni bis September",
        "average_daily_cost": 180,
        "currency": "ISK",
        "visa_info": "Kein Visum erforderlich (Schengen).",
        "vaccination_info": "Standardimpfungen empfohlen.",
        "health_safety_info": "Wetter schnell wechselhaft; Outdoor-Ausrüstung nötig.",
        "source": "curated",
        "coords_lat": 64.9631,
        "coords_lon": -19.0208
      },
      {
        "name": "Norwegen",
        "country": "Norwegen",
        "country_code": "NO",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1544085311-11a028465b03?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Skandinavisches Land mit Fjorden, Bergen und Nordlicht.",
        "highlights": [
          "Geirangerfjord",
          "Lofoten",
          "Oslo",
          "Tromsø"
        ],
        "best_season": "Juni bis August, Dezember bis März",
        "average_daily_cost": 180,
        "currency": "NOK",
        "visa_info": "Kein Visum erforderlich (Schengen).",
        "vaccination_info": "Standardimpfungen empfohlen.",
        "health_safety_info": "Hohe Preise; Wetter schnell wechselhaft.",
        "source": "curated",
        "coords_lat": 60.472,
        "coords_lon": 8.4689
      },
      {
        "name": "Schweden",
        "country": "Schweden",
        "country_code": "SE",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1534143340226-6cbc7628dbe5?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Land mit Seen, Wäldern und moderner Designkultur.",
        "highlights": [
          "Stockholm",
          "Schären",
          "Lappland",
          "Göteborg"
        ],
        "best_season": "Juni bis August",
        "average_daily_cost": 160,
        "currency": "SEK",
        "visa_info": "Kein Visum erforderlich (Schengen).",
        "vaccination_info": "Standardimpfungen empfohlen.",
        "health_safety_info": "Mückenschutz in Seenregionen.",
        "source": "curated",
        "coords_lat": 60.1282,
        "coords_lon": 18.6435
      },
      {
        "name": "Finnland",
        "country": "Finnland",
        "country_code": "FI",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1528155124528-06c125d81e89?q=80&w=689&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Land der tausend Seen, Saunen und Polarlichter.",
        "highlights": [
          "Helsinki",
          "Lappland",
          "Seenplatte",
          "Rovaniemi"
        ],
        "best_season": "Juni bis August, Dezember bis März",
        "average_daily_cost": 160,
        "currency": "EUR",
        "visa_info": "Kein Visum erforderlich (Schengen).",
        "vaccination_info": "Standardimpfungen empfohlen.",
        "health_safety_info": "Winter sehr kalt; passende Kleidung nötig.",
        "source": "curated",
        "coords_lat": 61.9241,
        "coords_lon": 25.7482
      },
      {
        "name": "Irland",
        "country": "Irland",
        "country_code": "IE",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1530538095376-a4936b35b5f0?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Grünes Land mit Küste, Burgen und Pubkultur.",
        "highlights": [
          "Dublin",
          "Cliffs of Moher",
          "Galway",
          "Ring of Kerry"
        ],
        "best_season": "Mai bis September",
        "average_daily_cost": 150,
        "currency": "EUR",
        "visa_info": "Visumfrei für viele EU-Länder bis 90 Tage.",
        "vaccination_info": "Standardimpfungen empfohlen.",
        "health_safety_info": "Wetter wechselhaft; Regenjacke einpacken.",
        "source": "curated",
        "coords_lat": 53.1424,
        "coords_lon": -7.6921
      },
      {
        "name": "Türkei",
        "country": "Türkei",
        "country_code": "TR",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1510253687831-0f982d7862fc?q=80&w=1467&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Land zwischen Europa und Asien mit Küsten, Geschichte und Vielfalt.",
        "highlights": [
          "Istanbul",
          "Kappadokien",
          "Pamukkale",
          "Antalya"
        ],
        "best_season": "April bis Juni, September bis Oktober",
        "average_daily_cost": 60,
        "currency": "TRY",
        "visa_info": "Visumfrei für viele EU-Länder bis 90 Tage.",
        "vaccination_info": "Standardimpfungen empfohlen.",
        "health_safety_info": "Hitze im Sommer; Trinkwasser beachten.",
        "source": "curated",
        "coords_lat": 38.9637,
        "coords_lon": 35.2433
      },
      {
        "name": "Jordanien",
        "country": "Jordanien",
        "country_code": "JO",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1580834341580-8c17a3a630ca?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Wüstenland mit Petra, Wadi Rum und Toten Meer.",
        "highlights": [
          "Petra",
          "Wadi Rum",
          "Amman",
          "Totes Meer"
        ],
        "best_season": "März bis Mai, Oktober bis November",
        "average_daily_cost": 85,
        "currency": "JOD",
        "visa_info": "Visum erforderlich; Jordan Pass möglich.",
        "vaccination_info": "Standardimpfungen empfohlen.",
        "health_safety_info": "Sonnenschutz; lange Wege einplanen.",
        "source": "curated",
        "coords_lat": 30.5852,
        "coords_lon": 36.2384
      },
      {
        "name": "Indonesien",
        "country": "Indonesien",
        "country_code": "ID",
        "type": "country",
        "types": [
          "country",
          "island"
        ],
        "image_url": "https://images.unsplash.com/photo-1559628233-100c798642d4?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Archipel mit Vulkanen, Stränden und kultureller Vielfalt.",
        "highlights": [
          "Bali",
          "Java",
          "Komodo",
          "Raja Ampat"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 55,
        "currency": "IDR",
        "visa_info": "Visumfrei oder VoA je nach Aufenthaltsdauer.",
        "vaccination_info": "Hepatitis A empfohlen; je nach Region weitere Impfungen.",
        "health_safety_info": "Mückenschutz; Inselhopping einplanen.",
        "source": "curated",
        "coords_lat": -0.7893,
        "coords_lon": 113.9213
      },
      {
        "name": "Afghanistan",
        "country": "Afghanistan",
        "country_code": "AF",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1637750832829-7cc7e0605c15?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Afghanistan ist ein Land in Asia (Southern Asia). Hauptstadt: Kabul.",
        "highlights": [
          "Kabul",
          "Tempel",
          "Street Food",
          "Berglandschaften"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 90,
        "currency": "AFN",
        "visa_info": "Visumregeln je nach Land prüfen.",
        "vaccination_info": "Hepatitis A empfohlen; je nach Region Typhus/Jap. Enzephalitis.",
        "health_safety_info": "Mückenschutz in Tropen; Verkehr kann chaotisch sein.",
        "source": "generated"
      },
      {
        "name": "Albania",
        "country": "Albania",
        "country_code": "AL",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1623167278440-fd212b72e1bd?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Albania ist ein Land in Europe (Southeast Europe). Hauptstadt: Tirana.",
        "highlights": [
          "Tirana",
          "Altstädte",
          "Museen",
          "Kulturstätten"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 90,
        "currency": "ALL",
        "visa_info": "Einreisebestimmungen je nach Staatsangehörigkeit prüfen.",
        "vaccination_info": "Standardimpfungen; Zeckenschutz in Waldgebieten.",
        "health_safety_info": "Taschendiebstahl beachten; hohe medizinische Standards.",
        "source": "generated"
      },
      {
        "name": "Algeria",
        "country": "Algeria",
        "country_code": "DZ",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1602496252172-8030f4df6ed0?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Algeria ist ein Land in Africa (Northern Africa). Hauptstadt: Algiers.",
        "highlights": [
          "Algiers",
          "Nationalparks",
          "Küstenorte",
          "Märkte"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 90,
        "currency": "DZD",
        "visa_info": "Visum häufig erforderlich; Bestimmungen vorab prüfen.",
        "vaccination_info": "Hepatitis A empfohlen; Gelbfieber je nach Region.",
        "health_safety_info": "Sicherheitslage prüfen; Mückenschutz beachten.",
        "source": "generated"
      },
      {
        "name": "Andorra",
        "country": "Andorra",
        "country_code": "AD",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1634141428610-1781a3862a9b?q=80&w=736&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Andorra ist ein Land in Europe (Southern Europe). Hauptstadt: Andorra la Vella.",
        "highlights": [
          "Andorra la Vella",
          "Altstädte",
          "Museen",
          "Kulturstätten"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 90,
        "currency": "EUR",
        "visa_info": "Einreisebestimmungen je nach Staatsangehörigkeit prüfen.",
        "vaccination_info": "Standardimpfungen; Zeckenschutz in Waldgebieten.",
        "health_safety_info": "Taschendiebstahl beachten; hohe medizinische Standards.",
        "source": "generated"
      },
      {
        "name": "Angola",
        "country": "Angola",
        "country_code": "AO",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1518521901256-c90d4db6f85c?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Angola ist ein Land in Africa (Middle Africa). Hauptstadt: Luanda.",
        "highlights": [
          "Luanda",
          "Nationalparks",
          "Küstenorte",
          "Märkte"
        ],
        "best_season": "November bis März",
        "average_daily_cost": 90,
        "currency": "AOA",
        "visa_info": "Visum häufig erforderlich; Bestimmungen vorab prüfen.",
        "vaccination_info": "Hepatitis A empfohlen; Gelbfieber je nach Region.",
        "health_safety_info": "Sicherheitslage prüfen; Mückenschutz beachten.",
        "source": "generated"
      },
      {
        "name": "Anguilla",
        "country": "Anguilla",
        "country_code": "AI",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1732817207979-b78bee396ddb?q=80&w=1476&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Anguilla ist ein Land in Americas (Caribbean). Hauptstadt: The Valley.",
        "highlights": [
          "The Valley",
          "Nationalparks",
          "Küsten",
          "Roadtrips"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 90,
        "currency": "XCD",
        "visa_info": "Einreisebestimmungen je nach Land vorab prüfen.",
        "vaccination_info": "Hepatitis A empfohlen; Gelbfieber in Tropen möglich.",
        "health_safety_info": "Sicherheitslage je nach Region prüfen; Mückenschutz in Tropen.",
        "source": "generated"
      },
      {
        "name": "Antarctica",
        "country": "Antarctica",
        "country_code": "AQ",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1603548746365-0c7a1583d826?q=80&w=722&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Antarctica ist ein Land in Antarctic.",
        "highlights": [
          "Natur",
          "Kultur",
          "Kulinarik",
          "Städte"
        ],
        "best_season": "November bis März",
        "average_daily_cost": 90,
        "currency": null,
        "visa_info": "Einreisebestimmungen vor Reiseantritt prüfen.",
        "vaccination_info": "Standardimpfungen prüfen.",
        "health_safety_info": "Aktuelle Reise- und Sicherheitshinweise beachten.",
        "source": "generated"
      },
      {
        "name": "Antigua & Barbuda",
        "country": "Antigua & Barbuda",
        "country_code": "AG",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1527354490195-9abc2e0b93cb?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Antigua & Barbuda ist ein Land in Americas (Caribbean). Hauptstadt: Saint John's.",
        "highlights": [
          "Saint John's",
          "Nationalparks",
          "Küsten",
          "Roadtrips"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 90,
        "currency": "XCD",
        "visa_info": "Einreisebestimmungen je nach Land vorab prüfen.",
        "vaccination_info": "Hepatitis A empfohlen; Gelbfieber in Tropen möglich.",
        "health_safety_info": "Sicherheitslage je nach Region prüfen; Mückenschutz in Tropen.",
        "source": "generated"
      },
      {
        "name": "Armenia",
        "country": "Armenia",
        "country_code": "AM",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1620693654464-7d33c7eac5a3?q=80&w=1474&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Armenia ist ein Land in Asia (Western Asia). Hauptstadt: Yerevan.",
        "highlights": [
          "Yerevan",
          "Tempel",
          "Street Food",
          "Berglandschaften"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 90,
        "currency": "AMD",
        "visa_info": "Visumregeln je nach Land prüfen.",
        "vaccination_info": "Hepatitis A empfohlen; je nach Region Typhus/Jap. Enzephalitis.",
        "health_safety_info": "Mückenschutz in Tropen; Verkehr kann chaotisch sein.",
        "source": "generated"
      },
      {
        "name": "Aruba",
        "country": "Aruba",
        "country_code": "AW",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1635153756203-cfea696035d4?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Aruba ist ein Land in Americas (Caribbean). Hauptstadt: Oranjestad.",
        "highlights": [
          "Oranjestad",
          "Nationalparks",
          "Küsten",
          "Roadtrips"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 90,
        "currency": "AWG",
        "visa_info": "Einreisebestimmungen je nach Land vorab prüfen.",
        "vaccination_info": "Hepatitis A empfohlen; Gelbfieber in Tropen möglich.",
        "health_safety_info": "Sicherheitslage je nach Region prüfen; Mückenschutz in Tropen.",
        "source": "generated"
      },
      {
        "name": "Austria",
        "country": "Austria",
        "country_code": "AT",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1597086831879-756db15e81d3?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Austria ist ein Land in Europe (Central Europe). Hauptstadt: Vienna.",
        "highlights": [
          "Vienna",
          "Altstädte",
          "Museen",
          "Kulturstätten"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 90,
        "currency": "EUR",
        "visa_info": "Einreisebestimmungen je nach Staatsangehörigkeit prüfen.",
        "vaccination_info": "Standardimpfungen; Zeckenschutz in Waldgebieten.",
        "health_safety_info": "Taschendiebstahl beachten; hohe medizinische Standards.",
        "source": "generated"
      },
      {
        "name": "Azerbaijan",
        "country": "Azerbaijan",
        "country_code": "AZ",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1596306499398-8d88944a5ec4?q=80&w=1412&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Azerbaijan ist ein Land in Asia (Western Asia). Hauptstadt: Baku.",
        "highlights": [
          "Baku",
          "Tempel",
          "Street Food",
          "Berglandschaften"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 90,
        "currency": "AZN",
        "visa_info": "Visumregeln je nach Land prüfen.",
        "vaccination_info": "Hepatitis A empfohlen; je nach Region Typhus/Jap. Enzephalitis.",
        "health_safety_info": "Mückenschutz in Tropen; Verkehr kann chaotisch sein.",
        "source": "generated"
      },
      {
        "name": "Bahamas",
        "country": "Bahamas",
        "country_code": "BS",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1559956144-83a135c9872e?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Bahamas ist ein Land in Americas (Caribbean). Hauptstadt: Nassau.",
        "highlights": [
          "Nassau",
          "Nationalparks",
          "Küsten",
          "Roadtrips"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 90,
        "currency": "BSD",
        "visa_info": "Einreisebestimmungen je nach Land vorab prüfen.",
        "vaccination_info": "Hepatitis A empfohlen; Gelbfieber in Tropen möglich.",
        "health_safety_info": "Sicherheitslage je nach Region prüfen; Mückenschutz in Tropen.",
        "source": "generated"
      },
      {
        "name": "Bahrain",
        "country": "Bahrain",
        "country_code": "BH",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1519677214308-f7f2f8b71acf?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Bahrain ist ein Land in Asia (Western Asia). Hauptstadt: Manama.",
        "highlights": [
          "Manama",
          "Tempel",
          "Street Food",
          "Berglandschaften"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 90,
        "currency": "BHD",
        "visa_info": "Visumregeln je nach Land prüfen.",
        "vaccination_info": "Hepatitis A empfohlen; je nach Region Typhus/Jap. Enzephalitis.",
        "health_safety_info": "Mückenschutz in Tropen; Verkehr kann chaotisch sein.",
        "source": "generated"
      },
      {
        "name": "Bangladesh",
        "country": "Bangladesh",
        "country_code": "BD",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1564034503-e7c9edcb420c?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Bangladesh ist ein Land in Asia (Southern Asia). Hauptstadt: Dhaka.",
        "highlights": [
          "Dhaka",
          "Tempel",
          "Street Food",
          "Berglandschaften"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 90,
        "currency": "BDT",
        "visa_info": "Visumregeln je nach Land prüfen.",
        "vaccination_info": "Hepatitis A empfohlen; je nach Region Typhus/Jap. Enzephalitis.",
        "health_safety_info": "Mückenschutz in Tropen; Verkehr kann chaotisch sein.",
        "source": "generated"
      },
      {
        "name": "Barbados",
        "country": "Barbados",
        "country_code": "BB",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1636728157814-17e3dd6cc94c?q=80&w=1472&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Barbados ist ein Land in Americas (Caribbean). Hauptstadt: Bridgetown.",
        "highlights": [
          "Bridgetown",
          "Nationalparks",
          "Küsten",
          "Roadtrips"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 90,
        "currency": "BBD",
        "visa_info": "Einreisebestimmungen je nach Land vorab prüfen.",
        "vaccination_info": "Hepatitis A empfohlen; Gelbfieber in Tropen möglich.",
        "health_safety_info": "Sicherheitslage je nach Region prüfen; Mückenschutz in Tropen.",
        "source": "generated"
      },
      {
        "name": "Belarus",
        "country": "Belarus",
        "country_code": "BY",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1597986762540-bd1206e2a8b0?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Belarus ist ein Land in Europe (Eastern Europe). Hauptstadt: Minsk.",
        "highlights": [
          "Minsk",
          "Altstädte",
          "Museen",
          "Kulturstätten"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 90,
        "currency": "BYN",
        "visa_info": "Einreisebestimmungen je nach Staatsangehörigkeit prüfen.",
        "vaccination_info": "Standardimpfungen; Zeckenschutz in Waldgebieten.",
        "health_safety_info": "Taschendiebstahl beachten; hohe medizinische Standards.",
        "source": "generated"
      },
      {
        "name": "Belgium",
        "country": "Belgium",
        "country_code": "BE",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1491557345352-5929e343eb89?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Belgium ist ein Land in Europe (Western Europe). Hauptstadt: Brussels.",
        "highlights": [
          "Brussels",
          "Altstädte",
          "Museen",
          "Kulturstätten"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 90,
        "currency": "EUR",
        "visa_info": "Einreisebestimmungen je nach Staatsangehörigkeit prüfen.",
        "vaccination_info": "Standardimpfungen; Zeckenschutz in Waldgebieten.",
        "health_safety_info": "Taschendiebstahl beachten; hohe medizinische Standards.",
        "source": "generated"
      },
      {
        "name": "Benin",
        "country": "Benin",
        "country_code": "BJ",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1600241005059-71de13374958?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Benin ist ein Land in Africa (Western Africa). Hauptstadt: Porto-Novo.",
        "highlights": [
          "Porto-Novo",
          "Nationalparks",
          "Küstenorte",
          "Märkte"
        ],
        "best_season": "Ganzjährig",
        "average_daily_cost": 90,
        "currency": "XOF",
        "visa_info": "Visum häufig erforderlich; Bestimmungen vorab prüfen.",
        "vaccination_info": "Hepatitis A empfohlen; Gelbfieber je nach Region.",
        "health_safety_info": "Sicherheitslage prüfen; Mückenschutz beachten.",
        "source": "generated"
      },
      {
        "name": "Bhutan",
        "country": "Bhutan",
        "country_code": "BT",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1578556881786-851d4b79cb73?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Bhutan ist ein Land in Asia (Southern Asia). Hauptstadt: Thimphu.",
        "highlights": [
          "Thimphu",
          "Tempel",
          "Street Food",
          "Berglandschaften"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 90,
        "currency": "BTN",
        "visa_info": "Visumregeln je nach Land prüfen.",
        "vaccination_info": "Hepatitis A empfohlen; je nach Region Typhus/Jap. Enzephalitis.",
        "health_safety_info": "Mückenschutz in Tropen; Verkehr kann chaotisch sein.",
        "source": "generated"
      },
      {
        "name": "Bosnia & Herzegovina",
        "country": "Bosnia & Herzegovina",
        "country_code": "BA",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1623536167776-922ccb1ff749?q=80&w=488&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Bosnia & Herzegovina ist ein Land in Europe (Southeast Europe). Hauptstadt: Sarajevo.",
        "highlights": [
          "Sarajevo",
          "Altstädte",
          "Museen",
          "Kulturstätten"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 90,
        "currency": "BAM",
        "visa_info": "Einreisebestimmungen je nach Staatsangehörigkeit prüfen.",
        "vaccination_info": "Standardimpfungen; Zeckenschutz in Waldgebieten.",
        "health_safety_info": "Taschendiebstahl beachten; hohe medizinische Standards.",
        "source": "generated"
      },
      {
        "name": "Britain (UK)",
        "country": "Britain (UK)",
        "country_code": "GB",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1561234311-a9e16fa60b25?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Britain (UK) ist ein Land in Europe (Northern Europe). Hauptstadt: London.",
        "highlights": [
          "London",
          "Altstädte",
          "Museen",
          "Kulturstätten"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 90,
        "currency": "GBP",
        "visa_info": "Einreisebestimmungen je nach Staatsangehörigkeit prüfen.",
        "vaccination_info": "Standardimpfungen; Zeckenschutz in Waldgebieten.",
        "health_safety_info": "Taschendiebstahl beachten; hohe medizinische Standards.",
        "source": "generated"
      },
      {
        "name": "Brunei",
        "country": "Brunei",
        "country_code": "BN",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1659418499116-a4580f895679?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Brunei ist ein Land in Asia (South-Eastern Asia). Hauptstadt: Bandar Seri Begawan.",
        "highlights": [
          "Bandar Seri Begawan",
          "Tempel",
          "Street Food",
          "Berglandschaften"
        ],
        "best_season": "Ganzjährig",
        "average_daily_cost": 90,
        "currency": "BND",
        "visa_info": "Visumregeln je nach Land prüfen.",
        "vaccination_info": "Hepatitis A empfohlen; je nach Region Typhus/Jap. Enzephalitis.",
        "health_safety_info": "Mückenschutz in Tropen; Verkehr kann chaotisch sein.",
        "source": "generated"
      },
      {
        "name": "Bulgaria",
        "country": "Bulgaria",
        "country_code": "BG",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1633210181101-774c588bc997?q=80&w=1577&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Bulgaria ist ein Land in Europe (Southeast Europe). Hauptstadt: Sofia.",
        "highlights": [
          "Sofia",
          "Altstädte",
          "Museen",
          "Kulturstätten"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 90,
        "currency": "BGN",
        "visa_info": "Einreisebestimmungen je nach Staatsangehörigkeit prüfen.",
        "vaccination_info": "Standardimpfungen; Zeckenschutz in Waldgebieten.",
        "health_safety_info": "Taschendiebstahl beachten; hohe medizinische Standards.",
        "source": "generated"
      },
      {
        "name": "Burkina Faso",
        "country": "Burkina Faso",
        "country_code": "BF",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1739066109742-90f2807449f0?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Burkina Faso ist ein Land in Africa (Western Africa). Hauptstadt: Ouagadougou.",
        "highlights": [
          "Ouagadougou",
          "Nationalparks",
          "Küstenorte",
          "Märkte"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 90,
        "currency": "XOF",
        "visa_info": "Visum häufig erforderlich; Bestimmungen vorab prüfen.",
        "vaccination_info": "Hepatitis A empfohlen; Gelbfieber je nach Region.",
        "health_safety_info": "Sicherheitslage prüfen; Mückenschutz beachten.",
        "source": "generated"
      },
      {
        "name": "Burundi",
        "country": "Burundi",
        "country_code": "BI",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1672787076496-ccb18a869605?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Burundi ist ein Land in Africa (Eastern Africa). Hauptstadt: Gitega.",
        "highlights": [
          "Gitega",
          "Nationalparks",
          "Küstenorte",
          "Märkte"
        ],
        "best_season": "Ganzjährig",
        "average_daily_cost": 90,
        "currency": "BIF",
        "visa_info": "Visum häufig erforderlich; Bestimmungen vorab prüfen.",
        "vaccination_info": "Hepatitis A empfohlen; Gelbfieber je nach Region.",
        "health_safety_info": "Sicherheitslage prüfen; Mückenschutz beachten.",
        "source": "generated"
      },
      {
        "name": "Cambodia",
        "country": "Cambodia",
        "country_code": "KH",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1566706546199-a93ba33ce9f7?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Cambodia ist ein Land in Asia (South-Eastern Asia). Hauptstadt: Phnom Penh.",
        "highlights": [
          "Phnom Penh",
          "Tempel",
          "Street Food",
          "Berglandschaften"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 90,
        "currency": "KHR",
        "visa_info": "Visumregeln je nach Land prüfen.",
        "vaccination_info": "Hepatitis A empfohlen; je nach Region Typhus/Jap. Enzephalitis.",
        "health_safety_info": "Mückenschutz in Tropen; Verkehr kann chaotisch sein.",
        "source": "generated"
      },
      {
        "name": "Kamerun",
        "country": "Kamerun",
        "country_code": "CM",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1682924754698-9f0a3bcef68f?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Kamerun ist ein Land in Africa (Middle Africa). Hauptstadt: Yaoundé.",
        "highlights": [
          "Yaoundé",
          "Nationalparks",
          "Küstenorte",
          "Märkte"
        ],
        "best_season": "Ganzjährig",
        "average_daily_cost": 90,
        "currency": "XAF",
        "visa_info": "Visum häufig erforderlich; Bestimmungen vorab prüfen.",
        "vaccination_info": "Hepatitis A empfohlen; Gelbfieber je nach Region.",
        "health_safety_info": "Sicherheitslage prüfen; Mückenschutz beachten.",
        "source": "generated"
      },
      {
        "name": "Kap Verde",
        "country": "Kap Verde",
        "country_code": "CV",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://plus.unsplash.com/premium_photo-1697729707449-8de5d66c5a83?q=80&w=1482&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Kap Verde ist ein Land in Africa (Western Africa). Hauptstadt: Praia.",
        "highlights": [
          "Praia",
          "Nationalparks",
          "Küstenorte",
          "Märkte"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 90,
        "currency": "CVE",
        "visa_info": "Visum häufig erforderlich; Bestimmungen vorab prüfen.",
        "vaccination_info": "Hepatitis A empfohlen; Gelbfieber je nach Region.",
        "health_safety_info": "Sicherheitslage prüfen; Mückenschutz beachten.",
        "source": "generated"
      },
      {
        "name": "Cayman Islands",
        "country": "Cayman Islands",
        "country_code": "KY",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1611946022552-d2ca5ffba186?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Cayman Islands ist ein Land in Americas (Caribbean). Hauptstadt: George Town.",
        "highlights": [
          "George Town",
          "Nationalparks",
          "Küsten",
          "Roadtrips"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 90,
        "currency": "KYD",
        "visa_info": "Einreisebestimmungen je nach Land vorab prüfen.",
        "vaccination_info": "Hepatitis A empfohlen; Gelbfieber in Tropen möglich.",
        "health_safety_info": "Sicherheitslage je nach Region prüfen; Mückenschutz in Tropen.",
        "source": "generated"
      },
      {
        "name": "Central African Rep.",
        "country": "Central African Rep.",
        "country_code": "CF",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1653714802676-6a50c7ead70e?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Central African Rep. ist ein Land in Africa (Middle Africa). Hauptstadt: Bangui.",
        "highlights": [
          "Bangui",
          "Nationalparks",
          "Küstenorte",
          "Märkte"
        ],
        "best_season": "Ganzjährig",
        "average_daily_cost": 90,
        "currency": "XAF",
        "visa_info": "Visum häufig erforderlich; Bestimmungen vorab prüfen.",
        "vaccination_info": "Hepatitis A empfohlen; Gelbfieber je nach Region.",
        "health_safety_info": "Sicherheitslage prüfen; Mückenschutz beachten.",
        "source": "generated"
      },
      {
        "name": "Chad",
        "country": "Chad",
        "country_code": "TD",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1676034625780-f662d34ac673?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Chad ist ein Land in Africa (Middle Africa). Hauptstadt: N'Djamena.",
        "highlights": [
          "N'Djamena",
          "Nationalparks",
          "Küstenorte",
          "Märkte"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 90,
        "currency": "XAF",
        "visa_info": "Visum häufig erforderlich; Bestimmungen vorab prüfen.",
        "vaccination_info": "Hepatitis A empfohlen; Gelbfieber je nach Region.",
        "health_safety_info": "Sicherheitslage prüfen; Mückenschutz beachten.",
        "source": "generated"
      },
      {
        "name": "China",
        "country": "China",
        "country_code": "CN",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1508804052814-cd3ba865a116?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "China ist ein Land in Asia (Eastern Asia). Hauptstadt: Beijing.",
        "highlights": [
          "Beijing",
          "Tempel",
          "Street Food",
          "Berglandschaften"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 90,
        "currency": "CNY",
        "visa_info": "Visumregeln je nach Land prüfen.",
        "vaccination_info": "Hepatitis A empfohlen; je nach Region Typhus/Jap. Enzephalitis.",
        "health_safety_info": "Mückenschutz in Tropen; Verkehr kann chaotisch sein.",
        "source": "generated"
      },
      {
        "name": "Christmas Island",
        "country": "Australia",
        "country_code": "AU",
        "type": "island",
        "types": [
          "island"
        ],
        "image_url": "https://images.unsplash.com/photo-1666203395124-df1f3416c3e1?q=80&w=1633&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Reiseziel mit vielfältigen Landschaften, Kultur und regionalen Highlights.",
        "highlights": [
          "Hauptstadt",
          "Natur",
          "Kultur",
          "Kulinarik"
        ],
        "best_season": "Ganzjährig",
        "average_daily_cost": 90,
        "currency": null,
        "visa_info": "Einreisebestimmungen je nach Staatsangehörigkeit vor Reiseantritt prüfen.",
        "vaccination_info": "Standardimpfungen prüfen; länderspezifische Empfehlungen beachten.",
        "health_safety_info": "Aktuelle Reise- und Sicherheitshinweise beachten.",
        "source": "generated"
      },
      {
        "name": "Cocos (Keeling) Islands",
        "country": "Australia",
        "country_code": "AU",
        "type": "island",
        "types": [
          "island"
        ],
        "image_url": "https://images.unsplash.com/photo-1743377432405-ce77fa78c5cf?q=80&w=1472&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Reiseziel mit vielfältigen Landschaften, Kultur und regionalen Highlights.",
        "highlights": [
          "Hauptstadt",
          "Natur",
          "Kultur",
          "Kulinarik"
        ],
        "best_season": "Ganzjährig",
        "average_daily_cost": 90,
        "currency": null,
        "visa_info": "Einreisebestimmungen je nach Staatsangehörigkeit vor Reiseantritt prüfen.",
        "vaccination_info": "Standardimpfungen prüfen; länderspezifische Empfehlungen beachten.",
        "health_safety_info": "Aktuelle Reise- und Sicherheitshinweise beachten.",
        "source": "generated"
      },
      {
        "name": "Komoren",
        "country": "Komoren",
        "country_code": "KM",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1748098210743-972125c9f3da?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Komoren ist ein Land in Africa (Eastern Africa). Hauptstadt: Moroni.",
        "highlights": [
          "Moroni",
          "Nationalparks",
          "Küstenorte",
          "Märkte"
        ],
        "best_season": "November bis März",
        "average_daily_cost": 90,
        "currency": "KMF",
        "visa_info": "Visum häufig erforderlich; Bestimmungen vorab prüfen.",
        "vaccination_info": "Hepatitis A empfohlen; Gelbfieber je nach Region.",
        "health_safety_info": "Sicherheitslage prüfen; Mückenschutz beachten.",
        "source": "generated"
      },
      {
        "name": "Kongo (Dem. Rep.)",
        "country": "Kongo (Dem. Rep.)",
        "country_code": "CD",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1657671520058-64293338bf94?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Kongo (Dem. Rep.) ist ein Land in Africa (Middle Africa). Hauptstadt: Kinshasa.",
        "highlights": [
          "Kinshasa",
          "Nationalparks",
          "Küstenorte",
          "Märkte"
        ],
        "best_season": "Ganzjährig",
        "average_daily_cost": 90,
        "currency": "CDF",
        "visa_info": "Visum häufig erforderlich; Bestimmungen vorab prüfen.",
        "vaccination_info": "Hepatitis A empfohlen; Gelbfieber je nach Region.",
        "health_safety_info": "Sicherheitslage prüfen; Mückenschutz beachten.",
        "source": "generated"
      },
      {
        "name": "Kongo (Rep.)",
        "country": "Kongo (Rep.)",
        "country_code": "CG",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1584192194671-0ebc0c8c4b53?q=80&w=1025&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Kongo (Rep.) ist ein Land in Africa (Middle Africa). Hauptstadt: Brazzaville.",
        "highlights": [
          "Brazzaville",
          "Nationalparks",
          "Küstenorte",
          "Märkte"
        ],
        "best_season": "Ganzjährig",
        "average_daily_cost": 90,
        "currency": "XAF",
        "visa_info": "Visum häufig erforderlich; Bestimmungen vorab prüfen.",
        "vaccination_info": "Hepatitis A empfohlen; Gelbfieber je nach Region.",
        "health_safety_info": "Sicherheitslage prüfen; Mückenschutz beachten.",
        "source": "generated"
      },
      {
        "name": "Cook Islands",
        "country": "Cook Islands",
        "country_code": "CK",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1598376538586-c244746bfa1e?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Cook Islands ist ein Land in Oceania (Polynesia). Hauptstadt: Avarua.",
        "highlights": [
          "Avarua",
          "Strände",
          "Lagunen",
          "Nationalparks"
        ],
        "best_season": "November bis März",
        "average_daily_cost": 90,
        "currency": "CKD",
        "visa_info": "Einreisebestimmungen je nach Land prüfen.",
        "vaccination_info": "Standardimpfungen; Mückenschutz in Tropeninseln.",
        "health_safety_info": "UV-Schutz beachten; Meeresströmungen berücksichtigen.",
        "source": "generated"
      },
      {
        "name": "Kroatien",
        "country": "Kroatien",
        "country_code": "HR",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1555990793-da11153b2473?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Kroatien ist ein Land in Europe (Southeast Europe). Hauptstadt: Zagreb.",
        "highlights": [
          "Zagreb",
          "Altstädte",
          "Museen",
          "Kulturstätten"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 90,
        "currency": "EUR",
        "visa_info": "Einreisebestimmungen je nach Staatsangehörigkeit prüfen.",
        "vaccination_info": "Standardimpfungen; Zeckenschutz in Waldgebieten.",
        "health_safety_info": "Taschendiebstahl beachten; hohe medizinische Standards.",
        "source": "generated"
      },
      {
        "name": "Curaçao",
        "country": "Curaçao",
        "country_code": "CW",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1724598674807-6acb225b98f2?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Curaçao ist ein Land in Americas (Caribbean). Hauptstadt: Willemstad.",
        "highlights": [
          "Willemstad",
          "Nationalparks",
          "Küsten",
          "Roadtrips"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 90,
        "currency": "ANG",
        "visa_info": "Einreisebestimmungen je nach Land vorab prüfen.",
        "vaccination_info": "Hepatitis A empfohlen; Gelbfieber in Tropen möglich.",
        "health_safety_info": "Sicherheitslage je nach Region prüfen; Mückenschutz in Tropen.",
        "source": "generated"
      },
      {
        "name": "Cyprus",
        "country": "Cyprus",
        "country_code": "CY",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1677023484291-005b9840132f?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Cyprus ist ein Land in Europe (Southern Europe). Hauptstadt: Nicosia.",
        "highlights": [
          "Nicosia",
          "Altstädte",
          "Museen",
          "Kulturstätten"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 90,
        "currency": "EUR",
        "visa_info": "Einreisebestimmungen je nach Staatsangehörigkeit prüfen.",
        "vaccination_info": "Standardimpfungen; Zeckenschutz in Waldgebieten.",
        "health_safety_info": "Taschendiebstahl beachten; hohe medizinische Standards.",
        "source": "generated"
      },
      {
        "name": "Czech Republic",
        "country": "Czech Republic",
        "country_code": "CZ",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1563913801192-bcefb1bb7651?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Czech Republic ist ein Land in Europe (Central Europe). Hauptstadt: Prague.",
        "highlights": [
          "Prague",
          "Altstädte",
          "Museen",
          "Kulturstätten"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 90,
        "currency": "CZK",
        "visa_info": "Einreisebestimmungen je nach Staatsangehörigkeit prüfen.",
        "vaccination_info": "Standardimpfungen; Zeckenschutz in Waldgebieten.",
        "health_safety_info": "Taschendiebstahl beachten; hohe medizinische Standards.",
        "source": "generated"
      },
      {
        "name": "Côte d''Ivoire",
        "country": "Côte d''Ivoire",
        "country_code": "CI",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1519566335946-e6f65f0f4fdf?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Côte d''Ivoire ist ein Land in Africa (Western Africa). Hauptstadt: Yamoussoukro.",
        "highlights": [
          "Yamoussoukro",
          "Nationalparks",
          "Küstenorte",
          "Märkte"
        ],
        "best_season": "Ganzjährig",
        "average_daily_cost": 90,
        "currency": "XOF",
        "visa_info": "Visum häufig erforderlich; Bestimmungen vorab prüfen.",
        "vaccination_info": "Hepatitis A empfohlen; Gelbfieber je nach Region.",
        "health_safety_info": "Sicherheitslage prüfen; Mückenschutz beachten.",
        "source": "generated"
      },
      {
        "name": "Denmark",
        "country": "Denmark",
        "country_code": "DK",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1552560880-2482cef14240?q=80&w=743&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Denmark ist ein Land in Europe (Northern Europe). Hauptstadt: Copenhagen.",
        "highlights": [
          "Copenhagen",
          "Altstädte",
          "Museen",
          "Kulturstätten"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 90,
        "currency": "DKK",
        "visa_info": "Einreisebestimmungen je nach Staatsangehörigkeit prüfen.",
        "vaccination_info": "Standardimpfungen; Zeckenschutz in Waldgebieten.",
        "health_safety_info": "Taschendiebstahl beachten; hohe medizinische Standards.",
        "source": "generated"
      },
      {
        "name": "Djibouti",
        "country": "Djibouti",
        "country_code": "DJ",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1669792976534-0633ce36a000?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Djibouti ist ein Land in Africa (Eastern Africa). Hauptstadt: Djibouti.",
        "highlights": [
          "Djibouti",
          "Nationalparks",
          "Küstenorte",
          "Märkte"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 90,
        "currency": "DJF",
        "visa_info": "Visum häufig erforderlich; Bestimmungen vorab prüfen.",
        "vaccination_info": "Hepatitis A empfohlen; Gelbfieber je nach Region.",
        "health_safety_info": "Sicherheitslage prüfen; Mückenschutz beachten.",
        "source": "generated"
      },
      {
        "name": "Dominica",
        "country": "Dominica",
        "country_code": "DM",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1678377402149-7e13cedccd4a?q=80&w=1473&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Dominica ist ein Land in Americas (Caribbean). Hauptstadt: Roseau.",
        "highlights": [
          "Roseau",
          "Nationalparks",
          "Küsten",
          "Roadtrips"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 90,
        "currency": "XCD",
        "visa_info": "Einreisebestimmungen je nach Land vorab prüfen.",
        "vaccination_info": "Hepatitis A empfohlen; Gelbfieber in Tropen möglich.",
        "health_safety_info": "Sicherheitslage je nach Region prüfen; Mückenschutz in Tropen.",
        "source": "generated"
      },
      {
        "name": "East Timor",
        "country": "East Timor",
        "country_code": "TL",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1707445305630-5962c1e9e1e9?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "East Timor ist ein Land in Asia (South-Eastern Asia). Hauptstadt: Dili.",
        "highlights": [
          "Dili",
          "Tempel",
          "Street Food",
          "Berglandschaften"
        ],
        "best_season": "Ganzjährig",
        "average_daily_cost": 90,
        "currency": "USD",
        "visa_info": "Visumregeln je nach Land prüfen.",
        "vaccination_info": "Hepatitis A empfohlen; je nach Region Typhus/Jap. Enzephalitis.",
        "health_safety_info": "Mückenschutz in Tropen; Verkehr kann chaotisch sein.",
        "source": "generated"
      },
      {
        "name": "El Salvador",
        "country": "El Salvador",
        "country_code": "SV",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1690384451505-2aef8ae1b0ef?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "El Salvador ist ein Land in Americas (Central America). Hauptstadt: San Salvador.",
        "highlights": [
          "San Salvador",
          "Nationalparks",
          "Küsten",
          "Roadtrips"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 90,
        "currency": "USD",
        "visa_info": "Einreisebestimmungen je nach Land vorab prüfen.",
        "vaccination_info": "Hepatitis A empfohlen; Gelbfieber in Tropen möglich.",
        "health_safety_info": "Sicherheitslage je nach Region prüfen; Mückenschutz in Tropen.",
        "source": "generated"
      },
      {
        "name": "Equatorial Guinea",
        "country": "Equatorial Guinea",
        "country_code": "GQ",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1728478988778-3c43c668624b?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Equatorial Guinea ist ein Land in Africa (Middle Africa). Hauptstadt: Malabo.",
        "highlights": [
          "Malabo",
          "Nationalparks",
          "Küstenorte",
          "Märkte"
        ],
        "best_season": "Ganzjährig",
        "average_daily_cost": 90,
        "currency": "XAF",
        "visa_info": "Visum häufig erforderlich; Bestimmungen vorab prüfen.",
        "vaccination_info": "Hepatitis A empfohlen; Gelbfieber je nach Region.",
        "health_safety_info": "Sicherheitslage prüfen; Mückenschutz beachten.",
        "source": "generated"
      },
      {
        "name": "Eritrea",
        "country": "Eritrea",
        "country_code": "ER",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1723377434868-eaa60458b8a6?q=80&w=1464&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Eritrea ist ein Land in Africa (Eastern Africa). Hauptstadt: Asmara.",
        "highlights": [
          "Asmara",
          "Nationalparks",
          "Küstenorte",
          "Märkte"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 90,
        "currency": "ERN",
        "visa_info": "Visum häufig erforderlich; Bestimmungen vorab prüfen.",
        "vaccination_info": "Hepatitis A empfohlen; Gelbfieber je nach Region.",
        "health_safety_info": "Sicherheitslage prüfen; Mückenschutz beachten.",
        "source": "generated"
      },
      {
        "name": "Estonia",
        "country": "Estonia",
        "country_code": "EE",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1709862366377-54b16f3e51f9?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Estonia ist ein Land in Europe (Northern Europe). Hauptstadt: Tallinn.",
        "highlights": [
          "Tallinn",
          "Altstädte",
          "Museen",
          "Kulturstätten"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 90,
        "currency": "EUR",
        "visa_info": "Einreisebestimmungen je nach Staatsangehörigkeit prüfen.",
        "vaccination_info": "Standardimpfungen; Zeckenschutz in Waldgebieten.",
        "health_safety_info": "Taschendiebstahl beachten; hohe medizinische Standards.",
        "source": "generated"
      },
      {
        "name": "Eswatini (Swaziland)",
        "country": "Eswatini (Swaziland)",
        "country_code": "SZ",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1559160581-c3b6f035520b?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Eswatini (Swaziland) ist ein Land in Africa (Southern Africa). Hauptstadt: Mbabane.",
        "highlights": [
          "Mbabane",
          "Nationalparks",
          "Küstenorte",
          "Märkte"
        ],
        "best_season": "November bis März",
        "average_daily_cost": 90,
        "currency": "SZL",
        "visa_info": "Visum häufig erforderlich; Bestimmungen vorab prüfen.",
        "vaccination_info": "Hepatitis A empfohlen; Gelbfieber je nach Region.",
        "health_safety_info": "Sicherheitslage prüfen; Mückenschutz beachten.",
        "source": "generated"
      },
      {
        "name": "Ethiopia",
        "country": "Ethiopia",
        "country_code": "ET",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1634029878815-1bb307302471?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Ethiopia ist ein Land in Africa (Eastern Africa). Hauptstadt: Addis Ababa.",
        "highlights": [
          "Addis Ababa",
          "Nationalparks",
          "Küstenorte",
          "Märkte"
        ],
        "best_season": "Ganzjährig",
        "average_daily_cost": 90,
        "currency": "ETB",
        "visa_info": "Visum häufig erforderlich; Bestimmungen vorab prüfen.",
        "vaccination_info": "Hepatitis A empfohlen; Gelbfieber je nach Region.",
        "health_safety_info": "Sicherheitslage prüfen; Mückenschutz beachten.",
        "source": "generated"
      },
      {
        "name": "Falkland Islands",
        "country": "United Kingdom",
        "country_code": "GB",
        "type": "Island",
        "types": [
          "Island"
        ],
        "image_url": "https://images.unsplash.com/photo-1580953889927-245d1fcd2519?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Reiseziel mit vielfältigen Landschaften, Kultur und regionalen Highlights.",
        "highlights": [
          "Hauptstadt",
          "Natur",
          "Kultur",
          "Kulinarik"
        ],
        "best_season": "Ganzjährig",
        "average_daily_cost": 90,
        "currency": null,
        "visa_info": "Einreisebestimmungen je nach Staatsangehörigkeit vor Reiseantritt prüfen.",
        "vaccination_info": "Standardimpfungen prüfen; länderspezifische Empfehlungen beachten.",
        "health_safety_info": "Aktuelle Reise- und Sicherheitshinweise beachten.",
        "source": "generated"
      },
      {
        "name": "Faroe Islands",
        "country": "Denmark",
        "country_code": "DK",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1539634936668-036d13a9cc3b?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Faroe Islands ist ein Land in Europe (Northern Europe). Hauptstadt: Copenhagen.",
        "highlights": [
          "Copenhagen",
          "Altstädte",
          "Museen",
          "Kulturstätten"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 90,
        "currency": "DKK",
        "visa_info": "Einreisebestimmungen je nach Staatsangehörigkeit prüfen.",
        "vaccination_info": "Standardimpfungen; Zeckenschutz in Waldgebieten.",
        "health_safety_info": "Taschendiebstahl beachten; hohe medizinische Standards.",
        "source": "generated"
      },
      {
        "name": "Fiji",
        "country": "Fiji",
        "country_code": "FJ",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1579264670959-286d7b06f1ae?q=80&w=757&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Fiji ist ein Land in Oceania (Melanesia). Hauptstadt: Suva.",
        "highlights": [
          "Suva",
          "Strände",
          "Lagunen",
          "Nationalparks"
        ],
        "best_season": "November bis März",
        "average_daily_cost": 90,
        "currency": "FJD",
        "visa_info": "Einreisebestimmungen je nach Land prüfen.",
        "vaccination_info": "Standardimpfungen; Mückenschutz in Tropeninseln.",
        "health_safety_info": "UV-Schutz beachten; Meeresströmungen berücksichtigen.",
        "source": "generated"
      },
      {
        "name": "France",
        "country": "France",
        "country_code": "FR",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1503917988258-f87a78e3c995?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "France ist ein Land in Europe (Western Europe). Hauptstadt: Paris.",
        "highlights": [
          "Paris",
          "Altstädte",
          "Museen",
          "Kulturstätten"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 90,
        "currency": "EUR",
        "visa_info": "Einreisebestimmungen je nach Staatsangehörigkeit prüfen.",
        "vaccination_info": "Standardimpfungen; Zeckenschutz in Waldgebieten.",
        "health_safety_info": "Taschendiebstahl beachten; hohe medizinische Standards.",
        "source": "generated"
      },
      {
        "name": "French Guiana",
        "country": "French Guiana",
        "country_code": "GF",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1704759928716-7657e3ad7615?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "French Guiana ist ein Land in Americas (South America). Hauptstadt: Cayenne.",
        "highlights": [
          "Cayenne",
          "Nationalparks",
          "Küsten",
          "Roadtrips"
        ],
        "best_season": "Ganzjährig",
        "average_daily_cost": 90,
        "currency": "EUR",
        "visa_info": "Einreisebestimmungen je nach Land vorab prüfen.",
        "vaccination_info": "Hepatitis A empfohlen; Gelbfieber in Tropen möglich.",
        "health_safety_info": "Sicherheitslage je nach Region prüfen; Mückenschutz in Tropen.",
        "source": "generated"
      },
      {
        "name": "French Polynesia",
        "country": "France",
        "country_code": "FR",
        "type": "Island",
        "types": [
          "Island"
        ],
        "image_url": "https://images.unsplash.com/photo-1652842183703-47c2f7bb8c3c?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Reiseziel mit vielfältigen Landschaften, Kultur und regionalen Highlights.",
        "highlights": [
          "Hauptstadt",
          "Natur",
          "Kultur",
          "Kulinarik"
        ],
        "best_season": "Ganzjährig",
        "average_daily_cost": 90,
        "currency": null,
        "visa_info": "Einreisebestimmungen je nach Staatsangehörigkeit vor Reiseantritt prüfen.",
        "vaccination_info": "Standardimpfungen prüfen; länderspezifische Empfehlungen beachten.",
        "health_safety_info": "Aktuelle Reise- und Sicherheitshinweise beachten.",
        "source": "generated"
      },
      {
        "name": "Gabon",
        "country": "Gabon",
        "country_code": "GA",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1708081744604-995bcb2edc76?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Gabon ist ein Land in Africa (Middle Africa). Hauptstadt: Libreville.",
        "highlights": [
          "Libreville",
          "Nationalparks",
          "Küstenorte",
          "Märkte"
        ],
        "best_season": "Ganzjährig",
        "average_daily_cost": 90,
        "currency": "XAF",
        "visa_info": "Visum häufig erforderlich; Bestimmungen vorab prüfen.",
        "vaccination_info": "Hepatitis A empfohlen; Gelbfieber je nach Region.",
        "health_safety_info": "Sicherheitslage prüfen; Mückenschutz beachten.",
        "source": "generated"
      },
      {
        "name": "Gambia",
        "country": "Gambia",
        "country_code": "GM",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1550517783-799cb706c757?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Gambia ist ein Land in Africa (Western Africa). Hauptstadt: Banjul.",
        "highlights": [
          "Banjul",
          "Nationalparks",
          "Küstenorte",
          "Märkte"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 90,
        "currency": "GMD",
        "visa_info": "Visum häufig erforderlich; Bestimmungen vorab prüfen.",
        "vaccination_info": "Hepatitis A empfohlen; Gelbfieber je nach Region.",
        "health_safety_info": "Sicherheitslage prüfen; Mückenschutz beachten.",
        "source": "generated"
      },
      {
        "name": "Georgia",
        "country": "Georgia",
        "country_code": "GE",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1563284223-333497472e88?q=80&w=1476&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Georgia ist ein Land in Asia (Western Asia). Hauptstadt: Tbilisi.",
        "highlights": [
          "Tbilisi",
          "Tempel",
          "Street Food",
          "Berglandschaften"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 90,
        "currency": "GEL",
        "visa_info": "Visumregeln je nach Land prüfen.",
        "vaccination_info": "Hepatitis A empfohlen; je nach Region Typhus/Jap. Enzephalitis.",
        "health_safety_info": "Mückenschutz in Tropen; Verkehr kann chaotisch sein.",
        "source": "generated"
      },
      {
        "name": "Germany",
        "country": "Germany",
        "country_code": "DE",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Germany ist ein Land in Europe (Western Europe). Hauptstadt: Berlin.",
        "highlights": [
          "Berlin",
          "Altstädte",
          "Museen",
          "Kulturstätten"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 90,
        "currency": "EUR",
        "visa_info": "Einreisebestimmungen je nach Staatsangehörigkeit prüfen.",
        "vaccination_info": "Standardimpfungen; Zeckenschutz in Waldgebieten.",
        "health_safety_info": "Taschendiebstahl beachten; hohe medizinische Standards.",
        "source": "generated"
      },
      {
        "name": "Ghana",
        "country": "Ghana",
        "country_code": "GH",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1610571005499-7963c7544d54?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Ghana ist ein Land in Africa (Western Africa). Hauptstadt: Accra.",
        "highlights": [
          "Accra",
          "Nationalparks",
          "Küstenorte",
          "Märkte"
        ],
        "best_season": "Ganzjährig",
        "average_daily_cost": 90,
        "currency": "GHS",
        "visa_info": "Visum häufig erforderlich; Bestimmungen vorab prüfen.",
        "vaccination_info": "Hepatitis A empfohlen; Gelbfieber je nach Region.",
        "health_safety_info": "Sicherheitslage prüfen; Mückenschutz beachten.",
        "source": "generated"
      },
      {
        "name": "Gibraltar",
        "country": "United Kingdom",
        "country_code": "GB",
        "type": "Island",
        "types": [
          "Island"
        ],
        "image_url": "https://images.unsplash.com/photo-1545289825-8b0664a68f63?q=80&w=1469&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Reiseziel mit vielfältigen Landschaften, Kultur und regionalen Highlights.",
        "highlights": [
          "Hauptstadt",
          "Natur",
          "Kultur",
          "Kulinarik"
        ],
        "best_season": "Ganzjährig",
        "average_daily_cost": 90,
        "currency": null,
        "visa_info": "Einreisebestimmungen je nach Staatsangehörigkeit vor Reiseantritt prüfen.",
        "vaccination_info": "Standardimpfungen prüfen; länderspezifische Empfehlungen beachten.",
        "health_safety_info": "Aktuelle Reise- und Sicherheitshinweise beachten.",
        "source": "generated"
      },
      {
        "name": "Greece",
        "country": "Greece",
        "country_code": "GR",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1603565816030-6b389eeb23cb?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Greece ist ein Land in Europe (Southern Europe). Hauptstadt: Athens.",
        "highlights": [
          "Athens",
          "Altstädte",
          "Museen",
          "Kulturstätten"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 90,
        "currency": "EUR",
        "visa_info": "Einreisebestimmungen je nach Staatsangehörigkeit prüfen.",
        "vaccination_info": "Standardimpfungen; Zeckenschutz in Waldgebieten.",
        "health_safety_info": "Taschendiebstahl beachten; hohe medizinische Standards.",
        "source": "generated"
      },
      {
        "name": "Greenland",
        "country": "Denmark",
        "country_code": "DM",
        "type": "Island",
        "types": [
          "Island"
        ],
        "image_url": "https://images.unsplash.com/photo-1573995975633-faee0123f31f?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Reiseziel mit vielfältigen Landschaften, Kultur und regionalen Highlights.",
        "highlights": [
          "Hauptstadt",
          "Natur",
          "Kultur",
          "Kulinarik"
        ],
        "best_season": "Ganzjährig",
        "average_daily_cost": 90,
        "currency": null,
        "visa_info": "Einreisebestimmungen je nach Staatsangehörigkeit vor Reiseantritt prüfen.",
        "vaccination_info": "Standardimpfungen prüfen; länderspezifische Empfehlungen beachten.",
        "health_safety_info": "Aktuelle Reise- und Sicherheitshinweise beachten.",
        "source": "generated"
      },
      {
        "name": "Grenada",
        "country": "Grenada",
        "country_code": "GD",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1616555846456-6d53b92669a8?q=80&w=1633&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Grenada ist ein Land in Americas (Caribbean). Hauptstadt: St. George's.",
        "highlights": [
          "St. George's",
          "Nationalparks",
          "Küsten",
          "Roadtrips"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 90,
        "currency": "XCD",
        "visa_info": "Einreisebestimmungen je nach Land vorab prüfen.",
        "vaccination_info": "Hepatitis A empfohlen; Gelbfieber in Tropen möglich.",
        "health_safety_info": "Sicherheitslage je nach Region prüfen; Mückenschutz in Tropen.",
        "source": "generated"
      },
      {
        "name": "Guadeloupe",
        "country": "Guadeloupe",
        "country_code": "GP",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1614706580214-1f5412a118a2?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Guadeloupe ist ein Land in Americas (Caribbean). Hauptstadt: Basse-Terre.",
        "highlights": [
          "Basse-Terre",
          "Nationalparks",
          "Küsten",
          "Roadtrips"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 90,
        "currency": "EUR",
        "visa_info": "Einreisebestimmungen je nach Land vorab prüfen.",
        "vaccination_info": "Hepatitis A empfohlen; Gelbfieber in Tropen möglich.",
        "health_safety_info": "Sicherheitslage je nach Region prüfen; Mückenschutz in Tropen.",
        "source": "generated"
      },
      {
        "name": "Guam",
        "country": "Guam",
        "country_code": "GU",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1599172806227-55b02cefcc31?q=80&w=1473&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Guam ist ein Land in Oceania (Micronesia). Hauptstadt: Hagåtña.",
        "highlights": [
          "Hagåtña",
          "Strände",
          "Lagunen",
          "Nationalparks"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 90,
        "currency": "USD",
        "visa_info": "Einreisebestimmungen je nach Land prüfen.",
        "vaccination_info": "Standardimpfungen; Mückenschutz in Tropeninseln.",
        "health_safety_info": "UV-Schutz beachten; Meeresströmungen berücksichtigen.",
        "source": "generated"
      },
      {
        "name": "Guernsey",
        "country": "United Kingdom",
        "country_code": "GB",
        "type": "island",
        "types": [
          "island"
        ],
        "image_url": "https://images.unsplash.com/photo-1617387382064-ff300a829f7a?q=80&w=1449&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Reiseziel mit vielfältigen Landschaften, Kultur und regionalen Highlights.",
        "highlights": [
          "Hauptstadt",
          "Natur",
          "Kultur",
          "Kulinarik"
        ],
        "best_season": "Ganzjährig",
        "average_daily_cost": 90,
        "currency": null,
        "visa_info": "Einreisebestimmungen je nach Staatsangehörigkeit vor Reiseantritt prüfen.",
        "vaccination_info": "Standardimpfungen prüfen; länderspezifische Empfehlungen beachten.",
        "health_safety_info": "Aktuelle Reise- und Sicherheitshinweise beachten.",
        "source": "generated"
      },
      {
        "name": "Guinea",
        "country": "Guinea",
        "country_code": "GN",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1676405956449-64d51e0cc7bf?q=80&w=1373&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Guinea ist ein Land in Africa (Western Africa). Hauptstadt: Conakry.",
        "highlights": [
          "Conakry",
          "Nationalparks",
          "Küstenorte",
          "Märkte"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 90,
        "currency": "GNF",
        "visa_info": "Visum häufig erforderlich; Bestimmungen vorab prüfen.",
        "vaccination_info": "Hepatitis A empfohlen; Gelbfieber je nach Region.",
        "health_safety_info": "Sicherheitslage prüfen; Mückenschutz beachten.",
        "source": "generated"
      },
      {
        "name": "Guinea-Bissau",
        "country": "Guinea-Bissau",
        "country_code": "GW",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://plus.unsplash.com/premium_photo-1667223580051-d912e1e14050?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Guinea-Bissau ist ein Land in Africa (Western Africa). Hauptstadt: Bissau.",
        "highlights": [
          "Bissau",
          "Nationalparks",
          "Küstenorte",
          "Märkte"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 90,
        "currency": "XOF",
        "visa_info": "Visum häufig erforderlich; Bestimmungen vorab prüfen.",
        "vaccination_info": "Hepatitis A empfohlen; Gelbfieber je nach Region.",
        "health_safety_info": "Sicherheitslage prüfen; Mückenschutz beachten.",
        "source": "generated"
      },
      {
        "name": "Guyana",
        "country": "Guyana",
        "country_code": "GY",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1589997169253-cd680c6fba7a?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Guyana ist ein Land in Americas (South America). Hauptstadt: Georgetown.",
        "highlights": [
          "Georgetown",
          "Nationalparks",
          "Küsten",
          "Roadtrips"
        ],
        "best_season": "Ganzjährig",
        "average_daily_cost": 90,
        "currency": "GYD",
        "visa_info": "Einreisebestimmungen je nach Land vorab prüfen.",
        "vaccination_info": "Hepatitis A empfohlen; Gelbfieber in Tropen möglich.",
        "health_safety_info": "Sicherheitslage je nach Region prüfen; Mückenschutz in Tropen.",
        "source": "generated"
      },
      {
        "name": "Haiti",
        "country": "Haiti",
        "country_code": "HT",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1602027333786-373a1b858831?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Haiti ist ein Land in Americas (Caribbean). Hauptstadt: Port-au-Prince.",
        "highlights": [
          "Port-au-Prince",
          "Nationalparks",
          "Küsten",
          "Roadtrips"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 90,
        "currency": "HTG",
        "visa_info": "Einreisebestimmungen je nach Land vorab prüfen.",
        "vaccination_info": "Hepatitis A empfohlen; Gelbfieber in Tropen möglich.",
        "health_safety_info": "Sicherheitslage je nach Region prüfen; Mückenschutz in Tropen.",
        "source": "generated"
      },
      {
        "name": "Heard Island & McDonald Islands",
        "country": "Australia",
        "country_code": "AU",
        "type": "Island",
        "types": [
          "Island"
        ],
        "image_url": "https://plus.unsplash.com/premium_photo-1709461852817-2f3d254a35de?q=80&w=1571&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Reiseziel mit vielfältigen Landschaften, Kultur und regionalen Highlights.",
        "highlights": [
          "Hauptstadt",
          "Natur",
          "Kultur",
          "Kulinarik"
        ],
        "best_season": "Ganzjährig",
        "average_daily_cost": 90,
        "currency": null,
        "visa_info": "Einreisebestimmungen je nach Staatsangehörigkeit vor Reiseantritt prüfen.",
        "vaccination_info": "Standardimpfungen prüfen; länderspezifische Empfehlungen beachten.",
        "health_safety_info": "Aktuelle Reise- und Sicherheitshinweise beachten.",
        "source": "generated"
      },
      {
        "name": "Hong Kong",
        "country": "Hong Kong",
        "country_code": "HK",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1616394158624-a2ba9cfe2994?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Hong Kong ist ein Land in Asia (Eastern Asia). Hauptstadt: City of Victoria.",
        "highlights": [
          "City of Victoria",
          "Tempel",
          "Street Food",
          "Berglandschaften"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 90,
        "currency": "HKD",
        "visa_info": "Visumregeln je nach Land prüfen.",
        "vaccination_info": "Hepatitis A empfohlen; je nach Region Typhus/Jap. Enzephalitis.",
        "health_safety_info": "Mückenschutz in Tropen; Verkehr kann chaotisch sein.",
        "source": "generated"
      },
      {
        "name": "Hungary",
        "country": "Hungary",
        "country_code": "HU",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1541343672885-9be56236302a?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Hungary ist ein Land in Europe (Central Europe). Hauptstadt: Budapest.",
        "highlights": [
          "Budapest",
          "Altstädte",
          "Museen",
          "Kulturstätten"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 90,
        "currency": "HUF",
        "visa_info": "Einreisebestimmungen je nach Staatsangehörigkeit prüfen.",
        "vaccination_info": "Standardimpfungen; Zeckenschutz in Waldgebieten.",
        "health_safety_info": "Taschendiebstahl beachten; hohe medizinische Standards.",
        "source": "generated"
      },
      {
        "name": "Iran",
        "country": "Iran",
        "country_code": "IR",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1579932979622-fc012038564d?q=80&w=686&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Iran ist ein Land in Asia (Southern Asia). Hauptstadt: Tehran.",
        "highlights": [
          "Tehran",
          "Tempel",
          "Street Food",
          "Berglandschaften"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 90,
        "currency": "IRR",
        "visa_info": "Visumregeln je nach Land prüfen.",
        "vaccination_info": "Hepatitis A empfohlen; je nach Region Typhus/Jap. Enzephalitis.",
        "health_safety_info": "Mückenschutz in Tropen; Verkehr kann chaotisch sein.",
        "source": "generated"
      },
      {
        "name": "Iraq",
        "country": "Iraq",
        "country_code": "IQ",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1709659537459-c4e8ee1fe9c9?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Iraq ist ein Land in Asia (Western Asia). Hauptstadt: Baghdad.",
        "highlights": [
          "Baghdad",
          "Tempel",
          "Street Food",
          "Berglandschaften"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 90,
        "currency": "IQD",
        "visa_info": "Visumregeln je nach Land prüfen.",
        "vaccination_info": "Hepatitis A empfohlen; je nach Region Typhus/Jap. Enzephalitis.",
        "health_safety_info": "Mückenschutz in Tropen; Verkehr kann chaotisch sein.",
        "source": "generated"
      },
      {
        "name": "Isle of Man",
        "country": "United Kingdom",
        "country_code": "IM",
        "type": "Island",
        "types": [
          "Island"
        ],
        "image_url": "https://images.unsplash.com/photo-1559209540-0fdb2a8c126a?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Reiseziel mit vielfältigen Landschaften, Kultur und regionalen Highlights.",
        "highlights": [
          "Hauptstadt",
          "Natur",
          "Kultur",
          "Kulinarik"
        ],
        "best_season": "Ganzjährig",
        "average_daily_cost": 90,
        "currency": null,
        "visa_info": "Einreisebestimmungen je nach Staatsangehörigkeit vor Reiseantritt prüfen.",
        "vaccination_info": "Standardimpfungen prüfen; länderspezifische Empfehlungen beachten.",
        "health_safety_info": "Aktuelle Reise- und Sicherheitshinweise beachten.",
        "source": "generated"
      },
      {
        "name": "Israel",
        "country": "Israel",
        "country_code": "IL",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1614517453351-6c1522fc7a56?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Israel ist ein Land in Asia (Western Asia). Hauptstadt: Jerusalem.",
        "highlights": [
          "Jerusalem",
          "Tempel",
          "Street Food",
          "Berglandschaften"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 90,
        "currency": "ILS",
        "visa_info": "Visumregeln je nach Land prüfen.",
        "vaccination_info": "Hepatitis A empfohlen; je nach Region Typhus/Jap. Enzephalitis.",
        "health_safety_info": "Mückenschutz in Tropen; Verkehr kann chaotisch sein.",
        "source": "generated"
      },
      {
        "name": "Italy",
        "country": "Italy",
        "country_code": "IT",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1583855282680-6dbdc69b0932?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Italy ist ein Land in Europe (Southern Europe). Hauptstadt: Rome.",
        "highlights": [
          "Rome",
          "Altstädte",
          "Museen",
          "Kulturstätten"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 90,
        "currency": "EUR",
        "visa_info": "Einreisebestimmungen je nach Staatsangehörigkeit prüfen.",
        "vaccination_info": "Standardimpfungen; Zeckenschutz in Waldgebieten.",
        "health_safety_info": "Taschendiebstahl beachten; hohe medizinische Standards.",
        "source": "generated"
      },
      {
        "name": "Japan",
        "country": "Japan",
        "country_code": "JP",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Japan ist ein Land in Asia (Eastern Asia). Hauptstadt: Tokyo.",
        "highlights": [
          "Tokyo",
          "Tempel",
          "Street Food",
          "Berglandschaften"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 90,
        "currency": "JPY",
        "visa_info": "Visumregeln je nach Land prüfen.",
        "vaccination_info": "Hepatitis A empfohlen; je nach Region Typhus/Jap. Enzephalitis.",
        "health_safety_info": "Mückenschutz in Tropen; Verkehr kann chaotisch sein.",
        "source": "generated"
      },
      {
        "name": "Jersey",
        "country": "United Kingdom",
        "country_code": "GB",
        "type": "Island",
        "types": [
          "Island"
        ],
        "image_url": "https://images.unsplash.com/photo-1574517232727-80513c4fe68d?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Reiseziel mit vielfältigen Landschaften, Kultur und regionalen Highlights.",
        "highlights": [
          "Hauptstadt",
          "Natur",
          "Kultur",
          "Kulinarik"
        ],
        "best_season": "Ganzjährig",
        "average_daily_cost": 90,
        "currency": null,
        "visa_info": "Einreisebestimmungen je nach Staatsangehörigkeit vor Reiseantritt prüfen.",
        "vaccination_info": "Standardimpfungen prüfen; länderspezifische Empfehlungen beachten.",
        "health_safety_info": "Aktuelle Reise- und Sicherheitshinweise beachten.",
        "source": "generated"
      },
      {
        "name": "Kazakhstan",
        "country": "Kazakhstan",
        "country_code": "KZ",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1582053403239-c58c07d86ce1?q=80&w=1631&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3De",
        "description": "Kazakhstan ist ein Land in Asia (Central Asia). Hauptstadt: Astana.",
        "highlights": [
          "Astana",
          "Tempel",
          "Street Food",
          "Berglandschaften"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 90,
        "currency": "KZT",
        "visa_info": "Visumregeln je nach Land prüfen.",
        "vaccination_info": "Hepatitis A empfohlen; je nach Region Typhus/Jap. Enzephalitis.",
        "health_safety_info": "Mückenschutz in Tropen; Verkehr kann chaotisch sein.",
        "source": "generated"
      },
      {
        "name": "Kiribati",
        "country": "Kiribati",
        "country_code": "KI",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1443181994330-3e365ff8949e?q=80&w=881&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Kiribati ist ein Land in Oceania (Micronesia). Hauptstadt: South Tarawa.",
        "highlights": [
          "South Tarawa",
          "Strände",
          "Lagunen",
          "Nationalparks"
        ],
        "best_season": "Ganzjährig",
        "average_daily_cost": 90,
        "currency": "AUD",
        "visa_info": "Einreisebestimmungen je nach Land prüfen.",
        "vaccination_info": "Standardimpfungen; Mückenschutz in Tropeninseln.",
        "health_safety_info": "UV-Schutz beachten; Meeresströmungen berücksichtigen.",
        "source": "generated"
      },
      {
        "name": "North Korea",
        "country": "North Korea",
        "country_code": "KP",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1604359896927-0610b7a3a2be?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "North Korea ist ein Land in Asia (Eastern Asia). Hauptstadt: Pyongyang.",
        "highlights": [
          "Pyongyang",
          "Tempel",
          "Street Food",
          "Berglandschaften"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 90,
        "currency": "KPW",
        "visa_info": "Visumregeln je nach Land prüfen.",
        "vaccination_info": "Hepatitis A empfohlen; je nach Region Typhus/Jap. Enzephalitis.",
        "health_safety_info": "Mückenschutz in Tropen; Verkehr kann chaotisch sein.",
        "source": "generated"
      },
      {
        "name": "South Korea",
        "country": "South Korea",
        "country_code": "KR",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1603852452515-2dc92bd9c6f1?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "South Korea ist ein Land in Asia (Eastern Asia). Hauptstadt: Seoul.",
        "highlights": [
          "Seoul",
          "Tempel",
          "Street Food",
          "Berglandschaften"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 90,
        "currency": "KRW",
        "visa_info": "Visumregeln je nach Land prüfen.",
        "vaccination_info": "Hepatitis A empfohlen; je nach Region Typhus/Jap. Enzephalitis.",
        "health_safety_info": "Mückenschutz in Tropen; Verkehr kann chaotisch sein.",
        "source": "generated"
      },
      {
        "name": "Kuwait",
        "country": "Kuwait",
        "country_code": "KW",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1643763283594-0c3eccec8276?q=80&w=736&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Kuwait ist ein Land in Asia (Western Asia). Hauptstadt: Kuwait City.",
        "highlights": [
          "Kuwait City",
          "Tempel",
          "Street Food",
          "Berglandschaften"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 90,
        "currency": "KWD",
        "visa_info": "Visumregeln je nach Land prüfen.",
        "vaccination_info": "Hepatitis A empfohlen; je nach Region Typhus/Jap. Enzephalitis.",
        "health_safety_info": "Mückenschutz in Tropen; Verkehr kann chaotisch sein.",
        "source": "generated"
      },
      {
        "name": "Kyrgyzstan",
        "country": "Kyrgyzstan",
        "country_code": "KG",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1610720684893-619cd7a5cde5?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Kyrgyzstan ist ein Land in Asia (Central Asia). Hauptstadt: Bishkek.",
        "highlights": [
          "Bishkek",
          "Tempel",
          "Street Food",
          "Berglandschaften"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 90,
        "currency": "KGS",
        "visa_info": "Visumregeln je nach Land prüfen.",
        "vaccination_info": "Hepatitis A empfohlen; je nach Region Typhus/Jap. Enzephalitis.",
        "health_safety_info": "Mückenschutz in Tropen; Verkehr kann chaotisch sein.",
        "source": "generated"
      },
      {
        "name": "Laos",
        "country": "Laos",
        "country_code": "LA",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1570366583862-f91883984fde?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Laos ist ein Land in Asia (South-Eastern Asia). Hauptstadt: Vientiane.",
        "highlights": [
          "Vientiane",
          "Tempel",
          "Street Food",
          "Berglandschaften"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 90,
        "currency": "LAK",
        "visa_info": "Visumregeln je nach Land prüfen.",
        "vaccination_info": "Hepatitis A empfohlen; je nach Region Typhus/Jap. Enzephalitis.",
        "health_safety_info": "Mückenschutz in Tropen; Verkehr kann chaotisch sein.",
        "source": "generated"
      },
      {
        "name": "Latvia",
        "country": "Latvia",
        "country_code": "LV",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1609517760017-9b76ac28f0e9?q=80&w=1644&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Latvia ist ein Land in Europe (Northern Europe). Hauptstadt: Riga.",
        "highlights": [
          "Riga",
          "Altstädte",
          "Museen",
          "Kulturstätten"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 90,
        "currency": "EUR",
        "visa_info": "Einreisebestimmungen je nach Staatsangehörigkeit prüfen.",
        "vaccination_info": "Standardimpfungen; Zeckenschutz in Waldgebieten.",
        "health_safety_info": "Taschendiebstahl beachten; hohe medizinische Standards.",
        "source": "generated"
      },
      {
        "name": "Lebanon",
        "country": "Lebanon",
        "country_code": "LB",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://plus.unsplash.com/premium_photo-1697729942579-93186371254e?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Lebanon ist ein Land in Asia (Western Asia). Hauptstadt: Beirut.",
        "highlights": [
          "Beirut",
          "Tempel",
          "Street Food",
          "Berglandschaften"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 90,
        "currency": "LBP",
        "visa_info": "Visumregeln je nach Land prüfen.",
        "vaccination_info": "Hepatitis A empfohlen; je nach Region Typhus/Jap. Enzephalitis.",
        "health_safety_info": "Mückenschutz in Tropen; Verkehr kann chaotisch sein.",
        "source": "generated"
      },
      {
        "name": "Lesotho",
        "country": "Lesotho",
        "country_code": "LS",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1583744628322-e645a41527b9?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Lesotho ist ein Land in Africa (Southern Africa). Hauptstadt: Maseru.",
        "highlights": [
          "Maseru",
          "Nationalparks",
          "Küstenorte",
          "Märkte"
        ],
        "best_season": "November bis März",
        "average_daily_cost": 90,
        "currency": "LSL",
        "visa_info": "Visum häufig erforderlich; Bestimmungen vorab prüfen.",
        "vaccination_info": "Hepatitis A empfohlen; Gelbfieber je nach Region.",
        "health_safety_info": "Sicherheitslage prüfen; Mückenschutz beachten.",
        "source": "generated"
      },
      {
        "name": "Liberia",
        "country": "Liberia",
        "country_code": "LR",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://plus.unsplash.com/premium_photo-1697730411634-5313371ad8fe?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Liberia ist ein Land in Africa (Western Africa). Hauptstadt: Monrovia.",
        "highlights": [
          "Monrovia",
          "Nationalparks",
          "Küstenorte",
          "Märkte"
        ],
        "best_season": "Ganzjährig",
        "average_daily_cost": 90,
        "currency": "LRD",
        "visa_info": "Visum häufig erforderlich; Bestimmungen vorab prüfen.",
        "vaccination_info": "Hepatitis A empfohlen; Gelbfieber je nach Region.",
        "health_safety_info": "Sicherheitslage prüfen; Mückenschutz beachten.",
        "source": "generated"
      },
      {
        "name": "Libya",
        "country": "Libya",
        "country_code": "LY",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1639862819821-5350da089c43?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Libya ist ein Land in Africa (Northern Africa). Hauptstadt: Tripoli.",
        "highlights": [
          "Tripoli",
          "Nationalparks",
          "Küstenorte",
          "Märkte"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 90,
        "currency": "LYD",
        "visa_info": "Visum häufig erforderlich; Bestimmungen vorab prüfen.",
        "vaccination_info": "Hepatitis A empfohlen; Gelbfieber je nach Region.",
        "health_safety_info": "Sicherheitslage prüfen; Mückenschutz beachten.",
        "source": "generated"
      },
      {
        "name": "Liechtenstein",
        "country": "Liechtenstein",
        "country_code": "LI",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1600105838943-1f52bf4dcaa9?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Liechtenstein ist ein Land in Europe (Western Europe). Hauptstadt: Vaduz.",
        "highlights": [
          "Vaduz",
          "Altstädte",
          "Museen",
          "Kulturstätten"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 90,
        "currency": "CHF",
        "visa_info": "Einreisebestimmungen je nach Staatsangehörigkeit prüfen.",
        "vaccination_info": "Standardimpfungen; Zeckenschutz in Waldgebieten.",
        "health_safety_info": "Taschendiebstahl beachten; hohe medizinische Standards.",
        "source": "generated"
      },
      {
        "name": "Lithuania",
        "country": "Lithuania",
        "country_code": "LT",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1560940981-c867cc7b8b75?q=80&w=765&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Lithuania ist ein Land in Europe (Northern Europe). Hauptstadt: Vilnius.",
        "highlights": [
          "Vilnius",
          "Altstädte",
          "Museen",
          "Kulturstätten"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 90,
        "currency": "EUR",
        "visa_info": "Einreisebestimmungen je nach Staatsangehörigkeit prüfen.",
        "vaccination_info": "Standardimpfungen; Zeckenschutz in Waldgebieten.",
        "health_safety_info": "Taschendiebstahl beachten; hohe medizinische Standards.",
        "source": "generated"
      },
      {
        "name": "Luxembourg",
        "country": "Luxembourg",
        "country_code": "LU",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1588336899745-22da91d8f816?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Luxembourg ist ein Land in Europe (Western Europe). Hauptstadt: Luxembourg.",
        "highlights": [
          "Luxembourg",
          "Altstädte",
          "Museen",
          "Kulturstätten"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 90,
        "currency": "EUR",
        "visa_info": "Einreisebestimmungen je nach Staatsangehörigkeit prüfen.",
        "vaccination_info": "Standardimpfungen; Zeckenschutz in Waldgebieten.",
        "health_safety_info": "Taschendiebstahl beachten; hohe medizinische Standards.",
        "source": "generated"
      },
      {
        "name": "Macau",
        "country": "Macau",
        "country_code": "MO",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1708580175277-6c171e822f94?q=80&w=1366&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Macau ist ein Land in Asia (Eastern Asia).",
        "highlights": [
          "Tempel",
          "Street Food",
          "Berglandschaften",
          "Kulturstätten"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 90,
        "currency": "MOP",
        "visa_info": "Visumregeln je nach Land prüfen.",
        "vaccination_info": "Hepatitis A empfohlen; je nach Region Typhus/Jap. Enzephalitis.",
        "health_safety_info": "Mückenschutz in Tropen; Verkehr kann chaotisch sein.",
        "source": "generated"
      },
      {
        "name": "Madagascar",
        "country": "Madagascar",
        "country_code": "MG",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1570742544137-3a469196c32b?q=80&w=1469&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Madagascar ist ein Land in Africa (Eastern Africa). Hauptstadt: Antananarivo.",
        "highlights": [
          "Antananarivo",
          "Nationalparks",
          "Küstenorte",
          "Märkte"
        ],
        "best_season": "November bis März",
        "average_daily_cost": 90,
        "currency": "MGA",
        "visa_info": "Visum häufig erforderlich; Bestimmungen vorab prüfen.",
        "vaccination_info": "Hepatitis A empfohlen; Gelbfieber je nach Region.",
        "health_safety_info": "Sicherheitslage prüfen; Mückenschutz beachten.",
        "source": "generated"
      },
      {
        "name": "Malawi",
        "country": "Malawi",
        "country_code": "MW",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1715948889565-210cf2eb920d?q=80&w=1634&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Malawi ist ein Land in Africa (Eastern Africa). Hauptstadt: Lilongwe.",
        "highlights": [
          "Lilongwe",
          "Nationalparks",
          "Küstenorte",
          "Märkte"
        ],
        "best_season": "November bis März",
        "average_daily_cost": 90,
        "currency": "MWK",
        "visa_info": "Visum häufig erforderlich; Bestimmungen vorab prüfen.",
        "vaccination_info": "Hepatitis A empfohlen; Gelbfieber je nach Region.",
        "health_safety_info": "Sicherheitslage prüfen; Mückenschutz beachten.",
        "source": "generated"
      },
      {
        "name": "Maldives",
        "country": "Maldives",
        "country_code": "MV",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Maldives ist ein Land in Asia (Southern Asia). Hauptstadt: Malé.",
        "highlights": [
          "Malé",
          "Tempel",
          "Street Food",
          "Berglandschaften"
        ],
        "best_season": "Ganzjährig",
        "average_daily_cost": 90,
        "currency": "MVR",
        "visa_info": "Visumregeln je nach Land prüfen.",
        "vaccination_info": "Hepatitis A empfohlen; je nach Region Typhus/Jap. Enzephalitis.",
        "health_safety_info": "Mückenschutz in Tropen; Verkehr kann chaotisch sein.",
        "source": "generated"
      },
      {
        "name": "Mali",
        "country": "Mali",
        "country_code": "ML",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1602679968973-64d784e98675?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Mali ist ein Land in Africa (Western Africa). Hauptstadt: Bamako.",
        "highlights": [
          "Bamako",
          "Nationalparks",
          "Küstenorte",
          "Märkte"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 90,
        "currency": "XOF",
        "visa_info": "Visum häufig erforderlich; Bestimmungen vorab prüfen.",
        "vaccination_info": "Hepatitis A empfohlen; Gelbfieber je nach Region.",
        "health_safety_info": "Sicherheitslage prüfen; Mückenschutz beachten.",
        "source": "generated"
      },
      {
        "name": "Malta",
        "country": "Malta",
        "country_code": "MT",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1571856975545-119703c5225c?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Malta ist ein Land in Europe (Southern Europe). Hauptstadt: Valletta.",
        "highlights": [
          "Valletta",
          "Altstädte",
          "Museen",
          "Kulturstätten"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 90,
        "currency": "EUR",
        "visa_info": "Einreisebestimmungen je nach Staatsangehörigkeit prüfen.",
        "vaccination_info": "Standardimpfungen; Zeckenschutz in Waldgebieten.",
        "health_safety_info": "Taschendiebstahl beachten; hohe medizinische Standards.",
        "source": "generated"
      },
      {
        "name": "Marshall Islands",
        "country": "Marshall Islands",
        "country_code": "MH",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1587583286131-7ee81eef8fa7?q=80&w=727&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Marshall Islands ist ein Land in Oceania (Micronesia). Hauptstadt: Majuro.",
        "highlights": [
          "Majuro",
          "Strände",
          "Lagunen",
          "Nationalparks"
        ],
        "best_season": "Ganzjährig",
        "average_daily_cost": 90,
        "currency": "USD",
        "visa_info": "Einreisebestimmungen je nach Land prüfen.",
        "vaccination_info": "Standardimpfungen; Mückenschutz in Tropeninseln.",
        "health_safety_info": "UV-Schutz beachten; Meeresströmungen berücksichtigen.",
        "source": "generated"
      },
      {
        "name": "Martinique",
        "country": "Martinique",
        "country_code": "MQ",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1629190001937-59b3dd4e9d50?q=80&w=2160&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Martinique ist ein Land in Americas (Caribbean). Hauptstadt: Fort-de-France.",
        "highlights": [
          "Fort-de-France",
          "Nationalparks",
          "Küsten",
          "Roadtrips"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 90,
        "currency": "EUR",
        "visa_info": "Einreisebestimmungen je nach Land vorab prüfen.",
        "vaccination_info": "Hepatitis A empfohlen; Gelbfieber in Tropen möglich.",
        "health_safety_info": "Sicherheitslage je nach Region prüfen; Mückenschutz in Tropen.",
        "source": "generated"
      },
      {
        "name": "Mauritania",
        "country": "Mauritania",
        "country_code": "MR",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://source.unsplash.com/featured/?mauritania,landscape",
        "description": "Mauritania ist ein Land in Africa (Western Africa). Hauptstadt: Nouakchott.",
        "highlights": [
          "Nouakchott",
          "Nationalparks",
          "Küstenorte",
          "Märkte"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 90,
        "currency": "MRU",
        "visa_info": "Visum häufig erforderlich; Bestimmungen vorab prüfen.",
        "vaccination_info": "Hepatitis A empfohlen; Gelbfieber je nach Region.",
        "health_safety_info": "Sicherheitslage prüfen; Mückenschutz beachten.",
        "source": "generated"
      },
      {
        "name": "Mauritius",
        "country": "Mauritius",
        "country_code": "MU",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1513415431848-a433b3de449f?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Mauritius ist ein Land in Africa (Eastern Africa). Hauptstadt: Port Louis.",
        "highlights": [
          "Port Louis",
          "Nationalparks",
          "Küstenorte",
          "Märkte"
        ],
        "best_season": "November bis März",
        "average_daily_cost": 90,
        "currency": "MUR",
        "visa_info": "Visum häufig erforderlich; Bestimmungen vorab prüfen.",
        "vaccination_info": "Hepatitis A empfohlen; Gelbfieber je nach Region.",
        "health_safety_info": "Sicherheitslage prüfen; Mückenschutz beachten.",
        "source": "generated"
      },
      {
        "name": "Mayotte",
        "country": "Mayotte",
        "country_code": "YT",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1671573263475-4e67ba1c063c?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Mayotte ist ein Land in Africa (Eastern Africa). Hauptstadt: Mamoudzou.",
        "highlights": [
          "Mamoudzou",
          "Nationalparks",
          "Küstenorte",
          "Märkte"
        ],
        "best_season": "November bis März",
        "average_daily_cost": 90,
        "currency": "EUR",
        "visa_info": "Visum häufig erforderlich; Bestimmungen vorab prüfen.",
        "vaccination_info": "Hepatitis A empfohlen; Gelbfieber je nach Region.",
        "health_safety_info": "Sicherheitslage prüfen; Mückenschutz beachten.",
        "source": "generated"
      },
      {
        "name": "Micronesia",
        "country": "Micronesia",
        "country_code": "FM",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1553602932-f93f674a9aaa?q=80&w=2142&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Micronesia ist ein Land in Oceania (Micronesia). Hauptstadt: Palikir.",
        "highlights": [
          "Palikir",
          "Strände",
          "Lagunen",
          "Nationalparks"
        ],
        "best_season": "Ganzjährig",
        "average_daily_cost": 90,
        "currency": "USD",
        "visa_info": "Einreisebestimmungen je nach Land prüfen.",
        "vaccination_info": "Standardimpfungen; Mückenschutz in Tropeninseln.",
        "health_safety_info": "UV-Schutz beachten; Meeresströmungen berücksichtigen.",
        "source": "generated"
      },
      {
        "name": "Moldova",
        "country": "Moldova",
        "country_code": "MD",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1600159953570-df048e507c7b?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Moldova ist ein Land in Europe (Eastern Europe). Hauptstadt: Chișinău.",
        "highlights": [
          "Chișinău",
          "Altstädte",
          "Museen",
          "Kulturstätten"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 90,
        "currency": "MDL",
        "visa_info": "Einreisebestimmungen je nach Staatsangehörigkeit prüfen.",
        "vaccination_info": "Standardimpfungen; Zeckenschutz in Waldgebieten.",
        "health_safety_info": "Taschendiebstahl beachten; hohe medizinische Standards.",
        "source": "generated"
      },
      {
        "name": "Monaco",
        "country": "Monaco",
        "country_code": "MC",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1581819896533-f8ab6767ce7e?q=80&w=1501&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Monaco ist ein Land in Europe (Western Europe). Hauptstadt: Monaco.",
        "highlights": [
          "Monaco",
          "Altstädte",
          "Museen",
          "Kulturstätten"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 90,
        "currency": "EUR",
        "visa_info": "Einreisebestimmungen je nach Staatsangehörigkeit prüfen.",
        "vaccination_info": "Standardimpfungen; Zeckenschutz in Waldgebieten.",
        "health_safety_info": "Taschendiebstahl beachten; hohe medizinische Standards.",
        "source": "generated"
      },
      {
        "name": "Mongolia",
        "country": "Mongolia",
        "country_code": "MN",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1589654615616-6756a5653100?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Mongolia ist ein Land in Asia (Eastern Asia). Hauptstadt: Ulan Bator.",
        "highlights": [
          "Ulan Bator",
          "Tempel",
          "Street Food",
          "Berglandschaften"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 90,
        "currency": "MNT",
        "visa_info": "Visumregeln je nach Land prüfen.",
        "vaccination_info": "Hepatitis A empfohlen; je nach Region Typhus/Jap. Enzephalitis.",
        "health_safety_info": "Mückenschutz in Tropen; Verkehr kann chaotisch sein.",
        "source": "generated"
      },
      {
        "name": "Montenegro",
        "country": "Montenegro",
        "country_code": "ME",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1587551329971-31ef450a12f3?q=80&w=626&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Montenegro ist ein Land in Europe (Southeast Europe). Hauptstadt: Podgorica.",
        "highlights": [
          "Podgorica",
          "Altstädte",
          "Museen",
          "Kulturstätten"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 90,
        "currency": "EUR",
        "visa_info": "Einreisebestimmungen je nach Staatsangehörigkeit prüfen.",
        "vaccination_info": "Standardimpfungen; Zeckenschutz in Waldgebieten.",
        "health_safety_info": "Taschendiebstahl beachten; hohe medizinische Standards.",
        "source": "generated"
      },
      {
        "name": "Montserrat",
        "country": "Montserrat",
        "country_code": "MS",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1596203164608-3b34693e05d5?q=80&w=1529&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Montserrat ist ein Land in Americas (Caribbean). Hauptstadt: Plymouth.",
        "highlights": [
          "Plymouth",
          "Nationalparks",
          "Küsten",
          "Roadtrips"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 90,
        "currency": "XCD",
        "visa_info": "Einreisebestimmungen je nach Land vorab prüfen.",
        "vaccination_info": "Hepatitis A empfohlen; Gelbfieber in Tropen möglich.",
        "health_safety_info": "Sicherheitslage je nach Region prüfen; Mückenschutz in Tropen.",
        "source": "generated"
      },
      {
        "name": "Morocco",
        "country": "Morocco",
        "country_code": "MA",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1569383746724-6f1b882b8f46?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Morocco ist ein Land in Africa (Northern Africa). Hauptstadt: Rabat.",
        "highlights": [
          "Rabat",
          "Nationalparks",
          "Küstenorte",
          "Märkte"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 90,
        "currency": "MAD",
        "visa_info": "Visum häufig erforderlich; Bestimmungen vorab prüfen.",
        "vaccination_info": "Hepatitis A empfohlen; Gelbfieber je nach Region.",
        "health_safety_info": "Sicherheitslage prüfen; Mückenschutz beachten.",
        "source": "generated"
      },
      {
        "name": "Mozambique",
        "country": "Mozambique",
        "country_code": "MZ",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1565104165703-0777aab1b278?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Mozambique ist ein Land in Africa (Eastern Africa). Hauptstadt: Maputo.",
        "highlights": [
          "Maputo",
          "Nationalparks",
          "Küstenorte",
          "Märkte"
        ],
        "best_season": "November bis März",
        "average_daily_cost": 90,
        "currency": "MZN",
        "visa_info": "Visum häufig erforderlich; Bestimmungen vorab prüfen.",
        "vaccination_info": "Hepatitis A empfohlen; Gelbfieber je nach Region.",
        "health_safety_info": "Sicherheitslage prüfen; Mückenschutz beachten.",
        "source": "generated"
      },
      {
        "name": "Myanmar (Burma)",
        "country": "Myanmar (Burma)",
        "country_code": "MM",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1490077476659-095159692ab5?q=80&w=1451&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Myanmar (Burma) ist ein Land in Asia (South-Eastern Asia). Hauptstadt: Naypyidaw.",
        "highlights": [
          "Naypyidaw",
          "Tempel",
          "Street Food",
          "Berglandschaften"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 90,
        "currency": "MMK",
        "visa_info": "Visumregeln je nach Land prüfen.",
        "vaccination_info": "Hepatitis A empfohlen; je nach Region Typhus/Jap. Enzephalitis.",
        "health_safety_info": "Mückenschutz in Tropen; Verkehr kann chaotisch sein.",
        "source": "generated"
      },
      {
        "name": "Nauru",
        "country": "Nauru",
        "country_code": "NR",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1553947315-42cee3c8c771?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Nauru ist ein Land in Oceania (Micronesia). Hauptstadt: Yaren.",
        "highlights": [
          "Yaren",
          "Strände",
          "Lagunen",
          "Nationalparks"
        ],
        "best_season": "Ganzjährig",
        "average_daily_cost": 90,
        "currency": "AUD",
        "visa_info": "Einreisebestimmungen je nach Land prüfen.",
        "vaccination_info": "Standardimpfungen; Mückenschutz in Tropeninseln.",
        "health_safety_info": "UV-Schutz beachten; Meeresströmungen berücksichtigen.",
        "source": "generated"
      },
      {
        "name": "Nepal",
        "country": "Nepal",
        "country_code": "NP",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1518002054494-3a6f94352e9d?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Nepal ist ein Land in Asia (Southern Asia). Hauptstadt: Kathmandu.",
        "highlights": [
          "Kathmandu",
          "Tempel",
          "Street Food",
          "Berglandschaften"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 90,
        "currency": "NPR",
        "visa_info": "Visumregeln je nach Land prüfen.",
        "vaccination_info": "Hepatitis A empfohlen; je nach Region Typhus/Jap. Enzephalitis.",
        "health_safety_info": "Mückenschutz in Tropen; Verkehr kann chaotisch sein.",
        "source": "generated"
      },
      {
        "name": "Netherlands",
        "country": "Netherlands",
        "country_code": "NL",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://source.unsplash.com/featured/?netherlands,landscape",
        "description": "Netherlands ist ein Land in Europe (Western Europe). Hauptstadt: Amsterdam.",
        "highlights": [
          "Amsterdam",
          "Altstädte",
          "Museen",
          "Kulturstätten"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 90,
        "currency": "EUR",
        "visa_info": "Einreisebestimmungen je nach Staatsangehörigkeit prüfen.",
        "vaccination_info": "Standardimpfungen; Zeckenschutz in Waldgebieten.",
        "health_safety_info": "Taschendiebstahl beachten; hohe medizinische Standards.",
        "source": "generated"
      },
      {
        "name": "Niger",
        "country": "Niger",
        "country_code": "NE",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1736355089441-4d0684e762d7?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Niger ist ein Land in Africa (Western Africa). Hauptstadt: Niamey.",
        "highlights": [
          "Niamey",
          "Nationalparks",
          "Küstenorte",
          "Märkte"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 90,
        "currency": "XOF",
        "visa_info": "Visum häufig erforderlich; Bestimmungen vorab prüfen.",
        "vaccination_info": "Hepatitis A empfohlen; Gelbfieber je nach Region.",
        "health_safety_info": "Sicherheitslage prüfen; Mückenschutz beachten.",
        "source": "generated"
      },
      {
        "name": "Nigeria",
        "country": "Nigeria",
        "country_code": "NG",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1594538756542-8c88bda491c5?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Westafrikanisches Land mit pulsierenden Städten, Küste und vielfältiger Kultur.",
        "highlights": [
          "Lagos",
          "Abuja",
          "Yankari",
          "Erin-Ijesha Wasserfälle"
        ],
        "best_season": "November bis März",
        "average_daily_cost": 55,
        "currency": "NGN",
        "visa_info": "Visum erforderlich; Einreisebestimmungen vorab prüfen.",
        "vaccination_info": "Hepatitis A empfohlen; Gelbfieberimpfung vorgeschrieben.",
        "health_safety_info": "Sicherheitslage prüfen; Reisewege sorgfältig planen.",
        "source": "curated"
      },
      {
        "name": "Niue",
        "country": "Niue",
        "country_code": "NU",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1637595823309-62c331c4c4ec?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Niue ist ein Land in Oceania (Polynesia). Hauptstadt: Alofi.",
        "highlights": [
          "Alofi",
          "Strände",
          "Lagunen",
          "Nationalparks"
        ],
        "best_season": "November bis März",
        "average_daily_cost": 90,
        "currency": "NZD",
        "visa_info": "Einreisebestimmungen je nach Land prüfen.",
        "vaccination_info": "Standardimpfungen; Mückenschutz in Tropeninseln.",
        "health_safety_info": "UV-Schutz beachten; Meeresströmungen berücksichtigen.",
        "source": "generated"
      },
      {
        "name": "North Macedonia",
        "country": "North Macedonia",
        "country_code": "MK",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1619371620133-1c4b489a0569?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "North Macedonia ist ein Land in Europe (Southeast Europe). Hauptstadt: Skopje.",
        "highlights": [
          "Skopje",
          "Altstädte",
          "Museen",
          "Kulturstätten"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 90,
        "currency": "MKD",
        "visa_info": "Einreisebestimmungen je nach Staatsangehörigkeit prüfen.",
        "vaccination_info": "Standardimpfungen; Zeckenschutz in Waldgebieten.",
        "health_safety_info": "Taschendiebstahl beachten; hohe medizinische Standards.",
        "source": "generated"
      },
      {
        "name": "Oman",
        "country": "Oman",
        "country_code": "OM",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1621680696874-edd80ce57b72?q=80&w=1591&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Oman ist ein Land in Asia (Western Asia). Hauptstadt: Muscat.",
        "highlights": [
          "Muscat",
          "Tempel",
          "Street Food",
          "Berglandschaften"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 90,
        "currency": "OMR",
        "visa_info": "Visumregeln je nach Land prüfen.",
        "vaccination_info": "Hepatitis A empfohlen; je nach Region Typhus/Jap. Enzephalitis.",
        "health_safety_info": "Mückenschutz in Tropen; Verkehr kann chaotisch sein.",
        "source": "generated"
      },
      {
        "name": "Pakistan",
        "country": "Pakistan",
        "country_code": "PK",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1514558427911-8e293bebf18c?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Pakistan ist ein Land in Asia (Southern Asia). Hauptstadt: Islamabad.",
        "highlights": [
          "Islamabad",
          "Tempel",
          "Street Food",
          "Berglandschaften"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 90,
        "currency": "PKR",
        "visa_info": "Visumregeln je nach Land prüfen.",
        "vaccination_info": "Hepatitis A empfohlen; je nach Region Typhus/Jap. Enzephalitis.",
        "health_safety_info": "Mückenschutz in Tropen; Verkehr kann chaotisch sein.",
        "source": "generated"
      },
      {
        "name": "Palau",
        "country": "Palau",
        "country_code": "PW",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1682462238190-7558c70e3c3b?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Palau ist ein Land in Oceania (Micronesia). Hauptstadt: Ngerulmud.",
        "highlights": [
          "Ngerulmud",
          "Strände",
          "Lagunen",
          "Nationalparks"
        ],
        "best_season": "Ganzjährig",
        "average_daily_cost": 90,
        "currency": "USD",
        "visa_info": "Einreisebestimmungen je nach Land prüfen.",
        "vaccination_info": "Standardimpfungen; Mückenschutz in Tropeninseln.",
        "health_safety_info": "UV-Schutz beachten; Meeresströmungen berücksichtigen.",
        "source": "generated"
      },
      {
        "name": "Palestine",
        "country": "Palestine",
        "country_code": "PS",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://source.unsplash.com/featured/?palestine,landscape",
        "description": "Palestine ist ein Land in Asia (Western Asia). Hauptstadt: Ramallah.",
        "highlights": [
          "Ramallah",
          "Tempel",
          "Street Food",
          "Berglandschaften"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 90,
        "currency": "EGP",
        "visa_info": "Visumregeln je nach Land prüfen.",
        "vaccination_info": "Hepatitis A empfohlen; je nach Region Typhus/Jap. Enzephalitis.",
        "health_safety_info": "Mückenschutz in Tropen; Verkehr kann chaotisch sein.",
        "source": "generated"
      },
      {
        "name": "Papua New Guinea",
        "country": "Papua New Guinea",
        "country_code": "PG",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://source.unsplash.com/featured/?papua%20new%20guinea,landscape",
        "description": "Papua New Guinea ist ein Land in Oceania (Melanesia). Hauptstadt: Port Moresby.",
        "highlights": [
          "Port Moresby",
          "Strände",
          "Lagunen",
          "Nationalparks"
        ],
        "best_season": "Ganzjährig",
        "average_daily_cost": 90,
        "currency": "PGK",
        "visa_info": "Einreisebestimmungen je nach Land prüfen.",
        "vaccination_info": "Standardimpfungen; Mückenschutz in Tropeninseln.",
        "health_safety_info": "UV-Schutz beachten; Meeresströmungen berücksichtigen.",
        "source": "generated"
      },
      {
        "name": "Poland",
        "country": "Poland",
        "country_code": "PL",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1563177978-4c5ffc081b2a?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Poland ist ein Land in Europe (Central Europe). Hauptstadt: Warsaw.",
        "highlights": [
          "Warsaw",
          "Altstädte",
          "Museen",
          "Kulturstätten"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 90,
        "currency": "PLN",
        "visa_info": "Einreisebestimmungen je nach Staatsangehörigkeit prüfen.",
        "vaccination_info": "Standardimpfungen; Zeckenschutz in Waldgebieten.",
        "health_safety_info": "Taschendiebstahl beachten; hohe medizinische Standards.",
        "source": "generated"
      },
      {
        "name": "Portugal",
        "country": "Portugal",
        "country_code": "PT",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1583915171662-bafdaee1156a?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Portugal ist ein Land in Europe (Southern Europe). Hauptstadt: Lisbon.",
        "highlights": [
          "Lisbon",
          "Altstädte",
          "Museen",
          "Kulturstätten"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 90,
        "currency": "EUR",
        "visa_info": "Einreisebestimmungen je nach Staatsangehörigkeit prüfen.",
        "vaccination_info": "Standardimpfungen; Zeckenschutz in Waldgebieten.",
        "health_safety_info": "Taschendiebstahl beachten; hohe medizinische Standards.",
        "source": "generated"
      },
      {
        "name": "Puerto Rico",
        "country": "Puerto Rico",
        "country_code": "PR",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1579687196544-08ae57ab5c11?q=80&w=1631&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Puerto Rico ist ein Land in Americas (Caribbean). Hauptstadt: San Juan.",
        "highlights": [
          "San Juan",
          "Nationalparks",
          "Küsten",
          "Roadtrips"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 90,
        "currency": "USD",
        "visa_info": "Einreisebestimmungen je nach Land vorab prüfen.",
        "vaccination_info": "Hepatitis A empfohlen; Gelbfieber in Tropen möglich.",
        "health_safety_info": "Sicherheitslage je nach Region prüfen; Mückenschutz in Tropen.",
        "source": "generated"
      },
      {
        "name": "Qatar",
        "country": "Qatar",
        "country_code": "QA",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1539475314840-751cecc1dacd?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Qatar ist ein Land in Asia (Western Asia). Hauptstadt: Doha.",
        "highlights": [
          "Doha",
          "Tempel",
          "Street Food",
          "Berglandschaften"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 90,
        "currency": "QAR",
        "visa_info": "Visumregeln je nach Land prüfen.",
        "vaccination_info": "Hepatitis A empfohlen; je nach Region Typhus/Jap. Enzephalitis.",
        "health_safety_info": "Mückenschutz in Tropen; Verkehr kann chaotisch sein.",
        "source": "generated"
      },
      {
        "name": "Romania",
        "country": "Romania",
        "country_code": "RO",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1526112982068-f899a62e118e?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Romania ist ein Land in Europe (Southeast Europe). Hauptstadt: Bucharest.",
        "highlights": [
          "Bucharest",
          "Altstädte",
          "Museen",
          "Kulturstätten"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 90,
        "currency": "RON",
        "visa_info": "Einreisebestimmungen je nach Staatsangehörigkeit prüfen.",
        "vaccination_info": "Standardimpfungen; Zeckenschutz in Waldgebieten.",
        "health_safety_info": "Taschendiebstahl beachten; hohe medizinische Standards.",
        "source": "generated"
      },
      {
        "name": "Russia",
        "country": "Russia",
        "country_code": "RU",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1547448415-e9f5b28e570d?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Russia ist ein Land in Europe (Eastern Europe). Hauptstadt: Moscow.",
        "highlights": [
          "Moscow",
          "Altstädte",
          "Museen",
          "Kulturstätten"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 90,
        "currency": "RUB",
        "visa_info": "Einreisebestimmungen je nach Staatsangehörigkeit prüfen.",
        "vaccination_info": "Standardimpfungen; Zeckenschutz in Waldgebieten.",
        "health_safety_info": "Taschendiebstahl beachten; hohe medizinische Standards.",
        "source": "generated"
      },
      {
        "name": "Rwanda",
        "country": "Rwanda",
        "country_code": "RW",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1651860282296-47055c68580e?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Rwanda ist ein Land in Africa (Eastern Africa). Hauptstadt: Kigali.",
        "highlights": [
          "Kigali",
          "Nationalparks",
          "Küstenorte",
          "Märkte"
        ],
        "best_season": "Ganzjährig",
        "average_daily_cost": 90,
        "currency": "RWF",
        "visa_info": "Visum häufig erforderlich; Bestimmungen vorab prüfen.",
        "vaccination_info": "Hepatitis A empfohlen; Gelbfieber je nach Region.",
        "health_safety_info": "Sicherheitslage prüfen; Mückenschutz beachten.",
        "source": "generated"
      },
      {
        "name": "Réunion",
        "country": "Réunion",
        "country_code": "RE",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1580910727537-e4c80c6a6a29?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Réunion ist ein Land in Africa (Eastern Africa). Hauptstadt: Saint-Denis.",
        "highlights": [
          "Saint-Denis",
          "Nationalparks",
          "Küstenorte",
          "Märkte"
        ],
        "best_season": "November bis März",
        "average_daily_cost": 90,
        "currency": "EUR",
        "visa_info": "Visum häufig erforderlich; Bestimmungen vorab prüfen.",
        "vaccination_info": "Hepatitis A empfohlen; Gelbfieber je nach Region.",
        "health_safety_info": "Sicherheitslage prüfen; Mückenschutz beachten.",
        "source": "generated"
      },
      {
        "name": "Samoa (American)",
        "country": "Samoa (American)",
        "country_code": "AS",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1701156417506-b789655c7f3e?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Samoa (American) ist ein Land in Oceania (Polynesia). Hauptstadt: Pago Pago.",
        "highlights": [
          "Pago Pago",
          "Strände",
          "Lagunen",
          "Nationalparks"
        ],
        "best_season": "November bis März",
        "average_daily_cost": 90,
        "currency": "USD",
        "visa_info": "Einreisebestimmungen je nach Land prüfen.",
        "vaccination_info": "Standardimpfungen; Mückenschutz in Tropeninseln.",
        "health_safety_info": "UV-Schutz beachten; Meeresströmungen berücksichtigen.",
        "source": "generated"
      },
      {
        "name": "Samoa (western)",
        "country": "Samoa (western)",
        "country_code": "WS",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1701156417506-b789655c7f3e?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Samoa (western) ist ein Land in Oceania (Polynesia). Hauptstadt: Apia.",
        "highlights": [
          "Apia",
          "Strände",
          "Lagunen",
          "Nationalparks"
        ],
        "best_season": "November bis März",
        "average_daily_cost": 90,
        "currency": "WST",
        "visa_info": "Einreisebestimmungen je nach Land prüfen.",
        "vaccination_info": "Standardimpfungen; Mückenschutz in Tropeninseln.",
        "health_safety_info": "UV-Schutz beachten; Meeresströmungen berücksichtigen.",
        "source": "generated"
      },
      {
        "name": "San Marino",
        "country": "San Marino",
        "country_code": "SM",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1633792006252-0247f57e94a9?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "San Marino ist ein Land in Europe (Southern Europe). Hauptstadt: City of San Marino.",
        "highlights": [
          "City of San Marino",
          "Altstädte",
          "Museen",
          "Kulturstätten"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 90,
        "currency": "EUR",
        "visa_info": "Einreisebestimmungen je nach Staatsangehörigkeit prüfen.",
        "vaccination_info": "Standardimpfungen; Zeckenschutz in Waldgebieten.",
        "health_safety_info": "Taschendiebstahl beachten; hohe medizinische Standards.",
        "source": "generated"
      },
      {
        "name": "Sao Tome & Principe",
        "country": "Sao Tome & Principe",
        "country_code": "ST",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1521837095228-0acd6c1cf09a?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Sao Tome & Principe ist ein Land in Africa (Middle Africa). Hauptstadt: São Tomé.",
        "highlights": [
          "São Tomé",
          "Nationalparks",
          "Küstenorte",
          "Märkte"
        ],
        "best_season": "Ganzjährig",
        "average_daily_cost": 90,
        "currency": "STN",
        "visa_info": "Visum häufig erforderlich; Bestimmungen vorab prüfen.",
        "vaccination_info": "Hepatitis A empfohlen; Gelbfieber je nach Region.",
        "health_safety_info": "Sicherheitslage prüfen; Mückenschutz beachten.",
        "source": "generated"
      },
      {
        "name": "Saudi Arabia",
        "country": "Saudi Arabia",
        "country_code": "SA",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1590959914819-b767b9fe4cfb?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Saudi Arabia ist ein Land in Asia (Western Asia). Hauptstadt: Riyadh.",
        "highlights": [
          "Riyadh",
          "Tempel",
          "Street Food",
          "Berglandschaften"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 90,
        "currency": "SAR",
        "visa_info": "Visumregeln je nach Land prüfen.",
        "vaccination_info": "Hepatitis A empfohlen; je nach Region Typhus/Jap. Enzephalitis.",
        "health_safety_info": "Mückenschutz in Tropen; Verkehr kann chaotisch sein.",
        "source": "generated"
      },
      {
        "name": "Senegal",
        "country": "Senegal",
        "country_code": "SN",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1528047705243-ebb19baf436f?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Senegal ist ein Land in Africa (Western Africa). Hauptstadt: Dakar.",
        "highlights": [
          "Dakar",
          "Nationalparks",
          "Küstenorte",
          "Märkte"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 90,
        "currency": "XOF",
        "visa_info": "Visum häufig erforderlich; Bestimmungen vorab prüfen.",
        "vaccination_info": "Hepatitis A empfohlen; Gelbfieber je nach Region.",
        "health_safety_info": "Sicherheitslage prüfen; Mückenschutz beachten.",
        "source": "generated"
      },
      {
        "name": "Serbia",
        "country": "Serbia",
        "country_code": "RS",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1632343084107-353ad9e95e37?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Serbia ist ein Land in Europe (Southeast Europe). Hauptstadt: Belgrade.",
        "highlights": [
          "Belgrade",
          "Altstädte",
          "Museen",
          "Kulturstätten"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 90,
        "currency": "RSD",
        "visa_info": "Einreisebestimmungen je nach Staatsangehörigkeit prüfen.",
        "vaccination_info": "Standardimpfungen; Zeckenschutz in Waldgebieten.",
        "health_safety_info": "Taschendiebstahl beachten; hohe medizinische Standards.",
        "source": "generated"
      },
      {
        "name": "Seychelles",
        "country": "Seychelles",
        "country_code": "SC",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1670234069735-a9b32837cee4?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Seychelles ist ein Land in Africa (Eastern Africa). Hauptstadt: Victoria.",
        "highlights": [
          "Victoria",
          "Nationalparks",
          "Küstenorte",
          "Märkte"
        ],
        "best_season": "Ganzjährig",
        "average_daily_cost": 90,
        "currency": "SCR",
        "visa_info": "Visum häufig erforderlich; Bestimmungen vorab prüfen.",
        "vaccination_info": "Hepatitis A empfohlen; Gelbfieber je nach Region.",
        "health_safety_info": "Sicherheitslage prüfen; Mückenschutz beachten.",
        "source": "generated"
      },
      {
        "name": "Sierra Leone",
        "country": "Sierra Leone",
        "country_code": "SL",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1611395813517-41f9be5e292d?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Sierra Leone ist ein Land in Africa (Western Africa). Hauptstadt: Freetown.",
        "highlights": [
          "Freetown",
          "Nationalparks",
          "Küstenorte",
          "Märkte"
        ],
        "best_season": "Ganzjährig",
        "average_daily_cost": 90,
        "currency": "SLE",
        "visa_info": "Visum häufig erforderlich; Bestimmungen vorab prüfen.",
        "vaccination_info": "Hepatitis A empfohlen; Gelbfieber je nach Region.",
        "health_safety_info": "Sicherheitslage prüfen; Mückenschutz beachten.",
        "source": "generated"
      },
      {
        "name": "Slovakia",
        "country": "Slovakia",
        "country_code": "SK",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1470043201067-764120126eb4?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Slovakia ist ein Land in Europe (Central Europe). Hauptstadt: Bratislava.",
        "highlights": [
          "Bratislava",
          "Altstädte",
          "Museen",
          "Kulturstätten"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 90,
        "currency": "EUR",
        "visa_info": "Einreisebestimmungen je nach Staatsangehörigkeit prüfen.",
        "vaccination_info": "Standardimpfungen; Zeckenschutz in Waldgebieten.",
        "health_safety_info": "Taschendiebstahl beachten; hohe medizinische Standards.",
        "source": "generated"
      },
      {
        "name": "Slovenia",
        "country": "Slovenia",
        "country_code": "SI",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1520900828798-002c1800f31a?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Slovenia ist ein Land in Europe (Central Europe). Hauptstadt: Ljubljana.",
        "highlights": [
          "Ljubljana",
          "Altstädte",
          "Museen",
          "Kulturstätten"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 90,
        "currency": "EUR",
        "visa_info": "Einreisebestimmungen je nach Staatsangehörigkeit prüfen.",
        "vaccination_info": "Standardimpfungen; Zeckenschutz in Waldgebieten.",
        "health_safety_info": "Taschendiebstahl beachten; hohe medizinische Standards.",
        "source": "generated"
      },
      {
        "name": "Solomon Islands",
        "country": "Solomon Islands",
        "country_code": "SB",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1519155778036-e89552bc12f2?q=80&w=1389&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Solomon Islands ist ein Land in Oceania (Melanesia). Hauptstadt: Honiara.",
        "highlights": [
          "Honiara",
          "Strände",
          "Lagunen",
          "Nationalparks"
        ],
        "best_season": "Ganzjährig",
        "average_daily_cost": 90,
        "currency": "SBD",
        "visa_info": "Einreisebestimmungen je nach Land prüfen.",
        "vaccination_info": "Standardimpfungen; Mückenschutz in Tropeninseln.",
        "health_safety_info": "UV-Schutz beachten; Meeresströmungen berücksichtigen.",
        "source": "generated"
      },
      {
        "name": "Somalia",
        "country": "Somalia",
        "country_code": "SO",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1661135401065-36dee543c72b?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Somalia ist ein Land in Africa (Eastern Africa). Hauptstadt: Mogadishu.",
        "highlights": [
          "Mogadishu",
          "Nationalparks",
          "Küstenorte",
          "Märkte"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 90,
        "currency": "SOS",
        "visa_info": "Visum häufig erforderlich; Bestimmungen vorab prüfen.",
        "vaccination_info": "Hepatitis A empfohlen; Gelbfieber je nach Region.",
        "health_safety_info": "Sicherheitslage prüfen; Mückenschutz beachten.",
        "source": "generated"
      },
      {
        "name": "South Georgia & the South Sandwich Islands",
        "country": "South Georgia & the South Sandwich Islands",
        "country_code": "GS",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1551985812-aae4f1f6ae2e?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "South Georgia & the South Sandwich Islands ist ein Land in Antarctic. Hauptstadt: King Edward Point.",
        "highlights": [
          "King Edward Point",
          "Natur",
          "Kultur",
          "Kulinarik"
        ],
        "best_season": "November bis März",
        "average_daily_cost": 90,
        "currency": "GBP",
        "visa_info": "Einreisebestimmungen vor Reiseantritt prüfen.",
        "vaccination_info": "Standardimpfungen prüfen.",
        "health_safety_info": "Aktuelle Reise- und Sicherheitshinweise beachten.",
        "source": "generated"
      },
      {
        "name": "South Sudan",
        "country": "South Sudan",
        "country_code": "SS",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1691935301739-7e63093963dc?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "South Sudan ist ein Land in Africa (Middle Africa). Hauptstadt: Juba.",
        "highlights": [
          "Juba",
          "Nationalparks",
          "Küstenorte",
          "Märkte"
        ],
        "best_season": "Ganzjährig",
        "average_daily_cost": 90,
        "currency": "SSP",
        "visa_info": "Visum häufig erforderlich; Bestimmungen vorab prüfen.",
        "vaccination_info": "Hepatitis A empfohlen; Gelbfieber je nach Region.",
        "health_safety_info": "Sicherheitslage prüfen; Mückenschutz beachten.",
        "source": "generated"
      },
      {
        "name": "Spain",
        "country": "Spain",
        "country_code": "ES",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1573611030146-ff6916c398fa?q=80&w=1351&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Spain ist ein Land in Europe (Southern Europe). Hauptstadt: Madrid.",
        "highlights": [
          "Madrid",
          "Altstädte",
          "Museen",
          "Kulturstätten"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 90,
        "currency": "EUR",
        "visa_info": "Einreisebestimmungen je nach Staatsangehörigkeit prüfen.",
        "vaccination_info": "Standardimpfungen; Zeckenschutz in Waldgebieten.",
        "health_safety_info": "Taschendiebstahl beachten; hohe medizinische Standards.",
        "source": "generated"
      },
      {
        "name": "St Kitts & Nevis",
        "country": "St Kitts & Nevis",
        "country_code": "KN",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://source.unsplash.com/featured/?st%20kitts%20&%20nevis,landscape",
        "description": "St Kitts & Nevis ist ein Land in Americas (Caribbean). Hauptstadt: Basseterre.",
        "highlights": [
          "Basseterre",
          "Nationalparks",
          "Küsten",
          "Roadtrips"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 90,
        "currency": "XCD",
        "visa_info": "Einreisebestimmungen je nach Land vorab prüfen.",
        "vaccination_info": "Hepatitis A empfohlen; Gelbfieber in Tropen möglich.",
        "health_safety_info": "Sicherheitslage je nach Region prüfen; Mückenschutz in Tropen.",
        "source": "generated"
      },
      {
        "name": "St Lucia",
        "country": "St Lucia",
        "country_code": "LC",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://source.unsplash.com/featured/?st%20lucia,landscape",
        "description": "St Lucia ist ein Land in Americas (Caribbean). Hauptstadt: Castries.",
        "highlights": [
          "Castries",
          "Nationalparks",
          "Küsten",
          "Roadtrips"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 90,
        "currency": "XCD",
        "visa_info": "Einreisebestimmungen je nach Land vorab prüfen.",
        "vaccination_info": "Hepatitis A empfohlen; Gelbfieber in Tropen möglich.",
        "health_safety_info": "Sicherheitslage je nach Region prüfen; Mückenschutz in Tropen.",
        "source": "generated"
      },
      {
        "name": "St Maarten (Dutch)",
        "country": "St Maarten (Dutch)",
        "country_code": "SX",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://source.unsplash.com/featured/?st%20maarten%20(dutch),landscape",
        "description": "St Maarten (Dutch) ist ein Land in Americas (Caribbean). Hauptstadt: Philipsburg.",
        "highlights": [
          "Philipsburg",
          "Nationalparks",
          "Küsten",
          "Roadtrips"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 90,
        "currency": "ANG",
        "visa_info": "Einreisebestimmungen je nach Land vorab prüfen.",
        "vaccination_info": "Hepatitis A empfohlen; Gelbfieber in Tropen möglich.",
        "health_safety_info": "Sicherheitslage je nach Region prüfen; Mückenschutz in Tropen.",
        "source": "generated"
      },
      {
        "name": "St Vincent",
        "country": "St Vincent",
        "country_code": "VC",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1637169518288-ccb384040226?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "St Vincent ist ein Land in Americas (Caribbean). Hauptstadt: Kingstown.",
        "highlights": [
          "Kingstown",
          "Nationalparks",
          "Küsten",
          "Roadtrips"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 90,
        "currency": "XCD",
        "visa_info": "Einreisebestimmungen je nach Land vorab prüfen.",
        "vaccination_info": "Hepatitis A empfohlen; Gelbfieber in Tropen möglich.",
        "health_safety_info": "Sicherheitslage je nach Region prüfen; Mückenschutz in Tropen.",
        "source": "generated"
      },
      {
        "name": "Sudan",
        "country": "Sudan",
        "country_code": "SD",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1685677821127-169deb7fb349?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Sudan ist ein Land in Africa (Northern Africa). Hauptstadt: Khartoum.",
        "highlights": [
          "Khartoum",
          "Nationalparks",
          "Küstenorte",
          "Märkte"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 90,
        "currency": "SDG",
        "visa_info": "Visum häufig erforderlich; Bestimmungen vorab prüfen.",
        "vaccination_info": "Hepatitis A empfohlen; Gelbfieber je nach Region.",
        "health_safety_info": "Sicherheitslage prüfen; Mückenschutz beachten.",
        "source": "generated"
      },
      {
        "name": "Suriname",
        "country": "Suriname",
        "country_code": "SR",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1660758898976-66382b34c00d?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Suriname ist ein Land in Americas (South America). Hauptstadt: Paramaribo.",
        "highlights": [
          "Paramaribo",
          "Nationalparks",
          "Küsten",
          "Roadtrips"
        ],
        "best_season": "Ganzjährig",
        "average_daily_cost": 90,
        "currency": "SRD",
        "visa_info": "Einreisebestimmungen je nach Land vorab prüfen.",
        "vaccination_info": "Hepatitis A empfohlen; Gelbfieber in Tropen möglich.",
        "health_safety_info": "Sicherheitslage je nach Region prüfen; Mückenschutz in Tropen.",
        "source": "generated"
      },
      {
        "name": "Switzerland",
        "country": "Switzerland",
        "country_code": "CH",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1527668752968-14dc70a27c95?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Switzerland ist ein Land in Europe (Western Europe). Hauptstadt: Bern.",
        "highlights": [
          "Bern",
          "Altstädte",
          "Museen",
          "Kulturstätten"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 90,
        "currency": "CHF",
        "visa_info": "Einreisebestimmungen je nach Staatsangehörigkeit prüfen.",
        "vaccination_info": "Standardimpfungen; Zeckenschutz in Waldgebieten.",
        "health_safety_info": "Taschendiebstahl beachten; hohe medizinische Standards.",
        "source": "generated"
      },
      {
        "name": "Syria",
        "country": "Syria",
        "country_code": "SY",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1645740262380-d86b597b90c4?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Syria ist ein Land in Asia (Western Asia). Hauptstadt: Damascus.",
        "highlights": [
          "Damascus",
          "Tempel",
          "Street Food",
          "Berglandschaften"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 90,
        "currency": "SYP",
        "visa_info": "Visumregeln je nach Land prüfen.",
        "vaccination_info": "Hepatitis A empfohlen; je nach Region Typhus/Jap. Enzephalitis.",
        "health_safety_info": "Mückenschutz in Tropen; Verkehr kann chaotisch sein.",
        "source": "generated"
      },
      {
        "name": "Taiwan",
        "country": "Taiwan",
        "country_code": "TW",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1470004914212-05527e49370b?q=80&w=1674&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Taiwan ist ein Land in Asia (Eastern Asia). Hauptstadt: Taipei.",
        "highlights": [
          "Taipei",
          "Tempel",
          "Street Food",
          "Berglandschaften"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 90,
        "currency": "TWD",
        "visa_info": "Visumregeln je nach Land prüfen.",
        "vaccination_info": "Hepatitis A empfohlen; je nach Region Typhus/Jap. Enzephalitis.",
        "health_safety_info": "Mückenschutz in Tropen; Verkehr kann chaotisch sein.",
        "source": "generated"
      },
      {
        "name": "Tajikistan",
        "country": "Tajikistan",
        "country_code": "TJ",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1590999563469-effba37954b2?q=80&w=1476&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Tajikistan ist ein Land in Asia (Central Asia). Hauptstadt: Dushanbe.",
        "highlights": [
          "Dushanbe",
          "Tempel",
          "Street Food",
          "Berglandschaften"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 90,
        "currency": "TJS",
        "visa_info": "Visumregeln je nach Land prüfen.",
        "vaccination_info": "Hepatitis A empfohlen; je nach Region Typhus/Jap. Enzephalitis.",
        "health_safety_info": "Mückenschutz in Tropen; Verkehr kann chaotisch sein.",
        "source": "generated"
      },
      {
        "name": "Togo",
        "country": "Togo",
        "country_code": "TG",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1684211757307-ccf7d147a48c?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Togo ist ein Land in Africa (Western Africa). Hauptstadt: Lomé.",
        "highlights": [
          "Lomé",
          "Nationalparks",
          "Küstenorte",
          "Märkte"
        ],
        "best_season": "Ganzjährig",
        "average_daily_cost": 90,
        "currency": "XOF",
        "visa_info": "Visum häufig erforderlich; Bestimmungen vorab prüfen.",
        "vaccination_info": "Hepatitis A empfohlen; Gelbfieber je nach Region.",
        "health_safety_info": "Sicherheitslage prüfen; Mückenschutz beachten.",
        "source": "generated"
      },
      {
        "name": "Tokelau",
        "country": "Tokelau",
        "country_code": "TK",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://plus.unsplash.com/premium_photo-1664283661426-c0daf3c67c6d?q=80&w=1473&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Tokelau ist ein Land in Oceania (Polynesia). Hauptstadt: Fakaofo.",
        "highlights": [
          "Fakaofo",
          "Strände",
          "Lagunen",
          "Nationalparks"
        ],
        "best_season": "Ganzjährig",
        "average_daily_cost": 90,
        "currency": "NZD",
        "visa_info": "Einreisebestimmungen je nach Land prüfen.",
        "vaccination_info": "Standardimpfungen; Mückenschutz in Tropeninseln.",
        "health_safety_info": "UV-Schutz beachten; Meeresströmungen berücksichtigen.",
        "source": "generated"
      },
      {
        "name": "Tonga",
        "country": "Tonga",
        "country_code": "TO",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1590491484047-3fc9757d5fba?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Tonga ist ein Land in Oceania (Polynesia). Hauptstadt: Nuku'alofa.",
        "highlights": [
          "Nuku'alofa",
          "Strände",
          "Lagunen",
          "Nationalparks"
        ],
        "best_season": "November bis März",
        "average_daily_cost": 90,
        "currency": "TOP",
        "visa_info": "Einreisebestimmungen je nach Land prüfen.",
        "vaccination_info": "Standardimpfungen; Mückenschutz in Tropeninseln.",
        "health_safety_info": "UV-Schutz beachten; Meeresströmungen berücksichtigen.",
        "source": "generated"
      },
      {
        "name": "Trinidad & Tobago",
        "country": "Trinidad & Tobago",
        "country_code": "TT",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1714348515524-2d92c7799ef9?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Trinidad & Tobago ist ein Land in Americas (Caribbean). Hauptstadt: Port of Spain.",
        "highlights": [
          "Port of Spain",
          "Nationalparks",
          "Küsten",
          "Roadtrips"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 90,
        "currency": "TTD",
        "visa_info": "Einreisebestimmungen je nach Land vorab prüfen.",
        "vaccination_info": "Hepatitis A empfohlen; Gelbfieber in Tropen möglich.",
        "health_safety_info": "Sicherheitslage je nach Region prüfen; Mückenschutz in Tropen.",
        "source": "generated"
      },
      {
        "name": "Tunisia",
        "country": "Tunisia",
        "country_code": "TN",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1556901599-6cd86f3da8b1?q=80&w=2099&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Tunisia ist ein Land in Africa (Northern Africa). Hauptstadt: Tunis.",
        "highlights": [
          "Tunis",
          "Nationalparks",
          "Küstenorte",
          "Märkte"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 90,
        "currency": "TND",
        "visa_info": "Visum häufig erforderlich; Bestimmungen vorab prüfen.",
        "vaccination_info": "Hepatitis A empfohlen; Gelbfieber je nach Region.",
        "health_safety_info": "Sicherheitslage prüfen; Mückenschutz beachten.",
        "source": "generated"
      },
      {
        "name": "Turkmenistan",
        "country": "Turkmenistan",
        "country_code": "TM",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1698771937461-914e16303d7a?q=80&w=929&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Turkmenistan ist ein Land in Asia (Central Asia). Hauptstadt: Ashgabat.",
        "highlights": [
          "Ashgabat",
          "Tempel",
          "Street Food",
          "Berglandschaften"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 90,
        "currency": "TMT",
        "visa_info": "Visumregeln je nach Land prüfen.",
        "vaccination_info": "Hepatitis A empfohlen; je nach Region Typhus/Jap. Enzephalitis.",
        "health_safety_info": "Mückenschutz in Tropen; Verkehr kann chaotisch sein.",
        "source": "generated"
      },
      {
        "name": "Turks & Caicos Is",
        "country": "Turks & Caicos Is",
        "country_code": "TC",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1482955903579-70929ba3a509?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Turks & Caicos Is ist ein Land in Americas (Caribbean). Hauptstadt: Cockburn Town.",
        "highlights": [
          "Cockburn Town",
          "Nationalparks",
          "Küsten",
          "Roadtrips"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 90,
        "currency": "USD",
        "visa_info": "Einreisebestimmungen je nach Land vorab prüfen.",
        "vaccination_info": "Hepatitis A empfohlen; Gelbfieber in Tropen möglich.",
        "health_safety_info": "Sicherheitslage je nach Region prüfen; Mückenschutz in Tropen.",
        "source": "generated"
      },
      {
        "name": "Tuvalu",
        "country": "Tuvalu",
        "country_code": "TV",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://plus.unsplash.com/premium_photo-1681839699894-b42c91a2eea2?q=80&w=1469&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Tuvalu ist ein Land in Oceania (Polynesia). Hauptstadt: Funafuti.",
        "highlights": [
          "Funafuti",
          "Strände",
          "Lagunen",
          "Nationalparks"
        ],
        "best_season": "Ganzjährig",
        "average_daily_cost": 90,
        "currency": "AUD",
        "visa_info": "Einreisebestimmungen je nach Land prüfen.",
        "vaccination_info": "Standardimpfungen; Mückenschutz in Tropeninseln.",
        "health_safety_info": "UV-Schutz beachten; Meeresströmungen berücksichtigen.",
        "source": "generated"
      },
      {
        "name": "Ukraine",
        "country": "Ukraine",
        "country_code": "UA",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1639341267320-2d062b250c0d?q=80&w=1529&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Ukraine ist ein Land in Europe (Eastern Europe). Hauptstadt: Kyiv.",
        "highlights": [
          "Kyiv",
          "Altstädte",
          "Museen",
          "Kulturstätten"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 90,
        "currency": "UAH",
        "visa_info": "Einreisebestimmungen je nach Staatsangehörigkeit prüfen.",
        "vaccination_info": "Standardimpfungen; Zeckenschutz in Waldgebieten.",
        "health_safety_info": "Taschendiebstahl beachten; hohe medizinische Standards.",
        "source": "generated"
      },
      {
        "name": "United Arab Emirates",
        "country": "United Arab Emirates",
        "country_code": "AE",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1722502831620-e35451283894?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "United Arab Emirates ist ein Land in Asia (Western Asia). Hauptstadt: Abu Dhabi.",
        "highlights": [
          "Abu Dhabi",
          "Tempel",
          "Street Food",
          "Berglandschaften"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 90,
        "currency": "AED",
        "visa_info": "Visumregeln je nach Land prüfen.",
        "vaccination_info": "Hepatitis A empfohlen; je nach Region Typhus/Jap. Enzephalitis.",
        "health_safety_info": "Mückenschutz in Tropen; Verkehr kann chaotisch sein.",
        "source": "generated"
      },
      {
        "name": "United States",
        "country": "United States",
        "country_code": "US",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1511055882449-bef7ffcedac0?q=80&w=715&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "United States ist ein Land in Americas (North America). Hauptstadt: Washington, D.C..",
        "highlights": [
          "Washington, D.C.",
          "Nationalparks",
          "Küsten",
          "Roadtrips"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 90,
        "currency": "USD",
        "visa_info": "Einreisebestimmungen je nach Land vorab prüfen.",
        "vaccination_info": "Hepatitis A empfohlen; Gelbfieber in Tropen möglich.",
        "health_safety_info": "Sicherheitslage je nach Region prüfen; Mückenschutz in Tropen.",
        "source": "generated"
      },
      {
        "name": "Uzbekistan",
        "country": "Uzbekistan",
        "country_code": "UZ",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1733586092622-1b3201e802a5?q=80&w=1025&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Uzbekistan ist ein Land in Asia (Central Asia). Hauptstadt: Tashkent.",
        "highlights": [
          "Tashkent",
          "Tempel",
          "Street Food",
          "Berglandschaften"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 90,
        "currency": "UZS",
        "visa_info": "Visumregeln je nach Land prüfen.",
        "vaccination_info": "Hepatitis A empfohlen; je nach Region Typhus/Jap. Enzephalitis.",
        "health_safety_info": "Mückenschutz in Tropen; Verkehr kann chaotisch sein.",
        "source": "generated"
      },
      {
        "name": "Vanuatu",
        "country": "Vanuatu",
        "country_code": "VU",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1602587557684-11163fe60c87?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Vanuatu ist ein Land in Oceania (Melanesia). Hauptstadt: Port Vila.",
        "highlights": [
          "Port Vila",
          "Strände",
          "Lagunen",
          "Nationalparks"
        ],
        "best_season": "November bis März",
        "average_daily_cost": 90,
        "currency": "VUV",
        "visa_info": "Einreisebestimmungen je nach Land prüfen.",
        "vaccination_info": "Standardimpfungen; Mückenschutz in Tropeninseln.",
        "health_safety_info": "UV-Schutz beachten; Meeresströmungen berücksichtigen.",
        "source": "generated"
      },
      {
        "name": "Vatican City",
        "country": "Vatican City",
        "country_code": "VA",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1531572753322-ad063cecc140?q=80&w=1476&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Vatican City ist ein Land in Europe (Southern Europe). Hauptstadt: Vatican City.",
        "highlights": [
          "Vatican City",
          "Altstädte",
          "Museen",
          "Kulturstätten"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 90,
        "currency": "EUR",
        "visa_info": "Einreisebestimmungen je nach Staatsangehörigkeit prüfen.",
        "vaccination_info": "Standardimpfungen; Zeckenschutz in Waldgebieten.",
        "health_safety_info": "Taschendiebstahl beachten; hohe medizinische Standards.",
        "source": "generated"
      },
      {
        "name": "Vietnam",
        "country": "Vietnam",
        "country_code": "VN",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1605189914441-47183c6fcd08?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Vietnam ist ein Land in Asia (South-Eastern Asia). Hauptstadt: Hanoi.",
        "highlights": [
          "Hanoi",
          "Tempel",
          "Street Food",
          "Berglandschaften"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 90,
        "currency": "VND",
        "visa_info": "Visumregeln je nach Land prüfen.",
        "vaccination_info": "Hepatitis A empfohlen; je nach Region Typhus/Jap. Enzephalitis.",
        "health_safety_info": "Mückenschutz in Tropen; Verkehr kann chaotisch sein.",
        "source": "generated"
      },
      {
        "name": "Britische Jungfern Inseln",
        "country": "Britische Jungfern Inseln",
        "country_code": "VI",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1617709961064-7ebb1913f824?q=80&w=1494&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Britische Jungfern Inseln ist ein Land in Americas (Caribbean). Hauptstadt: Charlotte Amalie.",
        "highlights": [
          "Charlotte Amalie",
          "Nationalparks",
          "Küsten",
          "Roadtrips"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 90,
        "currency": "USD",
        "visa_info": "Einreisebestimmungen je nach Land vorab prüfen.",
        "vaccination_info": "Hepatitis A empfohlen; Gelbfieber in Tropen möglich.",
        "health_safety_info": "Sicherheitslage je nach Region prüfen; Mückenschutz in Tropen.",
        "source": "generated"
      },
      {
        "name": "Wallis & Futuna",
        "country": "Wallis & Futuna",
        "country_code": "WF",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://source.unsplash.com/featured/?wallis%20&%20futuna,landscape",
        "description": "Wallis & Futuna ist ein Land in Oceania (Polynesia). Hauptstadt: Mata-Utu.",
        "highlights": [
          "Mata-Utu",
          "Strände",
          "Lagunen",
          "Nationalparks"
        ],
        "best_season": "November bis März",
        "average_daily_cost": 90,
        "currency": "XPF",
        "visa_info": "Einreisebestimmungen je nach Land prüfen.",
        "vaccination_info": "Standardimpfungen; Mückenschutz in Tropeninseln.",
        "health_safety_info": "UV-Schutz beachten; Meeresströmungen berücksichtigen.",
        "source": "generated"
      },
      {
        "name": "Western Sahara",
        "country": "Western Sahara",
        "country_code": "EH",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1559586616-361e18714958?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Western Sahara ist ein Land in Africa (Northern Africa). Hauptstadt: El Aaiún.",
        "highlights": [
          "El Aaiún",
          "Nationalparks",
          "Küstenorte",
          "Märkte"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 90,
        "currency": "DZD",
        "visa_info": "Visum häufig erforderlich; Bestimmungen vorab prüfen.",
        "vaccination_info": "Hepatitis A empfohlen; Gelbfieber je nach Region.",
        "health_safety_info": "Sicherheitslage prüfen; Mückenschutz beachten.",
        "source": "generated"
      },
      {
        "name": "Yemen",
        "country": "Yemen",
        "country_code": "YE",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1642425149556-b6f90e946859?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Yemen ist ein Land in Asia (Western Asia). Hauptstadt: Sana'a.",
        "highlights": [
          "Sana'a",
          "Tempel",
          "Street Food",
          "Berglandschaften"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 90,
        "currency": "YER",
        "visa_info": "Visumregeln je nach Land prüfen.",
        "vaccination_info": "Hepatitis A empfohlen; je nach Region Typhus/Jap. Enzephalitis.",
        "health_safety_info": "Mückenschutz in Tropen; Verkehr kann chaotisch sein.",
        "source": "generated"
      },
      {
        "name": "Zambia",
        "country": "Zambia",
        "country_code": "ZM",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1666732566977-8805c13a6ce2?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Zambia ist ein Land in Africa (Eastern Africa). Hauptstadt: Lusaka.",
        "highlights": [
          "Lusaka",
          "Nationalparks",
          "Küstenorte",
          "Märkte"
        ],
        "best_season": "November bis März",
        "average_daily_cost": 90,
        "currency": "ZMW",
        "visa_info": "Visum häufig erforderlich; Bestimmungen vorab prüfen.",
        "vaccination_info": "Hepatitis A empfohlen; Gelbfieber je nach Region.",
        "health_safety_info": "Sicherheitslage prüfen; Mückenschutz beachten.",
        "source": "generated"
      },
      {
        "name": "Zimbabwe",
        "country": "Zimbabwe",
        "country_code": "ZW",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1634179412263-19d96377c1a2?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Zimbabwe ist ein Land in Africa (Southern Africa). Hauptstadt: Harare.",
        "highlights": [
          "Harare",
          "Nationalparks",
          "Küstenorte",
          "Märkte"
        ],
        "best_season": "November bis März",
        "average_daily_cost": 90,
        "currency": "ZWL",
        "visa_info": "Visum häufig erforderlich; Bestimmungen vorab prüfen.",
        "vaccination_info": "Hepatitis A empfohlen; Gelbfieber je nach Region.",
        "health_safety_info": "Sicherheitslage prüfen; Mückenschutz beachten.",
        "source": "generated"
      },
      {
        "name": "Åland Islands",
        "country": "Åland Islands",
        "country_code": "AX",
        "type": "country",
        "types": [
          "country"
        ],
        "image_url": "https://images.unsplash.com/photo-1600942956900-0522090c4182?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "description": "Åland Islands ist ein Land in Europe (Northern Europe). Hauptstadt: Mariehamn.",
        "highlights": [
          "Mariehamn",
          "Altstädte",
          "Museen",
          "Kulturstätten"
        ],
        "best_season": "Mai bis Oktober",
        "average_daily_cost": 90,
        "currency": "EUR",
        "visa_info": "Einreisebestimmungen je nach Staatsangehörigkeit prüfen.",
        "vaccination_info": "Standardimpfungen; Zeckenschutz in Waldgebieten.",
        "health_safety_info": "Taschendiebstahl beachten; hohe medizinische Standards.",
        "source": "generated"
      }
    ]'::jsonb
  ) AS d(
    name text,
    country text,
    country_code text,
    type text,
    types text[],
    image_url text,
    description text,
    highlights text[],
    best_season text,
    average_daily_cost numeric,
    currency text,
    visa_info text,
    vaccination_info text,
    health_safety_info text,
    source text,
    coords_lat numeric,
    coords_lon numeric
  )
)
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
  d.name,
  d.country,
  d.country_code,
  d.type,
  COALESCE(d.types, ARRAY[d.type]),
  d.image_url,
  d.description,
  d.highlights,
  d.best_season,
  d.average_daily_cost,
  d.currency,
  d.visa_info,
  d.vaccination_info,
  d.health_safety_info,
  d.source,
  d.coords_lat,
  d.coords_lon
FROM data d
WHERE NOT EXISTS (
  SELECT 1
  FROM public.destinations existing
  WHERE existing.type = 'country'
    AND existing.name = d.name
    AND existing.country = d.country
);

UPDATE public.destinations existing
SET image_url = d.image_url,
    description = d.description,
    highlights = d.highlights,
    best_season = d.best_season,
    average_daily_cost = d.average_daily_cost,
    currency = d.currency,
    visa_info = d.visa_info,
    vaccination_info = d.vaccination_info,
    health_safety_info = d.health_safety_info,
    source = d.source,
    types = COALESCE(d.types, existing.types),
    coords_lat = COALESCE(d.coords_lat, existing.coords_lat),
    coords_lon = COALESCE(d.coords_lon, existing.coords_lon)
FROM data d
WHERE existing.type = 'country'
  AND existing.name = d.name
  AND existing.country = d.country;

UPDATE public.destinations
SET image_url = 'https://flagcdn.com/w1280/' || lower(country_code) || '.png'
WHERE type = 'country'
  AND source = 'generated'
  AND country_code IS NOT NULL
  AND (
    image_url IS NULL
    OR image_url = ''
  );
