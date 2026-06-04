import {
  EcuadorTaxVatApprovalStatus,
  EcuadorTaxVatDeclarationApprovalView,
} from '@saas-platform/tax-compliance-domain';
import { ListTenantEcuadorTaxComplianceEventsUseCase } from './list-tenant-ecuador-tax-compliance-events.use-case';
import { RequestTenantEcuadorTaxVatDeclarationDraftUseCase } from './request-tenant-ecuador-tax-vat-declaration-draft.use-case';

export class GetTenantEcuadorTaxVatDeclarationApprovalUseCase {
  constructor(
    private readonly requestTenantEcuadorTaxVatDeclarationDraftUseCase: RequestTenantEcuadorTaxVatDeclarationDraftUseCase,
    private readonly listTenantEcuadorTaxComplianceEventsUseCase: ListTenantEcuadorTaxComplianceEventsUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
  }): Promise<EcuadorTaxVatDeclarationApprovalView> {
    const [draft, events] = await Promise.all([
      this.requestTenantEcuadorTaxVatDeclarationDraftUseCase.execute({
        ...input,
        recordEvent: false,
      }),
      this.listTenantEcuadorTaxComplianceEventsUseCase.execute({
        tenantSlug: input.tenantSlug,
        period: input.period,
        limit: 100,
      }),
    ]);
    const transitionEvents = events
      .filter((event) => event.eventType === 'vat_declaration_approval_transitioned')
      .map((event) => ({
        status: readVatApprovalStatus(event.payload.status),
        transitionedAt: event.occurredAt,
        transitionedByUserId: readStringOrNull(event.payload.transitionedByUserId),
        transitionedByEmail: readStringOrNull(event.payload.transitionedByEmail),
        note: readStringOrNull(event.payload.note),
      }));
    const status =
      transitionEvents[0]?.status ??
      (draft.readinessStatus === 'blocked'
        ? 'draft'
        : draft.readinessStatus === 'needs_review'
          ? 'needs_accountant_review'
          : 'draft');
    const blockers = [
      ...draft.blockers,
      ...(status === 'approved_for_external_filing' ? [] : ['vat.approval_not_final']),
    ];

    return {
      tenantSlug: input.tenantSlug,
      period: input.period,
      year: input.year,
      generatedAt: this.nowProvider(),
      status,
      draft,
      transitionHistory: transitionEvents,
      blockers: [...new Set(blockers)],
      nextStep:
        status === 'approved_for_external_filing'
          ? 'Usar aprobacion IVA como prerequisito de closeout operacional.'
          : status === 'changes_requested'
            ? 'Resolver cambios solicitados antes de pedir aprobacion final.'
            : 'Enviar borrador IVA a contador y registrar transicion de aprobacion.',
      guardrails: [
        'La aprobacion IVA es operacional; no presenta ni paga formulario SRI.',
        'Aprobacion final debe conservar evidencia y responsable humano.',
      ],
    };
  }
}

export function readVatApprovalStatus(value: unknown): EcuadorTaxVatApprovalStatus {
  return typeof value === 'string' &&
    [
      'draft',
      'needs_accountant_review',
      'changes_requested',
      'approved_for_external_filing',
    ].includes(value)
    ? (value as EcuadorTaxVatApprovalStatus)
    : 'draft';
}

function readStringOrNull(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value : null;
}
