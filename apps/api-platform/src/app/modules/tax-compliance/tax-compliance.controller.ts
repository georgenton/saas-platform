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
  GetTenantEcuadorTaxObligationMatrixUseCase,
  GetTenantEcuadorTaxpayerProfileUseCase,
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
  EcuadorTaxPeriodPreparationPacketResponseDto,
  EcuadorTaxpayerProfileResponseDto,
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
    private readonly requestTenantEcuadorTaxPeriodPreparationPacketUseCase: RequestTenantEcuadorTaxPeriodPreparationPacketUseCase,
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
}
