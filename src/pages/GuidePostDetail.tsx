import { Header } from '@/components/Header';
import { guidePosts } from '@/data/mockData';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, MapPin, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { supabaseUntyped } from '@/lib/supabase-untyped';
import { useAuth } from '@/hooks/useAuth';
import { getDestinationById } from '@/services/travelData';

const GuidePostDetail = () => {
  const { id } = useParams();
  const fallback = guidePosts.find((p) => p.id === id);
  const { user } = useAuth();
  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || "jannik.jonen@gmail.com";
  const isAdmin = !!user && !!adminEmail && user.email === adminEmail;
  type GuidePostRow = {
    id: string;
    title: string;
    excerpt: string;
    content?: string;
    image_url: string;
    destination_id: string;
    tags?: string[];
    sources?: string[];
    status?: 'draft' | 'pending_review' | 'published' | 'rejected';
  };
  const [post, setPost] = useState<GuidePostRow | null>(fallback ? {
    id: fallback.id,
    title: fallback.title,
    excerpt: fallback.excerpt,
    image_url: fallback.imageUrl,
    destination_id: fallback.destinationId,
    tags: fallback.tags,
    sources: [],
  } : null);
  const [loading, setLoading] = useState(!fallback);
  const [destination, setDestination] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const { data } = await supabaseUntyped
          .from('guide_posts')
          .select('*')
          .eq('id', id)
          .eq('status', 'published')
          .maybeSingle();
        if (data) {
          setPost(data as unknown as GuidePostRow);
        }
      } finally {
        setLoading(false);
      }
    };
    if (!fallback) load();
  }, [id, fallback]);

  useEffect(() => {
    const loadDestination = async () => {
      if (!post?.destination_id) {
        setDestination(null);
        return;
      }
      const dest = await getDestinationById(post.destination_id);
      setDestination(dest ? { id: dest.id, name: dest.name } : null);
    };
    loadDestination();
  }, [post?.destination_id]);
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-20 text-center">
          <div className="text-muted-foreground">Laden…</div>
        </main>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-20 text-center">
          <div className="text-muted-foreground">Beitrag nicht gefunden</div>
          <Link to="/guides" className="mt-4 inline-block text-primary underline">
            Zur Übersicht
          </Link>
        </main>
      </div>
    );
  }

  if (post.status && post.status !== 'published' && !isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-20 text-center">
          <div className="text-muted-foreground">Beitrag nicht veröffentlicht</div>
          <Link to="/guides" className="mt-4 inline-block text-primary underline">Zur Übersicht</Link>
        </main>
      </div>
    );
  }

  const approve = async () => {
    if (!id) return;
    const { error } = await supabaseUntyped.from('guide_posts').update({ status: 'published' }).eq('id', id);
    if (!error) setPost((p) => (p ? { ...p, status: 'published' } : p));
  };
  const reject = async () => {
    if (!id) return;
    const { error } = await supabaseUntyped.from('guide_posts').update({ status: 'rejected' }).eq('id', id);
    if (!error) setPost((p) => (p ? { ...p, status: 'rejected' } : p));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        <Button variant="ghost" asChild className="mb-4 -ml-2 text-muted-foreground hover:text-foreground">
          <Link to="/guides">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Zurück zu den Guides
          </Link>
        </Button>
        {isAdmin && post.status && post.status !== 'published' && (
          <div className="mb-6 flex items-center gap-3">
            <span className="text-sm text-muted-foreground">Status: {post.status}</span>
            <Button variant="default" size="sm" onClick={approve}>Freigeben</Button>
            <Button variant="destructive" size="sm" onClick={reject}>Ablehnen</Button>
          </div>
        )}

        <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden mb-8">
          <img
            src={post.image_url}
            alt={post.title}
            className="h-full w-full object-cover"
            onError={(e) => { (e.currentTarget as HTMLImageElement).src = 'https://via.placeholder.com/1200x600?text=Bild+nicht+verfügbar'; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="h-5 w-5" />
              <span className="text-sm font-medium uppercase tracking-wide opacity-80">Beitrag</span>
            </div>
            <h1 className="font-display text-3xl md:text-5xl font-bold">{post.title}</h1>
          </div>
        </div>

        <article className="prose prose-slate dark:prose-invert max-w-none">
          <p className="text-muted-foreground">{post.excerpt}</p>
          {post.content && <div className="mt-4 whitespace-pre-wrap">{post.content}</div>}
          <p>
            Dieser Beitrag ist mit dem Guide verknüpft:
            {destination ? (
              <span className="inline-flex items-center gap-2 ml-2">
                <MapPin className="h-4 w-4 text-primary" />
                <Link to={`/guides/${destination.id}`} className="text-primary underline hover:text-primary/80">
                  {destination.name}
                </Link>
              </span>
            ) : (
              <span className="ml-2 text-muted-foreground">Keine verknüpfte Destination</span>
            )}
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {(post.tags || []).map((t) => (
              <span key={t} className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">{t}</span>
            ))}
          </div>
          {(post.sources && post.sources.length > 0) && (
            <div className="mt-8">
              <h3>Quellen</h3>
              <ul className="list-disc ml-5">
                {post.sources.map((s) => (
                  <li key={s}><a href={s} target="_blank" rel="noreferrer" className="text-primary underline">{s}</a></li>
                ))}
              </ul>
            </div>
          )}
        </article>

        {destination && (
          <div className="mt-8">
            <Button asChild className="gap-2">
              <Link to={`/guides/${destination.id}`}>
                Zum Guide <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default GuidePostDetail;
