import React, { useState } from 'react';
import { Search, Filter, Loader2, AlertCircle, UserPlus, Edit2, Trash2 } from 'lucide-react';
import emailjs from '@emailjs/browser';
import SortSelect from '../components/SortSelect';
import { useStore } from '../lib/store';
import { useAuth } from '../components/AuthContext';

interface FormData {
  playerName: string;
  age: string;
  position: string;
  experience: string;
  availability: string;
  email: string;
  phone: string;
}

export default function PickUpPlayer() {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { pickUpPlayers, addPickUpPlayer, updatePickUpPlayer, deletePickUpPlayer } = useStore();
  const { isAdmin } = useAuth();
  const [editingPlayer, setEditingPlayer] = useState<any | null>(null);

  const [formData, setFormData] = useState<FormData>({
    playerName: '',
    age: '',
    position: '',
    experience: '',
    availability: '',
    email: '',
    phone: ''
  });

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'name', label: 'Player Name' }
  ];

  const handleEdit = (player: any) => {
    setEditingPlayer(player);
    setFormData({
      playerName: player.playerName,
      age: player.age,
      position: player.position,
      experience: player.experience,
      availability: player.availability,
      email: player.email,
      phone: player.phone || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (playerId: string) => {
    if (window.confirm('Are you sure you want to delete this player?')) {
      try {
        await deletePickUpPlayer(playerId);
      } catch (error) {
        console.error('Error deleting player:', error);
        setError('Error deleting player. Please try again.');
      }
    }
  };

  // Filter players based on search term and age group
  const filteredPlayers = pickUpPlayers?.filter(player => {
    const matchesSearch = player.playerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         player.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAge = selectedAgeGroup === 'all' || player.age === selectedAgeGroup;
    return matchesSearch && matchesAge;
  }) || [];

  // Sort filtered players
  const sortedPlayers = [...filteredPlayers].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.datePosted).getTime() - new Date(a.datePosted).getTime();
      case 'oldest':
        return new Date(a.datePosted).getTime() - new Date(b.datePosted).getTime();
      case 'name':
        return a.playerName.localeCompare(b.playerName);
      default:
        return 0;
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (editingPlayer) {
        await updatePickUpPlayer({
          ...editingPlayer,
          ...formData
        });
      } else {
        await addPickUpPlayer({
          ...formData,
          datePosted: new Date().toISOString()
        });

        if (import.meta.env.VITE_EMAILJS_TEMPLATE_ID_PICKUP) {
          await emailjs.send(
            import.meta.env.VITE_EMAILJS_SERVICE_ID,
            import.meta.env.VITE_EMAILJS_TEMPLATE_ID_PICKUP,
            {
              to_email: 'ckgtournaments@gmail.com',
              player_name: formData.playerName,
              age_group: formData.age,
              position: formData.position,
              experience: formData.experience,
              availability: formData.availability,
              email: formData.email,
              phone: formData.phone || 'Not provided'
            }
          );
        }
      }

      setShowForm(false);
      setEditingPlayer(null);
      setFormData({
        playerName: '',
        age: '',
        position: '',
        experience: '',
        availability: '',
        email: '',
        phone: ''
      });
    } catch (error) {
      console.error('Error submitting player:', error);
      setError('There was an error submitting your registration. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Pick Up Player Registry</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Find players for your team or register as an available player for upcoming tournaments.
        </p>
      </div>

      <div className="mb-8">
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingPlayer(null);
            setFormData({
              playerName: '',
              age: '',
              position: '',
              experience: '',
              availability: '',
              email: '',
              phone: ''
            });
          }}
          className="w-full md:w-auto bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          <UserPlus className="w-5 h-5" />
          {showForm ? 'Cancel Registration' : 'Register as Available Player'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {editingPlayer ? 'Edit Player' : 'Player Registration'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="playerName" className="block text-sm font-medium text-gray-700 mb-1">
                  Player Name *
                </label>
                <input
                  type="text"
                  id="playerName"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.playerName}
                  onChange={(e) => setFormData({ ...formData, playerName: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                  Age Group *
                </label>
                <select
                  id="age"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                >
                  <option value="">Select Age Group</option>
                  <option value="8U">8U</option>
                  <option value="10U">10U</option>
                  <option value="12U">12U</option>
                  <option value="14U">14U</option>
                  <option value="16U">16U</option>
                  <option value="18U">18U</option>
                </select>
              </div>

              <div>
                <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
                  Position *
                </label>
                <input
                  type="text"
                  id="position"
                  required
                  placeholder="e.g., Pitcher, Catcher, etc."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
                  Experience Level *
                </label>
                <select
                  id="experience"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                >
                  <option value="">Select Level</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="recreational">Recreational</option>
                </select>
              </div>

              <div>
                <label htmlFor="availability" className="block text-sm font-medium text-gray-700 mb-1">
                  Availability *
                </label>
                <input
                  type="text"
                  id="availability"
                  required
                  placeholder="e.g., Weekends, Summer only, etc."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.availability}
                  onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
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
                  Submitting...
                </>
              ) : (
                editingPlayer ? 'Update Player' : 'Register as Available Player'
              )}
            </button>
          </form>
        </div>
      )}

      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search players..."
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
              value={selectedAgeGroup}
              onChange={(e) => setSelectedAgeGroup(e.target.value)}
            >
              <option value="all">All Age Groups</option>
              <option value="8U">8U</option>
              <option value="10U">10U</option>
              <option value="12U">12U</option>
              <option value="14U">14U</option>
              <option value="16U">16U</option>
              <option value="18U">18U</option>
            </select>
          </div>
          <SortSelect
            value={sortBy}
            onChange={setSortBy}
            options={sortOptions}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedPlayers.map((player) => (
          <div key={player.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-gray-900">{player.playerName}</h3>
              {isAdmin && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(player)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(player.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
            <div className="space-y-2 text-gray-600">
              <p><span className="font-medium">Age Group:</span> {player.age}</p>
              <p><span className="font-medium">Position:</span> {player.position}</p>
              <p><span className="font-medium">Experience:</span> {player.experience}</p>
              <p><span className="font-medium">Availability:</span> {player.availability}</p>
              <p><span className="font-medium">Contact:</span></p>
              <ul className="ml-4">
                <li>Email: {player.email}</li>
                {player.phone && <li>Phone: {player.phone}</li>}
              </ul>
              <p className="text-sm text-gray-500">
                Posted on {new Date(player.datePosted).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}

        {sortedPlayers.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-600">
              {searchTerm || selectedAgeGroup !== 'all'
                ? 'No players found matching your criteria. Try adjusting your filters.'
                : 'No available players at this time. Be the first to register!'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}