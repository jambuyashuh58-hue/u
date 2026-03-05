import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type {
  User,
  UserGoal,
  UserChallenge,
  DailyCheckIn,
  Supplement,
  SupplementLog,
  WeekProgram,
  CoachMessage,
  ProgressAnalytics,
} from '@/types';

// ================== Auth Store ==================
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  accessToken: string | null;
  setUser: (user: User | null) => void;
  setAccessToken: (token: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      accessToken: null,
      setUser: (user) => set({ user, isAuthenticated: !!user, isLoading: false }),
      setAccessToken: (accessToken) => set({ accessToken }),
      logout: () => set({ user: null, isAuthenticated: false, accessToken: null }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// ================== Onboarding Store ==================
interface OnboardingState {
  currentStep: number;
  totalSteps: number;
  selectedGoal: UserGoal | null;
  selectedChallenges: UserChallenge[];
  baselineScores: Record<string, number>;
  isCompleted: boolean;
  setStep: (step: number) => void;
  setGoal: (goal: UserGoal) => void;
  toggleChallenge: (challenge: UserChallenge) => void;
  setBaselineScore: (area: string, score: number) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      currentStep: 1,
      totalSteps: 5,
      selectedGoal: null,
      selectedChallenges: [],
      baselineScores: {},
      isCompleted: false,
      setStep: (step) => set({ currentStep: step }),
      setGoal: (goal) => set({ selectedGoal: goal }),
      toggleChallenge: (challenge) =>
        set((state) => ({
          selectedChallenges: state.selectedChallenges.includes(challenge)
            ? state.selectedChallenges.filter((c) => c !== challenge)
            : [...state.selectedChallenges, challenge],
        })),
      setBaselineScore: (area, score) =>
        set((state) => ({
          baselineScores: { ...state.baselineScores, [area]: score },
        })),
      completeOnboarding: () => set({ isCompleted: true }),
      resetOnboarding: () =>
        set({
          currentStep: 1,
          selectedGoal: null,
          selectedChallenges: [],
          baselineScores: {},
          isCompleted: false,
        }),
    }),
    {
      name: 'onboarding-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// ================== Daily Check-In Store ==================
interface CheckInState {
  todayCheckIn: DailyCheckIn | null;
  energyLevel: number;
  mood: number;
  brainClarity: number;
  completedActions: string[];
  setEnergyLevel: (level: number) => void;
  setMood: (mood: number) => void;
  setBrainClarity: (clarity: number) => void;
  toggleAction: (actionId: string) => void;
  submitCheckIn: () => void;
  loadTodayCheckIn: (checkIn: DailyCheckIn | null) => void;
}

export const useCheckInStore = create<CheckInState>((set) => ({
  todayCheckIn: null,
  energyLevel: 5,
  mood: 5,
  brainClarity: 5,
  completedActions: [],
  setEnergyLevel: (level) => set({ energyLevel: level }),
  setMood: (mood) => set({ mood }),
  setBrainClarity: (clarity) => set({ brainClarity: clarity }),
  toggleAction: (actionId) =>
    set((state) => ({
      completedActions: state.completedActions.includes(actionId)
        ? state.completedActions.filter((id) => id !== actionId)
        : [...state.completedActions, actionId],
    })),
  submitCheckIn: () => {
    // This will trigger API call
    set({ todayCheckIn: null });
  },
  loadTodayCheckIn: (checkIn) => set({ todayCheckIn: checkIn }),
}));

// ================== Supplement Store ==================
interface SupplementState {
  supplements: Supplement[];
  todayLogs: SupplementLog[];
  weeklyCompliance: number;
  setSupplements: (supplements: Supplement[]) => void;
  logSupplement: (supplementId: string) => void;
  setTodayLogs: (logs: SupplementLog[]) => void;
  setWeeklyCompliance: (compliance: number) => void;
}

export const useSupplementStore = create<SupplementState>((set) => ({
  supplements: [],
  todayLogs: [],
  weeklyCompliance: 0,
  setSupplements: (supplements) => set({ supplements }),
  logSupplement: (supplementId) =>
    set((state) => ({
      todayLogs: [
        ...state.todayLogs,
        {
          id: Date.now().toString(),
          userId: '',
          supplementId,
          takenAt: new Date(),
          date: new Date(),
        },
      ],
    })),
  setTodayLogs: (logs) => set({ todayLogs: logs }),
  setWeeklyCompliance: (compliance) => set({ weeklyCompliance: compliance }),
}));

// ================== Program Store ==================
interface ProgramState {
  currentWeek: number;
  weeks: WeekProgram[];
  dailyProgress: number;
  setCurrentWeek: (week: number) => void;
  setWeeks: (weeks: WeekProgram[]) => void;
  setDailyProgress: (progress: number) => void;
}

export const useProgramStore = create<ProgramState>((set) => ({
  currentWeek: 2,
  weeks: [],
  dailyProgress: 65,
  setCurrentWeek: (week) => set({ currentWeek: week }),
  setWeeks: (weeks) => set({ weeks }),
  setDailyProgress: (progress) => set({ dailyProgress: progress }),
}));

// ================== AI Coach Store ==================
interface CoachState {
  messages: CoachMessage[];
  isTyping: boolean;
  addMessage: (message: CoachMessage) => void;
  setMessages: (messages: CoachMessage[]) => void;
  setIsTyping: (isTyping: boolean) => void;
  clearMessages: () => void;
}

export const useCoachStore = create<CoachState>((set) => ({
  messages: [],
  isTyping: false,
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  setMessages: (messages) => set({ messages }),
  setIsTyping: (isTyping) => set({ isTyping }),
  clearMessages: () => set({ messages: [] }),
}));

// ================== Analytics Store ==================
interface AnalyticsState {
  analytics: ProgressAnalytics | null;
  period: 'week' | 'month' | 'year';
  setAnalytics: (analytics: ProgressAnalytics) => void;
  setPeriod: (period: 'week' | 'month' | 'year') => void;
}

export const useAnalyticsStore = create<AnalyticsState>((set) => ({
  analytics: null,
  period: 'month',
  setAnalytics: (analytics) => set({ analytics }),
  setPeriod: (period) => set({ period }),
}));

// ================== Mind Training Store ==================
interface MindTrainingState {
  isSessionActive: boolean;
  currentPhase: 'inhale' | 'hold' | 'exhale' | 'rest';
  remainingTime: number;
  cyclesCompleted: number;
  totalCycles: number;
  binauralBeatsEnabled: boolean;
  startSession: (totalCycles: number) => void;
  setPhase: (phase: 'inhale' | 'hold' | 'exhale' | 'rest') => void;
  setRemainingTime: (time: number) => void;
  completeCycle: () => void;
  endSession: () => void;
  toggleBinauralBeats: () => void;
}

export const useMindTrainingStore = create<MindTrainingState>((set) => ({
  isSessionActive: false,
  currentPhase: 'inhale',
  remainingTime: 600, // 10 minutes
  cyclesCompleted: 0,
  totalCycles: 12,
  binauralBeatsEnabled: true,
  startSession: (totalCycles) =>
    set({ isSessionActive: true, totalCycles, cyclesCompleted: 0 }),
  setPhase: (phase) => set({ currentPhase: phase }),
  setRemainingTime: (time) => set({ remainingTime: time }),
  completeCycle: () =>
    set((state) => ({ cyclesCompleted: state.cyclesCompleted + 1 })),
  endSession: () =>
    set({ isSessionActive: false, cyclesCompleted: 0, currentPhase: 'inhale' }),
  toggleBinauralBeats: () =>
    set((state) => ({ binauralBeatsEnabled: !state.binauralBeatsEnabled })),
}));

// ================== Theme Store ==================
interface ThemeState {
  isDarkMode: boolean;
  toggleTheme: () => void;
  setDarkMode: (isDark: boolean) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      isDarkMode: false,
      toggleTheme: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
      setDarkMode: (isDark) => set({ isDarkMode: isDark }),
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// ================== Subscription Store ==================
interface SubscriptionState {
  isPremium: boolean;
  plan: 'free' | 'monthly' | 'quarterly' | 'yearly' | null;
  expiresAt: Date | null;
  setPremium: (isPremium: boolean, plan?: string, expiresAt?: Date) => void;
}

export const useSubscriptionStore = create<SubscriptionState>()(
  persist(
    (set) => ({
      isPremium: false,
      plan: null,
      expiresAt: null,
      setPremium: (isPremium, plan, expiresAt) =>
        set({
          isPremium,
          plan: plan as 'monthly' | 'quarterly' | 'yearly' | null,
          expiresAt: expiresAt || null,
        }),
    }),
    {
      name: 'subscription-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
