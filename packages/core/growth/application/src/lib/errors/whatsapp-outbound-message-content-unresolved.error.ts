export class WhatsappOutboundMessageContentUnresolvedError extends Error {
  constructor(
    readonly tenantSlug: string,
    readonly threadId: string,
    detail: string,
  ) {
    super(
      `WhatsApp outbound message content could not be resolved for tenant "${tenantSlug}" and thread "${threadId}": ${detail}`,
    );
    this.name = 'WhatsappOutboundMessageContentUnresolvedError';
  }
}
