import React from 'react';
import { X } from 'lucide-react';
import TournamentBracket from './TournamentBracket';

interface BracketModalProps {
  isOpen: boolean;
  onClose: () => void;
  bracket: any;
  title: string;
  isAdmin?: boolean;
  onUpdateScore?: (gameId: string, homeScore: number, awayScore: number) => void;
  onUpdateGame?: (gameId: string, updates: any) => void;
  onAddGame?: (round: number) => void;
  onDeleteGame?: (gameId: string) => void;
  registeredTeams?: Record<string, any[]>;
}

export default function BracketModal({
  isOpen,
  onClose,
  bracket,
  title,
  isAdmin,
  onUpdateScore,
  onUpdateGame,
  onAddGame,
  onDeleteGame,
  registeredTeams
}: BracketModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-[95vw] h-[90vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="flex-1 overflow-auto p-4">
          <TournamentBracket
            games={bracket}
            title={title}
            isAdmin={isAdmin}
            onUpdateScore={onUpdateScore}
            onUpdateGame={onUpdateGame}
            onAddGame={onAddGame}
            onDeleteGame={onDeleteGame}
            registeredTeams={registeredTeams}
          />
        </div>
      </div>
    </div>
  );
}