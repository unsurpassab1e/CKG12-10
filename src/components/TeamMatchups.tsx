import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface TeamMatchup {
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

interface Props {
  teamName: string;
  matchups: TeamMatchup[];
}

export default function TeamMatchups({ teamName, matchups = [] }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);

  const teamMatchups = matchups.filter(
    matchup => matchup.team1 === teamName || matchup.team2 === teamName
  );

  if (teamMatchups.length === 0) return null;

  return (
    <div className="mt-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <span className="font-medium text-gray-700">Game History</span>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </button>

      {isExpanded && (
        <div className="mt-2 space-y-2">
          {teamMatchups.map((matchup, index) => {
            const isTeam1 = matchup.team1 === teamName;
            const opponent = isTeam1 ? matchup.team2 : matchup.team1;
            const teamScore = isTeam1 ? matchup.score.team1 : matchup.score.team2;
            const opponentScore = isTeam1 ? matchup.score.team2 : matchup.score.team1;
            const teamWins = isTeam1 ? matchup.stats.wins.team1 : matchup.stats.wins.team2;
            const teamLosses = isTeam1 ? matchup.stats.losses.team1 : matchup.stats.losses.team2;
            const teamRunsScored = isTeam1 ? matchup.stats.runsScored.team1 : matchup.stats.runsScored.team2;
            const teamRunsAllowed = isTeam1 ? matchup.stats.runsAllowed.team1 : matchup.stats.runsAllowed.team2;

            return (
              <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-500">{matchup.date}</span>
                  <span className={`text-sm font-medium ${teamScore > opponentScore ? 'text-green-600' : 'text-red-600'}`}>
                    {teamScore > opponentScore ? 'Won' : 'Lost'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">vs {opponent}</p>
                    <p className="text-lg font-bold">
                      {teamScore} - {opponentScore}
                    </p>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">W:</span> {teamWins}
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">L:</span> {teamLosses}
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">RS:</span> {teamRunsScored}
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">RA:</span> {teamRunsAllowed}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}