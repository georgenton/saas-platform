export class PartyNotFoundError extends Error {
  constructor(
    readonly tenantSlug: string,
    readonly partyId: string,
  ) {
    super(
      `Party "${partyId}" was not found for tenant "${tenantSlug}".`,
    );
    this.name = 'PartyNotFoundError';
  }
}
