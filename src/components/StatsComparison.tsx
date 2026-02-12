import type { PredictionResult, Team } from "@/lib/api";

interface StatsComparisonProps {
  prediction: PredictionResult;
  homeTeam: Team;
  awayTeam: Team;
}

const statLabels: Record<string, string> = {
  possession: "Possession %",
  passes: "Passes",
  shots: "Shots",
  shotsOnTarget: "Shots on Target",
  corners: "Corners",
  fouls: "Fouls",
};

export default function StatsComparison({ prediction, homeTeam, awayTeam }: StatsComparisonProps) {
  const stats = prediction.stats;

  return (
    <div className="glass rounded-2xl p-6 animate-fade-in-up-delay-1">
      <h3 className="font-display text-sm uppercase tracking-wider mb-6">Predicted Stats</h3>

      <div className="space-y-5">
        {Object.entries(stats).map(([key, values]) => {
          const total = values.home + values.away;
          const homePercent = total > 0 ? (values.home / total) * 100 : 50;

          return (
            <div key={key}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-semibold text-primary">{values.home}</span>
                <span className="text-xs text-muted-foreground uppercase tracking-wider">{statLabels[key] || key}</span>
                <span className="text-sm font-semibold text-accent">{values.away}</span>
              </div>
              <div className="flex h-2 rounded-full overflow-hidden bg-muted gap-0.5">
                <div
                  className="bg-primary rounded-l-full transition-all duration-1000"
                  style={{ width: `${homePercent}%` }}
                />
                <div
                  className="bg-accent rounded-r-full transition-all duration-1000"
                  style={{ width: `${100 - homePercent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-between mt-4">
        <span className="text-xs text-muted-foreground">{homeTeam.name}</span>
        <span className="text-xs text-muted-foreground">{awayTeam.name}</span>
      </div>
    </div>
  );
}
