import {
  AiGuardedExecutionEventRecord,
  AiGuardedExecutionEventType,
  CreateAiGuardedExecutionEventCommand,
} from '@saas-platform/ai-domain';

export interface AiGuardedExecutionEventRepository {
  create(
    command: CreateAiGuardedExecutionEventCommand,
  ): Promise<AiGuardedExecutionEventRecord>;
  findByTenantId(
    tenantId: string,
    options?: {
      agentKeys?: string[] | null;
      limit?: number | null;
      eventTypes?: AiGuardedExecutionEventType[] | null;
    },
  ): Promise<AiGuardedExecutionEventRecord[]>;
}
