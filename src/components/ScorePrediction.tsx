import type { PredictionResult, Team } from "@/lib/api";
import { Trophy, Target, TrendingUp } from "lucide-react";

interface ScorePredictionProps {
  prediction: PredictionResult;
  homeTeam: Team;
  awayTeam: Team;
}

export default function ScorePrediction({ prediction, homeTeam, awayTeam }: ScorePredictionProps) {
  const winner = prediction.predictedScore.home > prediction.predictedScore.away
    ? "home"
    : prediction.predictedScore.away > prediction.predictedScore.home
    ? "away"
    : "draw";

  return (
    <div className="glass rounded-2xl p-6 animate-fade-in-up neon-border">
      <div className="flex items-center gap-2 mb-6">
        <Trophy className="w-5 h-5 text-primary" />
        <h3 className="font-display text-sm uppercase tracking-wider">Predicted Result</h3>
        <span className="ml-auto text-xs bg-primary/20 text-primary px-2 py-1 rounded-full font-semibold">
          {prediction.confidence}% confident
        </span>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className={`flex-1 text-center ${winner === "home" ? "opacity-100" : "opacity-60"}`}>
          <img src={homeTeam.logo} alt={homeTeam.name} className="w-16 h-16 mx-auto mb-2 object-contain" />
          <p className="font-display text-sm font-bold truncate">{homeTeam.name}</p>
        </div>

        <div className="flex items-center gap-3">
          <span className={`font-display text-5xl font-black ${winner === "home" ? "text-primary neon-text" : "text-foreground"}`}>
            {prediction.predictedScore.home}
          </span>
          <span className="text-2xl text-muted-foreground font-light">-</span>
          <span className={`font-display text-5xl font-black ${winner === "away" ? "text-primary neon-text" : "text-foreground"}`}>
            {prediction.predictedScore.away}
          </span>
        </div>

        <div className={`flex-1 text-center ${winner === "away" ? "opacity-100" : "opacity-60"}`}>
          <img src={awayTeam.logo} alt={awayTeam.name} className="w-16 h-16 mx-auto mb-2 object-contain" />
          <p className="font-display text-sm font-bold truncate">{awayTeam.name}</p>
        </div>
      </div>

      {/* Win probabilities */}
      <div className="mt-6 grid grid-cols-3 gap-2">
        {[
          { label: homeTeam.name, value: prediction.winProbability.home },
          { label: "Draw", value: prediction.winProbability.draw },
          { label: awayTeam.name, value: prediction.winProbability.away },
        ].map((item) => (
          <div key={item.label} className="text-center bg-muted rounded-lg p-3">
            <p className="text-xs text-muted-foreground truncate">{item.label}</p>
            <p className="font-display text-lg font-bold text-primary">{item.value}%</p>
          </div>
        ))}
      </div>
    </div>
  );
}
