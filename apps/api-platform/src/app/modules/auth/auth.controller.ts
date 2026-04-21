import {
  Controller,
  Get,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ListUserTenanciesUseCase } from '@saas-platform/tenancy-application';
import { AuthenticatedUser } from './authenticated-user.decorator';
import { AuthenticatedUserContext } from './authenticated-user-context';
import { JwtAuthenticationGuard } from './jwt-authentication.guard';
import {
  AuthenticatedUserResponse,
  toAuthenticatedUserResponse,
} from './dto/authenticated-user.response';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly listUserTenanciesUseCase: ListUserTenanciesUseCase,
  ) {}

  @Get('me')
  @UseGuards(JwtAuthenticationGuard)
  async getAuthenticatedUser(
    @AuthenticatedUser() authenticatedUser: AuthenticatedUserContext | undefined,
  ): Promise<AuthenticatedUserResponse> {
    if (!authenticatedUser) {
      throw new UnauthorizedException('Authenticated user context is required.');
    }

    const tenancies = await this.listUserTenanciesUseCase.execute(
      authenticatedUser.id,
    );

    return toAuthenticatedUserResponse(authenticatedUser, tenancies);
  }
}
