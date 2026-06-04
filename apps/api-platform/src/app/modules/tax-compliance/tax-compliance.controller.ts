import {
  Controller,
  Get,
  NotFoundException,
  Body,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { INVOICING_PERMISSIONS } from '@saas-platform/invoicing-application';
import {
  GetTenantEcuadorTaxAuditReadinessUseCase,
  GetTenantEcuadorTaxCalendarReviewWorkspaceUseCase,
  GetTenantEcuadorTaxDueMonitorUseCase,
  GetTenantEcuadorTaxEcommerceEvidenceSummaryUseCase,
  GetTenantEcuadorTaxObligationMatrixUseCase,
  GetTenantEcuadorTaxObligationCalendarUseCase,
  GetTenantEcuadorTaxPeriodWorkspaceUseCase,
  GetTenantEcuadorTaxpayerProfileUseCase,
  ListTenantEcuadorTaxAccountantReviewsUseCase,
  ListTenantEcuadorTaxComplianceEventsUseCase,
  RequestTenantEcuadorTaxAccountantReviewPacketUseCase,
  RequestTenantEcuadorTaxAccountantReviewUseCase,
  RequestTenantEcuadorTaxDeclarationApprovalPacketUseCase,
  RequestTenantEcuadorTaxDeclarationDraftPacketUseCase,
  RequestTenantEcuadorTaxPeriodPreparationPacketUseCase,
  RequestTenantEcuadorTaxSalesBookUseCase,
  TaxComplianceAccountantReviewNotFoundError,
  TransitionTenantEcuadorTaxAccountantReviewUseCase,
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
  EcuadorTaxAccountantReviewResponseDto,
  EcuadorTaxComplianceEventResponseDto,
  EcuadorTaxDeclarationApprovalPacketResponseDto,
  EcuadorTaxAccountantReviewPacketResponseDto,
  EcuadorTaxAuditReadinessResponseDto,
  EcuadorTaxCalendarReviewWorkspaceResponseDto,
  EcuadorTaxDeclarationDraftPacketResponseDto,
  EcuadorTaxDueMonitorResponseDto,
  EcuadorTaxEcommerceEvidenceSummaryResponseDto,
  EcuadorTaxPeriodWorkspaceResponseDto,
  EcuadorTaxPeriodPreparationPacketResponseDto,
  EcuadorTaxSalesBookResponseDto,
  EcuadorTaxpayerProfileResponseDto,
  toEcuadorTaxAccountantReviewResponseDto,
  toEcuadorTaxAccountantReviewPacketResponseDto,
  toEcuadorTaxAuditReadinessResponseDto,
  toEcuadorTaxCalendarReviewWorkspaceResponseDto,
  toEcuadorTaxComplianceEventResponseDto,
  toEcuadorTaxDeclarationApprovalPacketResponseDto,
  toEcuadorTaxDeclarationDraftPacketResponseDto,
  toEcuadorTaxDueMonitorResponseDto,
  toEcuadorTaxEcommerceEvidenceSummaryResponseDto,
  toEcuadorTaxObligationCalendarResponseDto,
  toEcuadorTaxObligationMatrixResponseDto,
  toEcuadorTaxPeriodWorkspaceResponseDto,
  toEcuadorTaxPeriodPreparationPacketResponseDto,
  toEcuadorTaxSalesBookResponseDto,
  toEcuadorTaxpayerProfileResponseDto,
} from './dto/ecuador-tax-compliance.response';

type TenantAccessContext = {
  tenantSlug?: string;
};

interface RequestAccountantReviewBodyDto {
  period?: string;
  year?: number;
  requestedByUserId?: string | null;
  requestedByEmail?: string | null;
}

interface TransitionAccountantReviewBodyDto {
  status: 'pending_accountant' | 'in_review' | 'changes_requested' | 'approved';
  transitionedByUserId?: string | null;
  note?: string | null;
}

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
    private readonly getTenantEcuadorTaxEcommerceEvidenceSummaryUseCase: GetTenantEcuadorTaxEcommerceEvidenceSummaryUseCase,
    private readonly getTenantEcuadorTaxPeriodWorkspaceUseCase: GetTenantEcuadorTaxPeriodWorkspaceUseCase,
    private readonly getTenantEcuadorTaxAuditReadinessUseCase: GetTenantEcuadorTaxAuditReadinessUseCase,
    private readonly requestTenantEcuadorTaxPeriodPreparationPacketUseCase: RequestTenantEcuadorTaxPeriodPreparationPacketUseCase,
    private readonly requestTenantEcuadorTaxDeclarationDraftPacketUseCase: RequestTenantEcuadorTaxDeclarationDraftPacketUseCase,
    private readonly requestTenantEcuadorTaxAccountantReviewPacketUseCase: RequestTenantEcuadorTaxAccountantReviewPacketUseCase,
    private readonly listTenantEcuadorTaxComplianceEventsUseCase: ListTenantEcuadorTaxComplianceEventsUseCase,
    private readonly requestTenantEcuadorTaxAccountantReviewUseCase: RequestTenantEcuadorTaxAccountantReviewUseCase,
    private readonly listTenantEcuadorTaxAccountantReviewsUseCase: ListTenantEcuadorTaxAccountantReviewsUseCase,
    private readonly transitionTenantEcuadorTaxAccountantReviewUseCase: TransitionTenantEcuadorTaxAccountantReviewUseCase,
    private readonly requestTenantEcuadorTaxDeclarationApprovalPacketUseCase: RequestTenantEcuadorTaxDeclarationApprovalPacketUseCase,
    private readonly requestTenantEcuadorTaxSalesBookUseCase: RequestTenantEcuadorTaxSalesBookUseCase,
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

  @Get(':slug/ec/period-workspace')
  @RequireTenantPermission(INVOICING_PERMISSIONS.TAXES_READ)
  async getPeriodWorkspace(
    @Param('slug') slug: string,
    @Query('period') period = 'current',
    @Query('year') year?: string,
    @Query('asOfDate') asOfDate?: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcuadorTaxPeriodWorkspaceResponseDto> {
    try {
      const workspace =
        await this.getTenantEcuadorTaxPeriodWorkspaceUseCase.execute({
          tenantSlug: tenantAccess?.tenantSlug ?? slug,
          period,
          year: resolveCalendarYear(year),
          asOfDate,
        });

      return toEcuadorTaxPeriodWorkspaceResponseDto(workspace);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/ec/ecommerce-evidence')
  @RequireTenantPermission(INVOICING_PERMISSIONS.TAXES_READ)
  async getEcommerceEvidence(
    @Param('slug') slug: string,
    @Query('period') period = 'current',
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcuadorTaxEcommerceEvidenceSummaryResponseDto> {
    try {
      const summary =
        await this.getTenantEcuadorTaxEcommerceEvidenceSummaryUseCase.execute({
          tenantSlug: tenantAccess?.tenantSlug ?? slug,
          period,
        });

      return toEcuadorTaxEcommerceEvidenceSummaryResponseDto(summary);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/ec/sales-book')
  @RequireTenantPermission(INVOICING_PERMISSIONS.TAXES_READ)
  async getSalesBook(
    @Param('slug') slug: string,
    @Query('period') period = 'current',
    @Query('year') year?: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcuadorTaxSalesBookResponseDto> {
    try {
      const book = await this.requestTenantEcuadorTaxSalesBookUseCase.execute({
        tenantSlug: tenantAccess?.tenantSlug ?? slug,
        period,
        year: resolveCalendarYear(year),
      });

      return toEcuadorTaxSalesBookResponseDto(book);
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

  @Get(':slug/ec/accountant-review-packet')
  @RequireTenantPermission(INVOICING_PERMISSIONS.TAXES_READ)
  async getAccountantReviewPacket(
    @Param('slug') slug: string,
    @Query('period') period = 'current',
    @Query('year') year?: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcuadorTaxAccountantReviewPacketResponseDto> {
    try {
      const packet =
        await this.requestTenantEcuadorTaxAccountantReviewPacketUseCase.execute({
          tenantSlug: tenantAccess?.tenantSlug ?? slug,
          period,
          year: resolveCalendarYear(year),
        });

      return toEcuadorTaxAccountantReviewPacketResponseDto(packet);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/ec/events')
  @RequireTenantPermission(INVOICING_PERMISSIONS.TAXES_READ)
  async listComplianceEvents(
    @Param('slug') slug: string,
    @Query('period') period = 'current',
    @Query('limit') limit?: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcuadorTaxComplianceEventResponseDto[]> {
    try {
      const events =
        await this.listTenantEcuadorTaxComplianceEventsUseCase.execute({
          tenantSlug: tenantAccess?.tenantSlug ?? slug,
          period,
          limit: resolveLimit(limit),
        });

      return events.map((event) => toEcuadorTaxComplianceEventResponseDto(event));
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Post(':slug/ec/accountant-review/request')
  @RequireTenantPermission(INVOICING_PERMISSIONS.TAXES_READ)
  async requestAccountantReview(
    @Param('slug') slug: string,
    @Body() body: RequestAccountantReviewBodyDto,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcuadorTaxAccountantReviewResponseDto> {
    try {
      const review =
        await this.requestTenantEcuadorTaxAccountantReviewUseCase.execute({
          tenantSlug: tenantAccess?.tenantSlug ?? slug,
          period: body.period ?? 'current',
          year: body.year ?? resolveCalendarYear(),
          requestedByUserId: body.requestedByUserId,
          requestedByEmail: body.requestedByEmail,
        });

      return toEcuadorTaxAccountantReviewResponseDto(review);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/ec/accountant-reviews')
  @RequireTenantPermission(INVOICING_PERMISSIONS.TAXES_READ)
  async listAccountantReviews(
    @Param('slug') slug: string,
    @Query('period') period = 'current',
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcuadorTaxAccountantReviewResponseDto[]> {
    try {
      const reviews =
        await this.listTenantEcuadorTaxAccountantReviewsUseCase.execute({
          tenantSlug: tenantAccess?.tenantSlug ?? slug,
          period,
        });

      return reviews.map((review) =>
        toEcuadorTaxAccountantReviewResponseDto(review),
      );
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Post(':slug/ec/accountant-review/:reviewId/transition')
  @RequireTenantPermission(INVOICING_PERMISSIONS.TAXES_READ)
  async transitionAccountantReview(
    @Param('slug') slug: string,
    @Param('reviewId') reviewId: string,
    @Body() body: TransitionAccountantReviewBodyDto,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcuadorTaxAccountantReviewResponseDto> {
    try {
      const review =
        await this.transitionTenantEcuadorTaxAccountantReviewUseCase.execute({
          tenantSlug: tenantAccess?.tenantSlug ?? slug,
          reviewId,
          status: body.status,
          transitionedByUserId: body.transitionedByUserId,
          note: body.note,
        });

      return toEcuadorTaxAccountantReviewResponseDto(review);
    } catch (error) {
      if (
        error instanceof TenantNotFoundError ||
        error instanceof TaxComplianceAccountantReviewNotFoundError
      ) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/ec/declaration-approval-packet')
  @RequireTenantPermission(INVOICING_PERMISSIONS.TAXES_READ)
  async getDeclarationApprovalPacket(
    @Param('slug') slug: string,
    @Query('period') period = 'current',
    @Query('year') year?: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcuadorTaxDeclarationApprovalPacketResponseDto> {
    try {
      const packet =
        await this.requestTenantEcuadorTaxDeclarationApprovalPacketUseCase.execute(
          {
            tenantSlug: tenantAccess?.tenantSlug ?? slug,
            period,
            year: resolveCalendarYear(year),
          },
        );

      return toEcuadorTaxDeclarationApprovalPacketResponseDto(packet);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/ec/audit-readiness')
  @RequireTenantPermission(INVOICING_PERMISSIONS.TAXES_READ)
  async getAuditReadiness(
    @Param('slug') slug: string,
    @Query('period') period = 'current',
    @Query('year') year?: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcuadorTaxAuditReadinessResponseDto> {
    try {
      const readiness =
        await this.getTenantEcuadorTaxAuditReadinessUseCase.execute({
          tenantSlug: tenantAccess?.tenantSlug ?? slug,
          period,
          year: resolveCalendarYear(year),
        });

      return toEcuadorTaxAuditReadinessResponseDto(readiness);
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

function resolveLimit(limit?: string): number | undefined {
  if (!limit) {
    return undefined;
  }

  const parsed = Number.parseInt(limit, 10);

  return Number.isFinite(parsed) ? parsed : undefined;
}
