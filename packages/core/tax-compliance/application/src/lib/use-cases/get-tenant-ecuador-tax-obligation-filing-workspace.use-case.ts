import {
  EcuadorTaxObligationFilingWorkspaceView,
  EcuadorTaxReadinessStatus,
} from '@saas-platform/tax-compliance-domain';
import { GetTenantEcuadorTaxDeclarationFormCatalogUseCase } from './get-tenant-ecuador-tax-declaration-form-catalog.use-case';
import { GetTenantEcuadorTaxDeclarationSourceLedgerUseCase } from './get-tenant-ecuador-tax-declaration-source-ledger.use-case';
import { GetTenantEcuadorTaxPartiesOperationalCommandCenterUseCase } from './get-tenant-ecuador-tax-parties-operational-command-center.use-case';
import { RecordTenantEcuadorTaxComplianceEventUseCase } from './record-tenant-ecuador-tax-compliance-event.use-case';

export class GetTenantEcuadorTaxObligationFilingWorkspaceUseCase {
  constructor(
    private readonly getTenantEcuadorTaxDeclarationSourceLedgerUseCase: GetTenantEcuadorTaxDeclarationSourceLedgerUseCase,
    private readonly getTenantEcuadorTaxDeclarationFormCatalogUseCase: GetTenantEcuadorTaxDeclarationFormCatalogUseCase,
    private readonly getTenantEcuadorTaxPartiesOperationalCommandCenterUseCase: GetTenantEcuadorTaxPartiesOperationalCommandCenterUseCase,
    private readonly recordTenantEcuadorTaxComplianceEventUseCase: RecordTenantEcuadorTaxComplianceEventUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
    recordEvent?: boolean;
  }): Promise<EcuadorTaxObligationFilingWorkspaceView> {
    const [sourceLedger, formCatalog, partyCommandCenter] = await Promise.all([
      this.getTenantEcuadorTaxDeclarationSourceLedgerUseCase.execute(input),
      this.getTenantEcuadorTaxDeclarationFormCatalogUseCase.execute(input),
      this.getTenantEcuadorTaxPartiesOperationalCommandCenterUseCase.execute({
        ...input,
        recordEvent: false,
      }),
    ]);
    const partyRiskCount =
      partyCommandCenter.summary.validationDiscrepancyCount +
      partyCommandCenter.summary.accountantQuestionCount;
    const obligations: EcuadorTaxObligationFilingWorkspaceView['obligations'] =
      [
        obligation(
          'iva',
          'IVA',
          sourceLedger.readinessStatus,
          'Periodo mensual sujeto a calendario del contribuyente.',
          resolveFormCoverage(formCatalog, 'iva'),
          sourceLedger.sourceRows.filter((row) => row.vatInCents !== 0).length,
          partyRiskCount,
          partyRiskCount > 0 || sourceLedger.summary.gapCount > 0,
          'Revisar casilleros IVA y diferencias de evidencia antes del filing.',
        ),
        obligation(
          'income_tax',
          'Impuesto a la renta',
          sourceLedger.readinessStatus === 'blocked'
            ? 'blocked'
            : sourceLedger.summary.accountingCloseoutAvailable
              ? 'needs_review'
              : 'needs_review',
          'Declaracion anual o anticipos segun perfil tributario.',
          resolveFormCoverage(formCatalog, 'income_tax'),
          sourceLedger.sourceRows.filter(
            (row) => row.direction === 'sale' || row.direction === 'purchase',
          ).length,
          partyRiskCount,
          true,
          'Preparar lineas de renta y confirmar criterio contable con contador.',
        ),
        obligation(
          'withholding',
          'Retenciones',
          sourceLedger.readinessStatus,
          'Retenciones declarables segun soportes y periodo.',
          resolveFormCoverage(formCatalog, 'withholding'),
          sourceLedger.sourceRows.filter(
            (row) =>
              row.direction === 'withholding' ||
              row.incomeTaxWithholdingInCents !== 0 ||
              row.vatWithholdingInCents !== 0,
          ).length,
          partyRiskCount,
          partyRiskCount > 0,
          'Cruzar retenciones emitidas/recibidas con soporte SRI y parties.',
        ),
        obligation(
          'annexes',
          'Anexos',
          sourceLedger.readinessStatus === 'blocked'
            ? 'blocked'
            : partyRiskCount > 0
              ? 'needs_review'
              : 'ready',
          'Anexos dependen de fuentes SRI, retenciones y terceros.',
          resolveFormCoverage(formCatalog, 'annexes'),
          sourceLedger.summary.rowCount,
          partyRiskCount,
          partyRiskCount > 0,
          'Revisar anexos con evidencia de terceros antes de cierre.',
        ),
      ];
    const blockers = [
      ...sourceLedger.blockers,
      ...partyCommandCenter.blockers,
      ...obligations
        .filter((item) => item.status === 'blocked')
        .map((item) => `obligation.${item.key}.blocked`),
    ];
    const workspaceStatus = resolveStatus(
      obligations.map((item) => item.status),
      blockers,
    );
    const uniqueBlockers = [...new Set(blockers)];
    const view: EcuadorTaxObligationFilingWorkspaceView = {
      ...input,
      generatedAt: this.nowProvider(),
      workspaceStatus,
      obligations,
      sourceLedger,
      formCatalog,
      partyCommandCenter,
      summary: {
        obligationCount: obligations.length,
        readyObligationCount: obligations.filter(
          (item) => item.status === 'ready',
        ).length,
        accountantGateCount: obligations.filter((item) => item.accountantGate)
          .length,
        partyRiskCount,
        blockerCount: uniqueBlockers.length,
      },
      blockers: uniqueBlockers,
      nextStep:
        workspaceStatus === 'ready'
          ? 'Continuar con binder de casilleros y export de evidencia.'
          : 'Resolver obligaciones bloqueadas o enviar a contador antes de filing externo.',
      guardrails: [
        'Workspace por obligacion prepara y prioriza; no presenta declaraciones.',
        'Los gates de contador son senales operativas, no certificacion profesional.',
      ],
    };

    if (input.recordEvent ?? true) {
      await this.recordTenantEcuadorTaxComplianceEventUseCase.execute({
        tenantSlug: input.tenantSlug,
        period: input.period,
        year: input.year,
        eventType: 'tax_obligation_filing_workspace_reviewed',
        source: 'tax_obligation_filing_workspace',
        payload: {
          workspaceStatus,
          summary: view.summary,
        },
      });
    }

    return view;
  }
}

function obligation(
  key: EcuadorTaxObligationFilingWorkspaceView['obligations'][number]['key'],
  label: string,
  status: EcuadorTaxReadinessStatus,
  dueSignal: string,
  formCoverage: string,
  sourceRowCount: number,
  partyRiskCount: number,
  accountantGate: boolean,
  nextAction: string,
): EcuadorTaxObligationFilingWorkspaceView['obligations'][number] {
  return {
    key,
    label,
    status,
    dueSignal,
    formCoverage,
    sourceRowCount,
    partyRiskCount,
    accountantGate,
    nextAction,
  };
}

function resolveFormCoverage(
  formCatalog: EcuadorTaxObligationFilingWorkspaceView['formCatalog'],
  key: string,
): string {
  const form = formCatalog.forms.find((item) => item.formKey === key);

  return form
    ? `${form.supportStatus} · ${form.draftableBoxes.length} draftable boxes`
    : 'manual_only · pending contract';
}

function resolveStatus(
  statuses: EcuadorTaxReadinessStatus[],
  blockers: string[],
): EcuadorTaxReadinessStatus {
  if (blockers.length > 0 || statuses.includes('blocked')) {
    return 'blocked';
  }

  return statuses.includes('needs_review') ? 'needs_review' : 'ready';
}
