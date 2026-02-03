import { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { CountryCard } from '@/components/CountryCard';
import { CountryDetail } from '@/components/CountryDetail';
import { LandingHero } from '@/components/LandingHero';
import { InspirationPreview } from '@/components/InspirationPreview';
import { mockTrip, defaultTodos } from '@/data/mockData';
import { Country, Trip } from '@/types/travel';
import { useAuth } from '@/hooks/useAuth';
import { guidePosts } from '@/data/mockData';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowRight, Plus, Map as MapIcon, Calendar, Sparkles, Globe } from 'lucide-react';
import { WorldMap } from '@/components/WorldMap';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

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
}

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [trip, setTrip] = useState<Trip>({
    id: 'my-trip',
    name: 'Meine Reiseplanung',
    countries: [],
    createdAt: new Date().toISOString()
  });
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [isLoadingTrips, setIsLoadingTrips] = useState(false);
  const [userName, setUserName] = useState<string>('');

  

  const fetchProfile = useCallback(async () => {
    if (!user) return;
    try {
      const { data } = await supabase
        .from('profiles')
        .select('display_name')
        .eq('user_id', user.id)
        .single();
      if (data?.display_name) {
        setUserName(data.display_name);
      }
    } catch (e) {
      // ignore
    }
  }, [user]);

  const fetchUserTrips = useCallback(async () => {
    if (!user) return;
    setIsLoadingTrips(true);
    try {
      const pendingPlanRaw = localStorage.getItem('pendingPlan');
      if (pendingPlanRaw) {
        try {
          const { destination, planData } = JSON.parse(pendingPlanRaw);
          let code = destination.countryCode || 'XX';
          try {
            const resp = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(destination.name)}&limit=1&addressdetails=1&accept-language=de`);
            const arr = await resp.json();
            const first = Array.isArray(arr) && arr[0];
            const cc = first?.address?.country_code || first?.country_code || null;
            if (cc && typeof cc === 'string') {
              code = cc.toUpperCase();
            }
          } catch { /* ignore */ }
          const startIso = new Date(planData.startDate).toISOString();
          const endIso = new Date(planData.endDate).toISOString();
          const { data: inserted, error: insertError } = await supabase
            .from('saved_trips')
            .insert({
              user_id: user.id,
              destination_name: destination.name,
              destination_code: code,
              image_url: destination.imageUrl,
              daily_budget: planData.dailyBudget,
              currency: destination.currency || 'EUR',
              start_date: startIso,
              end_date: endIso,
              notes: JSON.stringify({
                peopleCount: planData.peopleCount,
                todos: defaultTodos,
              }),
            })
            .select('id')
            .limit(1);
          if (insertError) {
            toast.error('Fehler beim Hinzufügen der Reise');
          } else if (inserted && inserted[0]?.id) {
            const newId = inserted[0].id as string;
            toast.success('Reise hinzugefügt');
            localStorage.removeItem('pendingPlan');
            navigate(`/?trip_id=${encodeURIComponent(newId)}`, { replace: true });
          } else {
            localStorage.removeItem('pendingPlan');
          }
        } catch {
          localStorage.removeItem('pendingPlan');
        }
      }
      const { data, error } = await supabase
        .from('saved_trips')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        let mappedCountries: Country[] = (data as SavedTripRow[])
          .filter(row => row.user_id === user.id) // Client-side security filter
          .map((row) => ({
            id: row.id,
            name: row.destination_name,
            code: row.destination_code || 'XX',
            imageUrl: row.image_url || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80',
            startDate: row.start_date || new Date().toISOString(),
            endDate: row.end_date || new Date().toISOString(),
            dailyCost: Number(row.daily_budget) || 100,
            currency: row.currency || 'EUR',
            todos: defaultTodos.map((t, i) => ({ ...t, id: `${row.id}-${i}` })),
            attractions: [],
            hotels: [],
            restaurants: [],
            flights: [],
            weather: { averageTemp: 20, condition: 'sunny', bestTimeToVisit: '', packingTips: [] },
          }));
        const withCodes = await Promise.all(
          mappedCountries.map(async (c) => {
            if (c.code !== 'XX') return c;
            try {
              const resp = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(c.name)}&limit=1&addressdetails=1&accept-language=de`);
              const arr = await resp.json();
              const first = Array.isArray(arr) && arr[0];
              const cc = first?.address?.country_code || first?.country_code || null;
              if (cc && typeof cc === 'string') {
                return { ...c, code: cc.toUpperCase() };
              }
            } catch { void 0; }
            return c;
          })
        );
        mappedCountries = withCodes.sort(
          (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
        );
        setTrip(prev => ({ ...prev, countries: mappedCountries }));
      }
    } catch (error) {
      console.error('Error fetching trips:', error);
      toast.error('Fehler beim Laden der Reisen');
    } finally {
      setIsLoadingTrips(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchUserTrips();
      fetchProfile();
    } else {
      setTrip((prev) => ({ ...prev, countries: [] }));
    }
  }, [user, fetchUserTrips, fetchProfile]);

  useEffect(() => {
    const tripId = searchParams.get('trip_id');
    if (tripId && trip.countries.length > 0) {
      const found = trip.countries.find((c) => c.id === tripId);
      if (found) {
        setSelectedCountry(found);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('trip_id');
      window.history.replaceState({}, document.title, `${window.location.pathname}${newParams.toString() ? `?${newParams.toString()}` : ''}`);
    }
  }, [trip.countries, searchParams]);

  const totalTasks = trip.countries.reduce((acc, c) => acc + c.todos.length, 0);
  const completedTasks = trip.countries.reduce(
    (acc, c) => acc + c.todos.filter((t) => t.completed).length,
    0
  );

  const handleToggleTodo = (todoId: string) => {
    if (!selectedCountry) return;

    setTrip((prev) => ({
      ...prev,
      countries: prev.countries.map((country) => {
        if (country.id !== selectedCountry.id) return country;
        return {
          ...country,
          todos: country.todos.map((todo) =>
            todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
          ),
        };
      }),
    }));

    setSelectedCountry((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        todos: prev.todos.map((todo) =>
          todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
        ),
      };
    });
  };

  const handleSelectCountry = (country: Country) => {
    setSelectedCountry(country);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setSelectedCountry(null);
  };

  // Keep selected country in sync with trip data
  const currentCountry = selectedCountry
    ? trip.countries.find((c) => c.id === selectedCountry.id) || selectedCountry
    : null;

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-20 text-center">
          <div className="animate-pulse text-muted-foreground">Laden...</div>
        </div>
      </div>
    );
  }

  // Show landing page for non-authenticated users
  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <LandingHero />
          <section className="py-8">
            <div className="container">
              <WorldMap />
            </div>
          </section>
          <InspirationPreview />
          
          <section className="py-12">
            <div className="container">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-2xl font-semibold">Orts-Guides & Beiträge</h2>
                <Link
                  to="/guides"
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80"
                >
                  Alle Guides ansehen
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {guidePosts.slice(0, 3).map((p) => (
                  <Link
                    key={p.id}
                    to={`/guides/posts/${p.id}`}
                    className="group relative overflow-hidden rounded-xl bg-card border border-border hover:shadow-card-hover transition-all"
                  >
                    <div className="relative h-40">
                      <img
                        src={p.imageUrl}
                        alt={p.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).src = 'https://via.placeholder.com/800x480?text=Bild+nicht+verfügbar'; }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="font-display text-xl font-semibold text-white">{p.title}</h3>
                        <p className="text-white/80 text-sm line-clamp-2">{p.excerpt}</p>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{p.tags.join(' • ')}</span>
                        <span>Weiterlesen</span>
                      </div>
                    </div>
                  </Link>
                ))}
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
  }

  // Authenticated user dashboard
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        {currentCountry ? (
          <CountryDetail
            country={currentCountry}
            onBack={handleBack}
            onToggleTodo={handleToggleTodo}
          />
        ) : (
          <div className="space-y-12">
            {/* Welcome Section */}
            <section className="flex flex-col md:flex-row gap-8 items-start justify-between">
              <div className="w-full md:w-2/3">
                <h1 className="font-display text-3xl md:text-4xl font-bold mb-3">
                  Willkommen zurück{userName ? `, ${userName}` : ''}! 👋
                </h1>
                <p className="text-muted-foreground text-lg mb-6">
                  Hier ist deine Kommandozentrale. Wohin soll die nächste Reise gehen?
                </p>
                <HeroSection
                  tripName={trip.name}
                  totalCountries={trip.countries.length}
                  completedTasks={completedTasks}
                  totalTasks={totalTasks}
                />
              </div>
              
              {/* Quick Actions Card */}
              <div className="w-full md:w-1/3 bg-card border border-border rounded-2xl p-6 shadow-sm">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Schnellzugriff
                </h3>
                <div className="space-y-3">
                  <Link to="/inspiration">
                    <Button className="w-full justify-start" variant="default">
                      <Plus className="mr-2 h-4 w-4" />
                      Neue Reise planen
                    </Button>
                  </Link>
                  <Link to="/guides">
                    <Button className="w-full justify-start" variant="outline">
                      <MapIcon className="mr-2 h-4 w-4" />
                      Guides entdecken
                    </Button>
                  </Link>
                  <Link to="/profile">
                    <Button className="w-full justify-start" variant="ghost">
                      <Calendar className="mr-2 h-4 w-4" />
                      Mein Profil & Einstellungen
                    </Button>
                  </Link>
                </div>
              </div>
            </section>

            {/* World Map Section - Authenticated View */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-2xl font-semibold flex items-center gap-2">
                  <Globe className="h-6 w-6 text-primary" />
                  Entdecke die Welt
                </h2>
              </div>
              <div className="bg-card/50 border border-border rounded-2xl p-1 shadow-sm overflow-hidden">
                 <WorldMap />
              </div>
            </section>

            {/* Trips Grid */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-2xl font-semibold">
                  Deine geplanten Reisen
                </h2>
                {trip.countries.length > 0 && (
                  <Link to="/inspiration" className="text-primary hover:underline text-sm font-medium">
                    + Weitere hinzufügen
                  </Link>
                )}
              </div>
              
              {trip.countries.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {trip.countries.map((country, index) => (
                    <CountryCard
                      key={country.id}
                      country={country}
                      onClick={() => handleSelectCountry(country)}
                      index={index}
                    />
                  ))}
                  
                  {/* Add new trip card - Mini version */}
                  <Link to="/inspiration" className="flex items-center justify-center rounded-xl border-2 border-dashed border-border h-full min-h-[300px] hover:border-primary hover:bg-primary/5 transition-colors group">
                    <div className="text-center">
                      <Plus className="h-10 w-10 mx-auto text-muted-foreground group-hover:text-primary transition-colors" />
                      <p className="mt-2 text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
                        Neue Reise planen
                      </p>
                    </div>
                  </Link>
                </div>
              ) : (
                <div className="text-center py-16 bg-muted/30 rounded-xl border border-dashed border-border">
                  <div className="bg-background w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <MapIcon className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">Noch keine Reisen geplant</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Deine Reiseliste ist noch leer. Lass dich inspirieren und starte deine erste Planung!
                  </p>
                  <Link 
                    to="/inspiration" 
                    className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Erste Reise planen
                  </Link>
                </div>
              )}
            </section>
          </div>
        )}
      </main>

      <footer className="border-t border-border mt-16 py-8">
        <div className="container text-center text-sm text-muted-foreground">
          <p>GlobeDetour – Dein Begleiter für unvergessliche Reisen</p>
        </div>
      </footer>
    </div>
  );
};


export default Index;
