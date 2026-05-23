export class AiSuggestionRunNotFoundError extends Error {
  constructor(suggestionRunId: string) {
    super(`AI suggestion run "${suggestionRunId}" was not found.`);
  }
}
