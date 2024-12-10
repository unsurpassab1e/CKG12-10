import React, { useState } from 'react';
import { AlertCircle, Loader2, Send } from 'lucide-react';
import { useStore } from '../lib/store';
import { sendAnnouncementEmail } from '../lib/emailTemplates';

interface AnnouncementFormProps {
  onClose: () => void;
  editingAnnouncement?: any;
}

export default function AnnouncementForm({ onClose, editingAnnouncement }: AnnouncementFormProps) {
  const { addAnnouncement, updateAnnouncement } = useStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: editingAnnouncement?.title || '',
    content: editingAnnouncement?.content || '',
    priority: editingAnnouncement?.priority || 'low',
    sendEmail: true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const announcementData = {
        title: formData.title,
        content: formData.content,
        priority: formData.priority as 'low' | 'medium' | 'high',
        date: new Date().toISOString()
      };

      if (editingAnnouncement) {
        await updateAnnouncement({
          ...editingAnnouncement,
          ...announcementData
        });
      } else {
        await addAnnouncement(announcementData);

        if (formData.sendEmail) {
          await sendAnnouncementEmail(announcementData.priority, {
            to_email: 'subscribers@example.com',
            subject: announcementData.title,
            message: announcementData.content
          });
        }
      }

      onClose();
    } catch (error) {
      console.error('Error saving announcement:', error);
      setError('Error saving announcement. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">
        {editingAnnouncement ? 'Edit Announcement' : 'Create Announcement'}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title *
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
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            Content *
          </label>
          <textarea
            id="content"
            required
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          />
        </div>

        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
            Priority *
          </label>
          <select
            id="priority"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        {!editingAnnouncement && (
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="sendEmail"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              checked={formData.sendEmail}
              onChange={(e) => setFormData({ ...formData, sendEmail: e.target.checked })}
            />
            <label htmlFor="sendEmail" className="text-sm text-gray-700">
              Send email notification to subscribers
            </label>
          </div>
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
                <Send className="w-5 h-5 mr-2" />
                {editingAnnouncement ? 'Update' : 'Create'} Announcement
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}