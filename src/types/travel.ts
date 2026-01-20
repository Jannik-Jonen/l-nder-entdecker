export interface TodoItem {
  id: string;
  category: 'visa' | 'health' | 'budget' | 'preparation' | 'transport';
  title: string;
  description?: string;
  completed: boolean;
}

export interface Country {
  id: string;
  name: string;
  code: string;
  imageUrl: string;
  startDate: string;
  endDate: string;
  todos: TodoItem[];
}

export interface Trip {
  id: string;
  name: string;
  countries: Country[];
  createdAt: string;
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
