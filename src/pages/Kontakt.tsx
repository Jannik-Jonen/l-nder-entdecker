import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Mail, MessageCircle, Instagram } from 'lucide-react';

const Kontakt = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container py-16 max-w-3xl">
        <p className="text-sm font-medium text-primary uppercase tracking-wider mb-3">Kontakt</p>
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">Sag Hallo.</h1>
        <p className="text-lg text-muted-foreground mb-12 max-w-2xl">
          Feedback, Reisegeschichten, Kooperationen oder eine Idee für ein Feature — wir freuen uns
          über jede Nachricht.
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          <a
            href="mailto:hallo@globedetour.app"
            className="group flex items-start gap-4 p-6 rounded-2xl border border-border bg-card hover:border-primary/40 hover:shadow-card-hover transition-all"
          >
            <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-lg mb-1">E-Mail</h3>
              <p className="text-sm text-muted-foreground">hallo@globedetour.app</p>
            </div>
          </a>

          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-start gap-4 p-6 rounded-2xl border border-border bg-card hover:border-primary/40 hover:shadow-card-hover transition-all"
          >
            <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <Instagram className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-lg mb-1">Instagram</h3>
              <p className="text-sm text-muted-foreground">@globedetour</p>
            </div>
          </a>

          <div className="sm:col-span-2 flex items-start gap-4 p-6 rounded-2xl border border-dashed border-border bg-muted/30">
            <div className="h-11 w-11 rounded-xl bg-muted flex items-center justify-center">
              <MessageCircle className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-lg mb-1">Antwortzeit</h3>
              <p className="text-sm text-muted-foreground">
                Wir melden uns in der Regel innerhalb von 1–3 Werktagen bei dir.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Kontakt;
