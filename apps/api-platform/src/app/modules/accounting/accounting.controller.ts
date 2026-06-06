import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ACCOUNTING_PERMISSIONS,
  AccountingAccountantReviewNotFoundError,
  CreateTenantAccountingAdjustingJournalEntryUseCase,
  CreateTenantAccountingJournalEntriesFromApprovalUseCase,
  GetTenantAccountingAccountantHandoffWorkspaceUseCase,
  GetTenantAccountingAuditTrailWorkspaceUseCase,
  GetTenantAccountingBankReconciliationWorkspaceUseCase,
  GetTenantAccountingBankStatementImportWorkspaceUseCase,
  GetTenantAccountingChartOfAccountsWorkspaceUseCase,
  GetTenantAccountingCloseoutCertificationReadinessUseCase,
  GetTenantAccountingFinancialStatementPreviewUseCase,
  GetTenantAccountingIntakeWorkspaceUseCase,
  GetTenantAccountingJournalDraftPreviewUseCase,
  GetTenantAccountingLedgerRegistryWorkspaceUseCase,
  GetTenantAccountingLedgerPreviewWorkspaceUseCase,
  GetTenantAccountingPeriodCashCloseoutReadinessUseCase,
  GetTenantAccountingPeriodCloseoutReportUseCase,
  GetTenantAccountingPeriodCloseoutReadinessUseCase,
  GetTenantAccountingPeriodEvidenceVaultUseCase,
  GetTenantAccountingPeriodLockReadinessUseCase,
  GetTenantAccountingPeriodReconciliationReadinessUseCase,
  GetTenantAccountingTrialBalanceWorkspaceUseCase,
  ListTenantAccountingBankReconciliationControlRegistryUseCase,
  ListTenantAccountingBankStatementRegistryUseCase,
  ListTenantAccountingAccountantReviewsUseCase,
  ListTenantAccountingJournalRegistryUseCase,
  ListTenantAccountingPeriodLockRegistryUseCase,
  LockTenantAccountingPeriodUseCase,
  ManageTenantAccountingChartMappingUseCase,
  RequestTenantAccountingJournalDraftApprovalPacketUseCase,
  RequestTenantAccountingAccountantReviewUseCase,
  RequestTenantAccountingFinancialStatementReviewPacketUseCase,
  RequestTenantAccountingPeriodCloseoutPacketUseCase,
  RequestTenantAccountingPeriodReopenPacketUseCase,
  RecordTenantAccountingBankReconciliationControlUseCase,
  RecordTenantAccountingBankStatementImportUseCase,
  RequestTenantAccountingReconciliationExceptionPacketUseCase,
  RequestTenantAccountingReconciliationExceptionResolutionPacketUseCase,
  RequestTenantAccountingReconciliationMatchPacketUseCase,
  RequestTenantAccountingReviewResolutionPacketUseCase,
  TransitionTenantAccountingAccountantReviewUseCase,
} from '@saas-platform/accounting-application';
import { TenantNotFoundError } from '@saas-platform/tenancy-application';
import { JwtAuthenticationGuard } from '../auth/jwt-authentication.guard';
import { RequireTenantPermission } from '../tenancy/require-tenant-permission.decorator';
import { RequireTenantProductAccess } from '../tenancy/require-tenant-product-access.decorator';
import { TenantMembershipGuard } from '../tenancy/tenant-membership.guard';
import { TenantPermissionGuard } from '../tenancy/tenant-permission.guard';
import { TenantProductAccessGuard } from '../tenancy/tenant-product-access.guard';
import {
  AccountingAccountantReviewResponseDto,
  AccountingCloseoutCertificationReadinessResponseDto,
  AccountingReviewResolutionPacketResponseDto,
  RequestAccountingAccountantReviewRequestDto,
  RequestAccountingReviewResolutionPacketRequestDto,
  toAccountingAccountantReviewResponseDto,
  toAccountingCloseoutCertificationReadinessResponseDto,
  toAccountingReviewResolutionPacketResponseDto,
  TransitionAccountingAccountantReviewRequestDto,
} from './dto/accounting-accountant-review.response';
import {
  AccountingAuditTrailWorkspaceResponseDto,
  toAccountingAuditTrailWorkspaceResponseDto,
} from './dto/accounting-audit-trail-workspace.response';
import {
  AccountingAdjustingJournalEntryCreationResultResponseDto,
  CreateAccountingAdjustingJournalEntryRequestDto,
  toAccountingAdjustingJournalEntryCreationResultResponseDto,
} from './dto/accounting-adjusting-journal-entry.response';
import {
  AccountingPeriodLockRegistryResponseDto,
  AccountingPeriodLockResultResponseDto,
  AccountingPeriodReopenPacketResponseDto,
  LockAccountingPeriodRequestDto,
  RequestAccountingPeriodReopenPacketRequestDto,
  toAccountingPeriodLockRegistryResponseDto,
  toAccountingPeriodLockResultResponseDto,
  toAccountingPeriodReopenPacketResponseDto,
} from './dto/accounting-period-control.response';
import {
  AccountingBankReconciliationWorkspaceResponseDto,
  AccountingBankReconciliationControlRegistryResponseDto,
  AccountingBankReconciliationControlResponseDto,
  AccountingBankStatementImportPreviewRequestDto,
  AccountingBankStatementImportResultResponseDto,
  AccountingBankStatementImportWorkspaceResponseDto,
  AccountingBankStatementRegistryResponseDto,
  AccountingPeriodCashCloseoutReadinessResponseDto,
  AccountingPeriodReconciliationReadinessResponseDto,
  AccountingReconciliationExceptionPacketResponseDto,
  AccountingReconciliationExceptionResolutionPacketResponseDto,
  AccountingReconciliationMatchPacketResponseDto,
  RecordAccountingBankReconciliationControlRequestDto,
  RecordAccountingBankStatementImportRequestDto,
  RequestAccountingReconciliationExceptionResolutionPacketRequestDto,
  RequestAccountingReconciliationMatchPacketRequestDto,
  toAccountingBankReconciliationControlRegistryResponseDto,
  toAccountingBankReconciliationControlResponseDto,
  toAccountingBankStatementImportResultResponseDto,
  toAccountingBankStatementImportWorkspaceResponseDto,
  toAccountingBankStatementRegistryResponseDto,
  toAccountingBankReconciliationWorkspaceResponseDto,
  toAccountingPeriodCashCloseoutReadinessResponseDto,
  toAccountingPeriodReconciliationReadinessResponseDto,
  toAccountingReconciliationExceptionPacketResponseDto,
  toAccountingReconciliationExceptionResolutionPacketResponseDto,
  toAccountingReconciliationMatchPacketResponseDto,
} from './dto/accounting-bank-reconciliation.response';
import {
  AccountingChartMappingManagementResponseDto,
  ManageAccountingChartMappingRequestDto,
  toAccountingChartMappingManagementResponseDto,
} from './dto/accounting-chart-mapping-management.response';
import {
  AccountingFinancialStatementPreviewResponseDto,
  toAccountingFinancialStatementPreviewResponseDto,
} from './dto/accounting-financial-statement-preview.response';
import {
  AccountingChartOfAccountsWorkspaceResponseDto,
  toAccountingChartOfAccountsWorkspaceResponseDto,
} from './dto/accounting-chart-of-accounts-workspace.response';
import {
  AccountingPeriodLockReadinessResponseDto,
  toAccountingPeriodLockReadinessResponseDto,
} from './dto/accounting-period-lock-readiness.response';
import {
  AccountingIntakeWorkspaceResponseDto,
  toAccountingIntakeWorkspaceResponseDto,
} from './dto/accounting-intake-workspace.response';
import {
  AccountingJournalDraftApprovalPacketResponseDto,
  RequestAccountingJournalDraftApprovalPacketRequestDto,
  toAccountingJournalDraftApprovalPacketResponseDto,
} from './dto/accounting-journal-draft-approval-packet.response';
import {
  AccountingJournalDraftPreviewResponseDto,
  toAccountingJournalDraftPreviewResponseDto,
} from './dto/accounting-journal-draft-preview.response';
import {
  AccountingJournalEntryCreationResultResponseDto,
  AccountingJournalRegistryResponseDto,
  CreateAccountingJournalEntriesRequestDto,
  toAccountingJournalEntryCreationResultResponseDto,
  toAccountingJournalRegistryResponseDto,
} from './dto/accounting-journal-registry.response';
import {
  AccountingLedgerRegistryWorkspaceResponseDto,
  toAccountingLedgerRegistryWorkspaceResponseDto,
} from './dto/accounting-ledger-registry-workspace.response';
import {
  AccountingLedgerPreviewWorkspaceResponseDto,
  toAccountingLedgerPreviewWorkspaceResponseDto,
} from './dto/accounting-ledger-preview-workspace.response';
import {
  AccountingPeriodCloseoutPacketResponseDto,
  RequestAccountingPeriodCloseoutPacketRequestDto,
  toAccountingPeriodCloseoutPacketResponseDto,
} from './dto/accounting-period-closeout-packet.response';
import {
  AccountingPeriodCloseoutReportResponseDto,
  toAccountingPeriodCloseoutReportResponseDto,
} from './dto/accounting-period-closeout-report.response';
import {
  AccountingPeriodCloseoutReadinessResponseDto,
  toAccountingPeriodCloseoutReadinessResponseDto,
} from './dto/accounting-period-closeout-readiness.response';
import {
  AccountingAccountantHandoffWorkspaceResponseDto,
  AccountingFinancialStatementReviewPacketResponseDto,
  AccountingPeriodEvidenceVaultResponseDto,
  RequestAccountingFinancialStatementReviewPacketRequestDto,
  toAccountingAccountantHandoffWorkspaceResponseDto,
  toAccountingFinancialStatementReviewPacketResponseDto,
  toAccountingPeriodEvidenceVaultResponseDto,
} from './dto/accounting-review-evidence-handoff.response';
import {
  AccountingTrialBalanceWorkspaceResponseDto,
  toAccountingTrialBalanceWorkspaceResponseDto,
} from './dto/accounting-trial-balance-workspace.response';

@Controller('accounting/tenants')
@UseGuards(
  JwtAuthenticationGuard,
  TenantMembershipGuard,
  TenantProductAccessGuard,
  TenantPermissionGuard,
)
@RequireTenantProductAccess({ productKey: 'accounting' })
export class AccountingController {
  constructor(
    private readonly getTenantAccountingIntakeWorkspaceUseCase: GetTenantAccountingIntakeWorkspaceUseCase,
    private readonly getTenantAccountingChartOfAccountsWorkspaceUseCase: GetTenantAccountingChartOfAccountsWorkspaceUseCase,
    private readonly getTenantAccountingJournalDraftPreviewUseCase: GetTenantAccountingJournalDraftPreviewUseCase,
    private readonly manageTenantAccountingChartMappingUseCase: ManageTenantAccountingChartMappingUseCase,
    private readonly requestTenantAccountingJournalDraftApprovalPacketUseCase: RequestTenantAccountingJournalDraftApprovalPacketUseCase,
    private readonly getTenantAccountingLedgerPreviewWorkspaceUseCase: GetTenantAccountingLedgerPreviewWorkspaceUseCase,
    private readonly createTenantAccountingJournalEntriesFromApprovalUseCase: CreateTenantAccountingJournalEntriesFromApprovalUseCase,
    private readonly listTenantAccountingJournalRegistryUseCase: ListTenantAccountingJournalRegistryUseCase,
    private readonly getTenantAccountingLedgerRegistryWorkspaceUseCase: GetTenantAccountingLedgerRegistryWorkspaceUseCase,
    private readonly getTenantAccountingBankStatementImportWorkspaceUseCase: GetTenantAccountingBankStatementImportWorkspaceUseCase,
    private readonly recordTenantAccountingBankStatementImportUseCase: RecordTenantAccountingBankStatementImportUseCase,
    private readonly listTenantAccountingBankStatementRegistryUseCase: ListTenantAccountingBankStatementRegistryUseCase,
    private readonly getTenantAccountingBankReconciliationWorkspaceUseCase: GetTenantAccountingBankReconciliationWorkspaceUseCase,
    private readonly requestTenantAccountingReconciliationMatchPacketUseCase: RequestTenantAccountingReconciliationMatchPacketUseCase,
    private readonly requestTenantAccountingReconciliationExceptionPacketUseCase: RequestTenantAccountingReconciliationExceptionPacketUseCase,
    private readonly recordTenantAccountingBankReconciliationControlUseCase: RecordTenantAccountingBankReconciliationControlUseCase,
    private readonly listTenantAccountingBankReconciliationControlRegistryUseCase: ListTenantAccountingBankReconciliationControlRegistryUseCase,
    private readonly requestTenantAccountingReconciliationExceptionResolutionPacketUseCase: RequestTenantAccountingReconciliationExceptionResolutionPacketUseCase,
    private readonly getTenantAccountingPeriodCashCloseoutReadinessUseCase: GetTenantAccountingPeriodCashCloseoutReadinessUseCase,
    private readonly getTenantAccountingPeriodReconciliationReadinessUseCase: GetTenantAccountingPeriodReconciliationReadinessUseCase,
    private readonly getTenantAccountingPeriodCloseoutReadinessUseCase: GetTenantAccountingPeriodCloseoutReadinessUseCase,
    private readonly getTenantAccountingTrialBalanceWorkspaceUseCase: GetTenantAccountingTrialBalanceWorkspaceUseCase,
    private readonly requestTenantAccountingPeriodCloseoutPacketUseCase: RequestTenantAccountingPeriodCloseoutPacketUseCase,
    private readonly getTenantAccountingPeriodCloseoutReportUseCase: GetTenantAccountingPeriodCloseoutReportUseCase,
    private readonly getTenantAccountingPeriodLockReadinessUseCase: GetTenantAccountingPeriodLockReadinessUseCase,
    private readonly createTenantAccountingAdjustingJournalEntryUseCase: CreateTenantAccountingAdjustingJournalEntryUseCase,
    private readonly getTenantAccountingFinancialStatementPreviewUseCase: GetTenantAccountingFinancialStatementPreviewUseCase,
    private readonly listTenantAccountingPeriodLockRegistryUseCase: ListTenantAccountingPeriodLockRegistryUseCase,
    private readonly lockTenantAccountingPeriodUseCase: LockTenantAccountingPeriodUseCase,
    private readonly requestTenantAccountingPeriodReopenPacketUseCase: RequestTenantAccountingPeriodReopenPacketUseCase,
    private readonly getTenantAccountingAuditTrailWorkspaceUseCase: GetTenantAccountingAuditTrailWorkspaceUseCase,
    private readonly requestTenantAccountingFinancialStatementReviewPacketUseCase: RequestTenantAccountingFinancialStatementReviewPacketUseCase,
    private readonly getTenantAccountingPeriodEvidenceVaultUseCase: GetTenantAccountingPeriodEvidenceVaultUseCase,
    private readonly getTenantAccountingAccountantHandoffWorkspaceUseCase: GetTenantAccountingAccountantHandoffWorkspaceUseCase,
    private readonly requestTenantAccountingAccountantReviewUseCase: RequestTenantAccountingAccountantReviewUseCase,
    private readonly listTenantAccountingAccountantReviewsUseCase: ListTenantAccountingAccountantReviewsUseCase,
    private readonly transitionTenantAccountingAccountantReviewUseCase: TransitionTenantAccountingAccountantReviewUseCase,
    private readonly requestTenantAccountingReviewResolutionPacketUseCase: RequestTenantAccountingReviewResolutionPacketUseCase,
    private readonly getTenantAccountingCloseoutCertificationReadinessUseCase: GetTenantAccountingCloseoutCertificationReadinessUseCase,
  ) {}

  @Get(':slug/intake-workspace')
  @RequireTenantPermission(ACCOUNTING_PERMISSIONS.READ)
  async getIntakeWorkspace(
    @Param('slug') tenantSlug: string,
    @Query('period') period = '2026-06',
    @Query('year') year = '2026',
  ): Promise<AccountingIntakeWorkspaceResponseDto> {
    try {
      const workspace =
        await this.getTenantAccountingIntakeWorkspaceUseCase.execute({
          tenantSlug,
          period,
          year: Number.parseInt(year, 10),
        });

      return toAccountingIntakeWorkspaceResponseDto(workspace);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Post(':slug/chart-mapping')
  @RequireTenantPermission(ACCOUNTING_PERMISSIONS.MANAGE)
  async manageChartMapping(
    @Param('slug') tenantSlug: string,
    @Body() body: ManageAccountingChartMappingRequestDto,
  ): Promise<AccountingChartMappingManagementResponseDto> {
    try {
      const result =
        await this.manageTenantAccountingChartMappingUseCase.execute({
          tenantSlug,
          period: body.period,
          year: body.year,
          mappings: body.mappings ?? [],
          updatedByUserId: body.updatedByUserId ?? null,
          updatedByEmail: body.updatedByEmail ?? null,
        });

      return toAccountingChartMappingManagementResponseDto(result);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/chart-of-accounts-workspace')
  @RequireTenantPermission(ACCOUNTING_PERMISSIONS.READ)
  async getChartOfAccountsWorkspace(
    @Param('slug') tenantSlug: string,
    @Query('period') period = '2026-06',
    @Query('year') year = '2026',
  ): Promise<AccountingChartOfAccountsWorkspaceResponseDto> {
    try {
      const workspace =
        await this.getTenantAccountingChartOfAccountsWorkspaceUseCase.execute({
          tenantSlug,
          period,
          year: Number.parseInt(year, 10),
        });

      return toAccountingChartOfAccountsWorkspaceResponseDto(workspace);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/journal-draft-preview')
  @RequireTenantPermission(ACCOUNTING_PERMISSIONS.READ)
  async getJournalDraftPreview(
    @Param('slug') tenantSlug: string,
    @Query('period') period = '2026-06',
    @Query('year') year = '2026',
  ): Promise<AccountingJournalDraftPreviewResponseDto> {
    try {
      const preview =
        await this.getTenantAccountingJournalDraftPreviewUseCase.execute({
          tenantSlug,
          period,
          year: Number.parseInt(year, 10),
        });

      return toAccountingJournalDraftPreviewResponseDto(preview);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Post(':slug/journal-draft-approval-packet')
  @RequireTenantPermission(ACCOUNTING_PERMISSIONS.MANAGE)
  async requestJournalDraftApprovalPacket(
    @Param('slug') tenantSlug: string,
    @Body() body: RequestAccountingJournalDraftApprovalPacketRequestDto,
  ): Promise<AccountingJournalDraftApprovalPacketResponseDto> {
    try {
      const packet =
        await this.requestTenantAccountingJournalDraftApprovalPacketUseCase.execute(
          {
            tenantSlug,
            period: body.period,
            year: body.year,
            draftEntryKeys: body.draftEntryKeys,
            decision: body.decision,
            reviewerUserId: body.reviewerUserId ?? null,
            reviewerEmail: body.reviewerEmail ?? null,
            note: body.note ?? null,
          },
        );

      return toAccountingJournalDraftApprovalPacketResponseDto(packet);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/ledger-preview-workspace')
  @RequireTenantPermission(ACCOUNTING_PERMISSIONS.READ)
  async getLedgerPreviewWorkspace(
    @Param('slug') tenantSlug: string,
    @Query('period') period = '2026-06',
    @Query('year') year = '2026',
  ): Promise<AccountingLedgerPreviewWorkspaceResponseDto> {
    try {
      const workspace =
        await this.getTenantAccountingLedgerPreviewWorkspaceUseCase.execute({
          tenantSlug,
          period,
          year: Number.parseInt(year, 10),
        });

      return toAccountingLedgerPreviewWorkspaceResponseDto(workspace);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Post(':slug/journal-entries')
  @RequireTenantPermission(ACCOUNTING_PERMISSIONS.MANAGE)
  async createJournalEntries(
    @Param('slug') tenantSlug: string,
    @Body() body: CreateAccountingJournalEntriesRequestDto,
  ): Promise<AccountingJournalEntryCreationResultResponseDto> {
    try {
      const result =
        await this.createTenantAccountingJournalEntriesFromApprovalUseCase.execute(
          {
            tenantSlug,
            period: body.period,
            year: body.year,
            draftEntryKeys: body.draftEntryKeys,
            reviewerUserId: body.reviewerUserId ?? null,
            reviewerEmail: body.reviewerEmail ?? null,
            note: body.note ?? null,
          },
        );

      return toAccountingJournalEntryCreationResultResponseDto(result);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/journal-registry')
  @RequireTenantPermission(ACCOUNTING_PERMISSIONS.READ)
  async getJournalRegistry(
    @Param('slug') tenantSlug: string,
    @Query('period') period = '2026-06',
    @Query('year') year = '2026',
  ): Promise<AccountingJournalRegistryResponseDto> {
    try {
      const registry =
        await this.listTenantAccountingJournalRegistryUseCase.execute({
          tenantSlug,
          period,
          year: Number.parseInt(year, 10),
        });

      return toAccountingJournalRegistryResponseDto(registry);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/ledger-registry-workspace')
  @RequireTenantPermission(ACCOUNTING_PERMISSIONS.READ)
  async getLedgerRegistryWorkspace(
    @Param('slug') tenantSlug: string,
    @Query('period') period = '2026-06',
    @Query('year') year = '2026',
  ): Promise<AccountingLedgerRegistryWorkspaceResponseDto> {
    try {
      const workspace =
        await this.getTenantAccountingLedgerRegistryWorkspaceUseCase.execute({
          tenantSlug,
          period,
          year: Number.parseInt(year, 10),
        });

      return toAccountingLedgerRegistryWorkspaceResponseDto(workspace);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Post(':slug/bank-statement-import-preview')
  @RequireTenantPermission(ACCOUNTING_PERMISSIONS.MANAGE)
  async previewBankStatementImport(
    @Param('slug') tenantSlug: string,
    @Body() body: AccountingBankStatementImportPreviewRequestDto,
  ): Promise<AccountingBankStatementImportWorkspaceResponseDto> {
    try {
      const workspace =
        await this.getTenantAccountingBankStatementImportWorkspaceUseCase.execute(
          {
            tenantSlug,
            period: body.period,
            year: body.year,
            source: body.source,
            originalFileName: body.originalFileName ?? null,
            lines: body.lines ?? [],
          },
        );

      return toAccountingBankStatementImportWorkspaceResponseDto(workspace);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Post(':slug/bank-statement-import')
  @RequireTenantPermission(ACCOUNTING_PERMISSIONS.MANAGE)
  async recordBankStatementImport(
    @Param('slug') tenantSlug: string,
    @Body() body: RecordAccountingBankStatementImportRequestDto,
  ): Promise<AccountingBankStatementImportResultResponseDto> {
    try {
      const result =
        await this.recordTenantAccountingBankStatementImportUseCase.execute({
          tenantSlug,
          period: body.period,
          year: body.year,
          source: body.source,
          originalFileName: body.originalFileName ?? null,
          importedByUserId: body.importedByUserId ?? null,
          importedByEmail: body.importedByEmail ?? null,
          notes: body.notes ?? null,
          lines: body.lines ?? [],
        });

      return toAccountingBankStatementImportResultResponseDto(result);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/bank-statement-registry')
  @RequireTenantPermission(ACCOUNTING_PERMISSIONS.READ)
  async getBankStatementRegistry(
    @Param('slug') tenantSlug: string,
    @Query('period') period = '2026-06',
    @Query('year') year = '2026',
  ): Promise<AccountingBankStatementRegistryResponseDto> {
    try {
      const registry =
        await this.listTenantAccountingBankStatementRegistryUseCase.execute({
          tenantSlug,
          period,
          year: Number.parseInt(year, 10),
        });

      return toAccountingBankStatementRegistryResponseDto(registry);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/bank-reconciliation-workspace')
  @RequireTenantPermission(ACCOUNTING_PERMISSIONS.READ)
  async getBankReconciliationWorkspace(
    @Param('slug') tenantSlug: string,
    @Query('period') period = '2026-06',
    @Query('year') year = '2026',
  ): Promise<AccountingBankReconciliationWorkspaceResponseDto> {
    try {
      const workspace =
        await this.getTenantAccountingBankReconciliationWorkspaceUseCase.execute(
          {
            tenantSlug,
            period,
            year: Number.parseInt(year, 10),
          },
        );

      return toAccountingBankReconciliationWorkspaceResponseDto(workspace);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Post(':slug/reconciliation-match-packet')
  @RequireTenantPermission(ACCOUNTING_PERMISSIONS.MANAGE)
  async requestReconciliationMatchPacket(
    @Param('slug') tenantSlug: string,
    @Body() body: RequestAccountingReconciliationMatchPacketRequestDto,
  ): Promise<AccountingReconciliationMatchPacketResponseDto> {
    try {
      const packet =
        await this.requestTenantAccountingReconciliationMatchPacketUseCase.execute(
          {
            tenantSlug,
            period: body.period,
            year: body.year,
            candidateKeys: body.candidateKeys ?? [],
            decision: body.decision,
            reviewerUserId: body.reviewerUserId ?? null,
            reviewerEmail: body.reviewerEmail ?? null,
            note: body.note ?? null,
          },
        );

      return toAccountingReconciliationMatchPacketResponseDto(packet);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Post(':slug/reconciliation-exception-packet')
  @RequireTenantPermission(ACCOUNTING_PERMISSIONS.MANAGE)
  async requestReconciliationExceptionPacket(
    @Param('slug') tenantSlug: string,
    @Body() body: { period: string; year: number },
  ): Promise<AccountingReconciliationExceptionPacketResponseDto> {
    try {
      const packet =
        await this.requestTenantAccountingReconciliationExceptionPacketUseCase.execute(
          {
            tenantSlug,
            period: body.period,
            year: body.year,
          },
        );

      return toAccountingReconciliationExceptionPacketResponseDto(packet);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Post(':slug/bank-reconciliation-controls')
  @RequireTenantPermission(ACCOUNTING_PERMISSIONS.MANAGE)
  async recordBankReconciliationControl(
    @Param('slug') tenantSlug: string,
    @Body() body: RecordAccountingBankReconciliationControlRequestDto,
  ): Promise<AccountingBankReconciliationControlResponseDto> {
    try {
      const control =
        await this.recordTenantAccountingBankReconciliationControlUseCase.execute({
          tenantSlug,
          period: body.period,
          year: body.year,
          eventType: body.eventType,
          status: body.status,
          source: body.source,
          actorUserId: body.actorUserId ?? null,
          actorEmail: body.actorEmail ?? null,
          reason: body.reason ?? null,
          evidenceReference: body.evidenceReference ?? null,
          payload: body.payload ?? {},
          blockers: body.blockers ?? [],
          impactChecklist: body.impactChecklist ?? [],
        });

      return toAccountingBankReconciliationControlResponseDto(control);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/bank-reconciliation-control-registry')
  @RequireTenantPermission(ACCOUNTING_PERMISSIONS.READ)
  async getBankReconciliationControlRegistry(
    @Param('slug') tenantSlug: string,
    @Query('period') period = '2026-06',
    @Query('year') year = '2026',
  ): Promise<AccountingBankReconciliationControlRegistryResponseDto> {
    try {
      const registry =
        await this.listTenantAccountingBankReconciliationControlRegistryUseCase.execute(
          {
            tenantSlug,
            period,
            year: Number.parseInt(year, 10),
          },
        );

      return toAccountingBankReconciliationControlRegistryResponseDto(registry);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Post(':slug/reconciliation-exception-resolution-packet')
  @RequireTenantPermission(ACCOUNTING_PERMISSIONS.MANAGE)
  async requestReconciliationExceptionResolutionPacket(
    @Param('slug') tenantSlug: string,
    @Body() body: RequestAccountingReconciliationExceptionResolutionPacketRequestDto,
  ): Promise<AccountingReconciliationExceptionResolutionPacketResponseDto> {
    try {
      const packet =
        await this.requestTenantAccountingReconciliationExceptionResolutionPacketUseCase.execute(
          {
            tenantSlug,
            period: body.period,
            year: body.year,
            decision: body.decision,
            resolutionType: body.resolutionType,
            exceptionKeys: body.exceptionKeys ?? [],
            actorUserId: body.actorUserId ?? null,
            actorEmail: body.actorEmail ?? null,
            reason: body.reason ?? null,
            evidenceReference: body.evidenceReference ?? null,
          },
        );

      return toAccountingReconciliationExceptionResolutionPacketResponseDto(packet);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/period-cash-closeout-readiness')
  @RequireTenantPermission(ACCOUNTING_PERMISSIONS.READ)
  async getPeriodCashCloseoutReadiness(
    @Param('slug') tenantSlug: string,
    @Query('period') period = '2026-06',
    @Query('year') year = '2026',
  ): Promise<AccountingPeriodCashCloseoutReadinessResponseDto> {
    try {
      const readiness =
        await this.getTenantAccountingPeriodCashCloseoutReadinessUseCase.execute(
          {
            tenantSlug,
            period,
            year: Number.parseInt(year, 10),
          },
        );

      return toAccountingPeriodCashCloseoutReadinessResponseDto(readiness);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/period-reconciliation-readiness')
  @RequireTenantPermission(ACCOUNTING_PERMISSIONS.READ)
  async getPeriodReconciliationReadiness(
    @Param('slug') tenantSlug: string,
    @Query('period') period = '2026-06',
    @Query('year') year = '2026',
  ): Promise<AccountingPeriodReconciliationReadinessResponseDto> {
    try {
      const readiness =
        await this.getTenantAccountingPeriodReconciliationReadinessUseCase.execute(
          {
            tenantSlug,
            period,
            year: Number.parseInt(year, 10),
          },
        );

      return toAccountingPeriodReconciliationReadinessResponseDto(readiness);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/period-closeout-readiness')
  @RequireTenantPermission(ACCOUNTING_PERMISSIONS.READ)
  async getPeriodCloseoutReadiness(
    @Param('slug') tenantSlug: string,
    @Query('period') period = '2026-06',
    @Query('year') year = '2026',
  ): Promise<AccountingPeriodCloseoutReadinessResponseDto> {
    try {
      const readiness =
        await this.getTenantAccountingPeriodCloseoutReadinessUseCase.execute({
          tenantSlug,
          period,
          year: Number.parseInt(year, 10),
        });

      return toAccountingPeriodCloseoutReadinessResponseDto(readiness);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/trial-balance-workspace')
  @RequireTenantPermission(ACCOUNTING_PERMISSIONS.READ)
  async getTrialBalanceWorkspace(
    @Param('slug') tenantSlug: string,
    @Query('period') period = '2026-06',
    @Query('year') year = '2026',
  ): Promise<AccountingTrialBalanceWorkspaceResponseDto> {
    try {
      const workspace =
        await this.getTenantAccountingTrialBalanceWorkspaceUseCase.execute({
          tenantSlug,
          period,
          year: Number.parseInt(year, 10),
        });

      return toAccountingTrialBalanceWorkspaceResponseDto(workspace);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Post(':slug/period-closeout-packet')
  @RequireTenantPermission(ACCOUNTING_PERMISSIONS.MANAGE)
  async requestPeriodCloseoutPacket(
    @Param('slug') tenantSlug: string,
    @Body() body: RequestAccountingPeriodCloseoutPacketRequestDto,
  ): Promise<AccountingPeriodCloseoutPacketResponseDto> {
    try {
      const packet =
        await this.requestTenantAccountingPeriodCloseoutPacketUseCase.execute({
          tenantSlug,
          period: body.period,
          year: body.year,
          decision: body.decision,
          reviewerUserId: body.reviewerUserId ?? null,
          reviewerEmail: body.reviewerEmail ?? null,
          note: body.note ?? null,
        });

      return toAccountingPeriodCloseoutPacketResponseDto(packet);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/period-closeout-report')
  @RequireTenantPermission(ACCOUNTING_PERMISSIONS.READ)
  async getPeriodCloseoutReport(
    @Param('slug') tenantSlug: string,
    @Query('period') period = '2026-06',
    @Query('year') year = '2026',
  ): Promise<AccountingPeriodCloseoutReportResponseDto> {
    try {
      const report =
        await this.getTenantAccountingPeriodCloseoutReportUseCase.execute({
          tenantSlug,
          period,
          year: Number.parseInt(year, 10),
        });

      return toAccountingPeriodCloseoutReportResponseDto(report);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/period-lock-readiness')
  @RequireTenantPermission(ACCOUNTING_PERMISSIONS.READ)
  async getPeriodLockReadiness(
    @Param('slug') tenantSlug: string,
    @Query('period') period = '2026-06',
    @Query('year') year = '2026',
  ): Promise<AccountingPeriodLockReadinessResponseDto> {
    try {
      const readiness =
        await this.getTenantAccountingPeriodLockReadinessUseCase.execute({
          tenantSlug,
          period,
          year: Number.parseInt(year, 10),
        });

      return toAccountingPeriodLockReadinessResponseDto(readiness);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/period-lock-registry')
  @RequireTenantPermission(ACCOUNTING_PERMISSIONS.READ)
  async getPeriodLockRegistry(
    @Param('slug') tenantSlug: string,
    @Query('period') period = '2026-06',
    @Query('year') year = '2026',
  ): Promise<AccountingPeriodLockRegistryResponseDto> {
    try {
      const registry =
        await this.listTenantAccountingPeriodLockRegistryUseCase.execute({
          tenantSlug,
          period,
          year: Number.parseInt(year, 10),
        });

      return toAccountingPeriodLockRegistryResponseDto(registry);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Post(':slug/period-lock')
  @RequireTenantPermission(ACCOUNTING_PERMISSIONS.MANAGE)
  async lockPeriod(
    @Param('slug') tenantSlug: string,
    @Body() body: LockAccountingPeriodRequestDto,
  ): Promise<AccountingPeriodLockResultResponseDto> {
    try {
      const result = await this.lockTenantAccountingPeriodUseCase.execute({
        tenantSlug,
        period: body.period,
        year: body.year,
        lockedByUserId: body.lockedByUserId ?? null,
        lockedByEmail: body.lockedByEmail ?? null,
        reason: body.reason ?? null,
        evidenceReference: body.evidenceReference ?? null,
      });

      return toAccountingPeriodLockResultResponseDto(result);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Post(':slug/period-reopen-packet')
  @RequireTenantPermission(ACCOUNTING_PERMISSIONS.MANAGE)
  async requestPeriodReopenPacket(
    @Param('slug') tenantSlug: string,
    @Body() body: RequestAccountingPeriodReopenPacketRequestDto,
  ): Promise<AccountingPeriodReopenPacketResponseDto> {
    try {
      const packet =
        await this.requestTenantAccountingPeriodReopenPacketUseCase.execute({
          tenantSlug,
          period: body.period,
          year: body.year,
          decision: body.decision,
          reason: body.reason,
          evidenceReference: body.evidenceReference ?? null,
          reopenedByUserId: body.reopenedByUserId ?? null,
          reopenedByEmail: body.reopenedByEmail ?? null,
        });

      return toAccountingPeriodReopenPacketResponseDto(packet);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Post(':slug/adjusting-journal-entries')
  @RequireTenantPermission(ACCOUNTING_PERMISSIONS.MANAGE)
  async createAdjustingJournalEntry(
    @Param('slug') tenantSlug: string,
    @Body() body: CreateAccountingAdjustingJournalEntryRequestDto,
  ): Promise<AccountingAdjustingJournalEntryCreationResultResponseDto> {
    try {
      const result =
        await this.createTenantAccountingAdjustingJournalEntryUseCase.execute({
          tenantSlug,
          period: body.period,
          year: body.year,
          adjustmentType: body.adjustmentType,
          label: body.label,
          currency: body.currency ?? null,
          lines: body.lines,
          reviewerUserId: body.reviewerUserId ?? null,
          reviewerEmail: body.reviewerEmail ?? null,
          note: body.note ?? null,
        });

      return toAccountingAdjustingJournalEntryCreationResultResponseDto(result);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/financial-statement-preview')
  @RequireTenantPermission(ACCOUNTING_PERMISSIONS.READ)
  async getFinancialStatementPreview(
    @Param('slug') tenantSlug: string,
    @Query('period') period = '2026-06',
    @Query('year') year = '2026',
  ): Promise<AccountingFinancialStatementPreviewResponseDto> {
    try {
      const preview =
        await this.getTenantAccountingFinancialStatementPreviewUseCase.execute({
          tenantSlug,
          period,
          year: Number.parseInt(year, 10),
        });

      return toAccountingFinancialStatementPreviewResponseDto(preview);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/audit-trail-workspace')
  @RequireTenantPermission(ACCOUNTING_PERMISSIONS.READ)
  async getAuditTrailWorkspace(
    @Param('slug') tenantSlug: string,
    @Query('period') period = '2026-06',
    @Query('year') year = '2026',
  ): Promise<AccountingAuditTrailWorkspaceResponseDto> {
    try {
      const workspace =
        await this.getTenantAccountingAuditTrailWorkspaceUseCase.execute({
          tenantSlug,
          period,
          year: Number.parseInt(year, 10),
        });

      return toAccountingAuditTrailWorkspaceResponseDto(workspace);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Post(':slug/financial-statement-review-packet')
  @RequireTenantPermission(ACCOUNTING_PERMISSIONS.MANAGE)
  async requestFinancialStatementReviewPacket(
    @Param('slug') tenantSlug: string,
    @Body() body: RequestAccountingFinancialStatementReviewPacketRequestDto,
  ): Promise<AccountingFinancialStatementReviewPacketResponseDto> {
    try {
      const packet =
        await this.requestTenantAccountingFinancialStatementReviewPacketUseCase.execute(
          {
            tenantSlug,
            period: body.period,
            year: body.year,
            decision: body.decision,
            reviewerUserId: body.reviewerUserId ?? null,
            reviewerEmail: body.reviewerEmail ?? null,
            note: body.note ?? null,
            evidenceReference: body.evidenceReference ?? null,
          },
        );

      return toAccountingFinancialStatementReviewPacketResponseDto(packet);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/period-evidence-vault')
  @RequireTenantPermission(ACCOUNTING_PERMISSIONS.READ)
  async getPeriodEvidenceVault(
    @Param('slug') tenantSlug: string,
    @Query('period') period = '2026-06',
    @Query('year') year = '2026',
  ): Promise<AccountingPeriodEvidenceVaultResponseDto> {
    try {
      const vault =
        await this.getTenantAccountingPeriodEvidenceVaultUseCase.execute({
          tenantSlug,
          period,
          year: Number.parseInt(year, 10),
        });

      return toAccountingPeriodEvidenceVaultResponseDto(vault);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/accountant-handoff-workspace')
  @RequireTenantPermission(ACCOUNTING_PERMISSIONS.READ)
  async getAccountantHandoffWorkspace(
    @Param('slug') tenantSlug: string,
    @Query('period') period = '2026-06',
    @Query('year') year = '2026',
  ): Promise<AccountingAccountantHandoffWorkspaceResponseDto> {
    try {
      const workspace =
        await this.getTenantAccountingAccountantHandoffWorkspaceUseCase.execute({
          tenantSlug,
          period,
          year: Number.parseInt(year, 10),
        });

      return toAccountingAccountantHandoffWorkspaceResponseDto(workspace);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Post(':slug/accountant-review/request')
  @RequireTenantPermission(ACCOUNTING_PERMISSIONS.MANAGE)
  async requestAccountantReview(
    @Param('slug') tenantSlug: string,
    @Body() body: RequestAccountingAccountantReviewRequestDto,
  ): Promise<AccountingAccountantReviewResponseDto> {
    try {
      const review =
        await this.requestTenantAccountingAccountantReviewUseCase.execute({
          tenantSlug,
          period: body.period,
          year: body.year,
          requestedByUserId: body.requestedByUserId ?? null,
          requestedByEmail: body.requestedByEmail ?? null,
        });

      return toAccountingAccountantReviewResponseDto(review);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/accountant-reviews')
  @RequireTenantPermission(ACCOUNTING_PERMISSIONS.READ)
  async listAccountantReviews(
    @Param('slug') tenantSlug: string,
    @Query('period') period = '2026-06',
  ): Promise<AccountingAccountantReviewResponseDto[]> {
    try {
      const reviews =
        await this.listTenantAccountingAccountantReviewsUseCase.execute({
          tenantSlug,
          period,
        });

      return reviews.map((review) =>
        toAccountingAccountantReviewResponseDto(review),
      );
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Post(':slug/accountant-review/:reviewId/transition')
  @RequireTenantPermission(ACCOUNTING_PERMISSIONS.MANAGE)
  async transitionAccountantReview(
    @Param('slug') tenantSlug: string,
    @Param('reviewId') reviewId: string,
    @Body() body: TransitionAccountingAccountantReviewRequestDto,
  ): Promise<AccountingAccountantReviewResponseDto> {
    try {
      const review =
        await this.transitionTenantAccountingAccountantReviewUseCase.execute({
          tenantSlug,
          reviewId,
          status: body.status,
          transitionedByUserId: body.transitionedByUserId ?? null,
          note: body.note ?? null,
        });

      return toAccountingAccountantReviewResponseDto(review);
    } catch (error) {
      if (
        error instanceof TenantNotFoundError ||
        error instanceof AccountingAccountantReviewNotFoundError
      ) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Post(':slug/review-resolution-packet')
  @RequireTenantPermission(ACCOUNTING_PERMISSIONS.MANAGE)
  async requestReviewResolutionPacket(
    @Param('slug') tenantSlug: string,
    @Body() body: RequestAccountingReviewResolutionPacketRequestDto,
  ): Promise<AccountingReviewResolutionPacketResponseDto> {
    try {
      const packet =
        await this.requestTenantAccountingReviewResolutionPacketUseCase.execute({
          tenantSlug,
          period: body.period,
          year: body.year,
          reviewId: body.reviewId ?? null,
        });

      return toAccountingReviewResolutionPacketResponseDto(packet);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/closeout-certification-readiness')
  @RequireTenantPermission(ACCOUNTING_PERMISSIONS.READ)
  async getCloseoutCertificationReadiness(
    @Param('slug') tenantSlug: string,
    @Query('period') period = '2026-06',
    @Query('year') year = '2026',
  ): Promise<AccountingCloseoutCertificationReadinessResponseDto> {
    try {
      const readiness =
        await this.getTenantAccountingCloseoutCertificationReadinessUseCase.execute(
          {
            tenantSlug,
            period,
            year: Number.parseInt(year, 10),
          },
        );

      return toAccountingCloseoutCertificationReadinessResponseDto(readiness);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }
}
