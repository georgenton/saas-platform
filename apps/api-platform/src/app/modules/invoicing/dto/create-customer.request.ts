import { IsEmail, IsIn, IsOptional, IsString, MinLength } from 'class-validator';

const BUYER_IDENTIFICATION_TYPES = ['04', '05', '06', '07', '08'] as const;

export class CreateCustomerRequestDto {
  @IsString()
  @MinLength(2)
  name!: string;

  @IsOptional()
  @IsEmail()
  email?: string | null;

  @IsOptional()
  @IsString()
  @MinLength(1)
  taxId?: string | null;

  @IsOptional()
  @IsIn(BUYER_IDENTIFICATION_TYPES)
  identificationType?: (typeof BUYER_IDENTIFICATION_TYPES)[number] | null;

  @IsOptional()
  @IsString()
  @MinLength(1)
  identification?: string | null;

  @IsOptional()
  @IsString()
  @MinLength(1)
  billingAddress?: string | null;
}
