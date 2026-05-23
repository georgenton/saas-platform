export class AiApprovalRequestAlreadyPendingError extends Error {
  constructor(suggestionRunId: string) {
    super(
      `AI approval request for suggestion run "${suggestionRunId}" is already pending.`,
    );
  }
}
