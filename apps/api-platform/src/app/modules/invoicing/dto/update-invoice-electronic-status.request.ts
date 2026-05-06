import { IsDateString, IsIn, IsOptional, IsString, MinLength } from 'class-validator';
import { InvoiceElectronicStatus } from '@saas-platform/invoicing-domain';

const ELECTRONIC_INVOICE_STATUSES: InvoiceElectronicStatus[] = [
  'pending_submission',
  'submitted',
  'authorized',
  'rejected',
];

export class UpdateInvoiceElectronicStatusRequestDto {
  @IsOptional()
  @IsIn(ELECTRONIC_INVOICE_STATUSES)
  electronicStatus?: InvoiceElectronicStatus | null;

  @IsOptional()
  @IsString()
  @MinLength(1)
  accessKey?: string | null;

  @IsOptional()
  @IsString()
  @MinLength(1)
  authorizationNumber?: string | null;

  @IsOptional()
  @IsDateString()
  authorizedAt?: string | null;

  @IsOptional()
  @IsString()
  @MinLength(1)
  electronicStatusMessage?: string | null;
}
