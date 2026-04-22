import {
  ConflictException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { UserNotFoundError } from '@saas-platform/identity-application';
import {
  InvitationAlreadyProcessedError,
  InvitationEmailMismatchError,
  InvitationExpiredError,
  InvitationNotFoundError,
  MembershipAlreadyExistsError,
  MembershipNotFoundError,
  GetAuthenticatedUserInvitationUseCase,
} from '@saas-platform/tenancy-application';
import { AcceptAuthenticatedUserInvitationUseCase } from './accept-authenticated-user-invitation.use-case';
import { AuthenticatedUser } from './authenticated-user.decorator';
import { AuthenticatedUserContext } from './authenticated-user-context';
import { AuthenticatedSessionTenantNotFoundError } from './authenticated-session-tenant-not-found.error';
import { JwtAuthenticationGuard } from './jwt-authentication.guard';
import { PersistAuthenticatedSessionTenancyPreferenceUseCase } from './persist-authenticated-session-tenancy-preference.use-case';
import { ResolveAuthenticatedSessionUseCase } from './resolve-authenticated-session.use-case';
import {
  AuthenticatedInvitationResponse,
  toAuthenticatedInvitationResponse,
} from './dto/authenticated-invitation.response';
import {
  AuthenticatedUserResponse,
  toAuthenticatedUserResponse,
} from './dto/authenticated-user.response';
import { SetCurrentTenancyRequestDto } from './dto/set-current-tenancy.request';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly acceptAuthenticatedUserInvitationUseCase: AcceptAuthenticatedUserInvitationUseCase,
    private readonly getAuthenticatedUserInvitationUseCase: GetAuthenticatedUserInvitationUseCase,
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

  @Post('invitations/:invitationId/accept')
  @UseGuards(JwtAuthenticationGuard)
  async acceptInvitation(
    @Param('invitationId') invitationId: string,
    @AuthenticatedUser() authenticatedUser: AuthenticatedUserContext | undefined,
  ): Promise<AuthenticatedUserResponse> {
    if (!authenticatedUser) {
      throw new UnauthorizedException('Authenticated user context is required.');
    }

    if (!authenticatedUser.email) {
      throw new UnauthorizedException(
        'Authenticated user email is required to accept invitations.',
      );
    }

    try {
      const session = await this.acceptAuthenticatedUserInvitationUseCase.execute(
        {
          invitationId,
          authenticatedUser,
        },
      );

      return toAuthenticatedUserResponse(session);
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        throw new NotFoundException(error.message);
      }

      if (error instanceof InvitationNotFoundError) {
        throw new NotFoundException(error.message);
      }

      if (
        error instanceof InvitationAlreadyProcessedError ||
        error instanceof InvitationEmailMismatchError ||
        error instanceof InvitationExpiredError ||
        error instanceof MembershipAlreadyExistsError ||
        error instanceof MembershipNotFoundError
      ) {
        throw new ConflictException(error.message);
      }

      throw error;
    }
  }

  @Get('invitations/:invitationId')
  @UseGuards(JwtAuthenticationGuard)
  async getInvitation(
    @Param('invitationId') invitationId: string,
    @AuthenticatedUser() authenticatedUser: AuthenticatedUserContext | undefined,
  ): Promise<AuthenticatedInvitationResponse> {
    if (!authenticatedUser) {
      throw new UnauthorizedException('Authenticated user context is required.');
    }

    if (!authenticatedUser.email) {
      throw new UnauthorizedException(
        'Authenticated user email is required to inspect invitations.',
      );
    }

    try {
      const invitation = await this.getAuthenticatedUserInvitationUseCase.execute(
        {
          invitationId,
          authenticatedUserEmail: authenticatedUser.email,
        },
      );

      return toAuthenticatedInvitationResponse(invitation);
    } catch (error) {
      if (error instanceof InvitationNotFoundError) {
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
