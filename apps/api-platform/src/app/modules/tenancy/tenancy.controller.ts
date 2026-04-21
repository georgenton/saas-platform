import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  AssignMembershipRoleUseCase,
  CreateTenantUseCase,
  GetTenantBySlugUseCase,
  GetTenantMemberAccessUseCase,
  GetTenantMembershipByUserUseCase,
  ListTenantMembershipsUseCase,
  MembershipNotFoundError,
  RemoveMembershipRoleUseCase,
  RoleNotFoundError,
  TENANT_PERMISSIONS,
  TenantNotFoundError,
  TenantSlugAlreadyInUseError,
} from '@saas-platform/tenancy-application';
import { AssignMembershipRoleRequestDto } from './dto/assign-membership-role.request';
import { CreateTenantRequestDto } from './dto/create-tenant.request';
import {
  MemberAccessResponseDto,
  toMemberAccessResponseDto,
} from './dto/member-access.response';
import {
  MembershipResponseDto,
  toMembershipResponseDto,
} from './dto/membership.response';
import { RequireTenantPermission } from './require-tenant-permission.decorator';
import { TenantAccess } from './tenant-access.decorator';
import { TenantMembershipGuard } from './tenant-membership.guard';
import { TenantPermissionGuard } from './tenant-permission.guard';
import {
  TenantResponseDto,
  toTenantResponseDto,
} from './dto/tenant.response';

@Controller('tenancy/tenants')
export class TenancyController {
  constructor(
    private readonly assignMembershipRoleUseCase: AssignMembershipRoleUseCase,
    private readonly getTenantBySlugUseCase: GetTenantBySlugUseCase,
    private readonly getTenantMemberAccessUseCase: GetTenantMemberAccessUseCase,
    private readonly getTenantMembershipByUserUseCase: GetTenantMembershipByUserUseCase,
    private readonly listTenantMembershipsUseCase: ListTenantMembershipsUseCase,
    private readonly removeMembershipRoleUseCase: RemoveMembershipRoleUseCase,
    private readonly createTenantUseCase: CreateTenantUseCase,
  ) {}

  @Get(':slug')
  @UseGuards(TenantMembershipGuard)
  @RequireTenantPermission(TENANT_PERMISSIONS.READ)
  async getTenantBySlug(
    @Param('slug') slug: string,
    @TenantAccess() tenantAccess?: { tenantSlug: string },
  ): Promise<TenantResponseDto> {
    try {
      const tenant = await this.getTenantBySlugUseCase.execute(
        tenantAccess?.tenantSlug ?? slug,
      );

      return toTenantResponseDto(tenant);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/memberships')
  @UseGuards(TenantMembershipGuard, TenantPermissionGuard)
  @RequireTenantPermission(TENANT_PERMISSIONS.MEMBERSHIPS_READ)
  async listTenantMemberships(
    @Param('slug') slug: string,
    @TenantAccess() tenantAccess?: { tenantSlug: string },
  ): Promise<MembershipResponseDto[]> {
    try {
      const memberships = await this.listTenantMembershipsUseCase.execute(
        tenantAccess?.tenantSlug ?? slug,
      );

      return memberships.map((membership) =>
        toMembershipResponseDto(membership),
      );
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/memberships/:userId/access')
  @UseGuards(TenantMembershipGuard, TenantPermissionGuard)
  @RequireTenantPermission(TENANT_PERMISSIONS.MEMBERSHIP_ACCESS_READ)
  async getTenantMemberAccess(
    @Param('slug') slug: string,
    @Param('userId') userId: string,
    @TenantAccess() tenantAccess?: { tenantSlug: string },
  ): Promise<MemberAccessResponseDto> {
    try {
      const access = await this.getTenantMemberAccessUseCase.execute({
        tenantSlug: tenantAccess?.tenantSlug ?? slug,
        userId,
      });

      return toMemberAccessResponseDto(access);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      if (error instanceof MembershipNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/memberships/:userId')
  @UseGuards(TenantMembershipGuard, TenantPermissionGuard)
  @RequireTenantPermission(TENANT_PERMISSIONS.MEMBERSHIPS_READ)
  async getTenantMembershipByUser(
    @Param('slug') slug: string,
    @Param('userId') userId: string,
    @TenantAccess() tenantAccess?: { tenantSlug: string },
  ): Promise<MembershipResponseDto> {
    try {
      const membership = await this.getTenantMembershipByUserUseCase.execute({
        tenantSlug: tenantAccess?.tenantSlug ?? slug,
        userId,
      });

      return toMembershipResponseDto(membership);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      if (error instanceof MembershipNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Post(':slug/memberships/:userId/roles')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(TenantMembershipGuard, TenantPermissionGuard)
  @RequireTenantPermission(TENANT_PERMISSIONS.MEMBERSHIP_ROLES_MANAGE)
  async assignMembershipRole(
    @Param('slug') slug: string,
    @Param('userId') userId: string,
    @Body() body: AssignMembershipRoleRequestDto,
    @TenantAccess() tenantAccess?: { tenantSlug: string },
  ): Promise<void> {
    try {
      await this.assignMembershipRoleUseCase.execute({
        tenantSlug: tenantAccess?.tenantSlug ?? slug,
        userId,
        roleKey: body.roleKey,
      });
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      if (error instanceof MembershipNotFoundError) {
        throw new NotFoundException(error.message);
      }

      if (error instanceof RoleNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Delete(':slug/memberships/:userId/roles/:roleKey')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(TenantMembershipGuard, TenantPermissionGuard)
  @RequireTenantPermission(TENANT_PERMISSIONS.MEMBERSHIP_ROLES_MANAGE)
  async removeMembershipRole(
    @Param('slug') slug: string,
    @Param('userId') userId: string,
    @Param('roleKey') roleKey: string,
    @TenantAccess() tenantAccess?: { tenantSlug: string },
  ): Promise<void> {
    try {
      await this.removeMembershipRoleUseCase.execute({
        tenantSlug: tenantAccess?.tenantSlug ?? slug,
        userId,
        roleKey,
      });
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      if (error instanceof MembershipNotFoundError) {
        throw new NotFoundException(error.message);
      }

      if (error instanceof RoleNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createTenant(
    @Body() body: CreateTenantRequestDto,
  ): Promise<TenantResponseDto> {
    try {
      const tenant = await this.createTenantUseCase.execute({
        name: body.name,
        slug: body.slug,
        ownerUserId: body.ownerUserId,
      });

      return toTenantResponseDto(tenant);
    } catch (error) {
      if (error instanceof TenantSlugAlreadyInUseError) {
        throw new ConflictException(error.message);
      }

      throw error;
    }
  }
}
