import { create } from 'zustand';
import { User, Boat, SwipeProfile, Conversation } from './types';
import { mockUsers, mockBoats, mockSwipeProfiles, mockConversations } from './mock-data';

interface AppState {
  // Auth
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;

  // Boats
  boats: Boat[];
  selectedBoat: Boat | null;
  boatFilter: {
    type: string | null;
    minPrice: number;
    maxPrice: number;
    location: string | null;
    minCapacity: number;
  };
  setBoats: (boats: Boat[]) => void;
  setSelectedBoat: (boat: Boat | null) => void;
  setBoatFilter: (filter: Partial<AppState['boatFilter']>) => void;

  // Dating
  swipeProfiles: SwipeProfile[];
  currentSwipeIndex: number;
  matches: string[];
  swipeRight: (profileId: string) => void;
  swipeLeft: () => void;

  // Chat
  conversations: Conversation[];
  activeConversation: string | null;
  setActiveConversation: (id: string | null) => void;

  // UI
  isMobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  activeTab: 'boats' | 'dating' | 'chat' | 'concierge' | 'profile';
  setActiveTab: (tab: AppState['activeTab']) => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Auth
  currentUser: mockUsers[0],
  setCurrentUser: (user) => set({ currentUser: user }),

  // Boats
  boats: mockBoats,
  selectedBoat: null,
  boatFilter: {
    type: null,
    minPrice: 0,
    maxPrice: 10000,
    location: null,
    minCapacity: 1,
  },
  setBoats: (boats) => set({ boats }),
  setSelectedBoat: (boat) => set({ selectedBoat: boat }),
  setBoatFilter: (filter) =>
    set((state) => ({
      boatFilter: { ...state.boatFilter, ...filter },
    })),

  // Dating
  swipeProfiles: mockSwipeProfiles,
  currentSwipeIndex: 0,
  matches: [],
  swipeRight: (profileId) =>
    set((state) => ({
      matches: [...state.matches, profileId],
      currentSwipeIndex: state.currentSwipeIndex + 1,
    })),
  swipeLeft: () =>
    set((state) => ({
      currentSwipeIndex: state.currentSwipeIndex + 1,
    })),

  // Chat
  conversations: mockConversations,
  activeConversation: null,
  setActiveConversation: (id) => set({ activeConversation: id }),

  // UI
  isMobileMenuOpen: false,
  setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
  activeTab: 'boats',
  setActiveTab: (tab) => set({ activeTab: tab }),
}));
