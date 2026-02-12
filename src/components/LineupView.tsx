import type { PredictionResult, Team } from "@/lib/api";
import { Users } from "lucide-react";

interface LineupViewProps {
  prediction: PredictionResult;
  homeTeam: Team;
  awayTeam: Team;
}

export default function LineupView({ prediction, homeTeam, awayTeam }: LineupViewProps) {
  const renderTeamLineup = (
    team: Team,
    lineup: PredictionResult["predictedLineup"]["home"],
    side: "home" | "away"
  ) => (
    <div className="flex-1">
      <div className="flex items-center gap-2 mb-4">
        <img src={team.logo} alt={team.name} className="w-6 h-6 object-contain" />
        <h4 className="font-display text-xs uppercase tracking-wider">{team.name}</h4>
        <span className="ml-auto text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
          {lineup.formation}
        </span>
      </div>

      <div className="space-y-1.5 mb-4">
        <p className="text-xs text-muted-foreground uppercase tracking-wider">Starting XI</p>
        {lineup.starting.map((player, i) => (
          <div key={i} className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-1.5">
            <span className="text-xs font-mono text-primary w-6">{player.number}</span>
            <span className="text-sm flex-1 truncate">{player.name}</span>
            <span className="text-xs text-muted-foreground">{player.position}</span>
          </div>
        ))}
      </div>

      <div className="space-y-1.5">
        <p className="text-xs text-muted-foreground uppercase tracking-wider">Substitutes</p>
        {lineup.substitutes.map((player, i) => (
          <div key={i} className="flex items-center gap-2 bg-muted/30 rounded-lg px-3 py-1.5 opacity-70">
            <span className="text-xs font-mono text-muted-foreground w-6">{player.number}</span>
            <span className="text-sm flex-1 truncate">{player.name}</span>
            <span className="text-xs text-muted-foreground">{player.position}</span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="glass rounded-2xl p-6 animate-fade-in-up-delay-2">
      <div className="flex items-center gap-2 mb-6">
        <Users className="w-5 h-5 text-primary" />
        <h3 className="font-display text-sm uppercase tracking-wider">Predicted Lineups</h3>
      </div>

      <div className="flex gap-6 flex-col md:flex-row">
        {renderTeamLineup(homeTeam, prediction.predictedLineup.home, "home")}
        <div className="hidden md:block w-px bg-border" />
        <div className="md:hidden h-px bg-border" />
        {renderTeamLineup(awayTeam, prediction.predictedLineup.away, "away")}
      </div>
    </div>
  );
}
