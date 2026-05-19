export class ConversationThreadNotFoundError extends Error {
  constructor(
    readonly tenantSlug: string,
    readonly threadId: string,
  ) {
    super(
      `Conversation thread "${threadId}" was not found for tenant "${tenantSlug}".`,
    );
    this.name = 'ConversationThreadNotFoundError';
  }
}
