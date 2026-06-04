import { EcuadorTaxOperationalCloseoutView } from '@saas-platform/tax-compliance-domain';
import {
  GetTenantEcuadorTaxOperationalCloseoutUseCase,
  readCloseoutStatus,
} from './get-tenant-ecuador-tax-operational-closeout.use-case';
import { RecordTenantEcuadorTaxComplianceEventUseCase } from './record-tenant-ecuador-tax-compliance-event.use-case';

export class TransitionTenantEcuadorTaxOperationalCloseoutUseCase {
  constructor(
    private readonly getTenantEcuadorTaxOperationalCloseoutUseCase: GetTenantEcuadorTaxOperationalCloseoutUseCase,
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
  }): Promise<EcuadorTaxOperationalCloseoutView> {
    const status = readCloseoutStatus(input.status);

    await this.recordTenantEcuadorTaxComplianceEventUseCase.execute({
      tenantSlug: input.tenantSlug,
      period: input.period,
      year: input.year,
      eventType: 'period_operational_closeout_transitioned',
      source: 'period_operational_closeout',
      payload: {
        status,
        transitionedByUserId: normalizeOptional(input.transitionedByUserId),
        transitionedByEmail: normalizeOptional(input.transitionedByEmail),
        note: normalizeOptional(input.note),
      },
    });

    return this.getTenantEcuadorTaxOperationalCloseoutUseCase.execute(input);
  }
}

function normalizeOptional(value?: string | null): string | null {
  const normalized = value?.trim();

  return normalized ? normalized : null;
}
