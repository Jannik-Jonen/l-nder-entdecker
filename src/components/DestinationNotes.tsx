import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { supabaseUntyped } from '@/lib/supabase-untyped';
import { useAuth } from '@/hooks/useAuth';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { StickyNote, Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface DestinationNotesProps {
  /** The destination name to search for matching destination_id */
  destinationName: string;
}

export const DestinationNotes = ({ destinationName }: DestinationNotesProps) => {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [savedContent, setSavedContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [destinationId, setDestinationId] = useState<string | null>(null);

  // Find destination by name
  useEffect(() => {
    if (!destinationName) return;
    supabaseUntyped
      .from('destinations')
      .select('id')
      .ilike('name', destinationName)
      .limit(1)
      .maybeSingle()
      .then(({ data }: any) => {
        setDestinationId(data?.id || null);
      });
  }, [destinationName]);

  // Load notes
  const loadNotes = useCallback(async () => {
    if (!user || !destinationId) return;
    setLoading(true);
    try {
      const { data } = await supabaseUntyped
        .from('destination_notes')
        .select('content')
        .eq('user_id', user.id)
        .eq('destination_id', destinationId)
        .maybeSingle();
      const c = (data as any)?.content || '';
      setContent(c);
      setSavedContent(c);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }, [user, destinationId]);

  useEffect(() => { loadNotes(); }, [loadNotes]);

  const handleSave = async () => {
    if (!user || !destinationId) return;
    setSaving(true);
    try {
      // Upsert
      const { error } = await supabaseUntyped
        .from('destination_notes')
        .upsert(
          { user_id: user.id, destination_id: destinationId, content },
          { onConflict: 'user_id,destination_id' }
        );
      if (error) { toast.error('Notiz konnte nicht gespeichert werden'); return; }
      setSavedContent(content);
      toast.success('Notiz gespeichert');
    } finally { setSaving(false); }
  };

  if (!user) {
    return (
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 mb-3">
          <StickyNote className="h-5 w-5 text-primary" />
          <h3 className="font-display text-lg font-semibold">Notizen</h3>
        </div>
        <p className="text-sm text-muted-foreground">Melde dich an, um persönliche Notizen zu dieser Destination zu speichern.</p>
      </div>
    );
  }

  if (!destinationId) return null;

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <StickyNote className="h-5 w-5 text-primary" />
          <h3 className="font-display text-lg font-semibold">Meine Notizen</h3>
        </div>
        {content !== savedContent && (
          <Button size="sm" onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Save className="h-4 w-4 mr-1" />}
            Speichern
          </Button>
        )}
      </div>
      {loading ? (
        <div className="flex justify-center py-4"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
      ) : (
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Persönliche Notizen, Tipps oder Links zu dieser Destination…"
          className="min-h-[120px] resize-y"
        />
      )}
    </div>
  );
};
