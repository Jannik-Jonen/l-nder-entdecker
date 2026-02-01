import * as React from "react"
import { Check, ChevronsUpDown, Search, MapPin, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { toast } from "sonner"

export interface LocationResult {
  name: string;
  lat: string;
  lon: string;
  countryCode: string;
  type: string;
  displayName: string;
}

interface LocationSearchProps {
  onSelect: (location: LocationResult) => void;
}

export function LocationSearch({ onSelect }: LocationSearchProps) {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [results, setResults] = React.useState<any[]>([])

  React.useEffect(() => {
    if (!query || query.length < 3) {
      setResults([])
      return
    }

    const timer = setTimeout(async () => {
      setLoading(true)
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            query
          )}&addressdetails=1&limit=5&accept-language=de`
        )
        const data = await response.json()
        setResults(data)
      } catch (error) {
        console.error("Search failed:", error)
        toast.error("Suche fehlgeschlagen")
      } finally {
        setLoading(false)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [query])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-12 text-base px-4 border-primary/20 hover:border-primary/50"
        >
          {query ? query : "Suche nach einem Ort, Land oder einer Insel..."}
          <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput 
            placeholder="Ort eingeben..." 
            value={query}
            onValueChange={setQuery}
          />
          <CommandList>
            {loading && (
              <div className="py-6 text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Suche...
              </div>
            )}
            {!loading && results.length === 0 && query.length >= 3 && (
              <CommandEmpty>Keine Ergebnisse gefunden.</CommandEmpty>
            )}
            {!loading && query.length < 3 && (
               <div className="py-6 text-center text-sm text-muted-foreground">
                 Tippe mindestens 3 Zeichen...
               </div>
            )}
            <CommandGroup>
              {results.map((item) => (
                <CommandItem
                  key={item.place_id}
                  value={item.display_name}
                  onSelect={() => {
                    onSelect({
                      name: item.display_name.split(',')[0],
                      displayName: item.display_name,
                      lat: item.lat,
                      lon: item.lon,
                      countryCode: item.address?.country_code?.toUpperCase() || 'XX',
                      type: item.type
                    })
                    setOpen(false)
                    setQuery("")
                  }}
                >
                  <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                  <div className="flex flex-col text-left">
                    <span className="font-medium">{item.display_name.split(',')[0]}</span>
                    <span className="text-xs text-muted-foreground line-clamp-1">{item.display_name}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
