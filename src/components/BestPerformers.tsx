import type { PredictionResult, Team } from "@/lib/api";
import { Star } from "lucide-react";

interface BestPerformersProps {
  prediction: PredictionResult;
  homeTeam: Team;
  awayTeam: Team;
}

export default function BestPerformers({ prediction, homeTeam, awayTeam }: BestPerformersProps) {
  const renderPerformers = (
    team: Team,
    performers: PredictionResult["bestPerformers"]["home"]
  ) => (
    <div className="flex-1">
      <div className="flex items-center gap-2 mb-3">
        <img src={team.logo} alt={team.name} className="w-5 h-5 object-contain" />
        <span className="text-xs text-muted-foreground uppercase tracking-wider">{team.name}</span>
      </div>
      <div className="space-y-3">
        {performers.map((player, i) => (
          <div key={i} className="bg-muted/50 rounded-xl p-3 border border-border/50">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                {i === 0 && <Star className="w-4 h-4 text-primary fill-primary" />}
                <span className="font-semibold text-sm">{player.name}</span>
              </div>
              <span className="font-display text-lg font-bold text-primary">{player.predictedRating}</span>
            </div>
            <p className="text-xs text-muted-foreground">{player.position}</p>
            <p className="text-xs text-foreground/70 mt-1">{player.reason}</p>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="glass rounded-2xl p-6 animate-fade-in-up-delay-3">
      <div className="flex items-center gap-2 mb-6">
        <Star className="w-5 h-5 text-primary" />
        <h3 className="font-display text-sm uppercase tracking-wider">Predicted Best Performers</h3>
      </div>

      <div className="flex gap-6 flex-col md:flex-row">
        {renderPerformers(homeTeam, prediction.bestPerformers.home)}
        <div className="hidden md:block w-px bg-border" />
        <div className="md:hidden h-px bg-border" />
        {renderPerformers(awayTeam, prediction.bestPerformers.away)}
      </div>
    </div>
  );
}
