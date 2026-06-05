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
  GetTenantAccountingChartOfAccountsWorkspaceUseCase,
  GetTenantAccountingIntakeWorkspaceUseCase,
  GetTenantAccountingJournalDraftPreviewUseCase,
  GetTenantAccountingLedgerPreviewWorkspaceUseCase,
  ManageTenantAccountingChartMappingUseCase,
  RequestTenantAccountingJournalDraftApprovalPacketUseCase,
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
  AccountingLedgerPreviewWorkspaceResponseDto,
  toAccountingLedgerPreviewWorkspaceResponseDto,
} from './dto/accounting-ledger-preview-workspace.response';

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
}
