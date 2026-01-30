import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, Mail, Lock, User } from 'lucide-react';

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AuthDialog = ({ open, onOpenChange }: AuthDialogProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const { } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const resp = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        const data = await resp.json();
        if (!resp.ok) {
          toast.error('Anmeldung fehlgeschlagen: ' + (data.error || 'Unbekannter Fehler'));
        } else {
          const { error } = await supabase.auth.setSession({
            access_token: data.access_token,
            refresh_token: data.refresh_token,
          });
          if (error) {
            toast.error('Session-Fehler: ' + error.message);
          } else {
            toast.success('Erfolgreich angemeldet!');
            onOpenChange(false);
            resetForm();
            window.location.href = '/';
          }
        }
      } else {
        const resp = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, displayName }),
        });
        const data = await resp.json();
        if (!resp.ok) {
          toast.error('Registrierung fehlgeschlagen: ' + (data.error || 'Unbekannter Fehler'));
        } else {
          const loginResp = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          });
          const loginData = await loginResp.json();
          if (!loginResp.ok) {
            toast.error('Automatisches Anmelden fehlgeschlagen: ' + (loginData.error || 'Unbekannter Fehler'));
          } else {
            const { error } = await supabase.auth.setSession({
              access_token: loginData.access_token,
              refresh_token: loginData.refresh_token,
            });
            if (error) {
              toast.error('Session-Fehler: ' + error.message);
            } else {
              toast.success('Konto erfolgreich erstellt!');
              onOpenChange(false);
              resetForm();
              window.location.href = '/';
            }
          }
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setDisplayName('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center font-display text-2xl">
            {isLogin ? 'Willkommen zurück!' : 'Konto erstellen'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="displayName">Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="displayName"
                  type="text"
                  placeholder="Dein Name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">E-Mail</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="deine@email.de"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Passwort</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="pl-10"
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLogin ? 'Anmelden' : 'Registrieren'}
          </Button>
        </form>

        <div className="text-center text-sm text-muted-foreground mt-4">
          {isLogin ? (
            <>
              Noch kein Konto?{' '}
              <button
                type="button"
                onClick={() => setIsLogin(false)}
                className="text-primary hover:underline font-medium"
              >
                Jetzt registrieren
              </button>
            </>
          ) : (
            <>
              Bereits registriert?{' '}
              <button
                type="button"
                onClick={() => setIsLogin(true)}
                className="text-primary hover:underline font-medium"
              >
                Anmelden
              </button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
