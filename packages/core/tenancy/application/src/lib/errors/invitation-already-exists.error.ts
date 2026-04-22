export class InvitationAlreadyExistsError extends Error {
  constructor(tenantSlug: string, email: string) {
    super(
      `A pending invitation for "${email}" already exists in tenant "${tenantSlug}".`,
    );
    this.name = 'InvitationAlreadyExistsError';
  }
}
