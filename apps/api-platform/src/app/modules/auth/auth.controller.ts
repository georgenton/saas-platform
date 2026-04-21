import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Put,
  Query,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { UserNotFoundError } from '@saas-platform/identity-application';
import { AuthenticatedUser } from './authenticated-user.decorator';
import { AuthenticatedUserContext } from './authenticated-user-context';
import { AuthenticatedSessionTenantNotFoundError } from './authenticated-session-tenant-not-found.error';
import { JwtAuthenticationGuard } from './jwt-authentication.guard';
import { PersistAuthenticatedSessionTenancyPreferenceUseCase } from './persist-authenticated-session-tenancy-preference.use-case';
import { ResolveAuthenticatedSessionUseCase } from './resolve-authenticated-session.use-case';
import {
  AuthenticatedUserResponse,
  toAuthenticatedUserResponse,
} from './dto/authenticated-user.response';
import { SetCurrentTenancyRequestDto } from './dto/set-current-tenancy.request';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly persistAuthenticatedSessionTenancyPreferenceUseCase: PersistAuthenticatedSessionTenancyPreferenceUseCase,
    private readonly resolveAuthenticatedSessionUseCase: ResolveAuthenticatedSessionUseCase,
  ) {}

  @Get('me')
  @UseGuards(JwtAuthenticationGuard)
  async getAuthenticatedUser(
    @AuthenticatedUser() authenticatedUser: AuthenticatedUserContext | undefined,
    @Query('tenantSlug') tenantSlug?: string,
  ): Promise<AuthenticatedUserResponse> {
    return this.resolveSession(authenticatedUser, tenantSlug);
  }

  @Put('me/current-tenancy')
  @UseGuards(JwtAuthenticationGuard)
  async setCurrentTenancy(
    @AuthenticatedUser() authenticatedUser: AuthenticatedUserContext | undefined,
    @Body() body: SetCurrentTenancyRequestDto,
  ): Promise<AuthenticatedUserResponse> {
    if (!authenticatedUser) {
      throw new UnauthorizedException('Authenticated user context is required.');
    }

    try {
      await this.persistAuthenticatedSessionTenancyPreferenceUseCase.execute({
        authenticatedUserId: authenticatedUser.id,
        tenantSlug: body.tenantSlug ?? null,
      });

      return this.resolveSession(authenticatedUser, body.tenantSlug ?? undefined);
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        throw new NotFoundException(error.message);
      }

      if (error instanceof AuthenticatedSessionTenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  private async resolveSession(
    authenticatedUser: AuthenticatedUserContext | undefined,
    tenantSlug?: string,
  ): Promise<AuthenticatedUserResponse> {
    if (!authenticatedUser) {
      throw new UnauthorizedException('Authenticated user context is required.');
    }

    try {
      const session = await this.resolveAuthenticatedSessionUseCase.execute({
        authenticatedUser,
        tenantSlug,
      });

      return toAuthenticatedUserResponse(session);
    } catch (error) {
      if (error instanceof AuthenticatedSessionTenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }
}
