export class AiApprovalPolicyNotFoundError extends Error {
  constructor(agentKey: string) {
    super(`AI approval policy for agent "${agentKey}" was not found.`);
  }
}
