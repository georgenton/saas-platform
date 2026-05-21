import {
  GrowthOperationalCaseFollowUpState,
  GrowthOperationalCaseRoutingPolicyKey,
  GrowthOperationalCaseType,
} from '../ports/growth-operational-case.repository';

export function resolveGrowthOperationalCaseRoutingPolicyKey(input: {
  caseType: GrowthOperationalCaseType;
  followUpState?: GrowthOperationalCaseFollowUpState | null;
}): GrowthOperationalCaseRoutingPolicyKey {
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
