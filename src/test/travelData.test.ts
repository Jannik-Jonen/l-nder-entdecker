import { describe, expect, it, vi } from 'vitest';

vi.mock('@/integrations/supabase/client', () => ({ isLocalSupabase: false }));
vi.mock('@/lib/supabase-untyped', () => ({
  supabaseUntyped: {
    from: () => ({
      select: () => ({
        eq: () => ({
          single: async () => ({
            data: {
              id: 'venezuela', name: 'Venezuela', country: 'Venezuela',
              country_code: 'VE', type: 'country', source: 'curated',
            },
            error: null,
          }),
        }),
      }),
    }),
  },
}));

import { getDestinationById } from '@/services/travelData';

describe('destination country fallbacks', () => {
  it('loads the service and preserves curated country details without importing SQL', async () => {
    const destination = await getDestinationById('venezuela');
    expect(destination?.currency).toBe('VES');
    expect(destination?.averageDailyCost).toBe(80);
    expect(destination?.highlights).toContain('Angel Falls');
    expect(destination?.imageUrl).toContain('premium_photo-1733317216216');
  });
});