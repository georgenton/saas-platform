import { EcuadorTaxAccountingBoundaryCloseoutView } from '@saas-platform/tax-compliance-domain';
import { GetTenantEcuadorTaxCommandCenterV2UseCase } from './get-tenant-ecuador-tax-command-center-v2.use-case';

export class GetTenantEcuadorTaxAccountingBoundaryCloseoutUseCase {
  constructor(
    private readonly getTenantEcuadorTaxCommandCenterV2UseCase: GetTenantEcuadorTaxCommandCenterV2UseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
  }): Promise<EcuadorTaxAccountingBoundaryCloseoutView> {
    const commandCenter =
      await this.getTenantEcuadorTaxCommandCenterV2UseCase.execute(input);
    const blockers = commandCenter.blockers;
    const boundaryStatus =
      blockers.length > 0 || commandCenter.commandStatus === 'blocked'
        ? 'blocked'
        : commandCenter.commandStatus === 'ready' ||
            commandCenter.commandStatus === 'externally_filed'
          ? 'ready'
          : 'needs_review';
    const escalationRules: EcuadorTaxAccountingBoundaryCloseoutView['escalationRules'] =
      [
        {
          key: 'tax_compliance_preparation',
          label: 'Declaraciones, evidencia SRI y guias de filing',
          targetProduct: 'tax-compliance-ec',
          rationale:
            'Tax Compliance conserva obligacion, evidencia fiscal, formulario asistido y handoff humano.',
        },
        {
          key: 'accounting_foundation_inputs',
          label: 'Comparativos contables Foundation',
          targetProduct: 'tax-compliance-ec',
          rationale:
            'Tax puede consumir senales contables preparadas sin asumir libro mayor oficial.',
        },
        {
          key: 'formal_books_and_audit',
          label: 'Libros oficiales, auditoria y estados certificados',
          targetProduct: 'accounting-advanced',
          rationale:
            'Cuando el negocio necesita contabilidad formal completa, se escala fuera de Tax Compliance.',
        },
      ];
    const backlog: EcuadorTaxAccountingBoundaryCloseoutView['backlog'] = [
      {
        key: 'tax_command_center_v2',
        label: 'Command center tributario con evidencia Accounting Foundation',
        product: 'tax-compliance-ec',
        priority: 'high',
      },
      {
        key: 'assisted_declaration_review_v2',
        label: 'Pack asistido de revision de declaraciones con preguntas para contador',
        product: 'tax-compliance-ec',
        priority: 'high',
      },
      {
        key: 'accounting_comparative_evidence',
        label: 'Comparativo entre evidencia SRI, formularios y saldos contables Foundation',
        product: 'tax-compliance-ec',
        priority: 'normal',
      },
      {
        key: 'official_ledger_books',
        label: 'Libros oficiales, politicas contables y asientos certificados',
        product: 'accounting-advanced',
        priority: 'normal',
      },
      {
        key: 'accountant_auditor_portal',
        label: 'Portal avanzado para contador/auditor con revisiones multi-periodo',
        product: 'accounting-advanced',
        priority: 'normal',
      },
    ];

    return {
      ...input,
      generatedAt: this.nowProvider(),
      boundaryStatus,
      currentOperatingModel: 'tax_compliance_plus_accounting_foundation',
      escalationRules,
      backlog,
      summary: {
        escalationRuleCount: escalationRules.length,
        taxBacklogCount: backlog.filter(
          (item) => item.product === 'tax-compliance-ec',
        ).length,
        accountingAdvancedBacklogCount: backlog.filter(
          (item) => item.product === 'accounting-advanced',
        ).length,
      },
      blockers: [...new Set(blockers)],
      nextStep:
        boundaryStatus === 'ready'
          ? 'Continuar Tax Compliance 2.0 sin abrir Accounting Advanced todavia.'
          : 'Resolver gaps de cierre antes de decidir escalamiento a Accounting Advanced.',
      guardrails: [
        'Tax Compliance prepara y explica; no sustituye contabilidad formal certificada.',
        'Accounting Foundation aporta comparativos operativos, no libros oficiales completos.',
      ],
    };
  }
}
