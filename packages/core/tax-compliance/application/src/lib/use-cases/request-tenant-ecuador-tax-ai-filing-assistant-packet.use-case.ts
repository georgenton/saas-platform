import {
  EcuadorTaxAiFilingAssistantPacketView,
  EcuadorTaxDeclarationFormKey,
} from '@saas-platform/tax-compliance-domain';
import { GetTenantEcuadorTaxDeclarationSourceLedgerUseCase } from './get-tenant-ecuador-tax-declaration-source-ledger.use-case';
import { GetTenantEcuadorTaxIncomeTaxEvidenceWorkspaceUseCase } from './get-tenant-ecuador-tax-income-tax-evidence-workspace.use-case';
import { GetTenantEcuadorTaxVatDeclarationDraftWorkspaceUseCase } from './get-tenant-ecuador-tax-vat-declaration-draft-workspace.use-case';

export class RequestTenantEcuadorTaxAiFilingAssistantPacketUseCase {
  constructor(
    private readonly getTenantEcuadorTaxDeclarationSourceLedgerUseCase: GetTenantEcuadorTaxDeclarationSourceLedgerUseCase,
    private readonly getTenantEcuadorTaxVatDeclarationDraftWorkspaceUseCase: GetTenantEcuadorTaxVatDeclarationDraftWorkspaceUseCase,
    private readonly getTenantEcuadorTaxIncomeTaxEvidenceWorkspaceUseCase: GetTenantEcuadorTaxIncomeTaxEvidenceWorkspaceUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
    formKey?: EcuadorTaxDeclarationFormKey;
  }): Promise<EcuadorTaxAiFilingAssistantPacketView> {
    const [sourceLedger, vatWorkspace, incomeTaxWorkspace] = await Promise.all([
      this.getTenantEcuadorTaxDeclarationSourceLedgerUseCase.execute(input),
      this.getTenantEcuadorTaxVatDeclarationDraftWorkspaceUseCase.execute(input),
      this.getTenantEcuadorTaxIncomeTaxEvidenceWorkspaceUseCase.execute(input),
    ]);
    const blockers = [
      ...sourceLedger.blockers,
      ...vatWorkspace.blockers,
      ...incomeTaxWorkspace.blockers,
    ];
    const assistantStatus =
      blockers.length > 0
        ? 'blocked'
        : sourceLedger.readinessStatus === 'needs_review' ||
            vatWorkspace.readinessStatus === 'needs_review' ||
            incomeTaxWorkspace.readinessStatus === 'needs_review'
          ? 'needs_review'
          : 'ready';

    return {
      ...input,
      generatedAt: this.nowProvider(),
      formKey: input.formKey ?? 'iva',
      assistantStatus,
      sourceLedger,
      vatWorkspace,
      incomeTaxWorkspace,
      suggestedSteps: [
        {
          key: 'review_source_ledger',
          order: 1,
          title: 'Revisar ledger fiscal',
          instruction:
            'Confirmar ventas, compras, SRI importado y gaps antes de llenar formularios.',
          humanGate: true,
        },
        {
          key: 'review_vat_boxes',
          order: 2,
          title: 'Validar casilleros IVA',
          instruction:
            'Comparar IVA generado, credito tributario y retenciones contra evidencia fuente.',
          humanGate: true,
        },
        {
          key: 'review_income_tax_evidence',
          order: 3,
          title: 'Preparar evidencia renta',
          instruction:
            'Separar ingresos, gastos deducibles y retenciones con criterio profesional.',
          humanGate: true,
        },
        {
          key: 'external_filing',
          order: 4,
          title: 'Declaracion externa',
          instruction:
            'Copiar o cargar valores manualmente en SRI y registrar handoff externo.',
          humanGate: true,
        },
      ],
      accountantQuestions: [
        'Que filas del ledger fiscal deben excluirse o reclasificarse?',
        'Que compras tienen derecho a credito tributario IVA?',
        'Que gastos son deducibles para renta y cuales requieren soporte adicional?',
        'Hay saldos previos, multas, intereses o arrastres fuera de la plataforma?',
      ],
      evidenceUsed: sourceLedger.sourceRows.map((row) => row.rowKey),
      blockers: [...new Set(blockers)],
      nextStep:
        assistantStatus === 'blocked'
          ? 'Resolver blockers antes de usar el asistente de declaracion.'
          : 'Usar el asistente como guia paso a paso con aprobacion humana.',
      guardrails: [
        'El asistente no declara, firma, paga ni sustituye contador.',
        'Todas las instrucciones son apoyo para entrada manual supervisada en SRI.',
      ],
    };
  }
}
