import {
  Body,
  ConflictException,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  CreateTenantUseCase,
  GetTenantBySlugUseCase,
  GetTenantMembershipByUserUseCase,
  ListTenantMembershipsUseCase,
  MembershipNotFoundError,
  TenantNotFoundError,
  TenantSlugAlreadyInUseError,
} from '@saas-platform/tenancy-application';
import { CreateTenantRequestDto } from './dto/create-tenant.request';
import {
  MembershipResponseDto,
  toMembershipResponseDto,
} from './dto/membership.response';
import { RequireTenantRole } from './require-tenant-role.decorator';
import { TenantAccess } from './tenant-access.decorator';
import { TenantMembershipGuard } from './tenant-membership.guard';
import { TenantRoleGuard } from './tenant-role.guard';
import {
  TenantResponseDto,
  toTenantResponseDto,
} from './dto/tenant.response';

@Controller('tenancy/tenants')
export class TenancyController {
  constructor(
    private readonly getTenantBySlugUseCase: GetTenantBySlugUseCase,
    private readonly getTenantMembershipByUserUseCase: GetTenantMembershipByUserUseCase,
    private readonly listTenantMembershipsUseCase: ListTenantMembershipsUseCase,
    private readonly createTenantUseCase: CreateTenantUseCase,
  ) {}

  @Get(':slug')
  @UseGuards(TenantMembershipGuard)
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
  @UseGuards(TenantMembershipGuard, TenantRoleGuard)
  @RequireTenantRole('owner')
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

  @Get(':slug/memberships/:userId')
  @UseGuards(TenantMembershipGuard, TenantRoleGuard)
  @RequireTenantRole('owner')
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
