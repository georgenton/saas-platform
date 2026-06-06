import { TenantAccountingAccountantHandoffWorkspaceView } from '@saas-platform/accounting-domain';
import { GetTenantAccountingPeriodEvidenceVaultUseCase } from './get-tenant-accounting-period-evidence-vault.use-case';
import { RequestTenantAccountingFinancialStatementReviewPacketUseCase } from './request-tenant-accounting-financial-statement-review-packet.use-case';

export class GetTenantAccountingAccountantHandoffWorkspaceUseCase {
  constructor(
    private readonly getTenantAccountingPeriodEvidenceVaultUseCase: GetTenantAccountingPeriodEvidenceVaultUseCase,
    private readonly requestTenantAccountingFinancialStatementReviewPacketUseCase: RequestTenantAccountingFinancialStatementReviewPacketUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
  }): Promise<TenantAccountingAccountantHandoffWorkspaceView> {
    const [evidenceVault, financialReviewPacket] = await Promise.all([
      this.getTenantAccountingPeriodEvidenceVaultUseCase.execute(input),
      this.requestTenantAccountingFinancialStatementReviewPacketUseCase.execute({
        ...input,
        decision: 'prepare',
      }),
    ]);
    const riskFlags: TenantAccountingAccountantHandoffWorkspaceView['riskFlags'] =
      [
        ...evidenceVault.artifacts
          .filter((artifact) => artifact.status !== 'ready')
          .map((artifact) => ({
            key: `artifact:${artifact.key}`,
            severity:
              artifact.status === 'blocked'
                ? ('critical' as const)
                : ('warning' as const),
            detail: `${artifact.label} esta en estado ${artifact.status}.`,
          })),
        ...(!financialReviewPacket.summary.balanceSheetBalanced
          ? [
              {
                key: 'financial_preview:balance_sheet',
                severity: 'critical' as const,
                detail: 'Balance sheet preview no cuadra todavia.',
              },
            ]
          : []),
        ...(evidenceVault.summary.auditEventCount === 0
          ? [
              {
                key: 'audit_trail:empty',
                severity: 'warning' as const,
                detail: 'Audit trail no tiene eventos para revisar.',
              },
            ]
          : []),
      ];
    const blockers = [
      ...evidenceVault.blockers,
      ...financialReviewPacket.blockers,
    ];
    const criticalRiskFlagCount = riskFlags.filter(
      (risk) => risk.severity === 'critical',
    ).length;
    const handoffStatus =
      blockers.length > 0 || criticalRiskFlagCount > 0
        ? 'blocked'
        : riskFlags.length > 0 ||
            financialReviewPacket.reviewStatus !== 'ready_for_approval'
          ? 'needs_review'
          : 'ready_for_accountant';
    const accountantQuestions = [
      'Confirmar si los previews financieros son suficientes para revision profesional.',
      'Validar si cash/bank controls soportan el cierre interno del periodo.',
      ...(riskFlags.length > 0
        ? ['Revisar risk flags antes de lock o entrega final.']
        : []),
    ];

    return {
      tenantSlug: input.tenantSlug,
      period: input.period,
      year: input.year,
      generatedAt: this.nowProvider(),
      handoffStatus,
      executiveSummary:
        handoffStatus === 'ready_for_accountant'
          ? 'Periodo contable listo para handoff profesional con evidencia operativa completa.'
          : 'Periodo contable requiere revision antes de entregarse como paquete profesional.',
      evidenceVault,
      financialReviewPacket,
      riskFlags,
      accountantQuestions,
      recommendedActions:
        handoffStatus === 'ready_for_accountant'
          ? [
              'Entregar vault de evidencia y review packet al contador.',
              'Conservar lock/reopen y audit trail como bitacora del periodo.',
            ]
          : [
              'Resolver artifacts bloqueados o en revision.',
              'Solicitar aprobacion humana del financial statement review packet.',
            ],
      summary: {
        evidenceArtifactCount: evidenceVault.summary.artifactCount,
        readyArtifactCount: evidenceVault.summary.readyArtifactCount,
        riskFlagCount: riskFlags.length,
        criticalRiskFlagCount,
        accountantQuestionCount: accountantQuestions.length,
      },
      blockers: [...new Set(blockers)],
      nextStep:
        handoffStatus === 'ready_for_accountant'
          ? 'Compartir handoff con contador y conservar evidencia del periodo.'
          : 'Completar evidencia y aprobaciones antes del handoff profesional.',
      guardrails: [
        'Handoff orienta revision profesional; no reemplaza criterio del contador.',
        'No presenta declaraciones ni emite estados financieros oficiales.',
        'No modifica evidencia fuente ni genera asientos automaticamente.',
      ],
    };
  }
}
