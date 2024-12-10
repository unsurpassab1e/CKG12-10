import { create } from 'zustand';
import { User } from 'firebase/auth';
import { 
  collection, 
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  getDocs,
  query,
  orderBy,
  onSnapshot,
  where,
  setDoc,
  Timestamp,
  getDoc,
  QuerySnapshot,
  DocumentData
} from 'firebase/firestore';
import { db } from './firebase';
import { handleFirebaseError } from './firebase/errors';
import { networkManager } from './firebase/network';

interface Store {
  user: User | null;
  isAdmin: boolean;
  isOnline: boolean;
  pendingWrites: boolean;
  tournaments: Tournament[];
  results: any[];
  pickUpPlayers: any[];
  announcements: any[];
  sponsors: any[];
  registeredTeams: Record<string, Record<string, Team[]>>;
  setUser: (user: User | null) => void;
  setIsAdmin: (isAdmin: boolean) => void;
  addTournament: (tournament: any) => Promise<void>;
  updateTournament: (tournament: any) => Promise<void>;
  deleteTournament: (id: string) => Promise<void>;
  addResult: (result: any) => Promise<void>;
  updateResult: (result: any) => Promise<void>;
  deleteResult: (id: string) => Promise<void>;
  addPickUpPlayer: (player: any) => Promise<void>;
  updatePickUpPlayer: (player: any) => Promise<void>;
  deletePickUpPlayer: (id: string) => Promise<void>;
  addAnnouncement: (announcement: any) => Promise<void>;
  updateAnnouncement: (announcement: any) => Promise<void>;
  deleteAnnouncement: (id: string) => Promise<void>;
  addSponsor: (sponsor: any) => Promise<void>;
  updateSponsor: (sponsor: any) => Promise<void>;
  deleteSponsor: (id: string) => Promise<void>;
  addRegisteredTeam: (tournamentId: string, ageGroup: string, team: Team) => Promise<void>;
  removeRegisteredTeam: (tournamentId: string, ageGroup: string, teamId: string) => Promise<void>;
  updateRegisteredTeam: (tournamentId: string, ageGroup: string, team: Team) => Promise<void>;
  moveTeam: (fromTournamentId: string, toTournamentId: string, fromAgeGroup: string, toAgeGroup: string, teamId: string) => Promise<void>;
  bulkUpdateTeams: (tournamentId: string, ageGroup: string, teams: Team[]) => Promise<void>;
  clearRegistrations: (tournamentId: string) => Promise<void>;
  goOnline: () => Promise<void>;
  goOffline: () => Promise<void>;
  waitForSync: () => Promise<void>;
  initialize: () => void;
}

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

interface Tournament {
  id: string;
  title: string;
  date: string;
  location: string;
  spotsPerAgeGroup: AgeGroupSpots[];
  entryFee: string;
  type: 'baseball' | 'softball';
  imageUrl: string;
}

interface AgeGroupSpots {
  ageGroup: string;
  spots: number;
}

export const useStore = create<Store>((set, get) => {
  // Collection references
  const tournamentsRef = collection(db, 'tournaments');
  const resultsRef = collection(db, 'results');
  const pickUpPlayersRef = collection(db, 'pickUpPlayers');
  const announcementsRef = collection(db, 'announcements');
  const sponsorsRef = collection(db, 'sponsors');
  const registeredTeamsRef = collection(db, 'registeredTeams');

  let unsubscribers: (() => void)[] = [];

  const setupListeners = () => {
    // Clear existing listeners
    unsubscribers.forEach(unsubscribe => unsubscribe());
    unsubscribers = [];

    // Add all the listeners...
    // [Previous listener setup code remains unchanged]
  };

  return {
    user: null,
    isAdmin: false,
    isOnline: true,
    pendingWrites: false,
    tournaments: [],
    results: [],
    pickUpPlayers: [],
    announcements: [],
    sponsors: [],
    registeredTeams: {},

    setUser: (user) => set({ user }),
    setIsAdmin: (isAdmin) => set({ isAdmin }),
    initialize: setupListeners,

    // All other methods remain unchanged...
    // [Previous store implementation continues]
  };
});