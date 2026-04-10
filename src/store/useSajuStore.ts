import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SajuResult, calculateSaju } from '../lib/saju';

export interface UserProfile {
  id: string;
  name: string;
  gender: 'M' | 'F';
  isLunar: boolean;
  birthDate: string;
  birthTime: string;
}

interface SajuState {
  profiles: UserProfile[];
  currentProfile: UserProfile | null;
  currentResult: SajuResult | null;
  addProfile: (profile: Omit<UserProfile, 'id'>) => void;
  setCurrentProfile: (id: string) => void;
  deleteProfile: (id: string) => void;
  analyze: (profile: Omit<UserProfile, 'id'>) => void;
  clearCurrent: () => void;
}

export const useSajuStore = create<SajuState>()(
  persist(
    (set, get) => ({
      profiles: [],
      currentProfile: null,
      currentResult: null,
      addProfile: (profile) => {
        const id = Date.now().toString();
        const newProfile = { ...profile, id };
        set((state) => ({
          profiles: [...state.profiles, newProfile],
          currentProfile: newProfile,
          currentResult: calculateSaju(profile.birthDate, profile.birthTime, profile.isLunar, profile.gender)
        }));
      },
      setCurrentProfile: (id) => {
        const profile = get().profiles.find(p => p.id === id);
        if (profile) {
          set({
            currentProfile: profile,
            currentResult: calculateSaju(profile.birthDate, profile.birthTime, profile.isLunar, profile.gender)
          });
        }
      },
      deleteProfile: (id) => {
        set((state) => ({
          profiles: state.profiles.filter(p => p.id !== id),
          currentProfile: state.currentProfile?.id === id ? null : state.currentProfile,
          currentResult: state.currentProfile?.id === id ? null : state.currentResult
        }));
      },
      analyze: (profile) => {
        set({
          currentProfile: { ...profile, id: 'temp' },
          currentResult: calculateSaju(profile.birthDate, profile.birthTime, profile.isLunar, profile.gender)
        });
      },
      clearCurrent: () => set({ currentProfile: null, currentResult: null })
    }),
    {
      name: 'saju-storage',
      partialize: (state) => ({ profiles: state.profiles }),
    }
  )
);
