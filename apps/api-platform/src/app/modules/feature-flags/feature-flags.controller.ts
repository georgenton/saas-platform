import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ListTenantFeatureFlagsUseCase,
  SetTenantFeatureFlagUseCase,
} from '@saas-platform/feature-flags-application';
import {
  TENANT_PERMISSIONS,
  TenantAccessContext,
  TenantNotFoundError,
} from '@saas-platform/tenancy-application';
import { JwtAuthenticationGuard } from '../auth/jwt-authentication.guard';
import { RequireTenantPermission } from '../tenancy/require-tenant-permission.decorator';
import { TenantAccess } from '../tenancy/tenant-access.decorator';
import { TenantMembershipGuard } from '../tenancy/tenant-membership.guard';
import { TenantPermissionGuard } from '../tenancy/tenant-permission.guard';
import {
  FeatureFlagResponseDto,
  toFeatureFlagResponseDto,
} from './dto/feature-flag.response';
import { SetFeatureFlagRequestDto } from './dto/set-feature-flag.request';

@Controller('tenancy/tenants')
export class FeatureFlagsController {
  constructor(
    private readonly listTenantFeatureFlagsUseCase: ListTenantFeatureFlagsUseCase,
    private readonly setTenantFeatureFlagUseCase: SetTenantFeatureFlagUseCase,
  ) {}

  @Get(':slug/feature-flags')
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  @RequireTenantPermission(TENANT_PERMISSIONS.FEATURE_FLAGS_READ)
  async listTenantFeatureFlags(
    @Param('slug') slug: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<FeatureFlagResponseDto[]> {
    try {
      const featureFlags = await this.listTenantFeatureFlagsUseCase.execute(
        tenantAccess?.tenantSlug ?? slug,
      );

      return featureFlags.map((featureFlag) =>
        toFeatureFlagResponseDto(featureFlag),
      );
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Put(':slug/feature-flags/:key')
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  @RequireTenantPermission(TENANT_PERMISSIONS.FEATURE_FLAGS_MANAGE)
  async setTenantFeatureFlag(
    @Param('slug') slug: string,
    @Param('key') key: string,
    @Body() body: SetFeatureFlagRequestDto,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<FeatureFlagResponseDto> {
    try {
      const featureFlag = await this.setTenantFeatureFlagUseCase.execute({
        tenantSlug: tenantAccess?.tenantSlug ?? slug,
        key,
        enabled: body.enabled,
      });

      return toFeatureFlagResponseDto(featureFlag);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }
}
