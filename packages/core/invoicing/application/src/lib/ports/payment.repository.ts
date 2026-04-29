import { Payment } from '@saas-platform/invoicing-domain';

export interface PaymentRepository {
  save(payment: Payment): Promise<void>;
  findByTenantIdAndId(tenantId: string, paymentId: string): Promise<Payment | null>;
  findByTenantIdAndInvoiceId(tenantId: string, invoiceId: string): Promise<Payment[]>;
}
