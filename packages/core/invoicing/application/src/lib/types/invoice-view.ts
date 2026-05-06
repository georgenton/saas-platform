import {
  Customer,
  Invoice,
  InvoiceElectronicEvent,
  InvoiceItem,
  IssuerProfile,
  Payment,
} from '@saas-platform/invoicing-domain';

export interface InvoiceTotalsView {
  subtotalInCents: number;
  taxInCents: number;
  totalInCents: number;
}

export interface InvoiceSummaryView {
  invoice: Invoice;
  itemCount: number;
  totals: InvoiceTotalsView;
  settlement: InvoiceSettlementView;
}

export interface InvoiceDetailView {
  invoice: Invoice;
  items: InvoiceItem[];
  payments: Payment[];
  electronicEvents: InvoiceElectronicEvent[];
  totals: InvoiceTotalsView;
  settlement: InvoiceSettlementView;
}

export interface InvoiceSettlementView {
  paidInCents: number;
  balanceDueInCents: number;
  isFullyPaid: boolean;
}

export interface InvoiceDocumentPartyView {
  name: string;
  email: string | null;
  taxId: string | null;
  identificationType: string | null;
  identification: string | null;
  billingAddress: string | null;
}

export interface InvoiceDocumentIssuerView {
  tenantId: string;
  tenantName: string;
  tenantSlug: string;
  legalName: string;
  commercialName: string | null;
  taxId: string | null;
  environment: string | null;
  emissionType: string | null;
  accountingObligated: boolean | null;
  specialTaxpayerCode: string | null;
  rimpeTaxpayerType: string | null;
  matrixAddress: string | null;
  establishmentAddress: string | null;
}

export interface InvoiceDocumentLineView {
  id: string;
  position: number;
  description: string;
  quantity: number;
  unitPriceInCents: number;
  lineSubtotalInCents: number;
  taxRateId: string | null;
  taxRateName: string | null;
  taxRatePercentage: number | null;
  lineTaxInCents: number;
  lineTotalInCents: number;
}

export interface InvoiceDocumentView {
  issuer: InvoiceDocumentIssuerView;
  customer: InvoiceDocumentPartyView;
  invoice: Invoice;
  lines: InvoiceDocumentLineView[];
  totals: InvoiceTotalsView;
}

export function calculateInvoiceTotals(
  items: InvoiceItem[],
): InvoiceTotalsView {
  const subtotalInCents = items.reduce(
    (sum, item) => sum + item.lineTotalInCents,
    0,
  );
  const taxInCents = items.reduce((sum, item) => sum + item.lineTaxInCents, 0);

  return {
    subtotalInCents,
    taxInCents,
    totalInCents: subtotalInCents + taxInCents,
  };
}

export function calculateInvoiceSettlement(
  totalInCents: number,
  payments: Pick<Payment, 'amountInCents' | 'status'>[],
): InvoiceSettlementView {
  const paidInCents = payments
    .filter((payment) => payment.status === 'posted')
    .reduce(
      (sum, payment) => sum + payment.amountInCents,
      0,
    );
  const balanceDueInCents = Math.max(totalInCents - paidInCents, 0);

  return {
    paidInCents,
    balanceDueInCents,
    isFullyPaid: balanceDueInCents === 0 && totalInCents > 0,
  };
}

export function toInvoiceDocumentLines(
  items: InvoiceItem[],
): InvoiceDocumentLineView[] {
  return items.map((item) => ({
    id: item.id,
    position: item.position,
    description: item.description,
    quantity: item.quantity,
    unitPriceInCents: item.unitPriceInCents,
    lineSubtotalInCents: item.lineTotalInCents,
    taxRateId: item.taxRateId,
    taxRateName: item.taxRateName,
    taxRatePercentage: item.taxRatePercentage,
    lineTaxInCents: item.lineTaxInCents,
    lineTotalInCents: item.lineTotalInCents + item.lineTaxInCents,
  }));
}

export function buildInvoiceDocumentView(input: {
  tenant: {
    id: string;
    name: string;
    slug: string;
  };
  issuerProfile?: IssuerProfile | null;
  customer: Customer;
  invoice: Invoice;
  items: InvoiceItem[];
}): InvoiceDocumentView {
  return {
    issuer: {
      tenantId: input.tenant.id,
      tenantName: input.tenant.name,
      tenantSlug: input.tenant.slug,
      legalName: input.issuerProfile?.legalName ?? input.tenant.name,
      commercialName: input.issuerProfile?.commercialName ?? null,
      taxId: input.issuerProfile?.taxId ?? null,
      environment: input.issuerProfile?.environment ?? null,
      emissionType: input.issuerProfile?.emissionType ?? null,
      accountingObligated: input.issuerProfile?.accountingObligated ?? null,
      specialTaxpayerCode: input.issuerProfile?.specialTaxpayerCode ?? null,
      rimpeTaxpayerType: input.issuerProfile?.rimpeTaxpayerType ?? null,
      matrixAddress: input.issuerProfile?.matrixAddress ?? null,
      establishmentAddress: input.issuerProfile?.establishmentAddress ?? null,
    },
    customer: {
      name: input.invoice.buyerName ?? input.customer.name,
      email: input.customer.email,
      taxId: input.invoice.buyerIdentification ?? input.customer.taxId,
      identificationType:
        input.invoice.buyerIdentificationType ?? input.customer.identificationType,
      identification:
        input.invoice.buyerIdentification ?? input.customer.identification,
      billingAddress: input.invoice.buyerAddress ?? input.customer.billingAddress,
    },
    invoice: input.invoice,
    lines: toInvoiceDocumentLines(input.items),
    totals: calculateInvoiceTotals(input.items),
  };
}

export function renderInvoiceDocumentHtml(view: InvoiceDocumentView): string {
  const invoice = view.invoice.toPrimitives();
  const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: invoice.currency,
    maximumFractionDigits: 2,
  });
  const formatMoney = (valueInCents: number): string =>
    currencyFormatter.format(valueInCents / 100);
  const formatDate = (value: Date | null): string =>
    value ? value.toISOString() : 'Not set';
  const escapeHtml = (value: string): string =>
    value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');

  const lineRows = view.lines
    .map(
      (line) => `
        <tr>
          <td>${line.position}</td>
          <td>${escapeHtml(line.description)}</td>
          <td>${line.quantity}</td>
          <td>${formatMoney(line.unitPriceInCents)}</td>
          <td>${line.taxRateName ? `${escapeHtml(line.taxRateName)}${line.taxRatePercentage !== null ? ` (${line.taxRatePercentage}%)` : ''}` : 'None'}</td>
          <td>${formatMoney(line.lineTaxInCents)}</td>
          <td>${formatMoney(line.lineTotalInCents)}</td>
        </tr>
      `,
    )
    .join('');

  return `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Invoice ${escapeHtml(invoice.number)}</title>
    <style>
      body { font-family: Arial, sans-serif; color: #1f1a14; margin: 32px; }
      .header { display: flex; justify-content: space-between; gap: 24px; margin-bottom: 24px; }
      .card { border: 1px solid #d7c7b6; border-radius: 16px; padding: 16px; background: #fffaf4; }
      .grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; margin-bottom: 24px; }
      h1, h2, h3, p { margin: 0; }
      h1 { font-size: 28px; margin-bottom: 8px; }
      .muted { color: #6f6358; font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 6px; }
      table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
      th, td { border-bottom: 1px solid #e4d7c9; padding: 12px 8px; text-align: left; vertical-align: top; }
      th { font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; color: #6f6358; }
      .totals { margin-left: auto; max-width: 320px; display: grid; gap: 8px; }
      .totals-row { display: flex; justify-content: space-between; gap: 16px; }
      .grand-total { font-weight: 700; font-size: 18px; }
      @media print { body { margin: 16px; } .card { break-inside: avoid; } table { break-inside: auto; } }
    </style>
  </head>
  <body>
    <div class="header">
      <div>
        <div class="muted">Invoice document</div>
        <h1>${escapeHtml(invoice.number)}</h1>
        <p>Status: ${escapeHtml(invoice.status)}</p>
      </div>
      <div class="card">
        <div class="muted">Issuer</div>
        <h3>${escapeHtml(view.issuer.legalName)}</h3>
        <p>${escapeHtml(view.issuer.commercialName ?? view.issuer.tenantSlug)}</p>
        <p>${view.issuer.taxId ? `RUC: ${escapeHtml(view.issuer.taxId)}` : 'No tax profile configured'}</p>
      </div>
    </div>
    <div class="grid">
      <div class="card">
        <div class="muted">Issuer fiscal data</div>
        <p>Environment: ${escapeHtml(view.issuer.environment ?? 'not set')}</p>
        <p>Emission type: ${escapeHtml(view.issuer.emissionType ?? 'not set')}</p>
        <p>Matrix address: ${escapeHtml(view.issuer.matrixAddress ?? 'Not set')}</p>
        <p>Establishment address: ${escapeHtml(view.issuer.establishmentAddress ?? 'Not set')}</p>
      </div>
      <div class="card">
        <div class="muted">Customer</div>
        <h3>${escapeHtml(view.customer.name)}</h3>
        <p>${view.customer.email ? escapeHtml(view.customer.email) : 'No email configured'}</p>
        <p>${view.customer.identificationType ? `Tipo ID: ${escapeHtml(view.customer.identificationType)}` : 'Tipo ID no configurado'}</p>
        <p>${view.customer.identification ? escapeHtml(view.customer.identification) : 'No tax ID configured'}</p>
        <p>${view.customer.billingAddress ? escapeHtml(view.customer.billingAddress) : 'Direccion no configurada'}</p>
      </div>
      <div class="card">
        <div class="muted">Dates</div>
        <p>Issued: ${formatDate(invoice.issuedAt)}</p>
        <p>Due: ${formatDate(invoice.dueAt)}</p>
        <p>Currency: ${escapeHtml(invoice.currency)}</p>
        <p>Document code: ${escapeHtml(invoice.documentCode ?? 'Not set')}</p>
        <p>Establishment: ${escapeHtml(invoice.establishmentCode ?? 'Not set')}</p>
        <p>Emission point: ${escapeHtml(invoice.emissionPointCode ?? 'Not set')}</p>
        <p>Sequence: ${invoice.sequenceNumber !== null ? escapeHtml(String(invoice.sequenceNumber)) : 'Not set'}</p>
      </div>
      <div class="card">
        <div class="muted">Electronic authorization</div>
        <p>Status: ${escapeHtml(invoice.electronicStatus ?? 'not set')}</p>
        <p>Access key: ${escapeHtml(invoice.accessKey ?? 'Not set')}</p>
        <p>Authorization: ${escapeHtml(invoice.authorizationNumber ?? 'Not set')}</p>
        <p>Authorized at: ${formatDate(invoice.authorizedAt ?? null)}</p>
        <p>Signed at: ${formatDate(invoice.signedAt ?? null)}</p>
        <p>Submitted at: ${formatDate(invoice.submittedAt ?? null)}</p>
        <p>Submission ref: ${escapeHtml(invoice.submissionReference ?? 'Not set')}</p>
      </div>
    </div>
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Description</th>
          <th>Qty</th>
          <th>Unit price</th>
          <th>Tax</th>
          <th>Tax total</th>
          <th>Line total</th>
        </tr>
      </thead>
      <tbody>
        ${lineRows}
      </tbody>
    </table>
    <div class="totals">
      <div class="totals-row"><span>Subtotal</span><strong>${formatMoney(view.totals.subtotalInCents)}</strong></div>
      <div class="totals-row"><span>Tax</span><strong>${formatMoney(view.totals.taxInCents)}</strong></div>
      <div class="totals-row grand-total"><span>Total</span><span>${formatMoney(view.totals.totalInCents)}</span></div>
    </div>
    ${
      invoice.notes
        ? `<div class="card" style="margin-top:24px;"><div class="muted">Notes</div><p>${escapeHtml(invoice.notes)}</p></div>`
        : ''
    }
  </body>
</html>
  `.trim();
}
