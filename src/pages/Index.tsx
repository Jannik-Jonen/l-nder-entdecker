import { useState } from 'react';
import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { CountryCard } from '@/components/CountryCard';
import { CountryDetail } from '@/components/CountryDetail';
import { LandingHero } from '@/components/LandingHero';
import { InspirationPreview } from '@/components/InspirationPreview';
import { mockTrip } from '@/data/mockData';
import { Country } from '@/types/travel';
import { useAuth } from '@/hooks/useAuth';

const Index = () => {
  const { user, loading } = useAuth();
  const [trip, setTrip] = useState(mockTrip);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);

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
          <InspirationPreview />
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
          <>
            <HeroSection
              tripName={trip.name}
              totalCountries={trip.countries.length}
              completedTasks={completedTasks}
              totalTasks={totalTasks}
            />

            <section>
              <h2 className="font-display text-2xl font-semibold mb-6">
                Überblick über alle geplanten Länder
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trip.countries.map((country, index) => (
                  <CountryCard
                    key={country.id}
                    country={country}
                    onClick={() => handleSelectCountry(country)}
                    index={index}
                  />
                ))}
              </div>
            </section>
          </>
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
