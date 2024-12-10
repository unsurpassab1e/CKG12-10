import React, { useState } from 'react';
import { Plus, Trash2, Edit2, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../components/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../lib/store';

interface AgeGroupSpots {
  ageGroup: string;
  spots: number;
}

interface Tournament {
  id: string;
  title: string;
  date: string;
  location: string;
  spotsPerAgeGroup: AgeGroupSpots[];
  entryFee: string;
  type: 'baseball' | 'softball';
  imageUrl: string;
}

export default function AdminDashboard() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const { tournaments, addTournament, deleteTournament, updateTournament } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingTournament, setEditingTournament] = useState<Tournament | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    date: '',
    location: '',
    entryFee: '',
    type: 'baseball' as const,
    imageUrl: '',
    ageGroups: [
      { ageGroup: '8U', spots: 8 },
      { ageGroup: '10U', spots: 8 },
      { ageGroup: '12U', spots: 8 },
      { ageGroup: '14U', spots: 8 }
    ]
  });

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
      if (editingTournament) {
        await updateTournament({
          ...editingTournament,
          ...formData,
          spotsPerAgeGroup: formData.ageGroups
        });
      } else {
        await addTournament({
          ...formData,
          spotsPerAgeGroup: formData.ageGroups
        });
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
      ageGroups: tournament.spotsPerAgeGroup
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      date: '',
      location: '',
      entryFee: '',
      type: 'baseball',
      imageUrl: '',
      ageGroups: [
        { ageGroup: '8U', spots: 8 },
        { ageGroup: '10U', spots: 8 },
        { ageGroup: '12U', spots: 8 },
        { ageGroup: '14U', spots: 8 }
      ]
    });
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

      <div className="space-y-6">
        {tournaments.map((tournament) => (
          <div key={tournament.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{tournament.title}</h3>
                <p className="text-gray-600">{tournament.date}</p>
                <p className="text-gray-600">{tournament.location}</p>
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