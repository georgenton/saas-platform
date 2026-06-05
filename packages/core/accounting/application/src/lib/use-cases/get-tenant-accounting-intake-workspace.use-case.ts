import { TenantAccountingIntakeWorkspaceView } from '@saas-platform/accounting-domain';
import { RequestTenantEcuadorTaxAccountingReadinessPacketUseCase } from '@saas-platform/tax-compliance-application';

export class GetTenantAccountingIntakeWorkspaceUseCase {
  constructor(
    private readonly requestTenantEcuadorTaxAccountingReadinessPacketUseCase: RequestTenantEcuadorTaxAccountingReadinessPacketUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
  }): Promise<TenantAccountingIntakeWorkspaceView> {
    const readiness =
      await this.requestTenantEcuadorTaxAccountingReadinessPacketUseCase.execute(
        {
          ...input,
          recordEvent: false,
        },
      );

    return {
      tenantSlug: input.tenantSlug,
      period: input.period,
      year: input.year,
      generatedAt: this.nowProvider(),
      productKey: 'accounting',
      sourceProductKey: 'tax-compliance-ec',
      readinessStatus: readiness.readinessStatus,
      recommendation: readiness.recommendation,
      summary: {
        accountingMappedHints: readiness.summary.accountingMappedHints,
        accountingUnmappedHints: readiness.summary.accountingUnmappedHints,
        closeoutBlockerCount: readiness.summary.closeoutBlockerCount,
        evidenceArtifactCount: readiness.summary.evidenceArtifactCount,
        auditEventCount: readiness.summary.auditEventCount,
        decisionSignalCount: readiness.decisionSignals.length,
      },
      intakeSignals: readiness.decisionSignals.map((signal) => ({
        ...signal,
      })),
      proposedScope: readiness.suggestedAccountingScope.map((scope) => ({
        ...scope,
      })),
      blockedCapabilities: [
        'official_journal_entries',
        'general_ledger',
        'trial_balance',
        'bank_reconciliation',
        'financial_statements',
      ],
      nextStep:
        readiness.recommendation === 'graduate_to_accounting'
          ? 'Abrir Accounting Foundation con plan de cuentas y borradores de asientos derivados del bridge tributario.'
          : 'Mantener el periodo dentro de Tax Compliance EC hasta que el volumen o complejidad justifique libros formales.',
      guardrails: [
        'Accounting nace como producto separado; este workspace solo prepara intake.',
        'Tax Compliance EC conserva ownership de obligaciones SRI, formularios y handoff externo.',
        'No se crean asientos, libros oficiales ni estados financieros desde este endpoint.',
      ],
    };
  }
}
