import { createClient } from '@supabase/supabase-js';

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    res.statusCode = 405;
    res.setHeader('Allow', 'GET');
    res.end('Method Not Allowed');
    return;
  }

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

  try {
    const url = process.env.SUPABASE_URL as string;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
    const supabaseAdmin = createClient(url, serviceKey);

    const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(token);
    if (userError || !userData?.user) {
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: userError?.message || 'Invalid token' }));
      return;
    }

    const userId = userData.user.id;
    const displayName = (userData.user.user_metadata as any)?.display_name || null;
    const avatarUrl = (userData.user.user_metadata as any)?.avatar_url || null;

    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (!profile) {
      const { data: newProfile } = await supabaseAdmin
        .from('profiles')
        .insert({
          user_id: userId,
          display_name: displayName,
          avatar_url: avatarUrl,
        })
        .select()
        .single();

      const { count } = await supabaseAdmin
        .from('saved_trips')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId);

      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({
        user_id: userId,
        email: userData.user.email,
        display_name: newProfile?.display_name ?? displayName,
        avatar_url: newProfile?.avatar_url ?? avatarUrl,
        trips_count: count ?? 0,
      }));
      return;
    }

    const { count } = await supabaseAdmin
      .from('saved_trips')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId);

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
      user_id: userId,
      email: userData.user.email,
      display_name: profile.display_name,
      avatar_url: profile.avatar_url,
      trips_count: count ?? 0,
    }));
  } catch (e: any) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: e.message }));
  }
}
