import { TenantAccountingBankStatementImportProfileWorkspaceView } from '@saas-platform/accounting-domain';
import { GetTenantAccountingBankAccountRegistryWorkspaceUseCase } from './get-tenant-accounting-bank-account-registry-workspace.use-case';
import { GetTenantAccountingBankStatementImportWorkspaceUseCase } from './get-tenant-accounting-bank-statement-import-workspace.use-case';
import { ListTenantAccountingBankStatementRegistryUseCase } from './list-tenant-accounting-bank-statement-registry.use-case';

export class GetTenantAccountingBankStatementImportProfileWorkspaceUseCase {
  constructor(
    private readonly getTenantAccountingBankAccountRegistryWorkspaceUseCase: GetTenantAccountingBankAccountRegistryWorkspaceUseCase,
    private readonly getTenantAccountingBankStatementImportWorkspaceUseCase: GetTenantAccountingBankStatementImportWorkspaceUseCase,
    private readonly listTenantAccountingBankStatementRegistryUseCase: ListTenantAccountingBankStatementRegistryUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
  }): Promise<TenantAccountingBankStatementImportProfileWorkspaceView> {
    const [bankAccounts, statementRegistry] = await Promise.all([
      this.getTenantAccountingBankAccountRegistryWorkspaceUseCase.execute(input),
      this.listTenantAccountingBankStatementRegistryUseCase.execute(input),
    ]);
    const primaryAccount = bankAccounts.accounts[0] ?? null;
    const sampleLines = primaryAccount
      ? [
          {
            accountCode: primaryAccount.accountCode,
            accountName: primaryAccount.accountName,
            postedAt: `${input.period}-28T12:00:00.000Z`,
            description: `Preview ${primaryAccount.alias}`,
            direction:
              primaryAccount.ledgerBalanceInCents >= 0
                ? ('inflow' as const)
                : ('outflow' as const),
            amountInCents: Math.max(
              Math.abs(primaryAccount.ledgerBalanceInCents),
              100,
            ),
            currency: primaryAccount.currency,
            reference: `profile-preview-${input.period}-${primaryAccount.accountCode}`,
            externalLineId: `profile:${input.period}:${primaryAccount.accountCode}`,
          },
        ]
      : [];
    const preview =
      await this.getTenantAccountingBankStatementImportWorkspaceUseCase.execute({
        ...input,
        source: 'csv',
        originalFileName: `bank-statement-profile-${input.period}.csv`,
        lines: sampleLines,
      });
    const profiles: TenantAccountingBankStatementImportProfileWorkspaceView['profiles'] =
      [
        {
          profileKey: 'manual-standard',
          label: 'Manual standard',
          source: 'manual',
          delimiter: null,
          dateFormat: 'ISO-8601',
          columnMapping: {
            postedAt: 'postedAt',
            description: 'description',
            direction: 'direction',
            amountInCents: 'amountInCents',
            reference: 'reference',
            externalLineId: 'externalLineId',
          },
          validationStatus: 'ready',
          duplicatePolicy: 'external_line_id',
          notes: ['Perfil base para carga manual revisada.'],
        },
        {
          profileKey: 'csv-bank-standard',
          label: 'CSV bank standard',
          source: 'csv',
          delimiter: ',',
          dateFormat: 'YYYY-MM-DD',
          columnMapping: {
            postedAt: 'fecha',
            description: 'descripcion',
            amountInCents: 'monto',
            reference: 'referencia',
            externalLineId: 'id_movimiento',
          },
          validationStatus:
            bankAccounts.registryStatus === 'blocked' ? 'blocked' : 'ready',
          duplicatePolicy: 'reference_amount_date',
          notes: ['Perfil sugerido para extractos CSV descargados por humano.'],
        },
      ];
    const duplicateCandidateCount = statementRegistry.lines.filter(
      (line, index, lines) =>
        lines.findIndex(
          (candidate) =>
            candidate.externalLineId === line.externalLineId ||
            (candidate.reference === line.reference &&
              candidate.amountInCents === line.amountInCents &&
              candidate.postedAt.toISOString() === line.postedAt.toISOString()),
        ) !== index,
    ).length;
    const blockers = [
      ...bankAccounts.blockers,
      ...(preview.importStatus === 'blocked'
        ? ['accounting.bank_import_profiles.preview_blocked']
        : []),
    ];
    const profileStatus =
      blockers.length > 0
        ? 'blocked'
        : profiles.some((profile) => profile.validationStatus === 'needs_review')
          ? 'needs_review'
          : 'ready';

    return {
      tenantSlug: input.tenantSlug,
      period: input.period,
      year: input.year,
      generatedAt: this.nowProvider(),
      profileStatus,
      profiles,
      recommendedProfileKey:
        profileStatus === 'blocked' ? null : 'csv-bank-standard',
      preview,
      summary: {
        profileCount: profiles.length,
        readyProfileCount: profiles.filter(
          (profile) => profile.validationStatus === 'ready',
        ).length,
        blockedProfileCount: profiles.filter(
          (profile) => profile.validationStatus === 'blocked',
        ).length,
        previewLineCount: preview.summary.lineCount,
        duplicateCandidateCount,
      },
      blockers: [...new Set(blockers)],
      nextStep:
        profileStatus === 'ready'
          ? 'Usar perfil recomendado para cargar extractos bancarios.'
          : 'Confirmar cuentas bancarias y mapping de columnas antes de importar.',
      guardrails: [
        'Perfiles operacionales; no conectan bancos ni descargan archivos.',
        'Deduplicacion sugerida requiere revision humana antes de cierre.',
        'No certifica origen ni integridad de extractos externos.',
      ],
    };
  }
}
