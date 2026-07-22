import { create } from 'zustand';

interface GameState {
  level: number;
  xp: number;
  devCoins: number;
  currentStreak: number;
  longestStreak: number;
  rank: string;
  
  // Actions
  addXP: (amount: number) => void;
  addCoins: (amount: number) => void;
  setGameState: (state: Partial<GameState>) => void;
}

export const useGameStore = create<GameState>((set) => ({
  level: 1,
  xp: 0,
  devCoins: 0,
  currentStreak: 0,
  longestStreak: 0,
  rank: 'Unranked',
  
  addXP: (amount) => set((state) => ({ xp: state.xp + amount })),
  addCoins: (amount) => set((state) => ({ devCoins: state.devCoins + amount })),
  setGameState: (newState) => set((state) => ({ ...state, ...newState })),
}));
