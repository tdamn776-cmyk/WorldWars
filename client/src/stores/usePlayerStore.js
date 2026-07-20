import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { calculateLevel, getXpForLevel } from '../utils/levelRewards';

const usePlayerStore = create(
  persist(
    (set, get) => ({
      isLoggedIn: false,
      isAdmin: false,
      username: '',
      birthDate: null,
      age: 0,
      xp: 0,
      level: 1,
      bp: 1000,
      totalKills: 0,
      totalWins: 0,
      totalGames: 0,
      selectedTankId: 'recruit',
      ownedTanks: ['recruit'],
      ownedCamos: [],

      login: (username, birthDate, age) => set({
        isLoggedIn: true,
        username,
        birthDate,
        age,
      }),

      loginAsAdmin: () => set({ isAdmin: true, isLoggedIn: true }),

      logout: () => set({
        isLoggedIn: false,
        isAdmin: false,
      }),

      addXp: (amount) => {
        const state = get();
        const newXp = state.xp + amount;
        const newLevel = calculateLevel(newXp);
        set({ xp: newXp, level: Math.min(newLevel, 100) });
        return newLevel > state.level;
      },

      addBp: (amount) => set((s) => ({ bp: s.bp + amount })),
      spendBp: (amount) => {
        const state = get();
        if (state.bp >= amount) {
          set({ bp: state.bp - amount });
          return true;
        }
        return false;
      },

      selectTank: (tankId) => set({ selectedTankId: tankId }),

      unlockTank: (tankId) => set((s) => ({
        ownedTanks: s.ownedTanks.includes(tankId) ? s.ownedTanks : [...s.ownedTanks, tankId],
      })),

      hasTank: (tankId) => get().ownedTanks.includes(tankId),

      addKill: () => set((s) => ({ totalKills: s.totalKills + 1 })),
      addWin: () => set((s) => ({ totalWins: s.totalWins + 1 })),
      addGame: () => set((s) => ({ totalGames: s.totalGames + 1 })),

      getXpProgress: () => {
        const state = get();
        const needed = getXpForLevel(state.level);
        let accumulated = 0;
        for (let i = 1; i < state.level; i++) {
          accumulated += getXpForLevel(i);
        }
        const currentLevelXp = state.xp - accumulated;
        return { current: Math.max(0, currentLevelXp), needed };
      },

      setPlayerData: (data) => set(data),
    }),
    {
      name: 'worldwars-player-storage', // The key used in local storage
      storage: createJSONStorage(() => localStorage), 
    }
  )
);

export default usePlayerStore;
