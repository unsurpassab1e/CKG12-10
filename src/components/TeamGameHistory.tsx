import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface Game {
  opponent: string;
  date: string;
  score: {
    team: number;
    opponent: number;
  };
  result: 'W' | 'L' | 'T';
}

interface Props {
  teamName: string;
  games: Game[];
}

export default function TeamGameHistory({ teamName, games }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (games.length === 0) return null;

  const getResultColor = (result: 'W' | 'L' | 'T') => {
    switch (result) {
      case 'W':
        return 'text-green-600';
      case 'L':
        return 'text-red-600';
      case 'T':
        return 'text-yellow-600';
    }
  };

  return (
    <div className="mt-2">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center text-sm text-blue-600 hover:text-blue-700"
      >
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 mr-1" />
        ) : (
          <ChevronDown className="w-4 h-4 mr-1" />
        )}
        Game History
      </button>

      {isExpanded && (
        <div className="mt-2 space-y-2 pl-4 border-l-2 border-gray-200">
          {games.map((game, index) => (
            <div key={index} className="text-sm">
              <span className={`font-medium ${getResultColor(game.result)}`}>
                {game.result}
              </span>
              <span className="text-gray-600 ml-2">
                vs {game.opponent} ({game.score.team}-{game.score.opponent})
              </span>
              <span className="text-gray-400 ml-2 text-xs">
                {new Date(game.date).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}