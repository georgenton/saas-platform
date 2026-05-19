import { TenantNotFoundError, TenantRepository } from '@saas-platform/tenancy-application';
import { WhatsappAutomationRule } from '@saas-platform/growth-domain';
import { WhatsappAutomationRuleRepository } from '../ports/whatsapp-automation-rule.repository';
import { WhatsappAutomationRuleNotFoundError } from '../errors/whatsapp-automation-rule-not-found.error';

export class GetTenantWhatsappAutomationRuleByIdUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly whatsappAutomationRuleRepository: WhatsappAutomationRuleRepository,
  ) {}

  async execute(
    tenantSlug: string,
    ruleId: string,
  ): Promise<WhatsappAutomationRule> {
    const tenant = await this.tenantRepository.findBySlug(tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(tenantSlug);
    }

    const rule =
      await this.whatsappAutomationRuleRepository.findByTenantIdAndId(
        tenant.id,
        ruleId,
      );

    if (!rule) {
      throw new WhatsappAutomationRuleNotFoundError(tenantSlug, ruleId);
    }

    return rule;
  }
}
