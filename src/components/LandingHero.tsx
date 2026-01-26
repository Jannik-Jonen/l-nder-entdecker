import { useState } from 'react';
import { Compass, MapPin, Calendar, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AuthDialog } from '@/components/AuthDialog';

export const LandingHero = () => {
  const [authDialogOpen, setAuthDialogOpen] = useState(false);

  return (
    <>
      <section className="relative py-20 md:py-32 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />
        </div>

        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Compass className="h-4 w-4" />
              Dein Reisebegleiter
            </div>

            <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight">
              Plane deine{' '}
              <span className="text-primary">Traumreise</span>{' '}
              mit Leichtigkeit
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              GlobeDetour hilft dir, deine Reisen perfekt zu organisieren. 
              Von der Inspiration bis zur Packliste – alles an einem Ort.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
                className="text-lg px-8"
                asChild
              >
                <a href="/inspiration">Inspiration entdecken</a>
              </Button>
            </div>
          </div>

          {/* Feature highlights */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-card border border-border/50">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-lg mb-2">Reiseziele verwalten</h3>
              <p className="text-sm text-muted-foreground">
                Plane mehrere Destinationen und behalte den Überblick über all deine Abenteuer.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-card border border-border/50">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-lg mb-2">Checklisten & To-dos</h3>
              <p className="text-sm text-muted-foreground">
                Vergiss nie wieder etwas Wichtiges mit unseren smarten Checklisten.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-card border border-border/50">
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
