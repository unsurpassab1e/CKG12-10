import React, { useState } from 'react';
import { Plus, Maximize2 } from 'lucide-react';
import BracketModal from './BracketModal';

interface BracketListProps {
  brackets: any[];
  title: string;
  isAdmin?: boolean;
  onAddBracket?: () => void;
  onUpdateBracket?: (bracketId: string, updates: any) => void;
  registeredTeams?: Record<string, any[]>;
}

export default function BracketList({
  brackets,
  title,
  isAdmin,
  onAddBracket,
  onUpdateBracket,
  registeredTeams
}: BracketListProps) {
  const [selectedBracket, setSelectedBracket] = useState<any | null>(null);

  const handleUpdateScore = (gameId: string, homeScore: number, awayScore: number) => {
    if (!selectedBracket || !onUpdateBracket) return;
    
    const updatedGames = selectedBracket.games.map((game: any) =>
      game.id === gameId
        ? { 
            ...game, 
            homeScore, 
            awayScore,
            winner: homeScore > awayScore ? game.homeTeam : game.awayTeam 
          }
        : game
    );

    onUpdateBracket(selectedBracket.id, { games: updatedGames });
  };

  const handleUpdateGame = (gameId: string, updates: any) => {
    if (!selectedBracket || !onUpdateBracket) return;

    const updatedGames = selectedBracket.games.map((game: any) =>
      game.id === gameId ? { ...game, ...updates } : game
    );

    onUpdateBracket(selectedBracket.id, { games: updatedGames });
  };

  const handleAddGame = (round: number) => {
    if (!selectedBracket || !onUpdateBracket) return;

    const newGame = {
      id: `game-${Date.now()}`,
      homeTeam: '',
      awayTeam: '',
      homeScore: null,
      awayScore: null,
      round,
      matchNumber: selectedBracket.games.filter((g: any) => g.round === round).length + 1
    };

    onUpdateBracket(selectedBracket.id, {
      games: [...selectedBracket.games, newGame]
    });
  };

  const handleDeleteGame = (gameId: string) => {
    if (!selectedBracket || !onUpdateBracket) return;

    onUpdateBracket(selectedBracket.id, {
      games: selectedBracket.games.filter((game: any) => game.id !== gameId)
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-900">Brackets</h3>
        {isAdmin && onAddBracket && (
          <button
            onClick={onAddBracket}
            className="inline-flex items-center px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Bracket
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {brackets.map((bracket) => (
          <div key={bracket.id} className="relative">
            <button
              onClick={() => setSelectedBracket(bracket)}
              className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors z-10"
              title="View full screen"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
            <div className="bg-white rounded-lg shadow-md p-4 overflow-x-auto">
              <TournamentBracket
                games={bracket.games}
                title={`${title} - ${bracket.name}`}
                isAdmin={isAdmin}
                registeredTeams={registeredTeams}
              />
            </div>
          </div>
        ))}
      </div>

      <BracketModal
        isOpen={!!selectedBracket}
        onClose={() => setSelectedBracket(null)}
        bracket={selectedBracket?.games || []}
        title={selectedBracket ? `${title} - ${selectedBracket.name}` : ''}
        isAdmin={isAdmin}
        onUpdateScore={handleUpdateScore}
        onUpdateGame={handleUpdateGame}
        onAddGame={handleAddGame}
        onDeleteGame={handleDeleteGame}
        registeredTeams={registeredTeams}
      />
    </div>
  );
}