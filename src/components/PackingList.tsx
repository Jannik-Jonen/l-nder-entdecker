import { useState } from 'react';
import { PackingItem, packingCategoryLabels, packingCategoryIcons } from '@/types/travel';
import { Plus, Trash2, Check, Luggage } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface PackingListProps {
  items: PackingItem[];
  onToggle: (id: string) => void;
  onAdd: (name: string, category: PackingItem['category']) => void;
  onDelete: (id: string) => void;
}

const defaultSuggestions: Record<PackingItem['category'], string[]> = {
  clothing: ['T-Shirts', 'Hosen', 'Unterwäsche', 'Socken', 'Jacke', 'Regenjacke', 'Schuhe', 'Badekleidung'],
  toiletries: ['Zahnbürste', 'Zahnpasta', 'Shampoo', 'Sonnencreme', 'Deo', 'Medikamente'],
  electronics: ['Handy-Ladegerät', 'Powerbank', 'Kopfhörer', 'Kamera', 'Adapter'],
  documents: ['Reisepass', 'Visum', 'Flugtickets', 'Buchungsbestätigungen', 'Versicherung'],
  other: ['Wasserflasche', 'Reisekissen', 'Snacks', 'Buch', 'Reiseführer'],
};

export const PackingList = ({ items, onToggle, onAdd, onDelete }: PackingListProps) => {
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<PackingItem['category']>('clothing');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const categories = Object.keys(packingCategoryLabels) as PackingItem['category'][];
  const packedCount = items.filter((item) => item.packed).length;
  const totalCount = items.length;

  const handleAddItem = () => {
    if (newItemName.trim()) {
      onAdd(newItemName.trim(), newItemCategory);
      setNewItemName('');
    }
  };

  const handleAddSuggestion = (name: string, category: PackingItem['category']) => {
    if (!items.some((item) => item.name.toLowerCase() === name.toLowerCase())) {
      onAdd(name, category);
    }
  };

  const groupedItems = categories.reduce((acc, cat) => {
    acc[cat] = items.filter((item) => item.category === cat);
    return acc;
  }, {} as Record<PackingItem['category'], PackingItem[]>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Luggage className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold">Packliste</h3>
            <p className="text-sm text-muted-foreground">{packedCount} von {totalCount} gepackt</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => setShowSuggestions(!showSuggestions)}>
          {showSuggestions ? 'Ausblenden' : 'Vorschläge'}
        </Button>
      </div>

      {/* Suggestions */}
      {showSuggestions && (
        <div className="rounded-lg bg-muted/50 p-4 space-y-3 animate-fade-up">
          <p className="text-sm font-medium">Klicke auf einen Vorschlag, um ihn hinzuzufügen:</p>
          {categories.map((cat) => (
            <div key={cat}>
              <p className="text-xs font-medium text-muted-foreground mb-1">
                {packingCategoryIcons[cat]} {packingCategoryLabels[cat]}
              </p>
              <div className="flex flex-wrap gap-1">
                {defaultSuggestions[cat].map((suggestion) => {
                  const isAdded = items.some((item) => item.name.toLowerCase() === suggestion.toLowerCase());
                  return (
                    <button
                      key={suggestion}
                      onClick={() => handleAddSuggestion(suggestion, cat)}
                      disabled={isAdded}
                      className={cn(
                        "px-2 py-1 text-xs rounded-full transition-colors",
                        isAdded
                          ? "bg-primary/20 text-primary cursor-default"
                          : "bg-background border border-border hover:border-primary hover:text-primary"
                      )}
                    >
                      {isAdded && <Check className="inline h-3 w-3 mr-1" />}
                      {suggestion}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add new item */}
      <div className="flex gap-2">
        <Input
          placeholder="Neuer Gegenstand..."
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
          className="flex-1"
        />
        <Select value={newItemCategory} onValueChange={(v) => setNewItemCategory(v as PackingItem['category'])}>
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {packingCategoryIcons[cat]} {packingCategoryLabels[cat]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={handleAddItem} disabled={!newItemName.trim()}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Grouped items */}
      <div className="space-y-4">
        {categories.map((cat) => {
          const catItems = groupedItems[cat];
          if (catItems.length === 0) return null;
          return (
            <div key={cat}>
              <p className="text-sm font-medium mb-2 flex items-center gap-2">
                <span>{packingCategoryIcons[cat]}</span>
                {packingCategoryLabels[cat]}
                <Badge variant="secondary" className="text-xs">
                  {catItems.filter((i) => i.packed).length}/{catItems.length}
                </Badge>
              </p>
              <div className="space-y-1">
                {catItems.map((item) => (
                  <div
                    key={item.id}
                    className={cn(
                      "flex items-center justify-between p-2 rounded-lg transition-colors",
                      item.packed ? "bg-primary/5" : "bg-muted/50"
                    )}
                  >
                    <button
                      onClick={() => onToggle(item.id)}
                      className="flex items-center gap-2 flex-1 text-left"
                    >
                      <div
                        className={cn(
                          "flex h-5 w-5 items-center justify-center rounded border transition-colors",
                          item.packed
                            ? "bg-primary border-primary text-primary-foreground"
                            : "border-border"
                        )}
                      >
                        {item.packed && <Check className="h-3 w-3" />}
                      </div>
                      <span className={cn("text-sm", item.packed && "line-through text-muted-foreground")}>
                        {item.name}
                      </span>
                    </button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => onDelete(item.id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};