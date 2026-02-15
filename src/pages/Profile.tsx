import { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/Header';
import { defaultTodos } from '@/data/mockData';
import { Country, TodoItem, PackingItem, PeopleBreakdown } from '@/types/travel';
import { User, MapPin, Calendar, Settings, Plus, Trash2, Edit2, LogOut, Loader2, Globe, TrendingUp, ChevronRight, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { format, differenceInDays } from 'date-fns';
import { de } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { AddCountryDialog } from '@/components/AddCountryDialog';
import { CountryDetail } from '@/components/CountryDetail';
import { AuthDialog } from '@/components/AuthDialog';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';

interface SavedTripRow {
  id: string;
  user_id: string;
  destination_name: string;
  destination_code: string | null;
  image_url: string | null;
  start_date: string | null;
  end_date: string | null;
  daily_budget: number | null;
  currency: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

type NotesData = {
  peopleCount?: number;
  packingList?: PackingItem[];
  todos?: TodoItem[];
  bestTimeToVisit?: string;
  peopleBreakdown?: PeopleBreakdown;
  tips?: string[];
  transportNotes?: string[];
  itinerary?: string[];
  stops?: { id: string; name: string; type: 'city' | 'poi'; notes?: string; tips?: string[] }[];
};

const Profile = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const [countries, setCountries] = useState<Country[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [profile, setProfile] = useState<{ display_name: string | null; avatar_url: string | null } | null>(null);
  const [loadingTrips, setLoadingTrips] = useState(false);
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'timeline'>('grid');
  const [editingProfile, setEditingProfile] = useState(false);
  const [editName, setEditName] = useState('');
  const [editAvatarUrl, setEditAvatarUrl] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  // MFA state
  const [mfaLoading, setMfaLoading] = useState(false);
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [mfaFactorsLoaded, setMfaFactorsLoaded] = useState(false);
  const [mfaFactors, setMfaFactors] = useState<{ id: string; status: string }[]>([]);
  const [mfaEnroll, setMfaEnroll] = useState<{ factorId: string; qrCode: string; secret: string } | null>(null);
  const [mfaChallengeId, setMfaChallengeId] = useState<string | null>(null);
  const [mfaVerifyCode, setMfaVerifyCode] = useState('');
  const hasPendingFactor = mfaFactors.some((factor) => factor.status !== 'verified');

  const [homeAirport, setHomeAirport] = useState<string>(() => {
    try { return localStorage.getItem('homeAirport') || 'FRA'; } catch { return 'FRA'; }
  });

  const fetchProfile = useCallback(async () => {
    if (!user) return;
    try {
      const { data } = await supabase
        .from('profiles')
        .select('display_name, avatar_url')
        .eq('user_id', user.id)
        .single();
      if (data) setProfile({ display_name: data.display_name, avatar_url: data.avatar_url });
    } catch { /* ignore */ }
  }, [user]);

  const fetchTrips = useCallback(async () => {
    if (!user) return;
    setLoadingTrips(true);
    try {
      const { data, error } = await supabase
        .from('saved_trips')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) { toast.error('Fehler beim Laden der Reisen'); setCountries([]); return; }

      if (data) {
        let mappedTrips: Country[] = (data as SavedTripRow[]).map((trip) => {
          let parsed: NotesData = {};
          try { parsed = trip.notes ? JSON.parse(trip.notes) : {}; } catch { parsed = {}; }
          const todosFromNotes: TodoItem[] =
            parsed.todos && Array.isArray(parsed.todos)
              ? parsed.todos.map((t: TodoItem, idx: number) => ({ ...t, id: t.id || `${trip.id}-todo-${idx}` }))
              : defaultTodos.map((t, i) => ({ ...t, id: `${trip.id}-${i}` }));
          return {
            id: trip.id,
            name: trip.destination_name,
            code: trip.destination_code || 'XX',
            imageUrl: trip.image_url || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80',
            startDate: trip.start_date || new Date().toISOString(),
            endDate: trip.end_date || new Date().toISOString(),
            dailyCost: Number(trip.daily_budget) || 100,
            currency: trip.currency || 'EUR',
            todos: todosFromNotes,
            peopleCount: parsed.peopleCount || 1,
            people: (() => {
              const count = typeof parsed.peopleCount === 'number' ? parsed.peopleCount : 1;
              const pb = parsed.peopleBreakdown;
              if (pb && typeof pb === 'object') {
                return { adults: typeof pb.adults === 'number' ? pb.adults : count, children: typeof pb.children === 'number' ? pb.children : 0, babies: typeof pb.babies === 'number' ? pb.babies : 0 };
              }
              return { adults: count, children: 0, babies: 0 };
            })(),
            packingList: parsed.packingList || [],
            tips: parsed.tips || [],
            transportNotes: parsed.transportNotes || [],
            itinerary: parsed.itinerary || [],
            attractions: [], hotels: [], restaurants: [], flights: [],
            weather: { averageTemp: 20, condition: 'sunny' as const, bestTimeToVisit: parsed.bestTimeToVisit || '', packingTips: [] },
            stops: parsed.stops || [],
          } as Country;
        });

        // Resolve country codes
        const withCodes = await Promise.all(
          mappedTrips.map(async (c) => {
            if (c.code !== 'XX') return c;
            try {
              const resp = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(c.name)}&limit=1&addressdetails=1&accept-language=de`);
              const arr = await resp.json();
              const first = Array.isArray(arr) && arr[0];
              const cc = first?.address?.country_code || first?.country_code || null;
              if (cc && typeof cc === 'string') return { ...c, code: cc.toUpperCase() };
            } catch { void 0; }
            return c;
          })
        );
        mappedTrips = withCodes.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
        setCountries(mappedTrips);
      } else { setCountries([]); }
    } catch { toast.error('Fehler beim Laden der Reisen'); setCountries([]); }
    finally { setLoadingTrips(false); }
  }, [user]);

  const loadMfaFactors = useCallback(async () => {
    if (!user) return;
    setMfaFactorsLoaded(false);
    try {
      const { data, error } = await supabase.auth.mfa.listFactors();
      if (error) { setMfaEnabled(false); setMfaFactors([]); return; }
      setMfaFactors(data?.totp || []);
      setMfaEnabled(data?.totp?.some((f) => f.status === 'verified') || false);
    } finally { setMfaFactorsLoaded(true); }
  }, [user]);

  useEffect(() => {
    if (user) {
      setCountries([]);
      fetchProfile();
      fetchTrips();
      loadMfaFactors();
    } else {
      setProfile(null); setCountries([]); setMfaEnabled(false); setMfaFactors([]); setMfaEnroll(null); setMfaVerifyCode(''); setMfaChallengeId(null);
    }
  }, [user, fetchProfile, fetchTrips, loadMfaFactors]);

  // MFA handlers
  const handleMfaEnroll = async () => {
    if (!user) return;
    if (hasPendingFactor) { toast.error('Es gibt bereits einen unbestätigten TOTP‑Faktor.'); return; }
    setMfaLoading(true);
    try {
      const { data, error } = await supabase.auth.mfa.enroll({ factorType: 'totp' });
      if (error || !data?.id || !data?.totp?.qr_code) { toast.error('TOTP konnte nicht gestartet werden: ' + (error?.message || 'Unbekannter Fehler')); return; }
      setMfaEnroll({ factorId: data.id, qrCode: data.totp.qr_code, secret: data.totp.secret });
      const { data: cData, error: cError } = await supabase.auth.mfa.challenge({ factorId: data.id });
      if (cError || !cData?.id) { toast.error('MFA-Challenge fehlgeschlagen'); return; }
      setMfaChallengeId(cData.id);
    } finally { setMfaLoading(false); }
  };

  const handleMfaReset = async () => {
    if (!user) return;
    const pending = mfaFactors.filter((f) => f.status !== 'verified');
    if (!pending.length) { toast.error('Kein zurücksetzbarer Faktor.'); return; }
    setMfaLoading(true);
    try {
      for (const f of pending) {
        const { error } = await supabase.auth.mfa.unenroll({ factorId: f.id });
        if (error) { toast.error('Reset fehlgeschlagen: ' + error.message); return; }
      }
      setMfaEnroll(null); setMfaVerifyCode(''); setMfaChallengeId(null);
      await loadMfaFactors();
      toast.success('TOTP zurückgesetzt.');
    } finally { setMfaLoading(false); }
  };

  const handleMfaVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mfaEnroll?.factorId || !mfaVerifyCode.trim()) return;
    setMfaLoading(true);
    try {
      let challengeId = mfaChallengeId;
      if (!challengeId) {
        const { data: cd, error: ce } = await supabase.auth.mfa.challenge({ factorId: mfaEnroll.factorId });
        if (ce || !cd?.id) { toast.error('MFA-Challenge fehlgeschlagen'); return; }
        challengeId = cd.id; setMfaChallengeId(challengeId);
      }
      const { error } = await supabase.auth.mfa.verify({ factorId: mfaEnroll.factorId, challengeId, code: mfaVerifyCode });
      if (error) { toast.error('Code ungültig: ' + error.message); return; }
      toast.success('2FA aktiviert');
      setMfaEnroll(null); setMfaVerifyCode(''); setMfaChallengeId(null);
      await loadMfaFactors();
    } finally { setMfaLoading(false); }
  };

  // Trip CRUD
  const handleAddCountry = async (newCountry: Country) => {
    if (!user) { setAuthDialogOpen(true); return; }
    try {
      const { data, error } = await supabase.from('saved_trips').insert({
        user_id: user.id, destination_name: newCountry.name, destination_code: newCountry.code,
        image_url: newCountry.imageUrl, start_date: newCountry.startDate, end_date: newCountry.endDate,
        daily_budget: newCountry.dailyCost, currency: newCountry.currency,
      }).select().single();
      if (error) { toast.error('Fehler: ' + error.message); return; }
      if (data) {
        setCountries([{ ...newCountry, id: (data as SavedTripRow).id }, ...countries]);
        toast.success('Reise gespeichert!');
      }
    } catch { toast.error('Fehler beim Speichern'); }
  };

  const handleDeleteCountry = async (id: string) => {
    if (user) {
      const { error } = await supabase.from('saved_trips').delete().eq('id', id).eq('user_id', user.id);
      if (error) { toast.error('Fehler beim Löschen'); return; }
    }
    setCountries(countries.filter((c) => c.id !== id));
    if (selectedTripId === id) setSelectedTripId(null);
    toast.success('Reise gelöscht');
  };

  const handleSignOut = async () => { await signOut(); setCountries([]); toast.success('Erfolgreich abgemeldet'); };

  const updateTripNotes = async (tripId: string, notes: NotesData) => {
    if (!user) return;
    try {
      const { error } = await supabase.from('saved_trips').update({ notes: JSON.stringify(notes) }).eq('id', tripId).eq('user_id', user.id);
      if (error) toast.error('Änderungen konnten nicht gespeichert werden');
    } catch { toast.error('Änderungen konnten nicht gespeichert werden'); }
  };

  const toggleTodo = async (tripId: string, todoId: string) => {
    setCountries((prev) => prev.map((c) => {
      if (c.id !== tripId) return c;
      const updatedTodos = c.todos.map((t) => (t.id === todoId ? { ...t, completed: !t.completed } : t));
      updateTripNotes(tripId, { peopleCount: c.peopleCount || 1, packingList: c.packingList || [], todos: updatedTodos, bestTimeToVisit: c.weather?.bestTimeToVisit || '' });
      return { ...c, todos: updatedTodos };
    }));
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    setSavingProfile(true);
    try {
      const { error } = await supabase.from('profiles').update({
        display_name: editName || null,
        avatar_url: editAvatarUrl || null,
      }).eq('user_id', user.id);
      if (error) { toast.error('Profil konnte nicht gespeichert werden'); return; }
      setProfile({ display_name: editName || null, avatar_url: editAvatarUrl || null });
      setEditingProfile(false);
      toast.success('Profil aktualisiert');
    } finally { setSavingProfile(false); }
  };

  const totalTrips = countries.length;
  const totalTodos = countries.reduce((sum, c) => sum + c.todos.length, 0);
  const completedTodos = countries.reduce((sum, c) => sum + c.todos.filter((t) => t.completed).length, 0);
  const uniqueCountryCodes = new Set(countries.map((c) => c.code).filter((c) => c !== 'XX'));
  const nextTrip = countries.find((c) => new Date(c.startDate) > new Date());
  const daysToNext = nextTrip ? differenceInDays(new Date(nextTrip.startDate), new Date()) : null;

  const selectedTrip = selectedTripId ? countries.find((c) => c.id === selectedTripId) : null;

  if (authLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  // Detail view
  if (selectedTrip) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-8">
          <CountryDetail
            country={selectedTrip}
            onBack={() => setSelectedTripId(null)}
            onToggleTodo={(todoId) => toggleTodo(selectedTrip.id, todoId)}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-2xl gradient-hero p-8 md:p-12 text-primary-foreground mb-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-foreground/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-5">
              {/* Avatar */}
              <div className="relative shrink-0">
                <div className="h-20 w-20 rounded-full bg-primary-foreground/20 flex items-center justify-center overflow-hidden ring-4 ring-primary-foreground/30">
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt="Avatar" className="h-full w-full object-cover" />
                  ) : (
                    <User className="h-10 w-10 text-primary-foreground/60" />
                  )}
                </div>
                {user && (
                  <button
                    onClick={() => { setEditingProfile(true); setEditName(profile?.display_name || ''); setEditAvatarUrl(profile?.avatar_url || ''); }}
                    className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-accent text-accent-foreground flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                  >
                    <Camera className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium uppercase tracking-wide opacity-80">
                    {user ? 'Mein Profil' : 'Gast-Modus'}
                  </span>
                </div>
                <h1 className="font-display text-3xl md:text-4xl font-bold">
                  {user ? `Hallo, ${profile?.display_name || user.email?.split('@')[0]}!` : 'Meine Reisen'}
                </h1>
                <p className="text-primary-foreground/80 text-base mt-1">
                  {user ? 'Verwalte deine geplanten Reisen und behalte den Überblick' : 'Melde dich an, um deine Reisen zu speichern'}
                </p>
              </div>
            </div>
            {user ? (
              <Button variant="secondary" onClick={handleSignOut} className="self-start">
                <LogOut className="h-4 w-4 mr-2" /> Abmelden
              </Button>
            ) : (
              <Button variant="secondary" onClick={() => setAuthDialogOpen(true)} className="self-start">
                <User className="h-4 w-4 mr-2" /> Anmelden / Registrieren
              </Button>
            )}
          </div>
        </section>

        {/* Edit Profile Dialog */}
        {editingProfile && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setEditingProfile(false)}>
            <div className="bg-card rounded-2xl p-6 w-full max-w-md shadow-elevated space-y-4" onClick={(e) => e.stopPropagation()}>
              <h3 className="font-display text-xl font-semibold">Profil bearbeiten</h3>
              <div className="space-y-3">
                <div>
                  <Label>Anzeigename</Label>
                  <Input value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="Dein Name" />
                </div>
                <div>
                  <Label>Avatar-URL</Label>
                  <Input value={editAvatarUrl} onChange={(e) => setEditAvatarUrl(e.target.value)} placeholder="https://..." />
                  {editAvatarUrl && (
                    <div className="mt-2 flex justify-center">
                      <img src={editAvatarUrl} alt="Vorschau" className="h-20 w-20 rounded-full object-cover border-2 border-border" />
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditingProfile(false)}>Abbrechen</Button>
                <Button onClick={handleSaveProfile} disabled={savingProfile}>
                  {savingProfile && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Speichern
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Dashboard Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="rounded-xl bg-card p-5 shadow-card">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-sm text-muted-foreground">Reisen</h3>
            </div>
            <p className="text-3xl font-bold">{totalTrips}</p>
          </div>
          <div className="rounded-xl bg-card p-5 shadow-card">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                <Globe className="h-5 w-5 text-secondary" />
              </div>
              <h3 className="text-sm text-muted-foreground">Länder</h3>
            </div>
            <p className="text-3xl font-bold">{uniqueCountryCodes.size}</p>
          </div>
          <div className="rounded-xl bg-card p-5 shadow-card">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-accent" />
              </div>
              <h3 className="text-sm text-muted-foreground">Aufgaben</h3>
            </div>
            <p className="text-3xl font-bold">{completedTodos}<span className="text-lg text-muted-foreground">/{totalTodos}</span></p>
          </div>
          <div className="rounded-xl bg-card p-5 shadow-card">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-sm text-muted-foreground">Nächste Reise</h3>
            </div>
            {daysToNext !== null ? (
              <>
                <p className="text-3xl font-bold">{daysToNext}<span className="text-lg text-muted-foreground"> Tage</span></p>
                <p className="text-xs text-muted-foreground mt-1">{nextTrip?.name}</p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Keine geplant</p>
            )}
          </div>
        </div>

        {/* Countries list */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-2xl font-semibold">Meine Destinationen</h2>
            <div className="flex items-center gap-2">
              {/* View toggle */}
              <div className="flex rounded-lg border border-border overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn('px-3 py-1.5 text-sm transition-colors', viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground hover:text-foreground')}
                >
                  Karten
                </button>
                <button
                  onClick={() => setViewMode('timeline')}
                  className={cn('px-3 py-1.5 text-sm transition-colors', viewMode === 'timeline' ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground hover:text-foreground')}
                >
                  Timeline
                </button>
              </div>
              {editMode && (
                <Button variant="outline" size="sm" onClick={() => setEditMode(false)}>
                  <Edit2 className="h-4 w-4 mr-1" /> Fertig
                </Button>
              )}
              {!editMode && user && (
                <Button variant="ghost" size="sm" onClick={() => setEditMode(true)}>
                  <Edit2 className="h-4 w-4 mr-1" /> Bearbeiten
                </Button>
              )}
              <Button variant="outline" onClick={() => { if (user) setAddDialogOpen(true); else { setAuthDialogOpen(true); toast.info('Bitte anmelden.'); } }}>
                <Plus className="h-4 w-4 mr-2" /> Reise hinzufügen
              </Button>
            </div>
          </div>

          {loadingTrips ? (
            <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
          ) : countries.length === 0 ? (
            <div className="rounded-xl border border-border bg-card p-12 text-center">
              <MapPin className="h-12 w-12 mx-auto text-muted-foreground/40 mb-4" />
              <h3 className="font-display text-lg font-semibold mb-2">Noch keine Reisen geplant</h3>
              <p className="text-muted-foreground mb-4">Füge deine erste Destination hinzu und starte mit der Planung!</p>
              <Button onClick={() => { if (user) setAddDialogOpen(true); else setAuthDialogOpen(true); }}>
                <Plus className="h-4 w-4 mr-2" /> Erste Reise planen
              </Button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {countries.map((country) => {
                const completedCount = country.todos.filter((t) => t.completed).length;
                const progress = country.todos.length > 0 ? Math.round((completedCount / country.todos.length) * 100) : 0;
                return (
                  <div key={country.id} className="group relative">
                    <button
                      onClick={() => setSelectedTripId(country.id)}
                      className="w-full text-left rounded-xl bg-card shadow-card overflow-hidden transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <div className="relative h-40 overflow-hidden">
                        <img src={country.imageUrl} alt={country.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent" />
                        <div className="absolute bottom-4 left-4 text-primary-foreground">
                          <h3 className="font-display text-xl font-semibold">{country.name}</h3>
                          <p className="text-sm opacity-80">
                            {format(new Date(country.startDate), 'dd. MMM', { locale: de })} – {format(new Date(country.endDate), 'dd. MMM', { locale: de })}
                          </p>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline">{country.code}</Badge>
                          <span className="text-sm font-medium text-primary">{progress}% erledigt</span>
                        </div>
                        <div className="h-2 rounded-full bg-muted overflow-hidden">
                          <div className="h-full rounded-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }} />
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <p className="text-xs text-muted-foreground">{completedCount}/{country.todos.length} Aufgaben</p>
                          <span className="text-sm font-medium text-primary flex items-center gap-1">
                            Details <ChevronRight className="h-3.5 w-3.5" />
                          </span>
                        </div>
                      </div>
                    </button>
                    {editMode && (
                      <Button
                        variant="destructive" size="icon"
                        className="absolute top-3 right-3 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                        onClick={(e) => { e.stopPropagation(); handleDeleteCountry(country.id); }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            /* Timeline View */
            <div className="relative pl-8 space-y-0">
              <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-border" />
              {countries.map((country, idx) => {
                const completedCount = country.todos.filter((t) => t.completed).length;
                const progress = country.todos.length > 0 ? Math.round((completedCount / country.todos.length) * 100) : 0;
                const isPast = new Date(country.endDate) < new Date();
                const isCurrent = new Date(country.startDate) <= new Date() && new Date(country.endDate) >= new Date();
                return (
                  <div key={country.id} className="relative pb-8 last:pb-0">
                    <div className={cn(
                      'absolute left-[-22px] top-4 h-4 w-4 rounded-full border-2 border-background',
                      isCurrent ? 'bg-accent ring-4 ring-accent/20' : isPast ? 'bg-muted-foreground' : 'bg-primary'
                    )} />
                    <button
                      onClick={() => setSelectedTripId(country.id)}
                      className="w-full text-left flex gap-4 rounded-xl bg-card shadow-card p-4 hover:shadow-card-hover transition-all group"
                    >
                      <img
                        src={country.imageUrl}
                        alt={country.name}
                        className="h-20 w-28 rounded-lg object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-display text-lg font-semibold truncate">{country.name}</h3>
                          <Badge variant={isCurrent ? 'default' : isPast ? 'secondary' : 'outline'} className="shrink-0">
                            {isCurrent ? 'Aktiv' : isPast ? 'Vergangen' : 'Geplant'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(country.startDate), 'dd. MMMM yyyy', { locale: de })} – {format(new Date(country.endDate), 'dd. MMMM yyyy', { locale: de })}
                        </p>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex-1 max-w-[200px]">
                            <Progress value={progress} size="sm" />
                          </div>
                          <span className="text-xs text-muted-foreground">{progress}%</span>
                          <span className="text-sm text-primary flex items-center gap-1 ml-auto group-hover:gap-2 transition-all">
                            Details <ChevronRight className="h-3.5 w-3.5" />
                          </span>
                        </div>
                      </div>
                    </button>
                    {editMode && (
                      <Button
                        variant="destructive" size="icon"
                        className="absolute top-4 right-4 h-7 w-7"
                        onClick={() => handleDeleteCountry(country.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <AddCountryDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} onAdd={handleAddCountry} />
          <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />
        </section>

        {/* Settings section */}
        <section className="mt-16">
          <h2 className="font-display text-2xl font-semibold mb-6 flex items-center gap-2">
            <Settings className="h-6 w-6" /> Einstellungen
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-xl bg-card p-6 shadow-card">
              <h3 className="font-medium mb-4">Profil-Informationen</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Name</span><span>{profile?.display_name || 'Nicht angegeben'}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">E-Mail</span><span>{user?.email || 'Nicht angemeldet'}</span></div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Heimatflughafen</span>
                  <input
                    type="text" value={homeAirport}
                    onChange={(e) => { const v = e.target.value.toUpperCase().slice(0, 3); setHomeAirport(v); try { localStorage.setItem('homeAirport', v); } catch { void 0; } }}
                    className="w-16 rounded-md border border-border bg-background px-2 py-0.5 text-sm uppercase text-right"
                  />
                </div>
              </div>
            </div>
            <div className="rounded-xl bg-card p-6 shadow-card">
              <h3 className="font-medium mb-4">Sicherheit</h3>
              {user ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">TOTP‑2FA</span>
                    {mfaFactorsLoaded ? (
                      <Badge variant={mfaEnabled ? "default" : "secondary"}>{mfaEnabled ? "Aktiv" : "Nicht aktiv"}</Badge>
                    ) : <span className="text-muted-foreground">Lädt…</span>}
                  </div>
                  {mfaEnabled ? (
                    <p className="text-sm text-muted-foreground">2FA ist aktiv.</p>
                  ) : (
                    <>
                      {mfaEnroll ? (
                        <div className="space-y-3">
                          <div className="rounded-lg border bg-background p-3">
                            {mfaEnroll.qrCode.trim().startsWith('<svg') ? (
                              <div className="flex items-center justify-center" dangerouslySetInnerHTML={{ __html: mfaEnroll.qrCode }} />
                            ) : (
                              <img src={mfaEnroll.qrCode} alt="QR" className="mx-auto h-48 w-48" />
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground break-all">Secret: {mfaEnroll.secret}</div>
                          <form onSubmit={handleMfaVerify} className="space-y-2">
                            <Label htmlFor="mfaVerify">Bestätigungscode</Label>
                            <Input id="mfaVerify" type="text" inputMode="numeric" pattern="[0-9]*" placeholder="123456" value={mfaVerifyCode} onChange={(e) => setMfaVerifyCode(e.target.value)} />
                            <Button type="submit" variant="outline" disabled={mfaLoading}>
                              {mfaLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Bestätigen
                            </Button>
                          </form>
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          <Button variant="outline" onClick={handleMfaEnroll} disabled={mfaLoading || hasPendingFactor}>
                            {mfaLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} 2FA aktivieren
                          </Button>
                          {hasPendingFactor && (
                            <Button variant="outline" onClick={handleMfaReset} disabled={mfaLoading}>TOTP zurücksetzen</Button>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
              ) : <p className="text-sm text-muted-foreground">Melde dich an, um 2FA zu aktivieren.</p>}
            </div>
            <div className="rounded-xl bg-card p-6 shadow-card">
              <h3 className="font-medium mb-4">Konto</h3>
              {user ? (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">Deine Reisen werden automatisch gespeichert.</p>
                  <Button variant="outline" onClick={handleSignOut}><LogOut className="h-4 w-4 mr-2" /> Abmelden</Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">Melde dich an, um deine Reisen zu speichern.</p>
                  <Button onClick={() => setAuthDialogOpen(true)}><User className="h-4 w-4 mr-2" /> Jetzt anmelden</Button>
                </div>
              )}
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

export default Profile;
