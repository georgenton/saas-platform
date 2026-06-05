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
  CreateTenantAccountingJournalEntriesFromApprovalUseCase,
  GetTenantAccountingChartOfAccountsWorkspaceUseCase,
  GetTenantAccountingIntakeWorkspaceUseCase,
  GetTenantAccountingJournalDraftPreviewUseCase,
  GetTenantAccountingLedgerRegistryWorkspaceUseCase,
  GetTenantAccountingLedgerPreviewWorkspaceUseCase,
  GetTenantAccountingPeriodCloseoutReportUseCase,
  GetTenantAccountingPeriodCloseoutReadinessUseCase,
  GetTenantAccountingTrialBalanceWorkspaceUseCase,
  ListTenantAccountingJournalRegistryUseCase,
  ManageTenantAccountingChartMappingUseCase,
  RequestTenantAccountingJournalDraftApprovalPacketUseCase,
  RequestTenantAccountingPeriodCloseoutPacketUseCase,
} from '@saas-platform/accounting-application';
import { TenantNotFoundError } from '@saas-platform/tenancy-application';
import { JwtAuthenticationGuard } from '../auth/jwt-authentication.guard';
import { RequireTenantPermission } from '../tenancy/require-tenant-permission.decorator';
import { RequireTenantProductAccess } from '../tenancy/require-tenant-product-access.decorator';
import { TenantMembershipGuard } from '../tenancy/tenant-membership.guard';
import { TenantPermissionGuard } from '../tenancy/tenant-permission.guard';
import { TenantProductAccessGuard } from '../tenancy/tenant-product-access.guard';
import {
  AccountingChartMappingManagementResponseDto,
  ManageAccountingChartMappingRequestDto,
  toAccountingChartMappingManagementResponseDto,
} from './dto/accounting-chart-mapping-management.response';
import {
  AccountingChartOfAccountsWorkspaceResponseDto,
  toAccountingChartOfAccountsWorkspaceResponseDto,
} from './dto/accounting-chart-of-accounts-workspace.response';
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
    private readonly getTenantAccountingPeriodCloseoutReadinessUseCase: GetTenantAccountingPeriodCloseoutReadinessUseCase,
    private readonly getTenantAccountingTrialBalanceWorkspaceUseCase: GetTenantAccountingTrialBalanceWorkspaceUseCase,
    private readonly requestTenantAccountingPeriodCloseoutPacketUseCase: RequestTenantAccountingPeriodCloseoutPacketUseCase,
    private readonly getTenantAccountingPeriodCloseoutReportUseCase: GetTenantAccountingPeriodCloseoutReportUseCase,
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
}
