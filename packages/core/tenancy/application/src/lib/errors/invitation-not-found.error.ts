export class InvitationNotFoundError extends Error {
  constructor(invitationId: string) {
    super(`Invitation "${invitationId}" was not found.`);
    this.name = 'InvitationNotFoundError';
  }
}
