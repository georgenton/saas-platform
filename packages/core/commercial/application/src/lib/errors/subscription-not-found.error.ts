export class SubscriptionNotFoundError extends Error {
  constructor(tenantSlug: string) {
    super(`Subscription for tenant "${tenantSlug}" was not found.`);
  }
}
