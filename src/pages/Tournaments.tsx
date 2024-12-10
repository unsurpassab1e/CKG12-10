import React, { useState } from 'react';
import { Search, Filter, Plus, X } from 'lucide-react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import TournamentCard from '../components/TournamentCard';
import SortSelect from '../components/SortSelect';
import { useStore } from '../lib/store';
import { useAuth } from '../components/AuthContext';

export default function Tournaments() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'baseball' | 'softball'>('all');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedTournament, setSelectedTournament] = useState<string | null>(null);
  const { tournaments, registeredTeams, removeRegisteredTeam } = useStore();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isManagingTournaments = location.pathname.includes('/tournaments/manage');

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'title', label: 'Tournament Name' }
  ];

  // Filter tournaments based on search term and type
  const filteredTournaments = tournaments.filter(tournament => {
    const matchesSearch = tournament.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tournament.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || tournament.type === selectedType;
    return matchesSearch && matchesType;
  });

  // Sort filtered tournaments
  const sortedTournaments = [...filteredTournaments].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case 'oldest':
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case 'title':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  const handleRemoveTeam = (tournamentId: string, ageGroup: string, teamId: string) => {
    if (window.confirm('Are you sure you want to remove this team?')) {
      removeRegisteredTeam(tournamentId, ageGroup, teamId);
    }
  };

  if (isManagingTournaments) {
    return <Outlet />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-4xl font-bold text-gray-900">Upcoming Tournaments</h1>
          {isAdmin && (
            <button
              onClick={() => navigate('/tournaments/manage')}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              Manage Tournaments
            </button>
          )}
        </div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Browse and register for upcoming tournaments. Whether you're looking for baseball or softball competitions, we've got you covered.
        </p>
      </div>

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
          <SortSelect
            value={sortBy}
            onChange={setSortBy}
            options={sortOptions}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {sortedTournaments.map((tournament) => (
          <div 
            key={tournament.id}
            className="cursor-pointer"
            onClick={() => setSelectedTournament(tournament.id)}
          >
            <TournamentCard 
              {...tournament}
              registeredTeams={registeredTeams[tournament.id]}
              onRemoveTeam={handleRemoveTeam}
            />
          </div>
        ))}

        {sortedTournaments.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-600">
              {searchTerm || selectedType !== 'all'
                ? 'No tournaments found matching your criteria. Try adjusting your filters.'
                : 'No upcoming tournaments at this time. Check back later!'}
            </p>
          </div>
        )}
      </div>

      {/* Tournament Details Modal */}
      {selectedTournament && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {tournaments.find(t => t.id === selectedTournament)?.title}
                </h2>
                <button
                  onClick={() => setSelectedTournament(null)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-6">
                <TournamentCard 
                  {...tournaments.find(t => t.id === selectedTournament)!}
                  registeredTeams={registeredTeams[selectedTournament]}
                  onRemoveTeam={handleRemoveTeam}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}