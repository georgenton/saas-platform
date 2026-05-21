import { GrowthOperationalCaseRecord } from '@saas-platform/growth-application';

export interface GrowthOperationalCaseResponseDto {
  id: string;
  sourceKey: string;
  caseType: 'alert_escalation' | 'ownership_routing' | 'follow_up';
  status: 'open' | 'in_progress' | 'resolved';
  priority: 'warning' | 'critical';
  title: string;
  summary: string;
  nextAction: string;
  followUpState: 'pending_team' | 'scheduled' | 'waiting_customer' | null;
  routingPolicyKey:
    | 'growth_ops'
    | 'escalation_review'
    | 'owner_assignment'
    | 'follow_up_team'
    | 'follow_up_waiting_customer';
  threadId: string | null;
  alertKey: string | null;
  dueAt: string | null;
  assignedUserId: string | null;
  assignedUserEmail: string | null;
  createdByUserId: string;
  createdByEmail: string | null;
  resolvedAt: string | null;
  resolvedByUserId: string | null;
  resolvedByEmail: string | null;
  createdAt: string;
  updatedAt: string;
}

export const toGrowthOperationalCaseResponseDto = (
  record: GrowthOperationalCaseRecord,
): GrowthOperationalCaseResponseDto => ({
  id: record.id,
  sourceKey: record.sourceKey,
  caseType: record.caseType,
  status: record.status,
  priority: record.priority,
  title: record.title,
  summary: record.summary,
  nextAction: record.nextAction,
  followUpState: record.followUpState,
  routingPolicyKey: record.routingPolicyKey,
  threadId: record.threadId,
  alertKey: record.alertKey,
  dueAt: record.dueAt?.toISOString() ?? null,
  assignedUserId: record.assignedUserId,
  assignedUserEmail: record.assignedUserEmail,
  createdByUserId: record.createdByUserId,
  createdByEmail: record.createdByEmail,
  resolvedAt: record.resolvedAt?.toISOString() ?? null,
  resolvedByUserId: record.resolvedByUserId,
  resolvedByEmail: record.resolvedByEmail,
  createdAt: record.createdAt.toISOString(),
  updatedAt: record.updatedAt.toISOString(),
});
