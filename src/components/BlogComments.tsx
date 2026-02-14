import { useState, useEffect } from 'react';
import { supabaseUntyped } from '@/lib/supabase-untyped';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MessageCircle, Clock, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

type Comment = {
  id: string;
  content: string;
  user_id: string;
  status: string;
  created_at: string;
  profile?: { display_name: string | null };
};

interface BlogCommentsProps {
  postId: string;
  postType: 'blog' | 'guide';
}

export const BlogComments = ({ postId, postType }: BlogCommentsProps) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [pendingComments, setPendingComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadComments = async () => {
    // Load approved comments
    const { data } = await supabaseUntyped
      .from('blog_comments')
      .select('*')
      .eq('post_id', postId)
      .eq('post_type', postType)
      .eq('status', 'approved')
      .order('created_at', { ascending: true });
    
    const approved = (data || []) as unknown as Comment[];

    // Load display names for comments
    const userIds = [...new Set(approved.map(c => c.user_id))];
    if (userIds.length > 0) {
      const { data: profiles } = await supabaseUntyped
        .from('profiles')
        .select('user_id, display_name')
        .in('user_id', userIds);
      const profileMap = new Map((profiles || []).map((p: any) => [p.user_id, p.display_name]));
      approved.forEach(c => {
        c.profile = { display_name: profileMap.get(c.user_id) || 'Anonym' };
      });
    }

    setComments(approved);

    // Load own pending comments
    if (user) {
      const { data: pending } = await supabaseUntyped
        .from('blog_comments')
        .select('*')
        .eq('post_id', postId)
        .eq('post_type', postType)
        .eq('user_id', user.id)
        .eq('status', 'pending')
        .order('created_at', { ascending: true });
      setPendingComments((pending || []) as unknown as Comment[]);
    }
  };

  useEffect(() => {
    loadComments();
  }, [postId, postType, user]);

  const handleSubmit = async () => {
    if (!user || !newComment.trim()) return;
    setSubmitting(true);
    const { error } = await supabaseUntyped.from('blog_comments').insert({
      post_id: postId,
      post_type: postType,
      user_id: user.id,
      content: newComment.trim(),
    });
    if (error) {
      toast({ title: 'Fehler', description: 'Kommentar konnte nicht gesendet werden.', variant: 'destructive' });
    } else {
      toast({ title: 'Kommentar eingereicht', description: 'Dein Kommentar wird nach Prüfung durch einen Admin veröffentlicht.' });
      setNewComment('');
      loadComments();
    }
    setSubmitting(false);
  };

  const handleDelete = async (commentId: string) => {
    await supabaseUntyped.from('blog_comments').delete().eq('id', commentId);
    loadComments();
  };

  return (
    <div className="mt-10">
      <h3 className="font-display text-xl font-semibold flex items-center gap-2 mb-4">
        <MessageCircle className="h-5 w-5" />
        Kommentare ({comments.length})
      </h3>

      {comments.length === 0 && pendingComments.length === 0 && (
        <p className="text-sm text-muted-foreground mb-4">Noch keine Kommentare. Sei der Erste!</p>
      )}

      <div className="space-y-4 mb-6">
        {comments.map(c => (
          <div key={c.id} className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">{c.profile?.display_name || 'Anonym'}</span>
              <span className="text-xs text-muted-foreground">
                {new Date(c.created_at).toLocaleDateString('de-DE')}
              </span>
            </div>
            <p className="text-sm text-foreground">{c.content}</p>
            {user && c.user_id === user.id && (
              <Button variant="ghost" size="sm" className="mt-2 text-destructive" onClick={() => handleDelete(c.id)}>
                <Trash2 className="h-3 w-3 mr-1" /> Löschen
              </Button>
            )}
          </div>
        ))}

        {pendingComments.map(c => (
          <div key={c.id} className="rounded-lg border border-border bg-muted/50 p-4 opacity-70">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Warte auf Freigabe</span>
            </div>
            <p className="text-sm text-foreground">{c.content}</p>
            <Button variant="ghost" size="sm" className="mt-2 text-destructive" onClick={() => handleDelete(c.id)}>
              <Trash2 className="h-3 w-3 mr-1" /> Zurückziehen
            </Button>
          </div>
        ))}
      </div>

      {user ? (
        <div className="space-y-3">
          <Textarea
            placeholder="Schreibe einen Kommentar…"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            maxLength={1000}
            rows={3}
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{newComment.length}/1000 Zeichen</span>
            <Button onClick={handleSubmit} disabled={submitting || !newComment.trim()} size="sm">
              {submitting ? 'Senden…' : 'Kommentar senden'}
            </Button>
          </div>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          <a href="/?login=1" className="text-primary underline">Melde dich an</a>, um zu kommentieren.
        </p>
      )}
    </div>
  );
};
