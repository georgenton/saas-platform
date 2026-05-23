export class AiApprovalRequestNotFoundError extends Error {
  constructor(requestId: string) {
    super(`AI approval request "${requestId}" was not found.`);
  }
}
