import {
  Controller,
  Get,
  NotFoundException,
  Query,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthenticatedUser } from './authenticated-user.decorator';
import { AuthenticatedUserContext } from './authenticated-user-context';
import { AuthenticatedSessionTenantNotFoundError } from './authenticated-session-tenant-not-found.error';
import { JwtAuthenticationGuard } from './jwt-authentication.guard';
import { ResolveAuthenticatedSessionUseCase } from './resolve-authenticated-session.use-case';
import {
  AuthenticatedUserResponse,
  toAuthenticatedUserResponse,
} from './dto/authenticated-user.response';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly resolveAuthenticatedSessionUseCase: ResolveAuthenticatedSessionUseCase,
  ) {}

  @Get('me')
  @UseGuards(JwtAuthenticationGuard)
  async getAuthenticatedUser(
    @AuthenticatedUser() authenticatedUser: AuthenticatedUserContext | undefined,
    @Query('tenantSlug') tenantSlug?: string,
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
