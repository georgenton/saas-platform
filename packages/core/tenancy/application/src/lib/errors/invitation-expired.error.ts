export class InvitationExpiredError extends Error {
  constructor(invitationId: string) {
    super(`Invitation "${invitationId}" has expired.`);
    this.name = 'InvitationExpiredError';
  }
}
