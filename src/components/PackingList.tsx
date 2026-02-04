import { useState } from 'react';
import { PackingItem, packingCategoryLabels, packingCategoryIcons, PeopleBreakdown } from '@/types/travel';
import { Plus, Trash2, Check, Luggage } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface PackingListProps {
  items: PackingItem[];
  onToggle: (id: string) => void;
  onAdd: (name: string, category: PackingItem['category'], quantity?: number) => void;
  onDelete: (id: string) => void;
  peopleBreakdown?: PeopleBreakdown;
  tripDays?: number;
}

const defaultSuggestions: Record<PackingItem['category'], string[]> = {
  clothing: ['T-Shirts', 'Hosen', 'Unterwäsche', 'Socken', 'Jacke', 'Regenjacke', 'Schuhe', 'Badekleidung'],
  toiletries: ['Zahnbürste', 'Zahnpasta', 'Shampoo', 'Sonnencreme', 'Deo', 'Medikamente'],
  electronics: ['Handy-Ladegerät', 'Powerbank', 'Kopfhörer', 'Kamera', 'Adapter'],
  documents: ['Reisepass', 'Visum', 'Flugtickets', 'Buchungsbestätigungen', 'Versicherung'],
  other: ['Wasserflasche', 'Reisekissen', 'Snacks', 'Buch', 'Reiseführer'],
};

export const PackingList = ({ items, onToggle, onAdd, onDelete, peopleBreakdown = { adults: 1, children: 0, babies: 0 }, tripDays = 7 }: PackingListProps) => {
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<PackingItem['category']>('clothing');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [newItemQty, setNewItemQty] = useState<number>(1);

  const replaceUmlauts = (s: string) =>
    s
      .replace(/ä/g, 'ae')
      .replace(/ö/g, 'oe')
      .replace(/ü/g, 'ue')
      .replace(/ß/g, 'ss');
  const baseNormalize = (raw: string) =>
    replaceUmlauts(raw.toLowerCase().trim()).replace(/[-_]/g, ' ').replace(/\s+/g, ' ').replace(/\W+/g, '');
  const levenshtein = (a: string, b: string) => {
    const m = a.length;
    const n = b.length;
    const dp = Array.from({ length: m + 1 }, () => new Array<number>(n + 1).fill(0));
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
      }
    }
    return dp[m][n];
  };
  const canonicalize = (name: string, category: PackingItem['category']) => {
    const n = baseNormalize(name);
    if (category === 'clothing') {
      const candidates = ['tshirts', 'socken', 'unterwaesche', 'hosen', 'jacke', 'regenjacke', 'schuhe', 'badekleidung'];
      let best = n;
      let bestScore = Number.POSITIVE_INFINITY;
      for (const c of candidates) {
        const d = levenshtein(n, c);
        if (d < bestScore) {
          bestScore = d;
          best = c;
        }
      }
      if (bestScore <= 2) return best;
    }
    if (category === 'documents') {
      if (/^dokumente/.test(n) || /^documents/.test(n)) return 'dokumente';
      if (/^dokumente(fuer|fur)\d+personen?$/.test(n)) return 'dokumente';
    }
    return n;
  };

  const categories = Object.keys(packingCategoryLabels) as PackingItem['category'][];
  const packedCount = items.filter((item) => item.packed).length;
  const totalCount = items.length;

  const effectivePeople = Math.max(peopleBreakdown.adults + peopleBreakdown.children + peopleBreakdown.babies, 1);
  const suggestQuantity = (name: string, category: PackingItem['category']) => {
    if (category === 'clothing') {
      if (/t[-\s]?shirts?|shirts?/i.test(name)) return effectivePeople * Math.max(tripDays, 1);
      if (/socken/i.test(name)) return effectivePeople * Math.max(tripDays, 1);
      if (/unterw(ä|ae)sche/i.test(name)) return effectivePeople * Math.max(tripDays, 1);
      return effectivePeople;
    }
    return 1;
  };

  const getSuggestionsForCategory = (cat: PackingItem['category']) => {
    if (cat === 'documents') {
      return [`Dokumente für ${effectivePeople} Person(en)`];
    }
    return defaultSuggestions[cat];
  };

  const handleAddItem = () => {
    if (newItemName.trim()) {
      const qty = newItemQty > 0 ? newItemQty : suggestQuantity(newItemName.trim(), newItemCategory);
      onAdd(newItemName.trim(), newItemCategory, qty);
      setNewItemName('');
      setNewItemQty(1);
    }
  };

  const handleAddSuggestion = (name: string, category: PackingItem['category']) => {
    if (!items.some((item) => canonicalize(item.name, item.category) === canonicalize(name, category))) {
      const qty = suggestQuantity(name, category);
      onAdd(name, category, qty);
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
                {getSuggestionsForCategory(cat).map((suggestion) => {
                  const isAdded = items.some((item) => canonicalize(item.name, item.category) === canonicalize(suggestion, cat));
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
      <div className="flex gap-2 items-center">
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
        <Input
          type="number"
          value={String(newItemQty)}
          onChange={(e) => {
            const val = Number(e.target.value);
            setNewItemQty(Number.isNaN(val) ? 1 : Math.max(val, 1));
          }}
          className="w-20"
          placeholder="Anzahl"
        />
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
                <span className="text-xs text-muted-foreground">
                  Vorschläge auf Basis der Personenanzahl
                </span>
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
