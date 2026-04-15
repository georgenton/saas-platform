import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import {
  GetUserByIdUseCase,
  RegisterUserUseCase,
  UserNotFoundError,
} from '@saas-platform/identity-application';
import {
  UserResponseDto,
  toUserResponseDto,
} from './dto/user.response';
import { RegisterUserRequestDto } from './dto/register-user.request';

@Controller('identity/users')
export class IdentityController {
  constructor(
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
    private readonly registerUserUseCase: RegisterUserUseCase,
  ) {}

  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<UserResponseDto> {
    try {
      const user = await this.getUserByIdUseCase.execute(id);

      return toUserResponseDto(user);
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

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
