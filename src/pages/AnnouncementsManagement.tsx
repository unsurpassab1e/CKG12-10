import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Bell } from 'lucide-react';
import { useAuth } from '../components/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../lib/store';
import AnnouncementForm from '../components/AnnouncementForm';

export default function AnnouncementsManagement() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const { announcements, deleteAnnouncement } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<any | null>(null);

  React.useEffect(() => {
    if (!isAdmin) {
      navigate('/');
    }
  }, [isAdmin, navigate]);

  const handleDeleteAnnouncement = async (announcementId: string) => {
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      try {
        await deleteAnnouncement(announcementId);
      } catch (error) {
        console.error('Error deleting announcement:', error);
      }
    }
  };

  const handleEditAnnouncement = (announcement: any) => {
    setEditingAnnouncement(announcement);
    setShowForm(true);
  };

  if (!isAdmin) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Announcements Management</h1>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingAnnouncement(null);
          }}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          {showForm ? 'Cancel' : 'Add Announcement'}
        </button>
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

      <div className="space-y-4">
        {announcements.map((announcement) => (
          <div key={announcement.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start">
              <div className="flex items-start space-x-3">
                <Bell className="w-5 h-5 text-blue-600 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{announcement.title}</h3>
                  <p className="text-gray-600 mt-1">{announcement.content}</p>
                  <div className="flex items-center mt-2 space-x-4">
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      announcement.priority === 'high' ? 'bg-red-100 text-red-800' :
                      announcement.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {announcement.priority.charAt(0).toUpperCase() + announcement.priority.slice(1)} Priority
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(announcement.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditAnnouncement(announcement)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDeleteAnnouncement(announcement.id)}
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