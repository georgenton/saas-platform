import {
  GetAiApprovalPoliciesByAgentKeyUseCase,
  ListAiApprovalPoliciesUseCase,
} from '@saas-platform/ai-application';

describe('AI approval policy use cases', () => {
  it('lists the transversal AI approval policy registry', () => {
    const useCase = new ListAiApprovalPoliciesUseCase();

    const result = useCase.execute();

    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          policyKey: 'growth-assist-suggestion-review',
          agentKey: 'growth-assist-coach',
          scope: 'suggestion_review',
        }),
      ]),
    );
  });

  it('returns approval policies for one agent', () => {
    const useCase = new GetAiApprovalPoliciesByAgentKeyUseCase();

    const result = useCase.execute('growth-assist-coach');

    expect(result).toEqual([
      expect.objectContaining({
        policyKey: 'growth-assist-suggestion-review',
        agentKey: 'growth-assist-coach',
        approvalRequired: true,
      }),
    ]);
  });
});
