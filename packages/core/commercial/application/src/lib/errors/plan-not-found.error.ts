export class PlanNotFoundError extends Error {
  constructor(planKey: string) {
    super(`Plan with key "${planKey}" was not found.`);
  }
}
