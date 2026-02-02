import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { IncomingMessage, ServerResponse } from 'http';

export default async function handler(req: IncomingMessage & { method?: string }, res: ServerResponse) {
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Allow', 'POST');
    res.end('Method Not Allowed');
    return;
  }

  try {
    const chunks: Buffer[] = [];
    await new Promise<void>((resolve) => {
      req.on('data', (c: Buffer) => chunks.push(c));
      req.on('end', () => resolve());
    });
    const body = JSON.parse(Buffer.concat(chunks).toString());
    const { email, password, displayName } = body || {};

    if (!email || !password) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Missing email or password' }));
      return;
    }

    const url = process.env.SUPABASE_URL as string;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

    const supabaseAdmin: SupabaseClient = createClient(url, serviceKey);

    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      user_metadata: {
        display_name: displayName || null,
      },
      email_confirm: true,
    });

    if (error) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: error.message }));
      return;
    }

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ user_id: data.user?.id }));
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: msg }));
  }
}
