export class ConversationMessageNotFoundError extends Error {
  constructor(
    readonly tenantSlug: string,
    readonly messageId: string,
  ) {
    super(
      `Conversation message "${messageId}" was not found for tenant "${tenantSlug}".`,
    );
    this.name = 'ConversationMessageNotFoundError';
  }
}
