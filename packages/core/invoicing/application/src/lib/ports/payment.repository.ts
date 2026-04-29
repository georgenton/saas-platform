import { Payment } from '@saas-platform/invoicing-domain';

export interface PaymentRepository {
  save(payment: Payment): Promise<void>;
  findByTenantIdAndInvoiceId(tenantId: string, invoiceId: string): Promise<Payment[]>;
}
