import {
  Delete,
  Body,
  ConflictException,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthenticatedUser } from '../auth/authenticated-user.decorator';
import { AuthenticatedUserContext } from '../auth/authenticated-user-context';
import { JwtAuthenticationGuard } from '../auth/jwt-authentication.guard';
import {
  AcceptTenantInvitationUseCase,
  CancelTenantInvitationUseCase,
  GetTenantInvitationByIdUseCase,
  InvitationAlreadyExistsError,
  InvitationAlreadyProcessedError,
  InvitationEmailMismatchError,
  InvitationExpiredError,
  InvitationNotFoundError,
  InviteUserToTenantUseCase,
  ListTenantInvitationsUseCase,
  MembershipAlreadyExistsError,
  MembershipNotFoundError,
  ResendTenantInvitationUseCase,
  TENANT_PERMISSIONS,
  TenantAccessContext,
  TenantNotFoundError,
} from '@saas-platform/tenancy-application';
import { InviteUserRequestDto } from './dto/invite-user.request';
import {
  InvitationResponseDto,
  toInvitationResponseDto,
} from './dto/invitation.response';
import {
  MembershipResponseDto,
  toMembershipResponseDto,
} from './dto/membership.response';
import { RequireTenantPermission } from './require-tenant-permission.decorator';
import { TenantAccess } from './tenant-access.decorator';
import { TenantMembershipGuard } from './tenant-membership.guard';
import { TenantPermissionGuard } from './tenant-permission.guard';

@Controller('tenancy')
export class TenancyInvitationsController {
  constructor(
    private readonly cancelTenantInvitationUseCase: CancelTenantInvitationUseCase,
    private readonly getTenantInvitationByIdUseCase: GetTenantInvitationByIdUseCase,
    private readonly inviteUserToTenantUseCase: InviteUserToTenantUseCase,
    private readonly listTenantInvitationsUseCase: ListTenantInvitationsUseCase,
    private readonly resendTenantInvitationUseCase: ResendTenantInvitationUseCase,
    private readonly acceptTenantInvitationUseCase: AcceptTenantInvitationUseCase,
  ) {}

  @Get('tenants/:slug/invitations')
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  @RequireTenantPermission(TENANT_PERMISSIONS.INVITATIONS_MANAGE)
  async listInvitations(
    @Param('slug') slug: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<InvitationResponseDto[]> {
    try {
      const invitations = await this.listTenantInvitationsUseCase.execute(
        tenantAccess?.tenantSlug ?? slug,
      );

      return invitations.map((invitation) => toInvitationResponseDto(invitation));
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get('tenants/:slug/invitations/:invitationId')
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  @RequireTenantPermission(TENANT_PERMISSIONS.INVITATIONS_MANAGE)
  async getInvitation(
    @Param('slug') slug: string,
    @Param('invitationId') invitationId: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<InvitationResponseDto> {
    try {
      const invitation = await this.getTenantInvitationByIdUseCase.execute({
        tenantSlug: tenantAccess?.tenantSlug ?? slug,
        invitationId,
      });

      return toInvitationResponseDto(invitation);
    } catch (error) {
      if (
        error instanceof TenantNotFoundError ||
        error instanceof InvitationNotFoundError
      ) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Post('tenants/:slug/invitations')
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  @RequireTenantPermission(TENANT_PERMISSIONS.INVITATIONS_MANAGE)
  async inviteUser(
    @Param('slug') slug: string,
    @Body() body: InviteUserRequestDto,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<InvitationResponseDto> {
    try {
      const invitation = await this.inviteUserToTenantUseCase.execute({
        tenantSlug: tenantAccess?.tenantSlug ?? slug,
        email: body.email,
        invitedByUserId: tenantAccess?.userId ?? '',
      });

      return toInvitationResponseDto(invitation);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      if (error instanceof InvitationAlreadyExistsError) {
        throw new ConflictException(error.message);
      }

      throw error;
    }
  }

  @Post('tenants/:slug/invitations/:invitationId/resend')
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  @RequireTenantPermission(TENANT_PERMISSIONS.INVITATIONS_MANAGE)
  async resendInvitation(
    @Param('slug') slug: string,
    @Param('invitationId') invitationId: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<InvitationResponseDto> {
    try {
      const invitation = await this.resendTenantInvitationUseCase.execute({
        tenantSlug: tenantAccess?.tenantSlug ?? slug,
        invitationId,
      });

      return toInvitationResponseDto(invitation);
    } catch (error) {
      if (
        error instanceof TenantNotFoundError ||
        error instanceof InvitationNotFoundError
      ) {
        throw new NotFoundException(error.message);
      }

      if (error instanceof InvitationAlreadyProcessedError) {
        throw new ConflictException(error.message);
      }

      throw error;
    }
  }

  @Delete('tenants/:slug/invitations/:invitationId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  @RequireTenantPermission(TENANT_PERMISSIONS.INVITATIONS_MANAGE)
  async cancelInvitation(
    @Param('slug') slug: string,
    @Param('invitationId') invitationId: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<void> {
    try {
      await this.cancelTenantInvitationUseCase.execute({
        tenantSlug: tenantAccess?.tenantSlug ?? slug,
        invitationId,
      });
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      if (error instanceof InvitationNotFoundError) {
        throw new NotFoundException(error.message);
      }

      if (error instanceof InvitationAlreadyProcessedError) {
        throw new ConflictException(error.message);
      }

      throw error;
    }
  }

  @Post('invitations/:invitationId/accept')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthenticationGuard)
  async acceptInvitation(
    @Param('invitationId') invitationId: string,
    @AuthenticatedUser() authenticatedUser: AuthenticatedUserContext | undefined,
  ): Promise<MembershipResponseDto> {
    if (!authenticatedUser?.email) {
      throw new ForbiddenException(
        'Authenticated user email is required to accept invitations.',
      );
    }

    try {
      const membership = await this.acceptTenantInvitationUseCase.execute({
        invitationId,
        authenticatedUserId: authenticatedUser.id,
        authenticatedUserEmail: authenticatedUser.email,
      });

      return toMembershipResponseDto(membership);
    } catch (error) {
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
}
