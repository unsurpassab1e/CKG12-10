import React from 'react';
import { Users, Trash2 } from 'lucide-react';
import { useAuth } from './AuthContext';
import AdminControls from './AdminControls';

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

interface RegisteredTeamsListProps {
  tournamentId: string;
  teams: Record<string, Team[]>;
  onRemoveTeam?: (ageGroup: string, teamId: string) => void;
}

export default function RegisteredTeamsList({ tournamentId, teams, onRemoveTeam }: RegisteredTeamsListProps) {
  const { isAdmin } = useAuth();

  const getPaymentStatusColor = (status?: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'partial':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-red-100 text-red-800';
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
        <Users className="w-5 h-5" />
        Registered Teams
      </h3>
      
      {Object.entries(teams).length === 0 ? (
        <p className="text-gray-600 italic">No teams registered yet</p>
      ) : (
        Object.entries(teams).map(([ageGroup, teamsList]) => (
          <div key={ageGroup} className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-lg text-gray-900 mb-3">{ageGroup}</h4>
            <div className="space-y-3">
              {teamsList.map((team) => (
                <div 
                  key={team.id}
                  className="bg-white p-4 rounded-lg shadow-sm"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h5 className="font-medium text-gray-900">{team.name}</h5>
                      <div className="text-sm text-gray-600 mt-1">
                        <p>Coach: {team.coachName}</p>
                        <p>Level: {team.skillLevel}</p>
                        {isAdmin && (
                          <>
                            <p>Email: {team.email}</p>
                            <p>Phone: {team.phone}</p>
                          </>
                        )}
                        <div className="flex gap-2 mt-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(team.paymentStatus)}`}>
                            {team.paymentStatus || 'pending'}
                          </span>
                          <span className="text-xs text-gray-500">
                            Registered on {new Date(team.registrationDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    {isAdmin && onRemoveTeam && (
                      <button
                        onClick={() => onRemoveTeam(ageGroup, team.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remove team"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>

                  {isAdmin && team.notes && (
                    <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                      <p className="font-medium">Admin Notes:</p>
                      <p className="text-gray-600">{team.notes}</p>
                    </div>
                  )}

                  {isAdmin && team.specialRequests && (
                    <div className="mt-2 p-2 bg-yellow-50 rounded text-sm">
                      <p className="font-medium">Special Requests:</p>
                      <p className="text-gray-600">{team.specialRequests}</p>
                    </div>
                  )}

                  {isAdmin && (
                    <AdminControls
                      tournamentId={tournamentId}
                      ageGroup={ageGroup}
                      team={team}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}