import { createClient } from '@supabase/supabase-js';

async function getUserFromToken(supabaseAdmin: any, token: string) {
  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data?.user) return null;
  return data.user;
}

export default async function handler(req: any, res: any) {
  const authHeader = req.headers['authorization'] || '';
  const token = Array.isArray(authHeader)
    ? authHeader[0]?.replace('Bearer ', '')
    : authHeader.replace('Bearer ', '');

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

  if (req.method === 'GET') {
    const { data, error } = await supabaseAdmin
      .from('saved_trips')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

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
  }

  if (req.method === 'POST') {
    try {
      const chunks: Buffer[] = [];
      await new Promise<void>((resolve) => {
        req.on('data', (c: Buffer) => chunks.push(c));
        req.on('end', () => resolve());
      });
      const body = JSON.parse(Buffer.concat(chunks).toString());

      const { destination_name, destination_code, image_url, start_date, end_date, daily_budget, currency } = body || {};
      if (!destination_name) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'destination_name required' }));
        return;
      }

      const { data, error } = await supabaseAdmin
        .from('saved_trips')
        .insert({
          user_id: user.id,
          destination_name,
          destination_code: destination_code || null,
          image_url: image_url || null,
          start_date: start_date || null,
          end_date: end_date || null,
          daily_budget: daily_budget ?? null,
          currency: currency || null,
        })
        .select()
        .single();

      if (error) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: error.message }));
        return;
      }

      res.statusCode = 201;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(data));
      return;
    } catch (e: any) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: e.message }));
      return;
    }
  }

  res.statusCode = 405;
  res.setHeader('Allow', 'GET, POST');
  res.end('Method Not Allowed');
}
