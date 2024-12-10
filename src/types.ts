export interface TeamMatchup {
  team1: string;
  team2: string;
  date: string;
  score: {
    team1: number;
    team2: number;
  };
  stats: {
    wins: {
      team1: number;
      team2: number;
    };
    losses: {
      team1: number;
      team2: number;
    };
    runsScored: {
      team1: number;
      team2: number;
    };
    runsAllowed: {
      team1: number;
      team2: number;
    };
  };
}