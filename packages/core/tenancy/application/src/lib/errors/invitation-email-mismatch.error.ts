export class InvitationEmailMismatchError extends Error {
  constructor(invitationId: string) {
    super(
      `Authenticated user email does not match invitation "${invitationId}".`,
    );
    this.name = 'InvitationEmailMismatchError';
  }
}
