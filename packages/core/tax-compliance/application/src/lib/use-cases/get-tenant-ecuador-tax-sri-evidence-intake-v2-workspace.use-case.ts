import {
  EcuadorTaxReadinessStatus,
  EcuadorTaxSriEvidenceIntakeV2WorkspaceView,
} from '@saas-platform/tax-compliance-domain';
import { GetTenantEcuadorTaxDeclarationSourceLedgerUseCase } from './get-tenant-ecuador-tax-declaration-source-ledger.use-case';
import { GetTenantEcuadorTaxSriFiscalEvidenceWorkspaceUseCase } from './get-tenant-ecuador-tax-sri-fiscal-evidence-workspace.use-case';
import { RecordTenantEcuadorTaxComplianceEventUseCase } from './record-tenant-ecuador-tax-compliance-event.use-case';

export class GetTenantEcuadorTaxSriEvidenceIntakeV2WorkspaceUseCase {
  constructor(
    private readonly getTenantEcuadorTaxSriFiscalEvidenceWorkspaceUseCase: GetTenantEcuadorTaxSriFiscalEvidenceWorkspaceUseCase,
    private readonly getTenantEcuadorTaxDeclarationSourceLedgerUseCase: GetTenantEcuadorTaxDeclarationSourceLedgerUseCase,
    private readonly recordTenantEcuadorTaxComplianceEventUseCase: RecordTenantEcuadorTaxComplianceEventUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
    recordEvent?: boolean;
  }): Promise<EcuadorTaxSriEvidenceIntakeV2WorkspaceView> {
    const [workspace, sourceLedger] = await Promise.all([
      this.getTenantEcuadorTaxSriFiscalEvidenceWorkspaceUseCase.execute({
        ...input,
        recordEvent: false,
      }),
      this.getTenantEcuadorTaxDeclarationSourceLedgerUseCase.execute(input),
    ]);
    const intakeChannels = [
      {
        key: 'sri_report' as const,
        label: 'Reporte SRI',
        acceptedFormats: ['csv', 'xlsx', 'json-normalized'],
      },
      {
        key: 'sri_xml' as const,
        label: 'XML autorizados',
        acceptedFormats: ['xml', 'zip'],
      },
      {
        key: 'manual_summary' as const,
        label: 'Resumen manual',
        acceptedFormats: ['json-normalized', 'manual-entry'],
      },
    ].map((channel) => {
      const voucherCount = workspace.voucherRows.filter(
        (voucher) => voucher.source === channel.key,
      ).length;
      return {
        ...channel,
        voucherCount,
        readinessStatus: resolveChannelStatus(voucherCount, workspace.readinessStatus),
        nextStep:
          voucherCount === 0
            ? 'Importar evidencia aportada por contribuyente o contador.'
            : 'Revisar deduplicacion y usar como fuente para ledger fiscal.',
      };
    });
    const ledgerSriRows = sourceLedger.sourceRows.filter(
      (row) => row.source === 'sri_import',
    ).length;
    const blockers = [
      ...workspace.blockers,
      ledgerSriRows === 0 ? 'source_ledger.sri_rows_missing' : null,
    ].filter((blocker): blocker is string => blocker !== null);
    const readinessStatus = resolveReadinessStatus(
      workspace.readinessStatus,
      blockers,
    );
    const view: EcuadorTaxSriEvidenceIntakeV2WorkspaceView = {
      tenantSlug: input.tenantSlug,
      period: input.period,
      year: input.year,
      generatedAt: this.nowProvider(),
      readinessStatus,
      workspace,
      sourceLedger,
      intakeChannels,
      deduplication: {
        duplicateAccessKeys: workspace.summary.duplicateAccessKeys,
        ledgerSriRows,
        blockedVoucherCount: workspace.summary.blockedVouchers,
        needsReviewVoucherCount: workspace.summary.needsReviewVouchers,
      },
      blockers,
      nextStep:
        readinessStatus === 'blocked'
          ? 'Resolver duplicados, campos faltantes o ausencia de filas SRI en el ledger.'
          : 'Usar intake SRI 2.0 como fuente primaria para IVA, renta, anexos y certificacion.',
      guardrails: [
        'El usuario o contador descarga la informacion desde SRI; la plataforma no maneja credenciales.',
        'No se automatiza captcha, firma, presentacion ni pago de declaraciones.',
      ],
    };

    if (input.recordEvent ?? true) {
      await this.recordTenantEcuadorTaxComplianceEventUseCase.execute({
        tenantSlug: input.tenantSlug,
        period: input.period,
        year: input.year,
        eventType: 'sri_evidence_intake_v2_reviewed',
        source: 'sri_evidence_intake_v2',
        payload: {
          readinessStatus,
          deduplication: view.deduplication,
          blockerCount: blockers.length,
        },
      });
    }

    return view;
  }
}

function resolveChannelStatus(
  voucherCount: number,
  workspaceStatus: EcuadorTaxReadinessStatus,
): EcuadorTaxReadinessStatus {
  if (voucherCount === 0) {
    return 'needs_review';
  }

  return workspaceStatus === 'blocked' ? 'needs_review' : workspaceStatus;
}

function resolveReadinessStatus(
  workspaceStatus: EcuadorTaxReadinessStatus,
  blockers: string[],
): EcuadorTaxReadinessStatus {
  if (blockers.length > 0 || workspaceStatus === 'blocked') {
    return 'blocked';
  }

  return workspaceStatus === 'needs_review' ? 'needs_review' : 'ready';
}
