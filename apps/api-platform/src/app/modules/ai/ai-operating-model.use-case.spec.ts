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
          primarySurface: {
            key: 'growth_assist_daily_agenda',
            title: 'Growth Assist daily agenda',
            sourceContractKey: 'growth.assist.daily_agenda',
          },
          promptPack: expect.objectContaining({
            key: 'growth-assist-coach-core',
            version: 'v1',
            summary:
              'Prompt pack for turning deterministic Growth Assist agenda signals into commercial suggestions for non-expert operators.',
            objective:
              'Propose clear commercial suggestions for a non-expert operator using the deterministic Growth Assist agenda as the source of truth.',
          }),
          approvalPolicies: [
            {
              policyKey: 'growth-assist-suggestion-review',
              agentKey: 'growth-assist-coach',
              scope: 'suggestion_review',
              title: 'Growth Assist suggestion review',
              summary:
                'Requests human review before a Growth Assist suggestion handoff is treated as approved for operator use.',
              reviewGuidance:
                'Verify that the suggestion stays grounded in deterministic Growth signals, does not overreach beyond the tenant context, and still sounds safe for a human operator to adapt.',
              approvalRequired: true,
            },
          ],
          primaryApprovalPolicyKey: 'growth-assist-suggestion-review',
          approvalPolicyKeys: ['growth-assist-suggestion-review'],
          handoffContract: {
            requestApprovalRationale:
              'Solicitar revision humana antes de tratar el handoff como aprobado.',
            reviewNotes: {
              approved: 'Aprobado desde la consola transversal de AI.',
              rejected: 'Rechazado desde la consola transversal de AI.',
            },
          },
          guardedExecutionCandidateToolKey: 'growth_case_assignment_execution',
          guardedExecutionCandidate: {
            toolKey: 'growth_case_assignment_execution',
            title: 'Growth case assignment lane',
            targetKind: 'growth_operational_case',
            operatingLane: 'operational_case_assignment_lane',
            blastRadius: 'single_queue_lane',
            safeFallbackMode: 'suggestion_only_with_manual_assignment',
            preferredPilotTypeWhenReady: 'human_gate_then_execute',
            targetSelectionLabel: 'Operational case',
            emptyTargetSelectionLabel: 'No eligible operational cases',
            executeActionLabel: 'Execute take-case',
            rollbackActionLabel: 'Rollback take-case',
          },
          toolAccess: expect.arrayContaining([
            expect.objectContaining({
              accessLevel: 'blocked',
              rationale: expect.any(String),
              tool: expect.objectContaining({
                key: 'growth_case_assignment_execution',
                executionBoundary: expect.objectContaining({
                  executionMode: 'guarded_execution_planned',
                }),
              }),
            }),
          ]),
        }),
        expect.objectContaining({
          agent: expect.objectContaining({
            key: 'invoice-document-assistant',
            domainKey: 'invoicing',
          }),
          requiredPermissionKey: 'invoicing.reports.read',
          primarySurface: {
            key: 'invoice_document_drafting',
            title: 'Invoice document drafting',
            sourceContractKey: 'invoicing.assist.document_drafting',
          },
          promptPack: expect.objectContaining({
            key: 'invoice-document-assistant-core',
            version: 'v1',
            summary:
              'Prompt pack for document drafting, review, and checklist suggestions in Ecuador electronic invoicing.',
            objective:
              'Help operators draft and review tax document workflows without replacing fiscal validation owned by the invoicing domain.',
          }),
          approvalPolicies: [
            {
              policyKey: 'invoice-document-assistant-suggestion-review',
              agentKey: 'invoice-document-assistant',
              scope: 'suggestion_review',
              title: 'Invoice suggestion review',
              summary:
                'Keeps document-drafting suggestions behind explicit operator review before they influence invoicing work.',
              reviewGuidance:
                'Confirm that the suggestion is only advisory, matches the fiscal document context, and does not replace domain validation or tax compliance checks.',
              approvalRequired: true,
            },
          ],
          primaryApprovalPolicyKey:
            'invoice-document-assistant-suggestion-review',
          handoffContract: {
            requestApprovalRationale:
              'Solicitar revision humana antes de usar la sugerencia sobre documentos tributarios.',
            reviewNotes: {
              approved:
                'Aprobado desde la consola transversal de AI para Invoice Document Assistant.',
              rejected:
                'Rechazado desde la consola transversal de AI para Invoice Document Assistant.',
            },
          },
          guardedExecutionCandidateToolKey:
            'invoice_payment_collection_execution',
          guardedExecutionCandidate: {
            toolKey: 'invoice_payment_collection_execution',
            title: 'Invoice payment collection lane',
            targetKind: 'invoice',
            operatingLane: 'single_record_execution_lane',
            blastRadius: 'single_record',
            safeFallbackMode: 'suggestion_only',
            preferredPilotTypeWhenReady: 'human_gate_then_execute',
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
          primarySurface: {
            key: 'ecommerce_launch_workspace',
            title: 'Ecommerce launch workspace',
            sourceContractKey: 'ecommerce.launch.workspace',
          },
          promptPack: expect.objectContaining({
            key: 'ecommerce-launch-assistant-core',
            version: 'v1',
            summary:
              'Prompt pack for ecommerce launch, landing, and campaign suggestions grounded in deterministic tenant context.',
            objective:
              'Propose launch content and structure suggestions without becoming the source of truth for catalog or storefront workflows.',
          }),
          approvalPolicies: [
            {
              policyKey: 'ecommerce-launch-assistant-suggestion-review',
              agentKey: 'ecommerce-launch-assistant',
              scope: 'suggestion_review',
              title: 'Ecommerce launch suggestion review',
              summary:
                'Keeps launch and campaign suggestions behind operator review before they influence storefront work.',
              reviewGuidance:
                'Check that the suggestion stays grounded in product context, does not invent catalog facts, and is safe to translate into real launch work.',
              approvalRequired: true,
            },
          ],
          primaryApprovalPolicyKey:
            'ecommerce-launch-assistant-suggestion-review',
          handoffContract: {
            requestApprovalRationale:
              'Solicitar revision humana antes de usar la sugerencia de Ecommerce Launch Assistant.',
            reviewNotes: {
              approved:
                'Aprobado desde la consola transversal de AI para Ecommerce Launch Assistant.',
              rejected:
                'Rechazado desde la consola transversal de AI para Ecommerce Launch Assistant.',
            },
          },
          guardedExecutionCandidateToolKey: 'ecommerce_launch_publish_execution',
          guardedExecutionCandidate: {
            toolKey: 'ecommerce_launch_publish_execution',
            title: 'Ecommerce launch publish lane',
            targetKind: 'ecommerce_launch_plan',
            operatingLane: 'single_record_execution_lane',
            blastRadius: 'single_record',
            safeFallbackMode: 'suggestion_only',
            preferredPilotTypeWhenReady: 'shadow_review',
            targetSelectionLabel: 'Launch plan',
            emptyTargetSelectionLabel: 'No eligible launch plan',
            executeActionLabel: 'Execute launch publish',
            rollbackActionLabel: 'Rollback launch publish',
          },
        }),
      ]),
      counts: {
        totalAgents: 3,
        readyAgents: 3,
        plannedAgents: 0,
        agentsWithApprovalPolicies: 3,
        agentsWithGuardedExecutionCandidate: 3,
        totalToolAccessEntries: 7,
        approvalRequiredToolAccessEntries: 2,
        blockedToolAccessEntries: 3,
      },
    });
  });
});
