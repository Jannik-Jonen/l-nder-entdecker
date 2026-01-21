import { useState } from 'react';
import { Header } from '@/components/Header';
import { mockCountries } from '@/data/mockData';
import { Country } from '@/types/travel';
import { User, MapPin, Calendar, Settings, Plus, Trash2, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { AddCountryDialog } from '@/components/AddCountryDialog';

const Profile = () => {
  const [countries, setCountries] = useState<Country[]>(mockCountries);
  const [editMode, setEditMode] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const handleAddCountry = (newCountry: Country) => {
    setCountries([...countries, newCountry]);
  };

  const totalTrips = countries.length;
  const totalTodos = countries.reduce((sum, c) => sum + c.todos.length, 0);
  const completedTodos = countries.reduce((sum, c) => sum + c.todos.filter((t) => t.completed).length, 0);

  const handleDeleteCountry = (id: string) => {
    setCountries(countries.filter((c) => c.id !== id));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8">
        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-2xl gradient-hero p-8 md:p-12 text-primary-foreground mb-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-foreground/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <User className="h-6 w-6" />
              <span className="text-sm font-medium uppercase tracking-wide opacity-80">Mein Profil</span>
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">Meine Reisen</h1>
            <p className="text-primary-foreground/80 text-lg max-w-2xl">
              Verwalte deine geplanten Reisen, bearbeite Details und behalte den Überblick
            </p>
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

          <AddCountryDialog
            open={addDialogOpen}
            onOpenChange={setAddDialogOpen}
            onAdd={handleAddCountry}
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
                  <span>Reisender</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Heimatflughafen</span>
                  <span>Frankfurt (FRA)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Währung</span>
                  <span>EUR (€)</span>
                </div>
              </div>
            </div>
            <div className="rounded-xl bg-card p-6 shadow-card">
              <h3 className="font-medium mb-4">Benachrichtigungen</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Countdown-Erinnerungen</span>
                  <Badge variant="secondary">Aktiv</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Aufgaben-Erinnerungen</span>
                  <Badge variant="secondary">Aktiv</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Wetter-Updates</span>
                  <Badge variant="outline">Inaktiv</Badge>
                </div>
              </div>
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