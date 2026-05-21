export class GrowthOperationalCaseFollowUpStateNotAllowedError extends Error {
  constructor(caseId: string) {
    super(
      `Growth operational case "${caseId}" does not support follow-up state updates.`,
    );
    this.name = 'GrowthOperationalCaseFollowUpStateNotAllowedError';
  }
}
