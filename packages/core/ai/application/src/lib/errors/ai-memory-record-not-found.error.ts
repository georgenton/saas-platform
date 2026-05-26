export class AiMemoryRecordNotFoundError extends Error {
  constructor(recordId: string) {
    super(`AI memory record "${recordId}" was not found.`);
  }
}
