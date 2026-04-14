import { IsString, IsUUID, Matches, MinLength } from 'class-validator';

export class CreateTenantRequestDto {
  @IsString()
  @MinLength(2)
  name!: string;

  @IsString()
  @Matches(/^[a-z0-9-]+$/)
  slug!: string;

  @IsUUID()
  ownerUserId!: string;
}
