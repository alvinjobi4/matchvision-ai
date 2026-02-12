import { useState, useCallback } from "react";
import { Search, X } from "lucide-react";
import { searchTeams, type Team } from "@/lib/api";

interface TeamSelectorProps {
  label: string;
  selectedTeam: Team | null;
  onSelect: (team: Team) => void;
  onClear: () => void;
}

export default function TeamSelector({ label, selectedTeam, onSelect, onClear }: TeamSelectorProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Team[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSearch = useCallback(async (q: string) => {
    setQuery(q);
    if (q.length < 2) {
      setResults([]);
      setShowDropdown(false);
      return;
    }
    setLoading(true);
    try {
      const teams = await searchTeams(q);
      setResults(teams);
      setShowDropdown(true);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  if (selectedTeam) {
    return (
      <div className="glass rounded-xl p-4 flex items-center gap-4 animate-fade-in-up">
        <img src={selectedTeam.logo} alt={selectedTeam.name} className="w-14 h-14 object-contain" />
        <div className="flex-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">{label}</p>
          <h3 className="text-lg font-bold font-display">{selectedTeam.name}</h3>
        </div>
        <button onClick={onClear} className="p-2 rounded-lg hover:bg-muted transition-colors">
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="glass rounded-xl p-4">
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">{label}</p>
        <div className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search for a team..."
            className="bg-transparent outline-none flex-1 text-sm text-foreground placeholder:text-muted-foreground"
            onFocus={() => results.length > 0 && setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
          />
          {loading && (
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          )}
        </div>
      </div>

      {showDropdown && results.length > 0 && (
        <div className="absolute z-50 top-full left-0 right-0 mt-2 glass rounded-xl overflow-hidden max-h-64 overflow-y-auto">
          {results.map((team) => (
            <button
              key={team.id}
              onClick={() => {
                onSelect(team);
                setQuery("");
                setResults([]);
                setShowDropdown(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors text-left"
            >
              <img src={team.logo} alt={team.name} className="w-8 h-8 object-contain" />
              <div>
                <p className="text-sm font-medium">{team.name}</p>
                {team.country && <p className="text-xs text-muted-foreground">{team.country}</p>}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
