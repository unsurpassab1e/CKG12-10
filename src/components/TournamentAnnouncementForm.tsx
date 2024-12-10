import React, { useState } from 'react';
import { AlertCircle, Loader2, Send } from 'lucide-react';
import { useStore } from '../lib/store';
import { sendAnnouncementEmail } from '../lib/emailTemplates';

interface TournamentAnnouncementFormProps {
  onClose: () => void;
}

export default function TournamentAnnouncementForm({ onClose }: TournamentAnnouncementFormProps) {
  const { addAnnouncement, tournaments } = useStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    priority: 'low' as 'low' | 'medium' | 'high',
    tournamentId: '',
    sendEmail: true
  });

  const selectedTournament = tournaments.find(t => t.id === formData.tournamentId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const announcementData = {
        title: formData.title,
        content: formData.content,
        priority: formData.priority,
        tournamentId: formData.tournamentId,
        date: new Date().toISOString()
      };

      // First save the announcement
      await addAnnouncement(announcementData);

      // Then attempt to send email if enabled
      if (formData.sendEmail && selectedTournament) {
        try {
          await sendAnnouncementEmail(announcementData.priority, {
            to_email: 'tournament-participants@example.com',
            subject: `${selectedTournament.title} - ${announcementData.title}`,
            message: announcementData.content,
            tournament_title: selectedTournament.title
          });
        } catch (emailError) {
          console.warn('Email notification failed but announcement was saved');
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
      <h3 className="text-xl font-bold text-gray-900 mb-4">Create Tournament Announcement</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="tournament" className="block text-sm font-medium text-gray-700 mb-1">
            Select Tournament *
          </label>
          <select
            id="tournament"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={formData.tournamentId}
            onChange={(e) => setFormData({ ...formData, tournamentId: e.target.value })}
          >
            <option value="">Select a tournament</option>
            {tournaments.map(tournament => (
              <option key={tournament.id} value={tournament.id}>
                {tournament.title} ({tournament.date})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Announcement Title *
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
            onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'low' | 'medium' | 'high' })}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="sendEmail"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            checked={formData.sendEmail}
            onChange={(e) => setFormData({ ...formData, sendEmail: e.target.checked })}
          />
          <label htmlFor="sendEmail" className="text-sm text-gray-700">
            Send email notification to tournament participants
          </label>
          {formData.sendEmail && (
            <p className="text-sm text-gray-500 ml-2">
              (Requires email template configuration)
            </p>
          )}
        </div>

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
                Sending...
              </>
            ) : (
              <>
                <Send className="w-5 h-5 mr-2" />
                Create Announcement
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}