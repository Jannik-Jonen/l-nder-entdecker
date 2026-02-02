import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { IncomingMessage, ServerResponse } from 'http';

async function getUserFromToken(supabaseAdmin: SupabaseClient, token: string) {
  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data?.user) return null;
  return data.user;
}

type RequestWithQuery = IncomingMessage & {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  query?: Record<string, string | string[] | undefined>;
};

export default async function handler(req: RequestWithQuery, res: ServerResponse) {
  const { id } = (req.query || {}) as { id?: string | string[] };
  const method = req.method || 'GET';

  const authHeader = req.headers['authorization'] || '';
  const token = Array.isArray(authHeader)
    ? authHeader[0]?.replace('Bearer ', '')
    : (authHeader || '').replace('Bearer ', '');

  if (!token) {
    res.statusCode = 401;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Missing authorization token' }));
    return;
  }

  const supabaseAdmin = createClient(
    process.env.SUPABASE_URL as string,
    process.env.SUPABASE_SERVICE_ROLE_KEY as string
  );

  const user = await getUserFromToken(supabaseAdmin, token);
  if (!user) {
    res.statusCode = 401;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Invalid token' }));
    return;
  }

  if (!id || typeof id !== 'string') {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Invalid id' }));
    return;
  }

  if (method === 'GET') {
    const { data, error } = await supabaseAdmin
      .from('saved_trips')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: error.message }));
      return;
    }

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(data));
    return;
  }

  if (method === 'PUT') {
    try {
      const chunks: Buffer[] = [];
      await new Promise<void>((resolve) => {
        req.on('data', (c: Buffer) => chunks.push(c));
        req.on('end', () => resolve());
      });
      const body = JSON.parse(Buffer.concat(chunks).toString());

      const fields = [
        'destination_name',
        'destination_code',
        'image_url',
        'start_date',
        'end_date',
        'daily_budget',
        'currency',
        'notes',
      ] as const;
      const update: Partial<Record<(typeof fields)[number], unknown>> = {};
      for (const key of fields) {
        if (key in body) update[key] = body[key];
      }

      const { data, error } = await supabaseAdmin
        .from('saved_trips')
        .update(update)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: error.message }));
        return;
      }

      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(data));
      return;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Unknown error';
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: msg }));
      return;
    }
  }

  if (method === 'DELETE') {
    const { error } = await supabaseAdmin
      .from('saved_trips')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: error.message }));
      return;
    }

    res.statusCode = 204;
    res.end('');
    return;
  }

  res.statusCode = 405;
  res.setHeader('Allow', 'GET, PUT, DELETE');
  res.end('Method Not Allowed');
}
