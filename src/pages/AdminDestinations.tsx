import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { supabaseUntyped } from '@/lib/supabase-untyped';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, MapPin, Globe, Palmtree, Building2, Mountain, Save, X, Loader2 } from 'lucide-react';
import { Destination } from '@/types/travel';
import { fetchDestinationsCatalog } from '@/services/travelData';

const typeIcons: Record<Destination['type'], React.ElementType> = {
  country: Globe,
  island: Palmtree,
  city: Building2,
  region: Mountain,
};

const typeLabels: Record<Destination['type'], string> = {
  country: 'Land',
  island: 'Insel',
  city: 'Stadt',
  region: 'Region',
};

type DestinationFormData = {
  name: string;
  country: string;
  country_code: string;
  type: 'country' | 'island' | 'city' | 'region';
  image_url: string;
  description: string;
  highlights: string;
  best_season: string;
  average_daily_cost: string;
  currency: string;
  visa_info: string;
  vaccination_info: string;
  health_safety_info: string;
  parent_id: string;
  coords_lat: string;
  coords_lon: string;
};

const emptyForm: DestinationFormData = {
  name: '',
  country: '',
  country_code: '',
  type: 'city',
  image_url: '',
  description: '',
  highlights: '',
  best_season: '',
  average_daily_cost: '',
  currency: 'EUR',
  visa_info: '',
  vaccination_info: '',
  health_safety_info: '',
  parent_id: '',
  coords_lat: '',
  coords_lon: '',
};

const AdminDestinations = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingRole, setCheckingRole] = useState(true);

  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<DestinationFormData>(emptyForm);
  const [saving, setSaving] = useState(false);

  // Check admin role from database
  useEffect(() => {
    const checkAdminRole = async () => {
      if (!user) {
        setIsAdmin(false);
        setCheckingRole(false);
        return;
      }
      try {
        const { data, error } = await supabase.rpc('has_role', {
          _user_id: user.id,
          _role: 'admin'
        });
        if (error) throw error;
        setIsAdmin(data === true);
      } catch (e) {
        console.error('Error checking admin role:', e);
        setIsAdmin(false);
      } finally {
        setCheckingRole(false);
      }
    };
    checkAdminRole();
  }, [user]);

  useEffect(() => {
    loadDestinations();
  }, []);

  const loadDestinations = async () => {
    setLoading(true);
    try {
      const data = await fetchDestinationsCatalog();
      setDestinations(data);
    } catch {
      toast.error('Fehler beim Laden der Destinationen');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (dest: Destination) => {
    setForm({
      name: dest.name,
      country: dest.country,
      country_code: dest.countryCode || '',
      type: dest.type,
      image_url: dest.imageUrl,
      description: dest.description,
      highlights: dest.highlights.join(', '),
      best_season: dest.bestSeason,
      average_daily_cost: String(dest.averageDailyCost),
      currency: dest.currency,
      visa_info: dest.visaInfo || '',
      vaccination_info: dest.vaccinationInfo || '',
      health_safety_info: dest.healthSafetyInfo || '',
      parent_id: dest.parentId || '',
      coords_lat: dest.coords?.lat?.toString() || '',
      coords_lon: dest.coords?.lon?.toString() || '',
    });
    setEditingId(dest.id);
    setShowForm(true);
  };

  const handleNew = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.country.trim()) {
      toast.error('Name und Land sind erforderlich');
      return;
    }

    setSaving(true);
    try {
      const highlights = form.highlights
        .split(',')
        .map((h) => h.trim())
        .filter((h) => h.length > 0);

      const payload = {
        name: form.name.trim(),
        country: form.country.trim(),
        country_code: form.country_code.trim().toUpperCase() || null,
        type: form.type,
        image_url: form.image_url.trim() || null,
        description: form.description.trim() || null,
        highlights: highlights.length > 0 ? highlights : null,
        best_season: form.best_season.trim() || null,
        average_daily_cost: form.average_daily_cost ? parseFloat(form.average_daily_cost) : null,
        currency: form.currency.trim() || 'EUR',
        visa_info: form.visa_info.trim() || null,
        vaccination_info: form.vaccination_info.trim() || null,
        health_safety_info: form.health_safety_info.trim() || null,
        parent_id: form.parent_id || null,
        coords_lat: form.coords_lat ? parseFloat(form.coords_lat) : null,
        coords_lon: form.coords_lon ? parseFloat(form.coords_lon) : null,
      };

      if (editingId) {
        const { error } = await supabaseUntyped
          .from('destinations')
          .update(payload)
          .eq('id', editingId);
        if (error) throw error;
        toast.success('Destination aktualisiert');
      } else {
        const { error } = await supabaseUntyped.from('destinations').insert(payload);
        if (error) throw error;
        toast.success('Destination erstellt');
      }

      handleCancel();
      loadDestinations();
    } catch (e) {
      toast.error('Speichern fehlgeschlagen');
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Destination wirklich löschen?')) return;

    try {
      const { error } = await supabaseUntyped.from('destinations').delete().eq('id', id);
      if (error) throw error;
      toast.success('Destination gelöscht');
      loadDestinations();
    } catch {
      toast.error('Löschen fehlgeschlagen');
    }
  };

  if (checkingRole) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-8 flex items-center justify-center">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Berechtigungen werden geprüft...</span>
          </div>
        </main>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-8">
          <div className="rounded-xl bg-destructive/10 border border-destructive p-6 text-center">
            <p className="text-destructive font-medium">Zugriff verweigert</p>
            <p className="text-muted-foreground text-sm mt-1">
              Diese Seite ist nur für Administratoren zugänglich.
            </p>
            <Button onClick={() => navigate('/')} variant="outline" className="mt-4">
              Zur Startseite
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        <section className="relative overflow-hidden rounded-2xl gradient-hero p-8 md:p-12 text-primary-foreground mb-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-foreground/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="h-6 w-6" />
              <span className="text-sm font-medium uppercase tracking-wide opacity-80">Admin</span>
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
              Destinationen verwalten
            </h1>
            <p className="text-primary-foreground/80 text-lg max-w-2xl">
              Erstelle und bearbeite die Destinationen für Inspiration und Guides.
            </p>
          </div>
        </section>

        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl font-semibold">
            {destinations.length} Destination{destinations.length !== 1 ? 'en' : ''}
          </h2>
          <Button onClick={handleNew} className="gap-2">
            <Plus className="h-4 w-4" />
            Neue Destination
          </Button>
        </div>

        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{editingId ? 'Destination bearbeiten' : 'Neue Destination'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Name *</label>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="z.B. Thailand"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Land *</label>
                  <Input
                    value={form.country}
                    onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
                    placeholder="z.B. Thailand"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Ländercode</label>
                  <Input
                    value={form.country_code}
                    onChange={(e) => setForm((f) => ({ ...f, country_code: e.target.value }))}
                    placeholder="z.B. TH"
                    maxLength={2}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Typ</label>
                  <Select
                    value={form.type}
                    onValueChange={(v) => setForm((f) => ({ ...f, type: v as DestinationFormData['type'] }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="country">Land</SelectItem>
                      <SelectItem value="island">Insel</SelectItem>
                      <SelectItem value="city">Stadt</SelectItem>
                      <SelectItem value="region">Region</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Bild-URL</label>
                  <Input
                    value={form.image_url}
                    onChange={(e) => setForm((f) => ({ ...f, image_url: e.target.value }))}
                    placeholder="https://..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Währung</label>
                  <Input
                    value={form.currency}
                    onChange={(e) => setForm((f) => ({ ...f, currency: e.target.value }))}
                    placeholder="EUR"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Ø Tagesbudget</label>
                  <Input
                    type="number"
                    value={form.average_daily_cost}
                    onChange={(e) => setForm((f) => ({ ...f, average_daily_cost: e.target.value }))}
                    placeholder="z.B. 50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Beste Reisezeit</label>
                  <Input
                    value={form.best_season}
                    onChange={(e) => setForm((f) => ({ ...f, best_season: e.target.value }))}
                    placeholder="z.B. November - Februar"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Parent-Destination</label>
                  <Select
                    value={form.parent_id}
                    onValueChange={(v) => setForm((f) => ({ ...f, parent_id: v === 'none' ? '' : v }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Keine (Wurzel)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Keine (Wurzel)</SelectItem>
                      {destinations
                        .filter((d) => d.id !== editingId)
                        .map((d) => (
                          <SelectItem key={d.id} value={d.id}>
                            {d.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 md:col-span-2 lg:col-span-3">
                  <label className="text-sm font-medium">Beschreibung</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[80px]"
                    placeholder="Kurze Beschreibung der Destination"
                  />
                </div>
                <div className="space-y-2 md:col-span-2 lg:col-span-3">
                  <label className="text-sm font-medium">Highlights (Kommagetrennt)</label>
                  <Input
                    value={form.highlights}
                    onChange={(e) => setForm((f) => ({ ...f, highlights: e.target.value }))}
                    placeholder="z.B. Tempel, Strände, Märkte, Nachtleben"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Visa-Info</label>
                  <Input
                    value={form.visa_info}
                    onChange={(e) => setForm((f) => ({ ...f, visa_info: e.target.value }))}
                    placeholder="z.B. Visumfrei bis 30 Tage"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Impfungen</label>
                  <Input
                    value={form.vaccination_info}
                    onChange={(e) => setForm((f) => ({ ...f, vaccination_info: e.target.value }))}
                    placeholder="z.B. Hepatitis A empfohlen"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Gesundheit & Sicherheit</label>
                  <Input
                    value={form.health_safety_info}
                    onChange={(e) => setForm((f) => ({ ...f, health_safety_info: e.target.value }))}
                    placeholder="z.B. Leitungswasser nicht trinkbar"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Breitengrad (Lat)</label>
                  <Input
                    type="number"
                    step="any"
                    value={form.coords_lat}
                    onChange={(e) => setForm((f) => ({ ...f, coords_lat: e.target.value }))}
                    placeholder="z.B. 13.7563"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Längengrad (Lon)</label>
                  <Input
                    type="number"
                    step="any"
                    value={form.coords_lon}
                    onChange={(e) => setForm((f) => ({ ...f, coords_lon: e.target.value }))}
                    placeholder="z.B. 100.5018"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button onClick={handleSave} disabled={saving} className="gap-2">
                  <Save className="h-4 w-4" />
                  {saving ? 'Speichern...' : 'Speichern'}
                </Button>
                <Button onClick={handleCancel} variant="outline" className="gap-2">
                  <X className="h-4 w-4" />
                  Abbrechen
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {loading ? (
          <div className="text-center text-muted-foreground py-8">Lade Destinationen...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {destinations.map((dest) => {
              const TypeIcon = typeIcons[dest.type];
              return (
                <Card key={dest.id} className="overflow-hidden">
                  <div className="relative h-32">
                    <img
                      src={dest.imageUrl}
                      alt={dest.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          'https://via.placeholder.com/800x480?text=Bild+fehlt';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-white">{dest.name}</h3>
                        <p className="text-white/80 text-xs">{dest.country}</p>
                      </div>
                      <Badge variant="secondary" className="bg-white/20 text-white">
                        <TypeIcon className="h-3 w-3 mr-1" />
                        {typeLabels[dest.type]}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <span>{dest.averageDailyCost} {dest.currency}/Tag</span>
                      <span>•</span>
                      <span>{dest.bestSeason || 'Ganzjährig'}</span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {dest.description || 'Keine Beschreibung'}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleEdit(dest)}
                        variant="outline"
                        size="sm"
                        className="gap-1 flex-1"
                      >
                        <Edit2 className="h-3 w-3" />
                        Bearbeiten
                      </Button>
                      <Button
                        onClick={() => handleDelete(dest.id)}
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {!loading && destinations.length === 0 && (
          <div className="rounded-xl border border-dashed border-border bg-muted/30 p-8 text-center">
            <MapPin className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">
              Noch keine Destinationen vorhanden. Erstelle die erste!
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDestinations;
