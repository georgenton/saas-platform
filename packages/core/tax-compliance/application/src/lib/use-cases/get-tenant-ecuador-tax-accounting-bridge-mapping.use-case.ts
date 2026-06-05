import {
  EcuadorTaxAccountingBridgeMappingView,
  EcuadorTaxReadinessStatus,
} from '@saas-platform/tax-compliance-domain';
import { ListTenantEcuadorTaxComplianceEventsUseCase } from './list-tenant-ecuador-tax-compliance-events.use-case';
import { RequestTenantEcuadorTaxAccountingBridgePreviewUseCase } from './request-tenant-ecuador-tax-accounting-bridge-preview.use-case';

export class GetTenantEcuadorTaxAccountingBridgeMappingUseCase {
  constructor(
    private readonly requestTenantEcuadorTaxAccountingBridgePreviewUseCase: RequestTenantEcuadorTaxAccountingBridgePreviewUseCase,
    private readonly listTenantEcuadorTaxComplianceEventsUseCase: ListTenantEcuadorTaxComplianceEventsUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
  }): Promise<EcuadorTaxAccountingBridgeMappingView> {
    const [preview, events] = await Promise.all([
      this.requestTenantEcuadorTaxAccountingBridgePreviewUseCase.execute({
        ...input,
        recordEvent: false,
      }),
      this.listTenantEcuadorTaxComplianceEventsUseCase.execute({
        tenantSlug: input.tenantSlug,
        period: input.period,
        limit: 100,
      }),
    ]);
    const latestMapping = events.find(
      (event) => event.eventType === 'tax_accounting_bridge_mapping_upserted',
    );
    const mappings = readMappings(latestMapping?.payload.mappings);
    const hints = Array.from(
      preview.entries.reduce((counts, entry) => {
        if (!entry.accountHint) {
          return counts;
        }

        counts.set(entry.accountHint, (counts.get(entry.accountHint) ?? 0) + 1);
        return counts;
      }, new Map<string, number>()),
    ).sort(([left], [right]) => left.localeCompare(right));
    const rows = hints.map(([accountHint, previewEntryCount]) => {
      const mapping = mappings.get(accountHint) ?? null;

      return {
        accountHint,
        suggestedAccountCode: mapping?.suggestedAccountCode ?? null,
        suggestedAccountName: mapping?.suggestedAccountName ?? null,
        mapped: Boolean(mapping?.suggestedAccountCode),
        previewEntryCount,
        updatedByUserId: mapping?.updatedByUserId ?? null,
        updatedByEmail: mapping?.updatedByEmail ?? null,
        updatedAt: latestMapping?.occurredAt ?? null,
      };
    });
    const unmappedHintCount = rows.filter((row) => !row.mapped).length;
    const readinessStatus: EcuadorTaxReadinessStatus =
      rows.length === 0
        ? 'blocked'
        : unmappedHintCount > 0
          ? 'needs_review'
          : 'ready';

    return {
      tenantSlug: input.tenantSlug,
      period: input.period,
      year: input.year,
      generatedAt: this.nowProvider(),
      readinessStatus,
      rows,
      summary: {
        hintCount: rows.length,
        mappedHintCount: rows.length - unmappedHintCount,
        unmappedHintCount,
        previewEntryCount: preview.entries.length,
      },
      blockers: rows.length === 0 ? ['accounting_bridge.no_hints'] : [],
      nextStep:
        readinessStatus === 'ready'
          ? 'Hints tributarios mapeados; usar como senal para futuro producto Accounting.'
          : 'Mapear account hints contra un plan de cuentas antes de generar asientos en un producto contable.',
      guardrails: [
        'Mapping no crea asientos contables ni modifica libros.',
        'Plan de cuentas formal, diarios y balances pertenecen al producto Accounting futuro.',
      ],
    };
  }
}

function readMappings(value: unknown): Map<
  string,
  {
    suggestedAccountCode: string | null;
    suggestedAccountName: string | null;
    updatedByUserId: string | null;
    updatedByEmail: string | null;
  }
> {
  if (!Array.isArray(value)) {
    return new Map();
  }

  return new Map(
    value
      .map((entry) => {
        if (!entry || typeof entry !== 'object') {
          return null;
        }

        const record = entry as Record<string, unknown>;
        const accountHint = readString(record.accountHint);

        if (!accountHint) {
          return null;
        }

        return [
          accountHint,
          {
            suggestedAccountCode: readString(record.suggestedAccountCode),
            suggestedAccountName: readString(record.suggestedAccountName),
            updatedByUserId: readString(record.updatedByUserId),
            updatedByEmail: readString(record.updatedByEmail),
          },
        ] as const;
      })
      .filter((entry): entry is readonly [string, {
        suggestedAccountCode: string | null;
        suggestedAccountName: string | null;
        updatedByUserId: string | null;
        updatedByEmail: string | null;
      }] => entry !== null),
  );
}

function readString(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}
