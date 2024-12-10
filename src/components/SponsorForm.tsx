import React, { useState } from 'react';
import { AlertCircle, Loader2, Save } from 'lucide-react';
import { useStore } from '../lib/store';
import { handleFirebaseError } from '../lib/firebase';

interface SponsorFormProps {
  onClose: () => void;
  editingSponsor?: any;
}

export default function SponsorForm({ onClose, editingSponsor }: SponsorFormProps) {
  const { addSponsor, updateSponsor } = useStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: editingSponsor?.name || '',
    tier: editingSponsor?.tier || 'Silver',
    logo: editingSponsor?.logo || '',
    description: editingSponsor?.description || '',
    website: editingSponsor?.website || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    setError(null);
    setIsSubmitting(true);

    try {
      if (editingSponsor) {
        await updateSponsor({
          ...editingSponsor,
          ...formData
        });
      } else {
        await addSponsor(formData);
      }
      onClose();
    } catch (error) {
      const handledError = handleFirebaseError(error);
      setError(handledError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">
        {editingSponsor ? 'Edit Sponsor' : 'Add New Sponsor'}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Sponsor Name *
          </label>
          <input
            type="text"
            id="name"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label htmlFor="tier" className="block text-sm font-medium text-gray-700 mb-1">
            Sponsorship Tier *
          </label>
          <select
            id="tier"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={formData.tier}
            onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
            disabled={isSubmitting}
          >
            <option value="Diamond">Diamond</option>
            <option value="Gold">Gold</option>
            <option value="Silver">Silver</option>
          </select>
        </div>

        <div>
          <label htmlFor="logo" className="block text-sm font-medium text-gray-700 mb-1">
            Logo URL *
          </label>
          <input
            type="url"
            id="logo"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={formData.logo}
            onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description *
          </label>
          <textarea
            id="description"
            required
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
            Website URL *
          </label>
          <input
            type="url"
            id="website"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={formData.website}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            disabled={isSubmitting}
          />
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
            disabled={isSubmitting}
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
                {editingSponsor ? 'Update' : 'Add'} Sponsor
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}