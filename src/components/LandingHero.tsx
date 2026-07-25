import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Compass, MapPin, Calendar, CheckCircle, Sparkles, ArrowRight, Globe2, Route } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AuthDialog } from '@/components/AuthDialog';
import heroImage from '@/assets/hero-travel.jpg';

const stats = [
  { value: '150+', label: 'Länder im Katalog' },
  { value: '10-Step', label: 'KI-Weltreise-Wizard' },
  { value: '100%', label: 'Kostenlos starten' },
];

const features = [
  {
    icon: Route,
    title: 'KI-Routenplaner',
    description:
      'Erzähle uns von deinen Träumen — unser Planer entwirft eine geografisch sinnvolle Route mit Budget, Transport und Geheimtipps.',
  },
  {
    icon: MapPin,
    title: 'Ziele & Guides',
    description:
      'Kuratierte Orts-Guides, Community-Blogposts und Insider-Tipps für jede Destination auf deiner Karte.',
  },
  {
    icon: CheckCircle,
    title: 'Checklisten & Packlisten',
    description:
      'Smarte To-dos, Visa-Hinweise und Packlisten pro Reise — nie wieder Chaos zwei Tage vor Abflug.',
  },
  {
    icon: Calendar,
    title: 'Reisekalender',
    description:
      'Countdown, Start- und Enddaten, alle Stopps auf einen Blick. Deine Reise, dein Rhythmus.',
  },
];

export const LandingHero = () => {
  const [authDialogOpen, setAuthDialogOpen] = useState(false);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Traumhafte Küstenstraße bei Sonnenuntergang"
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/20 dark:from-background dark:via-background/90 dark:to-background/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>

        <div className="container relative z-10 py-24 md:py-32">
          <div className="max-w-2xl space-y-8 animate-fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20 backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5" />
              KI-gestützte Reiseplanung
            </div>

            <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight leading-[1.05]">
              Die Welt planen.
              <br />
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Ohne Kompromisse.
              </span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed">
              Von der ersten Idee bis zur Packliste am Vorabend: GlobeDetour bündelt Inspiration,
              Routen, Guides und Checklisten an einem Ort — für Reisende jeden Alters.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                size="lg"
                className="text-base px-8 h-12 shadow-elevated"
                onClick={() => setAuthDialogOpen(true)}
              >
                Kostenlos starten
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-base px-8 h-12 bg-background/60 backdrop-blur-sm"
                asChild
              >
                <Link to="/planner">
                  <Globe2 className="mr-1.5 h-4 w-4" />
                  Weltreise planen
                </Link>
              </Button>
            </div>

            <div className="flex flex-wrap gap-8 pt-6 border-t border-border/50">
              {stats.map((s) => (
                <div key={s.label}>
                  <div className="font-display text-2xl md:text-3xl font-bold text-foreground">
                    {s.value}
                  </div>
                  <div className="text-xs md:text-sm text-muted-foreground mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Feature grid */}
      <section className="py-20 border-t border-border/50">
        <div className="container">
          <div className="max-w-2xl mb-14">
            <p className="text-sm font-medium text-primary uppercase tracking-wider mb-3">
              Was GlobeDetour kann
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight">
              Alles, was zwischen Fernweh und Rückflug passiert.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="group relative p-6 rounded-2xl bg-card border border-border/60 hover:border-primary/40 hover:shadow-card-hover transition-all"
                >
                  <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-5 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-display font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />
    </>
  );
};
