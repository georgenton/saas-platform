import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateEcommerceOrderCustomerProfileRequestDto {
  @IsOptional()
  @IsString()
  @MaxLength(160)
  fullName?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(160)
  email?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  whatsappPhone?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  billingIntent?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(160)
  buyerCompany?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  buyerTaxIdOrDocument?: string | null;
}
