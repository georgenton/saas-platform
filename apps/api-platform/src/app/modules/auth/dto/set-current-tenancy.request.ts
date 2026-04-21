import { IsOptional, IsString, MinLength } from 'class-validator';

export class SetCurrentTenancyRequestDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  tenantSlug?: string | null;
}
