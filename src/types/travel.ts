export interface TodoItem {
  id: string;
  category: 'visa' | 'health' | 'budget' | 'preparation' | 'transport';
  title: string;
  description?: string;
  completed: boolean;
}

export interface Attraction {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  rating?: number;
  priceLevel?: 'free' | 'low' | 'medium' | 'high';
  externalUrl?: string;
}

export interface Hotel {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  pricePerNight: number;
  rating: number;
  amenities: string[];
  bookingUrl?: string;
}

export interface PackingItem {
  id: string;
  name: string;
  packed: boolean;
  category: 'clothing' | 'toiletries' | 'electronics' | 'documents' | 'other';
  quantity?: number;
}



export interface FlightConnection {
  id: string;
  airline: string;
  departureCity: string;
  arrivalCity: string;
  duration: string;
  priceRange: string;
  stops: number;
  bookingUrl?: string;
}

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  priceLevel: 'low' | 'medium' | 'high';
  rating: number;
  imageUrl: string;
  externalUrl?: string;
}

export const packingCategoryLabels: Record<PackingItem['category'], string> = {
  clothing: 'Kleidung',
  toiletries: 'Hygiene',
  electronics: 'Elektronik',
  documents: 'Dokumente',
  other: 'Sonstiges',
};

export const packingCategoryIcons: Record<PackingItem['category'], string> = {
  clothing: '👕',
  toiletries: '🧴',
  electronics: '📱',
  documents: '📄',
  other: '📦',
};

export interface WeatherInfo {
  averageTemp: number;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'mixed';
  bestTimeToVisit: string;
  packingTips: string[];
}

export interface PeopleBreakdown {
  adults: number;
  children: number;
  babies: number;
}

export interface Country {
  id: string;
  name: string;
  code: string;
  imageUrl: string;
  startDate: string;
  endDate: string;
  todos: TodoItem[];
  dailyCost?: number;
  currency?: string;
  attractions?: Attraction[];
  hotels?: Hotel[];
  restaurants?: Restaurant[];
  flights?: FlightConnection[];
  weather?: WeatherInfo;
  peopleCount?: number;
  people?: PeopleBreakdown;
  packingList?: PackingItem[];
  tips?: string[];
  transportNotes?: string[];
  itinerary?: string[];
  stops?: TripStop[];
}

export interface Trip {
  id: string;
  name: string;
  countries: Country[];
  createdAt: string;
}

export interface Destination {
  id: string;
  name: string;
  country: string;
  countryCode?: string;
  type: 'country' | 'island' | 'city' | 'region';
  imageUrl: string;
  description: string;
  highlights: string[];
  bestSeason: string;
  averageDailyCost: number;
  currency: string;
  visaInfo?: string;
  vaccinationInfo?: string;
  healthSafetyInfo?: string;
  source?: string;
  parentId?: string;
  coords?: { lat: number; lon: number };
  childrenCount?: number;
}

export interface TripLeg {
  id: string;
  fromId: string;
  toId: string;
  transport: 'flight' | 'train' | 'car' | 'boat' | 'bus';
  distanceKm?: number;
  durationHours?: number;
  priceRange?: string;
  notes?: string;
}

export interface TravelTip {
  id: string;
  category: 'packing' | 'budget' | 'health' | 'safety' | 'culture' | 'transport';
  title: string;
  content: string;
  icon: string;
}

export interface TripStop {
  id: string;
  name: string;
  type: 'city' | 'poi';
  notes?: string;
  tips?: string[];
}

export const categoryLabels: Record<TodoItem['category'], string> = {
  visa: 'Visa & Einreise',
  health: 'Gesundheit',
  budget: 'Finanzen',
  preparation: 'Vorbereitung',
  transport: 'Transport',
};

export const categoryIcons: Record<TodoItem['category'], string> = {
  visa: '🛂',
  health: '💉',
  budget: '💰',
  preparation: '📋',
  transport: '✈️',
};

export const tipCategoryLabels: Record<TravelTip['category'], string> = {
  packing: 'Packen',
  budget: 'Budget',
  health: 'Gesundheit',
  safety: 'Sicherheit',
  culture: 'Kultur',
  transport: 'Transport',
};

export const tipCategoryIcons: Record<TravelTip['category'], string> = {
  packing: '🧳',
  budget: '💸',
  health: '🏥',
  safety: '🔒',
  culture: '🎭',
  transport: '🚆',
};
