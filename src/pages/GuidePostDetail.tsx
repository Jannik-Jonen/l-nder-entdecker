import { Header } from '@/components/Header';
import { guidePosts, inspirationDestinations } from '@/data/mockData';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, MapPin, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const GuidePostDetail = () => {
  const { id } = useParams();
  const post = guidePosts.find((p) => p.id === id);

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

  const destination = inspirationDestinations.find((d) => d.id === post.destinationId);

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

        <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden mb-8">
          <img
            src={post.imageUrl}
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
            {post.tags.map((t) => (
              <span key={t} className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">{t}</span>
            ))}
          </div>
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
