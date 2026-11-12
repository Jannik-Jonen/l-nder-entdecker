export type TripItemType = 'accommodation' | 'transport' | 'activity' | 'sight' | 'food' | 'note';
export type BookingStatus = 'idea' | 'planned' | 'booked';

export interface TripItem {
  id: string;
  route_id: string;
  day_number: number | null;
  item_type: TripItemType;
  title: string;
  description: string | null;
  location: string | null;
  start_time: string | null;
  end_time: string | null;
  cost_planned: number | null;
  cost_actual: number | null;
  currency: string;
  booking_status: BookingStatus;
  link: string | null;
  offer_id: string | null;
  sort_order: number;
}

export interface TripRoute {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  status: string;
  trip_type: 'trip' | 'world_trip';
  start_date: string | null;
  end_date: string | null;
  travelers: number;
  total_budget: number | null;
  budget_currency: string | null;
  original_prompt: string | null;
  created_at: string;
}

export const ITEM_TYPE_LABELS: Record<TripItemType, string> = {
  accommodation: 'Unterkunft',
  transport: 'Transport',
  activity: 'Aktivität',
  sight: 'Sehenswürdigkeit',
  food: 'Essen & Trinken',
  note: 'Notiz',
};

export const BOOKING_LABELS: Record<BookingStatus, string> = {
  idea: 'Idee',
  planned: 'Geplant',
  booked: 'Gebucht',
};

export const OFFER_TYPE_LABELS: Record<string, string> = {
  accommodation: 'Unterkunft',
  experience: 'Erlebnis',
  tour: 'Tour',
  transport: 'Transport',
};

/** Number of days between start and end date, inclusive. 0 if unknown. */
export function tripDayCount(start: string | null, end: string | null): number {
  if (!start || !end) return 0;
  const s = new Date(start + 'T00:00:00Z').getTime();
  const e = new Date(end + 'T00:00:00Z').getTime();
  if (isNaN(s) || isNaN(e) || e < s) return 0;
  return Math.round((e - s) / 86400000) + 1;
}

/** Date (YYYY-MM-DD) for day N (1-based) of a trip. */
export function dateForDay(start: string | null, day: number): string | null {
  if (!start) return null;
  const d = new Date(start + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() + day - 1);
  return d.toISOString().slice(0, 10);
}

export interface BudgetSummary {
  planned: number;
  actual: number;
  byType: Record<TripItemType, { planned: number; actual: number }>;
  /** 'ok' under 90% of budget, 'warn' 90–100%, 'over' above 100%, 'none' without budget */
  status: 'ok' | 'warn' | 'over' | 'none';
}

export function summarizeBudget(items: Pick<TripItem, 'item_type' | 'cost_planned' | 'cost_actual'>[], totalBudget: number | null): BudgetSummary {
  const byType = Object.fromEntries(
    (Object.keys(ITEM_TYPE_LABELS) as TripItemType[]).map((t) => [t, { planned: 0, actual: 0 }]),
  ) as BudgetSummary['byType'];
  let planned = 0;
  let actual = 0;
  for (const it of items) {
    const p = Number(it.cost_planned) || 0;
    const a = Number(it.cost_actual) || 0;
    planned += p;
    actual += a;
    const bucket = byType[it.item_type] ?? byType.note;
    bucket.planned += p;
    bucket.actual += a;
  }
  let status: BudgetSummary['status'] = 'none';
  if (totalBudget && totalBudget > 0) {
    const used = Math.max(planned, actual) / totalBudget;
    status = used > 1 ? 'over' : used >= 0.9 ? 'warn' : 'ok';
  }
  return { planned, actual, byType, status };
}

export const formatMoney = (n: number, currency = 'EUR') =>
  new Intl.NumberFormat('de-DE', { style: 'currency', currency, maximumFractionDigits: 0 }).format(n);

export const PENDING_PROMPT_KEY = 'gd_pending_trip_prompt';
