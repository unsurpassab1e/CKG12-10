import React, { useState } from 'react';
import { X, Loader2, AlertCircle, Bell } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { useStore } from '../lib/store';
import { v4 as uuidv4 } from 'uuid';
import { sendRegistrationEmail, sendRegistrationConfirmationEmail } from '../lib/emailTemplates';
import { handleFirebaseError } from '../lib/firebase';

interface AgeGroupSpots {
  ageGroup: string;
  spots: number;
}

interface TournamentInfo {
  id: string;
  title: string;
  date: string;
  location: string;
  entryFee: string;
  type: 'baseball' | 'softball';
  spotsPerAgeGroup: AgeGroupSpots[];
}

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  tournament: TournamentInfo;
}

export default function RegistrationModal({ isOpen, onClose, tournament }: RegistrationModalProps) {
  const { addRegisteredTeam, waitForSync } = useStore();
  const [formData, setFormData] = useState({
    teamName: '',
    coachName: '',
    email: '',
    phone: '',
    ageGroup: '',
    skillLevel: 'A'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showPaymentInfo, setShowPaymentInfo] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return; // Prevent multiple submissions
    
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      // Add team to store with retry logic
      const teamData = {
        id: uuidv4(),
        name: formData.teamName,
        coachName: formData.coachName,
        email: formData.email,
        phone: formData.phone,
        skillLevel: formData.skillLevel,
        registrationDate: new Date().toISOString()
      };

      const registerTeam = async (attempt = 0): Promise<void> => {
        try {
          await addRegisteredTeam(tournament.id, formData.ageGroup, teamData);
          // Wait for sync to ensure data is persisted
          await waitForSync();
        } catch (error: any) {
          if (error.code === 'unavailable' && attempt < MAX_RETRIES) {
            // Exponential backoff
            const delay = Math.min(1000 * Math.pow(2, attempt), 10000);
            await new Promise(resolve => setTimeout(resolve, delay));
            return registerTeam(attempt + 1);
          }
          throw error;
        }
      };

      await registerTeam();

      // Send registration email to admin
      await sendRegistrationEmail({
        to_email: 'ckgtournaments@gmail.com',
        tournament_title: tournament.title,
        tournament_date: tournament.date,
        tournament_location: tournament.location,
        team_name: formData.teamName,
        coach_name: formData.coachName,
        email: formData.email,
        phone: formData.phone,
        age_group: formData.ageGroup,
        skill_level: formData.skillLevel,
        entry_fee: tournament.entryFee
      });

      // Send confirmation email to registrant
      await sendRegistrationConfirmationEmail({
        to_email: formData.email,
        coach_name: formData.coachName,
        team_name: formData.teamName,
        tournament_title: tournament.title,
        tournament_date: tournament.date,
        tournament_location: tournament.location,
        age_group: formData.ageGroup,
        entry_fee: tournament.entryFee
      });

      setShowPaymentInfo(true);
      setFormData({
        teamName: '',
        coachName: '',
        email: '',
        phone: '',
        ageGroup: '',
        skillLevel: 'A'
      });
    } catch (error) {
      console.error('Error submitting registration:', error);
      const handledError = handleFirebaseError(error);
      setSubmitError(handledError.message);
      
      if (retryCount < MAX_RETRIES) {
        setRetryCount(prev => prev + 1);
        // Auto-retry after a delay
        setTimeout(() => {
          setIsSubmitting(false);
          handleSubmit(e);
        }, 2000);
      } else {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={(e) => {
        if (!isSubmitting) onClose();
      }}
    >
      <div 
        className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Tournament Registration</h2>
            {!isSubmitting && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="w-6 h-6" />
              </button>
            )}
          </div>

          {showPaymentInfo ? (
            <div className="space-y-6">
              <div className="bg-green-50 text-green-800 p-4 rounded-lg">
                <p className="font-medium">Registration Successful!</p>
                <p className="mt-2">A confirmation email has been sent to {formData.email}</p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Payment Information</h3>
                <p className="text-blue-800 mb-4">
                  To secure your spot, please submit 50% of the entry fee ({tournament.entryFee.replace(/\$(\d+)/, (_, amount) => `$${parseInt(amount) / 2}`)}) using one of the following methods:
                </p>
                <div className="space-y-2 text-blue-800">
                  <p>• CashApp: $ckgtournamets</p>
                  <p>• Venmo: @Jeffery-Nash-2</p>
                </div>
                <p className="mt-4 text-sm text-blue-700">
                  Please include your team name and tournament date in the payment description.
                </p>
              </div>

              <button
                onClick={onClose}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Close
              </button>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h3 className="font-semibold text-lg mb-2">{tournament.title}</h3>
                <p className="text-gray-600">
                  {tournament.date} • {tournament.location}
                </p>
                <p className="text-gray-600">Entry Fee: {tournament.entryFee}</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="teamName" className="block text-sm font-medium text-gray-700 mb-1">
                    Team Name *
                  </label>
                  <input
                    type="text"
                    id="teamName"
                    required
                    disabled={isSubmitting}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    value={formData.teamName}
                    onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
                  />
                </div>

                <div>
                  <label htmlFor="coachName" className="block text-sm font-medium text-gray-700 mb-1">
                    Coach Name *
                  </label>
                  <input
                    type="text"
                    id="coachName"
                    required
                    disabled={isSubmitting}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    value={formData.coachName}
                    onChange={(e) => setFormData({ ...formData, coachName: e.target.value })}
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
                    disabled={isSubmitting}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    required
                    disabled={isSubmitting}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div>
                  <label htmlFor="ageGroup" className="block text-sm font-medium text-gray-700 mb-1">
                    Age Group *
                  </label>
                  <select
                    id="ageGroup"
                    required
                    disabled={isSubmitting}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    value={formData.ageGroup}
                    onChange={(e) => setFormData({ ...formData, ageGroup: e.target.value })}
                  >
                    <option value="">Select Age Group</option>
                    {tournament.spotsPerAgeGroup.map((ag) => (
                      <option key={ag.ageGroup} value={ag.ageGroup}>
                        {ag.ageGroup} ({ag.spots} spots left)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="skillLevel" className="block text-sm font-medium text-gray-700 mb-1">
                    Team Skill Level *
                  </label>
                  <select
                    id="skillLevel"
                    required
                    disabled={isSubmitting}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    value={formData.skillLevel}
                    onChange={(e) => setFormData({ ...formData, skillLevel: e.target.value })}
                  >
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                  </select>
                </div>

                {submitError && (
                  <div className="flex items-center gap-2 text-red-600">
                    <AlertCircle className="w-5 h-5" />
                    <p>{submitError}</p>
                    {retryCount > 0 && retryCount < MAX_RETRIES && (
                      <p className="text-sm">Retrying... ({retryCount}/{MAX_RETRIES})</p>
                    )}
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
                      {retryCount > 0 ? 'Retrying...' : 'Submitting...'}
                    </>
                  ) : (
                    'Submit Registration'
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}