import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Destination } from '@/types/travel';
import { Calendar, DollarSign, Users } from 'lucide-react';

interface PlanTripDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  destination: Destination | null;
  onConfirm: (data: TripPlanData) => void;
}

export interface TripPlanData {
  startDate: string;
  endDate: string;
  dailyBudget: number;
  peopleCount: number;
}

export const PlanTripDialog = ({ open, onOpenChange, destination, onConfirm }: PlanTripDialogProps) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [dailyBudget, setDailyBudget] = useState('');
  const [peopleCount, setPeopleCount] = useState('1');
  const [dateError, setDateError] = useState<string | null>(null);

  useEffect(() => {
    if (open && destination) {
      // Default to next month
      const start = new Date();
      start.setMonth(start.getMonth() + 1);
      const end = new Date(start);
      end.setDate(end.getDate() + 7); // 1 week default

      setStartDate(start.toISOString().split('T')[0]);
      setEndDate(end.toISOString().split('T')[0]);
      setDailyBudget(destination.averageDailyCost.toString());
      setPeopleCount('1');
      setDateError(null);
    }
  }, [open, destination]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate) return;
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end < start) {
      setDateError('Das Enddatum darf nicht vor dem Startdatum liegen.');
      return;
    }
    setDateError(null);

    onConfirm({
      startDate,
      endDate,
      dailyBudget: Number(dailyBudget) || 0,
      peopleCount: Math.max(1, Number(peopleCount) || 1),
    });
  };

  if (!destination) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Reise nach {destination.name} planen</DialogTitle>
          <DialogDescription>
            Wann möchtest du reisen und wie hoch ist dein Budget?
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start">Startdatum</Label>
              <div className="relative">
                <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="start"
                  type="date"
                  className="pl-9"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="end">Enddatum</Label>
              <div className="relative">
                <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="end"
                  type="date"
                  className="pl-9"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
          {dateError && (
            <p className="text-xs text-destructive">{dateError}</p>
          )}

          <div className="space-y-2">
            <Label htmlFor="budget">Tagesbudget (€)</Label>
            <div className="relative">
              <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="budget"
                type="number"
                min="0"
                className="pl-9"
                value={dailyBudget}
                onChange={(e) => setDailyBudget(e.target.value)}
                placeholder="100"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Empfohlen für {destination.name}: ~{destination.averageDailyCost}€
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="people">Personen</Label>
            <div className="relative">
              <Users className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="people"
                type="number"
                min="1"
                className="pl-9"
                value={peopleCount}
                onChange={(e) => setPeopleCount(e.target.value)}
                placeholder="1"
                required
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Für Packtipps und Checklisten berücksichtigen wir die Personenanzahl.
            </p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Abbrechen
            </Button>
            <Button type="submit">Reise erstellen</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
