import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { INVOICING_PERMISSIONS } from '@saas-platform/invoicing-application';
import {
  GetTenantEcuadorTaxCalendarReviewWorkspaceUseCase,
  GetTenantEcuadorTaxDueMonitorUseCase,
  GetTenantEcuadorTaxObligationMatrixUseCase,
  GetTenantEcuadorTaxObligationCalendarUseCase,
  GetTenantEcuadorTaxpayerProfileUseCase,
  RequestTenantEcuadorTaxDeclarationDraftPacketUseCase,
  RequestTenantEcuadorTaxPeriodPreparationPacketUseCase,
} from '@saas-platform/tax-compliance-application';
import { TenantNotFoundError } from '@saas-platform/tenancy-application';
import { JwtAuthenticationGuard } from '../auth/jwt-authentication.guard';
import { RequireTenantPermission } from '../tenancy/require-tenant-permission.decorator';
import { RequireTenantProductAccess } from '../tenancy/require-tenant-product-access.decorator';
import { TenantAccess } from '../tenancy/tenant-access.decorator';
import { TenantMembershipGuard } from '../tenancy/tenant-membership.guard';
import { TenantPermissionGuard } from '../tenancy/tenant-permission.guard';
import { TenantProductAccessGuard } from '../tenancy/tenant-product-access.guard';
import {
  EcuadorTaxObligationMatrixResponseDto,
  EcuadorTaxObligationCalendarResponseDto,
  EcuadorTaxCalendarReviewWorkspaceResponseDto,
  EcuadorTaxDeclarationDraftPacketResponseDto,
  EcuadorTaxDueMonitorResponseDto,
  EcuadorTaxPeriodPreparationPacketResponseDto,
  EcuadorTaxpayerProfileResponseDto,
  toEcuadorTaxCalendarReviewWorkspaceResponseDto,
  toEcuadorTaxDeclarationDraftPacketResponseDto,
  toEcuadorTaxDueMonitorResponseDto,
  toEcuadorTaxObligationCalendarResponseDto,
  toEcuadorTaxObligationMatrixResponseDto,
  toEcuadorTaxPeriodPreparationPacketResponseDto,
  toEcuadorTaxpayerProfileResponseDto,
} from './dto/ecuador-tax-compliance.response';

type TenantAccessContext = {
  tenantSlug?: string;
};

@Controller('tax-compliance/tenants')
@UseGuards(
  JwtAuthenticationGuard,
  TenantMembershipGuard,
  TenantPermissionGuard,
  TenantProductAccessGuard,
)
@RequireTenantProductAccess({ productKey: 'invoicing' })
export class TaxComplianceController {
  constructor(
    private readonly getTenantEcuadorTaxpayerProfileUseCase: GetTenantEcuadorTaxpayerProfileUseCase,
    private readonly getTenantEcuadorTaxObligationMatrixUseCase: GetTenantEcuadorTaxObligationMatrixUseCase,
    private readonly getTenantEcuadorTaxObligationCalendarUseCase: GetTenantEcuadorTaxObligationCalendarUseCase,
    private readonly getTenantEcuadorTaxCalendarReviewWorkspaceUseCase: GetTenantEcuadorTaxCalendarReviewWorkspaceUseCase,
    private readonly getTenantEcuadorTaxDueMonitorUseCase: GetTenantEcuadorTaxDueMonitorUseCase,
    private readonly requestTenantEcuadorTaxPeriodPreparationPacketUseCase: RequestTenantEcuadorTaxPeriodPreparationPacketUseCase,
    private readonly requestTenantEcuadorTaxDeclarationDraftPacketUseCase: RequestTenantEcuadorTaxDeclarationDraftPacketUseCase,
  ) {}

  @Get(':slug/ec/taxpayer-profile')
  @RequireTenantPermission(INVOICING_PERMISSIONS.TAXES_READ)
  async getTaxpayerProfile(
    @Param('slug') slug: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcuadorTaxpayerProfileResponseDto> {
    try {
      const profile =
        await this.getTenantEcuadorTaxpayerProfileUseCase.execute(
          tenantAccess?.tenantSlug ?? slug,
        );

      return toEcuadorTaxpayerProfileResponseDto(profile);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/ec/calendar-review-workspace')
  @RequireTenantPermission(INVOICING_PERMISSIONS.TAXES_READ)
  async getCalendarReviewWorkspace(
    @Param('slug') slug: string,
    @Query('year') year?: string,
    @Query('asOfDate') asOfDate?: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcuadorTaxCalendarReviewWorkspaceResponseDto> {
    try {
      const workspace =
        await this.getTenantEcuadorTaxCalendarReviewWorkspaceUseCase.execute(
          tenantAccess?.tenantSlug ?? slug,
          resolveCalendarYear(year),
          asOfDate,
        );

      return toEcuadorTaxCalendarReviewWorkspaceResponseDto(workspace);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/ec/due-monitor')
  @RequireTenantPermission(INVOICING_PERMISSIONS.TAXES_READ)
  async getDueMonitor(
    @Param('slug') slug: string,
    @Query('year') year?: string,
    @Query('asOfDate') asOfDate?: string,
    @Query('windowDays') windowDays?: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcuadorTaxDueMonitorResponseDto> {
    try {
      const monitor = await this.getTenantEcuadorTaxDueMonitorUseCase.execute({
        tenantSlug: tenantAccess?.tenantSlug ?? slug,
        year: resolveCalendarYear(year),
        asOfDate,
        windowDays: resolveWindowDays(windowDays),
      });

      return toEcuadorTaxDueMonitorResponseDto(monitor);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/ec/obligation-calendar')
  @RequireTenantPermission(INVOICING_PERMISSIONS.TAXES_READ)
  async getObligationCalendar(
    @Param('slug') slug: string,
    @Query('year') year?: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcuadorTaxObligationCalendarResponseDto> {
    try {
      const resolvedYear = resolveCalendarYear(year);
      const calendar =
        await this.getTenantEcuadorTaxObligationCalendarUseCase.execute(
          tenantAccess?.tenantSlug ?? slug,
          resolvedYear,
        );

      return toEcuadorTaxObligationCalendarResponseDto(calendar);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/ec/obligation-matrix')
  @RequireTenantPermission(INVOICING_PERMISSIONS.TAXES_READ)
  async getObligationMatrix(
    @Param('slug') slug: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcuadorTaxObligationMatrixResponseDto> {
    try {
      const matrix =
        await this.getTenantEcuadorTaxObligationMatrixUseCase.execute(
          tenantAccess?.tenantSlug ?? slug,
        );

      return toEcuadorTaxObligationMatrixResponseDto(matrix);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/ec/period-preparation-packet')
  @RequireTenantPermission(INVOICING_PERMISSIONS.TAXES_READ)
  async getPeriodPreparationPacket(
    @Param('slug') slug: string,
    @Query('period') period = 'current',
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcuadorTaxPeriodPreparationPacketResponseDto> {
    try {
      const packet =
        await this.requestTenantEcuadorTaxPeriodPreparationPacketUseCase.execute(
          tenantAccess?.tenantSlug ?? slug,
          period,
        );

      return toEcuadorTaxPeriodPreparationPacketResponseDto(packet);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/ec/declaration-draft-packet')
  @RequireTenantPermission(INVOICING_PERMISSIONS.TAXES_READ)
  async getDeclarationDraftPacket(
    @Param('slug') slug: string,
    @Query('period') period = 'current',
    @Query('year') year?: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcuadorTaxDeclarationDraftPacketResponseDto> {
    try {
      const packet =
        await this.requestTenantEcuadorTaxDeclarationDraftPacketUseCase.execute({
          tenantSlug: tenantAccess?.tenantSlug ?? slug,
          period,
          year: resolveCalendarYear(year),
        });

      return toEcuadorTaxDeclarationDraftPacketResponseDto(packet);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }
}

function resolveCalendarYear(year?: string): number {
  const parsed = year ? Number.parseInt(year, 10) : new Date().getUTCFullYear();

  return Number.isFinite(parsed) ? parsed : new Date().getUTCFullYear();
}

function resolveWindowDays(windowDays?: string): number | undefined {
  if (!windowDays) {
    return undefined;
  }

  const parsed = Number.parseInt(windowDays, 10);

  return Number.isFinite(parsed) ? parsed : undefined;
}
