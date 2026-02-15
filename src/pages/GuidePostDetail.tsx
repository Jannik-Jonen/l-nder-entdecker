import { Header } from '@/components/Header';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, MapPin, ArrowRight, Calendar, Wallet, Thermometer, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { supabaseUntyped } from '@/lib/supabase-untyped';
import { useAuth } from '@/hooks/useAuth';
import { getDestinationById } from '@/services/travelData';
import { Destination } from '@/types/travel';
import { BlogComments } from '@/components/BlogComments';
import { BookmarkButton } from '@/components/BookmarkButton';
import { DestinationNotes } from '@/components/DestinationNotes';

type GuidePostRow = {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  image_url: string;
  destination_id: string;
  tags?: string[];
  sources?: string[];
  status?: string;
  created_at?: string;
};

function extractHeadings(content: string): { id: string; text: string; level: number }[] {
  const lines = content.split('\n');
  const headings: { id: string; text: string; level: number }[] = [];
  for (const line of lines) {
    const match = line.match(/^(#{1,3})\s+(.+)/);
    if (match) {
      const text = match[2].trim();
      const id = text.toLowerCase().replace(/[^a-zäöü0-9]+/gi, '-').replace(/(^-|-$)/g, '');
      headings.push({ id, text, level: match[1].length });
    }
  }
  return headings;
}

function renderContentWithAnchors(content: string) {
  return content.split('\n').map((line, i) => {
    const match = line.match(/^(#{1,3})\s+(.+)/);
    if (match) {
      const text = match[2].trim();
      const id = text.toLowerCase().replace(/[^a-zäöü0-9]+/gi, '-').replace(/(^-|-$)/g, '');
      const Tag = (`h${match[1].length}` as keyof JSX.IntrinsicElements);
      return <Tag key={i} id={id} className="scroll-mt-20">{text}</Tag>;
    }
    return <p key={i}>{line}</p>;
  });
}

function estimateReadingTime(content?: string): number {
  if (!content) return 1;
  return Math.max(1, Math.ceil(content.trim().split(/\s+/).length / 200));
}

const GuidePostDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [post, setPost] = useState<GuidePostRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [destination, setDestination] = useState<Destination | null>(null);
  const [relatedGuides, setRelatedGuides] = useState<GuidePostRow[]>([]);
  const [readProgress, setReadProgress] = useState(0);

  // Reading progress
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setReadProgress(docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!user) { setIsAdmin(false); return; }
    supabase.rpc('has_role', { _user_id: user.id, _role: 'admin' }).then(({ data }) => setIsAdmin(!!data));
  }, [user]);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    supabaseUntyped.from('guide_posts').select('*').eq('id', id).maybeSingle()
      .then(({ data }: any) => { setPost(data || null); setLoading(false); });
  }, [id]);

  useEffect(() => {
    if (!post?.destination_id) { setDestination(null); return; }
    getDestinationById(post.destination_id).then(d => setDestination(d || null));
  }, [post?.destination_id]);

  // Load related guides
  useEffect(() => {
    if (!post || !id) return;
    supabaseUntyped
      .from('guide_posts')
      .select('id,title,excerpt,image_url,destination_id,tags')
      .eq('status', 'published')
      .neq('id', id)
      .limit(3)
      .order('created_at', { ascending: false })
      .then(({ data }: any) => {
        if (!data) { setRelatedGuides([]); return; }
        // Sort by tag overlap
        const postTags = new Set(post.tags || []);
        const scored = (data as GuidePostRow[]).map(g => ({
          ...g,
          score: (g.tags || []).filter(t => postTags.has(t)).length + (g.destination_id === post.destination_id ? 2 : 0),
        }));
        scored.sort((a, b) => b.score - a.score);
        setRelatedGuides(scored.slice(0, 3));
      });
  }, [post, id]);

  const headings = useMemo(() => post?.content ? extractHeadings(post.content) : [], [post?.content]);
  const readingTime = estimateReadingTime(post?.content);

  if (loading) {
    return <div className="min-h-screen bg-background"><Header /><main className="container py-20 text-center text-muted-foreground">Laden…</main></div>;
  }
  if (!post) {
    return <div className="min-h-screen bg-background"><Header /><main className="container py-20 text-center"><div className="text-muted-foreground">Beitrag nicht gefunden</div><Link to="/guides" className="mt-4 inline-block text-primary underline">Zur Übersicht</Link></main></div>;
  }
  if (post.status && post.status !== 'published' && !isAdmin) {
    return <div className="min-h-screen bg-background"><Header /><main className="container py-20 text-center"><div className="text-muted-foreground">Beitrag nicht veröffentlicht</div><Link to="/guides" className="mt-4 inline-block text-primary underline">Zur Übersicht</Link></main></div>;
  }

  const approve = async () => {
    if (!id) return;
    const { error } = await supabaseUntyped.from('guide_posts').update({ status: 'published' }).eq('id', id);
    if (!error) setPost(p => p ? { ...p, status: 'published' } : p);
  };
  const reject = async () => {
    if (!id) return;
    const { error } = await supabaseUntyped.from('guide_posts').update({ status: 'rejected' }).eq('id', id);
    if (!error) setPost(p => p ? { ...p, status: 'rejected' } : p);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Reading progress bar */}
      <div className="fixed top-0 left-0 right-0 h-1 z-50 bg-muted">
        <div className="h-full bg-primary transition-all duration-150" style={{ width: `${readProgress}%` }} />
      </div>

      <Header />
      <main className="container py-8">
        <Button variant="ghost" asChild className="mb-4 -ml-2 text-muted-foreground hover:text-foreground">
          <Link to="/guides"><ArrowLeft className="h-4 w-4 mr-2" /> Zurück zu den Guides</Link>
        </Button>

        {isAdmin && post.status && post.status !== 'published' && (
          <div className="mb-6 flex items-center gap-3">
            <span className="text-sm text-muted-foreground">Status: {post.status}</span>
            <Button variant="default" size="sm" onClick={approve}>Freigeben</Button>
            <Button variant="destructive" size="sm" onClick={reject}>Ablehnen</Button>
          </div>
        )}

        {/* Hero image */}
        <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden mb-8">
          <img src={post.image_url} alt={post.title} className="h-full w-full object-cover"
            onError={(e) => { (e.currentTarget as HTMLImageElement).src = 'https://via.placeholder.com/1200x600?text=Bild'; }} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="h-5 w-5" />
              <span className="text-sm font-medium uppercase tracking-wide opacity-80">Guide</span>
            </div>
            <h1 className="font-display text-3xl md:text-5xl font-bold">{post.title}</h1>
            <div className="flex items-center gap-4 mt-3 text-white/70 text-sm">
              {post.created_at && (
                <span>{new Date(post.created_at).toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              )}
              <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {readingTime} Min. Lesezeit</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex flex-wrap gap-2">
            {(post.tags || []).map(t => (
              <span key={t} className="text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground">{t}</span>
            ))}
          </div>
          <BookmarkButton postId={post.id} postType="guide" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8">
          {/* Main content */}
          <div>
            <article className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-lg text-muted-foreground">{post.excerpt}</p>
              {post.content && (
                <div className="mt-4">{renderContentWithAnchors(post.content)}</div>
              )}
              {post.sources && post.sources.length > 0 && (
                <div className="mt-8">
                  <h3>Quellen</h3>
                  <ul className="list-disc ml-5">
                    {post.sources.map(s => (
                      <li key={s}><a href={s} target="_blank" rel="noreferrer" className="text-primary underline">{s}</a></li>
                    ))}
                  </ul>
                </div>
              )}
            </article>

            {/* Destination notes */}
            {destination && (
              <div className="mt-8">
                <DestinationNotes destinationName={destination.name} />
              </div>
            )}

            {destination && (
              <div className="mt-8">
                <Button asChild className="gap-2">
                  <Link to={`/guides/${destination.id}`}>Zum Destination-Guide <ArrowRight className="h-4 w-4" /></Link>
                </Button>
              </div>
            )}

            <BlogComments postId={post.id} postType="guide" />

            {/* Related Guides */}
            {relatedGuides.length > 0 && (
              <div className="mt-12">
                <h3 className="font-display text-xl font-semibold mb-4">Ähnliche Guides</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {relatedGuides.map(g => (
                    <Link
                      key={g.id}
                      to={`/guides/posts/${g.id}`}
                      className="group rounded-xl overflow-hidden bg-card border border-border hover:shadow-card-hover transition-all"
                    >
                      <div className="relative h-32">
                        <img src={g.image_url} alt={g.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                          onError={(e) => { (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=800'; }} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      </div>
                      <div className="p-3">
                        <h4 className="font-display text-sm font-semibold line-clamp-2 group-hover:text-primary transition-colors">{g.title}</h4>
                        <p className="text-xs text-muted-foreground line-clamp-1 mt-1">{g.excerpt}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar: TOC + Fact Box */}
          <aside className="space-y-6">
            {/* Table of Contents */}
            {headings.length > 0 && (
              <div className="rounded-xl border border-border bg-card p-4 sticky top-4">
                <h4 className="font-display text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">Inhaltsverzeichnis</h4>
                <nav className="space-y-1.5">
                  {headings.map(h => (
                    <a
                      key={h.id}
                      href={`#${h.id}`}
                      className={`block text-sm hover:text-primary transition-colors ${h.level === 1 ? 'font-medium text-foreground' : h.level === 2 ? 'pl-3 text-muted-foreground' : 'pl-6 text-muted-foreground text-xs'}`}
                    >
                      {h.text}
                    </a>
                  ))}
                </nav>
              </div>
            )}

            {/* Fact Box */}
            {destination && (
              <div className="rounded-xl border border-border bg-card p-4">
                <h4 className="font-display text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">Fakten</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="h-4 w-4 text-primary shrink-0" />
                    <div>
                      <div className="text-muted-foreground text-xs">Destination</div>
                      <div className="font-medium">{destination.name}, {destination.country}</div>
                    </div>
                  </div>
                  {destination.bestSeason && (
                    <div className="flex items-center gap-3 text-sm">
                      <Calendar className="h-4 w-4 text-primary shrink-0" />
                      <div>
                        <div className="text-muted-foreground text-xs">Beste Reisezeit</div>
                        <div className="font-medium">{destination.bestSeason}</div>
                      </div>
                    </div>
                  )}
                  {destination.averageDailyCost && (
                    <div className="flex items-center gap-3 text-sm">
                      <Wallet className="h-4 w-4 text-primary shrink-0" />
                      <div>
                        <div className="text-muted-foreground text-xs">Ø Tagesbudget</div>
                        <div className="font-medium">{destination.averageDailyCost} {destination.currency}/Tag</div>
                      </div>
                    </div>
                  )}
                  {destination.visaInfo && (
                    <div className="flex items-center gap-3 text-sm">
                      <Thermometer className="h-4 w-4 text-primary shrink-0" />
                      <div>
                        <div className="text-muted-foreground text-xs">Visum</div>
                        <div className="font-medium">{destination.visaInfo}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </aside>
        </div>
      </main>
    </div>
  );
};

export default GuidePostDetail;
