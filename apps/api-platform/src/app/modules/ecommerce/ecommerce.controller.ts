import {
  Controller,
  Get,
  NotFoundException,
  Param,
  UseGuards,
} from '@nestjs/common';
import { GetTenantEcommerceLaunchWorkspaceUseCase } from '@saas-platform/ecommerce-application';
import {
  ProductNotFoundError,
} from '@saas-platform/catalog-application';
import {
  TENANT_PERMISSIONS,
  TenantAccessContext,
  TenantNotFoundError,
} from '@saas-platform/tenancy-application';
import { JwtAuthenticationGuard } from '../auth/jwt-authentication.guard';
import { TenantAccess } from '../tenancy/tenant-access.decorator';
import { TenantMembershipGuard } from '../tenancy/tenant-membership.guard';
import { RequireTenantPermission } from '../tenancy/require-tenant-permission.decorator';
import { TenantPermissionGuard } from '../tenancy/tenant-permission.guard';
import {
  EcommerceLaunchWorkspaceResponseDto,
  toEcommerceLaunchWorkspaceResponseDto,
} from './dto/ecommerce-launch-workspace.response';

@Controller('ecommerce/tenants')
export class EcommerceController {
  constructor(
    private readonly getTenantEcommerceLaunchWorkspaceUseCase: GetTenantEcommerceLaunchWorkspaceUseCase,
  ) {}

  @Get(':slug/launch-workspace')
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  @RequireTenantPermission(TENANT_PERMISSIONS.ENTITLEMENTS_READ)
  async getTenantLaunchWorkspace(
    @Param('slug') slug: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcommerceLaunchWorkspaceResponseDto> {
    try {
      const workspace =
        await this.getTenantEcommerceLaunchWorkspaceUseCase.execute(
          tenantAccess?.tenantSlug ?? slug,
        );

      return toEcommerceLaunchWorkspaceResponseDto(workspace);
    } catch (error) {
      if (
        error instanceof TenantNotFoundError ||
        error instanceof ProductNotFoundError
      ) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }
}
