import {
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class CreateInvoicePaymentRequestDto {
  @IsInt()
  @Min(1)
  amountInCents!: number;

  @IsString()
  @MinLength(1)
  method!: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  reference?: string | null;

  @IsOptional()
  @IsDateString()
  paidAt?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  notes?: string | null;
}
