import { useState } from 'react';
import { Header } from '@/components/Header';
import { travelTips } from '@/data/mockData';
import { TravelTip, tipCategoryLabels, tipCategoryIcons } from '@/types/travel';
import { Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';

const Tipps = () => {
  const [selectedCategory, setSelectedCategory] = useState<TravelTip['category'] | 'all'>('all');

  const filteredTips = selectedCategory === 'all'
    ? travelTips
    : travelTips.filter((t) => t.category === selectedCategory);

  const categories: Array<TravelTip['category'] | 'all'> = ['all', 'packing', 'budget', 'health', 'safety', 'culture', 'transport'];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8">
        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-2xl gradient-hero p-8 md:p-12 text-primary-foreground mb-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-foreground/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="h-6 w-6" />
              <span className="text-sm font-medium uppercase tracking-wide opacity-80">Wissen</span>
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">Reisetipps & Tricks</h1>
            <p className="text-primary-foreground/80 text-lg max-w-2xl">
              Praktische Ratschläge von erfahrenen Reisenden für dein nächstes Abenteuer
            </p>
          </div>
        </section>

        {/* Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all",
                selectedCategory === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              <span>{cat === 'all' ? '🌍' : tipCategoryIcons[cat]}</span>
              {cat === 'all' ? 'Alle Tipps' : tipCategoryLabels[cat]}
            </button>
          ))}
        </div>

        {/* Tips Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredTips.map((tip, index) => (
            <div
              key={tip.id}
              className="group rounded-xl bg-card p-6 shadow-card hover:shadow-card-hover transition-all duration-300 animate-fade-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-2xl">
                  {tip.icon}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium uppercase tracking-wide text-primary">
                      {tipCategoryLabels[tip.category]}
                    </span>
                  </div>
                  <h3 className="font-display text-lg font-semibold group-hover:text-primary transition-colors">
                    {tip.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {tip.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional tips section */}
        <section className="mt-16">
          <h2 className="font-display text-2xl font-semibold mb-6 flex items-center gap-2">
            <span className="text-2xl">📋</span>
            Packlisten-Essentials
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-xl bg-card p-6 shadow-card">
              <h3 className="font-medium mb-4 flex items-center gap-2">
                <span className="text-xl">🎒</span>
                Handgepäck
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Reisepass & Dokumente</li>
                <li>• Handy & Ladegerät</li>
                <li>• Kopfhörer</li>
                <li>• Wasserflasche (leer)</li>
                <li>• Snacks</li>
                <li>• Reisekissen</li>
              </ul>
            </div>
            <div className="rounded-xl bg-card p-6 shadow-card">
              <h3 className="font-medium mb-4 flex items-center gap-2">
                <span className="text-xl">🏥</span>
                Reiseapotheke
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Schmerzmittel</li>
                <li>• Durchfallmedikament</li>
                <li>• Pflaster & Verband</li>
                <li>• Sonnencreme</li>
                <li>• Insektenschutz</li>
                <li>• Persönliche Medikamente</li>
              </ul>
            </div>
            <div className="rounded-xl bg-card p-6 shadow-card">
              <h3 className="font-medium mb-4 flex items-center gap-2">
                <span className="text-xl">📱</span>
                Digitale Essentials
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Offline-Karten</li>
                <li>• Übersetzungs-App</li>
                <li>• Buchungs-Bestätigungen</li>
                <li>• Notfall-Kontakte</li>
                <li>• Dokumenten-Kopien (Cloud)</li>
                <li>• Kreditkarten-Sperrnummern</li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border mt-16 py-8">
        <div className="container text-center text-sm text-muted-foreground">
          <p>GlobeDetour – Dein Begleiter für unvergessliche Reisen</p>
        </div>
      </footer>
    </div>
  );
};

export default Tipps;
