// Type definitions for SaaS Control Layer

export type Bindings = {
  DB: D1Database;
};

export type Variables = {
  userId: string;
};

export interface User {
  id: string;
  email: string;
  password_hash: string;
  name: string;
  onboarded: number;
  gmail_connected: number;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  name: string;
  cost_monthly: number;
  billing_cycle: string;
  usage_level: string;
  category: string;
  source: string;
  status: string;
  next_renewal: string | null;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface UsageLog {
  id: string;
  subscription_id: string;
  user_id: string;
  used: number;
  logged_at: string;
}

export interface Insight {
  id: string;
  user_id: string;
  subscription_id: string | null;
  action_type: string;
  message: string;
  impact_monthly: number;
  status: string;
  created_at: string;
}

export interface Alert {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  read: number;
  created_at: string;
}

// Decision Engine types
export type ActionType = 'cancel' | 'downgrade' | 'consolidate' | 'keep';

export interface DecisionResult {
  subscriptionId: string;
  subscriptionName: string;
  actionType: ActionType;
  message: string;
  impactMonthly: number;
  usageScore: number;
  costWeight: string;
  category: string;
}

export interface AnalysisResult {
  totalMonthlySpend: number;
  totalWaste: number;
  decisions: DecisionResult[];
  insights: Insight[];
}
