import React, { useState } from 'react';
import { Calendar, MapPin, Users, Trophy, LayoutTemplate } from 'lucide-react';
import RegistrationModal from './RegistrationModal';
import RegisteredTeamsList from './RegisteredTeamsList';

interface AgeGroupSpots {
  ageGroup: string;
  spots: number;
}

interface Team {
  id: string;
  name: string;
  coachName: string;
  email: string;
  phone: string;
  skillLevel: string;
  registrationDate: string;
}

type TournamentFormat = 'pool' | 'roundRobin' | 'bracket';

interface TournamentProps {
  id: string;
  title: string;
  date: string;
  location: string;
  spotsPerAgeGroup: AgeGroupSpots[];
  entryFee: string;
  type: 'baseball' | 'softball';
  format: TournamentFormat;
  imageUrl: string;
  registeredTeams?: Record<string, Team[]>;
  onRemoveTeam?: (tournamentId: string, ageGroup: string, teamId: string) => void;
}

export default function TournamentCard({
  id,
  title,
  date,
  location,
  spotsPerAgeGroup,
  entryFee,
  type,
  format,
  imageUrl,
  registeredTeams = {},
  onRemoveTeam,
}: TournamentProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAllAgeGroups, setShowAllAgeGroups] = useState(false);

  const displayedAgeGroups = showAllAgeGroups 
    ? spotsPerAgeGroup 
    : spotsPerAgeGroup.slice(0, 3);

  const handleRemoveTeam = (ageGroup: string, teamId: string) => {
    if (onRemoveTeam) {
      onRemoveTeam(id, ageGroup, teamId);
    }
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

  return (
    <>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-[1.02]">
        <div className="relative h-48">
          <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
          <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-semibold capitalize">
            {type}
          </div>
        </div>
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
          <div className="space-y-2">
            <div className="flex items-center text-gray-600">
              <Calendar className="w-5 h-5 mr-2" />
              <span>{date}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <MapPin className="w-5 h-5 mr-2" />
              <span>{location}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <LayoutTemplate className="w-5 h-5 mr-2" />
              <span>{getFormatLabel(format)}</span>
            </div>
            <div className="text-gray-600">
              <div className="flex items-center mb-2">
                <Users className="w-5 h-5 mr-2" />
                <span>Spots Remaining:</span>
              </div>
              <div className="ml-7 space-y-1">
                {displayedAgeGroups.map((ag, index) => {
                  const registeredCount = registeredTeams[ag.ageGroup]?.length || 0;
                  const spotsLeft = ag.spots - registeredCount;
                  
                  return (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{ag.ageGroup}:</span>
                      <span className="font-medium">{spotsLeft} spots</span>
                    </div>
                  );
                })}
                {spotsPerAgeGroup.length > 3 && (
                  <button
                    onClick={() => setShowAllAgeGroups(!showAllAgeGroups)}
                    className="text-blue-600 hover:text-blue-700 text-sm mt-1"
                  >
                    {showAllAgeGroups ? 'Show Less' : `Show ${spotsPerAgeGroup.length - 3} More`}
                  </button>
                )}
              </div>
            </div>
            <div className="flex items-center text-gray-600">
              <Trophy className="w-5 h-5 mr-2" />
              <span>{entryFee}</span>
            </div>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Register Now
          </button>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <RegisteredTeamsList 
              teams={registeredTeams}
              onRemoveTeam={handleRemoveTeam}
            />
          </div>
        </div>
      </div>

      <RegistrationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        tournament={{
          id,
          title,
          date,
          location,
          entryFee,
          type,
          format,
          spotsPerAgeGroup
        }}
      />
    </>
  );
}