import {
  IsDateString,
  IsIn,
  IsOptional,
  IsString,
  Length,
  MinLength,
} from 'class-validator';
import { InvoiceStatus } from '@saas-platform/invoicing-domain';

const INVOICE_STATUSES: InvoiceStatus[] = ['draft', 'issued', 'paid', 'void'];

export class CreateInvoiceRequestDto {
  @IsString()
  @MinLength(1)
  customerId!: string;

  @IsString()
  @MinLength(1)
  number!: string;

  @IsString()
  @Length(3, 3)
  currency!: string;

  @IsOptional()
  @IsIn(INVOICE_STATUSES)
  status?: InvoiceStatus;

  @IsOptional()
  @IsDateString()
  issuedAt?: string;

  @IsOptional()
  @IsDateString()
  dueAt?: string | null;

  @IsOptional()
  @IsString()
  @MinLength(1)
  notes?: string | null;
}
