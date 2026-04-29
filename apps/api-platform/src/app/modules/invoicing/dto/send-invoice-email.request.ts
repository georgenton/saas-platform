import { IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';

export class SendInvoiceEmailRequestDto {
  @IsOptional()
  @IsEmail()
  recipientEmail?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  message?: string;
}
