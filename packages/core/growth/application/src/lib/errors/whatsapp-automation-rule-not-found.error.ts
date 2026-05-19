export class WhatsappAutomationRuleNotFoundError extends Error {
  constructor(tenantSlug: string, ruleId: string) {
    super(
      `WhatsApp automation rule "${ruleId}" was not found for tenant "${tenantSlug}".`,
    );
    this.name = 'WhatsappAutomationRuleNotFoundError';
  }
}
