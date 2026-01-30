import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Compass, MapPin, Calendar, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AuthDialog } from '@/components/AuthDialog';
import heroImage from '@/assets/hero-travel.jpg';

export const LandingHero = () => {
  const [authDialogOpen, setAuthDialogOpen] = useState(false);

  return (
    <>
      {/* Hero Section with Image */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Traumhafte Küstenstraße"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background from-30% via-background/60 to-transparent" />
        </div>

        <div className="container py-20 relative z-10">
          <div className="max-w-2xl space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 backdrop-blur-sm text-primary text-sm font-medium border border-primary/30">
              <Compass className="h-4 w-4" />
              Dein Reisebegleiter
            </div>

            <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight">
              Plane deine{' '}
              <span className="text-primary">Traumreise</span>{' '}
              mit Leichtigkeit
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-xl">
              GlobeDetour hilft dir, deine Reisen perfekt zu organisieren. 
              Von der Inspiration bis zur Packliste – alles an einem Ort.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="text-lg px-8"
                onClick={() => setAuthDialogOpen(true)}
              >
                Kostenlos starten
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-8 bg-background/50 backdrop-blur-sm"
              >
                <Link to="/inspiration">Inspiration entdecken</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Feature highlights */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-card border border-border/50 hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-lg mb-2">Reiseziele verwalten</h3>
              <p className="text-sm text-muted-foreground">
                Plane mehrere Destinationen und behalte den Überblick über all deine Abenteuer.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-card border border-border/50 hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-lg mb-2">Checklisten & To-dos</h3>
              <p className="text-sm text-muted-foreground">
                Vergiss nie wieder etwas Wichtiges mit unseren smarten Checklisten.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-card border border-border/50 hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-lg mb-2">Reisekalender</h3>
              <p className="text-sm text-muted-foreground">
                Behalte Start- und Enddaten im Blick mit dem integrierten Countdown.
              </p>
            </div>
          </div>
        </div>
      </section>

      <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />
    </>
  );
};
