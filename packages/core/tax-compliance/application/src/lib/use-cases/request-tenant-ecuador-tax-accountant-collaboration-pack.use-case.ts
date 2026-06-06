import {
  EcuadorTaxAccountantCollaborationPackView,
  EcuadorTaxReadinessStatus,
} from '@saas-platform/tax-compliance-domain';
import { GetTenantEcuadorTaxIncomeTaxFormContractWorkspaceUseCase } from './get-tenant-ecuador-tax-income-tax-form-contract-workspace.use-case';
import { GetTenantEcuadorTaxVatFormContractWorkspaceUseCase } from './get-tenant-ecuador-tax-vat-form-contract-workspace.use-case';
import { RecordTenantEcuadorTaxComplianceEventUseCase } from './record-tenant-ecuador-tax-compliance-event.use-case';
import { RequestTenantEcuadorTaxPeriodCloseoutCertificationUseCase } from './request-tenant-ecuador-tax-period-closeout-certification.use-case';

export class RequestTenantEcuadorTaxAccountantCollaborationPackUseCase {
  constructor(
    private readonly requestTenantEcuadorTaxPeriodCloseoutCertificationUseCase: RequestTenantEcuadorTaxPeriodCloseoutCertificationUseCase,
    private readonly getTenantEcuadorTaxVatFormContractWorkspaceUseCase: GetTenantEcuadorTaxVatFormContractWorkspaceUseCase,
    private readonly getTenantEcuadorTaxIncomeTaxFormContractWorkspaceUseCase: GetTenantEcuadorTaxIncomeTaxFormContractWorkspaceUseCase,
    private readonly recordTenantEcuadorTaxComplianceEventUseCase: RecordTenantEcuadorTaxComplianceEventUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
    recordEvent?: boolean;
  }): Promise<EcuadorTaxAccountantCollaborationPackView> {
    const [certification, vatContract, incomeContract] = await Promise.all([
      this.requestTenantEcuadorTaxPeriodCloseoutCertificationUseCase.execute({
        ...input,
        recordEvent: false,
      }),
      this.getTenantEcuadorTaxVatFormContractWorkspaceUseCase.execute({
        ...input,
        recordEvent: false,
      }),
      this.getTenantEcuadorTaxIncomeTaxFormContractWorkspaceUseCase.execute({
        ...input,
        recordEvent: false,
      }),
    ]);
    const reviewBundle = [
      {
        key: 'certification_questions',
        label: 'Preguntas de certificacion',
        owner: 'accountant' as const,
        priority: certification.summary.blockerCount > 0 ? ('critical' as const) : ('high' as const),
        status: statusFromBlockers(certification.blockers),
        evidenceRefs: ['period_closeout_certification', 'closeout_report'],
        questions: certification.closeoutReport.accountantQuestions,
      },
      {
        key: 'vat_contract_review',
        label: 'Revision contrato IVA',
        owner: 'accountant' as const,
        priority: vatContract.blockers.length > 0 ? ('critical' as const) : ('normal' as const),
        status: vatContract.readinessStatus,
        evidenceRefs: ['vat_form_contract', 'declaration_source_ledger'],
        questions: [
          'Los casilleros IVA sugeridos coinciden con soporte SRI y compras?',
          'Hay casilleros manuales que deban completarse fuera del sistema?',
        ],
      },
      {
        key: 'income_tax_review',
        label: 'Revision contrato renta',
        owner: 'accountant' as const,
        priority: 'high' as const,
        status: incomeContract.readinessStatus,
        evidenceRefs: ['income_tax_form_contract', 'purchase_evidence'],
        questions: [
          'Los gastos deducibles tienen soporte suficiente?',
          'Las retenciones aplican como credito tributario del periodo/anual?',
        ],
      },
    ];
    const blockers = [
      ...certification.blockers,
      ...vatContract.blockers,
      ...incomeContract.blockers,
    ];
    const readinessStatus = resolveReadiness(
      reviewBundle.map((item) => item.status),
      blockers,
    );
    const view: EcuadorTaxAccountantCollaborationPackView = {
      tenantSlug: input.tenantSlug,
      period: input.period,
      year: input.year,
      generatedAt: this.nowProvider(),
      readinessStatus,
      certification,
      reviewBundle,
      summary: {
        bundleItemCount: reviewBundle.length,
        accountantOwnedCount: reviewBundle.filter(
          (item) => item.owner === 'accountant',
        ).length,
        criticalCount: reviewBundle.filter((item) => item.priority === 'critical')
          .length,
        questionCount: reviewBundle.reduce(
          (total, item) => total + item.questions.length,
          0,
        ),
        blockerCount: blockers.length,
      },
      blockers: [...new Set(blockers)],
      nextStep:
        readinessStatus === 'blocked'
          ? 'Enviar paquete con blockers criticos al contador antes de certificar.'
          : 'Compartir paquete de colaboracion para aprobacion profesional del periodo.',
      guardrails: [
        'El paquete organiza revision profesional; no reemplaza al contador.',
        'No contiene credenciales SRI ni instrucciones para automatizar filing.',
      ],
    };

    if (input.recordEvent ?? true) {
      await this.recordTenantEcuadorTaxComplianceEventUseCase.execute({
        tenantSlug: input.tenantSlug,
        period: input.period,
        year: input.year,
        eventType: 'tax_accountant_collaboration_pack_requested',
        source: 'tax_accountant_collaboration_pack',
        payload: { readinessStatus, summary: view.summary },
      });
    }

    return view;
  }
}

function statusFromBlockers(blockers: string[]): EcuadorTaxReadinessStatus {
  return blockers.length > 0 ? 'blocked' : 'needs_review';
}

function resolveReadiness(
  statuses: EcuadorTaxReadinessStatus[],
  blockers: string[],
): EcuadorTaxReadinessStatus {
  if (blockers.length > 0 || statuses.includes('blocked')) {
    return 'blocked';
  }

  return statuses.includes('needs_review') ? 'needs_review' : 'ready';
}
