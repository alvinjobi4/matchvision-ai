import { supabase } from "@/integrations/supabase/client";

export interface Team {
  id: number;
  name: string;
  logo: string;
  country?: string;
}

export interface Player {
  id: number;
  name: string;
  position: string;
  number: number;
  age: number;
  photo: string;
}

export interface PredictionResult {
  predictedScore: { home: number; away: number };
  winProbability: { home: number; draw: number; away: number };
  confidence: number;
  stats: {
    possession: { home: number; away: number };
    passes: { home: number; away: number };
    shots: { home: number; away: number };
    shotsOnTarget: { home: number; away: number };
    corners: { home: number; away: number };
    fouls: { home: number; away: number };
  };
  predictedLineup: {
    home: {
      formation: string;
      starting: { name: string; position: string; number: number }[];
      substitutes: { name: string; position: string; number: number }[];
    };
    away: {
      formation: string;
      starting: { name: string; position: string; number: number }[];
      substitutes: { name: string; position: string; number: number }[];
    };
  };
  bestPerformers: {
    home: { name: string; position: string; predictedRating: number; reason: string }[];
    away: { name: string; position: string; predictedRating: number; reason: string }[];
  };
  matchAnalysis: string;
}

export async function searchTeams(query: string): Promise<Team[]> {
  const { data, error } = await supabase.functions.invoke("football-api", {
    body: { endpoint: "teams", params: { search: query } },
  });
  if (error) throw error;
  return (data?.response || []).map((r: any) => ({
    id: r.team.id,
    name: r.team.name,
    logo: r.team.logo,
    country: r.venue?.city || r.team.country,
  }));
}

export async function getSquad(teamId: number): Promise<Player[]> {
  const { data, error } = await supabase.functions.invoke("football-api", {
    body: { endpoint: "players/squads", params: { team: teamId } },
  });
  if (error) throw error;
  const squad = data?.response?.[0]?.players || [];
  return squad.map((p: any) => ({
    id: p.id,
    name: p.name,
    position: p.position,
    number: p.number || 0,
    age: p.age || 0,
    photo: p.photo,
  }));
}

export async function getTeamStats(teamId: number): Promise<any> {
  // Get current season stats
  const currentYear = new Date().getFullYear();
  const season = new Date().getMonth() >= 7 ? currentYear : currentYear - 1;
  
  const { data, error } = await supabase.functions.invoke("football-api", {
    body: { endpoint: "teams/statistics", params: { team: teamId, season, league: 39 } },
  });
  if (error) return null;
  return data?.response || null;
}

export async function predictMatch(
  homeTeam: Team,
  awayTeam: Team,
  homeSquad: Player[],
  awaySquad: Player[],
  homeStats: any,
  awayStats: any
): Promise<PredictionResult> {
  const { data, error } = await supabase.functions.invoke("predict-match", {
    body: { homeTeam, awayTeam, homeSquad, awaySquad, homeStats, awayStats },
  });
  if (error) throw error;
  if (data.error) throw new Error(data.error);
  return data;
}
