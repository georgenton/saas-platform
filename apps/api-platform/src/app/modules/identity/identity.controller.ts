import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { RegisterUserUseCase } from '@saas-platform/identity-application';
import {
  UserResponseDto,
  toUserResponseDto,
} from './dto/user.response';
import { RegisterUserRequestDto } from './dto/register-user.request';

@Controller('identity/users')
export class IdentityController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async registerUser(
    @Body() body: RegisterUserRequestDto,
  ): Promise<UserResponseDto> {
    const user = await this.registerUserUseCase.execute({
      email: body.email,
      authProvider: body.authProvider,
      name: body.name ?? null,
      avatarUrl: body.avatarUrl ?? null,
      externalAuthId: body.externalAuthId ?? null,
    });

    return toUserResponseDto(user);
  }
}
