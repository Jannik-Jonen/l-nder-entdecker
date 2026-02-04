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
  const [mfaRequired, setMfaRequired] = useState(false);
  const [mfaCode, setMfaCode] = useState('');
  const [mfaFactorId, setMfaFactorId] = useState<string | null>(null);
  const [mfaChallengeId, setMfaChallengeId] = useState<string | null>(null);
  const { signIn, signUp } = useAuth();

  const maybePromptMfa = async () => {
    const { data, error } = await supabase.auth.mfa.listFactors();
    if (error) return false;
    const factor = data?.totp?.find((f) => f.status === 'verified') || data?.totp?.[0];
    if (!factor?.id) return false;
    const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({
      factorId: factor.id,
    });
    if (challengeError || !challengeData?.id) {
      toast.error('MFA-Challenge fehlgeschlagen');
      return false;
    }
    setMfaFactorId(factor.id);
    setMfaChallengeId(challengeData.id);
    setMfaRequired(true);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          toast.error('Anmeldung fehlgeschlagen: ' + error.message);
        } else {
          const needsMfa = await maybePromptMfa();
          if (!needsMfa) {
            toast.success('Erfolgreich angemeldet!');
            onOpenChange(false);
            resetForm();
            window.location.href = '/';
          }
        }
      } else {
        const { error } = await signUp(email, password, displayName);
        if (error) {
          toast.error('Registrierung fehlgeschlagen: ' + error.message);
        } else {
          toast.success('Konto erfolgreich erstellt!');
          const { error: loginError } = await signIn(email, password);
          if (loginError) {
            toast.error('Automatisches Anmelden fehlgeschlagen: ' + loginError.message);
          } else {
            const needsMfa = await maybePromptMfa();
            if (!needsMfa) {
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

  const handleMfaVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mfaFactorId || !mfaChallengeId) return;
    setLoading(true);
    try {
      const { error } = await supabase.auth.mfa.verify({
        factorId: mfaFactorId,
        challengeId: mfaChallengeId,
        code: mfaCode,
      });
      if (error) {
        toast.error('MFA-Code ungültig');
        return;
      }
      toast.success('MFA bestätigt');
      onOpenChange(false);
      resetForm();
      window.location.href = '/';
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setDisplayName('');
    setMfaRequired(false);
    setMfaCode('');
    setMfaFactorId(null);
    setMfaChallengeId(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center font-display text-2xl">
            {isLogin ? 'Willkommen zurück!' : 'Konto erstellen'}
          </DialogTitle>
        </DialogHeader>

        {mfaRequired ? (
          <form onSubmit={handleMfaVerify} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="mfaCode">TOTP‑Code</Label>
              <div className="relative">
                <Input
                  id="mfaCode"
                  type="text"
                  placeholder="123456"
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value)}
                  inputMode="numeric"
                  pattern="[0-9]*"
                />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Bestätigen
            </Button>
          </form>
        ) : (
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
        )}

        {mfaRequired ? null : (
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
        )}
      </DialogContent>
    </Dialog>
  );
};
