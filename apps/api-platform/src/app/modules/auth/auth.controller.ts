import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthenticatedUser } from './authenticated-user.decorator';
import { JwtAuthenticationGuard } from './jwt-authentication.guard';
import {
  AuthenticatedUserResponseDto,
  toAuthenticatedUserResponseDto,
} from './dto/authenticated-user.response';
import { AuthenticatedUserContext } from './authenticated-user-context';

@Controller('auth')
export class AuthController {
  @Get('me')
  @UseGuards(JwtAuthenticationGuard)
  getAuthenticatedUser(
    @AuthenticatedUser() authenticatedUser: AuthenticatedUserContext,
  ): AuthenticatedUserResponseDto {
    return toAuthenticatedUserResponseDto(authenticatedUser);
  }
}
