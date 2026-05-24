import {
  GetAiToolRegistryEntryByKeyUseCase,
  GetAiAgentToolAccessByAgentKeyUseCase,
  ListAiToolRegistryUseCase,
} from '@saas-platform/ai-application';

describe('AI tool registry use cases', () => {
  it('lists the transversal AI tool registry', () => {
    const useCase = new ListAiToolRegistryUseCase();

    const result = useCase.execute();

    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          key: 'growth_assist_reply_drafting',
          actionKind: 'draft',
          availability: 'ready',
          inputContract: expect.objectContaining({
            sourceSurfaceKeys: ['growth_assist_daily_agenda'],
          }),
        }),
        expect.objectContaining({
          key: 'growth_case_assignment_execution',
          requiresApproval: true,
          riskLevel: 'high',
          executionBoundary: expect.objectContaining({
            executionMode: 'guarded_execution_planned',
          }),
        }),
      ]),
    );
  });

  it('returns one tool contract by key', () => {
    const useCase = new GetAiToolRegistryEntryByKeyUseCase();

    const result = useCase.execute('invoice_document_drafting');

    expect(result).toEqual(
      expect.objectContaining({
        key: 'invoice_document_drafting',
        outputContract: expect.objectContaining({
          suggestedOutputKeys: [
            'drafting_brief',
            'review_checklist',
            'blocker_explanation',
          ],
        }),
        executionBoundary: expect.objectContaining({
          executionMode: 'suggestion_only',
        }),
      }),
    );
  });

  it('returns tool access rules for one agent', () => {
    const useCase = new GetAiAgentToolAccessByAgentKeyUseCase();

    const result = useCase.execute('growth-assist-coach');

    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          accessLevel: 'allowed',
          tool: expect.objectContaining({
            key: 'growth_assist_reply_drafting',
            outputContract: expect.objectContaining({
              suggestedOutputKeys: ['reply_draft'],
            }),
          }),
        }),
        expect.objectContaining({
          accessLevel: 'blocked',
          tool: expect.objectContaining({
            key: 'growth_case_assignment_execution',
          }),
        }),
      ]),
    );
  });
});
