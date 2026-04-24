export class TenantProductAccessDeniedError extends Error {
  constructor(tenantSlug: string, productKey: string) {
    super(
      `Product "${productKey}" is not enabled for tenant "${tenantSlug}".`,
    );
  }
}
