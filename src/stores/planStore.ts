import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { WorkoutPlan } from '../types';

interface PlanState {
  plan: WorkoutPlan | null;
  setupComplete: boolean;
  setPlan: (plan: WorkoutPlan) => void;
  updatePlan: (plan: WorkoutPlan) => void;
  toggleWeek: () => void;
  resetPlan: () => void;
  setSetupComplete: (value: boolean) => void;
}

export const usePlanStore = create<PlanState>()(
  persist(
    (set, get) => ({
      plan: null,
      setupComplete: false,

      setPlan: (plan) => set({ plan, setupComplete: true }),

      updatePlan: (plan) => set({ plan }),

      toggleWeek: () => {
        const { plan } = get();
        if (!plan) return;
        set({
          plan: {
            ...plan,
            currentWeek: plan.currentWeek === 'A' ? 'B' : 'A',
          },
        });
      },

      resetPlan: () => set({ plan: null, setupComplete: false }),

      setSetupComplete: (value) => set({ setupComplete: value }),
    }),
    {
      name: 'gymguide-plan',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
