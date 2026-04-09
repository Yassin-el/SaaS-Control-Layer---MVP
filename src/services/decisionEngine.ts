// Decision Engine - Core logic for SaaS Control Layer
// Computes usage scores, cost weights, and generates actionable recommendations

import type { Subscription, UsageLog, DecisionResult, ActionType, AnalysisResult, Insight } from '../types';
import { generateId } from '../utils';

interface SubWithLogs {
  subscription: Subscription;
  logs: UsageLog[];
}

// Compute usage score from last 7 logs (0.0 = never used, 1.0 = used every day)
function computeUsageScore(logs: UsageLog[]): number {
  if (logs.length === 0) return 0;
  const recent = logs.slice(-7);
  const usedCount = recent.filter(l => l.used === 1).length;
  return usedCount / 7;
}

// Compute cost weight category
function computeCostWeight(costMonthly: number): 'low' | 'medium' | 'high' {
  if (costMonthly <= 5) return 'low';
  if (costMonthly <= 15) return 'medium';
  return 'high';
}

// Get usage label
function getUsageLabel(score: number): 'none' | 'low' | 'medium' | 'high' {
  if (score === 0) return 'none';
  if (score < 0.3) return 'low';
  if (score < 0.6) return 'medium';
  return 'high';
}

// Apply decision rules to a single subscription
function decideAction(sub: Subscription, usageScore: number, costWeight: string): {
  actionType: ActionType;
  message: string;
  impactMonthly: number;
} {
  const usageLabel = getUsageLabel(usageScore);

  // Rule 1: No usage + any cost → CANCEL
  if (usageLabel === 'none') {
    return {
      actionType: 'cancel',
      message: `You haven't used ${sub.name} at all recently. Cancel to save ${formatMoney(sub.cost_monthly)}/mo.`,
      impactMonthly: sub.cost_monthly,
    };
  }

  // Rule 2: Low usage + high cost → CANCEL
  if (usageLabel === 'low' && costWeight === 'high') {
    return {
      actionType: 'cancel',
      message: `${sub.name} costs ${formatMoney(sub.cost_monthly)}/mo but you barely use it. Consider canceling.`,
      impactMonthly: sub.cost_monthly,
    };
  }

  // Rule 3: Low usage + medium cost → DOWNGRADE
  if (usageLabel === 'low' && costWeight === 'medium') {
    return {
      actionType: 'downgrade',
      message: `Low usage on ${sub.name}. Downgrade to a free or cheaper plan to save ~${formatMoney(sub.cost_monthly * 0.6)}/mo.`,
      impactMonthly: Math.round(sub.cost_monthly * 0.6 * 100) / 100,
    };
  }

  // Rule 4: Medium usage + high cost → DOWNGRADE
  if (usageLabel === 'medium' && costWeight === 'high') {
    return {
      actionType: 'downgrade',
      message: `${sub.name} is expensive for moderate use. Look for a lower tier to save ~${formatMoney(sub.cost_monthly * 0.4)}/mo.`,
      impactMonthly: Math.round(sub.cost_monthly * 0.4 * 100) / 100,
    };
  }

  // Rule 5: Low usage + low cost → DOWNGRADE (minor)
  if (usageLabel === 'low' && costWeight === 'low') {
    return {
      actionType: 'downgrade',
      message: `${sub.name} is cheap but unused. Check if a free tier exists.`,
      impactMonthly: sub.cost_monthly,
    };
  }

  // Default: KEEP
  return {
    actionType: 'keep',
    message: `${sub.name} looks good. You use it regularly and it's worth the cost.`,
    impactMonthly: 0,
  };
}

function formatMoney(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

// Find consolidation opportunities (multiple tools in same category with low usage)
function findConsolidations(subsWithLogs: SubWithLogs[]): DecisionResult[] {
  const categoryGroups: Record<string, SubWithLogs[]> = {};

  for (const item of subsWithLogs) {
    const cat = item.subscription.category;
    if (!categoryGroups[cat]) categoryGroups[cat] = [];
    categoryGroups[cat].push(item);
  }

  const consolidations: DecisionResult[] = [];

  for (const [category, items] of Object.entries(categoryGroups)) {
    if (items.length < 2) continue;

    const totalCost = items.reduce((sum, i) => sum + i.subscription.cost_monthly, 0);
    const names = items.map(i => i.subscription.name).join(', ');

    // If there are 2+ tools in same category, suggest consolidation
    const potentialSaving = Math.round(totalCost * 0.4 * 100) / 100;

    consolidations.push({
      subscriptionId: items[0].subscription.id,
      subscriptionName: `${category} tools`,
      actionType: 'consolidate',
      message: `You have ${items.length} ${category} tools (${names}) costing ${formatMoney(totalCost)}/mo total. Consider consolidating to save ~${formatMoney(potentialSaving)}/mo.`,
      impactMonthly: potentialSaving,
      usageScore: 0,
      costWeight: 'medium',
      category,
    });
  }

  return consolidations;
}

// Main analysis function
export function runAnalysis(subsWithLogs: SubWithLogs[]): AnalysisResult {
  const decisions: DecisionResult[] = [];
  let totalMonthlySpend = 0;
  let totalWaste = 0;

  for (const item of subsWithLogs) {
    const { subscription, logs } = item;
    totalMonthlySpend += subscription.cost_monthly;

    const usageScore = computeUsageScore(logs);
    const costWeight = computeCostWeight(subscription.cost_monthly);
    const decision = decideAction(subscription, usageScore, costWeight);

    totalWaste += decision.impactMonthly;

    decisions.push({
      subscriptionId: subscription.id,
      subscriptionName: subscription.name,
      actionType: decision.actionType,
      message: decision.message,
      impactMonthly: decision.impactMonthly,
      usageScore: Math.round(usageScore * 100) / 100,
      costWeight,
      category: subscription.category,
    });
  }

  // Add consolidation opportunities
  const consolidations = findConsolidations(subsWithLogs);
  decisions.push(...consolidations);

  // Sort: cancels first, then downgrades, then consolidations, then keeps
  const order: Record<string, number> = { cancel: 0, downgrade: 1, consolidate: 2, keep: 3 };
  decisions.sort((a, b) => {
    const orderDiff = (order[a.actionType] ?? 4) - (order[b.actionType] ?? 4);
    if (orderDiff !== 0) return orderDiff;
    return b.impactMonthly - a.impactMonthly;
  });

  // Generate insight records
  const insights: Insight[] = decisions
    .filter(d => d.actionType !== 'keep')
    .map(d => ({
      id: generateId('ins'),
      user_id: '',
      subscription_id: d.subscriptionId,
      action_type: d.actionType,
      message: d.message,
      impact_monthly: d.impactMonthly,
      status: 'active',
      created_at: new Date().toISOString(),
    }));

  return {
    totalMonthlySpend: Math.round(totalMonthlySpend * 100) / 100,
    totalWaste: Math.round(totalWaste * 100) / 100,
    decisions,
    insights,
  };
}
