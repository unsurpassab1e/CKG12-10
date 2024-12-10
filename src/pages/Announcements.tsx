import React, { useState } from 'react';
import { Search, Filter, Bell, AlertCircle, Plus, Edit2, Trash2 } from 'lucide-react';
import SortSelect from '../components/SortSelect';
import { useStore } from '../lib/store';
import { useAuth } from '../components/AuthContext';
import TournamentAnnouncementForm from '../components/TournamentAnnouncementForm';
import AnnouncementForm from '../components/AnnouncementForm';

export default function Announcements() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<'all' | 'low' | 'medium' | 'high'>('all');
  const [sortBy, setSortBy] = useState('newest');
  const [showForm, setShowForm] = useState(false);
  const [showTournamentForm, setShowTournamentForm] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<any | null>(null);
  const { announcements, deleteAnnouncement } = useStore();
  const { isAdmin } = useAuth();

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'priority', label: 'Priority' }
  ];

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      try {
        await deleteAnnouncement(id);
      } catch (error) {
        console.error('Error deleting announcement:', error);
      }
    }
  };

  const handleEdit = (announcement: any) => {
    setEditingAnnouncement(announcement);
    setShowForm(true);
    setShowTournamentForm(false);
  };

  // Filter announcements based on search term and priority
  const filteredAnnouncements = announcements.filter(announcement => {
    const matchesSearch = announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         announcement.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = selectedPriority === 'all' || announcement.priority === selectedPriority;
    return matchesSearch && matchesPriority;
  });

  // Sort filtered announcements
  const sortedAnnouncements = [...filteredAnnouncements].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case 'oldest':
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case 'priority': {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      default:
        return 0;
    }
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-4xl font-bold text-gray-900">Announcements</h1>
          {isAdmin && (
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setShowForm(true);
                  setShowTournamentForm(false);
                  setEditingAnnouncement(null);
                }}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-5 h-5 mr-2" />
                General Announcement
              </button>
              <button
                onClick={() => {
                  setShowTournamentForm(true);
                  setShowForm(false);
                  setEditingAnnouncement(null);
                }}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-5 h-5 mr-2" />
                Tournament Announcement
              </button>
            </div>
          )}
        </div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Stay updated with the latest tournament news and important information
        </p>
      </div>

      {showForm && (
        <AnnouncementForm 
          onClose={() => {
            setShowForm(false);
            setEditingAnnouncement(null);
          }}
          editingAnnouncement={editingAnnouncement}
        />
      )}

      {showTournamentForm && (
        <TournamentAnnouncementForm onClose={() => setShowTournamentForm(false)} />
      )}

      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search announcements..."
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
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value as 'all' | 'low' | 'medium' | 'high')}
            >
              <option value="all">All Priorities</option>
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
          </div>
          <SortSelect
            value={sortBy}
            onChange={setSortBy}
            options={sortOptions}
          />
        </div>
      </div>

      <div className="space-y-6">
        {sortedAnnouncements.map((announcement) => (
          <div key={announcement.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <Bell className="w-5 h-5 text-blue-600 mr-3" />
                <h3 className="text-xl font-bold text-gray-900">{announcement.title}</h3>
              </div>
              <div className="flex items-center gap-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(announcement.priority)}`}>
                  {announcement.priority.charAt(0).toUpperCase() + announcement.priority.slice(1)} Priority
                </span>
                {isAdmin && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(announcement)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(announcement.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
            <p className="text-gray-600 mb-4 whitespace-pre-wrap">{announcement.content}</p>
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>Posted on {new Date(announcement.date).toLocaleDateString()}</span>
              {announcement.tournamentId && (
                <span className="text-blue-600">Related Tournament</span>
              )}
            </div>
          </div>
        ))}

        {sortedAnnouncements.length === 0 && (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Announcements Found</h3>
            <p className="text-gray-600">
              {searchTerm || selectedPriority !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'Check back later for new announcements'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}