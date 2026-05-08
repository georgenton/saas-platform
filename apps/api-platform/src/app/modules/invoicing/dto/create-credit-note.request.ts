import { IsDateString, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateCreditNoteRequestDto {
  @IsString()
  @MinLength(1)
  sourceInvoiceId!: string;

  @IsString()
  @MinLength(1)
  reason!: string;

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
