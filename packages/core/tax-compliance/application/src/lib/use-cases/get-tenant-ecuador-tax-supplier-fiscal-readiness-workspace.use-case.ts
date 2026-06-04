import { GetTenantPartyFiscalReadinessSummaryUseCase } from '@saas-platform/parties-application';
import {
  EcuadorTaxReadinessStatus,
  EcuadorTaxSupplierFiscalReadinessWorkspaceView,
} from '@saas-platform/tax-compliance-domain';
import {
  TenantNotFoundError,
  TenantRepository,
} from '@saas-platform/tenancy-application';
import { TaxCompliancePurchaseExpenseEvidenceRepository } from '../ports/tax-compliance-purchase-expense-evidence.repository';
import { RecordTenantEcuadorTaxComplianceEventUseCase } from './record-tenant-ecuador-tax-compliance-event.use-case';

export class GetTenantEcuadorTaxSupplierFiscalReadinessWorkspaceUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly purchaseExpenseEvidenceRepository: TaxCompliancePurchaseExpenseEvidenceRepository,
    private readonly getTenantPartyFiscalReadinessSummaryUseCase: GetTenantPartyFiscalReadinessSummaryUseCase,
    private readonly recordTenantEcuadorTaxComplianceEventUseCase: RecordTenantEcuadorTaxComplianceEventUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
    recordEvent?: boolean;
  }): Promise<EcuadorTaxSupplierFiscalReadinessWorkspaceView> {
    const tenant = await this.tenantRepository.findBySlug(input.tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(input.tenantSlug);
    }

    const [partySummary, evidenceRows] = await Promise.all([
      this.getTenantPartyFiscalReadinessSummaryUseCase.execute(tenant.slug),
      this.purchaseExpenseEvidenceRepository.listByTenantAndPeriod({
        tenantId: tenant.id,
        tenantSlug: tenant.slug,
        period: input.period,
      }),
    ]);
    const supplierParties = partySummary.incompleteParties.filter((party) =>
      party.roles.includes('supplier'),
    );
    const evidenceSupplierRows = Array.from(
      evidenceRows.reduce((rows, evidence) => {
        const supplierKey =
          evidence.supplierPartyId ??
          evidence.supplierTaxpayerId ??
          evidence.supplierName;
        const current = rows.get(supplierKey) ?? {
          supplierKey,
          supplierPartyId: evidence.supplierPartyId,
          supplierName: evidence.supplierName,
          supplierTaxpayerId: evidence.supplierTaxpayerId,
          source: 'purchase_expense_evidence' as const,
          purchaseEvidenceCount: 0,
          missingFields: [] as string[],
          readinessStatus: 'ready' as EcuadorTaxReadinessStatus,
          blockers: [] as string[],
        };
        current.purchaseEvidenceCount += 1;
        if (!evidence.supplierTaxpayerId) {
          current.missingFields = [
            ...new Set([...current.missingFields, 'supplier_taxpayer_id']),
          ];
          current.blockers = [
            ...new Set([...current.blockers, 'supplier.taxpayer_id_missing']),
          ];
          current.readinessStatus = 'blocked';
        }
        rows.set(supplierKey, current);
        return rows;
      }, new Map<string, EcuadorTaxSupplierFiscalReadinessWorkspaceView['supplierRows'][number]>()),
      ([, row]) => row,
    );
    const partyRows = supplierParties.map((party) => ({
      supplierKey: party.id,
      supplierPartyId: party.id,
      supplierName: party.displayName,
      supplierTaxpayerId: party.taxpayerId,
      source: 'parties' as const,
      purchaseEvidenceCount: evidenceRows.filter(
        (evidence) => evidence.supplierPartyId === party.id,
      ).length,
      missingFields: [...party.missingFields],
      readinessStatus: 'blocked' as EcuadorTaxReadinessStatus,
      blockers: party.missingFields.map(
        (field) => `supplier.${party.id}.${field}`,
      ),
    }));
    const supplierRows = [...partyRows, ...evidenceSupplierRows];
    const blockers = [...new Set(supplierRows.flatMap((row) => row.blockers))];
    const readinessStatus =
      blockers.length > 0
        ? 'blocked'
        : supplierRows.some((row) => row.readinessStatus === 'needs_review')
          ? 'needs_review'
          : 'ready';
    const view: EcuadorTaxSupplierFiscalReadinessWorkspaceView = {
      tenantSlug: tenant.slug,
      period: input.period,
      year: input.year,
      generatedAt: this.nowProvider(),
      readinessStatus,
      summary: {
        supplierCount: supplierRows.length,
        completeSupplierCount: supplierRows.filter(
          (row) => row.readinessStatus === 'ready',
        ).length,
        needsReviewSupplierCount: supplierRows.filter(
          (row) => row.readinessStatus !== 'ready',
        ).length,
        purchaseEvidenceSupplierCount: evidenceSupplierRows.length,
      },
      supplierRows,
      blockers,
      nextStep:
        readinessStatus === 'blocked'
          ? 'Completar datos fiscales de proveedores antes de usar compras para IVA o renta.'
          : 'Mantener proveedores completos antes de preparar retenciones o credito tributario.',
      guardrails: [
        'Este workspace prepara saneamiento fiscal de proveedores; no valida RUC contra SRI.',
        'La clasificacion final de proveedor y retenciones debe revisarla un responsable tributario.',
      ],
    };

    if (input.recordEvent ?? true) {
      await this.recordTenantEcuadorTaxComplianceEventUseCase.execute({
        tenantSlug: tenant.slug,
        period: input.period,
        year: input.year,
        eventType: 'supplier_fiscal_readiness_reviewed',
        source: 'supplier_fiscal_readiness_workspace',
        payload: {
          readinessStatus,
          supplierCount: view.summary.supplierCount,
          blockerCount: blockers.length,
        },
      });
    }

    return view;
  }
}
