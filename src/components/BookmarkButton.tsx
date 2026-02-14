import { useState, useEffect } from 'react';
import { supabaseUntyped } from '@/lib/supabase-untyped';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface BookmarkButtonProps {
  postId: string;
  postType: 'blog' | 'guide';
}

export const BookmarkButton = ({ postId, postType }: BookmarkButtonProps) => {
  const { user } = useAuth();
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabaseUntyped
      .from('blog_bookmarks')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', user.id)
      .maybeSingle()
      .then(({ data }: any) => setBookmarked(!!data));
  }, [user, postId]);

  const toggle = async () => {
    if (!user) {
      toast({ title: 'Bitte anmelden', description: 'Lesezeichen erfordern eine Anmeldung.' });
      return;
    }
    if (bookmarked) {
      await supabaseUntyped.from('blog_bookmarks').delete().eq('post_id', postId).eq('user_id', user.id);
      setBookmarked(false);
    } else {
      await supabaseUntyped.from('blog_bookmarks').insert({ post_id: postId, post_type: postType, user_id: user.id });
      setBookmarked(true);
    }
  };

  return (
    <Button variant="ghost" size="sm" onClick={toggle} className="gap-1.5">
      {bookmarked ? <BookmarkCheck className="h-4 w-4 text-primary" /> : <Bookmark className="h-4 w-4" />}
      {bookmarked ? 'Gespeichert' : 'Merken'}
    </Button>
  );
};
