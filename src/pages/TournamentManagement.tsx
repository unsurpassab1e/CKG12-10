import React, { useState } from 'react';
import { Plus, Trash2, Edit2, AlertCircle, Loader2, LayoutTemplate } from 'lucide-react';
import { useAuth } from '../components/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../lib/store';

interface AgeGroupSpots {
  ageGroup: string;
  spots: number;
}

type TournamentFormat = 'pool' | 'roundRobin' | 'bracket';

interface Tournament {
  id: string;
  title: string;
  date: string;
  location: string;
  spotsPerAgeGroup: AgeGroupSpots[];
  entryFee: string;
  type: 'baseball' | 'softball';
  imageUrl: string;
  information?: string;
  format: TournamentFormat;
}

export default function TournamentManagement() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const { tournaments, addTournament, deleteTournament, updateTournament } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingTournament, setEditingTournament] = useState<Tournament | null>(null);

  const defaultFormData = {
    title: '',
    date: '',
    location: '',
    entryFee: '',
    type: 'baseball' as const,
    imageUrl: '',
    information: '',
    format: 'bracket' as TournamentFormat,
    ageGroups: [
      { ageGroup: '8U', spots: 8 },
      { ageGroup: '10U', spots: 8 },
      { ageGroup: '12U', spots: 8 },
      { ageGroup: '14U', spots: 8 }
    ]
  };

  const [formData, setFormData] = useState(defaultFormData);

  React.useEffect(() => {
    if (!isAdmin) {
      navigate('/');
    }
  }, [isAdmin, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const tournamentData = {
        title: formData.title,
        date: formData.date,
        location: formData.location,
        entryFee: formData.entryFee,
        type: formData.type,
        imageUrl: formData.imageUrl,
        information: formData.information,
        format: formData.format,
        spotsPerAgeGroup: formData.ageGroups
      };

      if (editingTournament) {
        await updateTournament({
          ...editingTournament,
          ...tournamentData
        });
      } else {
        await addTournament(tournamentData);
      }
      setShowForm(false);
      setEditingTournament(null);
      resetForm();
    } catch (error) {
      setError('Error saving tournament');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (tournamentId: string) => {
    if (window.confirm('Are you sure you want to delete this tournament?')) {
      try {
        await deleteTournament(tournamentId);
      } catch (error) {
        setError('Error deleting tournament');
      }
    }
  };

  const handleEdit = (tournament: Tournament) => {
    setEditingTournament(tournament);
    setFormData({
      title: tournament.title,
      date: tournament.date,
      location: tournament.location,
      entryFee: tournament.entryFee,
      type: tournament.type,
      imageUrl: tournament.imageUrl,
      information: tournament.information || '',
      format: tournament.format || 'bracket',
      ageGroups: tournament.spotsPerAgeGroup
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData(defaultFormData);
  };

  const addAgeGroup = () => {
    setFormData(prev => ({
      ...prev,
      ageGroups: [...prev.ageGroups, { ageGroup: '', spots: 8 }]
    }));
  };

  const removeAgeGroup = (index: number) => {
    setFormData(prev => ({
      ...prev,
      ageGroups: prev.ageGroups.filter((_, i) => i !== index)
    }));
  };

  const getFormatLabel = (format: TournamentFormat) => {
    switch (format) {
      case 'pool':
        return 'Pool Play';
      case 'roundRobin':
        return 'Round Robin';
      case 'bracket':
        return 'Bracket Play';
    }
  };

  if (!isAdmin) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Tournament Management</h1>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingTournament(null);
            resetForm();
          }}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          {showForm ? 'Cancel' : 'Add Tournament'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {editingTournament ? 'Edit Tournament' : 'Create Tournament'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Tournament Title *
                </label>
                <input
                  type="text"
                  id="title"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                  Date *
                </label>
                <input
                  type="text"
                  id="date"
                  required
                  placeholder="e.g., April 15-17, 2024"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Location *
                </label>
                <input
                  type="text"
                  id="location"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="entryFee" className="block text-sm font-medium text-gray-700 mb-1">
                  Entry Fee *
                </label>
                <input
                  type="text"
                  id="entryFee"
                  required
                  placeholder="e.g., $450 per team"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.entryFee}
                  onChange={(e) => setFormData({ ...formData, entryFee: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                  Type *
                </label>
                <select
                  id="type"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as 'baseball' | 'softball' })}
                >
                  <option value="baseball">Baseball</option>
                  <option value="softball">Softball</option>
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

              <div>
                <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL *
                </label>
                <input
                  type="url"
                  id="imageUrl"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label htmlFor="information" className="block text-sm font-medium text-gray-700 mb-1">
                Tournament Information
              </label>
              <textarea
                id="information"
                rows={6}
                placeholder="Enter detailed tournament information, rules, schedules, and any other important details..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.information}
                onChange={(e) => setFormData({ ...formData, information: e.target.value })}
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Age Groups</h3>
                <button
                  type="button"
                  onClick={addAgeGroup}
                  className="inline-flex items-center px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Age Group
                </button>
              </div>
              
              <div className="space-y-4">
                {formData.ageGroups.map((group, index) => (
                  <div key={index} className="flex gap-4 items-center">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Age Group
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g., 12U"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={group.ageGroup}
                        onChange={(e) => {
                          const newGroups = [...formData.ageGroups];
                          newGroups[index].ageGroup = e.target.value;
                          setFormData({ ...formData, ageGroups: newGroups });
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Max Teams
                      </label>
                      <input
                        type="number"
                        required
                        min="1"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={group.spots}
                        onChange={(e) => {
                          const newGroups = [...formData.ageGroups];
                          newGroups[index].spots = parseInt(e.target.value);
                          setFormData({ ...formData, ageGroups: newGroups });
                        }}
                      />
                    </div>
                    {formData.ageGroups.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeAgeGroup(index)}
                        className="mt-6 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600">
                <AlertCircle className="w-5 h-5" />
                <p>{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Tournament'
              )}
            </button>
          </form>
        </div>
      )}

      <div className="space-y-6">
        {tournaments.map((tournament) => (
          <div key={tournament.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{tournament.title}</h3>
                <p className="text-gray-600">{tournament.date}</p>
                <p className="text-gray-600">{tournament.location}</p>
                <div className="flex items-center gap-2 mt-2">
                  <LayoutTemplate className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-600">
                    {getFormatLabel(tournament.format || 'bracket')}
                  </span>
                </div>
                {tournament.information && (
                  <p className="text-gray-600 mt-2 line-clamp-2">{tournament.information}</p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(tournament)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(tournament.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}