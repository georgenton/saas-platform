import {
  EcuadorTaxComplianceEventType,
  EcuadorTaxComplianceEventView,
} from '@saas-platform/tax-compliance-domain';
import {
  TenantNotFoundError,
  TenantRepository,
} from '@saas-platform/tenancy-application';
import { TaxComplianceEventIdGenerator } from '../ports/id-generators';
import { TaxComplianceEventRepository } from '../ports/tax-compliance-event.repository';

export class RecordTenantEcuadorTaxComplianceEventUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly taxComplianceEventRepository: TaxComplianceEventRepository,
    private readonly eventIdGenerator: TaxComplianceEventIdGenerator,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
    eventType: EcuadorTaxComplianceEventType;
    source: string;
    payload: Record<string, unknown>;
  }): Promise<EcuadorTaxComplianceEventView> {
    const tenant = await this.tenantRepository.findBySlug(input.tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(input.tenantSlug);
    }

    return this.taxComplianceEventRepository.record({
      id: this.eventIdGenerator.generate(),
      tenantId: tenant.id,
      tenantSlug: tenant.slug,
      period: input.period,
      year: input.year,
      eventType: input.eventType,
      source: input.source,
      payload: input.payload,
      occurredAt: this.nowProvider(),
    });
  }
}
