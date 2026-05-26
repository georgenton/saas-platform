import { GetAiOperatingModelManifestUseCase } from '@saas-platform/ai-application';

describe('AI operating model use case', () => {
  it('returns the versioned AI operating model manifest', () => {
    const useCase = new GetAiOperatingModelManifestUseCase();

    const result = useCase.execute();

    expect(result).toEqual({
      version: 'v1',
      agents: expect.arrayContaining([
        expect.objectContaining({
          agent: expect.objectContaining({
            key: 'growth-assist-coach',
            domainKey: 'growth',
            availability: 'ready',
          }),
          requiredPermissionKey: 'growth.conversations.read',
          promptPack: expect.objectContaining({
            key: 'growth-assist-coach-core',
            version: 'v1',
          }),
          approvalPolicyKeys: ['growth-assist-suggestion-review'],
          guardedExecutionCandidateToolKey: 'growth_case_assignment_execution',
          guardedExecutionCandidate: {
            toolKey: 'growth_case_assignment_execution',
            title: 'Growth case assignment lane',
            targetKind: 'growth_operational_case',
            targetSelectionLabel: 'Operational case',
            emptyTargetSelectionLabel: 'No eligible operational cases',
            executeActionLabel: 'Execute take-case',
            rollbackActionLabel: 'Rollback take-case',
          },
          toolAccess: expect.arrayContaining([
            expect.objectContaining({
              toolKey: 'growth_case_assignment_execution',
              accessLevel: 'blocked',
              executionMode: 'guarded_execution_planned',
            }),
          ]),
        }),
        expect.objectContaining({
          agent: expect.objectContaining({
            key: 'invoice-document-assistant',
            domainKey: 'invoicing',
          }),
          requiredPermissionKey: 'invoicing.reports.read',
          guardedExecutionCandidateToolKey:
            'invoice_payment_collection_execution',
          guardedExecutionCandidate: {
            toolKey: 'invoice_payment_collection_execution',
            title: 'Invoice payment collection lane',
            targetKind: 'invoice',
            targetSelectionLabel: 'Invoice',
            emptyTargetSelectionLabel: 'No eligible invoices',
            executeActionLabel: 'Execute post-payment',
            rollbackActionLabel: 'Rollback payment',
          },
        }),
        expect.objectContaining({
          agent: expect.objectContaining({
            key: 'ecommerce-launch-assistant',
            domainKey: 'ecommerce',
          }),
          requiredPermissionKey: 'tenant.entitlements.read',
          guardedExecutionCandidateToolKey: null,
          guardedExecutionCandidate: null,
        }),
      ]),
      counts: {
        totalAgents: 3,
        readyAgents: 3,
        plannedAgents: 0,
        agentsWithApprovalPolicies: 3,
        agentsWithGuardedExecutionCandidate: 2,
        totalToolAccessEntries: 6,
        approvalRequiredToolAccessEntries: 2,
        blockedToolAccessEntries: 2,
      },
    });
  });
});
