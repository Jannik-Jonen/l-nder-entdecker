import { describe, it, expect } from 'vitest';
import { summarizeBudget, tripDayCount, dateForDay } from '@/lib/trips';

describe('trip helpers', () => {
  it('counts trip days inclusive', () => {
    expect(tripDayCount('2026-06-01', '2026-06-10')).toBe(10);
    expect(tripDayCount('2026-06-10', '2026-06-01')).toBe(0);
  });
  it('computes date for a given day', () => {
    expect(dateForDay('2026-06-30', 2)).toBe('2026-07-01');
  });
  it('flags budget over 100% as over', () => {
    const s = summarizeBudget([{ item_type: 'accommodation', cost_planned: 1100, cost_actual: null }], 1000);
    expect(s.status).toBe('over');
    expect(s.byType.accommodation.planned).toBe(1100);
  });
  it('flags budget between 90 and 100% as warn', () => {
    expect(summarizeBudget([{ item_type: 'food', cost_planned: 950, cost_actual: 0 }], 1000).status).toBe('warn');
  });
  it('flags budget under 90% as ok', () => {
    expect(summarizeBudget([{ item_type: 'food', cost_planned: 500, cost_actual: 0 }], 1000).status).toBe('ok');
  });
});
