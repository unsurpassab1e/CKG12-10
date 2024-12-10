import React, { useState } from 'react';
import { Search, Filter, AlertCircle, Plus, Edit2 } from 'lucide-react';
import SortSelect from '../components/SortSelect';
import TournamentBracket from '../components/TournamentBracket';
import { useAuth } from '../components/AuthContext';
import { useStore } from '../lib/store';
import ResultForm from '../components/ResultForm';

type TournamentFormat = 'pool' | 'roundRobin' | 'bracket';
type Division = 'Open' | 'Gold' | 'Silver';

export default function Results() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'baseball' | 'softball'>('all');
  const [selectedFormat, setSelectedFormat] = useState<'all' | TournamentFormat>('all');
  const [selectedDivision, setSelectedDivision] = useState<'all' | Division>('all');
  const [sortBy, setSortBy] = useState('newest');
  const [showForm, setShowForm] = useState(false);
  const [editingResult, setEditingResult] = useState<any | null>(null);
  const { results, updateResult, registeredTeams } = useStore();
  const { isAdmin } = useAuth();

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'title', label: 'Tournament Name' }
  ];

  const handleEdit = (result: any) => {
    setEditingResult(result);
    setShowForm(true);
  };

  const handleUpdateResult = async (updatedResult: any) => {
    try {
      await updateResult(updatedResult);
      setShowForm(false);
      setEditingResult(null);
    } catch (error) {
      console.error('Error updating result:', error);
    }
  };

  // Filter results based on search term, type, format, and division
  const filteredResults = results.filter(result => {
    const matchesSearch = result.tournamentTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || result.type === selectedType;
    const matchesFormat = selectedFormat === 'all' || result.format === selectedFormat;
    const matchesDivision = selectedDivision === 'all' || result.division === selectedDivision;
    return matchesSearch && matchesType && matchesFormat && matchesDivision;
  });

  // Sort filtered results
  const sortedResults = [...filteredResults].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case 'oldest':
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case 'title':
        return a.tournamentTitle.localeCompare(b.tournamentTitle);
      default:
        return 0;
    }
  });

  // Calculate yearly stats for all teams
  const yearlyStats = React.useMemo(() => {
    const stats = new Map();

    results.forEach(result => {
      result.teams.forEach(team => {
        const existingStats = stats.get(team.name) || {
          name: team.name,
          wins: 0,
          losses: 0,
          ties: 0,
          runsScored: 0,
          runsAllowed: 0,
          tournaments: 0
        };

        stats.set(team.name, {
          ...existingStats,
          wins: existingStats.wins + team.wins,
          losses: existingStats.losses + team.losses,
          ties: existingStats.ties + (team.ties || 0),
          runsScored: existingStats.runsScored + team.runsScored,
          runsAllowed: existingStats.runsAllowed + team.runsAllowed,
          tournaments: existingStats.tournaments + 1
        });
      });
    });

    return Array.from(stats.values()).sort((a, b) => {
      // Sort by win percentage
      const aWinPct = (a.wins + 0.5 * a.ties) / (a.wins + a.losses + a.ties);
      const bWinPct = (b.wins + 0.5 * b.ties) / (b.wins + b.losses + b.ties);
      if (bWinPct !== aWinPct) return bWinPct - aWinPct;
      
      // Then by run differential
      const aRunDiff = a.runsScored - a.runsAllowed;
      const bRunDiff = b.runsScored - b.runsAllowed;
      return bRunDiff - aRunDiff;
    });
  }, [results]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-4xl font-bold text-gray-900">Tournament Results</h1>
          {isAdmin && (
            <button
              onClick={() => {
                setEditingResult(null);
                setShowForm(true);
              }}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Results
            </button>
          )}
        </div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          View standings, brackets, and results from our tournaments
        </p>
      </div>

      {showForm && (
        <ResultForm 
          onClose={() => {
            setShowForm(false);
            setEditingResult(null);
          }}
          onSubmit={handleUpdateResult}
          editingResult={editingResult}
        />
      )}

      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search tournaments..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="text-gray-400 h-5 w-5" />
            <select
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as 'all' | 'baseball' | 'softball')}
            >
              <option value="all">All Types</option>
              <option value="baseball">Baseball</option>
              <option value="softball">Softball</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="text-gray-400 h-5 w-5" />
            <select
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value as 'all' | TournamentFormat)}
            >
              <option value="all">All Formats</option>
              <option value="pool">Pool Play</option>
              <option value="roundRobin">Round Robin</option>
              <option value="bracket">Bracket Play</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="text-gray-400 h-5 w-5" />
            <select
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={selectedDivision}
              onChange={(e) => setSelectedDivision(e.target.value as 'all' | Division)}
            >
              <option value="all">All Divisions</option>
              <option value="Open">Open Division</option>
              <option value="Gold">Gold Division</option>
              <option value="Silver">Silver Division</option>
            </select>
          </div>
          <SortSelect
            value={sortBy}
            onChange={setSortBy}
            options={sortOptions}
          />
        </div>
      </div>

      <div className="space-y-12">
        {sortedResults.map((result, resultIndex) => (
          <div key={result.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{result.tournamentTitle}</h2>
                  <div className="flex gap-4 text-gray-600">
                    <span>{result.date}</span>
                    <span className="capitalize">{result.type}</span>
                    <span>{result.ageGroup}</span>
                    <span className="capitalize">{result.format} Format</span>
                    <span>{result.division} Division</span>
                  </div>
                </div>
                {isAdmin && (
                  <button
                    onClick={() => handleEdit(result)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Standings */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Standings</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">W</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">L</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">T</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">RS</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">RA</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DIFF</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {result.teams
                      .sort((a, b) => {
                        // First sort by wins
                        if (b.wins !== a.wins) return b.wins - a.wins;
                        // Then by ties
                        if ((b.ties || 0) !== (a.ties || 0)) return (b.ties || 0) - (a.ties || 0);
                        // Then by run differential (max 8 per game)
                        const aRunDiff = Math.min(8, a.runsScored - a.runsAllowed);
                        const bRunDiff = Math.min(8, b.runsScored - b.runsAllowed);
                        if (bRunDiff !== aRunDiff) return bRunDiff - aRunDiff;
                        // Then by runs scored
                        if (b.runsScored !== a.runsScored) return b.runsScored - a.runsScored;
                        // Finally by coin flip (using team name as seed)
                        return a.name.localeCompare(b.name);
                      })
                      .map((team, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {index + 1}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {team.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{team.wins}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{team.losses}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{team.ties || 0}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{team.runsScored}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{team.runsAllowed}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {team.runsScored - team.runsAllowed}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Tournament Bracket */}
            {result.format === 'bracket' && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Tournament Bracket</h3>
                <TournamentBracket
                  games={result.bracket}
                  title={`${result.tournamentTitle} - ${result.ageGroup} (${result.division} Division)`}
                  isAdmin={isAdmin}
                  registeredTeams={registeredTeams[result.tournamentId]}
                  onUpdateScore={isAdmin ? (gameId, homeScore, awayScore) => {
                    const updatedResult = {
                      ...result,
                      bracket: result.bracket.map(game => 
                        game.id === gameId 
                          ? { 
                              ...game, 
                              homeScore, 
                              awayScore, 
                              winner: homeScore > awayScore ? game.homeTeam : game.awayTeam 
                            }
                          : game
                      )
                    };
                    handleUpdateResult(updatedResult);
                  } : undefined}
                  onUpdateGame={isAdmin ? (gameId, updates) => {
                    const updatedResult = {
                      ...result,
                      bracket: result.bracket.map(game =>
                        game.id === gameId
                          ? { ...game, ...updates }
                          : game
                      )
                    };
                    handleUpdateResult(updatedResult);
                  } : undefined}
                  onAddGame={isAdmin ? (round) => {
                    const newGame = {
                      id: `game-${Date.now()}`,
                      homeTeam: '',
                      awayTeam: '',
                      homeScore: null,
                      awayScore: null,
                      round,
                      matchNumber: result.bracket.filter(g => g.round === round).length + 1
                    };
                    const updatedResult = {
                      ...result,
                      bracket: [...result.bracket, newGame]
                    };
                    handleUpdateResult(updatedResult);
                  } : undefined}
                  onDeleteGame={isAdmin ? (gameId) => {
                    const updatedResult = {
                      ...result,
                      bracket: result.bracket.filter(game => game.id !== gameId)
                    };
                    handleUpdateResult(updatedResult);
                  } : undefined}
                />
              </div>
            )}
          </div>
        ))}

        {sortedResults.length === 0 && (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Results Found</h3>
            <p className="text-gray-600">
              {searchTerm || selectedType !== 'all' || selectedFormat !== 'all' || selectedDivision !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'Check back later for tournament results'}
            </p>
          </div>
        )}
      </div>

      {/* Yearly Team Stats */}
      <div className="mt-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Yearly Team Statistics</h2>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">W</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">L</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">T</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Win %</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">RS</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">RA</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DIFF</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tournaments</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {yearlyStats.map((team, index) => {
                  const winPct = ((team.wins + 0.5 * team.ties) / (team.wins + team.losses + team.ties) * 1000) / 10;
                  return (
                    <tr key={team.name} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{team.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{team.wins}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{team.losses}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{team.ties}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{winPct.toFixed(1)}%</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{team.runsScored}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{team.runsAllowed}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{team.runsScored - team.runsAllowed}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{team.tournaments}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}