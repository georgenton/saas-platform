export class WhatsappConversationRecipientUnavailableError extends Error {
  constructor(tenantSlug: string, threadId: string) {
    super(
      `WhatsApp recipient handle is not available for conversation thread "${threadId}" in tenant "${tenantSlug}".`,
    );
  }
}
