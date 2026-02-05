import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Header } from '@/components/Header';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'error'>('loading');

  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
    const accessToken = hashParams.get('access_token') || searchParams.get('access_token');
    const refreshToken = hashParams.get('refresh_token') || searchParams.get('refresh_token');
    const code = searchParams.get('code');
    const type = searchParams.get('type');
    const recovery = type === 'recovery' || !!accessToken || !!code;

    const run = async () => {
      try {
        if (accessToken && refreshToken) {
          const { error } = await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
          if (error) throw error;
        } else if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;
        }

        if (recovery) {
          navigate('/?type=recovery', { replace: true });
        } else {
          navigate('/?login=1', { replace: true });
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unbekannter Fehler';
        toast.error('Recovery fehlgeschlagen: ' + message);
        setStatus('error');
      }
    };

    run();
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-16">
        <div className="mx-auto max-w-md text-center space-y-4">
          <h1 className="font-display text-2xl font-semibold">Passwort zurücksetzen</h1>
          <p className="text-muted-foreground">
            {status === 'error'
              ? 'Der Link ist ungültig oder abgelaufen. Bitte fordere einen neuen Link an.'
              : 'Link wird geprüft. Das Fenster öffnet sich gleich.'}
          </p>
          {status === 'error' ? (
            <Button onClick={() => navigate('/?reset=1', { replace: true })}>
              Reset-Link erneut anfordern
            </Button>
          ) : null}
        </div>
      </main>
    </div>
  );
};

export default AuthCallback;
