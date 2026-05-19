import { TenantNotFoundError, TenantRepository } from '@saas-platform/tenancy-application';
import { WhatsappAutomationRule } from '@saas-platform/growth-domain';
import { WhatsappAutomationRuleRepository } from '../ports/whatsapp-automation-rule.repository';

export class ListTenantWhatsappAutomationRulesUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly whatsappAutomationRuleRepository: WhatsappAutomationRuleRepository,
  ) {}

  async execute(tenantSlug: string): Promise<WhatsappAutomationRule[]> {
    const tenant = await this.tenantRepository.findBySlug(tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(tenantSlug);
    }

    return this.whatsappAutomationRuleRepository.findByTenantId(tenant.id);
  }
}
