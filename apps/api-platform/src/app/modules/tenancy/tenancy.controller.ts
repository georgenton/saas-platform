import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import {
  CreateTenantUseCase,
  TenantSlugAlreadyInUseError,
} from '@saas-platform/tenancy-application';
import { CreateTenantRequestDto } from './dto/create-tenant.request';
import {
  TenantResponseDto,
  toTenantResponseDto,
} from './dto/tenant.response';

@Controller('tenancy/tenants')
export class TenancyController {
  constructor(
    private readonly createTenantUseCase: CreateTenantUseCase,
  ) {}

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
