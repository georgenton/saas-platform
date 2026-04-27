export class CustomerNotFoundError extends Error {
  constructor(tenantSlug: string, customerId: string) {
    super(
      `Customer "${customerId}" was not found for tenant "${tenantSlug}".`,
    );
  }
}
