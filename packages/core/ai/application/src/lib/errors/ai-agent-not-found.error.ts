export class AiAgentNotFoundError extends Error {
  constructor(agentKey: string) {
    super(`AI agent "${agentKey}" was not found.`);
  }
}
