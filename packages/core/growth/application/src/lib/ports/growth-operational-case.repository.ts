export type GrowthOperationalCaseType =
  | 'alert_escalation'
  | 'ownership_routing'
  | 'follow_up';

export type GrowthOperationalCaseStatus = 'open' | 'in_progress' | 'resolved';

export type GrowthOperationalCasePriority = 'warning' | 'critical';

export type GrowthOperationalCaseFollowUpState =
  | 'pending_team'
  | 'scheduled'
  | 'waiting_customer';

export type GrowthOperationalCaseRoutingPolicyKey =
  | 'growth_ops'
  | 'owner_assignment'
  | 'follow_up_team'
  | 'follow_up_waiting_customer';

export interface CreateGrowthOperationalCaseCommand {
  tenantId: string;
  sourceKey: string;
  caseType: GrowthOperationalCaseType;
  status: GrowthOperationalCaseStatus;
  priority: GrowthOperationalCasePriority;
  title: string;
  summary: string;
  nextAction: string;
  followUpState: GrowthOperationalCaseFollowUpState | null;
  routingPolicyKey: GrowthOperationalCaseRoutingPolicyKey;
  threadId: string | null;
  alertKey: string | null;
  dueAt: Date | null;
  assignedUserId: string | null;
  assignedUserEmail: string | null;
  createdByUserId: string;
  createdByEmail: string | null;
  resolvedAt: Date | null;
  resolvedByUserId: string | null;
  resolvedByEmail: string | null;
}

export interface GrowthOperationalCaseRecord
  extends CreateGrowthOperationalCaseCommand {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface GrowthOperationalCaseRepository {
  create(
    command: CreateGrowthOperationalCaseCommand,
  ): Promise<GrowthOperationalCaseRecord>;
  save(record: GrowthOperationalCaseRecord): Promise<GrowthOperationalCaseRecord>;
  findByTenantId(
    tenantId: string,
    filters?: {
      status?: GrowthOperationalCaseStatus | null;
      routingPolicyKey?: GrowthOperationalCaseRoutingPolicyKey | null;
    },
  ): Promise<GrowthOperationalCaseRecord[]>;
  findByTenantIdAndId(
    tenantId: string,
    caseId: string,
  ): Promise<GrowthOperationalCaseRecord | null>;
  findByTenantIdAndSourceKey(
    tenantId: string,
    sourceKey: string,
  ): Promise<GrowthOperationalCaseRecord | null>;
}
