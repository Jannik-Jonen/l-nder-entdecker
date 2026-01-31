import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { mockCountries, defaultTodos } from '@/data/mockData';
import { Country } from '@/types/travel';
import { User, MapPin, Calendar, Settings, Plus, Trash2, Edit2, LogOut, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { AddCountryDialog } from '@/components/AddCountryDialog';
import { AuthDialog } from '@/components/AuthDialog';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ProfileRow {
  display_name: string | null;
}

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

const Profile = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const [countries, setCountries] = useState<Country[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [profile, setProfile] = useState<{ display_name: string | null } | null>(null);
  const [loadingTrips, setLoadingTrips] = useState(false);

  // Fetch profile and trips when user logs in
  useEffect(() => {
    if (user) {
      setCountries([]);
      fetchProfile();
      fetchTrips();
    } else {
      setProfile(null);
      setCountries(mockCountries);
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;
      const resp = await fetch('/api/me', {
        headers: {
          Authorization: `Bearer ${token || ''}`,
        },
      });
      if (resp.ok) {
        const data = await resp.json();
        setProfile({ display_name: (data as ProfileRow).display_name });
      }
    } catch (e) {
      // ignore
    }
  };

  const fetchTrips = async () => {
    if (!user) return;
    setLoadingTrips(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;
      const resp = await fetch('/api/trips', {
        headers: {
          Authorization: `Bearer ${token || ''}`,
        },
      });
      if (resp.ok) {
        const data = await resp.json();
        const mappedTrips: Country[] = (data as SavedTripRow[]).map((trip: SavedTripRow) => ({
        id: trip.id,
        name: trip.destination_name,
        code: trip.destination_code || 'XX',
        imageUrl: trip.image_url || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80',
        startDate: trip.start_date || new Date().toISOString(),
        endDate: trip.end_date || new Date().toISOString(),
        dailyCost: Number(trip.daily_budget) || 100,
        currency: trip.currency || 'EUR',
        todos: defaultTodos.map((t, i) => ({ ...t, id: `${trip.id}-${i}` })),
        attractions: [],
        hotels: [],
        restaurants: [],
        flights: [],
        weather: { averageTemp: 20, condition: 'sunny', bestTimeToVisit: '', packingTips: [] },
      }));
        setCountries(mappedTrips);
      } else {
        setCountries([]);
      }
    } finally {
      setLoadingTrips(false);
    }
  };

  const handleAddCountry = async (newCountry: Country) => {
    if (user) {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const token = sessionData?.session?.access_token;
        const resp = await fetch('/api/trips', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token || ''}`,
          },
          body: JSON.stringify({
            destination_name: newCountry.name,
            destination_code: newCountry.code,
            image_url: newCountry.imageUrl,
            start_date: newCountry.startDate,
            end_date: newCountry.endDate,
            daily_budget: newCountry.dailyCost,
            currency: newCountry.currency,
          }),
        });
        if (!resp.ok) {
          const err = await resp.json();
          toast.error('Fehler beim Speichern: ' + (err.error || 'Unbekannter Fehler'));
          return;
        }
        const data = await resp.json();
        const savedCountry: Country = {
          ...newCountry,
          id: (data as SavedTripRow).id,
        };
        setCountries([savedCountry, ...countries]);
        toast.success('Reise gespeichert!');
      } catch {
        toast.error('Fehler beim Speichern');
      }
    } else {
      setCountries([...countries, newCountry]);
    }
  };

  const handleDeleteCountry = async (id: string) => {
    if (user) {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const token = sessionData?.session?.access_token;
        const resp = await fetch(`/api/trips/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token || ''}`,
          },
        });
        if (!resp.ok && resp.status !== 204) {
          toast.error('Fehler beim Löschen');
          return;
        }
      } catch {
        toast.error('Fehler beim Löschen');
        return;
      }
    }
    setCountries(countries.filter((c) => c.id !== id));
    toast.success('Reise gelöscht');
  };

  const handleSignOut = async () => {
    await signOut();
    setCountries(mockCountries);
    toast.success('Erfolgreich abgemeldet');
  };

  const totalTrips = countries.length;
  const totalTodos = countries.reduce((sum, c) => sum + c.todos.length, 0);
  const completedTodos = countries.reduce((sum, c) => sum + c.todos.filter((t) => t.completed).length, 0);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
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

          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <User className="h-6 w-6" />
                <span className="text-sm font-medium uppercase tracking-wide opacity-80">
                  {user ? 'Mein Profil' : 'Gast-Modus'}
                </span>
              </div>
              <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
                {user ? `Hallo, ${profile?.display_name || user.email?.split('@')[0]}!` : 'Meine Reisen'}
              </h1>
              <p className="text-primary-foreground/80 text-lg max-w-2xl">
                {user 
                  ? 'Verwalte deine geplanten Reisen und behalte den Überblick'
                  : 'Melde dich an, um deine Reisen zu speichern und überall darauf zuzugreifen'
                }
              </p>
            </div>

            {user ? (
              <Button 
                variant="secondary" 
                onClick={handleSignOut}
                className="self-start"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Abmelden
              </Button>
            ) : (
              <Button 
                variant="secondary" 
                onClick={() => setAuthDialogOpen(true)}
                className="self-start"
              >
                <User className="h-4 w-4 mr-2" />
                Anmelden / Registrieren
              </Button>
            )}
          </div>
        </section>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="rounded-xl bg-card p-5 shadow-card">
            <div className="flex items-center gap-3 mb-2">
              <MapPin className="h-5 w-5 text-primary" />
              <h3 className="font-medium">Geplante Reisen</h3>
            </div>
            <p className="text-3xl font-bold">{totalTrips}</p>
          </div>
          <div className="rounded-xl bg-card p-5 shadow-card">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="h-5 w-5 text-primary" />
              <h3 className="font-medium">Aufgaben erledigt</h3>
            </div>
            <p className="text-3xl font-bold">{completedTodos} <span className="text-lg text-muted-foreground">/ {totalTodos}</span></p>
          </div>
          <div className="rounded-xl bg-card p-5 shadow-card">
            <div className="flex items-center gap-3 mb-2">
              <Settings className="h-5 w-5 text-primary" />
              <h3 className="font-medium">Bearbeitungsmodus</h3>
            </div>
            <Button
              variant={editMode ? "default" : "outline"}
              onClick={() => setEditMode(!editMode)}
              className="mt-1"
            >
              <Edit2 className="h-4 w-4 mr-2" />
              {editMode ? 'Fertig' : 'Bearbeiten'}
            </Button>
          </div>
        </div>

        {/* Countries list */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-2xl font-semibold">Meine Destinationen</h2>
            <Button variant="outline" onClick={() => setAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Reise hinzufügen
            </Button>
          </div>

          {loadingTrips ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {countries.map((country) => {
                const completedCount = country.todos.filter((t) => t.completed).length;
                const progress = country.todos.length > 0 ? Math.round((completedCount / country.todos.length) * 100) : 0;

                return (
                  <div
                    key={country.id}
                    className={cn(
                      "group relative rounded-xl bg-card shadow-card overflow-hidden transition-all duration-300",
                      editMode && "ring-2 ring-primary/20"
                    )}
                  >
                    <div className="relative h-40 overflow-hidden">
                      <img
                        src={country.imageUrl}
                        alt={country.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent" />
                      <div className="absolute bottom-4 left-4 text-primary-foreground">
                        <h3 className="font-display text-xl font-semibold">{country.name}</h3>
                        <p className="text-sm opacity-80">
                          {format(new Date(country.startDate), 'dd. MMM', { locale: de })} – {format(new Date(country.endDate), 'dd. MMM', { locale: de })}
                        </p>
                      </div>
                      {editMode && (
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-3 right-3 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleDeleteCountry(country.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline">{country.code}</Badge>
                        <span className="text-sm font-medium text-primary">{progress}% erledigt</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground">
                        {completedCount} von {country.todos.length} Aufgaben
                      </p>
                    </div>
                  </div>
                );
              })}

              {/* Add new card */}
              <button 
                onClick={() => setAddDialogOpen(true)}
                className="flex items-center justify-center rounded-xl border-2 border-dashed border-border h-64 hover:border-primary hover:bg-primary/5 transition-colors group"
              >
                <div className="text-center">
                  <Plus className="h-10 w-10 mx-auto text-muted-foreground group-hover:text-primary transition-colors" />
                  <p className="mt-2 text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
                    Neue Reise planen
                  </p>
                </div>
              </button>
            </div>
          )}

          <AddCountryDialog
            open={addDialogOpen}
            onOpenChange={setAddDialogOpen}
            onAdd={handleAddCountry}
          />
          <AuthDialog
            open={authDialogOpen}
            onOpenChange={setAuthDialogOpen}
          />
        </section>

        {/* Settings section */}
        <section className="mt-16">
          <h2 className="font-display text-2xl font-semibold mb-6 flex items-center gap-2">
            <Settings className="h-6 w-6" />
            Einstellungen
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-xl bg-card p-6 shadow-card">
              <h3 className="font-medium mb-4">Profil-Informationen</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Name</span>
                  <span>{user ? (profile?.display_name || 'Nicht angegeben') : 'Gast'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">E-Mail</span>
                  <span>{user?.email || 'Nicht angemeldet'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Währung</span>
                  <span>EUR (€)</span>
                </div>
              </div>
            </div>
            <div className="rounded-xl bg-card p-6 shadow-card">
              <h3 className="font-medium mb-4">Konto</h3>
              {user ? (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Du bist angemeldet und deine Reisen werden automatisch gespeichert.
                  </p>
                  <Button variant="outline" onClick={handleSignOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Abmelden
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Melde dich an, um deine Reisen zu speichern und von überall darauf zuzugreifen.
                  </p>
                  <Button onClick={() => setAuthDialogOpen(true)}>
                    <User className="h-4 w-4 mr-2" />
                    Jetzt anmelden
                  </Button>
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
