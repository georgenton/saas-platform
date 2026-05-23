import {
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
        }),
        expect.objectContaining({
          key: 'growth_case_assignment_execution',
          requiresApproval: true,
          riskLevel: 'high',
        }),
      ]),
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
