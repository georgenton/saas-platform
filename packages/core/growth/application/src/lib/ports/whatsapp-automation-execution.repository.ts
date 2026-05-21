import { WhatsappAutomationExecution } from '@saas-platform/growth-domain';

export interface WhatsappAutomationExecutionRepository {
  save(execution: WhatsappAutomationExecution): Promise<void>;
  findByTenantIdAndExecutionKey(
    tenantId: string,
    executionKey: string,
  ): Promise<WhatsappAutomationExecution | null>;
}

