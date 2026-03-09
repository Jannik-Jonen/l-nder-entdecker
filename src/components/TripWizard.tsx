import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Calendar, DollarSign, Compass, Sun, MapPin, Users,
  ArrowRight, ArrowLeft, Sparkles, Loader2, Globe,
  Mountain, Waves, Building2, UtensilsCrossed, Camera,
  Music, Heart, TreePine, Palette, BookOpen, Zap,
  Shield, Stethoscope, Languages, Bike, Wine,
  Tent, Ship, GraduationCap, Baby, Dog, Accessibility,
  Clock, Map,
} from 'lucide-react';
import { cn } from '@/lib/utils';

/* ── Step definitions ── */
const STEPS = [
  { id: 'welcome',    title: 'Willkommen',             icon: Globe,      desc: 'Lass uns deine Traumreise planen!' },
  { id: 'duration',   title: 'Zeitraum & Dauer',       icon: Calendar,   desc: 'Wann und wie lange möchtest du reisen?' },
  { id: 'companions', title: 'Reisebegleitung',        icon: Users,      desc: 'Mit wem geht die Reise los?' },
  { id: 'budget',     title: 'Budget & Reisestil',     icon: DollarSign, desc: 'Wie viel möchtest du ausgeben?' },
  { id: 'interests',  title: 'Interessen & Aktivitäten', icon: Compass, desc: 'Was möchtest du erleben?' },
  { id: 'climate',    title: 'Klima & Jahreszeit',     icon: Sun,        desc: 'Welches Wetter bevorzugst du?' },
  { id: 'continents', title: 'Kontinente & Regionen',  icon: Map,        desc: 'Welche Teile der Welt möchtest du sehen?' },
  { id: 'pace',       title: 'Reisetempo',             icon: Clock,      desc: 'Wie schnell soll es vorangehen?' },
  { id: 'special',    title: 'Besondere Wünsche',      icon: Heart,      desc: 'Gibt es must-sees oder no-gos?' },
  { id: 'review',     title: 'Zusammenfassung',        icon: Sparkles,   desc: 'Prüfe & starte die Generierung' },
];

/* ── Options ── */
const DURATION_OPTIONS = [
  { id: '2-weeks',  label: '2 Wochen',  emoji: '🗓️' },
  { id: '1-month',  label: '1 Monat',   emoji: '📅' },
  { id: '2-months', label: '2 Monate',  emoji: '🌙' },
  { id: '3-months', label: '3 Monate',  emoji: '🗺️' },
  { id: '6-months', label: '6 Monate',  emoji: '✈️' },
  { id: '1-year',   label: '1 Jahr',    emoji: '🌍' },
  { id: 'custom',   label: 'Andere',    emoji: '✏️' },
];

const MONTHS = [
  { label: 'Jan', full: 'Januar' },     { label: 'Feb', full: 'Februar' },
  { label: 'Mär', full: 'März' },       { label: 'Apr', full: 'April' },
  { label: 'Mai', full: 'Mai' },        { label: 'Jun', full: 'Juni' },
  { label: 'Jul', full: 'Juli' },       { label: 'Aug', full: 'August' },
  { label: 'Sep', full: 'September' },  { label: 'Okt', full: 'Oktober' },
  { label: 'Nov', full: 'November' },   { label: 'Dez', full: 'Dezember' },
];

const COMPANION_OPTIONS = [
  { id: 'solo',    label: 'Solo',        emoji: '🧑',        desc: 'Alleine die Welt entdecken' },
  { id: 'couple',  label: 'Paar',        emoji: '👫',        desc: 'Romantische Abenteuer zu zweit' },
  { id: 'friends', label: 'Freunde',     emoji: '👯',        desc: 'Gemeinsame Erlebnisse teilen' },
  { id: 'family',  label: 'Familie',     emoji: '👨‍👩‍👧‍👦', desc: 'Mit Kindern die Welt zeigen' },
];

const TRAVEL_STYLES = [
  { id: 'backpacker', label: 'Backpacker',   icon: Tent,      desc: 'Hostels, Street Food, Abenteuer', budget: '20–40€/Tag', color: 'bg-emerald-500/10 text-emerald-600 border-emerald-200' },
  { id: 'budget',     label: 'Budget',       icon: Bike,      desc: 'Gute Unterkünfte, lokale Küche', budget: '40–80€/Tag', color: 'bg-blue-500/10 text-blue-600 border-blue-200' },
  { id: 'comfort',    label: 'Komfort',      icon: Building2, desc: 'Hotels, Restaurants, geführte Touren', budget: '80–150€/Tag', color: 'bg-amber-500/10 text-amber-600 border-amber-200' },
  { id: 'luxury',     label: 'Luxus',        icon: Wine,      desc: 'Beste Hotels, Fine Dining, VIP', budget: '150€+/Tag', color: 'bg-purple-500/10 text-purple-600 border-purple-200' },
];

const INTEREST_OPTIONS = [
  { id: 'beach',        label: 'Strand & Meer',         icon: Waves },
  { id: 'mountains',    label: 'Berge & Wandern',       icon: Mountain },
  { id: 'culture',      label: 'Kultur & Geschichte',   icon: Building2 },
  { id: 'food',         label: 'Essen & Kulinarik',     icon: UtensilsCrossed },
  { id: 'photography',  label: 'Fotografie',            icon: Camera },
  { id: 'nightlife',    label: 'Nightlife & Bars',      icon: Music },
  { id: 'romance',      label: 'Romantik',              icon: Heart },
  { id: 'nature',       label: 'Natur & Wildlife',      icon: TreePine },
  { id: 'art',          label: 'Kunst & Design',        icon: Palette },
  { id: 'adventure',    label: 'Abenteuer & Sport',     icon: Compass },
  { id: 'relaxation',   label: 'Wellness & Spa',        icon: Sun },
  { id: 'learning',     label: 'Sprachen & Lernen',     icon: GraduationCap },
  { id: 'diving',       label: 'Tauchen & Schnorcheln', icon: Ship },
  { id: 'volunteering', label: 'Volunteering',          icon: Heart },
];

const CLIMATE_OPTIONS = [
  { id: 'warm',     label: 'Warm & Sonnig',      emoji: '☀️',  desc: 'Sommer-Feeling das ganze Jahr' },
  { id: 'tropical', label: 'Tropisch & Feucht',   emoji: '🌴',  desc: 'Dschungel, Regenwald, Inseln' },
  { id: 'moderate', label: 'Gemäßigt',            emoji: '🌤️', desc: 'Angenehme Temperaturen, wenig Extreme' },
  { id: 'cold',     label: 'Kalt & Winterlich',   emoji: '❄️',  desc: 'Nordlichter, Schnee, Fjorde' },
  { id: 'mixed',    label: 'Mix – egal',          emoji: '🌍',  desc: 'Hauptsache spannende Orte!' },
];

const CONTINENT_OPTIONS = [
  { id: 'europe',        label: 'Europa',          emoji: '🇪🇺', highlight: 'Mittelmeer, Alpen, Skandinavien' },
  { id: 'asia',          label: 'Asien',           emoji: '🌏', highlight: 'Südostasien, Japan, Indien' },
  { id: 'north-america', label: 'Nordamerika',     emoji: '🇺🇸', highlight: 'USA, Kanada, Mexiko' },
  { id: 'south-america', label: 'Südamerika',      emoji: '🌎', highlight: 'Peru, Brasilien, Patagonien' },
  { id: 'africa',        label: 'Afrika',          emoji: '🌍', highlight: 'Safari, Marokko, Kapstadt' },
  { id: 'oceania',       label: 'Ozeanien',        emoji: '🏝️', highlight: 'Australien, Neuseeland, Fiji' },
  { id: 'middle-east',   label: 'Naher Osten',     emoji: '🕌', highlight: 'Dubai, Jordanien, Oman' },
];

const PACE_OPTIONS = [
  { id: 'slow',   label: 'Langsam & Tief',       emoji: '🐢', desc: 'Wenige Orte, dafür intensiv eintauchen. 2-4 Wochen pro Land.' },
  { id: 'medium', label: 'Ausgewogen',            emoji: '🚶', desc: 'Gute Balance zwischen Erkundung und Verweilen. 1-2 Wochen pro Land.' },
  { id: 'fast',   label: 'Schnell & Vielfältig',  emoji: '🚀', desc: 'Viele Orte sehen, wenig Stillstand. 3-7 Tage pro Stopp.' },
];

/* ── Preferences type ── */
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
  continents: string[];
  pace: string;
  specialNeeds: string;
}

interface TripWizardProps {
  onGenerate: (preferences: WizardPreferences) => void;
  isGenerating: boolean;
}

/* ── Animations ── */
const pageVariants = {
  enter: (direction: number) => ({ x: direction > 0 ? 80 : -80, opacity: 0, scale: 0.98 }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit: (direction: number) => ({ x: direction > 0 ? -80 : 80, opacity: 0, scale: 0.98 }),
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as const } }),
};

/* ── Component ── */
export const TripWizard = ({ onGenerate, isGenerating }: TripWizardProps) => {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [customDuration, setCustomDuration] = useState('');
  const [prefs, setPrefs] = useState<WizardPreferences>({
    duration: '', startMonth: '', budget: '', travelStyle: '',
    interests: [], climate: '', specificPlaces: '', avoidRegions: '',
    companions: 'solo', continents: [], pace: 'medium', specialNeeds: '',
  });

  const currentStep = STEPS[step];
  const progress = ((step) / (STEPS.length - 1)) * 100;

  const toggle = (key: 'interests' | 'continents', id: string) => {
    setPrefs(p => ({
      ...p,
      [key]: (p[key] as string[]).includes(id)
        ? (p[key] as string[]).filter(i => i !== id)
        : [...(p[key] as string[]), id],
    }));
  };

  const canProceed = () => {
    switch (step) {
      case 0: return true; // welcome
      case 1: return prefs.duration && prefs.startMonth;
      case 2: return prefs.companions;
      case 3: return prefs.travelStyle;
      case 4: return prefs.interests.length > 0;
      case 5: return prefs.climate;
      case 6: return prefs.continents.length > 0;
      case 7: return prefs.pace;
      case 8: return true;
      case 9: return true;
      default: return true;
    }
  };

  const goNext = () => {
    if (step === STEPS.length - 1) {
      const finalPrefs = { ...prefs };
      if (prefs.duration === 'custom') finalPrefs.duration = customDuration;
      onGenerate(finalPrefs);
    } else {
      setDirection(1);
      setStep(s => s + 1);
    }
  };

  const goBack = () => {
    setDirection(-1);
    setStep(s => s - 1);
  };

  const goToStep = (i: number) => {
    if (i < step) {
      setDirection(-1);
      setStep(i);
    }
  };

  /* ── Render helpers ── */
  const OptionCard = ({ selected, onClick, children, className }: { selected: boolean; onClick: () => void; children: React.ReactNode; className?: string }) => (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        'relative p-4 rounded-2xl border-2 text-left transition-all duration-200 overflow-hidden group',
        selected
          ? 'border-primary bg-primary/5 shadow-md ring-2 ring-primary/20'
          : 'border-border hover:border-primary/40 hover:bg-muted/50',
        className
      )}
    >
      {selected && (
        <motion.div
          layoutId="selected-indicator"
          className="absolute top-2 right-2 h-5 w-5 rounded-full bg-primary flex items-center justify-center"
          initial={{ scale: 0 }} animate={{ scale: 1 }}
        >
          <svg className="h-3 w-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
        </motion.div>
      )}
      {children}
    </motion.button>
  );

  return (
    <div className="max-w-3xl mx-auto">
      {/* ── Progress bar ── */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground flex items-center gap-1.5">
            <currentStep.icon className="h-4 w-4 text-primary" />
            Schritt {step + 1} von {STEPS.length}
          </span>
          <span className="text-sm font-semibold text-primary">{Math.round(progress)}%</span>
        </div>
        <div className="relative">
          <Progress value={progress} className="h-2.5" />
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-primary shadow-lg border-2 border-primary-foreground"
            style={{ left: `${progress}%` }}
            animate={{ left: `${progress}%` }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
        </div>
        {/* Step dots */}
        <div className="hidden md:flex justify-between mt-3">
          {STEPS.map((s, i) => (
            <button
              key={s.id}
              onClick={() => goToStep(i)}
              className={cn(
                'flex items-center gap-1 text-xs transition-all',
                i < step ? 'text-primary cursor-pointer hover:text-primary/70' :
                i === step ? 'text-foreground font-semibold' : 'text-muted-foreground/50'
              )}
            >
              <div className={cn(
                'h-2 w-2 rounded-full transition-all',
                i < step ? 'bg-primary' : i === step ? 'bg-primary scale-125' : 'bg-border'
              )} />
              <span className="hidden lg:inline">{s.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Step content ── */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={step}
          custom={direction}
          variants={pageVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
              className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-primary/10 mb-4"
            >
              <currentStep.icon className="h-8 w-8 text-primary" />
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="font-display text-2xl md:text-3xl font-bold mb-2"
            >
              {currentStep.title}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-muted-foreground"
            >
              {currentStep.desc}
            </motion.p>
          </div>

          {/* ── Step 0: Welcome ── */}
          {step === 0 && (
            <div className="text-center space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="relative mx-auto w-full max-w-md p-8 rounded-3xl bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 border border-primary/10"
              >
                <div className="grid grid-cols-3 gap-4 text-4xl mb-6">
                  {['🌍', '✈️', '🏔️', '🏖️', '🗼', '🌺'].map((e, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 + i * 0.08, type: 'spring' }}
                      className="text-center"
                    >
                      {e}
                    </motion.span>
                  ))}
                </div>
                <p className="text-foreground font-medium text-lg leading-relaxed">
                  In den nächsten Schritten fragen wir dich nach deinen Vorlieben – Dauer, Budget, Interessen, Klima und mehr.
                </p>
                <p className="text-muted-foreground mt-3 text-sm">
                  Unsere KI erstellt dir dann eine <span className="text-primary font-semibold">maßgeschneiderte Weltreise-Route</span> mit Stops, Tipps, Budget und Zeitplan.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex items-center justify-center gap-6 text-sm text-muted-foreground"
              >
                <span className="flex items-center gap-1.5"><Zap className="h-4 w-4 text-primary" /> KI-gestützt</span>
                <span className="flex items-center gap-1.5"><Shield className="h-4 w-4 text-primary" /> Personalisiert</span>
                <span className="flex items-center gap-1.5"><Globe className="h-4 w-4 text-primary" /> 6–20+ Stops</span>
              </motion.div>
            </div>
          )}

          {/* ── Step 1: Duration ── */}
          {step === 1 && (
            <div className="space-y-8">
              <div>
                <Label className="text-base font-semibold mb-4 block">Wie lange soll die Reise dauern?</Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {DURATION_OPTIONS.map((d, i) => (
                    <motion.div key={d.id} custom={i} variants={cardVariants} initial="hidden" animate="visible">
                      <OptionCard selected={prefs.duration === d.id} onClick={() => setPrefs(p => ({ ...p, duration: d.id }))}>
                        <span className="text-2xl block mb-2">{d.emoji}</span>
                        <span className="text-sm font-semibold block">{d.label}</span>
                      </OptionCard>
                    </motion.div>
                  ))}
                </div>
                <AnimatePresence>
                  {prefs.duration === 'custom' && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                      <Input className="mt-3" placeholder="z.B. 5 Wochen, 45 Tage..." value={customDuration} onChange={e => setCustomDuration(e.target.value)} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div>
                <Label className="text-base font-semibold mb-4 block">Wann möchtest du starten?</Label>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {MONTHS.map((m, i) => (
                    <motion.button
                      key={m.full}
                      custom={i}
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setPrefs(p => ({ ...p, startMonth: m.full }))}
                      className={cn(
                        'p-3 rounded-xl border-2 text-sm font-medium transition-all',
                        prefs.startMonth === m.full
                          ? 'border-primary bg-primary/10 text-primary shadow-sm'
                          : 'border-border hover:border-primary/40'
                      )}
                    >
                      {m.label}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Step 2: Companions ── */}
          {step === 2 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {COMPANION_OPTIONS.map((c, i) => (
                <motion.div key={c.id} custom={i} variants={cardVariants} initial="hidden" animate="visible">
                  <OptionCard selected={prefs.companions === c.id} onClick={() => setPrefs(p => ({ ...p, companions: c.id }))}>
                    <div className="flex items-center gap-4">
                      <span className="text-4xl">{c.emoji}</span>
                      <div>
                        <div className="font-semibold text-base">{c.label}</div>
                        <div className="text-sm text-muted-foreground">{c.desc}</div>
                      </div>
                    </div>
                  </OptionCard>
                </motion.div>
              ))}
            </div>
          )}

          {/* ── Step 3: Budget ── */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {TRAVEL_STYLES.map((s, i) => {
                  const Icon = s.icon;
                  return (
                    <motion.div key={s.id} custom={i} variants={cardVariants} initial="hidden" animate="visible">
                      <OptionCard selected={prefs.travelStyle === s.id} onClick={() => setPrefs(p => ({ ...p, travelStyle: s.id }))}>
                        <div className="flex items-start gap-3">
                          <div className={cn('h-10 w-10 rounded-xl flex items-center justify-center shrink-0', s.color)}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="font-semibold">{s.label}</div>
                            <div className="text-sm text-muted-foreground mt-0.5">{s.desc}</div>
                            <Badge variant="secondary" className="mt-2 text-xs">{s.budget}</Badge>
                          </div>
                        </div>
                      </OptionCard>
                    </motion.div>
                  );
                })}
              </div>
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <Label className="text-base font-semibold mb-2 block">Gesamtbudget (optional)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="number" className="pl-9"
                    placeholder="z.B. 5000, 10000, 20000..."
                    value={prefs.budget}
                    onChange={e => setPrefs(p => ({ ...p, budget: e.target.value }))}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1.5">Lass leer für eine KI-Empfehlung basierend auf Reisestil und Dauer.</p>
              </motion.div>
            </div>
          )}

          {/* ── Step 4: Interests ── */}
          {step === 4 && (
            <div>
              <Label className="text-base font-semibold mb-1 block">
                Was möchtest du erleben? <span className="text-muted-foreground font-normal">(wähle mehrere)</span>
              </Label>
              <p className="text-sm text-muted-foreground mb-4">Je mehr du auswählst, desto vielfältiger wird deine Route.</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {INTEREST_OPTIONS.map((item, i) => {
                  const Icon = item.icon;
                  const selected = prefs.interests.includes(item.id);
                  return (
                    <motion.div key={item.id} custom={i} variants={cardVariants} initial="hidden" animate="visible">
                      <OptionCard selected={selected} onClick={() => toggle('interests', item.id)} className="py-3">
                        <div className="flex items-center gap-3">
                          <Icon className={cn('h-5 w-5 shrink-0 transition-colors', selected ? 'text-primary' : 'text-muted-foreground')} />
                          <span className={cn('text-sm font-medium', selected && 'text-primary')}>{item.label}</span>
                        </div>
                      </OptionCard>
                    </motion.div>
                  );
                })}
              </div>
              {prefs.interests.length > 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 flex flex-wrap gap-2">
                  {prefs.interests.map(id => (
                    <Badge key={id} className="bg-primary/10 text-primary border-primary/20 cursor-pointer hover:bg-primary/20"
                      onClick={() => toggle('interests', id)}>
                      {INTEREST_OPTIONS.find(i => i.id === id)?.label} ✕
                    </Badge>
                  ))}
                </motion.div>
              )}
            </div>
          )}

          {/* ── Step 5: Climate ── */}
          {step === 5 && (
            <div className="grid grid-cols-1 gap-3">
              {CLIMATE_OPTIONS.map((c, i) => (
                <motion.div key={c.id} custom={i} variants={cardVariants} initial="hidden" animate="visible">
                  <OptionCard selected={prefs.climate === c.id} onClick={() => setPrefs(p => ({ ...p, climate: c.id }))}>
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">{c.emoji}</span>
                      <div>
                        <div className="font-semibold">{c.label}</div>
                        <div className="text-sm text-muted-foreground">{c.desc}</div>
                      </div>
                    </div>
                  </OptionCard>
                </motion.div>
              ))}
            </div>
          )}

          {/* ── Step 6: Continents ── */}
          {step === 6 && (
            <div>
              <Label className="text-base font-semibold mb-1 block">
                Welche Kontinente möchtest du bereisen? <span className="text-muted-foreground font-normal">(wähle mehrere)</span>
              </Label>
              <p className="text-sm text-muted-foreground mb-4">Die KI plant die optimale Route zwischen deinen gewählten Regionen.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {CONTINENT_OPTIONS.map((c, i) => {
                  const selected = prefs.continents.includes(c.id);
                  return (
                    <motion.div key={c.id} custom={i} variants={cardVariants} initial="hidden" animate="visible">
                      <OptionCard selected={selected} onClick={() => toggle('continents', c.id)}>
                        <div className="flex items-center gap-4">
                          <span className="text-3xl">{c.emoji}</span>
                          <div>
                            <div className="font-semibold">{c.label}</div>
                            <div className="text-xs text-muted-foreground">{c.highlight}</div>
                          </div>
                        </div>
                      </OptionCard>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Step 7: Pace ── */}
          {step === 7 && (
            <div className="grid grid-cols-1 gap-4">
              {PACE_OPTIONS.map((p, i) => (
                <motion.div key={p.id} custom={i} variants={cardVariants} initial="hidden" animate="visible">
                  <OptionCard selected={prefs.pace === p.id} onClick={() => setPrefs(pr => ({ ...pr, pace: p.id }))}>
                    <div className="flex items-center gap-4">
                      <span className="text-4xl">{p.emoji}</span>
                      <div>
                        <div className="font-semibold text-base">{p.label}</div>
                        <div className="text-sm text-muted-foreground">{p.desc}</div>
                      </div>
                    </div>
                  </OptionCard>
                </motion.div>
              ))}
            </div>
          )}

          {/* ── Step 8: Special wishes ── */}
          {step === 8 && (
            <div className="space-y-6">
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <Label className="text-base font-semibold mb-2 block flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" /> Must-See Orte & Sehenswürdigkeiten
                </Label>
                <Textarea
                  placeholder="z.B. Machu Picchu, Bali Reisterrassen, Tokyo, Nordlichter in Island, Angkor Wat, Safari in Kenia, Great Barrier Reef..."
                  value={prefs.specificPlaces}
                  onChange={e => setPrefs(p => ({ ...p, specificPlaces: e.target.value }))}
                  rows={4} className="resize-none"
                />
                <p className="text-xs text-muted-foreground mt-1.5">Die KI baut diese Orte in deine Route ein und plant die beste Reihenfolge.</p>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <Label className="text-base font-semibold mb-2 block flex items-center gap-2">
                  <Shield className="h-4 w-4 text-destructive" /> Regionen vermeiden <span className="text-muted-foreground font-normal">(optional)</span>
                </Label>
                <Textarea
                  placeholder="z.B. Regionen mit Sicherheitsbedenken, bestimmte Klimazonen, Orte an denen du schon warst..."
                  value={prefs.avoidRegions}
                  onChange={e => setPrefs(p => ({ ...p, avoidRegions: e.target.value }))}
                  rows={2} className="resize-none"
                />
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <Label className="text-base font-semibold mb-2 block flex items-center gap-2">
                  <Stethoscope className="h-4 w-4 text-primary" /> Besondere Anforderungen <span className="text-muted-foreground font-normal">(optional)</span>
                </Label>
                <Textarea
                  placeholder="z.B. vegetarische Küche, Barrierefreiheit, Reisen mit Hund, bestimmte Impfungen vermeiden, keine Langstreckenflüge..."
                  value={prefs.specialNeeds}
                  onChange={e => setPrefs(p => ({ ...p, specialNeeds: e.target.value }))}
                  rows={2} className="resize-none"
                />
              </motion.div>
            </div>
          )}

          {/* ── Step 9: Review ── */}
          {step === 9 && (
            <div className="space-y-4">
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="p-6 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/10 text-center mb-6"
              >
                <Sparkles className="h-8 w-8 text-primary mx-auto mb-3" />
                <p className="font-semibold text-lg">Alles bereit! Prüfe deine Angaben und starte die KI-Generierung.</p>
                <p className="text-sm text-muted-foreground mt-1">Die Generierung dauert ca. 15–30 Sekunden.</p>
              </motion.div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { label: 'Dauer', value: prefs.duration === 'custom' ? customDuration : DURATION_OPTIONS.find(d => d.id === prefs.duration)?.label, icon: Calendar },
                  { label: 'Start', value: prefs.startMonth, icon: Calendar },
                  { label: 'Reisestil', value: TRAVEL_STYLES.find(s => s.id === prefs.travelStyle)?.label, icon: DollarSign },
                  { label: 'Budget', value: prefs.budget ? `${Number(prefs.budget).toLocaleString('de-DE')}€` : 'KI-Empfehlung', icon: DollarSign },
                  { label: 'Klima', value: `${CLIMATE_OPTIONS.find(c => c.id === prefs.climate)?.emoji || ''} ${CLIMATE_OPTIONS.find(c => c.id === prefs.climate)?.label || ''}`, icon: Sun },
                  { label: 'Begleitung', value: `${COMPANION_OPTIONS.find(c => c.id === prefs.companions)?.emoji || ''} ${COMPANION_OPTIONS.find(c => c.id === prefs.companions)?.label || ''}`, icon: Users },
                  { label: 'Tempo', value: PACE_OPTIONS.find(p => p.id === prefs.pace)?.label, icon: Clock },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <motion.div key={item.label} custom={i} variants={cardVariants} initial="hidden" animate="visible"
                      className="p-3 rounded-xl bg-muted/60 border border-border"
                    >
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                        <Icon className="h-3 w-3" /> {item.label}
                      </div>
                      <div className="font-semibold text-sm">{item.value}</div>
                    </motion.div>
                  );
                })}
              </div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                className="p-3 rounded-xl bg-muted/60 border border-border"
              >
                <div className="text-xs text-muted-foreground mb-1.5 flex items-center gap-1"><Map className="h-3 w-3" /> Kontinente</div>
                <div className="flex flex-wrap gap-1.5">
                  {prefs.continents.map(id => (
                    <Badge key={id} variant="secondary" className="text-xs">
                      {CONTINENT_OPTIONS.find(c => c.id === id)?.emoji} {CONTINENT_OPTIONS.find(c => c.id === id)?.label}
                    </Badge>
                  ))}
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
                className="p-3 rounded-xl bg-muted/60 border border-border"
              >
                <div className="text-xs text-muted-foreground mb-1.5 flex items-center gap-1"><Compass className="h-3 w-3" /> Interessen</div>
                <div className="flex flex-wrap gap-1.5">
                  {prefs.interests.map(id => (
                    <Badge key={id} variant="secondary" className="text-xs">
                      {INTEREST_OPTIONS.find(i => i.id === id)?.label}
                    </Badge>
                  ))}
                </div>
              </motion.div>

              {prefs.specificPlaces && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                  className="p-3 rounded-xl bg-muted/60 border border-border"
                >
                  <div className="text-xs text-muted-foreground mb-1">🎯 Gewünschte Orte</div>
                  <div className="text-sm">{prefs.specificPlaces}</div>
                </motion.div>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* ── Navigation ── */}
      <motion.div layout className="flex items-center justify-between mt-10">
        <Button variant="ghost" onClick={goBack} disabled={step === 0} className="gap-1.5">
          <ArrowLeft className="h-4 w-4" /> Zurück
        </Button>

        <Button
          onClick={goNext}
          disabled={!canProceed() || isGenerating}
          size="lg"
          className={cn(
            'gap-2 min-w-[180px] transition-all',
            step === STEPS.length - 1 && 'bg-gradient-to-r from-primary to-primary/80 shadow-lg hover:shadow-xl'
          )}
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              KI generiert Route...
            </>
          ) : step === STEPS.length - 1 ? (
            <>
              <Sparkles className="h-4 w-4" />
              Weltreise generieren
            </>
          ) : step === 0 ? (
            <>
              Los geht's <ArrowRight className="h-4 w-4" />
            </>
          ) : (
            <>
              Weiter <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </motion.div>
    </div>
  );
};
