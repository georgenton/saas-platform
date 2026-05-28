export class EcommerceLaunchPlanNotFoundError extends Error {
  constructor(tenantSlug: string, launchPlanId: string) {
    super(
      `Ecommerce launch plan ${launchPlanId} was not found for tenant ${tenantSlug}.`,
    );
    this.name = 'EcommerceLaunchPlanNotFoundError';
  }
}
