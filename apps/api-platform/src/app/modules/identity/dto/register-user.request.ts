import { AuthProvider } from '@saas-platform/identity-domain';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
  MinLength,
} from 'class-validator';

export class RegisterUserRequestDto {
  @IsEmail()
  email!: string;

  @IsEnum(AuthProvider)
  authProvider!: AuthProvider;

  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string | null;

  @IsOptional()
  @IsUrl()
  avatarUrl?: string | null;

  @IsOptional()
  @IsString()
  @MinLength(1)
  externalAuthId?: string | null;
}
