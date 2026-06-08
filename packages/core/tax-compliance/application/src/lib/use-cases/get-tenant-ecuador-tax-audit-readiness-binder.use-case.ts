import { EcuadorTaxAuditReadinessBinderView } from '@saas-platform/tax-compliance-domain';
import {
  annualGuardrails,
  countEvents,
  listAnnualTaxEvents,
  statusFromBlockers,
} from './ecuador-tax-annual-readiness.helpers';
import { ListTenantEcuadorTaxComplianceEventsUseCase } from './list-tenant-ecuador-tax-compliance-events.use-case';

export class GetTenantEcuadorTaxAuditReadinessBinderUseCase {
  constructor(
    private readonly listEventsUseCase: ListTenantEcuadorTaxComplianceEventsUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    year: number;
  }): Promise<EcuadorTaxAuditReadinessBinderView> {
    const events = await listAnnualTaxEvents(
      this.listEventsUseCase,
      input.tenantSlug,
      input.year,
    );
    const folders: EcuadorTaxAuditReadinessBinderView['folders'] = [
      folder('sri_evidence', 'Evidencia SRI', countEvents(events, ['sri']), 'operator'),
      folder('declarations', 'Declaraciones y casillas', countEvents(events, ['declaration', 'form', 'filing']), 'accountant'),
      folder('receipts', 'Recibos y pagos externos', countEvents(events, ['receipt', 'payment']), 'operator'),
      folder('party_risks', 'Riesgos de terceros', countEvents(events, ['party', 'supplier', 'customer']), 'operator'),
      folder('accountant_questions', 'Preguntas al contador', countEvents(events, ['accountant', 'review']), 'accountant'),
    ];
    const blockers = folders
      .filter((item) => item.status === 'blocked')
      .map((item) => item.label);

    return {
      tenantSlug: input.tenantSlug,
      year: input.year,
      generatedAt: this.nowProvider(),
      binderStatus: statusFromBlockers(
        blockers,
        folders.filter((item) => item.status === 'needs_review').length,
      ),
      folders,
      summary: {
        folderCount: folders.length,
        readyFolderCount: folders.filter((item) => item.status === 'ready')
          .length,
        needsReviewFolderCount: folders.filter(
          (item) => item.status === 'needs_review',
        ).length,
        blockedFolderCount: blockers.length,
      },
      blockers,
      nextStep: 'Completar carpetas antes de auditoria o revision externa.',
      guardrails: annualGuardrails(),
    };
  }
}

function folder(
  key: string,
  label: string,
  evidenceCount: number,
  owner: EcuadorTaxAuditReadinessBinderView['folders'][number]['owner'],
): EcuadorTaxAuditReadinessBinderView['folders'][number] {
  return {
    key,
    label,
    status: evidenceCount > 0 ? 'needs_review' : 'blocked',
    evidenceCount,
    owner,
  };
}
