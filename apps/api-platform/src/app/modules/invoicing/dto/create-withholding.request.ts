import {
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class CreateWithholdingRequestDto {
  @IsString()
  @MinLength(1)
  sourceInvoiceId!: string;

  @IsString()
  @MinLength(3)
  reason!: string;

  @IsInt()
  @Min(1)
  amountInCents!: number;

  @IsOptional()
  @IsString()
  @MinLength(1)
  taxRateId?: string | null;

  @IsOptional()
  @IsString()
  @MinLength(1)
  number?: string;

  @IsOptional()
  @IsDateString()
  issuedAt?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  notes?: string | null;
}
