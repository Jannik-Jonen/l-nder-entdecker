import { Sparkles, MapPinned, ListTodo, Plane } from 'lucide-react';

const steps = [
  {
    icon: Sparkles,
    number: '01',
    title: 'Inspirieren lassen',
    description:
      'Stöbere durch kuratierte Destinationen und Community-Guides — oder starte direkt mit deinem Traumziel.',
  },
  {
    icon: MapPinned,
    number: '02',
    title: 'Route planen',
    description:
      'Der KI-Wizard baut aus deinen Wünschen eine geografisch sinnvolle Route mit Budget, Transport und Tipps.',
  },
  {
    icon: ListTodo,
    number: '03',
    title: 'Details organisieren',
    description:
      'Checklisten, Packlisten, Reisegruppe, Währungsumrechner und Countdown — alles pro Reise gebündelt.',
  },
  {
    icon: Plane,
    number: '04',
    title: 'Entspannt losreisen',
    description:
      'Alle Infos, To-dos und Guides sind offline greifbar. Du reist, wir kümmern uns um die Ordnung.',
  },
];

export const HowItWorks = () => {
  return (
    <section className="py-20 border-t border-border/50">
      <div className="container">
        <div className="max-w-2xl mb-14">
          <p className="text-sm font-medium text-primary uppercase tracking-wider mb-3">
            So funktioniert's
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-4">
            In vier Schritten vom Fernweh zur fertigen Reise.
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Kein Chaos aus Tabs und Notiz-Apps mehr. GlobeDetour führt dich strukturiert von der
            ersten Idee bis zum Boarding.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="relative p-6 rounded-2xl border border-border/60 bg-card hover:border-primary/40 hover:shadow-card-hover transition-all"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="font-display text-3xl font-bold text-muted-foreground/30 leading-none">
                    {step.number}
                  </span>
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
