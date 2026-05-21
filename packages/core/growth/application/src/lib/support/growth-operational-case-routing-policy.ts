import {
  GrowthOperationalCaseFollowUpState,
  GrowthOperationalCasePriority,
  GrowthOperationalCaseRoutingPolicyKey,
  GrowthOperationalCaseStatus,
  GrowthOperationalCaseType,
} from '../ports/growth-operational-case.repository';

export function resolveGrowthOperationalCaseRoutingPolicyKey(input: {
  caseType: GrowthOperationalCaseType;
  status?: GrowthOperationalCaseStatus;
  followUpState?: GrowthOperationalCaseFollowUpState | null;
  dueAt?: Date | null;
  now?: Date;
}): GrowthOperationalCaseRoutingPolicyKey {
  if (shouldEscalateGrowthOperationalCaseToReview(input)) {
    return 'escalation_review';
  }

  if (input.caseType === 'alert_escalation') {
    return 'growth_ops';
  }

  if (input.caseType === 'ownership_routing') {
    return 'owner_assignment';
  }

  return input.followUpState === 'waiting_customer'
    ? 'follow_up_waiting_customer'
    : 'follow_up_team';
}

export function resolveGrowthOperationalCasePriority(input: {
  caseType: GrowthOperationalCaseType;
  status?: GrowthOperationalCaseStatus;
  currentPriority: GrowthOperationalCasePriority;
  followUpState?: GrowthOperationalCaseFollowUpState | null;
  dueAt?: Date | null;
  now?: Date;
}): GrowthOperationalCasePriority {
  return shouldEscalateGrowthOperationalCaseToReview(input)
    ? 'critical'
    : input.currentPriority;
}

function shouldEscalateGrowthOperationalCaseToReview(input: {
  caseType: GrowthOperationalCaseType;
  status?: GrowthOperationalCaseStatus;
  followUpState?: GrowthOperationalCaseFollowUpState | null;
  dueAt?: Date | null;
  now?: Date;
}): boolean {
  if (
    input.status === 'resolved' ||
    input.caseType === 'alert_escalation' ||
    !input.dueAt
  ) {
    return false;
  }

  if (
    input.caseType === 'follow_up' &&
    input.followUpState === 'waiting_customer'
  ) {
    return false;
  }

  const now = input.now ?? new Date();
  return input.dueAt.getTime() <= now.getTime();
}
