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
  const [isReset, setIsReset] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [resendLoading, setResendLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [mfaRequired, setMfaRequired] = useState(false);
  const [mfaCode, setMfaCode] = useState('');
  const [mfaFactorId, setMfaFactorId] = useState<string | null>(null);
  const [mfaChallengeId, setMfaChallengeId] = useState<string | null>(null);
  const { signIn, signUp } = useAuth();
  const needsConfirmation = !!authError && /confirm/i.test(authError);

  const ensureSupabaseConfig = () => {
    const url = import.meta.env.VITE_SUPABASE_URL;
    const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
    if (!url || !key) {
      toast.error('Supabase Konfiguration fehlt. Bitte .env prüfen.');
      return false;
    }
    return true;
  };

  const maybePromptMfa = async () => {
    const { data, error } = await supabase.auth.mfa.listFactors();
    if (error) {
      toast.error('MFA-Status konnte nicht geprüft werden: ' + error.message);
      return false;
    }
    const factor = data?.totp?.find((f) => f.status === 'verified') || data?.totp?.[0];
    if (!factor?.id) return false;
    const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({
      factorId: factor.id,
    });
    if (challengeError || !challengeData?.id) {
      toast.error('MFA-Challenge fehlgeschlagen: ' + (challengeError?.message || 'Unbekannter Fehler'));
      return false;
    }
    setMfaFactorId(factor.id);
    setMfaChallengeId(challengeData.id);
    setMfaRequired(true);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ensureSupabaseConfig()) return;
    setAuthError(null);
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          const hint = error.message.toLowerCase().includes('invalid login')
            ? 'E-Mail/Passwort falsch oder E-Mail nicht bestätigt.'
            : error.message;
          setAuthError(error.message);
          toast.error('Anmeldung fehlgeschlagen: ' + hint);
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
          setAuthError(error.message);
          toast.error('Registrierung fehlgeschlagen: ' + error.message);
        } else {
          setAuthError(null);
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

  const handleResendConfirmation = async () => {
    if (!ensureSupabaseConfig()) return;
    if (!email) {
      toast.error('Bitte zuerst eine E‑Mail eingeben.');
      return;
    }
    setResendLoading(true);
    try {
      const { error } = await supabase.auth.resend({ type: 'signup', email });
      if (error) {
        toast.error('Bestätigungs‑Mail fehlgeschlagen: ' + error.message);
        return;
      }
      toast.success('Bestätigungs‑Mail gesendet');
    } finally {
      setResendLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ensureSupabaseConfig()) return;
    if (!email) {
      toast.error('Bitte zuerst eine E‑Mail eingeben.');
      return;
    }
    setResetLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin,
      });
      if (error) {
        toast.error('Passwort‑Reset fehlgeschlagen: ' + error.message);
        return;
      }
      toast.success('Passwort‑Reset‑Mail gesendet');
      setIsReset(false);
    } finally {
      setResetLoading(false);
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
        toast.error('MFA-Code ungültig: ' + error.message);
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
    setIsReset(false);
    setAuthError(null);
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
            {isReset ? 'Passwort zurücksetzen' : isLogin ? 'Willkommen zurück!' : 'Konto erstellen'}
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
        ) : isReset ? (
          <form onSubmit={handlePasswordReset} className="space-y-4 mt-4">
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
            <Button type="submit" className="w-full" disabled={resetLoading}>
              {resetLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Reset‑Mail senden
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => setIsReset(false)}
            >
              Zurück zum Login
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
            {isLogin ? (
              <button
                type="button"
                onClick={() => setIsReset(true)}
                className="text-xs text-primary hover:underline text-left"
              >
                Passwort vergessen?
              </button>
            ) : null}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLogin ? 'Anmelden' : 'Registrieren'}
            </Button>
            {authError ? (
              <div className="text-xs text-muted-foreground text-center">
                {needsConfirmation ? (
                  <div className="space-y-2">
                    <div>E‑Mail ist nicht bestätigt. Bestätigungs‑Mail erneut senden?</div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleResendConfirmation}
                      disabled={resendLoading}
                    >
                      {resendLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Bestätigungs‑Mail senden
                    </Button>
                  </div>
                ) : (
                  <div>Bitte E‑Mail und Passwort prüfen.</div>
                )}
              </div>
            ) : null}
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
