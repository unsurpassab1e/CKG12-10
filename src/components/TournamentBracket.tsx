import React, { useState } from 'react';
import { Trophy, Clock, MapPin, Plus, Trash2 } from 'lucide-react';

interface Game {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number | null;
  awayScore: number | null;
  winner?: string;
  round: number;
  matchNumber: number;
  time?: string;
  location?: string;
}

interface Team {
  name: string;
  id: string;
}

interface BracketProps {
  games: Game[];
  title: string;
  onUpdateScore?: (gameId: string, homeScore: number, awayScore: number) => void;
  onUpdateGame?: (gameId: string, updates: Partial<Game>) => void;
  onAddGame?: (round: number) => void;
  onDeleteGame?: (gameId: string) => void;
  isAdmin?: boolean;
  registeredTeams?: Record<string, Team[]>;
}

export default function TournamentBracket({ 
  games, 
  title, 
  onUpdateScore, 
  onUpdateGame,
  onAddGame,
  onDeleteGame,
  isAdmin,
  registeredTeams = {}
}: BracketProps) {
  const maxRound = Math.max(...games.map(game => game.round));
  const rounds = Array.from({ length: maxRound }, (_, i) => i + 1);
  const [editingGame, setEditingGame] = useState<string | null>(null);

  // Flatten all registered teams into a single array
  const allTeams = Object.values(registeredTeams).flat();

  const getGamesForRound = (round: number) => {
    return games
      .filter(game => game.round === round)
      .sort((a, b) => a.matchNumber - b.matchNumber);
  };

  const handleGameUpdate = (gameId: string, field: keyof Game, value: string) => {
    if (!onUpdateGame) return;
    onUpdateGame(gameId, { [field]: value });
  };

  const handleTeamSelect = (gameId: string, team: string, position: 'home' | 'away') => {
    if (!onUpdateGame) return;
    onUpdateGame(gameId, position === 'home' ? { homeTeam: team } : { awayTeam: team });
  };

  return (
    <div className="w-full overflow-x-auto">
      <h3 className="text-xl font-bold mb-4 flex items-center">
        <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
        {title}
      </h3>
      <div className="flex gap-16 p-8 min-w-[800px]">
        {rounds.map((round) => (
          <div
            key={round}
            className="flex-1 flex flex-col"
            style={{
              gap: `${Math.pow(2, round) * 2}rem`
            }}
          >
            <div className="text-center font-semibold text-gray-700 mb-4 flex items-center justify-center gap-2">
              {round === maxRound ? 'Championship' : `Round ${round}`}
              {isAdmin && onAddGame && (
                <button
                  onClick={() => onAddGame(round)}
                  className="p-1 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                  title="Add game to this round"
                >
                  <Plus className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="flex flex-col justify-around h-full">
              {getGamesForRound(round).map((game, index) => (
                <div
                  key={game.id}
                  className="relative"
                >
                  <div className="bg-white rounded-lg shadow-md p-4 relative z-10">
                    {/* Game Details */}
                    {isAdmin && editingGame === game.id ? (
                      <div className="mb-2 space-y-2">
                        <input
                          type="text"
                          placeholder="Time (e.g., 2:00 PM)"
                          className="w-full px-2 py-1 text-sm border rounded"
                          value={game.time || ''}
                          onChange={(e) => handleGameUpdate(game.id, 'time', e.target.value)}
                        />
                        <input
                          type="text"
                          placeholder="Location"
                          className="w-full px-2 py-1 text-sm border rounded"
                          value={game.location || ''}
                          onChange={(e) => handleGameUpdate(game.id, 'location', e.target.value)}
                        />
                      </div>
                    ) : (
                      <div className="mb-2 space-y-1">
                        {game.time && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Clock className="w-4 h-4 mr-1" />
                            {game.time}
                          </div>
                        )}
                        {game.location && (
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="w-4 h-4 mr-1" />
                            {game.location}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Home Team */}
                    <div className={`flex items-center justify-between mb-2 p-2 rounded-t-lg ${game.winner === game.homeTeam ? 'bg-green-50' : 'bg-gray-50'}`}>
                      {isAdmin ? (
                        <select
                          className="flex-1 mr-2 px-2 py-1 border rounded text-sm"
                          value={game.homeTeam}
                          onChange={(e) => handleTeamSelect(game.id, e.target.value, 'home')}
                        >
                          <option value="">Select Home Team</option>
                          {allTeams.map((team) => (
                            <option key={team.id} value={team.name}>
                              {team.name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span className="font-medium">{game.homeTeam || 'TBD'}</span>
                      )}
                      {isAdmin ? (
                        <input
                          type="number"
                          min="0"
                          className="w-16 px-2 py-1 border rounded"
                          value={game.homeScore || ''}
                          onChange={(e) => onUpdateScore?.(game.id, parseInt(e.target.value), game.awayScore || 0)}
                        />
                      ) : (
                        <span className="font-bold">{game.homeScore ?? '-'}</span>
                      )}
                    </div>

                    {/* Away Team */}
                    <div className={`flex items-center justify-between p-2 rounded-b-lg ${game.winner === game.awayTeam ? 'bg-green-50' : 'bg-gray-50'}`}>
                      {isAdmin ? (
                        <select
                          className="flex-1 mr-2 px-2 py-1 border rounded text-sm"
                          value={game.awayTeam}
                          onChange={(e) => handleTeamSelect(game.id, e.target.value, 'away')}
                        >
                          <option value="">Select Away Team</option>
                          {allTeams.map((team) => (
                            <option key={team.id} value={team.name}>
                              {team.name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span className="font-medium">{game.awayTeam || 'TBD'}</span>
                      )}
                      {isAdmin ? (
                        <input
                          type="number"
                          min="0"
                          className="w-16 px-2 py-1 border rounded"
                          value={game.awayScore || ''}
                          onChange={(e) => onUpdateScore?.(game.id, game.homeScore || 0, parseInt(e.target.value))}
                        />
                      ) : (
                        <span className="font-bold">{game.awayScore ?? '-'}</span>
                      )}
                    </div>

                    {/* Admin Controls */}
                    {isAdmin && (
                      <div className="absolute -top-2 -right-2 flex gap-1">
                        <button
                          onClick={() => setEditingGame(editingGame === game.id ? null : game.id)}
                          className="p-1 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors"
                          title={editingGame === game.id ? "Save changes" : "Edit game details"}
                        >
                          {editingGame === game.id ? "✓" : "✎"}
                        </button>
                        {onDeleteGame && (
                          <button
                            onClick={() => onDeleteGame(game.id)}
                            className="p-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
                            title="Delete game"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Connector Lines */}
                  {round < maxRound && (
                    <>
                      <div className="absolute top-1/2 -right-16 w-16 h-px bg-gray-300"></div>
                      {index % 2 === 0 && (
                        <div className="absolute top-1/2 -right-16 w-px h-full bg-gray-300"></div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}