import {
  EcuadorTaxAccountingAdvancedGateV2View,
  EcuadorTaxReviewPriority,
} from '@saas-platform/tax-compliance-domain';
import { GetTenantEcuadorTaxAccountingAdvancedDiscoveryGateUseCase } from './get-tenant-ecuador-tax-accounting-advanced-discovery-gate.use-case';
import { GetTenantEcuadorTaxProfessionalHandoffV6UseCase } from './get-tenant-ecuador-tax-professional-handoff-v6.use-case';

export class GetTenantEcuadorTaxAccountingAdvancedGateV2UseCase {
  constructor(
    private readonly getAccountingAdvancedDiscoveryGateUseCase: GetTenantEcuadorTaxAccountingAdvancedDiscoveryGateUseCase,
    private readonly getProfessionalHandoffUseCase: GetTenantEcuadorTaxProfessionalHandoffV6UseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
  }): Promise<EcuadorTaxAccountingAdvancedGateV2View> {
    const [baseGate, professionalHandoff] = await Promise.all([
      this.getAccountingAdvancedDiscoveryGateUseCase.execute(input),
      this.getProfessionalHandoffUseCase.execute(input),
    ]);
    const decisionSignals: EcuadorTaxAccountingAdvancedGateV2View['decisionSignals'] =
      [
        ...baseGate.decisionSignals.map((item) => ({
          ...item,
          source: 'tax_compliance' as const,
        })),
        signal(
          'accountant_required',
          'Contador requerido',
          professionalHandoff.decision.accountantRequired ? 'high' : 'normal',
          'accountant_handoff',
          professionalHandoff.decision.reason,
        ),
        signal(
          'annual_closeout_pressure',
          'Presion de cierre anual',
          professionalHandoff.annualCloseout.closeoutStatus === 'blocked'
            ? 'critical'
            : professionalHandoff.annualCloseout.closeoutStatus ===
                'needs_review'
              ? 'high'
              : 'normal',
          'annual_closeout',
          professionalHandoff.annualCloseout.nextStep,
        ),
      ];
    const highPressureCount = decisionSignals.filter(
      (item) => item.severity === 'high' || item.severity === 'critical',
    ).length;
    const openAdvancedAccountingNow =
      baseGate.recommendation.openAdvancedAccountingNow ||
      professionalHandoff.decision.serviceMode === 'accounting_advanced_discovery';
    const blockers = [
      ...baseGate.blockers,
      ...professionalHandoff.blockers,
    ];

    return {
      ...input,
      generatedAt: this.nowProvider(),
      gateStatus:
        blockers.length > 0
          ? 'blocked'
          : openAdvancedAccountingNow || highPressureCount >= 2
            ? 'needs_review'
            : 'ready',
      baseGate,
      professionalHandoff,
      decisionSignals,
      recommendation: {
        nextProduct:
          openAdvancedAccountingNow || highPressureCount >= 2
            ? 'accounting-advanced'
            : 'tax-compliance-ec',
        openAdvancedAccountingNow: openAdvancedAccountingNow || highPressureCount >= 2,
        reason:
          openAdvancedAccountingNow || highPressureCount >= 2
            ? 'Hay suficiente presion profesional/contable para discovery de Accounting Advanced.'
            : 'Tax Compliance EC sigue siendo suficiente; mantener contabilidad avanzada diferida.',
        minimumEvidenceBeforeOpening: [
          'Preguntas del contador respondidas y trazables.',
          'Motivo formal: libros, bancos certificados, estados firmados o auditoria.',
          'Confirmacion de que formularios asistidos simples no bastan.',
        ],
      },
      blockers: [...new Set(blockers)],
      nextStep:
        openAdvancedAccountingNow || highPressureCount >= 2
          ? 'Abrir discovery acotado de Accounting Advanced con evidencia minima.'
          : 'Continuar Tax Compliance y mantener el gate como monitor de presion contable.',
      guardrails: [
        ...baseGate.guardrails,
        'Gate v2 no crea libros, journals, estados financieros ni certificaciones.',
      ],
    };
  }
}

function signal(
  key: string,
  label: string,
  severity: EcuadorTaxReviewPriority,
  source: EcuadorTaxAccountingAdvancedGateV2View['decisionSignals'][number]['source'],
  rationale: string,
): EcuadorTaxAccountingAdvancedGateV2View['decisionSignals'][number] {
  return { key, label, severity, source, rationale };
}
