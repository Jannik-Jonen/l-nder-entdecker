export default async function handler(req: any, res: any) {
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
    const { email, password } = body || {};

    if (!email || !password) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Missing email or password' }));
      return;
    }

    const url = `${process.env.SUPABASE_URL}/auth/v1/token?grant_type=password`;
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: process.env.SUPABASE_PUBLISHABLE_KEY || '',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await resp.json();

    if (!resp.ok) {
      res.statusCode = resp.status;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: data?.error_description || 'Login failed' }));
      return;
    }

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      user: data.user,
    }));
  } catch (e: any) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: e.message }));
  }
}
