import { EcuadorTaxAccountingBridgeMappingView } from '@saas-platform/tax-compliance-domain';
import { GetTenantEcuadorTaxAccountingBridgeMappingUseCase } from './get-tenant-ecuador-tax-accounting-bridge-mapping.use-case';
import { RecordTenantEcuadorTaxComplianceEventUseCase } from './record-tenant-ecuador-tax-compliance-event.use-case';

export class UpsertTenantEcuadorTaxAccountingBridgeMappingUseCase {
  constructor(
    private readonly getTenantEcuadorTaxAccountingBridgeMappingUseCase: GetTenantEcuadorTaxAccountingBridgeMappingUseCase,
    private readonly recordTenantEcuadorTaxComplianceEventUseCase: RecordTenantEcuadorTaxComplianceEventUseCase,
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
    mappings: Array<{
      accountHint: string;
      suggestedAccountCode?: string | null;
      suggestedAccountName?: string | null;
    }>;
    updatedByUserId?: string | null;
    updatedByEmail?: string | null;
  }): Promise<EcuadorTaxAccountingBridgeMappingView> {
    const mappings = input.mappings
      .map((mapping) => ({
        accountHint: normalize(mapping.accountHint),
        suggestedAccountCode: normalize(mapping.suggestedAccountCode),
        suggestedAccountName: normalize(mapping.suggestedAccountName),
        updatedByUserId: normalize(input.updatedByUserId),
        updatedByEmail: normalize(input.updatedByEmail),
      }))
      .filter((mapping) => mapping.accountHint);

    await this.recordTenantEcuadorTaxComplianceEventUseCase.execute({
      tenantSlug: input.tenantSlug,
      period: input.period,
      year: input.year,
      eventType: 'tax_accounting_bridge_mapping_upserted',
      source: 'tax_accounting_bridge_mapping',
      payload: {
        mappings,
        mappedHintCount: mappings.filter((mapping) => mapping.suggestedAccountCode)
          .length,
      },
    });

    return this.getTenantEcuadorTaxAccountingBridgeMappingUseCase.execute(input);
  }
}

function normalize(value?: string | null): string | null {
  const normalized = value?.trim();

  return normalized ? normalized : null;
}
