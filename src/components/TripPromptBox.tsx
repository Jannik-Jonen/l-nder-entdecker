import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Loader2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { AuthDialog } from '@/components/AuthDialog';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { PENDING_PROMPT_KEY } from '@/lib/trips';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const EXAMPLES = [
  '10 Tage Portugal im Mai, nachhaltig, Wandern & Surfen, 1.500 € für 2 Personen',
  'Langes Wochenende Wien mit Kultur und gutem Essen, Anreise mit dem Zug',
  '2 Wochen Costa Rica, Familie mit 2 Kindern, Natur & Tiere',
];

export const TripPromptBox = ({ className, compact = false }: { className?: string; compact?: boolean }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  const run = async (text: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('plan-trip', { body: { prompt: text } });
      if (error || !data?.id) {
        let msg = 'Die Reise konnte nicht erstellt werden.';
        try { msg = (await (error as any)?.context?.json())?.error ?? msg; } catch { /* ignore */ }
        throw new Error(data?.error ?? msg);
      }
      sessionStorage.removeItem(PENDING_PROMPT_KEY);
      toast.success('Deine Reise ist fertig geplant!');
      navigate(`/trips/${data.id}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Fehler');
    } finally {
      setLoading(false);
    }
  };

  // Resume a prompt typed before signing in
  useEffect(() => {
    const pending = sessionStorage.getItem(PENDING_PROMPT_KEY);
    if (user && pending && !loading) { setPrompt(pending); run(pending); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const submit = () => {
    const text = prompt.trim();
    if (text.length < 5) { toast.error('Beschreibe deine Wunschreise in ein paar Worten.'); return; }
    if (!user) { sessionStorage.setItem(PENDING_PROMPT_KEY, text); setAuthOpen(true); return; }
    run(text);
  };

  return (
    <div className={cn('rounded-2xl border border-border bg-card/95 backdrop-blur p-3 shadow-elevated', className)}>
      <Textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Beschreibe deine Wunschreise – Ziel, Dauer, Budget, Interessen…"
        className={cn('border-0 bg-transparent resize-none text-base focus-visible:ring-0 shadow-none', compact ? 'min-h-[70px]' : 'min-h-[96px]')}
        disabled={loading}
        onKeyDown={(e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) submit(); }}
      />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 px-1">
        <div className="flex flex-wrap gap-1.5">
          {!compact && EXAMPLES.map((ex) => (
            <button key={ex} type="button" onClick={() => setPrompt(ex)} disabled={loading}
              className="text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors text-left">
              {ex.length > 42 ? ex.slice(0, 42) + '…' : ex}
            </button>
          ))}
        </div>
        <Button onClick={submit} disabled={loading} size="lg" className="shrink-0">
          {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Plane deine Reise…</> : <><Sparkles className="h-4 w-4 mr-2" />Reise erstellen<ArrowRight className="h-4 w-4 ml-1" /></>}
        </Button>
      </div>
      {loading && <p className="text-xs text-muted-foreground px-1 pt-2">Das dauert meist 20–40 Sekunden. Wir stellen Tagesplan, Unterkünfte, Transport und Budget zusammen.</p>}
      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} />
    </div>
  );
};
