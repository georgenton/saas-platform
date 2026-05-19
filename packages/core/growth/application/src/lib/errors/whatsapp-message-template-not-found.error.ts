export class WhatsappMessageTemplateNotFoundError extends Error {
  constructor(readonly tenantSlug: string, readonly templateId: string) {
    super(
      `WhatsApp message template "${templateId}" was not found for tenant "${tenantSlug}".`,
    );
    this.name = 'WhatsappMessageTemplateNotFoundError';
  }
}
