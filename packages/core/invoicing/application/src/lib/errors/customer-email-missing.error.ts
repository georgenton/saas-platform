export class CustomerEmailMissingError extends Error {
  constructor(tenantSlug: string, customerId: string) {
    super(
      `Customer "${customerId}" in tenant "${tenantSlug}" does not have an email address configured.`,
    );
  }
}
