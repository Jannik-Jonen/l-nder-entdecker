import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Country } from '@/types/travel';
import { defaultTodos } from '@/data/mockData';
import { MapPin, Calendar, DollarSign, ImageIcon } from 'lucide-react';

interface AddCountryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (country: Country) => void;
}

export const AddCountryDialog = ({ open, onOpenChange, onAdd }: AddCountryDialogProps) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [dailyCost, setDailyCost] = useState('');
  const [currency, setCurrency] = useState('EUR');
  const [imageUrl, setImageUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !startDate || !endDate) return;

    const newCountry: Country = {
      id: `country-${Date.now()}`,
      name,
      code: code.toUpperCase() || name.substring(0, 2).toUpperCase(),
      imageUrl: imageUrl || `https://images.unsplash.com/photo-1488085061387-422e29b40080?w=800&q=80`,
      startDate,
      endDate,
      dailyCost: parseFloat(dailyCost) || 100,
      currency,
      todos: defaultTodos.map((todo, idx) => ({
        ...todo,
        id: `${name.toLowerCase()}-${idx}`,
        completed: false,
      })),
      attractions: [],
      hotels: [],
      restaurants: [],
      flights: [],
      weather: {
        averageTemp: 20,
        condition: 'sunny',
        bestTimeToVisit: 'Ganzjährig',
        packingTips: ['Komfortable Kleidung', 'Reisedokumente'],
      },
    };

    onAdd(newCountry);
    resetForm();
    onOpenChange(false);
  };

  const resetForm = () => {
    setName('');
    setCode('');
    setStartDate('');
    setEndDate('');
    setDailyCost('');
    setCurrency('EUR');
    setImageUrl('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Neue Reise hinzufügen
          </DialogTitle>
          <DialogDescription>
            Füge ein neues Reiseziel zu deiner Planung hinzu
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Destination *</Label>
              <Input
                id="name"
                placeholder="z.B. Japan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="code">Ländercode</Label>
              <Input
                id="code"
                placeholder="z.B. JP"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                maxLength={3}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate" className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Startdatum *
              </Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate" className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Enddatum *
              </Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dailyCost" className="flex items-center gap-1">
                <DollarSign className="h-3 w-3" />
                Tagesbudget
              </Label>
              <Input
                id="dailyCost"
                type="number"
                placeholder="100"
                value={dailyCost}
                onChange={(e) => setDailyCost(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Währung</Label>
              <Input
                id="currency"
                placeholder="EUR"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl" className="flex items-center gap-1">
              <ImageIcon className="h-3 w-3" />
              Bild-URL (optional)
            </Label>
            <Input
              id="imageUrl"
              type="url"
              placeholder="https://..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Abbrechen
            </Button>
            <Button type="submit">
              Reise hinzufügen
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
