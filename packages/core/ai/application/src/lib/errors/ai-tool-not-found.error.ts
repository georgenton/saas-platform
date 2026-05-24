export class AiToolNotFoundError extends Error {
  constructor(toolKey: string) {
    super(`AI tool "${toolKey}" was not found.`);
  }
}
