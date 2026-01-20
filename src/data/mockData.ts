import { Country, Trip } from '@/types/travel';

export const defaultTodos = [
  {
    id: '1',
    category: 'visa' as const,
    title: 'Visabestimmungen prüfen',
    description: 'Einreisebestimmungen und benötigte Dokumente recherchieren',
    completed: false,
  },
  {
    id: '2',
    category: 'health' as const,
    title: 'Impfungen prüfen',
    description: 'Empfohlene und Pflichtimpfungen beim Arzt besprechen',
    completed: false,
  },
  {
    id: '3',
    category: 'budget' as const,
    title: 'Budget planen',
    description: 'Tagesbudget für Unterkunft, Essen und Aktivitäten kalkulieren',
    completed: false,
  },
  {
    id: '4',
    category: 'preparation' as const,
    title: 'Reiseversicherung abschließen',
    description: 'Auslandskrankenversicherung und Reiserücktritt prüfen',
    completed: false,
  },
  {
    id: '5',
    category: 'transport' as const,
    title: 'Flüge buchen',
    description: 'Beste Verbindungen und Preise vergleichen',
    completed: false,
  },
];

export const mockCountries: Country[] = [
  {
    id: 'portugal',
    name: 'Portugal',
    code: 'PT',
    imageUrl: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800&q=80',
    startDate: '2026-03-20',
    endDate: '2026-04-01',
    todos: [
      { ...defaultTodos[0], id: 'pt-1', completed: true },
      { ...defaultTodos[1], id: 'pt-2', completed: true },
      { ...defaultTodos[2], id: 'pt-3', completed: false },
      { ...defaultTodos[3], id: 'pt-4', completed: false },
      { ...defaultTodos[4], id: 'pt-5', completed: false },
    ],
  },
  {
    id: 'newzealand',
    name: 'Neuseeland',
    code: 'NZ',
    imageUrl: 'https://images.unsplash.com/photo-1469521669194-babb45599def?w=800&q=80',
    startDate: '2026-09-01',
    endDate: '2026-09-23',
    todos: [
      { ...defaultTodos[0], id: 'nz-1', completed: true },
      { ...defaultTodos[1], id: 'nz-2', completed: false },
      { ...defaultTodos[2], id: 'nz-3', completed: false },
      { ...defaultTodos[3], id: 'nz-4', completed: false },
      { ...defaultTodos[4], id: 'nz-5', completed: false },
    ],
  },
  {
    id: 'finland',
    name: 'Finnisch-Lappland',
    code: 'FI',
    imageUrl: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&q=80',
    startDate: '2026-12-12',
    endDate: '2026-12-22',
    todos: [
      { ...defaultTodos[0], id: 'fi-1', completed: false },
      { ...defaultTodos[1], id: 'fi-2', completed: false },
      { ...defaultTodos[2], id: 'fi-3', completed: false },
      { ...defaultTodos[3], id: 'fi-4', completed: false },
      { ...defaultTodos[4], id: 'fi-5', completed: false },
    ],
  },
];

export const mockTrip: Trip = {
  id: 'trip-2026',
  name: 'Meine Weltreise 2026',
  countries: mockCountries,
  createdAt: '2025-01-01',
};
