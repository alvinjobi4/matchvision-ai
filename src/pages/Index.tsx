import { useState } from "react";
import { Zap, Loader2 } from "lucide-react";
import TeamSelector from "@/components/TeamSelector";
import ScorePrediction from "@/components/ScorePrediction";
import StatsComparison from "@/components/StatsComparison";
import LineupView from "@/components/LineupView";
import BestPerformers from "@/components/BestPerformers";
import ChatBot from "@/components/ChatBot";
import { type Team, type PredictionResult, getSquad, getTeamStats, predictMatch } from "@/lib/api";
import { toast } from "sonner";

export default function Index() {
  const [homeTeam, setHomeTeam] = useState<Team | null>(null);
  const [awayTeam, setAwayTeam] = useState<Team | null>(null);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePredict = async () => {
    if (!homeTeam || !awayTeam) {
      toast.error("Please select both teams");
      return;
    }
    if (homeTeam.id === awayTeam.id) {
      toast.error("Please select two different teams");
      return;
    }

    setLoading(true);
    setPrediction(null);

    try {
      const [homeSquad, awaySquad, homeStats, awayStats] = await Promise.all([
        getSquad(homeTeam.id),
        getSquad(awayTeam.id),
        getTeamStats(homeTeam.id),
        getTeamStats(awayTeam.id),
      ]);

      const result = await predictMatch(homeTeam, awayTeam, homeSquad, awaySquad, homeStats, awayStats);
      setPrediction(result);
      toast.success("Prediction generated!");
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || "Failed to generate prediction");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background gradient-mesh">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center neon-border">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-display text-lg font-bold tracking-wide neon-text">MatchVision AI</h1>
              <p className="text-xs text-muted-foreground">Football Match Prediction Engine</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs text-muted-foreground">AI Powered</span>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Team Selection */}
        <section className="mb-8">
          <h2 className="font-display text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">
            Select Teams
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TeamSelector
              label="Home Team"
              selectedTeam={homeTeam}
              onSelect={setHomeTeam}
              onClear={() => { setHomeTeam(null); setPrediction(null); }}
            />
            <TeamSelector
              label="Away Team"
              selectedTeam={awayTeam}
              onSelect={setAwayTeam}
              onClear={() => { setAwayTeam(null); setPrediction(null); }}
            />
          </div>

          <button
            onClick={handlePredict}
            disabled={!homeTeam || !awayTeam || loading}
            className="w-full mt-4 py-3 px-6 rounded-xl font-display text-sm uppercase tracking-wider bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-40 transition-all flex items-center justify-center gap-2 neon-border"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing Match...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                Predict Match
              </>
            )}
          </button>
        </section>

        {/* Results */}
        {prediction && homeTeam && awayTeam && (
          <div className="space-y-6">
            {/* Match Analysis */}
            <div className="glass rounded-2xl p-6 animate-fade-in-up">
              <p className="text-sm text-foreground/80 leading-relaxed">{prediction.matchAnalysis}</p>
            </div>

            <ScorePrediction prediction={prediction} homeTeam={homeTeam} awayTeam={awayTeam} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <StatsComparison prediction={prediction} homeTeam={homeTeam} awayTeam={awayTeam} />
              <BestPerformers prediction={prediction} homeTeam={homeTeam} awayTeam={awayTeam} />
            </div>

            <LineupView prediction={prediction} homeTeam={homeTeam} awayTeam={awayTeam} />
          </div>
        )}

        {/* Empty State */}
        {!prediction && !loading && (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="font-display text-lg text-muted-foreground mb-2">Select Two Teams</h2>
            <p className="text-sm text-muted-foreground/70">Search and select home & away teams to get AI-powered predictions</p>
          </div>
        )}
      </main>

      <ChatBot />
    </div>
  );
}
