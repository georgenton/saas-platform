export class WebhookEventEnvelopeNotFoundError extends Error {
  constructor(tenantSlug: string, envelopeId: string) {
    super(
      `Webhook event envelope "${envelopeId}" was not found for tenant "${tenantSlug}".`,
    );
  }
}
