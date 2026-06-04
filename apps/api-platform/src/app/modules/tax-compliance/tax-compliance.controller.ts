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
  ExecuteTenantEcuadorTaxWithholdingDraftBridgeUseCase,
  GetTenantEcuadorTaxAccountantWorkbenchUseCase,
  GetTenantEcuadorTaxAuditReadinessUseCase,
  GetTenantEcuadorTaxCalendarReviewWorkspaceUseCase,
  GetTenantEcuadorTaxDueMonitorUseCase,
  GetTenantEcuadorTaxEcommerceEvidenceSummaryUseCase,
  GetTenantEcuadorTaxObligationMatrixUseCase,
  GetTenantEcuadorTaxObligationCalendarUseCase,
  GetTenantEcuadorTaxPeriodWorkspaceUseCase,
  GetTenantEcuadorTaxPurchaseExpenseEvidenceWorkspaceUseCase,
  GetTenantEcuadorTaxReconciliationWorkspaceUseCase,
  GetTenantEcuadorTaxRuleCatalogUseCase,
  GetTenantEcuadorTaxSupplierFiscalReadinessWorkspaceUseCase,
  GetTenantEcuadorTaxpayerProfileUseCase,
  ListTenantEcuadorTaxAccountantReviewsUseCase,
  ListTenantEcuadorTaxComplianceEventsUseCase,
  RecordTenantEcuadorTaxPurchaseExpenseEvidenceUseCase,
  RequestTenantEcuadorTaxAccountantReviewPacketUseCase,
  RequestTenantEcuadorTaxAccountantReviewUseCase,
  RequestTenantEcuadorTaxDeclarationApprovalPacketUseCase,
  RequestTenantEcuadorTaxDeclarationDraftPacketUseCase,
  RequestTenantEcuadorTaxIncomeTaxEvidencePacketUseCase,
  RequestTenantEcuadorTaxPeriodCloseoutPacketUseCase,
  RequestTenantEcuadorTaxPeriodPreparationPacketUseCase,
  RequestTenantEcuadorTaxSalesBookUseCase,
  RequestTenantEcuadorTaxVatDeclarationReadinessPacketUseCase,
  RequestTenantEcuadorTaxVatInputOutputReconciliationPacketUseCase,
  RequestTenantEcuadorTaxWithholdingDraftBridgePacketUseCase,
  RequestTenantEcuadorTaxWithholdingEvidencePacketUseCase,
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
  EcuadorTaxAccountantWorkbenchResponseDto,
  EcuadorTaxComplianceEventResponseDto,
  EcuadorTaxDeclarationApprovalPacketResponseDto,
  EcuadorTaxAccountantReviewPacketResponseDto,
  EcuadorTaxAuditReadinessResponseDto,
  EcuadorTaxCalendarReviewWorkspaceResponseDto,
  EcuadorTaxDeclarationDraftPacketResponseDto,
  EcuadorTaxDueMonitorResponseDto,
  EcuadorTaxEcommerceEvidenceSummaryResponseDto,
  EcuadorTaxIncomeTaxEvidencePacketResponseDto,
  EcuadorTaxPeriodCloseoutPacketResponseDto,
  EcuadorTaxPeriodWorkspaceResponseDto,
  EcuadorTaxPeriodPreparationPacketResponseDto,
  EcuadorTaxPurchaseExpenseEvidenceRecordResponseDto,
  EcuadorTaxPurchaseExpenseEvidenceWorkspaceResponseDto,
  EcuadorTaxReconciliationWorkspaceResponseDto,
  EcuadorTaxRuleCatalogResponseDto,
  EcuadorTaxSalesBookResponseDto,
  EcuadorTaxSupplierFiscalReadinessWorkspaceResponseDto,
  EcuadorTaxpayerProfileResponseDto,
  EcuadorTaxVatDeclarationReadinessPacketResponseDto,
  EcuadorTaxVatInputOutputReconciliationPacketResponseDto,
  EcuadorTaxWithholdingDraftBridgePacketResponseDto,
  EcuadorTaxWithholdingDraftExecutionPacketResponseDto,
  EcuadorTaxWithholdingEvidencePacketResponseDto,
  toEcuadorTaxAccountantWorkbenchResponseDto,
  toEcuadorTaxAccountantReviewResponseDto,
  toEcuadorTaxAccountantReviewPacketResponseDto,
  toEcuadorTaxAuditReadinessResponseDto,
  toEcuadorTaxCalendarReviewWorkspaceResponseDto,
  toEcuadorTaxComplianceEventResponseDto,
  toEcuadorTaxDeclarationApprovalPacketResponseDto,
  toEcuadorTaxDeclarationDraftPacketResponseDto,
  toEcuadorTaxDueMonitorResponseDto,
  toEcuadorTaxEcommerceEvidenceSummaryResponseDto,
  toEcuadorTaxIncomeTaxEvidencePacketResponseDto,
  toEcuadorTaxObligationCalendarResponseDto,
  toEcuadorTaxObligationMatrixResponseDto,
  toEcuadorTaxPeriodCloseoutPacketResponseDto,
  toEcuadorTaxPeriodWorkspaceResponseDto,
  toEcuadorTaxPeriodPreparationPacketResponseDto,
  toEcuadorTaxPurchaseExpenseEvidenceRecordResponseDto,
  toEcuadorTaxPurchaseExpenseEvidenceWorkspaceResponseDto,
  toEcuadorTaxReconciliationWorkspaceResponseDto,
  toEcuadorTaxRuleCatalogResponseDto,
  toEcuadorTaxSalesBookResponseDto,
  toEcuadorTaxSupplierFiscalReadinessWorkspaceResponseDto,
  toEcuadorTaxpayerProfileResponseDto,
  toEcuadorTaxVatDeclarationReadinessPacketResponseDto,
  toEcuadorTaxVatInputOutputReconciliationPacketResponseDto,
  toEcuadorTaxWithholdingDraftBridgePacketResponseDto,
  toEcuadorTaxWithholdingDraftExecutionPacketResponseDto,
  toEcuadorTaxWithholdingEvidencePacketResponseDto,
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

interface RecordPurchaseExpenseEvidenceBodyDto {
  period?: string;
  year?: number;
  supplierPartyId?: string | null;
  supplierName: string;
  supplierTaxpayerId?: string | null;
  documentNumber?: string | null;
  documentCode?: string | null;
  issuedAt?: string | null;
  category?:
    | 'inventory'
    | 'services'
    | 'operating_expense'
    | 'asset'
    | 'non_deductible'
    | 'uncategorized';
  currency?: string;
  subtotalInCents: number;
  vatInCents?: number;
  totalInCents?: number;
  deductible?: boolean | null;
  supportReference?: string | null;
}

interface RequestWithholdingDraftBridgeBodyDto {
  period?: string;
  year?: number;
  candidateType?: 'sale' | 'purchase';
  candidateId?: string | null;
  taxRateId?: string | null;
}

interface ExecuteWithholdingDraftBridgeBodyDto
  extends RequestWithholdingDraftBridgeBodyDto {
  number?: string | null;
  issuedAt?: string | null;
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
    private readonly getTenantEcuadorTaxReconciliationWorkspaceUseCase: GetTenantEcuadorTaxReconciliationWorkspaceUseCase,
    private readonly requestTenantEcuadorTaxVatDeclarationReadinessPacketUseCase: RequestTenantEcuadorTaxVatDeclarationReadinessPacketUseCase,
    private readonly requestTenantEcuadorTaxPeriodCloseoutPacketUseCase: RequestTenantEcuadorTaxPeriodCloseoutPacketUseCase,
    private readonly getTenantEcuadorTaxPurchaseExpenseEvidenceWorkspaceUseCase: GetTenantEcuadorTaxPurchaseExpenseEvidenceWorkspaceUseCase,
    private readonly requestTenantEcuadorTaxVatInputOutputReconciliationPacketUseCase: RequestTenantEcuadorTaxVatInputOutputReconciliationPacketUseCase,
    private readonly requestTenantEcuadorTaxIncomeTaxEvidencePacketUseCase: RequestTenantEcuadorTaxIncomeTaxEvidencePacketUseCase,
    private readonly recordTenantEcuadorTaxPurchaseExpenseEvidenceUseCase: RecordTenantEcuadorTaxPurchaseExpenseEvidenceUseCase,
    private readonly getTenantEcuadorTaxSupplierFiscalReadinessWorkspaceUseCase: GetTenantEcuadorTaxSupplierFiscalReadinessWorkspaceUseCase,
    private readonly requestTenantEcuadorTaxWithholdingEvidencePacketUseCase: RequestTenantEcuadorTaxWithholdingEvidencePacketUseCase,
    private readonly requestTenantEcuadorTaxWithholdingDraftBridgePacketUseCase: RequestTenantEcuadorTaxWithholdingDraftBridgePacketUseCase,
    private readonly executeTenantEcuadorTaxWithholdingDraftBridgeUseCase: ExecuteTenantEcuadorTaxWithholdingDraftBridgeUseCase,
    private readonly getTenantEcuadorTaxRuleCatalogUseCase: GetTenantEcuadorTaxRuleCatalogUseCase,
    private readonly getTenantEcuadorTaxAccountantWorkbenchUseCase: GetTenantEcuadorTaxAccountantWorkbenchUseCase,
  ) {}

  @Get(':slug/ec/taxpayer-profile')
  @RequireTenantPermission(INVOICING_PERMISSIONS.TAXES_READ)
  async getTaxpayerProfile(
    @Param('slug') slug: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcuadorTaxpayerProfileResponseDto> {
    try {
      const profile = await this.getTenantEcuadorTaxpayerProfileUseCase.execute(
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

  @Get(':slug/ec/reconciliation-workspace')
  @RequireTenantPermission(INVOICING_PERMISSIONS.TAXES_READ)
  async getReconciliationWorkspace(
    @Param('slug') slug: string,
    @Query('period') period = 'current',
    @Query('year') year?: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcuadorTaxReconciliationWorkspaceResponseDto> {
    try {
      const workspace =
        await this.getTenantEcuadorTaxReconciliationWorkspaceUseCase.execute({
          tenantSlug: tenantAccess?.tenantSlug ?? slug,
          period,
          year: resolveCalendarYear(year),
        });

      return toEcuadorTaxReconciliationWorkspaceResponseDto(workspace);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/ec/vat-declaration-readiness-packet')
  @RequireTenantPermission(INVOICING_PERMISSIONS.TAXES_READ)
  async getVatDeclarationReadinessPacket(
    @Param('slug') slug: string,
    @Query('period') period = 'current',
    @Query('year') year?: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcuadorTaxVatDeclarationReadinessPacketResponseDto> {
    try {
      const packet =
        await this.requestTenantEcuadorTaxVatDeclarationReadinessPacketUseCase.execute(
          {
            tenantSlug: tenantAccess?.tenantSlug ?? slug,
            period,
            year: resolveCalendarYear(year),
          },
        );

      return toEcuadorTaxVatDeclarationReadinessPacketResponseDto(packet);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/ec/purchase-expense-evidence-workspace')
  @RequireTenantPermission(INVOICING_PERMISSIONS.TAXES_READ)
  async getPurchaseExpenseEvidenceWorkspace(
    @Param('slug') slug: string,
    @Query('period') period = 'current',
    @Query('year') year?: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcuadorTaxPurchaseExpenseEvidenceWorkspaceResponseDto> {
    try {
      const workspace =
        await this.getTenantEcuadorTaxPurchaseExpenseEvidenceWorkspaceUseCase.execute(
          {
            tenantSlug: tenantAccess?.tenantSlug ?? slug,
            period,
            year: resolveCalendarYear(year),
          },
        );

      return toEcuadorTaxPurchaseExpenseEvidenceWorkspaceResponseDto(workspace);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Post(':slug/ec/purchase-expense-evidence')
  @RequireTenantPermission(INVOICING_PERMISSIONS.TAXES_READ)
  async recordPurchaseExpenseEvidence(
    @Param('slug') slug: string,
    @Body() body: RecordPurchaseExpenseEvidenceBodyDto,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcuadorTaxPurchaseExpenseEvidenceRecordResponseDto> {
    try {
      const evidence =
        await this.recordTenantEcuadorTaxPurchaseExpenseEvidenceUseCase.execute(
          {
            tenantSlug: tenantAccess?.tenantSlug ?? slug,
            period: body.period ?? 'current',
            year: body.year ?? resolveCalendarYear(),
            supplierPartyId: body.supplierPartyId,
            supplierName: body.supplierName,
            supplierTaxpayerId: body.supplierTaxpayerId,
            documentNumber: body.documentNumber,
            documentCode: body.documentCode,
            issuedAt: body.issuedAt,
            category: body.category,
            currency: body.currency,
            subtotalInCents: body.subtotalInCents,
            vatInCents: body.vatInCents,
            totalInCents: body.totalInCents,
            deductible: body.deductible,
            supportReference: body.supportReference,
          },
        );

      return toEcuadorTaxPurchaseExpenseEvidenceRecordResponseDto(evidence);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/ec/supplier-fiscal-readiness-workspace')
  @RequireTenantPermission(INVOICING_PERMISSIONS.TAXES_READ)
  async getSupplierFiscalReadinessWorkspace(
    @Param('slug') slug: string,
    @Query('period') period = 'current',
    @Query('year') year?: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcuadorTaxSupplierFiscalReadinessWorkspaceResponseDto> {
    try {
      const workspace =
        await this.getTenantEcuadorTaxSupplierFiscalReadinessWorkspaceUseCase.execute(
          {
            tenantSlug: tenantAccess?.tenantSlug ?? slug,
            period,
            year: resolveCalendarYear(year),
          },
        );

      return toEcuadorTaxSupplierFiscalReadinessWorkspaceResponseDto(workspace);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/ec/vat-input-output-reconciliation-packet')
  @RequireTenantPermission(INVOICING_PERMISSIONS.TAXES_READ)
  async getVatInputOutputReconciliationPacket(
    @Param('slug') slug: string,
    @Query('period') period = 'current',
    @Query('year') year?: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcuadorTaxVatInputOutputReconciliationPacketResponseDto> {
    try {
      const packet =
        await this.requestTenantEcuadorTaxVatInputOutputReconciliationPacketUseCase.execute(
          {
            tenantSlug: tenantAccess?.tenantSlug ?? slug,
            period,
            year: resolveCalendarYear(year),
          },
        );

      return toEcuadorTaxVatInputOutputReconciliationPacketResponseDto(packet);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/ec/withholding-evidence-packet')
  @RequireTenantPermission(INVOICING_PERMISSIONS.TAXES_READ)
  async getWithholdingEvidencePacket(
    @Param('slug') slug: string,
    @Query('period') period = 'current',
    @Query('year') year?: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcuadorTaxWithholdingEvidencePacketResponseDto> {
    try {
      const packet =
        await this.requestTenantEcuadorTaxWithholdingEvidencePacketUseCase.execute(
          {
            tenantSlug: tenantAccess?.tenantSlug ?? slug,
            period,
            year: resolveCalendarYear(year),
          },
        );

      return toEcuadorTaxWithholdingEvidencePacketResponseDto(packet);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Post(':slug/ec/withholding-draft-bridge-packet')
  @RequireTenantPermission(INVOICING_PERMISSIONS.TAXES_READ)
  async requestWithholdingDraftBridgePacket(
    @Param('slug') slug: string,
    @Body() body: RequestWithholdingDraftBridgeBodyDto,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcuadorTaxWithholdingDraftBridgePacketResponseDto> {
    try {
      const packet =
        await this.requestTenantEcuadorTaxWithholdingDraftBridgePacketUseCase.execute(
          {
            tenantSlug: tenantAccess?.tenantSlug ?? slug,
            period: body.period ?? 'current',
            year: body.year ?? resolveCalendarYear(),
            candidateType: body.candidateType,
            candidateId: body.candidateId,
            taxRateId: body.taxRateId,
          },
        );

      return toEcuadorTaxWithholdingDraftBridgePacketResponseDto(packet);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Post(':slug/ec/withholding-draft-bridge/execute')
  @RequireTenantPermission(INVOICING_PERMISSIONS.TAXES_MANAGE)
  async executeWithholdingDraftBridge(
    @Param('slug') slug: string,
    @Body() body: ExecuteWithholdingDraftBridgeBodyDto,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcuadorTaxWithholdingDraftExecutionPacketResponseDto> {
    try {
      const packet =
        await this.executeTenantEcuadorTaxWithholdingDraftBridgeUseCase.execute(
          {
            tenantSlug: tenantAccess?.tenantSlug ?? slug,
            period: body.period ?? 'current',
            year: body.year ?? resolveCalendarYear(),
            candidateType: body.candidateType,
            candidateId: body.candidateId,
            taxRateId: body.taxRateId,
            number: body.number,
            issuedAt: body.issuedAt ? new Date(body.issuedAt) : null,
          },
        );

      return toEcuadorTaxWithholdingDraftExecutionPacketResponseDto(packet);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/ec/tax-rule-catalog')
  @RequireTenantPermission(INVOICING_PERMISSIONS.TAXES_READ)
  async getTaxRuleCatalog(
    @Param('slug') slug: string,
    @Query('period') period = 'current',
    @Query('year') year?: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcuadorTaxRuleCatalogResponseDto> {
    try {
      const catalog = await this.getTenantEcuadorTaxRuleCatalogUseCase.execute({
        tenantSlug: tenantAccess?.tenantSlug ?? slug,
        period,
        year: resolveCalendarYear(year),
      });

      return toEcuadorTaxRuleCatalogResponseDto(catalog);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/ec/accountant-workbench')
  @RequireTenantPermission(INVOICING_PERMISSIONS.TAXES_READ)
  async getAccountantWorkbench(
    @Param('slug') slug: string,
    @Query('period') period = 'current',
    @Query('year') year?: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcuadorTaxAccountantWorkbenchResponseDto> {
    try {
      const workbench =
        await this.getTenantEcuadorTaxAccountantWorkbenchUseCase.execute({
          tenantSlug: tenantAccess?.tenantSlug ?? slug,
          period,
          year: resolveCalendarYear(year),
        });

      return toEcuadorTaxAccountantWorkbenchResponseDto(workbench);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/ec/income-tax-evidence-packet')
  @RequireTenantPermission(INVOICING_PERMISSIONS.TAXES_READ)
  async getIncomeTaxEvidencePacket(
    @Param('slug') slug: string,
    @Query('period') period = 'current',
    @Query('year') year?: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcuadorTaxIncomeTaxEvidencePacketResponseDto> {
    try {
      const packet =
        await this.requestTenantEcuadorTaxIncomeTaxEvidencePacketUseCase.execute(
          {
            tenantSlug: tenantAccess?.tenantSlug ?? slug,
            period,
            year: resolveCalendarYear(year),
          },
        );

      return toEcuadorTaxIncomeTaxEvidencePacketResponseDto(packet);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/ec/period-closeout-packet')
  @RequireTenantPermission(INVOICING_PERMISSIONS.TAXES_READ)
  async getPeriodCloseoutPacket(
    @Param('slug') slug: string,
    @Query('period') period = 'current',
    @Query('year') year?: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcuadorTaxPeriodCloseoutPacketResponseDto> {
    try {
      const packet =
        await this.requestTenantEcuadorTaxPeriodCloseoutPacketUseCase.execute({
          tenantSlug: tenantAccess?.tenantSlug ?? slug,
          period,
          year: resolveCalendarYear(year),
        });

      return toEcuadorTaxPeriodCloseoutPacketResponseDto(packet);
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
        await this.requestTenantEcuadorTaxDeclarationDraftPacketUseCase.execute(
          {
            tenantSlug: tenantAccess?.tenantSlug ?? slug,
            period,
            year: resolveCalendarYear(year),
          },
        );

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
        await this.requestTenantEcuadorTaxAccountantReviewPacketUseCase.execute(
          {
            tenantSlug: tenantAccess?.tenantSlug ?? slug,
            period,
            year: resolveCalendarYear(year),
          },
        );

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

      return events.map((event) =>
        toEcuadorTaxComplianceEventResponseDto(event),
      );
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
