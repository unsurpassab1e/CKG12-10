import React, { useState, useEffect } from 'react';
import { AlertCircle, Loader2, Save, Plus } from 'lucide-react';
import { useStore } from '../lib/store';
import { v4 as uuidv4 } from 'uuid';

interface ResultFormProps {
  onClose: () => void;
  onSubmit: (result: any) => Promise<void>;
  editingResult?: any;
}

type TournamentFormat = 'pool' | 'roundRobin' | 'bracket';
type Division = 'Open' | 'Gold' | 'Silver';

export default function ResultForm({ onClose, onSubmit, editingResult }: ResultFormProps) {
  const { tournaments, registeredTeams } = useStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    id: editingResult?.id || uuidv4(),
    tournamentId: editingResult?.tournamentId || '',
    tournamentTitle: editingResult?.tournamentTitle || '',
    date: editingResult?.date || '',
    type: editingResult?.type || 'baseball',
    format: editingResult?.format || 'bracket',
    ageGroup: editingResult?.ageGroup || '',
    division: editingResult?.division || 'Open',
    teams: editingResult?.teams || [],
    bracket: editingResult?.bracket || [],
    games: editingResult?.games || []
  });

  const selectedTournament = tournaments.find(t => t.id === formData.tournamentId);
  const tournamentTeams = selectedTournament && formData.ageGroup 
    ? (registeredTeams[selectedTournament.id]?.[formData.ageGroup] || [])
    : [];

  // Auto-populate teams when tournament and age group are selected
  useEffect(() => {
    if (selectedTournament && formData.ageGroup && tournamentTeams.length > 0) {
      const newTeams = tournamentTeams.map(team => ({
        id: team.id || uuidv4(),
        name: team.name,
        wins: 0,
        losses: 0,
        ties: 0,
        runsScored: 0,
        runsAllowed: 0
      }));
      setFormData(prev => ({ ...prev, teams: newTeams }));
    }
  }, [selectedTournament?.id, formData.ageGroup]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (!formData.tournamentId || !formData.ageGroup) {
        throw new Error('Please select a tournament and age group');
      }

      if (formData.teams.length === 0) {
        throw new Error('Please add at least one team');
      }

      const result = {
        ...formData,
        tournamentTitle: selectedTournament?.title || formData.tournamentTitle,
        date: selectedTournament?.date || formData.date,
        type: selectedTournament?.type || formData.type,
        format: selectedTournament?.format || formData.format
      };

      await onSubmit(result);
      onClose();
    } catch (error: any) {
      console.error('Error submitting result:', error);
      setError(error.message || 'Error saving result. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">
        {editingResult ? 'Edit Result' : 'Add New Result'}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="tournament" className="block text-sm font-medium text-gray-700 mb-1">
            Tournament *
          </label>
          <select
            id="tournament"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={formData.tournamentId}
            onChange={(e) => {
              const tournament = tournaments.find(t => t.id === e.target.value);
              setFormData({ 
                ...formData, 
                tournamentId: e.target.value,
                tournamentTitle: tournament?.title || '',
                date: tournament?.date || '',
                type: tournament?.type || 'baseball',
                format: tournament?.format || 'bracket'
              });
            }}
          >
            <option value="">Select Tournament</option>
            {tournaments.map((tournament) => (
              <option key={tournament.id} value={tournament.id}>
                {tournament.title} ({tournament.date})
              </option>
            ))}
          </select>
        </div>

        {selectedTournament && (
          <>
            <div>
              <label htmlFor="ageGroup" className="block text-sm font-medium text-gray-700 mb-1">
                Age Group *
              </label>
              <select
                id="ageGroup"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.ageGroup}
                onChange={(e) => setFormData({ ...formData, ageGroup: e.target.value })}
              >
                <option value="">Select Age Group</option>
                {selectedTournament.spotsPerAgeGroup.map((ag) => (
                  <option key={ag.ageGroup} value={ag.ageGroup}>
                    {ag.ageGroup}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="division" className="block text-sm font-medium text-gray-700 mb-1">
                Division *
              </label>
              <select
                id="division"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.division}
                onChange={(e) => setFormData({ ...formData, division: e.target.value as Division })}
              >
                <option value="Open">Open Division</option>
                <option value="Gold">Gold Division</option>
                <option value="Silver">Silver Division</option>
              </select>
            </div>

            <div>
              <label htmlFor="format" className="block text-sm font-medium text-gray-700 mb-1">
                Tournament Format *
              </label>
              <select
                id="format"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.format}
                onChange={(e) => setFormData({ ...formData, format: e.target.value as TournamentFormat })}
              >
                <option value="pool">Pool Play</option>
                <option value="roundRobin">Round Robin</option>
                <option value="bracket">Bracket Play</option>
              </select>
            </div>

            {formData.ageGroup && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Teams</h4>
                <div className="space-y-2">
                  {formData.teams.map((team, index) => (
                    <div key={team.id} className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">{team.name}</span>
                    </div>
                  ))}
                  {formData.teams.length === 0 && (
                    <p className="text-sm text-gray-500 italic">
                      No teams available for this age group
                    </p>
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {error && (
          <div className="flex items-center gap-2 text-red-600">
            <AlertCircle className="w-5 h-5" />
            <p>{error}</p>
          </div>
        )}

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" />
                {editingResult ? 'Update' : 'Add'} Result
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}