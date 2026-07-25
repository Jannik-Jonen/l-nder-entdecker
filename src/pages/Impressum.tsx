import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const Impressum = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container py-16 max-w-3xl">
        <h1 className="font-display text-4xl font-bold mb-8">Impressum</h1>

        <div className="prose prose-slate max-w-none space-y-6 text-foreground/90">
          <section>
            <h2 className="font-display text-xl font-semibold mb-2">Angaben gemäß § 5 TMG</h2>
            <p className="text-muted-foreground">
              GlobeDetour
              <br />
              [Vor- und Nachname des Betreibers]
              <br />
              [Straße Nr.]
              <br />
              [PLZ Ort]
              <br />
              Deutschland
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold mb-2">Kontakt</h2>
            <p className="text-muted-foreground">
              E-Mail: hallo@globedetour.app
              <br />
              Telefon: [optional]
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold mb-2">
              Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV
            </h2>
            <p className="text-muted-foreground">
              [Vor- und Nachname]
              <br />
              [Adresse wie oben]
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold mb-2">Haftungsausschluss</h2>
            <p className="text-muted-foreground">
              Die Inhalte dieser Website wurden mit größter Sorgfalt erstellt. Für die Richtigkeit,
              Vollständigkeit und Aktualität der Inhalte kann jedoch keine Gewähr übernommen werden.
              Reiseinformationen, Visa-Hinweise und Preise können sich ändern — bitte prüfe alle
              Angaben vor deiner Reise bei offiziellen Stellen.
            </p>
          </section>

          <p className="text-sm text-muted-foreground italic pt-4 border-t border-border">
            Bitte ersetze die Platzhalter durch deine echten Kontaktdaten, bevor die Seite live geht.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Impressum;
