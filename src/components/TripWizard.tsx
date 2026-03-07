import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Calendar, DollarSign, Compass, Sun, MapPin, Users,
  ArrowRight, ArrowLeft, Sparkles, Loader2, Globe,
  Mountain, Waves, Building2, UtensilsCrossed, Camera,
  Music, Heart, TreePine, Palette, BookOpen,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const STEPS = [
  { id: 'duration', title: 'Zeitraum & Dauer', icon: Calendar, desc: 'Wann und wie lange möchtest du reisen?' },
  { id: 'budget', title: 'Budget & Reisestil', icon: DollarSign, desc: 'Wie viel möchtest du ausgeben?' },
  { id: 'interests', title: 'Interessen & Aktivitäten', icon: Compass, desc: 'Was möchtest du erleben?' },
  { id: 'climate', title: 'Klima & Jahreszeit', icon: Sun, desc: 'Welches Wetter bevorzugst du?' },
  { id: 'places', title: 'Orte & Wünsche', icon: MapPin, desc: 'Gibt es Orte, die du unbedingt sehen möchtest?' },
  { id: 'review', title: 'Zusammenfassung', icon: Sparkles, desc: 'Prüfe deine Angaben und starte die Generierung' },
];

const INTEREST_OPTIONS = [
  { id: 'beach', label: 'Strand & Meer', icon: Waves },
  { id: 'mountains', label: 'Berge & Wandern', icon: Mountain },
  { id: 'culture', label: 'Kultur & Geschichte', icon: Building2 },
  { id: 'food', label: 'Essen & Kulinarik', icon: UtensilsCrossed },
  { id: 'photography', label: 'Fotografie', icon: Camera },
  { id: 'nightlife', label: 'Nightlife', icon: Music },
  { id: 'romance', label: 'Romantik', icon: Heart },
  { id: 'nature', label: 'Natur & Wildlife', icon: TreePine },
  { id: 'art', label: 'Kunst & Design', icon: Palette },
  { id: 'adventure', label: 'Abenteuer & Sport', icon: Compass },
  { id: 'relaxation', label: 'Wellness & Entspannung', icon: Sun },
  { id: 'learning', label: 'Sprachen & Lernen', icon: BookOpen },
];

const CLIMATE_OPTIONS = [
  { id: 'warm', label: 'Warm & Sonnig', emoji: '☀️' },
  { id: 'tropical', label: 'Tropisch', emoji: '🌴' },
  { id: 'moderate', label: 'Gemäßigt', emoji: '🌤️' },
  { id: 'cold', label: 'Kalt & Winterlich', emoji: '❄️' },
  { id: 'mixed', label: 'Mix aus allem', emoji: '🌍' },
];

const TRAVEL_STYLES = [
  { id: 'backpacker', label: 'Backpacker', desc: 'Hostels, Street Food, günstig reisen', budget: '20-40€/Tag' },
  { id: 'budget', label: 'Budget', desc: 'Gute Unterkünfte, lokale Restaurants', budget: '40-80€/Tag' },
  { id: 'comfort', label: 'Komfort', desc: 'Hotels, gute Restaurants, Touren', budget: '80-150€/Tag' },
  { id: 'luxury', label: 'Luxus', desc: 'Beste Hotels, Fine Dining, Premium', budget: '150€+/Tag' },
];

const DURATION_OPTIONS = [
  { id: '2-weeks', label: '2 Wochen' },
  { id: '1-month', label: '1 Monat' },
  { id: '2-months', label: '2 Monate' },
  { id: '3-months', label: '3 Monate' },
  { id: '6-months', label: '6 Monate' },
  { id: '1-year', label: '1 Jahr' },
  { id: 'custom', label: 'Eigene Dauer' },
];

const COMPANION_OPTIONS = [
  { id: 'solo', label: 'Solo', emoji: '🧑' },
  { id: 'couple', label: 'Paar', emoji: '👫' },
  { id: 'friends', label: 'Freunde', emoji: '👯' },
  { id: 'family', label: 'Familie', emoji: '👨‍👩‍👧‍👦' },
];

export interface WizardPreferences {
  duration: string;
  startMonth: string;
  budget: string;
  travelStyle: string;
  interests: string[];
  climate: string;
  specificPlaces: string;
  avoidRegions: string;
  companions: string;
}

interface TripWizardProps {
  onGenerate: (preferences: WizardPreferences) => void;
  isGenerating: boolean;
}

export const TripWizard = ({ onGenerate, isGenerating }: TripWizardProps) => {
  const [step, setStep] = useState(0);
  const [prefs, setPrefs] = useState<WizardPreferences>({
    duration: '',
    startMonth: '',
    budget: '',
    travelStyle: '',
    interests: [],
    climate: '',
    specificPlaces: '',
    avoidRegions: '',
    companions: 'solo',
  });
  const [customDuration, setCustomDuration] = useState('');

  const currentStep = STEPS[step];
  const progress = ((step + 1) / STEPS.length) * 100;

  const toggleInterest = (id: string) => {
    setPrefs(p => ({
      ...p,
      interests: p.interests.includes(id)
        ? p.interests.filter(i => i !== id)
        : [...p.interests, id],
    }));
  };

  const canProceed = () => {
    switch (step) {
      case 0: return prefs.duration && prefs.startMonth;
      case 1: return prefs.travelStyle;
      case 2: return prefs.interests.length > 0;
      case 3: return prefs.climate;
      case 4: return true;
      case 5: return true;
      default: return true;
    }
  };

  const handleNext = () => {
    if (step === STEPS.length - 1) {
      const finalPrefs = { ...prefs };
      if (prefs.duration === 'custom') finalPrefs.duration = customDuration;
      onGenerate(finalPrefs);
    } else {
      setStep(s => s + 1);
    }
  };

  const months = [
    'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
    'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember',
  ];

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <currentStep.icon className="h-4 w-4 text-primary" />
            Schritt {step + 1} von {STEPS.length}
          </div>
          <span className="text-sm font-medium text-primary">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
        <div className="flex justify-between mt-2">
          {STEPS.map((s, i) => (
            <button
              key={s.id}
              onClick={() => i < step && setStep(i)}
              className={cn(
                'hidden md:flex items-center gap-1 text-xs transition-colors',
                i < step ? 'text-primary cursor-pointer hover:text-primary/80' :
                i === step ? 'text-foreground font-medium' : 'text-muted-foreground'
              )}
            >
              <s.icon className="h-3 w-3" />
              {s.title}
            </button>
          ))}
        </div>
      </div>

      {/* Step header */}
      <div className="text-center mb-8">
        <h2 className="font-display text-2xl md:text-3xl font-bold mb-2">{currentStep.title}</h2>
        <p className="text-muted-foreground">{currentStep.desc}</p>
      </div>

      {/* Step content */}
      <Card className="mb-8">
        <CardContent className="p-6 md:p-8">

          {/* Step 0: Duration */}
          {step === 0 && (
            <div className="space-y-6">
              <div>
                <Label className="text-base font-semibold mb-3 block">Wie lange soll die Reise dauern?</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {DURATION_OPTIONS.map(d => (
                    <button
                      key={d.id}
                      onClick={() => setPrefs(p => ({ ...p, duration: d.id }))}
                      className={cn(
                        'p-3 rounded-xl border-2 text-sm font-medium transition-all',
                        prefs.duration === d.id
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border hover:border-primary/50'
                      )}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
                {prefs.duration === 'custom' && (
                  <Input
                    className="mt-3"
                    placeholder="z.B. 5 Wochen, 45 Tage..."
                    value={customDuration}
                    onChange={e => setCustomDuration(e.target.value)}
                  />
                )}
              </div>

              <div>
                <Label className="text-base font-semibold mb-3 block">Wann möchtest du starten?</Label>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                  {months.map(m => (
                    <button
                      key={m}
                      onClick={() => setPrefs(p => ({ ...p, startMonth: m }))}
                      className={cn(
                        'p-2.5 rounded-lg border-2 text-sm transition-all',
                        prefs.startMonth === m
                          ? 'border-primary bg-primary/10 text-primary font-medium'
                          : 'border-border hover:border-primary/50'
                      )}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-base font-semibold mb-3 block">Mit wem reist du?</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {COMPANION_OPTIONS.map(c => (
                    <button
                      key={c.id}
                      onClick={() => setPrefs(p => ({ ...p, companions: c.id }))}
                      className={cn(
                        'p-3 rounded-xl border-2 text-center transition-all',
                        prefs.companions === c.id
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      )}
                    >
                      <span className="text-2xl block mb-1">{c.emoji}</span>
                      <span className="text-sm font-medium">{c.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Budget */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <Label className="text-base font-semibold mb-3 block">Wähle deinen Reisestil</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {TRAVEL_STYLES.map(s => (
                    <button
                      key={s.id}
                      onClick={() => setPrefs(p => ({ ...p, travelStyle: s.id }))}
                      className={cn(
                        'p-4 rounded-xl border-2 text-left transition-all',
                        prefs.travelStyle === s.id
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      )}
                    >
                      <div className="font-semibold">{s.label}</div>
                      <div className="text-sm text-muted-foreground mt-1">{s.desc}</div>
                      <Badge variant="secondary" className="mt-2">{s.budget}</Badge>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-base font-semibold mb-2 block">Gesamtbudget (optional, in EUR)</Label>
                <Input
                  type="number"
                  placeholder="z.B. 5000, 10000, 20000..."
                  value={prefs.budget}
                  onChange={e => setPrefs(p => ({ ...p, budget: e.target.value }))}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Lass leer für eine Empfehlung basierend auf Reisestil und Dauer.
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Interests */}
          {step === 2 && (
            <div>
              <Label className="text-base font-semibold mb-3 block">
                Was möchtest du erleben? <span className="text-muted-foreground font-normal">(wähle mehrere)</span>
              </Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {INTEREST_OPTIONS.map(i => {
                  const Icon = i.icon;
                  const selected = prefs.interests.includes(i.id);
                  return (
                    <button
                      key={i.id}
                      onClick={() => toggleInterest(i.id)}
                      className={cn(
                        'flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left',
                        selected
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      )}
                    >
                      <Icon className={cn('h-5 w-5 shrink-0', selected ? 'text-primary' : 'text-muted-foreground')} />
                      <span className={cn('text-sm font-medium', selected && 'text-primary')}>{i.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 3: Climate */}
          {step === 3 && (
            <div>
              <Label className="text-base font-semibold mb-3 block">Welches Klima bevorzugst du?</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {CLIMATE_OPTIONS.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setPrefs(p => ({ ...p, climate: c.id }))}
                    className={cn(
                      'flex items-center gap-3 p-4 rounded-xl border-2 transition-all',
                      prefs.climate === c.id
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    )}
                  >
                    <span className="text-2xl">{c.emoji}</span>
                    <span className="text-sm font-medium">{c.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Specific places */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <Label className="text-base font-semibold mb-2 block">
                  Gibt es Orte oder Sehenswürdigkeiten, die du unbedingt sehen möchtest?
                </Label>
                <Textarea
                  placeholder="z.B. Machu Picchu, Bali, Tokyo, die Nordlichter in Island, Angkor Wat, Safari in Kenia..."
                  value={prefs.specificPlaces}
                  onChange={e => setPrefs(p => ({ ...p, specificPlaces: e.target.value }))}
                  rows={4}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Nenne so viele oder so wenige wie du möchtest – die KI baut sie in die Route ein.
                </p>
              </div>

              <div>
                <Label className="text-base font-semibold mb-2 block">
                  Gibt es Regionen, die du vermeiden möchtest? <span className="text-muted-foreground font-normal">(optional)</span>
                </Label>
                <Textarea
                  placeholder="z.B. Regionen mit Sicherheitsbedenken, bestimmte Klimazonen..."
                  value={prefs.avoidRegions}
                  onChange={e => setPrefs(p => ({ ...p, avoidRegions: e.target.value }))}
                  rows={2}
                />
              </div>
            </div>
          )}

          {/* Step 5: Review */}
          {step === 5 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-muted/50">
                  <div className="text-sm text-muted-foreground mb-1">Dauer</div>
                  <div className="font-semibold">
                    {prefs.duration === 'custom' ? customDuration : DURATION_OPTIONS.find(d => d.id === prefs.duration)?.label}
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <div className="text-sm text-muted-foreground mb-1">Start</div>
                  <div className="font-semibold">{prefs.startMonth}</div>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <div className="text-sm text-muted-foreground mb-1">Reisestil</div>
                  <div className="font-semibold">{TRAVEL_STYLES.find(s => s.id === prefs.travelStyle)?.label}</div>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <div className="text-sm text-muted-foreground mb-1">Budget</div>
                  <div className="font-semibold">{prefs.budget ? `${Number(prefs.budget).toLocaleString('de-DE')}€` : 'KI-Empfehlung'}</div>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <div className="text-sm text-muted-foreground mb-1">Klima</div>
                  <div className="font-semibold">
                    {CLIMATE_OPTIONS.find(c => c.id === prefs.climate)?.emoji} {CLIMATE_OPTIONS.find(c => c.id === prefs.climate)?.label}
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <div className="text-sm text-muted-foreground mb-1">Reisebegleitung</div>
                  <div className="font-semibold">
                    {COMPANION_OPTIONS.find(c => c.id === prefs.companions)?.emoji} {COMPANION_OPTIONS.find(c => c.id === prefs.companions)?.label}
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-muted/50">
                <div className="text-sm text-muted-foreground mb-1">Interessen</div>
                <div className="flex flex-wrap gap-2 mt-1">
                  {prefs.interests.map(id => (
                    <Badge key={id} variant="secondary">
                      {INTEREST_OPTIONS.find(i => i.id === id)?.label}
                    </Badge>
                  ))}
                </div>
              </div>

              {prefs.specificPlaces && (
                <div className="p-4 rounded-lg bg-muted/50">
                  <div className="text-sm text-muted-foreground mb-1">Gewünschte Orte</div>
                  <div className="text-sm">{prefs.specificPlaces}</div>
                </div>
              )}

              {prefs.avoidRegions && (
                <div className="p-4 rounded-lg bg-muted/50">
                  <div className="text-sm text-muted-foreground mb-1">Vermeiden</div>
                  <div className="text-sm">{prefs.avoidRegions}</div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setStep(s => s - 1)}
          disabled={step === 0}
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Zurück
        </Button>

        <Button
          onClick={handleNext}
          disabled={!canProceed() || isGenerating}
          size="lg"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              KI generiert Route...
            </>
          ) : step === STEPS.length - 1 ? (
            <>
              <Sparkles className="h-4 w-4 mr-1" />
              Weltreise generieren
            </>
          ) : (
            <>
              Weiter <ArrowRight className="h-4 w-4 ml-1" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
