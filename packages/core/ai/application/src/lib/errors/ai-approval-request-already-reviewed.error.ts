export class AiApprovalRequestAlreadyReviewedError extends Error {
  constructor(requestId: string) {
    super(`AI approval request "${requestId}" has already been reviewed.`);
  }
}
