import React, { useState } from 'react';
import { Settings, Move, Trash2, Save, AlertCircle, Loader2 } from 'lucide-react';
import { useStore } from '../lib/store';

interface Team {
  id: string;
  name: string;
  coachName: string;
  email: string;
  phone: string;
  skillLevel: string;
  registrationDate: string;
  notes?: string;
  paymentStatus?: 'pending' | 'partial' | 'paid';
  specialRequests?: string;
}

interface AdminControlsProps {
  tournamentId: string;
  ageGroup: string;
  team: Team;
}

export default function AdminControls({ tournamentId, ageGroup, team }: AdminControlsProps) {
  const { tournaments, updateRegisteredTeam, moveTeam } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [editedTeam, setEditedTeam] = useState(team);
  const [moveTarget, setMoveTarget] = useState({ tournamentId: '', ageGroup: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpdate = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      await updateRegisteredTeam(tournamentId, ageGroup, editedTeam);
      setIsEditing(false);
    } catch (err) {
      setError('Failed to update team');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMove = async () => {
    if (!moveTarget.tournamentId || !moveTarget.ageGroup) {
      setError('Please select a destination');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await moveTeam(
        tournamentId,
        moveTarget.tournamentId,
        ageGroup,
        moveTarget.ageGroup,
        team.id
      );
      setIsMoving(false);
    } catch (err) {
      setError('Failed to move team');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-4 space-y-4">
      <div className="flex gap-2">
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        >
          <Settings className="w-5 h-5" />
        </button>
        <button
          onClick={() => setIsMoving(!isMoving)}
          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
        >
          <Move className="w-5 h-5" />
        </button>
      </div>

      {isEditing && (
        <div className="bg-gray-50 p-4 rounded-lg space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Status
            </label>
            <select
              value={editedTeam.paymentStatus || 'pending'}
              onChange={(e) => setEditedTeam({
                ...editedTeam,
                paymentStatus: e.target.value as 'pending' | 'partial' | 'paid'
              })}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="pending">Pending</option>
              <option value="partial">Partial</option>
              <option value="paid">Paid</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Admin Notes
            </label>
            <textarea
              value={editedTeam.notes || ''}
              onChange={(e) => setEditedTeam({
                ...editedTeam,
                notes: e.target.value
              })}
              className="w-full px-3 py-2 border rounded-lg"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Special Requests
            </label>
            <textarea
              value={editedTeam.specialRequests || ''}
              onChange={(e) => setEditedTeam({
                ...editedTeam,
                specialRequests: e.target.value
              })}
              className="w-full px-3 py-2 border rounded-lg"
              rows={3}
            />
          </div>

          <button
            onClick={handleUpdate}
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            Save Changes
          </button>
        </div>
      )}

      {isMoving && (
        <div className="bg-gray-50 p-4 rounded-lg space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Tournament
            </label>
            <select
              value={moveTarget.tournamentId}
              onChange={(e) => setMoveTarget({
                ...moveTarget,
                tournamentId: e.target.value
              })}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="">Select Tournament</option>
              {tournaments.map((t) => (
                <option key={t.id} value={t.id}>{t.title}</option>
              ))}
            </select>
          </div>

          {moveTarget.tournamentId && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Age Group
              </label>
              <select
                value={moveTarget.ageGroup}
                onChange={(e) => setMoveTarget({
                  ...moveTarget,
                  ageGroup: e.target.value
                })}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="">Select Age Group</option>
                {tournaments
                  .find(t => t.id === moveTarget.tournamentId)
                  ?.spotsPerAgeGroup.map((ag) => (
                    <option key={ag.ageGroup} value={ag.ageGroup}>
                      {ag.ageGroup}
                    </option>
                  ))}
              </select>
            </div>
          )}

          <button
            onClick={handleMove}
            disabled={isSubmitting}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:bg-green-400 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Move className="w-5 h-5" />
            )}
            Move Team
          </button>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-red-600">
          <AlertCircle className="w-5 h-5" />
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}