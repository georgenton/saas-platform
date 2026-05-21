export class WhatsappMessageRetryNotAllowedError extends Error {
  constructor(
    readonly tenantSlug: string,
    readonly messageId: string,
    readonly reason: string,
  ) {
    super(
      `WhatsApp message "${messageId}" cannot be retried for tenant "${tenantSlug}": ${reason}`,
    );
    this.name = 'WhatsappMessageRetryNotAllowedError';
  }
}
