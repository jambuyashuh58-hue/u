// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  subscriptionStatus: SubscriptionStatus;
  onboardingCompleted: boolean;
  goals: UserGoal[];
  challenges: UserChallenge[];
  currentWeek: number;
  dailyStreak: number;
}

export type SubscriptionStatus = 'free' | 'monthly' | 'quarterly' | 'yearly' | 'expired';

export type UserGoal = 
  | 'mental_clarity'
  | 'emotional_resilience'
  | 'physical_energy'
  | 'system_reset';

export type UserChallenge =
  | 'brain_fog'
  | 'low_energy'
  | 'mood_swings'
  | 'sleep_issues'
  | 'digestive_problems'
  | 'stress';

// Onboarding Types
export interface OnboardingState {
  currentStep: number;
  totalSteps: number;
  selectedGoal?: UserGoal;
  selectedChallenges: UserChallenge[];
  baselineCompleted: boolean;
  pathGenerated: boolean;
}

// Daily Check-In Types
export interface DailyCheckIn {
  id: string;
  userId: string;
  date: Date;
  energyLevel: number; // 1-10
  mood: number; // 1-10
  brainClarity: number; // 1-10
  actionsCompleted: DailyAction[];
  notes?: string;
}

export interface DailyAction {
  id: string;
  name: string;
  completed: boolean;
  category: 'nutrition' | 'sleep' | 'supplements' | 'movement' | 'mindfulness';
}

// Supplement Types
export interface Supplement {
  id: string;
  name: string;
  dosage: string;
  instructions: string;
  timeOfDay: 'morning' | 'noon' | 'night';
  scheduledTime: string;
  iconType: string;
  color: string;
}

export interface SupplementLog {
  id: string;
  userId: string;
  supplementId: string;
  takenAt: Date;
  date: Date;
}

// Program Types
export interface WeekProgram {
  weekNumber: number;
  title: string;
  description: string;
  isActive: boolean;
  isCompleted: boolean;
  isLocked: boolean;
  progress: number;
  focusAreas: string[];
}

// Nutrition Types
export interface NutritionProtocol {
  weekNumber: number;
  score: number;
  trend: number;
  foodsToRemove: FoodItem[];
  foodsToAdd: FoodItem[];
}

export interface FoodItem {
  id: string;
  name: string;
  description: string;
  completed: boolean;
  category: string;
}

// Mind Training Types
export interface BreathingSession {
  id: string;
  name: string;
  description: string;
  durationMinutes: number;
  breathsPerMinute: number;
  totalCycles: number;
  pattern: BreathingPattern;
}

export interface BreathingPattern {
  inhale: number; // seconds
  hold1?: number; // seconds
  exhale: number; // seconds
  hold2?: number; // seconds
}

export interface MindTrainingSession {
  id: string;
  userId: string;
  sessionType: 'breathing' | 'meditation' | 'visualization';
  durationMinutes: number;
  completedAt: Date;
  binauralBeatsEnabled: boolean;
}

// AI Coach Types
export interface CoachMessage {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  timestamp: Date;
  actions?: CoachAction[];
}

export interface CoachAction {
  id: string;
  type: 'reminder' | 'reflection' | 'reframe' | 'insight';
  title: string;
  description: string;
  imageUrl?: string;
  ctaText?: string;
}

// Analytics Types
export interface ProgressAnalytics {
  period: 'week' | 'month' | 'year';
  lifeAreaBalance: LifeAreaScore[];
  vitalityTrends: VitalityTrend[];
  overallScore: number;
  improvement: number;
}

export interface LifeAreaScore {
  area: 'nutrition' | 'stress' | 'sleep' | 'exercise' | 'brain' | 'fitness' | 'mindset';
  score: number;
  maxScore: number;
}

export interface VitalityTrend {
  category: 'mood' | 'energy' | 'clarity';
  label: string;
  trend: number;
  data: number[];
}

// Worksheet Types
export interface Worksheet {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  progress: number;
  status: 'not_started' | 'in_progress' | 'completed';
  lastUpdated?: Date;
}

export interface EmotionalDetoxEntry {
  id: string;
  userId: string;
  trigger: string;
  emotion: string;
  intensity: number; // 1-10
  cognitiveDistortion?: string;
  reframedThought?: string;
  createdAt: Date;
}

// Navigation Types
export type RootStackParamList = {
  Onboarding: undefined;
  Welcome: undefined;
  GoalSetting: undefined;
  ChallengeSelection: undefined;
  BaselineAssessment: undefined;
  YourPath: undefined;
  MainTabs: undefined;
  Home: undefined;
  Program: undefined;
  Insights: undefined;
  Profile: undefined;
  MorningCheckIn: undefined;
  SupplementPlanner: undefined;
  MindTraining: undefined;
  NutritionProtocol: undefined;
  AICoach: undefined;
  ProgressAnalytics: undefined;
  WorksheetsHub: undefined;
  EmotionalDetox: undefined;
  Subscription: undefined;
  Settings: undefined;
};

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}
