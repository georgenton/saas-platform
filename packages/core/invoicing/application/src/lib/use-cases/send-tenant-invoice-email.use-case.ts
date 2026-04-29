import { TenantNotFoundError, TenantRepository } from '@saas-platform/tenancy-application';
import { CustomerEmailMissingError } from '../errors/customer-email-missing.error';
import { CustomerNotFoundError } from '../errors/customer-not-found.error';
import { InvoiceNotFoundError } from '../errors/invoice-not-found.error';
import { CustomerRepository } from '../ports/customer.repository';
import { InvoiceItemRepository } from '../ports/invoice-item.repository';
import { InvoiceNotificationSender } from '../ports/invoice-notification.sender';
import { InvoiceRepository } from '../ports/invoice.repository';
import {
  buildInvoiceDocumentView,
  renderInvoiceDocumentHtml,
} from '../types/invoice-view';

export interface SendTenantInvoiceEmailInput {
  tenantSlug: string;
  invoiceId: string;
  recipientEmail?: string | null;
  message?: string | null;
}

export class SendTenantInvoiceEmailUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly customerRepository: CustomerRepository,
    private readonly invoiceRepository: InvoiceRepository,
    private readonly invoiceItemRepository: InvoiceItemRepository,
    private readonly invoiceNotificationSender: InvoiceNotificationSender,
  ) {}

  async execute(input: SendTenantInvoiceEmailInput): Promise<void> {
    const tenant = await this.tenantRepository.findBySlug(input.tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(input.tenantSlug);
    }

    const invoice = await this.invoiceRepository.findByTenantIdAndId(
      tenant.id,
      input.invoiceId,
    );

    if (!invoice) {
      throw new InvoiceNotFoundError(input.tenantSlug, input.invoiceId);
    }

    const customer = await this.customerRepository.findByTenantIdAndId(
      tenant.id,
      invoice.customerId,
    );

    if (!customer) {
      throw new CustomerNotFoundError(input.tenantSlug, invoice.customerId);
    }

    const recipientEmail = input.recipientEmail?.trim() || customer.email;

    if (!recipientEmail) {
      throw new CustomerEmailMissingError(input.tenantSlug, customer.id);
    }

    const items = await this.invoiceItemRepository.findByTenantIdAndInvoiceId(
      tenant.id,
      invoice.id,
    );

    const document = buildInvoiceDocumentView({
      tenant: {
        id: tenant.id,
        name: tenant.name,
        slug: tenant.slug,
      },
      customer,
      invoice,
      items,
    });

    const html = renderInvoiceDocumentHtml(document);
    const message = input.message?.trim() || null;
    const escapedMessage = message
      ? message
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#39;')
      : null;
    const textLines = [
      `Invoice ${invoice.number} from ${tenant.name}.`,
      `Customer: ${customer.name}.`,
      `Total: ${(document.totals.totalInCents / 100).toFixed(2)} ${invoice.currency}.`,
    ];

    if (message) {
      textLines.push('', message);
    }

    await this.invoiceNotificationSender.sendInvoiceEmail({
      recipientEmail,
      subject: `Invoice ${invoice.number} from ${tenant.name}`,
      text: textLines.join('\n'),
      html: escapedMessage
        ? `${html}\n<div style="margin-top:24px;padding:16px;border:1px solid #d7c7b6;border-radius:12px;background:#fffaf4;"><strong>Message</strong><p style="margin-top:8px;">${escapedMessage}</p></div>`
        : html,
    });
  }
}
