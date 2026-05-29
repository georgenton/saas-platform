export class EcommerceProductAuthoringDraftNotFoundError extends Error {
  constructor(tenantSlug: string, draftId: string) {
    super(
      `Ecommerce product authoring draft ${draftId} was not found for tenant ${tenantSlug}.`,
    );
  }
}
