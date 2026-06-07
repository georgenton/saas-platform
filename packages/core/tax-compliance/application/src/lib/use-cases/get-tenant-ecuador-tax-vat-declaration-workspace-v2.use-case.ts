import { EcuadorTaxVatDeclarationWorkspaceV2View } from '@saas-platform/tax-compliance-domain';
import { GetTenantEcuadorTaxAccountingEvidenceFromFoundationUseCase } from './get-tenant-ecuador-tax-accounting-evidence-from-foundation.use-case';
import { GetTenantEcuadorTaxVatDeclarationDraftWorkspaceUseCase } from './get-tenant-ecuador-tax-vat-declaration-draft-workspace.use-case';

export class GetTenantEcuadorTaxVatDeclarationWorkspaceV2UseCase {
  constructor(
    private readonly getTenantEcuadorTaxVatDeclarationDraftWorkspaceUseCase: GetTenantEcuadorTaxVatDeclarationDraftWorkspaceUseCase,
    private readonly getTenantEcuadorTaxAccountingEvidenceFromFoundationUseCase: GetTenantEcuadorTaxAccountingEvidenceFromFoundationUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
  }): Promise<EcuadorTaxVatDeclarationWorkspaceV2View> {
    const [vatWorkspace, accountingEvidence] = await Promise.all([
      this.getTenantEcuadorTaxVatDeclarationDraftWorkspaceUseCase.execute(input),
      this.getTenantEcuadorTaxAccountingEvidenceFromFoundationUseCase.execute(
        input,
      ),
    ]);
    const reviewBuckets: EcuadorTaxVatDeclarationWorkspaceV2View['reviewBuckets'] =
      [
        ...vatWorkspace.vatBuckets.map((bucket) => ({
          key: bucket.bucketKey,
          label: bucket.label,
          status: bucket.readinessStatus,
          amountInCents: bucket.amountInCents,
          vatInCents: bucket.vatInCents,
          source: 'vat_workspace' as const,
          reviewQuestion: `El bucket ${bucket.label} coincide con SRI y soporte contable?`,
        })),
        {
          key: 'accounting_foundation_compare',
          label: 'Comparativo Accounting Foundation',
          status: accountingEvidence.readinessStatus,
          amountInCents: 0,
          vatInCents: 0,
          source: 'accounting_foundation',
          reviewQuestion:
            'Las diferencias entre IVA SRI/plataforma y Accounting Foundation estan explicadas?',
        },
      ];
    const blockers = [...vatWorkspace.blockers, ...accountingEvidence.blockers];
    const readinessStatus =
      blockers.length > 0 ||
      vatWorkspace.readinessStatus === 'blocked' ||
      accountingEvidence.readinessStatus === 'blocked'
        ? 'blocked'
        : vatWorkspace.readinessStatus === 'needs_review' ||
            accountingEvidence.readinessStatus === 'needs_review'
          ? 'needs_review'
          : 'ready';

    return {
      ...input,
      generatedAt: this.nowProvider(),
      readinessStatus,
      vatWorkspace,
      accountingEvidence,
      reviewBuckets,
      summary: {
        bucketCount: reviewBuckets.length,
        readyBucketCount: reviewBuckets.filter(
          (bucket) => bucket.status === 'ready',
        ).length,
        suggestedBoxCount: vatWorkspace.summary.suggestedBoxCount,
        outputVatInCents: vatWorkspace.summary.outputVatInCents,
        inputVatInCents: vatWorkspace.summary.inputVatInCents,
        estimatedVatPayableInCents:
          vatWorkspace.summary.estimatedVatPayableInCents,
        accountingBlockedSourceCount:
          accountingEvidence.summary.blockedSourceCount,
      },
      blockers: [...new Set(blockers)],
      nextStep:
        readinessStatus === 'ready'
          ? 'Preparar revision humana de IVA con buckets, casilleros y comparativo contable.'
          : 'Resolver buckets o evidencia contable pendiente antes de cerrar IVA.',
      guardrails: [
        'IVA Workspace 2.0 sugiere y explica; no presenta declaraciones.',
        'El credito tributario y casilleros finales requieren validacion humana/contador.',
      ],
    };
  }
}
