import { useState } from 'react';
import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { CountryCard } from '@/components/CountryCard';
import { CountryDetail } from '@/components/CountryDetail';
import { mockTrip } from '@/data/mockData';
import { Country } from '@/types/travel';

const Index = () => {
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

      {/* Footer */}
      <footer className="border-t border-border mt-16 py-8">
        <div className="container text-center text-sm text-muted-foreground">
          <p>
            Exploarn – Deine zentrale Reiseübersicht für stressfreie Planung
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
