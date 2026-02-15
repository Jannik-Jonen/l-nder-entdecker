import { Header } from '@/components/Header';
import { Link, useSearchParams } from 'react-router-dom';
import { BookOpen, ArrowRight, ArrowLeft, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState, useMemo } from 'react';
import { supabaseUntyped } from '@/lib/supabase-untyped';
import { useAuth } from '@/hooks/useAuth';
import { BlogComments } from '@/components/BlogComments';
import { BookmarkButton } from '@/components/BookmarkButton';

type BlogPostRow = {
  id: string;
  title: string;
  excerpt: string;
  image_url: string;
  tags?: string[];
  sources?: string[];
  content?: string;
  created_at?: string;
};

const Blog = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const postId = searchParams.get('post');
  const [posts, setPosts] = useState<BlogPostRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [activePost, setActivePost] = useState<BlogPostRow | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { data } = await supabaseUntyped
        .from('blog_posts')
        .select('id,title,excerpt,image_url,tags,sources,created_at')
        .eq('status', 'published')
        .order('created_at', { ascending: false });
      setPosts((data || []) as unknown as BlogPostRow[]);
      setLoading(false);
    };
    load();
  }, []);

  useEffect(() => {
    if (!postId) { setActivePost(null); return; }
    setLoadingDetail(true);
    supabaseUntyped
      .from('blog_posts')
      .select('*')
      .eq('id', postId)
      .eq('status', 'published')
      .maybeSingle()
      .then(({ data }: any) => {
        setActivePost(data || null);
        setLoadingDetail(false);
      });
  }, [postId]);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    posts.forEach(p => (p.tags || []).forEach(t => tags.add(t)));
    return Array.from(tags).sort();
  }, [posts]);

  const filteredPosts = useMemo(() => {
    let result = posts;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.excerpt?.toLowerCase().includes(q) ||
        (p.tags || []).some(t => t.toLowerCase().includes(q))
      );
    }
    if (selectedTag) {
      result = result.filter(p => (p.tags || []).includes(selectedTag));
    }
    return result;
  }, [posts, searchQuery, selectedTag]);

  // Detail view
  if (postId) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-8 max-w-3xl">
          <Button variant="ghost" asChild className="mb-4 -ml-2 text-muted-foreground hover:text-foreground">
            <Link to="/blog"><ArrowLeft className="h-4 w-4 mr-2" /> Zurück zum Blog</Link>
          </Button>

          {loadingDetail && <div className="text-muted-foreground text-center py-12">Lade Beitrag…</div>}
          {!loadingDetail && !activePost && <div className="text-muted-foreground text-center py-12">Beitrag nicht gefunden.</div>}

          {!loadingDetail && activePost && (
            <>
              <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden mb-6">
                <img src={activePost.image_url} alt={activePost.title} className="h-full w-full object-cover"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).src = 'https://via.placeholder.com/1200x600?text=Bild'; }} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <h1 className="font-display text-3xl md:text-4xl font-bold">{activePost.title}</h1>
                  {activePost.created_at && (
                    <p className="text-white/70 text-sm mt-2">
                      {new Date(activePost.created_at).toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between mb-6">
                <div className="flex flex-wrap gap-2">
                  {(activePost.tags || []).map(t => (
                    <span key={t} className="text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground">{t}</span>
                  ))}
                </div>
                <BookmarkButton postId={activePost.id} postType="blog" />
              </div>

              <article className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-lg text-muted-foreground">{activePost.excerpt}</p>
                {activePost.content && <div className="mt-4 whitespace-pre-wrap">{activePost.content}</div>}
                {activePost.sources && activePost.sources.length > 0 && (
                  <div className="mt-8">
                    <h3>Quellen</h3>
                    <ul className="list-disc ml-5">
                      {activePost.sources.map(s => (
                        <li key={s}><a href={s} target="_blank" rel="noreferrer" className="text-primary underline">{s}</a></li>
                      ))}
                    </ul>
                  </div>
                )}
              </article>

              <BlogComments postId={activePost.id} postType="blog" />
            </>
          )}
        </main>
      </div>
    );
  }

  // List view
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        {/* Hero */}
        <section className="relative overflow-hidden rounded-2xl gradient-hero p-8 md:p-12 text-primary-foreground mb-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-foreground/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="h-6 w-6" />
              <span className="text-sm font-medium uppercase tracking-wide opacity-80">Community Blog</span>
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">Reiseblog</h1>
            <p className="text-primary-foreground/80 text-lg max-w-2xl">
              Erfahrungsberichte, Tipps und Geschichten aus der Community – lies, kommentiere und speichere deine Favoriten.
            </p>
          </div>
        </section>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Artikel durchsuchen…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          {user ? (
            <Button variant="outline" asChild>
              <Link to="/blog/create">Artikel schreiben</Link>
            </Button>
          ) : (
            <Button variant="outline" asChild>
              <Link to="/?login=1">Anmelden zum Schreiben</Link>
            </Button>
          )}
        </div>

        {/* Tags filter */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setSelectedTag(null)}
              className={`text-xs px-3 py-1.5 rounded-full transition-colors ${!selectedTag ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'}`}
            >
              Alle
            </button>
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                className={`text-xs px-3 py-1.5 rounded-full transition-colors ${selectedTag === tag ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'}`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}

        {/* Results */}
        {(searchQuery || selectedTag) && (
          <p className="text-sm text-muted-foreground mb-4">
            {filteredPosts.length} {filteredPosts.length === 1 ? 'Artikel' : 'Artikel'} gefunden
            {selectedTag && <> zum Thema <Badge variant="secondary" className="ml-1">{selectedTag}</Badge></>}
          </p>
        )}

        {loading && <div className="text-muted-foreground text-center py-12">Lade Artikel…</div>}

        {!loading && filteredPosts.length === 0 && (
          <div className="rounded-xl border border-border bg-card p-8 text-center text-muted-foreground">
            {searchQuery || selectedTag ? 'Keine Artikel zu deiner Suche gefunden.' : 'Noch keine Artikel vorhanden.'}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map(p => (
            <Link
              key={p.id}
              to={`/blog?post=${p.id}`}
              className="group relative overflow-hidden rounded-xl bg-card border border-border hover:shadow-card-hover transition-all"
            >
              <div className="relative h-48">
                <img src={p.image_url} alt={p.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).src = 'https://via.placeholder.com/800x480?text=Bild'; }} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="font-display text-xl font-semibold text-white">{p.title}</h3>
                  <p className="text-white/80 text-sm line-clamp-2 mt-1">{p.excerpt}</p>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  {p.created_at && (
                    <span className="text-xs text-muted-foreground">
                      {new Date(p.created_at).toLocaleDateString('de-DE')}
                    </span>
                  )}
                  <span className="text-sm font-medium text-primary flex items-center gap-1">
                    Lesen <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
                {p.tags && p.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {p.tags.slice(0, 3).map(t => (
                      <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{t}</span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Blog;
