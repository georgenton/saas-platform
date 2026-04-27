import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

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
}
