import { EcuadorTaxVatDeclarationApprovalView } from '@saas-platform/tax-compliance-domain';
import {
  GetTenantEcuadorTaxVatDeclarationApprovalUseCase,
  readVatApprovalStatus,
} from './get-tenant-ecuador-tax-vat-declaration-approval.use-case';
import { RecordTenantEcuadorTaxComplianceEventUseCase } from './record-tenant-ecuador-tax-compliance-event.use-case';

export class TransitionTenantEcuadorTaxVatDeclarationApprovalUseCase {
  constructor(
    private readonly getTenantEcuadorTaxVatDeclarationApprovalUseCase: GetTenantEcuadorTaxVatDeclarationApprovalUseCase,
    private readonly recordTenantEcuadorTaxComplianceEventUseCase: RecordTenantEcuadorTaxComplianceEventUseCase,
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
    status: string;
    transitionedByUserId?: string | null;
    transitionedByEmail?: string | null;
    note?: string | null;
  }): Promise<EcuadorTaxVatDeclarationApprovalView> {
    const status = readVatApprovalStatus(input.status);

    await this.recordTenantEcuadorTaxComplianceEventUseCase.execute({
      tenantSlug: input.tenantSlug,
      period: input.period,
      year: input.year,
      eventType: 'vat_declaration_approval_transitioned',
      source: 'vat_declaration_approval',
      payload: {
        status,
        transitionedByUserId: normalizeOptional(input.transitionedByUserId),
        transitionedByEmail: normalizeOptional(input.transitionedByEmail),
        note: normalizeOptional(input.note),
      },
    });

    return this.getTenantEcuadorTaxVatDeclarationApprovalUseCase.execute(input);
  }
}

function normalizeOptional(value?: string | null): string | null {
  const normalized = value?.trim();

  return normalized ? normalized : null;
}
