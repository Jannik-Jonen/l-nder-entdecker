import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const Datenschutz = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container py-16 max-w-3xl">
        <h1 className="font-display text-4xl font-bold mb-8">Datenschutzerklärung</h1>

        <div className="space-y-6 text-foreground/90">
          <section>
            <h2 className="font-display text-xl font-semibold mb-2">1. Verantwortlicher</h2>
            <p className="text-muted-foreground">
              Verantwortlich für die Datenverarbeitung auf dieser Website ist der im Impressum
              genannte Betreiber.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold mb-2">2. Erhobene Daten</h2>
            <p className="text-muted-foreground">
              Bei der Registrierung speichern wir deine E-Mail-Adresse und optional deinen
              Anzeigenamen. Beim Speichern von Reisen legen wir deine Reiseeingaben (Ziele, Daten,
              Budget, Notizen) in unserer Datenbank ab, damit du sie später wieder abrufen kannst.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold mb-2">3. Server-Logs</h2>
            <p className="text-muted-foreground">
              Unser Hosting-Anbieter erhebt technisch notwendige Zugriffsdaten (IP-Adresse, Zeitpunkt,
              User-Agent). Diese werden ausschließlich zur Bereitstellung und Absicherung des Dienstes
              genutzt.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold mb-2">4. Deine Rechte</h2>
            <p className="text-muted-foreground">
              Du hast jederzeit das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung und
              Datenübertragbarkeit deiner personenbezogenen Daten. Wende dich dafür einfach per
              E-Mail an uns.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold mb-2">5. Externe Dienste</h2>
            <p className="text-muted-foreground">
              Für Karten- und Suchfunktionen nutzen wir öffentliche Dienste (z.&nbsp;B. OpenStreetMap
              / Nominatim). Beim Laden werden dabei technische Verbindungsdaten an diese Anbieter
              übertragen.
            </p>
          </section>

          <p className="text-sm text-muted-foreground italic pt-4 border-t border-border">
            Diese Datenschutzerklärung ist eine Vorlage. Bitte lasse sie vor dem Livegang von einer
            Fachperson prüfen und ergänze konkrete Dienstleister und Rechtsgrundlagen.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Datenschutz;
