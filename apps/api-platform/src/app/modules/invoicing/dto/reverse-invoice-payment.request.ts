import { IsOptional, IsString, MaxLength } from 'class-validator';

export class ReverseInvoicePaymentRequestDto {
  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string;
}
