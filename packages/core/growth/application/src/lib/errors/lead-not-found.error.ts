export class LeadNotFoundError extends Error {
  constructor(
    readonly tenantSlug: string,
    readonly leadId: string,
  ) {
    super(`Lead "${leadId}" was not found for tenant "${tenantSlug}".`);
    this.name = 'LeadNotFoundError';
  }
}
