import { IsIn } from 'class-validator';
import { InvoiceStatus } from '@saas-platform/invoicing-domain';

const TRANSITIONABLE_INVOICE_STATUSES: InvoiceStatus[] = [
  'issued',
  'paid',
  'void',
];

export class UpdateInvoiceStatusRequestDto {
  @IsIn(TRANSITIONABLE_INVOICE_STATUSES)
  status!: InvoiceStatus;
}
