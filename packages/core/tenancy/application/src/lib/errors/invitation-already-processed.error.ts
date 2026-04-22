export class InvitationAlreadyProcessedError extends Error {
  constructor(invitationId: string) {
    super(`Invitation "${invitationId}" was already processed.`);
    this.name = 'InvitationAlreadyProcessedError';
  }
}
