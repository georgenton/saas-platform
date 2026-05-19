import { WhatsappAutomationRule } from '@saas-platform/growth-domain';

export interface WhatsappAutomationRuleRepository {
  save(rule: WhatsappAutomationRule): Promise<void>;
  findByTenantId(tenantId: string): Promise<WhatsappAutomationRule[]>;
  findByTenantIdAndId(
    tenantId: string,
    ruleId: string,
  ): Promise<WhatsappAutomationRule | null>;
  findByTenantIdAndKey(
    tenantId: string,
    key: string,
  ): Promise<WhatsappAutomationRule | null>;
}
